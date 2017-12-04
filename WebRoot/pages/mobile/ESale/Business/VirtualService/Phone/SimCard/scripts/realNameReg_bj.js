/**
 * Created by sea on 2015/9/21.
 */


var message = "";
//接口返回的状态码对应关系
var resultCodDef = {
    "00000": "实名制成功",
    "00002": "已实名制",
    "01204": "号码不存在",
    "01001": "客户资料不存在",
    "01029": "证件类型输入不合规",
    "01030": "证件号码输入不合规",
    "01028": "客户姓名输入不合规",
    "01031": "证件地址输入不合规",
    "01528": "证件下存在多个客户",
    "01001": "客户信息不存在",
    "01025": "代理商号码不是总部集中渠道登记的有效的手机号码",
    "01027": "系统中存在对应的15位身份证号码",
    "01022": "客户资料输入不合规",
    "01023": "客户下用户超过数量限制",
    "01527": "返档/补登在途不允许办理 ",
    "01529": "返档/补登客户为集团客户 ",
    "08888": "不能修改证件类型 不能修改证件号码 不能修改客户姓名 其它错误 ",
    "00201": "获取网别无数据或者该号码已销号！",
    "01599": "沃盟登记的渠道所在地市和实名登记号码所在的地市不在同一地市"
};
var imgData = {
    "front": '',
    'contrary': '',
    'writeCard': '',
    'hand': ''
};
var myPhoto = {};
app.registerCtrl("realNameReg_bjCtrl", ["$scope", "$srhttp", "$rootScope",
    function($scope, $srhttp, $rootScope) {

        //底部导航样式变化
        setTimeout(function() {
            replaceClass('home');
        }, 100);

        $rootScope.appTitle = "成卡返档";
        myPhoto.request = $srhttp.request;
        $scope.form = {
            "USER_NUMBER": "", //用户号码
            "goodsId": "", //!号码ID+
            "quantity": "1", //！固定的值+
            "PHONE_NUMBER": "", //!选中的手机号码,中文+
            "CardID": "", //身份证ID,这个不是身份证号码，是从数据库读到的ID+
            "NOTE": "", //！备注+

            "CUSTOMER_NAME": "", //！客户姓名+
            "CERT_TYPE": "", //！证件类型ID,访问接口读回来的，!ESale/Business/VirtualService/Phone/SimCard/~query/potal/Q_CERT_TYPE_LIST
            "CERT_TYPE_NAME": "", //！证件类型的中文名称，一般只有身份证，但有可能后期添加一些别的+
            "CERT_ADDRESS": "", //！证件地址+
            "CONTACT_MAN": "", //！联系人，跟客户姓名是一样的+
            "CONTACT_PHONE": "", //！联系电话+
            "ISS_USING": "", //！签发机关+
            "POSTAL_ADDRESS": "", //！通讯地址+
            "GENDER": "男", //！性别+
            "CERT_NUMBER": "", //！证件号码+

            "ID_PIC_FRONT": "", //身份证正面照片+
            "ID_PIC_BACK": "", //身份证反面照片+
            "ID_PIC_PEO": "", //手持照片+

            "CERT_VALID_FROM": "", //！证件有效期开始+
            "CERT_VALID_TO": "", //！证件有效期结束+
            "sureFee": 0, //!价格+
            //"businessId": $scope.d.BUSINESSID.value, //!产品ID,定死的值+

            "CARD_PIC": "", //成卡照片
            "CARDNUMBER": "", //！成卡卡号+
            "productInfo": "", //首月支付类型ID
            "DEVICE_NAME": "" //二合一设备型号
        };
        //加载证件类型数据
        $srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/potal/Q_CERT_TYPE_LIST", {}, function(data) {
            $scope.certs = data;
            $("#cert_type option:eq(0)").attr("selected", "selected"); //默认第一个被选中
        });



        //证件类型选择
        $scope.certTypeChange = function() {
            $scope.form.CERT_TYPE = $("#cert_type option:selected").val();
            $scope.form.CERT_TYPE_NAME = $("#cert_type option:selected").text();
            /*console.log($scope.form.CERT_TYPE);
             console.log($scope.form.CERT_TYPE_NAME);*/
        }


        //性别选择
        $scope.sex_select = function(val) {
            if (val == "男") {
                $("#man").addClass("radiobtnon").siblings().removeClass("radiobtnon");
                $scope.form.GENDER = "男";
            } else {
                $("#woman").addClass("radiobtnon").siblings().removeClass("radiobtnon");
                $scope.form.GENDER = "女";
            }
        }


        //使用系统自带的照相功能上传图片
        $scope.takePhoto = function(type) {

            var sessionId = Local.getStoreJson(sys.loginKey).body.sessionId; //会话id

            $('#progressBar').css("width", "0%").empty().append('0%');
            TakePhoneUpload("{'busiId':'Account','busiType':'APP','size':1000,'_param':'" + type + "','SESSIONID':'" + sessionId + "'}", "print");

        }

        //如果是iphone 则使用js上传的功能
        function changeUploadByTerminal() {
            if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
                $('#new_img_front').hide().prevAll().show();
                $('#new_img_contrary').hide().prevAll().show();
                $('#new_img_hand').hide().prevAll().show();
                $('#new_img_writeCard').hide().prevAll().show();
            }
        }

        changeUploadByTerminal();

        //验证图片识别权限和蓝牙读取权限，成功
        $scope.loadBtnAccess = function() {
            var param = {
                "business_id": "ChinaUnicom.Account",
                "service_id": "REAL_NAME_AUTHENTICATION",
                "group_id": "ID_INFO",
                "code": "ID_CARD_TYPE"
            };
            $srhttp.get("!System/Core/Member/~java/MemberConfig.getConfig", param, function(data) {
                if (data.header.code == "0") {
                    if (data.body.VALUE != undefined && data.body.VALUE != "") {
                        if (data.body.VALUE == "1") { //如果只有图片识别权限
                            $("#btnAccess").val("1");
                            $("#ocrDiv").css("display", "block");
                            $("#frontDiv").css("display", "block");
                            $("#contraryDiv").css("display", "block");
                            $("#bluetoothDiv").css("display", "none");
                        } else if (data.body.VALUE == "2") { //或者如果只有蓝牙读取权限
                            $("#btnAccess").val("2");
                            $("#bluetoothDiv").css("display", "block");
                            $("#ocrDiv").css("display", "none");
                            $("#new_img_front").hide(); //移除拍照事件
                            $("#new_img_contrary").hide();
                            $("#front").hide();
                            $("#contrary").hide();
                            $("#picTitle").text("请使用蓝牙二合一设备读取身份证信息");
                        } else if (data.body.VALUE == "3") { //或者图片识别与蓝牙读取权限都有
                            $("#btnAccess").val("3");
                            $("#ocrDiv").css("display", "block");
                            $("#bluetoothDiv").css("display", "block");
                            $("#frontDiv").css("display", "block");
                            $("#contraryDiv").css("display", "block");
                        } else { //或者其他情况
                            $("#btnAccess").val("1");
                            $("#ocrDiv").css("display", "block");
                            $("#frontDiv").css("display", "block");
                            $("#contraryDiv").css("display", "block");
                        }
                    }
                } else {
                    $("#btnAccess").val("1");
                    $("#ocrDiv").css("display", "block");
                    $("#frontDiv").css("display", "block");
                    $("#contraryDiv").css("display", "block");
                }
            });
        }

        //验证 是否有身份证号码修改权限，成功
        $scope.loadIDcardNumReviseAccess = function() {
            var param = {
                "business_id": "ChinaUnicom.Account",
                "service_id": "REAL_NAME_AUTHENTICATION",
                "group_id": "ID_INFO",
                "code": "ID_CARD_MODIFICATION"
            };
            $srhttp.get("!System/Core/Member/~java/MemberConfig.getConfig", param, function(data) {
                if (data.header.code == "0") {
                    if (data.body.VALUE != undefined && data.body.VALUE != "") {
                        if (data.body.VALUE == "1") { //如果有身份证号码的修改权限
                            $("#cert_number").removeAttr("readonly");
                            $("#customer_name").removeAttr("readonly");
                        } else if (data.body.VALUE == "0") { //如果没有身份证号码的修改权限
                            $("#cert_number").attr("readonly", "readonly");
                            $("#customer_name").attr("readonly", "readonly");
                        }
                    }
                } else {
                    $("#cert_number").attr("readonly", "readonly");
                    $("#customer_name").attr("readonly", "readonly");
                }
            });
        }

        $scope.loadBtnAccess();

        $scope.loadIDcardNumReviseAccess();

        //图片识别1
        $scope.imageShiBie = function() {
            mask("识别中...");
            $scope.ocr();
        }

        //图片识别2
        $scope.ocr = function(obj) {
            if (imgData.front && imgData.contrary)
                $scope.OCR(imgData.front, imgData.contrary); //自动识别
            else {
                unmask();
                alert('请上传身份证正、反面');
            }
        }

        //图片识别3----执行图片解析，判断苹果设备、安卓设备
        $scope.OCR = function(faceImageId, backImageId) {
            if (faceImageId && backImageId) {
                if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
                    var url = "!ESale/System/Ocr/~java/IDCardOCR.request";
                    $srhttp.get(url, {
                            sync: true,
                            'faceImageId': faceImageId,
                            'backImageId': backImageId,
                            timeout: 60000
                        },
                        function(data) {
                            if (data.header.code == "0") {
                                var d = data.body;
                                $scope.form.CUSTOMER_NAME = d.NAME;
                                $scope.form.CERT_NUMBER = d.CARD_NUM;
                                $scope.form.CERT_ADDRESS = d.ADDRESS;
                                $scope.form.ISS_USING = d.STR_OFFICE;
                                if (d.GENDER == '男') {
                                    $("#man").addClass("radiobtnon");
                                    $("#woman").removeClass("radiobtnon");
                                    $("#gender").val("男").trigger('change');
                                } else {
                                    $("#woman").addClass("radiobtnon");
                                    $("#man").removeClass("radiobtnon");
                                    $("#gender").val("女").trigger('change');
                                }
                                if (d.VALID_TO) {
                                    var year = d.VALID_TO.substring(0, 4) + '';
                                    var month = d.VALID_TO.substring(4, 6) + '';
                                    var day = d.VALID_TO.substring(6, 8) + '';
                                    $scope.form.CERT_VALID_TO = year + "-" + month + "-" + day;
                                }
                                if (d.VALID_FROM) {
                                    var year = d.VALID_FROM.substring(0, 4) + '';
                                    var month = d.VALID_FROM.substring(4, 6) + '';
                                    var day = d.VALID_FROM.substring(6, 8) + '';
                                    $scope.form.CERT_VALID_FROM = year + "-" + month + "-" + day;
                                }

                            } else {
                                alert("识别失败，请上传较为清晰的图片");
                            }
                            unmask();
                        });
                } else {

                    AndroidOcr(function(msg) {
                        if (msg) {
                            //alert(result);
                            console.log('AndroidOcr>>>>>>>' + msg);
                            var result = JSON.parse(msg);
                            console.log('AndroidOcr>>>>>>>' + result['姓名']);


                            $scope.$apply(function() {
                                $scope.form.CUSTOMER_NAME = result['姓名'];
                                $scope.form.CERT_NUMBER = result['公民身份号码'];
                                $scope.form.CERT_ADDRESS = result['住址'];
                                $scope.form.ISS_USING = result['签发机关'];
                                if (result['性别'] == '男') {
                                    $("#man").addClass("radiobtnon");
                                    $("#woman").removeClass("radiobtnon");
                                    $("#gender").val("男").trigger('change');
                                } else {
                                    $("#woman").addClass("radiobtnon");
                                    $("#man").removeClass("radiobtnon");
                                    $("#gender").val("女").trigger('change');
                                }
                                if (result['有效期限']) {
                                    var t = result['有效期限'].split('-');
                                    var s = t[0] ? t[0].replace(/\./g, '-') : '';
                                    var e = t[1] ? t[1].replace(/\./g, '-') : '';
                                    $scope.form.CERT_VALID_FROM = s;
                                    $scope.form.CERT_VALID_TO = e;
                                }
                            });
                        } else {
                            alert('未获取到识别信息');
                        }
                        unmask();
                    });
                }
            } else {
                alert('识别错误，请重新拍照识别');
                unmask();
            }
        };
        //检验号码11位
        $scope.checkMobile = function(str) {
                var re = /^1\d{10}$/;
                return re.test(str);
            }
            //提交按钮事件
        $scope.submit = function() {
            console.log($scope.form.GENDER);
            //首先为证件类型赋值
            $scope.form.CERT_TYPE = $("#cert_type option:selected").val();
            $scope.form.CERT_TYPE_NAME = $("#cert_type option:selected").text();

            //$scope.form.CARDNUMBER=$scope.form.CARDNUMBER.substr(0,11);//成卡卡号
            //$scope.form.CONTACT_PHONE=$scope.form.CONTACT_PHONE.substr(0,11);//联系电话

            //判断表单数据是否为空等情况
            if ($scope.form.USER_NUMBER == "") {
                alert("请输入用户号码");
                return;
            }
            if (!$scope.checkMobile($scope.form.USER_NUMBER)) {
                alert('用户号码格式不正确');
                return;
            }
            if (imgData.front == '' || imgData.contrary == '') {
                if ($("#btnAccess").val() == '2') {
                    alert("请先读取身份证");
                    return;
                }
                alert('请上传身份证照片');
                return;
            }
            if ($scope.form.CUSTOMER_NAME == "") {
                alert("请输入客户名称");
                return;
            }
            if ($scope.form.ISS_USING == "" || $scope.form.CERT_ADDRESS == "" || $scope.form.CERT_VALID_TO == "" || $scope.form.CERT_VALID_FROM == "") {
                alert("请重新读取身份证信息");
                return;
            }
            if ($scope.form.CONTACT_PHONE == "") {
                alert("请输入联系电话");
                return;
            }
            if (!$scope.checkMobile($scope.form.CONTACT_PHONE)) {
                alert("联系电话格式不正确");
                return;
            }
            if ($scope.form.POSTAL_ADDRESS == "") {
                alert("请输入通讯地址");
                return;
            }


            //生成身份证ID
            $scope.cardForm = {
                "name": $scope.form.CUSTOMER_NAME,
                "gender": $scope.form.GENDER,
                "paper_addr": $scope.form.CERT_ADDRESS,
                "paper_num": $scope.form.CERT_NUMBER,
                "str_office": $scope.form.ISS_USING,
                "paper_stime": $scope.form.CERT_VALID_FROM,
                "paper_time": $scope.form.CERT_VALID_TO
            }
            $scope.form.CardID = InsertIDCard($scope.cardForm); //方法来源来simCard.js，后修改为在本js文件底部

            //alert("生成身份证ID：CardID成功");

            //为照片赋值
            $scope.form.ID_PIC_FRONT = imgData.front;
            $scope.form.ID_PIC_BACK = imgData.contrary;
            $scope.form.ID_PIC_PEO = imgData.hand; //没传则为空
            $scope.form.CARD_PIC = imgData.writeCard; //没传则为空

            /*window.native.toast("goodsId："+$scope.form.goodsId);
             window.native.toast("PHONE_NUMBER："+$scope.form.PHONE_NUMBER);
             window.native.toast("package_name："+$scope.form.package_name);
             window.native.toast("package_id："+$scope.form.package_id);
             window.native.toast("PACKAGE_ESS_NAME："+$scope.form.PACKAGE_ESS_NAME);
             window.native.toast("POLICY_NAME："+$scope.form.PACKAGE_ESS_CODE);
             window.native.toast("FIRST_MONTH_FEE_NAME："+$scope.form.FIRST_MONTH_FEE_NAME);
             window.native.toast("INMINUSPACKAGES："+$scope.form.INMINUSPACKAGES);
             window.native.toast("INFLOWPACKAGES："+$scope.form.INFLOWPACKAGES);
             window.native.toast("INSMSPACKAGES："+$scope.form.INSMSPACKAGES);
             window.native.toast("INCALLPACKAGES："+$scope.form.INCALLPACKAGES);
             window.native.toast("CardID："+$scope.form.CardID);//
             window.native.toast("NOTE："+$scope.form.NOTE);

             window.native.toast("CUSTOMER_NAME："+$scope.form.CUSTOMER_NAME);
             window.native.toast("CERT_TYPE："+$scope.form.CERT_TYPE);
             window.native.toast("CERT_TYPE_NAME："+$scope.form.CERT_TYPE_NAME);
             window.native.toast("CERT_ADDRESS："+$scope.form.CERT_ADDRESS);
             window.native.toast("CONTACT_MAN："+$scope.form.CUSTOMER_NAME);//联系人，等同于客户名
             window.native.toast("CONTACT_PHONE："+$scope.form.CONTACT_PHONE);
             window.native.toast("ISS_USING："+$scope.form.ISS_USING);
             window.native.toast("POSTAL_ADDRESS："+$scope.form.POSTAL_ADDRESS);
             window.native.toast("GENDER："+$scope.form.GENDER);
             window.native.toast("CERT_NUMBER："+$scope.form.CERT_NUMBER);

             window.native.toast("CERT_VALID_FROM："+$scope.form.CERT_VALID_FROM);
             window.native.toast("CERT_VALID_TO："+$scope.form.CERT_VALID_TO);

             window.native.toast("ID_PIC_FRONT："+$scope.form.ID_PIC_FRONT);
             window.native.toast("ID_PIC_BACK："+$scope.form.ID_PIC_BACK);
             window.native.toast("ID_PIC_PEO："+$scope.form.ID_PIC_PEO);
             window.native.toast("CARD_PIC："+$scope.form.CARD_PIC);*/
            //校验联通手机号，成功号码，则开始提交
            var $mynumber = $scope.form.USER_NUMBER;

            $scope.checkIsChinaUnicom($mynumber);
            //获取创建订单所需要的参数，同时开始创建订单


        }

        /**
         * 校验手机号码是否是正确的号码，如果是，则继续流程
         */
        $scope.checkIsChinaUnicom = function(mynumber) {
                mask("请稍后,正在校验当前号码是否有效....");

                var numberPrefix = (mynumber + "").substring(0, 3);
                var url = "!ESale/Business/VirtualService/Phone/RealName/~query/Q_NUMBER_PREFIX";
                var params = {
                    "type": "CU"
                };

                $srhttp.get(url, params, function(data) {
                    try {
                        unmask();
                        var prefix = data.body.rows[0]["VAL"];
                        if (prefix != undefined) {
                            var isCU = false;
                            var prefixs = prefix.split(',');
                            $.each(prefixs, function(n, value) {
                                if (numberPrefix == value) {
                                    isCU = true;
                                }
                            });

                            if (isCU) {
                                //开始执行提交订单的相应处理
                                $scope.getOrderData();
                            } else {
                                $("#submit").addClass("theme_btn"); //使提交变成橙色
                                alert("请输入中国联通的号码");
                            }
                        } else {
                            $("#submit").addClass("theme_btn"); //使提交变成橙色
                            alert("无法进行实名制，校验号码时出错！");
                        }
                    } catch (err) {
                        $("#submit").addClass("theme_btn"); //使提交变成橙色
                        alert("校验号码出错");
                        return;
                    } finally {

                    }

                });

            }
            //提交订单，接口4
        $scope.getOrderData = function() {
            //提单必须要商品ID，所以尽管这个业务实际上是没有商品的，但是这里也调用接口生成一个虚拟的商品ID
            var goodsId = ""; //虚拟商品ID
            $srhttp.post("!ESale/Mall/Goods/~query/Q_VIRTUAL_GOODS", {
                businessId: "CU.RealName"
            }, function(data) {
                if (data.header.code == '0') {

                    //判断商品是否为空：
                    if (data.body.rows.length > 0) {
                        goodsId = data.body.rows[0]["ID"];
                    }
                    //判断是否取到有效的商品ID
                    if (goodsId == undefined || goodsId == "") {
                        alert("对不起，无法创建订单,请检查是否匹配有实名制业务");
                        $("#submit").addClass("theme_btn"); //使提交变成橙色
                        return;
                    }

                    //提交订单所需要的参数
                    var result = {};
                    result['list'] = {
                        'list': [{
                            'goodsId': goodsId,
                            'quantity': '1'
                        }]
                    };
                    result['ext'] = {
                        'ext': {
                            'BUSINESS.INT': [{
                                'key': 'PHONE_NUMBER',
                                'val': $scope.form.USER_NUMBER,
                                'key_as': '号码'
                            }],
                            'BUSINESS': [{
                                'key': 'BRAND_NAME',
                                'val': "中国联通",
                                'key_as': '运营商'
                            }, {
                                'key': 'CardID',
                                'val': $scope.form.CardID,
                                'key_as': '身份证ID'
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
                                'val': $scope.form.CONTACT_MAN,
                                'key_as': '联系人'
                            }, {
                                'key': 'CONTACT_PHONE',
                                'val': $scope.form.CONTACT_PHONE,
                                'key_as': '联系电话'
                            }, {
                                'key': 'ISS_USING',
                                'val': $scope.form.ISS_USING,
                                'key_as': '签发机关'
                            }, {
                                'key': 'POSTAL_ADDRESS',
                                'val': $scope.form.POSTAL_ADDRESS,
                                'key_as': '通信地址'
                            }, {
                                'key': 'GENDER',
                                'val': $scope.form.GENDER,
                                'key_as': '性别'
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
                                'key_as': '身份证手持照片'
                            }],
                            'BASE.DATE': [{
                                    'key': 'CERT_VALID_FROM',
                                    'val': $scope.form.CERT_VALID_FROM,
                                    'key_as': '证件有效期开始'
                                }, //证件有效日期开始
                                {
                                    'key': 'CERT_VALID_TO',
                                    'val': $scope.form.CERT_VALID_TO,
                                    'key_as': '证件有效期结束'
                                } //证件有效日期
                            ]
                        }
                    };
                    $scope.form['list'] = result.list;
                    $scope.form['ext'] = result.ext;
                    mask("正在创建订单");
                    //调用创建订单方法
                    $scope.create_order();
                } else {
                    alert("对不起，获取商品信息失败");
                    $("#submit").addClass("theme_btn"); //使提交变成橙色
                }
            });
        }

        //创建订单，接口5
        $scope.create_order = function() {
            $srhttp.post("!ESale/Mall/Order/~java/Order.create", {
                    "list": rdcp.json2str($scope.form['list']),
                    "ext": rdcp.json2str($scope.form['ext']),
                    "businessId": "CU.4G.BACK"
                },
                function(data) {
                    if (data.header.code == 0) {
                        $("#submit").addClass("theme_btn"); //使提交变成橙色
                        var creatorName = data.body["creator_member_name"];
                        var devId = data.body["member_id"];
                        $scope.sendMessage(devId, creatorName + "的订单已经生成,请注意接收查看");
                        alert("提示", "订单创建成功！");
                        //清除数据
                        window.location.href = "#/orders";
                        // $.messager.alert('提示',"订单创建成功！",'info',null);
                    } else {
                        //alert(data.header.message);
                        alert("提示", "订单创建失败！");
                    }
                    $("#submit").addClass("theme_btn"); //使提交变成橙色
                });
        }

        $scope.sendMessage = function(memberId, msg) {
                $srhttp.get("!ESale/System/Base/~java/MessageTrans.sendMessage", {
                    distination: memberId,
                    param: msg
                }, function(data) {
                    if (data.header.code == 0) {
                        //alert(message); //将之前实名的结果显示出来
                    } else {
                        //alert("往后台写入信息失败");
                    }
                })
            }
            //读取SIM信息
        /*$scope.readSIM = function() {
            $scope.form.USER_NUMBER = RwCard.getPhoneNumber();
            // console.log("jjj");
        }*/

    }
]);
//蓝牙读取按钮的点击事件函数
$('#bluetooth_read_btn').on('click', function() {

    check();
});

