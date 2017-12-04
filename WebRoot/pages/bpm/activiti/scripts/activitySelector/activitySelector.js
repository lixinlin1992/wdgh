/**
 * 流程环节选择框生成器<br>
 * 
 * VERSION:0.1<br>
 * ·创建主类：ActivitySelector<br>
 * ·创建默认变量：ActivitySelector.defaultOptions， 环节选择框生成器默认的全局设置<br>
 * ·创建函数：ActivitySelector.create，用于创建环节生成器。<br>
 * ·创建函数：ActivitySelector.genActivitySelectTheme，生成选择器主题<br>
 * ·创建函数：ActivitySelector.showDialog， 用于把创建好的生成器以对话框方式显示出来<br>
 * ·创建函数：ActivitySelector.selectorOptionsValidate，验证参数是否传递正确<br>
 * ·创建函数：ActivitySelector.genActivitySelectorDialog，在body末端生成一个DIV作为根窗口<br>
 * ·创建函数：ActivitySelector.genActivitySelectorDialog_curActivityInfoDiv，生成当前环节信息区HTML元素<br>
 * ·创建函数：ActivitySelector.genActivitySelectorDialog_activitySelectDiv，生成环节选择区HTML元素<br>
 * ·创建函数：ActivitySelector.isActivitySelectGroupExists，判断环节选择组是否已存在<br>
 * ·创建函数：ActivitySelector.genActivitySelectGroupDiv，生成环节选择组HTML元素<br>
 * 
 * VERSION:0.1.1<br>
 * ·创建函数：ActivitySelector.getActivityGroups，获取所有环节组,返回的是jquery对象<br>
 * ·创建函数：ActivitySelector.selectFirstActivity，为指定的组选取第一个环节，如果不指定组选为所有组选择第一个环节<br>
 */
BPM.ActivitySelector = {
	VERSION : "0.1.1",
	PROVIDER : "Sunrise",
	AUTHOR : "Cow"
};

/**
 * 环节选择框生成器默认的全局设置
 */
BPM.ActivitySelector.defaultOptions = {

	// 调用主方法后，会生成一个ID为ActivitySelectorDialog的DIV在body的最末端
	// 如果调用主方法时检测到有这个DIV的存在，则清空该DIV的HTML内容重新加载
	activitySelectorDialogId : "ActivitySelectorDialog",

	// 环节选择框表单id
	activitySelectorFormId : "ActivitySelectorForm",

	// 当前环节信息区id
	activitySelectorCurActivityInfoDivId : "CurActivityInfoDiv",

	// 环节选择区id
	activitySelectorActivitySelectDivId : "ActivitySelectDiv",

	// 样式文件路径
	styleFilePath : "pages/bpm/activiti/scripts/activitySelector/defaultActivitySelectorTheme.css"
};

/**
 * 环节选择框生成器主方法<br>
 * 
 * @param selectorOptions
 *            生成器参数
 */
BPM.ActivitySelector.create = function(selectorOptions) {

	// 如果参数验证不通过，则直接跳出
	if (!BPM.ActivitySelector.selectorOptionsValidate)
		return;

	// 传入参数与默认参数整合
	var opts = $.extend({}, BPM.ActivitySelector.defaultOptions, selectorOptions);

	// 生成对话框元素
	BPM.ActivitySelector.genActivitySelectorDialog(opts);

	// 选中每个组的第一个环节
	BPM.ActivitySelector.selectFirstActivity();

};

/**
 * 生成选择器主题<br>
 * 
 * @param opts
 *            参数
 */
BPM.ActivitySelector.genActivitySelectTheme = function(opts) {
	var activitySelectorThemeId = "activitySelectTheme";

	var $head = $("head");
	var $style = $("#" + activitySelectorThemeId);

	// 如果样式文件未被导入,则导入一个
	if (!$style.get(0)) {
		$style = $("<LINK>");
	}

	$style.attr("id", activitySelectorThemeId);
	$style.attr("href", opts.styleFilePath);
	$style.attr("rel", "stylesheet");
	$style.attr("type", "text/css");

	$head.append($style);
};

/**
 * 获取已经选中的环节以及环节的处理人。
 * 
 * 返回的数据格式： [ { "id":"Activity_A", "name":"",
 * "selectedAssignees":[{"id":"","name":""},{"id":"","name":""}],
 * "selectedCopies":[{"id":"","name":""},{"id":"","name":""}] }, {}.... ]
 */
