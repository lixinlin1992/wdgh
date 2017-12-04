/**
 * Created by dlz on 2017/6/19.
 */
//工会概况列表参数--start
var params = {
    fitColumns: true,
    rownumbers:true,
    // onClickRow: getFactorRow,
    columns: [
        [
            {field: 'ID', title: 'ID', hidden: true, sortable: false, align: 'center', width: 0},
            {
                field: 'OPT',
                title: '操作',
                sortable: false,
                align: 'center',
                width: 180,
                formatter: function (cell, row, index) {
                    var view = '<a class="btn_edit" href="javascript:void(0);"  onclick="viewLegalAid(\'' + row.ID + '\');">查看回答</a>';
                    var edit = '<a class="btn_edit" href="javascript:void(0);"  onclick="editLegalAid(\'' + row.ID + '\');">修改</a>';
                    var del = '<a class="btn_delete" href="javascript:void(0);"  onclick="delLegalAid(\'' + row.ID + '\');">删除</a>';
                    return view + "&nbsp;" + edit+ "&nbsp;" + del;
                }
            },
            {field: 'TITLE', title: '标题', sortable: false, align: 'center', width: 220},
            {field: 'CONTENT', title: '提问内容', sortable: false, align: 'center', width: 280},
            {field: 'VIEW_TIMES', title: '阅读次数', sortable: false, align: 'center', width: 80},
            {field: 'CREATE_TIME', title: '创建时间', sortable: false, align: 'center', width: 100},
            {field: 'CREATE_USER', title: '创建人', sortable: false, align: 'center', width: 100}
        ]
    ]
};
//工会概况列表参数--end
/**
 * rdcp.JS框架初始化
 */
rdcp.ready(function () {
    //生成表格rdcp.grid(tableId,url,formName,表格参数)
    rdcp.grid('listdt', '!gh/info/~query/Q_LEGAL_AID_LIST', "searchForm", params);
    rdcp.grid('detail_list', '!gh/info/~query/Q_LEGAL_AID_DETAIL_LIST', "detailForm", detailParams);

});
//修改提问
function editLegalAid(id){
    $("#opt").val("edit");
    rdcp.form.load("degalAidForm","!gh/info/~query/Q_LOAD_LEGAL_AID_FORM",{"id":id},function(data){
        rdcp.dialog(editOpts);
    });
}
//添加提问
function addLegalAid(){
    $("#opt").val("add");
    rdcp.dialog(editOpts);
}
//删除提问
function delLegalAid(id){
    $.messager.confirm("警告", "您确定要删除该条数据吗？",
    function (yesBtn) {
        if(yesBtn) {
            rdcp.request("!gh/info/~query/Q_UPDATE_LEGAL_AID", {"legal_aid_id":id,"opt":"del"}, function(data){
                $.messager.alert('提示', "删除成功！", 'info');
                rdcp.grid.reload('listdt');
            });
        }
    });
}
function delLegalAidDetail(id){
    $.messager.confirm("警告", "您确定要删除该条数据吗？",
    function (yesBtn) {
        if(yesBtn) {
            rdcp.request("!gh/info/~query/Q_UPDATE_LEGAL_AID", {"aid_id":id,"opt":"del_detail"}, function(data){
                $.messager.alert('提示', "删除成功！", 'info');
                rdcp.grid.reload('detail_list');
            });
        }
    });
}

//查看回答
function viewLegalAid(id){
    $("#aid_id").val(id);
    rdcp.dialog(detailOpts);
    rdcp.grid.reload('detail_list');
}

var editOpts = {
    id : "degalAidDlg",
    title:"修改提问",
    width : "400",
    height : "330",
    buttons : [
        {
            text : "提交",
            handler : function(){
                var title = $("#title").val();
                var content = $("#content").val();
                if(title == ""){
                    $.messager.alert("提示","请输入标题!","info");
                    return;
                }
                if(content == ""){
                    $.messager.alert("提示","请输入内容!","info");
                    return;
                }
                rdcp.form.submit("degalAidForm", {
                    url: "!gh/info/~query/Q_UPDATE_LEGAL_AID" ,
                    success: function (data) {
                        $.messager.alert('提示', '操作成功！', 'info',function () {
                            rdcp.grid.reload('listdt');
                            $("#degalAidDlg").dialog("close");
                        });
                    }
                }, {"mask": true});
            }
        },
        {
            text : "取消",
            handler : function(){
                $("#degalAidDlg").dialog("close");
            }
        }
    ]
};

var detailOpts = {
    id : "detailDlg",
    title:"查看回答",
    width : "600",
    height : "530",
    buttons : [
        {
            text : "取消",
            handler : function(){
                $("#detailDlg").dialog("close");
            }
        }
    ]
};

var detailParams = {
    fitColumns: true,
    rownumbers:true,
    // onClickRow: getFactorRow,
    columns: [
        [
            {field: 'ID', title: 'ID', hidden: true, sortable: false, align: 'center', width: 0},
            {
                field: 'OPT',
                title: '操作',
                sortable: false,
                align: 'center',
                width: 80,
                formatter: function (cell, row, index) {
                    var del = '<a class="btn_delete" href="javascript:void(0);"  onclick="delLegalAidDetail(\'' + row.ID + '\');">删除</a>';
                    return del;
                }
            },
            {field: 'CONTENT', title: '回答内容', sortable: false, align: 'center', width: 180},
            {field: 'LIKE_TIMES', title: '阅读次数', sortable: false, align: 'center', width: 80},
            {field: 'CREATE_TIME', title: '创建时间', sortable: false, align: 'center', width: 100},
            {field: 'CREATE_USER', title: '创建人', sortable: false, align: 'center', width: 100}
        ]
    ]
};

