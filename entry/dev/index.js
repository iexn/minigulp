'use strict';

(function () {
// 加载常量
//= include ../../src/common/const.js

(function (factory) {
    /** 
     * 创建包
     */
    const Package = {
        // 依赖 jQuery
        $   : jQuery,
        body: document.body,
        self: document.getElementById("app")
    };

    /** 
     * 功能支持：数据
     */
    Package.cache = 
        //= include ../../src/common/cache.js
        "";

    /** 
     * 功能支持：工具
     */
    Package.util = 
        //= include ../../src/common/util.js
        "";

    /** 
     * 功能支持：配置
     */
    Package.config = 
        //= include ../../src/common/config.js
        "";

    /** 
     * 功能支持：语言包
     */
    Package.lang = 
        //= include ../../src/common/lang.js
        "";

    /** 
     * 功能支持：自定义dom
     */
    Package.render = 
        //= include ../../src/common/render.js
        "";

    /** 
     * 功能支持：异步调用扩展
     * 获取异步调用关键数据
     */
    let extension = 
        //= include ../../extension/dev/base_user.js
        "";

    /** 
     * 调试函数
     */
    let _debug = Package.config.DEBUG;
    let _debug_queue = 1;
    Package.debug = function (text, ...args) {
        if (_debug) {
            console.warn('[' + _debug_queue++ + ']', text, ...args);
        }
    };

    // 获取异步数据
    extension(function (BASE) {
        // 修改最新配置信息
        Package.config = Object.assign(BASE, Package.config);

        // 输出开发信息
        console.log(
            `%c MiniGulp Dev CLI %c Detected lastest version is v${Package.config.VERSION} `,
            'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
            'background:#577dea ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff'
        );
        
        // 进入应用
        factory(Package);
    });

})(function (Package) {
    const {
        cache,
        util,
        config,
        render,
        debug
    } = Package;

    const $$    = Package;
    const $     = $$.$;
    const body  = $$.body;
    const self  = $$.self;
    const $body = $(body);
    const $self = $(self);

    // 加载公共函数
    //= include ../../src/common/common.js

    // 扩展配置
    //= include ../../src/index/js/config.js

    // 扩展语言包内容
    //= include ../../src/index/js/lang.js

    // 初始化
    //= include ../../src/index/js/init.js

});

})();