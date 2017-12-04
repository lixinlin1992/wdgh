<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <title>rdcploader</title>
    <jsp:include page="/scripts/RDCPJS/demo/base.jsp"/>
    <script type="text/javascript">
        rdcp.ready(function () {
            // 初始化窗口
            rdcp.window({
                id: 'win',
                width: 900,
                height: 400,
                href: 'scripts/RDCPJS/demo/ui/window/windowAdd.jsp'
            });
        });


        function openWindow() {
            // 打开窗口
            rdcp.window.open("win");
        }

        function closeWindow() {
            // 关闭窗口
            rdcp.window.close("win");
        }
    </script>
</head>
<body>
<div>
    <input type="button" value="打开窗口" onclick="openWindow()"/>
</div>
<div>
    <input type="button" value="关闭窗口" onclick="closeWindow()"/>
</div>
<div id="win"></div>
</body>
</html>