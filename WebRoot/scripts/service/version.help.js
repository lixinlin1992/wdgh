/**
 * 2011-09-21
 * 蒋杰龙
 *
 * 版本控制接口
 */
var VERSION = {}

/**
 * 保存临时数据
 * @param key   主键名称
 * @param keyValue  主键值
 * @param tableName   进行版本控制的表名称
 * @param objectName  信息对象名称
 */
VERSION.versionCreate = function (key,keyValue,tableName,objectName,callBack){
    CORE.request("DS_VERSION_CONTROL",
        {data:"key="+key+"&keyValue="+keyValue+"&tableName="+tableName+"&objectName="+objectName+"&type=create"},
        function(body,header){
            if(header.code == 0){
                callBack(body,header);
            }else{
                CORE.error("发生错误",body);
            }
        }
    );
}




/**
 * 解除锁定编辑状态，提交正式版本数据
 * @param key   主键名称
 * @param keyValue  主键值
 * @param tableName   进行版本控制的表名称
 * @param callBack   回调函数
 */
VERSION.versionCommit = function (key,keyValue,tableName,sysCode,callBack){
    //获取对话框
    var _$versionCommitDlg = _createVersionNoteDlg()

    //版本提交对话框
    var _versionCommitDlgOpt ={
        title : "版本提交",
        width : "350",
        height : "200" ,
        modal : true,
        bgiframe : true,
        resizable:false,
        buttons:{
            '取消':function(){
                $("#versionCommitDlg").dialog("close");
            },
            '保存':function(){
                CORE.submitForm("DS_VERSION_COMMIT","versionCommitForm",
                    {data:"key="+key+"&keyValue="+keyValue+"&tableName="+tableName+"&sysCode="+sysCode},
                    function(body,header){
                        if(header.code == 0){
                            CORE.tip("版本提交成功");
                            callBack(body,header);
                        }else{
                            CORE.error("发生错误",body);
                        }
                        $("#versionCommitDlg").dialog("close");
                    }
                );
            }
        }
    };

    _$versionCommitDlg.dialog(_versionCommitDlgOpt);
}

/**
 * 版本操作权限检查
 * @param key
 * @param keyValue
 * @param tableName
 * @param callBack
 */
VERSION.permissionsCheck = function(key,keyValue,tableName,callBack){
    CORE.request("DS_VERSION_CONTROL_PERMISSIONS_CHECK",
        {data:"key="+key+"&keyValue="+keyValue+"&tableName="+tableName},
        function(body,header){
            if(header.code == 0){
                callBack(body,header);
            }else if(header.code == 2001){
                CORE.error(header.message+":"+body,body);
            }else{
                CORE.error("发生错误",body);
            }
        }
    );
}

/**
 * 版本撤销
 * @param id  版本号
 * @param objectName  对象名称
 */
VERSION.versionRevocation = function(key,keyValue,tableName,sysCode,objectName,callback){
    CORE.confirm("确定要撤销对 ["+objectName+"] 的修改吗？ 注意：撤销后本次修改将永久丢失",function(){
        CORE.request("DS_VERSION_REVOCATION",{data:"key="+key+"&keyValue="+keyValue+"&tableName="+tableName+"&sysCode="+sysCode},function(body,header){
            if(header.code == 0){
                CORE.tip("撤销成功");
                callback(body,header);
            }else if(header.code == 2001){
                CORE.error("警告！ "+body,body);
            }else{
                CORE.error("系统出现异常",body);
            }
        });
    });
}

/**
 * 批量版本提交
 * @param versionObject  参数个数{[key:"ID",keyvalue:"713",tablename:"RDC_CFG_PAGE",objectname:"objectName",syscode:"syscode"]}
 */
VERSION.versionCommitBatch = function(versionObject,callBack){
    //获取对话框
    var _$versionCommitDlg = _createVersionNoteDlg()

    //版本提交对话框
    var _versionCommitDlgOpt ={
        title : "版本批量提交",
        width : "350",
        height : "200" ,
        modal : true,
        bgiframe : true,
        resizable:false,
        buttons:{
            '取消':function(){
                $("#versionCommitDlg").dialog("close");
            },
            '保存':function(){
                CORE.submitForm("DS_VERSION_COMMIT_BATCH","versionCommitForm",
                    {data:"versionObject="+CORE.json2str(versionObject)},
                    function(body,header){
                        if(header.code == 0){
                            CORE.tip("提交成功");
                            if(callBack != undefined && typeof(callBack) === 'function' ){
                                callBack(body,header);
                            }
                        }else{
                            CORE.error("发生错误",body);
                        }
                        $("#versionCommitDlg").dialog("close");
                    }
                );
            }
        }
    };
    _$versionCommitDlg.dialog(_versionCommitDlgOpt);
}

/**
 * 批量撤销
 * @param versionObject  参数格式{[key:"ID",keyvalue:"713",tablename:"RDC_CFG_PAGE",objectname:"objectName",syscode:"syscode"]}
 * @param callBack
 */
VERSION.versionRevocationBatch = function(versionObject,callBack){
    CORE.confirm("确定要撤销所选择的所有记录吗？ 注意：撤销后本次修改将永久丢失",function(){
        CORE.request("DS_VERSION_REVOCATION_BATCH",{data:'versionObject='+CORE.json2str(versionObject)},function(body,header){
            if(header.code == 0){
                CORE.tip("撤销成功");
                if(callBack != undefined && typeof(callBack) === 'function' ){
                    callBack(body,header);
                }
            }else{
                CORE.error("系统出现异常",body);
            }
        });
    });
}

/**
 * 创建版本提交备注对话框
 */
function _createVersionNoteDlg(){
    var _$versionCommitDlg = $("#versionCommitDlg");
    if(_$versionCommitDlg.length == 0){
        var _versionCommitDiv = "<div id='versionCommitDlg' style='display:none;'>" +
                                "<form name='versionCommitForm'>" +
                                    "<table align='center'>" +
                                        "<tr class='formRow'>" +
                                            "<td class='formLabel'>提交备注：</td>" +
                                            "<td class='formLabel'><textarea style='width:220px;height:100px' name='versionNote'></textarea></td>" +
                                        "</tr>" +
                                    "</table>" +
                                "</form>" +
                            "</div>"
        $("body").append(_versionCommitDiv);
        _$versionCommitDlg = $("#versionCommitDlg");
    }

    return _$versionCommitDlg;
}