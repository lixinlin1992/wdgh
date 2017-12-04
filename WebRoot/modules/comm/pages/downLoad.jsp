<%@page import="java.net.URLEncoder"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>download</title>
</head>
<body>
   <%
    String filename = request.getParameter("filename");
  	String filepath = request.getParameter("filepath"); //文件路径
  	String filenamedisplay = URLEncoder.encode(filename,"UTF-8"); //显示的文件名
  	
   	//response.setContentType("application/x-download");
   	response.setContentType("application/octet-stream");  
   	response.addHeader("Content-Disposition", "attachment;filename =" + filenamedisplay); 

   	try {
   		RequestDispatcher dis = request.getRequestDispatcher(filepath);
   		if(dis != null){
   			dis.forward(request, response);
   		}
   		response.flushBuffer();
   		
   		//解决 getoutputstream has already been called for this response
   		out.clear();
   		out = pageContext.pushBody();
   		
   	} catch (Exception e) {
   		e.printStackTrace();
   	} finally {

   	}
   %> 
</body>
</html>