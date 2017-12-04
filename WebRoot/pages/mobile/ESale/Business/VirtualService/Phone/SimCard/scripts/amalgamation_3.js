//todo
var other_product = 1,
    other_info = 1;
var needIPTV = 1,
    other = 0;

var addMoney;
var actualMoney;

//----------------LST(Config接口返回的参数)--------------//
var network = "";
var network_ip = "";
var other_product2 = "";
var phone = "";
//----------------LST-------------//

//todo



var myHttp = {};
var scope = {};
var chooseDivCount = 0; //用来保存页面选号DIV的个数,从0开始计数，0代表有1个DIV，1代表有两个DIV，以此类推
var isCurrentDIVChosen = false; //用来判断当前选号DIV（也就是最后一个DIV）用户是否已选号
var pageCount = 1; //当前页码
var pageSize = 14;
var isLastPage = false;
var numbers = {}; //用来保存用户已经选择的号码
var numberIds = new Array(10); //用来保存用户已经选择的号码的ID


var isCurrentIDGot = false; //用来判断当前的身份证信息是否已成功读取
var inputDivCount = 0; //用来保存纳入号码DIV的个数,从0开始计数，0代表有1个DIV，1代表有两个DIV，以此类推
var cardIDs = new Array(10); //用来保存纳入号码模块已经读取的用户身份证信息

//var firstNumber="";  //用来保存客户选的第一个号码
var inputNumber = "";

var otherProduct = ""; //用来保存客户选的时预存100话费还是700话费
var bankPicId = ""; //用来保存银行卡照片ID

var orderId;
var myPhoto = {};
app.registerCtrl("amalgamation3Ctrl", ["$scope", "$srhttp", "$rootScope",
    function($scope, $srhttp, $rootScope) {

        //底部导航样式变化
        setTimeout(function() {
            replaceClass('home');
        }, 100);

        $rootScope.appTitle = "做融合";
        //TODO 接收数据


        //发展人参数
        /*$scope.form = {
            "DEV_CODE":"",
            "DEV_NAME":"",
            "DEV_PHONE":""
        }*/

        myHttp.request = $srhttp.request;
        myHttp.post = $srhttp.post;
        $scope.form = Local.getStoreJson("form");
        $scope.orderList = Local.getStoreJson("orderList");
        $scope.second = Local.getStoreJson("second");

        scope = $scope;
        scope.form = $scope.form;
        scope.orderList = $scope.orderList;
        scope.second = $scope.second;


        //-----------LST(Config接口获取的参数)--------------------------
        network = $scope.second.network;
        network_ip = $scope.second.network_ip;
        other = $scope.second.other;
        other_info = $scope.second.other_info;
        other_product = $scope.second.other_product;
        other_product2 = $scope.second.other_product2;
        phone = $scope.second.phone;
        //-----------LST-----------------------------------------------

        setTimeout(function() {
            initPage();
            initOther();
        }, 200)

        //添加上一步跳转的链接
        app.when("/amalgamation_2", {
            templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/amalgamation_2.html",
            controller: "amalgamation2Ctrl"
        });

        /*//添加下一步跳转的链接
        app.when("/amalgamation_4", {
            templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/amalgamation_4.html",
            controller: "amalgamation4Ctrl"
        });*/

        //上一步
        $scope.prevPage = function() {
            location.href = "#/amalgamation_2";
        }

        //下一步
        $scope.nextPage = function() {
            location.href = "#/amalgamation_4";
        }
    }
]);

