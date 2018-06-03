<template>
  <div id="app">
    <Header />
    <router-view/>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
  components: {
    Header,
    Footer,
  },
}
</script>

<style lang="scss">
@import '~minireset.css/minireset.sass';
@import url('https://fonts.googleapis.com/css?family=Gothic+A1:300,400,700');

html,
body {
  background-color: #5e42a6;
  font-family: 'Gothic A1', sans-serif;
}
</style>
