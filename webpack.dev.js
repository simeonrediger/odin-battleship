import { merge } from 'webpack-merge';
import common from './webpack.common.js';

export default merge(common, {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
        static: './dist',
        watchFiles: ['./src/index.html'],
        open: process.env.BROWSER
            ? { app: { name: process.env.BROWSER } }
            : true,
    },
});
