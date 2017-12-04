<%--
  Created by IntelliJ IDEA.
  User: lh
  Date: 2014/10/22
  Time: 18:19
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <title>处理工单</title>
    <r:include resource="!rdcp/~/pages/listBase.jsp"/>
    <script type="text/javascript" src="!property/base/~/scripts/workFlow/handleWorkForm.js"></script>
    <link href="!comm/css/addTable.css" rel="stylesheet" type="text/css">
    <link href="!service/file~/css/editfile.css" rel="stylesheet" type="text/css"/>
</head>
<body style="background:#f4f4f4">
<div class="SR_Space">
    <div class="SR_inputTable">
        <div class="clear"></div>
        <form name="handleWorkOrderForm" id="handleWorkOrderForm" onsubmit="return false;" method="post">

            <input type="hidden" name="taskId" id="taskId" value="<%=request.getParameter("taskId")%>">
            <input type="hidden" name="woId" id="woId" value="<%=request.getParameter("woId")%>">
            <input type="hidden" name="objId" id="objId" value="<%=request.getParameter("objId")%>">

            <div class="SR_moduleBox" style="border-bottom:1px solid #cccccc;">
                <div class="SR_moduleTitle">工单处理</div>
            </div>
            <div class="SR_inputTableContent" style="border-bottom: 1px solid #cccccc;margin-bottom: 0px;">
                <table style="margin-bottom: 5px;">
                    <tbody>
                    <tr>
                        <td class="SR_inputTitle">流程名称:</td>
                        <td>
                            <input type="text" name="process_name" id="process_name" class="inputText" disabled/>
                        </td>
                        <td class="SR_inputTitle">工单标题:</td>
                        <td colspan="3">
                            <input type="text" name="work_order_title" id="work_order_title" style="width: 535px"
                                   disabled
                                    />
                        </td>
                    </tr>
                    <tr>
                        <td class="SR_inputTitle">当前环节:</td>
                        <td>
                            <input type="hidden" id="curr_node_id" name="curr_node_id"/>
                            <input type="text" name="curr_node_name" id="curr_node_name" class="inputText" disabled
                                    />
                        </td>
                        <td class="SR_inputTitle"><span style="color: red;" class="warn">*</span>处理结果:</td>
                        <td>
                            <select id="handle_result" name="handle_result" class="SR_pureInput"
                                    onchange="initNextStepManByResultAndTaskId(this.value,$('#taskId').val())">
                                <option value="">--请选择--</option>
                            </select>
                        </td>
                        <td class="SR_inputTitle"> 接单人:</td>
                        <td>

                            <input type="hidden" id="next_step_man_id" name="next_step_man_id"/>
                            <input class="SR_pureInput" type="text" id="next_step_man" name="next_step_man"
                                   style="width:154px;"/>

                        </td>
                    </tr>
                    <tr>

                        <td class="SR_inputTitle" valign="top">处理意见:</td>
                        <td colspan="7">
                            <textarea name="handle_suggestion" id="handle_suggestion" cols="122" rows="2"></textarea>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </form>
        <div class="SR_moduleBox" style="border-bottom:1px solid #cccccc;">
            <div class="SR_moduleTitle">工单历史</div>
        </div>
        <div class="SR_inputTableContent" style="border-bottom: 1px solid #cccccc;margin-bottom: 0px;">
            <div id="span_handleHistory" style="margin: 8px;margin-left: 45px;"></div>
        </div>
        <div class="SR_moduleBox" style="border-bottom:1px solid #cccccc;">
            <div class="SR_moduleTitle">对象表单</div>
        </div>
        <%--<div class="SR_inputTableContent" style="border-bottom: 0px solid #cccccc;margin-bottom: 0px;">--%>
        <div id="span_objectForm"></div>
        <%--</div>--%>
    </div>
</div>
<br>
<br>
<br>

<div class="floatBtn" id="newfloatBtn">
    <div class="floatSmallBtn" style="width: 500px;" align="center">
        <a class="btn_commit" href="javascript:void(0);"
           onclick="beforeSubmitWorkFlow();" title="">提交</a>
        <a class="btn_cancel" href="javascript:void(0);"
           onclick="CloseTab('handleWorkForm'+$('#taskId').val(),'处理工单');" title="">取消</a>
    </div>
</div>
</body>
</html>
