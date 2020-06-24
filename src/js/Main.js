let oaNetDiskMobile = (function (init_selector) {

    let oaNetDiskMobile = function (token, udid) {
        if (Util.isEmpty(BASE)) {
            let Base = JSON.parse(sessionStorage.baseUser);
    
            BASE = {
                DEFAULT_AVATAR : "/shijiwxy/weixin/images/defaultHead.jpg",
                API_BASE_URL   : "",
                PLUGIN_URL     : "/edufs/html/plugins/oaNetdisk-path",
                TOKEN          : Base.token,
                UDID           : Base.udid,
                USER_ID        : Base.orguser.user_id,
                ORG_ID         : Base.orguser.org_id,
                VERSION        : 3,
                IS_ADMIN       : Base.orguser.rlids && (Base.orguser.rlids.split(",").includes("1") || Base.orguser.rlids.split(",").includes("32")),
                closeNetDiskAuth: sessionStorage.closeNetDiskAuth === "1"
            };

            Config.api.base_url = BASE.API_BASE_URL;
            Config.user.token   = BASE.TOKEN;
            Config.user.udid    = BASE.UDID;
            Config.user.id      = BASE.USER_ID;
            Config.user.org_id  = BASE.ORG_ID;
            Config.user.version = BASE.VERSION;
            Config.user.closeNetDiskAuth = BASE.closeNetDiskAuth;
            
        }
    };
    oaNetDiskMobile.prototype.init = function () {};
    oaNetDiskMobile.prototype.path = function () {};

    /** 
     * 文件数据结构
     */
    oaNetDiskMobile.prototype.struct = function (file) {
        if (Util.isEmpty(file)) {
            return [];
        }

        let _file = file;

        if (Util.type(_file) == "object") {
            _file = [_file];
        }

        if (Util.type(_file) == "array") {
            let structs = _file.map(__file => {
                if (Util.isEmpty(__file)) {
                    return __file;
                }
                return Data.Files.struct(__file);
            });

            if (Util.type(file) == "object") {
                return structs[0];
            } else {
                return structs;
            }
            
        } else {
            return [];
        }
        
    };

    oaNetDiskMobile.prototype.save = function (rowkey, callback, fail) {
        if (Util.isEmpty(rowkey)) {
            return false;
        }

        Api.copy({
            ids: rowkey,
            key: "0",
            yunType: "10",
            belongId: Config.user.id
        }, function (result) {
            callback && callback(result);
        }, function (result) {
            fail && fail(result);
        });

        return true;
    };

    oaNetDiskMobile.prototype.check = function (rowkey, confirm, callback, fail) {
        if (Util.isEmpty(rowkey)) {
            return false;
        }
        
        Api.fileExists({
            ids: rowkey,
            key: "0",
            yunType: "10",
            belongId: Config.user.id,
            flag: 1
        }, function (data, done) {
            confirm && confirm(data, done);
        }, function (result) {
            callback && callback(result);
        }, function (result) {
            fail && fail(result);
        });

        return true;
    };


    oaNetDiskMobile.prototype.select = function (callback, cancel) {
        if (Api.checkAuth()) {
            Util.alert("需申请开通“校园云盘”功能，才可添加文件等附件", function () {
                cancel && cancel();
            });
            return;
        }

        parent = Render.create(`<div id="oaNetDisk" data-tab="1">
            <div class="tab tab1">
                <ul class="nd-files-site"></ul>
                <div class="nd-tabbar nd-close-feal">
                    <button type="button" class="nd-btn nd-close">
                        <span class="nd-btn-default">
                            <span class="nd-btn-title">取消</span>
                        </span>
                    </button>
                </div>
            </div>
            <div class="tab tab2">
                <div class="nd-header">
                    <div class="nd-localize">
                        <span class="nd-local"><i class="fa fa-map-marker"></i>&ensp;<span class="nd-local-name">我的云盘</span></span>
                    </div>
                </div>
                <div class="nd-layers">
                    <div class="nd-layer content" style="position:static">
                        <ul class="nd-files"></ul>
                    </div>
                </div>
                <div class="nd-tabbar nd-bars"></div>
            </div>
        </div>`);
        self = $(parent);
        $('body').append(self);

        new BScroll(document.querySelector('.nd-layers'), {
            swipeBounceTime: 200,
            bounceTime: 200,
            click: true,
            taps: true,
            preventDefaultException: {
                className: /(^|\s)nd\-files(\s|$)/,
                tagName:/^(INPUT|TEXTAREA|BUTTON|SELECT|AUDIO|LABEL)$/
            }
        });
        
        let $close = self.find(".nd-close-feal");

        $close.on('click', function () {
            self.remove();
            cancel && cancel();
        });

        Config.__only_show_directory = false;
        Compile.renderAuth(false);

        Listener.initTabbar('button', [
            {
                text: '取消', 
                color: '', 
                onclick: function (e) {
                    self.remove();
                    cancel && cancel();
                }
            },
            {
                text: '添加', 
                color: 'info', 
                icon: 'pencil-square-o',
                initClass: "submit-control",
                onclick: function (e, stack, files) {
                    if (Util.isEmpty(files)) {
                        Util.alert("请选择文件");
                        return false;
                    }
                    debug('点击了', '添加', files);

                    let data = files.map(file => {
                        return Data.Files.struct(file);
                    });

                    callback(data, function () {
                        self.remove();
                    });
                }
            }
        ]);

        return {
            hide: function () {
                self.remove();
            }
        }
    };

    oaNetDiskMobile.prototype.selectPath = function (callback, cancel, options = {}) {
        if (Api.checkAuth()) {
            Util.alert("需申请开通“校园云盘”功能，才可添加文件等附件", function () {
                cancel && cancel();
            });
            return;
        }

        let { text = "保存到这里" } = options;
        parent = Render.create(`<div id="oaNetDisk" data-tab="1">
            <div class="tab tab1">
                <ul class="nd-files-site"></ul>
                <div class="nd-tabbar nd-close-feal">
                    <button type="button" class="nd-btn nd-close">
                        <span class="nd-btn-default">
                            <span class="nd-btn-title">取消</span>
                        </span>
                    </button>
                </div>
            </div>
            <div class="tab tab2">
                <div class="nd-header">
                    <div class="nd-localize">
                        <span class="nd-local"><i class="fa fa-map-marker"></i>&ensp;<span class="nd-local-name">我的云盘</span></span>
                        <span class="nd-local-mkdir"><a href="javascript:;" class="nd-mkdir">新建文件夹</a></span>
                    </div>
                </div>
                <div class="nd-layers">
                    <div class="nd-layer">
                        <ul class="nd-files"></ul>
                    </div>
                </div>
                <div class="nd-tabbar nd-bars"></div>
            </div>
        </div>`);
        self = $(parent);
        $('body').append(self);
        
        let $close = self.find(".nd-close-feal");
        let $mkdir = self.find(".nd-mkdir");

        $close.on('click', function () {
            self.remove();
            cancel && cancel();
        });

        Component.initMkdir();
        $mkdir.on('click', function () {
            Component.mkdir(function (name, dir, done) {
                Api.mkdir({
                    name,
                    dir
                }, function (result) {
                    Compile.renderFiles(true);
                    done()
                });
            });
        });

        Config.__only_show_directory = true;
        Compile.renderAuth(true);

        Listener.initTabbar('button', [
            {
                text: '取消', 
                color: '', 
                onclick: function (e) {
                    self.remove();
                    cancel && cancel();
                }
            },
            {
                text: text, 
                color: 'info', 
                icon: 'pencil-square-o',
                onclick: function (e, stack, file) {
                    debug('点击了', text, stack[0]);

                    let dir = stack[0];

                    let data = Data.Files.struct(dir);

                    callback(data, function () {
                        self.remove();
                    });
                }
            },
        ]);

        return {
            hide: function () {
                self.remove();
            }
        }
    };

    return oaNetDiskMobile;
})();