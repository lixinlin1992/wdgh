rdcp.ready(function () {
});

function submitQuestion(isLogin){
    if(!isLogin) {
        window.location = "!gh/wechat/~/pages/ghlogin.jsp?page=legalQuestionAdd";
    }
    var title = $("#title").val();
    var content = $("#content").val();
    rdcp.request("!gh/wechat/~query/Q_LEGAL_QUESTION_ADD", "title=" + title + "&content=" + content, function (data) {
        $.messager.alert('提示', "提问成功！", 'info',function () {
            window.location = "!gh/wechat/~/pages/legalAid.jsp";
        });
    });
}