app.registerCtrl("NetCtrl", ["$scope", "$srhttp", "$rootScope",
    function($scope, $srhttp, $rootScope) {


        scope.numberList = $scope.numberList;
        /**
         * 当用户选择号码时调用
         *
         */
        $scope.selectNumber = function(id) {
                var selectBtn = $("#numberSelect_id_" + id);
                if ($(selectBtn).hasClass("com_selectbtn  ng-binding com_selectbtnon")) {
                    alert("此号码已经被选中，请选择其他号码");
                    console.log("此号码已经被选中，请选择其他号码");
                    return;
                }

                //预占号码
                var id = $(selectBtn).attr("numberId");

                $srhttp.post("!ESale/Business/VirtualService/Phone/SimCard/~java/Number.lock", {
                    id: id
                }, function(data) {
                    if (data.header.code == 0) {
                        if (data.body.flag == "1") {
                            //预占成功
                            $("body").removeAttr("style", "overflow-y:hidden");
                            $("#shadeDiv1").hide();
                            $("#numberDIV").hide();
                            $("#numberSpan" + chooseDivCount).text($(selectBtn).text());
                            numberIds[chooseDivCount] = id;
                            numbers[chooseDivCount] = $(selectBtn).text();
                            isCurrentDIVChosen = true;
                        }
                    } else {
                        alert("此号码已被预占，请选择其它号码");
                    }
                });
            }
            /**
             * 当用户点击换一组号码时调用
             *
             */
        $scope.changeNumber = function() {
            pageCount++;
            if (isLastPage) {
                alert("对不起，没有更多号码了");
                return;
            } else {
                $scope.loadNumber("", pageCount, "change");

            }

        }

        //发展人参数
        $scope.rows = [{
            DEV_CODE: "",
            DEV_NAME: "",
            DEV_PHONE: ""
        }];

        // 是否绑定
        $srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/Q_CBSS_INFO", {},
            function(data) {
                if (data.header.code == 0 && data.body.rows.length > 0 && data.body.rows[0].CBSS_ID) {
                    $('#binding').show();
                    $scope.developPeople();
                    setTimeout(function() {
                        $scope.developSelect(0);
                    }, 100);
                    // $scope.form.show = true;
                } else {
                    $('#binding').hidden();
                    // $scope.form.show = false;
                }
            });

        // 获取发展人信息
        $scope.developPeople = function() {
                $srhttp.get("!ESale/Mall/Member/~query/Q_GET_CBSS_INFO", {},
                    function(data) {
                        if (data.header.code == 0 && data.body.rows.length > 0) {
                            $scope.user = data.body.rows[0].CBSS;
                            $scope.rows = data.body.rows;
                            setTimeout(function() {
                                $scope.developSelect(0);
                            }, 100);
                        } else {
                            alert("获取发展人信息失败");
                        }
                    });
            }
            // 选择发展人
        $scope.developSelect = function(index) {
            var a = $("#developSelect_" + (index));
            $("#developSelectAll a").removeClass('com_checkoxon');
            a.addClass("com_checkoxon");
            $scope.form.DEV_CODE = $scope.rows[index].DEV_CODE;
            $scope.form.DEV_NAME = $scope.rows[index].DEV_NAME;
            $scope.form.DEV_PHONE = $scope.rows[index].DEV_PHONE;

        }

    }
]);

function initPage() {
    //判断是否要展示安装IPTV模块

    if (needIPTV == 1) {
        $("#needIPTVLayoutDiv").show("normal");
    }
    //判断是否要显示其他模块
    if (other == "1") {
        initOther();
        $("#otherLayoutDiv").show("normal");
    }
    //获取订单金额
    var url = "!ESale/System/Base/~query/Q_BASE_DATA";
    var params = {
        "table": "BASE_INFO",
        "field": "SDRH_PRICE"
    };
    myHttp.request(url, params, function(data) {
        if (data.header.code == 0) {
            addMoney = parseInt(data.body.rows[0].CODE);
            console.log("====" + parseInt(data.body.rows[0].CODE));
            $("#money").val(addMoney);
        }
    }, {
        async: false
    });
}

function initOther() {
    //判断是否要显示其他模块的其他内容

    if (other_product == "1") {
        $("#product").show("normal");
    }

    if (other_info == "1") {
        $("#bankCardDiv").show("normal");
    }
}
/**
 * 当用户点击选择4G号码时调用
 * 加载第一页的号码
 */

