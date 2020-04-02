<template>
  <div class="hello">
      <div v-if="message">
          <div>{{message}}</div>
      </div>


      <input type="file" ref="file" @change="onFileSelected">
      <button @click="uploadFile">Upload</button>

    <div>
        <div class="columns is-multiline">
            <div v-for="object in uploadedFiles" :key="object" class="column is-4">
                <figure class="image">
                    <img :src="object.imagePath" alt="">
                </figure>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
    import axios from 'axios';
export default {
  name: 'imageCrop',
  data(){
      return {
          uploadedImage: "",
          message: "",
          uploadedFiles: []
      }
  },
  methods: {
    onFileSelected(){
      this.uploadedImage = this.$refs.file.files[0];
      this.message = "";
    },
      uploadFile(){
          const fdObject = new FormData();
          fdObject.append('file', this.uploadedImage, this.uploadedImage.name);
            axios.post(
                'http://localhost:3000/images/',
                fdObject)
          .then(res => {
              console.log(res);
              this.message = "Foto erfolgreich hochgeladen!";
              this.file = "";
              this.uploadedFiles.push(res.data);
          })
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
