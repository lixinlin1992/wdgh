<%--
File: ipRulesList.jsp
User: kinz
Date: 11-10-12 下午3:58


--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>IP规则</title>
    <jsp:include page="/pages/framework/base.jsp"/>
</head>
<body>
<jsp:include page="/pages/navbar.jsp"/>
<div class="modules">
    <div class="barquery">
        <div class="barqueryleft"></div>
        <div class="barquerycenter">IP登录规则管理</div>
        <div class="barqueryright"></div>
        <div class="barquerybtn">
            <a class="btn_add" href="javascript:void(0);" onclick="addRule();" title="添加新的IP登录规则">添加</a>
        </div>
    </div>
    <table width="100%">
        <tr>
            <td valign="top">
                    <form name="QueryForm"
                          onsubmit="GRID.reload('menuList');return false;">
                        <div class="barquerycontent" align="center" style="display: none;">
                        </div>
                    </form>
                    <div style="width:98%;">
                        <table id="ipRuleList" style="margin: 0; padding: 0;"></table>
                        <div id="pagerdt" style="margin: 0; padding: 0;"></div>
                    </div>
            </td>
        </tr>
        <tr>
            <td style="padding: 10px;">
                <form name="OtherForm">
                    其它所有IP使用以下规则：
                    <label><input type="checkbox" name="login_flag" onclick="setSysRedirectUrl()"/>允许登录</label>，登录后重定向到：
                    <input type="text" name="redirect_url" style="width: 200px;" onchange="setSysRedirectUrl()"/>
                </form>
            </td>
        </tr>
    </table>
</div>

<div id="Ip_Rule_Edit_Dlg" style="display:none;width: 300px;">
    <div class="modules" style="height:300px;">
        <form name="EditForm" onsubmit="return false;">
            <input name="id" type="text" style="display: none;"/>
            <table align="center">
                <tr class="formRow">
                    <td class="formLabel" width="100">
                        规则名称：
                    </td>
                    <td class="formField">
                        <input type="text" name="name" style="width:150px;"/>
                    </td>
                </tr>
                <tr class="formRow">
                    <td class="formLabel">规则类型：</td>
                    <td class="formField">
                        <label><input type="radio" name="type" value="0" checked="checked"
                                      onclick="typeChanged(this.value);"/>区间</label>
                        <label><input type="radio" name="type" value="1" onclick="typeChanged(this.value);"/>通配</label>
                    </td>
                </tr>
                <tr class="formRow">
                    <td class="formLabel" id="TD_FROM_IP">
                        开始IP：
                    </td>
                    <td class="formField">
                        <input name="from_ip" type="text" style="width:150px;"/>
                    </td>
                </tr>
                <tr class="formRow" id="TR_TO_IP">
                    <td class="formLabel">
                        结束IP：
                    </td>
                    <td class="formField">
                        <input type="text" name="to_ip" style="width:150px;"/>
                    </td>
                </tr>
                <tr class="formRow">
                    <td class="formLabel">
                        允许登录：
                    </td>
                    <td class="formField">
                        <label><input name="login_flag" type="checkbox" checked="checked" value="0"/>允许</label>
                    </td>
                </tr>
                <tr class="formRow">
                    <td class="formLabel">
                        登录后跳转：
                    </td>
                    <td class="formField">
                        <input name="redirect_url" type="text" style="width:150px;"/>
                    </td>
                </tr>
                <tr class="formRow">
                    <td class="formLabel">
                        优先级：
                    </td>
                    <td class="formField">
                        <input name="order_num" type="text" style="width:150px;"/>
                    </td>
                </tr>
                <tr class="formRow">
                    <td class="formLabel">
                        备注：
                    </td>
                    <td class="formField">
                        <textarea rows="4" name="note" style="width:200px;"></textarea>
                    </td>
                </tr>
            </table>
        </form>
    </div>
