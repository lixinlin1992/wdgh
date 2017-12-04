<%--Created by dlz on 2017/6/19.--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <title>法律援助</title>
    <r:include resource="!rdcp/~/pages/listBase.jsp"/>

    <script type="text/javascript" src="!gh/info/~/scripts/legalAid.js"></script>
    <link href="!comm/css/addTable.css" rel="stylesheet" type="text/css">
    <link href="!service/file~/css/editfile.css" rel="stylesheet" type="text/css"/>

</head>
<r:include resource="!comm/~/pages/commOrg.jsp"/>
<body>
<input type="hidden" id="proPath" name="proPath" value=<%=request.getContextPath() %>/>
<div class="SR_Space">
    <!--标题和一些页面功能的工具条Begin-->
    <div class="SR_moduleBox">
        <div class="SR_moduleTitle">法律援助</div>
        <div class="SR_moduleRight">
            <div>
                <a class="btn_add" href="javascript:void(0);" onclick="addLegalAid()" title="">添加提问</a>
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
                                信息标题:
                            </td>
                            <td>
                                <input type="text" name="title" class="inputText"  style="width: 180px;"/>
                            </td>

                            <td class="SR_searchTitle" style="width: 100px;">
                                信息内容:
                            </td>
                            <td>
                                <input type="text" name="content" class="inputText" style="width: 180px;"/>
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

    <!-- 电表查询列表 -->
    <div class="SR_tableContentBox">
        <table id="listdt"></table>
    </div>
    <div id="degalAidDlg" style="display:none;">
      <form id="degalAidForm" name="degalAidForm">
        <input type="hidden" id="opt" name="opt"/>
        <input type="hidden" id="legal_aid_id" name="legal_aid_id"/>
        <table>
          <tr>
            <td>标题：</td>
            <td>
              <textarea id="title" name="title" rows="3" cols="40"></textarea>
            </td>
          </tr>
          <tr>
            <td>内容：</td>
            <td>
              <textarea id="content" name="content" rows="13" cols="40"></textarea>
            </td>
          </tr>
        </table>
      </form>
    </div>
    <div id="detailDlg" style="display:none;">
        <div class="SR_searchTableBox">
            <form id="detailForm" name="detailForm">
                <input type="hidden" id="aid_id" name="aid_id"/>
                <div class="barquerycontent">
                    <table>
                        <tr>

                            <td class="SR_searchTitle" style="width: 100px;">
                                信息标题:
                            </td>
                            <td>
                                <input type="text" name="title" class="inputText"  style="width: 180px;"/>
                            </td>

                            <td class="SR_searchTitle" style="width: 100px;">
                                信息内容:
                            </td>
                            <td>
                                <input type="text" name="content" class="inputText" style="width: 180px;"/>
                                <a class="SR_moduleSearch"
                                   onmouseover="this.className='SR_moduleSearchHover';"
                                   onMouseOut="this.className='SR_moduleSearch'"
                                   onclick="rdcp.grid.reload('detail_list');return false;"></a>
                            </td>
                        </tr>
                    </table>
                </div>
            </form>
        </div>
        <div id="detail_list"></div>
    </div>
</div>
</body>
</html>
