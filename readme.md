Motion Presale Platform
----------

![Motion Presale Platform](https://firebasestorage.googleapis.com/v0/b/motion-website.appspot.com/o/presale-platform.png?alt=media&token=17c6db0f-e634-4d04-9f09-d10bab5d7313)


# Description

Motion Presale Platform is an open source version of the actual Masternode Presale platform used by MotionProject.

You can customise your Masternode price, collateral amount, coin name and many other things. You can get your Masternode Presale platorm up and running in minutes.

Bitcoin addresses to receive payments for your masternode sales are generated automatically.

# Requirements

- A Firebase Project. You can open your account and project for free [here](https://firebase.com).
- Account in [blockchain.info](https://blockchain.info/)
- Blockchain.info [API Key](https://api.blockchain.info/customer/signup)
- Node.js
- Coin Daemon (example motiond) configured with rpcuser, rpcpassword and running in background.

# Installation

Open the `settings.json` file and fill in the next way:

```
{
  "backendUrl": "", // Maybe it can be your vps IP:Port if you aren't using a reverse proxy.
  "coinWebpage": "", // https://motionproject.org
  "discordUrl": "", // https://discord.gg/VrxddZr
  "databaseUrl": "", // Firebase Database Url
  "blockchaininfo": {
    "xpub": "", // You can get this on your Blockchain.info account -> Settings -> Addresses -> Manage -> More Options -> See xPub
    "apiKey": "" // You need to get one at blockchain.info
  },
  "gmail": {
    "user": "", // Your gmail address
    "password": "", // Your gmail password
    "notificationsEmail": "" // Email to get notifications when you need to change your xPub following blockchain.info recommendations.
  },
  "coin": {
    "name": "Motion", // Your coin Name
    "rpcusername": "", // Your rpcusername
    "rpcpassword": "", // Your rpcpassword
    "rpcport": "" // Your rpcport
  },
  "price": 0.3, // Price of each Masternode, in btc.
  "collateral": 1000, // Collateral amount for each masternode
  "sellAmount": 30, // Masternodes Quantity to sell
  "firebase": { // Firebase configs, you can get them in your firebase project.
    "apiKey": "",
    "authDomain": "",
    "databaseURL": "",
    "projectId": ""
  },
  "presale": {
    "initDateYear": 2018,
    "initDateMonth": 5,
    "initDateDay": 6
  }
}
```

Now you need to download your Service Account Key to manage your Firebase Firestore Database from your app.

First you need to login into your Firebase Account, enter or create a new project. Then in the left menu go to Database and select Firebase Firestore.

Now, go to Settings, Service Accounts and generate a new Private Key (blue button at bottom). You will download a json file, rename it to serviceAccountKey.json and put into /server folder.

Finally, you need to install dependencies:

In the root project folder run `npm install` or `yarn` if you use yarn.

Then, `cd server` and inside this folder install dependencies again: `npm install` or `yarn` if you use yarn.

This project is divided in frontend and backend, what we at Motion did was run server on a vps (`cd server/; node server.js`) and frontend in Firebase hosting (`npm run deploy`, after configuring project for Firebase (`firebase init`).

If you have troubles fell free to ask for help on [Motion Discord](https://discord.gg/bDfwh9t), or open an issue. This readme will be updated with more info and more specific steps.

# Contributing

If you want to contribute to the project, please fork it and when your features are added then please make a pull request.