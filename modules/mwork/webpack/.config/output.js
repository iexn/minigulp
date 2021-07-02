const path = require("path");
const { join } = require("../../util");
const config = require("../../config");
const { getRealOutputPath } = require("../common");

/** 
 * 链接位置
 */
let resourcePublicPath = './' + config.assetsDir;
if (typeof config.mworkConfig.resourcePublicPath == "string") {
    resourcePublicPath = config.mworkConfig.resourcePublicPath;
}

module.exports = function (mode, terminal) {
    return {
        filename: join(terminal.name, config.assetsDir, '[name].[hash:8].js'),
        // path: path.resolve("dist", terminal.name),
        path: getRealOutputPath(mode, {name: ""}),
        publicPath: resourcePublicPath,
    };
}