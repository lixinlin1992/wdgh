var makeCardOcx;

String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
String.prototype.ltrim = function () {
    return this.replace(/(^\s*)/g, "");
}
String.prototype.rtrim = function () {
    return this.replace(/(\s*$)/g, "");
}

//查询卡中的ICCID的函数处理
function QueryCard(simcard) {
    makeCardOcx = whiteCardOcx;
    //白卡鉴别
    if ((_checkResult = CheckWhiteCard(simcard)) != 1) {
        return _checkResult;
    }

    var result;
    result = TransmitCard('A0A40000023F00');//APDU命令，选择目录
    result = TransmitCard('A0A40000022FE2');//APDU命令，选择文件
    result = TransmitCard('A0B000000A');//APDU命令，读取卡号
    if (result.length != 36) {
        DisConnetReader();
        return TransmitCardErr("", "", "", "", "查询ICCID标识错误" + makeCardOcx.GetErrMsg(), "-1");
    }

    var IccIdList = result.split(" ");
    var IccIdListNum = IccIdList.length;
    if (IccIdListNum != 13) {//最后加1
        DisConnetReader();
        return TransmitCardErr("", "", "", "", "获取ICCID位数错误，请重新插卡！", "-1");
    }

    //状态9000为正常状态
    if (IccIdList[11] != "00" || IccIdList[10] != "90") {
        DisConnetReader();
        return TransmitCardErr("", "", "", "", "获取ICCID状态出错！", "-1");
    }

    var IccIdNo = "";
    for (var i = 0; i < 10; i++)
        IccIdNo = IccIdNo + IccIdList[i].substr(1, 1) + IccIdList[i].substr(0, 1);

    //alert("IccIdNo=="+IccIdNo);
    return TransmitCardErr("", "", "", "", "", IccIdNo);
}

/**
 * 判断是是否为白卡
 */
function CheckWhiteCard(simcard) {
    var is3GCard = true; //是否是3G白卡，缺省不是
    if ("1" == simcard) {
        is3GCard = false;
    }

    var result;
    result = TransmitCard('A0A40000023F00');
    result = TransmitCard('A0A40000027F20');
    result = TransmitCard('A0A40000026F07');
    result = TransmitCard('A0B0000009');
    result = result.replace(/ /g, ""); //得到ffffffffffffffffff9000
    if (result.length != 22) {
        DisConnetReader();
        return TransmitCardErr("", "", "", "", "白卡鉴别失败，请确认卡片是否完好" + makeCardOcx.GetErrMsg(), -1);
    }

    if ("FFFFFFFFFFFFFFFFFF" != result.substr(0, 18).toUpperCase()) {
        DisConnetReader();
        return TransmitCardErr("", "", "", "", "此卡非白卡,请确认重新插入白卡" + makeCardOcx.GetErrMsg(), -1);
    }

    //校验卡片状态字
    if ("9000" != result.substr(18, 4)) {
        DisConnetReader();
        return TransmitCardErr("", "", "", "", "此卡非白卡,请确认重新插入白卡" + makeCardOcx.GetErrMsg(), -1);
    }

    //3G 白卡二次校验
    if (is3GCard) {
        result = TransmitCard('A0A40000023F00');
        result = TransmitCard('A0A40000027FF0');
        result = TransmitCard('A0C0000016');
        result = TransmitCard('A0A40000026F07');
        result = TransmitCard('A0B0000009');
        result = result.replace(/ /g, ""); //得到ffffffffffffffffff9000
        if (result.length != 22) {
            DisConnetReader();
            return TransmitCardErr("", "", "", "", "白卡鉴别失败，请确认卡片是否完好" + makeCardOcx.GetErrMsg(), -1);
        }

        if (result.substr(0, 18).toUpperCase() != "FFFFFFFFFFFFFFFFFF") {
            DisConnetReader();
            return TransmitCardErr("", "", "", "", "此卡非白卡,请确认重新插入白卡" + makeCardOcx.GetErrMsg(), -1);
        }

        //校验卡片状态字
        if (result.substr(18, 4) != "9000") {
            DisConnetReader();
            return TransmitCardErr("", "", "", "", "此卡非白卡,请确认重新插入白卡" + makeCardOcx.GetErrMsg(), -1);
        }
    }

    return 1;
}

//写卡函数
function TransmitCard(Command) {
    var TransmitResult;
    TransmitResult = makeCardOcx.TransmitCard(Command, readerName);
    return TransmitResult;
}

//断开写卡器
function DisConnetReader() {
    var DisconResult;
    DisconResult = makeCardOcx.DisconnectCard(readerName);
    return DisconResult;
}

//写卡错误函数
function TransmitCardErr(IccId, ErrCode, ErrInfo, SimStateCode, Message, Result) {
    var params = "{'IccId':'" + IccId + "','ErrCode':'" + ErrCode + "','ErrInfo':'" + ErrInfo + "','SimStateCode':'" + SimStateCode
        + "','Message':'" + Message + "','Result':'" + Result + "'}";
    return encodeURIComponent(params);

}

