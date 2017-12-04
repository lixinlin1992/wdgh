<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>demo-grid</title>
    <jsp:include page="/modules/rdcp/pages/base.jsp"/>

    <%--↓↓↓↓↓以下为示例页面才需要导入的资源，正式开发环境不需要导入↓↓↓↓↓--%>
    <link href="!rdcp/demo/css/common.css" rel="stylesheet" type="text/css"/>
    <link href="!rdcp/demo/css/main.css" rel="stylesheet" type="text/css"/>
    <link href="!rdcp/demo/css/module.css" rel="stylesheet" type="text/css"/>
    <link href="!rdcp/demo/css/searchtable.css" rel="stylesheet" type="text/css"/>
    <link href="!rdcp/demo/css/form.css" rel="stylesheet" type="text/css"/>
    <%--
        tablecontent.css跟easyui样式有冲突暂停使用
        <link href="!rdcp/demo/css/tablecontent.css" rel="stylesheet" type="text/css"/>
    --%>
    <link href="!rdcp/demo/css/btn.css" rel="stylesheet" type="text/css"/>
    <%--↑↑↑↑↑以上为示例页面才需要导入的资源，正式开发环境不需要导入↑↑↑↑--%>

    <script type="text/javascript">
        var demoGridParam =
        {
            sortName: 'USERID',
            sortOrder: 'ASC',
            idField: 'USERID',
            fitColumns: true,
            frozenColumns: [
                [
                    {title: '用户编号', field: 'USERID', width: 120, sortable: true, align: 'center'}
                ]
            ],
            columns: [
                [
                    {field: 'ACCOUNT', title: '登陆账号', sortable: true, align: 'center', width: 120},
                    {field: 'PASSWORD', title: '登陆密码', sortable: true, align: 'center', width: 320},
                    {field: 'USERNAME', title: '用户名称', sortable: true, align: 'center', width: 120},
                    {field: 'EMAIL', title: '电子邮箱', sortable: true, align: 'center', width: 120},
                    {field: 'MOBILEPHONE', title: '手机号码', sortable: true, align: 'center', width: 120}
                ]
            ]
        };

        //rdcp.ready为必写函数，即使里面没有代码也要显式调用，否则会导致资源加载失败
        rdcp.ready(function () {

            rdcp.comboBox("userNameComboBox", '!rdcp/ds/DS_DEMO_COMBO_USERNAME');
            rdcp.comboBox("mobilePhoneComboBox", '!rdcp/ds/DS_DEMO_COMBO_PHONE');


            // 参数1：demoGrid（对应页面上的<table id="demoGrid">标签）
            // 参数2：对应/modules/rdcp/mappings/M_DEMO.xml中的DS_DEMO_GRID
            // 参数3：demoGridForm定义列表的查询条件，该Form下的表单元素会自动提交到列表的查询语句中
            // 参数4：demoGridParam对应JS对象
            rdcp.grid('demoGrid', '!rdcp/ds/DS_DEMO_GRID', "demoGridForm", demoGridParam);
        });
    </script>
</head>
<body>
<div class="SR_Space">

    <!--标题和一些页面功能的工具条Begin-->
    <div class="SR_moduleBox">
        <div class="SR_moduleTitle">列表示例</div>
        <div class="SR_moduleRight"></div>
    </div>
    <div class="clear"></div>
    <!--标题和一些页面功能的工具条End-->

    <!--搜索表格Begin-->
    <div class="SR_searchTableBox">
        <form id="demoGridForm" name="demoGridForm" onsubmit="rdcp.grid.reload('demoGrid');return false;"
              method="post">
            <table>
                <tr>
                    <td class="SR_searchTitle">用户编号:</td>
                    <td class="SR_searchconten"><input name="userId" class="SR_pureInput" type="text"/></td>
                    <td class="SR_searchTitle">登陆账号:</td>
                    <td><input name="userAccount" class="SR_pureInput" type="text"/></td>
                    <td class="SR_searchTitle">用户名称:</td>
                    <td>
                        <div style="position:relative; border:1px solid #cccccc; width:150px; height:20px;">
                            <input id="userNameComboBox" name="userNameComboBox"/>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="SR_searchTitle">登陆密码:</td>
                    <td><input name="userPassword" class="SR_pureInput" type="text"/></td>
                    <td class="SR_searchTitle">电子邮箱:</td>
                    <td><input name="userEmail" class="SR_pureInput" type="text"/></td>
                    <td class="SR_searchTitle">手机号码:</td>
                    <td>
                        <!--div和select的样式是为了改变select边框颜色和宽度，放在CSS文件里就会失效-->
                        <div style="position:relative; border:1px solid #cccccc; width:150px; height:20px;">
                            <input id="mobilePhoneComboBox" name="mobilePhoneComboBox"/>
                        </div>
                        <input type="submit">
                    </td>
                </tr>
            </table>
        </form>
    </div>
    <div class="clear"></div>
    <!--搜索表格End-->

    <!--页面表格Begin-->
    <div class="SR_tableContentBox">
        <table id="demoGrid"></table>
    </div>
    <div class="clear"></div>
    <!--页面表格End-->

    <!--页面的按钮Begin-->
    <div class="SR_btn">
        <div class="SR_btnSpace">
            <div class="SR_conserve">
                <a href="#">保存</a>
            </div>
            <div class="SR_concel">
                <a href="#">取消</a>
            </div>
        </div>
    </div>
    <div class="clear"></div>
    <!--页面的按钮End-->

</div>
</body>
</html>