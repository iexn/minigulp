/**
 * 事件层
 */
const Listener = function () {
    let Listener = function Listener() {};

    let _this = Listener.prototype;
    _this._bind = {};

    /**
     * 注册一个带有效期的事件，需要手动触发后才能执行
     */
    Listener.prototype.bind = function (event, callback, delay) {
        let _event = {
            // 带执行操作
            callback: function () {
                callback && callback()
            },
            // 取消事件的延时删除功能
            break: (function () {
                delay = delay || 0;
                // 如果设置不大于0毫秒，设置为永久保存
                if (delay <= 0) {
                    return function () {};
                }

                let breakup = function () {
                    _this._bind[event] = null;
                    clearTimeout(_st);
                };

                var _st = setTimeout(function () {
                    breakup();
                }, delay);
                
                return breakup;
            })(),
            // 删除此事件
            remove: function () {
                _event && _event.break();
            }
        };
        this._bind[event] = _event;
    };

    /**
     * 触发一个已注册的事件，如果没有不作处理
     */
    Listener.prototype.trigger = function (event) {
        let _bind = this._bind[event];
        if (_bind) {
            _bind.callback();
            _bind.remove();
        }
    };

    /**
     * 根据展示方式初始化底部菜单
     * 
     */
    Listener.prototype.initTabbar = function (type = 'button', options = []) {
        // 添加自定义按钮
        Component.resetTabbar(type, options);
    };

    /**
     * 初始化新建文件夹监听
     */
    Listener.prototype.initMkdir = function () {
        Component.initMkdir();
        $('.nd-mkdir').on('click', function () {
            Compile.mkdir(function (done) {
                setTimeout(function () {
                    Compile.renderFiles(true);
                    done()
                }, 2000);
            });
        });
        
    };

    return new Listener();
}();
