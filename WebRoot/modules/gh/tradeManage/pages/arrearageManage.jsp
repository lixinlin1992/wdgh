<!--
  Created by IntelliJ IDEA.
  User: sunjiaxin
  Date: 2017/6/21
  Time: 7:52
  To change this template use File | Settings | File Templates.
-->
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <title>欠费管理</title>
    <r:include resource="!rdcp/~/pages/listBase.jsp"/>
    <script type="text/javascript" src="!gh/tradeManage/~/scripts/arrearageManage.js"></script>
    <link href="!comm/css/addTable.css" rel="stylesheet" type="text/css">
    <link href="!service/file~/css/editfile.css" rel="stylesheet" type="text/css"/>

</head>
<r:include resource="!comm/~/pages/commOrg.jsp"/>
<body>
<input type="hidden" id="proPath" name="proPath" value=<%=request.getContextPath() %>/>
<div class="SR_Space">

    <!--标题和一些页面功能的工具条Begin-->
    <div class="SR_moduleBox">
        <div class="SR_moduleTitle">
            <form id="searchForm" name="searchForm">
            <span>选择操作:</span>
            <select id="operate" name="operate"onchange="changeList()">
                <option value="1">退会</option>
                <option value="3">恢复会籍</option>
            </select>
        </form>
        </div>
    </div>
    <!-- 列表 -->
    <div class="SR_tableContentBox">
        <table id="listdt"></table>
    </div>
</div>
</body>
</html>
