'use strict';

(function () {
// 加载常量
//= include ../../src/common/const.js

(function (factory) {

    //= include ../../src/common/util.js
    //= include ../../src/common/cache.js
    //= include ../../src/index/js/config.js
    //= include ../../src/index/js/lang.js
    //= include ../../src/common/render.js
    //= include ../extension/dev.js
    //= include ../../src/common/debug.js
    
    // 获取异步数据
    extension(function (BASE) {
        // 修改最新配置信息
        Object.assign(config, BASE);

        // 输出开发信息
        console.log(
            `%c MiniGulp Dev CLI %c Detected lastest version is v${config.VERSION} `,
            'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
            'background:#577dea ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff'
        );

        /** 
         * 创建包
         */
        const Package = {
            // 依赖 jQuery
            $   : jQuery,
            body: document.body,
            self: document.getElementById("app"),
            cache,
            util,
            config,
            lang,
            render,
            debug
        };
        
        // 进入应用
        factory(Package);
    });

})(function (Package) {
    const $$    = Package;

    const {
        util,
        config,
        render,
        debug,
        $,
        body,
        self
    } = $$;
    
    const $body = $(body);
    const $self = $(self);

    // 加载公共函数
    //= include ../../src/common/common.js
    
    // 初始化
    //= include ../../src/index/js/init.js

});

})();