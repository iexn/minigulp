const Config = (function () {

    let Config = {
        default_avatar: BASE.DEFAULT_AVATAR || "/shijiwxy/weixin/images/defaultHead.jpg",
        _page: {
            detail: "./detail.html?d={D_id}&a={A_id}&ad={AD_id}",
        },
        page: function (name, params = {}) {
            if (!Config._page.hasOwnProperty(name)) {
                return "";
            }
            let page = Config._page[name];
            page = page.replace(/{(\w+)}/g, function (match, name, index, str, callee) {
                return params[name] || "";
            });
            return page;
        },
        api: {
            base_url: BASE.API_BASE_URL || ""
        },
        user: {
            token: BASE.TOKEN,
            udid: BASE.UDID,
            id: BASE.USER_ID,
            org_id: BASE.ORG_ID,
            version: BASE.VERSION
        }
    };

    return Config;
})();