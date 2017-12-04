(function($) {
	$.fn.bpmActiviySelector = function(taskId) {
		if (!taskId) {
			CORE.info("没有传入taskId");
			return;
		}

		/***********************************************************************
		 * ***************** 以下代码定义了事件函数**************
		 * **************************************************************** *
		 * **************************************************************** *
		 * **************************************************************** *
		 * **************************************************************** *
		 */

		/**
		 * 选择责任人事件
		 * 
		 * @param taskBean
		 *            任务实例
		 * @param activity
		 *            环节实例
		 */
		var onAssigneeSelect = function(assigneeSelectorDialogId, taskBean, activity) {
			// $("#activitySelectedAssignee_" + activity.id).html("选择责任人事件未完成" +
			// activity.name);
			BPM.showAssigneeSelectDialog(taskBean, activity);
		};

		/**
		 * 选择责任人事件完成
		 * 
		 * @param taskBean
		 *            任务实例
		 * @param activity
		 *            环节实例
		 */
		var onAssigneeSelected = function(taskBean, activity) {
			$("#activitySelectedAssignee_" + activity.id).html("选择责任人事件未完成" + activity.name);
		};

		/***********************************************************************
		 * ***************** 以下代码定义了一些生成html代码的函数**************
		 * **************************************************************** *
		 * **************************************************************** *
		 * **************************************************************** *
		 * **************************************************************** *
		 */

		/**
		 * 判断活动组在DOM树里是否已存在
		 * 
		 * @param groupId
		 *            组ID
		 */
		var isGroupDomExists = function(groupId) {
			var activityGroup = $("#" + groupId);
			if (!activityGroup.get(0))
				return false;
			else
				return true;
		};

		/**
		 * 选中指定组的第一个环节
		 * 
		 * @param groupId
		 *            组ID
		 */
		var checkAllDefaultActByGroupId = function(groupId) {
			$("input[name=" + groupId + "]").first().attr("checked", "checked");
		};

		/**
		 * 生成活动选择表单(主区域)<br>
		 * 组、环节实例都是生成到这个表单里面
		 * 
		 * @param taskBean
		 *            任务实例
		 */
		var genActivitySelectorForm = function(taskBean) {
			var formId = "selectorForm_" + taskBean.taskId;
			var $selector = $("#bpmActivitySelectorDialog");
			$selector.html("");

			var html = "";
			html += "<form id='" + formId + "' class='bpmActivitySelectorForm'>";
			html += "<div class='bpmActivitySelectorInfo'>";
			html += "<a href='javascript:void(0)' class='bpmActivitySelectorInfoImg'></a>";
			html += "当前环节：" + BPM.genTaskTraceLink(taskBean.taskId, taskBean.curActivity.name);
			html += "</div>";
			html += "<div id='activitySelectArea' class='activitySelectArea'>";
			html += "</div>";
			html += "</form>";
			$selector.html(html);
		};

		// 组信息-环节组图片
		var genGroupInfo_imageHtml = function(taskBean, activity) {
			var html = "";
			html += "<td class='groupInfo_imgTd'>";
			html += "<a class='btn_arrow_right' href='javascript:void(0);' ></a>";
			html += "</td>";
			return html;
		};
		// 组信息-环节组复选框
		var genGroupInfo_selectBoxHtml = function(taskBean, activity) {
			var html = "";
			var group = activity.task_group;
			html += "<td class='groupInfo_selectBoxTd'> ";
			html += "<input id='" + "actGroup_" + group + "' name='" + "actGroup' type='checkbox'/>";
			html += "</td>";
			return html;
		};
		// 组信息-环节组名字
		var genGroupInfo_nameHtml = function(taskBean, activity) {
			var html = "";
			html += "<td class='groupInfo_nameTd'>";
			html += "<a class='gropuName' href='javascript:void(0);'>";
			html += activity.task_group;
			html += "</a>";
			html += "</td>";
			return html;
		};

		// 环节选择-环节单选框
		var genActivitySelect_checkBoxHtml = function(taskBean, activity) {
			var html = "";
			var group = activity.task_group;
			var check = activity.task_is_required == true ? "checked='checked'" : "";
			html += "<td class='activitySelect_checkBoxTd'>";
			html += "<input id='act_" + activity.id + "' name='actGroupType_" + group + "' type='radio' " + check + " />";
			html += "</td>";
			return html;
		};

		// 环节选择-来自路径
		var genActivitySelect_fromTransitionHtml = function(taskBean, activity) {
			var html = "";
			html += "<td class='activitySelect_fromTransitionTd'>";
			html += activity.fromTransition.name;
			html += "</td>";
			return html;
		};

		// 环节选择-通往环节图片
		var genActivitySelect_toActivityImgHtml = function(taskBean, activity) {
			var html = "";
			html += "<td class='activitySelect_toActivityImgTd'>";
			html += "<a class='btn_arrow_right' href='javascript:void(0);' ></a>";
			html += "</td>";
			return html;
		};
		// 环节选择-通往环节名字
		var genActivitySelect_activityNameHtml = function(taskBean, activity) {
			var html = "";
			html += "<td class='activityNameTd'>";
			html += activity.name;
			html += "</td>";
			return html;
		};
		// 环节选择-已选责任人名字
		var genActivitySelect_selectedAssigneesHtml = function(taskBean, activity) {
			var html = "";
			html += "<td id='activitySelectedAssignee_" + activity.id + "' class='activitySelectedAssigneesTd'>";
			html += "系统管理员";
			html += "<input id='activitySelectedAssigneeIds_" + activity.id + "' type='hidden' value='1' />";
			html += "</td>";
			return html;
		};
		// 环节选择-责任人选择器
		var genActivitySelect_assigneeSelectorHtml = function(taskBean, activity) {
			var selectorId = "activityAssigneeSelector_" + activity.id;
			var assigneeSelectorDialogId = "bpmAssigneeSelectorDialog_" + activity.id;

			var html = "";
			html += "<td class='activityAssigneeSelectorTd'>";
			html += "<a id='" + selectorId + "' class='btn_add' href='javascript:void(0);'>";
			html += "</a>";
			html += "<div id='" + assigneeSelectorDialogId + "' class='bpmAssigneeSelectorDialog' style='display:none;'></div>";
			html += "</td>";

			$("a[id=" + selectorId + "]").die().live('click', function() {
				onAssigneeSelect(assigneeSelectorDialogId, taskBean, activity);
			});
			return html;
		};

		/**
		 * 根据传入的活动实例，生成对应的活动组
		 * 
		 * @param activity
		 *            活动实例
		 */
		var genGroupHtml = function(taskBean, activity) {
			var groupId = "activityGroup_" + activity.task_group;
			var html = "";
			html += "<div id='" + groupId + "' class='activityGroup'>";
			html += "<table class='activityGroupTitleTable'>";
			html += "<tr>";
			// 环节组图片
			html += genGroupInfo_imageHtml(taskBean, activity);
			// 环节组复选框
			html += genGroupInfo_selectBoxHtml(taskBean, activity);
			// 环节组名字
			html += genGroupInfo_nameHtml(taskBean, activity);
			html += "</tr>";
			html += "</table>";

			var groupListId = "activityGroupList_" + activity.task_group;
			html += "<table id='" + groupListId + "' class='activitySelectorList'>";
			html += "</table>";
			html += "</div>";

			$("#activitySelectArea").append(html);
			if (activity.task_is_required == true) {
				$("#actGroup_" + activity.task_group).attr("checked", "checked");
				$("#actGroup_" + activity.task_group).attr("disabled", "true");
				checkAllDefaultActByGroupId("#actGroup_" + activity.task_group);
			}
		};

		BPM.getTaskBeanData(taskId, function(taskBean) {

			// 生成活动选择表单.
			genActivitySelectorForm(taskBean);

			$(taskBean.nextPassableActivities).each(function(index) {
				var activity = taskBean.nextPassableActivities[index];

				// 如果活动组不存在则生成一个空的活动组
				var groupId = "activityGroup_" + activity.task_group;
				if (!isGroupDomExists(groupId)) {
					genGroupHtml(taskBean, activity);
				}

				var html = "";
				html += "<tr>";
				// 环节单选框
				html += genActivitySelect_checkBoxHtml(taskBean, activity);
				// 路径
				html += genActivitySelect_fromTransitionHtml(taskBean, activity);
				// 环节图片
				html += genActivitySelect_toActivityImgHtml(taskBean, activity);
				// 环节名字
				html += genActivitySelect_activityNameHtml(taskBean, activity);
				// 已选责任人
				html += genActivitySelect_selectedAssigneesHtml(taskBean, activity);
				// 责任人选择器
				html += genActivitySelect_assigneeSelectorHtml(taskBean, activity);
				html += "</tr>";

				var groupListId = "activityGroupList_" + activity.task_group;
				$("#" + groupListId).append(html);
			});

		});

	};
})(jQuery);