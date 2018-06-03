<template>
  <div class="counter">
    <div class="content">
      <h2>{{qty}}</h2>
      <p>{{text}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ['qty', 'text']
};
</script>

<style lang="scss" scoped>
.counter {
  background-color: rgba(0, 27, 56, 0.527);
  height: 100px;
  width: 100%;
  border-radius: 5px;
  color: #FFF;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;

  h2 {
    font-size: 1.6em;
  }

  p {
    font-size: 0.8em;
    font-weight: lighter;
  }
}

@media all and (max-width: 960px) {
  .counter h2 {
    font-size: 1.4em;
  }
}
</style>
