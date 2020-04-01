<template>
  <div class="hello">
      <input type="file" @change="onFileSelected">
      <button @click="uploadFile"
  </div>
</template>

<script>
export default {
  name: 'imageCrop',
  props: {
    uploadedImage: null
  },
  methods: {
    onFileSelected(event){
      this.uploadedImage = event.target.files[0];
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
