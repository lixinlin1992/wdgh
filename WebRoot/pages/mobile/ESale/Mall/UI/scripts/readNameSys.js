/**
 * Created by carl on 2015/7/7.
 * 实名制反档js
 */
var card = {

    note: "读卡对象",
    //电话号码
    mobileNum: {
        value: '',
        elId: 'input_mobileNum',
        method: function (param) {

        },
        //设置数据
        setData: function (param) {

        }
    },
    //卡号
    iccid: {
        value: '',
        elId: 'input_iccid',
        method: function (param) {
            var carNum = param.replace(/\s/g, "");
            var cardRet = carNum.substr(0, 20);
            var str = "";
            for (var i = 0, length = 20; i < length; i++) {
                if (i % 2 == 0) {
                    str += cardRet.charAt(i + 1) + "";
                } else {
                    str += cardRet.charAt(i - 1) + "";
                }
            }
            this.value = str;//重新赋值
        },
        //设置数据
        setData: function (param) {
            $("#" + this.elId).val(param);
            //RwCard.loadRwcardAcx("bluetooth");//初始化蓝牙
            //var phoneNumber = RwCard.getPhoneNumber();
            $("#" + this.elId).val(param);
            //RwCard.loadRwcardAcx("bluetooth");//初始化蓝牙
            //var phoneNumber = RwCard.getPhoneNumber();
            function callback(phoneNumber){
            	$("#input_mobileNum").val(phoneNumber);
            }
            nativeAsync("RWCard","queryPhoneNumber","",callback);
        }
    },
    //身份证号码
    personId: {
        value: '',
        elId: 'input_personId',
        method: function (param) {
            this.value = param;//重新赋值
        },
        //设置数据
        setData: function (param) {
            /**
             * address 地址
             * born 出生日期
             * cardno 身份证id
             * effecteddate 有效日期开始
             * expireddate 有效日期结束
             * issuedat 签发机关
             * name 姓名
             * nation 民族
             * picture 图片
             * result 结果编码
             * sex 姓名
             * sexcode 性别编码
             */
            $("#input_name").val(param.name);
            $("#input_personId").val(param.cardno);
            $("#input_address").val(param.address);
            var expiredDate = param.expireddate;

            if (expiredDate) {
                var dateStr = expiredDate.substr(0, 4) + "-" + expiredDate.substr(4, 2) + "-" +
                        expiredDate.substr(6, 2);
                // var d = new Date(Date.parse(s.replace(/-/g, "-")));
                $("#input_expiredDate").val(dateStr);
            }
            $("#input_sex").val(param.sexcode);
        }
    },
    //mobileNum,iccid,personId其中一个焦点对象
    focus: '',
    //input标签点击事件
    inputClick: function (params) {
        this.focus = params;
    },
    /**
     * 读卡次数
     */
    readCount: 0,
    //设置num
    setNum: function (num) {
        //执行method方法
        if (card[card.focus]) {
            card[card.focus].method(num);
            card[card.focus].setData(card[card.focus].value);
        }
    }
}
//身份证回调方法
var readIdCard = function (msg) {
    unmask();
    var result = -1;
    if (msg && msg != '' && (result = JSON.parse(msg)) && result.result == 0) {
        var cardNo = result.cardno;//获取卡号

        card.setNum(result);
    } else {
        mask("读身份证失败了。");
    }
}
/**
 * 读卡号
 */
card.readNum = function () {
    //如果是身份证调用身份证
    if (card[card.focus] && card[card.focus].elId !== card.personId.elId) {
        mask("人家在努力的读卡嘛...");
        //读卡
        function callback(res){
           onReadCardFinish(res);
        }
        nativeAsync("RWCard","queryUsimNo","",callback);
    } else {
        mask("我在在努力的读身份证哟...");
        //读身份证
        GetIDCardInfo("readIdCard");
    }
}
//读卡回调方法
function onReadCardFinish(num) {
    unmask();
    if (num != null && num !== '') {
        card.setNum(num);
    } else {
        mask("呜呜，读卡失败了。");
    }
}

