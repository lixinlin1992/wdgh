<?xml version="1.0" encoding="utf-8"?>
<query-config>
	<#assign index=0/>
	<!-- 列表查询 -->
	<query id="Q_${Tname}_LIST" type="pagelist" result="json">
	   <stmt><![CDATA[
	     select <#list Cols as i><#if index&gt;0>,</#if>t.${i.index}<#assign index=index+1/></#list>,<#assign index=0/><#list KEY as ki><#if index&gt;0>,</#if>t.${ki.item}<#assign index=index+1/></#list>
	     from ${Tname} t
	     where 1=1
	  	 <#list Search as i>
	  	 ${"<#-- "}${i.text}${"的条件 -->"}
	     ${"<#if"} ${i.name}?exists${">"}
	     <#if i.type=="0">
	     and ${i.name} [like(${i.name})] 
	     <#else>
	     and ${i.name} = ${i.name}  
	     </#if>
	     ${"</#if>"}
	  	 </#list>
	   ]]></stmt>
	   <#list KEY as kki>
	   <param name="id">${kki.item}</param>
	   </#list>
	</query>

	<#assign index=0/>
	<!-- 列表添加 -->
	<query id="Q_${Tname}_ADD" type="update" result="json">
	    <stmt><![CDATA[
		INSERT INTO ${Tname} (<#list KEY as iki><#if index&gt;0>,</#if>${iki.item}<#assign index=index+1/></#list>,<#assign index=0/><#list Fields_Cols as ai><#if index&gt;0>,</#if>${ai.name}<#assign index=index+1/></#list>) 
		VALUES <#assign index=0/>
		(<#list KEY as ikiv><#if index&gt;0>,</#if>${Tname}_seq.nextval<#assign index=index+1/></#list>,<#assign index=0/><#list Fields_Cols as aii><#if index&gt;0>,</#if><#if aii.type=="2">[${aii.name} date]<#else>[${aii.name}]</#if><#assign index=index+1/></#list>)
	    ]]></stmt>
       	<param name="trans">true</param>
	   	<param name="paging">false</param>
	</query>

	<#assign index=0/>
	<!-- 列表删除 -->
	<query id="Q_${Tname}_DEL" type="update" result="json">
	   <stmt><![CDATA[
		delete from ${Tname} where <#list KEY as diki><#if index&gt;0> and </#if>${diki.item} = [Id]<#assign index=index+1/></#list>
	   ]]></stmt>
           <param name="trans">true</param>
	   <param name="paging">false</param>
	</query>

	<#assign index=0/>
	<!-- 列表装载 -->
	<query id="Q_${Tname}_EDIT" type="pagelist" result="ftl">
	   <stmt><![CDATA[
		select <#list KEY as lki><#if index&gt;0>,</#if>${lki.item}<#assign index=index+1/></#list>,<#assign index=0/><#list Fields_Cols as i><#if index&gt;0>,</#if>${i.name}<#assign index=index+1/></#list> from ${Tname} where <#assign index=0/><#list KEY as liki><#if index&gt;0> and </#if>${liki.item} = [Id]<#assign index=index+1/></#list>
	   ]]></stmt>
        <param name="trans">true</param>
        <param name="paging">false</param>
        <param name="ftl">template/generate/${Tname}/T_${Tname}_Edit.ftl</param>
	</query>

	<#assign index=0/>
	<!-- 列表更新 -->
	<query id="Q_${Tname}_UPDATE" type="update" result="json">
	   <stmt><![CDATA[
		update ${Tname} t set <#list Fields_Cols as ui><#if index&gt;0>,</#if>${ui.name} = [${ui.name}] <#assign index=index+1/></#list> where  <#assign index=0/><#list KEY as diki><#if index&gt;0> and </#if>t.${diki.item} = [Id]<#assign index=index+1/></#list>
	   ]]></stmt>
	   <param name="trans">true</param>
	   <param name="paging">false</param>
	</query>
	
	<#list Fields_Cols as i>
	<#if i.type=="3">
	<!-- 查询条件用的下拉框列表 
	<query id="Q_${Tname}_${i.name}_S_SELECT" type="labelvalue" result="json">
        <stmt>
            <![CDATA[
			select ID,NAME from core_b_obj_info 
			]]>
        </stmt>
        <param name="l-col">NAME</param>
        <param name="v-col">ID</param>
    </query>
    -->
    <!-- 编辑用的下拉框
	<query id="Q_${Tname}_${i.name}_E_SELECT" type="labelvalue" result="json">
        <stmt>
            <![CDATA[
			select ID,NAME from core_b_obj_info 
			]]>
        </stmt>
        <param name="l-col">NAME</param>
        <param name="v-col">ID</param>
    </query>    
	-->
	</#if>
	</#list>
</query-config>