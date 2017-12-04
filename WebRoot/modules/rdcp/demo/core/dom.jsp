<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <title>rdcploader</title>
    <jsp:include page="/scripts/RDCPJS/demo/base.jsp"/>
    <script type="text/javascript">
        rdcp.ready(function () {
            var $msg = $("#msg");
            $msg.append("id=d1有" + rdcp.find("#d1").length + "个<br />");
            $msg.append("className=c11x有" + rdcp.find(".c11x").length + "个<br />");
            $msg.append("id=d1有" + rdcp.id("d1").length + "个<br />");
            $msg.append("className=c11x有" + rdcp.clsName("c11x").length + "个<br />");


        });

    </script>
</head>
<body>
<div id="msg" style="width:500px; height: 500px;">

</div>
<div id="d1">
    <div id="d11" class="c1x">
        <div id="d111" class="c11x"></div>
        <div id="d112" class="c11x"></div>
        <div id="d113" class="c11x"></div>
    </div>
    <div id="d12" class="c1x">
        <div id="d121" class="c11x"></div>
        <div id="d122" class="c11x"></div>
        <div id="d123" class="c11x"></div>
    </div>
</div>
</body>
</html>