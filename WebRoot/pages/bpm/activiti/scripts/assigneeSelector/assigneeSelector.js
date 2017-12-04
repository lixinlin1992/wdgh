/**
 * 流程环节选择框生成器<br>
 * 
 * VERSION:0.1<br>
 * ·创建主类：BPM.AssigneeSelector<br>
 * ·创建默认变量：BPM.AssigneeSelector.defaultOptions，责任人选择框生成器默认的全局设置<br>
 * ·创建函数：BPM.AssigneeSelector.create，用于创建环节生成器。<br>
 */

BPM.AssigneeSelector = {
	VERSION : "0.1",
	PROVIDER : "Sunrise",
	AUTHOR : "Cow"
};

/**
 * 责任人选择框生成器默认的全局设置
 */
BPM.AssigneeSelector.defaultOptions = {
	// 调用主方法后，会生成一个ID为AssigneeSelectorDialog的DIV在body的最末端
	// 如果调用主方法时检测到有这个DIV的存在，则清空该DIV的HTML内容重新加载
	assigneeSelectorDialogId : "AssigneeSelectorDialog",
	// 责任人选择框表单id
	assigneeSelectorFormId : "AssigneeSelectorForm",
	// 样式文件路径
	styleFilePath : "pages/bpm/activiti/scripts/assigneeSelector/defaultAssigneeSelectorTheme.css"
};

/**
 * 责任人选择框生成器参数验证方法,主函数的第一次必须是调用该方法<br>
 * 用于验证一些必传的参数及参数的格式是否正确<br>
 * 
 * @param opts
 *            需要验证的参数
 * @returns 是否验证成功
 */
BPM.AssigneeSelector.selectorOptionsValidate = function(opts) {
	if (opts.taskBean == undefined) {
		alert("传入taskBean的值不正确：" + opts.taskBean);
		return false;
	} else if (opts.assigneeBean == undefined) {
		alert("传入assigneeBean的值不正确：" + opts.assigneeBean);
		return false;
	}

	return true;

};

/**
 * 生成选择器主题<br>
 * 
 * @param opts
 *            参数
 */
BPM.AssigneeSelector.genAssigneeSelectTheme = function(opts) {
	var assigneeSelectorThemeId = "assigneeSelectTheme";

	var $head = $("head");
	var $style = $("#" + assigneeSelectorThemeId);

	// 如果样式文件未被导入,则导入一个
	if (!$style.get(0)) {
		$style = $("<LINK>");
	}

	$style.attr("id", assigneeSelectorThemeId);
	$style.attr("href", opts.styleFilePath);
	$style.attr("rel", "stylesheet");
	$style.attr("type", "text/css");

	$head.append($style);
};

/**
 * 以弹出框方式显示责任人选择框<br>
 * 
 * @param opts
 *            参数
 */
BPM.AssigneeSelector.showDialog = function(selectorOptions) {
	var opts = $.extend({}, BPM.AssigneeSelector.defaultOptions, selectorOptions);
	var $assigneeSelectorDialog = $("#" + opts.assigneeSelectorDialogId);

	var assigneeSelectorDialogOptions = {
		title : "环节选择",
		width : "600",
		height : "400",
		modal : true,
		bgiframe : true,
		resizable : true,
		buttons : {
			'取消' : function() {
				$assigneeSelectorDialog.dialog("close");
			},
			'提交' : function() {
				var selectedAssigneeIds = "";
				var selectedAssigneeNames = "";
				var assigneInfos = "";
				$("#AssigneeSelectorSelectedAssigneeList option").each(
						function(index) {
							if (index != 0) {
								selectedAssigneeIds += ",  ";
								selectedAssigneeNames += ",  ";
								assigneInfos += ",";
							}
							selectedAssigneeIds += $(this).val();
							selectedAssigneeNames += $(this).text();
							assigneInfos += "M"
									+ ($(this).attr("main_flag") == undefined ? "0" : $(this).attr("main_flag")) + "B"
									+ ($(this).attr("must_flag") == undefined ? "0" : $(this).attr("must_flag"));
						});

				var _selectCopyIds = "";
				var _selectCopyNames = "";
				$("#_Copy_Selected_List option").each(function(index) {
					_selectCopyIds += (index == 0 ? "" : ",  ") + $(this).val();
					_selectCopyNames += (index == 0 ? "" : ",  ") + $(this).text();
				});

				opts.selectedAssigneeTd.html(selectedAssigneeNames);
				opts.selectedAssigneeIdsTd.html(selectedAssigneeIds);
				opts.selectedAssigneeInfo.html(assigneInfos);
				opts.selectedCopyIdsTd.html(_selectCopyIds);
				opts.selectedCopyNamesTd.html(_selectCopyNames);
				$assigneeSelectorDialog.dialog("close");
			}
		}
	};
	$assigneeSelectorDialog.dialog(assigneeSelectorDialogOptions);
};

