<!--
Created by IntelliJ IDEA.
User: sunjiaxin
Date: 2017/6/21
Time: 7:52
To change this template use File | Settings | File Templates.
-->
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <title>稿件管理</title>
    <r:include resource="!rdcp/~/pages/listBase.jsp"/>

    <script type="text/javascript" src="!gh/manu/~/scripts/manuManage.js"></script>
    <link href="!comm/css/addTable.css" rel="stylesheet" type="text/css">
    <link href="!service/file~/css/editfile.css" rel="stylesheet" type="text/css"/>

</head>
<r:include resource="!comm/~/pages/commOrg.jsp"/>
<body>
<input type="hidden" id="proPath" name="proPath" value=<%=request.getContextPath() %>/>
<div class="SR_Space">
    <!--标题和一些页面功能的工具条Begin-->
    <div class="SR_moduleBox">
        <div class="SR_moduleTitle">稿件管理</div>
        <div class="SR_moduleRight">
            <div>
                <a class="btn_add" href="javascript:void(0);" onclick="addManu()" title="">提交稿件</a>
            </div>
        </div>
    </div>
    <!--标题和一些页面功能的工具条End-->
    <div align="center">
        <!-- 搜索标头开始-->
        <div class="SR_searchTableBox">
            <form id="searchForm" name="searchForm"
                  onsubmit="rdcp.grid.reload('RoleGrid');return false;" method="post">
                <div class="barquerycontent">
                    <table>
                        <tr>

                            <td class="SR_searchTitle" style="width: 100px;">
                                标题:
                            </td>
                            <td>
                                <input type="text" name="company" class="inputText"  style="width: 180px;"/>
                            </td>

                            <td class="SR_searchTitle" style="width: 100px;">
                                状态:
                            </td>
                            <td>
                                <select id="state" name="state" style="width: 180px;">
                                    <option value="">--请选择--</option>
                                    <option value="0">已提交</option>
                                    <option value="1">通过审核</option>
                                    <option value="2">未通过审核</option>
                                    <option value="3">通过审批</option>
                                    <option value="4">未通过审批</option>
                                </select>
                            </td>
                            <td>
                                <a class="SR_moduleSearch"
                                   onmouseover="this.className='SR_moduleSearchHover';"
                                   onMouseOut="this.className='SR_moduleSearch'"
                                   onclick="rdcp.grid.reload('menu_list');return false;"></a>
                            </td>
                        </tr>
                    </table>
                </div>
            </form>
        </div>
    </div>

    <!-- 搜索表头结束 -->

    <!-- 电表查询列表 -->
    <div class="SR_tableContentBox">
        <table id="menu_list"></table>
    </div>
</div>
</body>
</html>
