/**
 * 工具层
 */
(function () {

    let Util = function () {};
    let _this = Util.prototype;

    /**
     * 下载文件
     * url：下载文件的远程地址
     */
    _this.download = function (url) {
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



        for (var i = 0; i < _paths.length; i++) {
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

    /**
     * 弹窗
     * 弹窗结束后执行callback()
     */
    _this.alert = function (text, callback) {
        if ($.alert) {
            $.alert(text, callback);
        } else {
            window.alert(text);
            callback && callback();
        }
        return false;
    };

    /**
     * 确认弹窗
     * 点击确定后出发success()
     */
    _this.confirm = function (text, success) {
        if (!window.confirm(text)) {
            return false;
        }
        success && success();
    };

    /**
     * 类数组转为真正数组
     */
    _this.like2Array = function (likeArray) {
        return Array.prototype.slice.call(likeArray);
    };

    /**
     * 人性化显示文件大小
     */
    _this.byteSize = function (size) {
        // 判断b
        if (size < 1024) {
            return size + 'byte';
        }

        // 判断kb
        size = (size / 1024).toFixed(2);
        if (size < 1024) {
            return size + 'KB';
        }

        // 判断mb
        size = (size / 1024).toFixed(2);
        if (size < 1024) {
            return size + 'MB';
        }

        // 判断gb
        size = (size / 1024).toFixed(2);
        if (size < 1024) {
            return size + 'GB';
        }

        // tb
        size = (size / 1024).toFixed(2);
        return size + 'TB';
    };

    /**
     * 传入一个query字符串，返回该query的参数对象
     */
    _this.urlParse = function (query) {
        var maps = {};
        query.split('&').forEach(function (value) {
            var item = value.split('=');
            maps[item[0]] = decodeURI(item[1]);
        });
        return maps;
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
     * 将query转为hash字符串
     */
    _this.query2Hash = function (query) {
        let query_trim = [];

        for (let i in query) {
            query_trim.push(i + '=' + query[i]);
        }

        return query_trim.join('&');
    };

    /**
     * hash字符串转为query数组
     */
    _this.hash2Query = function (hash) {
        if (hash == '') {
            return {};
        }
        var query = {};
        hash.split('&').forEach(function (value) {
            var item = value.split('=');
            query[item[0]] = decodeURI(item[1]);
        });
        return query;
    };

    /**
     * 获取文件的md5值
     */
    _this.getFileMd5 = function (file, callback) {
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
            // console.log("读取文件", currentChunk + 1, "/", chunks);
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
    };

    let BASE64 = function() {  
 
        // private property  
        let _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";  
     
        // public method for encoding  
        this.encode = function (input) {  
            var output = "";  
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;  
            var i = 0;  
            input = _utf8_encode(input);  
            while (i < input.length) {  
                chr1 = input.charCodeAt(i++);  
                chr2 = input.charCodeAt(i++);  
                chr3 = input.charCodeAt(i++);  
                enc1 = chr1 >> 2;  
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);  
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);  
                enc4 = chr3 & 63;  
                if (isNaN(chr2)) {  
                    enc3 = enc4 = 64;  
                } else if (isNaN(chr3)) {  
                    enc4 = 64;  
                }  
                output = output +  
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +  
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);  
            }  
            return output;  
        }  
     
        // public method for decoding  
        this.decode = function (input) {  
            var output = "";  
            var chr1, chr2, chr3;  
            var enc1, enc2, enc3, enc4;  
            var i = 0;  
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");  
            while (i < input.length) {  
                enc1 = _keyStr.indexOf(input.charAt(i++));  
                enc2 = _keyStr.indexOf(input.charAt(i++));  
                enc3 = _keyStr.indexOf(input.charAt(i++));  
                enc4 = _keyStr.indexOf(input.charAt(i++));  
                chr1 = (enc1 << 2) | (enc2 >> 4);  
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);  
                chr3 = ((enc3 & 3) << 6) | enc4;  
                output = output + String.fromCharCode(chr1);  
                if (enc3 != 64) {  
                    output = output + String.fromCharCode(chr2);  
                }  
                if (enc4 != 64) {  
                    output = output + String.fromCharCode(chr3);  
                }  
            }  
            output = _utf8_decode(output);  
            return output;  
        }  
     
        // private method for UTF-8 encoding  
        let _utf8_encode = function (string) {  
            string = string.replace(/\r\n/g,"\n");  
            var utftext = "";  
            for (var n = 0; n < string.length; n++) {  
                var c = string.charCodeAt(n);  
                if (c < 128) {  
                    utftext += String.fromCharCode(c);  
                } else if((c > 127) && (c < 2048)) {  
                    utftext += String.fromCharCode((c >> 6) | 192);  
                    utftext += String.fromCharCode((c & 63) | 128);  
                } else {  
                    utftext += String.fromCharCode((c >> 12) | 224);  
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);  
                    utftext += String.fromCharCode((c & 63) | 128);  
                }  
     
            }  
            return utftext;  
        }  
     
        // private method for UTF-8 decoding  
        let _utf8_decode = function (utftext) {  
            var string = "";  
            var i = 0;  
            var c = c1 = c2 = 0;  
            while ( i < utftext.length ) {  
                c = utftext.charCodeAt(i);  
                if (c < 128) {  
                    string += String.fromCharCode(c);  
                    i++;  
                } else if((c > 191) && (c < 224)) {  
                    c2 = utftext.charCodeAt(i+1);  
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));  
                    i += 2;  
                } else {  
                    c2 = utftext.charCodeAt(i+1);  
                    c3 = utftext.charCodeAt(i+2);  
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));  
                    i += 3;  
                }  
            }  
            return string;  
        }  
    }

    let _Base64 = new BASE64();
    _this.Base64Decode = _Base64.decode;
    _this.Base64Encode = _Base64.encode;

    return new Util();
})();
