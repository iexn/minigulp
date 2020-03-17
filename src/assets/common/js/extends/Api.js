// 接口公共地址前缀
_this.base_url = Config.api.base_url + "/form/approval/";

// 构建一个统一请求方式
_this.exec = {
    // 请求的所有数据
    query: {
        token: Config.user.token,
        udid : Config.user.udid,
        user_id: Config.user.id,
        version: Config.user.version,
        org_id: Config.user.org_id
    },
    // 暂存的用户数据数组
    params: {},
    callback: function () {},
    fail: function () {}
};

/**
 * 进行一个post请求
 */
function _post(url, data, callback, fail) {
    let params = new FormData();
    for(let name in data) {
        params.append(name, data[name]);
    }
    for(let name in _this.exec.query) {
        params.append(name, _this.exec.query[name]);
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
        }
    }).done(function (result) {
        // 如果请求成功，但接口返回失败，提示错误
        if (result.success !== true) {
            fail && fail({
                code: result.code,
                message: result.message
            });
            return;
        }
        callback && callback(result, true);
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

function _get(url, data, callback, fail) {
    let params = [];
    for(let name in data) {
        params.push(name + "=" + data[name]);
    }
    for(let name in _this.exec.query) {
        params.push(name + "=" + _this.exec.query[name]);
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
        }
    }).done(function (result) {
        // 如果请求成功，但接口返回失败，提示错误
        if (result.success !== true) {
            fail && fail({
                code: result.code,
                message: result.message
            });
            return;
        }
        callback && callback(result, true);
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

_this.post = _post;
_this.get = _get;

_this.exec.post = function (name) {
    let exec = _this.exec;
    let url = _this.base_url + _this.urls[name];
    _post(url, exec.params, exec.callback, exec.fail);
};

/**
 * 快速执行一个接口
 * 使用于普通通用的调用情况
 */
_this.run = function (name, params, callback, fail) {
    _this.exec.params = params;

    if (Object.prototype.toString.call(callback) == '[object Function]') {
        _this.exec.callback = callback;
    }

    if (Object.prototype.toString.call(fail) == '[object Function]') {
        _this.exec.fail = fail;
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