function showNumber() {
    $("body").attr("style", "overflow-y:hidden");
    $("#shadeDiv1").show();

    //$("#numberListDIV").empty();
    loadNumber("", 1, "load");

}
/**
 * 查询号码
 * @params numnber:要查询的号码
 *  @params page:第几页
 *  @params isSearch: 判断是查询按钮调用、换一组号码调用还是装载时调用
 *                                load：装载时调用；search：查询时调用；change：换一组号码调用
 */

function loadNumber(number, page, type) {
    isLastPage = false;
    pageCount = 1;
    var url = "!ESale/Mall/Goods/~query/Q_GOODS_NUMBER_COMMON";
    var params = {
        "businessId": "ChinaUnicom.Account.4G.BK",
        "brandId": "CU",
        "title": number,
        "pageSize": pageSize,
        "page": page
    };

    myHttp.request(url, params, function(data) {
        var resultNum = data.body.rows.length;
        if (resultNum == 0) {
            if (type == "load") {
                alert("抱歉，该套餐下没有可选的号码！");
                return;
            }

            if (type == "search") {
                alert("抱歉，查询不到您输入的号码！");
                return;
            }

            if (type == "change") {
                alert("抱歉，没有更多号码可供选择了！");
                return;
            }
        }
        scope.numberList = data.body.rows;
        //如果查询到的数据少于页面容量，则说明没有更多数据了
        /*
         for (var i = 0; i < resultNum; i++) {
         if (i % 2 == 0) {
         var hdiv = $("<div class='row com_selectbox'>");
         $("#numberListDIV").append(hdiv);
         }
         var btnDiv = $("<div class='col-md-6 col-xs-6 list'>");
         var btnA = $("<a name='numberBtn' class='com_selectbtn' href='javascript:' onclick='selectNumber(this);'>");
         btnA.text(data.body.rows[i].TITLE);
         btnA.attr("numberId",data.body.rows[i].ID);



         btnDiv.append(btnA);
         hdiv.append(btnDiv);
         }*/
        $("#numberDIV").show();
        setTimeout(function() {
            for (var i = 0; i < resultNum; i++) {
                //遍历已选号码数组，判断本号码是否已经被选，若被选，则修改样式
                $.each(numbers, function(n, value) {
                    if (data.body.rows[i].TITLE == value) {
                        //$("#numberDIV").attr("class", "com_selectbtn com_selectbtnon")
                        console.log("#numberSelect_id_" + i);

                        $("#numberSelect_id_" + i).addClass("com_selectbtnon");
                        console.log(value + "========" + i);
                    }
                });
            }
        }, 100)
        if (resultNum < pageSize) {
            isLastPage = true;
        }

    });
}
/**
 * 当用户点击选择号码左侧的+号时调用
 *
 */

function addChooseDiv() {
    if (!isCurrentDIVChosen) {
        alert("请先选择一个号码然后才能继续选号！");
        return;
    }
    chooseDivCount++;

    var newChooseDiv = $("#blankChooseDIV").clone();
    $(newChooseDiv).attr("id", "chooseDIV" + chooseDivCount);

    //设置新增DIV的numberSpan的ID
    var numberSpan = $(newChooseDiv).children(".com_choicenumber").children(".number");
    numberSpan.attr("id", "numberSpan" + chooseDivCount);

    //设置新增DIV隐藏域chooseDIVCount的值
    var countInput = $(newChooseDiv).children("input").first();
    countInput.val(chooseDivCount);

    $(newChooseDiv).show();
    $("#allChooseDIV").append(newChooseDiv);
    isCurrentDIVChosen = false; //每当新加一个DIV，则重置为false
}


/**
 * 当用户点击选号弹出框右上角的关闭按钮时，隐藏弹窗
 */
function closeChooseDIV() {
    $("body").removeAttr("style");
    $("#shadeDiv1").hide();
    $("#numberDIV").hide();
}
/**
 * 当用户点击选择号码右侧的-号时调用
 * @param selectBtn:用户选择的那个按钮本身
 */

