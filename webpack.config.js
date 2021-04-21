//esto sirve para desde node poder acceder al sistema de archivos o file sistem 
const path = require('path');
const webpack = require('webpack');

module.exports = {
    //todos los campos de los objetos son palabras reservadas de webpack
    entry: './public/js/app.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, "./public/dist")
    },
    module: {
        rules: [
            {
                //lo que va en test es una regular expresion y va a servir para revisar en el entry todos los archivos 
                //de javasecrip que encuentre en el proyecto
                test: /\.m?js$/,
                use: {
                    //el loader es para decirle a webpack que plugins utilizar y que hara
                    // exclude: /(node_modules)/,
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
}