<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<style>
.bpmActivitySelectorDialog {
	padding: 10px;
}

.bpmActivitySelectorInfo {
	padding-left: 5px;
	padding-right: 5px;
	margin-bottom: 5px;
	background-color: #EBF5FF;
	border: 1px solid #CAD6E2;
	height: 25px;
	line-height: 25px;
}

.curActivityName:link {
	margin-right: 10px;
	color: blue;
	text-decoration: underline;
}

.activitySelectorGroup {
	padding-left: 0px;
	padding-right: 0px;
	margin-top: 15px;
	margin-bottom: 5px;
}

.activitySelectorGroup .activityGroupTitle {
	padding-left: 0px;
	padding-right: 0px;
	margin-bottom: 5px;
	padding-right: 0px;
}

.bpmActivitySelectorInfoImg {
	text-indent: 25px;
	vertical-align: middle;
	display: inline-block;
	height: 16px;
	line-height: 25px;
	min-width: 16px;
	cursor: pointer;
	background: url(themes/default/images/common/buttons.png) no-repeat 0px
		-144px;
}

.activityGroup {
	border-collapse: collapse;
	margin-bottom: 5px;
}

.activityGroup td {
	vertical-align: middle;
}

.activityGroup .groupInfo_imgTd {
	display: none;
	width: 25px;
	text-align: center;
}

.activityGroup .groupInfo_selectBoxTd {
	width: 25px;
	text-align: center;
}

.activityGroup .groupInfo_nameTd {
	width: 200px;
	text-align: left;
	padding-left: 15px;
}

.activitySelectorList {
	border-collapse: collapse;
	width: 100%;
	border: 1px solid #CAD6E2;
	background-color: #EBF5FF;
}

.activitySelectorList tr {
	height: 25px;
	border: 1px solid #A6C9E2;
}

.activitySelectorList td {
	border: 1px solid #A6C9E2;
	height: 25px;
	vertical-align: middle;
}

.activitySelectorList .activitySelect_checkBoxTd {
	width: 25px;
	text-align: center;
}

.activitySelectorList .activitySelect_fromTransitionTd {
	width: 50px;
	text-align: center;
}

.activitySelectorList .activitySelect_toActivityImgTd {
	width: 25px;
	text-align: center;
}

.activitySelectorList .activityNameTd {
	width: 100px;
	text-align: center;
}

.activitySelectorList .activityAssigneeSelectorTd {
	width: 25px;
	text-align: center;
}

.bpmAssigneeSelectorDialog {
	padding: 10px;
}

.bpmAssigneeSelectorDialog .bpmAssigneeSelectorTable {
	border-collapse: collapse;
	width: 100%;
	border: 1px solid #CAD6E2;
}

.bpmAssigneeSelectorDialog .bpmAssigneeSelectorTable tr {
	height: 25px;
	border: 1px solid #A6C9E2;
}

.bpmAssigneeSelectorDialog .bpmAssigneeSelectorTable td {
	border: 1px solid #A6C9E2;
	height: 25px;
	vertical-align: middle;
}
</style>
<script type="text/javascript" src="pages/bpm/activiti/scripts/bpmActivitySelector.js"></script>
<script type="text/javascript" src="pages/bpm/activiti/scripts/bpmAssigneeSelector.js"></script>
<div id="bpmActivitySelectorDialog" class="bpmActivitySelectorDialog" style="display: none;"></div>