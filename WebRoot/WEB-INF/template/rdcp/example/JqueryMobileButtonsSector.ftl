<#-- 按钮 -->

<script>
${property("script")!}
</script>

<#assign _json=property("buttonlist")!"">
<#list json(_json,"$.")! as j>
	<a href="${j.href!}" name="${j.name!("btn_"+j_index)}" id="${j.id!("btn_"+j_index)}"  onclick="${j.onclick!}" data-rel="${j.rel!}" data-role="button" data-icon="${j.icon!}" data-theme="${j.theme!}" >${j.value!(j_index)}</a>           
</#list>


