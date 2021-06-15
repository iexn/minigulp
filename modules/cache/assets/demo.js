'use strict';

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function () {
  if (typeof Object.assign != 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, "assign", {
      value: function assign(target, varArgs) {
        // .length of function is 2
        'use strict';

        if (target == null) {
          // TypeError if undefined or null
          throw new TypeError('Cannot convert undefined or null to object');
        }

        var to = Object(target);

        for (var index = 1; index < arguments.length; index++) {
          var nextSource = arguments[index];

          if (nextSource != null) {
            // Skip over if undefined or null
            for (var nextKey in nextSource) {
              // Avoid bugs when hasOwnProperty is shadowed
              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }

        return to;
      },
      writable: true,
      configurable: true
    });
  }

  if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
      value: function value(valueToFind, fromIndex) {
        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        } // 1. Let O be ? ToObject(this value).


        var o = Object(this); // 2. Let len be ? ToLength(? Get(O, "length")).

        var len = o.length >>> 0; // 3. If len is 0, return false.

        if (len === 0) {
          return false;
        } // 4. Let n be ? ToInteger(fromIndex).
        //    (If fromIndex is undefined, this step produces the value 0.)


        var n = fromIndex | 0; // 5. If n ≥ 0, then
        //  a. Let k be n.
        // 6. Else n < 0,
        //  a. Let k be len + n.
        //  b. If k < 0, let k be 0.

        var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        function sameValueZero(x, y) {
          return x === y || typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y);
        } // 7. Repeat, while k < len


        while (k < len) {
          // a. Let elementK be the result of ? Get(O, ! ToString(k)).
          // b. If SameValueZero(valueToFind, elementK) is true, return true.
          if (sameValueZero(o[k], valueToFind)) {
            return true;
          } // c. Increase k by 1. 


          k++;
        } // 8. Return false


        return false;
      }
    });
  }

  if (!Object.keys) {
    Object.keys = function () {
      var hasOwnProperty = Object.prototype.hasOwnProperty,
          hasDontEnumBug = !{
        toString: null
      }.propertyIsEnumerable('toString'),
          dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'],
          dontEnumsLength = dontEnums.length;
      return function (obj) {
        if (_typeof(obj) !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object');
        var result = [];

        for (var prop in obj) {
          if (hasOwnProperty.call(obj, prop)) result.push(prop);
        }

        if (hasDontEnumBug) {
          for (var i = 0; i < dontEnumsLength; i++) {
            if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
          }
        }

        return result;
      };
    }();
  }

  ;

  if (!Object.values) {
    Object.values = function (obj) {
      if (obj !== Object(obj)) throw new TypeError('Object.values called on a non-object');
      var val = [],
          key;

      for (key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          val.push(obj[key]);
        }
      }

      return val;
    };
  } // 加载常量
  // app存储


  var APP_STORAGE = "app"; // session存储

  var SESSION_STORAGE = "session"; // local存储

  var LOCAL_STORAGE = "local"; // 默认语言

  var ZH_CN = "zh_cn"; // 模板标识符

  var OBJTYPE = "DOMMAP"; // ajax请求方式

  var AJAX_REQUEST_GET = "GET";
  var AJAX_REQUEST_POST = "POST"; // ajax参数格式

  var AJAX_PARAMS_MATHOD_JSON = "json";
  var AJAX_PARAMS_MATHOD_FORMDATA = "form_data";
  var AJAX_PARAMS_MATHOD_STRINGIFY = "stringify";

  (function (factory) {
    var lang = {
      zh_cn: {}
    };

    var util = function () {
      var util = {};
      var toString = Object.prototype.toString;
      var slice = Array.prototype.slice;
      /** 
       * 获取当前设备类型
       */

      util.device = function () {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
        var flag = true;

        for (var v = 0; v < Agents.length; v++) {
          if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
          }
        } // 如果未找到以上标识，视为pc端


        if (flag) {
          return "pc";
        } // 安卓


        if (userAgentInfo.indexOf('Android') > -1 || userAgentInfo.indexOf('Linux') > -1) {
          return "android";
        } // iOS


        if (!!userAgentInfo.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
          return "ios";
        }

        return "unknown";
      };

      util.isWechatDevice = function () {
        var ua = window.navigator.userAgent.toLowerCase();
        return !!(ua.match(/MicroMessenger/i) == 'micromessenger');
      };
      /**
       * 下载文件
       * url：下载文件的远程地址
       */


      util.download = function (url) {
        if (window.document) {
          var a = document.createElement("a");
          a.href = url; // 支持download时使用download，不支持时使用a标签跳转

          if ("download" in a) {
            a.setAttribute("download", "");
          } else {
            a.setAttribute("target", "_blank");
          }

          document.body.appendChild(a);
          a.click();
          setTimeout(function () {
            document.body.removeChild(a);
          }, 2000);
        } else {
          window.open(url);
        }
      };
      /**
       * 判断传入的变量是否是一个dom对象
       */


      util.isDom = function (dom) {
        return (typeof HTMLElement === "undefined" ? "undefined" : _typeof(HTMLElement)) === 'object' ? dom instanceof HTMLElement : dom && _typeof(dom) === 'object' && dom.nodeType === 1 && typeof dom.nodeName === 'string';
      };
      /**
       * 判断数据的具体类型
       */


      util.type = function (mixin) {
        if (mixin == null) {
          return mixin + "";
        }

        var class2type = {
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

        var mixin_type = _typeof(mixin);

        if (mixin_type === 'undefined') {
          return 'undefined';
        }

        if (mixin_type === 'object' || mixin_type === "function") {
          var _type = class2type[toString.call(mixin)];

          if (!_type) {
            return util.isDom(mixin) ? "dom" : "object";
          } else {
            return _type;
          }
        }

        return mixin_type;
      };
      /**
       * 是否为空值，不包括0
       */


      util.isEmpty = function (mixin) {
        var _type = util.type(mixin);

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
      /** 
       * 符合 type() 函数的验证，如果验证不成功适用默认值
       */


      util.defaults = function (mixin) {
        var defaults = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
        var compareFunction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : util.isEmpty;
        return compareFunction(mixin) ? defaults : mixin;
      };
      /**
       * 获取某元素以浏览器左上角为原点的坐标
       */


      util.offset = function (dom) {
        var top = dom.offsetTop;
        var left = dom.offsetLeft;
        var width = dom.offsetWidth;
        var height = dom.offsetHeight;

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
       * 从1开始的对象，遍历
       * @param {Object} maps
       * @param {Function} callback
       */


      util.likeItemObjectMap = function (maps, callback) {
        var i = 0;
        var result = [];
        var map; // eslint-disable-next-line no-constant-condition

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
      /** 
       * 获取get参数
       */


      util.getQuery = function () {
        var search = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : location.search;
        var query = {};

        if (search.indexOf("?") != -1) {
          search = search.split("?")[1];
        }

        search.split("&").map(function (item) {
          var srt = item.split("=");

          if (srt[0] != "") {
            query[srt[0]] = srt[1];
          }
        });
        return query;
      };
      /** 
       * textarea不回弹
       */


      util.iosTextBlurScroll = function (input) {
        if (!input) {
          return false;
        }

        var trueHeight = document.body.scrollHeight; //解决ios唤起键盘后留白

        var backPageSize = function backPageSize() {
          setTimeout(function () {
            window.scroll(0, trueHeight - 10);
            window.innerHeight = window.outerHeight = trueHeight;
          }, 200);
        };

        input.onblur = backPageSize; // onblur是核心方法
      };
      /**
       * 数字前补0变为字符串数字
       */


      util.fullZeroNumber = function (number) {
        var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

        var __number = number + "";

        if (isNaN(__number)) {
          return number;
        }

        while (__number.length < size) {
          __number = "0" + __number;
        }

        return __number;
      };
      /**
       * 获取设置时间的小时分钟秒
       */


      util.getCalendarDate = function () {
        var ND = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();

        if (ND.hasOwnProperty("__calendarDate__")) {
          return ND;
        }

        if (util.type(ND) == "string") {
          ND = ND.trim().replace(/-/g, "/");
        }

        if (util.isEmpty(ND)) {
          ND = new Date();
        } else {
          ND = new Date(ND);
        }

        var NW = {
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
        NW.secondTimestamp = NW.timestamp.slice(0, -3); // 格式化显示

        NW.format = function () {
          var format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Y-m-d";
          var formatExec = /[YmdHis]/g;
          var formatMap = {
            "Y": NW.year,
            "m": NW.month,
            "d": NW.day,
            "H": NW.hour,
            "i": NW.minute,
            "s": NW.second,
            "w": NW.week
          };
          var p = null;
          var text = format;

          while (p = formatExec.exec(format)) {
            text = text.replace(p[0], formatMap[p[0]]);
          }

          return text;
        };

        function overall(ND) {
          if (ND.getTime() == NW.timestamp) {
            return NW;
          }

          return util.getCalendarDate(ND);
        } // 依据当天的统计信息


        NW.overall = {};
        var overallMap = {
          day: [NW.year, +NW.month - 1, NW.day],
          firstOfYear: [NW.year, 0, 1],
          endOfYear: [+NW.year + 1, 0, 0],
          firstOfMonth: [NW.year, +NW.month - 1, 1],
          endOfMonth: [NW.year, NW.month, 0]
        };

        var _loop = function _loop(_name) {
          NW.overall[_name] = function () {
            return overall(_construct(Date, _toConsumableArray(overallMap[_name])));
          };
        };

        for (var _name in overallMap) {
          _loop(_name);
        } // 计算范围距离


        NW.step = {
          day: function day() {
            return Math.floor(NW.step.secondOfYear / 86400) + 1 + "";
          },
          week: function week() {
            return Math.floor((NW.step.day() - NW.week) / 7) + 1 + "";
          },
          secondOfYear: function secondOfYear() {
            return NW.overall.day().secondTimestamp - NW.overall.firstOfYear().secondTimestamp + "";
          }
        };
        return NW;
      };
      /** 
       * 获取 xx:xx 转为当天秒数
       */


      util.getHoursSecond = function (hoursFormat) {
        if (!/^\d\d\:\d\d(\:\d\d)?$/.test(hoursFormat)) {
          return false;
        }

        var mm = hoursFormat.split(":");
        return mm[0] * 3600 + mm[1] * 60;
      };
      /**
       * 类数组转为真正数组
       */


      util.like2Array = function (likeArray) {
        return slice.call(likeArray);
      };
      /**
       * 人性化显示文件大小
       */


      util.byteSize = function (size) {
        var digits = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

        // 判断b
        if (size < 1024) {
          return size + 'byte';
        } // 判断kb


        size = (size / 1024).toFixed(digits);

        if (size < 1024) {
          return size + 'KB';
        } // 判断mb


        size = (size / 1024).toFixed(digits);

        if (size < 1024) {
          return size + 'MB';
        } // 判断gb


        size = (size / 1024).toFixed(digits);

        if (size < 1024) {
          return size + 'GB';
        } // tb


        size = (size / 1024).toFixed(digits);
        return size + 'TB';
      };
      /**
       * 将query转为hash字符串
       */


      util.query2Hash = function (query) {
        var query_trim = [];

        for (var i in query) {
          query_trim.push(i + '=' + query[i]);
        }

        return query_trim.join('&');
      };
      /**
       * hash字符串转为query数组
       */


      util.hash2Query = function (hash) {
        if (hash == '') {
          return {};
        }

        var query = {};
        hash.split('&').forEach(function (value) {
          var item = value.split('='); // query[item[0]] = decodeURIComponent(item[1]);

          query[item[0]] = item[1];
        });
        return query;
      };
      /**
       * 获取文件的md5值
       */


      util.getFileMd5 = function (file, callback) {
        //声明必要的变量
        var fileReader = new FileReader(); //文件分割方法（注意兼容性）

        var blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice,
            //文件每块分割2M，计算分割详情
        chunkSize = 2097152,
            chunks = Math.ceil(file.size / chunkSize),
            currentChunk = 0,
            //创建md5对象（基于SparkMD5）
        spark = new SparkMD5();
        var filename = file.name;
        var filesize = file.size / 1024;
        filesize = filesize.toFixed(2); //每块文件读取完毕之后的处理

        fileReader.onload = function (e) {
          // debug("读取文件", currentChunk + 1, "/", chunks);
          //每块交由sparkMD5进行计算
          spark.appendBinary(e.target.result);
          currentChunk++; //如果文件处理完成计算MD5，如果还有分片继续处理

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
        }; //处理单片文件的上传


        function loadNext() {
          var start = currentChunk * chunkSize,
              end = start + chunkSize >= file.size ? file.size : start + chunkSize;
          fileReader.readAsBinaryString(blobSlice.call(file, start, end));
        }

        loadNext();
      };
      /** 
       * 获取键盘按键format
       */


      util.boardFormat = function (_ref) {
        var ctrlKey = _ref.ctrlKey,
            altKey = _ref.altKey,
            shiftKey = _ref.shiftKey,
            keyCode = _ref.keyCode;
        var __map = [];

        if (ctrlKey) {
          __map.push("ctrl");
        }

        if (altKey) {
          __map.push("alt");
        }

        if (shiftKey) {
          __map.push("shift");
        }

        var keyCodes = {
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
          222: "'"
        };

        __map.push(keyCodes[keyCode]);

        return __map.join("_").toUpperCase();
      };
      /** 
       * 选中input中部分文字
       */


      util.selectRange = function (DOM, end) {
        var start = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

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
      };
      /** 
       * 获取页面上已选中文字文本
       */


      util.getSelectText = function () {
        return window.getSelection ? window.getSelection().toString() : document.selection.createRange().text;
      };
      /**
       * 获取所有cookie参数
       */


      util.cookies = function () {
        var cookie = {};

        if (document.cookie) {
          document.cookie.trim().split(";").map(function (__cookieSplit) {
            var _cookieSplit$split = __cookieSplit.split("="),
                _cookieSplit$split2 = _slicedToArray(_cookieSplit$split, 2),
                cookieName = _cookieSplit$split2[0],
                cookieValue = _cookieSplit$split2[1];

            cookie[cookieName.trim()] = cookieValue.trim();
          });
        }

        return cookie;
      };

      util.cookie = function (name, value) {
        var cookie = _this.cookies();

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
          var cookieString = ["path=/", "expires=" + exp.toGMTString()];

          for (var key in cookie) {
            cookieString.push("".concat(key, "=").concat(escape(cookie[key])));
          }

          document.cookie = cookieString.join(";");
        }
      };

      util.formDataMap = function (formData) {
        var loop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (value, key) {
          return value;
        };
        var data = {};

        var _iterator = _createForOfIteratorHelper(formData.keys()),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var key = _step.value;
            var value = loop(formData.get(key), key);
            ;

            if (value === false) {
              continue;
            }

            data[key] = value;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        return data;
      };

      util.lang = function (key, language) {
        var err = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
        var langs = lang[language];

        if (!langs) {
          err && err("[Lang]: \u8BED\u8A00\u5305 ".concat(language, " \u4E0D\u53EF\u7528\uFF0C\u53EF\u80FD\u672A\u8BBE\u7F6E\u8BED\u8A00\u5305"));
          return "";
        }

        if (!langs.hasOwnProperty(key)) {
          err && err("[Lang]: 未找到的语言包内容，加载关键字：" + key);
          return "";
        }

        var value = langs[key];

        if (typeof value != "string") {
          err && err("[Lang]: \u8BED\u8A00\u5305\u5173\u952E\u5B57 ".concat(key, " \u52A0\u8F7D\u9519\u8BEF\uFF1A\u53EF\u80FD\u8BBE\u7F6E\u4E86\u4E00\u4E2A\u4E0D\u53EF\u8BFB\u53D6\u6216\u975E\u5B57\u7B26\u4E32\u7C7B\u578B\u7684\u8BED\u8A00"));
          return "";
        }

        return value;
      }; //= block:main


      return util;
    }();

    var cache = function () {
      var cache = {};
      var appStorage = {};
      var timeKeySuffix = "~overdueTime";

      cache.get = function (key) {
        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : APP_STORAGE;
        var time = util.getCalendarDate(new Date());
        var timeKey = key + timeKeySuffix; // 过期时间

        var storageTime; // 数据

        var storageValue; // 获取数据及过期时间

        switch (type) {
          case APP_STORAGE:
            var ase = appStorage[key];

            if (util.isEmpty(ase)) {
              ase = {
                storageTime: null,
                storageValue: null
              };
            }

            storageTime = ase.overdueTime;
            storageValue = ase.data;
            break;

          case SESSION_STORAGE:
            storageTime = sessionStorage.getItem(timeKey);
            storageValue = sessionStorage.getItem(key);

          case LOCAL_STORAGE:
            storageTime = localStorage.getItem(timeKey);
            storageValue = localStorage.getItem(key);
        } // 未获取到时


        if (storageValue === null || storageTime === null) {
          return null;
        } // json字符串转为object


        try {
          storageValue = JSON.parse(storageValue);
        } catch (e) {} // 如果有过期时间，检测是否已过期


        if (~~storageTime > 0) {
          if (storageTime < time.timestamp) {
            sessionStorage.removeItem(timeKey);
            sessionStorage.removeItem(key);
            storageValue = null;
          }
        }

        return storageValue;
      };
      /** 
       * 缓存数据
       */


      cache.set = function (key, value) {
        var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : APP_STORAGE;
        var overdueSecond = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
        var time = util.getCalendarDate(new Date());
        var timeKey = key + timeKeySuffix; // 过期时间，0表示不设置过期

        var overdueTime = 0;

        if (overdueSecond !== null) {
          overdueTime = time.timestamp + ~~overdueSecond * 1000;
        } // 获取数据及过期时间


        switch (type) {
          case APP_STORAGE:
            if (value === null) {
              delete appStorage[key];
              return;
            }

            appStorage[key] = {
              storageTime: overdueTime,
              storageValue: value
            };
            break;

          case SESSION_STORAGE:
            if (value === null) {
              sessionStorage.removeItem(timeKey);
              sessionStorage.removeItem(key);
              return;
            }

            sessionStorage.setItem(timeKey, overdueTime);

            try {
              sessionStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
              sessionStorage.setItem(key, value);
            }

          case LOCAL_STORAGE:
            if (value === null) {
              localStorage.removeItem(timeKey);
              localStorage.removeItem(key);
              return;
            }

            localStorage.setItem(timeKey, overdueTime);

            try {
              localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
              localStorage.setItem(key, value);
            }

        }
      };

      return cache;
    }();

    var config = {
      /* 基本信息 */
      // 默认头像
      DEFAULT_AVATAR: "/shijiwxy/weixin/images/defaultHead.jpg",
      // 请求域名
      API_HOST: window.BaseWTDomain || "",
      // 请求路径
      API_PATH: "",

      /* 用户信息 */
      USER: {
        // token
        TOKEN: "",
        // udid
        UDID: "",
        // user_id
        ID: "",
        // org_id
        ORG_ID: "",
        // 终端version
        VERSION: ""
      },

      /** 
       * 注册jssdk功能
       */
      JSSDK_API_LIST: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'translateVoice', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'onVoicePlayEnd', 'pauseVoice', 'stopVoice', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'getNetworkType', 'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView']
    }; // 版本信息

    Object.defineProperties(config, {
      DEBUG: {
        value: true,
        writable: false
      },
      VERSION: {
        value: "1.3.1",
        writable: false
      }
    });

    var debug = function () {
      var _debug = config.DEBUG;
      var _debug_queue = 1;

      function debug(text) {
        if (_debug) {
          var _window;

          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          // console.warn('[' + _debug_queue++ + ']', text, ...args);
          (_window = window).showDevInfo.apply(_window, [[{
            text: "Debug Stack",
            backgroundColor: "#35495E",
            color: "#FFF"
          }, {
            text: text,
            backgroundColor: "#577DEA",
            color: "#FFF"
          }], "warn"].concat(args));
        }
      }

      ;
      return debug;
    }();

    var api = function () {
      var api = {};
      var _xhrFields = {}; // 处理请求前xhr，每次请求完毕后还原为 {}

      Object.defineProperty(api, "xhrFields", {
        enumerable: false,
        get: function get() {
          return _xhrFields;
        },
        set: function set() {
          _xhrFields = {};
          return _xhrFields;
        }
      });
      /** 
       * 获取请求参数
       */

      function requestParams() {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : AJAX_PARAMS_MATHOD_JSON;
        var takeCommonQuery = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
        var query = Object.assign({}, params);

        if (takeCommonQuery) {
          Object.assign(query, {
            token: config.USER.TOKEN,
            udid: config.USER.UDID,
            // user_id: config.USER.USER_ID,
            version: config.USER.VERSION,
            org_id: config.USER.ORG_ID
          });
        }

        switch (method) {
          case AJAX_PARAMS_MATHOD_JSON:
            return query;

          case AJAX_PARAMS_MATHOD_FORMDATA:
            var fd = new FormData();

            for (var i in query) {
              fd.append(i, query[i]);
            }

            return fd;

          case AJAX_PARAMS_MATHOD_STRINGIFY:
            var s = [];

            for (var _i2 in query) {
              s.push(_i2 + "=" + query[_i2]);
            }

            return s.join("&");
        }
      }

      function post(url, data) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        return $.ajax({
          url: url,
          type: 'POST',
          data: requestParams(data, AJAX_PARAMS_MATHOD_FORMDATA, false),
          cache: false,
          processData: false,
          contentType: false,
          headers: requestParams() // xhrFields: (function () {
          //     let fields = api.xhrFields;
          //     api.xhrFields = {};
          //     return fields;
          // })(),
          // crossDomain: true

        });
      }

      function get(url, data) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        return $.ajax({
          url: url,
          type: 'GET',
          data: requestParams(data, AJAX_PARAMS_MATHOD_STRINGIFY, false),
          cache: false,
          processData: false,
          contentType: false,
          headers: requestParams() // xhrFields: (function () {
          //     let fields = api.xhrFields;
          //     api.xhrFields = {};
          //     return fields;
          // })(),
          // crossDomain: true

        });
      }
      /** 
       * 执行请求
       */


      api.request = function (url) {
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        if (util.isEmpty(url)) {
          throw "未指定请求地址";
        }

        if (url.indexOf("http") !== 0) {
          url = config.API_HOST + "" + url;
        }

        options = Object.assign({
          method: "POST",
          done: function done() {},
          fail: function fail() {}
        }, options);
        var request;

        if (options.method == AJAX_REQUEST_GET) {
          request = get(url, data, options);
        } else {
          request = post(url, data, options);
        }

        return request.done(function (result) {
          // 如果请求成功，但接口返回失败，提示错误
          if (result.success !== true) {
            options.fail && options.fail({
              code: result.code,
              message: result.message
            });
            return;
          }

          options.done && options.done(result, true);
        }).fail(function (e) {
          // 如果是手动中断，不弹出提示
          if (e.statusText == 'abort') {
            return false;
          }

          options.fail && options.fail({
            code: -1,
            message: '服务器繁忙，请重试'
          });
        });
      };
      /** 
       * 获取esb图片
       */


      api.esbImageUrl = function (url) {
        var imgName = url.split(".")[0];
        imgName = config.API_HOST + "/esb/res/pic/" + Math.floor(+imgName / 10000) + "/" + Math.floor(+imgName / 100) + "/" + url;
        return imgName;
      };
      /** 
       * 注册jssdk
       */


      api.jssdkRegister = function (_done, _fail) {
        request('/shijiwxy/wechat/portal/getWxJsConfig.json', {
          url: window.location.href
        }, {
          done: function done(result) {
            var access = result.data;
            wx.config({
              debug: false,
              appId: access.appId,
              timestamp: access.timestamp,
              nonceStr: access.nonceStr,
              signature: access.signature,
              jsApiList: config.JSSDK_API_LIST
            });
            _done && _done();
          },
          fail: function fail(e) {
            _fail(e.message);
          }
        });
      }; // = block:main


      return api;
    }();

    var component = function () {
      var render = function () {
        var render = {};

        render.getContainer = function () {
          var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
          var DOM = render.create('<div id="' + id + '"></div>');
          return {
            el: DOM,
            // 支持格式： 
            // append("")  append(dom) append(Component) append([dom1, dom2, Component])
            // append(Component, dom)
            // 这种不行：
            // append("", [dom]) append([Template], "")
            append: function append(template) {
              var templates = Array.prototype.slice.call(arguments); // 如果第一个参数传了数组，后面的参数无效

              if (util.type(template) == "array") {
                templates = template;
              }

              templates.map(function (template) {
                var type = util.type(template);

                if (util.isEmpty(template)) {
                  return false;
                }

                if (type == "string") {
                  template = template.trim();

                  if (template.length == 0) {
                    return false;
                  }

                  template = render.create(template);
                  type = "dom";
                }

                if (type == "dom") {
                  return template;
                }

                if (util.type(template.el) == "dom") {
                  return template.el;
                }

                return false;
              }).filter(function (dom) {
                return dom !== false;
              }).map(function (dom) {
                DOM.appendChild(dom);
              });
              return this;
            },
            render: function render(selector) {
              if (typeof selector == 'undefined') {
                var original = document.querySelector('#' + id);
                original.parentNode.replaceChild(DOM, original);
              } else {
                var parent = document.querySelector(selector);
                parent.append(DOM);
              }

              setTimeout(function () {
                DOM.className = (DOM.className + " on").trim();
              }, 100);
            }
          };
        };
        /**
         * 通过字符串模板创建DOM
         * @param {String} string 字符串模板，模板必须包含一个最外层标签
         */


        render.create = function (string) {
          var Element = document.createElement('div');
          string = string.trim();
          var wrapMap = {
            thead: [1, "<table>", "</table>"],
            col: [2, "<table><colgroup>", "</colgroup></table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            th: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: [0, "", ""]
          };
          var tag = (/<([a-z][^\/\0>\x20\t\r\n\f]*)/i.exec(string) || ["", ""])[1].toLowerCase();
          var wrap = wrapMap[tag] || wrapMap._default;
          Element.innerHTML = wrap[1] + string + wrap[2];
          var j = wrap[0];

          while (j--) {
            Element = Element.lastChild;
          }

          return Element.firstChild;
        };

        render.compile = function (DOM, template) {
          var event = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
          var Element = this.create(template);
          event && event(Element);

          if (typeof DOM == 'string') {
            DOM = document.querySelector(DOM);
          }

          DOM.appendChild(Element);
        };

        return render;
      }();

      var component = {};
      /** 
       * 创建组件容器
       */

      component.getContainer = function () {
        var container = render.getContainer("app");
        return container;
      };
      /**
       * 获取定制数组重构方法
       */


      function getArrayArgumentations(callback) {
        var aryMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
        var arrayArgumentations = [];
        aryMethods.forEach(function (method) {
          var original = Array.prototype[method];

          arrayArgumentations[method] = function () {
            var result = original.apply(this, arguments);
            callback && callback(method);
            return result;
          };
        }); // 清空数组只保留项数

        arrayArgumentations.clear = function () {
          var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
          this.length = length;
          callback && callback('clear');
          return this;
        };

        return arrayArgumentations;
      }

      ;
      /** 
       * 热更新
       * 未扩展数组中是对象，对象里面的监听情况
       */

      function hotData() {
        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var callback = arguments.length > 1 ? arguments[1] : undefined;
        var deepPrefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";

        var _type = util.type(data);

        if (_type == "array") {
          data.__proto__ = getArrayArgumentations(function (method) {
            callback && callback(deepPrefix + name, [data]);
          });

          for (var i = 0; i < data.length; i++) {
            data[i] = hotData(data[i], callback, deepPrefix + i + ".");
          }

          return data;
        } else if (_type == "object") {
          var __DATA__ = {};

          var _loop2 = function _loop2(_name2) {
            var data_type = util.type(data[_name2]);

            if (data_type == "array") {
              __DATA__[_name2] = hotData(data[_name2], callback, deepPrefix + _name2 + ".");
            } else if (data_type == "object") {
              __DATA__[_name2] = hotData(data[_name2], callback, deepPrefix + _name2 + ".");
            } else {
              Object.defineProperty(__DATA__, _name2, {
                enumerable: true,
                get: function get() {
                  return data[_name2];
                },
                set: function set(val) {
                  data[_name2] = val;
                  callback && callback(deepPrefix + _name2, [val]);
                  return data[_name2];
                }
              });
            }
          };

          for (var _name2 in data) {
            _loop2(_name2);
          }

          return __DATA__;
        }

        return data;
      }
      /** 
       * 热更新
       */


      component.hotData = hotData;
      /** 
       * 创建组件模型
       */

      component.create = function (template) {
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var DOM;

        if (util.isDom(template)) {
          DOM = template;
        } else {
          // 处理带数据的字符串模板
          // 匹配如同 {{name}} 的字符串模板
          var reg = /\{\{(\w+)\}\}/g;
          var exec = null; // 依次获取匹配内容

          while (exec = reg.exec(template)) {
            // 替换掉真实数据，如果不存在数据，将替换为空字符串
            template = template.replace(new RegExp(exec[0], "g"), util.defaults(data[exec[1]], ""));
          }

          DOM = render.create(template);
        }

        var bindSet = {};

        function on(key, callback) {
          if (!bindSet.hasOwnProperty(key)) {
            bindSet[key] = [];
          }

          bindSet[key].push({
            key: key,
            callback: callback
          });
        }

        function off(key, callback) {
          if (!bindSet.hasOwnProperty(key)) {
            return;
          }

          for (var i = bindSet[key].length - 1; i >= 0; i--) {
            if (bindSet[key][i].callback == callback) {
              bindSet[key].splice(i, 1);
            }
          }
        }

        function trigger(key, params, defaults) {
          var isTrigger = false;

          if (bindSet.hasOwnProperty(key)) {
            bindSet[key].map(function (set) {
              if (set.callback) {
                isTrigger = true;
                set.callback.apply(set, params);
              }
            });
          }

          if (!isTrigger) {
            defaults && defaults.apply(void 0, [key].concat(_toConsumableArray(params)));
          }
        }

        options = Object.assign({
          accessDom: false
        }, options);
        var dataChange = null;

        var __DATA__ = hotData(data, function (name, vals) {
          trigger("data:" + name, vals, dataChange);
        });

        var DOMMAP = {
          el: DOM,
          data: __DATA__,
          on: on,
          off: off,
          trigger: trigger,
          addEventListener: DOM.addEventListener.bind(DOM),
          querySelector: DOM.querySelector.bind(DOM),
          querySelectorAll: DOM.querySelectorAll.bind(DOM),
          appoint: function appoint(selector) {
            try {
              return component.create(DOM.querySelector(selector));
            } catch (error) {
              throw "未找到DOM结构：" + selector;
            }
          },
          empty: function empty() {
            DOM.innerHTML = "";
            return DOMMAP;
          },
          remove: function remove() {
            if (DOM.parentNode) {
              DOM.parentNode.removeChild(DOM);
            }
          },
          onDataChange: function onDataChange(callback) {
            dataChange = callback;
          },
          append: function append(template) {
            var templates = Array.prototype.slice.call(arguments); // 如果第一个参数传了数组，后面的参数无效

            if (util.type(template) == "array") {
              templates = template;
            }

            templates.map(function (template) {
              if (template.__OBJTYPE__ == OBJTYPE) {
                DOM.appendChild(template.el);
              } else {
                debug("未识别的模板内容：template不是一个" + OBJTYPE + "对象，已被系统忽略");
              }

              return false;
            }).filter(function (dom) {
              return dom !== false;
            }).map(function (dom) {
              DOM.appendChild(dom);
            });
            return this;
          }
        };
        Object.defineProperty(DOMMAP, "__OBJTYPE__", {
          enumerable: false,
          value: OBJTYPE,
          writable: false
        }); // 是否将数据存入到dom上的__DATA__变量中

        if (options.accessDom) {
          DOM.__proto__.__DATA__ = __DATA__;
        }

        return DOMMAP;
      }; // = block:main


      return component;
    }();

    function extension(callback) {
      callback({
        // 请求地址
        API_HOST: "https://t.shijiwxy.5tree.cn",
        USER: {
          TOKEN: "36755b2361ed7a4d3ca5e364fb7d8310_1592895032366_4932698_0_cbb86e1e",
          UDID: "5774861a-e407-4dfc-818d-4177cbb86e1e",
          USER_ID: 4932698,
          ORG_ID: 192,
          VERSION: 3,
          IS_ADMIN: true
        }
      });
    } // 获取异步数据


    extension(function (BASE) {
      // 修改最新配置信息
      Object.assign(config, BASE); // 输出开发信息
      // console.log(
      //     `%c MiniGulp Dev CLI %c Detected lastest version is v${config.VERSION} `,
      //     'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
      //     'background:#577dea ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff'
      // );

      window.showDevInfo = function () {
        var _console;

        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var F = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "log";
        var desc = [];
        var descStyle = [];
        var time = util.getCalendarDate().format('[H:i:s] ');
        options.map(function (conf) {
          // color backgroundColor text
          desc.push(time + conf.text);
          time = '';
          descStyle.push("background:".concat(conf.backgroundColor, ";padding:1px;color:").concat(conf.color, ";"));
        });
        descStyle[0] += "border-radius:3px 0 0 3px;";
        descStyle[descStyle.length - 1] += "border-radius:0 3px 3px 0;";

        for (var _len2 = arguments.length, data = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
          data[_key2 - 2] = arguments[_key2];
        }

        (_console = console)[F].apply(_console, ["%c " + desc.join(" %c ") + " "].concat(descStyle, data));
      };

      window.showDevInfo([{
        text: "MiniGulp Dev CLI",
        backgroundColor: "#35495E",
        color: "#FFF"
      }, {
        text: "Detected lastest version is v".concat(config.VERSION),
        backgroundColor: "#577DEA",
        color: "#FFF"
      }]); // 进入应用

      factory({
        // 依赖 jQuery
        $: jQuery,
        api: api,
        cache: cache,
        util: util,
        config: config,
        lang: lang,
        component: component,
        debug: debug
      });
    });
  })(function (Package) {
    var $$ = Package;
    var api = $$.api;
    var util = $$.util;
    var config = $$.config;
    var component = $$.component;
    var debug = $$.debug;
    var $ = $$.$;
    var __body__ = document.body;

    var __self__ = document.getElementById("app"); // 加载模块


    function lang(key) {
      var language = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ZH_CN;
      return util.lang(key, language, function (err) {
        $$.debug(err);
      });
    }

    function weuialert(msg, callback) {
      return weui.alert(msg, callback, {
        isAndroid: false
      });
    }

    Object.assign(Package.lang.zh_cn, {
      __PAGE__: "首页",
      __LOGIN_TITLE__: "安全验证",
      __LOGIN_ERROR__: "安全验证失败",
      __MSG_WARN__: "您的密码存在信息安全隐患，请修改后重新登录。",
      __INPUT_NO_SPACE__: "不能包含空格",
      __INPUT_LIMIT_LENGTH__: "长度为8-16个字符",
      __INPUT_SET_MAX__: "必须包含字母、数字、英文符号中至少两种",
      __INPUT_REPEAT__: "两次输入的新密码不一致",
      __FORM_LABEL_OLD__: "旧密码",
      __FORM_LABEL_NEW__: "新密码",
      __FORM_LABEL_REPEAT__: "确认密码",
      __PLACEHOLDER_OLD__: "请输入旧密码",
      __PLACEHOLDER_NEW__: "请输入新密码",
      __PLACEHOLDER_REPEAT__: "重复输入新密码",
      __SAVE_AND_RELOGIN__: "保存并重新登录",
      __CONFIRM_SUBMIT_MSG__: "提交验证",
      __SUBMIT_LOADING_MSG__: "保存中",
      __TIPTEXT_OLD__: "请填写旧密码",
      __TIPTEXT_NEW__: "请填写新密码",
      __TIPTEXT_REPEAT__: "请填写确认密码",
      __NO_TIPTEXT_FORMDATA__: "请填写密码",
      __NO_SPACE_TIP__: "新密码不能包含空格",
      __LIMIT_LENGTH_TIP__: "新密码长度为8-16个字符",
      __SET_MAX_TIP__: "新密码必须包含字母、数字、英文符号中至少两种",
      __REPEAT_TIP__: "新密码和确认密码不一致"
    });
    config.USER.VERSION = 3;

    (function () {
      var urls = {
        list: ""
      };

      api.list = function (_ref2, callback, _fail2) {
        var id = _ref2.id;
        api.request(urls.list, {
          gradeId: id
        }, {
          done: function done(result) {
            callback && callback({
              message: result.message,
              data: result.data
            });
          },
          fail: function fail(e) {
            _fail2 && _fail2({
              message: e.message || "获取失败"
            });
          }
        });
      };
    });

    component.header = function () {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var DM = component.create("<div>".concat(lang("__PAGE__"), "</div>"), {
        name: 111,
        list: [{
          id: 1,
          name: "投递员"
        }],
        formSet: {
          id: 20,
          auths: [1, 3, 4]
        }
      });
      return DM;
    };

    function init() {
      var HeaderDM = component.header();
      var Container = component.getContainer();
      Container.append(HeaderDM);
      Container.render();
    }

    init();
  });
})();