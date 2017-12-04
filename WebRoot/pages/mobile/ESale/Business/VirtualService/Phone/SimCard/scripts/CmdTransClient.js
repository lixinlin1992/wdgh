var CLIENT_CONFIG = {
    //    SERVER_URL_BASE: 'http://112.96.28.78:8080/',
    SERVER_URL_BASE: APP_CONFIG.SERVER_URL,
    DS_URL_BASE: APP_CONFIG.SERVER_URL + '/!sale/rwcard/~java/RWCardCmdTrans.',

    //    SERVER_URL_BASE: 'http://localhost:8080/rwcard/',
    SESSIION_ID: "",
    COMMON_TYPE: 4,
    CUST_NUMBER: "",
    RUNNING_FLAG: false,

    SERVER_WAIT_TIME: 10000,
    //服务端获取指令的等待的时间，10秒钟
    CMD_IDLE_TIMEOUT: 15 * 60 * 1000,

    OnConnect: function (orderId, agentSessionId) {
    },
    OnDisconnect: function () {
    },
    OnIdle: function (idleTime) {
    },
    OnMessage: function (msg) {
    },
    OnSuccess: function () {
    },
    OnFail: function () {
    },
    OnNetWorkStatus: function (speed, status) {
    },
    OncheckNetCardStatus: function () {
    }
};