/**
 * 责任人选择框生成器主方法<br>
 * 
 * @param selectorOptions
 *            生成器参数
 */
BPM.AssigneeSelector.create = function(selectorOptions) {
	// 如果参数验证不通过，则直接跳出
	if (!BPM.AssigneeSelector.selectorOptionsValidate)
		return;

	// 传入参数与默认参数整合
	var opts = $.extend({}, BPM.AssigneeSelector.defaultOptions, selectorOptions);

	// 生成对话框元素
	BPM.AssigneeSelector.genAssigneeSelectorDialog(opts);
};

/**
 * 生成环节选择框<br>
 * ·在body末端生成一个Div为根容器<br>
 * ·在根窗口下添加各种HTML元素<br>
 * 
 * @param opts
 *            参数
 */
BPM.AssigneeSelector.genAssigneeSelectorDialog = function(opts) {

	// 生成选择器主题
	// BPM.AssigneeSelector.genAssigneeSelectTheme(opts);

	var $body = $("body");

	// 初始化根容器
	var $assigneeSelectorDialog = $("#" + opts.assigneeSelectorDialogId);
	if ($assigneeSelectorDialog.get(0)) {
		// 把根容器的内容清空
		$assigneeSelectorDialog.empty();
	} else {
		$assigneeSelectorDialog = $("<DIV>");
		$assigneeSelectorDialog.attr("id", opts.assigneeSelectorDialogId);
		$assigneeSelectorDialog.css("display", "none");
		$assigneeSelectorDialog.attr("class", "AssigneeSelectorDialog");
		$body.append($assigneeSelectorDialog);
	}
	// 表单
	var $selectorDialogForm = $("<FORM>");
	$selectorDialogForm.attr("id", opts.assigneeSelectorFormId);
	$selectorDialogForm.attr("class", "AssigneeSelectorDialogForm");
	$assigneeSelectorDialog.append($selectorDialogForm);

	BPM.AssigneeSelector.genAssigneeSelectorArea(opts);
	BPM.AssigneeSelector.genAssigneeSelectorView(opts);
};

/**
 * 生成责任人选择区(主区域)<br>
 * 
 * @param opts
 *            参数
 */
BPM.AssigneeSelector.genAssigneeSelectorArea = function(opts) {
	$assigneeSelectorArea = $("<TABLE>");
	$assigneeSelectorArea.attr("class", "AssigneeSelectorArea");

	// 第一行
	var $tr_1 = $("<TR>");
	$assigneeSelectorArea.append($tr_1);

	var $selectorViewTd = $("<TD>");
	$selectorViewTd.attr("class", "SelectorViewTd");
	$selectorViewTd.attr("colspan", "2");
	$tr_1.append($selectorViewTd);

	var $assigneeSelectorOperTd = $("<TD>");
	$assigneeSelectorOperTd.attr("class", "AssigneeSelectorOperTd");
	$assigneeSelectorOperTd.attr("rowspan", "2");
	$tr_1.append($assigneeSelectorOperTd);

	var $selectedAssigneeListTd = $("<TD>");
	$selectedAssigneeListTd.attr("class", "SelectedAssigneeListTd");
	$selectedAssigneeListTd.attr("valign", "top");
	$selectedAssigneeListTd.attr("rowspan", "2");
	$tr_1.append($selectedAssigneeListTd);

	// 处理人选择和抄送人选择
	$selectedAssigneeListTd.append("<table border='0' height='100%'>" + "<tr><td colspan='2'>已选处理人</td></tr>" + "<tr>"
			+ "   <td class='Selected_Assignee_Td'></td>" + "   <td class='Selected_Assignee_Option_Td'>"
			+ "       <label><input type='checkbox' id='Main_Flag_CheckBox'>主办</label>" + "       <br>"
			+ "       <label><input type='checkbox' id='Must_Flag_CheckBox'>必办</label>" + "   </td>" + "</tr>"
			+ "<tr><td colspan='2'>已选抄送人</td></tr>" + "<tr>" + "   <td class='Selected_Copy_Td'></td>"
			+ "   <td class='Selected_Copy_Option_Td'></td>" + "</tr>" + "</table>");

	// 添加主办和必办的事件处理
	$selectedAssigneeListTd.find("#Main_Flag_CheckBox").on("click", function() {
		BPM.AssigneeSelector.setMainAssignee();
	});
	$selectedAssigneeListTd.find("#Must_Flag_CheckBox").on("click", function() {
		BPM.AssigneeSelector.setMustAssignee();
	});

	// 第二行
	var $tr_2 = $("<TR>");
	$assigneeSelectorArea.append($tr_2);

	var $selectorOrgTd = $("<TD>");
	$selectorOrgTd.attr("class", "SelectorOrgTd");
	$selectorOrgTd.attr("valign", "top");
	$tr_2.append($selectorOrgTd);

	var $selectorUserListTd = $("<TD>");
	$selectorUserListTd.attr("class", "SelectorUserListTd");
	$tr_2.append($selectorUserListTd);

	var $assigneeSelectorDialog = $("#" + opts.assigneeSelectorDialogId);
	$assigneeSelectorDialog.find("form[class='AssigneeSelectorDialogForm']").append($assigneeSelectorArea);
};

