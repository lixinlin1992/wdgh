<#--
*
*jmGotoPage(page_code) 为页面跳转，page_code为页面编码,transformStyle（_blank）为跳转方式
*
-->

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">


<html>
<head>

<#assign req_=_cxt.objects.request>
    <base href="${req_.scheme}://${req_.serverName}:${req_.serverPort}${req_.contextPath}/"></base>
	<meta name="viewport" content="width=device-width, initial-scale=1; charset=UTF-8"></meta> 
	<link rel="stylesheet" href="scripts/jqueryMobil/css/jquery.mobile-1.0.min.css" />
	<script type="text/javascript" src="scripts/jqueryMobil/jquery.js"></script> 
	<script type="text/javascript" src="scripts/jqueryMobil/jquery.mobile-1.0.js"></script>
    <link href="themes/default/css/framework.css" rel="stylesheet" type="text/css"/>
    
	<script type="text/javascript" src="scripts/common/jquery.loading.js"></script>
	<script type="text/javascript" src="scripts/sunrise/core.js"></script>
	<script type="text/javascript">
		<#if _page.sys_code != "">
		    CORE.syscode = "${_page.sys_code}";
		</#if>
		<#-- 跳转页面用的方法，page_code参数为页面编码 -->
		function jmGotoPage(page_code){
		  if(page_code != null)
		  CORE.goToDS("DS_RDCP_RUN_PAGE","page_code="+page_code+"&_sysCode=${_page.sys_code!}",null,"_self");
		}
		<#-- 跳转页面用的方法，page_code参数为页面编码,params为用户自定义 -->
        function jmGotoPageWithParams(page_code,params){
          if(page_code != null)
          CORE.goToDS("DS_RDCP_RUN_PAGE","page_code="+page_code+"&_sysCode=${_page.sys_code!}"+params,null,"_self");
        }		
	</script>
    <title>${property("title")!"无标题"}</title>
</head>
<body id='_body'>
<div data-role="page" id="_aboutPage">
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
        <div id="${s.code}" style="margin: 0px;<#if "true"=property(s,"hidden")!>display:none;</#if>">
        <@sector sector=s/>
        </div>
        </#list>
</#if>

</div><!-- /page -->

</body>
</html>