//蓝牙读取接口的回调方法，将信息填入相应表单，覆盖mobile_framework.js的同名方法
function onReadIDCardFinish(bluetoothInfoStr) {
    unmask();
    if (bluetoothInfoStr != "{}") {
        var bluetoothInfo = $.parseJSON(bluetoothInfoStr);

        //添加身份证读取失败信息获取
        if (bluetoothInfo.result != undefined && bluetoothInfo.result != 0) {
            alert(getReadCardResult(bluetoothInfo.result));

            return;
        }

        $("#customer_name").val(bluetoothInfo.name).trigger('change'); //身份证名字

        //性别
        if (bluetoothInfo.sex == "男") {
            $("#man").addClass("radiobtnon");
            $("#woman").removeClass("radiobtnon");
            $("#gender").val("男").trigger('change');
        } else {
            $("#woman").addClass("radiobtnon");
            $("#man").removeClass("radiobtnon");
            $("#gender").val("女").trigger('change');
        }

        $("#cert_number").val(bluetoothInfo.cardno).trigger('change'); //身份证号码

        var date1 = bluetoothInfo.effecteddate;
        date1 = date1.substring(0, 4) + "-" + date1.substring(4, 6) + "-" + date1.substring(6, 8);
        var date2 = bluetoothInfo.expireddate;
        date2 = date2.substring(0, 4) + "-" + date2.substring(4, 6) + "-" + date2.substring(6, 8);

        $("#cert_valid_from").val(date1).trigger('change'); //身份证有效期的开始时间
        $("#cert_valid_to").val(date2).trigger('change'); //身份证有效期的结束时间
        $("#iss_using").val(bluetoothInfo.issuedat).trigger('change'); //身份证的发证机关
        $("#cert_address").val(bluetoothInfo.address).trigger('change'); //身份证地址
        try {
            $("#device_name").val(bluetoothInfo.DeviceName).trigger('change'); //二合一设备型号
        } catch (err) {
            console.log("设备型号无法读取到");
            $("#device_name").val("").trigger('change');
        }

        //请求合成身份证照片
        mask("正在合成身份证照片，请稍等...");
        myPhoto.request("!ESale/System/IDCard/~java/IDCardImg.create", bluetoothInfo, function(data) {

            if (data.header.code == 0) {
                //正面照，反面照
                imgData["front"] = data.body.cardon;
                imgData["contrary"] = data.body.cardoff;

                var url1 = "!service/file/~java/Downloader.get?type=Thumb&id=" + data.body.cardon; //正面照片
                var url2 = "!service/file/~java/Downloader.get?type=Thumb&id=" + data.body.cardoff; //反面照片

                //为图片的background修改路径
                $("#frontDiv_img").css("background", "url('" + APP_CONFIG.SERVER_URL + url1 + "')");
                $("#contraryDiv_img").css("background", "url('" + APP_CONFIG.SERVER_URL + url2 + "')");

            } else {
                alert("身份证照片合成失败！");
            }
            unmask();
        });
    } else {
        /*if (/android/i.test(navigator.userAgent)) {
            alert('身份证读取失败，请重试');
        }*/
    }
    unmask();
    $("#bluetooth_read_btn").text("蓝牙读取");
    $("#bluetooth_read_btn").removeAttr("disabled");
}

