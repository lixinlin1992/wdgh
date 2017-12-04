var RwCard = {};
var load_rwcard_acx = false;
var readerName;
var NewIccIdNo;
/**
 * 获取卡号
 */
RwCard.getICCID = function () {
    RwCard.loadRwcardAcx();
    RwCard.getReaderName();
    RwCard.ConnetReader();
    var iccid = RwCard.queryUsimNo();
    RwCard.DisConnetReader();
    return iccid;
}

/**
 * 获取号码
 */
RwCard.getPhoneNumber = function () {
    RwCard.loadRwcardAcx();
    RwCard.getReaderName();
    RwCard.ConnetReader();
    var number = RwCard.queryPhoneNumber();
    RwCard.DisConnetReader();
    return number;
}

/**
 * 获取写卡器名称
 */
RwCard.getReaderName = function () {
    try {
        var strReaderString = whiteCardOcx.ListCard(); // 列出所有写卡器
    } catch (e) {
        return "-1";
    }

    if ((null == strReaderString) || ("" == strReaderString)) {
        //alert("访问写卡器出错，请检查写卡器是否连接，白卡是否插入！");
        return "-2";
    }

    var readList = strReaderString.split(";");

    var connetResult;

    // 尝试连接每个读卡器，并把所有成功中的最后一个读卡器的名称存到全局变量readerName中
    for (var i = 0, l = readList.length; i < l; i++) {
        connetResult = whiteCardOcx.ConnectCard(readList[i]);
        if ("0" == connetResult) {// 成功
            readerName = readList[i];
            whiteCardOcx.TransmitCard("A0A40000023F00", readerName);
            whiteCardOcx.TransmitCard("A0A40000022FE2", readerName);
            connetResult = whiteCardOcx.TransmitCard("A0B000000A", readerName);
            if (connetResult.length != 36) {
                connetResult = whiteCardOcx.DisconnectCard(readerName); // 关闭
                continue;
            }
            return "0";
        }
    }

    return "-2";
};

/**
 * 连接写卡器
 */
RwCard.ConnetReader = function () {
    var connetResult;
    try {
        connetResult = whiteCardOcx.ConnectCard(readerName);
        return connetResult;
    } catch (e) {
        connetResult = "-1";
        return connetResult;
    }
};

/**
 * 断开写卡器
 */
RwCard.DisConnetReader = function () {
//    alert("DisconnectCard");
    try {
        var DisconResult;
        DisconResult = whiteCardOcx.DisconnectCard(readerName);
        return DisconResult;
    } catch (err) {
        return err.message;
    }

};

/**
 * 执行写卡命令,一次一条命令
 */
RwCard.TransmitCard = function (Command) {
//    alert("TransmitCard: "+Command);
    var TransmitResult;
    TransmitResult = whiteCardOcx.TransmitCard(Command, readerName);
    return TransmitResult;
};

RwCard.checkBeforeRead = function () {
    var isNumberNull = RwCard.jns('serialNumber').val() == null || RwCard.jns('serialNumber').val() == '';
    if (RwCard.isWriteCardAfter == "true" && isNumberNull) {
        alert("请先输入号码并选择相应的订单进行操作");
    }

    if (isNumberNull) {
        alert("号码未选择！");
        return;
    }

};

/**
 * 加载读卡器对象插件
 */
RwCard.loadRwcardAcx = function (readerType) {
    if (readerType == undefined) {
        if (!load_rwcard_acx) {
            var objHtml = '<object id="Ocxtest" style="display:none;" ';
            objHtml += 'classid="clsid:43E4D4FC-3CD8-459A-AAA1-698C1288DE93">';
            document.body.insertAdjacentHTML("beforeEnd", objHtml);
            whiteCardOcx = document.getElementById("Ocxtest");

            load_rwcard_acx = true;
        }
    } else {
        whiteCardOcx = Reader;
        whiteCardOcx.init(readerType);   //默认初始化USB写卡器
    }

};

RwCard.queryPhoneNumber = function () {
    //读取sim卡号码
    var numWriteResult = RwCard.TransmitCard("A0A40000023F00");
    if (numWriteResult.substr(0, 2).toUpperCase() != "9F")
        return -1;

    numWriteResult = RwCard.TransmitCard("A0A40000027F10");
    if (numWriteResult.substr(0, 2).toUpperCase() != "9F")
        return -1;

    numWriteResult = RwCard.TransmitCard("A0A40000026F40");
    if (numWriteResult.substr(0, 2).toUpperCase() != "9F")
        return -1;

    numWriteResult = RwCard.trim(RwCard.TransmitCard("A0B201041C"));
    var numWriteResultSuffix = numWriteResult.substr(56, 4);
    if ("9000" != numWriteResultSuffix) {
        return -1;
    }

    var number="";
    for (var i = 34; i < 56; i = i + 2) {
        number=number+numWriteResult[i+1]+numWriteResult[i];
    }

    return number.substr(0,11);
}