/**
 * 生成责任人选择视图<br>
 * 
 * @param opts
 *            参数
 */
BPM.AssigneeSelector.genAssigneeSelectorView = function(opts) {

	BPM.getAssigneeSelectorViewList(function(data) {
		var $assigneeSeelectorViewDiv = $("<DIV>");
		$assigneeSeelectorViewDiv.attr("class", "AssigneeSeelectorViewDiv");
		var $assigneeSelectorDialog = $("#" + opts.assigneeSelectorDialogId);
		$assigneeSelectorDialog.find("TD[class='SelectorViewTd']").append($assigneeSeelectorViewDiv);
		$(data).each(function(index) {
			var view = data[index];

			var $option = $("<A>");
			$option.attr("class", "AssigneeSeelectorViewLink");
			$option.attr("href", "javascript:void(0)");
			$option.html(view.selectorName);
			$option.on("click", function() {
				BPM.AssigneeSelector.genAssigneeSelectorOrg(view, opts);
				BPM.AssigneeSelector.genAssigneeSelectorUser(view, opts);
				BPM.AssigneeSelector.genAssigneeSelectorOper(view, opts);
				BPM.AssigneeSelector.genAssigneeSelectorSelectedAssigneeList(view, opts);
			});
			$assigneeSeelectorViewDiv.append($option);

			// 当遍历第一个视图时，生成该视图的数据
			if (index == 0) {
				BPM.AssigneeSelector.genAssigneeSelectorOrg(view, opts);
				BPM.AssigneeSelector.genAssigneeSelectorUser(view, opts);
				BPM.AssigneeSelector.genAssigneeSelectorOper(view, opts);
				BPM.AssigneeSelector.genAssigneeSelectorSelectedAssigneeList(view, opts);
			}
		});

	});
};

/**
 * 生成结构选择数据<br>
 * 
 * @param view
 *            需要生成数据的视图
 * @param opts
 *            参数
 */
BPM.AssigneeSelector.genAssigneeSelectorOrg = function(view, opts) {
	if (view.orgShowType == 'list') {
		BPM.AssigneeSelector.genAssigneeSelectorOrgList(view, opts);
	} else if (view.orgShowType == 'tree') {
		BPM.AssigneeSelector.genAssigneeSelectorOrgTree(view, opts);
	}
};

/**
 * 生成结构选择数据-列表结构<br>
 * 
 * @param view
 *            需要生成数据的视图
 * @param opts
 *            参数
 */
