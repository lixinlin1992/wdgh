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
    <title>入会审批</title>
    <r:include resource="!rdcp/~/pages/listBase.jsp"/>

    <script type="text/javascript" src="!gh/tradeManage/~/scripts/approveApplyToTrade.js"></script>
    <link href="!comm/css/addTable.css" rel="stylesheet" type="text/css">
    <link href="!service/file~/css/editfile.css" rel="stylesheet" type="text/css"/>

</head>
<r:include resource="!comm/~/pages/commOrg.jsp"/>
<body>
<input type="hidden" id="proPath" name="proPath" value=<%=request.getContextPath() %>/>
<div class="SR_Space">
    <!--标题和一些页面功能的工具条Begin-->
    <div class="SR_moduleBox">
        <div class="SR_moduleTitle">入会审批</div>
        <div class="SR_moduleRight">
            <a class="btn_exp_excel" href="javascript:void(0);"
               onclick="downExcel()" title="导出入会审批信息情况为Excel文件">导出</a>
        </div>
    </div>
    <!-- 电表查询列表 -->
    <div class="SR_tableContentBox">
        <form id="searchForm"   name="searchForm" style="display: none">
            <input type="hidden" id="user_dept_id" name="user_dept_id">
            <input type="hidden" id="type" name="type" value="0">
            <input type="hidden" id="status" name="status" value="2">

        </form>
        <table id="listdt"></table>
    </div>

    <div id="dialog" style="display: none;padding:0px !important;">
        <div class="SR_Space">
            <div class="SR_inputTable">
                <div class="SR_inputTableContent">
                    <form name="auditForm" id="auditForm" onsubmit="return false;">
                        <table>
                            <tr>
                                <td class="SR_inputTitle">
                                    审批结果：
                                </td>
                                <td>
                                    <select name="state" class="SR_pureInput" id="state"
                                            style="width: 180px;" onchange="changeType()">
                                        <option value="-1">
                                            --请选择--
                                        </option>
                                        <option value="3">
                                            通过审批
                                        </option>
                                        <option value="0">
                                            未通过审批
                                        </option>
                                    </select>
                                </td>
                                <input type="hidden" name="apply_id" id="apply_id">
                                <input type="hidden" name="apply_type" id="apply_type" value="0">
                            </tr>
                            <tr  id="comment" name="comment">
                                <td class="SR_inputTitle">
                                    审批意见：
                                </td>
                                <td>
                                    <textarea id="remarks" name="remarks" style="width: 240px;height:45px"></textarea>
                                </td>&nbsp;
                            </tr>
                        </table>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
<script type="text/javascript">
    $("#comment").hide();
    function changeType() {
        var state = $("#state").val();
        if(state=="0"){
            $("#comment").show();
        }else{
            $("#comment").hide();
        }
    }
</script>
</html>
