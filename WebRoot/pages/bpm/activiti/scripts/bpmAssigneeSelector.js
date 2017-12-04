(function($) {
	$.fn.bpmAssigneeSelector = function(taskBean, activity) {
		if (!taskBean || !activity) {
			CORE.info("没有传入taskBean或activity");
			return;
		}

		var genAssigneeSelectTypeHtml = function(taskBean, activity) {
			var html = "";
			html += "<td>";
			html += "</td>";
			return html;
		};

		var genAssigneeSelectorForm = function(taskBean, activity) {

			var formId = "assigneeSelectorForm" + activity.id;
			var $selector = $("#bpmAssigneeSelectorDialog_" + activity.id);

			var html = "";
			html += "<form id='" + formId + "' class='bpmAssigneeSelectorForm'>";
			html += "<table class='bpmAssigneeSelectorTable'>";
			html += "<tr>";
			html += genAssigneeSelectTypeHtml(taskBean, activity);
			html += "<td>";
			html += "</td>";
			html += "</tr>";
			html += "<tr>";
			html += "<td>";
			html += "</td>";
			html += "<td>";
			html += "</td>";
			html += "</tr>";
			html += "</table>";
			html += "</form>";
			$selector.html(html);
		};

		genAssigneeSelectorForm(taskBean, activity);
	};
})(jQuery);