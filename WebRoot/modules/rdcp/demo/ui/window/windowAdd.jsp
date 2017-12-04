<%@ taglib prefix="s" uri="/struts-tags" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<div class="easyui-layout" data-options="fit:true" style="width: 700px; height: 350px;">
    <div data-options="region:'north'" style="height: 50px"></div>
    <div data-options="region:'south',split:true" style="height: 50px;"></div>
    <div data-options="region:'east',split:true" title="东部" style="width: 180px;"></div>
    <div data-options="region:'west',split:true" title="西部" style="width: 180px;"></div>
    <div data-options="region:'center',title:'列表',iconCls:'icon-ok'">

        <div id="NoticeDetailPanel" style="height:100%">
            <form name="userForm" id="userForm" onsubmit="rdcp.toCommit('#userForm','!test/ds/DS_USER_ADD_TEST');">
                <table align="center">
                    <tr class="formRow" >
                        <td class="formLabel">登陆名:</td>
                        <td class="formField"><input type="text" name="account" id="account"/></td>
                    </tr>
                    <tr class="formRow">
                        <td class="formLabel">用户名:</td>
                        <td class="formField"><input type="text" name="name" id="name"  /></td>
                    </tr>
                    <tr class="formRow">
                        <td class="formLabel">密码:</td>
                        <td class="formField"><input type="password" name="pwd" id="pwd" class="easyui-validatebox" data-options="required:true" /></td>
                    </tr>
                    <tr class="formRow">
                        <td class="formLabel">重复密码:</td>
                        <td class="formField"><input type="password" name="rpwd" id="rpwd" class="easyui-validatebox" data-options="required:true"
                                                     validType="equals['#pwd']"/></td>
                    </tr>
                    <tr class="formRow">
                        <td class="formLabel">性别:</td>
                        <td class="formField">
                            <input type="radio" name="sex" id="sex" value="1" checked="checked"/>男
                            <input type="radio" name="sex" id="sex" value="0"/>女
                        </td>
                    </tr>
                    <tr class="formRow">
                        <td class="formLabel">操作:</td>
                        <td class="formField">
                            <input type="button" name="ok_button" id="ok_button" value="提交"/>
                            <input type="reset" name="reset_button" id="reset_button" value="重置"/>
                            <input type="button" name="back_button" id="back_button" onclick="rdcp.window.colse('');" value="返回"/>
                        </td>
                    </tr>
                </table>
            </form>
        </div>
    </div>
</div>
