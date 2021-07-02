const path = require("path");
const { join } = require("./util");
const package = require(path.resolve(process.cwd(), "package.json"));

let config = {
    /** 
     * 版本号
     */
    version: package.version,

    /** 
     * 版本号
     */
    MWORKVERSION: "2.0.1.013",
    /** 
     * @param {string[]}
     * 
     * 过滤端源名称
     */
    appNameIgnores: ["common"],

    /** 
     * @param {string[]}
     * 
     * 过滤页面名称
     */
    pageNameIgnores: ["common"],

    /** 
     * @param {string}
     * 
     * 开发目录
     */
    srcDir: "src",

    /** 
     * @param {string}
     * 
     * 输出目录
     */
    outputDir: "dist",

    /** 
     * @param {string}
     * 
     * 输出依赖文件的文件夹名称
     */
    assetsDir: "assets",

    /** 
     * 运行根目录
     */
    processDir: process.cwd(),

    mworkConfig: require(path.resolve(process.cwd(), "mwork.config")),

    /** 
     * 输出目录路径，基于开发根目录
     */
    // outputPath: "dist",

    /** 
     * 开发缓存输出目录路径，基于开发根目录
     */
    cachePath: ".cache"
};

config.outputPath = join(config.outputDir, config.version);

module.exports = config;