function minusChooseDiv(minusBtn) {
    var count = $(minusBtn).parents(".container-fluid").children("input").first().val();
    var selectNumber = $("#numberSpan" + count).text();

    //如果用户已经选号了，则从集合中删除已经选择的号码
    if (selectNumber != "") {
        numbers[count] = undefined;
        numberIds[count] = undefined;
    }

    $("#chooseDIV" + count).remove();
    chooseDivCount--;
    isCurrentDIVChosen = true;
}
/**
 * 点用户点击 点此以纳入号码 按钮时调用
 */

function showFirstInputDiv() {
    $("#showBtn").hide();
    $("#newInputDIV0").show("normal");
}
/**
 * 当用户点击【移网信息】的需要过户时调用
 */
var needTransfer = false;

function selectNeedTransfer(selectBtn) {
    $(selectBtn).parents("div[class='layout_secondbox']").find("a[name='needTransferBtn']").addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
    /*$("a[name='needTransferBtn']").attr("class","com_selectbtn");
    $(selectBtn).attr("class","com_selectbtn com_selectbtnon");*/

    if ($(selectBtn).attr("id") == "needTransferBtn_YES") {
        $(selectBtn).parents("div[id='needTransferDIV']").siblings("div[id='oldUserIDReadLayoutDiv']").show();
        $(selectBtn).parents("div[class='layout_secondbox']").find("a[id='needTransferBtn_YES']").addClass("com_selectbtnon");
        needTransfer = true;
    } else {
        $(selectBtn).parents("div[id='needTransferDIV']").siblings("div[id='oldUserIDReadLayoutDiv']").hide();
        $(selectBtn).parents("div[class='layout_secondbox']").find("a[id='needTransferBtn_NO']").addClass("com_selectbtnon");

        needTransfer = false;
    }

}

/**
 * 当用户点击蓝牙读取时调用
 */
function bluetoothRead() {
    check();

}

/**
 * 蓝牙读取照片成功后的回调函数
 */
function onReadIDCardFinish(bluetoothInfoStr) {
    unmask();

    if (bluetoothInfoStr != "{}") {
        var bluetoothInfo = $.parseJSON(bluetoothInfoStr);


        //2015-06-17 添加身份证读取失败信息获取
        if (bluetoothInfo.result != undefined && bluetoothInfo.result != 0) {
            alert(getReadCardResult(bluetoothInfo.result));
            if (bluetoothInfo.result == -1) {
                if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
                    $("#btBox").css("display", "block");
                    $("#shadeDiv").css("display", "block");
                }
            }
            $('#bluetooth_read_btn').button('reset'); //还原蓝牙读取按钮的状态为可点击
            return;
        }

        var userName, cert_address, gov, gender, cert_number, from, to;
        userName = bluetoothInfo.name;
        cert_address = bluetoothInfo.address;
        gov = bluetoothInfo.issuedat;
        gender = bluetoothInfo.sex;
        cert_number = bluetoothInfo.cardno;

        if (bluetoothInfo.effecteddate.length != 10) {
            var date1 = bluetoothInfo.effecteddate;
            date1 = date1.substring(0, 4) + "-" + date1.substring(4, 6) + "-" + date1.substring(6, 8);
        } else {
            var date1 = bluetoothInfo.effecteddate;
            date1 = date1.substring(0, 4) + "-" + date1.substring(5, 7) + "-" + date1.substring(8, 10);

        }
        if (bluetoothInfo.expireddate.length != 10) {
            var date2 = bluetoothInfo.expireddate;
            date2 = date2.substring(0, 4) + "-" + date2.substring(4, 6) + "-" + date2.substring(6, 8);
        } else {
            var date2 = bluetoothInfo.expireddate;
            date2 = date2.substring(0, 4) + "-" + date2.substring(5, 7) + "-" + date2.substring(8, 10);
        }
        from = date1;
        to = date2;

        //根据返回的身份证信息生成form对象，然后调用后台方法返回身份证信息在数据库中的ID
        var form = {
            "name": userName,
            "gender": gender,
            "paper_num": cert_number,
            "paper_stime": from,
            "paper_time": to,
            "str_office": gov,
            "paper_addr": cert_address
        };

        var IDCARD_ID = InsertIDCard(form);
        cardIDs[inputDivCount] = IDCARD_ID; //存入数组中

        /*var str="";
        for(var i=0;i<cardIDs.length;i++){
            if(cardIDs[i]!=undefined){
                str=str+cardIDs[i]+"  ";
            }
        }
        window.native.toast(str);*/

        //请求合成身份证照片
        mask("身份证信息读取成功，正在进行照片合成……");
        myHttp.request("!ESale/System/IDCard/~java/IDCardImg.create", bluetoothInfo, function(data) {
            unmask();
            if (data.header.code == 0) {
                var url1 = "!service/file/~java/Downloader.get?type=Thumb&id=" + data.body.cardon; //正面照片
                var url2 = "!service/file/~java/Downloader.get?type=Thumb&id=" + data.body.cardoff; //反面照片
                $("#front").parent().css("background", "url('" + APP_CONFIG.SERVER_URL + url1 + "')");
                $("#contrary").parent().css("background", "url('" + APP_CONFIG.SERVER_URL + url2 + "')");
                //身份证信息读取完成后，重置当前身份证信息是否读取的变量的值
                isCurrentIDGot = true;

            } else {
                alert("身份证照片合成失败！");
            }
        });

    } else {
        alert('身份证读取失败，请重试');
    }
    unmask();
    $("#bluetooth_read_btn").button('reset'); //还原蓝牙读取按钮的状态为可点击
}

