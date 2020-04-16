<template>
    <div>
        <v-app id="inspire" class="background">
            <v-layout justify-center>
                <v-card width="1200" style="margin-top: 30px">
                    <h1 style="margin-top: 20px">Gallery</h1>
                    <v-btn icon @click="reset" color="red" style="float: right; margin-top: -45px; margin-right: 20px">
                        <v-icon>mdi-restart</v-icon>
                    </v-btn>

                    <v-layout justify-center>
                        <v-card v-if="allUserImages.length === 0" width="350" height="50" style="margin-top: 200px">
                            <h1>No uploaded images</h1>
                        </v-card>
                    </v-layout>

                    <div v-if="allUserImages.length !== 0">
                        <v-row class="mx-2">
                            <v-col v-for="image in allUserImages" :key="image" cols="3" class="px-1">
                                <v-card @click="openDialog(image)">
                                    <h3>{{image.originalName}}</h3>
                                    <v-img :src="image.imagePath" width="300" contain></v-img>
                                </v-card>
                            </v-col>
                        </v-row>
                    </div>
                </v-card>
            </v-layout>
            <v-dialog
                    v-model="dialog"
                    width="800"
                    persistent

            >
                <v-layout justify-center>
                    <v-card width="800">
                        <h3 >{{currentImage.originalName}}</h3>
                        <div align="center">
                            <v-img :src="currentImage.imagePath" width="350" contain></v-img>
                        </div>
                        <v-row class="mx-2">
                            <v-col v-for="color in imageColors" :key="color" cols="4" class="px-3">
                                <h3>{{color.color}}</h3>
                                <h6>Population: {{color.population}}</h6>
                                <v-layout justify-center>
                                    <v-card width="100" :color="color.color">
                                        <h1 :style="{color: color.color}">-</h1>
                                    </v-card>
                                </v-layout>
                            </v-col>
                        </v-row>
                        <v-btn color="green darken-1" text @click="switchToImageScaling">
                            ImageScaling
                        </v-btn>
                        <v-btn color="red" text @click="closeDialog">
                            Close
                        </v-btn>
                    </v-card>

                </v-layout>
            </v-dialog>
        </v-app>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: "gallery",
        data() {
            return {
                allUserImages: [],
                dialog: false,
                currentImage: {},
                imageColors: []
            }
        },
        mounted() {
            this.getAllImages()
        },
        methods: {
            getAllImages() {
                axios.get(
                    'http://localhost:3000/image/all/'
                ).then(res => {
                    res.data.forEach(it => {
                        this.allUserImages.push(it[1]);
                    });

                });
            },
            getImageColors() {
                axios.get(
                    'http://localhost:3000/image/colors/',
                    {
                        params: {
                            id: this.currentImage.imageId,
                            path: this.currentImage.originalPath
                        }
                    }
                ).then(res => {
                    this.imageColors = res.data;
                });
            },
            reset() {
                this.allUserImages = [];
                axios.delete(
                    'http://localhost:3000/image/all/'
                ).then(res => {
                    if (res.status !== 200) console.log(res);
                });
            },
            switchToImageScaling() {
                this.$emit('switchToImageScaling', this.currentImage);
            },
            openDialog(image) {
                this.currentImage = image;
                this.getImageColors();
                this.dialog = true;
            },
            closeDialog() {
                this.currentImage = {};
                this.dialog = false;
                this.imageColors = [];
            }
        }
    }
</script>

<style scoped>
    .background {
        background-image: url('../assets/pattern1sj5r.jpg');
        height: auto;
        background-position: center;
        background-repeat: repeat;
        position: relative;
    }
</style>