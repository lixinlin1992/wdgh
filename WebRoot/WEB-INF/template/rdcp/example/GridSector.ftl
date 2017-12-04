<#--
 * @(#)GridSector.ftl 11-9-29 下午1:24
 * CopyRight 2011.  All rights reserved
 *
 * 列表模板,根据FreemarkerSector传递的参数生成jqgrid所需要的JS和HTML代码
 * 需要传递参数：
 * gridTableCaption 列表的标题
 * gridTableName 列表所需要的TABLE ID,列表参数名
 * colModels 列表列的参数JSON
 *          colModel包含name,index,width,align,sortable,hidden属性
 * width 列表总长度
 * height 列表高度
 * gridTableMultiselect 列表的是否可以多选
 * isScroll 是否存在滚动条
 * datasource 列表加载的数据源
 * formname 查询条件表单
 *
 *	
-->

<#-- isScroll属性 设置列表是否存在滚动条 -->
<div id="${property("gridTableName")!}_container" style="<#assign _isScroll=property("isScroll")!/><#if _isScroll=="true">overflow-x: auto; overflow-y: hidden;</#if> width: 100%;">
	<#-- gridTableName属性 设置列表的所属TABLE -->
		<table id="${property("gridTableName")!}" style="margin: 0; padding: 0;"></table>
	<#-- 设置列表的面板 -->
	<#assign _pagerName=property("isGridPagerName")!/>
	<#if _pagerName=="true">
		<div id="Pager${property("gridTableName")}" style="margin: 0; padding: 0;"></div>
	</#if>
</div>
		

<script>
        <#-- 判断配置有没有列表参数 -->
        <#assign _colModel=property("colModels")/>
		<#if (json(_colModel,"$.")?size>0)>
  		<#-- 列表参数 -->
	    var ${property("gridTableName")!} = {
		   colModel : [ 
  		   <#-- 利用Jsonpath遍历colModel参数 -->
		   <#assign index = 0/>
           <#list json(_colModel,"$.") as _colModelList>
	       <#if index&gt;0>,</#if>
		   {
		 	name : '${_colModelList.name.value!}',
			index : '${_colModelList.index.value!}',
			<#if _colModelList.label??>
			label : '${_colModelList.label.value!}',
			</#if>
			<#if _colModelList.percentwidth.value?? && _colModelList.percentwidth.value?string="true">
			width : '${_colModelList.width.value!}%',
			<#else>
			width : ${_colModelList.width.value!},
			</#if>
			align : "${_colModelList.align.value!}",
			sortable : <#if _colModelList.sortable.value?? && _colModelList.sortable.value?string="true">true<#else>false</#if>,
			hidden : <#if _colModelList.hidden.value?? && _colModelList.hidden.value?string="true">true<#else>false</#if>
			<#if _colModelList.formatter.value != "">
			,
			formatter:function(cell, options, row, tr, td) {
				${_colModelList.formatter.value!}
            }
			</#if>
		   }
	       <#assign index=index+1/>
		   </#list>
		   ],
		   	<#-- 标题 -->
			caption : "${property("gridTableCaption")!}",
			<#if property("groupData")?? && property("groupData") != "">
			groupData : ${property("groupData")!} 
			,
			</#if>

			<#-- 是否有水平滚动条 -->
			
			<#if property("isFit")?? && property("isFit")=="true">
            shrinkToFit:false,
            </#if>			
			
			<#-- 是否多选 -->
			multiselect:<#if property("gridTableMultiselect")?? && property("gridTableMultiselect") =="true">true<#else>false</#if>, 
			<#-- 完成事件 -->
			loadComplete : function(gridData){
				<#if property("gridComplete")?? && property("gridComplete") != "">
				${property("gridComplete")!}
				</#if>
			},
			<#-- 选中该行事件 -->
			onSelectRow : function(rowid,status){
				<#if property("onSelectRow")?? && property("onSelectRow") != "">
				${property("onSelectRow")!}
				</#if>
			},
			<#-- 宽度 -->
			<#if property("percentwidth")?? && property("percentwidth")?string="true">
			width:"${property("width")!100}%"
			<#elseif property("width")??>
			width:${property("width")!100}
			<#else>
			width:"100%"
			</#if>			
			<#-- 决定是否生成pager属性 -->
			<#if _pagerName=="true">
			,pager:"#Pager${property("gridTableName")}"
			</#if>			
            <#if property("percentheight")?? && property("percentheight")?string="true">
            ,height:"${property("height")!}%"
            <#elseif property("height")??>
            ,height:${property("height")}
            </#if>
            <#if property("pagesizelist")?? && property("pagesizelist")?string != "">
                <#assign tempRowPageListStr = property("pagesizelist")?string/>
                <#assign tempRowPageListEle = tempRowPageListStr?split(",")/>
                <#if tempRowPageListEle?size == 1>
                    <#assign tempMatchPageList = ["10","15","20"]/>
                    ,rowList:[
                    <#assign plistIndex = 0/>
                    <#assign isPlSame = "false"/>
                    <#list tempMatchPageList as plist>
                        <#if plistIndex&gt;0>,</#if>${plist}
                        <#if tempRowPageListEle[0] == plist>
                            <#assign isPlSame = "true"/>
                        </#if>
                        <#assign plistIndex = plistIndex+1/>
                    </#list>
                    <#if isPlSame == "false">,${property("pagesizelist")}</#if>
                    ]
                <#else>
                    ,rowList:[${property("pagesizelist")}]
                </#if>
            <#else>
            ,rowList:[15,20,30]
            </#if>
            <#if property("footerrow")??>
            ,footerrow:${property("footerrow")}
            </#if>
            <#if property("userDataOnFooter")??>
            ,userDataOnFooter :${property("userDataOnFooter")}
            </#if>
            <#if property("pagesize")?? && property("pagesize")?string != "">
            ,rowNum:${property("pagesize")}
            <#elseif property("pagesizelist")?? && property("pagesizelist")?string != "">
                <#assign tempRowPageListStr = property("pagesizelist")?string/>
                <#assign tempRowPageListEle = tempRowPageListStr?split(",")[0]/>
            ,rowNum:${tempRowPageListEle}                 
            </#if>
	    };
		</#if>
<#-- 是否自动加载列表 -->
<#if property("isGenAuto")?? && property("isGenAuto") == "false">
<#else> 
	<#-- 初始化 -->
	$(function(){
		<#if (json(_colModel,"$.")?size=0)>
		CORE.info("你没有配置列表控件的字段数!");
		<#else>
        <#--如果指定了表单名称并且设定了自动映射列，添加list-cols参数-->
        <#if ""!=property("formname")! && "true"==property("auto_match_col")!>
        <#assign list_cols="">
        <#list json(_colModel,"$..index") as j>
        <#assign list_cols=list_cols+j.value>
        <#if j_has_next><#assign list_cols=list_cols+","></#if>
        </#list>
        $(document.${property("formname")}).append("<input type='hidden' name='list-cols' value='${list_cols}'>");
        </#if>
        GRID.create("#${property("gridTableName")!}", "${property("datasource")!}", ${property("gridTableName")!}, <#if property("formname") != "">"${property("formname")!}"<#else>"${property("gridTableName")!}Form"</#if>);
    	</#if>
    });
</#if>
    <#--接口函数定义区域-->
    var ${_config.code}={
            getSelectRow:function(col){
                return GRID.selectRow("${property("gridTableName")!}");
            },
            main:function(){
            	GRID.create("#${property("gridTableName")!}", "${property("datasource")!}", ${property("gridTableName")!}, <#if property("formname") != "">"${property("formname")!}"<#else>"${property("gridTableName")!}Form"</#if>);
            },
            hide:function(){
            	$("#${_config.code}").css("display","none");
            },
            show:function(){
            	$("#${_config.code}").css("display","");
            }
        };
</script>