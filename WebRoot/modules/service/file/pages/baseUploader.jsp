<%@ page language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE>
<html>
<title>简单上传</title>
<link href="../css/editfile.css" rel="stylesheet" type="text/css"/>
<head>
    <r:include resource="!rdcp/pages/listBase.jsp"/>
    <script>
        rdcp.ready(function () {
            rdcp.uploader("uploader", {busiId: "testId", busiType: "testType"}, {
                onSuccess: function (file) {
//                    alert(file.id);
//                    alert(file.name);
//                    alert(file.size);
//                    alert(file.url);
//                    alert(file.thumbURL);
//                    alert(file.delUrl);
                }
            });
        });
    </script>
</head>
<body>
<div id="uploader"></div>
</body>
</html>
