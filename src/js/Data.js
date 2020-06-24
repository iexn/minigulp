const Data = (function () {

    const Data = function () {};
    const _this = Data.prototype;

    let _data = {
        vm: 'all',
        // 当前查看的文件夹类型，校级云盘 0  我的云盘 1   我的分享 21 教师分享 22
        ftype: 'my',
        parent_id: 0,
        key: 0,
        files: {},
        yunType: 10,
        belongId: '',
        // 初始展开传输列表分页配置
        tp_page: 1,
        tp_size: 20
    };

    function push(key, value) {
        if (key == 'files') {
            debug(`Data [${key}] set error: ${key} can not a string "files"`);
            return false;
        }
        if (value == undefined || value == null) {
            debug(`Data [${key}] set error: ${value} can not null or undefined"`);
            return false;
        }
        _data[key] = value;
    }

    /**
     * 整理file文件数据格式
     */
    function compileFile(file) {
        let processFile = {
            key          : file.rowkey,
            id           : file.fileId,
            name         : file.originalName,
            path         : file.originalPath,
            create_time  : file.date,
            allow_preview: file.viewflag == 'Y',
            sortby       : file.sortColumn,
            sortmode     : file.sort,
            type         : file.file ? 'file' : 'directory',
            founder      : {
                id: file.userId,
                name: file.userName
            }
        };

        if (processFile.type == 'file') {
            let ext_index = processFile.name.lastIndexOf(".");
            if (ext_index != -1) {
                processFile.type = processFile.name.slice(ext_index + 1);
                processFile.type = processFile.type.toLowerCase();
            }
        }
        
        processFile._type = processFile.type;

        if (Config.FILE_ICONS.hasOwnProperty(processFile.type)) {
            processFile.type = Config.FILE_ICONS[processFile.type];
        } else {
            processFile.type = "others";
        }

        processFile._parent_key = file._parent_key;

        return processFile;
    }

    _this.set = function (key , value) {

        if (toString.call(key) == '[object Object]') {
            for (let _k in key) {
                push(_k, key[_k]);
            }
        } else {
            push(key, value);
        }

    };

    _this.get = function (key) {
        debug("Data.get", _data);
        if (!_data.hasOwnProperty(key)) {
            return '';
        }
        return _data[key];
    };

    // 已读文件缓存，仅限获取后查询用
    let Files = function () {};

    Files.prototype.push = function (file) {
        let key = file.rowkey;
        // 整理file数据格式
        file = compileFile(file);

        _data.files[key] = file;

        return file;
    };

    Files.prototype.get = function (key) {
        if (!_data.files.hasOwnProperty(key)) {
            return false;
        }
        return _data.files[key];
    };

    Files.prototype.struct = function (file) {
        let _file = compileFile(file);
        
        let struct = {
            is_file: file.file,
            id: file.id,
            file_id: file.fileId,
            name: file.originalName,
            path: file.originalPath,
            rowkey: file.rowkey,
            rowkey_path: file.rowkeyPath,
            extension: "",
            icon: `${BASE.PLUGIN_URL}/files_icon/${_file.type.toLowerCase()}.png`
        };

        if (struct.is_file) {
            if (struct.name.indexOf(".") != -1) {
                struct.extension = struct.name.split(".").pop();
            }
        }

        struct.preview = Api.getPreviewUrl(file.id);

        return struct;
    };

    _this.Files = new Files;

    return window.data = new Data;
})();