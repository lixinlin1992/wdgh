<?xml version="1.0" encoding="utf-8"?>
<datasources>	
	<!-- 列表查询 -->
	<ds name="DS_${Tname}_LIST" type="url" func="">
        <url><![CDATA[/_commonQuery?_file=generate/${Tname}/Q_${Tname}.xml&_id=Q_${Tname}_LIST]]></url>
        <file>/</file>
	</ds>
	<!-- 列表添加 -->
	<ds name="DS_${Tname}_ADD" type="url" func="">
        <url><![CDATA[/_commonQuery?_file=generate/${Tname}/Q_${Tname}.xml&_id=Q_${Tname}_ADD]]></url>
        <file></file>
	</ds>
	<!-- 列表删除 -->	
	<ds name="DS_${Tname}_DEL" type="url" func="">
        <url><![CDATA[/_commonQuery?_file=generate/${Tname}/Q_${Tname}.xml&_id=Q_${Tname}_DEL]]></url>
        <file></file>
	</ds>
	<!-- 列表装载 -->		
	<ds name="DS_${Tname}_EDIT" type="url" func="">
        <url><![CDATA[/_commonQuery?_file=generate/${Tname}/Q_${Tname}.xml&_id=Q_${Tname}_EDIT]]></url>
        <file></file>
	</ds>
	<!-- 列表更新 -->	
	<ds name="DS_${Tname}_UPDATE" type="url" func="">
        <url><![CDATA[/_commonQuery?_file=generate/${Tname}/Q_${Tname}.xml&_id=Q_${Tname}_UPDATE]]></url>
        <file></file>
	</ds>
	<#list Fields_Cols as i>
	<#if i.type=="3">
	<!-- 查询条件用的下拉框列表 
	<ds name="DS_${Tname}_${i.name}_S_SELECT" type="url" func="">
        <url><![CDATA[/_commonQuery?_file=generate/${Tname}/Q_${Tname}.xml&_id=Q_${Tname}_${i.name}_S_SELECT]]></url>
        <file></file>
    </ds>
    -->
    <!-- 编辑用的下拉框
	<ds name="DS_${Tname}_${i.name}_E_SELECT" type="url" func="">
        <url><![CDATA[/_commonQuery?_file=generate/${Tname}/Q_${Tname}.xml&_id=Q_${Tname}_${i.name}_E_SELECT]]></url>
        <file></file>
    </ds>    
	-->
	</#if>
	</#list>	
</datasources>