</div>
</body>
<script>
    var gridParams = {
        colModel:[
            {
                name:"编号",
                index:"id",
                width:"100"
            },
            {
                name:"规则名称",
                index:"name",
                width:"100"
            },
            {
                name:"类型",
                index:"type",
                width:"60",
                formatter:function(cell, options, rowObj) {
                    if (cell == "0")
                        return "区间";
                    else
                        return "通配";
                }
            },
            {
                name:"IP规则",
                index:"ip_rule",
                width:"200"
            },
            {
                name:"允许登录",
                index:"login_flag",
                width:"60",
                formatter:function (cell, options, rowObj) {
                    return cell == "0" ? "允许" : "不允许";
                }
            },
            {
                name:"重定向",
                index:"redirect_url",
                width:"100"
            },
            {
                name:"备注",
                index:"note",
                width:"120"
            },
            {
                name:"操作",
                index:"",
                width:50,
                sortable:false,
                formatter:function(cell, options, rowObj) {
                    return GRID.button({className:"btn_edit",onclick:"editRule("+rowObj["id"]+");",title:"修改IP登录规则"})+
                            GRID.button({className:"btn_delete",onclick:"deleteRule("+rowObj["id"]+",'"+ escape(rowObj["name"])+"');",title:"删除IP登录规则"});
                    /*
                    return "<input type=button value='修改' class='grid_button' onclick='editRule(" + rowObj["id"] +
                            ")'>&nbsp;"
                            + "<input type=button value='删除' class='grid_button' onclick='deleteRule(" + rowObj["id"] +
                            ",\"" + escape(rowObj["name"]) + "\")'>";
                            */
                }
            }
        ],
        caption : "IP规则列表",
        multiselect:false,
        width:"100%",
        pager: "#pagerdt"
    };

    $(function() {
        GRID.create("#ipRuleList", "DS_IP_RULES_LIST", gridParams, "QueryForm");
    	_loadSysParam();
    });
    
    //加载系统参数
    function _loadSysParam(){
	    CORE.request("DS_IP_RULES_SYSPARAMS_INFO",{},function(body, head){
	    	if(body.login_flag=="0")
		    	document.OtherForm.login_flag.checked = true;
		    else if(body.login_flag=="1")
		    	document.OtherForm.login_flag.checked = false;
	    	document.OtherForm.redirect_url.value = body.redirect_url;
		    
	    });	    
    }

	//设定系统参数
	function setSysRedirectUrl(){
	   var data = "";
	   if(document.OtherForm.login_flag.check)
	   		data+="login_flag=0&";
	   else
	   		data+="login_flag=1&";
	   data += "redirect_url="+document.OtherForm.redirect_url.value;
	   CORE.request("DS_IP_RULES_SYSPARAMS_EDIT",{data:data},function(data){
    		_loadSysParam();	   
	   });	
	}

    //编辑对话框选项
    var ruleEditDlgOpts = {
        title : "编辑规则",
        width : "400",
        height : "390" ,
        modal : true,
        bgiframe : true,
        resizable:false,
        buttons:{
            "取消":function() {
                $("#Ip_Rule_Edit_Dlg").dialog("close");
            },
            "确定":function() {
                CORE.submitForm("DS_IP_RULES_EDIT", "EditForm", {}, function(data) {
                    GRID.reload("ipRuleList");
                    $("#Ip_Rule_Edit_Dlg").dialog("close");
                });
            }
        }
    };


    function addRule() {
        document.EditForm.reset();
        ruleEditDlgOpts["title"] = "添加IP规则";
        typeChanged(0);
        CORE.loadRules("EditForm", "DS_IP_RULES_EDIT", true, function() {
            $("#Ip_Rule_Edit_Dlg").dialog(ruleEditDlgOpts);
        });
    }

    function editRule(id) {
        document.EditForm.reset();
        ruleEditDlgOpts["title"] = "修改IP规则";
        CORE.loadForm("DS_IP_RULES_INFO", "EditForm",
                {data:"id=" + id,ruleId:"DS_IP_RULES_EDIT",loadComplete:function(data) {
                	if(data["login_flag"]==0)
                		document.EditForm.login_flag.checked = true;
                	else
                		document.EditForm.login_flag.checked = false;
                	
                    typeChanged();
                    $("#Ip_Rule_Edit_Dlg").dialog(ruleEditDlgOpts);
                }});
    }

    function deleteRule(id, name) {
        CORE.confirm("确定要删除规则 [" + unescape(name) + "] 吗？注意：规则删除后不可恢复！", function() {
            CORE.request("DS_IP_RULES_DELETE", {data:"id=" + id}, function(data) {
                GRID.reload("ipRuleList");
            });
        });
    }

    function typeChanged(type) {
        if (type == undefined) {
            type = document.EditForm.type[0].checked ? 0 : 1;
        }
        if (type == 0) {
            $("#TD_FROM_IP").html("开始IP：");
            $("#TR_TO_IP").show();
        } else {
            $("#TD_FROM_IP").html("IP规则：");
            $("#TR_TO_IP").hide();
        }
    }
</script>
</html>