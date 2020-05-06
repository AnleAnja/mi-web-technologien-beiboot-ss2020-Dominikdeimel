<template>
    <div id="app">
        <v-app id="inspire">
            <div>
                <v-app-bar
                        color="grey accent-4 gradient"
                        dark
                        src="https://picsum.photos/1920/1080?random"
                        absolute
                >
                    <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

                    <v-toolbar-title>Picture Box</v-toolbar-title>
                </v-app-bar>

                    <v-navigation-drawer
                            v-model="drawer"
                            absolute
                            temporary
                    >
                        <v-list
                                nav
                                dense
                        >
                            <v-list-item-group

                                    active-class="deep-purple--text text--accent-4"
                            >
                                <v-list-item @click="changeActiveComponent('imageScaling')">
                                    <v-list-item-icon>
                                        <v-icon>mdi-crop</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>ImageScale</v-list-item-title>
                                </v-list-item>

                                <v-list-item @click="changeActiveComponent('gallery')">
                                    <v-list-item-icon>
                                        <v-icon>mdi-panorama</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>Gallery</v-list-item-title>
                                </v-list-item>

                            </v-list-item-group>
                        </v-list>
                    </v-navigation-drawer>


            </div>
        </v-app>
    </div>

</template>

<script>
    export default {
        name: 'Bar',
        data(){
            return {
                items: ['Imagescaling','Gallery'],
                drawer: false
            }
        },
        methods: {
            changeActiveComponent(newComponent){
                this.$emit('newComponent', newComponent);
            }
        }

    }
</script>

<style scoped>

</style>