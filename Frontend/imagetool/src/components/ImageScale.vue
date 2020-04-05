<template>
  <div class="hello">

    <v-card min-height="100" width="1000" class="mx-auto"  >
        <div v-if="uploadedImage">
            <v-img :src="uploadedImage" height="125" contain></v-img>
        </div>

        <input type="file" ref="file" @change="uploadFile" style="margin-bottom: 20px">
    </v-card>




      <input type="number" ref="number1" min="0" value="0">
      <button @click="preferedSize">Wunschgröße</button>
      <button @click="allImages">Alle Bilder</button>
      <button @click="reset" style="background-color: red">Reset!</button>


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
  name: 'imageScale',
  data(){
      return {
          currentImagePath: "",
          message: "",
          uploadedFile: "",
          uploadedImage: "",
          uploadedFiles: []
      }
  },
  methods: {
    uploadFile(){
          const fdObject = new FormData();
          fdObject.append('file', this.$refs.file.files[0], this.$refs.file.files[0].name);
            axios.post(
                'http://localhost:3000/images/',
                fdObject)
          .then(res => {
              this.message = "Foto erfolgreich hochgeladen!";
              this.file = "";
              this.currentImagePath = res.data.originalPath;
              //this.uploadedFiles.push(res.data);
              console.log(res.data.imagePath);
              this.uploadedImage = res.data.imagePath;
              res.data.scaledImages.forEach( it => {
                  this.uploadedFiles.push(it)
              });

          })
      },
      preferedSize(){
        this.uploadedFiles = [];
            axios.post(
                'http://localhost:3000/preferedSize/',
                {
                    name: this.uploadedImage.name,
                    path: this.currentImagePath,
                    width: parseInt(this.$refs.number1.value)
                }
            ).then(res => {
                this.uploadedFiles.push(res.data);
            })
      },
      allImages(){
          this.uploadedFiles = [];
          axios.get(
              'http://localhost:3000/allImages/'
          ).then(res => {
              res.data.forEach(it => {
                  this.uploadedFiles.push(it);
              })
          });
      },
      reset(){
          this.uploadedFiles = [];
          axios.delete(
              'http://localhost:3000/reset/'
          ).then(res => {
              if(res.status === 200) this.message = "Reset erfolgreich!";
              });
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
