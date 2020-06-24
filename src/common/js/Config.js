const Config = {
    yunType: undefined,
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
        version: BASE.VERSION,
        // 部门信息
        department: {
            id: 0,
            name: ''
        },
        // 教师组信息，数组中的每项为 id 和 name
        groups: [],
        closeNetDiskAuth: BASE.closeNetDiskAuth
    },
    // 上传最大限制
    UPLOAD_MAX_SIZE: 50,
    // 文件
    FILE_ICONS: {
        "directory": "directory",

        // office
        "xls": "excel",
        "xlsx": "excel",
        "doc": "word",
        "docx": "word",
        "ppt": "ppt",
        "pptx": "ppt",

        // 媒体
        "mp3": "music",
        "wav": "music",
        "mp4": "video",
        "flv": "video",
        "jpg": "pic",
        "jpeg": "pic",
        "png": "pic",
        "gif": "pic",
        "bmp": "pic",
        "ico": "pic",
        "raw": "pic",

        // pdf
        "pdf": "pdf",

        // 文本
        "txt": "txt",
        "txt": "txt",
        "html": "txt",
        "htm": "txt",
        "asp": "txt",
        "jsp": "txt",
        "xml": "txt",
        "json": "txt",
        "properties": "txt",
        "md": "txt",
        "gitignore": "txt",
        "java": "txt",
        "py": "txt",
        "c": "txt",
        "cpp": "txt",
        "sql": "txt",
        "sh": "txt",
        "bat": "txt",
        "m": "txt",
        "bas": "txt",
        "prg": "txt",
        "cmd": "txt",

        // 压缩包
        "rar": "zip",
        "zip": "zip",
        "jar": "zip",
        "7-zip": "zip",
        "tar": "zip",
        "gzip": "zip",
        "7z": "zip",
    },
    DEFAULT_FILE_ICON: "others",
    __only_show_directory: false,
};
