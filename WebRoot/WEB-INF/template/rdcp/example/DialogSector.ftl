<div id="dlg_${_config.code}" style="width:${(property("width")-20)!"400"}px;height:${(property("height")-40)!"400"}">
<#if _config.orientation='horizontal' && _sectors?size&gt;1>
    <table border="0" width="100%" style="padding:0px;margin: 0px;">
        <tr>
            <#list _sectors as s>
                <td style="padding:0px;margin: 0px;<#if "true"=property(s,"hidden")!>display:none;</#if>">
                <@sector sector=s/>
                </td>
            </#list>
        </tr>
    </table>
    <#else>
        <#list _sectors as s>
            <div id="${s.code}" style="margin: 0px;<#if "true"=property(s,"hidden")!>display:none;</#if>">
            <@sector sector=s/>
            </div>
        </#list>
</#if>
    <script>
        //生成对话框参数
        var dlg_param_${_config.code}={
            title:"${property("dialog_title")!"对话框"}",
            width:"${property("width")!"420"}",
            height:"${property("height")!"440"}",
            buttons:<#if ""!=property("dialog_buttons")?trim!>${property("dialog_buttons")}<#else>{}</#if>
        };
		
		var ${_config.code}TempParam = {};
		
        //生成入口函数
        var ${_config.code}={
            main:function(params){
            	if(params == undefined || params == "")
            		params = {}
            	//外部参数传入对话框参数
            	var externalParamKeyList = new Array();
            	var externalParamValueList = new Array();
            	if(params != undefined || params != ""){
            		for(var key in params)
            		{
            			externalParamKeyList.push(key);
            			externalParamValueList.push(params[key]);	
            		}            	
            	}
            	if(params.dlg_config == undefined)
                    $("#dlg_${_config.code}").dialog(dlg_param_${_config.code});
                else
                    $("#dlg_${_config.code}").dialog(params.dlg_config);             
                   
                for(var i = 0;i<externalParamKeyList.length;i++)
                {                	
           			${_config.code}TempParam[externalParamKeyList[i]] = externalParamValueList[i];
                }
            },
            close:function(){
                $("#dlg_${_config.code}").dialog("close");
            },
            getDlgParams:function(){
                return dlg_param_${_config.code};
            },
            getParas:function(params){
            	return ${_config.code}TempParam;
            }
        };
    </script>
</div>                           