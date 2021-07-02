var colors = require('colors');
colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});


const { getVersion } = require("../version");
const config = require("../config");
const { spawn } = require('child_process');

let version = getVersion("dev").toString();

let child = spawn("webpack-dev-server --mode development", process.argv.slice(2), {
    signal: true,
});

child.on("error", function (e) {
    console.log(e);
});

child.stdout.on("data", function(data) {
    process.stdout.write(data);
});
