<template>
  <header>
    <h1>{{coinName}} Masternode Presale</h1>
  </header>
</template>

<script>
import settings from '@/../settings.json';

export default {
  data() {
    return {
      coinName: settings.coin.name,
    };
  },
};
</script>

<style lang="scss" scoped>
header {
  height: 100px;
  background-color: #001B38;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;

  h1 {
    text-align: center;
    font-weight: lighter;
    font-size: 2em;
    color: #fff;
  }
}

@media all and (max-width: 960px) {
  header h1 {
    font-size: 1.6em;
  }
}
</style>