BPM.AssigneeSelector.genAssigneeSelectorOrgList = function(view, opts) {
	var $orgDiv = $("<DIV>");
	$orgDiv.attr("id", "orgDiv_" + view.selectorCode);
	$orgDiv.attr("class", "AssigneeSelectorOrgDiv");
	var $orgTable = $("<TABLE>");
	$orgTable.attr("class", "AssigneeSelectorOrgList");
	$orgDiv.append($orgTable);
	var $assigneeSelectorDialog = $("#" + opts.assigneeSelectorDialogId);
	$assigneeSelectorDialog.find("TD[class='SelectorOrgTd']").empty().append($orgDiv);

	CORE.request(view.orgListDS, {
		data : ""
	}, function(data) {
		$(data.rows).each(function(index) {
			var orgId = data.rows[index].cell[0];
			var orgName = data.rows[index].cell[1];
			var $tr = $("<TR>");
			$orgTable.append($tr);
			var $td = $("<TD>");
			$td.on("click", function() {
				opts.orgId = orgId;
				BPM.AssigneeSelector.genAssigneeSelectorUser(view, opts);
				$assigneeSelectorDialog.find("TD[class='SelectorOrgTdSelected']").removeClass("SelectorOrgTdSelected");
				$td.addClass("SelectorOrgTdSelected");
			});
			$tr.append($td);
			$td.html(orgName);
		});

	});

};

/**
 * 生成结构选择数据-树型结构<br>
 * 
 * @param view
 *            需要生成数据的视图
 * @param opts
 *            参数
 */
BPM.AssigneeSelector.genAssigneeSelectorOrgTree = function(view, opts) {
	var $orgDiv = $("<DIV>");
	$orgDiv.attr("id", "orgDiv_" + view.selectorCode);
	$orgDiv.css("border", "1px solid #A6C9E2");
	$orgDiv.attr("class", "tree").css("height", "240px").css("overflow", "auto");
	var $assigneeSelectorDialog = $("#" + opts.assigneeSelectorDialogId);
	$assigneeSelectorDialog.find("TD[class='SelectorOrgTd']").empty().append($orgDiv);
	orgTree = new ZTree($orgDiv.attr("id"), view.orgTreeDS, {
		async : "false",
		nodeClicked : function(event, treeId, treeNode) {
			opts.orgId = treeNode.id;
			BPM.AssigneeSelector.genAssigneeSelectorUser(view, opts);
		}
	});

};

/**
 * 生成用户选择数据<br>
 * 
 * @param view
 *            需要生成数据的视图
 * @param opts
 *            参数
 */
BPM.AssigneeSelector.genAssigneeSelectorUser = function(view, opts) {
	if (view.userShowType = 'list') {
		// 目前树结构跟列表结构的显示方式一样，所以都是调用 genAssigneeSelectorUserList
		BPM.AssigneeSelector.genAssigneeSelectorUserList(view, opts);
	} else if (view.orgShowType = 'tree') {
		// 目前树结构跟列表结构的显示方式一样，所以都是调用 genAssigneeSelectorUserList
		BPM.AssigneeSelector.genAssigneeSelectorUserList(view, opts);
	}

};

/**
 * 生成用户选择数据-列表结构<br>
 * 
 * @param view
 *            需要生成数据的视图
 * @param opts
 *            参数
 */
BPM.AssigneeSelector.genAssigneeSelectorUserList = function(view, opts) {
	var $userListSelector = $("<SELECT>");
	$userListSelector.attr("id", "AssigneeSelectorUserSelector");
	$userListSelector.attr("multiple", "multiple");
	$userListSelector.attr("class", "AssigneeSelectorUserSelector");
	var $assigneeSelectorDialog = $("#" + opts.assigneeSelectorDialogId);
	$assigneeSelectorDialog.find("TD[class='SelectorUserListTd']").empty().append($userListSelector);

	$userListSelector.on("dblclick", function() {
		$userListSelector.copySelectedTo("#AssigneeSelectorSelectedAssigneeList", function(o, n) {
			$(n).attr("name", $(n).text());
			return true;
		});
	});

	CORE.request(view.userListDS, {
		data : (opts.orgId != undefined) ? "orgId=" + opts.orgId : ""
	}, function(data) {
		$(data.rows).each(function(index) {
			var orgId = data.rows[index].cell[0];
			var orgName = data.rows[index].cell[1];
			var $option = $("<OPTION>");
			$option.attr("value", orgId);
			$option.html(orgName);
			$userListSelector.append($option);

		});

	});

};

/**
 * 用户列表操作器<br>
 * 
 * @param view
 *            需要生成数据的视图
 * @param opts
 *            参数
 */
