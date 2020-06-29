(function () {
    const data = function () {};
    const _this = data.prototype;

    _this.get = function (key, value, type = APP_STORAGE) {

    };

    /** 
     * 缓存数据
     */
    _this.cache = function (key, value, overdueSecond = 60) {
        var time = Package.Util.getCalendarDate(new Date);
        var timeKey = key + "~overdueTime";

        if (value === undefined) {
            // 获取
            var sessionTime = sessionStorage.getItem(timeKey);
            var sessionValue = sessionStorage.getItem(key);
            if (overdueSecond == null || sessionTime == null || sessionTime < time.timestamp || sessionValue == null) {
                sessionStorage.removeItem(timeKey);
                sessionStorage.removeItem(key);
                return null;
            }
            try {
                return JSON.parse(sessionValue);
            } catch(e) {
                return sessionValue;
            }
        } else {
            // 设置
            if (value === null) {
                sessionStorage.removeItem(timeKey);
                sessionStorage.removeItem(key);
                return null;
            }
            sessionStorage.setItem(timeKey, time.timestamp + overdueSecond * 1000);
            try {
                sessionStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                sessionStorage.setItem(key, value);
            }
            return value;
        }
    };

    return data;
})();