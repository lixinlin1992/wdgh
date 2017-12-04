rdcp.ready(function () {
    var legalId = $("#legalId").val();
    getQuestion(legalId);
    getComments(legalId);
    // 加一次查看次数
    rdcp.request("!gh/wechat/~query/Q_LEGAL_QUESTION_VIEW", "legalId=" + legalId, function (data) {
    });
});

function getQuestion(legalId) {
    rdcp.request("!gh/wechat/~query/Q_LEGAL_QUESTION", "legalId=" + legalId, function (data) {
        var dataObj = data.body.rows,
            con = "";
        $.each(dataObj, function (index, item) {
            con += "<div class='xqtitle_t'> <div class='xqtitle_tl'>" +
                "<img src='!gh/wechat/img/banner.jpg'> </div> <div class='xqtitle_tr'> " +
                "<p>" + item.TITLE + "</p><p><span>查看：<font class='color_y'> " + item.VIEW_TIMES + "</font></span><span>" +
                "留言：<font class='color_y'>" + item.NUM + "</font></span></p> </div> </div> <div class='post_m'>" +
                "<p class='animated fadeInRight'>" + item.CONTENT + "</p> </div>";
        });
        $("#detail").html(con); //把内容入到这个div中即完成
    });
}

function getComments(legalId) {
    rdcp.request("!gh/wechat/~query/Q_LEGAL_REPLY", "legalId=" + legalId, function (data) {
        var dataObj = data.body.rows,
            con = "";
        $.each(dataObj, function (index, item) {
            con += "<div class='postall'><div class='post_t'><img src='!gh/wechat/img/icon_fk.png'> <span>"
                + item.NAME
                + "</span></div> <div class='post_m'> <p>"
                + item.CONTENT
                + "</p> </div> <div class='post_b'><span class='puff_left'>"
                + item.CREATE_DATE
                + "</span><span class='puff_right'><label><i id="
                + item.ID
                + " class='icon-heart-empty color_y icon-heart dz_bth' onclick='like("
                + item.ID
                + ")'></i><span id='likes"
                + item.ID
                + "'>"
                + item.LIKE_TIMES
                + "</span></label>" +
                "<input id='flag"+item.ID+"' type='hidden' value='true'></span></div></div>";
        });
        $("#main").html(con); //把内容入到这个div中即完成
    });
}
// 点赞
function like(commentId) {

    var a = $("#flag"+commentId).val();

    var num = 0;
    if (a=="true") {
        num = 1;
    } else {
        num = -1;
    }
    rdcp.request("!gh/wechat/~query/Q_LEGAL_REPLY_LIKE", "commentId=" + commentId + "&num=" + num, function (data) {
        var n = $("#likes" + commentId).text();
        if (a=="true") {
            n++;
            $("#flag"+commentId).val("false");
            $.messager.alert('提示', "点赞成功！", 'info');
        } else {
            n--;
            $("#flag"+commentId).val("true");
            $.messager.alert('提示', "取消成功！", 'info');
        }
        $("#likes" + commentId).text(n);
        // 把图标变为实心，并变为不可点击
        $("#" + commentId).toggleClass("icon-heart-empty");
        // 把点赞数加1或减1
        $("#likes" + commentId).val($("#likes" + commentId).val() + num);
    });
}

function submitReply(isLogin){
    if(!isLogin) {
        window.location = "!gh/wechat/~/pages/ghlogin.jsp?page=legalAid";
    }
    var legalId = $("#legalId").val();
    var content = $("#content").val();
    rdcp.request("!gh/wechat/~query/Q_LEGAL_REPLY_ADD", "legalId=" + legalId + "&content=" + content, function (data) {
        $.messager.alert('提示', "回复成功！", 'info');
    });
}



