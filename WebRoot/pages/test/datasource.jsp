<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<html>
<head>
<title>数据源测试</title>
<jsp:include page="/pages/framework/base.jsp"/>

<script type="text/javascript">
$(function(){
    //装载数据源下拉框
    //CORE.loadSelect("DS_Select","DS_DATASOURCE",{});

    COMMON.autocomplete({
        inputName : "dsName",
        datasource : "DS_DATASOURCE",
        multi : false,
        min : 1,
        select : function(event,ui){
            this.value = ui.item.value;
        }
    });
});

function doSubmit(form){
    if($.trim(form.dsName.value) == ""){
        CORE.info("请指定要查看的数据源");
        return;
    }
    CORE.submitForm(form.dsName.value,form.name,{data : form.params.value, dataType: "text"},showResult);
}

function showResult(data){
    //alert(data);
    if($("#c_isunescape")[0].checked)
        $("#dsResult").val(CORE.json2str(data));
    else
        $("#dsResult").val(data);
}
</script>
</head>

<body>
<form name="TestForm" onsubmit="doSubmit(this);return false;">
<table align="center">
    <tr>
        <td width="80">数据资源</td>
        <td><input type="text" name="dsName" id="DS_Select" value="${param.dsName}" size="40"></td>
    </tr>
    <tr>
        <td>参数</td>
        <td><input type="text" name="params" size="40"></td>
    </tr>
    <tr>
        <td colspan="2"><label><input type="checkbox" id="c_isunescape" name="isunescape" checked="true">unescape返回内容</label></td>
    </tr>
    <tr>
        <td colspan="2" align="center"><input type="submit" value="提交" class="btnfunctionout"></td>
    </tr>
</table>
</form>
<table align="center">
    <tr>
        <td>返回结果：</td>
    </tr>
    <tr>
        <td>
            <textarea id="dsResult" rows="16" cols="120" readonly="readonly"></textarea>
        </td>
    </tr>
</table>
</body>
</html>