BPM.ActivitySelector.getSelectedActivities = function() {
	var selectedActivities = [];
	$(".ACTIVITY_SELECTOR").each(function(i, n) {
		n = $(n);
		if (!n.attr("checked"))
			return;
		var _act = {};
		_act["id"] = n.attr("activityId");
		_act["name"] = n.attr("activityName");
		// 找到已选中人员的信息
		var _parent = $(n.parent().parent());
		var _assigneeIds = _parent.find(".Activity_Assignees_Id_Span").html();
		var _assigneeNames = _parent.find(".Activity_Assignees_Name_Span").html();
		var _assigneeInfos = _parent.find(".Activity_Assignees_Info_Span").html();
		if (_assigneeIds != null && _assigneeIds.trim() != "") {
			_assigneeIds = _assigneeIds.split(",");
			_assigneeNames = _assigneeNames.split(",");
			_assigneeInfos = _assigneeInfos.split(",");
			var _assignees = [];
			for ( var i = 0; i < _assigneeIds.length; i++) {
				_assignees.push({
					"id" : _assigneeIds[i],
					"name" : _assigneeNames[i],
					"mainFlag" : (_assigneeInfos.length > i && _assigneeInfos[i].indexOf("M1") == 0) ? true : false,
					"mustFlag" : (_assigneeInfos.length > i && _assigneeInfos[i].indexOf("B1") == 2) ? true : false
				});
			}
			_act["selectedAssignees"] = _assignees;
		} else {
			_act["selectedAssignees"] = [];
		}

		// 抄送人
		var _copyIds = _parent.find(".Activity_Copies_Id_Span").html();
		var _copyNames = _parent.find(".Activity_Copies_Name_Span").html();
		if (_copyIds != null && _copyIds.trim() != "") {
			_copyIds = _copyIds.split(",");
			_copyNames = _copyNames.split(",");
			var _copies = [];
			for ( var i = 0; i < _copyIds.length; i++) {
				_copies.push({
					"id" : _copyIds[i],
					"name" : _copyNames[i]
				});
			}
			_act["selectedCopies"] = _copies;
		} else {
			_act["selectedCopies"] = [];
		}
		selectedActivities.push(_act);
	});
	return selectedActivities;
};

/**
 * 并进行检测（只检测userTask类型的环节）： 1. 必需至少选中一个步骤 2. 选中的步骤必需至少有一个处理人
 * 
 * @param info
 */
BPM.ActivitySelector.validateSelectedInfo = function(nextActivities, info) {
	if (info.length == 0)
		return "必需选择一个环节以往下驱动";
	var _msg = "";
	$.each(info, function(i, n) {
		// 找到对应的环节信息
		var _curActivity;
		for ( var _i = 0; _i < nextActivities.length; _i++) {
			if (nextActivities[_i].id == n.id) {
				_curActivity = nextActivities[_i];
				break;
			}
		}
		if (_curActivity == null || _curActivity == undefined) {

		} else {
			if ("userTask" == _curActivity.type && n["selectedAssignees"].length == 0)
				_msg += (_msg == "" ? "" : "<br>") + "环节 [" + n["name"] + "] 必需至少选择一个处理人";
		}
	});
	return _msg;
};

/**
 * 以弹出框方式显示环节选择框<br>
 * 
 * @param opts
 *            参数
 */
