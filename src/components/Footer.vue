<template>
  <footer><p>Copyright &copy;2018 - <a :href="coinWebpage" target="_blank">{{coinName}} Project</a>. For help please join us at <a :href="discordUrl" target="_blank">Discord</a>. Powered by <a href="https://motionproject.org" target="_blank">Motion Presale Platform</a>.</p></footer>
</template>

<script>
import settings from '@/../settings.json';

export default {
  data() {
    return {
      coinWebpage: settings.coinWebpage,
      coinName: settings.coin.name,
      discordUrl: settings.discordUrl,
    };
  },
};
</script>


<style lang="scss" scoped>
footer {
  height: 30px;
  background-color: #001B38;
  color: #fff;
  text-align: center;
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  a {
    color: #fff;
    text-decoration: underline;
  }
}

@media all and (max-width: 960px) {
  footer {
    position: relative;
    height: auto;
    font-size: 0.7em;
    padding-top: 5px;
    padding-bottom: 5px;
  }
}
</style>
