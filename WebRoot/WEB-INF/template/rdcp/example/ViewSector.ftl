<#--
 * @(#)GridSector.ftl 11-9-29 下午1:24
 * CopyRight 2011.  All rights reserved
 * 查看模板
 -->

<div>
    <#assign _formFields=property("formField")/>
    <#if (json(_formFields,"$.")?size>0)>
        <table align="center">
            <#list json(_formFields,"$.") as _formField>
                <tr class="formRow">
                    <td class="formLabel">${_formField.name.value!}:</td>
                    <td class="formLabel" id="${_formField.code.value!}${_formField.id.value!}"></td>
                </tr>
            </#list>
        </table>
    </#if>
</div>

<script>
    $(function(){
        <#if property("dataSource")?? && (property("dataSource")!="")>
            var dsParams = "";
            <#assign _dsParams=property("dsParam")/>
            <#list json(_dsParams,"$.") as _dsParam>
                <#if _dsParam.sourceType.value == "static">
                    dsParams += "${_dsParam.name.value}=${_dsParam.code.value}&"
                </#if>
                <#if _dsParam.sourceType.value == "areaData">
                    dsParams += "${_dsParam.name.value}=${_cxt.getObject("request").getParameter("${_dsParam.key.value}")!}&"
                </#if>
                <#if _dsParam.sourceType.value == "pageData">
                    dsParams += "${_dsParam.name.value}=${param("","${_dsParam.key.value}")!}&"
                </#if>
            </#list>
            dsParams = "_sysCode=${_page.sys_code}"
            CORE.request("${property("dataSource")!}",{data:dsParams},function(body,header){
                if(header.code == 0){
                    <#if (json(_formFields,"$.")?size>0)>
                        <#list json(_formFields,"$.") as _formField>
                            $("#${_formField.code.value}${_formField.id.value}").text(body["${_formField.code.value!}"]);
                        </#list>
                    </#if>
                }
            });
        </#if>

    })
</script>