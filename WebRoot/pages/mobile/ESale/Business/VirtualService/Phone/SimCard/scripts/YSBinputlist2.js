/**
 * Created by sea on 2015/8/8.
 */
function getGoods_businessid(data){
    var goods_businessid="";
    if(data.indexOf("BK")>=0){
        goods_businessid=data.substr(0,data.indexOf("BK")+2);
    }else if(data.indexOf("CK")>=0){
        goods_businessid=data.substr(0,data.indexOf("CK")+2);
    }else if(data.indexOf("JH")>=0){
        goods_businessid=data.substr(0,data.indexOf("JH")+2);
    }
    return goods_businessid;
}

app.registerCtrl("YSBinputlist2Ctrl", ["$scope", "$srhttp", "$rootScope",
    function ($scope, $srhttp, $rootScope) {
    	
    	//底部导航样式变化
		setTimeout(function() {
			replaceClass('home');
		}, 100);
		

        $rootScope.appTitle="移网开户";
       // $scope.orderList = Local.getStoreJson("form");//从第一步获得所有form数据
        $scope.orderList = Local.getStoreJson("orderList");//从第一步获得所有orderList数据
        $scope.param = {
            "brandId": $scope.orderList.pinPaiId,
            "area_id": $scope.orderList.areaId,
            "businessId":getGoods_businessid($scope.orderList.bid),
            "title": "",
            "typeId": "",
            "pageSize": 12,
            "page": 1
        };

        setTimeout(function () {
            $scope.$broadcast("NumberListCtrl", $scope.param);
        }, 100);
        //上一步
        $scope.back=function(){
            location.href = "#/YSBinputlist";
        }
        //下一步
        $scope.next=function(){
            if($scope.orderList.num==""){
                alert("您还未选择号码");
                return;
            }
            Local.saveStoreJson("orderList", $scope.orderList);
            location.href = "#/YSBinputlist3";
        }
    }
]);
app.registerCtrl("NumberListCtrl", ["$scope", "$srhttp", "$rootScope",
    function ($scope, $srhttp, $rootScope) {
        $scope.loadMessage = function (parm) {
            $srhttp.post("!ESale/Mall/Goods/~query/Q_GOODS_NUMBER_COMMON", parm, function (data) {
                if (data.body.rows.length <= 0) {
                    alert("查询不到号码!");
                    $scope.param.page = 1;
                    return;
                } else {
                    if (data.header.code == 0) {
                        $scope.NumList = data.body.rows;
                    }
                }
            });
        }
        $scope.$on("NumberListCtrl", function (event, data) {
            $scope.loadMessage(data);
        });
        //选号码
        $scope.num_select = function (id) {
            var a = $("#num_select_id_" + id);
            $(a).addClass("com_selectbtnon").parent().siblings().find("a").removeClass("com_selectbtnon");
            $scope.orderList.goodId = $(a).attr("goodId");
            $scope.orderList.num = $(a).text();
        }
        //换号码
        $scope.change_NUM = function () {
        	$scope.param.title = $scope.searchNum;//模糊查询
        	$scope.param.page = $scope.param.page + 1;
        	if($scope.NumList.length<$scope.param.pageSize){
                $scope.param.page = 1;
            }
            /*if($scope.NumList.length<$scope.param.pageSize){
                $scope.param.page = 1;
            }else{
                $scope.param.page = $scope.param.page + 1;
            }*/

            $scope.$broadcast("NumberListCtrl", $scope.param);
        }
        //查询号码
        $scope.search_NUM = function () {
            $scope.param.title = $scope.searchNum;
            $scope.$broadcast("NumberListCtrl", $scope.param);
        }
    }
]);
