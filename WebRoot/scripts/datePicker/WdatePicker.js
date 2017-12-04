/*
 * Jquery_ui.datepicker.js
 * License: http://docs.jquery.com/UI/API/1.7/Datepicker#method-option
 * author:zengchengfu
 */
//脚本的根目录
var BASE_PATH = "scripts/";

//loadScript(BASE_PATH + 'datePicker/ui/jquery-1.4.2.min.js');	
appendScript(BASE_PATH + 'datePicker/ui/ui.core.js');
appendScript(BASE_PATH + 'datePicker/ui/ui.datepicker.js');
appendScript(BASE_PATH + 'datePicker/ui/i18n/ui.datepicker-zh-CN.js');

var _dateInputs = {};
/**
 * 2012-02-02 李嘉伟 添加时间日期参数
 *
 * dateFmt 日期格式
 *
 */
function WdatePicker(params){
		var evt=getEvent();  
		var ele = evt.srcElement || evt.target;
		var id = ele.id;
				
		if(id == undefined || $.trim(id) == "" || id == null){
			id="d"+new Date().getTime();
			//ele.attr("id",id);
            ele.setAttribute("id",id);
		}

		if(_dateInputs[id] == null || _dateInputs[id] == undefined){
			var _datepicker_opt = {
				changeMonth: true,
				changeYear: true,
				closeText: 'X',
				altField: '#actualDate',
				altFormat: 'yyyy/mm-dd',
				showButtonPanel: true,
				showClearButton:true,
				minDate: new Date(1970,7,10)
			};
			//根据参数设置datepicker
			if(params==null || params==undefined)
				params = {};
			
			if(params.dateFmt != undefined)
				_datepicker_opt.dateFormat = params.dateFmt;
			//调用接口
			$("#"+id).datepicker(_datepicker_opt);
			_dateInputs[id] = "1";
			
			$("#"+id).trigger("focus");
		}
}
 function getEvent(){  
     if(document.all)      
         return window.event;//如果是ie  
     func=getEvent.caller;  
     while(func!=null){  
          var arg0=func.arguments[0];  
         if(arg0){  
             if((arg0.constructor==Event || arg0.constructor ==MouseEvent) || (typeof(arg0)=="object" && arg0.preventDefault && arg0.stopPropagation)){  
                 return arg0;  
              }              
          }  
         func=func.caller;  
      }  
     return null;  
 }  