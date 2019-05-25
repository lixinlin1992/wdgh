<%--
  Created by IntelliJ IDEA.
  User: lh
  Date: 2014/9/28
  Time: 11:32
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <title>会籍查询</title>
    <r:include resource="!rdcp/~/pages/listBase.jsp"/>
    <link href="!comm/css/addTable.css" rel="stylesheet" type="text/css">
    <link href="!service/file~/css/editfile.css" rel="stylesheet" type="text/css"/>

</head>
<r:include resource="!comm/~/pages/commOrg.jsp"/>
<body>
<input type="hidden" id="proPath" name="proPath" value=<%=request.getContextPath() %>/>
<div class="SR_Space">
    <!--标题和一些页面功能的工具条Begin-->
    <div class="SR_moduleBox">
        <div class="SR_moduleTitle">会籍查询</div>
        <div class="SR_moduleRight">
            <a class="btn_exp_excel" href="javascript:void(0);"
               onclick="downExcel()" title="导出会员信息情况为Excel文件">导出</a>
        </div>
    </div>
    <!--标题和一些页面功能的工具条End-->
    <div align="center">
        <!-- 搜索标头开始-->
        <div class="SR_searchTableBox">
            <form id="searchForm" name="searchForm"
                  onsubmit="rdcp.grid.reload('RoleGrid');return false;" method="post">
                <div class="barquerycontent">
                    <input type="hidden" id="user_dept_id" name="user_dept_id" class="inputText"/>
                    <table>
                        <tr>
                            <td class="SR_searchTitle" style="width: 100px;" id="dept_btn">
                                单位:
                            </td>
                            <td id="dept_se">
                                <%--<select id="dept_id" name="dept_id"  style="width: 120px;height:20px">--%>
                                <%--<option value="">--请选择--</option>--%>
                                <%--</select>--%>
                                <input type="text" list="dept_name" id="dept_id" name="dept_id"  class="SR_pureInput"/>
                                <datalist id="dept_name">
                                </datalist>
                            </td>

                            <td class="SR_searchTitle" style="width: 100px;">
                                工号:
                            </td>
                            <td>
                                <input type="text" name="account" class="inputText"  style="width: 120px;"/>
                            </td>

                            <td class="SR_searchTitle" style="width: 100px;">
                                姓名:
                            </td>
                            <td>
                                <input type="text" name="name" class="inputText"  style="width: 120px;"/>
                            </td>
                            <td class="SR_searchTitle" style="width: 100px;">
                                身份证号:
                            </td>
                            <td>
                                <input type="text" name="card_no" class="inputText"  style="width: 120px;"/>
                            </td>
                        </tr>
                        <tr>
                            <td class="SR_searchTitle" style="width: 100px;">
                                性别:
                            </td>
                            <td>
                                <select id="sex" name="sex"  style="width: 120px;height:20px">
                                    <option value="">--请选择--</option>
                                    <option value="1">男</option>
                                    <option value="0">女</option>
                                </select>
                            </td>
                            <td class="SR_searchTitle" style="width: 100px;">
                                会籍状态:
                            </td>
                            <td>
                                <select id="trade_status" name="trade_status"  style="width: 120px;height:20px">
                                    <option value="">--请选择--</option>
                                    <option value="0">未入会</option>
                                    <option value="1">已入会</option>
                                    <option value="2">已退会</option>
                                    <option value="3">欠费被退会</option>
                                </select>
                            </td>
                            <td class="SR_searchTitle" style="width: 100px;">
                                人员状态:
                            </td>
                            <td>
                                <select id="ryzt" name="ryzt"  style="width: 120px;height:20px">
                                    <option value="">--请选择--</option>
                                    <option value="0">在职</option>
                                    <option value="1">报到中</option>
                                    <option value="2">离退休</option>
                                    <option value="3">离校</option>
                                    <option value="4">去世</option>
                                    <option value="5">其他</option>
                                </select>
                            </td>
                            <td class="SR_searchTitle" style="width: 100px;">
                                编制类型:
                            </td>
                            <td>
                                <select id="leaguer_type" name="leaguer_type" style="width: 120px;height:20px">
                                    <option value="">--请选择--</option>
                                    <option value="1">编制人员</option>
                                    <option value="2">非编制人员</option>
                                </select>
                            </td>
                        <tr>
                            <td class="SR_searchTitle" style="width: 100px;">
                                起始时间:
                            </td>
                            <td>
                                <input type="text" id="start_date" name="start_date" onfocus="WdatePicker({dateFmt : 'yyyy-MM-dd'})"
                                       class="Wdate" readonly="">
                            </td>
                            <td class="SR_searchTitle" style="width: 100px;">
                                截止时间:
                            </td>
                            <td>
                                <input type="text" id="end_date" name="end_date" onfocus="WdatePicker({dateFmt : 'yyyy-MM-dd'})"
                                       class="Wdate" readonly="">
                            </td>
                            <td style="right: inherit">
                                <a class="SR_moduleSearch"
                                   onmouseover="this.className='SR_moduleSearchHover';"
                                   onMouseOut="this.className='SR_moduleSearch'"
                                   onclick="tableReLoad()"></a>
                            </td>
                        </tr>
                        </tr>
                    </table>
                </div>
            </form>
        </div>
    </div>
    <!-- 搜索表头结束 -->
    <!-- 电表查询列表 -->
    <div class="SR_tableContentBox">
        <table id="listdt"></table>
    </div>
    <%--<div id="delTradeDlg" style="display:none;">--%>
    <%--<input type="hidden" id="account" name="account"/>--%>
    <%--<table>--%>
    <%--<tr>--%>
    <%--<td>退会理由:</td>--%>
    <%--<td><textarea id="trade_memo" name="trade_memo" rows="8" cols="40"></textarea>--%>
    <%--</tr>--%>
    <%--</table>--%>
    <%--</div>--%>
