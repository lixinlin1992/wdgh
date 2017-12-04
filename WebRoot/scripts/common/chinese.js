function getFirstLetterOfChinesePinyin(str){
    var py_str = '';
    for (var i = 0; i < str.length; i++) {
        py_str += getChinesePinyin(str.substr(i, 1));
    }
    return py_str;
}

function ansi(c){
    return UnicodeToAnsi(c.charCodeAt(0));
}

function UnicodeToAnsi(chrCode){
    var chrHex = chrCode.toString(16);
    chrHex = "000" + chrHex.toUpperCase();
    chrHex = chrHex.substr(chrHex.length - 4);
    var i = UnicodeChr().indexOf(chrHex);
    if (i != -1) {
        chrHex = AnsicodeChr().substr(i, 4);
    }
    return parseInt(chrHex, 16);
}

function getChinesePinyin(ch){
    if (ch != '') {
        var code = ansi(ch);
        var py = '';
        if (code >= 45217 && code <= 45252) {
            py = "A"
        } else if (code >= 45253 && code <= 45760) {
            py = "B"
        } else if (code >= 45761 && code <= 46317) {
            py = "C"
        } else if (code >= 46318 && code <= 46825) {
            py = "D"
        } else if (code >= 46826 && code <= 47009) {
            py = "E"
        } else if (code >= 47010 && code <= 47296) {
            py = "F"
        } else if ((code >= 47297 && code <= 47613) || (code == 63193)) {
            py = "G"
        } else if (code >= 47614 && code <= 48118) {
            py = "H"
        } else if (code >= 48119 && code <= 49061) {
            py = "J"
        } else if (code >= 49062 && code <= 49323) {
            py = "K"
        } else if (code >= 49324 && code <= 49895) {
            py = "L"
        } else if (code >= 49896 && code <= 50370) {
            py = "M"
        } else if (code >= 50371 && code <= 50613) {
            py = "N"
        } else if (code >= 50614 && code <= 50621) {
            py = "O"
        } else if (code >= 50622 && code <= 50905) {
            py = "P"
        } else if (code >= 50906 && code <= 51386) {
            py = "Q"
        } else if (code >= 51387 && code <= 51445) {
            py = "R"
        } else if (code >= 51446 && code <= 52217) {
            py = "S"
        } else if (code >= 52218 && code <= 52697) {
            py = "T"
        } else if (code >= 52698 && code <= 52979) {
            py = "W"
        } else if (code >= 52980 && code <= 53688) {
            py = "X"
        } else if (code >= 53689 && code <= 54480) {
            py = "Y"
        } else if (code >= 54481 && code <= 62289) {
            py = "Z"
        } else {
            py = ch;
        }
        return py;
    } else {
        return '';
    }
}
