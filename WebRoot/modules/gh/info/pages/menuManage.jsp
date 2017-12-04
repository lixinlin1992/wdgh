<%--Created by dlz on 2017/6/17.--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <title>菜单管理</title>
    <r:include resource="!rdcp/~/pages/listBase.jsp"/>

    <script type="text/javascript" src="!gh/info/~/scripts/menuManage.js"></script>
    <link href="!comm/css/addTable.css" rel="stylesheet" type="text/css">
    <link href="!service/file~/css/editfile.css" rel="stylesheet" type="text/css"/>

</head>
<r:include resource="!comm/~/pages/commOrg.jsp"/>
<body>
<input type="hidden" id="proPath" name="proPath" value=<%=request.getContextPath() %>/>
<div class="SR_Space">
    <div align="center">
        <!-- 搜索标头开始-->
        <div class="SR_searchTableBox">
            <form id="searchForm" name="searchForm"
                  onsubmit="rdcp.grid.reload('RoleGrid');return false;" method="post">
                <div class="barquerycontent">
                    <table>
                        <tr>

                            <td class="SR_searchTitle" style="width: 100px;">
                                菜单名:
                            </td>
                            <td>
                                <input type="text" name="menuname" class="inputText"  style="width: 180px;"/>
                            </td>
                            <td>
                                <a class="SR_moduleSearch"
                                   onmouseover="this.className='SR_moduleSearchHover';"
                                   onMouseOut="this.className='SR_moduleSearch'"
                                   onclick="rdcp.grid.reload('listdt');return false;"></a>
                            </td>
                        </tr>
                    </table>
                </div>
            </form>
        </div>
    </div>
    <!-- 搜索表头结束 -->

    <!-- 菜单列表 -->
    <div class="SR_tableContentBox">
        <table id="listdt"></table>
    </div>


    <div class="clear"></div>
    <!-- 修改菜单名称 -->
    <div id="dialog" style="display: none;padding:0px !important;">
        <div class="SR_Space">
            <div class="SR_inputTable">
                <div class="SR_inputTableContent">
                    <form name="editmenuform" id="editmenuform" onsubmit="return false;">
                        <input type="hidden" name="menuid" id="menuid">
                        <table>
                            <tr>
                                <td class="SR_inputTitle">
                                    菜单名称：
                                </td>
                                <td>
                                    <input id="menuname" name="menuname" type="text" class="SR_pureInput"
                                           style="width: 200px;"/>
                                </td>
                            </tr>
                        </table>
                    </form>
                </div>
            </div>
        </div>
    </div>

</div>
</body>
</html>
