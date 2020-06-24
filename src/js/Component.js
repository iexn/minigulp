/**
 * 组件层
 */
const Component = (function () {

    const Component = function () {};
    const _this = Component.prototype;

    //=include ../common/js/extends/ComponentMobile.js

    /**
     * 渲染topbar上的nd-groups-opt可操作按钮组
     * options：自定义按钮数组
     */
    _this.resetTabbar = function (type, options = []) {
        _this.renderTabbar(type, options);
    };

    /**
     * 渲染自定义按钮组
     */
    _this.renderTabbar = function (type, options = []) {

        if (Util.type(options) != 'array') {
            return false;
        }

        let group = [];
        
        options.map(option => {
            let {
                text = 'button',
                color = 'default',
                onclick = null,
                initClass = "",
                icon = ''
            } = option;

            if (type == 'menu') {
                group.push(this.createTabbarMenu(text, onclick, icon, color, initClass));
            } else if (type == 'button') {
                group.push(this.createTabbarButton(text, onclick, icon, color, initClass));
            }
        });
        
        $('.nd-bars').empty();
        group.map(item => {
            $('.nd-bars').append(item);
        });
    };

    /**
     * 创建一个菜单按钮，并附加事件
     */
    _this.createTabbarMenu = function (text, onclick, icon = '', color = 'default', initClass = "") {
        let button = $(`<button type="button" class="nd-btn nd-btn-${color} ${initClass}">
            <span class="nd-btn-frame">
                <span class="nd-btn-icon"><i class="fa fa-${icon}"></i></span>
                <span class="nd-btn-title">${text}</span>
            </span>
        </button>`);
        button.on('click', function (e) {
            onclick && onclick(e, id_stack);
        });
        return button;
    }

    /**
     * 创建一个普通按钮，并附加事件
     */
    _this.createTabbarButton = function (text, onclick, icon = '', color = 'default', initClass = "") {
        let button = $(`<button type="button" class="nd-btn nd-btn-${color} ${initClass}">
            <span class="nd-btn-default">
                <span class="nd-btn-title">${text}</span>
            </span>
        </button>`);
        button.on('click', function (e) {
            let _files = [];
            
            $("input[name='file']:checked").each((index, item) => {
                _files.push(cache_file[$(item).val()]);
            });

            onclick && onclick(e, id_stack, _files);
        });
        return button;
    }

    /**
     * 渲染文件列表
     */
    _this.renderFile = function ({prev: prev_id = false, __only_show_directory = Config.__only_show_directory, isSelect = true, breadchumb = ""}, files, callback, FilesDOMClass = '.nd-files') {

        let html = [];

        // 添加返回上一级
        if (prev_id !== false) {
            html.push(this.createBackup(prev_id, callback));
        }

        if (isSelect) {
            $(".nd-tabbar").find(".nd-btn-info").show();
            $(".nd-local-mkdir").show();
        } else {
            $(".nd-tabbar").find(".nd-btn-info").hide();
            $(".nd-local-mkdir").hide();
        }

        if (!Util.isEmpty(breadchumb)) {
            $(".nd-local-name").html(breadchumb);
        }

        // 添加文件列表
        files.map(file => {
            // 如果设置了只显示文件夹，排除掉非文件夹得内容
            if (__only_show_directory && file.type != "directory") {
                return;
            }

            html.push(this.createFile(file, callback));

            cache_file[file.rowkey] = file;
        });

        $(FilesDOMClass).empty();
        html.map(item => {
            $(FilesDOMClass).append(item);
        })
    };

    /**
     * 创建一个文件行
     * 返回一个file行的DOM
     */
    _this.createFile = function (file, callback) {
        let { id, type, title, rowkey, icon } = file;
        let disabled = "";
        if (file.type == "directory") {
            disabled = "disabled";
        }
        let html = `<li class="nd-file" data-id="${id}"><label>
            <input name="file" class="nd-choose" type="checkbox" value="${rowkey}" ${disabled}/>
            <div>
                <span class="nd-file-icon">
                    <img src="${BASE.PLUGIN_URL}/files_icon/${icon || type}.png" alt="">
                </span>
                <span class="nd-file-title">${title}</span>
            </div>
        </label></li>`;
        let $html = $(html);
        $html.on('click', function () {
            callback && callback(file);
        });

        return $html[0];
    };

    /**
     * 创建返回上一级行
     */
    _this.createBackup = function (prev_id, callback) {
        let html = `<li class="nd-file"><label><div>
            <span class="nd-file-title"><i class="fa fa-reply"></i>&ensp;返回上一级</span>
        </div></label></li>`
        let $html = $(html);
        $html.on('click', function () {
            callback && callback(false, prev_id);
        });
        return $html[0];
    };

    let mkdir_DOM = null;

    /**
     * 新建文件夹操作
     */
    _this.initMkdir = function () {
        debug('开始创建文件夹');
        // 判断是否可创建
        if ($('.nd-dialog-mkdir').length > 0) {
            return false;
        }
        
        let html = `<div class="nd-dialog nd-dialog-mkdir">
            <div class="nd-dialog-section">
                <div class="nd-dialog-header">新建文件夹</div>
                <div class="nd-dialog-body">
                    <div class="nd-dialog-text">
                        <input type="text" class="text" value="">
                        <span class="text-clear"><i class="fa fa-times"></i></span>
                    </div>
                </div>
                <div class="nd-dialog-footer">
                    <button type="button" class="nd-dialog-close">取消</button>
                    <button type="button" class="nd-dialog-submit">确定</button>
                </div>
            </div>
        </div>`;

        let $html = $(html);
        let $text = $html.find('.text');
        $text.val("新建文件夹");

        $html.find('.nd-dialog-close').on('click', function () {
            $html.removeClass('on');
        });

        $html.find('.text-clear').on('click', function () {
            $text.val('').trigger('focus');
        });

        Util.iosTextBlurScroll($text[0]);

        self.append($html);

        mkdir_DOM = $html[0];

        return mkdir_DOM;
    };

    _this.mkdir = function (callback) {
        let $html = $(mkdir_DOM);

        // 确认后执行创建文件夹接口
        let $submit = $html.find('.nd-dialog-submit');
        let $close  = $html.find('.nd-dialog-close');
        let $text   = $html.find('.text');
        let $clear  = $html.find('.text-clear');

        $text.on("blur", function () {
            this.value = this.value.trim().replace(/^(\s|\.)+|(\s|\.)+$/g, '');
        });

        $submit.off('click').on('click', function () {
            Util.confirm('确认创建文件夹？', function () {
                let submit_text = $submit.html();
                $submit.prop('disabled', true);
                $close.prop('disabled', true);
                $text.prop('disabled', true);
                $clear.hide();
                $submit.html('<i class="fa fa-spin fa-spinner"></i> ' + submit_text);
                callback && callback($text.val().trim().replace(/^(\s|\.)+|(\s|\.)+$/g, ''), id_stack[0], function () {
                    $html.removeClass('on');
                    $submit.prop('disabled', false).html(submit_text);
                    $close.prop('disabled', false);
                    $text.prop('disabled', false).val('新建文件夹');
                    $clear.show();
                });
            });
        });
        
        $html.addClass('on');
        $text[0].select();
        $text[0].setSelectionRange(0, $text[0].value.length);
    };

    return new Component;
})();