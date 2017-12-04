<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <title>rdcploader</title>
    <jsp:include page="/scripts/RDCPJS/demo/base.jsp"/>
    <script type="text/javascript">
        rdcp.ready(function () {
           /* rdcp.window({
                id: 'win',
                width: 400,
                height: 300
            });*/

            rdcp.tree({
                id: 'tree',
                checkbox: 'true',
                fit: true,
                url: 'scripts/RDCPJS/demo/ui/tree/tree_data2.json',
                loadFilter:function(data,parent){
                    console.info(data);
                    console.info(parent);
                    return data;
                }

            });
        });

        function expandAll() {
            rdcp.tree.expandAll("tree")
        }
        function collapseAll() {
            rdcp.tree.collapseAll("tree")
        }
        function openWindow() {
            rdcp.window.open("win");
        }
        function closeWindow() {
            rdcp.window.close("win");
        }
        function getSelected() {
            var msg = "";
            var node = rdcp.tree.getSelected("tree");
            msg += "ID:" + node.id + "_TYPE:" + node.type + "; ";
            alert(msg);
        }
        function getChecked() {
            var checkedNodes = rdcp.tree.getChecked("tree");
            var msg = "";
            $(checkedNodes).each(function (i) {
                msg += "ID:" + checkedNodes[i].id + "_TYPE:" + checkedNodes[i].type + "; ";
            });
            alert(msg);
        }
        function selectNode() {
            rdcp.tree.selectNode("tree", $("#txt_selectNodeId").val());
        }
        function checkNode() {
            rdcp.tree.checkNode("tree", $("#txt_checkNodeId").val());
        }
    </script>
</head>
<body>

<%--<div>
    <input type="button" value="打开窗口" onclick="openWindow()"/>
</div>
<div>
    <input type="button" value="关闭窗口" onclick="closeWindow()"/>
</div>
--%>
<div>
    <input type="button" value="展开所有" onclick="expandAll()"/>
</div>
<div>
    <input type="button" value="收起所有" onclick="collapseAll()"/>
</div>
<div>
    <input type="button" value="获取选中" onclick="getSelected()"/>
</div>
<div>
    <input type="button" value="获取勾选" onclick="getChecked()"/>
</div>
<div>
    <input type="button" value="选中节点ID:" onclick="selectNode()"/>
    <input id="txt_selectNodeId" type="text" value="2" style="width: 25px;"/>
</div>
<div>
    <input type="button" value="勾选节点ID:" onclick="checkNode()"/>
    <input id="txt_checkNodeId" type="text" value="3,4" style="width: 25px;"/>
</div>

<div id="win">
    <div id="tree">
    </div>
</div>
</body>
</html>