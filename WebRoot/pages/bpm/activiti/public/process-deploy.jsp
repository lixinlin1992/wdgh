<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<div id="processDeployFormDialog" style="display: none; padding: 0px !important; margin: 0 0 0 10px !important;">
	<form name="processDeployForm" onsubmit="return false;" enctype="multipart/form-data">
		<table>
			<tr>
				<td class="formLabel">流程名称：</td>
				<td class="formField"><input id="deployName" name="deployName" type="text" style="width: 200px;" /></td>
			</tr>
			<tr>
				<td class="formLabel">部署文件：</td>
				<td class="formField"><input name="file" id="file" type="file" /><input type="hidden" name="notes"
					id="notes" value="" /></td>
			</tr>
		</table>
	</form>
</div>