<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
  <head>
    <base href="<%=basePath%>"/>
	 <title>左边</title>
    <link rel="stylesheet" type="text/css" href="themes/default/css/leftstyle.css"/>
    <script type="text/javascript" src="scripts/sunrise/framework.js"></script>
    <style type="text/css">
    body, html, #leftbackground, #left {height: 100%;}
    .cli {font-weight: bold;font-style: italic;background-color: red;}
    </style>
    <script type="text/javascript">
        function loadMenu(parentId, level) {


            if ($("#menu_" + parentId + " ul").html() != null) {

                level = 4;
            }
            if ($("#menu_" + parentId + " ul").css("display") == "none") {
                level = 5;
            }

            var buildMenu = null;
            if (level == 2) {

                if ($("#menu").attr("parentId") == ("" + parentId))
                    return;
                $("#menu").attr("parentId", parentId);
                $("#menu").html("");
                buildMenu = function(data) {
                    var p = $("#menu");
                    var l = 0;
                    var str = new Array();
                    for (var i = 0; i < data.length; i++) {

                        p.append("<li id='menu_" + data[i].id +
                                "'><a href='javascript:;' class='menufont' onclick='loadMenu(" + data[i].id + ",3);'>" +
                                unescape(data[i].name) + "</a></li>");

                        str[i] = data[i].id;
                    }

                    if (l == 0) {

                        $("#menu_" + str[0] + " a").click();

                        l++;
                    }

                    //如果没有打开菜单，则打开菜单
                    try{
                    parent.showMenuBar();
                    }catch(e){}
                };
            } else if (level == 3) {

                var p = $("#menu_" + parentId);
                var Topone = new Array();
                if (p.attr("loaded") == "true")
                    return;
                p.attr("loaded", "true");
                buildMenu = function(data) {
                    var p = $("#menu_" + parentId);
                    var r = 0;
                    p.append("<ul id='sub_menu_" + parentId + "'></ul>");
                    p = $("#sub_menu_" + parentId);
                    for (var i = 0; i < data.length; i++) {
                        var href = $.trim(data[i].url) == "" ? "pages/building.jsp" : unescape(data[i].url);
                        Topone[i] = data[i].id;
                        p.append("<li id='sub_menu_" + data[i].id + "'><a href='" + href +
                                "' target='contentFrame' onclick='javascript:Cblod(" + Topone[i] + ");'>" +
                                unescape(data[i].name) + "</a></li>");
                        //onclick='Cblod("+Topone[i]+");'
                    }
                    if (r == 0) {
                        var urlgo = '<%=basePath%>' + ($.trim(data[0].url) == ""?"pages/building.jsp":unescape(data[0].url));
                        window.parent.contentFrame.location.href = urlgo;
                        r++;
                    }
                };
            } else if (level == 4) {
                $("#menu_" + parentId + " ul").css("display", "none");
            } else if (level == 5) {
                $("#menu_" + parentId + " ul").css("display", "block");
            }
            else {
                return;
            }
            CORE.request("DS_USER_MENU", {block:"false", data:'parent_id=' + parentId+"&time="+new Date().getTime()}, buildMenu);
        }
        function Cblod(obj, pid) {
            $("li").filter(".cli").removeClass();
            $("#sub_menu_" + obj).addClass("cli");
        }
    </script>
</head>
<body>
<div id="leftbackground">
    <div id="left">
        <ul id="menu">
        </ul>
    </div>
</div>
</body>
</html>