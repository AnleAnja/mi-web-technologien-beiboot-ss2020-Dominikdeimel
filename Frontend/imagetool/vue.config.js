module.exports = {
  'devServer': {
    'proxy': process.env.VUE_APP_BACKENDPATH
  },
  'transpileDependencies': [
    'vuetify'
  ]
};