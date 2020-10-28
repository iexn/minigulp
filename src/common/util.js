const util = function () {
    const util = {};
    const toString = Object.prototype.toString;
    const slice = Array.prototype.slice;

    /** 
     * 获取当前设备类型
     */
    util.device = function () {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone",
            "SymbianOS", "Windows Phone",
            "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }

        // 如果未找到以上标识，视为pc端
        if (flag) {
            return "pc";
        }

        // 安卓
        if (userAgentInfo.indexOf('Android') > -1 || userAgentInfo.indexOf('Linux') > -1) {
            return "android";
        }

        // iOS
        if (!!userAgentInfo.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
            return "ios";
        }

        return "unknown";
    }

    util.isWechatDevice = function () {
        var ua = window.navigator.userAgent.toLowerCase();
        return !!(ua.match(/MicroMessenger/i) == 'micromessenger');
    }

    /**
     * 下载文件
     * url：下载文件的远程地址
     */
    util.download = function (url) {
        if (window.document) {
            let a = document.createElement("a");
            a.href = url;

            // 支持download时使用download，不支持时使用a标签跳转
            if ("download" in a) {
                a.setAttribute("download", "");
            } else {
                a.setAttribute("target", "_blank");
            }

            document.body.appendChild(a);
            a.click();

            setTimeout(() => {
                document.body.removeChild(a);
            }, 2000);
        } else {
            window.open(url);
        }
    }

    /**
     * 判断传入的变量是否是一个dom对象
     */
    util.isDom = function (dom) {
        return (typeof HTMLElement === 'object') ?
            (dom instanceof HTMLElement) :
            (dom && typeof dom === 'object' && dom.nodeType === 1 && typeof dom.nodeName === 'string');
    }

    /**
     * 判断数据的具体类型
     */
    util.type = function (mixin) {
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
            let _type = class2type[toString.call(mixin)];
            if (!_type) {
                return util.isDom(mixin) ? "dom" : "object";
            } else {
                return _type;
            }
        }

        return mixin_type;
    }

    /**
     * 是否为空值，不包括0
     */
    util.isEmpty = function (mixin) {
        let _type = util.type(mixin);
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
    }

    /** 
     * 符合 type() 函数的验证，如果验证不成功适用默认值
     */
    util.defaults = function (mixin, defaults = "", compareFunction = util.isEmpty) {
        return compareFunction(mixin) ? defaults : mixin;
    }

    /**
     * 获取某元素以浏览器左上角为原点的坐标
     */
    util.offset = function (dom) {
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
    }

    /**
     * 从1开始的对象，遍历
     * @param {Object} maps
     * @param {Function} callback
     */
    util.likeItemObjectMap = function (maps, callback) {
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
    }

    /** 
     * 获取get参数
     */
    util.getQuery = function (search = location.search) {
        let query = {};
        if (search.indexOf("?") != -1) {
            search = search.split("?")[1];
        }

        search.split("&").map(item => {
            let srt = item.split("=");
            if (srt[0] != "") {
                query[srt[0]] = srt[1];
            }
        });
        return query;
    }

    /** 
     * textarea不回弹
     */
    util.iosTextBlurScroll = function (input) {
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
    }

    /**
     * 数字前补0变为字符串数字
     */
    util.fullZeroNumber = function (number, size = 2) {
        let __number = number + "";
        if (isNaN(__number)) {
            return number;
        }
        while(__number.length < size) {
            __number = "0" + __number;
        }
        return __number;
    }

    /**
     * 获取设置时间的小时分钟秒
     */
    util.getCalendarDate = function (ND = new Date) {
        if (ND.hasOwnProperty("__calendarDate__")) {
            return ND;
        }

        if (util.type(ND) == "string") {
            ND = ND.trim().replace(/-/g, "/");
        }

        if (util.isEmpty(ND)) {
            ND = new Date;
        } else {
            ND = new Date(ND);
        }

        let NW = {
            // 时间对象
            ND: ND,
            // 年
            year: ND.getFullYear() + "",
            // 月
            month: util.fullZeroNumber(ND.getMonth() + 1),
            // 日
            day: util.fullZeroNumber(ND.getDate()),
            // 小时
            hour: util.fullZeroNumber(ND.getHours()),
            // 分钟
            minute: util.fullZeroNumber(ND.getMinutes()),
            // 秒
            second: util.fullZeroNumber(ND.getSeconds()),
            // 周
            week: ND.getDay() == 0 ? "7" : ND.getDay() + "",
            // 当前时间毫秒时间戳
            timestamp: ND.getTime() + "",
            // 正常时间戳
            time: parseInt(ND.getTime() / 1000) + ""
        };

        Object.defineProperty(NW, "__calendarDate__", {
            enumerable: false,
            value: ND,
            writable: false
        });

        NW.secondTimestamp = NW.timestamp.slice(0, -3);

        // 格式化显示
        NW.format = function (format = "Y-m-d") {
            let formatExec = /[YmdHis]/g;
            let formatMap = {
                "Y": NW.year,
                "m": NW.month,
                "d": NW.day,
                "H": NW.hour,
                "i": NW.minute,
                "s": NW.second,
                "w": NW.week
            };
            let p = null;
            let text = format;
            while (p = formatExec.exec(format)) {
                text = text.replace(p[0], formatMap[p[0]]);
            }
            return text;
        }

        function overall(ND) {
            if (ND.getTime() == NW.timestamp) {
                return NW;
            }
            return util.getCalendarDate(ND);
        }

        // 依据当天的统计信息
        NW.overall = {};
        let overallMap = {
            day: [NW.year, +NW.month - 1, NW.day],
            firstOfYear: [NW.year, 0, 1],
            endOfYear: [+NW.year + 1, 0, 0],
            firstOfMonth: [NW.year, +NW.month - 1, 1],
            endOfMonth: [NW.year, NW.month, 0],
        };

        for (let name in overallMap) {
            NW.overall[name] = function () {
                return overall(new Date(...overallMap[name]));
            }
        }

        // 计算范围距离
        NW.step = {
            day: function () {
                return (Math.floor(NW.step.secondOfYear / 86400) + 1) + "";
            },
            week: function () {
                return (Math.floor((NW.step.day() - NW.week) / 7) + 1) + "";
            },
            secondOfYear: function () {
                return (NW.overall.day().secondTimestamp - NW.overall.firstOfYear().secondTimestamp) + "";
            }
        };

        return NW;
    }

    /** 
     * 获取 xx:xx 转为当天秒数
     */
    util.getHoursSecond = function (hoursFormat) {
        if (!/^\d\d\:\d\d(\:\d\d)?$/.test(hoursFormat)) {
            return false;
        }
        var mm = hoursFormat.split(":");
        return mm[0] * 3600 + mm[1] * 60;
    }

    /**
     * 类数组转为真正数组
     */
    util.like2Array = function (likeArray) {
        return slice.call(likeArray);
    }

    /**
     * 人性化显示文件大小
     */
    util.byteSize = function (size, digits = 2) {
        // 判断b
        if (size < 1024) {
            return size + 'byte';
        }

        // 判断kb
        size = (size / 1024).toFixed(digits);
        if (size < 1024) {
            return size + 'KB';
        }

        // 判断mb
        size = (size / 1024).toFixed(digits);
        if (size < 1024) {
            return size + 'MB';
        }

        // 判断gb
        size = (size / 1024).toFixed(digits);
        if (size < 1024) {
            return size + 'GB';
        }

        // tb
        size = (size / 1024).toFixed(digits);
        return size + 'TB';
    }

    /**
     * 将query转为hash字符串
     */
    util.query2Hash = function (query) {
        let query_trim = [];

        for (let i in query) {
            query_trim.push(i + '=' + query[i]);
        }

        return query_trim.join('&');
    }

    /**
     * hash字符串转为query数组
     */
    util.hash2Query = function (hash) {
        if (hash == '') {
            return {};
        }
        var query = {};
        hash.split('&').forEach(function (value) {
            var item = value.split('=');
            // query[item[0]] = decodeURIComponent(item[1]);
            query[item[0]] = item[1];
        });
        return query;
    }

    /**
     * 获取文件的md5值
     */
    util.getFileMd5 = function (file, callback) {
        //声明必要的变量
        let fileReader = new FileReader();
        //文件分割方法（注意兼容性）
        let blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice,

            //文件每块分割2M，计算分割详情
            chunkSize = 2097152,
            chunks = Math.ceil(file.size / chunkSize),
            currentChunk = 0,

            //创建md5对象（基于SparkMD5）
            spark = new SparkMD5();
        let filename = file.name;
        let filesize = file.size / 1024;
        filesize = filesize.toFixed(2);
        //每块文件读取完毕之后的处理
        fileReader.onload = function (e) {
            // debug("读取文件", currentChunk + 1, "/", chunks);
            //每块交由sparkMD5进行计算
            spark.appendBinary(e.target.result);
            currentChunk++;

            //如果文件处理完成计算MD5，如果还有分片继续处理
            if (currentChunk < chunks) {
                loadNext();
            } else {
                // 前台显示Hash
                callback && callback({
                    name: filename,
                    size: filesize,
                    md5: spark.end()
                });
            }
        };

        //处理单片文件的上传
        function loadNext() {
            var start = currentChunk * chunkSize,
                end = start + chunkSize >= file.size ? file.size : start + chunkSize;

            fileReader.readAsBinaryString(blobSlice.call(file, start, end));
        }

        loadNext();
    }

    /** 
     * 获取键盘按键format
     */
    util.boardFormat = function ({ ctrlKey, altKey, shiftKey, keyCode }) {
        let __map = [];

        if (ctrlKey) {
            __map.push("ctrl");
        }

        if (altKey) {
            __map.push("alt");
        }

        if (shiftKey) {
            __map.push("shift");
        }

        let keyCodes = {
            8: "Backspace",
            9: "Tab",
            13: "Enter",
            19: "Pause",
            20: "CapsLock",
            27: "Esc",
            32: " ",
            33: "PageUp",
            34: "PageDown",
            35: "End",
            36: "Home",
            37: "Left",
            38: "Up",
            39: "Right",
            40: "Down",
            45: "Insert",
            46: "Delete",
            48: "0",
            49: "1",
            50: "2",
            51: "3",
            52: "4",
            53: "5",
            54: "6",
            55: "7",
            56: "8",
            57: "9",
            65: "a",
            66: "b",
            67: "c",
            68: "d",
            69: "e",
            70: "f",
            71: "g",
            72: "h",
            73: "i",
            74: "j",
            75: "k",
            76: "l",
            77: "m",
            78: "n",
            79: "o",
            80: "p",
            81: "q",
            82: "r",
            83: "s",
            84: "t",
            85: "u",
            86: "v",
            87: "w",
            88: "x",
            89: "y",
            90: "z",
            93: "ContextMenu",
            96: "0",
            97: "1",
            98: "2",
            99: "3",
            100: "4",
            101: "5",
            102: "6",
            103: "7",
            104: "8",
            105: "9",
            106: "*",
            107: "+",
            109: "-",
            110: ".",
            111: "/",
            112: "F1",
            113: "F2",
            114: "F3",
            115: "F4",
            117: "F6",
            118: "F7",
            119: "F8",
            120: "F9",
            121: "F10",
            122: "F11",
            123: "F12",
            144: "NumLock",
            145: "ScrollLock",
            186: ";",
            187: "=",
            188: ",",
            189: "-",
            190: ".",
            191: "/",
            192: "`",
            219: "[",
            220: "\\",
            221: "]",
            222: "'",
        };

        __map.push(keyCodes[keyCode]);

        return __map.join("_").toUpperCase();
    }

    /** 
     * 选中input中部分文字
     */
    util.selectRange = function (DOM, end, start = 0) {
        if (DOM.createTextRange) {
            //IE浏览器
            var range = DOM.createTextRange();
            range.moveEnd("character", end);
            range.moveStart("character", start);
            range.select();
        } else {
            // 非IE浏览器
            DOM.setSelectionRange(start, end);
            DOM.focus();
        }
    }

    /** 
     * 获取页面上已选中文字文本
     */
    util.getSelectText = function () {
        return window.getSelection ? window.getSelection().toString() :     
        document.selection.createRange().text;
    }

    /**
     * 获取所有cookie参数
     */
    util.cookies = function () {
        const cookie = {};
        if (document.cookie) {
            document.cookie
                .trim()
                .split(";")
                .map(__cookieSplit => {
                    let [cookieName, cookieValue] = __cookieSplit.split("=");
                    cookie[cookieName.trim()] = cookieValue.trim();
                });
        }
        return cookie;
    }

    util.cookie = function (name, value) {
        const cookie = _this.cookies();
        if (value === undefined) {
            // 获取
            if (name === undefined) {
                return "";
            } else {
                return cookie[name];
            }
        } else {
            // 设置
            if (value == null) {
                delete cookie[name];
            } else {
                cookie[name] = value;
            }

            var Days = 60 * 86400000;
            var exp = new Date();
            exp.setTime(exp.getTime() + Days);

            let cookieString = ["path=/", "expires=" + exp.toGMTString()];

            for (let key in cookie) {
                cookieString.push(`${key}=${escape(cookie[key])}`);
            }

            document.cookie = cookieString.join(";");
        }
    }

    util.formDataMap = function (formData, loop = function (value, key) { return value }) {
        let data = {};
        for (let key of formData.keys()) {
            let value = loop(formData.get(key), key);;
            if (value === false) {
                continue;
            }
            data[key] = value;
        }
        return data;
    }

    util.lang = function (key, language, err = function () {}) {
        const langs = lang[language];
    
        if (!langs) {
            err && err(`[Lang]: 语言包 ${language} 不可用，可能未设置语言包`);
            return "";
        }
    
        if (!langs.hasOwnProperty(key)) {
            err && err("[Lang]: 未找到的语言包内容，加载关键字：" + key);
            return "";
        }
    
        let value = langs[key];
    
        if (typeof value != "string") {
            err && err(`[Lang]: 语言包关键字 ${key} 加载错误：可能设置了一个不可读取或非字符串类型的语言`);
            return "";
        }
    
        return value;
    }
    
    //= block:main

    return util;
}();