card.submit = function () {
    var REALNAME_NUMBER = rdcp.id("input_mobileNum").val(); //实名制手机号码：
    //var CERT_TYPE=rdcp.id("CERT_TYPE").val();   //证件类型
    var GENDER = $("#input_sex option:selected").text();//性别
    var CUSTOMER_NAME = $("input_name").text();//客户姓名
    var CERT_NUMBER = rdcp.id("input_personId").val();        //证件号码:
    var CERT_ADDRESS = rdcp.id("input_address").val();        //证件地址
    var CONTACTS_NAME = rdcp.id("input_contactsName").val();       //联系人：
    var CONTACT_PHONE = rdcp.id("input_contactsMobile").val();        //联系电话：
    var POSTAL_ADDRESS = rdcp.id("input_contactsAdd").val();        //联系地址
    var CardID = $("#input_iccid").val();
    var CERT_VALID_TO = $("#input_expiredDate").val();
    var postCode = $("#input_postCode").val();//邮政编码
    var jobType = $("#input_jobType").val();//职业类型
    var tradeType = $("#input_tradeType").val();//单位行业类别
    var tradeTypeStatus = $("#input_tradeTypeStatus").val();

    var file1Id = rdcp.id("file1Id").val();
    var file2Id = rdcp.id("file2Id").val();
    var ID_PIC_PEO = rdcp.id("file3Id").val();
    var NOTE = rdcp.id("input_note").val();       //备注
    //创建充值订单充值
    var list = "{\"list\":[{\"goodsId\":\"" + '' + "\",\"quantity\":\"1\"}]}";
    var ext = "{\"ext\":{" +
            "\"BASE\":[" +
            "{\"key\":\"REALNAME_NUMBER\",\"val\":\"" + REALNAME_NUMBER + "\",\"key_as\":\"实名制手机号码\"}," +
            "{\"key\":\"CUSTOMER_NAME\",\"val\":\"" + CUSTOMER_NAME + "\",\"key_as\":\"客户姓名\"}," +
            "{\"key\":\"CERT_TYPE\",\"val\":\"" + 3 + "\",\"key_as\":\"证件类型\"}," +
            "{\"key\":\"CERT_NUMBER\",\"val\":\"" + CERT_NUMBER + "\",\"key_as\":\"证件号码\"}," +
            "{\"key\":\"GENDER\",\"val\":\"" + GENDER + "\",\"key_as\":\"性别\"}," +
            "{\"key\":\"ID_PIC_PEO\",\"val\":\"" + ID_PIC_PEO + "\",\"key_as\":\"身份证凭证图片\"}," +
            "{\"key\":\"CERT_VALID_TO\",\"val\":\"" + CERT_VALID_TO + "\",\"key_as\":\"证件有效期\"}," +
            "{\"key\":\"CERT_ADDRESS\",\"val\":\"" + CERT_ADDRESS + "\",\"key_as\":\"证件地址\"}," +
            "{\"key\":\"CONTACTS_NAME\",\"val\":\"" + CONTACTS_NAME + "\",\"key_as\":\"联系人\"}," +
            "{\"key\":\"CONTACT_PHONE\",\"val\":\"" + CONTACT_PHONE + "\",\"key_as\":\"联系电话\"}," +
            "{\"key\":\"CardID\",\"val\":\"" + CardID + "\",\"key_as\":\"身份证ID\"}," +
            "{\"key\":\"POSTAL_ADDRESS\",\"val\":\"" + POSTAL_ADDRESS + "\",\"key_as\":\"联系地址\"}," +
            "{\"key\":\"YZBM\",\"val\":\"" + postCode + "\",\"key_as\":\"邮政编码\"}," +
            "{\"key\":\"ZYLX\",\"val\":\"" + jobType + "\",\"key_as\":\"职业类型\"}," +
            "{\"key\":\"DWHYLB\",\"val\":\"" + tradeType + "\",\"key_as\":\"单位行业类别\"}," +
            "{\"key\":\"DWHYZLB\",\"val\":\"" + tradeTypeStatus + "\",\"key_as\":\"单位行业子类别\"}," +
            "{\"key\":\"NOTE\",\"val\":\"" + NOTE + "\",\"key_as\":\"备注\"}" +
            "]," +
            "\"BASE.IMG\":[" +
            "{\"key\":\"ID_PIC_FRONT\",\"val\":\"" + file1Id + "\",\"key_as\":\"身份证正面照片\"}," +
            "{\"key\":\"ID_PIC_BACK\",\"val\":\"" + file2Id + "\",\"key_as\":\"身份证反面照片\"}" +
            "]" +
            "}}";
    return {
        param: {
            list: list,
            ext: ext,
            "payStatus": -1
        },
        callback: function (data) {
            console.info(data);
        }
    }
}

/**
 * 实名制认证
 * System/Base/pages/tpl/RCard.html 下的控制器
 */
app.registerCrl('IccidController', ['$scope', '$srhttp', function ($scope, $srhttp) {
    $scope.input = {
        input_mobileNum: card.mobileNum.value,
        input_iccid: card.iccid.value,
        input_personId: card.personId.value
    };
    //点击事件，一般用在聚焦input
    $scope.clickFun = function (params) {
        card.inputClick(params);
        card.readNum();
    };
    $scope.submit = function submit() {
        var params = card.submit();
        var url = "!ESale/Mall/Order/~java/Order.create";
        $srhttp.request(
                url,
                params.param,
                function (data) {
                    params.callback(data);
                });
    };
}]);

