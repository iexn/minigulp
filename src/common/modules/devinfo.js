import package from "../../../package.json";

/** 
 * 输出调试打印信息
 */
export function showDevInfo (options = [], F = "log", ...data) {
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

/** 
 * 输出带项目名称的打印信息
 */
export function trace(str) {
    showDevInfo([
        {
            text: `${package.name.toUpperCase()} Consoles`,
            backgroundColor: "#35495E",
            color: "#FFF"
        },
        {
            text: str,
            backgroundColor: "#577DEA",
            color: "#FFF"
        }
    ]);
}

/** 
 * 输出项目版本号打印信息
 */
export function versionInfo() {
    trace(`Detected lastest version is v${package.version}`);
}
