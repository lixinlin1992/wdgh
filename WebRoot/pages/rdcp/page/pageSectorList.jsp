<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<%--
File: pageSectorList.jsp
User: kinz
Date: 11-10-20 上午10:42


--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false" %>
<html>
<head>
    <title>页面模板区域管理</title>
    <jsp:include page="/pages/framework/base.jsp"/>
</head>
<body>
<jsp:include page="/pages/navbar.jsp"/>
<div class="modules">
    <div class="barquery">
        <div class="barqueryleft"></div>
        <div class="barquerycenter">页面模板区域管理</div>
        <div class="barqueryright"></div>
        <div class="barquerybtn">
            <a class="btn_add" href="javascript:void(0);" onclick="addSector();" title="添加新的区域">添加</a>
            <!--
            <input name="btn_addition" class="btn_additionout" value="添加" type="button"
                   onclick='addSector();'/>
                   -->
        </div>
    </div>
    <!--查询表单区域-->
    <form name="QueryForm" onsubmit="GRID.reload('sectorList');return false;">
        <div class="barquerycontent" align="center">
            <table class="content_List">
                <tr>
                    <td align="right" class="contenttd" style="width:80px">容器名称：</td>
                    <td align="left">
                        <input type="text" id="name" name="name" class="textbox_css"/>
                        <input class="btnquery_mouseout" onMouseOver="this.className='btnquery_mouseover'"
                               onMouseOut="this.className='btnquery_mouseout'" type="submit" value=""/>
                    </td>
                </tr>
            </table>
        </div>
    </form>
    <table id="sectorList" style="margin: 0; padding: 0;"></table>
    <div id="pagerdt" style="margin: 0; padding: 0;"></div>
</div>
<div id="Template_Edit_Dlg" style="height:98%;display:none;">
    <iframe id="_EditFrame" name="EditFrame" src="" width="100%" height="100%"
            frameborder="0" style="margin:0 auto;"></iframe>
</div>
</body>
</html>
<script>

    var templateGridParam = {
        colModel:[
            {
                name:"ID",
                index:"id",
                width:100
            },
            {
                name:"区域名称",
                index:"name",
                width:100
            },
            {
                name:"创建者",
                index:"create_user_name",
                width:100
            },
            {
                name:"创建时间",
                index:"create_date",
                width:100
            },
            {
                name:"操作",
                index:"",
                width:50,
                sortable:false,
                formatter:function(cell, options, row, tr, td) {
                    return GRID.button({className:"btn_edit",onclick:"editSector('" + row["id"] +"');",title:"修改区域 ["+row["name"]+"]"})+
                            GRID.button({className:"btn_delete",onclick:"delSector('"+row["id"]+"','"+escape(row["name"])+"');",title:"删除区域 ["+row["name"]+"]"});
                    /*
                    return "<input value='修改' type='button' class='grid_button' onclick='editSector(\"" + row["id"] +
                            "\")'>" +
                            "<input value='删除' type='button' class='grid_button' onclick='delSector(\"" + row["id"] +
                            "\",\"" + escape(row["name"]) +
                            "\")'>";
                            */
                }
            }
        ],
        caption : "容器列表",
        multiselect:false,
        width:"98.5%",
        pager: "#pagerdt"
    };


    $(document).ready(function() {
        GRID.create("#sectorList", "DS_PAGE_SECTOR_LIST", templateGridParam, "QueryForm");
    });

    var _EditDlgOpt = {
        title : "编辑容器",
        width : "700",
        height : "530" ,
        modal : true,
        bgiframe : true,
        resizable:false,
        buttons:{
            "取消":function() {
                $("#Template_Edit_Dlg").dialog("close");
            },
            "保存":function() {
                document.getElementById('_EditFrame').contentWindow.saveSector();
            }
        }
    };

    function close() {
        $("#Template_Edit_Dlg").dialog("close");
        GRID.reload("sectorList");
    }

    /**
     * 添加一个新的模板
     */
    function addSector() {
        $("#Template_Edit_Dlg").dialog(_EditDlgOpt);
        $("#_EditFrame").attr("src", "pages/rdcp/page/pageSectorEdit.jsp");
    }

    /**
     * 删除模板
     */
    function delSector(id, name) {
        CORE.confirm("确认要删除区域 [" + unescape(name) + "] 吗?", function() {
            CORE.request("DS_PAGE_SECTOR_DELETE", {data:"id=" + id}, function(data) {
                GRID.reload("sectorList");
            });
        });
    }

    /**
     * 编辑模板
     * @param id
     */
    function editSector(id) {
        $("#Template_Edit_Dlg").dialog(_EditDlgOpt);
        $("#_EditFrame").attr("src", "pages/rdcp/page/pageSectorEdit.jsp?id=" + id);
    }
</script>