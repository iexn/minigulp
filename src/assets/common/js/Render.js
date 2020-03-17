const Render = (function () {

    let Render = function () {};
    let _this = Render.prototype;

    _this.getContainer = function (id = '') {

        let DOM = _this.create('<div id="'+ id +'"></div>');

        return {
            el: DOM,
            render: function (selector) {
                if (typeof selector == 'undefined') {
                    let original = document.querySelector('#' + id);
                    original.parentNode.replaceChild(DOM, original);
                } else {
                    let parent = document.querySelector(selector);
                    parent.append(DOM);
                }
                setTimeout(() => {
                    DOM.className = (DOM.className + " on").trim();
                }, 100);
            }
        };
    };

    /**
     * 通过字符串模板创建DOM
     * @param {String} string 字符串模板，模板必须包含一个最外层标签
     */
    _this.create = function (string) {
        let Element = document.createElement('div');
        Element.innerHTML = string.trim();
        return Element.firstChild;
    };

    _this.compile = function (DOM, template, event = function () {}) {
        let Element = this.create(template);
        event && event(Element);
        if (typeof DOM == 'string') {
            DOM = document.querySelector(DOM);
        }
        DOM.appendChild(Element);
    };

    return new Render;
})();