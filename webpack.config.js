const build = require("./modules/build");
const mworkConfig = require("./mwork.config");

const configs = build.webpackConfig();

module.exports = Object.values(configs);
