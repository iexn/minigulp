function lang(key, language = ZH_CN) {
    return util.lang(key, language, function (err) {
        $$.debug(err);
    });
}

function weuialert(msg, callback) {
    return weui.alert(msg, callback, {
        isAndroid: false
    });
}
