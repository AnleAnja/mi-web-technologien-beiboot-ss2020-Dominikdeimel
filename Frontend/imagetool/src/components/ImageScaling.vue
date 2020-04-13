<template>
    <div class="hello">
        <v-app class="background">
            <div style="margin-left: 85%">
                <v-switch v-model="switchMode" @change="switchView" inset label="Eigene Skalierung"></v-switch>
            </div>
            <v-layout justify-center>
                <v-card min-height="400" max-height="400" width="700" style="margin-top: 20px">
                    <div align="center">
                        <v-file-input
                                v-model="uploadedFile"
                                color="deep-purple accent-4"
                                label="File input"
                                placeholder="Foto auswählen"
                                prepend-icon="mdi-camera"
                                outlined
                                @change="uploadFile"
                                style="width: 600px; margin-top: 10px;"
                        ></v-file-input>
                    </div>
                    <div v-if="uploadedFile !== null" align="center" style="margin-top: -20px;">
                        <v-img :src="uploadedImage.imagePath" height="300" contain style="margin-top: -20px; "></v-img>
                    </div>
                </v-card>
            </v-layout>
            <div v-if="uploadedFile !== null && switchMode === false" style="margin-top: 20px" align="center">
                <v-card width="1250" height="auto">
                    <v-layout row wrap>
                        <div style="margin-left: 30px">
                            <h3>800Px</h3>
                            <v-img :src="uploadedImage.scaledImages[0].imagePath" width="400" contain></v-img>
                        </div>
                        <div style="margin-left: 30px">
                            <h3>500Px</h3>
                            <v-img :src="uploadedImage.scaledImages[1].imagePath" width="250" contain></v-img>
                        </div>
                        <div style="margin-left: 30px">
                            <h3>300Px</h3>
                            <v-img :src="uploadedImage.scaledImages[2].imagePath" width="150" contain></v-img>
                        </div>
                        <div style="margin-left: 30px">
                            <h3>Quadrat</h3>
                            <v-img :src="uploadedImage.scaledImages[3].imagePath" width="300" contain></v-img>
                        </div>
                    </v-layout>

                    <v-layout justify-center>
                        <v-card width="500" style="margin-top: 40px">
                            <v-row justify="space-around">
                                <v-checkbox v-model="downloadCheckboxes[0]" class="mx-2" label="800Px"></v-checkbox>
                                <v-checkbox v-model="downloadCheckboxes[1]" class="mx-2" label="500Px"></v-checkbox>
                                <v-checkbox v-model="downloadCheckboxes[2]" class="mx-2" label="300Px"></v-checkbox>
                                <v-checkbox v-model="downloadCheckboxes[3]" class="mx-2" label="Square"></v-checkbox>
                            </v-row>
                            <v-btn icon @click="download" style="margin-top: -20px">
                                <v-icon>mdi-arrow-down-bold-circle-outline</v-icon>
                            </v-btn>
                        </v-card>
                    </v-layout>
                </v-card>
            </div>

            <div v-if="uploadedFile !== null && switchMode === true" style="margin-top: 20px" align="center">
                <v-layout justify-center>
                <v-card width="900" height="auto">
                    <div style="margin-top: 20px">
                    <v-text-field v-model="sizeToScale" label="Breite" placeholder="0" outlined style="width: 300px; margin-top: 10px"></v-text-field>
                    <v-btn icon @click="getImageInUserSize" style="float: right; margin-right: 28%; margin-top: -70px">
                        <v-icon>mdi-format-align-middle</v-icon>
                    </v-btn>
                        <v-img max-width="850" v-if="imageInPreferedSize" :src="imageInPreferedSize.imagePath" :width="imageInPreferedSize.scaleFactor" contain></v-img>
                    </div>
                </v-card>
                </v-layout>
            </div>
        </v-app>
    </div>
</template>

<script>

    import axios from 'axios';

    export default {
        name: 'imageScaling',
        props: {
          recentImage: {}
        },
        data() {
            return {
                sizeToScale: "",
                imageInPreferedSize: {},
                uploadedImage: {},
                uploadedFile: null,
                switchMode: false,
                downloadCheckboxes: [false, false, false, false]
            }
        },
        mounted() {
            if(this.recentImage){
                this.uploadedImage = this.recentImage;
                this.uploadedFile = this.recentImage;
            }
        },
        methods: {
            uploadFile() {
                const fdObject = new FormData();
                fdObject.append('file', this.uploadedFile, this.uploadedFile.name);
                axios.post(
                    'http://localhost:3000/image/',
                    fdObject)
                    .then(res => {
                        this.uploadedImage = res.data;
                    })
            },
            getImageInUserSize() {
                axios.get(
                    'http://localhost:3000/image/',
                    { params: {
                            id: this.uploadedImage.imageId,
                            path: this.uploadedImage.originalPath,
                            width: this.sizeToScale
                        }
                    }
                ).then(res => {
                    this.imageInPreferedSize = res.data;
                })
            },
            download() {

            }
        }
    }
</script>

<style scoped>
    h3 {
        margin: 10px 0 0;
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
    .background {
        background-image: url('../assets/pattern1sj5r.jpg');
         height: auto;
         background-position: center;
         background-repeat: repeat;
         position: relative;
     }
</style>
