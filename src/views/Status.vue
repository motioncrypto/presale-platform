<template>
  <div class="status-page">
    <div class="content">
      <div class="text-left">
        <p>Welcome to the early adopters for {{coinName}}'s Smart Contract Blockchain Platform. <br>
        Before you buy your first {{coinName}} MN, please read the information below carefully.</p>
        <p><b>Important Information</b><br>
        In order to get your {{coinName}} Masternode you will need to verify the correct BTC value at the time of purchase.</p>
        <p>Ensure you have downloaded the {{coinName}} Wallet and created a new receiving address. This will be the address where you receive your <b>1000MTN</b> for your masternode. If you want to get the bulk offer just send 0.425btc for 2 MTN MasterNodes or 0.5btc for 3 MTN MasterNodes.</p>
      </div>
      <div class="form-field">
        <label for="btcaddress">Your bitcoin payment address is:</label>
        <input type="text" id="email" placeholder="btc address" v-model="user.btcaddress" readonly />
      </div>
      <div class="form-field">
        <label for="paid">You already paid:</label>
        <input type="text" id="paid" placeholder="0" v-model="user.paidAmount" readonly />
      </div>
      <div class="form-field">
        <label for="pending">Payment pending:</label>
        <input type="text" id="pending" placeholder="0" v-model="pendingBalance" readonly />
      </div>
      <div class="form-field">
        <button type="button" v-bind:class="{ disabled: (user.status !== 'paid') }" @click.prevent="requestMasternode">Request my Masternode</button>
        <button type="button" @click.prevent="logout">Logout</button>
      </div>
    </div>

    <transition name="modal" v-if="showModal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">

            <div class="modal-header">
              <h3>Congratulations</h3>
            </div>

            <div class="modal-body">
              <p>Below paste your new masternode address in the space provided and send through the full amount requested on your screen.</p>
              <p>You will receive {{willReceive}} MasterNode(s).</p>
              <div class="form-field">
                <label for="coin-address">Your {{coinName}} Wallet Address:</label>
                <input type="text" id="coin-address" :placeholder="'your' + coinName + 'address'" v-model="coinaddress" :readonly="this.user.sent"/>
                <div v-if="this.user.sent">
                  <p>Your MN has already sent with txid: {{user.txid}}</p>
                  <p>You can follow your transaction in the coin explorer.</p>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <div class="form-field">
                <button type="button" @click.prevent="requestSendCoin" v-if="!this.user.sent">Send me my Masternode</button>
                <button type="button" @click.prevent="showModal = false">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import firebase from 'firebase';
import { db } from '@/firebase';
import settings from '@/../settings.json';
import axios from 'axios';

export default {
  data() {
    return {
      showModal: false,
      user: {},
      soldMasterNodes: 0,
      coinaddress: '',
      currentPrice: settings.price,
      coinName: settings.coin.name,
    };
  },
  computed: {
    willReceive() {
      if (this.user.paidAmount < settings.price) {
        return 0;
      } else {
        return 1;
      }
    },
    pendingBalance() {
      if (this.currentPrice - this.user.paidAmount <= 0) {
        return `PAID ${this.willReceive} MASTERNODES`
      } else {
        return this.currentPrice - (this.user.paidAmount || 0);
      }
    }
  },
  methods: {
    goToSignup() {
      this.$router.push('/signup');
    },
    requestMasternode() {
      if (this.user.status === 'paid') {
        this.showModal = true;
      } else {
        alert('You still not paid');
      }
    },
    requestSendCoin() {
      if (this.coinaddress && this.user.status === 'paid' && !this.user.sent) {
        firebase.auth().currentUser.getIdToken(true).then((idToken) => {
          axios.post(`${settings.backendUrl}/request-mn`, {
            idToken,
            coinaddress: this.coinaddress,
          }).then((response) => {
            if(response.data.status === 0) {
              this.user.sent = true;
              alert('You should receive your MN soon.');
            }
          })
        }).catch((error) => {
          this.$router.push('/');
        });
      } else {
        if (this.user.sent) {
          alert('MN was sent before');
        } else {
          alert(`Please input your ${settings.coin.name} Wallet Address`);
        }
      }
    },
    getSoldMasternodes() {
      db
      .collection('users')
      .where('status', '==', 'paid')
      .get()
      .then((docs) => {
        this.soldMasterNodes = docs.size;
      });
    },
    logout() {
      firebase.auth().signOut().then(() => {
        this.$router.push('/');
      });
    }
  },
  mounted() {
    this.$binding('user', db.collection('users')
      .doc(firebase.auth().currentUser.uid))
      .then((user) => {
        if (!user.btcaddress) {
          firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
            axios.post(`${settings.backendUrl}/generate-address`, {
              idToken,
            }).then((response) => {
              this.user.btcaddress = response.data.address;
            })
          }).catch(function(error) {
            this.$router.push('/');
          });
        }

        if (user.coinaddress) {
          this.coinaddress = user.coinaddress;
        }
      })
      .catch(() => {
        firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
          axios.post(`${settings.backendUrl}/generate-address`, {
            idToken,
          }).then((response) => {
            this.user.btcaddress = response.data.address;
          })
        }).catch(function(error) {
          this.$router.push('/');
        });
      });

    this.getSoldMasternodes();
  },
};
</script>

<style lang="scss" scoped>
.status-page {
  display: flex;
  width: 50%;
  margin: 100px auto;
  justify-content: center;
  align-items: center;
}

.text-left {
  text-align: left;
  
  p {
    margin-bottom: 10px;
  }

  a {
    color: #fff;
  }
}

.content {
  width: 100%;
  background-color: rgba(0, 27, 56, 0.527);
  padding: 50px;
  width: 100%;
  border-radius: 5px;
  color: #FFF;
  text-align: center;
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 10px;
}

.form-field {
  label {
    width: 100%;
    display: block;
    text-align: left;
    padding-bottom: 5px;
    text-transform: uppercase;
  }

  input {
    width: 100%;
    height: 35px;
    border-radius: 5px;
    border: none;
    margin-bottom: 20px;
    padding-left: 10px;
    padding-right: 10px;
  }

  button {
    background-color: rgba(0, 27, 56, 0.8);
    height: 40px;
    width: auto;
    padding-left: 30px;
    padding-right: 30px;
    border-radius: 5px;
    border: none;
    color: #fff;
    font-size: 1em;
    cursor: pointer;
    transition: all 0.3s;
    margin-right: 30px;

    &:last-child {
      margin-right: 0;
      background-color: rgba(0, 27, 56, 0.6);
    }

    &:hover {
      background-color: rgba(0, 27, 56, 1);
    }

    &.disabled {
      background-color: rgba(0, 27, 56, 0.2);
    }
  }
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 27, 56, 0.5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 50%;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;

  label {
    margin-top: 30px;
  }

  input {
    border: 1px solid rgba(0, 27, 56, 1);
  }
}

.modal-header h3 {
  margin-top: 0;
  color: rgba(0, 27, 56, 1);
  font-size: 1.4em;
  text-transform: uppercase;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

@media all and (max-width: 960px) {
  .status-page {
    width: 90%;
    margin: 50px auto;
  }

  .form-field {
    button {
      width: 100%;
      margin-bottom: 20px;
    }
  }
}
</style>
