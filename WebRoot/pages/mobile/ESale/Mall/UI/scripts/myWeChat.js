/**
 * Created by cmf on 2015/12/31.
 */
app.registerCtrl("MyWeChatCtrl", ["$scope", "$srhttp",
    function($scope, $srhttp) {
        $srhttp.post("!ESale/Mobile/Mall/Member/~query/Q_MEMBER_INFO", {_executor:"form_map",result:"map"}, function (data) {
            /*$("#codeid").attr("src",
                "http://qr.liantu.com/api.php?el=l&w=200&m=10&text=" + APP_CONFIG.SERVER_URL +
                "!ESale/WeChat/Mall/UI/~/pages/new_index.jsp?wshop=" + data.body.CODE);*/
            $scope.value=data.body.CODE;
        });
    }
]);