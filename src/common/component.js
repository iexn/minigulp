const component = (function () {
    //= include common/render.js

    const component = {};

    /** 
     * 创建组件容器
     */
    component.getContainer = function () {
        let container = render.getContainer("app");
        return container;
    };

    /**
     * 获取定制数组重构方法
     */
    function getArrayArgumentations (callback) {
        const aryMethods = ['push','pop','shift','unshift','splice','sort','reverse'];
        const arrayArgumentations = [];
        aryMethods.forEach(method => {
            let original = Array.prototype[method];
            arrayArgumentations[method] = function () {
                let result = original.apply(this, arguments)
                callback && callback(method);
                return result;
            };
        });

        // 清空数组只保留项数
        arrayArgumentations.clear = function (length = 0) {
            this.length = length;
            callback && callback('clear');
            return this;
        }

        return arrayArgumentations;
    };

    /** 
     * 热更新
     * 未扩展数组中是对象，对象里面的监听情况
     */
    function hotData(data = {}, callback, deepPrefix = "") {
        const __DATA__ = {};

        for (let name in data) {
            let data_type = util.type(data[name]);
            if (data_type == "array") {
                data[name].__proto__ = getArrayArgumentations(method => {
                    callback && callback(deepPrefix + name, [ data[name] ]);
                    data._cache_list_length = data.list.length;
                });
                __DATA__[name] = data[name];
            } else if(data_type == "object") {
                __DATA__[name] = hotData(data[name], callback, name + ".");
            } else {
                Object.defineProperty(__DATA__, name, {
                    get() {
                        return data[name];
                    },
                    set(val) {
                        data[name] = val;
                        callback && callback(deepPrefix + name, [ val ]);
                        return data[name];
                    }
                });
            }
        }

        return __DATA__;
    }

    /** 
     * 热更新
     */
    component.hotData = hotData;

    /** 
     * 创建组件模型
     */
    component.create = function (template, data = {}, options = {}) {
        let DOM = render.create(template);
        
        let bindSet = {};

        function on(key, callback) {
            if (!bindSet.hasOwnProperty(key)) {
                bindSet[key] = [];
            }
            bindSet[key].push({
                key: key,
                callback: callback,
            });
        }

        function off(key, callback) {
            if (!bindSet.hasOwnProperty(key)) {
                return;
            }
            for (let i = bindSet[key].length - 1; i >= 0; i--) {
                if (bindSet[key][i].callback == callback) {
                    bindSet[key].splice(i, 1);
                }
            }
        }

        function trigger(key, params, defaults) {
            let isTrigger = false;

            if (bindSet.hasOwnProperty(key)) {
                bindSet[key].map(set => {
                    if (set.callback) {
                        isTrigger = true;
                        set.callback.apply(set, params);
                    }
                });
            }
            
            if (!isTrigger) {
                defaults && defaults(key, ...params);
            }
        }

        function onDataChange(name, vals) {
            callback && callback();
        }

        options = Object.assign({
            accessDom: false
        }, options);

        let dataChange = null;

        let __DATA__ = hotData(data, function (name, vals) {
            trigger(name, vals, dataChange);
        });

        let DOMMAP = {
            el: DOM,
            data: __DATA__,
            on,
            off,
            onDataChange: function (callback) {
                dataChange = callback;
            }
        };

        // 是否将数据存入到dom上的__DATA__变量中
        if (options.accessDom) {
            DOM.__proto__.__DATA__ = __DATA__;
        }

        return DOMMAP;
    };

    // = block:main

    return component;
})();