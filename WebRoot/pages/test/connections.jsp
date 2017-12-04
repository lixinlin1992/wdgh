<%@ page import="java.util.Collection" %>
<%@ page import="com.sunrise.foundation.dbutil.proxy.DBMonitor" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%--
File: connectionInfo.jsp
User: kinz
Date: 11-11-18 下午4:00
数据库连接状态查看，需要配合JDBC代理

--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>数据库连接信息</title>
    <base href="<%="http://"+request.getServerName()+":"+request.getServerPort()+request.getContextPath()+"/"%>">
</head>
<body>
<style>
    table{
        border: 1px solid #316AC5;
        border-collapse: collapse;
    }

    tr{height: 25px;}

    td,th{
        text-align: center;
        border: 1px solid #316AC5;
    }
</style>
<table width="100%" cellpadding="0" cellspacing="0">
    <tr style="background-color: #337FE5;">
        <th>连接ID</th>
        <th>线程ID</th>
        <th>建立时间</th>
        <th>最后活动时间</th>
        <th>关闭时间</th>
        <th>状态</th>
        <th>提交模式</th>
        <th>事务状态</th>
        <th>Trace</th>
    </tr>
<%
    Collection<DBMonitor.ConnectionMonitorInfo> infos = DBMonitor.getConnectionInfos();
    SimpleDateFormat fmt = new SimpleDateFormat("yyyy-MM-dd kk:mm:ss.SSS");
    int counter = 0;
    for(DBMonitor.ConnectionMonitorInfo info:infos){
%>
    <tr style="background-color: <%=(++counter)%2==0?"#CAD6E2":"#FFFFFF"%>;">
        <td><%=info.getId()%></td>
        <td><%=info.getThreadId()%></td>
        <td><%=fmt.format(info.getCreateTime())%></td>
        <td><%=info.getLastActiveTime()==null?"未激活":fmt.format(info.getLastActiveTime())%></td>
        <td><%=info.getLastCloseTime()==null?"未关闭":fmt.format(info.getLastCloseTime())%></td>
        <td><%=(info.getStatus()== DBMonitor.ConnectionMonitorInfo.STATUS_NEW)?"新建":(info.getStatus()==
                DBMonitor.ConnectionMonitorInfo.STATUS_CLOSED?"关闭":"活动")%></td>
        <td><%=info.getCommitMode()== DBMonitor.ConnectionMonitorInfo.COMMIT_AUTO?"自动":"手动"%></td>
        <td><%=info.getTransactionStatus()== DBMonitor.ConnectionMonitorInfo.TRANS_STATUS_ACTIVE?"激活":"未激活"%></td>
        <td><a href="javascript:void(0);" onclick="stackTrace('<%=info.getId()%>');" title="跟踪最后一次使用连接的程序信息">trace</a></td>
    </tr>
<%
    }
%>
</table>
<p></p>
<%
    for(DBMonitor.ConnectionMonitorInfo i:infos){
%>
<div id="<%=i.getId()%>" style="display: none;">
    <table width="100%">
        <tr style="background-color: #996600;">
            <th colspan="4">使用连接 <%=i.getId()%> 的程序信息</th>
        </tr>
        <tr style="background-color: #79b7e7;">
            <th>类名</th>
            <th>文件</th>
            <th>调用方法</th>
            <th>行号</th>
        </tr>
<%
    StackTraceElement[] eles = i.getStackTraceElements();
    counter = 0;
    if(eles != null && eles.length>0){
        for(StackTraceElement e:eles){
%>
        <tr style="background-color: <%=(++counter)%2==0?"#CAD6E2":"#FFFFFF"%>;">
            <td><%=e.getClassName()%></td>
            <td><%=e.getFileName()%></td>
            <td><%=e.getMethodName()%></td>
            <td><%=e.getLineNumber()%></td>
        </tr>
<%
        }
    }else{
%>
        <tr>
            <td colspan="4">暂时没有程序信息，该连接未被使用。</td>
        </tr>
<%
    }
%>
    </table>
</div>
<%
    }
%>
</body>
</html>
<script>
    //setTimeout("document.location.reload()",5000);
    var _currentTrace = null;
    function stackTrace(id){
        if(_currentTrace != null)
            _currentTrace.style.display="none";
        _currentTrace = document.getElementById(id);
        _currentTrace.style.display="block";
    }
</script>