BPM.ActivitySelector.showDialog = function(selectorOptions) {
	var opts = $.extend({}, BPM.ActivitySelector.defaultOptions, selectorOptions);
	var $activitySelectorDialog = $("#" + opts.activitySelectorDialogId);

	// 如果满足以下条件，则不显示环节选择框
	// 1. 只有一个环节
	// 2. 不允许选人 并且 存在预定义人员
	// 3. 该环节是结束环节
	if (opts.nextActivities.length == 1
			&& ((!opts.nextActivities[0].customAssigneeAllowed && opts.nextActivities[0].preSetAssignees != undefined && opts.nextActivities[0].preSetAssignees.length > 0) || opts.nextActivities[0].type == "endEvent")) {
		opts.nextActivities[0].selectedAssignees = opts.nextActivities[0].preSetAssignees;
		// 设置选中的人员
		if (opts["activitySelectedCallBack"])
			opts["activitySelectedCallBack"](opts.nextActivities);
		return;
	}

	var activitySelectorDialogOptions = {
		title : "环节选择",
		width : "600",
		height : "400",
		modal : true,
		bgiframe : true,
		resizable : false,
		buttons : {
			'取消' : function() {
				$activitySelectorDialog.dialog("close");
			},
			'提交' : function() {
				var _assignees = BPM.ActivitySelector.getSelectedActivities();
				var validateMessage = BPM.ActivitySelector.validateSelectedInfo(opts.nextActivities, _assignees);
				if (validateMessage != "") {
					// 校验不通过
					CORE.tip(validateMessage);
				} else {
					// 校验通过，回调传入的接口函数，进行流程的驱动
					if (opts["activitySelectedCallBack"])
						opts["activitySelectedCallBack"](_assignees);
					$activitySelectorDialog.dialog("close");
				}
			}
		}
	};
	$activitySelectorDialog.dialog(activitySelectorDialogOptions);
};

/**
 * 环节选择框生成器参数验证方法,主函数的第一次必须是调用该方法<br>
 * 用于验证一些必传的参数及参数的格式是否正确<br>
 * 
 * @param opts
 *            需要验证的参数
 * @returns 是否验证成功
 */
BPM.ActivitySelector.selectorOptionsValidate = function(opts) {
	if (opts.taskBean == undefined) {
		alert("传入taskBean的值不正确：" + opts.taskBean);
		return false;
	}

	return true;

};

/**
 * 生成环节选择框<br>
 * ·在body末端生成一个Div为根容器<br>
 * ·在根窗口下添加各种HTML元素<br>
 * 
 * @param opts
 *            参数
 */
BPM.ActivitySelector.genActivitySelectorDialog = function(opts) {

	// 生成选择器主题
	// BPM.ActivitySelector.genActivitySelectTheme(opts);

	var $body = $("body");

	// 初始化根容器
	var $activitySelectorDialog = $("#" + opts.activitySelectorDialogId);
	if ($activitySelectorDialog.get(0)) {
		// 把根容器的内容清空
		$activitySelectorDialog.empty();
	} else {
		$activitySelectorDialog = $("<DIV>");
		$activitySelectorDialog.attr("id", opts.activitySelectorDialogId);
		$activitySelectorDialog.css("display", "none");
		$activitySelectorDialog.attr("class", "ActivitySelectorDialog");
		$body.append($activitySelectorDialog);
	}
	// 表单
	var $selectorDialogForm = $("<FORM>");
	$selectorDialogForm.attr("id", opts.activitySelectorFormId);
	$selectorDialogForm.attr("class", "ActivitySelectorDialogForm");
	$activitySelectorDialog.append($selectorDialogForm);

	// 当前环节信息区
	var $curActivityInfoDiv = BPM.ActivitySelector.genActivitySelectorDialog_curActivityInfoDiv(opts);
	$selectorDialogForm.append($curActivityInfoDiv);

	// 环节选择区
	var $activitySelectDiv = BPM.ActivitySelector.genActivitySelectorDialog_activitySelectDiv(opts);
	$selectorDialogForm.append($activitySelectDiv);

};

/**
 * 当前环节信息区<br>
 * 
 * @param opts
 *            参数
 */
BPM.ActivitySelector.genActivitySelectorDialog_curActivityInfoDiv = function(opts) {
	var taskBean = opts.taskBean;

	// 主容器
	var $curActivityInfoDiv = $("<DIV>");
	$curActivityInfoDiv.attr("id", opts.activitySelectorCurActivityInfoDivId);
	$curActivityInfoDiv.attr("class", "CurActivityInfoDiv");

	// 当前环节-图片
	var $curActivityInfoDivImg = $("<A>");
	$curActivityInfoDivImg.attr("href", "javascript:void(0)");
	$curActivityInfoDivImg.attr("class", "CurActivityInfoDivImg");
	$curActivityInfoDiv.append($curActivityInfoDivImg);

	// 当前环节名字-标签
	var $curActivityInfoDivCurActivityNameLabel = $("<LABEL>");
	$curActivityInfoDivCurActivityNameLabel.attr("class", "CurActivityNameLabel");
	$curActivityInfoDivCurActivityNameLabel.html("当前环节：");
	$curActivityInfoDiv.append($curActivityInfoDivCurActivityNameLabel);

	// 当前环节名字-热点
	var $curActivityInfoDivCurActivityNameLink = $("<A>");
	$curActivityInfoDivCurActivityNameLink.attr("href", "javascript:void(0)");
	$curActivityInfoDivCurActivityNameLink.attr("class", "CurActivityNameLink");
	$curActivityInfoDivCurActivityNameLink.html(taskBean.curActivity.name);
	$curActivityInfoDivCurActivityNameLink.on("click", function() {
		if (taskBean.taskId != -1)
			BPM.showTaskTraceWin(taskBean.taskId);
	});
	$curActivityInfoDiv.append($curActivityInfoDivCurActivityNameLink);

	return $curActivityInfoDiv;
};

