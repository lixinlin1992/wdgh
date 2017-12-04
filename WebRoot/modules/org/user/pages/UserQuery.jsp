<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<title>用户管理</title>
<head>
    <r:include resource="!rdcp/~/pages/listBase.jsp"/>
    <script type="text/javascript" src="!org/user/~/scripts/UserQuery.js"></script>
</head>
<body style="padding: 0; margin: 0">
<div id="tmp" style="display: none;">
    <form name="roleCheckboxForm" id="roleCheckboxForm">
        <input type="hidden" name="user_id" id="user_id"/>

        <p id="functionId"></p>
    </form>
</div>

<div class="SR_Space">
    <div class="SR_moduleBox">
        <div class="SR_moduleTitle">用户管理</div>
        <div class="SR_moduleRight">
            <a class="btn_add" href="javascript:void(0);" onclick="addUser();" title="添加新用户">添加</a>
            <a class="btn_exp_excel" href="javascript:void(0);"
               onclick="rdcp.goto('!org/user/~query/Q_USER_LIST',{params:'result=excel&fileName=用户列表导出',form:'userManager'});"
               title="导出用户信息列表为Excel文件">导出</a>
            <!--  <a href="javascript://nop/;" class="btnfunctionout" style="padding:3px 5px;" onclick="CORE.goToDS('SYS_P_USER_LIST','result=excel&fileName=用户列表导出','userManager')">导出Excel</a>-->
            <%--<input class="btn_excelout" type="button"--%>
            <%--onclick="CORE.goToDS('DS_USER_LIST','result=excel&fileName=用户列表导出','userManager')"--%>
            <%--value="导出"/>--%>
            <%--<input name="btn_addition" class="btn_additionout" value="添加" type="button" onclick="addUser();"/>--%>
        </div>
    </div>
    <div align="center">
    <div class="SR_searchTableBox">
        <form name="userManager" id="userManager" method="post">
            <table>
                <tr>
                    <td style="width: 60px;" align="right" class="SR_searchTitle">
                        用户工号:
                    </td>
                    <td align="left">
                        <input type="text" name="useraccount" class="SR_pureInput" value="">
                    </td>
                    <td style="width: 60px;" align="right" class="SR_searchTitle">
                        用户名称:
                    </td>
                    <td align="left">
                        <input type="text" name="username" class="SR_pureInput" value="">
                    </td>
                    <td style="width: 60px;" align="right" class="SR_searchTitle">
                        手机号码:
                    </td>
                    <td align="left">
                        <input type="text" class="SR_pureInput" name="mobilephone" value="">
                    </td>
                </tr>
                <tr>
                    <td style="width: 60px;" align="right" class="SR_searchTitle">
                        状&nbsp;&nbsp;态:
                    </td>
                    <td align="left">
                        <select name="statusid" class="SR_pureInput" id="statusidSelect"
                                style="width: 152px;">
                            <option value="">
                                --请选择--
                            </option>
                            <option value="1">
                                有效
                            </option>
                            <option value="2">
                                已注销
                            </option>
                        </select>
                    </td>
                    <td colspan="4">
                        <a class="SR_moduleSearch"
                           onmouseover="this.className='SR_moduleSearchHover';"
                           onMouseOut="this.className='SR_moduleSearch'" href="javascript://"
                           onclick="rdcp.grid.reload('listuser');return false;"></a>
                    </td>
            </table>
        </form>
    </div>
    </div>
    <div class="SR_tableContentBox">
        <table id="listuser"></table>
    </div>
    <div style="width:98%;text-align:left;padding-top:10px">
        <b>说明：</b><br>
        1. 可单独为用户进行系统功能的访问授权<br>
        2. 可对用户进行功能授权排除，意思是，对用户从角色继承过来的授权将排除这些。<br>
        3. 排除的功能授权只对用户所属角色的授权生效，单独对用户进行设置的授权不受影响。<br>
    </div>
    <div class="clear"></div>
