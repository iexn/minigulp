/**
 * 功能层
 * 基于渲染层实现，一般实现多处功能同一效果的代码
 */
const Compile = function () {

    let Compile = function () {};
    let _this = Compile.prototype;

    Compile.prototype.renderFiles = function (file, options = {}) {
        let destroyFile = id_stack[0];
        
        if (file === false) {
            id_stack.shift();
        } else if (file !== true) {
            let { id: parent_id } = file;
            // 如果是true，当前页刷新，否则视为向下前进
            id_stack.unshift(file);
        }

        file = id_stack[0];

        if (Util.type(file) == "array") {
            if (destroyFile) {
                let originalPath = destroyFile.originalPath.replace(/^(\s|\/)+|(\s|,\/)+$/g, '').split("/");
                originalPath.pop();
                options.breadchumb = originalPath.join("/");    
            }

            // 这里是直接显示列表，不通过下面的接口获取数据
            Component.renderFile({prev: 0, isSelect: false, breadchumb: options.breadchumb}, file.map(item => {
                item.belongId = item.belongId;
                item.yunType  = item.yunType;
                item.title    = item.originalName;

                item.type     = item.file ? "txt" : "directory";

                if (item.file) {
                    if (item.originalName.indexOf(".") > -1) {
                        let st = item.originalName.split(".");
                        item.type = st[st.length - 1].toLowerCase();
                        if (Config.FILE_ICONS.hasOwnProperty(item.type)) {
                            item.type = Config.FILE_ICONS[item.type];
                        } else {
                            item.type = "others";
                        }
                    } else {
                        item.type = "others";
                    }
                } else {
                    item.type = "directory";
                }

                return item;
            }), function (file) {
                console.warn("file", file);

                // false为上一页
                if (file === false) {
                    _this.renderFiles(false);
                    return true;
                }

                // 文件不可进入下一层
                if (file.type != "directory") {
                    // 文件选中，遍历页面的nd-file，有选中显示按钮
                    $(".submit-control").prop("disabled", $(".nd-choose:checked").length == 0);
                    return false;
                }

                // 否则正常为进入某个文件夹
                _this.renderFiles(file);

                $(".submit-control").prop("disabled", true);
            });

            return true;
        }

        if (Util.type(file) == "undefined") {
            self.attr("data-tab", 1);
            // edit.切换到第一页时，将第二页的显示数据都清掉
            self.find(".tab2").find(".nd-files").empty();
        }

        if (file) {
            let _loading = Component.loading().render();

            Api.getFiles({
                rowkey: file.rowkey,
                yunType: file.yunType,
                belongId: file.belongId
            }, function (result) {
                _loading.hide();
    
                Config.yunType = file.yunType;
                
                // 变更路径导航
                let breadchumb = result.data.originalDir;
                if (breadchumb[0] == "/") {
                    breadchumb = breadchumb.substr(1);
                }
    
                Component.renderFile({prev: file.id, breadchumb}, result.data.filelist.map(item => {
                    item.belongId = file.belongId;
                    item.yunType  = file.yunType;
                    item.title    = item.originalName;
    
                    item.type     = item.file ? "txt" : "directory";
    
                    if (item.file) {
                        if (item.originalName.indexOf(".") > -1) {
                            let st = item.originalName.split(".");
                            item.type = st[st.length - 1].toLowerCase();
                            if (Config.FILE_ICONS.hasOwnProperty(item.type)) {
                                item.type = Config.FILE_ICONS[item.type];
                            } else {
                                item.type = "others";
                            }
                        } else {
                            item.type = "others";
                        }
                    } else {
                        item.type = "directory";
                    }
    
                    debug(item);
                    return item;
                }), function (file, prev_id) {
                    debug("file", file);
    
                    // false为上一页
                    if (file === false) {
                        _this.renderFiles(false);
                        return true;
                    }
    
                    // 文件不可进入下一层
                    if (file.type != "directory") {
                        // 文件选中，遍历页面的nd-file，有选中显示按钮
                        $(".submit-control").prop("disabled", $(".nd-choose:checked").length == 0);
                        return false;
                    }
    
                    // 否则正常为进入某个文件夹
                    _this.renderFiles(file);
    
                    $(".submit-control").prop("disabled", true);
                });
            });
        }
    };

    /**
     * 获取刚进入选择盘列表
     */
    Compile.prototype.renderAuth = function (__only_show_directory) {
        let _loading = Component.loading().render();

        Api.getChunkList({}, function (listOf) {
            _loading.hide();
            
            Component.renderFile({__only_show_directory}, listOf, function (file) {
                $(".submit-control").prop("disabled", true);
                debug("Component.renderFile -> ", file);
                if (Util.type(file.children) == "array" && !Util.isEmpty(file.children)) {
                    self.attr('data-tab', 2);
                    _this.renderFiles(file.children, {
                        breadchumb: file.originalPath
                    });
                } else {
                    self.attr('data-tab', 2);
                    _this.renderFiles(file);
                }
            }, '.nd-files-site');
        });
    };

    /**
     * 新建文件夹操作
     */
    Compile.prototype.mkdir = function (callback) {
        return Component.mkdir(callback);
    };

    return new Compile();
}();
