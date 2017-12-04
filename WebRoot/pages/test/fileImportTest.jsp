<%--
File: fileImportTest.jsp
User: kinz
Date: 11-4-25 下午5:42


--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false" %>
<html>
<head>
    <title>无标题</title>
    <jsp:include page="/pages/framework/base.jsp"/>
    <script type="text/javascript" src="scripts/service/fileimport.help.js"></script>
</head>
<body>
...
<input type="button" value="选择字段" onclick="selectImportFields('I_TEST.xml','test',{templateName:'测试导入模板.xls',selected:function(fields){}})">
...
</body>
</html>