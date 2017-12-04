/**
 * numberbox - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: jeasyui@gmail.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 * Dependencies:
 * 	 validatebox
 * 
 */
(function($){
	/**
	 * init the component and return its value field object;
	 */
	function init(target){
		$(target).addClass('numberbox-f');
		var v = $('<input type="hidden">').insertAfter(target);
		var name = $(target).attr('name');
		if (name){
			v.attr('name', name);
			$(target).removeAttr('name').attr('numberboxName', name);
		}
		return v;
	}
	
	/**
	 * set the initialized value
	 */
	function initValue(target){
		var opts = $.data(target, 'numberbox').options;
		var fn = opts.onChange;
		opts.onChange = function(){};
		setValue(target, opts.parser.call(target, opts.value));
		opts.onChange = fn;
		opts.originalValue = getValue(target);
	}
	
	function getValue(target){
		return $.data(target, 'numberbox').field.val();
	}
	
	function setValue(target, value){
		var state = $.data(target, 'numberbox');
		var opts = state.options;
		var oldValue = getValue(target);
		value = opts.parser.call(target, value);
		opts.value = value;
		state.field.val(value);
		$(target).val(opts.formatter.call(target, value));
//		$(target).numberbox('validate');
		if (oldValue != value){
			opts.onChange.call(target, value, oldValue);
		}
	}
	
	function bindEvents(target){
		var opts = $.data(target, 'numberbox').options;
		
		$(target).unbind('.numberbox').bind('keypress.numberbox', function(e){
			if (e.which == 45){	//-
				if ($(this).val().indexOf('-') == -1){
					return true;
				} else {
					return false;
				}
			} if (e.which == 46) {	//.
				if ($(this).val().indexOf('.') == -1){
					return true;
				} else {
					return false;
				}
			}
			else if ((e.which >= 48 && e.which <= 57 && e.ctrlKey == false && e.shiftKey == false) || e.which == 0 || e.which == 8) {
				return true;
			} else if (e.ctrlKey == true && (e.which == 99 || e.which == 118)) {
				return true;
			} else {
				return false;
			}
//		}).bind('paste.numberbox', function(){
//			setTimeout(function(){
//				var val = $(target).val();
//				if (val != opts.parser.call(target, val)){
//					setValue(target, val);
//					var vv = getValue(target);
//					if ($(target).val() != vv){
//						$(target).val(vv);
//					}
//				}
//			}, 50);
//		}).bind('dragenter.numberbox', function(){
//			return false;
		}).bind('blur.numberbox', function(){
			setValue(target, $(this).val());
			$(this).val(opts.formatter.call(target, getValue(target)));
		}).bind('focus.numberbox', function(){
			var vv = getValue(target);
			if ($(this).val() != vv){
				$(this).val(vv);
			}
		});
	}
	
	/**
	 * do the validate if necessary.
	 */
	function validate(target){
		if ($.fn.validatebox){
			var opts = $.data(target, 'numberbox').options;
			$(target).validatebox(opts);
		}
	}
	
	function setDisabled(target, disabled){
		var opts = $.data(target, 'numberbox').options;
		if (disabled){
			opts.disabled = true;
			$(target).attr('disabled', true);
		} else {
			opts.disabled = false;
			$(target).removeAttr('disabled');
		}
	}
	
	$.fn.numberbox = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.numberbox.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.validatebox(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'numberbox');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'numberbox', {
					options: $.extend({}, $.fn.numberbox.defaults, $.fn.numberbox.parseOptions(this), options),
					field: init(this)
				});
				$(this).removeAttr('disabled');
				$(this).css({imeMode:"disabled"});
			}
			
			setDisabled(this, state.options.disabled);
			bindEvents(this);
			validate(this);
			initValue(this);
		});
	};
	
	$.fn.numberbox.methods = {
		options: function(jq){
			return $.data(jq[0], 'numberbox').options;
		},
		destroy: function(jq){
			return jq.each(function(){
				$.data(this, 'numberbox').field.remove();
				$(this).validatebox('destroy');
				$(this).remove();
			});
		},
		disable: function(jq){
			return jq.each(function(){
				setDisabled(this, true);
			});
		},
		enable: function(jq){
			return jq.each(function(){
				setDisabled(this, false);
			});
		},
		fix: function(jq){
			return jq.each(function(){
				setValue(this, $(this).val());
			});
		},
		setValue: function(jq, value){
			return jq.each(function(){
				setValue(this, value);
			});
		},
		getValue: function(jq){
			return getValue(jq[0]);
		},
		clear: function(jq){
			return jq.each(function(){
				var state = $.data(this, 'numberbox');
				state.field.val('');
				$(this).val('');
//				$(this).numberbox('validate');
			});
		},
		reset: function(jq){
			return jq.each(function(){
				var opts = $(this).numberbox('options');
				$(this).numberbox('setValue', opts.originalValue);
			});
		}
	};
	
	$.fn.numberbox.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.validatebox.parseOptions(target), $.parser.parseOptions(target, [
			'decimalSeparator','groupSeparator','suffix',
			{min:'number',max:'number',precision:'number'}
		]), {
			prefix: (t.attr('prefix') ? t.attr('prefix') : undefined),
			disabled: (t.attr('disabled') ? true : undefined),
			value: (t.val() || undefined)
		});
