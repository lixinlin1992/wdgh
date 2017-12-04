<%--
User: kinz
Date: 2011-9-7

--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
    <title>业务系统管理</title>
    <jsp:include page="/pages/framework/base.jsp"/>
	<link type="text/css" rel="stylesheet" href="themes/default/css/zTreeStyle/zTreeStyle.css"/>
	<script type="text/javascript" src="scripts/ztree/jquery-ztree-2.5.min.js"></script>    
    <script type="text/javascript" src="scripts/common/ztree.help.js"></script>
    <script type="text/javascript" src="scripts/service/function.help.js"></script>
    <script type="text/javascript" src="scripts/service/user.help.js"></script>
    <script type="text/javascript" src="scripts/common/encode.js"></script>
    <script type="text/javascript" src="scripts/common/chinese.js"></script>
    <script type="text/javascript" src="scripts/common/jsonpath-0.8.0.js"></script>
</head>
<body>
<jsp:include page="/pages/navbar.jsp"/>
<div class="modules">
    <div class="barquery">
        <div class="barqueryleft"></div>
        <div class="barquerycenter">业务系统管理</div>
        <div class="barqueryright"></div>
        <div class="barquerybtn">
            <!--
            <input name="btn_addition" class="btn_additionout" value="添加" type="button"
                   onclick='addSystem();'/>
            <input type="button" class="btn_excelout" value="导出" id="jxl_expt"
                   onclick="CORE.goToDS('DS_SYSTEM_LIST','result=excel&engine=poi','QueryForm','_blank')">
                   -->
            <a class="btn_add" href="javascript:void(0);" onclick="addSystem();">添加</a>
            <a class="btn_exp_excel" href="javascript:void(0);" onclick="CORE.goToDS('DS_SYSTEM_LIST','result=excel&engine=csv&csv_encoding=GBK','QueryForm','_blank');">导出</a>
        </div>
    </div>
    <table width="100%">
        <tr>
            <td valign="top">
                <form name="QueryForm"
                      onsubmit="GRID.reload('sysList');return false;">
                    <div class="barquerycontent" align="center">
                        <table class="content_List">
                            <tr>
                                <td align="right" class="contenttd" style="width:150px">系统名称：</td>
                                <td align="left" style="width:150px">
                                    <input id="Q_name" name="name" class="textbox_css" style="width:100px"/>
                                </td>
                                <td align="right" class="contenttd" style="width:150px">系统编码：</td>
                                <td align="left"><input type="text" name="code" class="textbox_css"/>
                                    <input class="btnquery_mouseout"
                                           onmouseover="this.className='btnquery_mouseover'"
                                           onmouseout="this.className='btnquery_mouseout'" type="submit" value=""/>
                                </td>
                            </tr>
                        </table>
                    </div>
                </form>
                <div>
                    <table id="sysList" style="margin: 0; padding: 0;"></table>
                    <div id="pagerdt" style="margin: 0; padding: 0;"></div>
                </div>
            </td>
        </tr>
    </table>
</div>

<div id="Edit_Dlg" style="display:none;width:270px;">
    <div class="modules" style="height:200px;">
        <form name="EditForm" onsubmit="return false;">
            <input name="id" type="text" style="display: none;">
            <table align="center">
                <tr class="formRow">
                    <td class="formLabel">
                        系统名称：
                    </td>
                    <td class="formField">
                        <input name="name" type="text"
                               style="width:150px;"
                               onchange="if(!document.EditForm.code.readOnly){document.EditForm.code.value=getFirstLetterOfChinesePinyin(this.value);}"/>
                    </td>
                </tr>
                <tr class="formRow">
                    <td class="formLabel">
                        系统编码：
                    </td>
                    <td class="formField">
                        <input name="code" type="text" style="width:150px;"/>
                    </td>
                </tr>
                <tr class="formRow">
                    <td class="formLabel">
                        系统负责人：
                    </td>
                    <td class="formField">
                        <input type="text" name="master" style="display: none;">
                        <input name="master_name" type="text" style="width:140px;" readonly="readonly"/>
                        <input type="button" value="选择"
                               onclick="selectUser({multiselect:false,selected:function(users){if(users.length==0){document.EditForm.master.value='';document.EditForm.master_name.value='';}else{document.EditForm.master.value = users[0].id;document.EditForm.master_name.value=users[0].name;}}})">
                    </td>
                </tr>
                <tr class="formRow">
                    <td class="formLabel">
                        备注：
                    </td>
                    <td class="formField">
                        <textarea rows="4" name="note" style="width:180px;"></textarea>
                    </td>
                </tr>
            </table>
        </form>
    </div>
    <div id="packagePanel" style="display:none;height:100%;width:100%">
        <iframe width="100%" height="98%" id="packageDialog" frameborder="no"></iframe>
    </div>
    <div id="sycnPanel" style="display:none;height:100%;width:100%">
        <iframe width="100%" height="98%" id="sycnDialog" frameborder="no"></iframe>
    </div>
