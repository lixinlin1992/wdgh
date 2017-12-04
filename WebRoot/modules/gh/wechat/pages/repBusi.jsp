<%--
User: Larry
--%>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>商机报备</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <r:include resource="!rdcp/pages/mbase.jsp"/>
    <link href="!whBusiness/wechat/~/css/moblieIndex.css" rel="stylesheet" type="text/css"/>
    <script type="text/javascript" src="!whBusiness/wechat/~/scripts/repBusi.js"></script>
    <script type="text/javascript" src="!whBusiness/wechat/~/scripts/address.js"></script>
    <script type="text/javascript" src="!szbo/base/scripts/upload.js"></script>
</head>
<body>
		<%
		%>
<form id="addBusiForm" name="addBusiForm" enctype="multipart/form-data" onsubmit="return false;">
	<!-- 获取uuid -->
	<!-- 序列 -->
	<input name="seqNum" id="seqNum" type="hidden"/>
	<!--临时标签 三种业务类型的fee值隐藏标签 /未做动态生成 -->
	<input name="busiTypeFeeAll_0" id="busiTypeFeeAll_0" type="hidden"
		value="0" />
	<input name="busiTypeNumAll_0" id="busiTypeNumAll_0" type="hidden"
		value="0" />
	<!-- 移网 -->
	<input name="busiTypeFeeAll_1" id="busiTypeFeeAll_1" type="hidden"
		value="0" />
	<!-- 固网 -->
	<input name="busiTypeFeeAll_2" id="busiTypeFeeAll_2" type="hidden"
		value="0" />
	<!-- 系统集成 -->
	
	<div class="SR_Form">
	<!--手机页面标题Begin-->
	<div class="SR_title">
		<div class="SR_titleBg">
			<a class="leftBtn" href="javascript:history.go(-1);">返回</a>
			<h1>商机管理系统</h1>
			<a class="rightBtn" href="javascript:history.go(-1);">首页</a>
		</div>
	</div>
	<!--手机页面标题Begin-->
	<!--页面表单Begin-->
	<div class="SR_moblieForm">
		<div class="SR_moblieFormBox">
			<ul>
				<li class="SR_moblieFormList">
					<table cellspacing="0">
						<tr>
							<td class="listTitle"><span>商机名称</span><span>|</span></td>
							<td class="listContent"><input type="text" id="busi_name" name="busi_name"/></td>
						</tr>
					</table>
				</li>
				<!-- <li class="SR_moblieFormList">
					<table cellspacing="0">
						<tr>
							<td class="listTitle"><span>预计规模</span><span>|</span></td>
							<td class="listContent">
								<input name="busi_pro_fee_value" id="busi_pro_fee_value" 
										type="hidden" value="0" />
								<select id="busi_pro_fee" name="busi_pro_fee" onchange="getBusiClass('busi_pro_fee');">
									<option value="">--请选择--</option>
								</select>
							</td>
						</tr>
					</table>
				</li>
				<li class="SR_moblieFormList">
					<table cellspacing="0">
						<tr>
							<td class="listTitle"><span>牵头部门</span><span>|</span></td>
							<td class="listContent">
								<input name="busi_pro_unit_value" id="busi_pro_unit_value"
										type="hidden" value="0" />
								<select id="busi_pro_unit" name="busi_pro_unit" onchange="getBusiClass('busi_pro_unit');">
									<option value="">--请选择--</option>
								</select>
							</td>
						</tr>
					</table>
				</li>
				<li class="SR_moblieFormList">
					<table cellspacing="0">
						<tr>
							<td class="listTitle"><span>实施时间</span><span>|</span></td>
							<td class="listContent">
								<input name="busi_pro_time_value" id="busi_pro_time_value"
										type="hidden" value="0" />
								<select id="busi_pro_time" name="busi_pro_time" onchange="getBusiClass('busi_pro_time');">
									<option value="">--请选择--</option>
								</select>
							</td>
						</tr>
					</table>
				</li> -->
				<li class="SR_moblieFormBigList">
					<table cellspacing="0">
						<tr>
							<td class="listTitle"><span>商机等级</span><span>&nbsp;</span></td>
							<td>
								<ul id="busi_class_html_mobile"></ul>
							</td>
							<td>
								<input name="busi_class_value" id="busi_class_value"
									type="hidden" value="0" />
								<!-- 自动生成 -->
								<input name="busi_class" id="busi_class" type="hidden" disabled
									class="orgrayInput" />
							</td>
						</tr>
					</table>
				</li>
				<!-- <li class="SR_moblieFormList">
					<table cellspacing="0">
						<tr>
							<td class="listTitle"><span>商机级别</span><span>|</span></td>
							<td class="listContent">
								<input name="busi_class_value" id="busi_class_value" type="hidden" value="0" />
								自动生成
								<input name="busi_class" id="busi_class" type="text" disabled class="orgrayInput" />
							</td>
						</tr>
					</table>
				</li> -->
				<!-- <li class="SR_moblieFormBigList">
					<table cellspacing="0">
						<tr>
							<td class="listTitle"><span>商机地址</span><span>&nbsp;</span></td>
							<td class="listContent" colspan="3">
							<div data-role="controlgroup" id="select_p_c_a" data-ajax="false">  
								    <ul><li><select id="select_province" style="width:100px;"> </select></li>  
								    <li><select id="select_city" style="width:130px;"> </select>  </li> 
								   <li><select id="select_area" style="width:130px;"> </select></li> 
								  
								    <li><input type="hidden" name ="busi_addr" id="busi_addr"/> </li>
								    <li><input name="busi_addr_show" id="busi_addr_show" onchange="sum_address()"
									type="text" /> </li>
									</ul>  
								</div>
							</td>
						</tr>
					</table>
				</li> -->
				<li class="SR_moblieFormList">
					<table cellspacing="0">
						<tr>
							<td class="listTitle"><span>商机地址</span><span>|</span></td>
							<td class="listContent">
								<input name="busi_addr" id="busi_addr" type="text" />
							</td>
						</tr>
					</table>
				</li>
				<li class="SR_moblieFormList">
					<table cellspacing="0">
						<tr>
							<td class="listTitle"><span>客户名称</span><span>|</span></td>
							<td class="listContent">
								<!-- 自动匹配 -->
								<input name="cust_name" id="cust_name" type="text" value="" />
							</td>
						</tr>
					</table>
				</li>
				<li class="SR_moblieFormList">
					<table cellspacing="0">
						<tr>
							<td class="listTitle"><span>联系人</span><span>|</span></td>
							<td class="listContent"><input type="text" name="cust_per" id="cust_per" /></td>
						</tr>
					</table>
				</li>
				<li class="SR_moblieFormList">
					<table cellspacing="0">
						<tr>
							<td class="listTitle"><span>联系电话</span><span>|</span></td>
							<td class="listContent"><input type="text" name="cust_phone" id="cust_phone" /></td>
						</tr>
					</table>
				</li>
				<li class="SR_moblieFormListTextarea">
					<table cellspacing="0">
						<tr>
							<td class="listTitle">需求描述：</td>
						</tr>
						<tr>
							<td class="listContent" colspan="2"><textarea id="requ_des" name="requ_des"></textarea></td>
						</tr>
					</table>
				</li>
				<li class="SR_moblieFormTable">
					<table cellspacing="0" id="busiTable">
						<tr>
							<th>业务类型</th>
							<th>预计规模<br/>(数量/户)</th>
							<th>预计规模<br/>(月收/元)</th>
							<th style="width:60px;">
									<a class="btn_add" href="javascript:void(0);"
										onclick="addBusiType()">新增</a>
								</th>
						</tr>
						<tr>
							<td>
								<input name="busiTypeSelectB_1" id="busiTypeSelectB_1"
									type="hidden" />
								<select name="busiType_1" id="busiType_1"
									onclick="getOnClickValue(this.value,1)"
									onchange="sumBusiType(1,1);"></select>
							</td>
							<td>
								<input type="hidden" name="busiTypeNumF_1"
									id="busiTypeNumF_1" />
								<input name="busiTypeNum_1" id="busiTypeNum_1"
									class="orlongInput" style='text-align: center' type="text"
									onchange='sumNum(1)'/>
							</td>
							<td>
								<input type="hidden" name="busiTypeFeeF_1"
									id="busiTypeFeeF_1" />
								<input name="busiTypeFee_1" id="busiTypeFee_1"
									class="orlongInput" style='text-align: center' type="text"
									onchange="sumFee(1)" onfocus="getOnFocusValue(this.value,1)" />
							</td>
							<td>
							<a class="btn_delete" href="javascript:void(0);"
							onclick="delBusiType(1)">删除</a>
							</td>
						</tr>
						<tr id="busiEndTr">
							<td>
							</td>
							<td>
								合计
							</td>
							<td>
								<span id="sumFee">0</span>
							</td>
							<td>

							</td>
						</tr>
					</table>
				</li>
				<li id="mask">
					<div class="file-box"> 
						<input name="div_name" id="div_name" type="hidden" />
						<table class="uploadTable" width="100%">
							<tr>
								<td>
									<input type='text' name='textfield' id='textfield' class='txt' /> 
								</td>
								<td width="83px">
									<input type="hidden" name="note" value="0" /> 
								    <input type="hidden" id="import_order_id" name="import_order_id" /> 
									<input type="hidden" id="table_name" name="table_name" /> 
									
									<input type='button' class='btnSelect' value='选择文件' />
									<input type="file" name="file" id="upfile" class="file" size="28" onchange="document.getElementById('textfield').value=this.value"/> 
								</td>
								<td width="83px">
									<a class="btnUpload" onclick="importFileInfo()" href="javascript:void(0);">上传文件</a>
								</td>
							</tr>
						</table>
						<div id="addOrderInfo"></div>
					</div> 
				</li>
				<li  class="SR_moblieFormListBtn">
					<table>
						<tr>
							<td><a class="moblieBtn" href="javascript:void(0);" onclick="addBusi()">确定</a></td>
							<td class="space"></td>
							<td><a class="moblieBtn" href="javascript:history.go(-1);">取消</a></td>
						</tr>
					</table>
				</li>
			</ul>
		</div>
	</div>
	<!--页面表单End-->
</div>
</form>
</body>
</html>