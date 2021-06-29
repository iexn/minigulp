const path = require("path");

module.exports = function (terminal) {
    let _config = {
        mode        : 'development',
        entry       : require("./.config/entry")("dev", terminal),
        output      : require("./.config/output")("dev", terminal.name),
        module      : require("./.config/module")("dev", terminal),
        plugins     : require("./.config/plugins")("dev", terminal.name),
        resolve     : require("./.config/resolve")("dev", terminal.name),
        optimization: require("./.config/optimization")("dev", terminal.name),
        // profile: true,
        externals: require("./.config/externals")("dev", terminal),
        // watch: true,
        // watchOptions: {
        //     aggregateTimeout: 300,
        //     poll: 1000,
        //     ignored: /node_modules/
        // },
        devtool: "inline-source-map",
        devServer: {
            contentBase: path.resolve(__dirname, ".cache"),
            compress: true,
            hot: true,
            proxy: terminal.customConfig.devProxy || {}
        }
    };

    return _config
};
