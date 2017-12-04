<?xml version='1.0' encoding='UTF-8'?>
<rules>
    <form id="R_${Tname}" name="${Mname}" validate="true">
        <#list Fields_Cols as i>
        <field id="${i.name}" validate="true" null="false" type="string">
            <name>${i.text}</name>
            <null-message>必需填写</null-message>
        </field>
        </#list>
    </form>
</rules>