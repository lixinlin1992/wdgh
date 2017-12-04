/**
 * @(#)intf.js.js 2015/12/21 15:56
 * CopyRight 2015. Sunrise Tech Ltd. All rights reserved
 *
 * @depend  jquery-1.11.1.min.js
 * @depend  angular.min.js
 * @depend  app.js
 * @depend  config.js
 * @depend  mobile_framework.js
 * @depend  rdcp.string.js
 * @depend  jsonpath-0.8.0.js
 * @depend local.js
 * @depend ajax.js
 *
 * @author 张金凌
 */


/**
 * 向Angular框架中注册IntfCtrl组件
 */
app.controller("IntfCtrl",
        ["$scope", "$srhttp", "$rootScope", "$location","$timeout", function ($scope, $srhttp, $rootScope, $location,$timeout) {

            //请求后台进行自动登录校验
            $scope.access = function () {
                //向后台发送请求
                $srhttp.get("!System/Intf/~sysIntf/access/" + $scope.info.business + "/" + $scope.info.key,
                        {}, $scope.accessDone);
            };

            //请求后台自动登录校验后的操作
            $scope.accessDone = function (data) {
                console.log("System/Intf: "+data);
                if (0 == data.head.code) {
                    try {
                        //保存登录的用户信息
                        var userInfo = {
                            body:data.body.user
                        };
                        Local.saveStoreJson(sys.loginKey, userInfo);
                        Local.saveStore(login.KEY_LOGIN_LOGIN_NAME, userInfo.body.account);
                    }catch(e){
                        console.log(e.message);
                    }

                    //获取要跳转的页面地址
                    var url = data.body.url;
                    location.href = url;
                } else {
                    //TODO: 跳转到错误信息页面
                    location.href=APP_CONFIG.HOME_PAGE;
                }
            };

            //跳转到原来的登录页
            $scope.go2NormalIndex = function () {
                location.href=APP_CONFIG.LOGIN_PAGE;
            };

            $scope.getAccessInfo = function () {
                if (!window.$$DeviceReady) {
                    //setTimeout($scope.getAccessInfo(), 100);
                    console.log("System/Intf: Device not ready");
                    $timeout($scope.getAccessInfo,100);
                } else {
                    console.log("System/Intf: Device is ready");
                    try {
                        //在开始时调用Cordova插件的函数以获取业务接入请求数据
                        SysIntf.getAccessInfo(function (data) {
                            console.log("System/Intf: " + data);
                            //判断是否有传入外部接入信息
                            if (data == undefined || data == null || $.trim(data)=="") {
                                //没有传入接入信息，直接跳转到原有的登录页面
                                $scope.go2NormalIndex();
                                return;
                            }

                            //解析数据
                            try {
                                var json = rdcp.str2json(data);

                                $scope.info = {
                                    business: jsonPath(json, "$.body.business"),
                                    key: jsonPath(json, "$.body.key")
                                };

                                if ($scope.info.business == undefined || $.trim($scope.info.business) == "" ||
                                        $scope.info.key == undefined || $.trim($scope.info.key) == "") {
                                    //没有定义接入信息，直接跳转到原有的登录页面
                                    $scope.go2NormalIndex();
                                    return;
                                }

                                //请求登录
                                $scope.access();
                            } catch (e) {
                                console.error("System/Intf: " + e.message);
                                //由于解析的数据不正确，直接跳转到原来的首页
                                $scope.go2NormalIndex();
                                return;
                            }


                        });
                    } catch (e) {
                        console.error("System/Intf: " + e.message);
                        alert(e.message);
                    }
                }
            };

            $scope.getAccessInfo();
        }]);