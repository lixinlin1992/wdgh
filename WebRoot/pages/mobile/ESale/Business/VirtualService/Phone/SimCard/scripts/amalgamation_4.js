app.registerCtrl("amalgamation_zhwj", ["$scope", "$srhttp","$rootScope",
	function($scope, $srhttp,$rootScope) {
		$rootScope.appTitle = "做融合";
		
		//底部导航样式变化
		setTimeout(function() {
			replaceClass('home');
		}, 100);
		
		//添加上一步跳转的链接
		app.when("/amalgamation_3", {
			templateUrl: "ESale/Business/VirtualService/Phone/SimCard/pages/amalgamation_3.html",
			controller: "amalgamation_3"
		});
	}
])