<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
    String code_table = request.getParameter("code_table");
    String code_num = request.getParameter("code_num");
%>
<!DOCTYPE html>
<html>
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
      var code_num = "<%=code_num%>";
      var rows = 13;
      var page = 1;
      rdcp.ready(function(){
        rdcp.request("!gh/mobile/~query/Q_LOAD_SUBMENU_LIST_JCDT",{"code_table":code_table,"code_num":code_num,"rows":rows,"page":page},function(data){
          var rows = data.body.rows;
          $("#header_title").append(rows[0].HEADER_TITLE);
          for(var i=0;i<rows.length;i++){
            var html = "<li><div class='col-xs-12 col-sm-6 col-md-6'>";
            html += "<a href='!gh/mobile/~/pages/detail.jsp?code_table="+code_table+"&detail_id="+rows[i].ID+"' class='c46693'>"+rows[i].TITLE+"</a>";
            html += "</div></li>";
            $("#detail_list").prepend(html);
          }
        });
      },rdcp.defaultLoadModules3);
    </script>
</head>
<body style="margin:0;padding:1">
   <r:include resource="!gh/mobile/~/pages/header.jsp"/>
   <div class="container">
       <div class="row">
         <div class="col-sm-12">
           <p class="page-header bb1" id="header_title"></p>
         </div>
         <div class="col-sm-6 col-md-4">
           <div class="panel panel-success ctrl-xs">
             <div class="panel-body">
                <ul class="article" id="detail_list">
                </ul>
             </div>
           </div>
         </div>
       </div>
   </div>
   <r:include resource="!gh/mobile/~/pages/footer.jsp"/>
</body>
</html>