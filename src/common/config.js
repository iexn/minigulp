const config = {
    /* 基本信息 */
    // 默认头像
    DEFAULT_AVATAR: "/shijiwxy/weixin/images/defaultHead.jpg",

    // 请求路径
    API_PATH: "",

    /* 用户信息 */
    USER: {
        // token
        TOKEN  : "",
        // udid
        UDID   : "",
        // user_id
        ID: "",
        // org_id
        ORG_ID : "",
        // 终端version
        VERSION: ""
    },

    /** 
     * 注册jssdk功能
     */
    JSSDK_API_LIST: [
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
};

// 版本信息
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