</div>
<div id="editDlg" style="display: none;padding:0px !important;">
    <div class="SR_Space">
        <div class="SR_inputTable">
            <div class="SR_inputTableContent">
                <form name="dateEdit" id="dateEdit" onsubmit="return false;">
                    <table>
                        <tr>
                            <td align="right" class="SR_inputTitle">入会时间:</td>
                            <td>
                                <input type="text" id="intrade_date" name="intrade_date" type="text" name="urgency" onfocus="WdatePicker({dateFmt : 'yyyy-MM-dd'})" class="Wdate" readonly=""/>
                            </td>
                            <input type="hidden" name="APPLY_ID" id="apply_id">
                            <input type="hidden" name="account" id="account">
                            <input type="hidden" name="apply_type" id="apply_type" value="0">
                        </tr>
                    </table>
                </form>
            </div>
        </div>
    </div>
</div>

<div id="editDlg2" style="display: none;padding:0px !important;">
    <div class="SR_Space">
        <div class="SR_inputTable">
            <div class="SR_inputTableContent">
                <form name="LeaguerEdit" id="LeaguerEdit" onsubmit="return false;">
                    <table>
                        <tr>
                            <td align="right" class="SR_inputTitle">编制类型:</td>
                            <td>
                                <select id="leaguer_type2" name="leaguer_type2" style="width: 120px;height:20px">
                                    <option value="">--请选择--</option>
                                    <option value="1">编制人员</option>
                                    <option value="2">非编制人员</option>
                                </select>
                            </td>
                            <input type="hidden" name="APPLY_ID" id="apply_id2">
                            <input type="hidden" name="account" id="account2">
                            <input type="hidden" name="apply_type" id="apply_type2" value="0">
                        </tr>
                    </table>
                </form>
            </div>
        </div>
    </div>
</div>

//修改会籍状态的对话框
<div id="editDlg3" style="display: none;padding:0px !important;">
    <div class="SR_Space">
        <div class="SR_inputTable">
            <div class="SR_inputTableContent">
                <form name="TradestatusEdit" id="TradestatusEdit" onsubmit="return false;">
                    <table>
                        <tr>
                            <td align="right" class="SR_inputTitle">会籍状态:</td>
                            <td>
                                <select id="trade_status2" name="trade_status2"  style="width: 120px;height:20px">
                                    <option value="">--请选择--</option>
                                    <option value="0">未入会</option>
                                    <option value="1">已入会</option>
                                    <option value="2">已退会</option>
                                    <option value="3">欠费被退会</option>
                                </select>
                            </td>
                            <input type="hidden" name="account" id="account3">

                        </tr>
                    </table>
                </form>
            </div>
        </div>
    </div>
