const path = require("path");
const config = require("../config");
const { join, getArgv } = require("../util");
const { getRealOutputPath } = require("./common");

const mode = "dev";

let port = 13001;

module.exports = function (terminal) {
    let _config = {
        mode        : 'development',
        entry       : require("./.config/entry")(mode, terminal),
        output      : require("./.config/output")(mode, terminal),
        module      : require("./.config/module")(mode, terminal),
        plugins     : require("./.config/plugins")(mode, terminal),
        resolve     : require("./.config/resolve")(mode, terminal),
        optimization: require("./.config/optimization")(mode, terminal),
        // profile: true,
        externals: require("./.config/externals")(mode, terminal),
        // watch: true,
        devtool: "inline-source-map",
        devServer: {
            contentBase: getRealOutputPath(mode, {name: ""}),
            index: terminal.name + "/index.html",
            openPage: terminal.name + "/demo.html",
            publicPath: "/",
            compress: true,
            hot: true,
            port: getArgv("port") || undefined,
            proxy: terminal.customConfig.devProxy || {},
            open: getArgv("open") != undefined,
            // watchContentBase: true,
            // watchOptions: {
            //     aggregateTimeout: 300,
            //     poll: 1000,
            //     ignored: /node_modules/
            // },
        }
    };

    // port += 100;
    
    return _config;
};
