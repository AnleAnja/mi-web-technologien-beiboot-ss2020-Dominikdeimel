<template>
    <div>
        <v-app id="inspire">
            <v-layout justify-center>
                <v-card width="1200" style="margin-top: 30px">
                    <h1 style="margin-top: 20px">Gallery</h1>
                    <v-btn icon @click="allImages" style="float: right; margin-top: -45px; margin-right: 50px">
                        <v-icon>mdi-restore</v-icon>
                    </v-btn>
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
                                <v-card @click="switchToImageScale(image)">
                                    <h3>{{image.originalName}}</h3>
                                    <v-img :src="image.imagePath" width="300" contain></v-img>
                                </v-card>
                            </v-col>
                        </v-row>
                    </div>
                </v-card>
            </v-layout>
        </v-app>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: "gallery",
        data() {
            return {
                allUserImages: []
            }
        },
        mounted() {
            this.allImages()
        },
        methods: {
            allImages() {
                axios.get(
                    'http://localhost:3000/allImages/'
                ).then(res => {
                    this.allUserImages = res.data;
                });
            },
            reset() {
                this.allUserImages = [];
                axios.delete(
                    'http://localhost:3000/reset/'
                ).then(res => {
                    if (res.status === 200) this.message = "Reset erfolgreich!";
                });
            },
            switchToImageScale(image){
                this.$emit('switchToImageScale', image);
            }
        }
    }
</script>

<style scoped>

</style>