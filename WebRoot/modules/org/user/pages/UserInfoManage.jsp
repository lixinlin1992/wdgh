<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" " http://www.w3.org/TR/html4/strict.dtd">
<html>
<title>个人信息管理</title>
<head>
    <r:include resource="!rdcp/~/pages/listBase.jsp"/>
    <script type="text/javascript" src="!org/user/~/scripts/UserInfoManage.js"></script>
</head>
<body style="padding: 0; margin: 0">
<div class="SR_Space">
    <div class="SR_moduleBox">
        <div class="SR_moduleTitle">
            个人信息管理
        </div>
        <div class="SR_moduleRight"></div>
    </div>
    <div class="SR_inputTable">
        <div class="SR_inputTableContent">
            <form name="UserInfoManageForm" id="UserInfoManageForm" method="post">
                <table>
                    <tr>
                        <td align="right" class="SR_inputTitle">
                            用户名称：
                        </td>
                        <td>
                            <input type="text" name="name" id="name" class="SR_pureInput" style="width: 200px">
                        </td>
                    </tr>
                    <tr>
                        <td align="right" class="SR_inputTitle">
                            手机号码：
                        </td>
                        <td>
                            <input type="text" name="mobile_phone" id="mobile_phone" class="SR_pureInput"
                                   style="width: 200px">
                        </td>
                    </tr>
                    <tr>
                        <td align="right" class="SR_inputTitle">
                            电子邮箱：
                        </td>
                        <td>
                            <input type="text" name="email" id="email" class="SR_pureInput" style="width: 200px">
                        </td>
                    </tr>
                    <tr>
                        <td align="right" class="SR_inputTitle">
                            用户工号：
                        </td>
                        <td>
                            <input type="text" name="account" id="account" class="SR_pureInput"
                                   style="width: 200px" readonly>
                        </td>
                    </tr>
                    <tr>
                        <td align="right" class="SR_inputTitle">
                            用户组：
                        </td>
                        <td>
                            <input type="text" name="groupName" id="groupName" class="SR_pureInput"
                                   style="width: 200px" readonly>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td colspan=2 align="left">
                            <input name='btnfunction' class='btnfunctionout' value='提交'
                                   type='button' onclick="manageUserInfo();"/>
                        </td>
                    </tr>
                </table>
            </form>
        </div>
    </div>
</div>
</body>
</html>
