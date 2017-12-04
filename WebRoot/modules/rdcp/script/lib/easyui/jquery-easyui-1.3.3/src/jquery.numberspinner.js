/**
 * numberspinner - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 * Dependencies:
 * 	 spinner
 * 	 numberbox
 */
(function($){
	function create(target){
		$(target).addClass('numberspinner-f');
		var opts = $.data(target, 'numberspinner').options;
		$(target).spinner(opts).numberbox(opts);
	}
	
	function doSpin(target, down){
		var opts = $.data(target, 'numberspinner').options;
		
		var v = parseFloat($(target).numberbox('getValue') || opts.value) || 0;
//		var v = parseFloat($(target).val() || opts.value) || 0;
		if (down == true){
			v -= opts.increment;
		} else {
			v += opts.increment;
		}
//		$(target).val(v).numberbox('fix');
		$(target).numberbox('setValue', v);
	}
	
	$.fn.numberspinner = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.numberspinner.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.spinner(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'numberspinner');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'numberspinner', {
					options: $.extend({}, $.fn.numberspinner.defaults, $.fn.numberspinner.parseOptions(this), options)
				});
			}
			create(this);
		});
	};
	
	$.fn.numberspinner.methods = {
		options: function(jq){
			var opts = $.data(jq[0], 'numberspinner').options;
			return $.extend(opts, {
				value: jq.numberbox('getValue'),
				originalValue: jq.numberbox('options').originalValue
			});
		},
		setValue: function(jq, value){
			return jq.each(function(){
				$(this).numberbox('setValue', value);
			});
		},
		getValue: function(jq){
			return jq.numberbox('getValue');
		},
		clear: function(jq){
			return jq.each(function(){
				$(this).spinner('clear');
				$(this).numberbox('clear');
			});
		},
		reset: function(jq){
			return jq.each(function(){
				var opts = $(this).numberspinner('options');
				$(this).numberspinner('setValue', opts.originalValue);
			});
		}
	};
	
	$.fn.numberspinner.parseOptions = function(target){
		return $.extend({}, $.fn.spinner.parseOptions(target), $.fn.numberbox.parseOptions(target), {
		});
	};
	
	$.fn.numberspinner.defaults = $.extend({}, $.fn.spinner.defaults, $.fn.numberbox.defaults, {
		spin: function(down){doSpin(this, down);}
	});
})(jQuery);
