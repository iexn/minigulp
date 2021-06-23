const toString = Object.prototype.toString;
const slice = Array.prototype.slice;


/** 
 * 获取当前设备类型
 */
export function device() {
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

/** 
 * 检测是否为微信环境
 */
export function isWechatDevice() {
    var ua = window.navigator.userAgent.toLowerCase();
    return !!(ua.match(/MicroMessenger/i) == 'micromessenger');
}

/**
 * 下载文件
 * url：下载文件的远程地址
 */
export function download(url) {
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
export function isDom(dom) {
    return (typeof HTMLElement === 'object') ?
        (dom instanceof HTMLElement) :
        (dom && typeof dom === 'object' && dom.nodeType === 1 && typeof dom.nodeName === 'string');
}

/**
 * 判断数据的具体类型
 */
export function type(mixin) {
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
            return isDom(mixin) ? "dom" : "object";
        } else {
            return _type;
        }
    }

    return mixin_type;
}

/**
 * 是否为空值，不包括0
 */
export function isEmpty(mixin) {
    let _type = type(mixin);
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
export function defaults(mixin, defaults = "", compareFunction = isEmpty) {
    return compareFunction(mixin) ? defaults : mixin;
}

/**
 * 获取某元素以浏览器左上角为原点的坐标
 */
export function offset(dom) {
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
export function likeItemObjectMap(maps, callback) {
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
export function getQuery(search = location.search) {
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
export function iosTextBlurScroll(input) {
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
export function fullZeroNumber(number, size = 2) {
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
export function getCalendarDate(ND = new Date) {
    if (ND.hasOwnProperty("__calendarDate__")) {
        return ND;
    }

    if (type(ND) == "string") {
        ND = ND.trim().replace(/-/g, "/");
    }

    if (isEmpty(ND)) {
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
        month: fullZeroNumber(ND.getMonth() + 1),
        // 日
        day: fullZeroNumber(ND.getDate()),
        // 小时
        hour: fullZeroNumber(ND.getHours()),
        // 分钟
        minute: fullZeroNumber(ND.getMinutes()),
        // 秒
        second: fullZeroNumber(ND.getSeconds()),
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
        return getCalendarDate(ND);
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
export function getHoursSecond(hoursFormat) {
    if (!/^\d\d\:\d\d(\:\d\d)?$/.test(hoursFormat)) {
        return false;
    }
    var mm = hoursFormat.split(":");
    return mm[0] * 3600 + mm[1] * 60;
}

/**
 * 类数组转为真正数组
 */
export function like2Array(likeArray) {
    return slice.call(likeArray);
}

/** 
 * 创建一个类数组结构，并且返回可塑造方法
 */
export function likeArray() {
    let struct = {
        length: 0
    };

    return {
        /** 
         * 追加类数组内容。可以追加一个非类数组的key存入，只不过最后将不能生成为真正的数组
         */
        add(value, key=struct.length) {
            if (key == "length") {
                trace("Error:util", "likeArray.add 不支持追加 \"length\"字段");
                return key;
            }
            struct[key] = value;
            struct.length += 1;
            return key;
        },
        remove(key) {
            if (isEmpty(key) || key == "length" || !struct.hasOwnProperty(key)) {
                return false;
            }
            delete struct[key];
            struct.length -= 1;
            return true;
        },
        /** 
         * 是类数组就返回数组，不是类数组返回对象（没有length属性）
         */
        get() {
            if (Object.keys(slice.call(struct)).length == struct.length) {
                return slice.call(struct);
            } else {
                let res = Object.assign({}, struct);
                delete res.length;
                return res;
            }
        },
        __name__: "likeArray"
    }
}


/**
 * 人性化显示文件大小
 */
export function byteSize(size, digits = 2) {
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
export function query2Hash(query) {
    let query_trim = [];

    for (let i in query) {
        query_trim.push(i + '=' + query[i]);
    }

    return query_trim.join('&');
}

/**
 * hash字符串转为query数组
 */
export function hash2Query(hash) {
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
export function getFileMd5(file, callback) {
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
 * arraybuffer内容转为字符串
 */
export function buffer2String(buffer) {
    let encodedString = String.fromCodePoint.apply(null, new Uint8Array(buffer));
    // 没有这一步中文会乱码
    let decodedString = decodeURIComponent(escape(encodedString));
    return decodedString;

}

/** 
 * base64转blob
 */
export function base642Blob(base64Data, defaultmime="data:image/jpg;base64") {
    if (base64Data.indexOf("data:") != 0) {
        base64Data = defaultmime + "," + base64Data;
    }
    var byteString;
    if (base64Data.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(base64Data.split(',')[1]);
    else
        byteString = unescape(base64Data.split(',')[1]);
    var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {
        type: mimeString
    });
}

/** 
 * blob转file
 */
export function blob2File(blob, name, options={}) {
    // blob.lastModifiedDate = new Date();
    // blob.name = name;
    // return blob;
    options = Object.assign({
        type: "image/jpg"
    }, options);
    return new File([blob], name, options);
}

/** 
 * 获取键盘按键format
 */
export function boardFormat({ ctrlKey, altKey, shiftKey, keyCode }) {
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
export function selectRange(DOM, end, start = 0) {
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
export function getSelectText() {
    return window.getSelection ? window.getSelection().toString() :     
    document.selection.createRange().text;
}

/** 
 * 修改Object.assign，不向前追加前者没有的属性
 */
export function objectInset(target={}, source={}) {
    for (let i in target) {
        if (source.hasOwnProperty(i)) {
            target[i] = source[i];
        }
    }

    return target;
}

/** 
 * 正则匹配
 */
export function is(pattern, value="", options={}) {
    if (type(pattern) == "regexp") {
        return pattern.test(value);
    }

    let rules = function (pattern, value) {
        switch (pattern) {
            case "empty":
                pattern = '^$';
                break;
            case "url":
                pattern = `^(((http|https)):\\/\\/)[\\w-]+(\\.[\\w-]+)+([\\w.,@?^=%&:\\/~+#-]*[\\w@?^=%&\\/~+#-])?$`;
                break;
            case "urlsimple":
                pattern = `^(((http|https)):\\/\\/)?[\\w-]+(\\.[\\w-]+)+([\\w.,@?^=%&:\\/~+#-]*[\\w@?^=%&\\/~+#-])?$`;
                break;
            case "host":
                pattern = `^[\\w-]+(\\.[\\w-]+)+$`;
                break;
            case "nosymbol":
                pattern = `^[^\\<\\>\\{\\}]*$`;
                break;
            default:
                throw "is 使用了不支持的验证规则";
        }

        pattern = new RegExp(pattern);

        return pattern.test(value); 
    };

    if (pattern.indexOf("|") != -1) {
        let pattern_ors = pattern.split("|");
        let or_valid = false;

        for (let i = 0; i < pattern_ors.length; i++) {
            let pattern_or = pattern_ors[i];
            
            if (pattern_or.indexOf("&") != -1) {
                let pattern_ands = pattern_or.split("&");
                let and_valid = true;

                for (let j = 0; j < pattern_ands.length; j++) {
                    let pattern_and = pattern_ands[j];
                    if (!rules(pattern_and, value)) {
                        and_valid = false;
                    }
                }

                if (and_valid) {
                    or_valid = true;
                }
            } else {
                if (rules(pattern_or, value)) {
                    or_valid = true;
                }
            }
        }

        return or_valid;
    } else {
        return rules(pattern, value);
    }
}

const astralRange = /\ud83c[\udffb-\udfff](?=\ud83c[\udffb-\udfff])|(?:[^\ud800-\udfff][\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]?|[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/g
class EmojiCharString {
    constructor (string) {
        if (typeof string !== 'string') {
        throw new Error('Input must be a string')
        }
        this._string = string
        this._match = string.match(astralRange) || []
    }
    get length () {
        return this._match.length
    }

    toString () {
        return this._string
    }

    /**
     * Reverse the string in place
     * @return {[String]} [The reversed string]
     */
    reverse () {
        return this._match.reverse().join('')
    }

    /**
     * The substring() method returns a subset of a string between begin index and end index
     * @param  {Number} begin [begin index]
     * @param  {Number} end   [end index]
     * @return {[String]}     [A new string containing the extracted section of the given string.]
     */
    substring (begin = 0, end) {
        let strLen = this.length
        let indexStart = (parseInt(begin, 10) || 0) < 0 ? 0 : (parseInt(begin, 10) || 0)
        let indexEnd
        if (typeof end === 'undefined') {
        indexEnd = strLen
        } else {
        indexEnd = (parseInt(end, 10) || 0) < 0 ? 0 : (parseInt(end, 10) || 0)
        }

        if (indexStart > strLen) { indexStart = strLen }
        if (indexEnd > strLen) { indexEnd = strLen }

        if (indexStart > indexEnd) {
        [indexStart, indexEnd] = [indexEnd, indexStart]
        }
        return this._match.slice(indexStart, indexEnd).join('')
    }

    /**
     * The substr() method return the characters in a string beginning at the specified location through the specified number of characters.
     * @param  {Number} begin [Location at which to begin extracting characters]
     * @param  {Number} len   [The number of characters to extract]
     * @return {[String]}     [A new string containing the extracted section of the given string]
     */
    substr (begin = 0, len) {
        let strLen = this.length
        let indexStart = parseInt(begin, 10) || 0
        let indexEnd
        if (indexStart >= strLen || len <= 0) {
        return ''
        } else if (indexStart < 0) {
        indexStart = Math.max(0, indexStart + strLen)
        }

        if (typeof len === 'undefined') {
        indexEnd = strLen
        } else {
        indexEnd = indexStart + (parseInt(len, 10) || 0)
        }

        return this._match.slice(indexStart, indexEnd).join('')
    }
}

/** 
 * 计算包括表情的字符串字数统计
 */         
export function emojiString(string) {
    return new EmojiCharString(string);
}
