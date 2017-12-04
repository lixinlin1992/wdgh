var imgData = {
    "front": '',
    'contrary': '',
    'hand': ''
};

var myPhoto = {}; //存储照片

app.registerCtrl("KuanDai2Ctrl", ["$scope", "$srhttp", "$rootScope", "$sce",
    function($scope, $srhttp, $rootScope, $sce) {
        //底部导航样式变化
        replaceClass('home');

        $rootScope.appTitle = "装宽带";
        myPhoto.request = $srhttp.request;
        myPhoto.post = $srhttp.post;

        //初始化
        $scope.kd_product_object = {};
        $scope.kd_product_object = Local.getStoreJson("kd_product_object");

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
            "DEV_PHONE": "" //发展人手机
        }

        $scope.showMessage = {
            "description": "" //产品说明
        }

        //存储宽带信息，固话信息
        $scope.form2 = {

            "KD_TIAOCE": "", //调试费
            "KD_GONGLIAO": "", //工料费
            "KD_SHOUXU": "", //手续费
            "GH_TIAOCE": "", //调试费
            "GH_GONGLIAO": "", //工料费
            "GH_SHOUXU": "", //手续费

            "area_code": "", //网点区域编码

            "KD_NAME": "", //宽带名
            "KD_NAME_ID": "", //宽带CBSS_ID

            "PACK_ID": "", //宽带产品包ess_id
            "PACK_NAME": "", //宽带产品包名称

            "KD_FEE": "", //宽带产品资费
            "KD_FEE_ID": "", //宽带产品资费ess_id
            "KD_FEE_GUID": "", //宽带产品资费ID

            "KD_SPEED": "", //宽带速率
            "KD_JRLX": "", //

            "KD_ZXFS": "", //执行方式
            "KD_ZXFS_ID": "", //执行方式ID

            "KD_ZXZF": "", //执行资费
            "KD_ZXZF_ID": "", //执行资费ID

            "CITY_CODE": "", //地区编码
            "CITY_NAME": "", //地区名

            "GH_ID": "", //配置好的产品，才会有这个ID
            "GH_NAME": "", //固话产品名称
            "GH_NAME_ID": "", //固话产品ID,来自code=CBSS_ID
            "GH_NUM": "", //固话号码
            "GH_FEE": "", //

            "ADDRESS": "",
            "CONTACT_PHONE": "", //联系电话
            "NOTE": "", //备注
            "GH_INSTALL": "" //0代表新装固话，1代表加装到固话
        }

        $scope.arrays = {
            "kuanDaiName_rows": [], //产品名称
            "kuanDaiPackage_rows": [], //产品包
            "kuanDaiZiFei_rows": [], //产品资费
            "kuanDaiMode_rows": [], //到期执行方式
            "kuanDaiDaoQiZiFei_rows": [], //到期执行资费
            "city_rows": [], //区域
            "guHuaName_rows": [], //固话产品名称
            "guHuaPackage": [], //固话资费包
            "more": [], //固话资费包总体集合=guHuaPackage+guHuaPackage+guHuaPackage
        }

        $scope.show = {
            kuanDaiName: false,
            kuanDaiPackage: false,
            kuanDaiZiFei: false,
            kuanDaiMode: false,
            kuanDaiDaoQiZiFei: false,
            guHuanName: false,
            area: true,

            kd_speed: false,
            kd_jrlx: false
        }

        $scope.selectReplaceClass = function(obj) {
            $(obj.target).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
        }

        $scope.request = {

            //加载网点地市编码
            loadArea: function() {
                $srhttp.get("!ESale/Mall/Member/~java/Member.getMemberArea", {}, function(data) {
                    if (data.header.code == 0) {
                        //获取网点区域
                        $scope.form2.area_code = data.body;
                        //判断是自定义产品
                        if ($scope.kd_product_object.type != '1') {
                            //配置产品
                            $scope.show.kuanDaiName = false;
                            $scope.show.kuanDaiPackage = false;
                            $scope.show.kuanDaiZiFei = false;
                            $scope.show.kuanDaiMode = true;
                            $scope.show.kuanDaiDaoQiZiFei = false;
                            $scope.show.guHuanName = false;
                            //加载宽带到期执行方式
                            $scope.request.loadKuanDaiMode();
                        } else {
                            //自定义产品
                            //先加载速率，接入方式，回调里：加载宽带产品名callback
                            $scope.show.kd_speed = true;
                            $scope.show.kd_jrlx = true;
                            $scope.show.kuanDaiName = true;
                            $scope.request.loadFilter($scope.request.loadKuanDaiName);
                            //$scope.request.loadKuanDaiName();
                        }

                        //区域编码
                        $scope.request.loadCity();

                    }
                });
            },

            //获取增加、减免资费项
            loadFeeItem: function() {
                $srhttp.post("!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_RH_ZIFEI", {
                    "id": $scope.kd_product_object.id
                }, function(data) {
                    if (data.header != undefined && data.header.code == 0) {
                        if (data.body.rows.length > 0) {
                            for (var i = 0; i < data.body.rows.length; i++) {
                                var row = data.body.rows[i];
                                if (row.TYPE == 1) {

                                } else if (row.TYPE == 2) {
                                    if (row.CY == "KD" && row.NAME.indexOf("调试费") != -1)
                                        $scope.form2.KD_TIAOCE = row.FEE + "";
                                    else if (row.CY == "KD" && row.NAME.indexOf("工料费") != -1)
                                        $scope.form2.KD_GONGLIAO = row.FEE + "";
                                    else if (row.CY == "KD" && row.NAME.indexOf("手续费") != -1)
                                        $scope.form2.KD_SHOUXU = row.FEE + "";
                                    else if (row.CY == "GH" && row.NAME.indexOf("调试费") != -1)
                                        $scope.form2.GH_TIAOCE = row.FEE + "";
                                    else if (row.CY == "GH" && row.NAME.indexOf("工料费") != -1)
                                        $scope.form2.GH_GONGLIAO = row.FEE + "";
                                    else if (row.CY == "GH" && row.NAME.indexOf("手续费") != -1)
                                        $scope.form2.GH_SHOUXU = row.FEE + "";
                                }
                            }
                        }
                        //调用产品说明 TODO
                        $scope.request.loadDetail();
                    } else {
                        alert("获取资费项数据失败");
                    }
                });
            },

            //加载固话资费包，前提是配置好的产品
            loadGuHuaPackageFee: function() {
                if ($scope.form2.GH_NAME == "") {
                    console.log("无配置固话信息");
                    return;
                }
                $srhttp.post("!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_GH_PACK_FEE", {
                    "id": $scope.form2.GH_ID
                }, function(data) {
                    $scope.arrays.guHuaPackage = data.body.rows;
                    console.log("配置好的固话资费包：");
                    console.log($scope.arrays.guHuaPackage);
                });
            },

            //加载产品描述,详细信息,这里只能用ajax访问
            loadDetail: function() {
                $.ajax({
                    url: APP_CONFIG.SERVER_URL + "!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_KD_DETAIL",
                    type: "POST",
                    async: true,
                    data: {
                        "id": $scope.kd_product_object.id
                    },
                    dataType: "json",
                    success: function(data) {
                        try {
                            if (data.header.code == 0) {
                                if (data.body.rows.length > 0) {
                                    if ($scope.kd_product_object.type == '1') {
                                        //自定义产品
                                    } else {
                                        //配置好的产品
                                        $scope.form2.KD_NAME = unescape(data.body.rows[0].KD_NAME);
                                        $scope.form2.KD_NAME_ID = unescape(data.body.rows[0].KD_NAME_ID);
                                        $scope.form2.PACK_ID = unescape(data.body.rows[0].PACK_ID);
                                        $scope.form2.PACK_NAME = unescape(data.body.rows[0].PACK_NAME);
                                        $scope.form2.KD_FEE = unescape(data.body.rows[0].ZF_NAME);
                                        $scope.form2.KD_FEE_ID = unescape(data.body.rows[0].ZF_ID);
                                        $scope.form2.KD_SPEED = unescape(data.body.rows[0].SPEED);
                                        $scope.form2.KD_JRLX = unescape(data.body.rows[0].JRLX);
                                        $scope.form2.KD_ZXZF = unescape(data.body.rows[0].ZXZF);
                                        $scope.form2.KD_ZXZF_ID = unescape(data.body.rows[0].ZXZF_ID);
                                        $scope.form2.GH_ID = unescape(data.body.rows[0].GH_ID);
                                        $scope.form2.GH_NAME = unescape(data.body.rows[0].GH_NAME);
                                        $scope.form2.GH_NAME_ID = unescape(data.body.rows[0].GH_NAME_ID);

                                        /*console.log($scope.form2.KD_NAME);
                                        console.log($scope.form2.KD_NAME_ID);
                                        console.log($scope.form2.PACK_ID);
                                        console.log($scope.form2.PACK_NAME);
                                        console.log($scope.form2.KD_FEE);
                                        console.log($scope.form2.KD_FEE_ID);
                                        console.log($scope.form2.KD_SPEED);
                                        console.log($scope.form2.KD_JRLX);
                                        console.log($scope.form2.KD_ZXZF);
                                        console.log($scope.form2.KD_ZXZF_ID);
                                        console.log($scope.form2.GH_ID);
                                        console.log($scope.form2.GH_NAME);
                                        console.log($scope.form2.GH_NAME_ID);*/

                                        //因为是配置产品，所以加载配置好的固话信息
                                        $scope.request.loadGuHuaPackageFee();
                                    }
                                    //描述产品说明
                                    $scope.showMessage.description = unescape(data.body.rows[0].DESCRIPTION);
                                    if ($scope.showMessage.description.trim() == "") {
                                        $scope.showMessage.description = "无";
                                    }
                                    $scope.showMessage.description = $sce.trustAsHtml($scope.showMessage.description);
                                    //刷新
                                    $scope.$apply();
                                } else {
                                    alert("无数据");
                                }
                                //网点地市编码TODO 
                                $scope.request.loadArea();
                            }

                        } catch (e) {
                            alert("出错" + e.message);
                        }
                    }
                })
            },

            //加载宽带速率，接入类型
            loadFilter: function(fn) {
                $srhttp.get("!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_FILTER", {
                    "type": "CBSS"
                }, function(data) {
                    if (data.header.code == 0) {
                        $scope.arrays.speed_rows = [];
                        $scope.arrays.jrlx_rows = [];
                        var rows = data.body.rows;
                        for (var i = 0; i < rows.length; i++) {
                            if (rows[i].TYPE == "speed") {
                                $scope.arrays.speed_rows.push(rows[i]);
                            } else {
                                $scope.arrays.jrlx_rows.push(rows[i]);
                            }
                        }

                        if (fn) {
                            //这里fn是加载固话信息
                            fn();
                        }
                    }
                });
            },

            //加载宽带产品名称
            loadKuanDaiName: function() {
                console.log("开始加载宽带产品名称...");
                $.ajax({
                    "type": "post",
                    url: APP_CONFIG.SERVER_URL + "!ESale/Business/VirtualService/Phone/Amalgamation/~query/admin/Q_NEW_KD_NAME",
                    data: {
                        "area_code": $scope.form2.area_code,
                        "speed_id": ""
                    },
                    dataType: "json",
                    async: false,
                    success: function(data) {
                        try {
                            if (data.header.code == 0) {
                                if (data.body.rows.length > 0) {
                                    for (var i = 0; i < data.body.rows.length; i++) {
                                        data.body.rows[i].CBSS_NAME = unescape(data.body.rows[i].CBSS_NAME);
                                    }
                                    $scope.arrays.kuanDaiName_rows = data.body.rows;
                                } else {
                                    alert("无宽带产品可选");
                                }
                                //加载固话信息
                                $scope.show.guHuanName = true;
                                $scope.request.loadGuHuaName();
                            } else {
                                alert("获取宽带产品数据失败，请联系代理商！");
                            }
                        } catch (e) {
                            alert("出错" + e.message);
                        }
                    }
                });
                /*$srhttp.get("!ESale/Business/VirtualService/Phone/Amalgamation/~query/admin/Q_NEW_KD_NAME", {
                	"area_code": $scope.form2.area_code,
                	"speed_id": ""
                }, function(data) {
                	try {
                		if (data.header.code == 0) {
                			if (data.body.rows.length > 0) {
                				$scope.arrays.kuanDaiName_rows = data.body.rows;
                			} else {
                				alert("无宽带产品可选");
                			}
                			//加载固话信息
                			$scope.show.guHuanName = true;
                			$scope.request.loadGuHuaName();
                		} else {
                			alert("获取宽带产品数据失败，请联系代理商！");
                		}
                	} catch (e) {
                		alert("出错" + e.message);
                	}
                });*/
            },

            //加载宽带产品包
            loadKuanDaiPackage: function(id) {
                $srhttp.get("!ESale/Business/VirtualService/Phone/Amalgamation/~query/admin/Q_NEW_KD_PACKAGE", {
                    "area_code": $scope.form2.area_code,
                    "name_id": id
                }, function(data) {
                    try {
                        if (data.header.code == 0) {
                            if (data.body.rows.length > 0) {
                                $scope.arrays.kuanDaiPackage_rows = data.body.rows;
                                $scope.arrays.kuanDaiPackage_rows.push({
                                    "ID": "X",
                                    "ESS_ID": "",
                                    "ESS_NAME": "不选择产品包"
                                });
                            } else {
                                alert("无宽带产品包可选");
                            }
                        } else {
                            alert("获取宽带产品包数据失败，请联系代理商！");
                        }
                    } catch (e) {
                        alert("出错" + e.message);
                    }
                });
            },

            //加载宽带产品资费
            loadKuanDaiZiFei: function(id) {
                $srhttp.get("!ESale/Business/VirtualService/Phone/Amalgamation/~query/admin/Q_NEW_KD_ZF", {
                    "area_code": $scope.form2.area_code,
                    "package_id": id
                }, function(data) {
                    try {
                        if (data.header.code == 0) {
                            if (data.body.rows.length > 0) {
                                $scope.arrays.kuanDaiZiFei_rows = data.body.rows;
                            } else {
                                alert("无宽带产品资费可选");
                                $scope.arrays.kuanDaiZiFei_rows = [];
                            }
                        } else {
                            alert("获取宽带产品资费数据失败，请联系代理商！");
                        }
                    } catch (e) {
                        alert("出错" + e.message);
                    }
                });
            },

            //加载宽带到期执行方式
            loadKuanDaiMode: function() {
                /*$srhttp.get("!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_MODE_NAME", {
                	"type": "KD"
                }, function(data) {
                	try {
                		if (data.header.code == 0) {
                			$scope.arrays.kuanDaiMode_rows = data.body.rows;
                		} else {
                			alert("获取宽带到期执行方式失败，请联系代理商！");
                		}
                	} catch (e) {
                		alert("出错" + e.message);
                	}
                });*/
                $.ajax({
                    "type": "post",
                    url: APP_CONFIG.SERVER_URL + "!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_MODE_NAME",
                    data: {
                        "type": "KD"
                    },
                    dataType: "json",
                    async: false,
                    success: function(data) {
                        try {
                            if (data.header.code == 0) {
                                for (var i = 0; i < data.body.rows.length; i++) {
                                    data.body.rows[i].CBSS_NAME = unescape(data.body.rows[i].CBSS_NAME);
                                    data.body.rows[i].NAME = unescape(data.body.rows[i].NAME);
                                }
                                $scope.arrays.kuanDaiMode_rows = data.body.rows;
                            } else {
                                alert("获取宽带到期执行方式失败，请联系代理商！");
                            }
                        } catch (e) {
                            alert("出错" + e.message);
                        }
                    }
                });
            },

            //加载宽带到期执行资费
            loadKuanDaiDaoQiZiFei: function() {
                $srhttp.get("!ESale/Business/VirtualService/Phone/Amalgamation/~query/admin/Q_NEW_KD_DAOQI_ZF", {
                    "zf_id": $scope.form2.KD_FEE_GUID
                }, function(data) {
                    try {
                        if (data.header.code == 0) {
                            if (data.body.rows.length > 0) {
                                $scope.arrays.kuanDaiDaoQiZiFei_rows = data.body.rows;
                            } else {
                                alert("无到期执行资费可选"); //更换产品资费就可能有
                            }
                        } else {
                            alert("获取宽带到期执行资费失败，请联系代理商！");
                        }
                    } catch (e) {
                        alert("出错" + e.message);
                    }
                });
            },

            //加载-区域选择列表
            loadCity: function() {
                console.log("开始加载区域列表...");
                $srhttp.post("!ESale/Business/VirtualService/Phone/Amalgamation/~query/Q_SALE_RES", {}, function(data) {
                    try {
                        if (data.header.code == 0) {
                            if (data.body.rows.length > 0) {
                                $scope.arrays.city_rows = data.body.rows;
                            } else {
                                alert("无区域可选"); //更换产品资费就可能有
                            }
                        } else {
                            alert("获取区域失败，请联系代理商！");
                        }
                    } catch (e) {
                        alert("出错" + e.message);
                    }
                });
            },

            //加载固话信息产品名称
            loadGuHuaName: function() {
                $srhttp.get("!ESale/Business/VirtualService/Phone/Amalgamation/~query/admin/Q_NEW_GH_NAME", {
                    "area_code": $scope.form2.area_code
                }, function(data) {
                    try {
                        if (data.header.code == 0) {
                            if (data.body.rows.length > 0) {
                                $scope.arrays.guHuaName_rows = data.body.rows;
                            } else {
                                alert("无固话产品可选");
                            }
                        } else {
                            alert("获取固话产品数据失败，请联系代理商！");
                        }
                    } catch (e) {
                        alert("出错" + e.message);
                    }
                });
            },

            //加载固话信息资费包,前提是自定义产品
            loadGuHuaPackage: function(id) {
                $srhttp.get("!ESale/Business/VirtualService/Phone/Amalgamation/~query/admin/Q_NEW_GH_PACKAGE", {
                    "gh_name_id": id
                }, function(data) {
                    try {
                        if (data.header.code == 0) {
                            if (data.body.rows.length > 0) {
                                $scope.arrays.guHuaPackage = data.body.rows;
                                $scope.arrays.more = []; //先清空数组集合，等下要存放$scope.arrays.ziFeiPackage
                                //循环添加资费包选项
                                for (var i = 0; i < $scope.arrays.guHuaPackage.length; i++) {
                                    $scope.request.loadGuHuaZiFeiPackage($scope.arrays.guHuaPackage[i].ID, "guHuaZiFeiPackage_" + i, i);
                                }
                            } else {
                                alert("无固话资费包可选");
                            }
                        } else {
                            alert("获取固话资费包数据失败，请联系代理商！");
                        }
                    } catch (e) {
                        alert("出错" + e.message);
                    }
                });
            },

            //加载固话信息资费包详细选项
            loadGuHuaZiFeiPackage: function(id, name, i) {
                //这里设置延时，是防止多次同时访问接口，导致接收到的json格式错误，延时为300s,600s,900s
                setTimeout(function() {
                    $srhttp.get("!ESale/Business/VirtualService/Phone/Amalgamation/~query/admin/Q_NEW_GH_ZF", {
                        "package_id": id
                    }, function(data) {
                        try {
                            if (data.header.code == 0) {
                                $scope.arrays[name] = data.body.rows; //这里比如$scope.arrays.guHuaZiFeiPackage_0
                                //console.log("arrays长这个样");
                                //console.log($scope.arrays[name]);
                                $scope.arrays.more[i] = {
                                    "name": $scope.arrays.guHuaPackage[i].ESS_NAME,
                                    "value": $scope.arrays[name],
                                    "ESS_ID": $scope.arrays.guHuaPackage[i].ESS_ID
                                };
                            } else {
                                alert("获取资费包数据失败");
                            }
                        } catch (e) {
                            alert("出错" + e.message);
                        }
                    });
                }, i * 300);
            },

            //不管定单处理成功失败，往后台写入信息
            sendMessage: function(memberId, msg) {
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
            },

            //创建订单
            creatOrder: function() {
               /* $scope.form.CUSTOMER_NAME = "林创荣";
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

                if ($scope.form2.KD_SPEED == "") {
                    alert("请选择宽带速率");
                    return;
                }
                if ($scope.form2.KD_JRLX == "") {
                    alert("请选择宽带接入类型");
                    return;
                }
                if ($scope.form2.CITY_CODE == "") {
                    alert("请选择地区");
                    return;
                }
                if ($scope.form2.ADDRESS == "") {
                    alert("请填写装机地址");
                    return;
                }
                if ($scope.form.CUSTOMER_NAME == "") {
                    alert("请先读取身份证信息");
                    return;
                }

                if ($scope.form2.CONTACT_PHONE == "") {
                    alert("请输入联系电话");
                    return;
                }
                if ($scope.form2.KD_NAME == "") {
                    alert("请选择宽带产品名称");
                    return;
                }
                if ($scope.form2.PACK_NAME == "") {
                    alert("请选择宽带产品包");
                    return;
                }
                if ($scope.form2.KD_FEE == "") {
                    alert("请选择宽带产品资费");
                    return;
                }
                if ($scope.form2.KD_ZXFS_ID == "") {
                    alert("请选择宽带到期执行方式");
                    return;
                }
                if ($scope.form2.KD_ZXFS_ID == "b" && !$scope.form2.KD_ZXZF_ID) {
                    alert("请选择宽带到期执行资费");
                    return;
                }
                //自定义情况下，若选了固话信息名称，则需要判断有没有选子选项
                if ($scope.kd_product_object.type == '1' && $scope.form2.GH_NAME && $("#gh_info_pack a.com_selectbtnon").size() == 0) {
                    alert("固话资费包至少选择一项");
                    return;
                }
                if ($scope.form2.GH_NAME && $scope.form2.GH_NUM == "") {
                    alert("请输入固话号码");
                    return;
                }
                //判断发展人内容

                /*if ($scope.form.DEV_CODE == "") {
                    alert("发展人信息不能为空");
                    return;
                }*/
                if ($scope.form2.NOTE.length > 100) {
                    alert("备注请不要超过100个字符，已超出" + ($scope.form2.NOTE.length - 100) + "个字符");
                    return;
                }

                //生成身份证ID
                $scope.cardForm = {
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
                $scope.form.CardID = InsertIDCard($scope.cardForm);
                if ($scope.form.CardID == "") {
                    alert("身份证ID获取失败，不可创建订单");
                    return;
                }

                var paramData = $scope.other.getOrderData();

                $srhttp.post("!ESale/Mall/Order/~java/Order.create", {
                    "list": rdcp.json2str({
                        "list": []
                    }),
                    "ext": rdcp.json2str(paramData.ext),
                    "businessId": "ChinaUnicom.Network.Telephone",
                    payStatus: "-1"
                }, function(data) {
                    if (data.header.code == 0) {
                        var creatorName = data.body["creator_member_name"];
                        var devId = data.body["member_id"];
                        $scope.request.sendMessage(devId, creatorName + "的订单已经生成,请注意接收查看");
                        alert("订单创建成功");
                        hrefJump('orders');
                    } else {
                        alert("订单创建失败！");
                    }
                });
            }
        }

        $scope.event = {

            //速率
            selectSpeed: function(obj, id, name) {
                $scope.selectReplaceClass(obj);
                $scope.form2.KD_SPEED = name;
            },

            //接入类型
            selectJrlx: function(obj, id, name) {
                $scope.selectReplaceClass(obj);
                $scope.form2.KD_JRLX = name;
            },

            //宽带产品名称点击事件
            selectKuanDaiName: function(obj, id, code, name) {
                $scope.selectReplaceClass(obj);
                $scope.form2.KD_NAME = name;
                $scope.form2.KD_NAME_ID = code;

                //加载宽带产品包
                $scope.request.loadKuanDaiPackage(id);

                //隐藏下一级
                $scope.show.kuanDaiPackage = true;
                $scope.show.kuanDaiZiFei = false;
                $scope.show.kuanDaiMode = false;
                $scope.show.kuanDaiDaoQiZiFei = false;
                //清空下一级的值
                $scope.form2.PACK_ID = "";
                $scope.form2.PACK_NAME = "";
                $scope.form2.KD_FEE = "";
                $scope.form2.KD_FEE_GUID = "";
                $scope.form2.KD_FEE_ID = "";
                $scope.form2.KD_ZXFS = "";
                $scope.form2.KD_ZXFS_ID = "";
                $scope.form2.KD_ZXZF_ID = "";
                $scope.form2.KD_ZXZF = "";

            },

            //宽带产品包点击事件
            selectKuanDaiPackage: function(obj, id, code, name) {
                $scope.selectReplaceClass(obj);
                $scope.form2.PACK_ID = code;
                $scope.form2.PACK_NAME = name;

                //加载产品资费
                $scope.request.loadKuanDaiZiFei(id);
                //显示下一级
                $scope.show.kuanDaiZiFei = true;


                $scope.show.kuanDaiMode = false;
                $scope.show.kuanDaiDaoQiZiFei = false;
                //清空下一级的值
                $scope.form2.KD_FEE = "";
                $scope.form2.KD_FEE_GUID = "";
                $scope.form2.KD_FEE_ID = "";
                $scope.form2.KD_ZXFS = "";
                $scope.form2.KD_ZXFS_ID = "";
                $scope.form2.KD_ZXZF_ID = "";
                $scope.form2.KD_ZXZF = "";
            },

            //宽带资费点击事件
            selectKuanDaiZiFei: function(obj, id, code, name) {
                $scope.selectReplaceClass(obj);
                $scope.form2.KD_FEE = name;
                $scope.form2.KD_FEE_GUID = id;
                $scope.form2.KD_FEE_ID = code;

                //加载执行方式
                $scope.request.loadKuanDaiMode();

                //隐藏
                $scope.show.kuanDaiMode = true;
                $scope.show.kuanDaiDaoQiZiFei = false;
                //清空下一级的值
                $scope.form2.KD_ZXFS = "";
                $scope.form2.KD_ZXFS_ID = "";
                $scope.form2.KD_ZXZF_ID = "";
                $scope.form2.KD_ZXZF = "";
            },

            //宽带执行方式
            selectKuanDaiMode: function(obj, code, name) {
                $scope.selectReplaceClass(obj);
                $scope.form2.KD_ZXFS = name;
                $scope.form2.KD_ZXFS_ID = code;

                //自定义产品，点击执行方式后，需要获取执行资费
                if ($scope.kd_product_object.type == '1') {
                    if (code == "b") {
                        $scope.request.loadKuanDaiDaoQiZiFei();
                        //显示下一级
                        $scope.show.kuanDaiDaoQiZiFei = true;
                    } else {
                        //隐藏
                        $scope.show.kuanDaiDaoQiZiFei = false;
                    }
                    //清空下一级的值
                    $scope.form2.KD_ZXZF_ID = "";
                    $scope.form2.KD_ZXZF = "";
                } else {
                    //配置产品
                    if (code != "b") {
                        $scope.form2.KD_ZXZF = "";
                        $scope.form2.KD_ZXZF_ID = "";
                    } else {
                        //$scope.form2.KD_ZXZF = openBroadData.zxzf;
                        //$scope.form2.KD_ZXZF_ID = openBroadData.zxzf_id;
                    }

                }

            },

            //到期执行资费
            selectKuanDaiDaoQiZiFei: function(obj, id, name) {
                $scope.selectReplaceClass(obj);
                $scope.form2.KD_ZXZF_ID = id;
                $scope.form2.KD_ZXZF = name;
            },

            //区域选择
            selectCity: function(obj, code, name) {
                $scope.selectReplaceClass(obj);
                $scope.form2.CITY_CODE = code;
                $scope.form2.CITY_NAME = name;
                //console.log($scope.form2.CITY_CODE);
            },

            //固话信息产品名称
            selectGuHuaName: function(obj, id, code, name) {
                //如果是已经选中，现在取消掉
                if ($(obj.target).hasClass("com_selectbtnon")) {
                    $(obj.target).removeClass("com_selectbtnon");
                    $scope.form2.GH_NAME = "";
                    $scope.form2.GH_NAME_ID = "";
                    $scope.arrays.more = [];
                    return;
                } else {
                    $(obj.target).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
                    $scope.form2.GH_NAME = name;
                    $scope.form2.GH_NAME_ID = code; //存这个值，我也不知道干什么用的
                    //加载固话资费包
                    $scope.request.loadGuHuaPackage(id);
                }
            },

            //固话信息资费包选择事件
            selectZiFeiPackage: function(obj) {
                //如果是已经选中，现在取消掉
                if ($(obj.target).hasClass("com_selectbtnon")) {
                    $(obj.target).removeClass("com_selectbtnon");
                } else {
                    $(obj.target).addClass("com_selectbtnon");
                }
            },

            //新装固话，加装固话点击事件
            installGuHua: function(obj, value) {
                $scope.selectReplaceClass(obj);
                $scope.form2.GH_INSTALL = value; //0代表新装，1代表加装
            }
        }

        $scope.other = {
            //设置固话参数
            setGHParams: function(result) {
                if ($scope.form2.GH_NAME == "") {
                    return;
                }
                if ($scope.kd_product_object.type == "0") {
                    var texts = {};
                    //配置产品
                    for (var i = 0; i < $scope.arrays.guHuaPackage.length; i++) {
                        if (texts[$scope.arrays.guHuaPackage[i].PACK_NAME]) {
                            texts[$scope.arrays.guHuaPackage[i].PACK_NAME] += "、" + $scope.arrays.guHuaPackage[i].ZF_NAME;
                        } else {
                            texts[$scope.arrays.guHuaPackage[i].PACK_NAME] = $scope.arrays.guHuaPackage[i].ZF_NAME;
                        }
                    }
                    var i = 0;
                    for (var s in texts) {
                        //alert(s + " = " + texts[s]);
                        i++;
                        result.ext.ext.BUSINESS.push({
                            "key": "gh_pack" + i,
                            "val": texts[s],
                            "key_as": "固话-资费包（" + s + "）"
                        });
                    }
                    //alert(JSON.stringify(texts));
                } else {
                    //自定义产品
                    for (var i = 0; i < $scope.arrays.more.length; i++) {
                        var items = $("#title_" + i);
                        var fees = $("#gh_info_pack_" + i).find("a.com_selectbtnon"); //选中的子项
                        var text = "";
                        if (fees.size() == 0) {
                            continue; //如果没有子项被选中，跳过本次循环
                        }
                        for (var j = 0; j < fees.size(); j++) {
                            text += (j == 0 ? "" : "、") + fees.eq(j).attr("data-name");
                        }
                        result.ext.ext.BUSINESS.push({
                            "key": "gh_pack" + (i + 1),
                            "val": text,
                            "key_as": "固话-资费包（" + items.attr("data-name") + "）"
                        });
                    }
                }
            },

            //获取宽带参数
            getKDParams: function() {
                var params = {
                    code: $scope.form2.KD_NAME_ID,
                    name: $scope.form2.KD_NAME,
                    bags: []
                }
                params.bags.push({
                    code: $scope.form2.PACK_ID,
                    options: [{
                        code: $scope.form2.KD_FEE_ID,
                        aClick: [{
                            dId: "EXPIRE_DEAL_MODE",
                            dValue: $scope.form2.KD_ZXFS_ID
                        }, {
                            dId: "A_DISCNT_CODE",
                            dValue: $scope.form2.KD_ZXZF_ID
                        }]
                    }]
                });
                return params;
            },

            //获取固话参数
            getGHParams: function() {
                if (!$scope.form2.GH_NAME)
                    return {};

                var params = {
                    code: $scope.form2.GH_NAME_ID,
                    name: $scope.form2.GH_NAME,
                    bags: []
                }
                if ($scope.kd_product_object.type == "0") {
                    //配置产品
                    for (var i = 0; i < $scope.arrays.guHuaPackage.length; i++) {
                        var pack = $scope.arrays.guHuaPackage[i].PACK_ID;
                        var first = true;
                        for (var j = 0; j < params.bags.length; j++) {
                            if ($scope.arrays.guHuaPackage[i].PACK_ID == params.bags[j].code) {
                                //当前资费包已存在列表
                                params.bags[j].options.push({
                                    code: $scope.arrays.guHuaPackage[i].ZF_ID,
                                    aClick: []
                                });
                                first = false;
                                break;
                            }
                        }
                        if (first) {
                            params.bags.push({
                                code: $scope.arrays.guHuaPackage[i].PACK_ID,
                                options: [{
                                    code: $scope.arrays.guHuaPackage[i].ZF_ID,
                                    aClick: []
                                }]
                            });
                        }
                    }
                } else {
                    //自定义产品
                    for (var i = 0; i < $scope.arrays.more.length; i++) {
                        var title = "#title_" + i;
                        var bag = {
                            code: $(title).attr("data-code"),
                            options: []
                        }

                        //循环已经选中，拥有样式的a
                        var fees = $("#gh_info_pack_" + i).find("a.com_selectbtnon");
                        if (fees.size() == 0) {
                            continue; //路过此次循环，因为没有子项被选中
                        }
                        for (var j = 0; j < fees.size(); j++) {
                            bag.options.push({
                                code: fees.eq(j).attr("data-code"),
                                aClick: []
                            });
                        }
                        params.bags.push(bag);
                    }
                    /*var items = $("#gh_info_pack a.avtive");
                    for (var i = 0; i < items.size(); i++) {
                    	var fees = $(items[i]).closest(".twoline_input_centent").find("a.active");
                    	var bag = {
                    		code: items.eq(i).attr("data-code"),
                    		options: []
                    	};
                    	for (var j = 0; j < fees.size(); j++) {
                    		bag.options.push({
                    			code: fees.eq(j).attr("data-code"),
                    			aClick: []
                    		});
                    	}
                    	params.bags.push(bag);
                    }*/
                }
                return params;
            },

            getOrderData: function() {
                var result = {};
                result['list'] = {
                    'list': []
                };

                var xzkgType = "1";
                if ($scope.form2.GH_NAME) {
                    xzkgType = "0";
                } else if ($scope.form2.GH_NAME && $scope.form2.KD_SPEED == "4M") {
                    xzkgType = "2";
                }

                var phone = $scope.form2.GH_NUM;
                if (!phone) {
                    phone = "-";
                }

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
                                'key': 'NOTE',
                                'val': $scope.form2.NOTE,
                                'key_as': '备注'
                            }, {
                                'key': 'city_name',
                                'val': $scope.form2.CITY_NAME,
                                'key_as': '地区'
                            }, {
                                'key': 'install_address',
                                'val': $scope.form2.ADDRESS,
                                'key_as': '装机地址'
                            }, {
                                'key': 'serialNumber',
                                'val': $scope.form2.GH_NUM,
                                'key_as': '固话号码'
                            }, {
                                'key': 'kd_speed',
                                'val': $scope.form2.KD_SPEED,
                                'key_as': '宽带-速率'
                            },

                            {
                                'key': 'kd_jrlx',
                                'val': $scope.form2.KD_JRLX,
                                'key_as': '宽带-接入类型'
                            }, {
                                'key': 'kd_name',
                                'val': $scope.form2.KD_NAME,
                                'key_as': '宽带-产品名称'
                            }, {
                                'key': 'pack_name',
                                'val': $scope.form2.PACK_NAME,
                                'key_as': '宽带-产品包'
                            }, {
                                'key': 'kd_fee',
                                'val': $scope.form2.KD_FEE,
                                'key_as': '宽带-产品资费'
                            }, {
                                'key': 'kd_zxfs',
                                'val': $scope.form2.KD_ZXFS,
                                'key_as': '宽带-到期执行方式'
                            }, {
                                'key': 'kd_zxzf',
                                'val': $scope.form2.KD_ZXZF,
                                'key_as': '宽带-到期执行资费'
                            }, {
                                'key': 'kuandai_tiaoce',
                                'val': $scope.form2.KD_TIAOCE,
                                'key_as': '宽带调测费'
                            }, {
                                'key': 'kuandai_gongliao',
                                'val': $scope.form2.KD_GONGLIAO,
                                'key_as': '宽带装移机工料费'
                            }, {
                                'key': 'kuandai_shouxu',
                                'val': $scope.form2.KD_SHOUXU,
                                'key_as': '宽带装移机手续费'
                            },

                            {
                                'key': 'gh_install',
                                'val': $scope.form2.GH_INSTALL,
                                'key_as': '固话（0新装，1加装）'
                            }, {
                                'key': 'gh_name',
                                'val': $scope.form2.GH_NAME,
                                'key_as': '固话-产品名称'
                            }, {
                                'key': 'guhua_tiaoce',
                                'val': $scope.form2.GH_TIAOCE,
                                'key_as': '固话调测费'
                            }, {
                                'key': 'guhua_gongliao',
                                'val': $scope.form2.GH_GONGLIAO,
                                'key_as': '固话装移机工料费'
                            }, {
                                'key': 'guhua_shouxu',
                                'val': $scope.form2.GH_SHOUXU,
                                'key_as': '固话装移机手续费'
                            }
                        ],
                        'BASE': [{
                            'key': 'CardID',
                            'val': $scope.form.CardID,
                            'key_as': '身份证ID'
                        }, {
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
                            'val': $scope.form2.CONTACT_PHONE,
                            'key_as': '联系电话'
                        }, {
                            'key': 'ISS_USING',
                            'val': $scope.form.GOV,
                            'key_as': '签发机关'
                        }, {
                            'key': 'POSTAL_ADDRESS',
                            'val': $scope.form.CERT_ADDRESS,
                            'key_as': '通讯地址'
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
                        'HIDDEN': [{
                            'key': 'xzkgType',
                            'val': xzkgType,
                            'key_as': '类型'
                        }, {
                            'key': 'city_code',
                            'val': $scope.form2.CITY_CODE,
                            'key_as': '地区编码'
                        }, {
                            'key': 'areaId',
                            'val': $scope.form2.area_code ? $scope.form2.area_code : "",
                            'key_as': '网点地市编码'
                        }, {
                            'key': 'KDProducts',
                            'val': JSON.stringify($scope.other.getKDParams()),
                            'key_as': '宽带参数'
                        }, {
                            'key': 'GHProducts',
                            'val': JSON.stringify($scope.other.getGHParams()),
                            'key_as': '固话参数'
                        }],
                        'BUSINESS.INT': [{
                            'key': 'PHONE_NUMBER',
                            'val': phone,
                            'key_as': '开户号码'
                        }],
                        'BASE.DATE': [{
                                'key': 'CERT_VALID_FROM',
                                'val': $scope.form.FROM,
                                'key_as': '证件有效期开始'
                            }, //证件有效日期开始
                            {
                                'key': 'CERT_VALID_TO',
                                'val': $scope.form.TO,
                                'key_as': '证件有效期结束'
                            } //证件有效日期
                        ]
                    }

                };
                $scope.other.setGHParams(result);
                return result;
            }
        }

        //开始执行页面
        //工料费 
        $scope.request.loadFeeItem();

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
                } else {
                    $('#binding').hidden();
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
]);
