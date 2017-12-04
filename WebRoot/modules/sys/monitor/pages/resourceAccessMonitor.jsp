<%--
File: resourceAccessMonitor.jsp
User: kinz
Date: 13-12-13 上午11:25
Module: sys/monitor

--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>模块资源访问监控</title>
    <r:include resource="!rdcp/~/pages/listBase.jsp"/>
    <script type="text/javascript" src="!sys/monitor/~/scripts/resourceAccessMonitor.js"></script>

    <script>

        rdcp.ready(function(){
            rdcp.grid('resLogGrid', '!sys/monitor/~query/Q_RESOURCE_LOG_LIST', "resLogGridFormID", resLogGridParam);
        });

    </script>
</head>
<body>
<div class="SR_Space">

    <div class="SR_moduleBox">
        <div class="SR_moduleTitle">模块资源访问监控</div>
        <div class="SR_moduleRight">
        </div>
    </div>
    <div class="clear"></div>

    <div class="SR_searchTableBox">
        <form id="resLogGridFormID" name="resLogGridForm" onsubmit="rdcp.grid.reload('resLogGrid');return false;"
              method="post">
            <table>
                <tr>
                    <td class="SR_searchTitle">模块路径:</td>
                    <td><input name="module_path" class="SR_pureInput" type="text"/></td>
                    <td class="SR_searchTitle">资源路径:</td>
                    <td><input name="res_path" class="SR_pureInput" type="text"/></td>
                    <td class="SR_searchTitle">请求时间 从:</td>
                    <td>
                        <input name="from_request_time" class="SR_pureInput easyui-datebox" type="text" style="width: 90px;"/> 到
                        <input name="to_request_time" class="SR_pureInput easyui-datebox" type="text" style="width: 90px;"/>
                    </td>
                    <td><a class="SR_moduleSearch" onmouseover="this.className='SR_moduleSearchHover';"
                           onMouseOut="this.className='SR_moduleSearch'" href="javascript://" onclick="rdcp.grid.reload('resLogGrid');"></a>
                        </td>
                </tr>
            </table>
            <div  style="width: 0px;height:0px;"><input type="submit" value=""></div>
        </form>
    </div>

    <div class="SR_tableContentBox">
        <table id="resLogGrid"></table>
    </div>

    <div style="display:none">
        <div id="editDialog">
            <form id="editForm">
                <input type="hidden" id="userId" name="id">
                <table>
                    <tr>
                        <td class="SR_inputTableTitle">系统名称:</td>
                        <td><input name="sys_name" id="sys_name_id" class="SR_pureInput" type="text"></td>
                    </tr>
                    <tr>
                        <td class="SR_searchTitle">系统IP:</td>
                        <td><input name="sys_ip" id="sys_ip_id" class="SR_pureInput" type="text"/></td>
                    </tr>
                    <tr>
                        <td class="SR_searchTitle">KEY:</td>
                        <td><input name="key" id="key_id" class="SR_pureInput" type="text" readonly
                                   style="width:270px;"/>
                            <a href="javascript://" onclick="genKey();" class="btn_refresh16">生成</a>
                        </td>
                    </tr>
                    <tr>
                        <td class="SR_searchTitle">有效期从:</td>
                        <td><input name="from_time" id="from_time_id" class="SR_pureInput easyui-datebox" type="text"> 到
                            <input name="to_time" id="to_time_id" class="SR_pureInput easyui-datebox" required
                                   type="text">
                        </td>
                    </tr>
                </table>
            </form>
        </div>
    </div>
</div>
</body>
</html>