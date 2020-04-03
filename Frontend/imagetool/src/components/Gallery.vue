<template>
  <div class="hello">
      <div v-if="message">
          <div>{{message}}</div>
      </div>


      <input type="file" ref="file" @change="onFileSelected">
      <button @click="uploadFile">Upload</button>
      <input type="number" ref="number1" min="0" value="0">
      <input type="number" ref="number2" min="0" value="0">
      <button @click="preferedSize">Wunschgröße</button>

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
              this.message = "Foto erfolgreich hochgeladen!";
              this.file = "";
              this.uploadedFiles.push(res.data);
              /*res.data.scaledImages.forEach( it => {
                  this.uploadedFiles.push(it)
              });*/

          })
      },
      preferedSize(){
            axios.post(
                'http://localhost:3000/preferedSize/',
                {
                    name: this.uploadedFiles[0].originalName,
                    path: this.uploadedFiles[0].originalPath,
                    width: parseInt(this.$refs.number1.value),
                    height: parseInt(this.$refs.number2.value)
                }
            ).then(res => {
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
