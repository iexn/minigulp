'use strict';

(function () {

// = include common/polyfill.js

// 加载常量
//= include index/js/const.js

(function (factory) {

    // = include common/lang.js
    // = include common/util.js
    // = include common/cache.js
    // = include common/config.js
    // = include common/debug.js
    // = include common/api.js
    // = include ./../extension/dev.js
    
    // 获取异步数据
    extension(function (BASE) {
        // 修改最新配置信息
        Object.assign(config, BASE);

        // = include common/plugins/devinfo.js

        /** 
         * 创建包
         */
        const Package = {
            // 依赖 jQuery
            $   : jQuery,
            api,
            cache,
            util,
            config,
            lang,
            debug
        };
        
        // 进入应用
        factory(Package);
    });

})(function (Package) {
    const $$ = Package;

    const {
        api,
        util,
        config,
        debug,
        $,
    } = $$;

    const body = document.body;
    const self = document.getElementById("app");
    const $body = $(body);
    const $self = $(self);

    // 加载模块
    // = include common/common.js
    // = include index/js/lang.js
    // = include index/js/config.js
    // = include index/js/api.js
    // = include index/js/template.js
    // = include index/js/component.js
    // = include index/js/index.js

});

})();