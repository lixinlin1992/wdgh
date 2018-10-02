//审批稿件列表参数--start
var params = {
    fitColumns: true,
    rownumbers:true,
    // onClickRow: getFactorRow,
    columns: [
        [
            {field: 'ID', title: 'ID', hidden: true, sortable: false, align: 'center', width: 0},
            {
                field: 'OPT',
                title: '审批',
                sortable: false,
                align: 'center',
                width: 100,
                formatter: function (cell, row, index) {
                    var del = '<a class="btn_view" href="javascript:void(0);"  onclick="viewManu(\'' + row.ID + '\');">预览</a>';
                    var edit='<a class="btn_edit" href="javascript:void(0);"  onclick="editManu(\'' + row.ID + '\');">修改</a>';
                    var audit = '<a class="btn_commit" href="javascript:void(0);"  onclick="approveManu(\'' + row.ID + '\');">审批</a>';
                    var publish = '<a class="btn_edit" href="javascript:void(0);"  onclick="publish(\'' + row.ID + '\');">发布新闻</a>';
                    var html = del;
                    if(row["STATE"]==1)
                      html += edit+audit;
                    else if(row["STATE"]==3)
                      html += "&nbsp;"+publish;
                    return html;
                }
            },
            {field: 'DEPT_NAME', title: '单位', sortable: false, align: 'center', width: 100},
            {field: 'COMPANY', title: '标题', sortable: false, align: 'center', width: 100},
            {field: 'NAME', title: '投稿人', sortable: false, align: 'center', width: 80},
            {field: 'STATE', title: '状态', sortable: false, align: 'center', width: 80,
                formatter: function(value, row, index){
                    if (value == 0) {
                        return "已提交"
                    }
                    else if (value == 1) {
                        return "通过审核"
                    }
                    else if (value == 2) {
                        return "未通过审核"
                    }
                    else if (value == 3) {
                        return "通过审批"
                    }
                    else if (value == 4) {
                        return "未通过审批"
                    }
                }},
/*            {field: 'REMARKS', title: '审稿意见', sortable: false, align: 'center', width: 100},*/
            {field: 'AUTHOR_ONE', title: '作者一', sortable: false, align: 'center', width: 80},
            {field: 'AUTHOR_TWO', title: '作者二', sortable: false, align: 'center', width: 80},
            {field: 'AUTHOR_THREE', title: '作者三', sortable: false, align: 'center', width: 80},
            /*            {field: 'CREATE_USER', title: '创建人', sortable: false, align: 'center', width: 100},*/
            {field: 'CREATE_TIME', title: '创建时间', sortable: false, align: 'center', width: 80}
        ]
    ]
};
//稿件管理列表参数--end
/**
 * rdcp.JS框架初始化
 */
rdcp.ready(function () {
    //生成表格rdcp.grid(tableId,url,formName,表格参数)
    rdcp.grid('listdt', '!gh/manu/~query/Q_APPROVEMANU_LIST', "searchForm", params);
    rdcp.request('!comm/~query/Q_LOAD_PARAMS_FROM_PACODE?code_table=BI_NEWS_CENTER&code_field=TYPE',{}, function(data) {
        for (var i = 1; i < data.length; i++) {
            var html = "<input type='checkbox' name='news_type' value='" + data[i].id + "'/>" + data[i].text + "&nbsp;";
            $("#type_td").append(html);
        }
    });
});
function approveManu(manu_id) {
    $("#manu_id").val(manu_id);
    rdcp.dialog(dlgOpts);
}
//发布新闻
function publish(manu_id){
    document.publishForm.reset();
    $("#manu_id2").val(manu_id);
    rdcp.request("!gh/manu/~query/Q_GET_MANU_INFO", {'manu_id':manu_id}, function (data) {
        $("#title").val(data.body.company);
        $('#create_time').datetimebox('setValue', data.body.create_time);
        rdcp.dialog(publishDlgOpts);
    });

}
var dlgOpts = {
    title: "稿件审批",
    id: "dialog",
    width: "450",
    height: "200",
    parentwidth: true,
    modal: true,
    buttons: [
        {
            text: '确定',
            handler: function () {
                var state = $("#state").val();
                var remarks=$("#remarks").val().trim();
                if (state == 0) {
                    $.messager.alert('提示', '请输入审批结果！', 'info');
                    return false;
                }else if(state==4&&(remarks.length==0||remarks==null)){
                    $.messager.alert('提示', '请输入审批意见！', 'info');
                    return false;
                }
                rdcp.form.submit("approveManuForm", {url: "!gh/manu/~query/Q_APPROVEMANU",
                    success: function (data) {
                        if (data.header.code == 0) {
                            $("#dialog").dialog("close");
                            $.messager.alert('提示', '稿件审批成功！', 'info');
                            $("#remarks").attr("value","");
                            rdcp.grid.reload("listdt");
                        } else {
                            $.messager.alert('提示', '稿件审批失败！', 'error');
                        }
                    }
                });

            }
        },
        {
            text: '取消',
            handler: function () {
                $("#dialog").dialog("close");
                $("#remarks").attr("value","");
            }
        }
    ]
};

var publishDlgOpts = {
    title: "发布新闻",
    id: "publishDlg",
    width: "450",
    height: "200",
    parentwidth: true,
    modal: true,
    buttons: [
        {
            text: '确定',
            handler: function () {
                var title = $("#title").val();
                var types = "";
                $('input[name="news_type"]:checked').each(function(){
                    types += types!=""?","+this.value:this.value;
                });
                $("#type").val(types);
                if (title == "" || title == null) {
                    $.messager.alert('提示', '请输入新闻标题！', 'info');
                    return false;
                }
                if (types == "" || types == null) {
                    $.messager.alert('提示', '请选择新闻类别！', 'info');
                    return false;
                }
                rdcp.form.submit("publishForm", {url: "!gh/manu/~query/Q_MANU_TO_NEWS",
                    success: function (data) {
                        if (data.header.code == 0) {
                            $("#publishDlg").dialog("close");
                            $.messager.alert('提示', '新闻发布成功！', 'info');
                        } else {
                            $.messager.alert('提示', '新闻发布失败！', 'error');
                        }
                    }
                });
            }
        },
        {
            text: '取消',
            handler: function () {
                $("#publishDlg").dialog("close");
            }
        }
    ]
};
//预览稿件
function viewManu(manu_id) {
    //标签页ID
    var tabId = "viewManu"+manu_id;
    //标签页TILE
    var title = "预览信息";
    //标签页url
    var url = "!gh/manu/~/pages/viewManu.jsp?manu_id=" + manu_id;
    OpenTab(tabId, title, url);
    //window.open("!property/culturePropaganda/~/pages/addHistory.jsp?option=edit&history_id=" + history_id);
}
//修改稿件管理
function editManu(manu_id) {
    //标签页ID
    var tabId = "editManu";
    //标签页TILE
    var title = "修改信息";
    //标签页url
    var url = "!gh/manu/~/pages/manuForm.jsp?option=edit&manu_id=" + manu_id;
    $(document).on("click",".SR_uploaderDel",function(){
        publicDelFile(manu_id);
    })
    OpenTab(tabId, title, url);
    //window.open("!property/culturePropaganda/~/pages/addHistory.jsp?option=edit&history_id=" + history_id);
}
function publicDelFile(id){
    rdcp.request("!service/file/~java/Uploader.del?id="+id, {}, function () {
        $("#file_"+id).remove();
    });
}
