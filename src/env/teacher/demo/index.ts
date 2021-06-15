import { VERSION } from "./config";
import component from "./component";
import "./css/index.scss";

function init(version: string) : string {
    let HeaderDM = component;
    
    let Container = component.getContainer();
    Container.append(HeaderDM);
    Container.render();

    return version;
}

if (VERSION == "2.1.1") {
    init(VERSION);
}
