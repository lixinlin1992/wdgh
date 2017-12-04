<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<script type="text/javascript" src="!property/base/~/scripts/workFlow/workFlow.js"></script>
<%--<div id="terminal_div_add" style="display: none;"></div>--%>
<%--<div id="terminal_div_rebate" style="display: none;"></div>--%>
<div class="SR_Space">
<div id="div_work_flow" style="display:none;width:370px">

        <div class="SR_moduleBox" style="border-bottom:1px solid #cccccc;">
            <div class="SR_moduleBox">
                <div class="SR_moduleTitle">办理工单</div>
                <div class="SR_btnBox">
                    <ul class="SR_longBtnSpace">
                        <li class="grayBtn">
                            <a href="javascript:$('#submitWorkFlow').unbind('click');closeSlidePanel();">关闭</a>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
        <div class="clear"></div>
        <form name="workFlowForm" id="workFlowForm" onsubmit="return false;" method="post">
            <input type="hidden" name="taskId" id="taskId">
            <input type="hidden" name="workOrderId" id="workOrderId">

            <div class="SR_inputTable">
                <div class="SR_inputTableContent">
                    <table>
                        <tbody>
                        <tr>
                            <td class="SR_inputTitle">当前环节:&nbsp;</td>
                            <td>
                                <input type="hidden" id="curr_node_id" name="curr_node_id"/>
                                <input type="text" name="curr_node_name" id="curr_node_name" class="inputText"
                                       readonly/>
                            </td>
                        </tr>
                        <tr>
                            <td class="SR_inputTitle"> 下一步:&nbsp;</td>
                            <td>
                                <select id="handle_result" name="handle_result" class="SR_pureInput"
                                        onchange="initNextStepMan(this.value,$('#workOrderId').val());">
                                    <option value="">--请选择--</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td class="SR_inputTitle"> 接单人:&nbsp;</td>
                            <td>

                                <input type="hidden" id="next_step_man_id" name="next_step_man_id"/>
                                <input class="SR_pureInput" type="text" id="next_step_man" name="next_step_man"
                                       style="width:154px;"/>

                            </td>
                        </tr>
                        <tr>
                            <td class="SR_inputTitle" valign="top">发起说明:&nbsp;</td>
                            <td>
                                <textarea name="handle_suggestion" id="handle_suggestion" cols="19" rows="4"></textarea>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2" align="center">
                                <br/>
                                <br/>
                                <a class="btn_commit" href="javascript:void(0);" id="submitWorkFlow" title="">提交</a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </form>
    </div>
</div>

