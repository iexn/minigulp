//=include ./Component.js

/**
 * 软提示
 */
let _CACHE_TOAST_DOMS;
_this.toast = function (data) {
    if (typeof data == 'string') {
        data = {
            text: data
        };
    }
    let _data = Object.assign({
        // 提示文字，必填
        text: '',
        // 消失延时毫秒数
        delay: 3000
    }, data);

    if (_data.text == '') {
        return false;
    }

    let DOM = Render.create(`<div class="toast">
        <div class="toast-box">${_data.text}</div>
    </div>`);

    return {
        el: DOM,
        render: function (callback) {
            // 清除上一次显示的DOM
            if (_CACHE_TOAST_DOMS) {
                _CACHE_TOAST_DOMS.parentNode.removeChild(_CACHE_TOAST_DOMS);
            }

            _CACHE_TOAST_DOMS = DOM;

            $("body").addClass('clamp');
            setTimeout(() => {
                $(DOM).addClass('on');
            }, 0);

            setTimeout(() => {
                callback && callback();
                $("body").removeClass('clamp');
                $(DOM).removeClass('on');
                setTimeout(() => {
                    DOM.parentNode.removeChild(DOM);
                    _CACHE_TOAST_DOMS = undefined;
                }, _data.delay + 1000);
            }, _data.delay);

            $("body").append(DOM);
        }
    };
};

/**
 * 加载中
 */
let _CACHE_LOADING_DOMS;
_this.loading = function (data = "") {
    if (typeof data == 'string') {
        data = {
            text: data
        };
    }

    let _data = Object.assign({
        // 提示文字，必填
        text: ""
    }, data);

    let DOM = Render.create(`<div class="loading">
        <div class="loading-box">
            <i class="fa fa-spinner fa-spin"></i>
            ${_data.text}
        </div>
    </div>`);

    return {
        el: DOM,
        render: function () {
            // 清除上一次显示的DOM
            if (_CACHE_LOADING_DOMS) {
                _CACHE_LOADING_DOMS.parentNode.removeChild(_CACHE_LOADING_DOMS);
            }

            _CACHE_LOADING_DOMS = DOM;

            $('body').addClass('clamp');
            setTimeout(() => {
                $(DOM).addClass('on');
            }, 0);

            $('body').append(DOM);

            return {
                hide: function (callback) {
                    $('body').removeClass('clamp');
                    $(DOM).removeClass('on');
                    setTimeout(() => {
                        DOM.parentNode.removeChild(DOM);
                        _CACHE_LOADING_DOMS = undefined;
                        callback && callback();
                    }, 300);
                }
            };

        }
    };
};

/**
 * 模态框
 */
_this.media = function (data) {
    if (typeof data == 'string') {
        data = {
            component: ""
        };
    }
    let _data = Object.assign({
        title: "无标题",
        closeConfirm: false,
        body: undefined,
        onComplete: function (data, done) { done(); }
    }, data);

    if (_data.text == '') {
        return false;
    }

    let DOM = Render.create(`<div class="media">
        <div class="media-box">
            <div class="media--header">
                <span>${_data.title}</span>
                <span class="media--close"><i class="fa fa-times"></i></span>
            </div>
            <div class="media--body"></div>
            <div class="media--footer">
                <button type="button" class="btn btn-small media--close">取消</button>
                <button type="button" class="btn btn-small btn-primary media--complete">确定</button>
            </div>
        </div>
    </div>`);

    $(DOM).find(".media--body").append(_data.body);

    $(DOM).on("close", function () {
        $("body").removeClass('clamp');
        $(DOM).removeClass("on");
        setTimeout(() => {
            DOM.parentNode.removeChild(DOM);
        }, 300);
    });

    $(DOM).on("complete", function (e) {
        let data = {};
        $(_data.body).find("[data-media-form-name]").each((index, item) => {
            let $item = $(item);
            let key = $item.attr("data-media-form-name");
            let value = $item.attr("data-media-form-value") || $item.val() || "";
            data[key] = value;
        });

        _data.onComplete(data, function () {
            $(DOM).trigger("close");
        });
    });

    $(DOM).find(".media--close").on("click", function () {
        if (_data.closeConfirm) {
            let confirm_text = "确定关闭此弹窗？";
            if (typeof _data.closeConfirm == "string") {
                confirm_text = _data.closeConfirm;
            }
            if (!window.confirm(confirm_text)) {
                return false;
            }
        }
        $(DOM).trigger("close");
    });

    $(DOM).find(".media--complete").on("click", function () {
        $(DOM).trigger("complete");
    });

    _data.el = DOM;
    _data.render = function () {
        $("body").addClass('clamp');
        setTimeout(() => {
            $(DOM).addClass('on');
        }, 0);
        $("body").append(DOM);

        return _data;
    };

    return _data;
};

