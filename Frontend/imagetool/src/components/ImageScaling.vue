<template>
    <div class="hello">
        <v-app class="background">
            <div style="margin-left: 85%">
                <v-switch v-model="switchMode" inset label="Eigene Skalierung"></v-switch>
                <v-switch v-model="greySwitch" @change="greyscaling" inset label="Graustufen"></v-switch>
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
                                type="file"
                                accept="image/*"
                                @change="uploadFile"
                                style="width: 600px; margin-top: 10px;"
                        ></v-file-input>
                    </div>
                    <div v-if="uploadedFile !== null" align="center" style="margin-top: -20px;">
                        <v-img :src="getImagePath(mainImagePath)" height="300" contain
                               style="margin-top: -20px; "></v-img>
                    </div>
                </v-card>
            </v-layout>
            <div v-if="uploadedFile !== null && switchMode === false" style="margin-top: 20px" align="center">
                <v-card width="1250" height="auto" min-height="400">
                    <v-layout row wrap>
                        <div style="margin-left: 30px">
                            <h3>800Px</h3>
                            <v-img :src="getImagePath(uploadedImage.small)" width="400"
                                   contain></v-img>
                        </div>
                        <div style="margin-left: 30px">
                            <h3>500Px</h3>
                            <v-img :src="getImagePath(uploadedImage.medium)" width="250"
                                   contain></v-img>
                        </div>
                        <div style="margin-left: 30px">
                            <h3>300Px</h3>
                            <v-img :src="getImagePath(uploadedImage.large)" width="150"
                                   contain></v-img>
                        </div>
                        <div style="margin-left: 30px">
                            <h3>Quadrat</h3>
                            <v-img :src="getImagePath(uploadedImage.square)" width="300"
                                   contain></v-img>
                        </div>
                    </v-layout>
                </v-card>
            </div>

            <div v-if="uploadedFile !== null && switchMode === true" style="margin-top: 20px" align="center">
                <v-layout justify-center>
                    <v-card width="900" height="auto" min-height="200">
                        <div style="margin-top: 20px">
                            <v-text-field v-model="sizeToScale" label="Breite" placeholder="0" outlined
                                          style="width: 300px; margin-top: 10px"></v-text-field>
                            <v-btn icon @click="getImageInUserSize"
                                   style="float: right; margin-right: 28%; margin-top: -70px">
                                <v-icon>mdi-format-align-middle</v-icon>
                            </v-btn>
                            <v-img max-width="850" v-if="imageInPreferedSize"
                                   :src="getImagePath(imageInPreferedSize)"
                                   :width="parseInt(sizeToScale)" contain></v-img>
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
    props: ['recentImageId'],
    data() {
        return {
            sizeToScale: '',
            imageInPreferedSize: '',
            uploadedImage: {},
            uploadedFile: null,
            switchMode: false,
            greySwitch: false,
            mainImagePath: ''
        };
    },
    mounted() {
        if(this.recentImageId !== ''){
            axios.get(
                process.env.VUE_APP_BACKENDPATH + 'image/main/',
                {
                    params: {
                        id: this.recentImageId,
                    }
                }
            ).then(res => {
                this.uploadedImage = res.data;
                this.mainImagePath = this.uploadedImage.original;
                this.uploadedFile = res.data;
            });
        }
    },
    methods: {
        uploadFile() {
            const fdObject = new FormData();
            fdObject.append('image', this.uploadedFile, this.uploadedFile.name);

            axios.post(
                process.env.VUE_APP_BACKENDPATH + 'image/',
                fdObject
            )
                .then(res => {
                    this.uploadedImage = res.data;
                    this.mainImagePath = this.uploadedImage.original;
                });
        },
        getImageInUserSize() {
            if (isNaN(this.sizeToScale)) {
                alert('Only valid numbers allowed!');
            } else {
                axios.get(
                    process.env.VUE_APP_BACKENDPATH + 'image/',
                    {
                        params: {
                            id: this.uploadedImage.id,
                            size: this.sizeToScale
                        }
                    }
                ).then(res => {
                    this.imageInPreferedSize = res.data;
                });
            }
        },
        greyscaling() {
            if(this.greySwitch) {
                axios.get(
                    process.env.VUE_APP_BACKENDPATH + 'image/',
                    {
                        params: {
                            id: this.uploadedImage.id,
                            grey: this.greySwitch
                        }
                    }
                )
                    .then(res => {
                        this.mainImagePath = res.data;
                    });
            } else {
                this.mainImagePath = this.uploadedImage.original;
            }
        },
        getImagePath(originalPath){
            return `${process.env.VUE_APP_BACKENDPATH}${originalPath}`;
        }
    }
};
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
