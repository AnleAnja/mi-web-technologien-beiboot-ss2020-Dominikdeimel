module.exports = {
    entry: './assets/js/main.js',
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js']
    },
    output: {
        path: __dirname + '/public/js',
        publicPath: '/',
        filename: 'main.min.js'
    }
};