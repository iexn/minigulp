/**
 * 获取定制数组重构方法
 */
function getArrayArgumentations (callback) {
    const aryMethods = ['push','pop','shift','unshift','splice','sort','reverse'];
    const arrayArgumentations = [];
    aryMethods.forEach(method => {
        let original = Array.prototype[method];
        arrayArgumentations[method] = function () {
            let result = original.apply(this, arguments)
            callback && callback(method);
            return result;
        };
    });

    // 清空数组只保留项数
    arrayArgumentations.clear = function (length = 0) {
        this.length = length;
        callback && callback('clear');
    }

    return arrayArgumentations;
};