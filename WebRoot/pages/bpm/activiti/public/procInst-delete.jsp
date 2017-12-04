<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<div id="procInstDeleteFormDialog" style="display: none; padding: 0px !important; margin: 0 0 0 10px !important;">
	<form name="procInstDeleteForm" onsubmit="return false;" enctype="multipart/form-data">
		<input id="_procInstDel_procInstId" name="_procInstDel_procInstId" type="hidden">
		<table>
			<tr>
				<td class="formLabel">删除原因：</td>
				<td class="formField"><textarea id="_procInstDel_reason" name="reason" rows="4" cols="30"></textarea></td>
			</tr>
		</table>
	</form>
</div>