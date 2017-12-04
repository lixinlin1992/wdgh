var onlineUserParams = {
    sortName: 'LOGINID',
    sortOrder: 'DESC',
    idField: 'LOGINID',
    fitColumns: true,
    rownumbers:true,
    columns: [
        [
            {field: 'LOGINID', title: '用户登录编号', sortable: true, align: 'center', width: 120},
            {field: 'ACCOUNT', title: '工号', sortable: true, align: 'center', width: 120},
            {field: 'NAME', title: '姓名', sortable: true, align: 'center', width: 120},
            {field: 'LTIME', title: '登录时间', sortable: true, align: 'center', width: 120},
            {field: 'IP', title: '登录IP', sortable: true, align: 'center', width: 120},
            {
                field: 'operate',
                title: '操作',
                sortable: true,
                align: 'center',
                width: 50,
                formatter: function (value, rec, index) {
                    var str = "";
                    str = "<a id='editbut' class='btn_exclude' title='强制注销' href='javascript:void(0);' onclick='logout(\""
                            + rec.SESSION_ID
                            + "\",\"" + rec.USER_ID + "\");'></a>";
                    return str;
                }
            }

        ]
    ]/*,
     onClickRow : function(rowIndex) {
     rdcp.onRowSelected('#dutylist', function(data) {
     // alert(data);
     }, rowIndex);
     },
     singleSelect : false,
     height : 382.5,
     pagination : true,
     rownumbers : false*/
};

function logout(sessionId, userId) {
    rdcp.confirm("提示", "确定要强制注销用户吗？", function (result) {
        if (result) {
            rdcp.request("!sys/security~java/Logout", {session_id: sessionId, user_id: userId},
                    rdcp.request.tips({"0": "用户已经被强制注销"}, function (data) {
                        rdcp.grid.reload('onlineUserGrid')
                    }),
                    {mask: true, mask_msg: "正在注销用户..."});
        }
    });
}