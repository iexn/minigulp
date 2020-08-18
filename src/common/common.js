function lang(key, language = ZH_CN) {
    return util.lang(key, language, function (err) {
        $$.debug(err);
    });
}
