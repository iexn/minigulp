module.exports = function (mode, terminal) {
    // 自定义外部扩展
    return terminal.customConfig.externals || {};
};