</div>
<!-- 功能树 -->
<div id="ObjectTreePanel" valign="top" style="display:none;">
	<div id="object_tree" class="tree" style="overflow:auto;"></div>
</div>
<table id="test_table" border="0" cellspacing="0" cellpadding="0" class="ui-jqgrid-htable" style="width:1103.85px;"></table>
</body>
</html>
<script>
    var gridParam = {
        colModel:[
            {
                name:"业务系统名称",
                index:"s.name",
                width:120
            },
            {
                name:"业务系统编码",
                index:"s.code",
                width:70
            },
            {
                name:"负责人",
                index:"u.name",
                width:70,
                hidden:true
            },
            {
                name:"创建人",
                index:'u2.name',
                width:70
            },
            {
                name:"创建时间",
                index:"s.create_date",
                width:100
            },
            {
                name:"操作",
                index:"",
                width:60,
                sortable:false,
                formatter:function(cell, options, row) {
                    return GRID.button({className:'btn_edit',onclick:"editSystem('" +row['s.code'] + "');",title:'修改业务系统',label:""})+
                            GRID.button({className:'btn_delete',onclick:"delSystem('" +row['s.code'] + "','"+row["s.name"]+"');",title:'删除业务系统'})+
                            GRID.button({className:'btn_package',onclick:"packageSystem('"+row["s.code"]+"');",title:"业务系统打包"})+
                            GRID.button({className:"btn_run",onclick:"CORE.goToDS('DS_RDCP_START_DEMO','code=" + row['s.code'] + "',null,'_top');",title:"演示该业务系统"})+
                            GRID.button({className:'btn_processor',onclick:"gotoPage('"+row["s.code"]+"');",title:"跳转到数据库配置管理页面"})+
                            GRID.button({className:'btn_sync',onclick:"gotoSync('"+row["s.code"]+"');",title:"业务系统同步"});;
                    /*
                    return "<input type='button' class='grid_button' value='修改' onclick='editSystem(\"" +
                            row['s.code'] + "\");'>" +
                            "&nbsp;&nbsp;<input type='button' class='grid_button' value='删除' onclick='delSystem(\"" +
                            row['s.code'] + "\",\"" + row['s.name'] +
                            "\")'>" +
                            "&nbsp;&nbsp;<input type='button' class='grid_button' value='打包' onclick='packageSystem(\"" +
                            row['s.code'] + "\");'>" +
                            "&nbsp;&nbsp;<input type='button' class='grid_button' value='启动演示' onclick='CORE.goToDS(\"DS_RDCP_START_DEMO\",\"code=" +
                            row['s.code'] + "\",null,\"_top\")'>";
                            */
                }
            }
        ],
        caption : "业务系统信息",
        width:"99%",
        multiselect:true,
        pager:"#pagerdt"/*,
        groupData:{
            "所有":["哈哈","操作"],
            "哈哈":['基础信息','创建'],
            "基础信息":["基本", "负责人"],
            "基本":["业务系统名称", "业务系统编码"],
            "创建":["创建人", "创建时间"],
            "操作":[]}*/
    };
    //跳转到数据库配置管理页面
	function gotoPage(sysCode){
		window.location.href="pages/rdcp/system/dbConfigList.jsp?_sysCode="+sysCode;
	}
    $(function() {
        GRID.create("#sysList", "DS_SYSTEM_LIST", gridParam, "QueryForm");
//        jQuery("#sysList").jqGrid('setGroupHeaders', {
//          useColSpanStyle: true,
//          groupHeaders:[
//        	{startColumnName: '业务系统名称', numberOfColumns: 3, titleText: '<em>基本信息</em>'},
//        	{startColumnName: '创建人', numberOfColumns: 2, titleText: '创建信息'}
//          ]
//        });
//        buildGroupHeader("sysList");
    });


    //业务系统编辑对话框参数
    var editDlgParam = {
        title : "添加/修改业务系统",
        width : "300",
        height : "300" ,
        modal : true,
        bgiframe : true,
        resizeable:false
    };


    function addSystem() {
        document.EditForm.reset();
        document.EditForm.code.readOnly = false;
        editDlgParam['title'] = "添加业务系统";
        editDlgParam["buttons"] = {
            "取消":function() {
                $("#Edit_Dlg").dialog("close");
            },
            "确定":function() {
                CORE.submitForm("DS_SYSTEM_EDIT", "EditForm", {}, function(data) {
                    $("#Edit_Dlg").dialog("close");
                    GRID.reload("sysList");
                    CORE.tip("业务系统已添加");
                });
            }
        };
        CORE.loadRules("EditForm", "SYS_BI_SYSTEM", true, function() {
            $("#Edit_Dlg").dialog(editDlgParam);
        });
    }

    /**
     * 修改业务系统
     * @param {} code
     * @returns {}
     */
    function editSystem(code) {
        document.EditForm.code.readOnly = true;
        editDlgParam['title'] = "添加业务系统";
        editDlgParam["buttons"] = {
            "取消":function() {
                $("#Edit_Dlg").dialog("close");
            },
            "确定":function() {
                CORE.submitForm("DS_SYSTEM_EDIT", "EditForm", {data:"_edit=true"}, function(data) {
                    $("#Edit_Dlg").dialog("close");
                    GRID.reload("sysList");
                    CORE.tip("业务系统修改成功");
                });
            }
        };
        CORE.loadForm("DS_SYSTEM_INFO", "EditForm", {data:"code=" + code,ruleId:"SYS_BI_SYSTEM",
            loadComplete:function() {
                $("#Edit_Dlg").dialog(editDlgParam);
            }
        });
    }

    /**
     * 删除业务系统
     * @param {} code
     * @param {} name
     * @returns {}
     */
    function delSystem(code, name) {
        CORE.confirm("确定要删除业务系统 [" + name + "] 吗？注意：业务系统删除后将不能恢复！", function() {
            CORE.request("DS_SYSTEM_DELETE", {data:"code=" + code}, function() {
                GRID.reload("sysList");
                CORE.tip("业务系统已删除");
            });
        });
    }