/**
 * 确认框
 */
_this.confirm = function (message = "继续操作？", onClick = function () {}) {
    let DOM = Render.create(`<div class="confirm">
        <div class="confirm-box">
            <div class="confirm--title">${message}</div>
            <div class="confirm--button">
                <span class="confirm-close">取消</span>
                <span class="confirm-complete">确定</span>
            </div>
        </div>
    </div>`);

    $(DOM).on("close", function (e, onClick) {
        console.log(arguments)
        $(this).removeClass("on");
        setTimeout(() => {
            DOM.parentNode.removeChild(DOM);
            onClick && onClick();
        }, 300);
    });

    $(DOM).find(".confirm-close").on("click", function () {
        $(this).trigger("close");
    });

    $(DOM).find(".confirm-complete").on("click", function () {
        $(this).trigger("close", onClick);
    });

    return {
        render: function () {
            setTimeout(() => {
                $(DOM).addClass("on");
            }, 0);
            $("body").append(DOM);
        }
    };
};

/**
 * 抽屉
 */
let _CACHE_DRAWER_DOMS = null;
_this.drawer = function (data = {}) {
    let _data = Object.assign({
        color: "primary",
        // +yk: 扩展栏
        stretch: null,
        is_show: false,
        body: "",
        closeByBlank: true,
        onComplete: function () {},
        onClose: function () {}
    }, data);

    let DOM = Render.create(`<div class="half-screen-dialog">
        <div class="half-screen-dialog-box">
            <div class="half-screen-dialog--header"></div>
            <div class="half-screen-dialog--body"></div>
            <div class="half-screen-dialog--footer">
                <button class="btn btn-${_data.color} btn-half-round screen-complete">确定</button>
            </div>
        </div>
    </div>`);

    let $Half_screen_dialog__body = $(DOM).find('.half-screen-dialog--body');
    let $Half_screen_dialog__footer = $(DOM).find('.half-screen-dialog--footer');

    if (_data.stretch) {
        $Half_screen_dialog__footer.prepend(_data.stretch);
        $Half_screen_dialog__footer.children(".btn").addClass("btn-small");
    }

    // 加载数据
    $Half_screen_dialog__body.append(_data.body);

    // 切换显示隐藏
    Object.defineProperty(data, 'is_show', {
        get: function () {
            return _data.is_show;
        },
        set: function (val) {
            _data.is_show = !!val;

            if (_data.is_show) {
                $('body').addClass('clamp');
                $(DOM).addClass('on');
                $(DOM).find('.half-screen-dialog-box').animate({
                    right: 0
                });
            } else {
                $('body').removeClass('clamp');
                $(DOM).find('.half-screen-dialog-box').animate({
                    right: '-100%'
                });
                $(DOM).removeClass('on');
                setTimeout(() => {
                    if (_CACHE_DRAWER_DOMS) {
                        _CACHE_DRAWER_DOMS.parentNode.removeChild(_CACHE_DRAWER_DOMS);
                        _CACHE_DRAWER_DOMS = null;
                    }
                }, 600);
            }
        }
    });

    // 点击背景时
    $(DOM).on('click', function () {
        if (_data.closeByBlank) {
            data.is_show = false;
            _data.onClose.call(data);
        }
    });

    // 禁止冒泡点击
    $(DOM).children().on('click', function (e) {
        e.stopPropagation();
    });

    // 点击确定
    $(DOM).find('.screen-complete').on('click', function () {

        // 发送数据通知
        let result = _data.onComplete.call(data);

        // 只有明确返回false时才不会关闭抽屉
        if (result !== false) {
            // 关闭显示层
            data.is_show = false;
        }
    });

    data.el = DOM;
    data.render = function (frame_selector) {
        // 清除上一次显示的DOM
        if (_CACHE_DRAWER_DOMS) {
            _CACHE_DRAWER_DOMS.parentNode.removeChild(_CACHE_DRAWER_DOMS);
        }

        _CACHE_DRAWER_DOMS = DOM;

        document.body.append(DOM);
        setTimeout(() => {
            data.is_show = true;
        }, 0);
        console.log(data);
    }

    return data;
};