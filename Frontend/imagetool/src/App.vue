<template>
  <div id="app">
    <h1>Picture Box</h1>
    <imageCrop msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import imageCrop from './components/imageCrop.vue'

export default {
  name: 'App',
  components: {
    imageCrop
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