/**
 * 当用户点击纳入号码的+号时调用
 */
function addInputDiv() {

    if ($("#input" + inputDivCount).val() == "") {
        alert("请先输入当前需要纳入的号码!")
        $("#input" + inputDivCount).focus();
        return;
    }

    if (needTransfer && !isCurrentIDGot) {
        alert("请先蓝牙读取当前号码所属用户的身份证信息!");
        return;
    }

    inputDivCount++;
    isCurrentIDGot = false;
    var newDIV = $("#newInputDIV0").clone();
    newDIV.attr("id", "newInputDIV" + inputDivCount)
    var newInput = $(newDIV).find("input").first(); //取得纳入号码输入框
    $(newInput).attr("id", "input" + inputDivCount);
    $(newInput).val("");
    $(newDIV).find(".btn_minus").show();
    $("#netLayoutDiv").append(newDIV);
    //scrollHeightToBottom("newInputDIV"+inputDivCount,391);
}

/**
 * 当用户点击纳入号码右侧的-号时调用
 * @param selectBtn:用户选择的那个按钮本身
 */
function minusInputDiv(minusBtn) {
    //如果用户已经读取身份证信息了，则从集合中删除已经读取的身份证ID
    if (isCurrentIDGot) {
        cardIDs[inputDivCount] = undefined;
    }

    if (inputDivCount == 0) {
        $("#newInputDIV0").hide("normal");
        $("#showBtn").show("normal");
    } else {
        $("#newInputDIV" + inputDivCount).remove();
        inputDivCount--;
        isCurrentIDGot = true;
    }

}

/**
 * 当用户点击选号弹出框的搜索按钮时调用
 * 如果用户什么都不输，则查询所有号码
 */
function searchNumber() {
    var searchValue = $("#searchInput").val();
    /*if(searchValue==""){
     alert("请输入有效的号码！");
     return;
     }*/
    loadNumber(searchValue, 1, "search");
}

//不管定单处理成功失败，往后台写入信息
sendMessage = function(memberId, msg) {
    myHttp.post("!ESale/System/Base/~java/MessageTrans.sendMessage", {
        distination: memberId,
        param: msg
    }, function(data) {
        if (data.header.code == 0) {
            //alert("往 后台插入信息成功");
        } else {
            alert("处理异常，请稍后重试");
        }
    })
}