//写卡函数，用于写卡组件的集中调用，针对多行命令的处理,将 Inrecords注释掉
//function InsertCard(SimCardNo, Imsi,SerialNumber, Option){
function InsertCard(SimCardNo, Imsi, SerialNumber, Option, OperFlag) {
//    return TransmitCardErr(SimCardNo, "-1", "写卡脚本格式解析返回字符错误！", "2", "写卡脚本格式错误一", -1);
    var option = Option;
    var optionList = option.split("!");
    var tempList, temp, tem;
    var commond, ret;
    var result;
    for (var i = 1; i < optionList.length; i++) {
        temp = optionList[i];
        tem = temp.indexOf(",,");
        if (tem == -1) {
            return TransmitCardErr(SimCardNo, "-1", "写卡脚本格式解析返回字符错误！", "2", "写卡脚本格式错误一", -1);
        } else {
            ret = temp.substr(tem + 2).trim();
        }

        temp = temp.substr(0, tem);
        tem = temp.indexOf(",");
        if (tem == -1) {
            return TransmitCardErr(SimCardNo, "-1", "写卡脚本格式解析脚本命令错误！", "2", "写卡脚本格式错误二", -1);
        } else {
            commond = temp.substr(0, tem);
        }
        result = TransmitCard(commond);
        if (ret == "9FXX") {
            if (result.substr(0, 2) != "9F" && result.substr(0, 2) != "9f") {
                return TransmitCardErr(SimCardNo, ret, makeCardOcx.GetErrMsg(), "2", "写卡失败0！:" + makeCardOcx.GetErrMsg(), -1);
            }

        } else {
            var trueResult = "";
            tempList = result.split(" ");
            for (var l = 0; l < tempList.length; l++) {
                trueResult = trueResult + tempList[l];
            }

            if (trueResult != ret) {
                return TransmitCardErr(SimCardNo, ret, makeCardOcx.GetErrMsg(), "2", "写卡失败1！:" + makeCardOcx.GetErrMsg(), -1);
            }
        }
    }

    //加入IMSI
    var imsiCommond = "A0F4000012";
    var imsiString = "809" + Imsi;
    var imsiCode = "";
    var imsiNum_2 = imsiString.length / 2;
    for (var i = 0; i < imsiNum_2; i++) {
        imsiCode = imsiCode + imsiString.substr(1, 1) + imsiString.substr(0, 1);
        imsiString = imsiString.substring(2);
    }

    imsiCommond = imsiCommond + imsiCode + imsiCode;
    result = TransmitCard(imsiCommond);
    if (result != "90 00 ") {
        //写卡错误，重复写卡流程
        return TransmitCardErr(SimCardNo, result, makeCardOcx.GetErrMsg(), "3", "写卡失败2！:" + makeCardOcx.GetErrMsg(), -1);
    } else if (SerialNumber == "") {    //CBSS补卡流程到此结束
        //写卡成功,通知集团总部
        return TransmitCardErr("", "", "", "", "", 0);
    }
    //加入本机设备号码
    var numberTemp = SerialNumber;
    for (var i = 0; i < 4; i++) {
        if (i == 0) {
            temp = "A0A40000023F00,S,,9FXX";
        } else if (i == 1) {
            temp = "A0A40000027F10,S,,9FXX";
        } else if (i == 2) {
            temp = "A0A40000026F40,S,,9FXX";
        } else {
            temp = "A0DC01041CFFFFFFFFFFFFFFFFFFFFFFFFFFFF0891688116410000F0FFFFFFFFFF,S,,9000";
        }
        tem = temp.indexOf(",,");
        if (tem == -1) {
            return TransmitCardErr(SimCardNo, "-1", "写卡脚本格式解析返回字符错误！", "4", "写卡脚本格式错误一", -1);
        } else {
            ret = temp.substr(tem + 2).trim();
        }

        temp = temp.substr(0, tem);
        tem = temp.indexOf(",");
        if (tem == -1) {
            return TransmitCardErr(SimCardNo, "-1", "写卡脚本格式解析脚本命令错误！", "4", "写卡脚本格式错误二", -1);
        } else {
            commond = temp.substr(0, tem);
        }
        if (i == 3) {
            var newSerialNumber = ConvertSerialNumber(numberTemp);
            var strlen = commond.indexOf("0891");
            var reExp = commond;
            reExp = reExp.substr(strlen, 18);
            commond = commond.replace(reExp, newSerialNumber);
        }
        result = TransmitCard(commond);
        if (ret == "9FXX") {
            if (result.substr(0, 2) != "9F" && result.substr(0, 2) != "9f") {
                return TransmitCardErr(SimCardNo, ret, makeCardOcx.GetErrMsg(), "4", "写卡失败0！:" + makeCardOcx.GetErrMsg(), -1);
            }

        } else {
            var trueResult = "";
            tempList = result.split(" ");
            for (var l = 0; l < tempList.length; l++) {
                trueResult = trueResult + tempList[l];
            }

            if (trueResult != ret) {
                return TransmitCardErr(SimCardNo, ret, makeCardOcx.GetErrMsg(), "4", "写卡失败1！:" + makeCardOcx.GetErrMsg(), -1);
            }
        }
    }

    //写卡成功断开写卡器
    DisConnetReader();

    return TransmitCardErr("", "", "", "", "", 0);
}

//号码的转换
function ConvertSerialNumber(SerialNumber) {
    var result = "";
    newSerialNumber = SerialNumber + "F";
    for (var i = 0; i < 12; i++) {
        temp = newSerialNumber;
        if (i % 2 == 0) {
            result = result + temp.substr(i + 1, 1);
        } else {
            result = result + temp.substr(i - 1, 1);
        }
    }
    result = "089168" + result;
    return result;
}