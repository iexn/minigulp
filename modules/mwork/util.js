const path = require("path");

/** 
 * 获取命令行携带参数
 * 格式： --参数名 参数值1 参数值2 ...
 */
exports.getArgv = function (name = true) {
    let argv = process.argv;
    let findedArgvName = false;
    let result = {};

    argv.map(_argv => {
        let match = _argv.match(/^--?([\w-]+)$/);

        // 新参数
        if (match) {
            findedArgvName = match[1];
            result[findedArgvName] = [];
            return false;
        }

        // 上一个没有参数名时跳过
        if (findedArgvName === false) {
            return false;
        }
        
        // 上一个的参数的值
        result[findedArgvName] = _argv;
    });

    if (name === true) {
        return result;
    }

    return result[name];
}

exports.join = function () {
    return path.join.apply(path, Array.prototype.slice.call(arguments)).replace(/\\/g, '/');
}