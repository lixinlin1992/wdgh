app.registerCtrl("BaseCtrl", ["$rootScope", "$srhttp", "$interval", function ($rootScope, $srhttp, $interval) {
    $rootScope.updateSession = function () {
        $srhttp.get("!sys/security/~java/UpdateSession?t="+new Date().getTime(), {}, function (data) {
            if (data!=null&data!="") {
                if (data.header.code != 0) {
                    //$rootScope.loginTip = "您的登录已经过期，请重新登录";
                    Local.saveStore("_LOGIN_TIP", escape("您的登录已经过期或者您已经在其它设备上进行了登录，请重新登录"));
                    //删除本地缓存，以防又进行自动登录
                    Local.saveStore(sys.loginKey, "");
                    //取消定时器
                    $interval.cancel($rootScope.sessionUpdater);
                    //跳转到登录页面
                    location.href = "ESale/Mall/UI/pages/login.html";
                }
            }
        }, {mask: false});
    };
    $rootScope.updateSession();
    //启动session检查定时器
    $rootScope.sessionUpdater = $interval(function(){$rootScope.updateSession()}, 10000);
}]);