'use strict';

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function () {
  // 加载常量
  // app存储
  var APP_STORAGE = "app"; // session存储

  var SESSION_STORAGE = "session"; // local存储

  var LOCAL_STORAGE = "local"; // 默认语言

  var ZH_CN = "zh_cn"; // ajax请求方式

  var AJAX_REQUEST_GET = "GET";
  var AJAX_REQUEST_POST = "POST"; // ajax参数格式

  var AJAX_PARAMS_MATHOD_JSON = "json";
  var AJAX_PARAMS_MATHOD_FORMDATA = "form_data";
  var AJAX_PARAMS_MATHOD_STRINGIFY = "stringify";

  (function (factory) {
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
    }

    ;

    var util = function () {
      var util = {};
      var toString = Object.prototype.toString;
      var slice = Array.prototype.slice;
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
        var compareFunction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : isEmpty;
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
        var query = {};
        location.search.slice(1).split("&").map(function (item) {
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

        if (type(ND) == "string") {
          ND = ND.replace(/-/g, "/");
        }

        if (isEmpty(ND)) {
          ND = new Date();
        } else {
          ND = new Date(ND);
        }

        var hour = ND.getHours();
        var minute = ND.getMinutes();
        var second = ND.getSeconds();
        var timestamp = ND.getTime();
        ND = new Date(ND.getFullYear(), ND.getMonth(), ND.getDate());
        var time = ND.getTime();
        var NW = {
          ND: ND,
          year: ND.getFullYear(),
          month: util.fullZeroNumber(ND.getMonth() + 1),
          day: util.fullZeroNumber(ND.getDate()),
          hour: util.fullZeroNumber(hour),
          minute: util.fullZeroNumber(minute),
          second: util.fullZeroNumber(second),
          time: time,
          timestamp: timestamp
        };
        NW.format = NW.year + "/" + NW.month + "/" + NW.day;
        NW.formatText = NW.year + "年" + NW.month + "月" + NW.day + "日";
        NW.monthFormat = NW.year + "/" + NW.month;
        NW.monthFormatText = NW.year + "年" + NW.month + "月";
        NW.timeFormat = NW.hour + ":" + NW.minute + ":" + NW.second;
        NW.timeFormatText = NW.hour + "时" + NW.minute + "分" + NW.second + "秒";
        NW.minuteTimeFormat = NW.hour + ":" + NW.minute;
        NW.minuteTimeFormatText = NW.hour + "时" + NW.minute + "分"; // 获取当月天数，day=0时month必须+1

        NW.monthDay = util.fullZeroNumber(new Date(ND.getFullYear(), ND.getMonth() + 1, 0).getDate());
        NW.firstWeek = new Date(ND.getFullYear(), ND.getMonth()).getDay();
        NW.firstTime = new Date(ND.getFullYear(), ND.getMonth()).getTime();
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

    var config = function () {
      var config = {
        /* 基本信息 */
        // 默认头像
        DEFAULT_AVATAR: "/shijiwxy/weixin/images/defaultHead.jpg",
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
          value: "1.1.0",
          writable: false
        }
      });
      Object.assign(config, {
        MINIGULP_VERSION: 1111
      });
      return config;
    }();

    var lang = function () {
      var lang = {
        zh_cn: {}
      };
      Object.assign(lang.zh_cn, {
        __PAGE__: "首页"
      });
      return lang;
    }();

    var debug = function () {
      var _debug = config.DEBUG;
      var _debug_queue = 1;

      function debug(text) {
        if (_debug) {
          var _console;

          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          (_console = console).warn.apply(_console, ['[' + _debug_queue++ + ']', text].concat(args));
        }
      }

      ;
      return debug;
    }();

    var api = function () {
      var api = {};
      /** 
             * 获取请求参数
             */

      function requestParams() {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : AJAX_PARAMS_MATHOD_JSON;
        var query = Object.assign(params, {
          token: config.USER.TOKEN,
          udid: config.USER.UDID,
          user_id: config.USER.ID,
          version: config.USER.VERSION,
          org_id: config.USER.ORG_ID
        });

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
          data: requestParams(data, AJAX_PARAMS_MATHOD_FORMDATA),
          cache: false,
          processData: false,
          contentType: false,
          headers: requestParams(data)
        });
      }

      function get(url, data) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        return $.ajax({
          url: url,
          type: 'GET',
          data: requestParams(data, AJAX_PARAMS_MATHOD_STRINGIFY),
          cache: false,
          processData: false,
          contentType: false,
          headers: requestParams(data)
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
            fail && fail({
              code: result.code,
              message: result.message
            });
            return;
          }

          done && done(result, true);
        }).fail(function (e) {
          // 如果是手动中断，不弹出提示
          if (e.statusText == 'abort') {
            return false;
          }

          fail && fail({
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


      api.jssdkRegister = function (done, fail) {
        request('/shijiwxy/wechat/portal/getWxJsConfig.json', {
          url: window.location.href
        }, {
          done: function (_done) {
            function done(_x) {
              return _done.apply(this, arguments);
            }

            done.toString = function () {
              return _done.toString();
            };

            return done;
          }(function (result) {
            var access = result.data;
            wx.config({
              debug: false,
              appId: access.appId,
              timestamp: access.timestamp,
              nonceStr: access.nonceStr,
              signature: access.signature,
              jsApiList: config.JSSDK_API_LIST
            });
            done && done();
          }),
          fail: function (_fail) {
            function fail(_x2) {
              return _fail.apply(this, arguments);
            }

            fail.toString = function () {
              return _fail.toString();
            };

            return fail;
          }(function (e) {
            fail(e.message);
          })
        });
      };

      var urls = {
        approval: config.API_PATH + "/approval.json"
      };

      api.approval = function (data, done, fail) {
        api.request(urls.approval, data, {
          done: done,
          fail: fail
        });
      };

      return api;
    }(); // 获取异步数据


    extension(function (BASE) {
      // 修改最新配置信息
      Object.assign(config, BASE); // 输出开发信息

      console.log("%c MiniGulp Dev CLI %c Detected lastest version is v".concat(config.VERSION, " "), 'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', 'background:#577dea ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff');
      /** 
       * 创建包
       */

      var Package = {
        // 依赖 jQuery
        $: jQuery,
        api: api,
        cache: cache,
        util: util,
        config: config,
        lang: lang,
        debug: debug
      }; // 进入应用

      factory(Package);
    });
  })(function (Package) {
    var $$ = Package;
    var api = $$.api,
        util = $$.util,
        config = $$.config,
        debug = $$.debug,
        $ = $$.$;
    var body = document.body;
    var self = document.getElementById("app");
    var $body = $(body);
    var $self = $(self);

    function lang(key) {
      var language = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ZH_CN;
      var langs = $$.lang[language];

      if (!langs) {
        $$.debug("[Lang]: \u8BED\u8A00\u5305 ".concat(language, " \u4E0D\u53EF\u7528\uFF0C\u53EF\u80FD\u672A\u8BBE\u7F6E\u8BED\u8A00\u5305"));
        return "";
      }

      if (!langs.hasOwnProperty(key)) {
        $$.debug("[Lang]: 未找到的语言包内容，加载关键字：" + key);
        return "";
      }

      var value = langs[key];

      if (typeof value != "string") {
        $$.debug("[Lang]: \u8BED\u8A00\u5305\u5173\u952E\u5B57 ".concat(key, " \u52A0\u8F7D\u9519\u8BEF\uFF1A\u53EF\u80FD\u8BBE\u7F6E\u4E86\u4E00\u4E2A\u4E0D\u53EF\u8BFB\u53D6\u6216\u975E\u5B57\u7B26\u4E32\u7C7B\u578B\u7684\u8BED\u8A00"));
        return "";
      }

      return value;
    }

    var component = function () {
      var render = function () {
        var Render = function Render() {};

        var _this = Render.prototype;

        _this.getContainer = function () {
          var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

          var DOM = _this.create('<div id="' + id + '"></div>');

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

                  template = _this.create(template);
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


        _this.create = function (string) {
          var Element = document.createElement('div');
          string = string.trim();
          var wrapMap = {
            thead: [1, "<table>", "</table>"],
            col: [2, "<table><colgroup>", "</colgroup></table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
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

        _this.compile = function (DOM, template) {
          var event = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
          var Element = this.create(template);
          event && event(Element);

          if (typeof DOM == 'string') {
            DOM = document.querySelector(DOM);
          }

          DOM.appendChild(Element);
        };

        return new Render();
      }();

      var component = {};
      var _this = component;
      /** 
       * 创建组件容器
       */

      _this.getContainer = function () {
        var container = render.getContainer("app");
        return container;
      };
      /** 
       * 创建组件模型
       */


      _this.create = function (template) {
        var DOM = render.create(template);
        return {
          el: DOM
        };
      };

      component.header = function () {
        var DOMMAP = component.create("<div>".concat(lang("__PAGE__"), "</div>"), {});
        return DOMMAP;
      };

      return component;
    }();

    var Header = component.header();
    var Container = component.getContainer();
    Container.append(Header);
    Container.render();
    debug(Container, Header);
  });
})();