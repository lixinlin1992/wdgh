rdcp.ready(function () {
    //生成表格rdcp.grid(tableId,url,formName,表格参数)
    getLegalAids();
});

function getLegalAids() {
    rdcp.request("!gh/wechat/~query/Q_LEGALAID_LIST", null, function (data) {
        var dataObj = data.body.rows,
            con = "<div class='finance'> <ul>";
        $.each(dataObj, function (index, item) {
            con += "<li class='animated fadeInRight'><a href='!gh/wechat/~/pages/legalQuestion.jsp?legalId=" + item.ID + "'><p>" + item.TITLE + "</p> " +
                "<p><span class='puff_left'>来自" + item.NAME + "</span><span class='puff_right'>" + item.CREATE_DATE + "</span>" +
                " </p> </a> </li>";
        });
        con += "</ul> </div>";
        $("#main").html(con); //把内容入到这个div中即完成
    });
}

function skipToQuestionAdd(isLogin) {
    if(!isLogin) {
        window.location = "!gh/wechat/~/pages/ghlogin.jsp?page=legalQuestionAdd";
    } else {
        window.location = "!gh/wechat/~/pages/legalQuestionAdd.jsp";
    }
}
