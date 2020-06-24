/**
 * 渲染层
 */
const Render = function () {

    let Render = function () {};
    let _this = Render.prototype;

    /**
     * 渲染topbar上的nd-groups-opt可操作按钮组
     * options：自定义按钮数组
     */
    Render.prototype.resetTabbar = function (type, options = []) {
        this.renderTabbar(type, options);
    };

    /**
     * 渲染自定义按钮组
     */
    Render.prototype.renderTabbar = function (type, options = []) {

        if (Util.type(options) != 'array') {
            return false;
        }

        let group = [];
        
        options.map(option => {
            let {
                text = 'button',
                color = 'default',
                onclick = null,
                icon = ''
            } = option;

            if (type == 'menu') {
                group.push(this.createTabbarMenu(text, onclick, icon, color));
            } else if (type == 'button') {
                group.push(this.createTabbarButton(text, onclick, icon, color));
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
    Render.prototype.createTabbarMenu = function (text, onclick, icon = '', color = 'default') {
        let button = $(`<button type="button" class="nd-btn nd-btn-${color}">
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
    Render.prototype.createTabbarButton = function (text, onclick, icon = '', color = 'default') {
        let button = $(`<button type="button" class="nd-btn nd-btn-${color}">
            <span class="nd-btn-default">
                <span class="nd-btn-title">${text}</span>
            </span>
        </button>`);
        button.on('click', function (e) {
            onclick && onclick(e, id_stack);
        });
        return button;
    }

    /**
     * 渲染文件列表
     */
    Render.prototype.renderFile = function (prev_id, files, callback, FilesDOMClass = '.nd-files') {

        let html = [];

        // 添加返回上一级
        if (prev_id !== false) {
            html.push(this.createBackup(prev_id, callback));
        }

        // 添加文件列表
        files.forEach(file => {
            html.push(this.createFile(file, callback));
        });

        $(FilesDOMClass).empty();
        html.map(item => {
            $(FilesDOMClass).append(item);
        });
    };

    /**
     * 创建一个文件行
     * 返回一个file行的DOM
     */
    Render.prototype.createFile = function (file, callback) {
        let { id, type, title } = file;
        let html = `<li class="nd-file" data-id="${id}">
            <span class="nd-file-icon">
                <img src="${BASE.PLUGIN_URL}/files_icon/${type}.png" alt="">
            </span>
            <span class="nd-file-title">${title}</span>
        </li>`;
        let $html = $(html);
        $html.on('click', function () {
            callback && callback(file);
        });

        return $html[0];
    };

    /**
     * 创建返回上一级行
     */
    Render.prototype.createBackup = function (prev_id, callback) {
        let html = `<li class="nd-file">
            <span class="nd-file-title"><i class="fa fa-reply"></i>&ensp;返回上一级</span>
        </li>`
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
    Render.prototype.initMkdir = function () {
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
                        <input type="text" class="text" value="新建文件夹">
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

    Render.prototype.mkdir = function (callback) {
        let $html = $(mkdir_DOM);

        // 确认后执行创建文件夹接口
        let $submit = $html.find('.nd-dialog-submit');
        let $close  = $html.find('.nd-dialog-close');
        let $text   = $html.find('.text');
        let $clear  = $html.find('.text-clear');

        $submit.off('click').on('click', function () {
            Util.confirm('确认创建文件夹？', function () {
                let submit_text = $submit.html();
                $submit.prop('disabled', true);
                $close.prop('disabled', true);
                $text.prop('disabled', true);
                $clear.hide();
                $submit.html('<i class="fa fa-spin fa-spinner"></i> ' + submit_text);
                callback && callback(function () {
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

    return new Render();
}();