/**
 * 读取白卡卡号
 */
RwCard.queryUsimNo = function () {

    var result;

    // 读取白卡标识
    result = RwCard.TransmitCard('A0A40000023F00');

    result = RwCard.TransmitCard('A0A40000022FE2');

    result = RwCard.TransmitCard('A0B000000A');

    NewIccIdNo = result;
    if (result.length != 36) {
        RwCard.DisConnetReader();
        return -1;
    }

    var IccIdList = result.split(" ");
    var IccIdListNum = IccIdList.length;

    if (IccIdListNum != 13) { // 最后加1
        RwCard.DisConnetReader();
        return -1;
    }
    if (IccIdList[11] != "00" || IccIdList[10] != "90") { // 状态9000为正常状态
        RwCard.DisConnetReader();
        return -1;
    }
    var IccIdNo = "";
    for (var i = 0; i < 10; i++) {
        IccIdNo = IccIdNo + IccIdList[i].substr(1, 1) + IccIdList[i].substr(0, 1);
    }
    return IccIdNo;
};

/**
 * 读取卡中是否存在IMSI
 */
RwCard.queryCardImsi = function () {

    var imsiResult = "";
    imsiResult = RwCard.TransmitCard('A0A40000023F00');
    imsiResult = RwCard.TransmitCard('A0A40000027F20');
    imsiResult = RwCard.TransmitCard('A0A40000026F07');
    imsiResult = RwCard.TransmitCard('A0B0000009');
    imsiResult = RwCard.trim(imsiResult);

    if (imsiResult.length != 22) {
        RwCard.DisConnetReader();
        return -1;
    }

    var imsiResultPrefix = imsiResult.substr(0, 18);
    imsiResultPrefix = imsiResultPrefix.toUpperCase();

    var imsiResultSuffix = imsiResult.substr(18, 4);

    if ("FFFFFFFFFFFFFFFFFF" != imsiResultPrefix) {
        RwCard.DisConnetReader();
        return -1;
    }

    if ("9000" != imsiResultSuffix) {
        RwCard.DisConnetReader();
        return -1;
    }

    imsiResult = RwCard.TransmitCard('A0A40000023F00');
    imsiResult = RwCard.TransmitCard('A0A40000027FF0');
    imsiResult = RwCard.TransmitCard('A0C0000016');
    imsiResult = RwCard.TransmitCard('A0A40000026F07');
    imsiResult = RwCard.TransmitCard('A0B0000009');
    imsiResult = RwCard.trim(imsiResult);

    if (imsiResult.length != 22) {
        RwCard.DisConnetReader();
        return -1;
    }

    imsiResultPrefix = imsiResult.substr(0, 18);
    imsiResultPrefix = imsiResultPrefix.toUpperCase();
    imsiResultSuffix = imsiResult.substr(18, 4);

    if ("FFFFFFFFFFFFFFFFFF" != imsiResultPrefix) {
        RwCard.DisConnetReader();
        return -1;
    }

    if ("9000" != imsiResultSuffix) {
        RwCard.DisConnetReader();
        return -1;
    }
    return 0;
};

/**
 * 读取卡中IMSI值
 */
RwCard.queryCardImsiValue = function () {

    var imsiResult = "";
    imsiResult = RwCard.TransmitCard('A0A40000023F00');
    imsiResult = RwCard.TransmitCard('A0A40000027F20');
    imsiResult = RwCard.TransmitCard('A0A40000026F07');
    imsiResult = RwCard.TransmitCard('A0B0000009');
    imsiResult = RwCard.trim(imsiResult);

    if (imsiResult.length != 22) {
        RwCard.DisConnetReader();
        return imsiResult;  // 卡已写，有IMIS
    }

    var imsiResultPrefix = imsiResult.substr(0, 18);
    imsiResultPrefix = imsiResultPrefix.toUpperCase();

    var imsiResultSuffix = imsiResult.substr(18, 4);

    if ("FFFFFFFFFFFFFFFFFF" != imsiResultPrefix) {
        RwCard.DisConnetReader();
        return imsiResult; // 卡已写，有IMIS
    }

    if ("9000" != imsiResultSuffix) {
        RwCard.DisConnetReader();
        return imsiResult; // 卡已写，有IMIS
    }

    imsiResult = RwCard.TransmitCard('A0A40000023F00');
    imsiResult = RwCard.TransmitCard('A0A40000027FF0');
    imsiResult = RwCard.TransmitCard('A0C0000016');
    imsiResult = RwCard.TransmitCard('A0A40000026F07');
    imsiResult = RwCard.TransmitCard('A0B0000009');
    imsiResult = RwCard.trim(imsiResult);

    if (imsiResult.length != 22) {
        RwCard.DisConnetReader();
        return imsiResult; // 卡已写，有IMIS
    }

    imsiResultPrefix = imsiResult.substr(0, 18);
    imsiResultPrefix = imsiResultPrefix.toUpperCase();
    imsiResultSuffix = imsiResult.substr(18, 4);

    if ("FFFFFFFFFFFFFFFFFF" != imsiResultPrefix) {
        RwCard.DisConnetReader();
        return imsiResult; // 卡已写，有IMIS
    }

    if ("9000" != imsiResultSuffix) {
        RwCard.DisConnetReader();
        return imsiResult; // 卡已写，有IMIS
    }

    return -1; // 白卡
};

