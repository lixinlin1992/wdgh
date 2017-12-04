app.registerCtrl("RWCardCtrl", ["$scope", "$srhttp", "$location", function ($scope, $srhttp) {
    console.log('RWCardCtrl Loaded');
    //设置手机端本地化，避免重复加载远程写卡
    $srhttp.get("!ESale/Mobile/System/Base/~java/MobileNative.setNative", {}, function (data) {
        console.log(data);
    }, {mask: false});

    //监听网络状态，如果已经连接上了，询问是否跳转到读写卡界面
    $scope.$on("rwcardStatus", function (e, status) {
        if (status == 1) {
            console.log("连接状态发生改变："+status);
            //TODO: 这里要询问一下用户
            location.href = "index.html#/rwcardStatus";
        }
    });
}]);