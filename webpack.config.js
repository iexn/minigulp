const build = require("./modules/build");
// const mworkConfig = require("./mwork.config");
// console.log(mworkConfig)

const configs = build.webpackConfig();
module.exports = Object.values(configs);
