<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<%@ page import="com.sunrise.foundation.utils.StringUtil" %>
<%--
File: templateEdit
User: kinz
Date: 11-6-10 下午10:26

模板编辑页面

--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false" %>
<html>
<head>
    <title>编辑模板</title>
    <jsp:include page="/pages/framework/base.jsp"/>
    <script type="text/javascript" language="JavaScript" src="scripts/edit_area/edit_area_full.js"></script>
    <script type="text/javascript" language="JavaScript">

        var _id=null;
        $(document).ready(function() {
            //初始化编辑器
            editAreaLoader.init({
                        id: "TemplateContent"    // id of the textarea to transform
                        ,start_highlight: true    // if start with highlight
                        ,allow_resize: "none"
                        ,allow_toggle: false
                        ,word_wrap: true
                        ,language: "zh"
                        ,syntax: "xml"
                    });

            <% if(!StringUtil.isNull(request.getParameter("id"))){%>
            _id = "${param.id}";
            editAreaLoader.setValue("TemplateContent", "");
            CORE.request("DS_TEMPLATE_CONFIG_INFO", {data:"id=${param.id}"}, function(data) {
                    editAreaLoader.setValue("TemplateContent", data["template_content"]);
            });
            <%}%>
        });

        function saveTemplate() {
            CORE.request("DS_TEMPLATE_CONFIG_SAVE",
                    {data:"TemplateContent=" + editAreaLoader.getValue("TemplateContent")+(_id==null?"":("&id="+_id))}, function(data) {
						parent.close();
                    });
        }
    </script>
</head>
<body>
<div style="margin:0 auto;">
    <form >
        <textarea id="TemplateContent" style="width: 100%;height:400px;"></textarea>
    </form>
</div>
</body>
</html>