//苹果设备的图片上传功能
function uploadImg(id) {
    mask("文件上传中...");
    var p = {
        'busiId': 'Account',
        'busiType': 'APP',
        'size': '1000'
    };

    mobileUpload({
        id: id,
        form: p, //上传时参数 提交到后台的参数
        url: APP_CONFIG.SERVER_URL + '!service/file/~java/Uploader.upload',
        fileSelected: function(data) { //文件选择后触发

            if (!(id == "writeCard")) {
                $('#progressBar').css("width", "0%");
                document.getElementById('progressBar').innerHTML = '0%';
            }


            //用fileReader请看网上详解 这里这是用于图片预览效果
            var reader = new FileReader();
            reader.onload = function(e) {
                //p.imgDataUrl=this.result;//从这里可以得到本地图片路径 在可以同<img src='this.reuslt'>展示出来
                //                $("#" + id).parent().css("background", "url('" + this.result + "')");//更换背景图片
            }
            reader.readAsDataURL(data.file); //本地读取文件 可以实现预览效果的
            //显示图片信息
            //                document.getElementById('fileName').innerHTML = "名称：" + data.fileName;
            //                document.getElementById('fileSize').innerHTML = "大小：" + data.fileSize;
            //                document.getElementById('fileType').innerHTML = "类型：" + data.fileType;
        },
        uploadProgress: function(evt) { //上传进度
            //下面是结合bootstrap的上传效果  可自己定义
            if (evt.lengthComputable) {

                //如果不是成卡图，则加载进度条
                if (!(id == "writeCard")) {
                    var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                    $('#progressBar').css("width", percentComplete.toString() + "%"); //使用bootstrap滑动条显示上传进度
                    document.getElementById('progressBar').innerHTML = percentComplete.toString() + '%';
                }

            } else {
                document.getElementById('progressBar').innerHTML = 'unable to compute';
            }
        },
        uploadComplete: function(evt) {
            var response = rdcp.str2json(evt.target.responseText)[0];
            imgData[id] = response.id;
            $("#" + id).parent().css("background", "url('" + APP_CONFIG.SERVER_URL + response.thumbURL + "')");
            unmask();
        }
    });
}

