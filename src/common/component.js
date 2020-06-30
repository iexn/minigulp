const component = (function () {
    //= include common/render.js

    const component = {};
    const _this = component;

    /** 
     * 创建组件容器
     */
    _this.getContainer = function () {
        let container = render.getContainer("app");
        return container;
    };

    /** 
     * 创建组件模型
     */
    _this.create = function (template) {
        let DOM = render.create(template);

        return {
            el: DOM
        };
    };

    // = block:main

    return component;
})();