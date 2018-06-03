const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");
const request = require("request");
const Client = require("bitcoin-core");
const nodemailer = require("nodemailer");
const app = express();

const serviceAccount = require('./serviceAccountKey.json');
const settings = require('../settings.json');

const client = new Client({
  username: settings.coin.rpcusername,
  password: settings.coin.rpcpassword,
  port: settings.coin.rpcport
});

const callbackUrl = encodeURIComponent(
  `${settings.backendUrl}/blockchain-callback`
);

app.use(bodyParser.json());
app.use(cors());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: settings.databaseUrl //Firebase database url
});

const generateBtcAddress = callback => {
  request(
    `https://api.blockchain.info/v2/receive?xpub=${settings.blockchaininfo.xpub}&callback=${callbackUrl}&key=${settings.blockchaininfo.apiKey}`,
    function(error, response, body) {
      return callback(JSON.parse(body));
    }
  );
};

app.post("/generate-address", (req, res) => {
  admin
    .auth()
    .verifyIdToken(req.body.idToken)
    .then(function(decodedToken) {
      var uid = decodedToken.uid;
      // See the UserRecord reference doc for the contents of userRecord.
      admin
        .firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then(user => {
          if (!user.exists) {
            generateBtcAddress(response => {
              admin
                .firestore()
                .collection("users")
                .doc(uid)
                .set(
                  {
                    btcaddress: response.address
                  },
                  { merge: true }
                )
                .then(() => {
                  if (response.index >= 15) {
                    // create reusable transporter object using the default SMTP transport
                    let transporter = nodemailer.createTransport({
                      host: "smtp.gmail.com",
                      port: 465,
                      secure: true, // true for 465, false for other ports
                      auth: {
                        user: settings.gmail.user, // generated ethereal user
                        pass: settings.gmail.password // generated ethereal password
                      }
                    });

                    // setup email data with unicode symbols
                    let mailOptions = {
                      from: `"${settings.coin.name}" <${settings.gmail.user}>`, // sender address
                      to: settings.gmail.notificationsEmail, // list of receivers
                      subject: "BTC Address Limit", // Subject line
                      text: "Replace your btc address", // plain text body
                      html: "<b>Replace your btc address</b>" // html body
                    };

                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, (error, info) => {
                      if (error) {
                        return console.log(error);
                      }
                      console.log("Message sent: %s", info.messageId);
                    });
                  }

                  res.json({
                    status: 0,
                    data: {
                      address: response.address
                    }
                  });
                });
            });
          } else {
            if (user.data().btcaddress) {
              res.json({
                status: 1,
                message: "User already have btc address"
              });
            } else {
              generateBtcAddress(response => {
                admin
                  .firestore()
                  .collection("users")
                  .doc(uid)
                  .set(
                    {
                      btcaddress: response.address
                    },
                    { merge: true }
                  )
                  .then(() => {
                    res.json({
                      status: 0,
                      data: {
                        address: response.address
                      }
                    });
                  });
              });
            }
          }
        })
        .catch(error => {
          console.log(error);
          res.json({
            status: 1,
            message: "user not found"
          });
        });
    })
    .catch(function(error) {
      console.log("Error fetching user data:", error);
      res.json({
        status: 1,
        message: "user not found"
      });
    });
});
app.get("/blockchain-callback", (req, res) => {
  const valueInBtc = parseInt(req.query.value) / 100000000;

  admin
    .firestore()
    .collection("users")
    .where("btcaddress", "==", req.query.address)
    .limit(1)
    .get()
    .then(results => {
      results.forEach(user => {
        if (
          !user.data().blockChainInfo || !user.data().btcTxHashes ||
          user.data().btcTxHashes.indexOf(req.query.transaction_hash) !==
            -1
        ) {
          console.log("New transaction");
          res.send("OK");
          let paid = user.data().paidAmount || 0;
          paid += valueInBtc;

          admin
            .firestore()
            .collection("users")
            .where("status", "==", "paid")
            .get()
            .then(docs => {
              // let mnvalue = 0.3;
              // if (docs.size <= 10) {
              //   mnvalue = 0.3;
              // } else if (docs.size > 10 && docs.size <= 20) {
              //   mnvalue = 0.35;
              // }

              btcTxHashes = user.data().btcTxHashes || [];
              btcTxHashes.push(req.query.transaction_hash);

              if (paid >= settings.price) {
                request(
                  `https://blockchain.info/es/rawaddr/${
                    user.data().btcaddress
                  }`,
                  (error, response, body) => {
                    body = JSON.parse(body);

                    if (parseInt(body.total_received) / 100000000 >= mnvalue) {
                      admin
                        .firestore()
                        .collection("users")
                        .doc(user.id)
                        .update({
                          status: "paid",
                          paidAmount: paid,
                          blockChainInfo: req.query,
                          btcTxHashes,
                        });
                    } else {
                      admin
                        .firestore()
                        .collection("users")
                        .doc(user.id)
                        .update({
                          status: "unpaid",
                          paidAmount: paid,
                          blockChainInfo: req.query,
                          btcTxHashes: btcTxHashes,
                        });
                    }
                  }
                );
              } else {
                admin
                  .firestore()
                  .collection("users")
                  .doc(user.id)
                  .update({
                    paidAmount: paid,
                    blockChainInfo: req.query,
                    btcTxHashes: btcTxHashes,
                  });
              }
            });
        } else {
          console.log("Old one");
          res.send("OK");
        }
      });
    })
    .catch(error => {
      console.log(error);
      res.json(error);
    });
});
app.post("/request-mn", (req, res) => {
  admin
    .auth()
    .verifyIdToken(req.body.idToken)
    .then(function(decodedToken) {
      var uid = decodedToken.uid;
      admin
        .firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then(user => {
          if (user.data().status === "paid" && !user.data().sent) {
            // let sendAmount = 1000;
            // if (
            //   user.data().paidAmount >= 0.425 &&
            //   user.data().paidAmount < 0.5
            // ) {
            //   sendAmount = 2001;
            // }
            // if (user.data().paidAmount >= 0.5) {
            //   sendAmount = 3001;
            // }
            client
              .sendToAddress(
                req.body.mtnaddress,
                settings.collateral,
                `Masternode buy ${user.data.bitcoinaddress}`
              )
              .then(data => {
                admin
                  .firestore()
                  .collection("users")
                  .doc(uid)
                  .update({
                    mtnaddress: req.body.mtnaddress,
                    sent: true,
                    txid: data
                  });

                res.json({
                  status: 0,
                  message: "MN Sent",
                  data: {
                    txid: data
                  }
                });
              });
          } else {
            if (user.data().sent) {
              res.json({
                status: 1,
                message: "MN was sent before"
              });
            } else {
              res.json({
                status: 1,
                message: "User hasn't paid yet"
              });
            }
          }
        });
    })
    .catch(function(error) {
      console.log("error received");
      // Handle error
      console.log(error);
      res.json({
        status: 1,
        data: error
      });
    });
});

app.listen(3001, () =>
  console.log(`${settings.coin.name} Presale API listening on port 3001!`)
);
