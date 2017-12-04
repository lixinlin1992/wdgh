<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
    <title>日志管理</title>
    <jsp:include page="/pages/framework/base.jsp"/>
    <script type="text/javascript" src="scripts/sunrise/tree.help.js"></script>
    <script type="text/javascript">

        //各个模块参数
        var params_data = {
            colNames : [ '日志ID', '用户', '操作时间','模块', '功能', '详细信息', '操作'],
            colModel : [
                {
                    name : '日志ID',
                    index : 'l.id',
                    align : "center",
                    width : 40
                },
                {
                    name : '用户',
                    index : 'user_name',
                    align : "center",
                    width : 60
                },
                {
                    name : '操作时间',
                    index : 'op_time',
                    align : "center",
                    width : 70
                },
                {
                    name:'模块',
                    index:'module_name',
                    align:"center",
                    width:60
                },
                {
                    name : '功能',
                    index : 'function_id',
                    width : 80,
                    align : "center"
                },
                {
                    name : '详细信息',
                    index : 'message',
                    width : 150,
                    align : "center"
                },
                {
                    name : '操作',
                    align : 'center',
                    width : 50,
                    formatter : LogButton,
                    formatoptions : {},
                    sortable : false
                }
            ],
            caption : "data",
            edit : true,
            align : "center",
            width : '100%',
            pager: '#pagered_data',
            editurl:"",
            cellEdit:false

        };
        function LogButton(cellvalue, options, rowObject) {
            return "<input type='button' class='grid_button' value='删除' onclick='delect_log(\"" + rowObject[0] +
                    "\")'>";
        }
        function delect_log(obj) {
            CORE.confirm("确认删除?", function() {
                CORE.request("DS_OP_LOG_DEL", {data:'id=' + obj},
                        function() {
                            CORE.info("删除成功！");
                            GRID.reload('data');
                        });
            });
        }
        $(function() {
            GRID.create("#data", "DS_OP_LOG_LIST", params_data, "serch_charge");
            $("#jxl_expt").click(function() {
                var tmp = $("input[name='result']").attr("value");
                $("input[name='result']").attr("value", "excel");
                javascript:CORE.goToDS('DS_OP_LOG_LIST', '', 'serch_charge');
                $("input[name='result']").attr("value", tmp);
            });
            $("#dele_log").click(function() {
                if ($("#ModuleName").val() == "" && $("#keywords").val() == "" && $("#start_date").val() == "")
                    CORE
                            .info("请至少输入一个条件来执行删除功能,在删除之前建议您先<a style='color:red' onclick='saveExl();' href=\"javascript:;\">保存</a>。");
                //点击处理</a>
                else {
                    CORE
                            .confirm("确认删除?在删除之前建议您先<a style='color:red' onclick='saveExl();' href=\"javascript:;\">保存</a>。",
                            function() {
                                CORE.request("DS_OP_LOG_DEL",
                                        {data:'ModuleName=' + $("#ModuleName").val() + '&keywords=' +
                                                $("#keywords").val() +
                                                '&start_date=' + $("#start_date").val()},
                                        function() {
                                            CORE.info("删除成功！");
                                            GRID.reload('data');
                                        })
                            });
                }
            })
        });

        function saveExl() {
            var tmp = $("input[name='result']").attr("value");
            $("input[name='result']").attr("value", "excel");
            javascript:CORE.goToDS('DS_OP_LOG_LIST', '', 'serch_charge');
            $("input[name='result']").attr("value", tmp);
        }

        function cheackCond() {
            GRID.reload('data');
        }

    </script>
</head>

<body>
<jsp:include page="/pages/navbar.jsp"/>
<div class="modules">
    <div class="barquery">
        <div class="barquerycenter">日志管理</div>
        <div class="barquerybtn">
            <input type="button" class="btn_excelout" value="导出" id="jxl_expt"/>
        </div>
    </div>
    <form name="serch_charge" id="serch_charge" onsubmit="cheackCond();return false;">
        <input type="hidden" name="result" id=""/>
        <input type="hidden" name="ModuleID" id="ModuleID"/>

        <div class="barquerycontent" align="center">
            <table class="content_List">
                <tr>
                    <td align="right" class="contenttd">模块:</td>
                    <td align="left">
                        <input type="text" name="module_name" size="15"></td>
                    <td align="right" class="contenttd">功能:</td>
                    <td align="left"><input type="text" name="function_name" size="15"></td>
                    <td align="right" class="contenttd">用户:</td>
                    <td align="left"><input type="text" name="user_name" size="10"></td>
                    <td align="right" class="contenttd">操作时间从：</td>
                    <td align="left">
                        <input type="text" name="start_op_time" id="start_date" onClick="WdatePicker()" class="Wdate"
                               size="18">
                        到
                        <input type="text" name="end_op_time" id="end_date" onClick="WdatePicker()" class="Wdate"
                               size="18">
                        <input Class="btnquery_mouseout" onmouseover="this.className='btnquery_mouseover'"
                               onmouseout="this.className='btnquery_mouseout'" type="submit" value=""
                               onClick="cheackCond()"/>
                        <!-- <input type="button" class="btnfunctionout" value="删除" id="dele_log"/> -->
                    </td>
                </tr>
            </table>
        </div>
    </form>
    <div id="div_data">
        <table id="data"></table>
        <div id="pagered_data"></div>
    </div>
</div>
</body>
</html>
