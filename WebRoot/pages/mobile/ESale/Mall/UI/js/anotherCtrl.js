app.registerCtrl("TestCtrl",["$scope","$http",function($scope,$http){
    $scope.name="hello";

    $scope.clickMe=function(){
        $scope.name = "kinz";
    };

    $http.get("ESale/Mall/UI/pages/test.json").success(function(data){
        $scope.persons=data;
    });
}]);