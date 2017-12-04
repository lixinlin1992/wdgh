<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <title>rdcploader</title>
    <jsp:include page="/scripts/RDCPJS/demo/base.jsp"/>
    <script type="text/javascript">
        var p = {
            height: 660,
            width: 90

        };

        var adapter_1 = [
            {
                from: 'width',
                to: 'css_width',
                iskeep: false
            }
        ];
        var adapter_2 = [
            {
                from: 'width',
                to: 'css_width',
                iskeep: true
            }
        ];

        rdcp.ready(function () {
            var html = "";
            for (var i in p) {
                if (p.hasOwnProperty(i)) {
                    html += i + ":" + p[i] + "<br />";
                }
            }
            $("#beforeAdapt").html(html);
        });

        function adapt_1() {
            var p1 = rdcp.extend({}, p, {});
            p1 = rdcp.adapt(p1, adapter_1);
            var html = "";
            for (var i in p1) {
                if (p1.hasOwnProperty(i)) {
                    html += i + ":" + p1[i] + "<br />";
                }
            }
            $("#afterAdapt").html(html);
        }
        function adapt_2() {
            var p2 = rdcp.extend({}, p, {});
            p2 = rdcp.adapt(p2, adapter_2);
            var html = "";
            for (var i in p2) {
                if (p2.hasOwnProperty(i)) {
                    html += i + ":" + p2[i] + "<br />";
                }
            }
            $("#afterAdapt").html(html);
        }
    </script>
</head>
<body>
<input type="button" value="删除转换" onclick="adapt_1()"/>
<input type="button" value="保留转换" onclick="adapt_2()"/>
<hr/>
把
<font color="red">width</font>属性转换成
<font color="red">css_width</font>属性
<hr/>
<label>当前前换前属性:</label>

<div id="beforeAdapt"></div>
<hr/>
<label> 转换后属性:</label>

<div id="afterAdapt"></div>

</body>
</html>