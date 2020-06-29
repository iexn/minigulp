'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function () {
  // 加载常量
  // app存储
  var APP_STORAGE = "1"; // session存储

  var SESSION_STORAGE = "2"; // local存储

  var LOCAL_STORAGE = "3"; // 默认语言

  var ZH_CN = "zh_cn";

  (function (factory) {
    /** 
     * 创建包
     */
    var Package = {
      // 依赖 jQuery
      $: jQuery,
      body: document.body,
      self: document.getElementById("app")
    };
    /** 
     * 功能支持：数据
     */

    Package.cache = function () {
      var data = function data() {};

      var _this = data.prototype;

      _this.get = function (key, value) {
        var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : APP_STORAGE;
      };
      /** 
       * 缓存数据
       */


      _this.cache = function (key, value) {
        var overdueSecond = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 60;
        var time = Package.Util.getCalendarDate(new Date());
        var timeKey = key + "~overdueTime";

        if (value === undefined) {
          // 获取
          var sessionTime = sessionStorage.getItem(timeKey);
          var sessionValue = sessionStorage.getItem(key);

          if (overdueSecond == null || sessionTime == null || sessionTime < time.timestamp || sessionValue == null) {
            sessionStorage.removeItem(timeKey);
            sessionStorage.removeItem(key);
            return null;
          }

          try {
            return JSON.parse(sessionValue);
          } catch (e) {
            return sessionValue;
          }
        } else {
          // 设置
          if (value === null) {
            sessionStorage.removeItem(timeKey);
            sessionStorage.removeItem(key);
            return null;
          }

          sessionStorage.setItem(timeKey, time.timestamp + overdueSecond * 1000);

          try {
            sessionStorage.setItem(key, JSON.stringify(value));
          } catch (e) {
            sessionStorage.setItem(key, value);
          }

          return value;
        }
      };

      return data;
    }();

    "";
    /** 
     * 功能支持：工具
     */

    Package.util =
    /**
     * 工具层
     */
    function () {
      var Util = function Util() {};

      var _this = Util.prototype;
      /**
       * 下载文件
       * url：下载文件的远程地址
       */

      _this.download = function (url) {
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
       * 判断数据的具体类型
       */


      _this.type = function (mixin) {
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
          return class2type[Object.prototype.toString.call(mixin)] || "object";
        }

        return mixin_type;
      };
      /**
       * 获取路由切换的完整地址
       */


      _this.getRealPath = function () {
        var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

        if (path == '') {
          return Router.route;
        }

        if (path.indexOf('/') == 0) {
          return path;
        }

        var hash = this.getHashSimplePath(Router.route);
        var hashs = hash == '' ? [] : hash.split('/');

        var _paths = path == '' ? [] : path.split('/');

        var paths = [];

        for (var i = 0; i < _paths.length; i++) {
          if (_paths[i] != hashs[i]) {
            paths = _paths.splice(i);
            break;
          }
        }

        for (var _i = 0; _i < paths.length; _i++) {
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
       * 判断传入的变量是否是一个dom对象
       */


      _this.isDom = function (dom) {
        return (typeof HTMLElement === "undefined" ? "undefined" : _typeof(HTMLElement)) === 'object' ? dom instanceof HTMLElement : dom && _typeof(dom) === 'object' && dom.nodeType === 1 && typeof dom.nodeName === 'string';
      };
      /**
       * 创建上拉下拉动作
       */


      _this.scroll = function (DOM) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        options = Object.assign({
          refer: window,
          onRefresh: function onRefresh(done) {
            done();
          },
          onContinue: function onContinue(done) {
            done();
          }
        }, options);
        var DOMdropload = $(DOM).dropload({
          scrollArea: options.refer,
          loadDownFn: function loadDownFn(me) {
            me.lock('up');
            options.onContinue(function () {
              var noData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
              me.unlock();
              me.noData(noData);
              me.resetload();
            });
          },
          loadUpFn: function loadUpFn(me) {
            me.lock('down');
            options.onRefresh(function () {
              var noData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
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

      _this.getQuery = function () {
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
       * 是否为空值，不包括0
       */


      _this.isEmpty = function (mixin) {
        var _type = _this.type(mixin);

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
      }; //金额输入框实时大写


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
              } //归零


              zeroCount = 0;
              chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
            }

            if (m == 0 && zeroCount < 4) {
              chineseStr += cnIntUnits[q];
            }
          }

          chineseStr += cnIntLast;
        } //小数部分


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
      }; // textarea不回弹


      Util.prototype.iosTextBlurScroll = function (input) {
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
        } // 判断kb


        size = (size / 1024).toFixed(2);

        if (size < 1024) {
          return size + 'KB';
        } // 判断mb


        size = (size / 1024).toFixed(2);

        if (size < 1024) {
          return size + 'MB';
        } // 判断gb


        size = (size / 1024).toFixed(2);

        if (size < 1024) {
          return size + 'GB';
        } // tb


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
       * 判断传入的变量是否是一个dom对象
       */


      _this.isDom = function (dom) {
        return (typeof HTMLElement === "undefined" ? "undefined" : _typeof(HTMLElement)) === 'object' ? dom instanceof HTMLElement : dom && _typeof(dom) === 'object' && dom.nodeType === 1 && typeof dom.nodeName === 'string';
      };
      /**
       * 将query转为hash字符串
       */


      _this.query2Hash = function (query) {
        var query_trim = [];

        for (var i in query) {
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
          // console.log("读取文件", currentChunk + 1, "/", chunks);
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

      var BASE64 = function BASE64() {
        // private property  
        var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="; // public method for encoding  

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
            enc2 = (chr1 & 3) << 4 | chr2 >> 4;
            enc3 = (chr2 & 15) << 2 | chr3 >> 6;
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
              enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
              enc4 = 64;
            }

            output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
          }

          return output;
        }; // public method for decoding  


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
            chr1 = enc1 << 2 | enc2 >> 4;
            chr2 = (enc2 & 15) << 4 | enc3 >> 2;
            chr3 = (enc3 & 3) << 6 | enc4;
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
        }; // private method for UTF-8 encoding  


        var _utf8_encode = function _utf8_encode(string) {
          string = string.replace(/\r\n/g, "\n");
          var utftext = "";

          for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);

            if (c < 128) {
              utftext += String.fromCharCode(c);
            } else if (c > 127 && c < 2048) {
              utftext += String.fromCharCode(c >> 6 | 192);
              utftext += String.fromCharCode(c & 63 | 128);
            } else {
              utftext += String.fromCharCode(c >> 12 | 224);
              utftext += String.fromCharCode(c >> 6 & 63 | 128);
              utftext += String.fromCharCode(c & 63 | 128);
            }
          }

          return utftext;
        }; // private method for UTF-8 decoding  


        var _utf8_decode = function _utf8_decode(utftext) {
          var string = "";
          var i = 0;
          var c = c1 = c2 = 0;

          while (i < utftext.length) {
            c = utftext.charCodeAt(i);

            if (c < 128) {
              string += String.fromCharCode(c);
              i++;
            } else if (c > 191 && c < 224) {
              c2 = utftext.charCodeAt(i + 1);
              string += String.fromCharCode((c & 31) << 6 | c2 & 63);
              i += 2;
            } else {
              c2 = utftext.charCodeAt(i + 1);
              c3 = utftext.charCodeAt(i + 2);
              string += String.fromCharCode((c & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
              i += 3;
            }
          }

          return string;
        };
      };

      var _Base64 = new BASE64();

      _this.Base64Decode = _Base64.decode;
      _this.Base64Encode = _Base64.encode;
      return new Util();
    }();

    "";
    /** 
     * 功能支持：配置
     */

    Package.config = function () {
      var CONFIG = {
        // 版本信息
        DEBUG: true,
        VERSION: "1.1.0",

        /* 基本信息 */
        // 默认头像
        DEFAULT_AVATAR: "/shijiwxy/weixin/images/defaultHead.jpg",

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
        }
      };
      return CONFIG;
    }();

    "";
    /** 
     * 功能支持：语言包
     */

    Package.lang = function () {
      var lang = function lang() {};

      var _this = lang.prototype;
      var zh_cn = {};
      return {
        zh_cn: zh_cn
      };
    }();

    "";
    /** 
     * 功能支持：自定义dom
     */

    Package.render = function () {
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

            if (Util.type(template) == "array") {
              templates = template;
            }

            templates.map(function (template) {
              var type = Util.type(template);

              if (Util.isEmpty(template)) {
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

              if (Util.type(template.el) == "dom") {
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

    "";
    /** 
     * 功能支持：异步调用扩展
     * 获取异步调用关键数据
     */

    var extension = function $BASE_USER(callback) {
      callback({
        DEFAULT_AVATAR: "/shijiwxy/weixin/images/defaultHead.jpg",
        API_BASE_URL: "https://t.shijiwxy.5tree.cn",
        TOKEN: "36755b2361ed7a4d3ca5e364fb7d8310_1592895032366_4932698_0_cbb86e1e",
        UDID: "5774861a-e407-4dfc-818d-4177cbb86e1e",
        USER_ID: 4932698,
        ORG_ID: 192,
        VERSION: 3,
        IS_ADMIN: true
      });
    };

    "";
    /** 
     * 调试函数
     */

    var _debug = Package.config.DEBUG;
    var _debug_queue = 1;

    Package.debug = function (text) {
      if (_debug) {
        var _console;

        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        (_console = console).warn.apply(_console, ['[' + _debug_queue++ + ']', text].concat(args));
      }
    }; // 获取异步数据


    extension(function (BASE) {
      // 修改最新配置信息
      Package.config = Object.assign(BASE, Package.config); // 输出开发信息

      console.log("%c MiniGulp Dev CLI %c Detected lastest version is v".concat(Package.config.VERSION, " "), 'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', 'background:#577dea ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff'); // 进入应用

      factory(Package);
    });
  })(function (Package) {
    var cache = Package.cache,
        util = Package.util,
        config = Package.config,
        render = Package.render,
        debug = Package.debug;
    var $$ = Package;
    var $ = $$.$;
    var body = $$.body;
    var self = $$.self;
    var $body = $(body);
    var $self = $(self); // 加载公共函数

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
    } // 扩展配置


    (function () {
      Object.assign(Package.config, {
        MINIGULP_VERSION: 1111
      });
    })(); // 扩展语言包内容


    (function () {
      Object.assign(Package.lang.zh_cn, {
        __PAGE__: "首页"
      });
    })(); // 初始化

  });
})();