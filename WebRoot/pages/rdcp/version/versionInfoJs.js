/**
 * User: bearangel
 * 版本查询JS
 **/

//查询处理器列表
var versionInfoGridParam = {
    colModel:[
        {
            name:"ID",
            index:"ID",
            width:100,
            hidden:true
        },
        {
            name:"名称",
            index:"OBJ_NAME",
            width:80
        },
        {
            name:"版本号",
            index:"VERSION_NO",
            width:60
        },
        {
            name:"系统名称",
            index:"bs.NAME",
            width:70
        },
        {
            name:"表名",
            index:"TABLE_NAME",
            width:150
        },{
            name:"状态",
            index:"STATUS",
            width:60,
            formatter:function(cell, options, row, tr, td) {
                if(row['STATUS'] == '0'){
                    return "编辑中";
                }else if(row['STATUS'] == "1"){
                    return "已提交";
                }
            }
        },
        {
            name:"用户",
            index:"EDIT_USER",
            width:80
        },
        {
            name:"开始编辑时间",
            index:"EDIT_START_TIME",
            width:120
        },
        {
            name:"编辑结束时间",
            index:"EDIT_END_TIME",
            width:120
        },
        {
            name:"最近一次保存时间",
            index:"LAST_SAVE_TIME",
            width:120
        },
        {
            name:"操作类型",
            index:"ACTION",
            width:70,
            formatter:function(cell, options, row, tr, td) {
                var type = "";
                switch(cell){
                    case "1" :
                        type = "创建";
                        break;
                    case "2" :
                        type = "修改";
                        break;
                    case "3" :
                        type = "删除";
                        break;
                    default :
                        type = "";

                }
                return type;
            }
        },
        {
            name:"版本备注",
            index:"NOTE",
            width:200
        },
        {
            name:"对象名称",
            index:"KEY_COL",
            width:10,
            hidden:true
        },
        {
            name:"对象值",
            index:"OBJ_ID",
            width:10,
            hidden:true
        },
        {
            name:"系统名称",
            index:"SYS_CODE",
            width:10,
            hidden:true
        },
        {
            name:"EDIT_USER",
            index:"EDIT_USER",
            hidden:true
        },
        {
            name:"操作",
            index:"operate",
            width:70,
            sortable:false,
            formatter:function(cell, options, row, tr, td) {
                var _button = "";
                if(row['STATUS'] == '0'){
                    //_button += "<input value='撤销' type='button' class='grid_button' onclick='_versionRevocation(\""+row['ID']+"\",\""+row['OBJ_NAME']+"\")'>";
                    _button += GRID.button({className:"btn_undo",onclick:"_versionRevocation('"+row['KEY_COL']+"','"+row['OBJ_ID']+"','"+row['TABLE_NAME']+"','"+row['SYS_CODE']+"','"+row['OBJ_NAME']+"');",title:"撤销修改"});
                    //_button += "<input value='提交' type='button' class='grid_button' onclick=''>";
                    _button += GRID.button({className:"btn_commit u_"+row["STATUS"]+"_"+row["EDIT_USER"],onclick:"_versionCommit('"+row['KEY_COL']+"','"+row['OBJ_ID']+"','"+row['TABLE_NAME']+"','"+row['SYS_CODE']+"')",title:"提交修改"});
                }else if(row['STATUS'] == "1"){
                    //_button += "<input value='回滚' type='button' class='grid_button' onclick='_versionRollBack(\""+row['ID']+"\",\""+row['OBJ_NAME']+"\")'>";
                    _button += GRID.button({className:"btn_undo",onclick:"_versionRollBack('"+row['ID']+"','"+row['OBJ_NAME']+"','"+row['VERSION_NO']+"');",title:"回滚到该版本"});
                }
                return _button;
            }
        }
    ],
    caption : "版本信息列表",
    multiselect:true,
    width:"98%",
    rowNum : 40,
    pager: "#versionInfoPagerdt",
    loadComplete:versionsInfoLoadComplete,
    onSelectRow:function(){
        var a = $("#versionInfoList").getGridParam("selarrrow");
    }
};



$(function(){
    GRID.create("#versionInfoList","DS_VERSION_INFO_LIST",versionInfoGridParam,"versionSearchForm");
});

/**
 * 版本撤销
 * @param id
 * @param objectName
 */
function _versionRevocation(key,keyValue,tableName,sysCode,objectName){
    VERSION.versionRevocation(key,keyValue,tableName,sysCode,objectName,function(){
        GRID.reload("versionInfoList");
    });
}

/**
 * 版本回滚
 * @param id
 * @param objectName
 */
function _versionRollBack(id,objectName,version){
    CORE.confirm("确定要将 ["+objectName+"] 回滚到版本 ["+version+"] 吗？",function(){
        CORE.request("DS_VERSION_ROLLBACK",{data:'versionId='+id},function(body,header){
            if(header.code == 0){
                CORE.tip("回滚成功");
            }else{
                CORE.error("系统出现异常",body);
            }
            GRID.reload("versionInfoList");
        });
    });
}

/**
 * 版本提交
 * @param keyCol
 * @param objectId
 * @param tableName
 * @param sysCode
 */
function _versionCommit(keyCol,objectId,tableName,sysCode){
    VERSION.versionCommit(keyCol,objectId,tableName,sysCode,function(body,header){
        if(header.code == 0){
            GRID.reload("versionInfoList");   //刷新参数列表
        }
    });
}

/**
 * 批量版本提交
 */
function _versionCommitBatch(){
    var _grid = $("#versionInfoList");
    var rowIds = _grid.getGridParam("selarrrow");
    if(rowIds.length == 0 ){
        CORE.info("没有选择任何版本记录！！");
        return ;
    }

    var _data = [];
    for(var i=0; i<rowIds.length; i++){
        var _rowData= _grid.getRowData(rowIds[i]);
        var _dataArray = {};
        _dataArray['key'] = _rowData['对象名称'];
        _dataArray['keyvalue'] = _rowData['对象值'];
        _dataArray['tablename'] = _rowData['表名'];
        _dataArray['objectname'] = _rowData['名称'];
        _dataArray['syscode'] = _rowData['系统名称'];
        _data.push(_dataArray);
    }

    VERSION.versionCommitBatch(_data,function(){
        GRID.reload("versionInfoList");   //刷新参数列表
    });
}

/**
 * 批量撤销
 */
function _versionRevocationBatch(){
    var _grid = $("#versionInfoList");
    var rowIds = _grid.getGridParam("selarrrow");
    if(rowIds.length == 0 ){
        CORE.info("没有选择任何版本记录！！");
        return ;
    }

    var _data = [];
    for(var i=0; i<rowIds.length; i++){
        var _rowData= _grid.getRowData(rowIds[i]);
        var _dataArray = {};
        _dataArray['key'] = _rowData['对象名称'];
        _dataArray['keyvalue'] = _rowData['对象值'];
        _dataArray['tablename'] = _rowData['表名'];
        _dataArray['objectname'] = _rowData['名称'];
        _dataArray['syscode'] = _rowData['系统名称'];
        _data.push(_dataArray);
    }

    VERSION.versionRevocationBatch(_data,function(){
        GRID.reload("versionInfoList");   //刷新参数列表
    });
}