/**
 * @function:解析IMIS值
 * @return IMSI
 */
RwCard.decodeImsi = function (imsiData) {

    // 密文的长度为22位
    if (imsiData.length != 22) {
        return false;
    }

    var imsiPrefix = imsiData.substr(0, 18);
    imsiPrefix = imsiPrefix.toUpperCase();
    var initImsi = "";
    for (var i = 0; i < imsiPrefix.length - 1; i = i + 2) {
        initImsi = initImsi + imsiPrefix.substr(i + 1, 1) + imsiPrefix.substr(i, 1);
    }
    initImsi = initImsi.substr(3);
    return initImsi;
};

/**
 * 去掉所有的空格,这边不能用jQuery.trim()
 */
RwCard.trim = function (str) {
    return str.replace(/\s+/g, "");
};

/**
 * 初始化重复读卡
 */
RwCard.initReReadCard = function () {
    RwCard.isRWCardSuccessed = "-1";
    RwCard.usimNoInput.val("89860").removeAttr('disabled');
};

/**
 * 初始化写卡
 */
RwCard.initWriteCard = function () {
    NowIccIdNo = "";
    RwCard.isRWCardSuccessed = "-1";
    RwCard.usimNoInput.val("89860").removeAttr('disabled');
};

/**
 * 处理单条写卡命令
 */
RwCard.execOneOrder = function (commond) {
    var numResult = RwCard.TransmitCard(commond);
    if (numResult.substr(0, 2).toUpperCase() != "9F") {

        return RwCard.TransmitCardErr($SimCardNo, numResult, whiteCardOcx.GetErrMsg());
    }
};

/**
 * 写卡端返回错误信息
 */
RwCard.TransmitCardErr = function (IccId, ErrCode, ErrInfo) {
    return IccId + "||" + ErrCode + "||" + ErrInfo;
};

/**
 * 写卡函数(用于写卡组件的集中调用，针对多行命令的处理 1.执行写卡脚本 2.写入IMSI 3.写入手机号码)
 */
