module.exports = {
    /** 
     * @param {boolean}
     * 
     * 是否将所有端的图片，字体等资源合并到外层公共resource文件夹中
     * true：合并到外层resource文件夹中 -> /dist/assets/resource
     * false：每个端单独存放资源文件 -> /dist/[**]/assets/resource
     */
    mergeResource: true,

    /** 
     * @param {string}
     * 
     * 资源文件夹输出目录名
     */
    resourceDir: "resource",

    /** 
     * @param {string}
     * 
     * 资源文件引用路径
     * ""：默认路径，根据 mergeResource 参数设置，当mergeResource=true时生效
     * 指定位置：将按照设置的路径引用资源文件
     */
    resourcePublicPath: "",

    /** 
     * @param {false | string}
     * 
     * 导出时是否同时复制一份到指定文件夹
     * false：不复制
     * 指定位置：复制一份到指定位置。如果指定位置存在则不复制
     * 复制文件夹名称：dist@版本号
     * @暂时不用
     */
    outputRemoteDir: false,

    /** 
     * @param {object}
     * 
     * 开发环境请求路径代理设置
     * 参考 webpack-dev-server 和 webpack.devServer 中的设置
     */
    devProxy: {}
};