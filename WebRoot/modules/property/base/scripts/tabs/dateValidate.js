/**
 * easyui时间控件时间校验
 *
 * @author Logic
 * @date 2014-1-25
 */

rdcp.ready(function(){
	$.extend($.fn.validatebox.defaults.rules, {
		dateValidate: {
			validator: function(value,param){
				if(value==null || value=='')
					return true;
				//var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/; //短日期格式的正则表达式
				var reg = /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/;
				var r = value.match(reg);
				if (r == null)
					return false;
				return true;
			},
			message: '日期格式不正确！格式:2013-01-01'
		}
	});
});
