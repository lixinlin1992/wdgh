/**
 * Created by sea on 2015/8/11.
 */
var myPhoto = {};
var imgData = {
    "front": '',
    'contrary': '',
    'writeCard': '',
    'hand': '',
    'sex': '',
    'born': ''
};
app.registerCtrl("YSBinputlist3Ctrl", ["$scope", "$srhttp", "$rootScope",
    function ($scope, $srhttp, $rootScope) {
    	
    	//底部导航样式变化
		setTimeout(function() {
			replaceClass('home');
		}, 100);
		
        $rootScope.appTitle = "移网开户";
        $scope.orderList = Local.getStoreJson("orderList"); //从第二步获得所有orderList数据
        $scope.form = {
            "CardID": "", //身份证ID,这个不是身份证号码，是从数据库读到的ID+
            "NOTE": "", //！备注+

            "CUSTOMER_NAME": "", //！客户姓名+
            "CERT_TYPE": "", //！证件类型ID,访问接口读回来的，!ESale/Business/VirtualService/Phone/SimCard/~query/potal/Q_CERT_TYPE_LIST
            "CERT_TYPE_NAME": "", //！证件类型的中文名称，一般只有身份证，但有可能后期添加一些别的+
            "CERT_ADDRESS": "", //！证件地址+
            "ISS_USING": "", //！签发机关+
            "POSTAL_ADDRESS": "", //！通讯地址+
            "GENDER": "男", //！性别+
            "CERT_NUMBER": "", //！证件号码+

            "ID_PIC_FRONT": "", //身份证正面照片+
            "ID_PIC_BACK": "", //身份证反面照片+
            "ID_PIC_PEO": "", //手持照片+

            "CERT_VALID_FROM": "", //！证件有效期开始+
            "CERT_VALID_TO": "" //！证件有效期结束+
        };
        //上一步
        $scope.back = function () {
            $scope.orderList.num = "";
            Local.saveStoreJson("orderList", $scope.orderList);
            location.href = "#/YSBinputlist2";
        }
        //下一步
        $scope.next = function () {
            $scope.orderList.customName = $("#customer_name").val();
            $scope.orderList.certNum = $("#cert_number").val();
            $scope.orderList.sex = imgData["sex"];
            $scope.orderList.certTypeId = $("#cert_type option:selected").attr("value");
            $scope.orderList.certType = $("#cert_type option:selected").text();
            $scope.orderList.certValidFrom = $("#cert_valid_from").val();
            $scope.orderList.certValidTo = $("#cert_valid_to").val();
            $scope.orderList.issuing = $("#iss_using").val();
            $scope.orderList.certAddress = $("#cert_address").val();
            $scope.orderList.contactPhoneNum = $("#phoneNumber").val().trim();
            $scope.orderList.postalAddress = $("#postal_address").val().trim();
            $scope.orderList.note = $("#note").val().trim();
            $scope.orderList.frontPicId = imgData["front"];
            $scope.orderList.backPicId = imgData["contrary"];
            $scope.orderList.handPicId = imgData["hand"];
            Local.saveStoreJson("orderList", $scope.orderList);
            if ($scope.orderList.customName == "" || $scope.orderList.certNum == "" || $scope.orderList.frontPicId == "" || $scope.orderList.backPicId == "") {
                alert("请用蓝牙读取身份证信息!");
                return;
            }
            if ($scope.orderList.firstMonthFeeName == "") {
                alert("请选择套餐资费!");
                return;
            }
            if ($("#phoneNumber").val().trim().length == 0) {
                alert("请填写联系电话!");
                return;
            }
            if (!$scope.checkMobile($("#phoneNumber").val())) {
                alert("联系电话格式不正确!");
                return;
            }
            location.href = "#/YSBinputlist4";
        }
        //检验号码11位
        $scope.checkMobile = function (str) {
            var re = /^1\d{10}$/;
            return re.test(str);
        }
        //验证图片识别权限和蓝牙读取权限，成功
        $scope.loadBtnAccess = function () {
            var param = {
                "business_id": "ChinaUnicom.Account",
                "service_id": "REAL_NAME_AUTHENTICATION",
                "group_id": "ID_INFO",
                "code": "ID_CARD_TYPE"
            };
            $srhttp.get("!System/Core/Member/~java/MemberConfig.getConfig", param, function (data) {
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
        $scope.loadIDcardNumReviseAccess = function () {
            var param = {
                "business_id": "ChinaUnicom.Account",
                "service_id": "REAL_NAME_AUTHENTICATION",
                "group_id": "ID_INFO",
                "code": "ID_CARD_MODIFICATION"
            };
            $srhttp.get("!System/Core/Member/~java/MemberConfig.getConfig", param, function (data) {
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


        //证件类型
        $srhttp.post("!ESale/Business/VirtualService/Phone/SimCard/~query/potal/Q_CERT_TYPE_LIST", {}, function (data) {
            if (data.length > 0) {
                $scope.certs = data;
            }
        });
        //减免活动选择
        $scope.jmkfCheck = function () {
            if ($("#jmkfCheckBox").hasClass("com_checkoxon")) {
                $("#jmkfCheckBox").removeClass("com_checkoxon");
                $scope.orderList.jmkfStatus = "1";
            } else {
                $("#jmkfCheckBox").addClass("com_checkoxon");
                $scope.orderList.jmkfStatus = "0";
            }
        }
        //根据当前时间自动选择首月资费
        $scope.autoSelectZF = function () {
            var data = new Date();
            var day = parseInt(data.getDate());
            if (day < 15) {
                $scope.selectZf(2);
            } else if (day > 15 && day < 25) {
                $scope.selectZf(1);
            } else {
                $scope.selectZf(0);
            }
        }
        //首月资费选择
        $scope.selectZf = function (id) {
            var id = $("#zf" + id);
            $(id).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
            $scope.orderList.firstMonthFeeName = $(id).text();
            $scope.orderList.firstMonthFee = $(id).attr("zftype");
        }
        $scope.autoSelectZF();
        //使用系统自带的照相功能上传图片
        $scope.takePhoto = function (type) {
            window.native.toast("开启相机");
            //window.native.sync('Application', 'setUploadUrl', APP_CONFIG.SERVER_URL);
            $('#progressBar').css("width", "0%").empty().append('0%');
            TakePhoneUpload("{'busiId':'Account','busiType':'APP','size':1000,'_param':'" + type + "'了}", 'print');

        }
        myPhoto.request = $srhttp.request;


        //图片识别1
        $scope.imageShiBie = function () {
            mask("识别中...");
            $scope.ocr();
        }

        //图片识别2
        $scope.ocr = function (obj) {
            if (imgData.front && imgData.contrary)
                $scope.OCR(imgData.front, imgData.contrary); //自动识别
            else {
                unmask();
                alert('请上传身份证正、反面');
            }
        }

        //图片识别3----执行图片解析，判断苹果设备、安卓设备
        $scope.OCR = function (faceImageId, backImageId) {
            if (faceImageId && backImageId) {
                if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
                    var url = "!ESale/System/Ocr/~java/IDCardOCR.request";
                    $srhttp.get(url, {
                            sync: true,
                            'faceImageId': faceImageId,
                            'backImageId': backImageId,
                            timeout: 60000
                        },
                        function (data) {
                            if (data.header.code == "0") {
                                var d = data.body;
                                $("#customer_name").val(d.NAME).trigger('change'); //身份证名字
                                $("#cert_number").val(d.CARD_NUM).trigger('change'); //身份证号码
                                $("#cert_address").val(d.ADDRESS).trigger('change'); //身份证地址
                                $("#iss_using").val(d.STR_OFFICE).trigger('change'); //身份证的发证机关
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
                                    $("#cert_valid_to").val(year + "-" + month + "-" + day).trigger('change'); //身份证有效期的结束时间
                                }
                                if (d.VALID_FROM) {
                                    var year = d.VALID_FROM.substring(0, 4) + '';
                                    var month = d.VALID_FROM.substring(4, 6) + '';
                                    var day = d.VALID_FROM.substring(6, 8) + '';
                                    $("#cert_valid_from").val(year + "-" + month + "-" + day).trigger('change'); //身份证有效期的开始时间（蓝牙那边读取出来的是2015.01.01，要把“.”换成“-”才能放进date类型的input）
                                }

                            } else {
                                alert("识别失败，请上传较为清晰的图片");
                            }
                            unmask();
                        });
                } else {

                    AndroidOcr(function(msg){
						if (msg) {
							//alert(result);
							console.log('AndroidOcr>>>>>>>'+msg);
							var result = JSON.parse(msg);
							console.log('AndroidOcr>>>>>>>'+result['姓名']);
	
							
							$scope.$apply(function(){
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


    }
]);
/**
 *蓝牙读取按钮的点击事件函数
 *调用蓝牙读取接口，传参为回调函数的方法名
 * create by SevenCloud 2015.04.17
 */
$('#bluetooth_read_btn').on('click', function () {
   	check();

});


/**
 * 蓝牙读取接口的回调方法，将信息填入相应表单，覆盖mobile_framework.js的同名方法
 * @param bluetoothInfoStr 身份证信息的JSON字符串，如果读取失败，只返回一对大括号
 */
function onReadIDCardFinish(bluetoothInfoStr) {
    unmask();

    if (bluetoothInfoStr != "{}") {
        var bluetoothInfo = $.parseJSON(bluetoothInfoStr);

        //2015-06-17 添加身份证读取失败信息获取
        if (bluetoothInfo.result != undefined && bluetoothInfo.result != 0) {
            alert(getReadCardResult(bluetoothInfo.result));

            $('#bluetooth_read_btn').button('reset'); //还原蓝牙读取按钮的状态为可点击
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

        imgData["sex"] = bluetoothInfo.sex;
        imgData["born"] = bluetoothInfo.born;
        $("#cert_number").val(bluetoothInfo.cardno).trigger('change'); //身份证号码

        var date1 = bluetoothInfo.effecteddate;
        date1 = date1.substring(0, 4) + "-" + date1.substring(4, 6) + "-" + date1.substring(6, 8);
        var date2 = bluetoothInfo.expireddate;
        date2 = date2.substring(0, 4) + "-" + date2.substring(4, 6) + "-" + date2.substring(6, 8);

        $("#cert_valid_from").val(date1).trigger('change'); //身份证有效期的开始时间（蓝牙那边读取出来的是2015.01.01，要把“.”换成“-”才能放进date类型的input）
        $("#cert_valid_to").val(date2).trigger('change'); //身份证有效期的结束时间
        $("#iss_using").val(bluetoothInfo.issuedat).trigger('change'); //身份证的发证机关
        $("#cert_address").val(bluetoothInfo.address).trigger('change'); //身份证地址
        $("#nation").val(bluetoothInfo.nation).trigger('change');
		
		if(bluetoothInfo.picture==""){
			alert("头像为空，合成身份证照片失败");
			return;
		}
        //请求合成身份证照片
        mask("正在合成身份证照片，请稍等...");
        myPhoto.request("!ESale/System/IDCard/~java/IDCardImg.create", bluetoothInfo, function (data) {
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

}
//使用系统自带的照相功能上传图片

function takePhoto(type) {
    $('#progressBar').css("width", "0%").empty().append('0%');
    var sessionId = Local.getStoreJson(sys.loginKey).body.sessionId; //会话id
    TakePhoneUpload("{'busiId':'Account','busiType':'APP','size':1000,'_param':'" + type + "','SESSIONID':'" + sessionId + "'}", "print");
}

function OnUploadBegin() {
    $("#upload_text").empty().append("图片正在上传，请耐心等待...");
}

//回调
function OnUploadFinish(result) {
    if (result) {
        try {
            result = $.parseJSON(result)[0];
            if (result.id) {
                $('#progressBar').css("width", "100%").empty().append('100%');
                imgData[result._param] = result.id;
                $("#new_img_" + result._param).parent().css("background", "url('" + APP_CONFIG.SERVER_URL + result.thumbURL + "')");
            }
            $("#upload_text").empty().append("图片上传成功");
        } catch (Exception) {
            alert("图片上传失败,请重新上传!");
        }

    } else {
        $("#upload_text").empty().append("图片上传失败!请重新上传...");
    }
}
//苹果设备的图片上传功能

function uploadImg(id) {
    var p = {
        'busiId': 'Account',
        'busiType': 'APP',
        'size': '1000'
    };
    mobileUpload({
        id: id,
        form: p, //上传时参数 提交到后台的参数
        url: APP_CONFIG.SERVER_URL + '!service/file/~java/Uploader.upload',
        fileSelected: function (data) { //文件选择后触发

            $('#progressBar').css("width", "0%");
            document.getElementById('progressBar').innerHTML = '0%';

            //用fileReader请看网上详解 这里这是用于图片预览效果
            var reader = new FileReader();
            reader.onload = function (e) {
                //p.imgDataUrl=this.result;//从这里可以得到本地图片路径 在可以同<img src='this.reuslt'>展示出来
                //                $("#" + id).parent().css("background", "url('" + this.result + "')");//更换背景图片
            }
            reader.readAsDataURL(data.file); //本地读取文件 可以实现预览效果的
            //显示图片信息
            //                document.getElementById('fileName').innerHTML = "名称：" + data.fileName;
            //                document.getElementById('fileSize').innerHTML = "大小：" + data.fileSize;
            //                document.getElementById('fileType').innerHTML = "类型：" + data.fileType;
        },
        uploadProgress: function (evt) { //上传进度
            //下面是结合bootstrap的上传效果  可自己定义
            if (evt.lengthComputable) {
                var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                $('#progressBar').css("width", percentComplete.toString() + "%"); //使用bootstrap滑动条显示上传进度
                document.getElementById('progressBar').innerHTML = percentComplete.toString() + '%';
            } else {
                document.getElementById('progressBar').innerHTML = 'unable to compute';
            }
        },
        uploadComplete: function (evt) {
            var response = rdcp.str2json(evt.target.responseText)[0];
            imgData[id] = response.id;
            $("#" + id).parent().css("background", "url('" + APP_CONFIG.SERVER_URL + response.thumbURL + "')");
        }
    });
}