/**
 * 业务系统打包
 */

//业务系统打包对话框参数
    var packageDlgParam = {
        title : "业务系统打包",
        width : "350px",
        height : "350" ,
        modal : true,
        bgiframe : true,
        resizable:false,
        syscode : "",
        buttons : {
            "取消":function(){$("#packagePanel").dialog("close");},
            '确定':function() {
				document.getElementById("packageDialog").contentWindow.package();
       			$("#packagePanel").dialog("close");
            }
        }
    };


    function packageSystem(code) {
        $("#packageDialog").attr("src", "pages/rdcp/system/systemPackage.jsp?syscode=" + code);
        packageDlgParam.syscode = code;
        $("#packagePanel").dialog(packageDlgParam);
    }

/**
 * 业务系统同步
 */
	 
//业务系统同步弹出框
    var sycnDlgParam = {
        title : "业务系统同步",
        width : "450px",
        height : "450" ,
        modal : true,
        bgiframe : true,
        resizable:false,
        syscode : "",
        buttons : {
            "取消":function(){$("#sycnPanel").dialog("close");},
            '确定':function() {
				document.getElementById("sycnDialog").contentWindow.package();
       			$("#sycnPanel").dialog("close");
            }
        }
    };
	 
	function gotoSync(code){
        $("#sycnDialog").attr("src", "pages/rdcp/system/systemSycn.jsp?syscode=" + code);
        sycnDlgParam.syscode = code;
        $("#sycnPanel").dialog(sycnDlgParam);	
	}
