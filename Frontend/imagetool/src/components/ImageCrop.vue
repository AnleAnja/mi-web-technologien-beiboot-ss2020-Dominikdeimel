<template>
    <div>
        <div class="img-container">
            <img ref="image" :src="src" alt="">
        </div>
        <img :src="destination" class="crop-preview">
        <input type="file" ref="file" name="imageInput" @change="onFileUploaded">
        </div>

</template>

<script>
    import Cropper from "cropperjs"
    export default {
        name: "ImageCrop",
        props: {
            src: String
        },
        data() {
            return {
                cropper: {},
                destination: {},
                image: {}
            }
        },
        mounted() {
            this.image = this.$refs.image;
            this.initialiseCropper();
        },
        methods: {
            initialiseCropper() {
                this.image = this.$refs.image;
                console.log(this.image.src);
                this.cropper = new Cropper(this.image, {
                    zoomable: false,
                    scalable: false,
                    aspectRatio: 1,
                    crop: () => {
                        const canvas = this.cropper.getCroppedCanvas();
                        this.destination = canvas.toDataURL("image/png");
                    }
                })
            },
            onFileUploaded() {
            }
        }
    }
</script>

<style scoped>
.img-container {
    width: 640px;
    height: 480px;
    float: left;
}
    .crop-preview {
        width: 200px;
        height: 200px;
        float: left;
        margin-left: 10px;
    }
</style>