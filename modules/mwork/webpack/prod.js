const mode = "prod";

module.exports = function (terminal) {
    let _config = {
        mode: 'production',
        entry: require("./.config/entry")(mode, terminal),
        output: require("./.config/output")(mode, terminal),
        module: require("./.config/module")(mode, terminal),
        plugins: require("./.config/plugins")(mode, terminal),
        resolve: require("./.config/resolve")(mode, terminal),
        optimization: require("./.config/optimization")(mode, terminal),
        // profile: true,
        externals: require("./.config/externals")(mode, terminal),
    };
    
    return _config;
};
