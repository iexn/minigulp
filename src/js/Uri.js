const Uri = (function () {

    const Uri = function () {};
    const _this = Uri.prototype;

    /**
     * location.hash 根据项目扩展功能
     */
    _this.hash = function (hash, mode = 'hash') {
        if (arguments.length == 0) {
            if (location.hash == '') {
                return '';
            }
            let hash = location.hash.slice(1);
            if (hash.indexOf(_this.options.hash_base) == 0) {
                // 将公共hash后的/一并删除
                hash = hash.slice(_this.options.hash_base.length + 1);
            }
            return hash;
        } else {
            // 如果是replace，不记录location历史
            if (mode == 'replace') {
                location.replace('#' + _this.options.hash_base + '?' + hash);
            } else {
                location.hash = _this.options.hash_base + '?' + hash;
            }
        }
    };

    /**
     * 设置 hash，一般根据配置参数设置，不需要自定义参数
     */
    _this.setHash = function (options = {}, mode = 'hash') {
        // TODO: 这里需要测试一下
        let params = {};

        if (options !== false) {
            if (Util.type(options) != "object") {
                options = {};
            }

            params = this.getHash();

            for (let i in options) {
                if (options[i] == null) {
                    delete params[i];
                } else {
                    params[i] = options[i];
                }
            }
        }

        params.vm       = Data.get('vm');
        params.mode     = Data.get('view_mode');
        params.ftype    = Data.get('ftype');
        params.rowkey   = Data.get('rowkey');

        // 如果没有设置belongid，将使用默认的belongid，也就是登录人的userid
        if (!params.hasOwnProperty("belongId")) {
            params.belongId = Data.get("belongId");
        }

        _this.hash(Util.query2Hash(params), mode);
    };



    /**
     * 创建一个便于使用的锚点地址
     */
    _this.getQueryUrl = function (options = {}) {
        let query = Util.query2Hash(_this.getHash(options));
        return '#' + _this.options.hash_base + '?' + query;
    };

    /**
     * 获取hash中的参数
     */
    _this.getHash = function (options = {}) {
        let query = Util.hash2Query(_this.hash());
        for (let i in options) {
            if (options[i] == null) {
                delete query[i];
            } else {
                query[i] = options[i];
            }
        }
        return query;
    };

    /**
     * 根据地址栏的信息刷新Data中的数据
     * Tips：解决hash变化时，页面不跟随新数据发生变化
     */
    _this.refreshData = function () {
        let query = _this.getHash();
        debug(query)
        for (let key in query) {
            Data.set(key, query[key]);
        }
    };

    /**
     * 添加一个自定义参数，不能和预制参数名相同
     */
    _this.addQuery = function (name, value) {
        let options = {};
        options[name] = value;
        _this.setHash(options);
    };

    /**
     * 移除一个自定义参数并修改hash
     */
    _this.removeQuery = function (name) {
        let options = {};
        options[name] = null;
        _this.setHash(options);
    };

    /* ---------- 根据地址栏中hash里的参数添加的方法 ---------------- */

    /**
     * 设置rowkey并改变地址栏hash
     */
    _this.route = function (rowkey = Data.get('rowkey'), query = {}, mode = 'hash') {
        Data.set('rowkey', rowkey);
        _this.setHash(query, mode);
    };

    _this.resetRoute = function () {
        _this.setViewMode("grid");
        _this.setVm("all");
        _this.route(0, false);
    };

    /**
     * 改变布局方式
     */
    _this.setViewMode = function (mode) {
        if (['grid', 'list'].indexOf(mode) == -1) {
            return false;
        }
        Data.set('view_mode', mode);
        _this.setHash();
    };

    /**
     * 设置页面形态
     */
    _this.setVm = function (vm) {
        if (['all', 'search'].indexOf(vm) == -1) {
            return false;
        }
        Data.set('vm', vm);
        _this.setHash();
    };

    /**
     * 设置菜单
     */
    _this.setFType = function (menu, query = {}) {
        if (['sch', 'my','sector','group','tp'].includes(menu)) {
            Data.set('ftype', menu);

            if (menu == "tp") {
                query.belongId = "";
            }

            _this.route(0, query);
        }
    };

    /**
     * 获取去除掉公共前缀hash的部分
     */
    _this.getHashSimplePath = function (path) {
        if (path.indexOf(_this.options.hash_base) == 0) {
            path = path.substr(_this.options.hash_base.length);
        }
        if (path.indexOf('/') == 0) {
            path = path.substr(1);
        }
        return path;
    };

    /**
     * 获取当前路径不带公共前缀的路径
     */
    _this.getSimplePath = function () {
        let path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

        path = this.getRealPath(path);
        if (path.indexOf(_this.options.hash_base) == 0) {
            // 去除公共hash值和 / 符号
            return path.substr(_this.options.hash_base.length + 1);
        }
        return path;
    };

    /**
     * 获取权限
     * 当前是否有权限操作，否则false为仅查看
     * 个人权限等级要大于访问路径等级
     */
    _this.auth = function () {
        return _this.options.auth >= _this.options.path_level;
    };

    /**
     * 获取路由切换的完整地址
     */
    _this.getRealPath = function (path = '') {

        // 如果不填写，不生效
        if (path == '') {
            return Router.route;
        }
        // 如果以 / 开头的文件路径，直接切换不做判断
        if (path.indexOf('/') == 0) {
            return path;
        }

        // 去除公共配置hash头，原始路由
        let hash = this.getHashSimplePath(Router.route);

        let hashs = hash == '' ? [] : hash.split('/');
        let _paths = path == '' ? [] : path.split('/');
        let paths = [];

        // 去除hash与新传入的path路径从开始的相同文件夹
        // 这一步防止路由产生两个重复的路径
        for (let i in _paths) {
            // 如果发现不同，直接复制当前位置以后的所有项到paths
            if (_paths[i] != hashs[i]) {
                paths = _paths.splice(i);
                break;
            }
        }

        // 分路径判断拼接
        for (let _i = 0; _i < paths.length; _i++) {
            // 路径为空，不处理
            if (paths[_i] == '') {
                continue;
            }
            // 如果为 .  视为在当前目录下，同样不处理
            if (paths[_i] == '.') {
                continue;
            }
            // 如果为 ..  视为向上一级，删除 hashs 的最后一项
            if (paths[_i] == '..') {
                hashs.pop();
                continue;
            }
            // 其他情况，直接拼接到最后
            hashs.push(paths[_i]);
        }

        // 拼接完整路径并直接改变锚点
        return hashs.join('/');
    };

    _this.encodeName = function (F_NAME) {
        return encodeURIComponent(F_NAME);
    };

    _this.encodePath = function (F_NAME, F_PATH) {
        let type = _this.getYunType();
        let path = `${F_NAME}_${type.thumb}@#%sjwy%#@${F_PATH}`;
        return encodeURIComponent(path);
    };

    _this.getYunType = function (type = "") {
        let __type = type;
        let __id = 0;
        if (type.indexOf(".") > -1) {
            __type = type.split(".")[0];
            __id = type.split(".")[1];
        }

        let types = {
            name: "",
            code: "",
            thumb: ""
        };
        if (Util.isEmpty(type)) {
            // __type = Data.get("ftype");
            __type = Config.yunType;
        }
            
        if (["sch","sector","group","my"].includes(__type)) {
            let __option = {
                "sch": {
                    name: "sch",
                    code: "0",
                    c: "s",
                    id: __id
                },
                "sector": {
                    name: "sector",
                    code: "1",
                    thumb: "d",
                    id: __id
                },
                "group": {
                    name: "group",
                    code: "2",
                    thumb: "g",
                    id: __id
                },
                "my": {
                    name: "my",
                    code: "10",
                    thumb: "u",
                    id: __id
                }
            };

            types = __option[__type];
        }
        if (["s","d","g","u"].includes(__type)) {
            let __option = {
                "s": {
                    name: "sch",
                    code: "0",
                    thumb: "s",
                    id: __id
                },
                "d": {
                    name: "sector",
                    code: "1",
                    thumb: "d",
                    id: __id
                },
                "g": {
                    name: "group",
                    code: "2",
                    thumb: "g",
                    id: __id
                },
                "u": {
                    name: "my",
                    code: "10",
                    thumb: "u",
                    id: __id
                }
            };

            types = __option[__type];
        }
        if (["0","1","2","10"].includes(__type + "")) {
            let __option = {
                "0": {
                    name: "sch",
                    code: "0",
                    thumb: "s",
                    id: __id
                },
                "1": {
                    name: "sector",
                    code: "1",
                    thumb: "d",
                    id: __id
                },
                "2": {
                    name: "group",
                    code: "2",
                    thumb: "g",
                    id: __id
                },
                "10": {
                    name: "my",
                    code: "10",
                    thumb: "u",
                    id: __id
                }
            };

            types = __option[__type];
        }

        return types;
    };

    return new Uri;
})();