// 输出开发信息
// console.log(
//     `%c MiniGulp Dev CLI %c Detected lastest version is v${config.VERSION} `,
//     'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
//     'background:#577dea ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff'
// );

window.showDevInfo = function (options = [], F = "log", ...data) {
    let desc = [];
    let descStyle = [];
    let time = util.getCalendarDate().format('[H:i:s] ');
    
    options.map(function (conf) {
        // color backgroundColor text
        desc.push(time + conf.text);
        time = '';
        descStyle.push(`background:${conf.backgroundColor};padding:1px;color:${conf.color};`);
    });

    descStyle[0] += "border-radius:3px 0 0 3px;";
    descStyle[descStyle.length - 1] += "border-radius:0 3px 3px 0;";

    console[F]("%c " + desc.join(" %c ") + " ", ...descStyle, ...data);
}

window.showDevInfo([
    {
        text: "MiniGulp Dev CLI",
        backgroundColor: "#35495E",
        color: "#FFF"
    },
    {
        text: `Detected lastest version is v${config.VERSION}`,
        backgroundColor: "#577DEA",
        color: "#FFF"
    }
]);