RwCard.insertCard = function (SimCardNo, Imsi, Option, number) {

    // 确认读卡器连接是否正常
    RwCard.getReaderName();
    var result = whiteCardOcx.ConnectCard(readerName);
    if ("0" != result) {
        return "-1";
    }

    var readNewIccid = RwCard.queryUsimNo();

    // 读卡写卡卡号一致，继续写卡；否则，弹出对话框
    if (readNewIccid != SimCardNo) {
        return "-2";
    }

    // 执行写卡脚本
    var option = Option;

    var optionList = option.split("!");
    var tempList, temp, tem;
    var commond, ret;
    var result;

    for (var i = 1; i < optionList.length; i++) {
        temp = optionList[i];
        tem = temp.indexOf(",,");
        if (-1 == tem) {

            return RwCard.TransmitCardErr(SimCardNo, "-1", "写卡脚本格式解析返回字符错误！");
        } else {
            ret = RwCard.trim(temp.substr(tem + 2));
        }

        temp = temp.substr(0, tem);
        tem = temp.indexOf(",");
        if (-1 == tem) {

            return RwCard.TransmitCardErr(SimCardNo, "-1", "写卡脚本格式解析脚本命令错误！");
        } else {
            commond = temp.substr(0, tem);
        }

        result = RwCard.TransmitCard(commond); // 执行写卡脚本

        if (ret == "9FXX") {
            if (result.substr(0, 2).toUpperCase() != "9F") {

                return RwCard.TransmitCardErr(SimCardNo, result, whiteCardOcx.GetErrMsg());
            }
        } else {
            var trueResult = "";
            tempList = result.split(" ");
            for (var l = 0; l < tempList.length; l++) {
                trueResult = RwCard.trim(trueResult + tempList[l]);
            }
            if (trueResult != ret) {

                return RwCard.TransmitCardErr(SimCardNo, result, whiteCardOcx.GetErrMsg());
            }
        }
    }

    // 加入IMSI
    var imsiCommond = "A0F4000012";
    var imsiString = "809" + Imsi;
    var imsiCode = "";
    var imsiNum_2 = imsiString.length / 2;
    for (var i = 0; i < imsiNum_2; i++) {
        imsiCode = imsiCode + imsiString.substr(1, 1) + imsiString.substr(0, 1);
        imsiString = imsiString.substring(2);
    }

    imsiCommond = imsiCommond + imsiCode + imsiCode;
    result = RwCard.TransmitCard(imsiCommond); // 把IMSI写入卡中,错误码 如果不是 90 00
    if (result != "90 00 ") {

        return RwCard.TransmitCardErr(SimCardNo, result, whiteCardOcx.GetErrMsg());
    }

    // 写入手机号码
    RwCard.execOneOrder('A0A40000023F00');
    RwCard.execOneOrder('A0A40000027F10');
    RwCard.execOneOrder('A0A40000026F40');

    var numCommond = "A0DC01041C";
    var numCodePre = "FFFFFFFFFFFFFFFFFFFFFFFFFFFF089168";
    var custNum = number;
    if (custNum == null || custNum.length != 11) {

        return RwCard.TransmitCardErr(SimCardNo, "-3", "手机号码错误");
    }
    custNum = custNum + "F";
    for (var i = 0; i < custNum.length - 1; i = i + 2) {
        numCodePre = numCodePre + custNum.substr(i + 1, 1) + custNum.substr(i, 1);
    }
    var numCodeSuf = "FFFFFFFFFF";
    var numCode = numCodePre + numCodeSuf;
    numCommond = numCommond + numCode;
    numResult = RwCard.TransmitCard(numCommond);
    if (numResult != "90 00 ") {

        return RwCard.TransmitCardErr(SimCardNo, numResult, whiteCardOcx.GetErrMsg());
    }

    // 验证IMSI
    var imsiWriteResult = "";
    var imsiWriteResultPrefix;
    var imsiWriteResultSuffix;

    RwCard.execOneOrder('A0A40000023F00');
    RwCard.execOneOrder('A0A40000027F20');
    RwCard.execOneOrder('A0A40000026F07');

    imsiWriteResult = RwCard.TransmitCard('A0B0000009');
    imsiWriteResult = RwCard.trim(imsiWriteResult);
    if (imsiWriteResult.length != 22) {

        return RwCard.TransmitCardErr(SimCardNo, imsiWriteResult, whiteCardOcx.GetErrMsg());
    }
    imsiWriteResultPrefix = imsiWriteResult.substr(0, 18);
    imsiWriteResultSuffix = imsiWriteResult.substr(18, 4);
    if ("9000" != imsiWriteResultSuffix) {

        return RwCard.TransmitCardErr(SimCardNo, imsiWriteResult, whiteCardOcx.GetErrMsg());
    }
    if (imsiCode != imsiWriteResultPrefix) {

        return RwCard.TransmitCardErr(SimCardNo, imsiWriteResult, whiteCardOcx.GetErrMsg());
    }

    var imsiWriteResultTwo = "";
    var imsiWriteResultTwoPrefix;
    var imsiWriteResultTwoSuffix;

    RwCard.execOneOrder('A0A40000023F00');
    RwCard.execOneOrder('A0A40000027FF0');
    RwCard.execOneOrder('A0A40000026F07');

    imsiWriteResultTwo = RwCard.TransmitCard('A0B0000009');
    imsiWriteResultTwo = RwCard.trim(imsiWriteResultTwo);
    if (imsiWriteResultTwo.length != 22) {

        return RwCard.TransmitCardErr(SimCardNo, imsiWriteResultTwo, whiteCardOcx.GetErrMsg());
    }
    imsiWriteResultTwoPrefix = imsiWriteResultTwo.substr(0, 18);
    imsiWriteResultTwoSuffix = imsiWriteResultTwo.substr(18, 4);

    if ("9000" != imsiWriteResultTwoSuffix) {

        return RwCard.TransmitCardErr(SimCardNo, imsiWriteResultTwo, whiteCardOcx.GetErrMsg());
    }
    if (imsiCode != imsiWriteResultTwoPrefix) {

        return RwCard.TransmitCardErr(SimCardNo, imsiWriteResultTwo, whiteCardOcx.GetErrMsg());
    }

    // 验证短信中心号码
    var smsWriteResult = "";
    var smsWriteResultPrefix;
    var smsWriteResultSuffix;

    RwCard.execOneOrder('A0A40000023F00');
    RwCard.execOneOrder('A0A40000027F10');
    RwCard.execOneOrder('A0A40000026F42');

    smsWriteResult = RwCard.TransmitCard('A0B2010428');
    smsWriteResult = RwCard.trim(smsWriteResult);

    if (typeof (commond) != "undefined" && commond.length == 90) {
        commond = commond.substr(10, 80);
        commond = commond.toUpperCase();
    } else {

        return RwCard.TransmitCardErr(SimCardNo, "-2", "短信中心号码写入失败");
    }
    if (smsWriteResult.length != 84) {

        return RwCard.TransmitCardErr(SimCardNo, smsWriteResult, whiteCardOcx.GetErrMsg());
    }
    smsWriteResultPrefix = smsWriteResult.substr(0, 80);
    smsWriteResultPrefix = smsWriteResultPrefix.toUpperCase();
    smsWriteResultSuffix = smsWriteResult.substr(80, 4);

    if ("9000" != smsWriteResultSuffix) {

        return RwCard.TransmitCardErr(SimCardNo, smsWriteResult, whiteCardOcx.GetErrMsg());
    }
    if (commond != smsWriteResultPrefix) {

        return RwCard.TransmitCardErr(SimCardNo, smsWriteResult, whiteCardOcx.GetErrMsg());
    }

    // 电话号码验证
    var numWriteResult = "";
    var numWriteResultPrefix;
    var numWriteResultSuffix;

    RwCard.execOneOrder('A0A40000023F00');
    RwCard.execOneOrder('A0A40000027F10');
    RwCard.execOneOrder('A0A40000026F40');

    numWriteResult = RwCard.TransmitCard('A0B201041C');
    numWriteResult = RwCard.trim(numWriteResult);
    numWriteResultPrefix = numWriteResult.substr(0, 56);
    numWriteResultPrefix = numWriteResultPrefix.toUpperCase();
    numWriteResultSuffix = numWriteResult.substr(56, 4);
    if ("9000" != numWriteResultSuffix) {

        return RwCard.TransmitCardErr(SimCardNo, numWriteResult, whiteCardOcx.GetErrMsg());
    }
    if (numCode != numWriteResultPrefix) {

        return RwCard.TransmitCardErr(SimCardNo, numWriteResult, whiteCardOcx.GetErrMsg());
    }

    // 写卡成功断开写卡器
    RwCard.DisConnetReader();

    return 0;
};

