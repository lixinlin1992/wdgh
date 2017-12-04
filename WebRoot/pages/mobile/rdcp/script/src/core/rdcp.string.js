/**
 * 去掉字符串起始和结尾的空格。
 * @param string
 * @return string
 */
rdcp.trim = function (string) {
    return $.trim(string);
};


rdcp.replaceAll = function (src, findStr, repStr) {
    var srchNdx = 0;
    var newStr = "";
    while (src.indexOf(findStr, srchNdx) != -1) {
        newStr += src.substring(srchNdx, src.indexOf(findStr, srchNdx));
        newStr += repStr;
        srchNdx = (src.indexOf(findStr, srchNdx) + findStr.length);
    }
    newStr += src.substring(srchNdx, src.length);
    return newStr;
};

/**
 * 把字符串转换成数组
 * @param string 需要转换成数组的字符串
 * @param separator 分隔符,默认为英文逗号
 * @return [obj1, obj2] 转换后的数组
 */
rdcp.string2Array = function (string, separator) {
    if (string == null)
        return null;

    var s = separator == undefined ? "," : separator;
    return string.split(s);
};

/**
 * 将一个字符串转换为一个JSON对象，并且将里面的数据进行unescape
 * @param str
 */
rdcp.str2json = function (str) {
    if (typeof str === 'string') {
//        str = rdcp.trim(unescape(str));
        str = rdcp.trim(str);
        if (str == "")
            return {};
    }

//    return JSON.parse(str);
    return JSON.parse(str, function (key, value) {
        if (typeof value === 'string')
            return unescape(value);
        return value;
    });
};

rdcp.format = {};

rdcp.format.phoneNumber = function (number) {
//    if (number.length != 11) {
//        alert("传入的手机号码长度不正确");
//        return null;
//    } 不做长度限制 2013/6/14
    if (number.length == 11) {
        var s0_3 = number.substr(0, 3);
        var s4_7 = number.substr(3, 4);
        var s7_11 = number.substr(7, 4);
        return s0_3 + " " + s4_7 + " " + s7_11;
    } else if (number.length == 12) {
        var s0_4 = number.substr(0, 4);
        var s5_8 = number.substr(4, 4);
        var s8_12 = number.substr(8, 4);
        return s0_4 + " " + s5_8 + " " + s8_12;
    }

};