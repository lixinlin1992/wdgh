<div class="barquery">
    <div class="barqueryleft"></div>
    <div class="barquerycenter">${property("title")!}</div>
    <div class="barqueryright"></div>
<div class="barquerybtn">
<#assign _json=property("buttonlist")!"">
<#list json(_json,"$.")! as j>
    <input name="${j.name!("btn_"+j_index)}" class="${j.class!}" value="${j.value!("按钮"+j_index)}" type="button"
           onclick="${j.onclick!}"/>
</#list>
</div>
</div>

<#list aa?keys as k></#list>