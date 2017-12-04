/**
 * 初始化
 */
rdcp.ready(function () {
    //TODO

});

/**
 * 获取下拉列表公共函数
 * @param id selectId
 * @param tableName 表名
 * @param tableColumn 列名
 */
function getParamsByPaCode(id, tableName, tableColumn,callback) {
    rdcp.dropdown2(id, '!comm/~query/Q_LOAD_PARAMS_FROM_PACODE?code_table=' + tableName + '&code_field=' + tableColumn, {loadComplete: function () {
        if(callback!=null){
            callback();
        }
    }});
}

function getParamsByPaCode2(id, tableName, tableColumn,value,callback) {
	rdcp.dropdown2(id, '!comm/~query/Q_LOAD_PARAMS_FROM_PACODE?code_table=' + tableName + '&code_field=' + tableColumn+"&code="+value, {loadComplete: function () {
			//alert(tableName+tableColumn+value);
		if(callback!=null){
			
			callback();
		}
	}});
}