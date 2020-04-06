<template>
    <div class="hello">
        <v-app id="inspire">
            <div style="margin-left: 85%">
                <v-switch v-model="switch1" inset label="Eigene Skalierung"></v-switch>
            </div>
                <v-layout justify-center>
                    <v-card min-height="400" max-height="400" width="700" style="margin-top: 20px">
                        <div align="center">
                            <v-file-input
                                    v-model="file"
                                    color="deep-purple accent-4"
                                    label="File input"
                                    placeholder="Foto auswählen"
                                    prepend-icon="mdi-camera"
                                    outlined
                                    @change="uploadFile"
                                    style="width: 600px; margin-top: 10px;"
                            ></v-file-input>
                        </div>
                        <div v-if="uploadedImage" align="center" style="margin-top: -20px;">
                            <v-img :src="uploadedImage" height="300" contain style="margin-top: -20px; "></v-img>
                        </div>

                    </v-card>
                </v-layout>
            <div v-if="uploadedImage && switch1 === false" style="margin-top: 20px" align="center">
            <v-card width="1250" height="1000">
                <v-layout row wrap>
                    <div style="margin-left: 30px">
                        <h3>800Px</h3>
                        <v-img :src="uploadedFiles[0].imagePath" width="400" contain></v-img>
                    </div>
                    <div style="margin-left: 30px">
                        <h3>500Px</h3>
                        <v-img :src="uploadedFiles[1].imagePath" width="250" contain></v-img>
                    </div>
                    <div style="margin-left: 30px">
                        <h3>300Px</h3>
                        <v-img :src="uploadedFiles[2].imagePath" width="150" contain></v-img>
                    </div>
                    <div style="margin-left: 30px">
                        <h3>Quadrat</h3>
                    <v-img :src="uploadedFiles[3].imagePath" width="300" contain></v-img>
                    </div>
                </v-layout>

                <div style="margin-top: 50px; margin-left: 20px">
                <v-list>
                    <v-list-item>
                        <v-layout row wrap>
                            <b>800Px</b>
                        <v-btn style="margin-left: 10px">Download</v-btn>
                        </v-layout>
                    </v-list-item>
                    <v-list-item>
                        <v-layout row wrap>
                            <b>500Px</b>
                            <v-btn style="margin-left: 10px">Download</v-btn>
                        </v-layout>
                    </v-list-item>
                    <v-list-item>
                        <v-layout row wrap>
                            <b>300Px</b>
                            <v-btn style="margin-left: 10px">Download</v-btn>
                        </v-layout>
                    </v-list-item>
                    <v-list-item>
                        <v-layout row wrap>
                            <b>Square</b>
                            <v-btn style="margin-left: 10px">Download</v-btn>
                        </v-layout>
                    </v-list-item>
                </v-list>
                </div>
            </v-card>
            </div>

            <div v-if="uploadedImage && switch1 === true" style="margin-top: 20px" align="center">
                <v-card width="1250" height="1000">
                    <v-text-field
                            label="Breite"
                            placeholder="Placeholder"
                            outlined
                            style="width: 300px; margin-top: 10px"
                    ></v-text-field>
                </v-card>
            </div>
        </v-app>
    </div>
</template>

<script>

    import axios from 'axios';

    export default {
        name: 'imageScale',
        data() {
            return {
                currentImagePath: "",
                message: "",
                uploadedFile: "",
                uploadedImage: "",
                uploadedFiles: [],
                file: null,
                switch1: false
            }
        },
        methods: {
            uploadFile() {
                this.uploadedFiles = [];
                const fdObject = new FormData();
                fdObject.append('file', this.file, this.file.name);
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
                        res.data.scaledImages.forEach(it => {
                            this.uploadedFiles.push(it)
                        });

                    })
            },
            preferedSize() {
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
            allImages() {
                this.uploadedFiles = [];
                axios.get(
                    'http://localhost:3000/allImages/'
                ).then(res => {
                    res.data.forEach(it => {
                        this.uploadedFiles.push(it);
                    })
                });
            },
            reset() {
                this.uploadedFiles = [];
                axios.delete(
                    'http://localhost:3000/reset/'
                ).then(res => {
                    if (res.status === 200) this.message = "Reset erfolgreich!";
                });
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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

    .download-button {
        margin-left: 30px;
        margin-top: 20px;
    }
</style>
