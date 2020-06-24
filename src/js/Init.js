/**
 * 初始化
 * 
 * 作为插件使用时，此处需要按照项目的写法单独编写
 * 
 */
var ODM = window.ODM = new oaNetDiskMobile('body');

// 选择位置
$('#selectPath').on('click', function () {
    let _this = this;
    ODM.selectPath(function (dir, done) {
        Util.confirm(`选择目录${dir.originalPath}？`, function () {
            $(_this).html('已复制到：' + dir.originalPath);
            done();
        });
    });
});

// 添加文件
$('#select').on('click', function () {
    let _this = this;
    ODM.select(function (file, done) {
        debug(file);
        Util.confirm(`选择文件${file.originalName}？`, function () {
            $(_this).html('已添加：' + file.originalName);
            done();
        });
    });
});


// 初始化管理界面
// oaNetDiskMobile.init();