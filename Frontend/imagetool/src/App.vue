<template>
  <div id="app">
    <h1>Picture Box</h1>
    <gallery src="/logo.png"/>

  </div>
</template>

<script>
import gallery from './components/Gallery.vue'
//import imageCrop from './components/ImageCrop'

export default {
  name: 'App',
  components: {
    gallery
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
