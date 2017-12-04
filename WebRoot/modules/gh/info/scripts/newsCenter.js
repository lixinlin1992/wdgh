/**
 * Created by Wendy on 2017/6/26.
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
                    var edit = '<a class="btn_edit" href="javascript:void(0);"  onclick="editNewsCenter(\'' + row.ID + '\');">修改</a>';
                    var view = '<a class="btn_view" href="javascript:void(0);"  onclick="viewHistory(\'' + row.ID + '\');">预览</a>';
                    var del = '<a class="btn_delete" href="javascript:void(0);"  onclick="delNewsCenter(\'' + row.ID + '\');">删除</a>';
                    return  edit+ "&nbsp;" + del;
                }
            },
            {field: 'TITLE', title: '信息标题', sortable: false, align: 'center', width: 420},
            {field: 'TYPE', title: '信息类别', sortable: false, align: 'center', width: 80},
            {field: 'VIEW_TIMES', title: '阅读次数', sortable: false, align: 'center', width: 80},
            {field: 'CREATE_TIME', title: '创建时间', sortable: false, align: 'center', width: 100},
            {field: 'CREATE_USER', title: '创建人', sortable: false, align: 'center', width: 100}
        ]
    ]
};
//新闻中心列表参数--end
/**
 * rdcp.JS框架初始化
 */
rdcp.ready(function () {
    //生成表格rdcp.grid(tableId,url,formName,表格参数)
    rdcp.grid('listdt', '!gh/info/~query/Q_NEWS_CENTER_LIST', "searchForm", params);

});
//添加新闻中心方法
function addNewsCenter(){
    //标签页ID
    var tabId = "addNewsCenter";
    //标签页TILE
    var title = "发布信息";
    //标签页url
    var url = "!gh/info/~/pages/newsCenterForm.jsp?option=add";
    OpenTab(tabId, title, url);
    //window.open("!property/culturePropaganda/~/pages/addHistory.jsp?option=add");
}
//修改新闻中心
function editNewsCenter(news_id){
    //标签页ID
    var tabId = "editNewsCenter";
    //标签页TILE
    var title = "修改信息";
    //标签页url
    var url = "!gh/info/~/pages/newsCenterForm.jsp?option=edit&news_id="+news_id;
    OpenTab(tabId, title, url);
    //window.open("!property/culturePropaganda/~/pages/addHistory.jsp?option=edit&history_id=" + history_id);
}
//删除历史文化
function delNewsCenter(news_id){
    $.messager.confirm("警告", "您确定要删除该条数据吗？",
        function (yesBtn) {
            if(yesBtn) {
                rdcp.request("!gh/info/~query/Q_DEL_NEWS_CENTER", "news_id="+news_id, function(data){
                    $.messager.alert('提示', "删除成功！", 'info');
                    rdcp.grid.reload('listdt');
                });
            }
    });
    //window.open("!property/culturePropaganda/~/pages/addHistory.jsp?option=edit&history_id=" + history_id);
}

//预览历史文化
function viewHistory(history_id){
    window.open("!property/culturePropaganda/~/pages/previewHistory.jsp?history_id=" + history_id);
}
