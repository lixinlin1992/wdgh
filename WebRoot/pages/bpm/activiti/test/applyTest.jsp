<%--
User: kinz
Date: 2012-10-31

--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
    <%--常规的基础jsp导入--%>
    <jsp:include page="/pages/framework/base.jsp"/>
    <%--工作流基础页面导入，如果采用第一种方式提交数据，则需要导入；如果是自己提交业务数据则无需导入--%>
    <%--<jsp:include page="/pages/bpm/activiti/public/baseBpmPage.jsp"/>--%>
</head>
<script>
    function saveBusinessForm(callback) {
        //方式1  由引擎提交数据，并且由引擎来决定什么时候往下驱动流程
        /*
         $("#applyForm").saveBusinessForm({
         ds : "DS_BPM_TEST_APPLY",
         isReloadBusinessFrameOnSubmitBack: false,
         onSubmitCallBack : function(data) {
         }
         });
         */
        //方式2  由业务系统自己提交数据并且决定什么时候往下驱动流程
        CORE.submitForm("DS_BPM_TEST_APPLY", "applyForm", {}, function (data, header) {
            //在业务数据保存完成后，通过callback回调函数来通知工作流业务数据已经保存完成，可进行下一步的操作
            callback(true, "TEST", $("#applyForm").toMap());
        });
    }
</script>
<body>
<%--这里只是一个很简单的表单，按照常规业务功能开发方式进行开发即可--%>
<form name="applyForm" id="applyForm">
    <table border="0" width="400" align="center">
        <tr>
            <td> 金额</td>
            <td><input type="text" name="money"></td>
        </tr>
        <tr>
            <td> 数量</td>
            <td><input type="text" name="count"></td>
        </tr>
    </table>
</form>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
asdfasdfasdf
<br>
</body>
</html>