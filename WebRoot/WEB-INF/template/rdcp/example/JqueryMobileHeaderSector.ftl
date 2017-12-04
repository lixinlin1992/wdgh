<#-- 头部/导航 -->

<script>
${property("script")!}
</script>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
	<div data-role='header' data-theme="${property("titleTheme")!}" data-position="fixed">
		<h1>${property("title")!}</h1>
		<#if property("showOne")?? &&  property("showOne")?string="true" >
			<a  href="${property("href1")!}" data-icon="${property("icon1")!}"  data-theme="${property("theme1")!}"> ${property("value1")!} </a>	
		</#if>

		
		<#if property("showTwo")?? &&  property("showTwo")?string="true" >
			<a  href="${property("href2")!}" data-icon="${property("icon2")!}"  data-theme="${property("theme2")!}">${property("value2")!}</a>	
		</#if>
	</div>
