<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<html>
<head>
<title></title>
<base href="<%=basePath%>">
<jsp:include page="/pages/framework/base.jsp"/>
<link rel="stylesheet" type="text/css" href="themes/default/css/jquery.jgrowl.css"/>
<script type="text/javascript" src="scripts/common/jquery.jgrowl.js"></script>
</head>
<script>
//if(self!=top){top.location=self.location;}
function switchSysBar(){
var chageValue = document.getElementById("test");
if (chageValue.value==3){
document.getElementById("img1").src="themes/default/images/indexon.gif";
chageValue.value=4
document.all("frmTitle").style.display="none"
}else{
document.getElementById("img1").src="themes/default/images/indexoff.gif";
//switchPoint.innerText="<img src=''>"
chageValue.value=3
document.all("frmTitle").style.display=""
}}
 function outsys(){
			//parent.outsys();
			CORE.confirm("确定退出?",function(){CORE.request("DS_USER_LOGOUT",{},function(data){window.top.location.href='<%=basePath%>';})});
        }
 function showTip(msg){
     $.jGrowl(msg);
 }

</script>
<body style="MARGIN: 0px">

<table border="0" cellPadding="0" cellSpacing="0" height="100%" width="100%">
  <tr>
    <td align="middle" noWrap vAlign="center" id="frmTitle" width="160">
    <iframe src="pages/left.jsp" name="subMenuFrame" width="100%" height="100%"  scrolling="No" height="90" frameborder="0"></iframe></td>
    <td bgcolor="A4B6D7">
    <table border="0" cellPadding="0" cellSpacing="0" height="100%">
      <tr>
        <td style="HEIGHT: 100%" onClick="switchSysBar()" 
		onmouseover="this.style.backgroundColor='#FEF2CB'" onmouseout="this.style.backgroundColor='#DFE8F6'" 
		bgcolor="#DFE8F6" style="border-right:1px solid #A8B9CD;">
        <font>
        <br>
        <br>
        <br>
        <br>
        <span id="switchPoint"><input id="test" type="hidden" value="3"><img style="cursor: pointer;"  id="img1" src="themes/default/images/indexoff.gif"></span><br>
        <br>
        <br>
        <br>
        <br>
        </font></td>
      </tr>
    </table>    
	</td>
	<td style="WIDTH: 100%"> <iframe src="pages/right.jsp" name="contentFrame" width="100%" height="100%"  scrolling="auto" height="90" frameborder="0"></iframe></td>
  </tr>
</table>
</body>
</html>