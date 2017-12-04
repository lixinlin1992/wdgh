<#assign cols_i=0/>
<#assign cols_di=0/>
/****展示列表参数****/
    var params = {
	   colNames : [<#list Cols as i><#if cols_i&gt;0>,</#if>'${i.name}'<#assign cols_i=cols_i+1/></#list>,'操作'],
	   colModel : [ 
	   <#list Cols as ii>
	   <#if cols_di&gt;0>,</#if>
	   {
	 	name : '${ii.name}',
		index : '${ii.index}',
		width : '10%',
		align : "center" 
	   }
	   <#assign cols_di=cols_di+1/>
	   </#list>,{
		name : '操作',
		width : '15%',
		align : "center" ,
		formatter : createButton,
		formatoptions : {},
		sortable : false
	   }],
		caption : "${Mname}",
		edit : false,
		multiselect:false, 
		width:"100%",
		pager: "#pagerdt"
   };
/****操作列参数****/
   function createButton(cellvalue, options, rowObject){
	return "<input name='btnfunction' class='grid_button' value='查询' type='button' onclick='show(\""+cellvalue+"\")'/>"+
		"&nbsp;&nbsp;<input name='btnfunction' class='grid_button' value='删除' type='button' onclick='del(\""+cellvalue+"\")'/>";
   }
/****添加对话框参数****/
   var addOpts = {
	title : "${Mname}",
	width : "600px", 
	height : "450" , 
	modal : true, 
	bgiframe : true,
	resizable:false,
	buttons : {
	  '取消':function(){$("#panel").dialog("close");},
	   '确定':function(){
		CORE.submitForm("DS_${Tname}_ADD","panelForm",{data: ""},
			function(){
				$("#panel").dialog("close");
				GRID.reload('listdt');
		})
	   }
	}
   };	
/****修改对话框参数****/
   var editOpts = {
	title:"${Mname}",
	width:"600px", 
	height:"450" , 
	modal:true, 
	ID:0,
	bgiframe:true,
	resizable:false,
	buttons : {
	  '取消':function(){$("#panel").dialog("close");},
	   '确定':function(){
              CORE.submitForm("DS_${Tname}_UPDATE","panelForm",{data:"Id="+editOpts.ID},
			function(){
			   $("#panel").dialog("close");
                        GRID.reload('listdt');
		});
          }
	}
   };		
/****删除方法****/
   function del(Id){
	CORE.confirm("确定要删除吗？",function(){
		CORE.request("DS_${Tname}_DEL",{data:'ftl=_ftl&Id='+Id},function(data){
			CORE.info("删除成功!");
			GRID.reload("listdt");
		});
	});
   }
/****装载修改数据方法****/
   function show(Id){
 	document.panelForm.reset();	
	CORE.loadForm("DS_${Tname}_EDIT","panelForm",{data:"Id="+Id,
		loadComplete:function(){							
			editOpts.ID = Id;	
			$("#panel").dialog(editOpts);								
		}
	});   	
   }
/****添加新数据方法****/
   function add(){
	document.panelForm.reset();	
   	$("#panel").dialog(addOpts);
   }
/******初始化方法******/
	$(function(){
		<#list Fields_Cols as i>
		<#if i.type=="3">//CORE.loadSelect("S_${i.name}","DS_${Tname}_${i.name}_S_SELECT",{});
		//CORE.loadSelect("${i.name}","DS_${Tname}_${i.name}_E_SELECT",{});</#if>
		</#list>
		GRID.create("#listdt", "DS_${Tname}_LIST",params,"searchForm");
	});