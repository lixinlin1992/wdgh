<%--
File: resourceAccessManage.jsp
User: kinz
Date: 13-12-12 下午4:53
Module: 授权管理

--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>资源授权</title>
    <r:include resource="!rdcp/pages/listBase.jsp"/>
    <script type="text/javascript" src="!sys/security/~/scripts/resourceAccessManage.js"></script>
    <script>
        rdcp.ready(function () {
            init();
        });
    </script>
</head>
<body>
<div class="SR_Space">
    <div class="SR_moduleBox">
        <div class="SR_moduleTitle">资源访问授权</div>
        <div class="SR_moduleRight">
            <a class="btn_refresh" href="javascript:void(0);" onclick="reloadAccess();" title="刷新授权">刷新</a>
        </div>
    </div>
    <div class="clear"></div>
    <table border="0">
        <tr>
            <td valign="top">
                <div style="color: red; font-size: 10pt;margin-right:10px">在完成权限的调整后，需要刷新后生效（右上方）。</div>
                <div id="OBJ_TABS_ID" class="easyui-tabs" style="width:350px;height:500px;margin-right:10px">
                    <div title="按用户授权" style="padding: 0px;">
                        <div class="SR_searchTableBox">
                            <form id="userGridFormID" name="userGridForm"
                                  onsubmit="rdcp.grid.reload('userGrid');return false;"
                                  method="post">
                                <table>
                                    <tr>
                                        <td class="SR_searchTitle">帐号:</td>
                                        <td><input name="useraccount" class="SR_pureInput" type="text"
                                                   style="width:80px;"/></td>
                                        <td class="SR_searchTitle">名称:</td>
                                        <td><input name="username" class="SR_pureInput" type="text"
                                                   style="width:80px;margin-right: 10px"/></td>
                                        <td><a class="SR_moduleSearch"
                                               onmouseover="this.className='SR_moduleSearchHover';"
                                               onMouseOut="this.className='SR_moduleSearch'" href="javascript://"
                                               onclick="rdcp.grid.reload('userGrid');"></a>
                                        </td>
                                    </tr>
                                </table>
                                <div style="width: 0px;height:0px;display:none;"><input type="submit" value=""></div>
                            </form>
                        </div>

                        <div class="SR_tableContentBox">
                            <table id="userGrid"></table>
                        </div>
                    </div>
                    <div title="按角色授权" style="padding:0px">
                        <div class="SR_searchTableBox">
                            <form id="usergroupGridFormID" name="userGridForm"
                                  onsubmit="rdcp.grid.reload('usergroupGrid');return false;"
                                  method="post">
                                <table>
                                    <tr>
                                        <td class="SR_searchTitle">角色名:</td>
                                        <td><input name="name" class="SR_pureInput" type="text"/></td>
                                        <td><a class="SR_moduleSearch"
                                               onmouseover="this.className='SR_moduleSearchHover';"
                                               onMouseOut="this.className='SR_moduleSearch'" href="javascript://"
                                               onclick="rdcp.grid.reload('usergroupGrid');"></a>
                                        </td>
                                    </tr>
                                </table>
                                <div style="width: 0px;height:0px;display:none;"><input type="submit" value=""></div>
                                <input type="hidden" name="super_admin" value="0">
                            </form>
                        </div>

                        <div class="SR_tableContentBox">
                            <table id="usergroupGrid"></table>
                        </div>
                    </div>
                    <%--暂时屏蔽按部门授权的配置方式--%>
                    <%--<div title="按部门授权" style="padding:10px">--%>
                        <%--<div id="DEPT_TREE">--%>
                            <%--<ul id="tree"></ul>--%>
                        <%--</div>--%>
                    <%--</div>--%>
                </div>
            </td>
            <td valign="top">
                <div class="SR_searchTableBox" style="margin-top: 15px;">
                    <form id="resourceFormID" name="resourceForm"
                          onsubmit="loadResources();return false;"
                          method="post">
                        <table>
                            <tr>
                                <td class="SR_searchTitle" >模块名称:</td>
                                <td><input name="module_name" class="SR_pureInput" type="text"/></td>
                                <%--<td class="SR_searchTitle">模块路径:</td>--%>
                                <%--<td><input name="module_path" class="SR_pureInput" type="text"/></td>--%>
                                <td class="SR_searchTitle">资源名称:</td>
                                <td><input name="res_name" class="SR_pureInput" type="text"/></td>
                                <td class="SR_searchTitle">资源路径:</td>
                                <td><input name="res_path" class="SR_pureInput" type="text"/></td>
                                <td><a class="SR_moduleSearch"
                                       onmouseover="this.className='SR_moduleSearchHover';"
                                       onMouseOut="this.className='SR_moduleSearch'" href="javascript://"
                                       onclick="loadResources();"></a>
                                </td>
                            </tr>
                        </table>
                        <div style="width: 0px;height:0px;display:none;"><input type="submit" value=""></div>
                    </form>
                </div>
                <div id="resource_container" style="overflow-y: auto;"></div>
            </td>
        </tr>
    </table>
</div>
</body>
</html>