/**
 * 当前环节选择区<br>
 * 
 * @param opts
 *            参数
 */
BPM.ActivitySelector.genActivitySelectorDialog_activitySelectDiv = function(opts) {
	var taskBean = opts.taskBean;

	var drivenInfo = opts.drivenInfo;

	// 环节选择区主容器
	var $activitySelectDiv = $("<DIV>");
	$activitySelectDiv.attr("id", opts.activitySelectorActivitySelectDivId);
	$activitySelectDiv.attr("class", "ActivitySelectDiv");

	$(drivenInfo.nextActivities).each(function(index, drivenActivityInfo) {
		// var activityBean = taskBean.nextPassableActivities[index];

		var curActivitySelectListId = "ActivitySelectList_" + drivenActivityInfo.groupId;
		// var $curActivitySelectList = $("#" + curActivitySelectListId);
		$curActivitySelectList = $activitySelectDiv.find("#" + curActivitySelectListId);

		// 如果环节选择组不存在，则生成一个空组
		if (!$activitySelectDiv.find("#" + curActivitySelectListId).get(0)) {
			// if
			// (!BPM.ActivitySelector.isActivitySelectGroupExists(curActivitySelectListId))
			// {
			var $activitySelectGroup = BPM.ActivitySelector.genActivitySelectGroupDiv(drivenActivityInfo);
			$curActivitySelectList = $activitySelectGroup.find("#" + curActivitySelectListId);
			$activitySelectDiv.append($activitySelectGroup);
		}

		$curActivitySelectList.append(BPM.ActivitySelector.genActivitySelectList(drivenActivityInfo));
	});

	return $activitySelectDiv;
};
/**
 * 判断环节选择组是否已存在<br>
 * 
 * @param opts
 *            参数
 */
BPM.ActivitySelector.isActivitySelectGroupExists = function(groupId) {
	var $activitySelectGroup = $("#" + groupId);
	if (!$activitySelectGroup.get(0))
		return false;
	else
		return true;
};

/**
 * 生成环节选择组<br>
 * 
 * @param taskBean
 *            任务实例
 * @param activityBean
 *            环节实例
 */
