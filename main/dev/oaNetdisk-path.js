'use strict';

window.oaNetDiskMobile = (function (factory) {
    let BASE = factory();
    const $          = jQuery,
          body       = $('body'),
          id_stack   = [],
          cache_file = {};
    
    let self, parent;

    let _debug = true;
    let _debug_queue = 1;

    let debug = function debug(text, ...args) {
        if (_debug) {
            console.warn('[' + _debug_queue++ + ']', text, ...args);
        }
    };

    //= include ../../src/common/js/Util.js
    //= include ../../src/common/js/Config.js
    //= include ../../src/common/js/Render.js
    //= include ../../src/js/bscroll.min.js
    //= include ../../src/js/Api.js
    //= include ../../src/js/Component.js
    //= include ../../src/js/Data.js
    //= include ../../src/js/Uri.js
    //= include ../../src/js/Compile.js
    //= include ../../src/js/Listener.js
    //= include ../../src/js/Main.js
    //= include ../../src/js/Init.js

    return oaNetDiskMobile;
})(function () {
    //=include ../../src/common/js/factory.js
});
