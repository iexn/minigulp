'use strict';

(function () {
// 加载常量
//= include index/js/const.js

(function (factory) {

    //= include ./../extension/prod.js

    //= include common/util.js
    //= include common/cache.js
    //= include index/js/config.js
    //= include index/js/lang.js
    function debug() { }
    
    //= include index/js/api.js
    
    // 获取异步数据
    extension(function (BASE) {
        // 修改最新配置信息
        Object.assign(config, BASE);
        
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

    //= include common/common.js
    //= include index/js/component.js
    //= include index/js/index.js

});

})();