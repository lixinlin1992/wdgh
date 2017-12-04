app.registerCtrl("RWCardStatusCtrl", ["$scope",
	function($scope) {

		//底部导航样式变化
		setTimeout(function() {
			replaceClass('rwcardStatus');
		}, 100);

		//$scope.statusClass = RWCardClient.CONNECT_STATUS==1?"yes":"no";
		$("#CONNECT_STATUS_ID").attr("class", RWCardClient.CONNECT_STATUS == 1 ? "yes" : "no");
		//建立事件的监听，网络连接状态监听

		$scope.$on("rwcardStatus", function(e, status) {
			//$scope.statusClass = status==1?"yes":"no";
			$("#CONNECT_STATUS_ID").attr("class", status == 1 ? "yes" : "no");
		});

	}
]);

var rwcardTips={
	loadMessage:function(msg){
		$("#rwcard_tips").text("提示："+msg);
	}
}
//rwcardTips.loadMessage("发生未知错误，连接二合一设备失败");
