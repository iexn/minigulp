const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const package = require(path.resolve(process.cwd(), "package.json"));
const config = require("./config");

/** 
 * version 控制项目整体输出版本号。例如： `2.1.1`
 * 
 * 说明：
 * 
 *      `x1`：主版本号    迭代版本号          在版本号内是本期开发的内容
 * 
 *      `x2`：子版本号    重要变更版本号      在开发过程中或已开发完毕时，需要对其中较为明显或比较严重的程序bug或修改需求时；或在开发时有阶段性进度时，升级此版本号
 * 
 *      `x3`：修正版本号  开发时刻版本号      日常提交的版本号升级。包括开发进度、修改bug、日常维护及升级等等
 * 
 * 
 * > `x2` 和 `x3` 分单双号，单号为开发版本，双号为测试通过版本。切换单双号时其他位置版本号不发生变化
 * > 
 * > 每个版本号起始号码为1，例如 2.1.1 是第二版开发版、1.2.2 是第一版正式版 等
 * > 
 * > 2.0.1 是错的，因为不能包含版本号是0的情况
 * > 
 * > `dev` 模式只能发布单号；`prod` 模式只能发布双号
 * > 
 * > dev版本号只能大于最新的一个prod版本号
 * 
 * 
 */

// version autoBuild


/** 
 * 二分排序
 * 
 * @param orderby 排序规则，返回是否大于基准数
 */
function binarySort(origin = [], orderby = function (item, crit) { return item > crit ? 1 : item < crit ? -1 : 0 }) {
    if (origin.length <= 1) {
        return origin;
    }

    let length = origin.length;
    
    // 基准数
    let halfLength = Math.floor(length / 2);
    let crit = origin[halfLength];
    
    let left = [], right = [], center = [];
    for (let i=0; i<length; i++) {
        let orderResult = orderby(origin[i], crit);

        if (orderResult == 1) {
            right.push(origin[i]);
        } else if (orderResult == -1) {
            left.push(origin[i]);
        } else {
            center.push(origin[i]);
        }
    }

    left = binarySort(left, orderby);
    right = binarySort(right, orderby);

    return [].concat(left, center, right);
}

/** 
 * 二分查找，基于已排序好的origin
 * 返回在origin中的位置数
 */
function binaryIndex(search, origin = [], orderby = function (item, crit) { return item > crit ? 1 : item < crit ? -1 : 0 }) {
    if (origin.length == 0) {
        return 0;
    }

    let length = origin.length;
    
    // 基准数
    let halfLength = Math.floor(length / 2);
    let crit = origin[halfLength];
    let orderResult = orderby(search, crit);

    if (orderResult == 1) {
        return binarySearch(origin.slice(halfLength)) + halfLength + 1;
    } else if (orderResult == -1) {
        return binarySearch(origin.slice(0, halfLength - 1));
    }
    
    return halfLength;
}

function binaryIsset(search, origin = [], orderby = function (item, crit) { return item > crit ? 1 : item < crit ? -1 : 0 }) {
    let index = binaryIndex(search, origin);
    if (origin[index] == undefined) {
        return false;
    }

    return orderby(origin[index], search) == 0;
}


class MkWorkVersion {
    constructor(version = "") {
        this.version = [];

        if (typeof version != "string") {
            throw new Error(("创建版本号失败：版本号应该是一个字符串 ("+ version +")").error);
        }
    
        let v = version.split(".");
    
        if (v.length != 3) {
            throw new Error(("创建版本号失败：版本号格式应该满足 xx.xx.xx ("+ version +")").error);
        }

        // x2 x3为单号视作开发板
        let isDevVersion = false;

        for (let i=0; i<v.length; i++) {
            v[i] = v[i] | 0;

            if (v[i] <= 0) {
                throw new Error(("版本号创建失败：不符合版本号规定").error);
            }
        }

        // 开发版
        if (this.isOdd(v[1]) && this.isOdd(v[2])) {
            isDevVersion = true;
        }

        this.version = v;
        this.isDevVersion = isDevVersion;
    }

    toString() {
        return this.version.join(".");
    }

    /** 
     * 比大小，大为1 小为-1 相等为0
     */
    compare(Version) {
        if (typeof Version == "string") {
            Version = new MkWorkVersion(Version);
        }

        let subVersion = this.sub(Version);

        for (let i=0; i<subVersion.length; i++) {
            let _sub = subVersion[i];

            if (_sub == 0) {
                continue;
            }

            return _sub > 0 ? 1 : -1;
        }

        return 0;
    }
    
    isOdd(number) {
        return number % 2 == 1;
    }

    isEven(number) {
        return number % 2 == 0;
    }

    sub(Version) {
        return [
            this.version[0] - Version.version[0],
            this.version[1] - Version.version[1],
            this.version[2] - Version.version[2],
        ];
    }

}

/** 
 * 检测是否为版本号
 */
MkWorkVersion.isVersion = function (version) {
    try {
        new MkWorkVersion(version);
        return true;
    } catch (error) {
        return false;
    }
}

// ------------------------------------

exports.getVersion = function (mode = "dev") {
    let version = new MkWorkVersion(package.version);
    
    let files = fs.readdirSync(path.resolve(config.processDir, config.outputDir));
    // 已存在的项目版本文件夹
    let versionExports = [];
    
    files.map(fileName => {
        if (MkWorkVersion.isVersion(fileName)) {
            // 加入 versioExpots并排序
            let Version = new MkWorkVersion(fileName);
    
            versionExports.push(Version);
        }
    });
    
    versionExports = binarySort(versionExports, function (item, crit) {
        return item.compare(crit);
    });

    let canuseVersion = version.isDevVersion;

    if (mode == "prod") {
        canuseVersion = !canuseVersion;
    }

    if (!canuseVersion) {
        throw new Error(("编译失败：只能使用dev版本号编译（dev版本x3为奇数，prod版本x3为偶数）("+ version.toString() +")").error);
    }
    
    // 取最后一项并判断：如果新建版本小于这个版本，不能创建
    if (versionExports.length > 0) {
        // 最新已编译版本
        let lastProdVersion = versionExports[versionExports.length - 1];
        
        // 只能比最新版本高或相同，小于将不能编译
        if (lastProdVersion.compare(version) == 1) {
            throw new Error(("编译失败：不能创建比历史prod版本("+ lastProdVersion.toString() +")更早的版本("+ version.toString() +")").error);
        }

        if (!version.isDevVersion && lastProdVersion.compare(version) != -1) {
            throw new Error(("编译失败：已存在的prod版本("+ version.toString() +")").error);
        }
    }
    
    return version;
}
