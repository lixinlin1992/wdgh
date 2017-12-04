app.registerCtrl("MyInfoCtrl", ["$scope", "$srhttp", function ($scope, $srhttp) {
	
	//底部导航样式变化
	replaceClass('myESaleB');
	
    $srhttp.get("!ESale/Mobile/Mall/Member/~query/Q_MEMBER_INFO", {_executor:"form_map",result:"map"}, function (data) {
        console.log(data);
        $scope.info = data.body;
    });
}]);