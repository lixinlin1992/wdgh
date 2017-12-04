<%--
  Created by IntelliJ IDEA.
  User: bearangel
  Date: 2010-11-15
  Time: 16:01:49
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <jsp:include page="/pages/framework/base.jsp"/>
    <script type="text/javascript" src="scripts/sunrise/tree.help.js"></script>
    <script type="text/javascript">
        var _dlgOpts = {
            title : "请选择一个节点",
            width : "450px",
            height : "400" ,
            modal : true,
            bgiframe : true
        };
        function selectMenu() {

            var id = "#_menuTree";

            if ($(id).length > 0) {
                $(id).dialog(_dlgOpts);
            } else {
                $("body").append("<div id=\"_menuTree\"></div>");
                var treeDiv = $(id);
                treeDiv.attr("class", "tree");

                var zTree1;
                var setting;

                setting = {
                    async: true,
                    asyncUrl: "framework.do?ds=DS_SYS_P_MENU_LOAD&ftl=addMenu",  //获取节点数据的URL地址
                    asyncParam: ["parentId"],  //获取节点数据时，必须的数据名称，例如：id、name
                    asyncParamOther: ["test","true"], //其它参数 ( key, value 键值对格式)
                    callback:{
                        click: zTreeOnClick,
                        asyncSuccess: function asyncSuc(event, treeId, msg) {
                            if (msg == undefined) {
                                var _tempNodes = zTree1.getNodes()
                                if (_tempNodes.length == 0) {
                                    CORE.info("查询失败")
                                } else {
                                    if ((_tempNodes[0]).header != undefined) {
                                        if ((_tempNodes[0]).header.code < 2000) {
                                            CORE.error("错误代码:" + (_tempNodes[0]).header.code + "<br>" + unescape((_tempNodes[0]).header.message), unescape((_tempNodes[0]).body));
                                            return;
                                        }
                                    }
                                    update((_tempNodes[0]).body);
                                }
                            } else {
                                update(msg);
                            }
                        }
                    }
                };

                zTree1 = treeDiv.zTree(setting, []);
                treeDiv.dialog(_dlgOpts);
            }

            function update(nodes) {
                if (nodes.nodes != null) {
                    var temp = nodes.nodes[0].body;
                    for (var i = 0; i < temp.length; i++) {
                        temp[i].name = unescape(temp[i].name);
                    }
                    zTree1.addNodes(nodes, temp);
                    return
                }
                for (var i = 0; i < nodes.length; i++) {
                    nodes[i].name = unescape(nodes[i].name);
                }
                zTree1.addNodes(null, nodes);
            }

            function zTreeOnClick(event, treeId, treeNode) {
                $("#parent_name").val(treeNode.name);
                $("#parent_id").val(treeNode.id);
                treeDiv.dialog("close");
            }
        }


        function doSubmit() {
            parm = {
                data:$("addMenuForm").serialize()
            };

            function callback() {
                CORE.info("添加成功");
            }

            CORE.submitForm("DS_SYS_P_MENU_INSERT", "addMenuForm", parm, callback);
        }
    </script>
    <title>添加功能</title>
</head>
<body>
<form onsubmit="doSubmit();return false;" id="addMenuForm" name="addMenuForm">
    选择功能挂载点：<input type="text" readonly="readonly" id="parent_name" name="parent_name"/>
    挂载点ID<input type="text" id="parent_id" name="parent_id"/>
    <input type="button" value="选择" onclick="selectMenu();"/><br>
    功能ID:&nbsp;&nbsp;<input type="text" id="menu_id" name="menu_id"/><br>
    功能名称:<input type="text" id="menu_name" name="menu_name"/><br>
    功能URL:&nbsp;<input type="text" id="menu_url" name="menu_url"/><br>
    功能等级:<input type="text" id="menu_level" name="menu_level"/><br>
    排序ID:&nbsp;&nbsp;<input type="text" id="order_id" name="order_id"/><br>
    备注:&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" id="note" name="note"/><br>
    <input type="submit" value="提交" class="btnfunctionout">
</form>
<p>
    功能ID:假如一级菜单ID为80000,二级菜单ID为8X000，X为该功能序号；<br>
    &nbsp;&nbsp;&nbsp;&nbsp;三级菜单ID为8X00Y，其中X为二级菜单功能序号,Y为三级菜单功能序号.<br>
    功能等级：一级菜单：1,:二级菜单：2，三级菜单：3
</p>
</body>
</html>