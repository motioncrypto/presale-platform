<template>
  <div class="signup-form">
    <div v-if="isReady">
      <form v-on:submit.prevent="signup">
        <p>First, you need to create an account to make easier follow the progress of your buy.</p>
        <div class="form-field">
          <label for="email">Email</label>
          <input type="email" id="email" placeholder="john@doe.com" v-model="email" />
        </div>
        <div class="form-field">
          <label for="password">Password</label>
          <input type="password" id="password" placeholder="password" v-model="password" />
        </div>
        <div class="form-field">
          <label for="passwordAgain">Repeat your password</label>
          <input type="password" id="passwordAgain" placeholder="password (again)" v-model="passwordAgain" />
        </div>
        <div class="form-field">
          <button type="button" @click="signup">Signup</button>
          <button type="button" @click="goToLogin">Go to login page</button>
        </div>
      </form>
    </div>
    <div v-if="!isReady" class="notyet">
      Presale has not started yet.

      <div class="form-field">
        <button type="button" @click="goToHomepage">Go to homepage</button>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase';
import settings from '@/../settings.json';

export default {
  data() {
    return {
      email: '',
      password: '',
      passwordAgain: '',
      start: new Date(Date.UTC(settings.presale.initDateYear, settings.presale.initDateMonth-1, settings.presale.initDateDay, 0, 0, 0)),
    };
  },
  computed: {
    isReady() {
      return (new Date().getTime() > this.start.getTime());
    },
  },
  methods: {
    goToLogin() {
      this.$router.push('/login');
    },
    goToHomepage() {
      this.$router.push('/');
    },
    signup() {
      if(this.password === this.passwordAgain) {
        firebase.auth()
        .createUserWithEmailAndPassword(
          this.email,
          this.password
        ).then(() => {
          this.$router.push('/status');
        }).catch((error) => {
          alert(error.message);
        })
      } else {
        alert('Your passwords don not match');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.signup-form {
  display: flex;
  width: 50%;
  margin: 100px auto;
  justify-content: center;
  align-items: center;
  color: #fff;
}

.notyet {
  button {
    margin-top: 10px;
    text-align: center;
    display: block;
    margin-left: 10px;
  }
}

form {
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
  }
}

@media all and (max-width: 960px) {
  .signup-form {
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