/*
 * 读卡号填写在成卡框
 */

function ckCard() {
    $("#flag").val("1");
    var callback = function(msg) {
        if (msg == "") {
            check();
        } else {
            ysb_shade("蓝牙二合一设备正在读取中，请稍后……");
            setTimeout(Reader.ReadCardNo(), 80);
        }
    }
    console.log("asda");
    makecard.isHaveBluetooth(callback, callback, []);
}

function onReadCardFinish(Card) {
    //-1:打开卡失败
    //-3：连接阅读器失败
    if (Card == -3) {
        alert("连接阅读器失败");
        return;
    }
    if (Card == -1) {
        alert("打开卡失败");
        return;
    }
    if (Card != undefined && Card != "") {
        //alert(Card);
        if (Card.substr(0, 2) == "98") {
            unmask();
            Card = Card.replace(/\s/g, "");
            var cardRet = Card.substr(0, 20);
            var cardNum = dealCardNum(cardRet);
            if (cardNum.length != "20") {
                alert("读出卡号有问题，请重试或者人工输入");
                return false;
            }
            cardNum = cardNum.substr(0, 19);
            $("#ckNum").val(cardNum).trigger('change');
        } else {
            unmask();
            var cardNum = Card.substr(0, 20);
            //var cardNum=dealCardNum(cardRet);
            if (cardNum.length != "20") {
                alert("读出卡号有问题，请重试或者人工输入");
                return false;
            }
            cardNum = cardNum.substr(0, 19);
            $("#ckNum").val(cardNum).trigger('change');
        }
        //获取用户号码

        myPhoto.post("!ESale/Mobile/Business/VirtualService/Phone/SimCard/~query/Q_GET_ICCID_NUMBER", {
            'iccid': "" + cardNum
        }, function(data) {
            //alert(data.header.message);
            try {
                if (data.header.code == 0) {
                    $("#user_number").val(data.body.rows[0].NUM).trigger("change");
                } else {
                    alert("未能获取到开户号码，请更换成卡并重新读取！");
                }
            } catch (err) {
                alert("未能获取到开户号码，请更换成卡并重新读取！");
            }
        })
        return true;
    } else {
        unmask();
        alert(Card);
        return false;
    }
}