/**
 * 当用户点击提交按钮时，调用后台订单生成接口生成订单
 */
function create_order() {
    var paramData = getOrderData();

    mask("正在提交订单，请稍候......");
    myHttp.post("!ESale/Mall/Order/~java/Order.create", {
        "list": rdcp.json2str(paramData.list),
        "ext": rdcp.json2str(paramData.ext),
        "businessId": "ChinaUnicom.Amalgamation",
        "surefee": actualMoney
    }, function(data) {
        unmask();

        if (data.header.code == 0) {
            var creatorName = data.body["creator_member_name"];
            var devId = data.body["member_id"];
            //Base.sendMessage(devId, creatorName + "的订单已经生成,请注意接收查看");
            sendMessage(devId, creatorName + "的订单已经生成,请注意接收查看");

            //查询订单信息，展示支付模块
            mask("订单已成功创建，正在加载支付信息……");
            orderId = data.body["id"];
            myHttp.post('!ESale/Mall/Order/~java/Order.getOrder', {
                "orderId": orderId
            }, function(data) {
                unmask();
                if (data.header.code == 0 && data.body.id != undefined && data.body.id != "") {
                    $("#orderMoney").text("￥" + data.body.fee);

                    //隐藏除支付模块之外的其他所有模块
                    $("#netLayoutDiv").hide("normal");
                    $("#needIPTVLayoutDiv").hide("normal");
                    $("#otherLayoutDiv").hide("normal");
                    $("#moneyDiv").hide("normal");
                    $("#prev_and_nextPage").hide("normal");
                    $("#payLayoutDiv").show("normal");
                    $("#payBtnDiv").show("normal");
                    //scrollHeightToBottom("payLayoutDiv",176);
                } else {
                    alert("提示", '抱歉，获取订单信息失败');
                    $("#prev_and_nextPage").css("display", "block"); //出现【上一步】与【确认订单】按钮
                }
            });

        } else {
            alert("提示", "订单创建失败！");
            $("#submitBtn").css("display", "block");
        }
    });

}

/**
 * 获取需要提交的数据
 */
