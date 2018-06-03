<template>
  <div class="home">
    <div class="counters">
      <Counter :qty="totalOnSale-soldMasterNodes" text="Masternodes left" />
      <Counter :qty="currentPrice + 'btc'" text="Current price" />
      <Counter :qty="countdown" text="Time left to start" />
    </div>

    <div class="main-logo">
      <img src="@/assets/logo.svg" class="logo" />
    </div>

    <div class="buy-button">
      <button type="button" @click="goToSignup">Buy Masternode</button>
      <button type="button" @click="goToLogin">My account</button>
      <button type="button" @click="goToCoinHomepage">About {{coinName}}</button>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase.js';
import Counter from '@/components/Counter.vue';
import settings from '@/../settings.json';

export default {
  name: 'home',
  data() {
    return {
      soldMasterNodes: 0,
      now: null,
      coinName: settings.coin.name,
      totalOnSale: settings.sellAmount,
    };
  },
  components: {
    Counter,
  },
  computed: {
    currentPrice() {
      return settings.price;
    },
    countdown() {
      var countDownDate = new Date(Date.UTC(settings.presale.initDateYear, settings.presale.initDateMonth-1, settings.presale.initDateDay, 0, 0, 0)).getTime();

      // Find the distance between now an the count down date
      var distance = countDownDate - this.now;

      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // If the count down is finished, write some text
      if (distance < 0) {
        return 'Sale is OPEN!'
      }
      
      // Display the result in the element with id="demo"
      return days + "d " + hours + "h "
      + minutes + "m " + seconds + "s ";

    }
  },
  methods: {
    goToLogin() {
      this.$router.push('/login');
    },
    goToSignup() {
      this.$router.push('/signup');
    },
    goToCoinHomepage() {
      window.location.href = settings.coinWebpage;
    },
    getSoldMasternodes() {
      db
      .collection('users')
      .where('status', '==', 'paid')
      .get()
      .then((docs) => {
        this.soldMasterNodes = docs.size;
      });
    }
  },
  mounted() {
    this.getSoldMasternodes();

    window.setInterval(() => {
      this.now = new Date().getTime();
    }, 1000);
  }
};
</script>

<style lang="scss" scoped>
.counters {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-auto-rows: 100px;
  grid-gap: 5%;
  width: 90%;
  margin: 50px auto;
}

.logo-container {
  width: 100%;
  text-align: center;
}

.logo {
  width: 50%;
  margin: 60px auto;
  display: block;
}

.buy-button {
  margin: 0 auto;
  text-align: center;

  button {
    background-color: rgba(0, 27, 56, 0.8);
    height: 100px;
    width: auto;
    padding-left: 50px;
    padding-right: 50px;
    border-radius: 5px;
    border: none;
    color: #fff;
    font-size: 1.6em;
    font-weight: bolder;
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
  }
}

@media all and (max-width: 960px) {
  .counters {
    grid-template-columns: 1fr 1fr;
    grid-row-gap: 20px;
  }

  .buy-button button {
    width: 90%;
    margin: 0 auto 20px;

    &:last-child {
      margin-bottom: 50px;
    }
  }
}
</style>
