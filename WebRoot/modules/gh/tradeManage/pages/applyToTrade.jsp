<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@page import="com.sunrise.service.security.entity.SysPUser" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" " http://www.w3.org/TR/html4/strict.dtd">
<html>
<title>修改密码</title>
<head>
    <r:include resource="!rdcp/~/pages/listBase.jsp"/>
    <script type="text/javascript" src="!gh/tradeManage/~/scripts/applyToTrade.js"></script>
    <script type="text/javascript" src="!property/base/~/scripts/validate/validate.js"></script>
</head>
<%
  String option = request.getParameter("option");
  String apply_id = request.getParameter("apply_id");
    String account;
    SysPUser user = (SysPUser) session.getAttribute(LoginUserSession.UserSession_Key);
    account = request.getParameter("account")==null?user.getAccount():request.getParameter("account");
%>
<script type="text/javascript">
  var option = "<%=option%>";
  var apply_id = "<%=apply_id%>";
  var account="<%=account%>";
</script>
<body style="padding: 0; margin: 0">

<div class="SR_Space">
    <div class="SR_moduleBox">
        <div class="SR_moduleTitle">填写信息</div>
        <div class="SR_moduleRight">
        </div>
    </div>
    <div class="SR_inputTable">
        <div class="SR_inputTableContent">
            <form name="trade_form" id="trade_form" method="post">
                <input type="hidden" id="apply_type" name="apply_type">
                <table border="0">
                    <tr>
                        <td align="right" class="SR_inputTitle">工号:</td>
                        <td>
                            <input type="text" id="account" name="account" class="SR_pureInput" readonly/>
                        </td>
                        <td align="right" class="SR_inputTitle"><font color="red">*</font>姓名:</td>
                        <td>
                            <input type="text" id="name" name="name" class="SR_pureInput" readonly/>
                        </td>
                        <td align="right" class="SR_inputTitle"><font color="red">*</font>性别:</td>
                        <td>
                            <select id="sex" name="sex">
                              <option value="-1">--请选择--</option>
                              <option value="1">男</option>
                              <option value="0">女</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td align="right" class="SR_inputTitle"><font color="red">*</font>出生年月:</td>
                        <td>
                            <input type="text" id="birthday" name="birthday"<input type="text" name="urgency" onfocus="WdatePicker({dateFmt : 'yyyy-MM-dd'})" class="Wdate" readonly=""/>
                        </td>
                        <td align="right" class="SR_inputTitle"><font color="red">*</font>政治面貌:</td>
                        <td>
                            <select id="political_status" name="political_status">
                               <option value="-1">--请选择--</option>
                            </select>
                        </td>
                        <td align="right" class="SR_inputTitle"><font color="red">*</font>民族:</td>
                        <td>
                            <input type="text" id="nation" name="nation" class="SR_pureInput"/>
                        </td>
                    </tr>
                    <tr>
                        <td align="right" class="SR_inputTitle"><font color="red">*</font>电子邮箱:</td>
                        <td>
                            <input type="text" id="email" name="email" class="SR_pureInput"/>
                        </td>
                        <td align="right" class="SR_inputTitle"><font color="red">*</font>证件类型:</td>
                        <td>
                            <select id="card_type" name="card_type">
                               <option value="-1">--请选择--</option>
                               <option value="1">身份证</option>
                               <option value="2">一卡通</option>
                            </select>
                        </td>
                        <td align="right" class="SR_inputTitle"><font color="red">*</font>证件号:</td>
                        <td>
                            <input type="text" id="card_no" name="card_no" class="SR_pureInput"/>
                        </td>
                    </tr>
                    <tr>
                        <td align="right" class="SR_inputTitle"><font color="red">*</font>学历:</td>
                        <td>
                            <select id="qualifications" name="qualifications">
                               <option value="-1">--请选择--</option>
                            </select>
                        </td>
                        <td align="right" class="SR_inputTitle"><font color="red">*</font>学位:</td>
                        <td>
                            <select id="degree" name="degree">
                               <option value="-1">--请选择--</option>
                            </select>
                        </td>
                        <td align="right" class="SR_inputTitle"><font color="red">*</font>岗位:</td>
                        <td>
                            <input type="text" id="post" name="post" class="SR_pureInput"/>
                        </td>
                    </tr>
                    <tr>
                        <td align="right" class="SR_inputTitle"><font color="red">*</font>职务职称:</td>
                        <td>
                            <input type="text" id="duties" name="duties" class="SR_pureInput"/>
                        </td>
                        <td align="right" class="SR_inputTitle">所属单位:</td>
                        <td>
                            <select id="dept_id" name="dept_id">
                               <option value="-1">--请选择--</option>
                            </select>
                        </td>
                        <td align="right" class="SR_inputTitle">手机号:</td>
                        <td>
                            <input type="text" id="tele_phone" name="tele_phone" class="SR_pureInput"/>
                        </td>
                    </tr>
                    <tr>
                        <td align="right" class="SR_inputTitle">备注:</td>
                        <td colspan="2">
                            <textarea id="memo" name="memo" rows="5" cols="40"></textarea>
                        </td>
                        <td colspan="2"  align="left">
                          <input type="checkbox" id="is_agree"/>
                          同意《中华全总工会入会申请书》</td>
                    </tr>
                </table>
            </form>
        </div>
    </div>
<%--    <div class="SR_moduleBox" id="audit_div1" style="display:none;">
        <div class="SR_moduleTitle">审核记录</div>
        <div class="SR_moduleRight">
        </div>
    </div>
    <div id="audit_div2" class="SR_inputTable" style="height:120px;" style="display:none;">
       <div class="SR_inputTableContent">
          <div id="span_handleHistory" style="margin: 8px;margin-left: 45px;"></div>
       </div>
    </div>--%>
</div>
<div class="floatBtn">
    <div class="floatSmallBtn" style="width: 500px;" align="center">
        <a class="btn_commit" href="javascript:void(0);" onclick="submit();" id="btn_submit">提交</a>
        <a class="btn_cancel" href="javascript:void(0);" onclick="cancel();" id="btn_cancel">取消</a>
    </div>
</div>
</body>
</html>
