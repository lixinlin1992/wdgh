
//获取history_id
// var manu_id = "<%=manu_id%>";
// //获取服务器根路径
// var serverBasePath = "<%=basePath%>";
// rdcp.ready(function () {
//     rdcp.request('!gh/manu/~query/Q_GET_MANU_INFO', 'manu_id=' + manu_id, function (data) {
//         var obj = data.body;
//         var html = "";
//         html +="<h1>"+obj.company+"</h1>";
//         html += "<p class='g-article-data'>作者一:"+obj.author_one+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;作者二:"
//             +obj.author_two+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;作者三:"+obj.author_three+"</p>";
//         html += "<div class='g-article-content'>"+obj.content+"</div>";
//         $("#content").html(html);
//     });
// });

function editManu(manu_id,tag) {
    //标签页ID
    var tabId = "editManu";
    //标签页TILE
    var title = "修改信息";

    //标签页url
    var url = "!gh/manu/~/pages/manuForm.jsp?option=edit&manu_id=" + manu_id+"&tag=" +tag;
    $(document).on("click",".SR_uploaderDel",function(){
        publicDelFile(manu_id);
    })
    OpenTab(tabId, title, url);
    //window.open("!property/culturePropaganda/~/pages/addHistory.jsp?option=edit&history_id=" + history_id);
}
//审核
function examineManu(manu_id) {
    $("#manu_id").val(manu_id);
    rdcp.dialog(dlgOpts);
}

var dlgOpts = {
    title: "稿件审核",
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
                    $.messager.alert('提示', '请输入审核结果！', 'info');
                    return false;
                }else if(state==4&&(remarks.length==0||remarks==null)){
                    $.messager.alert('提示', '请输入审核意见！', 'info');
                    return false;
                }
                rdcp.form.submit("examineManuForm", {url: "!gh/manu/~query/Q_EXAMINEMANU",
                    success: function (data) {
                        if (data.header.code == 0) {
                            $("#dialog").dialog("close");
                            $.messager.alert('提示', '稿件审核成功！', 'info');
                            $("#remarks").attr("value","");
                            CloseTab("viewManu"+manu_id, "预览信息");
                            // window.location.href="!gh/manu/~/pages/examineManu.jsp"; //这样跳转网页的标题有点问题
                        } else {
                            $.messager.alert('提示', '稿件审核失败！', 'error');
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


//审批
function approveManu(manu_id) {
    $("#manu_id2").val(manu_id);
    rdcp.dialog(dlgOpts2);
}

var dlgOpts2 = {
    title: "稿件审批",
    id: "dialog2",
    width: "450",
    height: "200",
    parentwidth: true,
    modal: true,
    buttons: [
        {
            text: '确定',
            handler: function () {
                var state = $("#state2").val();
                var remarks=$("#remarks2").val().trim();
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
                            $("#dialog2").dialog("close");
                            $.messager.alert('提示', '稿件审批成功！', 'info');
                            $("#remarks2").attr("value","");
                            CloseTab("viewManu"+manu_id, "预览信息");
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
                $("#dialog2").dialog2("close");
                $("#remarks").attr("value","");
            }
        }
    ]
};