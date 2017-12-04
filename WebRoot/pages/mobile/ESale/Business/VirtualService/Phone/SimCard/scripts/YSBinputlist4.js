/**
 * Created by sea on 2015/8/11.
 */
app.registerCtrl("YSBinputlist4Ctrl", ["$scope", "$srhttp", "$rootScope",
    function ($scope, $srhttp, $rootScope) {
    	
    	//底部导航样式变化
		setTimeout(function() {
			replaceClass('home');
		}, 100);

        $rootScope.appTitle="移网开户";
        $scope.orderList = Local.getStoreJson("orderList");//从第三步获得所有orderList数据
        $scope.showOrderInfo = function () {
            if ($scope.orderList.num == "") {
                $("#num_tr").css("display", "none");
            }
            if ($scope.orderList.pinPaiName == "") {
                $("#pinPaiName_tr").css("display", "none");
            }
            if ($scope.orderList.areaName == "") {
                $("#areaName_tr").css("display", "none");
            }
            if ($scope.orderList.netName == "") {
                $("#netName_tr").css("display", "none");
            }
            if ($scope.orderList.openAccountTypeName == "") {
                $("#openAccountTypeName_tr").css("display", "none");
            }
            if ($scope.orderList.firstMonthFeeName == "") {
                $("#firstMonthFeeName_tr").css("display", "none");
            }
            if ($scope.orderList.policyName == "") {
                $("#policyName_tr").css("display", "none");
            }
            if ($scope.orderList.phoneBrand == "") {
                $("#phoneBrand_tr").css("display", "none");
            }
            if ($scope.orderList.phoneModel == "") {
                $("#phoneModel_tr").css("display", "none");
            }
            if ($scope.orderList.policyEvent == "") {
                $("#policyEvent_tr").css("display", "none");
            }
            if ($scope.orderList.contract == "") {
                $("#contract_tr").css("display", "none");
            }
            if ($scope.orderList.contractPackage == "") {
                $("#contractPackage_tr").css("display", "none");
            }
            if ($scope.orderList.contractPlan == "") {
                $("#contractPlan_tr").css("display", "none");
            }
            if ($scope.orderList.packageType == "") {
                $("#packageType_tr").css("display", "none");
            }
            if ($scope.orderList.packageName == "") {
                $("#package_tr").css("display", "none");
            }
            if ($scope.orderList.packagePlan == "") {
                $("#packagePlan_tr").css("display", "none");
            }
            if ($scope.orderList.customName == "") {
                $("#customName_tr").css("display", "none");
            }
            if ($scope.orderList.certNum == "") {
                $("#certNum_tr").css("display", "none");
            }
        }
        $scope.showOrderInfo();
        // $rootScope.$broadcast("submitOrderCtrl");
        //上一步
        $scope.back = function () {
            location.href = "#/YSBinputlist3";
        }
        //提交订单
        $scope.submitOrder = function () {
            $("#backDiv").find("a").addClass("unuse_btn");
            var keyid = "PACKAGE_ESS_CODE,PACKAGE_ESS_NAME";
            var PACKAGE_ESS_CODE = "";
            var PACKAGE_ESS_NAME = "";
            $srhttp.post("!ESale/Business/VirtualService/Phone/SimCard/~query/portal/Q_3G4G_DINNER_DETAIL_LIST",
                {"package_id": $("#packageId").val(), "keyid": keyid}, function (data) {
                    if (data.header.code == 0) {
                        if (data.body.rows.length > 0) {
                            PACKAGE_ESS_CODE = data.body.rows[0].VAL;
                            PACKAGE_ESS_NAME = data.body.rows[1].VAL;
                        }
                        mask("正在提交订单，请稍后");
                    }
                });

            //result.name = obj.name;	//姓名
            //result.sex = obj.gender?(obj.gender=='男'?'1':'2'):"1";	//性别
            //result.nation = "汉";	//民族
            //result.address = obj.paper_addr?obj.paper_addr:' ';	//地址
            //result.cardNo = obj.paper_num?obj.paper_num:' ';	//身份号码
            //result.issuedAt = obj.str_office?obj.str_office:'无';	//签发机关
            //result.effectedDate = obj.paper_stime?obj.paper_stime.replace(/-/g,''):' ';	//开始时间
            //result.expiredDate = obj.paper_time?obj.paper_time.replace(/-/g,''):' ';	//终止有效期
            //result.CardReaderId='0000000000';

            var idCard_param = {
                "name": $scope.orderList.customName,
                "gender": $scope.orderList.sex,
                "paper_addr": $scope.orderList.certAddress,
                "paper_num": $scope.orderList.certNum,
                "str_office": $scope.orderList.issuing,
                "paper_stime": $scope.orderList.certValidFrom,
                "paper_time": $scope.orderList.certValidTo,
                "nation":$scope.orderList.NATION
            };
            var idCard_insert_id = InsertIDCard(idCard_param);
            var OPEN_ACCOUNT_NAME,POLICY_NAME;
            if ($("#policyName").val().trim().indexOf("沃享4G") >= 0) {
                OPEN_ACCOUNT_NAME = "沃享4G";
            } else {
                OPEN_ACCOUNT_NAME = $("#openAccountTypeName").val();
            }
            if($("#policyName").val().trim().indexOf("沃享4G") >= 0){
                POLICY_NAME="存费送费";
            }else{
                POLICY_NAME=$("#policyName").val().trim();
            }
            if($("#policyName").val().trim().indexOf("广东本地50") >= 0){
                $scope.orderList.businessId='CU.Account.Card';//广东本地指定这个

            }

            var list = "{\"list\":[{\"goodsId\":\"" + $("#goodId").val() + "\",\"quantity\":\"1\"}]}";
            var ext = "{\"ext\":" +
                "{\"BUSINESS.INT\":[{\"key\":\"PHONE_NUMBER\",\"val\":\"" + $("#num").val() + "\",\"key_as\":\"号码\"}]," +
                "\"BUSINESS\":" +
                "[{\"key\":\"selectProductId\",\"val\":\"" + $("#packageName").val().trim() + $("#contractPlan").val().trim() + $("#firstMonthFeeName").val().trim() + "\",\"key_as\":\"产品名称\"}," +
                "{\"key\":\"SIMC_MARK\",\"val\":\"" + $("#jmkfStatus").val().trim() + "\",\"key_as\":\"SIMC卡减免\"}," +
                "{\"key\":\"planId\",\"val\":\"" + $("#policyEvent").val().trim() + "\",\"key_as\":\"套餐活动\"}," +
                "{\"key\":\"ORDER_TYPE\",\"val\":\"" + $("#netName").val().trim() + "\",\"key_as\":\"开户网络\"}," +
                "{\"key\":\"OPEN_ACCOUNT_NAME\",\"val\":\"" + OPEN_ACCOUNT_NAME + "\",\"key_as\":\"名称\"}," +
                "{\"key\":\"package_name\",\"val\":\"" + $("#packageName").val().trim() + $("#contractPlan").val().trim() + $("#packagePlan").val().trim() + "\",\"key_as\":\"套餐名称\"}," +
                "{\"key\":\"package_id\",\"val\":\"" + $("#contractPlanId").val().trim() + $("#packagePlanId").val().trim() + "\",\"key_as\":\"套餐ID\"}," +
                "{\"key\":\"POLICY_ID\",\"val\":\"" + $("#policyId").val() + "\",\"key_as\":\"政策id\"}," +
                "{\"key\":\"BARAND_ID\",\"val\":\"" + $("#pinPaiId").val() + "\",\"key_as\":\"品牌id\"}," +
                "{\"key\":\"AREA_ID\",\"val\":\"" + $("#areaId").val() + "\",\"key_as\":\"地区id\"}," +
                "{\"key\":\"POLICY_NAME\",\"val\":\"" + POLICY_NAME + "\",\"key_as\":\"政策\"}," +
            "{\"key\":\"BRAND_NAME\",\"val\":\"" + $("#pinPaiName").val().trim() + "\",\"key_as\":\"品牌\"}," +
            "{\"key\":\"NOTE\",\"val\":\"" + $("#note").val().trim() + "\",\"key_as\":\"备注\"}," +
            "{\"key\":\"AREA_NAME\",\"val\":\"" + $("#areaName").val().trim() + "\",\"key_as\":\"地区\"}," +
            "{\"key\":\"TERMINAL_SN\",\"val\":\"" + $("#iemiNum").val().trim() + "\",\"key_as\":\"终端串号\"}," +
            "{\"key\":\"POLICY_GOOD\",\"val\":\"" + $("#policyId_4G").val().trim() + "\",\"key_as\":\"4G政策id\"}," +
            "{\"key\":\"POLICY_GOOD_NAME\",\"val\":\"" + $("#policyName_4G").val().trim() + "\",\"key_as\":\"4G政策名称\"}," +
            "{\"key\":\"PLANITEMCHOOSE\",\"val\":\"" + $("#contractLast").val().trim() + "\",\"key_as\":\"套餐项目\"}," +
            "{\"key\":\"PERIODS\",\"val\":\"" + $("#contract").val().trim() + "\",\"key_as\":\"合约期数\"}," +
            "{\"key\":\"CardID\",\"val\":\"" + idCard_insert_id + "\",\"key_as\":\"身份证ID\"}," +
            "{\"key\":\"PACKAGE_ESS_NAME\",\"val\":\"" + PACKAGE_ESS_NAME + "\",\"key_as\":\"ESS套餐名称\"}," +
            "{\"key\":\"PACKAGE_ESS_CODE\",\"val\":\"" + PACKAGE_ESS_CODE + "\",\"key_as\":\"ESS套餐ID\"}," +
            "{\"key\":\"CARDNUMBER\",\"val\":\"" + $("#ckNum").val() + "\",\"key_as\":\"成卡卡号\"}," +
            "{\"key\":\"FIRST_MONTH_FEE_NAME\",\"val\":\"" + $("#firstMonthFeeName").val().trim() + "\",\"key_as\":\"首月支付类型\"}," +
            "{\"key\":\"FIRST_MONTH_FEE\",\"val\":\"" + $("#firstMonthFee").val() + "\",\"key_as\":\"首月支付类型ID\"}]," +
            "\"BASE\":" +
            "[{\"key\":\"CUSTOMER_NAME\",\"val\":\"" + $("#customName").val().trim() + "\",\"key_as\":\"客户姓名\"}," +
            "{\"key\":\"CERT_TYPE\",\"val\":\"" + $("#certTypeId").val() + "\",\"key_as\":\"证件类型ID\"}," +
            "{\"key\":\"CERT_TYPE_NAME\",\"val\":\"" + $("#certType").val() + "\",\"key_as\":\"证件类型\"}," +
            "{\"key\":\"CERT_ADDRESS\",\"val\":\"" + $("#certAddress").val() + "\",\"key_as\":\"证件地址\"}," +
            "{\"key\":\"CONTACT_MAN\",\"val\":\"\",\"key_as\":\"联系人\"}," +
            "{\"key\":\"CONTACT_PHONE\",\"val\":\"" + $("#contactPhoneNum").val().trim() + "\",\"key_as\":\"联系电话\"}," +
            "{\"key\":\"POSTAL_ADDRESS\",\"val\":\"" + $("#postalAddress").val().trim() + "\",\"key_as\":\"通讯地址\"}," +
            "{\"key\":\"GENDER\",\"val\":\"" + $("#sex").val() + "\",\"key_as\":\"性别\"}," +
            "{\"key\":\"ISS_USING\",\"val\":\"" + $("#issuing").val() + "\",\"key_as\":\"签发机关\"}," +
            "{\"key\":\"CERT_NUMBER\",\"val\":\"" + $("#certNum").val() + "\",\"key_as\":\"证件号码\"}]," +
            "\"BASE.IMG\":" +
            "[" +
            "{\"key\":\"CARD_PIC\",\"val\":\"" + $("#ckPicId").val() + "\",\"key_as\":\"成卡照片\"}," +
            "{\"key\":\"ID_PIC_FRONT\",\"val\":\"" + $("#frontPicId").val() + "\",\"key_as\":\"身份证正面照片\"}," +
            "{\"key\":\"ID_PIC_PEO\",\"val\":\"" + $("#handPicId").val() + "\",\"key_as\":\"身份证凭证图片\"}," +
            "{\"key\":\"ID_PIC_BACK\",\"val\":\"" + $("#backPicId").val() + "\",\"key_as\":\"身份证反面照片\"}]," +
            "\"BASE.DATE\":" +
            "[{\"key\":\"CERT_VALID_FROM\",\"val\":\"" + $("#certValidFrom").val().replace("-", "").replace("-", "") + "\",\"key_as\":\"证件有效期开始\"}," +
            "{\"key\":\"CERT_VALID_TO\",\"val\":\"" + $("#certValidTo").val().replace("-", "").replace("-", "") + "\",\"key_as\":\"证件有效期结束\"}," +
            "{\"key\":\"BIRTHDAY\",\"val\":\"\",\"key_as\":\"出生日期\"}]}}";

            var ppp = "?businessId=" + $("#businessId").val();
            if ($("#surefee").val() != undefined && $("#surefee").val() != "") {
                ppp += "&surefee=" + $("#surefee").val();
            }

            $("#backDiv").css("display", "none");//隐藏【上一步】与【确认订单】按钮

            $srhttp.post("!ESale/Mall/Order/~java/Order.create" + ppp, {"list": list, "ext": ext},
                function (data) {
                    if (data.header.code != 0) {
                        alert("订单创建失败");
                        $("#backDiv").css("display", "block");//出现【上一步】与【确认订单】按钮
                        return;
                    }
                    if (data.header.code == 0) {
						var creatorName = data.body["creator_member_name"];
                        var id = data.body["id"];
                        var devId = data.body["member_id"];
                        $scope.sendMessage(devId, creatorName + "的订单已经生成,请注意接收查看");
                        mask("订单已成功创建，正在加载支付信息……");
                        var id = data.body["id"];
                        $srhttp.get('!ESale/Mall/Order/~java/Order.getOrder', {orderId: id}, function (data) {
                            mask("订单已成功创建，正在加载支付信息……");
                            if (data.header.code == 0 && data.body.id != undefined && data.body.id != "") {
                                //numeral.language("chs");
                                $("#price").text("￥" + data.body.fee);
                                //各种显示和隐藏
                                $("#alreadySubmitOrder").val("1");
                                $("#payDiv").css("display", "block");//出现【支付】按钮
                                $("#payLayout").css("display", "block");//出现【支付密码】区域
                                $scope.id = id;
                                $("#article").prop('scrollTop', '9999');
                                setTimeout(function () {
                                    $("#CONTAINER").scrollTop(999);
                                    unmask();
                                }, 100);

                            }
                            else {
                                alert("抱歉，获取订单信息失败");
                                $("#backDiv").css("display", "block");//出现【上一步】与【确认订单】按钮
                            }
                        }, {mask: false});
                    }
                    else {
                        alert("抱歉，订单创建异常");
                        $("#backDiv").css("display", "block");//出现【上一步】与【确认订单】按钮
                    }
                });
            $("#backDiv").find("a").removeClass("unuse_btn");
        }
        //支付
        $scope.pay_order = function () {
            var orderId = $scope.id;
            var pay_pwd = $("#passwd").val();
            if (pay_pwd != "") {
                mask("正在支付中，请稍后……");
                $srhttp.get("!ESale/Mall/Order/~java/Order.payOrder", {
                    "orderId": orderId,
                    "pay_pwd": pay_pwd
                }, function (data) {

                    if (data.header.code == 0) {
                        mask("支付成功！3秒后自动跳转");
                        setTimeout(function () {
                            unmask();
                            //清空数据
                            $scope.orderList = {};
                            Local.saveStoreJson("orderList", $scope.orderList);
                            $scope.finish();
                        }, 3000);
                        //alert('支付成功');
                        //finish();
                    } else {
                        alert("提示", '支付失败,' + data.header.message);

                    }
                }, {mask: false});
            } else {
                alert("提示", '请输入支付密码');
            }
            unmask();
        }
        $scope.finish = function () {
            location.href = "#/home";
        }
		//往后台写入信息
        $scope.sendMessage = function(memberId, msg) {
            $srhttp.get("!ESale/System/Base/~java/MessageTrans.sendMessage", {
                distination: memberId,
                param: msg
            }, function(data) {
                if (data.header.code == 0) {
                    //alert("往 后台插入信息成功");
                } else {
                    //alert("处理异常，请稍后重试");
                }
            })
        }
    }
]);