//		return $.extend({}, $.fn.validatebox.parseOptions(target), {
//			disabled: (t.attr('disabled') ? true : undefined),
//			value: (t.val() || undefined),
//			min: (t.attr('min')=='0' ? 0 : parseFloat(t.attr('min')) || undefined),
//			max: (t.attr('max')=='0' ? 0 : parseFloat(t.attr('max')) || undefined),
//			precision: (parseInt(t.attr('precision')) || undefined),
//			decimalSeparator: (t.attr('decimalSeparator') ? t.attr('decimalSeparator') : undefined),
//			groupSeparator: (t.attr('groupSeparator') ? t.attr('groupSeparator') : undefined),
//			prefix: (t.attr('prefix') ? t.attr('prefix') : undefined),
//			suffix: (t.attr('suffix') ? t.attr('suffix') : undefined)
//		});
	};
	
	// Inherited from $.fn.validatebox.defaults
	$.fn.numberbox.defaults = $.extend({}, $.fn.validatebox.defaults, {
		disabled: false,
		value: '',
		min: null,
		max: null,
		precision: 0,
		decimalSeparator: '.',
		groupSeparator: '',
		prefix: '',
		suffix: '',
		
		formatter: function(value){
			if (!value) return value;
			
			value = value + '';
			var opts = $(this).numberbox('options');
			var s1 = value, s2 = '';
			var dpos = value.indexOf('.');
			if (dpos >= 0){
				s1 = value.substring(0, dpos);
				s2 = value.substring(dpos+1, value.length);
			}
			if (opts.groupSeparator){
				var p = /(\d+)(\d{3})/;
				while(p.test(s1)){
					s1 = s1.replace(p, '$1' + opts.groupSeparator + '$2');
				}
			}
			if (s2){
				return opts.prefix + s1 + opts.decimalSeparator + s2 + opts.suffix;
			} else {
				return opts.prefix + s1 + opts.suffix;
			}
		},
		parser: function(s){
			s = s + '';
			var opts = $(this).numberbox('options');
			if (opts.groupSeparator) s = s.replace(new RegExp('\\'+opts.groupSeparator,'g'), '');
			if (opts.decimalSeparator) s = s.replace(new RegExp('\\'+opts.decimalSeparator,'g'), '.');
			if (opts.prefix) s = s.replace(new RegExp('\\'+$.trim(opts.prefix),'g'), '');
			if (opts.suffix) s = s.replace(new RegExp('\\'+$.trim(opts.suffix),'g'), '');
			s = s.replace(/\s/g,'');
			
			var val = parseFloat(s).toFixed(opts.precision);
			if (isNaN(val)) {
				val = '';
			} else if (typeof(opts.min) == 'number' && val < opts.min) {
				val = opts.min.toFixed(opts.precision);
			} else if (typeof(opts.max) == 'number' && val > opts.max) {
				val = opts.max.toFixed(opts.precision);
			}
			return val;
		},
		onChange: function(newValue, oldValue){}
	});
})(jQuery);
