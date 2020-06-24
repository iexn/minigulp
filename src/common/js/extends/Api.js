// 接口公共地址前缀
_this.domain = Config.api.base_url;
_this.base_module_url = _this.domain + "/edufs/";
_this.base_url = _this.base_module_url + "file/";

// 构建一个统一请求方式
_this.exec = {
    // 请求的所有数据
    query: function () {
        return {
            token: Config.user.token,
            udid : Config.user.udid,
            user_id: Config.user.id,
            version: Config.user.version,
            org_id: Config.user.org_id,
            admin: BASE.IS_ADMIN ? "1" : "0"
        }
    },
    // 暂存的用户数据数组
    params: {},
    callback: function () {},
    fail: function () {},
    progress: function () {},
};

/**
 * 进行一个post请求
 */
function _post(url, data, callback, fail, progress) {
    let params = new FormData();
    for(let name in data) {
        let value = data[name];

        // 如果参数名以 @ 开头，视为文件数组
        // Tips: 上传文件时，请上传 Filelist
        if (/^\@/.test(name)) {
            name = name.substr(1);
            // Filelist 是类数组，转为真正数组
            value = Util.like2Array(value);
            // 循环添加文件到 formdata 中
            value.map(function (_file) {
                // 此处暂时只接收文件数组中的第一个文件
                params.append(name /* + '[]' */, _file);
            });
            continue;
        } else {
            params.append(name, value);
        }

    }

    let exec_query = _this.exec.query();
    for(let name in exec_query) {
        params.append(name, exec_query[name]);
    }
    
    return $.ajax({
        url: url,
        type: 'POST',
        data: params,
        cache: false,
        processData: false,
        contentType: false,
        headers: {
            token: Config.user.token,
            udid: Config.user.udid,
            user_id: Config.user.id,
            version: Config.user.version,
            org_id: Config.user.org_id
        },
        // 专门处理上传进度
        xhr: function () {
            // 获取xhr
            var xhr = $.ajaxSettings.xhr();

            if (progress) {
                // 进度变更
                xhr.upload.onprogress = function (evt) {
                    // 百分比进度
                    var percent = (evt.loaded / evt.total * 100).toFixed(2);

                    // 如果传文件了，打开右下角小窗口并开始监听
                    progress && progress(percent, evt, data);
                };

                // 上传完成
                xhr.upload.onload = function (evt) {
                    // 关闭右下角小窗口
                    progress && progress(true, evt, data);
                };
            }

            return xhr;
        },
        success: function (result) {
            // 如果请求成功，但接口返回失败，提示错误
            if (result.success !== true) {
                // fail && fail({
                //     code: result.code,
                //     message: result.message
                // });
                fail && fail(result);
                return;
            }
            callback && callback(result, true);
        },
        error: function (e) {
            // 如果是手动中断，不弹出提示
            if (e.statusText == 'abort') {
                return false;
            }
            fail && fail({
                code: -1,
                message: '服务器繁忙，请重试'
            });
        }
    });
};

function _get(url, data, callback, fail) {
    let params = [];
    for(let name in data) {
        params.push(name + "=" + data[name]);
    }

    let exec_query = _this.exec.query();
    for(let name in exec_query) {
        params.push(name + "=" + exec_query[name]);
    }

    return $.ajax({
        url: url,
        type: 'GET',
        data: params.join("&"),
        cache: false,
        processData: false,
        contentType: false,
        headers: {
            token: Config.user.token,
            udid: Config.user.udid,
            user_id: Config.user.id,
            version: Config.user.version,
            org_id: Config.user.org_id
        },
        success: function (result) {
            // 如果请求成功，但接口返回失败，提示错误
            if (result.success !== true) {
                fail && fail({
                    code: result.code,
                    message: result.message
                });
                return;
            }
            callback && callback(result, true);
        },
        error: function (e) {
            // 如果是手动中断，不弹出提示
            if (e.statusText == 'abort') {
                return false;
            }
            fail && fail({
                code: -1,
                message: '服务器繁忙，请重试'
            });
        }
    });
};

_this.post = _post;
_this.get = _get;

_this.exec.post = function (name) {
    let exec = _this.exec;
    let url = _this.base_url + _this.urls[name];

    _post(url, exec.params, exec.callback, exec.fail, exec.progress);
};

/**
 * 快速执行一个接口
 * 使用于普通通用的调用情况
 */
_this.run = function (name, params, callback, fail, progress) {
    if (!params.hasOwnProperty("yunType")) {
        if (Util.type(params) != "object") {
            params = {};
        }
        params.yunType = Uri.getYunType().code;
    }

    if (!params.hasOwnProperty("belongId")) {
        params.belongId = Data.get("belongId");
    }

    _this.exec.params = params;

    if (Util.type(callback) == 'function') {
        _this.exec.callback = callback;
    }

    if (Util.type(fail) == 'function') {
        _this.exec.fail = fail;
    }

    if (Util.type(progress) == 'function') {
        _this.exec.progress = progress;
    }

    _this.exec.post(name);
};

_this.resource = function (url) {
    var imgName = url.split(".")[0];
    imgName = Config.api.base_url + "/esb/res/pic/" + Math.floor(+imgName / 10000) + "/" + Math.floor(+imgName / 100) + "/" + url;
    return imgName;
}

_this.jssdkRegister = function (callback) {
    let _loading = Component.loading().render();
    _this.post(Config.api.base_url + '/shijiwxy/wechat/portal/getWxJsConfig.json', {
        url: window.location.href
    }, function (result) {
        let access = result.data;

        wx.config({
            debug: false,
            appId: access.appId,
            timestamp: access.timestamp,
            nonceStr: access.nonceStr,
            signature: access.signature,
            jsApiList: [
                'checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'onMenuShareQZone',
                'hideMenuItems',
                'showMenuItems',
                'hideAllNonBaseMenuItem',
                'showAllNonBaseMenuItem',
                'translateVoice',
                'startRecord',
                'stopRecord',
                'onVoiceRecordEnd',
                'playVoice',
                'onVoicePlayEnd',
                'pauseVoice',
                'stopVoice',
                'uploadVoice',
                'downloadVoice',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'downloadImage',
                'getNetworkType',
                'openLocation',
                'getLocation',
                'hideOptionMenu',
                'showOptionMenu',
                'closeWindow',
                'scanQRCode',
                'chooseWXPay',
                'openProductSpecificView',
            ]
        });

        _loading.hide(function () {
            callback && callback();
        });
    }, function (e) {
        _loading.hide(function () {
            Component.toast(e.message).render();
        });
    });
};