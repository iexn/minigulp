'use strict';

(function () {

// = include common/polyfill.js

// 加载常量
// = include common/const.js

(function (factory) {

    // = include common/lang.js
    // = include common/util.js
    // = include common/cache.js
    // = include common/config.js
    // = include common/debug.js
    // = include common/api.js
    // = include common/component.js
    // = include ./../extension/dev.js
    
    // 获取异步数据
    extension(function (BASE) {
        // 修改最新配置信息
        Object.assign(config, BASE);

        // = include common/plugins/devinfo.js
        
        // 进入应用
        factory({
            // 依赖 jQuery
            $   : jQuery,
            api,
            cache,
            util,
            config,
            lang,
            component,
            debug
        });
    });

})(function (Package) {
    const $$ = Package;
    
    const api       = $$.api;
    const util      = $$.util;
    const config    = $$.config;
    const component = $$.component;
    const debug     = $$.debug;
    const $         = $$.$;
    const __body__  = document.body;
    const __self__  = document.getElementById("app");

    // 加载模块
    // = include common/common.js
    // = include demo/lang.js
    // = include demo/config.js
    // = include demo/api.js
    // = include demo/component.js
    // = include demo/index.js

});

})();