function getOrderData() {

    var result = {};

    //如果用户选了号码则用号码做商品ID，如果没选则使用虚拟商品ID
    result['list'] = {
        'list': []
    };
    if (chooseDivCount > 0 || isCurrentDIVChosen) {
        $.each(numberIds, function(n, value) {
            if (value != "" && value != undefined) {
                result['list'].list.push({
                    'goodsId': value,
                    'quantity': '1'
                });
            }
        });
    } else {
        //获取融合业务的虚拟商品ID
        var goodsId = "";
        myHttp.post("!ESale/Mall/Goods/~query/Q_VIRTUAL_GOODS", {
            businessId: 'ChinaUnicom.Amalgamation'
        }, function(data) {
            if (data.header.code == '0') {
                //判断商品是否为空：
                if (data.body.rows.length > 0) {
                    goodsId = data.body.rows[0]["ID"];

                    //判断是否取到有效的商品ID
                    //goodsId='19B560E06F40617BE050007F01004A41';
                    if (goodsId == undefined || goodsId == "") {
                        alert("对不起，请确认您是否已分配此业务！");
                        return;
                    }
                    result['list'] = {
                        'list': [{
                            'goodsId': goodsId,
                            'quantity': '1'
                        }]
                    };
                }
            } else {
                alert("对不起，查询虚拟商品ID时出错！");
                return;
            }
        });


    }

    var comment = $("#comment").val();

    result['ext'] = {
        'ext': {
            'BUSINESS': [{
                    'key': 'DEV_CBSS_CODE',
                    'val': $scope.form.DEV_CODE,
                    'key_as': 'CBSS开户发展人编码'
                }, {
                    'key': 'DEV_CBSS_NAME',
                    'val': $scope.form.DEV_NAME,
                    'key_as': 'CBSS开户发展人名称'
                }, {
                    'key': 'DEV_CBSS_PHONE',
                    'val': $scope.form.DEV_PHONE,
                    'key_as': 'CBSS开户发展人手机'
                }, {
                    'key': 'BRAND_NAME',
                    'val': "中国联通",
                    'key_as': '运营商'
                }, {
                    'key': 'address',
                    'val': scope.second.address,
                    'key_as': '装机地址'
                }, {
                    'key': 'TELE_NUMBER',
                    'val': scope.second.phoneNumber,
                    'key_as': '老用户固话号码'
                }, {
                    'key': 'MOVE_ADDRESS',
                    'val': scope.second.moveAddress,
                    'key_as': '移机地址'
                }, {
                    'key': 'NET_ACCOUNT',
                    'val': scope.second.netAccount,
                    'key_as': '宽带账号'
                }, {
                    'key': 'CardID',
                    'val': scope.orderList.IDCARD_ID,
                    'key_as': '身份证ID'
                }, //第一个页面读取的用户身份证的ID
                {
                    'key': 'IDCARD_ID_NET',
                    'val': scope.second.IDCARD_ID_NET,
                    'key_as': '宽带老用户身份证ID'
                }, {
                    'key': 'IDCARD_ID_TELE',
                    'val': scope.second.IDCARD_ID_TELE,
                    'key_as': '固话老用户身份证ID'
                }, {
                    'key': 'businessName',
                    'val': "智慧沃家",
                    'key_as': '业务类型'
                }, {
                    'key': 'NEED_IPTV',
                    'val': needIPTV ? '是' : '否',
                    'key_as': '是否需要安装IPTV'
                }
            ],
            'BASE': [{
                'key': 'CUSTOMER_NAME',
                'val': scope.form.CUSTOMER_NAME,
                'key_as': '客户姓名'
            }, {
                'key': 'CERT_ADDRESS',
                'val': scope.form.CERT_ADDRESS,
                'key_as': '证件地址'
            }, {
                'key': 'CONTACT_MAN',
                'val': scope.orderList.contactName,
                'key_as': '联系人'
            }, {
                'key': 'CONTACT_PHONE',
                'val': scope.orderList.telephone,
                'key_as': '联系电话'
            }, {
                'key': 'ISS_USING',
                'val': scope.form.ISS_USING,
                'key_as': '签发机关'
            }, {
                'key': 'GENDER',
                'val': scope.form.GENDER,
                'key_as': '性别'
            }, {
                'key': 'CERT_NUMBER',
                'val': scope.form.CERT_NUMBER,
                'key_as': '证件号码'
            }, {
                'key': 'NOTE',
                'val': scope.form.NOTE,
                'key_as': '备注'
            }],
            'BASE.IMG': [{
                'key': 'ID_PIC_FRONT',
                'val': scope.form.FRONT,
                'key_as': '身份证正面照片'
            }, {
                'key': 'ID_PIC_BACK',
                'val': scope.form.BACK,
                'key_as': '身份证反面照片'
            }, ],
            'BASE.DATE': [{
                    'key': 'CERT_VALID_FROM',
                    'val': scope.form.CERT_VALID_FROM,
                    'key_as': '证件有效期开始'
                }, //证件有效日期开始
                {
                    'key': 'CERT_VALID_TO',
                    'val': scope.form.CERT_VALID_TO,
                    'key_as': '证件有效期结束'
                } //证件有效日期
            ]
        }
    };

    //如果其他模块，则判断里面是否展示了展品和银行卡信息，若有，则添加到JSON里面提交到后台
    if (other == "1") {
        if (other_product == "1") { //如果有产品模块
            result.ext.ext['BUSINESS'].push({
                'key': 'OTHER_PRODUCT',
                'val': otherProduct,
                'key_as': '其他产品信息'
            });
        }

        if (other_info == "1") { //如果有银行托收模块
            result.ext.ext['BASE.IMG'].push({
                'key': 'ID_PIC_BANK',
                'val': bankPicId,
                'key_as': '银行卡照片'
            });
        }
    }

    if (scope.form.hand != "" && scope.form.hand != undefined) {
        result.ext.ext['BASE.IMG'].push({
            'key': 'ID_PIC_HAND',
            'val': scope.form.hand,
            'key_as': '身份证手持照片'
        });
    }
    console.log(result);
    return result;
}

