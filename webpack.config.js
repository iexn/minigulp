const path = require("path");
const rimraf = require("rimraf");
const mwork = require("./modules/mwork");

module.exports = new Promise(function (resolve, reject) {
    rimraf(path.resolve(__dirname, mwork.config.outputPath), function (error) {
        if (error) {
            reject(error);
            return false;
        }

        resolve(Object.values(mwork.webpack.get(mwork.util.getArgv("app") || true)));
    });
});