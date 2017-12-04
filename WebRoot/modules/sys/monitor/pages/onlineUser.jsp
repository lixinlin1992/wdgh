<%--
File: resourceAccessStatis.jsp
User: kinz
Date: 13-12-13 下午11:54
Module: sys/monitor

--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>在线用户登录统计</title>
    <r:include resource="!rdcp/~/pages/listBase.jsp"/>
    <link href="themes/liger/css/ligerUISkins/ligerui-icons.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript" src="!sys/monitor/~/scripts/onlineUser.js"></script>
    <script type="text/javascript">
        rdcp.ready(function(){
            rdcp.grid("onlineUserGrid","!sys/monitor/~query/Q_ONLINEUSER_LIST","resLogGridForm",onlineUserParams);
        });
    </script>
</head>
<body>
<div class="SR_Space">

    <!--标题和一些页面功能的工具条Begin-->
    <div class="SR_moduleBox">
        <div class="SR_moduleTitle">在线用户</div>
        <div class="SR_moduleRight">
        </div>
    </div>
    <div class="clear"></div>
    <!--标题和一些页面功能的工具条End-->

    <!--搜索表格Begin-->
    <div class="SR_searchTableBox">
        <form id="resLogGridForm" name="resLogGridForm" onsubmit="rdcp.grid.reload('onlineUserGrid');return false;"
              method="post">
            <table>
                <tr>
                    <td class="SR_searchTitle">工号:</td>
                    <td><input name="user_account" class="SR_pureInput" type="text"/></td>
                    <td class="SR_searchTitle">姓名:</td>
                    <td><input name="user_name" class="SR_pureInput" type="text"/></td>
                    <td><a class="SR_moduleSearch" onmouseover="this.className='SR_moduleSearchHover';"
                           onMouseOut="this.className='SR_moduleSearch'" href="javascript://"
                           onclick="rdcp.grid.reload('onlineUserGrid');"></a>
                    </td>
                </tr>
            </table>
            <div  style="width: 0px;height:0px;"><input type="submit" value=""/></div>
        </form>
    </div>
    <!--搜索表格End-->

    <!--页面表格Begin-->
    <div class="SR_tableContentBox">
        <table id="onlineUserGrid"></table>
    </div>
    <div class="clear"></div>
    <!--页面表格End-->
</div>
</body>
</html>