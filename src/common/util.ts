const toString = Object.prototype.toString;
const slice = Array.prototype.slice;

/** 
 * 获取当前设备类型
 * 
 * @returns {string} pc | android | ios | unknown
 */
export function device(): string {
    // 获取设备标识
    const userAgentInfo: string = navigator.userAgent;

    // 获取移动端设备标识
    const Agents: string[] = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];

    // 移动端标识
    let flag: boolean = true;
    
    for (var v:number = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }

    // 如果未找到以上标识，视为pc端
    if (flag) {
        return "pc";
    }

    // 安卓
    if (userAgentInfo.indexOf('Android') > -1 || userAgentInfo.indexOf('Linux') > -1) {
        return "android";
    }

    // iOS
    if (!!userAgentInfo.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
        return "ios";
    }

    return "unknown";
}

/** 
 * 设备是否是微信环境
 * 
 * @returns {boolean}
 */
export function isWechatDevice(): boolean {
    const ua: string = window.navigator.userAgent.toLowerCase();
    const match: string[] = ua.match(/microMessenger/);
    return !!(match.length > 0 && match[0] == 'micromessenger');
}

/** 
 * 浏览器下载文件功能
 */
export function download(url: string): void {
    if (window.document) {
        let a = window.document.createElement("a");
        a.href = url;

        // 支持download时使用download，不支持时使用a标签跳转
        if ("download" in a) {
            a.setAttribute("download", "");
        } else {
            a.setAttribute("target", "_blank");
        }

        window.document.body.appendChild(a);
        a.click();

        setTimeout(() => {
            window.document.body.removeChild(a);
        }, 2000);
    } else {
        window.open(url);
    }
}

/** 
 * 判断变量是否是html element
 */
export function isDom(dom: any): boolean {
    return (typeof HTMLElement === 'object') ?
        (dom instanceof HTMLElement) :
        (dom && typeof dom === 'object' && dom.nodeType === 1 && typeof dom.nodeName === 'string');
}

export function type(mixin: any): string {
    if (mixin == null) {
        return mixin + "";
    }

    let class2type: string[] = ["boolean","number","string","function","array","date","regexp","object","error","symbol",];

    let mixin_type: string = typeof mixin;

    if (mixin_type === 'undefined') {
        return 'undefined';
    }

    if (mixin_type === 'object' || mixin_type === "function") {
        let mixinType = toString.call(mixin).toLowerCase().slice(8, -1);
        if (class2type.includes(mixinType)) {
            return mixinType;
        } else {
            return isDom(mixin) ? "dom" : "object";
        }
    }

    return mixin_type;
}

export function isEmpty(mixin: any): boolean {
    let _type = type(mixin);
    if (["null", "undefined"].includes(_type)) {
        return true;
    }
    if (_type == "boolean" && mixin == false) {
        return true;
    }
    if (_type == "array" && mixin.length == 0) {
        return true;
    }
    if (_type == "object" && Object.keys(mixin).length == 0) {
        return true;
    }
    return mixin === "";
}

export function defaults<T>(mixin: T, defaults: T, compareFunction: (mixin: T) => boolean = isEmpty): T {
    return compareFunction(mixin) ? defaults : mixin;
}

export function offset(dom: any) {
    let top = dom.offsetTop;
    let left = dom.offsetLeft;
    let width = dom.offsetWidth;
    let height = dom.offsetHeight;
    
    while (dom = dom.offsetParent) {
        top += dom.offsetTop;
        left += dom.offsetLeft;
    }
    return {
        top: top,
        left: left,
        width: width,
        height: height
    };
}

export function getQuery(search: string = location.search) {
    let query = {};
    if (search.indexOf("?") != -1) {
        search = search.split("?")[1];
    }

    search.split("&").map(item => {
        let srt = item.split("=");
        if (srt[0] != "") {
            Object.defineProperty(query, srt[0], srt[1]);
        }
    });
    return query;
}

export function getSearch(query: any): string {
    let query_trim: string[] = [];

    for (let i in query) {
        query_trim.push(i + '=' + query[i]);
    }

    return query_trim.join('&');
}

export function iosTextBlurScroll(input: HTMLElement) {
    if (!input) {
        return false;
    }
    var trueHeight = document.body.scrollHeight;
    //解决ios唤起键盘后留白
    var backPageSize = function () {
        setTimeout(() => {
            window.scroll(0, trueHeight - 10);
            // window.innerHeight = window.outerHeight = trueHeight;
        }, 200);
    }

    input.onblur = backPageSize; // onblur是核心方法
}

export function fullZeroNumber(number: number, size = 2): string {
    let __number = number + "";
    if (isNaN(number)) {
        return __number;
    }
    
    while(__number.length < size) {
        __number = "0" + __number;
    }
    return __number;
}

export function getHoursSecond(hoursFormat: string) {
    if (!/^\d\d\:\d\d(\:\d\d)?$/.test(hoursFormat)) {
        return false;
    }
    var mm = hoursFormat.split(":");
    return +mm[0] * 3600 + +mm[1] * 60;
}

