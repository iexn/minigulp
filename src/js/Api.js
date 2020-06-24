/**
 * 接口层
 * 依赖：Util.js
 */
const Api = function () {

    const Api = function () {};
    const _this = Api.prototype;

    //=include ../common/js/extends/Api.js


    // 所有用到的接口名称
    _this.urls = {
        getTeacherInfo: "getTeacherInfo",
        getFiles      : "fileList",
        getDirectory  : "getFolders",
        mkdir         : "makeFolder",
        preview       : "preview",
        copyOrMoveFile: "copyOrMoveFile",
        fileExists    : "check",
    };

    _this.getPreviewUrl = function (id) {
        return _this.base_module_url + "ufpreview/" + id;
    };

    /**
     * 获取该教师简要信息
     */
    let listOf = [];
    _this.getChunkList = function ({}, callback, fail) {
        id_stack.length = 0;
        
        if (!Util.isEmpty(listOf)) {
            callback && callback(listOf);
            return;
        }
        
        let _loading = Component.loading().render();

        this.run("getTeacherInfo", {}, function (result) {
            let data = result.data;
            let _list = [];

            _list.push({
                icon: "dir",
                type: "directory",
                yunType: "10",
                belongId: data.user_id,
                id: 0,
                rowkey: 0,
                key: "u",
                title: "我的云盘",
                originalName: "我的云盘",
                originalPath: "我的云盘"
            });
            _list.push({
                icon: "dir",
                type: "directory",
                yunType: "0",
                belongId: data.org_id,
                id: 0,
                rowkey: 0,
                key: "s",
                title: "学校云盘",
                originalName: "学校云盘",
                originalPath: "学校云盘"
            });
            // if (data.department.dep_id) {
            //     _list.push({
            //         type: "directory",
            //         yunType: "1",
            //         belongId: data.department.dep_id,
            //         id: 0,
            //         rowkey: 0,
            //         key: "d",
            //         title: "部门共享",
            //         originalName: "部门共享",
            //         originalPath: "/部门共享"
            //     });
            // }

            if (data.departments.length > 0) {
                let departmentsChildren = [];
                data.departments.map(department => {
                    departmentsChildren.push({
                        type: "directory",
                        yunType: "1",
                        belongId: department.dep_id,
                        id: 0,
                        rowkey: 0,
                        key: "d." + department.dep_id,
                        title: "" + department.dep_name,
                        originalName: "" + department.dep_name,
                        originalPath: "/部门云盘/" + department.dep_name,
                        noSelect: true
                    });
                });
                _list.push({
                    icon: "dir",
                    type: "directory",
                    yunType: "1",
                    belongId: "null",
                    id: 0,
                    rowkey: 0,
                    key: "d",
                    title: "部门云盘",
                    originalName: "部门云盘",
                    originalPath: "部门云盘",
                    children: departmentsChildren
                });
            }

            if (data.groups.length > 0) {
                let groupsChildren = [];
                data.groups.map(group => {
                    groupsChildren.push({
                        type: "directory",
                        yunType: "2",
                        belongId: group.group_id,
                        id: 0,
                        rowkey: 0,
                        key: "g." + group.group_id,
                        title: "" + group.group_name,
                        originalName: "" + group.group_name,
                        originalPath: "/教师组云盘/" + group.group_name,
                        noSelect: true
                    });
                });
                _list.push({
                    icon: "dir",
                    type: "directory",
                    yunType: "2",
                    belongId: "null",
                    id: 0,
                    rowkey: 0,
                    key: "g",
                    title: "教师组云盘",
                    originalName: "教师组云盘",
                    originalPath: "教师组云盘",
                    children: groupsChildren
                });
            }

            listOf = _list;

            _loading.hide(function () {
                callback && callback(listOf);
            });

            // "list": [
            //     { "id": "my", "type": "txt", "title": "我的云盘" },
            //     { "id": "sch", "type": "txt", "title": "学校云盘" },
            //     { "id": "sector", "type": "txt", "title": "部门共享" },
            //     { "id": "group", "type": "txt", "title": "教师组共享" }
            // ]

        }, function (e) {
            fail && fail();
            console.error(e)
        });
    };

    /**
     * 获取当前路径下第一层的全部文件详情
     */
    _this.getFiles = function ({ rowkey, yunType, belongId }, callback, fail) {
        let _loading = Component.loading().render();

        this.run("getFiles", {
            parentRowkey: rowkey,
            yunType,
            belongId
        }, function (result) {
            _loading.hide(function () {
                callback && callback(result);
            });
        }, function () {
            _loading.hide();
            fail && fail();
        });
    };

    /**
     * 获取一个层级下的所有文件夹
     */
    _this.getDirectory = function ({ key, parent_id, yunType, belongId }, callback) {
        this.run("getDirectory", {
            parentId: parent_id,
            yunType: yunType,
            belongId: belongId
        }, callback);
    };

    /**
     * 获取进入选择盘列表
     */
    _this.getAuth = function (callback) {
        this.run('get_auth', {}, callback);
    };

    _this.mkdir = function ({ dir, name }, callback) {
        this.run("mkdir", {
            parentRowkey: dir.rowkey,
            mkdir: Util.Base64Encode(name == undefined ? "" : name),
            yunType: dir.yunType,
            belongId: dir.belongId,
            fileName: Uri.encodeName(dir.originalName),
            filePath: Uri.encodePath(dir.originalName, dir.originalPath),
        }, callback);
    };

    _this.copy = function ({ ids, key, yunType, belongId }, callback, fail) {
        this.run("copyOrMoveFile", {
            ids: ids,
            destRowkey: key,
            flag: 1,
            yunType: yunType,
            belongId: belongId,
            fileName: "",
            filePath: "",
            newFilePath: ""
        }, callback, fail);
    };

    _this.fileExists = function ({ ids, key, yunType, belongId, flag }, confirm, callback, fail) {
        this.run("fileExists", {
            ids: ids,
            destRowkey: key,
            flag: flag,
            yunType: yunType,
            belongId: belongId
        }, function (result) {
            let data = result.data || [];
            if (data.length > 0) {
                confirm && confirm(data, function (ids = "") {
                    callback && callback(ids);
                });
                return false;
            } else {
                callback && callback(ids);
            }
        }, function (result) {
            fail && fail();
        });
    };

    _this.checkAuth = function () {
        return Config.user.closeNetDiskAuth;
    };

    return new Api();
}();
