<#--*内容sector*-->
<script>
        <#assign _colModel=property("colModels")/>
        var colsInfo =[
        <#if (json(_colModel,"$.")?size>0)>
            <#assign index = 0/>
            <#list json(_colModel,"$.") as _colModelList>
            <#if index&gt;0>,</#if>
                {
                name:"${_colModelList.name.value!}",
                index:"${_colModelList.index.value!}",
                hidden : <#if _colModelList.hidden.value?? && _colModelList.hidden.value?string="true">true<#else>false</#if>
                }
            <#assign index=index+1/>
            </#list>
        </#if>
        ];
<#--* 页面异步加载数据 *-->     
$( '#_aboutPage' ).live( 'pageinit',function(event){
    listCreate(1,"");
});
<#--* 自定义第几页 *-->
function gotoPage(total,formName){
    var pgNum = $("#pageNum").val();
    if(pgNum>total){
        pgNum = total;
    }
    if(pgNum<=0){
        pgNum = 1;
    }
    listCreate(pgNum,formName);
}
<#--
*创建list
-->
function listCreate(seaerhPage,formName){
  var formS = $("#"+formName).serialize();
  if(formS!=""){
    formS = "&"+formS;
  }
  CORE.request("${property("list_ds")!}",{data:"page="+seaerhPage+formS},function(data){
       $("#_ui_${_config.code}").empty();
       $("#_ui_${_config.code}").append("<li data-role='list-divider'>${property("title")!}</li>");
       
       var total = 0;<#--总页数-->
       var page = 1 ;<#--当前第几页-->
       var li ="";
       if(data.records !=null && data.records>0){
            total = data.total;  
            page = data.page;
            for(i=0;i<data.rows.length;i++){
                var col ="";
                if(colsInfo.length>0){
                    col="<table id='_table"+i+"${_config.code}' width='100%' border='0'>";
                    for(j=0;j<colsInfo.length;j++){
                        var dis ="";<#--列是否隐藏-->
                        if(colsInfo[j].hidden){
                            dis="display:none;";
                        }
                        if(j==0){
                            col += "<tr style='"+dis+"' id='"+colsInfo[j].index+"' ><td width='5%' align='right'><h2>"+colsInfo[j].name+":</h2></td><td align='left'>"+data.rows[i].cell[j]+"</td><td></td></tr>";
                        }else{
                            col += "<tr style='"+dis+"' id='"+colsInfo[j].index+"'><td  width='5%' align='right'><h2>"+colsInfo[j].name+":</h2></td><td align='left'>"+data.rows[i].cell[j]+"</td><td></td></tr>";
                        }
                    }
                    col+="<tr><td></td><td></td><td align='right' width='40%'><a href='javascript:deleteData(\"_table"+i+"${_config.code}\");'>删除</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp<a href='javascript:editData(\"_table"+i+"${_config.code}\");'>编辑</a></td></tr></table>";
                    li+="<li><a href='javascript:goDetail(\"_table"+i+"${_config.code}\");'>"+col+"</a></li>";
                }   
            }
            $("#_ui_${_config.code}").append(li);       
       }
      
       var sPage ="<a style='color:black;' href='javascript:listCreate("+(page-1)+","+formName+");'>上一页</a>";<#-- 上一页 -->
       if(page==1){
            sPage = "<a style='color:gray;' href='#' disabled='disabled'>上一页</a>";
       }
       var nPage = "<a style='color:black;' href='javascript:listCreate("+ (page-(-1))+","+formName+");'>下一页</a>";<#--下一页-->
       if(page==total){
           nPage = "<a style='color:gray;' disabled='disabled' href='#'>下一页</a>";
       }
       var pageNum;
       
       $("#_ui_${_config.code}").append("<li data-role='list-divider'>"+
       "<div>"+sPage+"&nbsp;&nbsp;&nbsp;&nbsp;"+
       "总页数:"+total+
       "&nbsp;&nbsp;"+
       "<input type='text' id='pageNum' size='5' data-role='none' value='"+ page +"'/> &nbsp;&nbsp;&nbsp;&nbsp;"+
       "<a style='color:blue' href='javascript:gotoPage("+total+","+formName+");'> go </a>"+
       "&nbsp;&nbsp;&nbsp;&nbsp;"+nPage+"</div></li>");<#-- 上页下页操作栏 -->
       $("#_ui_${_config.code}").listview("refresh");<#-- 刷新列表 -->
      
  });   

};


var del_params = [<#--编辑/删除 所要的传的参数-->
    <#if property("delete_params")??>
        <#assign _delParams=property("delete_params")/>
        <#assign ind = 0/>
         <#list _delParams?split(",") as o> 
            <#if ind&gt;0>,</#if>
                "${o!}"
            <#assign ind=ind+1/>
         </#list>
    </#if>
];
<#--
*删除
-->
function deleteData(tid){
    if(del_params.length>0){
          var params_temp = ""; 
          for(i=0;i<del_params.length;i++){
            if(i==0){
                
                params_temp += del_params[i]+"="+getListData(tid,del_params[i]);
            }else{
                params_temp += "&"+del_params[i]+"="+getListData(tid,del_params[i]);
            }   
          } 
          if(confirm('确定要删除？')){
              CORE.request("${property("delete_ds")!}",{data:params_temp},function(data){
                 alert("删除成功");
              });
          }
    }
}
<#--
*拿到当前列指定的值
-->
function getListData(tid,code){
     var v = $("#"+tid).find("#"+code).children("td").eq(1).text(); 
     return v;
}
<#--
*跳到编辑页面，传相应参数
-->
function editData(tid){
    if(del_params.length>0){
          var params_temp = "";
          for(i=0;i<del_params.length;i++){
                params_temp += "&"+del_params[i]+"="+getListData(tid,del_params[i]);
          } 
          CORE.goToDS("DS_RDCP_RUN_PAGE","page_code=${property("edit_url")!}&_sysCode=${_page.sys_code!}&bfPageId=${_page.id!}"+params_temp,null,"_blank");
    }   
}
<#-- 跳到明细页面 -->
function goDetail(tid){
    var flat = "${property("isDetail")}";
    if(flat=="true"){
        if(del_params.length>0){
              var params_temp = "";
              for(i=0;i<del_params.length;i++){
                    params_temp += "&"+del_params[i]+"="+getListData(tid,del_params[i]);
              } 
              CORE.goToDS("DS_RDCP_RUN_PAGE","page_code=${property("detail_url")!}&_sysCode=${_page.sys_code!}&bfPageId=${_page.id!}"+params_temp,null,"_blank");
        }
    }
}
</script>

<div id="_div_${_config.code}">
    <ul id='_ui_${_config.code}' data-role='listview' data-theme='${property("contentTheme")!}'  data-divider-theme='${property("titleTheme")!}'  data-inset='true'>
    </ul>
</div>      
