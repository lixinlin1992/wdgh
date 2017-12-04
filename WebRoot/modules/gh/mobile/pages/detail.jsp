<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
    String code_table = request.getParameter("code_table");
    String detail_id = request.getParameter("detail_id");
%>
<!DOCTYPE html>
<html>
<style>

</style>
<head>
    <link rel="shortcut icon" type="image/x-icon" href="pages/images/favicon.ico" media="screen" />
    <meta name ="renderer" content="webkit">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=2.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0">
    <title>武汉大学工会</title>
    <base href="<%=basePath%>">
    <link href="!gh/mobile/css/bootstrap.min.css" tppabs="!gh/mobile/css/bootstrap.min.css" rel="stylesheet">
    <link href="!gh/mobile/css/main.css" tppabs="!gh/mobile/css/main.css" rel="stylesheet">
    <link href="!gh/mobile/css/css.css" tppabs="!gh/mobile/css/css.css" rel="stylesheet">
    <script type="text/javascript" src="!gh/mobile/scripts/jquery.min.js"></script>
    <script src="!gh/mobile/scripts/bootstrap.min.js" type="text/javascript"></script>
    <script type="text/javascript" src="!rdcp/script/src/rdcp.js"></script>
    <script type="text/javascript">
      var code_table = "<%=code_table%>";
      var detail_id = "<%=detail_id%>";
      rdcp.ready(function(){
        rdcp.request("!gh/mobile/~query/Q_LOAD_INFO_DETAIL",{"code_table":code_table,"detail_id":detail_id},function(data){
          var obj = data.body;
          $("#title").html(obj.title);
          $("#content").html(obj.content);
          $("#department_name").append(obj.department_name);
          $("#create_time").append(obj.create_time);
        });
      },rdcp.defaultLoadModules3);
    </script>

    <style type="text/css">
       #content p img
       {
           width:356px;
           height:305.219px;
       }
    </style>
</head>
<body style="margin:0;padding:1">
   <r:include resource="!gh/mobile/~/pages/header.jsp"/>
   <div>
      <div class="ctitle" id="title"></div>
      <div id="vsb_content_6" class="c_content">
        <div       class="v_news_content" id="content">

        </div>
      </div>
      <br>
      <div style="padding-left:20px;">
         <font id="department_name"><b>发布单位</b>:</font>
      </div>
      <p style="padding-left:20px;"><font id="create_time"><b>发布日期</b>: </font></p>
   </div>
   <r:include resource="!gh/mobile/~/pages/footer.jsp"/>
</body>
</html>