</div>


</body>
<script type="text/javascript">
    var params = {
        fitColumns: true,
        rownumbers:true,
        columns: [
            [
                //{field: 'DEPT_NAME', title: '所属工会', sortable: false, align: 'center', width: 100},
                {field: 'ID', title: 'ID', hidden: true, sortable: false, align: 'center', width: 0},
                {field: 'DEPT_NAME_2', title: '所属工会', sortable: false, align: 'center', width: 100},
                {field: 'ACCOUNT', title: '工号', sortable: false, align: 'center', width: 60},
                {field: 'NAME', title: '姓名', sortable: false, align: 'center', width: 60},
                {field: 'SEX', title: '性别', sortable: false, align: 'center', width: 40},
                {field: 'CARD_NO', title: '证件号', sortable: false, align: 'center', width: 100},
                {field: 'LEAGUER_TYPE', title: '编制类型', sortable: false, align: 'center', width: 70},
                {field: 'TRADE_STATUS', title: '会籍状态', sortable: false, align: 'center', width: 80},
                {field: 'RYZT', title: '人员状态', sortable: false, align: 'center', width: 60},
                {field: 'INTRADE_DATE', title: '入会时间', sortable: false, align: 'center', width: 60},

                // {field: 'LEAGUER_NO', title: '会员编号', sortable: false, align: 'center', width: 60}

                {
                    field: 'OPT3',
                    title: '修改会籍状态',
                    sortable: false,
                    align: 'center',
                    width: 100,
                    formatter: function (cell, row, index) {
                        var btn = '<a class="btn_edit" href="javascript:void(0);"  onclick="edit_trade_status(\'' + row.ACCOUNT + '\');">修改会籍状态</a>';
                        return btn;
                    }
                },
                {
                    field: 'OPT',
                    title: '修改入会时间',
                    sortable: false,
                    align: 'center',
                    width: 100,
                    formatter: function (cell, row, index) {
                        var btn = '<a class="btn_edit" href="javascript:void(0);"  onclick="edit_time(\'' + row.ACCOUNT + '\');">修改入会时间</a>';
                        return btn;
                    }
                },
                {
                    field: 'OPT2',
                    title: '修改编制类型',
                    sortable: false,
                    align: 'center',
                    width: 100,
                    formatter: function (cell, row, index) {
                        var btn = '<a class="btn_edit" href="javascript:void(0);"  onclick="edit_leaguer_type(\'' + row.ACCOUNT + '\');">修改编制类型</a>';
                        return btn;
                    }
                }

            ]
        ]
    };

    //入会时间的修改-2019/01/05
    function edit_time(account){
        document.dateEdit.reset();
        $("#account").val(account);
        $("#apply_id").val(account);
        rdcp.dialog(editDlgOpts);
    }

    function edit_leaguer_type(account){
        document.LeaguerEdit.reset(); //调用LeaguerEdit元素
        $("#account2").val(account);
        $("#apply_id2").val(account);  //这个地方要用id
        rdcp.dialog(editDlgOpts2);
    }

    function edit_trade_status(account){
        document.LeaguerEdit.reset(); //调用LeaguerEdit元素
        $("#account3").val(account);
        rdcp.dialog(editDlgOpts3);
    }

    var editDlgOpts = {
        title: "修改入会时间",
        id: "editDlg",
        width: "450",
        height: "200",
        parentwidth: true,
        modal: true,
        buttons: [
            {
                text: '确定',
                handler: function () {
                    rdcp.form.submit("dateEdit", {url: "!gh/tradeManage/~query/Q_INTRADE_DATE_UPDATE",
                        success: function (data) {
                            if (data.header.code == 0) {
                                $("#editDlg").dialog("close");
                                $.messager.alert('提示', '修改入会时间成功！', 'info');
                                rdcp.grid.reload("listdt");
                            }
                            else {
                                $.messager.alert('提示', '修改入会时间失败！', 'error');
                            }
                        }
                    });
                }
            },
            {
                text: '取消',
                handler: function () {
                    $("#editDlg").dialog("close");
                }
            }
        ]
    };

    var editDlgOpts2 = {
        title: "修改编制类型",
        id: "editDlg2", //修改编制类型对话框
        width: "450",
        height: "200",
        parentwidth: true,
        modal: true,
        buttons: [
            {
                text: '确定',
                handler: function () {
                    rdcp.form.submit("LeaguerEdit", {url: "!gh/tradeManage/~query/Q_LEAGUER_TYPE_UPDATE",
                        success: function (data) {
                            if (data.header.code == 0) {
                                $("#editDlg2").dialog("close");
                                $.messager.alert('提示', '修改编制类型成功！', 'info');
                                rdcp.grid.reload("listdt");
                            }
                            else {
                                $.messager.alert('提示', '修改编制类型失败！', 'error');
                            }
                        }
                    });
                }
            },
            {
                text: '取消',
                handler: function () {
                    $("#editDlg2").dialog("close");
                }
            }
        ]
    };
    var editDlgOpts3 = {
        title: "修改会籍状态",
        id: "editDlg3", //修改会籍状态
        width: "450",
        height: "200",
        parentwidth: true,
        modal: true,
        buttons: [
            {
                text: '确定',
                handler: function () {
                    rdcp.form.submit("TradestatusEdit", {url: "!gh/tradeManage/~query/Q_TRADE_STATUS_EDIT",
                        success: function (data) {
                            if (data.header.code == 0) {
                                $("#editDlg3").dialog("close");
                                $.messager.alert('提示', '修改会籍状态成功！', 'info');
                                rdcp.grid.reload("listdt");
                            }
                            else {
                                $.messager.alert('提示', '修改会籍状态失败！', 'error');
                            }
                        }
                    });
                }
            },
            {
                text: '取消',
                handler: function () {
                    $("#editDlg3").dialog("close");
                }
            }
        ]
    };


    //校园文化列表参数--end
    /**
     * rdcp.JS框架初始化
     */
    rdcp.ready(function () {
        //初始化单位下拉框
        rdcp.request("!gh/manu/~query/Q_LOAD_DEPT_LIST",{},function(data) {
            var p = data.body.rows;
            for (var i = 0; i < data.body.rows.length; i++) {
                var html = "<option value='" + data.body.rows[i].NAME+ "'>" + data.body.rows[i].NAME+ "</option>";
                $("#dept_name").append(html);
            }

            rdcp.grid('listdt', '!gh/tradeManage/~query/Q_TRADE_LIST', "searchForm", params);
        });
    });

    //查询用户角色和所在单位
    //            rdcp.request("!gh/tradeManage/~query/Q_GET_USER_INFO",{},function(data) {
    //                var p = data.body;
    //                var deptId=p.dept_id;
    //                $("#user_dept_id").val(p.dept_id);
    //                if(deptId==null||deptId.length==0){
    //                    //生成空白表格
    //
    //                    rdcp.grid('listdt', '', "", params);
    //                }else if(deptId!=1){
    ////                    $("#dept_se").css("display","none");
    ////                    $("#dept_btn").css("display","none");
    //                    var options=document.getElementById("dept_id").options;
    //                    //var options=$("#dept_id").options;
    //                    for(var i=0;i<options.length;i++){
    //                        if(options[i].value==deptId){
    //                            options[i].selected=true;
    //                            break;
    //                        }
    //                    }
    //                    //生成表格rdcp.grid(tableId,url,formName,表格参数)
    //                    rdcp.grid('listdt', '!gh/tradeManage/~query/Q_TRADE_LIST', "searchForm", params);
    //                }else{
    //                    rdcp.grid('listdt', '!gh/tradeManage/~query/Q_TRADE_LIST', "searchForm", params);
    //                }
    //            });


    function viewLeaguer(account){
        var tabId = "viewLeaguer";
        var title = "查看会员信息";
        //标签页url
        var url = "!gh/tradeManage/~/pages/userTradeInfo.jsp?account="+account;
        OpenTab(tabId, title, url);
    }

    function tableReLoad(){
        rdcp.grid('listdt', '!gh/tradeManage/~query/Q_TRADE_LIST', "searchForm", params);
    }

    function downExcel(){
        rdcp.goto('!gh/tradeManage/~query/Q_TRADE_LIST',{params:'result=excel&fileName=会员信息导出',form:'searchForm'});

    }
</script>
</html>

