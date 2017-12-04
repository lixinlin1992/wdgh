rdcp.ready(function () {
    //	CORE.loadRules("modifyPass","SYS_USERMODIFYPASS");
    /*   $('#oldPassword').validatebox({
     required:true
     });
     $('#newPassword').validatebox({
     required:true
     });
     $('#newPassword1').validatebox({
     required:true
     });
     $('#oldPassword').validatebox({
     required:true
     });*/
});
function SubmitModifyPass() {
    /*if ($("#newPassword").attr("value") == $("#newPassword1").attr("value")) {
     */
    /*CORE.submitForm("DS_FRAMEWORK_SERVICE_SECURITY_MODIFY_USER_PASS", "modifyPass", {},
     function(msg,header) {
     CORE.info(unescape(header.message));
     });*/
    /*
     rdcp.form.submit("modifyPass", {url: "!org/user/~query/Q_USER_MODPWD",
     success: function(data) {
     document.modifyPass.reset();
     $("#dialog").dialog("close");
     $.messager.alert('提示', '操作成功！', 'info');
     }
     });
     }else {
     $.messager.alert('提示', '输入的新密码不一致！', 'info');
     }*/

    if ($("#oldPassword").attr("value") == null || $("#oldPassword").attr("value") == "") {
        $("#oldvalid").html("此项不能为空,请输入.");
    }
    else if ($("#newPassword").attr("value") == null || $("#newPassword").attr("value") == "") {
        $("#oldvalid").html("");
        $("#newvalid").html("此项不能为空,请输入.");
    }
    else if ($("#newPassword1").attr("value") == null || $("#newPassword1").attr("value") == "") {
        $("#oldvalid").html("");
        $("#newvalid").html("");
        $("#valid").html("此项不能为空,请输入.");
    }
    else if ($("#newPassword").attr("value") == $("#newPassword1").attr("value")) {
        $("#newvalid").html("");
        /*CORE.submitForm("DS_FRAMEWORK_SERVICE_SECURITY_MODIFY_USER_PASS", "modifyPass", {},
         function(msg,header) {
         CORE.info(unescape(header.message));
         });*/

        rdcp.request("!org/user/~query/Q_USER_MODPWD", rdcp.id("modifyPass").serialize(), function (data) {
            $.messager.alert("提示","密码已经修改，请记住新密码！","info");
        }, {mask: true});
        /*
         rdcp.form.submit("modifyPass", {url: "!org/user/~query/Q_USER_MODPWD",
         success: function(data) {
         document.modifyPass.reset();
         $("#dialog").dialog("close");
         $.messager.alert('提示', '操作成功！', 'info');
         },
         error:function(data) {
         $.messager.alert('提示',data, 'info');
         }
         });
         */

    }
    else {
//        CORE.info("输入的新密码不一致!");
        $.messager.alert('提示', '输入的新密码不一致！', 'info');
    }
}

//验证密码
function valiinput() {
    if ($("#newPassword").attr("value") == $("#newPassword1").attr("value")) {
        $("#valid").html("");
    } else {
        $("#valid").html("输入的密码不一致,请重新输入");
        $("#newPassword").attr("value", "");
        $("#newPassword1").attr("value", "");
    }
}

//密码输入框重新获得焦点
function onChange() {
    $("#newPassword1").attr("value", "");
}