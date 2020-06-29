const debug = (function () {
    let _debug = config.DEBUG;
    let _debug_queue = 1;
    function debug(text, ...args) {
        if (_debug) {
            console.warn('[' + _debug_queue++ + ']', text, ...args);
        }
    };

    return debug;
})();