var RWCardClient = {
    LAST_CMD_TIME: -1,
    //上一次获取到指令的时间
    CONNECT_STATUS: 0,
    //连接状态，0 未连接，1 已连接
    EXCEPTION: '',
    //异常消息
    WAITTIME: -1,
    //继续等待时间
    NETWORK_STATUS: 0,
    //网络状态，数字越小表示网络消耗波动小，即网络越稳定
    NETWORK_SPEED: 0,
    //网络状态，数字越小表示网速越快：0 平均响应在1秒内；1 平均响应在3秒内；2 平均响应在5秒内；3 平均响应在7秒内；4 平均响应在7秒以上
    AVG_NETWORK_EXPEND: -1,
    //平均网络消耗时间
    MIN_NETWORK_EXPEND: 999999,
    //网络消耗最小时间
    MAX_NETWORK_EXPEND: -1,
    //网络消耗最大时间
    LAST_NET_WORK_EXPEND: -1,
    //上一次网络消耗时间
    NETWORK_REQUEST_COUNT: 0,
    //网络请求计数器
    EXPEND_IN_TIMES: [],
    //连续N次的网络消耗
    INVALID: false,
    //接收到非法请求的时候设置为true
    isIdle: function () {
        return new Date().getTime() - RWCardClient.LAST_CMD_TIME - CLIENT_CONFIG.CMD_IDLE_TIMEOUT > 0;
    },

    updateConnect: function (connected, param) {
        if (connected) {
            try {
                if (this.CONNECT_STATUS == 0) {
                    this.CONNECT_STATUS = 1;

                }

                var fail = function (msg) {
                 RWCardClient.resultReturn(msg);
                };
                var haveBluetooth = function(msg) {
                    //alert(msg);
                    if (msg == "") {
                        btFlag = 4;
                        check(param);
                    } else {
                        CLIENT_CONFIG.OnConnect(param, "");
                    }
                }

                RWCardClient.resultWait();
                makecard.isHaveBluetooth(haveBluetooth, fail, []);

            } catch (err) {
                RWCardClient.resultException("连接网点异常:" + err.message);
                alert(err.message);
            }
        } else {
            try {
                if (this.CONNECT_STATUS == 1) {
                    this.CONNECT_STATUS = 0;

                }
                CLIENT_CONFIG.OnDisconnect();
            } catch (err) {
                RWCardClient.resultException("与网点断开异常:" + err.message);
                alert(err.message);
            }

        }

    },

    setSessionId: function (sessionId) {
        console.log("setSessionId>....................." + sessionId);

        sessionStorage._CLIENT_CONFIG_SESSIION_ID = sessionId;

        //当sessionId停止轮询
        try {

            if (CLIENT_CONFIG.SESSIION_ID == "") {
                CLIENT_CONFIG.SESSIION_ID = sessionId;
                RWCardClient.requestParam();
            } else {
                CLIENT_CONFIG.SESSIION_ID = sessionId;
            }
            return 0;
        } catch (e) {
            return 1;
        }

    },

    resultReturn: function (result) {
        result = encodeURIComponent(result);
        function success(msg) {
            RWCardClient.requestParam();
        }
        console.log("resultReturn:"+result);
        CommandTransferClient.resultReturn(success, success, [result]);
    },

    resultException: function (exception) {
        exception = encodeURIComponent(exception);
        console.log("resultException >.....................");
        function success(msg) {
            console.log(msg);
            RWCardClient.requestParam();
        }

        CommandTransferClient.excepitonReturn(success, success, [exception]);
    },

    resultWait: function () {
        function success(msg) {
            console.log(msg);
        }

        CommandTransferClient.waitReturn(success, success, []);
        RWCardClient.WAITTIME = -1;
    },

    /**
     * 计算请求时间
     * @param expend 网络消耗
     */
    analyzeNetWork: function (expend) {
        var idx = this.NETWORK_REQUEST_COUNT % 6;
        if (this.NETWORK_REQUEST_COUNT > 0 && idx == 0) {
            //已经满了6次，进行相关的计算
            var totalaExp = 0;
            var totalVol = 0;
            for (var i = 0; i < this.EXPEND_IN_TIMES.length; i++) {
                totalaExp += this.EXPEND_IN_TIMES[i];
                if (i > 0) totalVol += Math.abs(this.EXPEND_IN_TIMES[i] - this.EXPEND_IN_TIMES[i - 1]);
            }
            this.AVG_NETWORK_EXPEND = totalaExp / this.EXPEND_IN_TIMES.length;
            //计算网络状态
            this.NETWORK_STATUS = totalVol / this.EXPEND_IN_TIMES.length;
            //计算网络速度
            this.NETWORK_SPEED = this.AVG_NETWORK_EXPEND < 50 ? 0 : (this.AVG_NETWORK_EXPEND < 100 ? 1 : (this.AVG_NETWORK_EXPEND < 250 ? 2 : (this.AVG_NETWORK_EXPEND < 3000 ? 3 : 4)));
            CLIENT_CONFIG.OnNetWorkStatus(this.NETWORK_SPEED, this.NETWORK_STATUS);
        }
        this.EXPEND_IN_TIMES[idx] = expend;
        this.NETWORK_REQUEST_COUNT++;

        this.MIN_NETWORK_EXPEND = expend < this.MIN_NETWORK_EXPEND ? expend : this.MIN_NETWORK_EXPEND;
        this.MAX_NETWORK_EXPEND = expend > this.MAX_NETWORK_EXPEND ? expend : this.MAX_NETWORK_EXPEND;
        this.LAST_NET_WORK_EXPEND = expend;
    },

    /*
     返回样例：
     {"body":{"command":"connect","createTime":1397126488574,"dist":"AABBCCDD","fetchTime":1397126503472,"param":"","src":
     "0308C67CB4600DDD3BF5B26477CC3D1C","type":0},"header":{"alert":true,"code":0,"message":"接收到指令"}}
     */
    requestParam: function () {
        console.log("requestParam>.....................");

        function success(responText) {
            console.log("success>....................." + responText);
            try {
                var _body;
                var _resultJson = JSON.parse(responText);
                _body = _resultJson.body;
                if (_body.type == 0) {
                    if ("listcard" == _body.command) {
                        var callback = function (msg) {
                            RWCardClient.resultReturn(msg);
                        };
                        var fail = function (msg) {
                            RWCardClient.resultReturn(msg);
                        };
                        makecard.listCard(callback, fail, []);
                    } else if ("connect" == _body.command) {
                        var callback = function (msg) {
                            RWCardClient.resultReturn(msg);
                        };
                        var fail = function (msg) {
                            RWCardClient.resultReturn(msg);
                        };
                        makecard.connectCard(callback, fail, ['ReaderName']);

                    } else if ("transmitAPDU" == _body.command) {
                        var callback = function (msg) {
                            RWCardClient.resultReturn(msg);
                        };
                        var fail = function (msg) {
                            RWCardClient.resultReturn(msg);
                        };
                        makecard.transmitAPDU(callback, fail, ['ReaderName',_body.param]);
                    } else if ("disconnect" == _body.command) {
                        var callback = function (msg) {
                            RWCardClient.resultReturn(msg);
                        };
                        var fail = function (msg) {
                            RWCardClient.resultReturn(msg);
                        };
                        makecard.disconnectCard(callback, fail, ['ReaderName']);
                    }else if ("queryUsimNo" == _body.command) {
                        var callback = function (msg) {
                            RWCardClient.resultReturn(msg);
                        };
                        var fail = function (msg) {
                            RWCardClient.resultReturn(msg);
                        };
                        makecard.queryUsimNo(callback, fail, []);
                    } else if ("queryCardImsi" == _body.command) {
                        var callback = function (makeResult) {
                            RWCardClient.resultReturn(makeResult);

                        };
                        var fail = function (msg) {
                            RWCardClient.resultReturn(msg);

                        };
                        makecard.queryCardImsi(callback, fail, []);
                    } else if ("QueryCard" == _body.command) {
                        var callback = function (msg) {
                            var makeResult;
                            if (msg.length == 20) {
                                makeResult = this.TransmitCardErr("", "", "", "", "", msg);
                            } else if (msg == "-2") {
                                makeResult = this.TransmitCardErr("", "", "", "", "此卡非白卡", "-1");
                            } else {
                                makeResult = this.TransmitCardErr("", "", "", "", "获取白卡卡号失败", "-1");
                            }
                            RWCardClient.resultReturn(makeResult);

                        };

//                        var fail = function(msg) {
//                            RWCardClient.resultReturn(msg);
//
//                        };
                        makecard.readCardNo(callback, callback, [_body.param]);


                    } else if ("QueryIDCardInfo" == _body.command) {
                        result = encodeURIComponent(IDCard.readCardSync());
                    }
                } else if (_body.type == 1) {
                    RWCardClient.updateConnect(true);
                    result = RwCard.TransmitCard(_body.param).replace(/\s+/g, "");
                } else if (_body.type == 4) {
                    if ("essInsertCard" == _body.command) {
                        var params = _resultJson.body.param.split("||");

                        var callback = function (makeResult) {
                            RWCardClient.resultReturn(makeResult);

                        };
                        var fail = function (msg) {
                            RWCardClient.resultReturn(msg);

                        };
                        makecard.insertCard(callback, fail, [params[0], params[1], params[2], params[3]]);

                    } else if ("cbssInsertCard" == _body.command) {
                        var params = eval('(' + _resultJson.body.param + ')');

                        var callback = function (msg) {

                            var makeResult;
                            if (msg == "0") {
                                makeResult = this.TransmitCardErr("", "", "", "", "", 0);
                            } else {
                                makeResult = this.TransmitCardErr(params.SimCardNo, msg, "写入白卡失败", "", "", -1);
                            }
                            RWCardClient.resultReturn(makeResult);
                        };
                        var fail = function (msg) {
                            RWCardClient.resultReturn(msg);

                        };

                        makecard.insertCard(callback, fail, [params.SimCardNo, params.Imsi, params.SerialNumber, params.Option, params.OperFlag]);
                    }

                } else if (_body.type == 3) {
                    //连接指令
                    var _orderId = _body.param;
                    if (_orderId == undefined) _orderId = "";

                    if ("begin" == _body.command) {
                        RWCardClient.updateConnect(true, _body.param);
                    } else if ("end" == _body.command) {
                        RWCardClient.updateConnect(false);
                    } else if ("success" == _body.command) {
                        CLIENT_CONFIG.OnSuccess(_body.param);
                    }

                    else if ("fail" == _body.command) CLIENT_CONFIG.OnFail(_body.param);
                    //CLIENT_CONFIG.OnDisconnect();
                } else if (_body.type == 2) {
                    CLIENT_CONFIG.OnMessage(_body.param);
                    RWCardClient.resultReturn("0");
                }
            } catch (e) {
                alert(e.message);
            }


        }

        function error(msg) {
            RWCardClient.requestParam();
        }

        try {
            CommandTransferClient.startCheckMsg(success, error, [APP_CONFIG.SERVER_URL, CLIENT_CONFIG.SESSIION_ID]);
        } catch (err) {
            alert(err.message);
        }

    },

    TransmitCardErr: function (IccId, ErrCode, ErrInfo, SimStateCode, Message, Result) {
        var params = "{'IccId':'" + IccId + "','ErrCode':'" + ErrCode + "','ErrInfo':'" + ErrInfo + "','SimStateCode':'" + SimStateCode + "','Message':'" + Message + "','Result':'" + Result + "'}";
        alert(params);
        return encodeURIComponent(params);
    }
};
