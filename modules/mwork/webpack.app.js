const { getArgv } = require("./util");
const { createAppSourceMap } = require("./webpack/common");


function getWebpackConfig(terminal) {
    let mode = getArgv("mode");
    
    switch (mode[0]) {
        case "development":
            mode = "dev";
            break;
        case "production":
        default:
            mode = "prod";
    }
    
    return require("./webpack/" + mode)(terminal);
}

exports.get = function (name = true) {
    let configs = {};

    createAppSourceMap(terminals => {
        terminals.map(terminal => {
            if (name === true || terminal.name === name) {
                configs[terminal.name] = getWebpackConfig(terminal);
            }
        });
    });

    if (Object.keys(configs).length == 0) {
        throw new Error("没有可执行的项目端。请检测选择的项目端是否已创建");
    }

    return configs;
}