//生成身份证ID
function InsertIDCard(obj) {
    var result = {};
    result.name = obj.name; //姓名
    result.sex = obj.gender ? (obj.gender == '男' ? '1' : '2') : "1"; //性别
    result.nation = "汉"; //民族
    result.address = obj.paper_addr ? obj.paper_addr : ' '; //地址
    result.cardNo = obj.paper_num ? obj.paper_num : ' '; //身份号码
    result.issuedAt = obj.str_office ? obj.str_office : '无'; //签发机关
    result.effectedDate = obj.paper_stime ? obj.paper_stime.replace(/-/g, '') : ' '; //开始时间
    result.expiredDate = obj.paper_time ? obj.paper_time.replace(/-/g, '') : ' '; //终止有效期
    result.CardReaderId = '0000000000';
    result.ID = "";

    $.ajax({
        type: "post",
        url: APP_CONFIG.SERVER_URL + "!ESale/System/IDCard/~java/IDCardINFO.InsertIDCard?data=" + encodeURIComponent(JSON.stringify(result)),
        //data:result,
        success: function(data) {
            //alert(data);

            data = eval("(" + data + ")");
            if (data.header.code == 0) {
                //alert(data);
                result.ID = data.body.ID;

            } else {
                alert('提示', '储存身份证信息失败');
                return false;
            }
        },
        async: false
    });

    return result.ID;
}

//拍照上传
function OnUploadBegin() {
    mask("正在上传图片中...");
}

//拍照上传图片回调
function OnUploadFinish(result) {

    if (result) {
        result = $.parseJSON(result)[0];
        if (result.id) {

            //如果不是成卡图，则加载进度条
            if (!(result._param == "writeCard")) {
                $('#progressBar').css("width", "100%").empty().append('100%');
            }

            imgData[result._param] = result.id;
            $("#new_img_" + result._param).parent().css("background", "url('" + APP_CONFIG.SERVER_URL + result.thumbURL + "')");
        }
        if (!(result._param == "writeCard")) {
            $("#upload_text").empty().append("图片上传成功");
        }
    } else {
        $("#upload_text").empty().append("图片上传失败!请重新上传...");
    }
    unmask();
}
