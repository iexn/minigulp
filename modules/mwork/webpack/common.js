const fs = require("fs");
const path = require("path");
const glob = require("glob");
const __dir = process.cwd();
const config = require("../config");
const { join } = require("../util");

const app = "app";
const appDir = join(config.srcDir, app, "/");


/** 
* 获取项目页面结构
* \/src\/app\/**\/**\/index.js
*/
exports.createAppSourceMap = function (cb) {
   let terminalsMap = {};

   let R = new RegExp("(" + config.srcDir + "/" + app + "/(.+)\/(.+)\/)index\\.js");
   glob.sync(appDir + "**/**/index.js")
       .forEach(function (filePath) {
           let [_path, pageDir, appName, pageName] = R.exec(filePath);

           if (config.appNameIgnores.includes(appName)) {
               return;
           }

           if (config.pageNameIgnores.includes(pageName)) {
               return;
           }


           if (!terminalsMap.hasOwnProperty(appName)) {
               terminalsMap[appName] = {
                   name: appName,
                   path: path.resolve(__dir, appDir, appName + "/"),
                   pages: {},
                   // 获取独立项目配置
                   customConfig: {},
                   customConfigDir: path.resolve(__dir, appDir, appName, "config.js")
               };

               // 获取独立项目配置
               if (fs.existsSync(terminalsMap[appName].customConfigDir)) {
                   terminalsMap[appName].customConfig = require(terminalsMap[appName].customConfigDir) || {};
               }
           }

           let _terminal = terminalsMap[appName];

           _terminal.pages[pageName] = './' + join(pageDir, "index.js");
       })

   cb(Object.values(terminalsMap));
}