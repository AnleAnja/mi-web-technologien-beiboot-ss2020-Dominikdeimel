<template>
    <div id="app">
        <div style="height: 1px">
            <bar @newComponent="changeActiveComponent"></bar>
        </div>
        <div style="margin-top: 60px; height: auto">
            <imageScaling v-if="activeComponent === 'imageScaling'" :recentImageId="recentImageId"></imageScaling>
            <gallery v-if="activeComponent === 'gallery'" @switchToImageScaling="switchToImageScaling"></gallery>
        </div>

    </div>
</template>

<script>
import gallery from './components/Gallery.vue';
import imageScaling from './components/ImageScaling.vue';
import bar from './components/Bar';

export default {
    name: 'App',
    components: {
        imageScaling,
        bar,
        gallery
    },
    data() {
        return {
            activeComponent: 'imageScaling',
            recentImageId: ''
        };
    },
    methods: {
        changeActiveComponent(value) {
            this.activeComponent = value;
        },
        switchToImageScaling(imageId) {
            this.recentImageId = imageId;
            this.activeComponent = 'imageScaling';
        }
    }
};
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