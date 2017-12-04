app.registerCtrl("OldUser2Ctrl", ["$scope", "$srhttp", "$rootScope",
    function($scope, $srhttp, $rootScope) {
        $rootScope.appTitle = "老用户";
        replaceClass("home");

        $scope.form = Local.getStoreJson("form");
        $scope.form.numTitle = "";
        //号码校验
        $scope.num_check = false;
        // $scope.fourG = false;
        $scope.otherG = true;
        //存储身份证信息，不可修改，一套模版来的begin
        /* $scope.form = {
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
             }*/
        //电信类型
        $scope.form.telecomTitles = [{
            "name": "GSM(2G)",
            "code": "10"
        }, {
            "name": "WCDMA(3G)",
            "code": "33"
        }, {
            "name": "4G",
            "code": "50"
        }, {
            "name": "OCS(2G)",
            "code": "16"
        }, {
            "name": "OCS(3G)",
            "code": "17"
        }];
        $scope.form.telecomType = "";
        $scope.form.telecomCode = "";
        // 卡处理类型初始化
        $scope.form.handleTitles = [{
            "name": "换卡",
            "code": "0"
        }, {
            "name": "补卡",
            "code": "1"
        }, {
            "name": "不处理",
            "code": "2"
        }];

        $scope.form.handleCard = "";
        $scope.form.handleCode = "";

        $scope.cbss = {
                user_cbss_id: "",
                user_cbss_pwd: "",
                user_cbss_dev: "",
                user_cbss_province: "",
                ser_cbss_pwd: ""
            }
            //获取cbss相关的配置
        setTimeout(function() {
            $scope.CBSS();
        })

        function passwdEncryption(pwd) {
            var hash = b64_sha1(pwd);
            var words = CryptoJS.enc.Base64.parse(hash);
            var base64 = CryptoJS.enc.Base64.stringify(words);
            return base64;
        }
        $scope.CBSS = function() {
                //获取用户配置的CBSS相关信息
                $srhttp.get("!ESale/Business/VirtualService/Phone/SimCard/~query/Q_CBSS_INFO", '', function(data) {
                    if (data.header.code == 0) {
                        if (data.body.rows.length > 0) {
                            if (data.body.rows[0].CBSS_ID != '' || data.body.rows[0].CBSS_PWD != '') {
                                $scope.cbss.user_cbss_id = data.body.rows[0].CBSS_ID;
                                $scope.cbss.user_cbss_pwd = data.body.rows[0].CBSS_PWD;
                                $scope.cbss.user_cbss_dev = data.body.rows[0].CBSS_DEV;
                                $scope.cbss.user_cbss_province = data.body.rows[0].PROVINCE;
                                //$scope.cbss.user_cbss_pwd = passwdEncryption($scope.cbss.user_cbss_pwd);
                                $scope.cbss.user_cbss_pwd = $scope.cbss.user_cbss_pwd;

                                $scope.form.user_cbss_id = $scope.cbss.user_cbss_id;
                                $scope.form.user_cbss_pwd = $scope.cbss.user_cbss_pwd;
                                $scope.form.user_cbss_province = $scope.cbss.user_cbss_province;
                            } else {
                                alert("系统检测到您尚未配置ESS/CBSS信息，请完善相关信息");
                                return;
                            }
                            //$scope.interface.getCbssNumberList();
                            /*$scope.interface.getCbssNumberList($scope.page, $scope.title, function(list) {
                                if (list.length == 0) {
                                    //$("#number_list").html("");
                                    alert("没有更多可用的号码");
                                    return;
                                }
                                $(".com_showmore a.more_btn").text("获取其他号码");
                                $scope.list = list;
                            });*/
                        } else {
                            //理论上代码不会跳进这里
                        }
                    } else {
                        alert("加载信息失败，请刷新页面后重试");
                    }
                });
            }
            // 点击事件
        $scope.event = {
            // 下一步
            next: function() {
                if ($scope.form.numTitle.length != 11 || isNaN($scope.form.numTitle)) {
                    alert("号码格式不正确");
                    return;
                }
                if ($scope.form.telecomType == "") {
                    alert("请选择开户类型");
                    return;
                }
                if ($scope.form.handleCard == "") {
                    alert("请选择卡处理类型");
                    return;
                }

                if ($scope.num_check == false) {
                    alert("请输入正确的老用户号码");
                    return;
                };
                if ($scope.form.goodCus == 1) {
                    $scope.form.buy = 1;
                    $scope.form.hand = 1;
                    Local.saveStoreJson('form', $scope.form);
                    location.href = '#/oldUser3_1';
                } else {
                    //配置产品
                    Local.saveStoreJson('form', $scope.form);
                    location.href = '#/oldUser3_2';
                }
                // $scope.checkCbssNumber($scope.orderList.num);
            },
            // 卡处理事件
            handleCard_select: function(obj) {
                $(obj.target).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
                $scope.form.handleCard = $(obj.target).text();
                $scope.form.handleCode = $(obj.target).attr("handleid");
                console.log($scope.form.handleCode);
            },
            // 电信类型事件
            telecomType_select: function(obj) {
                $(obj.target).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
                $scope.form.telecomType = $(obj.target).text();
                $scope.form.telecomCode = $(obj.target).attr("netid");
                console.log($scope.form.telecomCode);
            },
            //号码校验
            check_NUM: function() {
                if ($scope.form.telecomType == "") {
                    alert("请选择开户类型");
                    return;
                }
                if ($scope.form.numTitle == "") {
                    alert("请填写号码信息");
                    return;
                }

                if ($scope.form.telecomCode == 50) {
                    // $scope.fourG = true;
                    // 移网产品,服务变更接口(4G)
                    $srhttp.post("!sale/cbss/~java/LnLoginCbss.changeElements", {
                        "touchId": "",
                        "serialNumber": $scope.form.numTitle,
                        "netTypeCode": $scope.form.telecomCode,
                        "rightCode": "csChangeServiceTrade",
                        "userName": $scope.cbss.user_cbss_id,
                        "password": $scope.cbss.user_cbss_pwd,
                        "province": $scope.cbss.user_cbss_province,
                    }, function(data) {
                        if (data.header.code != undefined) {
                            if (data.header.code == 23 && data.header.message == "success") {
                                $scope.form.CUSTOMER_NAME = data.body.rows.CUST_NAME;
                                $scope.form.CERT_ADDRESS = data.body.rows.PSPT_ADDR;
                                $scope.form.FROM = data.body.rows.OPEN_DATE;
                                $scope.form.TO = data.body.rows.PSPT_END_DATE;
                                $scope.form.CardID = data.body.rows.PSPT_ID;
                                $scope.form.GENDER = data.body.rows.SEX;
                                $scope.form.PRODUCT_NAME = data.body.rows.PRODUCT_NAME;
                                $scope.num_check = true;
                            } else if (data.header.code == 23 && data.header.message == "error") {
                                $scope.num_check = false;
                                console.log(data.body.rows);
                                alert(data.body.rows);
                            } else if (data.header.code == 23 && data.header.message == "fail") {
                                $scope.num_check = false;
                                alert("网络繁忙,请重试一下");
                            } else if (data.header.code == 1 && data.header.message == "success") {
                                $scope.num_check = false;
                                alert("账号密码错误");
                            } else if (data.header.code == -1 && data.header.message == "success") {
                                $scope.num_check = false;
                                alert("网络异常");
                            }
                        } else {
                            alert("内部异常");
                        }
                    });
                } else {
                    $scope.otherG = false;
                    // 2/3G转4G接口
                    $srhttp.post("!sale/cbss/~java/LnLoginCbss.checkUserInfos", {
                        "SERIAL_NUMBER": $scope.form.numTitle,
                        "NET_TYPE_CODE": $scope.form.telecomCode,
                        "USER_PASSWORD": "",
                        "userName": $scope.cbss.user_cbss_id,
                        "password": $scope.cbss.user_cbss_pwd,
                        "province": $scope.cbss.user_cbss_province,
                    }, function(data) {
                        try {
                            if (data.header.code == 22) {
                                if (data.body.rows != undefined && data.body.rows['ARREARAGE_MESS'] != undefined) {
                                    $scope.num_check = true;
                                    $scope.form.CUSTOMER_NAME = data.body.rows.CUST_NAME;
                                    $scope.form.CardID = data.body.rows.PSPT_ID;
                                    // console.log("成功");
                                } else if (data.body.rows != "") {
                                    $scope.num_check = false;
                                    alert(data.body.rows);
                                } else if (data.body.rows == "") {
                                    $scope.num_check = false;
                                    alert("访问过程出错");
                                };

                            } else if (data.header.code == 1 && data.header.message == "success") {
                                $scope.num_check = false;
                                alert("账号密码错误");
                            } else if (data.header.code == -1 && data.header.message == "success") {
                                $scope.num_check = false;
                                alert("网络异常");
                            } else {
                                alert("校验失败");
                            }
                        }catch(e){
                            alert("校验失败");
                        }
                    })
                }
            }
        }

    }
]);
