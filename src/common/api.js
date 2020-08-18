const api = (function () {

    const api = {};
    
    let _xhrFields = {};
    // 处理请求前xhr，每次请求完毕后还原为 {}
    Object.defineProperty(api, "xhrFields", {
        enumerable: false,
        get() {
            return _xhrFields;
        },
        set() {
            _xhrFields = {};
            return _xhrFields;
        }
    })

    /** 
     * 获取请求参数
     */
    function requestParams(params = {}, method = AJAX_PARAMS_MATHOD_JSON) {
        let query = Object.assign(params, {
            token  : config.USER.TOKEN,
            udid   : config.USER.UDID,
            // user_id: config.USER.USER_ID,
            version: config.USER.VERSION,
            org_id : config.USER.ORG_ID
        });

        switch (method) {
            case AJAX_PARAMS_MATHOD_JSON:
                return query;
            case AJAX_PARAMS_MATHOD_FORMDATA:
                let fd = new FormData;
                for (let i in query) {
                    fd.append(i, query[i]);
                }
                return fd;
            case AJAX_PARAMS_MATHOD_STRINGIFY:
                let s = [];
                for (let i in query) {
                    s.push(i + "=" + query[i]);
                }
                return s.join("&");
        }
    }

    function post(url, data, options = {}) {
        return $.ajax({
            url: url,
            type: 'POST',
            data: requestParams(data, AJAX_PARAMS_MATHOD_FORMDATA),
            cache: false,
            processData: false,
            contentType: false,
            headers: requestParams(),
            // xhrFields: (function () {
            //     let fields = api.xhrFields;
            //     api.xhrFields = {};
            //     return fields;
            // })(),
            // crossDomain: true
        });
    }

    function get(url, data, options = {}) {
        return $.ajax({
            url: url,
            type: 'GET',
            data: requestParams(data, AJAX_PARAMS_MATHOD_STRINGIFY),
            cache: false,
            processData: false,
            contentType: false,
            headers: requestParams(),
            // xhrFields: (function () {
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
    api.request = function (url, data = {}, options = {}) {
        if (util.isEmpty(url)) {
            throw "未指定请求地址";
        }

        if (url.indexOf("http") !== 0) {
            url = config.API_HOST + "" + url;
        }

        options = Object.assign({
            method: "POST",
            done: function () {},
            fail: function () {}
        }, options);

        let request;
        if (options.method == AJAX_REQUEST_GET) {
            request = get(url, data, options);
        } else {
            request = post(url, data, options);
        }

        
        return request
            .done(function (result) {
                // 如果请求成功，但接口返回失败，提示错误
                if (result.success !== true) {
                    options.fail && options.fail({
                        code: result.code,
                        message: result.message
                    });
                    return;
                }
                options.done && options.done(result, true);
            })
            .fail(function (e) {
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
    }

    /** 
     * 注册jssdk
     */
    api.jssdkRegister = function (done, fail) {
        request('/shijiwxy/wechat/portal/getWxJsConfig.json', {
            url: window.location.href
        }, {
            done(result) {
                let access = result.data;

                wx.config({
                    debug: false,
                    appId: access.appId,
                    timestamp: access.timestamp,
                    nonceStr: access.nonceStr,
                    signature: access.signature,
                    jsApiList: config.JSSDK_API_LIST
                });

                done && done();
            },

            fail(e) {
                fail(e.message);
            }
        });
    };

    // = block:main

    return api;
})();