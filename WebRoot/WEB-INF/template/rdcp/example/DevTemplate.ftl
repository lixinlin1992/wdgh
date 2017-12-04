<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
</head>
<body>
<#list _sectors as s>
<div style="margin: 0px;<#if _config.orientation='horizontal'>float:left;</#if>">
<@sector sector=s/>
</#list>
</body>
</html>