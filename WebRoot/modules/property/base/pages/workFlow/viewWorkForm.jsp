<%--
  Created by IntelliJ IDEA.
  User: lh
  Date: 2014/10/22
  Time: 18:19
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <title>处理工单</title>
    <r:include resource="!rdcp/~/pages/listBase.jsp"/>
    <r:include resource="!property/base/~/pages/public_upload.jsp"/>
    <script type="text/javascript" src="!property/base/~/scripts/workFlow/viewWorkForm.js"></script>
    <link href="!comm/css/addTable.css" rel="stylesheet" type="text/css">
    <link href="!service/file~/css/editfile.css" rel="stylesheet" type="text/css"/>
</head>
<body style="background:#f4f4f4">
<input type="hidden" name="woId" id="woId" value="<%=request.getParameter("woId")%>">
<input type="hidden" name="objId" id="objId" value="<%=request.getParameter("objId")%>">
<input type="hidden" name="tag" id="tag" value="1">
<div class="SR_Space">
    <div class="SR_inputTable">
        <div class="clear"></div>
        <div class="SR_moduleBox" style="border-bottom:1px solid #cccccc;">
            <div class="SR_moduleTitle">工单历史</div>
        </div>
        <div class="SR_inputTableContent">
            <div id="span_handleHistory" style="margin: 8px;margin-left: 45px;"></div>
        </div>

        <div class="SR_moduleBox" style="border-bottom:1px solid #cccccc;">
            <div class="SR_moduleTitle">对象表单</div>
        </div>
        <%--<div class="SR_inputTableContent" style="border-bottom: 0px solid #cccccc;margin-bottom: 0px;">--%>
        <div id="span_objectForm"></div>
    </div>
</div>
<br>
<br>
<br>

<div class="floatBtn" id="newfloatBtn">
    <div class="floatSmallBtn" style="width: 500px;" align="center">
        <a class="btn_cancel" href="javascript:void(0);" onclick="CloseTab('handleWorkForm'+$('#woId').val(),'工单处理记录');" title="">取消</a>
    </div>
</div>
</body>
</html>
