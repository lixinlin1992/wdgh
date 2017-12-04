<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html>
<head>

<#assign req_=_cxt.objects.request>
<#assign base_url_gen="request.getScheme()+\"://\"+request.getServerName()+\":\"+request.getServerPort()+request.getContextPath()+\"/\"">
<#assign base_url_tmp=req_.scheme+"://"+req_.serverName+":"+req_.serverPort+req_.contextPath+"/">
    <base href="<%=com.sunrise.framework.core.FrameworkConfig.getInstance().getParam("rdcp-page-base-url",("2".equals(com.sunrise.framework.core.FrameworkConfig.getInstance().getParam("rdcp-cache-gen-policy","2"))?(${base_url_gen}):"${base_url_tmp}"))%>"></base>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <link href="themes/default/css/sunrise.css" rel="stylesheet" type="text/css"/>
    <link href="themes/default/css/lhgdialog.css" rel="stylesheet" type="text/css"/>
    <link href="themes/default/css/framework.css" rel="stylesheet" type="text/css"/>
    <link href="themes/default/css/jquery.loading.css" rel="stylesheet" type="text/css"/>
	<link href="themes/default/css/externalsys.css" rel="stylesheet" type="text/css"/>

    <script type="text/javascript" src="scripts/sunrise/framework.js"></script>
    <script type="text/javascript" src="scripts/common/jsonpath-0.8.0.js"></script>
    <script type="text/javascript" src="scripts/sunrise/common.js"></script>


    <script type="text/javascript" src="scripts/temp/functions.js"></script>
    <script type="text/javascript"
            src="scripts/temp/user_function_1.js"></script>
    <script type="text/javascript" src="scripts/service/security.help.js"></script>
    <script type="text/javascript" src="scripts/rdcp/rdcp.js"></script>
	<script type="text/javascript">
	$(function() {
		<#if _page.sys_code != "">
		    CORE.syscode = "${_page.sys_code}";
		</#if>
	});
	</script>
    <title>${property("title")!"无标题"}</title>
</head>
<body>
<#if _config.orientation='horizontal' && _sectors?size&lt;1>
<table border="0" width="100%" style="padding:0px;margin: 0px;">
    <tr>
<#list _sectors as s>
        <td style="padding:0px;margin: 0px;">
            <@sector sector=s/>
        </td>
</#list>
    </tr>
</table>
    <#else>
        <#list _sectors as s>
        <#-- 区域样式 -->
        <div id="${s.code}" <#if property(s,"SectorClass")?? && property(s,"SectorClass")!="">class="${property(s,"SectorClass")}"<#elseif property(s,"HasSectorBorder")?? && "true"=property(s,"HasSectorBorder")!>class="sector_external_div"</#if> style="<#if property(s,"SectorStyle")?? && property(s,"SectorStyle")!="">${property(s,"SectorStyle")}<#else>margin: 0px;</#if><#if "true"=property(s,"hidden")!>display:none;</#if>">	        
        <#-- 区域边框 -->
        <#if property(s,"HasSectorBorder")?? && "true"=property(s,"HasSectorBorder")!>
        	<h2 class="sector_external_bar">${s.name}</h2>
        	<div>
        </#if>	
	        	<@sector sector=s/>
        <#-- 区域边框结束 -->
        <#if property(s,"HasSectorBorder")?? && "true"=property(s,"HasSectorBorder")!>
    		</div>
        </#if>
        </div>
        </#list>
</#if>
</body>
</html>