RwCard.readCard = function (sessionID) {
    // 加载读卡器插件
    RwCard.loadRwcardAcx();

    // 校验白卡类型,品牌,与业务类型之间的关系
//        if (tempCity == null || tempCity == '' || typeof (tempCity) == 'undefined') {
//            RwCard.validateRelation(RwCard.cardType + RwCard.brand);
//        } else {
//            RwCard.validateRelation(RwCard.cardType + 'x');
//        }

//        if (!EssValidation.ok) { return; }

    // 等待写卡器连接
    if (null == whiteCardOcx) {
        alert("访问写卡器出错，请确认写卡器已正确连接！");
        return;
    }

    // 读卡器读卡
    try {
        RwCard.getReaderName();
    } catch (e) {
        alert("写卡器驱动未安装，请下载驱动！");
        return;
    }

    var result = RwCard.ConnetReader(); // 连接写卡器
    if ("0" != result) {
        alert("连接写卡器失败，请尝试重新插入白卡！");
        return;
    }

    if (RwCard.queryUsimNo() == "-1") {
        alert("读卡失败！");
        return;
    }

    // 是否有IMSI
    var cardImsi = "";
    cardImsi = RwCard.queryCardImsi();
    if ("-1" == cardImsi) {
        if (confirm("此卡已写，请更换白卡后点击 确定 按钮！点击 取消 按钮可以中断写卡。"))
            RwCard.readCard(sessionID);
        return;
    }

//        jns('iccid').val(NewIccIdNo); // 保存ICCID,usimNo,为之后重复写卡比较做准备
//        RwCard.usimNoInput.val(NewIccIdNo);
//        NowIccIdNo = NewIccIdNo;
    RwCard.DisConnetReader();
    // 调用"获取写卡数据接口"
    RWCardClient.setSessionId(sessionID);

    return;
};

