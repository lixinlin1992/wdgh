<#-- 可折叠内容块 -->
	<div data-role="content">
		<div class="content-primary">
			<div data-role="collapsible" data-theme="${property("titleTheme")!}" data-content-theme="${property("contentTheme")!}"  data-collapsed="${property("iscollapsible")!}">
			   <h3>${property("title")!}</h3>
			   
				   <div id="dlg_${_config.code}">
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
					</div>
			</div>
		</div>
	</div>


