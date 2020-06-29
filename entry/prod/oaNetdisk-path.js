'use strict';

window.oaNetDiskMobile = (function (factory) {
    let BASE = factory();
    const $          = window.jQuery || window.Zepto,
          body       = $('body'),
          id_stack   = [],
          cache_file = {};
    
    let self, parent;
    let debug = function() {};

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

    return oaNetDiskMobile;
})(function () {
    //=include ../../src/common/js/factory.build.js
});
