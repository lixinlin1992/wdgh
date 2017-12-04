<%--
File: propertyGridTest
User: kinz
Date: 11-9-28 下午4:52


--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>属性编辑器测试</title>
    <jsp:include page="/pages/framework/base.jsp"/>
    <link type="text/css" rel="stylesheet" href="themes/default/css/rdcp.css">
    <script type="text/javascript" src="scripts/rdcp/rdcp.js"></script>
    <script type="text/javascript" src="scripts/rdcp/propertyGrid.js"></script>
    <script type="text/javascript" src="scripts/rdcp/plugins/formField.js"></script>
    <script>
        var propertyGrid = null;
        var data = {
            "conditions":{
                name:"查询条件",
                code:"conditions",
                value:"",
                type:"text",
                editor:"form_field",
                group:"基本"
            },
            "form":{
                name:"表单数据",
                code:"form",
                value:"",
                type:"text",
                editor:"form_field",
                group:"基本"
            }
        };
        $(document).ready(function() {
            propertyGrid = new RDCP.PropertyGrid({
                id:"form_Field_Test",
                group:true,
                properties:data
            });
        });
    </script>
</head>
<body>
<table id="form_Field_Test" style="width:600px;"></table>
</body>
</html>