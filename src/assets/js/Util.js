/**
 * 工具层
 */
const Util = function () {

    let Util = function () { };

    /**
     * 弹窗
     * 弹窗结束后执行callback()
     */
    Util.prototype.alert = function (text, callback) {
        window.alert(text);
        callback && callback();
        return false;
    };

    /**
     * 确认弹窗
     * 点击确定后出发success()
     */
    Util.prototype.confirm = function (text, success) {
        if (!window.confirm(text)) {
            return false;
        }
        success && success();
    };

    /**
     * 下载文件
     * url：下载文件的远程地址
     */
    Util.prototype.download = function (url) {
        window.open(url);
    };

    /**
     * 判断数据的具体类型
     */
    Util.prototype.type = function (mixin) {
        if (mixin == null) {
            return mixin + "";
        }

        let class2type = {
            '[object Boolean]': 'boolean',
            '[object Number]': 'number',
            '[object String]': 'string',
            '[object Function]': 'function',
            '[object Array]': 'array',
            '[object Date]': 'date',
            '[object RegExp]': 'regexp',
            '[object Object]': 'object',
            '[object Error]': 'error',
            '[object Symbol]': 'symbol'
        };

        let mixin_type = typeof mixin;

        if (mixin_type === 'undefined') {
            return 'undefined';
        }

        if (mixin_type === 'object' || mixin_type === "function") {
            return class2type[Object.prototype.toString.call(mixin)] || "object";
        }

        return mixin_type;

    };

    /**
     * 获取路由切换的完整地址
     */
    Util.prototype.getRealPath = function () {
        let path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';


        if (path == '') {
            return Router.route;
        }

        if (path.indexOf('/') == 0) {
            return path;
        }


        let hash = this.getHashSimplePath(Router.route);

        let hashs = hash == '' ? [] : hash.split('/');
        let _paths = path == '' ? [] : path.split('/');
        let paths = [];



        for (let i in _paths) {

            if (_paths[i] != hashs[i]) {
                paths = _paths.splice(i);
                break;
            }
        }


        for (let _i = 0; _i < paths.length; _i++) {

            if (paths[_i] == '') {
                continue;
            }

            if (paths[_i] == '.') {
                continue;
            }

            if (paths[_i] == '..') {
                hashs.pop();
                continue;
            }

            hashs.push(paths[_i]);
        }


        return hashs.join('/');
    };

    /**
     * 人性化模拟切换路径的hashchange
     */
    Util.prototype.cdPath = function (path) {
        return this.hashRouteChange(this.getRealPath(path));
    };

    /**
     * 获取去除掉公共前缀hash的部分
     */
    Util.prototype.getHashSimplePath = function (path) {
        if (path.indexOf(config.hash_base) == 0) {
            path = path.substr(config.hash_base.length);
        }
        if (path.indexOf('/') == 0) {
            path = path.substr(1);
        }
        return path;
    };

    /**
     * 获取当前路径不带公共前缀的路径
     */
    Util.prototype.getSimplePath = function () {
        let path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

        path = this.getRealPath(path);
        if (path.indexOf(config.hash_base) == 0) {

            return path.substr(config.hash_base.length + 1);
        }
        return path;
    };

    /**
     * 跳转一个锚点
     * 公共锚点为 #netdisk
     * 如果 hash 是以 / 开头，去除 / 符号，因为没用
     */
    Util.prototype.hashRouteChange = function (hash) {
        if (hash.indexOf('/') == 0) {
            hash = hash.substr(1);
        }
        location.hash = config.hash_base + '/' + hash;
        return true;
    };

    /**
     * 获取权限
     * 当前是否有权限操作，否则false为仅查看
     * 个人权限等级要大于访问路径等级
     */
    Util.prototype.auth = function () {
        return config.auth >= config.path_level;
    };

    /**
     * 获取某元素以浏览器左上角为原点的坐标
     */
    Util.prototype.offset = function (dom) {
        let top = dom.offsetTop;
        let left = dom.offsetLeft;
        let width = dom.offsetWidth;
        let height = dom.offsetHeight;

        while (dom = dom.offsetParent) {
            top += dom.offsetTop;
            left += dom.offsetLeft;
        }
        return {
            top: top,
            left: left,
            width: width,
            height: height
        };
    };

    /**
     * 判断传入的变量是否是一个dom对象
     */
    Util.prototype.isDom = function (dom) {
        return (typeof HTMLElement === 'object') ?
            (dom instanceof HTMLElement) :
            (dom && typeof dom === 'object' && dom.nodeType === 1 && typeof dom.nodeName === 'string');

    };

    return new Util();
}();
