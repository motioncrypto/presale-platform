<template>
  <div class="login-form">
    <form v-on:submit.prevent="login">
      <p>This section is exclusive to Masternode buyers, if you did, welcome. If you didn't, this is a good moment.</p>
      <div class="form-field">
        <label for="email">Email</label>
        <input type="email" id="email" placeholder="john@doe.com" v-model="email" />
      </div>
      <div class="form-field">
        <label for="password">Password</label>
        <input type="password" id="password" placeholder="password" v-model="password" />
      </div>
      <div class="form-field">
        <button type="button" @click="login">Login</button>
        <button type="button" @click="goToSignup">Buy Masternode</button>
      </div>
    </form>
  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    goToSignup() {
      this.$router.push('/signup');
    },
    login() {
      firebase.auth()
      .signInWithEmailAndPassword(this.email, this.password)
      .then(() => {
        this.$router.push('/status');
      })
      .catch((error) => {
        alert(error.message);
      })
    },
  },
};
</script>

<style lang="scss" scoped>
.login-form {
  display: flex;
  width: 50%;
  margin: 100px auto;
  justify-content: center;
  align-items: center;
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
  .login-form {
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
