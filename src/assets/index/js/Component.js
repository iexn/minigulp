const Component = (function () {

    let Component = function () {};
    let _this = Component.prototype;

    //=include ../../common/js/extends/Component.js

    /**
     * 组件定义
     *  _this.xxx = function (data = {}) {
     *      let _data = Object.assign({}, data);
     *      let DOM = Render.create(`<div class=""></div>`);
     *      data.el = DOM;
     *      return data;
     *  };
     */

    return new Component;
})();