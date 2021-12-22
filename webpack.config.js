
const path = require('path');
module.exports = {
    target: 'node',
    entry: "./src/index.js",
    output: {
        path: path.join(__dirname, 'dist'),
        filename: "index.js"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    }
};