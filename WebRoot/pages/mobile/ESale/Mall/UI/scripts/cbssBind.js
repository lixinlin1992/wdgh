app.registerCtrl("cbssBindCtrl", ["$scope", "$srhttp", "$rootScope", function($scope, $srhttp, $rootScope) {
    $rootScope.appTitle = "CBSS工号绑定";
    //CBSs账户内信息
    $scope.rows = [{
        DEV_CODE: "",
        DEV_NAME: "",
        DEV_PHONE: ""
    }];
    $scope.password = {
        pwd1: "",
        pwd2: ""
    };
    // 控制弹窗以及遮掩层
    $scope.show = {
        shadeShow: false,
        alertShow1: false,
        alertShow2: false
    };
    //CBSS工号
    $scope.user = "";
    // 添加发展人信息
    $scope.addDevInfo = function() {
        $scope.rows.push({
            DEV_CODE: "",
            DEV_NAME: "",
            DEV_PHONE: ""
        })
    };
    // 删除发展人信息
    $scope.delDevInfo = function(index) {
            $scope.rows.splice(index, 1);
        }
        /*处理事件
         */
    $scope.event = {
            // 保存CBSS账户绑定内容
            saveCbss: function() {
                if ($scope.user == "") {
                    alert("CBSS用户名不能为空");
                    return;
                }
                if ($scope.password.pwd1 == "" || $scope.password.pwd2 == "") {
                    alert("密码不能为空");
                    return;
                }
                if ($scope.password.pwd1 != $scope.password.pwd2) {
                    alert("两次输入密码不一致");
                    return;
                }
                if ($scope.password.pwd1 == '888888') {
                    alert("密码错误，请输入您的cbss系统账户密码");
                    return;
                }
                var check_code = "",
                    codes = "",
                    names = "",
                    phones = "";
                for (var i = 0; i < $scope.rows.length; i++) {
                    if ($scope.rows[i].DEV_CODE == "") {
                        alert('发展人编码不能为空');
                        return;
                    }
                    if ($scope.rows[i].DEV_CODE.length != 10) {
                        alert('发展人编码有误（正确的编码为10位数字）');
                        return;
                    }
                    if ($scope.rows[i].DEV_NAME == "") {
                        alert('发展人姓名不能为空');
                        return;
                    }
                    if ($scope.rows[i].DEV_PHONE == "") {
                        alert('发展人手机不能为空');
                        return;
                    }
                    if ($scope.rows[i].DEV_PHONE.length != 11 || isNaN($scope.rows[i].DEV_PHONE)) {
                        alert('发展人手机格式错误');
                        return;
                    }
                    codes += (i == 0 ? "" : ",") + $scope.rows[i].DEV_CODE;
                    names += (i == 0 ? "" : ",") + $scope.rows[i].DEV_NAME;
                    phones += (i == 0 ? "" : ",") + $scope.rows[i].DEV_PHONE;
                    if (i == 0) {
                        check_code = $scope.rows[0].DEV_CODE;
                    }
                }
                $scope.params = {
                    cbss_user: $scope.user,
                    cbss_pwd: $scope.password.pwd1,
                    cbss_code: codes,
                    cbss_name: names,
                    cbss_phone: phones
                };
                $scope.show.shadeShow = true;
                $scope.show.alertShow1 = true;
            },
            // 弹窗打开关闭操作--begin
            closeSaveCbss: function() {
                $scope.show.shadeShow = false;
                $scope.show.alertShow1 = false;
            },
            saveCbssTit: function() {
                $scope.show.alertShow1 = false;
                $scope.show.alertShow2 = true;
            },
            closeSaveCbssTit: function() {
                $scope.show.shadeShow = false;
                $scope.show.alertShow2 = false;
            },
            // 弹窗打开关闭操作--End

            // 修改成功
            saveCbssContent: function() {
                $srhttp.post("!ESale/Mall/Member/~query/U_UPDATE_CBSS", $scope.params, function(data) {
                    try {
                        if (data.header.code == 0) {
                            alert("修改成功");
                            $scope.password.pwd1 = "";
                            $scope.password.pwd2 = "";
                            $scope.show.alertShow2 = false;
                            $scope.show.shadeShow = false;
                        } else {
                            alert("修改失败");
                            $scope.password.pwd1 = "";
                            $scope.password.pwd2 = "";
                            $scope.show.alertShow2 = false;
                            $scope.show.shadeShow = false;
                        }
                    } catch (e) {
                        alert("修改信息失败");
                    }

                });
            }
        }
        // 获取cbss账号信息
    $scope.loadCbssInfo = function() {
        $srhttp.post("!ESale/Mall/Member/~query/Q_GET_CBSS_INFO", {},
            function(data) {
                try {
                    if (data.header.code == 0) {
                        $scope.user = data.body.rows[0].CBSS;
                        $scope.rows = data.body.rows;
                    };
                } catch (e) {

                }
            }
        );
    }
    $scope.loadCbssInfo();
}]);