export function like2Array(likeArray: any) {
    return slice.call(likeArray);
}

export function byteSize(size: number, digits = 2): string {
    // 判断b
    if (size < 1024) {
        return size + 'byte';
    }

    // 判断kb
    size = +(size / 1024).toFixed(digits);
    if (size < 1024) {
        return size + 'KB';
    }

    // 判断mb
    size = +(size / 1024).toFixed(digits);
    if (size < 1024) {
        return size + 'MB';
    }

    // 判断gb
    size = +(size / 1024).toFixed(digits);
    if (size < 1024) {
        return size + 'GB';
    }

    // tb
    size = +(size / 1024).toFixed(digits);
    return size + 'TB';
}

export function getSelectText() {
    return window.getSelection ? window.getSelection().toString() :     
    // @ts-ignore
    window.document.selection.createRange().text;
}

type CalendarDateOverall = {
    format: (value: (string | number)[]) => () => CalendarDate, // 自定义时间对象
    // 预置的时间对象
    day         : () => CalendarDate,   // 当天，与ND相同
    firstOfYear : () => CalendarDate,   // 当前年第一天
    endOfYear   : () => CalendarDate,   // 当前年最后一天
    firstOfMonth: () => CalendarDate,   // 当前月第一天
    endOfMonth  : () => CalendarDate,   // 当前月最后一天
};

type CalendarDateStep = {
    dayOfYear: () => string, // 当前年过去多少天
    weekOfYear: () => string, // 当前年过去多少周
    secondOfYear: () => string, // 当前年过去天数的总秒数
};

type CalendarDate = {
    ND: Date, // 时间
    year: string, // 年
    month: string, // 月
    day: string, // 日
    hour: string, // 小时
    minute: string, // 分钟
    second: string, // 秒
    week: string, // 星期
    timestamp: string, // 毫秒时间戳
    time: string, // 时间戳
    secondTimestamp: string, // 时间戳，与time相等
    format: (format: string) => string, // 转为显示时间
    overall: CalendarDateOverall, // 依据当天的统计信息
    step: CalendarDateStep, // 计算范围距离
}

export function getCalendarDate(ND: any = new Date): CalendarDate {
    if (ND.hasOwnProperty("__calendarDate__")) {
        return ND;
    }

    if (type(ND) == "string") {
        ND = ND.trim().replace(/-/g, "/");
    }

    if (isEmpty(ND)) {
        ND = new Date;
    } else {
        ND = new Date(ND);
    }

    let NW: any = {};
    NW.ND = ND;

    NW.year            = ND.getFullYear() + "";
    NW.month           = fullZeroNumber(ND.getMonth() + 1);
    NW.day             = fullZeroNumber(ND.getDate());
    NW.hour            = fullZeroNumber(ND.getHours());
    NW.minute          = fullZeroNumber(ND.getMinutes());
    NW.second          = fullZeroNumber(ND.getSeconds());
    NW.week            = ND.getDay() == 0 ? "7" : ND.getDay() + "";
    NW.timestamp       = ND.getTime() + "";
    NW.time            = Math.floor(ND.getTime() / 1000) + "";
    NW.secondTimestamp = NW.time;
    NW.format = function (format = "Y-m-d"): string {
        let formatExec = /[YmdHis]/g;
        let formatMap: any = {
            "Y": NW.year,
            "m": NW.month,
            "d": NW.day,
            "H": NW.hour,
            "i": NW.minute,
            "s": NW.second,
            "w": NW.week
        };
        let p = null;
        let text = format;
        while (p = formatExec.exec(format)) {
            text = text.replace(p[0], formatMap[p[0]]);
        }
        return text;
    }

    const overallStamp = function (value: (string | number)[]): () => CalendarDate {
        return function () {
            // @ts-ignore
            let _ND = new Date(...value);
            if (_ND.getTime() + "" == NW.timestamp) {
                return NW;
            }
            return getCalendarDate(_ND);
        }
    }

    NW.overall = {};
    NW.overall.format       = overallStamp;
    NW.overall.day          = overallStamp([NW.year, +NW.month -1, NW.day]);
    NW.overall.firstOfYear  = overallStamp([NW.year, 0, 1]);
    NW.overall.endOfYear    = overallStamp([+NW.year + 1, 0, 0]);
    NW.overall.firstOfMonth = overallStamp([NW.year, +NW.month - 1, 1]);
    NW.overall.endOfMonth   = overallStamp([NW.year, NW.month, 0]);

    Object.defineProperty(NW, "__calendarDate__", {
        enumerable: false,
        value: ND,
        writable: false
    });
    
    NW.step = {};
    NW.step.secondOfYear = function () {
        return (+NW.overall.day().secondTimestamp - +NW.overall.firstOfYear().secondTimestamp) + "";
    }

    NW.step.dayOfYear = function () {
        return Math.floor(+NW.step.secondOfYear() / 86400) + 1 + "";
    },

    NW.step.weekOfYear = function () {
        return Math.floor((+NW.step.dayOfYear() - +NW.week) / 7) + 1 + "";
    };

    return NW as CalendarDate;
}