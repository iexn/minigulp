module.exports = function (terminal) {
    let _config = {
        mode: 'production',
        entry: require("./.config/entry")("prod", terminal),
        output: require("./.config/output")("prod", terminal),
        module: require("./.config/module")("prod", terminal),
        plugins: require("./.config/plugins")("prod", terminal),
        resolve: require("./.config/resolve")("prod", terminal),
        optimization: require("./.config/optimization")("prod", terminal),
        // profile: true,
        externals: require("./.config/externals")("prod", terminal),
    };

    return _config
};
