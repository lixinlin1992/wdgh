//稿件管理列表参数--start
var params = {
    fitColumns: true,
    rownumbers:true,
    // onClickRow: getFactorRow,
    columns: [
        [
            {field: 'COMPANY', title: '单位', sortable: false, align: 'center', width: 100},
            {field: 'COUNT', title: '投稿数', sortable: false, align: 'center', width: 80}
        ]
    ]
};
//稿件管理列表参数--end
/**
 * rdcp.JS框架初始化
 */
rdcp.ready(function () {
    //生成表格rdcp.grid(tableId,url,formName,表格参数)
    rdcp.request("!gh/manu/~query/Q_LOAD_DEPT_LIST",{},function(data) {
         var p = data.body.rows;
         for (var i = 0; i < data.body.rows.length; i++) {
             var html = "<option value='" + data.body.rows[i].ID+ "'>" + data.body.rows[i].NAME+ "</option>";
             $("#dept_id").append(html);
         }
     });
    rdcp.grid('listdt', '!gh/manu/~query/Q_MANUCOUNT_LIST', "searchForm", params);
});

