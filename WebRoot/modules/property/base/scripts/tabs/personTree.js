/**
 * 选择人操作
 *
 * @author 欧顺平
 * @date 2014-1-4
 */

openTree = function(DivId,TreeID,id,name){
	var dlgOpts_parent_tree = {
		    title : "请选择",
		    id:DivId,
		    width : "500",
		    height : "500" ,
		    modal : true
		};
	
	
	rdcp.tree(TreeID, "!org/dept/~query/Q_USER_DEPT_TREE", {
		onClick: function (node) {
			if(node.attributes.type_id=="2"){
				$("#"+id).val(node["id"]);
				$("#"+name).val(node["text"]);
				rdcp.dialog.close(DivId);
			}
			return true;
		}
	});
	rdcp.dialog(dlgOpts_parent_tree);
}

