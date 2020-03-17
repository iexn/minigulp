const Api = function () {

    let Api = function () {};
    let _this = Api.prototype;

    //=include ../../common/js/extends/Api.js

    // 所有用到的接口名称
    _this.urls = {
        /**
         * 接口名定义
         * xxx: ""
         */
    };

    /**
     * 接口定义
     * _this.xxx = function ({}, callback, fail) {
     *     this.run("xxx", {}, callback, fail);
     * };
     */

    return new Api;
}();
