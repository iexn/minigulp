/**
 * 工具层
 */
const Util = function () {

    let Util = function () {};
    let _this = Util.prototype;

    /**
     * 下载文件
     * url：下载文件的远程地址
     */
    _this.download = function (url) {
        window.open(url);
    };

    /**
     * 判断数据的具体类型
     */
    _this.type = function (mixin) {
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
    _this.getRealPath = function () {
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
     * 获取某元素以浏览器左上角为原点的坐标
     */
    _this.offset = function (dom) {
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
    _this.isDom = function (dom) {
        return (typeof HTMLElement === 'object') ?
            (dom instanceof HTMLElement) :
            (dom && typeof dom === 'object' && dom.nodeType === 1 && typeof dom.nodeName === 'string');

    };

    /**
     * 创建上拉下拉动作
     */
    _this.scroll = function (DOM, options = {}) {
        options = Object.assign({
            refer: window,
            onRefresh: function (done) { done(); },
            onContinue: function (done) { done(); },
        }, options);

        let DOMdropload = $(DOM).dropload({
            scrollArea: options.refer,
            loadDownFn: function (me) {
                me.lock('up');
                options.onContinue(function (noData = false) {
                    me.unlock();
                    me.noData(noData);
                    me.resetload();
                });
            },
            loadUpFn: function (me) {
                me.lock('down');
                options.onRefresh(function (noData = false) {
                    me.unlock();
                    me.noData(noData);
                    me.resetload();
                });
            }
        });

        return DOMdropload;
    };

    /**
     * 从1开始的对象，遍历
     * @param {Object} maps
     * @param {Function} callback
     */
    _this.likeItemObjectMap = function (maps, callback) {
        let i = 0;
        let result = [];
        let map;

        // eslint-disable-next-line no-constant-condition
        while (true) {
            i += 1;
            if (!maps.hasOwnProperty(i)) {
                break;
            }

            map = callback(maps[i], i, map);

            if (map === true) {
                continue;
            }

            if (map === false) {
                break;
            }

            result.push(map);
        }

        return result;
    };

    _this.getQuery = function () {
        let query = {};
        location.search.slice(1).split("&").map(item => {
            let srt = item.split("=");
            if (srt[0] != "") {
                query[srt[0]] = srt[1];
            }
        });
        return query;
    };

    /**
     * 是否为空值，不包括0
     */
    _this.isEmpty = function (mixin) {
        let _type = _this.type(mixin);
        if (["null", "undefined"].includes(_type)) {
            return true;
        }
        if (_type == "boolean" && mixin == false) {
            return true;
        }
        if (_type == "array" && mixin.length == 0) {
            return true;
        }
        if (_type == "object" && Object.keys(mixin).length == 0) {
            return true;
        }
        return mixin === "";
    };

    //金额输入框实时大写
    _this.convertCurrency = function (money) {
        //汉字的数字
        var cnNums = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); //基本单位
        var cnIntRadice = new Array("", "拾", "佰", "仟"); //对应整数部分扩展单位
        var cnIntUnits = new Array("", "万", "亿", "兆"); //对应小数部分单位
        var cnDecUnits = new Array("角", "分", "毫", "厘"); //整数金额时后面跟的字符
        var cnInteger = "整"; //整型完以后的单位
        var cnIntLast = "元"; //最大处理的数字
        var maxNum = 999999999999999.9999; //金额整数部分
        var integerNum; //金额小数部分
        var decimalNum; //输出的中文金额字符串
        var chineseStr = ""; //分离金额后用的数组，预定义
        var parts;
        if (money == "") {
            return "";
        }

        if ((money + "").length > 15) {
            return "大写转换最多支持15位数的金额！";
        }

        money = parseFloat(money);

        if (money >= maxNum) {
            //超出最大处理数字

            return "";
        }

        if (money == 0) {
            chineseStr = cnNums[0] + cnIntLast + cnInteger;

            return chineseStr;
        } //转换为字符串

        money = money.toString();

        if (money.indexOf(".") == -1) {
            integerNum = money;

            decimalNum = "";
        } else {
            parts = money.split(".");

            integerNum = parts[0];

            decimalNum = parts[1].substr(0, 4);
        } //获取整型部分转换

        if (parseInt(integerNum, 10) > 0) {
            var zeroCount = 0;
            var IntLen = integerNum.length;

            for (var i = 0; i < IntLen; i++) {
                var n = integerNum.substr(i, 1);
                var p = IntLen - i - 1;
                var q = p / 4;
                var m = p % 4;

                if (n == "0") {
                    zeroCount++;
                } else {
                    if (zeroCount > 0) {
                        chineseStr += cnNums[0];
                    }

                    //归零
                    zeroCount = 0;
                    chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
                }

                if (m == 0 && zeroCount < 4) {
                    chineseStr += cnIntUnits[q];
                }
            }

            chineseStr += cnIntLast;
        }

        //小数部分
        if (decimalNum != "") {
            var decLen = decimalNum.length;

            for (var j = 0; j < decLen; j++) {
                var nn = decimalNum.substr(j, 1);

                if (nn != "0") {
                    chineseStr += cnNums[Number(nn)] + cnDecUnits[j];
                }
            }
        }

        if (chineseStr == "") {
            chineseStr += cnNums[0] + cnIntLast + cnInteger;
        } else if (decimalNum == "") {
            chineseStr += cnInteger;
        }

        return chineseStr;
    };

    // textarea不回弹
    Util.prototype.iosTextBlurScroll = function (input) {
        if (!input) {
            return false;
        }
        var trueHeight = document.body.scrollHeight;
        //解决ios唤起键盘后留白
        var backPageSize = function () {
            setTimeout(() => {
                window.scroll(0, trueHeight - 10);
                window.innerHeight = window.outerHeight = trueHeight;
            }, 200);
        }

        input.onblur = backPageSize; // onblur是核心方法
    };

    return new Util();
}();
