app.registerCtrl("MyActivate", ["$scope", "$srhttp",
    function ($scope, $srhttp) {
        $scope.smsCode = "";
        //点击获取验证码
        $scope.obtainCodeNumber = function () {
            $srhttp.get("!ESale/System/Base/~java/SMSLogin.reSend", {}, function (data) {
                data.header.code = 0;
                if (data.header.code == 0) {
                    alert("验证码已经重发到你手机上，请注意查收");
                    $scope.reObtainCodeSuccess();
                } else {
                    alert("验证码重发失败，请联系管理员");
                    $scope.reObtainCodeFail();
                }
            }, {
                mask: true
            });

        };

        //点击校对验证码
        $scope.validateCode = function () {
            $srhttp.get("!ESale/System/Base/~java/SMSLogin", {
                code: $scope.smsCode
            }, function (data) {
                if (data.header.code == 0) {
                    alert('激活成功');
                    window.location.href = APP_CONFIG.HOME_PAGE;//'ESale/Mall/UI/pages/login.html';
                } else {
                    alert("激活失败，请重新输入验证码，或者重发验证码");
                }
            })
        }
        //验证码发送成功出现激活框
        $scope.reObtainCodeSuccess = function () {
            $("#reActivateCode").show();
            $("#activateCode").hide();
        };
        //验证码发送失败   改变文字，重新发送
        $scope.reObtainCodeFail = function () {
            $("#activateBtn").text(" 重获效验码");
        };

    }
]);