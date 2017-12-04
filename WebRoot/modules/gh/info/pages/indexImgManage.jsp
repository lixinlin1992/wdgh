<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%
    String path = request.getContextPath() + "/";
    String port = (request.getServerPort() == 80 || request.getServerPort() == 443) ? "" : ":" + String.valueOf(request.getServerPort());
    String basePath = request.getScheme() + "://" + request.getServerName() + port + path.replace("//","");
    String curUserName = LoginUserSession.getLoginUserInfo() == null ? "null" : LoginUserSession.getLoginUserInfo().getName();
    request.setAttribute("_basePath", basePath);
    request.setAttribute("_curUserId", curUserName);
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <base href="${_basePath}"/>
    <r:include resource="!rdcp/pages/listBase.jsp"/>
    <link href="!service/file/~/css/editfile.css" rel="stylesheet" type="text/css">
    <title>历史文化</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <link href="themes/default/css/index.css" rel="stylesheet" type="text/css">
    <link href="themes/default/css/sunrise.css" rel="stylesheet" type="text/css">
    <link href="themes/brisk_orange/css/commonbtn.css" rel="stylesheet" type="text/css">
    <script type="text/javascript" src="!comm/~/scripts/getParamsFromPaCode.js"></script>
    <script type="text/javascript" src="scripts/editor/kindeditor.js"></script>
    <link href="!service/file/~/css/editfile.css" rel="stylesheet" type="text/css"/>
    <%
        String option = request.getParameter("option");
        String culture_id = request.getParameter("culture_id");
    %>
</head>
<body style="background:#f4f4f4;">
<div class="SR_Space">
    <div class="SR_moduleBox">
        <div class="SR_moduleTitle">电脑首页图片</div>
    </div>
    <div align="center">
        <div class="SR_searchTableBox">
                <div id="webUploader"></div>
        </div>
    </div>
    <div class="SR_moduleBox">
        <div class="SR_moduleTitle">微信首页图片</div>
    </div>
    <div align="center">
        <div class="SR_searchTableBox">
                <div id="wechatUploader"></div>
        </div>
    </div>
    <div class="SR_moduleBox">
        <div class="SR_moduleTitle">手机首页图片</div>
    </div>
    <div align="center">
        <div class="SR_searchTableBox">
                <div id="mobileUploader"></div>
        </div>
    </div>
</div>
<!--style给定宽度可以影响编辑器的最终宽度-->
</body>
<script type="text/javascript">
    //rdcp.JS初始化
    rdcp.ready(function () {
        initUpload();
    });
    function initUpload(){
      rdcp.uploader("webUploader", {busiId: "WEB", busiType: "WEB_INDEX_IMG"}, {
          onSuccess: function (file) {
          }
      });
      rdcp.uploader("wechatUploader", {busiId: "WECHAT", busiType: "WECHAT_INDEX_IMG"}, {
          onSuccess: function (file) {
          }
      });
      rdcp.uploader("mobileUploader", {busiId: "MOBILE", busiType: "MOBILE_INDEX_IMG"}, {
          onSuccess: function (file) {
          }
      });
      rdcp.request("!gh/info/~query/Q_LINDEX_IMG_LIST",{},function(data){
        for(var i=0;i<data.body.rows.length;i++){
          var obj = data.body.rows[i];
          loadFiles(obj.ID,obj.BUSI_ID,obj.NAME);
        }
      });
    }
    function loadFiles(id,busi_id,name){
        var html = "<li id='file_"+id+"' class='SR_uploadFileBox'><div class='SR_uploadFileBoxBtn'>" +
        "<div class='SR_imgName'><h2>"+name+"</h2></div><input class='SR_uploaderDel' type='button' onclick=\"publicDelFile('"+id+"')\"></div><div class='SR_uploadImg'>" +
        "<img src='!service/file/~java/Downloader.get?type=thumb&id="+id+"'/></div></li>";
        var id = "";
        if(busi_id=="WEB") id = "webUploader";
        else if(busi_id=="WECHAT") id = "wechatUploader";
        else if(busi_id=="MOBILE") id = "mobileUploader";
        $("#"+id).find(".SR_uploadFileList ul").append(html);
    }
    function publicDelFile(id) {
        if (confirm("确定要删除文件吗？"))
        rdcp.request("!service/file/~java/Uploader.del?id=" + id, {}, function () {
            $("#file_" + id).remove();
        });
    }
</script>
</html>