BPM.AssigneeSelector.genAssigneeSelectorOper = function(view, opts) {

	// var activityBean = opts.activityBean;
	var drivenActivityInfo = opts.drivenActivityInfo;

	var $assigneeSelectorOper = $("<DIV>");
	$assigneeSelectorOper.attr("class", "AssigneeSelectorOper");
	var $assigneeSelectorDialog = $("#" + opts.assigneeSelectorDialogId);
	$assigneeSelectorDialog.find("TD[class='AssigneeSelectorOperTd']").empty().append($assigneeSelectorOper);

	var $selectAssigneeBtn = $("<A id='assigneeAddBtn' href='javascript:void(0);' class='btn_arrow_right' title='选择处理人员'>");
	$selectAssigneeBtn.on("click", function() {

		var maxSelectCount = drivenActivityInfo.maxAssigneeCount;

		var selectedAssigneeCount = $("#AssigneeSelectorSelectedAssigneeList option").length;
		$("#AssigneeSelectorUserSelector").copySelectedTo("#AssigneeSelectorSelectedAssigneeList", function(o, n) {
			// 在这里进行人数校验即可
			// 如果已经选作了抄送人，则不能作为经办人
			if ($("#_Copy_Selected_List option[value='" + $(n).val() + "']").length > 0) {
				CORE.tip("[" + $(n).text() + "] 已经被算作任务抄送人，不能进行任务处理");
				return false;
			} else {
				n.attr("name", n.text());
				return true;
			}
		});

		// $("#AssigneeSelectorUserSelector option:selected").each(function
		// (index) {
		//
		// if (!$("#AssigneeSelectorSelectedAssigneeList option[value='" +
		// $(this).val() + "']").get(0)) {
		// var $option = $("<OPTION>");
		// $option.val($(this).val());
		// $option.html($(this).text());
		// $("#AssigneeSelectorSelectedAssigneeList").append($option);
		// selectedAssigneeCount++;
		//
		// // 当最大人数等于当前选择人数时，则跳出循环不再添加
		// /* kinz 2012-11-13 先不限制选人数量
		// if (maxSelectCount == selectedAssigneeCount) {
		// $("#assigneeAddBtn").hide();
		// CORE.tip("环节“" + activityBean.name + "”最多只能选择“" + maxSelectCount +
		// "”个处理人");
		// return false;
		// }
		// */
		// } else {
		// }
		// });
	});
	$assigneeSelectorOper.append($selectAssigneeBtn);

	var $removeSelectedAssigneeBtn = $("<A id='assigneeRemoveBtn' href='javascript:void(0);' class='btn_arrow_left' title='删除已选择的处理人员'>");
	$removeSelectedAssigneeBtn.on("click", function() {

		if ($("#AssigneeSelectorSelectedAssigneeList option:selected").length < 1) {
			CORE.tip("请选择需要删除的处理人");
			return false;
		}

		var selectedAssigneeCount = $("#AssigneeSelectorSelectedAssigneeList option").length;
		var maxSelectCount = drivenActivityInfo.maxAssigneeCount;

		$("#AssigneeSelectorSelectedAssigneeList option:selected").each(function() {
			$(this).remove();
			selectedAssigneeCount--;
		});

		if (maxSelectCount > selectedAssigneeCount) {
			$("#assigneeAddBtn").show();
		}
	});
	$assigneeSelectorOper.append($removeSelectedAssigneeBtn);

	$assigneeSelectorOper.append("<div style='height: 80px;'></div>");

	// 选择抄送用户
	$selectCopyBtn = $("<A id='copySelectBtn' href='javascript:void(0);' class='btn_arrow_right' title='选择要抄送的用户'>");
	$selectCopyBtn.on("click", function() {
		$("#AssigneeSelectorUserSelector").copySelectedTo("#_Copy_Selected_List", function(o, n) {
			// 如果已经选作了处理人，则不能作为抄送人
			if ($("#AssigneeSelectorSelectedAssigneeList option[value='" + $(n).val() + "']").length > 0) {
				CORE.tip("[" + $(n).text() + "] 已经被算作任务处理人，不能进行抄送");
				return false;
			} else {
				return true;
			}
		});
	});
	$assigneeSelectorOper.append($selectCopyBtn);

	// 删除抄送用户
	$removeCopyBtn = $("<A id='copySelectBtn' href='javascript:void(0);' class='btn_arrow_left' title='删除已选择的抄送用户'>");
	$removeCopyBtn.on("click", function() {
		$("#_Copy_Selected_List option:selected").each(function() {
			$(this).remove();
		});
	});
	$assigneeSelectorOper.append($removeCopyBtn);
};
/**
 * 已经选择用户列表<br>
 * 
 * @param view
 *            需要生成数据的视图
 * @param opts
 *            参数
 */
