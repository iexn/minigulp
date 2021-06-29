const path = require("path");
const config = require("../../config");

// ./src
const src = path.resolve(config.processDir, config.srcDir);
const app = "app";

module.exports = function (mode, terminal) {
    return {
        alias: {
            "@"        : path.resolve(src),                     // ./src/
            "@app"     : path.resolve(src, app),                // ./src/app/
            "@common"  : path.resolve(src, 'common'),           // ./src/common/
            "@resource": path.resolve(src, 'resource'),         // ./src/resource/
            "~"        : path.resolve(src, app, terminal.name), // ./src/app/[page]/
        }
    };
}
