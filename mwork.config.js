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
    resourceDirName: "resource",

    /** 
     * @param {true | string}
     * 
     * 资源文件引用路径
     * true：默认路径，根据 mergeResource 参数设置
     * 指定位置：将按照设置的路径引用资源文件
     */
    resourcePublicPath: true
};