BPM.AssigneeSelector.genAssigneeSelectorSelectedAssigneeList = function(view, opts) {
	var $selectedUserListSelector = $("<SELECT>");
	$selectedUserListSelector.attr("id", "AssigneeSelectorSelectedAssigneeList");
	$selectedUserListSelector.attr("multiple", "multiple");
	$selectedUserListSelector.attr("class", "AssigneeSelectorSelectedAssigneeList");
	if (opts.selectedAssigneeIdsTd.html().trim() != "") {
		var selectedAssigneeIds = opts.selectedAssigneeIdsTd.html().trim().split(",");
		var selectedAssigneeNames = opts.selectedAssigneeTd.html().trim().split(",");
		var selectedAssigneeInfos = opts.selectedAssigneeInfo.html().trim().split(",");
		$(selectedAssigneeIds).each(function(index) {
			var $option = $("<OPTION>");
			$option.val(selectedAssigneeIds[index]);
			$option.text(selectedAssigneeNames[index]);
			$option.attr("name", $option.text());
			if (selectedAssigneeInfos.length > index) {
				if (selectedAssigneeInfos[index].indexOf("M1") == 0) {
					$option.attr("name", $option.text().replace(" [主办]", ""));
					$option.attr("main_flag", "1");
				} else {
					$option.attr("main_flag", "0");
				}
				if (selectedAssigneeInfos[index].indexOf("B1") == 2) {
					$option.attr("name", $option.text().replace(" [必办]", ""));
					$option.attr("must_flag", "1");
				} else {
					$option.attr("must_flag", "0");
				}
			}
			$selectedUserListSelector.append($option);
		});
	}
	var $assigneeSelectorDialog = $("#" + opts.assigneeSelectorDialogId);
	// $assigneeSelectorDialog.find("TD[class='SelectedAssigneeListTd']").empty().append($selectedUserListSelector);
	$assigneeSelectorDialog.find("TD[class='Selected_Assignee_Td']").empty().append($selectedUserListSelector);

	// 双击事件，双击将删除人员
	$selectedUserListSelector.on("dblclick", function() {
		$selectedUserListSelector.find("option:selected").remove();
	});
	// 选择变更事件，更新主办人和必办人
	$selectedUserListSelector.on("change", function() {
		BPM.AssigneeSelector.updateAssigneeInfo();
	});

	// 添加抄送人的选择框
	var $selectedCopySelector = $("<select id='_Copy_Selected_List' multiple='multiple' class='Copy_Selected_List'></select>");
	if (opts.selectedCopyIdsTd.html().trim() != "") {
		var selectedCopyIds = opts.selectedCopyIdsTd.html().trim().split(",");
		var selectedCopyNames = opts.selectedCopyNamesTd.html().trim().split(",");
		$(selectedCopyIds).each(function(index) {
			var $option = $("<OPTION>");
			$option.val(selectedCopyIds[index]);
			$option.text(selectedCopyNames[index]);
			$selectedCopySelector.append($option);
		});
	}
	$assigneeSelectorDialog.find("TD[class='Selected_Copy_Td']").empty().append($selectedCopySelector);
	$selectedCopySelector.on("dblclick", function() {
		$selectedCopySelector.find("option:selected").remove();
	});
};

/**
 * 更新处理人员的相关信息 1. 主办的checkbox 2. 必办的checkbox
 */
BPM.AssigneeSelector.updateAssigneeInfo = function() {
	var $cur_assignee = $("#AssigneeSelectorSelectedAssigneeList option:selected");

	var $mfcb_1 = $("#Main_Flag_CheckBox");
	var $mfcb_2 = $("#Must_Flag_CheckBox");

	if ($cur_assignee.length == 0) {
		$mfcb_1.attr("disabled", "disabled");
		$mfcb_2.attr("disabled", "disabled");
		$mfcb_1.removeAttr("checked");
		$mfcb_2.removeAttr("checked");
	} else if ($cur_assignee.length > 1) {
		$mfcb_1.attr("disabled", "disabled");
		$mfcb_1.removeAttr("checked");
		$mfcb_2.removeAttr("disabled");
		$mfcb_2.removeAttr("checked");
	} else {
		$mfcb_1.removeAttr("disabled");
		$mfcb_2.removeAttr("disabled");
		if ($cur_assignee.attr("main_flag") == "1") {
			$mfcb_1.attr("checked", "checked");
			$mfcb_2.attr("disabled", "disabled");
			$mfcb_2.removeAttr("checked");
		} else {
			$mfcb_1.removeAttr("checked");
			$mfcb_2.removeAttr("disabled");

			if ($cur_assignee.attr("must_flag") == "1") {
				$mfcb_2.attr("checked", "checked");
			} else {
				$mfcb_2.removeAttr("checked");
			}
		}
	}
};

