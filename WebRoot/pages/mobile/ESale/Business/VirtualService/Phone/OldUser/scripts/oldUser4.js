var imgData = {
    "front": '',
    'contrary': '',
    'hand': ''
};
var myPhoto = {};
app.registerCtrl("OldUser4Ctrl", ["$scope", "$srhttp", "$rootScope",
    function($scope, $srhttp, $rootScope) {
        $scope.flag_true_false = true;

        $rootScope.appTitle = "老用户";
        replaceClass("home");

        $scope.packageForm = Local.getStoreJson('form');
        $scope.packageForm.jmkfStatus = "0"; //减免：0是，1否
        $scope.packageForm.firstFee = '';
        $scope.packageForm.contractLast = ""; //套餐业务三选一
        //成卡
        if ($scope.packageForm["ckNum"] && $scope.packageForm["ckNum"] != '') {
            $scope.CK_NUMBER = $scope.packageForm.ckNum;
        }

        if (!$scope.packageForm.actiVal) {
            $scope.packageForm.actiVal = $scope.packageForm.policyName;
        }

        if (!$scope.packageForm.first_fee) {
            $scope.packageForm.first_fee = 1;
        }

        $scope.packageForm.is_white = "";

        $scope.ywB = [];
        if ($scope.packageForm.ywB) {
            $scope.ywB = $scope.packageForm.ywB;
        }

        $scope.show = {
            "zhongduancuanhao": true, //终端串号
            "sanxuanyi": false, //套餐业务三选一
        }
        if ($scope.packageForm.actiVal == "存费送费" || $scope.packageForm.actiVal == "存费送业务") {
            $scope.show.zhongduancuanhao = false;
        }
        //配置产品，而且是“存费送业务”，则显示
        if ($scope.packageForm.actiVal == "存费送业务" && $scope.packageForm.goodCus != '1') {
            $scope.show.sanxuanyi = true;
            $scope.packageForm.contractLast = "语音通话";
        }

        //往后台写入信息
        $scope.sendMessage = function(memberId, msg) {
            $srhttp.get("!ESale/System/Base/~java/MessageTrans.sendMessage", {
                distination: memberId,
                param: msg
            }, function(data) {

            })
        }

        $scope.event = {

            //是否减免SIM卡费
            jmkfCheck: function() {
                if ($("#jmkfCheckBox").hasClass("com_checkoxon")) {
                    $("#jmkfCheckBox").removeClass("com_checkoxon");
                    $scope.packageForm.jmkfStatus = "1";
                } else {
                    $("#jmkfCheckBox").addClass("com_checkoxon");
                    $scope.packageForm.jmkfStatus = "0";
                }
            },

            //0. 自定义 1. 按规则配置 2.全月资费3.半月资费4.套外资费
            loadFirstFee: function(first_fee) {
                //openAccountData.firstFee = ""
                $("#first_fee").removeClass("com_selectbtnon");
                if (first_fee == 1) {
                    $scope.event.getConfigFirstFee(function(type, rule) {
                        if (type == 1) {
                            $("#first_fee div:eq(0) a").addClass("com_selectbtnon");
                            $scope.packageForm.firstFee = '全月资费';
                            $scope.flag_true_false = false;

                        } else if (type == 2) {
                            $("#first_fee div:eq(1) a").addClass("com_selectbtnon");
                            $scope.packageForm.firstFee = '半月资费';
                            $scope.flag_true_false = false;

                        } else if (type == 3) {
                            $("#first_fee div:eq(2) a").addClass("com_selectbtnon");
                            $scope.packageForm.firstFee = '套外资费';
                            $scope.flag_true_false = false;

                        }

                        if (rule == "0") {
                            //允许修改并展示；
                            $scope.flag_true_false = true;

                        } else if (rule == "1") {
                            //不允许修改但展示；
                            //$("#first_fee div:eq(1) a").addClass("com_selectbtnon");
                            $scope.flag_true_false = false;

                        } else {
                            //不允许修改并不展示。
                            $("#first_fee_box").hide();
                        }
                    });
                } else if (first_fee == 2) {
                    $("#first_fee div:eq(0) a").addClass("com_selectbtnon");
                    $scope.packageForm.firstFee = '全月资费';
                    $scope.flag_true_false = false;

                } else if (first_fee == 3) {
                    $("#first_fee div:eq(1) a").addClass("com_selectbtnon");
                    $scope.packageForm.firstFee = '半月资费';
                    $scope.flag_true_false = false;

                } else if (first_fee == 4) {
                    $("#first_fee div:eq(2) a").addClass("com_selectbtnon");
                    $scope.packageForm.firstFee = '套外资费';
                    $scope.flag_true_false = false;

                }
            },

            //获取配置的首月资费规则
            getConfigFirstFee: function(fn) {
                $srhttp.post("!System/Core/Member/~java/MemberConfig.get", {
                    business_id: 'ChinaUnicom.Account',
                    service_id: 'TARIFF_CONFIG',
                    group_name: 'THE_FIRST_MONTH_OF_TARIFF'
                }, function(data) {
                    if (data.header.code == 0) {
                        //获取当前时间信息
                        var date = new Date();
                        var day = date.getDate();
                        var hour = date.getHours();
                        var min = date.getMinutes();
                        var dayC, hourC, minC;


                        //套外资费
                        dayC = parseInt(data.body.TARIFF_OUT.substring(0, 2));
                        hourC = parseInt(data.body.TARIFF_OUT.substring(2, 4));
                        minC = parseInt(data.body.TARIFF_OUT.substring(4, 6));
                        if (day >= dayC && hour >= hourC && min >= minC) {
                            fn(3, data.body.NET_TARIFF_RULE);
                            return;
                        }

                        //半月资费
                        dayC = parseInt(data.body.TARIFF_HALF.substring(0, 2));
                        hourC = parseInt(data.body.TARIFF_HALF.substring(2, 4));
                        minC = parseInt(data.body.TARIFF_HALF.substring(4, 6));
                        if (day >= dayC && hour >= hourC && min >= minC) {
                            fn(2, data.body.NET_TARIFF_RULE);
                            return;
                        }

                        //全月资费
                        dayC = parseInt(data.body.TARIFF_ALL.substring(0, 2));
                        hourC = parseInt(data.body.TARIFF_ALL.substring(2, 4));
                        minC = parseInt(data.body.TARIFF_ALL.substring(4, 6));
                        if (day >= dayC && hour >= hourC && min >= minC) {
                            fn(1, data.body.NET_TARIFF_RULE);
                            return;
                        }
                    } else {
                        alert("获取首月资费配置失败");
                    }
                });
            },

            //提交事件
            submit: function() {
                mask();
                /*$scope.form.CUSTOMER_NAME = "林创荣";
                $scope.form.GENDER = "男";
                $scope.form.CERT_ADDRESS = "广东省汕头市";
                $scope.form.CERT_NUMBER = "440947656565657483";
                $scope.form.GOV = "汕头市公安局";
                $scope.form.FROM = "20120982";
                $scope.form.TO = "20203856";
                $scope.form.NATION = "汉族";
                $scope.form.BORN = "1994年10月14日";
                $scope.form.PICTURE = 'fafbghrhfdhdhtr';*/

                $scope.form.ID_PIC_FRONT = imgData.front; //正面照
                $scope.form.ID_PIC_BACK = imgData.contrary; //反面照
                $scope.form.ID_PIC_PEO = imgData.hand; //手持照


                $scope.packageForm.finalFee = parseFloat($scope.form.fee_config) - parseFloat($scope.form.fee_init);
                if (isNaN($scope.packageForm.finalFee)) {
                    alert("预存款格式错误");
                    return;
                }
                if (parseFloat($scope.form.fee_config) < $scope.form.fee_config2) {
                    alert("预存款应大于" + $scope.form.fee_config2);
                    return;
                }

                //判断是否填写完整
                if ($scope.packageForm.firstFee == '' || $scope.packageForm.firstFee == undefined) {
                    alert('请选择首月资费');
                    return;
                }
                if ($scope.form.CERT_NUMBER == "") {
                    alert("请读取身份证");
                    return;
                }
                // if ($scope.show.zhongduancuanhao == true && $scope.TERMINAL_SN == "") {
                //     alert("请输入终端串号");
                //     return;
                // }
                //下面这个if是永远不会成立的
                /*if ($scope.packageForm["numBusId"].indexOf('CK') > 0) {
                    if ($scope.CK_NUMBER == "" || $scope.CK_NUMBER == undefined) {
                        alert("请填写成卡卡号");
                        return;
                    }
                }*/
                if ($scope.form.CONTACTNUMBER == "" || $scope.form.CONTACTNUMBER == undefined) {
                    alert("请输入联系电话");
                    return;
                }
                // if ($scope.form.NOTE.length > 100) {
                //     alert("备注请不要超过100个字符，已超出" + ($scope.form.NOTE.length - 100) + "个字符");
                //     return;
                // }

                //生成身份证ID
                $scope.IDcardForm = {
                    "name": $scope.form.CUSTOMER_NAME,
                    "gender": $scope.form.GENDER,
                    "paper_addr": $scope.form.CERT_ADDRESS,
                    "paper_num": $scope.form.CERT_NUMBER,
                    "str_office": $scope.form.GOV,
                    "paper_stime": $scope.form.FROM,
                    "paper_time": $scope.form.TO,
                    "nation": $scope.form.NATION,
                    "born": $scope.form.BORN,
                    "picture": $scope.form.PICTURE
                }
                $scope.form.CardID = InsertIDCard($scope.IDcardForm);
                if ($scope.form.CardID == '') {
                    alert("身份证信息提交失败");
                    return;
                }

                //TODO 自定义产品的提单功能，其实就是移网
                if ($scope.packageForm.goodCus == 1) {
                    $scope.event.creatOrder1();
                } else {
                    //配置产品的提单功能
                    $scope.event.creatOrder2();
                }
            },

            //自定义产品的提单
            creatOrder1: function() {
                //获取ESS信息
                var keyid = "PACKAGE_ESS_CODE,PACKAGE_ESS_NAME";
                var PACKAGE_ESS_CODE = "";
                var PACKAGE_ESS_NAME = "";
                $srhttp.post("!ESale/Business/VirtualService/Phone/SimCard/~query/portal/Q_3G4G_DINNER_DETAIL_LIST", {
                    "package_id": $scope.packageForm.packageId,
                    "keyid": keyid
                }, function(data) {
                    if (data.header.code == 0) {
                        if (data.body.rows.length > 0) {
                            PACKAGE_ESS_CODE = data.body.rows[0].VAL;
                            PACKAGE_ESS_NAME = data.body.rows[1].VAL;
                        }
                        //我不知道这些是什么，照抄的
                        var OPEN_ACCOUNT_NAME = "";
                        var POLICY_NAME = "";
                        if ($scope.packageForm.policyName.indexOf("沃享4G") >= 0) {
                            OPEN_ACCOUNT_NAME = "沃享4G";
                        } else {
                            OPEN_ACCOUNT_NAME = $scope.packageForm.openAccountTypeName;
                        }

                        if ($scope.packageForm.policyName.indexOf("沃享4G") >= 0) {
                            POLICY_NAME = "存费送费";
                        } else {
                            POLICY_NAME = $scope.packageForm.policyName;
                        }

                        if ($scope.packageForm.policyName.indexOf("广东本地50") >= 0) {
                            $scope.packageForm.businessId = 'CU.Account.Card'; //广东本地指定这个
                        }

                        //list ,老用户，肯定是numID=''
                        if (!$scope.packageForm["numId"]) {
                            $scope.list = {
                                'list': []
                            };
                        } else {
                            $scope.list = {
                                'list': [{
                                    'goodsId': $scope.packageForm.numId,
                                    'quantity': '1'
                                }]
                            };
                        }
                        //ext
                        $scope.ext = {
                            'ext': {
                                'BUSINESS.INT': [{
                                    'key': 'PHONE_NUMBER',
                                    'val': $scope.packageForm.numTitle,
                                    'key_as': '开户号码'
                                }],
                                'BUSINESS': [{
                                    'key': 'selectProductId',
                                    'val': $scope.packageForm.packageName + $scope.packageForm.contractPlan + $scope.packageForm.firstFee,
                                    'key_as': '产品名称'
                                }, {
                                    'key': 'SIMC_MARK',
                                    'val': $scope.packageForm.jmkfStatus,
                                    'key_as': 'SIMC卡减免'
                                }, {
                                    'key': 'planId',
                                    'val': $scope.packageForm.policyEvent,
                                    'key_as': '套餐活动'
                                }, {
                                    'key': 'ORDER_TYPE',
                                    'val': $scope.packageForm.netName,
                                    'key_as': '开户网络'
                                }, {
                                    'key': 'TELECOM_TYPE',
                                    'val': $scope.packageForm.telecomType,
                                    'key_as': '电信类型'
                                }, {
                                    'key': 'TELECOM_CODE',
                                    'val': $scope.packageForm.telecomCode,
                                    'key_as': '电信类型编码'
                                }, {
                                    'key': 'HANDLE_CARD',
                                    'val': $scope.packageForm.handleCard,
                                    'key_as': '卡处理类型'
                                }, {
                                    'key': 'HANDLE_CODE',
                                    'val': $scope.packageForm.handleCode,
                                    'key_as': '卡处理类型ID'
                                }, {
                                    'key': 'OPEN_ACCOUNT_NAME',
                                    'val': OPEN_ACCOUNT_NAME,
                                    'key_as': '名称'
                                }, {
                                    'key': 'package_name',
                                    'val': $scope.packageForm.packageName + $scope.packageForm.contractPlan + $scope.packageForm.packagePlan,
                                    'key_as': '套餐名称'
                                }, {
                                    'key': 'package_id',
                                    'val': $scope.packageForm.contractPlanId + $scope.packageForm.packagePlanId,
                                    'key_as': '套餐ID'
                                }, {
                                    'key': 'POLICY_ID',
                                    'val': $scope.packageForm.policyId,
                                    'key_as': '政策id'
                                }, {
                                    'key': 'BARAND_ID',
                                    'val': $scope.packageForm.pinPaiId,
                                    'key_as': '品牌id'
                                }, {
                                    'key': 'AREA_ID',
                                    'val': $scope.packageForm.areaId,
                                    'key_as': '地区id'
                                }, {
                                    'key': 'POLICY_NAME',
                                    'val': POLICY_NAME,
                                    'key_as': '政策'
                                }, {
                                    'key': 'BRAND_NAME',
                                    'val': $scope.packageForm.pinPaiName,
                                    'key_as': '品牌'
                                }, {
                                    'key': 'NOTE',
                                    'val': $scope.packageForm.NOTE,
                                    'key_as': '备注'
                                }, {
                                    'key': 'AREA_NAME',
                                    'val': $scope.packageForm.areaName,
                                    'key_as': '地区'
                                }, {
                                    'key': 'TERMINAL_SN',
                                    'val': $scope.packageForm.TERMINAL_SN,
                                    'key_as': '终端串号'
                                }, {
                                    'key': 'deviceno',
                                    'val': $scope.packageForm.DEVICENO,
                                    'key_as': '终端机型编码'
                                }, {
                                    'key': 'POLICY_GOOD',
                                    'val': $scope.packageForm.policyId_4G,
                                    'key_as': '4G政策id'
                                }, {
                                    'key': 'POLICY_GOOD_NAME',
                                    'val': $scope.packageForm.policyName_4G,
                                    'key_as': '4G政策名称'
                                }, {
                                    'key': 'PLANITEMCHOOSE',
                                    'val': $scope.packageForm.contractLast,
                                    'key_as': '套餐项目'
                                }, {
                                    'key': 'PERIODS',
                                    'val': $scope.packageForm.contract,
                                    'key_as': '合约期数'
                                }, {
                                    'key': 'CardID',
                                    'val': $scope.form.CardID,
                                    'key_as': '身份证ID'
                                }, {
                                    'key': 'PACKAGE_ESS_NAME',
                                    'val': PACKAGE_ESS_NAME,
                                    'key_as': 'ESS套餐名称'
                                }, {
                                    'key': 'PACKAGE_ESS_CODE',
                                    'val': PACKAGE_ESS_CODE,
                                    'key_as': 'ESS套餐ID'
                                }, {
                                    'key': 'CARDNUMBER',
                                    'val': $scope.CK_NUMBER,
                                    'key_as': '成卡卡号'
                                }, {
                                    'key': 'FIRST_MONTH_FEE_NAME',
                                    'val': $scope.packageForm.firstFee,
                                    'key_as': '首月支付类型'
                                }, {
                                    'key': 'FIRST_MONTH_FEE',
                                    'val': '',
                                    'key_as': '首月支付类型ID'
                                }],
                                'BASE': [{
                                    'key': 'CUSTOMER_NAME',
                                    'val': $scope.form.CUSTOMER_NAME,
                                    'key_as': '客户姓名'
                                }, {
                                    'key': 'CERT_ADDRESS',
                                    'val': $scope.form.CERT_ADDRESS,
                                    'key_as': '证件地址'
                                }, {
                                    'key': 'CONTACT_MAN',
                                    'val': $scope.form.CUSTOMER_NAME,
                                    'key_as': '联系人'
                                }, {
                                    'key': 'CONTACT_PHONE',
                                    'val': $scope.form.CONTACTNUMBER,
                                    'key_as': '联系电话'
                                }, {
                                    'key': 'POSTAL_ADDRESS',
                                    'val': $scope.form.CERT_ADDRESS,
                                    'key_as': '通讯地址'
                                }, {
                                    'key': 'GENDER',
                                    'val': $scope.form.GENDER,
                                    'key_as': '性别'
                                }, {
                                    'key': 'NATION',
                                    'val': $scope.form.NATION,
                                    'key_as': '民族'
                                }, {
                                    'key': 'ISS_USING',
                                    'val': $scope.form.GOV,
                                    'key_as': '签发机关'
                                }, {
                                    'key': 'CERT_NUMBER',
                                    'val': $scope.form.CERT_NUMBER,
                                    'key_as': '证件号码'
                                }],
                                'BASE.IMG': [{
                                    'key': 'CARD_PIC',
                                    'val': $scope.packageForm["ckPicId"],
                                    'key_as': '成卡照片'
                                }, {
                                    'key': 'ID_PIC_FRONT',
                                    'val': $scope.form.ID_PIC_FRONT,
                                    'key_as': '身份证正面照片'
                                }, {
                                    'key': 'ID_PIC_BACK',
                                    'val': $scope.form.ID_PIC_BACK,
                                    'key_as': '身份证反面照片'
                                }, {
                                    'key': 'ID_PIC_PEO',
                                    'val': $scope.form.ID_PIC_PEO,
                                    'key_as': '身份证凭证图片'
                                }],
                                'BASE.DATE': [{
                                    'key': 'CERT_VALID_FROM',
                                    'val': $scope.form.FROM.replace("-", "").replace("-", ""),
                                    'key_as': '证件有效期开始'
                                }, {
                                    'key': 'CERT_VALID_TO',
                                    'val': $scope.form.TO.replace("-", "").replace("-", ""),
                                    'key_as': '证件有效期结束'
                                }, {
                                    'key': 'BIRTHDAY',
                                    'val': $scope.form.BORN,
                                    'key_as': '出生日期'
                                }]
                            }
                        }

                        //创建自定义 订单
                        var ppp = "?businessId=" + "ChinaUnicom.GYH";
                        if ($("#surefee").val() != undefined && $("#surefee").val() != "") {
                            ppp += "&surefee=" + $scope.packageForm.surefee;
                        }

                        $srhttp.post("!ESale/Mall/Order/~java/Order.create" + ppp, {
                            "list": JSON.stringify($scope.list),
                            "ext": JSON.stringify($scope.ext)
                        }, function(data) {
                            try {
                                if (data.header.code == 0) {
                                    var devId = data.body["member_id"];
                                    var creatorName = data.body["creator_member_name"];
                                    $scope.sendMessage(devId, creatorName + "的订单已经生成,请注意接收查看");
                                    alert("订单创建成功");
                                    hrefJump('orders');
                                } else {
                                    alert("订单创建失败" + data.header.message);
                                }
                            } catch (e) {
                                alert("出错" + e.message);
                            }
                        });
                    }
                });
            },

            //配置产品的提单
            creatOrder2: function() {
                if ($scope.packageForm.typeVal == undefined) {
                    $scope.packageForm.typeVal = $scope.packageForm.packageName;
                }
                if ($scope.packageForm.typeId == undefined) {
                    $scope.packageForm.typeId = $scope.packageForm.packagePlanId;
                }

                //自定义产品,会不存在这两个参数
                if ($scope.packageForm.nameVal == undefined) {
                    $scope.packageForm.nameVal = '';
                }
                if ($scope.packageForm.planVal == undefined) {
                    $scope.packageForm.planVal = '';
                }

                var prod_name = $scope.packageForm.acti_nameVal;
                if (prod_name == "存120送240") {
                    prod_name = "存120元送240元";
                } else if (prod_name == "存240送480") {
                    prod_name = "存240元送480元";
                }

                //手机终端，如果活动actiVal是存费送费，存费送业务，则为“”，否则为01
                var terminalId = "01";
                if ($scope.packageForm.actiVal == '存费送业务' || $scope.packageForm.actiVal == '存费送费') {
                    terminalId = "";
                }

                //非存费送费，非存费送业务产品
                if (terminalId != '') {
                    prod_name = $scope.packageForm.actiVal + "" + $scope.packageForm.feeVal + "(" + $scope.packageForm.nameVal.replace("套餐", "元套餐") + ")"; //活动名称
                    $scope.packageForm.policyName = $scope.packageForm.actiVal;
                }
                if (terminalId == "" && $scope.packageForm.actiVal != "") {
                    if ($scope.packageForm.actiId == 'CU.CUNFEISONGYEWU') {
                        $scope.packageForm.policyName = "存费送业务";
                    }
                    if ($scope.packageForm.actiId == 'CU.CUNFEISONGFEI') {
                        $scope.packageForm.policyName = "存费送费";
                    }
                }

                //产品的 businessId
                if ($scope.packageForm.actiVal == '存费送业务') {
                    $scope.packageForm.businessId = 'ChinaUnicom.Account.4G.CUNFEISONGYEWU';
                } else if ($scope.packageForm.actiVal == '存费送费') {
                    $scope.packageForm.businessId = 'ChinaUnicom.Account.4G.CUNFEISONGFEI';
                } else if ($scope.packageForm.actiVal == '存费送机') {
                    $scope.packageForm.businessId = 'CU.CUNFEISONGJI';
                } else if ($scope.packageForm.actiVal.indexOf('合约惠机') >= 0) {
                    $scope.packageForm.businessId = 'CU.Account.HYHJ';
                }

                $scope.ext = {
                        'ext': {
                            'BUSINESS.INT': [{
                                'key': 'PHONE_NUMBER',
                                'val': $scope.packageForm.numTitle,
                                'key_as': '开户号码'
                            }],
                            'BUSINESS': [{
                                'key': 'package_name',
                                'val': $scope.packageForm.nameVal, //$scope.packageForm.nameVal == undefined ? $scope.packageForm.openAccountTypeName : $scope.packageForm.nameVal,
                                'key_as': '套餐名称'
                            }, {
                                'key': 'package_id',
                                'val': $scope.packageForm.planId,
                                'key_as': '套餐ID',
                                type: 'HIDDEN'
                            }, {
                                'key': 'PRODUCT_NAME',
                                'val': $scope.packageForm.goodsName,
                                'key_as': '产品名称'
                            }, {
                                'key': 'PRODUCT_ID',
                                'val': $scope.packageForm.goodsId,
                                'key_as': '套餐产品ID',
                                type: 'HIDDEN'
                            }, {
                                'key': 'BARAND_ID',
                                'val': 'CU',
                                'key_as': '品牌id',
                                type: 'HIDDEN'
                            }, {
                                'key': 'selectProductId',
                                'val': $scope.packageForm.nameVal + "" + $scope.packageForm.planVal + "" + $scope.packageForm.firstFee, //修改
                                'key_as': '产品ID'
                            }, {
                                'key': 'prod_name',
                                'val': prod_name, //修改
                                'key_as': '活动名称'
                            }, {
                                'key': 'BRAND_NAME',
                                'val': "中国联通",
                                'key_as': '品牌'
                            }, {
                                'key': 'PLAN_NAME',
                                'val': $scope.packageForm.planVal,
                                'key_as': '计划名称'
                            }, {
                                'key': 'PLAN_ID',
                                'val': $scope.packageForm.typeVal == undefined ? $scope.packageForm.packageType : $scope.packageForm.typeVal,
                                'key_as': '套餐活动'
                            }, {
                                'key': 'ORDER_TYPE',
                                'val': $scope.packageForm.netName,
                                'key_as': '开户网络'
                            }, {
                                'key': 'TELECOM_TYPE',
                                'val': $scope.packageForm.telecomType,
                                'key_as': '电信类型'
                            }, {
                                'key': 'TELECOM_CODE',
                                'val': $scope.packageForm.telecomCode,
                                'key_as': '电信类型编码'
                            }, {
                                'key': 'HANDLE_CARD',
                                'val': $scope.packageForm.handleCard,
                                'key_as': '卡处理类型'
                            }, {
                                'key': 'HANDLE_CODE',
                                'val': $scope.packageForm.handleCode,
                                'key_as': '卡处理类型ID'
                            }, {
                                'key': 'FIRST_MONTH_FEE_NAME',
                                'val': $scope.packageForm.firstFee,
                                'key_as': '首月支付类型'
                            }, {
                                'key': 'CardID',
                                'val': $scope.form.CardID,
                                'key_as': '身份证ID'
                            }, {
                                'key': 'planId',
                                'val': prod_name, //修改
                                'key_as': '产品活动ID',
                                type: 'HIDDEN'
                            }, {
                                'key': 'isalnum',
                                'val': $scope.packageForm.is_white,
                                'key_as': '是否成卡',
                                type: 'HIDDEN'
                            }, {
                                'key': 'CARDNUMBER',
                                'val': $scope.CK_NUMBER,
                                'key_as': '成卡卡号'
                            }, {
                                'key': 'NOTE',
                                'val': $scope.packageForm.NOTE,
                                'key_as': '备注'
                            }, {
                                'key': 'TERMINAL_SN',
                                'val': $scope.packageForm.TERMINAL_SN,
                                'key_as': '终端串号'
                            }, {
                                'key': 'deviceno',
                                'val': $scope.packageForm.DEVICENO,
                                'key_as': '终端机型编码'
                            }, {
                                'key': 'policyEvent',
                                'val': $scope.packageForm.policyEvent,
                                'key_as': '预存款业务'
                            }, {
                                'key': 'policyEventId',
                                'val': $scope.packageForm.policyEventId,
                                'key_as': '预存款业务ID',
                                type: 'HIDDEN'
                            }, {
                                'key': 'policyName',
                                'val': $scope.packageForm.policyEvent,
                                'key_as': '存费业务'
                            }, {
                                'key': 'policyid',
                                'val': $scope.packageForm.policyId,
                                'key_as': '存费业务id',
                                type: 'HIDDEN'
                            }, {
                                'key': 'policyName_4G',
                                'val': $scope.packageForm.policyName_4G,
                                'key_as': '预存款送业务'
                            }, {
                                'key': 'policyId_4G',
                                'val': $scope.packageForm.policyId_4G,
                                'key_as': '预存款送业务ID',
                                type: 'HIDDEN'
                            }, {
                                'key': 'feeNote',
                                'val': $scope.packageForm.feeNote,
                                'key_as': '话费档'
                            }, {
                                'key': 'acti_type_val',
                                'val': $scope.packageForm.actiVal,
                                'key_as': '合约类型'
                            }, {
                                'key': 'acti_type_id',
                                'val': $scope.packageForm.actiId,
                                'key_as': '合约类型ID',
                                type: 'HIDDEN'
                            }, {
                                'key': 'PROD_VOICE',
                                'val': $scope.packageForm.YYB == undefined ? $scope.ywB[1] : $scope.packageForm.YYB,
                                'key_as': '语音包'
                            }, {
                                'key': 'LLB_NAME',
                                'val': $scope.packageForm.LLB == undefined ? $scope.ywB[0] : $scope.packageForm.LLB,
                                'key_as': '流量包'
                            }, {
                                'key': 'DXB_NAME',
                                'val': !$scope.ywB[2] ? '' : $scope.ywB[2],
                                'key_as': '短信包'
                            }, {
                                'key': 'LDB_NAME',
                                'val': !$scope.ywB[3] ? '' : $scope.ywB[3],
                                'key_as': '来电显示包'
                            }, {
                                'key': 'card_fee',
                                'val': $scope.packageForm.card_fee, //修改
                                'key_as': '卡费应收'
                            }, {
                                'key': 'CONTRACT_FEE_LIMIT',
                                'val': $scope.packageForm.finalFee,
                                'key_as': '合约预存款额度'
                            }, {
                                'key': 'CONTRACT_TYPE',
                                'val': $scope.packageForm.feeVal,
                                'key_as': '合约赠送话费'
                            }, {
                                'key': 'device_type',
                                'val': terminalId,
                                'key_as': '手机终端'
                            }, {
                                'key': 'PERIODS',
                                'val': $scope.packageForm.PERIODS ? $scope.packageForm.PERIODS : $scope.packageForm.periods,
                                'key_as': '期数'
                            }, {
                                'key': 'POLICY_ID',
                                'val': $scope.packageForm.actiVal,
                                'key_as': '政策id'
                            }, {
                                'key': 'POLICY_NAME',
                                'val': $scope.packageForm.policyName,
                                'key_as': '政策'
                            }, {
                                'key': 'PLANITEMCHOOSE',
                                'val': $scope.packageForm.contractLast,
                                'key_as': '套餐业务三选一',
                                type: 'HIDDEN'
                            }, {
                                'key': 'SIMC_MARK',
                                'val': 0, //合约产品都有活动，所以传0
                                'key_as': '是否减免费用',
                                type: 'HIDDEN'
                            }, {
                                'key': 'ZFB_NAME',
                                'val': $scope.packageForm.ZFB,
                                'key_as': '赠费包'
                            }, {
                                'key': 'uremark',
                                'val': '',
                                'key_as': '业务备注'
                            }, ],
                            'BASE': [{
                                'key': 'CUSTOMER_NAME',
                                'val': $scope.form.CUSTOMER_NAME,
                                'key_as': '客户姓名'
                            }, {
                                'key': 'CERT_ADDRESS',
                                'val': $scope.form.CERT_ADDRESS,
                                'key_as': '证件地址'
                            }, {
                                'key': 'CONTACT_MAN',
                                'val': $scope.form.CUSTOMER_NAME,
                                'key_as': '联系人'
                            }, {
                                'key': 'ISS_USING',
                                'val': $scope.form.GOV,
                                'key_as': '签发机关'
                            }, {
                                'key': 'CONTACT_PHONE',
                                'val': $scope.form.CONTACTNUMBER,
                                'key_as': '联系电话'
                            }, {
                                'key': 'POSTAL_ADDRESS',
                                'val': $scope.form.CERT_ADDRESS,
                                'key_as': '通讯地址'
                            }, {
                                'key': 'GENDER',
                                'val': $scope.form.GENDER,
                                'key_as': '性别'
                            }, {
                                'key': 'NATION',
                                'val': $scope.form.NATION,
                                'key_as': '民族'
                            }, {
                                'key': 'CERT_NUMBER',
                                'val': $scope.form.CERT_NUMBER,
                                'key_as': '证件号码'
                            }],
                            'BASE.IMG': [{
                                'key': 'ID_PIC_FRONT',
                                'val': $scope.form.ID_PIC_FRONT,
                                'key_as': '身份证正面照片'
                            }, {
                                'key': 'ID_PIC_BACK',
                                'val': $scope.form.ID_PIC_BACK,
                                'key_as': '身份证反面照片'
                            }, {
                                'key': 'ID_PIC_PEO',
                                'val': $scope.form.ID_PIC_PEO,
                                'key_as': '手持照片'
                            }],
                            'BASE.DATE': [{
                                'key': 'CERT_VALID_FROM',
                                'val': $scope.form.FROM,
                                'key_as': '证件有效期开始'
                            }, {
                                'key': 'CERT_VALID_TO',
                                'val': $scope.form.TO,
                                'key_as': '证件有效期结束'
                            }]
                        }
                    }
                    //list 老用户，肯定是numID=''
                if (!$scope.packageForm["numId"]) {
                    $scope.list = {
                        'list': []
                    };
                } else {
                    $scope.list = {
                        'list': [{
                            'goodsId': $scope.packageForm.numId,
                            'quantity': '1'
                        }]
                    };
                }
                $srhttp.post("!ESale/Mall/Order/~java/Order.create", {
                    payStatus: '-1',
                    businessId: "ChinaUnicom.GYH", //写死老用户
                    list: rdcp.json2str($scope.list),
                    ext: rdcp.json2str($scope.ext)
                }, function(data) {
                    if (data.header.code == 0) {
                        var creatorName = data.body["creator_member_name"];
                        var devId = data.body["member_id"];
                        $scope.sendMessage(devId, creatorName + "的订单已经生成,请注意接收查看"); //往后台插入信息

                        alert('订单已生成');
                        hrefJump('orders');
                    } else {
                        alert('订单创建失败！');
                    }
                })
            },

            firstFee: function(obj, type) {
                if ($scope.flag_true_false == false) {
                    return;
                }
                $("#first_fee a").removeClass('com_selectbtnon');
                $(obj.target).addClass("com_selectbtnon");
                $scope.packageForm.firstFee = type;
            },

            //套餐业务三选一
            sanxuanyi: function(obj, value) {
                $(obj.target).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
                $scope.packageForm.contractLast = value;
            },
        }
        $scope.event.loadFirstFee($scope.packageForm.first_fee);

        myPhoto.request = $srhttp.request;
        myPhoto.post = $srhttp.post;
        //存储身份证信息，不可修改，一套模版来的begin
        $scope.form = {
            "CUSTOMER_NAME": "", //客户姓名
            "CERT_NUMBER": "", //证件号码
            "CERT_ADDRESS": "", //证件地址
            "GOV": "", //签发机关
            "GENDER": "男", //性别
            "NATION": "", //民族
            "BORN": "", //出生日期
            "ID_PIC_FRONT": "", //身份证正面照片
            "ID_PIC_BACK": "", //身份证反面照片
            "ID_PIC_PEO": "", //手持照片
            "FROM": "", //证件有效期开始
            "TO": "", //证件有效期结束
            "CardID": "", //身份证ID
            "PICTURE": "", //头像的Base64编码
        }

        console.log("初始值：" + $scope.packageForm.fee_init);
        console.log("最低值：" + $scope.packageForm.fee_config);
        if (!$scope.packageForm.fee_init) {
            $scope.form.fee_init = 0;
        } else {
            $scope.form.fee_init = $scope.packageForm.fee_init;
        }
        if (!$scope.packageForm.fee_config) {
            $scope.form.fee_config = 0;
            $scope.form.fee_config2 = 0;
        } else {
            $scope.form.fee_config = $scope.packageForm.fee_config;
            $scope.form.fee_config2 = $scope.packageForm.fee_config;
        }

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
])
