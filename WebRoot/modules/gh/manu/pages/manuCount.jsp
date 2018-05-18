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
            <a class="btn_exp_excel" href="javascript:void(0);" onclick="exportExcel1()" title="导出投稿统计为Excel文件">导出投稿统计</a>
            <a class="btn_exp_excel" href="javascript:void(0);" onclick="exportExcel2()" title="导出投稿明细为Excel文件">导出投稿明细</a>
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
                                起始时间:
                            </td>
                            <td>
                                <input type="text" id="start_date" name="start_date" onfocus="WdatePicker({dateFmt : 'yyyyMMdd'})"
                                       class="Wdate" readonly="">
                            </td>
                            <td class="SR_searchTitle" style="width: 100px;">
                                截止时间:
                            </td>
                            <td>
                                <input type="text" id="end_date" name="end_date" onfocus="WdatePicker({dateFmt : 'yyyyMMdd'})"
                                       class="Wdate" readonly="">
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
    rdcp.grid('listdt', '!gh/manu/~query/Q_MANUCOUNT_LIST', "searchForm", params);
}
function exportExcel1(){
    rdcp.goto('!gh/manu/~query/Q_MANUCOUNT_LIST',{params:'result=excel&fileName=投稿统计导出',form:'searchForm'});
}
function exportExcel2(){
    rdcp.goto('!gh/manu/~query/Q_MANUCOUNT_LIST2',{params:'result=excel&fileName=投稿明细导出',form:'searchForm'});
}
</script>
</html>
