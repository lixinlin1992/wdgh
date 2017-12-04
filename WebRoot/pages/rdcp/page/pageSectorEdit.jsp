<%@ page import="com.sunrise.foundation.utils.StringUtil" %>
<%--
File: pageSectorEdit.jsp
User: kinz
Date: 11-10-20 上午10:42


--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>编辑模板</title>
    <jsp:include page="/pages/framework/base.jsp"/>
    <script type="text/javascript" language="JavaScript" src="scripts/edit_area/edit_area_full.js"></script>
    <script type="text/javascript" language="JavaScript">

        $(document).ready(function() {
            //初始化编辑器
            editAreaLoader.init({
                        id: "defination"    // id of the textarea to transform
                        ,start_highlight: true    // if start with highlight
                        ,allow_resize: "none"
                        ,allow_toggle: false
                        ,word_wrap: true
                        ,language: "zh"
                        ,syntax: "xml"
                    });

            <% if(!StringUtil.isNull(request.getParameter("id"))){%>
            editAreaLoader.setValue("defination", "");
            CORE.loadForm("DS_PAGE_SECTOR_INFO","EditForm",{data:"id=${param.id}",loadComplete:function(){
            }});
            <%}%>
        });

        function saveSector() {
            document.EditForm.defination.value = editAreaLoader.getValue("defination");
            CORE.submitForm("DS_PAGE_SECTOR_EDIT","EditForm",{},function(data){
                parent.close();
            });
        }
    </script>
</head>
<body>
<div style="margin:0 auto;">
    <form name="EditForm">
        <input type="text" name="id" style="display: none;"/>
        <table width="100%">
            <tr class="formRow">
                <td class="formLabel" width="100" style="text-align: left;">区域描述</td>
            </tr>
            <tr class="formRow">
                <td class="formField"><textarea name="note" style="width: 95%;height:40px;"></textarea></td>
            </tr>
            <tr class="formRow">
                <td class="formLabel" width="100" style="text-align: left;">区域定义</td>
            </tr>
            <tr class="formRow">
                <td class="formField"><textarea name="defination" id="defination" style="width: 100%;height:380px;"></textarea></td>
            </tr>
            <tr class="formRow">
                <td class="formLabel" width="100" style="text-align: left;">附加数据</td>
            </tr>
            <tr class="formRow">
                <td class="formField"><textarea name="attachment" id="attachment" style="width: 100%;height:380px;"></textarea></td>
            </tr>
        </table>
    </form>
</div>
</body>
</html>