//生成身份证ID
function InsertIDCard(obj) {
    var result = {};
    result.name = obj.name; //姓名
    result.sex = obj.gender ? (obj.gender == '男' ? '1' : '2') : "1"; //性别
    result.nation = obj.nation; //民族
    result.address = obj.paper_addr ? obj.paper_addr : ' '; //地址
    result.cardNo = obj.paper_num ? obj.paper_num : ' '; //身份号码
    result.issuedAt = obj.str_office ? obj.str_office : '无'; //签发机关
    result.effectedDate = obj.paper_stime ? obj.paper_stime.replace(/-/g, '') : ' '; //开始时间
    result.expiredDate = obj.paper_time ? obj.paper_time.replace(/-/g, '') : ' '; //终止有效期
    result.CardReaderId = '0000000000';
    $.ajax({
        type: "post",
        url: APP_CONFIG.SERVER_URL + "!ESale/System/IDCard/~java/IDCardINFO.InsertIDCard?data=" + encodeURIComponent(JSON.stringify(result)),
        //data:result,
        success: function (data) {
            //alert(data);

            data = eval("(" + data + ")");
            if (data.header.code == 0) {
                //alert(data);
                result.ID = data.body.ID;
            } else {
                alert('提示', '储存身份证信息失败');
            }
        },
        async: false
    });
    return result.ID;
}
