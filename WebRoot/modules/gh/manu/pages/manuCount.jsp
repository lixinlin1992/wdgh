<!--
Created by IntelliJ IDEA.
User: sunjiaxin
Date: 2017/6/21
Time: 7:52
To change this template use File | Settings | File Templates.
-->
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <title>稿件统计</title>
    <r:include resource="!rdcp/~/pages/listBase.jsp"/>

    <script type="text/javascript" src="!gh/manu/~/scripts/manuCount.js"></script>
    <link href="!comm/css/addTable.css" rel="stylesheet" type="text/css">
    <link href="!service/file~/css/editfile.css" rel="stylesheet" type="text/css"/>

</head>
<r:include resource="!comm/~/pages/commOrg.jsp"/>
<body>
<input type="hidden" id="proPath" name="proPath" value=<%=request.getContextPath() %>/>
<div class="SR_Space">
    <!--标题和一些页面功能的工具条Begin-->
    <div class="SR_moduleBox">
        <div class="SR_moduleTitle">稿件统计</div>
        <div class="SR_moduleRight">
            <a class="btn_exp_excel" href="javascript:void(0);"
               onclick="exportExcel()" title="导出投稿情况为Excel文件">导出</a>
        </div>
    </div>
    <!--标题和一些页面功能的工具条End-->
    <div align="center">
        <!-- 搜索标头开始-->
        <div class="SR_searchTableBox">
            <form id="searchForm" name="searchForm"
                  onsubmit="rdcp.grid.reload('RoleGrid');return false;" method="post">
                <div class="barquerycontent">
                    <table>
                        <tr>

                            <td class="SR_searchTitle" style="width: 100px;">
                                单位:
                            </td>
                            <td>
                                <select id="dept_id" name="dept_id"  style="width: 180px;height:20px">
                                    <option value="">--请选择--</option>
                                </select>
                            </td>
                            <td class="SR_searchTitle" style="width: 100px;">
                                年份:
                            </td>
                            <td>
                                <input type="text" id="urgency" name="urgency" onfocus="WdatePicker({dateFmt : 'yyyy'})"
                                       class="Wdate" readonly="" style="height:18px;margin-top: 5px">
                            </td>
                            <td class="SR_searchTitle" style="width: 100px;">
                                月份:
                            </td>
                            <td>
                                <select id="month" name="month"  style="width: 180px;height:20px;margin-top: 5px" onchange="checkYear()" n>
                                    <option value="">--请选择--</option>
                                    <option value="01">01月</option>
                                    <option value="02">02月</option>
                                    <option value="03">03月</option>
                                    <option value="04">04月</option>
                                    <option value="05">05月</option>
                                    <option value="06">06月</option>
                                    <option value="07">07月</option>
                                    <option value="08">08月</option>
                                    <option value="09">09月</option>
                                    <option value="10">10月</option>
                                    <option value="11">11月</option>
                                    <option value="12">12月</option>
                                </select>
                                <a class="SR_moduleSearch"
                                   onmouseover="this.className='SR_moduleSearchHover';"
                                   onMouseOut="this.className='SR_moduleSearch'"
                                   onclick="queryCount()"></a>
                            </td>
                        </tr>
                    </table>
                </div>
            </form>
        </div>
    </div>
    <!-- 搜索表头结束 -->

    <!-- 查询列表 -->
    <div class="SR_tableContentBox">
        <table id="listdt"></table>
    </div>
</div>
</body>
<script type="text/javascript">
function checkYear(){
    var month= $("#month").val();
    var year= $("#urgency").val();
    if(month==null||month.length==0){

    }else{
        if(year==null||year.length==0){
            $.messager.alert("提示", "请选择年份！", "info");
        }
    }
}
function queryCount(){
    var month=$("#month").val();
    if(month==null||month.length==0){
        rdcp.grid('listdt', '!gh/manu/~query/Q_MANUCOUNT_LIST2', "searchForm", params);
    }else{
        rdcp.grid('listdt', '!gh/manu/~query/Q_MANUCOUNT_LIST', "searchForm", params);
    }
}
function exportExcel(){
    var month=$("#month").val();
    if(month==null||month.length==0){
        rdcp.goto('!gh/manu/~query/Q_MANUCOUNT_LIST2',{params:'result=excel&fileName=投稿情况导出',form:'searchForm'});
    }else{
        rdcp.goto('!gh/manu/~query/Q_MANUCOUNT_LIST',{params:'result=excel&fileName=投稿情况导出',form:'searchForm'});
    }
}
</script>
</html>
