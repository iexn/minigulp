const path = require("path");

module.exports = {
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

    // /** 
    //  * @param {string}
    //  * 
    //  * 输出目录
    //  */
    // outputDir: "dist",

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

    mworkConfig: require(path.resolve(process.cwd(), "mwork.config"))
};