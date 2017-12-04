rdcp.ready(function () {
    //初始化校验
    $.extend($.fn.validatebox.defaults.rules, {
        mobilePhone: {
            validator: function(value, param){

                var result=value.match(/^1[3|4|5|8][0-9]\d{4,8}$/);
                if(result==null) return false;
                return true;
            },
            message: '请输入正确的手机号码'
        }
    });
    $('#account').validatebox({
        required:true
    });
    $('#name').validatebox({
        required:true
    });
    $('#mobile_phone').validatebox({
        required: false,
        validType: 'mobilePhone'
    });
    $('#email').validatebox({
        required: false,
        validType: 'email'
    });
//    CORE.loadForm("DS_USER_INFO","UserInfoManageForm",{ruleId : "SYS_P_USERINFOMANAGE",data:"&ftl=_ftl"});
    rdcp.form.load("UserInfoManageForm", "!org/user/~query/Q_USER_MANAGE_INFO","",function(){});
});
function manageUserInfo()
{
    //alert($("#name").val());
//    CORE.submitForm("DS_USER_INFO_EDIT","UserInfoManageForm",{data:'ftl=_ftl'},function(){CORE.info("成功提交！");});
    //CORE.info("成功提交！");


    rdcp.form.submit("UserInfoManageForm", {url: "!org/user/~query/Q_USER_INFO_EDIT",
        success: function(data) {
            $.messager.alert('提示', '用户资料修改成功！', 'info');
        }
    });
}