app.registerCtrl("MyChangePassword", ["$scope", "$srhttp",
    function ($scope, $srhttp) {
    	
    	//底部导航样式变化
		replaceClass('myESaleB');
    	
        $scope.form = {
            oldPassword: "",
            newPassword: "",
            reNewPassword: ""
        };
        //-----------提交begin
        $scope.confirmChangePassword = function () {
            if ($scope.form.oldPassword == "") {
                alert("请输入旧密码");
                return;
            }
            if ($scope.form.newPassword == "") {
                alert("请输入新密码");
                return;
            }
            if ($scope.form.reNewPassword == "") {
                alert("请重新输入新密码");
                return;
            }
            if ($scope.form.reNewPassword != $scope.form.newPassword) {
                alert("您输入的新密码不正确");
                return;
            }
            try {
                $srhttp.post("!org/user/~query/Q_USER_MODPWD", $scope.form, function (data) {
                    if (data != undefined && data.header != undefined && data.header.code == 0) {
                        $scope.form.oldPassword = "";
                        $scope.form.newPassword = "";
                        $scope.form.reNewPassword = "";
                        alert("密码已经修改，请记住新密码！");

                        //删除已经登录的信息，需要重新登录
                        Local.saveStore(sys.loginKey, "");
                    } else
                        alert("修改密码失败：" + data.header.message);
//						window.location.href = 'ESale/Mall/UI/pages/login.html';
                }, {mask: true});
            } catch (err) {
                //alert("53545");
                console.log(err.message);
                return false;
            }
        };
        //-----------提交end
    }
]);