BPM.ActivitySelector.genActivitySelectGroupDiv = function(drivenActivityInfo) {
	var groupId = "ActivitySelectGroupDiv_" + drivenActivityInfo.groupId;
	var curGroupName = drivenActivityInfo.groupName;

	// 环节选择组容器
	var $activitySelectGroupDiv = $("<DIV>");
	$activitySelectGroupDiv.attr("id", groupId);
	$activitySelectGroupDiv.attr("class", "ActivitySelectGroupDiv");

	// 环节选择组标题信息表格
	var groupTitleListId = "ActivitySelectGroupTitleList_" + drivenActivityInfo.groupId;
	var $activitySelectGroupTitleTable = $("<TABLE>");
	$activitySelectGroupTitleTable.attr("id", groupTitleListId);
	$activitySelectGroupTitleTable.attr("class", "ActivitySelectGroupTitleTable");
	$activitySelectGroupDiv.append($activitySelectGroupTitleTable);

	var $activitySelectGroupTitleTableTr = $("<TR>");
	$activitySelectGroupTitleTable.append($activitySelectGroupTitleTableTr);

	// 环节组>图片TD
	var $activitySelectGroupTitleTableTrImgTd = $("<TD>");
	$activitySelectGroupTitleTableTrImgTd.attr("class", "TitleTableTrImgTd");
	$activitySelectGroupTitleTableTr.append($activitySelectGroupTitleTableTrImgTd);

	// 环节组>图片TD>图片
	var $activitySelectGroupTitleTableTrImgTdImageLink = $("<A>");
	$activitySelectGroupTitleTableTrImgTdImageLink.attr("href", "javascript:void(0);");
	$activitySelectGroupTitleTableTrImgTdImageLink.attr("class", "btn_arrow_right");
	$activitySelectGroupTitleTableTrImgTd.append($activitySelectGroupTitleTableTrImgTdImageLink);

	// 环节组>环节复选框TD
	var $activitySelectGroupTitleTableTrCheckBoxTd = $("<TD>");
	$activitySelectGroupTitleTableTrCheckBoxTd.attr("class", "TitleTableTrCheckBoxTd");
	$activitySelectGroupTitleTableTr.append($activitySelectGroupTitleTableTrCheckBoxTd);

	// 环节组>环节复选框TD>复选框
	var $activitySelectGroupTitleTableTrCheckBoxTdCheckBox = $("<INPUT>");
	$activitySelectGroupTitleTableTrCheckBoxTdCheckBox.attr("type", "checkbox");
	$activitySelectGroupTitleTableTrCheckBoxTdCheckBox.attr("name", "actGroup_" + drivenActivityInfo.groupId);

	// 环节组>环节名称TD
	var $activitySelectGroupTitleTableTrGroupNameTd = $("<TD>");
	$activitySelectGroupTitleTableTrGroupNameTd.html(curGroupName);
	$activitySelectGroupTitleTableTr.append($activitySelectGroupTitleTableTrGroupNameTd);

	if (drivenActivityInfo.required == true) {
		$activitySelectGroupTitleTableTrCheckBoxTdCheckBox.attr("checked", "checked");
		$activitySelectGroupTitleTableTrCheckBoxTdCheckBox.attr("disabled", "true");
	} else {
		$activitySelectGroupTitleTableTrGroupNameTd.on("click", function() {
			$.each($(this).prev().find("input[type=checkbox]"), function(index) {
				$checkBox = $(this);
				if ($activitySelectGroupTitleTableTrCheckBoxTdCheckBox.attr("checked") == "checked")
					$activitySelectGroupTitleTableTrCheckBoxTdCheckBox.removeAttr("checked");
				else
					$activitySelectGroupTitleTableTrCheckBoxTdCheckBox.attr("checked", "checked");
			});
		});
	}
	$activitySelectGroupTitleTableTrCheckBoxTd.append($activitySelectGroupTitleTableTrCheckBoxTdCheckBox);

	// 环节选择组标题信息表格
	var activitySelectListId = "ActivitySelectList_" + drivenActivityInfo.groupId;
	var $activitySelectListTable = $("<TABLE>");
	$activitySelectListTable.attr("id", activitySelectListId);
	$activitySelectListTable.attr("class", "ActivitySelectListTable");
	$activitySelectGroupDiv.append($activitySelectListTable);

	return $activitySelectGroupDiv;

};

/**
 * 生成环节选择列表<br>
 * 该方法返回一个包含可选环节信息的TR
 * 
 * @param taskBean
 *            任务实例
 * @param activityBean
 *            环节实例
 */
