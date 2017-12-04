<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
	<head>
		<title>数据库设计表</title>
		<jsp:include page="/pages/framework/base.jsp" />
		<script type="text/javascript" src="scripts/common/ztree.help.js"></script>

		<link type="text/css" rel="stylesheet"
			href="themes/default/css/rdcp.css" />
		<script type="text/javascript" src="scripts/rdcp/rdcp.js"></script>
		<script type="text/javascript" src="scripts/datePicker/WdatePicker.js"></script>
		<script type="text/javascript" src="scripts/service/function.help.js"></script>
		<script type="text/javascript">
var tableTree;
$(function(){			
//数据表树
	tableTree = new ZTree("table_tree", "DS_SYSTEM_TABLE_TREE",{nodeClicked:zTreeOnClick,async:"true"});		
});
//树的点击
function zTreeOnClick(event, treeId, treeNode) {
	alert(treeNode.sys);
	if(treeNode.level>=2){//最后一层节点
		if(treeNode.nodeType==-1){//nodeType为1是表
			document.getElementById("contentFrame1").src="pages/rdcp/dbdesign/tableDesignList.jsp";
		}
	}else if(treeNode.level==1){//第二层节点
		
	}else{
		document.getElementById("contentFrame1").src="";
	}
}
		</script>
	</head>

	<body>
		<jsp:include page="/pages/navbar.jsp" />
		<div class="moudles">
			<div class="barquery">
				<div class="barquerycenter">
					数据库设计
				</div>
				<div class="barquerybtn">
					<input type="button" value="添加"
						class="btn_additionout auto_disabled" onclick="tableAdd();" />
				</div>
			</div>
		</div>
		<div>
			<table style="width: 100%">
				<tr>
					<td valign="top">
						<!-- 数据库树 -->
						<div id="table_tree" class="tree"
							style="width: 200px; height: 500px; overflow-y: auto;">
						</div>
					</td>
					<td valign="top" style="width: 100%">
						<iframe align="middle" src="" id="contentFrame1" name="contentFrame1"
							width="1100px" height="400px" scrolling="yes" height="90"
							frameborder="0"></iframe>												
					</td>
				</tr>
			</table>
		</div>
	</body>
</html>
