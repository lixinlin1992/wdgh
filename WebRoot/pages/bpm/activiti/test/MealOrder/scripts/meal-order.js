function getMenuList() {
	CORE.request("DS_GET_MENU_LIST", {
		data : null
	}, function(data) {
		$(data.rows).each(function(index) {
			var menuName = data.rows[index].cell[0];
			var menuItem = "<a class='MenuItem' href='javascript:void(0);'>" + menuName + "</a>";
			$("#MenuList").append(menuItem);
		});

	});
}