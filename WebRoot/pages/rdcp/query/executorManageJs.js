/**
 * User: bearangel
 * 执行器管理JS
 **/

//查询处理器列表
var exeManageGridParam = {
    colModel:[
        {
            name:"ID",
            index:"ID",
            width:100,
            hidden:true
        },
        {
            name:"执行器名字",
            index:"NAME",
            width:100
        },
        {
            name:"执行器编码",
            index:"CODE",
            width:100
        },
        {
            name:"执行器类名",
            index:"CLASS",
            width:200
        },{
            name:"结果类型",
            index:"RESULTS",
            width:100
        },
        {
            name:"处理器说明",
            index:"NOTE",
            width:120
        },
        {
            name:"操作",
            index:"operate",
            width:40,
            sortable:false,
            align:"center",
            formatter:function(cell, options, row, tr, td) {
                return GRID.button({className:"btn_edit",onclick:"_openEditorExeDialog('"+row["ID"]+"');",title:"修改"})+
                        GRID.button({className:"btn_delete",onclick:"_delExecutor('"+row["ID"]+"','"+row["NAME"]+"');",title:"删除"});
                /*
                return "<input value='编辑' type='button' class='grid_button' onclick='_openEditorExeDialog(\""+row['ID']+"\");'>" +
                        "<input value='删除' type='button' class='grid_button' onclick='_delExecutor(\""+row['ID']+"\",\""+row['NAME']+"\");'>";
                        */
            }
        }
    ],
    caption : "查询执行器列表",
    multiselect:false,
    width:"98.5%",
    pager: "#exeManagerPagerdt"
};


var _addExecutorDlgOpt ={
    title : "添加执行器",
    width : "450",
    height : "350" ,
    modal : true,
    bgiframe : true,
    resizable:false,
    buttons:{
        '取消':function(){
            $("#executorDialog").dialog("close");
        },
        '保存':function(){
            CORE.submitForm("DS_CFG_EXECUTOR_ADD","addExecutorForm",{},function(body,header){
                if(header.code == 0){
                    CORE.tip("添加成功");
                    GRID.reload("exeManagerList");
                    $("#executorDialog").dialog("close");
                }else{
                    CORE.error("添加失败",body);
                }
            });
        }

    }
};

var _editorExecutorDlgOpt ={
    title : "编辑执行器",
    width : "450",
    height : "350" ,
    modal : true,
    bgiframe : true,
    resizable:false,
    buttons:{
        '取消':function(){
            $("#executorDialog").dialog("close");
        },
        '保存':function(){
            CORE.submitForm("DS_CFG_EXECUTOR_EDITOR","addExecutorForm",{},function(body,header){
                if(header.code == 0){
                    CORE.tip("修改成功");
                    GRID.reload("exeManagerList");
                    $("#executorDialog").dialog("close");
                }else{
                    CORE.error("修改失败",body);
                }
            });
        }

    }
};


$(function(){
    GRID.create("#exeManagerList","DS_QUERY_EXECUTOR_LIST",exeManageGridParam,"exeManageSearchForm");
});

/**
 * 打开添加执行器对话框
 */
function _openAddExeDialog(){
    document.getElementById("addExecutorForm").reset();
    $("#executorDialog").dialog(_addExecutorDlgOpt);
}

/**
 * 打开编辑执行器对话框
 */
function _openEditorExeDialog(id){
    CORE.loadForm("DS_LOAD_QUERY_EXECUTOR","addExecutorForm",{
        'data':"id="+id,
        'loadComplete':function(){
            $("#executorDialog").dialog(_editorExecutorDlgOpt);
        }
    });
}

function _delExecutor(id,name){
    CORE.confirm("确定要删除\""+name+"\"执行器,注意：删除后将不可能恢复",function(){
        CORE.request("DS_CFG_EXECUTOR_DEL",{'data':"id="+id},function(body,header){
            if(header.code == 0){
                CORE.tip("删除成功");
                GRID.reload("exeManagerList");
            }else{
                CORE.error("删除失败",body);
            }
        });
    });
}