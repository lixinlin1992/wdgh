<%--
  User: bearangel
  Date: 11-9-17
  Time: 上午10:15
  版本信息页面
--%>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
    <jsp:include page="/pages/framework/base.jsp"/>
    <title>版本信息管理</title>
    <script type="text/javascript" language="JavaScript" src="scripts/service/version.help.js"></script>
    <script>
    function versionsInfoLoadComplete(){
        $(".btn_commit").hide();
        $(".u_0_<%=LoginUserSession.getLoginUserInfo().getId()%>").show();
    }
    </script>
    <script type="text/javascript" language="JavaScript" src="pages/rdcp/version/versionInfoJs.js"></script>
</head>
<body>
    <jsp:include page="/pages/navbar.jsp"/>
    <div class="modules">
        <div class="barquery">
            <div class="barqueryleft"></div>
            <div class="barquerycenter">版本信息管理</div>
            <div class="barqueryright"></div>
            <div class="barquerybtn">
                <a class="btn_undo u_0_<%=LoginUserSession.getLoginUserInfo().getId()%>" href="javascript:void(0);" onclick="_versionRevocationBatch();" title="提交选中的数据">撤销</a>
                <a class="btn_commit u_0_<%=LoginUserSession.getLoginUserInfo().getId()%>" href="javascript:void(0);" onclick="_versionCommitBatch();" title="提交选中的数据">提交</a>
            </div>
        </div>
            <!--查询表单区域-->
            <form name="versionSearchForm">
                <div class="barquerycontent" align="center">
                    <table class="content_List">
                        <tr>
                            <td align="right" class="contenttd" style="width:100px">版本号：</td>
                            <td align="left" style="width:150px">
                                <input type="text" name="versionNo" class="textbox_css" style="width:100px"/>
                            </td>
                            <td align="right" class="contenttd" style="width:100px">名称：</td>
                            <td align="left" style="width:150px">
                                <input type="text" name="name" class="textbox_css" style="width:100px"/>
                            </td>
                            <td align="right" class="contenttd" style="width:200px">
                                <input type="checkbox" name="editorData" value="0"><span>仅显示可提交数据</span>
                                <input type="checkbox" name="currID" value="<%=LoginUserSession.getLoginUserInfo().getId()%>"><span>仅显示我的数据</span>

                                <input class="btnquery_mouseout" onMouseOver="this.className='btnquery_mouseover'"
                                    onMouseOut="this.className='btnquery_mouseout'" type="button" value=""
                                    onclick="GRID.reload('versionInfoList')"/>
                            </td>
                        </tr>
                    </table>
                </div>
            </form>

            <!--列表区域-->
            <table id="versionInfoList" style="margin: 0; padding: 0;"></table>
            <div id="versionInfoPagerdt" style="margin: 0; padding: 0;"></div>
    </div>
</body>
</html>