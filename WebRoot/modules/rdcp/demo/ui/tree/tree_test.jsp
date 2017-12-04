<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <title>rdcploader</title>
    <jsp:include page="/scripts/RDCPJS/demo/base.jsp"/>
    <script type="text/javascript">
        rdcp.ready(function () {
            rdcp.tree({
                id: 'tree_div',
                checkbox: true,
                fit: true,
                url: 'scripts/RDCPJS/demo/ui/tree/tree_data2.json',
                loadFilter:function(data,parent){
                    return data;
                }
            });

            /*var f = function(node){
                alert(node.text);
            };
            rdcp.tree.onClick('tree_div',f);*/
        });


        function expandAll() {
            rdcp.tree.expandAll("tree_div")
        }
        function collapseAll() {
            rdcp.tree.collapseAll("tree_div")
        }

        function getSelected() {
            var msg = "";
            var node = rdcp.tree.getSelected("tree_div");
            if(node){
                msg += "ID:" + node.id + "  _TYPE值:" + node.text + "; ";
                alert(msg);
            }else{
                alert('未选中任何 notes!!');
            }
        }
        function getChecked() {
            var checkedNodes = rdcp.tree.getChecked("tree_div");
            var msg = "";
            if(checkedNodes){
                $(checkedNodes).each(function (i) {
                    msg += "ID:" + checkedNodes[i].id + "_TYPE值:" + checkedNodes[i].text + "; ";
                });
                alert(msg);
            }else{
                alert('还未勾选任何 nodes!');
            }
        }
        function selectNode() {
            rdcp.tree.selectNode("tree_div", $("#txt_selectNodeId").val());
        }
        function checkNode() {
            rdcp.tree.checkNode("tree_div", $("#txt_checkNodeId").val());
        }
    </script>
</head>
<body>

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
    <div id="tree_div">
    </div>
</div>
</body>
</html>