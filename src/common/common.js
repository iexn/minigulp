function lang(key, language = ZH_CN) {
    const langs = $$.lang[language];

    if (!langs) {
        $$.debug(`[Lang]: 语言包 ${language} 不可用，可能未设置语言包`);
        return "";
    }

    if (!langs.hasOwnProperty(key)) {
        $$.debug("[Lang]: 未找到的语言包内容，加载关键字：" + key);
        return "";
    }

    let value = langs[key];

    if (typeof value != "string") {
        $$.debug(`[Lang]: 语言包关键字 ${key} 加载错误：可能设置了一个不可读取或非字符串类型的语言`);
        return "";
    }

    return value;
}