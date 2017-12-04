<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@ page import="com.sunrise.service.security.entity.SysPUser" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%
    String path = request.getContextPath();
//    String basePath = request.getScheme() + "://"
//            + request.getServerName() + ":" + request.getServerPort()
//            + path + "/";
   
   String basePath = path.length()==1?path:(path+"/"); 
   request.setAttribute("_basePath", basePath);

   SysPUser user = (SysPUser) session.getAttribute(LoginUserSession.UserSession_Key);
%>
<base href="${_basePath}"></base>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<link href="themes/default/css/sunrise.css" rel="stylesheet" type="text/css"/>
<link href="themes/default/css/lhgdialog.css" rel="stylesheet" type="text/css"/>
<link href="themes/default/css/framework.css" rel="stylesheet" type="text/css"/>
<link href="themes/default/css/jquery.loading.css" rel="stylesheet" type="text/css"/>
<%if (!"false".equalsIgnoreCase(request.getParameter("scripts"))) {%>
<script type="text/javascript" src="scripts/sunrise/framework.js"></script>
<script type="text/javascript" src="scripts/sunrise/common.js"></script>
<%}%>
<%-- 以下是导入的临时脚本文件 --%>
<script type="text/javascript" src="scripts/temp/functions.js"></script>
<script type="text/javascript"
        src="scripts/temp/user_function_<%=(user==null?"":user.getId())%>.js"></script>
<script type="text/javascript" src="scripts/service/security.help.js"></script>
<%-- 权限控制脚本 --%>

<style>
    .ui-autocomplete-loading {
        background: white url('themes/default/images/ui-anim_basic_16x16.gif') right center no-repeat;
    }

    #city {
        width: 25em;
    }
</style>