</div>
    <!-- 修改用户信息 -->
    <div id="dialog" style="display: none;padding:0px !important;">
        <div class="SR_Space">
            <div class="SR_inputTable">
                <div class="SR_inputTableContent">
                    <form name="edituserform" id="edituserform" onsubmit="return false;">
                        <input type="hidden" name="id" id="userId">
                        <table>
                            <tr>
                                <td class="SR_inputTitle">
                                    工号：
                                </td>
                                <td>
                                    <input id="account" name="account" class="SR_pureInput" type="text"
                                           style="width: 200px;"/>
                                </td>
                            </tr>
                            <tr>
                                <td class="SR_inputTitle">
                                    用户名：
                                </td>
                                <td>
                                    <input id="name" name="name" type="text" class="SR_pureInput"
                                           style="width: 200px;"/>
                                </td>
                            </tr>
                            <tr id="pass">
                                <td class="SR_inputTitle">
                                    用户密码：
                                </td>
                                <td>
                                    <input id="password" name="password" type="password" class="SR_pureInput" value="888888"
                                           style="width: 200px;"/>
                                </td>
                            </tr>
                            <tr>
                                <td class="SR_inputTitle">
                                    手机号码：
                                </td>
                                <td>
                                    <input id="mobile_phone" name="mobile_phone" class="SR_pureInput" type="text"
                                           style="width: 200px;"/>
                                </td>
                            </tr>
                            <tr>
                                <td class="SR_inputTitle">
                                    邮箱：
                                </td>
                                <td>
                                    <input id="email" name="email" type="text" class="SR_pureInput"
                                           style="width: 200px;"/>
                                </td>
                            </tr>
<%--                            <tr>
                                <td class="SR_inputTitle">
                                    类型：
                                </td>
                                <td>
                                    <input id="userType" name="userType" class="selectbox"/>
                                </td>
                            </tr>--%>
                            <tr class="formRow">
                                <td class="SR_inputTitle">
                                    部门：
                                </td>
                                <td>
<%--                                    <input type="hidden" name="dept_id" id="_Dept_Id">
                                    <input type="text" readonly="readonly" class="SR_pureInput" name="dept_name"
                                           id="_Dept_Name">
                                    <input type="button" value="选择" onclick="selectDept();">--%>
                                   <select id="dept_id" name="dept_id"  style="width: 200px;">
                                   <option value="">--请选择--</option>
                                   </select>
                                </td>
                            </tr>
                            <tr>
                                <td class="SR_inputTitle">
                                    状态：
                                </td>
                                <td>
                                    <label><input name="status_id" type="radio" value="1" checked>有效</label>
                                    <label><input name="status_id" type="radio" value="2">注销</label>
                                </td>
                            </tr>
                        </table>
                        <table width="100%;">
                            <tr>
                                <td style="width: 43%;" align="right">
                                    可分配角色<br>
                                    <select id="leftBox" name="leftBox" size="8" style="width: 140px;"
                                            multiple="multiple">
                                    </select>
                                    <br><br></td>
                                <td width="14%" align="center">
                                    <input id="perRight" type="button" style="width: 46px;"
                                           class="btnfunctionout" onclick="right()" value="  >  ">
                                    <br>
                                    <br>
                                    <br>
                                    <input id="perLeft" type="button" style="width: 46px;"
                                           class="btnfunctionout" onclick="left()" value="  <  ">
                                    <br><br></td>
                                <td style="width: 43%;" align="left">
                                    已分配角色<br>
                                    <select id="rightBox" name="rightBox" size="8" style="width: 140px;"
                                            multiple="multiple"></select>
                                    <br><br></td>
                            </tr>
                        </table>
                        <font color="red" id="notice" style="margin-left: 20%;">提示：用户初始密码为888888！</font>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div style="display:none;" class="tree" id="tree">
    </div>
    <div style="display:none;" id="service_user">
        <ul id="treeService" class="tree"
            style="float:left;width:200px;height:330px;overflow:auto;margin-right:10px;"></ul>
        <form id="serviceForm" name="serviceForm" style="float:left;">
            <input type="hidden" id="areaid" name="areaid" value="1">

            <div style="width:250px;">
                <table id="listnet_service" style="margin: 0; padding: 0;"></table>
                <div id="pagerdt1" style="margin: 0; padding: 0;"></div>
            </div>
        </form>
    </div>
</center>
</div>
</body>
</html>
