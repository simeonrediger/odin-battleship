import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.svg$/i,
                oneOf: [
                    {
                        resourceQuery: /raw/,
                        type: 'asset/source',
                    },
                    {
                        type: 'asset/resource',
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif|webp|avif|ico|bmp)$/i,
                type: 'asset/resource',
            },
        ],
    },
};
