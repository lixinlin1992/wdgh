<%--
  Created by IntelliJ IDEA.
  User: lh
  Date: 2014/9/28
  Time: 11:32
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <title>文体天地</title>
    <r:include resource="!rdcp/~/pages/listBase.jsp"/>

    <script type="text/javascript" src="!gh/tradeManage/~/scripts/applyToTradeManage.js"></script>
    <link href="!comm/css/addTable.css" rel="stylesheet" type="text/css">
    <link href="!service/file~/css/editfile.css" rel="stylesheet" type="text/css"/>

</head>
<r:include resource="!comm/~/pages/commOrg.jsp"/>
<body>
<input type="hidden" id="proPath" name="proPath" value=<%=request.getContextPath() %>/>
<div class="SR_Space">
    <!--标题和一些页面功能的工具条Begin-->
    <div class="SR_moduleBox">
        <div class="SR_moduleTitle">入会申请管理</div>
        <div class="SR_moduleRight">
            <div>
                <a id="btn_add" class="btn_add" href="javascript:void(0);" onclick="applyToTrade()" style="display:none;">申请入会</a>
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
    <div id="auditDlg" style="display:none;">
       <div class="SR_searchTableBox">
         <form id="audit_form" name="audit_form">
             <input type="hidden" id="apply_id" name="apply_id"/>
             <input type="hidden" id="apply_status" name="apply_status"/>
             <table>
               <tr>
                 <td class="SR_searchTitle">当前处理环节:</td>
                 <td id="audit_code"></td>
               </tr>
               <tr>
                 <td class="SR_searchTitle">处理结果:</td>
                 <td>
                   <select id="audit_result" name="audit_result">
                     <option value="1">同意</option>
                     <option value="0">不同意</option>
                   </select>
                 </td>
               </tr>
               <tr>
                 <td class="SR_searchTitle">处理意见:</td>
                 <td>
                    <textarea id="audit_content" name="audit_content" rows="4" cols="30"></textarea>
                 </td>
               </tr>
             </table>
         </form>
       </div>
    </div>
</div>
</body>
</html>
