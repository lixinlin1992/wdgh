<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
    <title>业务系统管理</title>


    <base href="http://192.168.100.210:9093/rdcp/"></base>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <link href="themes/default/css/sunrise.css" rel="stylesheet" type="text/css"/>
    <link href="themes/default/css/lhgdialog.css" rel="stylesheet" type="text/css"/>
    <link href="themes/default/css/framework.css" rel="stylesheet" type="text/css"/>
    <link href="themes/default/css/jquery.loading.css" rel="stylesheet" type="text/css"/>

    <script type="text/javascript" src="scripts/sunrise/framework.js"></script>
    <script type="text/javascript" src="scripts/sunrise/common.js"></script>


    <script type="text/javascript" src="scripts/temp/functions.js"></script>
    <script type="text/javascript"
            src="scripts/temp/user_function_1.js"></script>
    <script type="text/javascript" src="scripts/service/security.help.js"></script>
    <link type="text/css" rel="stylesheet" href="themes/default/css/zTreeStyle/zTreeStyle.css"/>
    <script type="text/javascript" src="scripts/ztree/jquery-ztree-2.5.min.js"></script>
    <script type="text/javascript" src="scripts/common/ztree.help.js"></script>
    <script type="text/javascript" src="scripts/service/function.help.js"></script>
    <script type="text/javascript" src="scripts/service/user.help.js"></script>
    <script type="text/javascript" src="scripts/common/encode.js"></script>
    <script type="text/javascript" src="scripts/common/chinese.js"></script>
    <script type="text/javascript" src="scripts/common/jsonpath-0.8.0.js"></script>
</head>
<body>

<link href="themes/default/css/public.css" rel="stylesheet" type="text/css"/>
<div id="guild">
    <div id="guildleft">
        <img src="themes/default/images/guild_r1_c1.gif"/>
    </div>
    <div id="guildcenter">
        您所在的位置：报表
    </div>
</div>
<div class="modules">
    <div class="barquery">
        <div class="barqueryleft"></div>
        <div class="barquerycenter">${config.title!"统计报表"}</div>
        <div class="barqueryright"></div>
        <div class="barquerybtn">
        </div>
    </div>
    <table width="100%">
        <tr>
            <td valign="top">
                <table id="report_table" class="ui-jqgrid-htable " style="margin: 0; padding: 0;">
                    <tr>
                        <th>${config.xaxisName!"X轴"}</th>
                    <#list series as s>
                        <th>${s.label}</th>
                    </#list>
                    </tr>
                <#list xaxis as x><#assign _datas=dataset.getReportDatas(x)>
                    <tr>
                        <td>${x.label!""}</td>
                        <#list _datas as d>
                            <td><#if d??>${d.yaxis.value!"23"}</#if></td>
                        </#list>
                    </tr>
                </#list>
                </table>
            </td>
        </tr>
    </table>
</div>
</body>
</html>
