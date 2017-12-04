<%@ page import="com.sunrise.rdcp.config.TemplateConfig" %>
<%@ page import="com.sunrise.rdcp.engine.RDCPEngine" %>
<%@ page import="com.sunrise.foundation.utils.StringUtil" %>
<%@ page import="com.sunrise.rdcp.config.SectorConfig" %>
<%@ page import="java.util.List" %>
<%@ page import="java.io.Writer" %>
<%--
File: templateConfig
User: kinz
Date: 11-6-9 上午10:54

模板配置界面

--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false" %>
<html>
<head>
    <title>模板配置</title>
    <jsp:include page="/pages/framework/base.jsp"/>
    <link type="text/css" rel="stylesheet" href="themes/default/css/rdcp.css">
    <script type="text/javascript" src="scripts/rdcp/rdcp.js"></script>
    <script type="text/javascript" src="scripts/rdcp/propertyGrid.js"></script>

    <script>
        var propertyGrid = null;
        var data = {
            "width":{
                name:"宽度",
                code:"width",
                value:"100",
                type:"percent",
                group:"基本"
            },
            "height":{
                name:"高度",
                code:"height",
                type:"integer",
                group:"基本"
            },
            "size":{
                name:"大小",
                code:"size",
                type:"integer",
                group:"基本"
            },
            "show":{
                name:"是否显示",
                code:"show",
                type:"bool",
                group:"显示"
            },
            "description":{
                name:"描述",
                code:"description",
                type:"text"
            },
            "select":{
                name:"下拉框",
                code:"select",
                type:"select",
                value:"2",
                options:{"1":"广州","2":"深圳"}
            }
        };
        $(document).ready(function() {
            /**
             propertyGrid = new RDCP.PropertyGrid({
             id:"propertyTable",
             group:true,
             properties:data
             });
             */
        });

        var _currentElement;
        function loadProperties(elementId) {
            _currentElement = elementId;
            CORE.request("DS_INSTANCE_PROPERTY_LIST",
                    {data:"instance_id=${param.instance_id}&element_id=" + elementId}, function(data) {
//                        if (propertyGrid == null)
                        propertyGrid = new RDCP.PropertyGrid({
                                    id:"propertyTable",
                                    group:true,
                                    properties:data
                                });
//                        else
//                            propertyGrid.setProperties(data);
                    });
        }

        function json2Str(o) {
            var arr = [];
            var fmt = function(s) {
                if (typeof s == 'object' && s != null) return json2Str(s);
                return /^(string|number)$/.test(typeof s) ? "'" + s + "'" : s;
            }
            for (var i in o) arr.push("'" + i + "':" + fmt(o[i]));
            return '{' + arr.join(',') + '}';
        }

        function saveProperties() {
            if(_currentElement == null){
                alert("请先选择区域再进行保存");
                return;
            }
            var properties = propertyGrid.getProperties();
            var param = "instance_id=${param.instance_id}&element_id="+_currentElement;
            $.each(properties, function(c, v) {
                //alert(c+"  "+v.code);
                //param += "&" + c + "=" + v.value;
                param += "&names=" + c + "&types=" + v.type + "&values=" + v.value;
            });
//            alert(param);
            CORE.request("DS_INSTANCE_PROPERTY_EDIT", {data:param}, function(data) {
            });
        }
    </script>
</head>
<body>
<input type="button" value="查看数据" onclick="alert(json2Str(propertyGrid.getProperties()));">
<input type="button" value="保存" onclick="saveProperties();">
<%--配置界面--%>
<%
    TemplateConfig template = RDCPEngine.getTemplateConfig(StringUtil.getLong(request.getParameter("instance_id")));
%>
<table>
    <tr>
        <td valign="top">
            <div id="_ROOT" onclick=""
                 style="border: 1px solid #0A246A;width: 700px;height: 600px;">
                <%
                    List<SectorConfig> sectors = template.getSectorConfigs();
                    processSectors(sectors, template.getOrientation(), out);
                %>
            </div>
        </td>
        <td valign="top">
            <table id="propertyTable" border="1" width="300"></table>
        </td>
    </tr>
</table>
<script type="text/javascript">
    $("#_ROOT").click(function(evt) {
        //alert(evt.target.id);
        if (evt.target.id != '_ROOT')
            return;
        else
            loadProperties("<%=template.getId()%>");
    });
</script>
</body>
</html>
<%!
    void processSectors(List<SectorConfig> sectors, String orientation, Writer out) throws Exception {
        for (SectorConfig sector : sectors) {
            List<SectorConfig> subSectors = sector.getSectorConfigs();
            if (subSectors != null && subSectors.size() > 0) {
                out.write("<div style='margin:10px; border:1px solid #0A246A;'>");
                processSectors(subSectors, sector.getOrientation(), out);
                out.write("</div>");
            } else {
                out.write(
                        "<div style='margin:10px; border:1px solid #0A246A;height:100px;" +
                                ("horizontal".equalsIgnoreCase(orientation) ? "float:left;" : "") +
                                "' onclick='loadProperties(\"" +
                                sector.getId() + "\");return false;'>" + sector.getName() + "</div>");
            }
        }
    }
%>