/**
 * 当用户点击提交按钮时调用
 * 根据业务需求，并不强制要求客户必须选一个号码或者必须纳入一个号码
 */

function next() {

    //如果其他模块被展示，则要校验里面的数据是否已选
    if (other == "1") {
        if (other_product == "1") { //校验其他产品是否被选
            if (otherProduct == "") {
                alert("请选择一个产品！");
                return;
            }
        }

        if (other_info == "1") { //校验银行卡是否被选
            if (bankPicId == "") {
                alert("请上传银行卡照片！");
                return;
            }
        }
    }
    //判断发展人内容

    /*if ($scope.form.DEV_CODE == "") {
        alert("发展人信息不能为空");
        return;
    };*/

    actualMoney = parseInt($("#money").val());
    if (actualMoney < addMoney) {
        alert("对不起，您的预存款不能少于" + addMoney + "元！");
        return;
    }

    create_order();
}


/**
 * 当用户点击其他信息中的预存话费按钮时调用
 */
function selectSaveFee(selectBtn) {
    $("a[name='saveFeeBtn']").attr("class", "com_selectbtn");
    $(selectBtn).attr("class", "com_selectbtn com_selectbtnon");
    otherProduct = $(selectBtn).text();
}

/**
 * 当用户点击上一步按钮按钮时调用
 * 这里只是简单的调用浏览器的后退功能
 */
function back() {
    history.back(-1);
}
/**
 * 点用户点击 【是否需要安装IPTV】 按钮时调用
 */
var needIPTV = false;

function selectNeedIPTV(selectBtn) {
    if ($(selectBtn).attr("id") == "needIPTV_YES") {
        needIPTV = true;
        $(selectBtn).attr("class", "com_selectbtn com_selectbtnon");
        $("#needIPTV_NO").attr("class", "com_selectbtn");
    } else {
        needIPTV = false;
        $(selectBtn).attr("class", "com_selectbtn com_selectbtnon");
        $("#needIPTV_YES").attr("class", "com_selectbtn");
    }
}

/**
 * 点用户点击 【钱包支付/ 暂不支付】 按钮时调用
 */
var isPay = true;

function choosePay(type) {
    if (type == "yes") {
        isPay = true;
        $("#choosePayBtn_yes").attr("class", "com_selectbtn com_selectbtnon");
        $("#choosePayBtn_no").attr("class", "com_selectbtn");
        $("#payDiv").show("normal");
        $("#payBtn").html("支付");
    } else {
        isPay = false;
        $("#choosePayBtn_no").attr("class", "com_selectbtn com_selectbtnon");
        $("#choosePayBtn_yes").attr("class", "com_selectbtn");
        $("#payDiv").hide("normal");
        $("#payBtn").html("完成");
    }
}

/**
 * 点用户点击 【支付】 按钮时支付订单
 */
function payOrder() {
    if (!isPay) {
        mask("您选择了暂不支付，3秒后将自动跳转到订单列表页面.....");
        setTimeout(function() {
            unmask();
            window.location.href = '#/orders';
        }, 3000);
    } else {
        var pay_pwd = $("#password").val();
        if (pay_pwd != "") {
            mask("正在支付中，请稍后……");
            var params = {
                "orderId": orderId,
                "pay_pwd": pay_pwd
            };
            myHttp.post("!ESale/Mall/Order/~java/Order.payOrder", params, function(data) {
                unmask();
                if (data.header.code == 0) {
                    mask("支付成功！3秒后将自动跳转到订单列表页面....");
                    setTimeout(function() {
                        unmask();
                        window.location.href = '#/orders';
                    }, 3000);
                } else {
                    alert(data.header.message);
                }
            });
        } else {
            alert('请输入支付密码');
        }
    }
}