/**
 * 将当前选中的人员设置为主办人员。 处理逻辑 1. 如果checkbox当前是 选中-〉取消 状态，则询问是否取消 2. 取消时将当前的option属性去除
 * 3. 如果checkbox当前不是 选中-〉取消 状态，则检查当前是否已经设置了主办人 4.
 * 如果已经设置了主办人，则询问用户是否取消之前的主办人设置，不取消就退出，取消就继续 5.
 * 将设置主办的option主办人属性去除，并将当前的option设置主办人属性
 */
BPM.AssigneeSelector.setMainAssignee = function() {
	var $mfcb_ = $("#Main_Flag_CheckBox");
	if ("checked" == $mfcb_.attr("checked")) {
		if ($("#AssigneeSelectorSelectedAssigneeList option:selected").length > 1) {
			CORE.infoDlg({
				title : "提示",
				message : "只能设置一个主办人"
			});
			$mfcb_.removeAttr("checked");
			return;
		}
		// 检查是否已经设置了主办人
		var $cur_main_assignee = $("#AssigneeSelectorSelectedAssigneeList option[main_flag='1']");
		if ($cur_main_assignee.length > 0) {
			CORE.infoDlg({
				title : "设置主办人",
				message : "当前已经设置了[" + $cur_main_assignee.attr("name") + "]作为主办人，确定要替换主办人吗？",
				buttons : {
					"取消" : function() {
						$mfcb_.removeAttr("checked");
					},
					"确定" : function() {
						$cur_main_assignee.attr("main_flag", "0");
						$cur_main_assignee.text($cur_main_assignee.attr("name"));
						var $cur_assignee = $("#AssigneeSelectorSelectedAssigneeList option:selected");
						$cur_assignee.attr("main_flag", "1");
						$cur_assignee.text($cur_assignee.attr("name") + " [主办]");
						BPM.AssigneeSelector.updateAssigneeInfo();
					}
				}
			});
		} else {
			// 直接设置
			var $cur_assignee = $("#AssigneeSelectorSelectedAssigneeList option:selected");
			$cur_assignee.attr("main_flag", "1");
			$cur_assignee.text($cur_assignee.attr("name") + " [主办]");
			BPM.AssigneeSelector.updateAssigneeInfo();
		}
	} else {
		// 询问是否取消主办人
		CORE.infoDlg({
			title : "撤销主办人",
			message : "确定要取消主办人吗？",
			buttons : {
				"取消" : function() {
				},
				"确定" : function() {
					var $cur_assignee = $("#AssigneeSelectorSelectedAssigneeList option:selected");
					$cur_assignee.attr("main_flag", "0");
					$cur_assignee.text($cur_assignee.attr("name"));
					BPM.AssigneeSelector.updateAssigneeInfo();
				}
			}
		});
	}
};

/**
 * 将当前选中的人员设置为必办人员 必办人的逻辑 1. 如果checkbox当前是 选中-〉取消 状态，则询问是否取消 2.
 * 取消时将当前option的必办属性去除 3. 如果checkbox当前不是 选中-〉取消 状态，则设置当前option的必办人属性
 */
BPM.AssigneeSelector.setMustAssignee = function() {
	var $mfcb_ = $("#Must_Flag_CheckBox");
	$("#AssigneeSelectorSelectedAssigneeList option:selected").each(function(i, n) {
		if ("checked" == $mfcb_.attr("checked")) {
			$(n).attr("must_flag", "1");
			$(n).text($(n).attr("name") + " [必办]");
		} else {
			$(n).attr("must_flag", "0");
			$(n).text($(n).attr("name"));
		}
	});
	// BPM.AssigneeSelector.updateAssigneeInfo();
};