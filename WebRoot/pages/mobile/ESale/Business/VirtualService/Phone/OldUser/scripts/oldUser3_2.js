app.registerCtrl("OldUser3_2Ctrl", ["$scope", "$srhttp", "$rootScope",
    function($scope, $srhttp, $rootScope) {

        $scope.cbss = {
            user_cbss_id: "",
            user_cbss_pwd: "",
            user_cbss_dev: "",
            user_cbss_province: "",
            ser_cbss_pwd: ""
        }
        $rootScope.appTitle = "老用户";
        replaceClass("home");
        $scope.form = {};
        $scope.index = 0;
        // $scope.aa = function() {
        //     console.log($scope.cbss.user_cbss_id);
        // }
        $scope.show = {
            "zhongduancuanhao": true //终端串号
        }
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
                            $scope.cbss.user_cbss_pwd = $scope.cbss.user_cbss_pwd;
                            //$scope.cbss.user_cbss_pwd = passwdEncryption($scope.cbss.user_cbss_pwd);

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
        $scope.imei_cbss_check = false; //串号校验结果
        $scope.interface = {
            acti: function() {
                    //因为是从移网跳转到这页面的，所以需要重新获取form
                    $scope.form = Local.getStoreJson('form');
                    $scope.form.actiId = '';
                    $scope.form.actiVal = '';
                    $scope.form.acti_nameId = '';
                    $scope.form.acti_nameVal = '';
                    $scope.form.first_fee = '';
                    $scope.form.typeId = '';
                    $scope.form.typeVal = '';
                    $scope.form.nameId = '';
                    $scope.form.nameVal = '';
                    $scope.form.feeId = '';
                    $scope.form.feeVal = '';
                    $scope.form.first_fee = '';
                    $scope.form.fee_init = '';
                    $scope.form.fee_config = '';
                    $scope.form.planId = '';
                    $scope.form.planVal = '';
                    $scope.form.LLB = '';
                    $scope.form.YYB = '';
                    $scope.form.ZFB = '';
                    $scope.form.PERIODS = '';
                    $scope.form.TERMINAL_SN = ""; //终端串号
                    $scope.form.TerminalBrandName = ""; //终端品牌
                    $scope.form.TerminalModelName = ""; //终端型号
                    $scope.form.TerminalMobileinfo = ""; //终端机型
                    $scope.form.DEVICENO = ""; //终端编码
                    $scope.form.MOBILESALEPRICE = ""; //终端款

                    $srhttp.get('!ESale/Business/VirtualService/Phone/SimCard/~query/new/Q_HY_ACTI_TYPE', {
                        id: $scope.form.goodsId
                    }, function(data) {
                        $scope.acti = data.body.rows;
                        if ($scope.acti.length > 0) {
                            if ($scope.form.actiId == '') {
                                $scope.form.actiId = $scope.acti[0].ID;
                            }
                            if ($scope.form.actiId == "CU.CUNFEISONGFEI" || $scope.form.actiId == "CU.CUNFEISONGYEWU") {
                                $scope.interface.acti_name();
                            } else {
                                $scope.interface.type();
                            }

                        } else {
                            alert('此产品没有套餐可选！');
                        }
                    })
                },

                acti_name: function() {
                    $srhttp.get('!ESale/Business/VirtualService/Phone/SimCard/~query/new/Q_DKHY_ACTI_NAME', {
                        id: $scope.form.goodsId,
                        acti_type: $scope.form.actiId,
                    }, function(data) {
                        $scope.acti_name = data.body.rows;
                        if ($scope.acti_name.length > 0) {
                            if ($scope.form.acti_nameId == '') {
                                $scope.form.acti_nameId = $scope.acti_name[0].ID;
                            }
                            $scope.interface.type();
                        } else {
                            alert('此产品没有套餐可选！');
                        }
                    })
                },
                type: function() {
                    if ($scope.form.actiId == "CU.CUNFEISONGFEI" || $scope.form.actiId == "CU.CUNFEISONGYEWU") {
                        $scope.src = '!ESale/Business/VirtualService/Phone/SimCard/~query/new/Q_DKHY_PACKAGE_TYPE';
                    } else {
                        $scope.src = '!ESale/Business/VirtualService/Phone/SimCard/~query/new/Q_HY_PACKAGE_TYPE';
                    }
                    $srhttp.get($scope.src, {
                        id: $scope.form.goodsId,
                        acti_type: $scope.form.actiId,
                        acti_name: $scope.form.acti_nameId,
                    }, function(data) {
                        $scope.type = data.body.rows;
                        if ($scope.type.length > 0) {
                            if ($scope.form.typeId == '') {
                                $scope.form.typeId = $scope.type[0].ID;
                            }
                            $scope.interface.name();
                        } else {
                            alert('此产品没有套餐可选！');
                        }
                        //$scope.interface.chooseOne();
                    })
                },

                name: function() {
                    if ($scope.form.actiId == "CU.CUNFEISONGFEI" || $scope.form.actiId == "CU.CUNFEISONGYEWU") {
                        $scope.src2 = '!ESale/Business/VirtualService/Phone/SimCard/~query/new/Q_DKHY_PACKAGE_NAME';
                    } else {
                        $scope.src2 = '!ESale/Business/VirtualService/Phone/SimCard/~query/new/Q_HY_PACKAGE_NAME';
                    }
                    $srhttp.get($scope.src2, {
                        id: $scope.form.goodsId,
                        acti_type: $scope.form.actiId,
                        package_type: $scope.form.typeId,
                        acti_name: $scope.form.acti_nameId,
                        //and a.act_name=[acti_name]
                    }, function(data) {
                        $scope.name = data.body.rows;
                        if ($scope.name.length > 0) {
                            if ($scope.form.nameId == '') {
                                $scope.form.nameId = $scope.name[0].ID;
                                /*$scope.form.first_fee = $scope.name[0].FIRST_FEE;
                                $scope.form.LLB = $scope.name[0].LLB;
                                $scope.form.YYB = $scope.name[0].YYB;

                                if ($scope.name[0].ZFB) {
                                    $scope.form.ZFB = $scope.name[0].ZFB;
                                }*/

                            }
                            $scope.interface.fee();
                        } else {
                            alert('此产品没有套餐可选！');
                        }
                        //$scope.interface.chooseOne();
                    })
                },

                fee: function() {
                    $srhttp.get('!ESale/Business/VirtualService/Phone/SimCard/~query/new/Q_HY_FEE', {
                        id: $scope.form.goodsId,
                        acti_type: $scope.form.actiId,
                        package_type: $scope.form.typeId,
                        package_name: $scope.form.nameId
                    }, function(data) {
                        $scope.fee = data.body.rows;
                        if ($scope.fee.length > 0) {
                            $scope.form.feeId = $scope.fee[0].ID;
                            $scope.form.feeVal = $scope.fee[0].NAME;
                            $scope.form.fee_config = $scope.fee[0].FEE;
                            $scope.form.fee_init = $scope.fee[0].FEE_INIT;
                            $scope.form.first_fee = $scope.fee[0].FIRST_FEE;
                            $scope.form.LLB = $scope.fee[0].LLB;
                            $scope.form.YYB = $scope.fee[0].YYB;

                            //console.log("语音包"+$scope.form.YYB);

                            if ($scope.fee[0].ZFB) {
                                $scope.form.ZFB = $scope.fee[0].ZFB;
                            }
                            if ($scope.fee[0].PERIODS) {
                                $scope.form.PERIODS = $scope.fee[0].PERIODS;
                            }
                            $scope.interface.plan();
                        } else {
                            alert('此产品没有套餐可选！');
                        }
                        //$scope.interface.chooseOne();
                    })
                },

                plan: function() {
                    $srhttp.get('!ESale/Business/VirtualService/Phone/SimCard/~query/portal/common/Q_PACKAGE_CONFIG_PLAN', {
                        package_id: $scope.form.nameId
                    }, function(data) {
                        $scope.plan = data.body.rows;
                        if ($scope.plan.length > 0) {
                            if ($scope.form.planId == '')
                                $scope.form.planId = $scope.plan[0].ID;
                            $scope.interface.dinner();
                        } else {
                            alert('此产品没有套餐可选！');
                        }
                        //$scope.interface.chooseOne();
                    })
                },

                dinner: function() {
                    $srhttp.get('!ESale/Business/VirtualService/Phone/SimCard/~query/portal/Q_3G4G_DINNER_DETAIL_LIST', {
                        package_id: $scope.form.planId
                    }, function(data) {
                        $scope.dinner = data.body.rows;
                        if ($scope.dinner.length > 0) {

                        } else {
                            //alert('此产品没有套餐可选！');
                        }
                        $scope.interface.chooseOne();
                    })
                },

                //串号校验
                checkImei: function() {
                    if ($scope.form.TERMINAL_SN == '') {
                        return;
                    }
                    $srhttp.post("!sale/cbss/~java/LoginCbss.checkImei", {
                        "userName": $scope.cbss.user_cbss_id,
                        "password": $scope.cbss.user_cbss_pwd,
                        "imei": $scope.form.TERMINAL_SN,
                        "active_type": $scope.event.getActiTypeCode($scope.form.actiVal),
                        "province": $scope.cbss.user_cbss_province
                    }, function(result) {
                        if (result.header.code == -1) {
                            //网络问题，校验请求失败
                            $scope.imei_cbss_check = false;
                            alert("加载数据出错，请重试");
                        } else if (result.header.code == 1) {
                            //校验不通过，账号密码错
                            $scope.imei_cbss_check = false;
                            alert("系统检测到您设置的ESS/CBSS账号密码错误或密码即将过期，请核实后修改您的CBSS信息以确保您的订单能正常处理");
                        } else if (result.header.code == 0) {
                            //校验账号通过
                            $scope.imei_cbss_check = false;
                        } else if (result.header.code == -2) {
                            //通信消息错误
                            $scope.imei_cbss_check = false;
                            alert("系统出错（-2），请联系管理员");
                        } else if (result.header.code == 7) {
                            //串号校验通过
                            $scope.imei_cbss_check = true;
                            try {
                                if (result.body instanceof Array) {
                                    $('#checkIsArray').css("display", "block");
                                    $scope.terminals = result.body;


                                } else {
                                    $('#checkIsArray').css("display", "none");
                                    $scope.form.TerminalBrandName = result.body.resourcesBrandName; //终端品牌
                                    $scope.form.TerminalModelName = result.body.resourcesModelName; //终端型号
                                    $scope.form.TerminalMobileinfo = result.body.mobileinfo; //终端机型
                                    $scope.form.DEVICENO = result.body.deviceno; //终端编码
                                    $scope.form.MOBILESALEPRICE = result.body.mobilesaleprice; //终端款
                                }
                            } catch (e) {
                                console.log("获取不到终端品牌，型号");
                            }

                        } else if (result.header.code == 8) {
                            //串号检验不通过
                            $scope.imei_cbss_check = false;
                            alert("3GESS返回信息：资源串号不存在");
                        } else if (result.header.code == 9) {
                            //串号检验不通过
                            $scope.imei_cbss_check = false;
                            alert("3GESS返回信息：资源已被占");
                        } else if (result.header.code == 10) {
                            //串号检验不通过
                            $scope.imei_cbss_check = false;
                            alert("3GESS返回信息：资源已售");
                        } else if (result.header.code == 11) {
                            $scope.imei_cbss_check = false;
                            //串号检验不通过(未知的错误，以上三种错误以外的错误)
                            alert("此终端串码不可用");
                        }
                    });
                },
                //选择按钮
                chooseOne: function() {

                    var acti = "a[actiId='" + $scope.form.actiId + "']";
                    $(acti).addClass('com_selectbtnon');
                    $scope.form.actiVal = $('#acti .com_selectbtnon').text();

                    var type = "a[typeId='" + $scope.form.typeId + "']";
                    $(type).addClass('com_selectbtnon');
                    $scope.form.typeVal = $('#type .com_selectbtnon').text();

                    var name = "a[nameId='" + $scope.form.nameId + "']";
                    $(name).addClass('com_selectbtnon');
                    $scope.form.nameVal = $('#name .com_selectbtnon').text();

                    var fee = "a[feeId='" + $scope.form.feeId + "']";
                    $(fee).addClass('com_selectbtnon');
                    $scope.form.feeNote = $('#feeVal .com_selectbtnon').text();

                    $scope.form.feeVal = $('#feeVal .com_selectbtnon').attr("fee_Val");

                    var plan = "a[planId='" + $scope.form.planId + "']";
                    $(plan).addClass('com_selectbtnon');
                    $scope.form.planVal = $('#plan .com_selectbtnon').text();

                    var acti_name = "a[acti_nameId='" + $scope.form.acti_nameId + "']";
                    $(acti_name).addClass('com_selectbtnon');
                    $scope.form.acti_nameVal = $('#acti_name .com_selectbtnon').text();

                    //如果是存费送费，存费送业务，不需要输入终端串号
                    if ($scope.form.actiVal == "存费送费" || $scope.form.actiVal == "存费送业务") {
                        $scope.show.zhongduancuanhao = false;
                    }

                    if ($scope.acti_name) {
                        if ($scope.acti.length == 1 && $scope.type.length == 1 && $scope.acti_name.length == 1 && $scope.name.length == 1 && $scope.fee.length == 1 && $scope.plan.length == 1) {
                            $scope.event.next();
                        }
                    } else {
                        if ($scope.acti.length == 1 && $scope.type.length == 1 && $scope.name.length == 1 && $scope.fee.length == 1 && $scope.plan.length == 1) {
                            $scope.event.next();
                        }
                    }
                }
        }

        $scope.interface.acti();

        $scope.event = {
            next: function() {
                Local.saveStoreJson('form', $scope.form);
                //console.log($scope.form);
                if ($scope.show.zhongduancuanhao == true && $scope.form.TERMINAL_SN == "") {
                    alert("请输入终端串号");
                    return;
                }
                if ($scope.show.zhongduancuanhao == true && $scope.imei_cbss_check == false) {
                    alert("请输入有效的终端串号");
                    return;
                }
                if ($('#checkIsArray').css("display") == "block") {
                    if ($scope.form.TerminalMobileinfo == "") {
                        alert('请选择终端机型');
                        return;
                    };
                }
                if ($scope.form.actiId == '' || $scope.form.actiId == undefined ||
                    $scope.form.typeId == '' || $scope.form.typeId == undefined ||
                    $scope.form.nameVal == '' || $scope.form.nameVal == undefined ||
                    $scope.form.planId == '' || $scope.form.planId == undefined
                ) {
                    alert('套餐还没选择完整！');
                    return;
                }
                location.href = '#/oldUser4';
            },

            btnon: function(obj) {
                $(obj.currentTarget.parentElement).find('a').removeClass('com_selectbtnon');
                $(obj.target).addClass('com_selectbtnon');

                $scope.form.actiVal = $("#acti .com_selectbtnon").text();
                $scope.form.actiId = $("#acti .com_selectbtnon").attr('actiId');

                $scope.form.typeId = $("#type .com_selectbtnon").attr('typeId');
                $scope.form.typeVal = $("#type .com_selectbtnon").text();

                $scope.form.nameId = $("#name .com_selectbtnon").attr('nameId');
                $scope.form.nameVal = $("#name .com_selectbtnon").text();

                $scope.form.planId = $("#plan .com_selectbtnon").attr('planId');
                $scope.form.planVal = $("#plan .com_selectbtnon").text();

                $scope.form.fee_init = $("#feeVal .com_selectbtnon").attr('fee_init');
                $scope.form.fee_config = $("#feeVal .com_selectbtnon").attr('fee_config');

                $scope.form.first_fee = $("#feeVal .com_selectbtnon").attr('first_fee');
                $scope.form.LLB = $("#feeVal .com_selectbtnon").attr('LLB');
                $scope.form.YYB = $("#feeVal .com_selectbtnon").attr('YYB');
                $scope.form.ZFB = $("#feeVal .com_selectbtnon").attr('ZFB');
                $scope.form.PERIODS = $("#feeVal .com_selectbtnon").attr('PERIODS');
            },
            //点击按钮重新调用接口
            acti: function() {
                $scope.form.acti_name = '';
                $scope.form.typeId = '';
                $scope.form.nameId = '';
                $scope.form.feeId = '';
                $scope.form.fee_init = '';
                $scope.form.fee_config = '';
                $scope.form.planId = '';
                //$scope.interface.acti();
                if ($scope.form.actiId == "CU.CUNFEISONGFEI" || $scope.form.actiId == "CU.CUNFEISONGYEWU") {
                    $scope.interface.acti_name();
                } else {
                    $scope.interface.type();
                }
                //console.log($scope.form);
            },
            acti_name: function() {
                $scope.form.typeId = '';
                $scope.form.nameId = '';
                $scope.form.feeId = '';
                $scope.form.fee_init = '';
                $scope.form.fee_config = '';
                $scope.form.planId = '';
                $scope.interface.type();
            },
            type: function() {
                $scope.form.nameId = '';
                $scope.form.feeId = '';
                $scope.form.fee_init = '';
                $scope.form.fee_config = '';
                $scope.form.planId = '';
                //$scope.interface.type();
                $scope.interface.name();
            },
            name: function() {
                $scope.form.feeId = '';
                $scope.form.planId = '';
                $scope.interface.fee();
                $scope.interface.plan();
            },
            plan: function() {
                $scope.interface.dinner();
            },
            fee: function(index) {
                //$scope.interface.fee();
                $scope.index = index;
                $scope.form.feeVal = $('#feeVal .com_selectbtnon').text();
                $scope.form.first_fee = $('#feeVal .com_selectbtnon').attr('first_fee');
            },
            //获取活动类型编码
            getActiTypeCode: function(acti_type) {
                if (acti_type.indexOf("存费送费") != -1)
                    return "CFSF001";
                else if (acti_type.indexOf("存费送业务") != -1)
                    return "ZSYW001";
                else if (acti_type.indexOf("合约惠机B1") != -1)
                    return "HYHJ002";
                else if (acti_type.indexOf("合约惠机B2") != -1)
                    return "HYHJ003";
                else if (acti_type.indexOf("合约惠机C1") != -1)
                    return "HYGJ002";
                else if (acti_type.indexOf("合约惠机C2") != -1)
                    return "HYGJ003";
                else if (acti_type.indexOf("合约惠机C") != -1)
                    return "HYGJ001";
                else if (acti_type.indexOf("合约惠机") != -1)
                    return "HYHJ001";
                else if (acti_type.indexOf("存费送机") != -1)
                    return "YCMP001";
                return "";
            },
            terminal: function(index) {

                $("#terminal_" + index).addClass('com_selectbtnon').parent().siblings().find("a").removeClass('com_selectbtnon');;

                $scope.form.TerminalBrandName = $scope.terminals[index].resourcesBrandName; //终端品牌
                $scope.form.TerminalModelName = $scope.terminals[index].resourcesModelName; //终端型号
                $scope.form.DEVICENO = $scope.terminals[index].deviceno; //终端编码
                $scope.form.TerminalMobileinfo = $scope.terminals[index].mobileinfo; //终端机型
                $scope.form.MOBILESALEPRICE = $scope.terminals[index].mobilesaleprice; //终端款
            }
        }


    }
]);
