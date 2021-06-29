const mwork = require("./modules/mwork");

module.exports = Object.values(mwork.webpack.get(mwork.util.getArgv("app") || false));