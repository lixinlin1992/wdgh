<%@ page import="com.sunrise.service.security.MenuHelper" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<%--
  User: 李嘉伟
  Date: 11-9-6
  Time: 15:28
     业务系统安装
--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false" %>
<%
    MenuHelper.loadMenus();
%>
<html>
<head>
    <jsp:include page="/pages/framework/base.jsp"/>
    <title>业务系统安装</title>
	<link type="text/css" rel="stylesheet" href="themes/default/css/zTreeStyle/zTreeStyle.css"/>
	<script type="text/javascript" src="scripts/ztree/jquery-ztree-2.5.min.js"></script>
    <script type="text/javascript" src="scripts/common/ztree.help.js"></script>
	<script type="text/javascript">
/******导入信息********/
   var fileId = "";
   function getDetailList(){
      COMMON.upload({
	     url:'framework.do?ds=DS_INSTALL_LIST',
	     formName:'importForm'
	  },function(data){
	  	 fileId = data.fileId;
	  	 $("#detailList").empty();
	  	 for(var i = 0;i < data.item.length;i++)
	  	 {
	  	 	$("#detailList").append("<li>"+data.item[i]+"</li>");
	  	 }
	  	 $("installBtn").removeAttr("disabled");
	  	 $("installBtn").removeAttr("disabled");
   	  });
   }  
   function install(){
	 	CORE.request("DS_SYSTEM_INSTALL",{data:"fileId="+fileId}, function(data) {
             CORE.info("业务系统安装完成");
	  	 	 $("installBtn").attr("disabled",true);
        });
   }
/******生成页面缓存******/

   function genPage(){
       CORE.request("DS_RDCP_GEN_PAGE",{data:"page_code="+$("#P_Code").val()+"&_sysCode="+$("#sys_code").val()},function(body,head){
           CORE.tip("页面缓存刷新成功");
       });
   }

   function genQuery(){
       CORE.request("DS_RDCP_GEN_QUERY",{data:"_queryCode="+$("#Q_Code").val()+"&_sysCode="+$("#sys_code").val()},function(body,head){
           CORE.tip("查询缓存刷新成功");
       });
   }

    function genDataService(){
        CORE.request("DS_RDCP_GEN_DATA_SERVICE",{data:"_dataServiceCode="+$("#D_Code").val()+"&_sysCode="+$("#sys_code").val()},function(body,head){
            CORE.tip("数据源缓存刷新成功");
        });
    }
  
   var pageSelect = function(event, treeId, treeNode){
		if(treeNode.type==2){
			var str = $("#P_Code").val();
			$("#P_Code").empty();
			if(str == "" || str == undefined)
				$("#P_Code").append(treeNode.code);
			else{
				str+=","+treeNode.code;
				$("#P_Code").append(str);
			}
		}
	}
   
	var querySelect = function (event, treeId, treeNode) {
	    if (!treeNode.isParent) {
			var str = $("#Q_Code").val();
			$("#Q_Code").empty();
			if(str == "" || str == undefined)
				$("#Q_Code").append(treeNode.code);
			else{
				str+=","+treeNode.code;
				$("#Q_Code").append(str);
			}
	    }
	}

   var queryTree = null;
   var pageTree = null;
   $(function(){
   		queryTree = new ZTree("query_tree", "DS_QUERY_TREE", {nodeClicked:querySelect});
   		pageTree = new ZTree("page_tree", "DS_PAGE_TREE",{nodeClicked:pageSelect});
   });

        function genMenu(){
            CORE.request("DS_RDCP_GEN_MENU",{data:"_queryCode="+$("#I_Code").val()},function(body,head){
                CORE.tip("菜单装载成功");
            });
        }
	</script>
</head>
<body>
    <jsp:include page="/pages/navbar.jsp"/>
    <div class="modules">
        <div class="barquery">
            <div class="barqueryleft"></div>
            <div class="barquerycenter">业务系统安装</div>
            <div class="barqueryright"></div>
            <div class="barquerybtn">
                <!-- <input name="btn_addition" class="btn_additionout" value="添加" type="button" onclick='_addDev();'/> -->
            </div>
        </div>
        <div class="barquerycontent" align="center">
		  <form name="importForm" enctype="multipart/form-data" onSubmit="return false;">   
		     <table border="1">
				  <tr class="formRow">
					  <td class="formLabel"><strong>选择安装包文件:</strong></td>
					  <td class="formField">
						  <input name="file" id="upfile" type="file"/>
						  <input type="hidden" name="note"/>	
						  <input type="button" value="提交" onclick="getDetailList()"/>	  
					  </td>
				  </tr>
				  <tr class="formRow">
					  <td class="formLabel"><strong>安装包清单:</strong></td>
					  <td class="formField" align="left">
					  	<ul id="detailList">
					  		<li>--提交安装包后加载--</li>
					  	</ul>
					  </td>
				  </tr>
                 <tr>
                     <td valign="top" align="right">                
	                    <div id="page_tree" class="tree" style="height:200px;overflow:auto;"></div>
                     </td>
                     <td valign="top" align="left">
                     	页面编码:<br />
                     	<textarea name="pCode" id="P_Code" style="height:150px;width:98%;"></textarea>
                     </td>
                 </tr>
                 <tr>
                     <td valign="top" align="right">                
                    	<div id="query_tree" class="tree" style="height:200px;overflow:auto;"></div>
                     </td>
                     <td valign="top" align="left">
                     	查询编码:<br />
                     	<textarea name="qCode" id="Q_Code" style="height:150px;width:98%;"></textarea>
                     </td>
                 </tr>
                 <tr>
                     <td valign="top" align="right">
                         <div id="data_service_tree" class="tree" style="height:200px;overflow:auto;"></div>
                     </td>
                     <td valign="top" align="left">
                         数据源编码:<br />
                         <textarea name="qCode" id="D_Code" style="height:150px;width:98%;"></textarea>
                     </td>
                 </tr>
                 <tr>
                     <td valign="top" align="right">
                         系统编码:
                     </td>
                     <td valign="top" align="left">
                         <input type="text" id="sys_code" name="_sysCode">
                     </td>
                 </tr>
				  <tr>
					  <td colspan="2" align="center">
						  <input class="btnfunctionout auto_disabled" type="button" id="installBtn" value="安装" onclick="install()" disabled/>
                          <input type="button" value="刷新页面缓存" onclick="genPage();"/>
                          <input type="button" value="刷新查询缓存" onclick="genQuery();"/>
                          <input type="button" value="刷新数据源缓存" onclick="genDataService();"/>
                          <input type="button" value="装载菜单" onclick="genMenu();">
					  </td>
				  </tr>
			  </table>
		  </form>
		</div>
	</div>
</body>
</html>