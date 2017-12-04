app.registerCtrl("businessAcceptanceCtrl", ["$scope", "$srhttp", "$rootScope",
    function($scope, $srhttp, $rootScope) {

        $rootScope.appTitle = "业务受理";
        //底部导航样式变化
        setTimeout(function() {
            replaceClass('home');
        }, 100);
        $scope.rows = [];
        $scope.form = {
            NAME: "",
            ID: ''
        };
        $scope.pageSize = 8;

        // 获取数据
        $scope.loadList = function() {
            $srhttp.post("!ESale/Business/VirtualService/Network/~query/Q_ACCEPT_TYPE_LIST", {
                "page": 1,
                "pageSize": $scope.pageSize

            }, function(data) {
                if (data.header.code == 0) {
                    $scope.rows = data.body.rows;
                    if (data.body.rows.length < $scope.pageSize) {
                        $("a.more_btn").text('已无更多数据');
                    }
                } else {
                    alert("获取不到数据")
                }
            })
        }
        $scope.loadList();

        // 点击选择业务事件
        $scope.acceptance_select = function(index, name, id) {
            var a = $("#acceptance_select_id_" + index);
            a.addClass('com_selectbtnon').parent().siblings().find("a").removeClass('com_selectbtnon');
            $scope.form.NAME = name;
            $scope.form.ID = id;
            $("#submit_btn").show();
        }

        // 加载更多事件
        $scope.listShowAdd = function() {
            $scope.pageSize += 8;
            $scope.loadList();

        }

        //下一步事件
        /*$scope.nextPage = function() {
            Local.saveStoreJson("rowsParams", $scope.form);
            location.href = "#/businessAcceptance_2";
        }*/
        $scope.nextPage = function() {
            var a = $('.com_selectbtnon').text();
            Local.saveStoreJson("form", $scope.form);
            if (a == "套餐变更") {
                location.href = "#/changePackage/1";
            } else if (a == "积分兑换") {
                location.href = "#/pointsFor";
            } else if (a == "密码修改") {
                location.href = "#/servicePasswordChange";
            } else if (a == "进度查询") {
                location.href = "#/progressQuery";
            } else if (a == "个人信息") {
                location.href = "#/personalInformation";
            } else if (a == "呼叫转移") {
                location.href = "#/callForward";
            } else {
                location.href = "#/businessAcceptance_2";
            }
        }

    }
]);
