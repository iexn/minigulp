const debug = (function () {
    let _debug = config.DEBUG;
    let _debug_queue = 1;
    function debug(text, ...args) {
        if (_debug) {
            // console.warn('[' + _debug_queue++ + ']', text, ...args);

            window.showDevInfo([
                {
                    text: `Debug Stack`,
                    backgroundColor: "#35495E",
                    color: "#FFF"
                },
                {
                    text: text,
                    backgroundColor: "#577DEA",
                    color: "#FFF"
                }
            ], "warn", ...args);
        }
    };

    return debug;
})();