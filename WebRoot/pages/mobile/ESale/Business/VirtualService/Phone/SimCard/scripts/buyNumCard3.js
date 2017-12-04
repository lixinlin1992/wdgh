var imgData = {
    "front": '',
    'contrary': '',
    'hand': ''
};

var myPhoto = {};
app.registerCtrl("BuyNumCardCtrl3", ["$scope", "$srhttp", "$rootScope",
    function($scope, $srhttp, $rootScope) {
        $scope.flag_true_false = true;

        $scope.cardForm = Local.getStoreJson("form");
        $scope.cardForm.jmkfStatus = "0"; //减免：0是，1否
        //成卡,如果是自定义，读取了成卡，则本界面不需要手动填成卡
        if ($scope.cardForm["ckNum"] && $scope.cardForm["ckNum"] != '') {
            $scope.CK_NUMBER = $scope.cardForm.ckNum;
        }
        console.log("。。。。。。。。。。。。");
    console.log($scope.cardForm);
        console.log("。。。。。。。。。。。。");
        $scope.ywB = [];
        if ($scope.cardForm.ywB) {
            $scope.ywB = $scope.cardForm.ywB;
        }

        //console.log($scope.cardForm);
        if (!$scope.cardForm.first_fee) {
            $scope.cardForm.first_fee = 1;
        }

        $scope.cardForm.firstFee = '';
        $scope.cardForm.simc = 1;
        $scope.voice = '';
        $scope.flux = '';
        if ($scope.cardForm.packgeVal) {
            $scope.cardForm.typeVal = $scope.cardForm.packgeVal;
            $scope.cardForm.typeId = $scope.cardForm.packgeId;
            $scope.cardForm.nameVal = $scope.cardForm.feeVal;
        }
        //判断白卡bkVal
        if ($scope.cardForm.accountVal) {
            $scope.bkVal = $scope.cardForm.accountVal.indexOf("成卡");
        }
        if ($scope.cardForm.nameVal) {
            if ($scope.cardForm.nameVal.indexOf('语音') > 0)
                $scope.voice = $scope.cardForm.nameVal;
            if ($scope.cardForm.nameVal.indexOf('流量') > 0)
                $scope.flux = $scope.cardForm.nameVal;
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

        $scope.event = {
            //是否减免SIM卡费
            jmkfCheck: function() {
                if ($("#jmkfCheckBox").hasClass("com_checkoxon")) {
                    $("#jmkfCheckBox").removeClass("com_checkoxon");
                    $scope.cardForm.jmkfStatus = "1";
                } else {
                    $("#jmkfCheckBox").addClass("com_checkoxon");
                    $scope.cardForm.jmkfStatus = "0";
                }
            },

            //0. 自定义 1. 按规则配置 2.全月资费3.半月资费4.套外资费
            loadFirstFee: function(first_fee) {

                //openAccountData.firstFee = ""
                $("#first_fee").removeClass("com_selectbtnon");
                //console.log(first_fee);
                if (first_fee == 1) {
                    $scope.event.getConfigFirstFee(function(type, rule) {
                        console.log(type + "-------" + rule);
                        if (type == 1) {
                            $("#first_fee div:eq(0) a").addClass("com_selectbtnon");
                            $scope.cardForm.firstFee = '全月资费';
                            $scope.flag_true_false = false;
                        } else if (type == 2) {
                            $("#first_fee div:eq(1) a").addClass("com_selectbtnon");
                            $scope.cardForm.firstFee = '半月资费';
                            $scope.flag_true_false = false;
                        } else if (type == 3) {
                            $("#first_fee div:eq(2) a").addClass("com_selectbtnon");
                            $scope.cardForm.firstFee = '套外资费';
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
                    $scope.flag_true_false = false;

                    $scope.cardForm.firstFee = '全月资费';
                } else if (first_fee == 3) {
                    $("#first_fee div:eq(1) a").addClass("com_selectbtnon");
                    $scope.flag_true_false = false;
                    $scope.cardForm.firstFee = '半月资费';
                } else if (first_fee == 4) {
                    $("#first_fee div:eq(2) a").addClass("com_selectbtnon");
                    $scope.flag_true_false = false;
                    $scope.cardForm.firstFee = '套外资费';
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
            submit: function() {
                mask();
/*                 $scope.form.CUSTOMER_NAME = "林创荣";
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

                if ($scope.cardForm.nameVal == undefined) {
                    $scope.cardForm.nameVal = $scope.cardForm.packageName;
                }
                if ($scope.cardForm.planVal == undefined) {
                    $scope.cardForm.planVal = $scope.cardForm.packagePlan;
                    if ($scope.cardForm.planVal == undefined) {
                        $scope.cardForm.planVal == '';
                    }
                }
                /* if ($('#binding').attr('display')!='') {};*/
                //判断是否填写完整
                if ($scope.form.CONTACTNUMBER == "" || $scope.form.CONTACTNUMBER == undefined) {
                    alert("请输入联系电话");
                    return;
                }
                if($scope.form.CONTACTNUMBER != ""){
                	var re=/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
    				var b=re.test($scope.form.CONTACTNUMBER);
    				var re1=/\d{3}-\d{8}|\d{4}-\d{7}/;
    				var c=re1.test($scope.form.CONTACTNUMBER);
    				if(b||c){
    				}else{
    					alert("请输入正确的电话号码！");
    					return;
    				};
                }
                if ($scope.form.CERT_NUMBER == "") {
                    alert("请读取身份证");
                    return;
                }
                if ($scope.cardForm.is_white == 0 && $scope.cardForm.dksName != "沃派校园26元套餐") {
                    if ($scope.CK_NUMBER == "" || $scope.CK_NUMBER == undefined) {
                        alert("请填写成卡卡号");
                        return;
                    }
                }
                if ($scope.cardForm.firstFee == '') {
                    alert('请选择首月资费');
                    return;
                }

                //判断发展人内容
                if ($scope.form.DEV_TRUE) {
                    if ($scope.form.DEV_CODE == "") {
                        alert("发展人信息不能为空");
                        return;
                    }
                };
                //湖北的买号卡，特殊的套餐
                if ($scope.cardForm.dksName.indexOf("随意打") != -1 && $scope.cardForm.dksName.indexOf("OCS") != -1) {
                    $scope.cardForm["bussinessCode"] = "HDOCS2";
                    $scope.cardForm["netTypeCode"] = "16";
                    $scope.cardForm["brandCode"] = "GOC1";
                    $scope.cardForm["brandType"] = "HDOCS2";
                    $scope.cardForm.typeVal = $scope.cardForm.dksName;
                } else if ($scope.cardForm.dksName == "沃派校园26元套餐") {
                    $scope.cardForm["bussinessCode"] = "GOCSHDOCS1";
                    $scope.cardForm["netTypeCode"] = "16";
                    $scope.cardForm["brandCode"] = "GOCS";
                    $scope.cardForm["brandType"] = "HDOCS1";
                    $scope.cardForm.typeVal = $scope.cardForm.dksName;
                } else if ($scope.cardForm.dksName.indexOf("2G沃众卡") != -1) {
                    $scope.cardForm["bussinessCode"] = "HDOCS1_WOZONG";
                    $scope.cardForm["netTypeCode"] = "16";
                    $scope.cardForm["brandCode"] = "GOC1";
                    $scope.cardForm["brandType"] = "HDOCS2";
                    $scope.cardForm.typeVal = $scope.cardForm.dksName;
                } else if ($scope.cardForm.dksName.indexOf("2G沃快卡") != -1) {
                    $scope.cardForm["bussinessCode"] = "HDOCS1_WOKUAI";
                    $scope.cardForm["netTypeCode"] = "16";
                    $scope.cardForm["brandCode"] = "GOC1";
                    $scope.cardForm["brandType"] = "HDOCS2";
                    $scope.cardForm.typeVal = $scope.cardForm.dksName;
                }


                //合约预存款额度
                $scope.cardForm.finalFee = parseFloat($scope.cardForm.fee_config) - parseFloat($scope.cardForm.fee_init);
                if (isNaN($scope.cardForm.finalFee)) {
                    alert("预存款格式错误");
                    return;
                }
                if (parseFloat($scope.cardForm.fee_config) < $scope.cardForm.fee_config2) {
                    alert("预存款应大于" + $scope.cardForm.fee_config2);
                    return;
                }

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
                if ($scope.cardForm.is_rele == 1) {
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
                    "package_id": $scope.cardForm.packageId,
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
                        if ($scope.cardForm.policyName.indexOf("沃享4G") >= 0) {
                            OPEN_ACCOUNT_NAME = "沃享4G";
                        } else {
                            OPEN_ACCOUNT_NAME = $scope.cardForm.openAccountTypeName;
                        }

                        if ($scope.cardForm.policyName.indexOf("沃享4G") >= 0) {
                            POLICY_NAME = "存费送费";
                        } else {
                            POLICY_NAME = $scope.cardForm.policyName;
                        }

                        if ($scope.cardForm.policyName.indexOf("广东本地50") >= 0) {
                            $scope.cardForm.busiId = 'CU.Account.Card'; //广东本地指定这个
                        }

                        //list
                        if ($scope.cardForm.numId == '') {
                            $scope.list = {
                                'list': []
                            };
                        } else {
                            $scope.list = {
                                'list': [{
                                    'goodsId': $scope.cardForm.numId,
                                    'quantity': '1'
                                }]
                            };
                        }
                        //ext
                        $scope.ext = {
                            'ext': {
                                'BUSINESS.INT': [{
                                    'key': 'PHONE_NUMBER',
                                    'val': $scope.cardForm.number,
                                    'key_as': '开户号码'
                                }],
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
                                    'key': 'selectProductId',
                                    'val': $scope.cardForm.packageName + $scope.cardForm.contractPlan + $scope.cardForm.firstFee,
                                    'key_as': '产品名称'
                                }, {
                                    'key': 'SIMC_MARK',
                                    'val': $scope.cardForm.jmkfStatus,
                                    'key_as': 'SIMC卡减免'
                                }, {
                                    'key': 'planId',
                                    'val': $scope.cardForm.policyEvent,
                                    'key_as': '套餐活动'
                                }, {
                                    'key': 'ORDER_TYPE',
                                    'val': $scope.cardForm.netName,
                                    'key_as': '开户网络'
                                }, {
                                    'key': 'OPEN_ACCOUNT_NAME',
                                    'val': OPEN_ACCOUNT_NAME,
                                    'key_as': '名称'
                                }, {
                                    'key': 'package_name',
                                    'val': $scope.cardForm.packageName + $scope.cardForm.contractPlan + $scope.cardForm.packagePlan,
                                    'key_as': '套餐名称'
                                }, {
                                    'key': 'package_id',
                                    'val': $scope.cardForm.contractPlanId + $scope.cardForm.packagePlanId,
                                    'key_as': '套餐ID'
                                }, {
                                    'key': 'POLICY_ID',
                                    'val': $scope.cardForm.policyId,
                                    'key_as': '政策id'
                                }, {
                                    'key': 'BARAND_ID',
                                    'val': $scope.cardForm.pinPaiId,
                                    'key_as': '品牌id'
                                }, {
                                    'key': 'AREA_ID',
                                    'val': $scope.cardForm.areaId,
                                    'key_as': '地区id'
                                }, {
                                    'key': 'POLICY_NAME',
                                    'val': POLICY_NAME,
                                    'key_as': '政策'
                                }, {
                                    'key': 'BRAND_NAME',
                                    'val': $scope.cardForm.pinPaiName,
                                    'key_as': '品牌'
                                }, {
                                    'key': 'NOTE',
                                    'val': $scope.form.NOTE,
                                    'key_as': '备注'
                                }, {
                                    'key': 'AREA_NAME',
                                    'val': $scope.cardForm.areaName,
                                    'key_as': '地区'
                                }, {
                                    'key': 'TERMINAL_SN',
                                    'val': '', //买号卡，不会有终端串号
                                    'key_as': '终端串号'
                                }, {
                                    'key': 'POLICY_GOOD',
                                    'val': $scope.cardForm.policyId_4G,
                                    'key_as': '4G政策id'
                                }, {
                                    'key': 'POLICY_GOOD_NAME',
                                    'val': $scope.cardForm.policyName_4G,
                                    'key_as': '4G政策名称'
                                }, {
                                    'key': 'PLANITEMCHOOSE',
                                    'val': $scope.cardForm.contractLast,
                                    'key_as': '套餐项目'
                                }, {
                                    'key': 'PERIODS',
                                    'val': $scope.cardForm.contract,
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
                                    'val': $scope.cardForm.firstFee,
                                    'key_as': '首月支付类型'
                                }, {
                                    'key': 'FIRST_MONTH_FEE',
                                    'val': '',
                                    'key_as': '首月支付类型ID'
                                },{
                                    'key': 'NUMBER_FEE',
                                    'val': $scope.cardForm.feeMoney,
                                    'key_as': '预存话费'
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
                                    'key': 'NOTE',
                                    'val': $scope.form.NOTE,
                                    'key_as': '备注'
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
                                    'val': $scope.cardForm["ckPicId"],
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
                        var ppp = "?businessId=" + $scope.cardForm.busiId;
                        if ($("#surefee").val() != undefined && $("#surefee").val() != "") {
                            ppp += "&surefee=" + $scope.cardForm.surefee;
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
                                    alert("订单创建成功!");
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
                $scope.ext = {
                    'ext': {
                        'BUSINESS.INT': [{
                            'key': 'PHONE_NUMBER',
                            'val': $scope.cardForm.number,
                            'key_as': '开户号码'
                        }],
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
                            'key': 'package_name',
                            'val': $scope.cardForm.nameVal, //如果为undefined，其值等于$scope.cardForm.packageName
                            'key_as': '套餐名称'
                        }, {
                            'key': 'package_id',
                            'val': $scope.cardForm.packagePlanId,
                            'key_as': '套餐ID',
                            type: 'HIDDEN'
                        }, {
                            'key': 'PRODUCT_NAME',
                            'val': $scope.cardForm.dksName,
                            'key_as': '产品名称'
                        }, {
                            'key': 'PRODUCT_ID',
                            'val': $scope.cardForm.dksId,
                            'key_as': '套餐产品ID',
                            type: 'HIDDEN'
                        }, {
                            'key': 'BARAND_ID',
                            'val': 'CU',
                            'key_as': '品牌id',
                            type: 'HIDDEN'
                        }, {
                            'key': 'selectProductId',
                            'val': $scope.cardForm.nameVal + "" + $scope.cardForm.planVal + "" + $scope.cardForm.firstFee, //修改,
                            'key_as': '产品ID'
                        }, {
                            'key': 'prod_name',
                            'val': $scope.cardForm.typeVal,
                            'key_as': '活动名称'
                        }, {
                            'key': 'BRAND_NAME',
                            'val': "中国联通",
                            'key_as': '品牌'
                        }, {
                            'key': 'PLAN_NAME',
                            'val': $scope.cardForm.planVal == undefined ? $scope.cardForm.packagePlan : $scope.cardForm.planVal,
                            'key_as': '计划名称'
                        }, {
                            'key': 'PLAN_ID', //本来是不需要传这个参数的
                            'val': $scope.cardForm.typeVal,
                            'key_as': '套餐活动'
                        }, {
                            'key': 'FIRST_MONTH_FEE_NAME',
                            'val': $scope.cardForm.firstFee,
                            'key_as': '首月支付类型'
                        }, {
                            'key': 'CardID',
                            'val': $scope.form.CardID,
                            'key_as': '身份证ID'
                        }, {
                            'key': 'planId',
                            'val': $scope.cardForm.typeVal,
                            'key_as': '产品活动ID',
                            type: 'HIDDEN'
                        }, {
                            'key': 'isalnum',
                            'val': $scope.cardForm.is_white,
                            'key_as': '是否成卡',
                            type: 'HIDDEN'
                        }, {
                            'key': 'CARDNUMBER',
                            'val': $scope.CK_NUMBER,
                            'key_as': '成卡卡号'
                        }, {
                            'key': 'PROD_VOICE',
                            'val': $scope.cardForm.YYB == undefined ? $scope.ywB[1] : $scope.cardForm.YYB,
                            'key_as': '语音包'
                        }, {
                            'key': 'LLB_NAME',
                            'val': $scope.cardForm.LLB == undefined ? $scope.ywB[0] : $scope.cardForm.LLB,
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
                            'val': $scope.cardForm.card_fee,
                            'key_as': '卡费应收'
                        }, {
                            'key': 'CONTRACT_FEE_LIMIT',
                            'val': $scope.cardForm.finalFee,
                            'key_as': '合约预存款额度'
                        }, {
                            'key': 'CONTRACT_TYPE',
                            'val': '',
                            'key_as': '合约赠送话费'
                        }, {
                            'key': 'device_type',
                            'val': '',
                            'key_as': '手机终端'
                        }, {
                            'key': 'PERIODS',
                            'val': $scope.cardForm.PERIODS,
                            'key_as': '期数'
                        }, {
                            'key': 'POLICY_ID',
                            'val': $scope.cardForm.policyList,
                            'key_as': '政策id'
                        }, {
                            'key': 'POLICY_NAME',
                            'val': $scope.cardForm.policyName,
                            'key_as': '政策'
                        }, {
                            'key': 'PLANITEMCHOOSE',
                            'val': $scope.cardForm.contractLast,
                            'key_as': '套餐业务三选一',
                            type: 'HIDDEN'
                        }, {
                            'key': 'SIMC_MARK',
                            'val': 1,
                            'key_as': '是否减免费用',
                            type: 'HIDDEN'
                        }, {
                            'key': 'TERMINAL_SN',
                            'val': '',
                            'key_as': '终端串号'
                        }, {
                            'key': 'ZFB_NAME',
                            'val': $scope.cardForm.ZFB,
                            'key_as': '赠费包'
                        }, {
                            'key': 'uremark',
                            'val': '',
                            'key_as': '业务备注'
                        }, {
                            'key': 'BUSINESS_CODE',
                            'val': $scope.cardForm.bussinessCode ? $scope.cardForm.bussinessCode : 'ChinaUnicom.Account.3G.CK',
                            'key_as': '流程编码'
                        }, {
                            'key': 'NET_TYPE_CODE',
                            'val': $scope.cardForm.netTypeCode ? $scope.cardForm.netTypeCode : '',
                            'key_as': '网别'
                        }, {
                            'key': 'BRAND_CODE',
                            'val': $scope.cardForm.brandCode ? $scope.cardForm.brandCode : '',
                            'key_as': '号码品牌'
                        }, {
                            'key': 'BRAND_TYPE',
                            'val': $scope.cardForm.brandType ? $scope.cardForm.brandType : '',
                            'key_as': '品牌活动'
                        },{
                            'key': 'NUMBER_FEE',
                            'val': $scope.cardForm.feeMoney,
                            'key_as': '预存话费'
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
                            'key': 'ISS_USING',
                            'val': $scope.form.GOV,
                            'key_as': '签发机关'
                        }, {
                            'key': 'CONTACT_PHONE',
                            'val': $scope.form.CONTACTNUMBER,
                            'key_as': '联系电话'
                        }, {
                            'key': 'NOTE',
                            'val': $scope.form.NOTE,
                            'key_as': '备注'
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

                if ($scope.cardForm.numId == '') {
                    $scope.list = {
                        'list': []
                    };
                } else {
                    $scope.list = {
                        'list': [{
                            'goodsId': $scope.cardForm.numId,
                            'quantity': '1'
                        }]
                    };
                }

                $srhttp.post("!ESale/Mall/Order/~java/Order.create", {
                    payStatus: '-1',
                    businessId: $scope.cardForm.busiId, //订单业务类型 选号的时候可以得到
                    list: rdcp.json2str($scope.list),
                    ext: rdcp.json2str($scope.ext),
                    surefee:($scope.cardForm.feeMoney?$scope.cardForm.feeMoney:0)
                }, function(data) {
                    if (data.header.code == 0) {
                        var creatorName = data.body["creator_member_name"];
                        var devId = data.body["member_id"];
                        $scope.sendMessage(devId, creatorName + "的订单已经生成,请注意接收查看"); //往后台插入信息

                        alert('订单创建成功!!');
                        hrefJump('orders');
                    } else {
                        alert('订单创建失败');
                    }

                });
            },

            firstFee: function(obj, type) {
                if ($scope.flag_true_false == false) {
                    return;
                }
                $("#first_fee a").removeClass('com_selectbtnon');
                $(obj.target).addClass("com_selectbtnon");
                $scope.cardForm.firstFee = type;
                //console.log($scope.cardForm.firstFee);
            },
        }

        //配置产品，才会配置首月资费
        if ($scope.cardForm.is_rele == 0) {
            console.log("$scope.cardForm.first_fee:" + $scope.cardForm.first_fee);
            $scope.event.loadFirstFee($scope.cardForm.first_fee);
        }

        //----读身份证
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
            "DEV_CODE": "", //发展人编码
            "DEV_NAME": "", //发展人名称
            "DEV_PHONE": "", //发展人手机
            "DEV_TRUE": "" //是否有发展人
        }

        console.log("初始值：" + $scope.cardForm.fee_init);
        console.log("最低值：" + $scope.cardForm.fee_config);
        if (!$scope.cardForm.fee_init) {
            $scope.cardForm.fee_init = 0;
        } else {
            $scope.cardForm.fee_init = $scope.cardForm.fee_init;
        }
        if (!$scope.cardForm.fee_config) {
            $scope.cardForm.fee_config = 0;
            $scope.cardForm.fee_config2 = 0;
        } else {
            $scope.cardForm.fee_config = $scope.cardForm.fee_config;
            $scope.cardForm.fee_config2 = $scope.cardForm.fee_config;
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
        $rootScope.appTitle = "买号卡";
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
                    setTimeout(function(){
                        $scope.$apply(function(){
                            $scope.developSelect(0);    
                        });
                       
                    },100);
                    
                    $scope.form.DEV_TRUE = true;
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
])
