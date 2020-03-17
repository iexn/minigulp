/**
 * 初始化
 */
const Init = (function () {

    let Init = function () {};

    function newInstance(data) {
        // 创建组件
        // 加载组件
        let Container = Render.getContainer('app');
        Container.el.appendChild(Render.create(`<div></div>`));
        Container.render();
    }

    Init.prototype.instance = function () {
        // 数据预处理
        let data = {};
        newInstance(data);
    };

    return new Init;
})();

// 界面预处理
// 初始化执行
Init.instance();
