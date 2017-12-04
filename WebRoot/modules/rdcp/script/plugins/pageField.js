/**
 * User: kevin
 * Date: 2011-12-27
 * Time: 下午15:37
 * 页面选择器
 * 依赖于 rdcp.js 和 propertygrid.js
 */

RDCP.PageSelecter = function() {
};
RDCP.PageSelecter.prototype = {
    getCode:function() {
        return "_page_selecter";
    },
    createEditor:function(grid, p) {
        var _html = "<table style='border: none;width: 100%;height: 100%;padding: 0px;border-collapse: collapse;margin: 0px;'>" +
                "<td style='border: none;margin: 0px;padding: 0px;'>" +
                "<div style='margin:0px;border: 0px; overflow: hidden; width:120px;height: 100%;padding: 0px;resize:none;'>" +
                "<input name='_pro_" +
                p.code + "' value='" + ((p.value == undefined || p.value == null) ? "" : p.value) +
                "' onfocus='this.select();' readonly id='_p_ds_" + p.code +
                "' style='overflow-y:hidden;text-overflow:ellipsis; resize: none; border: none; marging:0px; padding: 0px;'/>" +
                "</div></td><td style='border:none;width:10px;' valign='top'>" +
                "<input type='button' value='设置' onclick='_selectPage(\"" + grid.options["id"] +
                "\",\"" + p.code + "\")' style='height:18px;'/>" +
                "</td></tr></table>";
        return _html;
    }
};

function _selectPage(property_grid_id, code) {
	selectPage({
		selected:function(ds){		
            RDCP.PROPERTY_GRIDS[property_grid_id].setPropertyValue(code,ds[0].code);
            document.getElementById("_p_ds_"+code).value = ds[0].code;
			return true;
		}
	});
}
RDCP.registerEditor(new RDCP.PageSelecter());