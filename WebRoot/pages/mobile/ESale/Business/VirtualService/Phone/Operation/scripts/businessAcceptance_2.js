var imgData = {
    "front": '',
    'contrary': '',
    'hand': ''
};

var myPhoto = {}; //存储照片
app.registerCtrl("businessAcceptance2Ctrl", ["$scope", "$srhttp", "$rootScope",
    function($scope, $srhttp, $rootScope) {
        $rootScope.appTitle = "业务受理";
        //底部导航样式变化
        setTimeout(function() {
            replaceClass('home');
        }, 100);

        myPhoto.request = $srhttp.request;
        myPhoto.post = $srhttp.post;
        //初始化
        $scope.rows2 = [];
        $scope.rows2 = Local.getStoreJson("rowsParams");
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

        // 客户联系信息
        $scope.form2 = {
            "CONTACT_PHONE": "", //联系电话
            "NOTE": "", //备注
            "CONTACT_NAME": "" //联系人
        }

        // 创建订单
        $scope.creatOrder = function() {
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

            if ($scope.form.CUSTOMER_NAME == " ") {
                alert("请输入客户姓名");
                return;
            }
            if ($scope.form.ID_PIC_FRONT == "") {
                alert("请读取身份证");
                return;
            }
            if ($scope.form2.CONTACT_PHONE == "") {
                alert("请输入联系号码");
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

            var paramData = $scope.getOrderData();

            $srhttp.post("!ESale/Mall/Order/~java/Order.create", {
                "list": rdcp.json2str({
                    "list": []
                }),
                "ext": rdcp.json2str(paramData.ext),
                "businessId": "ChinaUnicom.SX.YWSL"
            }, function(data) {
                if (data.header.code =="0") {
                    var creatorName = data.body["creator_member_name"];
                    var devId = data.body["member_id"];
                    $scope.sendMessage(devId, creatorName + "的订单已经生成,请注意接收查看");
                    alert("订单创建成功");
                    hrefJump('orders');
                } else {
                    alert("订单创建失败！");
                }
            });
        }

        // 获取到的参数
        $scope.getOrderData = function() {
                var result = {};
                result['list'] = {
                    'list': []
                };

                result['ext'] = {
                    'ext': {
                        'BUSINESS': [{
                            'key': 'BUSINESSID',
                            'val': $scope.rows2.ID,
                            'key_as': '受理业务ID'
                        }, {
                            'key': 'BUSINESSNAME',
                            'val': $scope.rows2.NAME,
                            'key_as': '受理业务名称'
                        }, {
                            'key': 'CONTACT_NAME',
                            'val': $scope.form2.CONTACT_NAME,
                            'key_as': '联系人'
                        }, {
                            'key': 'NOTE',
                            'val': $scope.form2.NOTE,
                            'key_as': '备注'
                        }],
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

                };
                return result;
            };
            //不管定单处理成功失败，往后台写入信息
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
