module.exports = function (mode, terminal) {
    return {
        usedExports: true,
        splitChunks: {
            chunks: "initial",
            minSize: 10240, // 模块的最小体积 10k
            minChunks: 1, // 模块的最小被引用次数
            maxAsyncRequests: 1, // 按需加载的最大并行请求数
            maxInitialRequests: 1, // 一个入口最大并行请求数
            automaticNameDelimiter: '~', // 文件名的连接符
            name: terminal.name,
            cacheGroups: { // 缓存组
                // 第三方模块
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors/vendors",
                    priority: -10
                },
                // 公共模块
                commons: {
                    test: /src[\\/]common[\\/]/,
                    name: "vendors/common",
                    priority: -12
                },
                // 单端子公共块
                ["common-" + terminal.name]: {
                    test: new RegExp('src[\\\\\/]app[\\\\\/]' + terminal.name + '[\\\\\/]common[\\\\\/]'),
                    name: "vendors/common-" + terminal.name,
                    priority: -14
                },
                // 默认子页
                default: {
                    minChunks: 1,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    };
};
