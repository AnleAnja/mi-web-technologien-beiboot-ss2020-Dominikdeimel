<template>
    <div id="app">
        <div style="height: 1px">
            <bar @newComponent="changeActiveComponent"></bar>
        </div>
        <div style="margin-top: 60px; height: auto">
            <imageScale v-if="activeComponent === 'imageScale'" :recentImage="recentImage"></imageScale>
            <gallery v-if="activeComponent === 'gallery'" @switchToImageScale="switchToImageScale"></gallery>
        </div>

    </div>
</template>

<script>
    import gallery from './components/Gallery.vue'
    import imageScale from './components/ImageScale.vue'
    import bar from './components/Bar'

    export default {
        name: 'App',
        components: {
            imageScale,
            bar,
            gallery
        },
        data() {
            return {
                activeComponent: "imageScale",
                recentImage: {}
            }
        },
        methods: {
            changeActiveComponent(value) {
                this.activeComponent = value;
            },
            switchToImageScale(image) {
                this.recentImage = image;
                this.activeComponent = 'imageScale'
            }
        }
    }
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 0px;
    }
</style>