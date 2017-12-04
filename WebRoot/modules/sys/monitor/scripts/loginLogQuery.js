var loginLogQueryParams = {	  
		sortName : 'LOGIN_ID',
		sortOrder : 'DESC',
		idField : 'LOGIN_ID',
        fitColumns: true,
	    rownumbers:true,
	    columns: [
	        [   {field: 'LOGIN_ID', title: '日志编号', sortable: true, align: 'center', width: 120},
	            {field: 'USER_ACCOUNT', title: '工号', sortable: true, align: 'center', width: 120},
	            {field: 'USER_NAME', title: '用户名', sortable: true, align: 'center', width: 120},
	            {field: 'LOGIN_TIME', title: '登录时间', sortable: true, align: 'center', width: 120},
	            {field: 'LOGOUT_TIME', title: '注销时间', sortable: true, align: 'center', width: 120},
	            {field: 'LOGIN_IP', title: '登录IP', sortable: true, align: 'center', width: 120},

		] ]
	};