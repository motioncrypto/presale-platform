import Vue from 'vue';
import VueFirestore from 'vue-firestore'
import firebase from 'firebase'
import App from './App.vue';
import router from './router';
import './firebase';
// import store from './store';

let app = null

Vue.use(VueFirestore)
Vue.config.productionTip = false;

firebase.auth().onAuthStateChanged((user) => {
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      router,
      render: h => h(App),
    }).$mount('#app');
  }
});