BPM.ActivitySelector.genActivitySelectList = function(drivenActivityInfo) {
	// var drivenActivityInfo;

	// 环节选择主容器，TR
	var $selectListTr = $("<TR>");

	// 环节选择-复选框TD
	var $activitySelectCheckboxTd = $("<TD>");
	$activitySelectCheckboxTd.attr("class", "ActivitySelectCheckboxTd");
	$selectListTr.append($activitySelectCheckboxTd);

	// 环节选择-复选框
	var actId = "act_" + drivenActivityInfo.id;
	var actGroupId = "actGroup_" + drivenActivityInfo.groupId;
	var $activitySelectCheckbox = $("<INPUT>");
	$activitySelectCheckbox.attr("id", actId);
	$activitySelectCheckbox.attr("name", actGroupId);
	$activitySelectCheckbox.attr("type", "radio");
	$activitySelectCheckbox.attr("class", "ACTIVITY_SELECTOR");
	$activitySelectCheckbox.attr("activityId", drivenActivityInfo.id);
	$activitySelectCheckbox.attr("activityName", drivenActivityInfo.name);
	$activitySelectCheckboxTd.append($activitySelectCheckbox);

	// 环节选择-来自路径名称TD
	var $activitySelectFromTransitionNameTd = $("<TD>");
	$activitySelectFromTransitionNameTd.attr("class", "ActivitySelectFromTransitionNameTd");
	$selectListTr.append($activitySelectFromTransitionNameTd);

	// 环节选择-来自路径名称
	var $activitySelectFromTransitionName = $("<LABEL>");
	$activitySelectFromTransitionName.html(drivenActivityInfo.fromTransitionName);
	$activitySelectFromTransitionNameTd.append($activitySelectFromTransitionName);

	// 环节选择-去往路径图片TD
	var $activitySelectToTransitionImageTd = $("<TD>");
	$activitySelectToTransitionImageTd.attr("class", "ActivitySelectToTransitionImageTd");
	$selectListTr.append($activitySelectToTransitionImageTd);

	// 环节选择-去往路径图片
	var $activitySelectToTransitionImageLink = $("<A>");
	$activitySelectToTransitionImageLink.attr("href", "javascript:void(0);");
	$activitySelectToTransitionImageLink.attr("class", "btn_arrow_right");
	$activitySelectToTransitionImageTd.append($activitySelectToTransitionImageLink);

	// 环节选择-去往环节名称TD
	var $activitySelectToActivityNameTd = $("<TD>");
	$activitySelectToActivityNameTd.attr("class", "ActivitySelectToActivityNameTd");
	$selectListTr.append($activitySelectToActivityNameTd);

	// 环节选择-去往环节名字
	var $activitySelectToActivityName = $("<LABEL>");
	$activitySelectToActivityName.html(drivenActivityInfo.name);
	$activitySelectToActivityNameTd.append($activitySelectToActivityName);

	// 如果这个环节不是userTask类型，则不需要显示选人的信息
	if ("userTask" == drivenActivityInfo.type) {
		// 环节选择-已选责任人TD
		var $activitySelectSelectedAssigneeTd = $("<TD>");
		$activitySelectSelectedAssigneeTd.attr("class", "ActivitySelectSelectedAssigneeTd");
		$activitySelectSelectedAssigneeTd.append("<div style='border-bottom: solid 1px #A6C9E2;min-height: 25px;'>"
				+ "<span style='width:50px;font-weight: bold;'>处理人：</span>"
				+ "<span class='Activity_Assignees_Name_Span'></span>"
				+ "<span class='Activity_Assignees_Id_Span' style='display: none;'></span>"
				+ "<span class='Activity_Assignees_Info_Span' style='display: none;'></span></div>"
				+ "<div style='min-height: 25px;'><span style='width:50px;font-weight: bold;'>抄送人：</span>"
				+ "<span class='Activity_Copies_Name_Span'></span>"
				+ "<span class='Activity_Copies_Id_Span' style='display: none;'></span></div>");

		// 写入预定义的人员
		try {
			var _tmp_ids = "", _tmp_names = "";
			$(drivenActivityInfo.preSetAssignees).each(function(i, n) {
				if (i > 0) {
					_tmp_ids += ",";
					_tmp_names += ",";
				}
				_tmp_ids += n["id"];
				_tmp_names += n["name"];
			});
			$activitySelectSelectedAssigneeTd.find(".Activity_Assignees_Name_Span").html(_tmp_names);
			$activitySelectSelectedAssigneeTd.find(".Activity_Assignees_Id_Span").html(_tmp_ids);
		} catch (e) {
		}

		// var $selectInfoFornt = $("<FONT>");
		// $selectInfoFornt.attr("color", "#9C9C9C");
		// $selectInfoFornt.text(activityBean.assignee_selectInfo);
		// $activitySelectSelectedAssigneeTd.append($selectInfoFornt);
		// 检查是否允许选人（需要同时判断是否存在预定义的人员，如果不存在预定义的人员，则允许选人）
		if (drivenActivityInfo.customAssigneeAllowed || drivenActivityInfo.preSetAssignees == undefined
				|| drivenActivityInfo.preSetAssignees.length == 0) {
			$activitySelectSelectedAssigneeTd.on("click", function() {
				var opts = {
					"selectedAssigneeIdsTd" : $(this).find(".Activity_Assignees_Id_Span"),
					"selectedAssigneeTd" : $(this).find(".Activity_Assignees_Name_Span"),
					"selectedAssigneeInfo" : $(this).find(".Activity_Assignees_Info_Span"),
					"selectedCopyIdsTd" : $(this).find(".Activity_Copies_Id_Span"),
					"selectedCopyNamesTd" : $(this).find(".Activity_Copies_Name_Span"),
					// "taskBean":taskBean,
					// "activityBean":activityBean,
					"drivenActivityInfo" : drivenActivityInfo
				};
				BPM.AssigneeSelector.create(opts);
				BPM.AssigneeSelector.showDialog(opts);
			});
		}

		$selectListTr.append($activitySelectSelectedAssigneeTd);
		/*
		 * // 环节选择-已选责任人编号TD var $activitySelectSelectedAssigneeIdsTd = $("<TD>");
		 * $activitySelectSelectedAssigneeIdsTd.attr("class",
		 * "ActivitySelectSelectedAssigneeIdsTd");
		 * $selectListTr.append($activitySelectSelectedAssigneeIdsTd);
		 */

		// 检查是否允许选人（需要同时判断是否存在预定义的人员，如果不存在预定义的人员，则允许选人）
		if (drivenActivityInfo.customAssigneeAllowed || drivenActivityInfo.preSetAssignees == undefined
				|| drivenActivityInfo.preSetAssignees.length == 0) {
			// 环节选择-责任人选择器TD
			var $activitySelectAssigneeSelectorTd = $("<TD>");
			$activitySelectAssigneeSelectorTd.attr("class", "ActivitySelectAssigneeSelectorTd");
			$selectListTr.append($activitySelectAssigneeSelectorTd);

			// 环节选择-责任人选择器
			var $activitySelectAssigneeSelectorLink = $("<A>");
			$activitySelectAssigneeSelectorLink.attr("href", "javascript:void(0);");
			$activitySelectAssigneeSelectorLink.attr("class", "btn_add");
			$activitySelectAssigneeSelectorLink.on("click", function() {
				var opts = {
					"selectedAssigneeIdsTd" : $(this).parent().parent().find(".Activity_Assignees_Id_Span"),
					"selectedAssigneeTd" : $(this).parent().parent().find(".Activity_Assignees_Name_Span"),
					"selectedAssigneeInfo" : $(this).parent().parent().find(".Activity_Assignees_Info_Span"),
					"selectedCopyIdsTd" : $(this).parent().parent().find(".Activity_Copies_Id_Span"),
					"selectedCopyNamesTd" : $(this).parent().parent().find(".Activity_Copies_Name_Span"),
					// "taskBean":taskBean,
					// "activityBean":activityBean,
					"drivenActivityInfo" : drivenActivityInfo
				};
				BPM.AssigneeSelector.create(opts);
				BPM.AssigneeSelector.showDialog(opts);
			});
			$activitySelectAssigneeSelectorTd.append($activitySelectAssigneeSelectorLink);
		} else {
			$activitySelectSelectedAssigneeTd.attr("colspan", "2");
		}
	} else {
		$activitySelectToActivityNameTd.attr("colspan", "3");
	}

	return $selectListTr;
};

/**
 * 从页面上获取所有环节组<br>
 * 如果传入参数groupId，则返回指定的组<br>
 * 如果不传入参数，则返回所有组
 * 
 * @param groupId
 *            直接传activityBean.activity_groupId
 */
BPM.ActivitySelector.getActivityGroups = function(groupId) {

	if (groupId) {
		var activitySelectGroupId = "ActivitySelectGroupDiv_" + groupId;
		return $("DIV[id=" + activitySelectGroupId + "][class='ActivitySelectGroupDiv']");
	} else {
		return $("DIV[class*='ActivitySelectGroupDiv']");
	}
};

/**
 * 为指定组选中第一个环节<br>
 * 如果传入参数groupId，只选中指定组的第一个环节<br>
 * 如果不传入参数，则选中所有组的第一个环节
 * 
 * @param groupId
 *            直接传activityBean.activity_groupId
 */
BPM.ActivitySelector.selectFirstActivity = function(groupId) {
	BPM.ActivitySelector.getActivityGroups(groupId).each(function(index) {
		$(this).find("INPUT[type='radio']").first().attr("checked", "checked");
	});
};