//功能选择框
	var ObjectTree4Select = null;
	var ObjectTreePanelOpt = {
	    title : "选择对象",
	    width : "380",
	    height : "350" ,
	    modal : true,
	    bgiframe : true,
	    resizable:false,
	    buttons:{
	        "取消":function() {
	            $("#ObjectTreePanel").dialog("close");
	        }
	    }
	};	
	var _sync_type_object = "";
	var _sync_sys_code = "";
	function openSyncSelect(syscode,ds,type){
		if(_sync_type_object != type || _sync_sys_code != syscode)
			ObjectTree4Select = null;
		_sync_type_object = type;
		_sync_sys_code = syscode;
		if(ObjectTree4Select == null){
			ObjectTree4Select = new ZTree("object_tree", ds,
	    		{nodeClicked:function(event, treeId, treeNode){
					if (treeNode.type == "1"){
	    				CORE.request(ds, {data:"sys_code=" + syscode + "&moduelId=" + treeNode.id + "&type=1&id="+treeNode.id}, 
	    					function(data) {	                			
							//调用sycnDialog的iframe方法添加选择的节点
							$.each(data,function(i,val){
								document.getElementById("sycnDialog").contentWindow.chooseObject(_sync_type_object,val.id,val.name);
							})
							if(data.length > 0)
								$("#ObjectTreePanel").dialog("close"); 	
            			});
	    			}else if(treeNode.type == "2"){
						//调用sycnDialog的iframe方法添加选择的节点
						document.getElementById("sycnDialog").contentWindow.chooseObject(_sync_type_object,treeNode.id,treeNode.name);
						$("#ObjectTreePanel").dialog("close"); 				
	    			}
	    		},otherParam:["sys_code_",syscode]});
	    }
    	$("#ObjectTreePanel").dialog(ObjectTreePanelOpt);
	}

	function traceSyncResult(msg){
		CORE.info(msg);
	}

/***********/

    function buildGroupHeader(gridId){
        //var $_htable = $("table[aria-labelledby='gbox_"+gridId+"']");
        var $_htable = $("#gview_"+gridId).find(".ui-jqgrid-htable").children("thead");
        $_htable.attr("grid_id",gridId);
        //alert($_htable.html());
        $_htable.find("tr").attr("id","__old_header");
        //$_htable.parent().css({"table-layout":"auto !important"});
        $.each(getGroupData(groupDef/*,$_htable*/),function(i,n){
            var $tr = $("<tr>");
            $.each(n,function(j,m){
                var $th;
                var $oldTh = $_htable.find("#"+gridId+"_"+j);
                if(m["isparent"]){
                    $th = $("<th>").addClass("ui-state-default ui-th-column-header ui-th-ltr").css({"height": "22px","border-top-width":"0px","border-top-style": "none", "border-top-color": "initial"}).html(j);
                    if(m["colspan"]>1)$th.attr("colspan",m["colspan"]);
                }else{
                    $th = $oldTh.clone(true);
                    if(m["rowspan"]>1)$th.attr("rowspan",m["rowspan"]);
                }
                $tr.append($th);
            });
            $_htable.append($tr);
        });
        $("tr:first",$_htable).removeAttr("class").attr("style","height:auto;");
        $("tr:first th",$_htable).each(function(i){
            //$(this).html("").height(0);
        });
        //$_htable.find("#__old_header").remove();
        /*
        var _html = "";
        $.each(getGroupData($_htable),function(i,n){
            _html += "<tr class='ui-jqgrid-labels jqg-third-row-header' role='rowheader'>";
            $.each(n,function(j,m){
                var _oldTh = $_htable.find("#"+gridId+"_"+j);
                if(m["isparent"]){
                    _html += "<th class='ui-state-default ui-th-column-header ui-th-ltr' style='height: 22px; border-top-width: 0px; border-top-style: none; border-top-color: initial;' colspan='"+m["colspan"]+"'>"+j+"</th>"
                }else{
                    _html += "<th role='columnheader' class='ui-state-default ui-th-column ui-th-ltr' rowspan='"+m["rowspan"]+"'" +
                            " style='"+_oldTh.attr("style")+"'>"+_oldTh.html()+"</th>";
                }
            });
            _html += "</tr>";
        });
        //$("#test_table").append(_html);
        //$_htable.parent().attr("style", "table-layout: auto !important;"+$_htable.parent().attr("style"));
        //$_htable.html("");
        $_htable.append(_html);
        */
    }


    /*
var groupData = getGroupData();

    var tmpHtml = "";
$.each(groupData,function(i,n){
    tmpHtml += "<tr>";
    $.each(n,function(j,m){
        tmpHtml+="<th colspan='"+m["colspan"]+"' rowspan='"+m["rowspan"]+"'>"+j+"</th>";
    });
    tmpHtml+="</tr>";
});
$("#test_table").append(tmpHtml);
*/


</script>