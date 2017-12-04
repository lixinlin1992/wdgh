/**
 * Created by lh on 2014/9/28.
 */
//历史文化列表参数--start
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
                    var view = '<a class="btn_view" href="javascript:void(0);"  onclick="viewHistory(\'' + row.ID + '\');">预览</a>';
                    var del = '<a class="btn_delete" href="javascript:void(0);"  onclick="delNotice(\'' + row.ID + '\');">删除</a>';
                    return  del;
                }
            },
            {field: 'TITLE', title: '信息标题', sortable: false, align: 'center', width: 420,
            formatter: function (cell, row, index) {
                var html = "<a href='!service/file/~java/Downloader.get?id="+row.FILE_ID+"' target='_blank'>"+cell+"</a>";
                return html;
            }},
            {field: 'VIEW_TIMES', title: '下载次数', sortable: false, align: 'center', width: 80},
            {field: 'CREATE_TIME', title: '创建时间', sortable: false, align: 'center', width: 100},
            {field: 'CREATE_USER', title: '创建人', sortable: false, align: 'center', width: 100}
        ]
    ]
};
//校园文化列表参数--end
/**
 * rdcp.JS框架初始化
 */
var notice_id;
rdcp.ready(function () {
    //生成表格rdcp.grid(tableId,url,formName,表格参数)
    rdcp.grid('listdt', '!gh/info/~query/Q_NOTICE_LIST', "searchForm", params);
});
//添加校园文化方法
function addNotice(){
    rdcp.request("!gh/info/~query/Q_GET_INFO_ID",{"seq":"bi_notice_seq"},function(data){
        notice_id = data.body.seq;
        $("#notice_id").val(notice_id);
        $("#uploader").html("");
        rdcp.uploader("uploader", {busiId: notice_id, busiType: "BI_NOTICE"}, {
            onSuccess: function (file) {
                $(".SR_uploadHeader").remove();
               $("#file_id").val(file.id);
            }
        });
        rdcp.dialog(uploadOpts);
    });

}
//删除历史文化
function delNotice(id){
    $.messager.confirm("警告", "您确定要删除该条数据吗？",
        function (yesBtn) {
            if(yesBtn) {
                rdcp.request("!gh/info/~query/Q_DEL_NOTICE", "id="+id, function(data){
                    $.messager.alert('提示', "删除成功！", 'info');
                    rdcp.grid.reload('listdt');
                });
            }
    });
    //window.open("!property/culturePropaganda/~/pages/addHistory.jsp?option=edit&history_id=" + history_id);
}
var uploadOpts = {
    id : "uploadDlg",
    width : "300",
    height : "300",
    buttons : [
        {
            text : "提交",
            handler : function(){
                var title = $("#title").val();
                var file_id = $("#file_id").val();
                if(title == ""){
                    $.messager.alert("提示","请输入标题!","info");
                    return;
                }
                if(file_id == ""){
                    $.messager.alert("提示","请上传附件!","info");
                    return;
                }
                rdcp.form.submit("notice_form", {
                    url: "!gh/info/~query/Q_ADD_NOTICE" ,
                    success: function (data) {
                        $.messager.alert('提示', '附件添加成功！', 'info',function () {
                            rdcp.grid.reload('listdt');
                            $("#uploadDlg").dialog("close");
                        });
                    }
                }, {"mask": true});
            }
        },
        {
            text : "取消",
            handler : function(){
                $("#uploadDlg").dialog("close");
            }
        }
    ]
};
