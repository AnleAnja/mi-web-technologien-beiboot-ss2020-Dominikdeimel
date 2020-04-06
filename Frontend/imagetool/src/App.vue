<template>
    <div id="app">
        <div style="height: 1px">
            <bar @newComponent="changeActiveComponent"></bar>
        </div>
        <div style="margin-top: 60px; height: auto" >
            <keep-alive>
                <component :is="dynamicComponent"></component>
            </keep-alive>
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
                dynamicComponent: "imageScale"
            }
        },
        methods: {
            changeActiveComponent(value) {
                this.dynamicComponent = value;
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