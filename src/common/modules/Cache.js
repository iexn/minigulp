import { getCalendarDate, isEmpty } from "./util";

export default new class Cache {
    constructor() {
        this.appStorage = {};
        this.timeKeySuffix = "~overdueTime";

        this.APP_STORAGE     = "app";
        this.SESSION_STORAGE = "session";
        this.LOCAL_STORAGE   = "local";
    }

    get(key, type = this.APP_STORAGE) {
        let time = getCalendarDate(new Date);
        let timeKey = key + this.timeKeySuffix;

        // 过期时间
        let storageTime;
        // 数据
        let storageValue;

        // 获取数据及过期时间
        switch (type) {
            case this.APP_STORAGE:
                let ase = this.appStorage[key];
                if (isEmpty(ase)) {
                    ase = {
                        storageTime: null,
                        storageValue: null
                    };
                }
                storageTime  = ase.overdueTime;
                storageValue = ase.data;
                break;
            case this.SESSION_STORAGE:
                storageTime  = sessionStorage.getItem(timeKey);
                storageValue = sessionStorage.getItem(key);
            case this.LOCAL_STORAGE:
                storageTime  = localStorage.getItem(timeKey);
                storageValue = localStorage.getItem(key);
        }

        // 未获取到时
        if (storageValue === null || storageTime === null) {
            return null;
        }

        // json字符串转为object
        try {
            storageValue = JSON.parse(storageValue);
        } catch(e) {}

        // 如果有过期时间，检测是否已过期
        if (~~storageTime > 0) {
            if (storageTime < time.timestamp) {
                sessionStorage.removeItem(timeKey);
                sessionStorage.removeItem(key);
                storageValue = null;
            }
        }

        return storageValue;
    }

    set(key, value, type = this.APP_STORAGE, overdueSecond = null) {
        let time = getCalendarDate(new Date);
        let timeKey = key + this.timeKeySuffix;

        // 过期时间，0表示不设置过期
        let overdueTime = 0;

        if (overdueSecond !== null) {
            overdueTime = time.timestamp + ~~overdueSecond * 1000;
        }

        // 获取数据及过期时间
        switch (type) {
            case this.APP_STORAGE:
                if (value === null) {
                    delete this.appStorage[key];
                    return;
                }
                
                this.appStorage[key] = {
                    storageTime: overdueTime,
                    storageValue: value
                };

                break;
            case this.SESSION_STORAGE:
                if (value === null) {
                    sessionStorage.removeItem(timeKey);
                    sessionStorage.removeItem(key);
                    return;
                }
                sessionStorage.setItem(timeKey, overdueTime);
                try {
                    sessionStorage.setItem(key, JSON.stringify(value));
                } catch (e) {
                    sessionStorage.setItem(key, value);
                }
            case this.LOCAL_STORAGE:
                if (value === null) {
                    localStorage.removeItem(timeKey);
                    localStorage.removeItem(key);
                    return;
                }
                localStorage.setItem(timeKey, overdueTime);
                try {
                    localStorage.setItem(key, JSON.stringify(value));
                } catch (e) {
                    localStorage.setItem(key, value);
                }
        }
    };
}
