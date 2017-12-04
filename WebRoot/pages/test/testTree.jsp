<%--
File: functionList.jsp
User: kinz
Date: 11-3-31 上午9:27

    对系统功能进行维护
--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false" %>
<html>
<head>
    <title>系统功能维护</title>
    <jsp:include page="/pages/framework/base.jsp"/>
    <script type="text/javascript" src="scripts/common/ztree.help.js"></script>
    <script type="text/javascript" src="scripts/service/function.help.js"></script>
</head>
<body>
<jsp:include page="/pages/navbar.jsp"/>
<div class="modules">
    <div class="barquery">
        <div class="barqueryleft"></div>
        <div class="barquerycenter">系统功能维护</div>
        <div class="barqueryright"></div>
        <div class="barquerybtn">
        </div>
    </div>
    <table width="100%">
        <tr>
            <td valign="top" style="height:100%;width:250px;">
                <div id="MODULE_TREE" class="tree" style="height:500px;overflow:auto;border:1px solid black;"></div>
<script>
var _ztree  = new ZTree("MODULE_TREE","DS_TEST_TREE",{nodeClicked:function(){}});
</script>
            </td>
            <td valign="top">
            </td>
        </tr>
    </table>
</div>
</body>
</html>