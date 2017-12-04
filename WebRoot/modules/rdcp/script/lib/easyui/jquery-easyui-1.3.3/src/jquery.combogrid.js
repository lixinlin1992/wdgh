/**
 * combogrid - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 * Dependencies:
 *   combo
 *   datagrid
 * 
 */
(function($){
	/**
	 * create this component.
	 */
	function create(target){
		var state = $.data(target, 'combogrid');
		var opts = state.options;
		var grid = state.grid;
		
		$(target).addClass('combogrid-f').combo(opts);
		var panel = $(target).combo('panel');
		if (!grid){
			grid = $('<table></table>').appendTo(panel);
			state.grid = grid;
		}
		grid.datagrid($.extend({}, opts, {
			border: false,
			fit: true,
			singleSelect: (!opts.multiple),
			onLoadSuccess: function(data){
				var values = $(target).combo('getValues');
				// prevent from firing onSelect event.
				var oldOnSelect = opts.onSelect;
				opts.onSelect = function(){};
				setValues(target, values, state.remainText);
				opts.onSelect = oldOnSelect;
				
				opts.onLoadSuccess.apply(target, arguments);
			},
			onClickRow: onClickRow,
			onSelect: function(index, row){retrieveValues(); opts.onSelect.call(this, index, row);},
			onUnselect: function(index, row){retrieveValues(); opts.onUnselect.call(this, index, row);},
			onSelectAll: function(rows){retrieveValues(); opts.onSelectAll.call(this, rows);},
			onUnselectAll: function(rows){
				if (opts.multiple) retrieveValues(); 
				opts.onUnselectAll.call(this, rows);
			}
		}));
		
		function onClickRow(index, row){
			state.remainText = false;
			retrieveValues();
			if (!opts.multiple){
				$(target).combo('hidePanel');
			}
			opts.onClickRow.call(this, index, row);
		}
		
		/**
		 * retrieve values from datagrid panel.
		 */
		function retrieveValues(){
			var rows = grid.datagrid('getSelections');
			var vv = [],ss = [];
			for(var i=0; i<rows.length; i++){
				vv.push(rows[i][opts.idField]);
				ss.push(rows[i][opts.textField]);
			}
			if (!opts.multiple){
				$(target).combo('setValues', (vv.length ? vv : ['']));
			} else {
				$(target).combo('setValues', vv);
			}
//			$(target).combo('setValues', vv);
//			if (!vv.length && !opts.multiple){
//				$(target).combo('setValues', ['']);
//			}
			if (!state.remainText){
				$(target).combo('setText', ss.join(opts.separator));
			}
		}
	}
	
	function nav(target, dir){
		var state = $.data(target, 'combogrid');
		var opts = state.options;
		var grid = state.grid;
		var rowCount = grid.datagrid('getRows').length;
		if (!rowCount){return}
		
		var tr = opts.finder.getTr(grid[0], null, 'highlight');
		if (!tr.length){
			tr = opts.finder.getTr(grid[0], null, 'selected');;
		}
		var index;
		if (!tr.length){
			index = (dir == 'next' ? 0 : rowCount-1);
		} else {
			var index = parseInt(tr.attr('datagrid-row-index'));
			index += (dir == 'next' ? 1 : -1);
			if (index < 0) {index = rowCount - 1}
			if (index >= rowCount) {index = 0}
		}
		
		grid.datagrid('highlightRow', index);
		if (opts.selectOnNavigation){
			state.remainText = false;
			grid.datagrid('selectRow', index);
		}
	}
	
	/**
	 * set combogrid values
	 */
	function setValues(target, values, remainText){
		var state = $.data(target, 'combogrid');
		var opts = state.options;
		var grid = state.grid;
		var rows = grid.datagrid('getRows');
		var ss = [];
		
		var oldValues = $(target).combo('getValues');
		var cOpts = $(target).combo('options');
		var oldOnChange = cOpts.onChange;
		cOpts.onChange = function(){};	// prevent from triggering onChange event
		
		grid.datagrid('clearSelections');
		for(var i=0; i<values.length; i++){
			var index = grid.datagrid('getRowIndex', values[i]);
			if (index >= 0){
				grid.datagrid('selectRow', index);
				ss.push(rows[index][opts.textField]);
			} else {
				ss.push(values[i]);
			}
		}
		$(target).combo('setValues', oldValues);
		cOpts.onChange = oldOnChange;	// restore to trigger onChange event
		
		$(target).combo('setValues', values);
		if (!remainText){
			var s = ss.join(opts.separator);
			if ($(target).combo('getText') != s){
				$(target).combo('setText', s);
			}
		}
		
//		if ($(target).combo('getValues').join(',') == values.join(',')){
//			return;
//		}
//		$(target).combo('setValues', values);
//		if (!remainText){
//			$(target).combo('setText', ss.join(opts.separator));
//		}
	}
	
	/**
	 * do the query action
	 */
	function doQuery(target, q){
		var state = $.data(target, 'combogrid');
		var opts = state.options;
		var grid = state.grid;
		state.remainText = true;
		
		if (opts.multiple && !q){
			setValues(target, [], true);
		} else {
			setValues(target, [q], true);
		}
		
		if (opts.mode == 'remote'){
			grid.datagrid('clearSelections');
			grid.datagrid('load', $.extend({}, opts.queryParams, {q:q}));
		} else {
			if (!q) return;
			var rows = grid.datagrid('getRows');
			for(var i=0; i<rows.length; i++){
				if (opts.filter.call(target, q, rows[i])){
					grid.datagrid('clearSelections');
					grid.datagrid('selectRow', i);
					return;
				}
			}
		}
	}
	
	function doEnter(target){
		var state = $.data(target, 'combogrid');
		var opts = state.options;
		var grid = state.grid;
		var tr = opts.finder.getTr(grid[0], null, 'highlight');
		if (!tr.length){
			tr = opts.finder.getTr(grid[0], null, 'selected');
		}
		if (!tr.length){return}
		
		state.remainText = false;
		var index = parseInt(tr.attr('datagrid-row-index'));
		if (opts.multiple){
			if (tr.hasClass('datagrid-row-selected')){
				grid.datagrid('unselectRow', index);
			} else {
				grid.datagrid('selectRow', index);
			}
		} else {
			grid.datagrid('selectRow', index);
			$(target).combogrid('hidePanel');
		}
	}
	
	$.fn.combogrid = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.combogrid.methods[options];
			if (method){
				return method(this, param);
			} else {
				return $.fn.combo.methods[options](this, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'combogrid');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'combogrid', {
					options: $.extend({}, $.fn.combogrid.defaults, $.fn.combogrid.parseOptions(this), options)
				});
			}
			
			create(this);
		});
	};
	
	$.fn.combogrid.methods = {
		options: function(jq){
			var copts = jq.combo('options');
			return $.extend($.data(jq[0], 'combogrid').options, {
				originalValue: copts.originalValue,
				disabled: copts.disabled,
				readonly: copts.readonly
			});
		},
		// get the datagrid object.
		grid: function(jq){
			return $.data(jq[0], 'combogrid').grid;
		},
		setValues: function(jq, values){
			return jq.each(function(){
				setValues(this, values);
			});
		},
		setValue: function(jq, value){
			return jq.each(function(){
				setValues(this, [value]);
			});
		},
		clear: function(jq){
			return jq.each(function(){
				$(this).combogrid('grid').datagrid('clearSelections');
				$(this).combo('clear');
			});
		},
		reset: function(jq){
			return jq.each(function(){
				var opts = $(this).combogrid('options');
				if (opts.multiple){
					$(this).combogrid('setValues', opts.originalValue);
				} else {
					$(this).combogrid('setValue', opts.originalValue);
				}
			});
		}
	};
	
	$.fn.combogrid.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.combo.parseOptions(target), $.fn.datagrid.parseOptions(target), 
				$.parser.parseOptions(target, ['idField','textField','mode']));
	};
	
	$.fn.combogrid.defaults = $.extend({}, $.fn.combo.defaults, $.fn.datagrid.defaults, {
		loadMsg: null,
		idField: null,
		textField: null,	// the text field to display.
		mode: 'local',	// or 'remote'
		
		keyHandler: {
			up: function(){nav(this, 'prev');},
			down: function(){nav(this, 'next');},
			enter: function(){doEnter(this);},
			query: function(q){doQuery(this, q);}
		},
		filter: function(q, row){
			var opts = $(this).combogrid('options');
			return row[opts.textField].indexOf(q) == 0;
		}
	});
})(jQuery);
