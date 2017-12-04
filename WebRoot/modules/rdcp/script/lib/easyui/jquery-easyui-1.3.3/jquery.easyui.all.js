/**
 * jQuery EasyUI 1.3.3
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 *
 */
/**
 * parser - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 */

(function($){
	$.parser = {
		auto: true,
		onComplete: function(context){},
		plugins:['draggable','droppable','resizable','pagination','tooltip',
		         'linkbutton','menu','menubutton','splitbutton','progressbar',
				 'tree','combobox','combotree','combogrid','numberbox','validatebox','searchbox',
				 'numberspinner','timespinner','calendar','datebox','datetimebox','slider',
				 'layout','panel','datagrid','propertygrid','treegrid','tabs','accordion','window','dialog'
		],
		parse: function(context){
			var aa = [];
			for(var i=0; i<$.parser.plugins.length; i++){
				var name = $.parser.plugins[i];
				var r = $('.easyui-' + name, context);
				if (r.length){
					if (r[name]){
						r[name]();
					} else {
						aa.push({name:name,jq:r});
					}
				}
			}
			if (aa.length && window.easyloader){
				var names = [];
				for(var i=0; i<aa.length; i++){
					names.push(aa[i].name);
				}
				easyloader.load(names, function(){
					for(var i=0; i<aa.length; i++){
						var name = aa[i].name;
						var jq = aa[i].jq;
						jq[name]();
					}
					$.parser.onComplete.call($.parser, context);
				});
			} else {
				$.parser.onComplete.call($.parser, context);
			}
		},
		
		/**
		 * parse options, including standard 'data-options' attribute.
		 * 
		 * calling examples:
		 * $.parser.parseOptions(target);
		 * $.parser.parseOptions(target, ['id','title','width',{fit:'boolean',border:'boolean'},{min:'number'}]);
		 */
		parseOptions: function(target, properties){
			var t = $(target);
			var options = {};
			
			var s = $.trim(t.attr('data-options'));
			if (s){
				var first = s.substring(0,1);
				var last = s.substring(s.length-1,1);
				if (first != '{') s = '{' + s;
				if (last != '}') s = s + '}';
				options = (new Function('return ' + s))();
			}
				
			if (properties){
				var opts = {};
				for(var i=0; i<properties.length; i++){
					var pp = properties[i];
					if (typeof pp == 'string'){
						if (pp == 'width' || pp == 'height' || pp == 'left' || pp == 'top'){
							opts[pp] = parseInt(target.style[pp]) || undefined;
						} else {
							opts[pp] = t.attr(pp);
						}
					} else {
						for(var name in pp){
							var type = pp[name];
							if (type == 'boolean'){
								opts[name] = t.attr(name) ? (t.attr(name) == 'true') : undefined;
							} else if (type == 'number'){
								opts[name] = t.attr(name)=='0' ? 0 : parseFloat(t.attr(name)) || undefined;
							}
						}
					}
				}
				$.extend(options, opts);
			}
			return options;
		}
	};
	$(function(){
		var d = $('<div style="position:absolute;top:-1000px;width:100px;height:100px;padding:5px"></div>').appendTo('body');
		$._boxModel = parseInt(d.width()) == 100;
		d.remove();
		
		if (!window.easyloader && $.parser.auto){
			$.parser.parse();
		}
	});
	
	/**
	 * extend plugin to set box model width
	 */
	$.fn._outerWidth = function(width){
		if (width == undefined){
			if (this[0] == window){
				return this.width() || document.body.clientWidth;
			}
			return this.outerWidth()||0;
		}
		return this.each(function(){
			if ($._boxModel){
				$(this).width(width - ($(this).outerWidth() - $(this).width()));
			} else {
				$(this).width(width);
			}
		});
	};
	
	/**
	 * extend plugin to set box model height
	 */
	$.fn._outerHeight = function(height){
		if (height == undefined){
			if (this[0] == window){
				return this.height() || document.body.clientHeight;
			}
			return this.outerHeight()||0;
		}
		return this.each(function(){
			if ($._boxModel){
				$(this).height(height - ($(this).outerHeight() - $(this).height()));
			} else {
				$(this).height(height);
			}
		});
	};
	
	$.fn._scrollLeft = function(left){
		if (left == undefined){
			return this.scrollLeft();
		} else {
			return this.each(function(){$(this).scrollLeft(left)});
		}
	}
	
	$.fn._propAttr = $.fn.prop || $.fn.attr;
	
	/**
	 * set or unset the fit property of parent container, return the width and height of parent container
	 */
	$.fn._fit = function(fit){
		fit = fit == undefined ? true : fit;
		var t = this[0];
		var p = (t.tagName == 'BODY' ? t : this.parent()[0]);
		var fcount = p.fcount || 0;
		if (fit){
			if (!t.fitted){
				t.fitted = true;
				p.fcount = fcount + 1;
				$(p).addClass('panel-noscroll');
				if (p.tagName == 'BODY'){
					$('html').addClass('panel-fit');
				}
			}
		} else {
			if (t.fitted){
				t.fitted = false;
				p.fcount = fcount - 1;
				if (p.fcount == 0){
					$(p).removeClass('panel-noscroll');
					if (p.tagName == 'BODY'){
						$('html').removeClass('panel-fit');
					}
				}
			}
		}
		return {
			width: $(p).width(),
			height: $(p).height()
		}
	}
	
})(jQuery);
/**
 * draggable - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 */
(function($){
	var isDragging = false;
	function drag(e){
		var state = $.data(e.data.target, 'draggable');
		var opts = state.options;
		var proxy = state.proxy;
		
		var dragData = e.data;
		var left = dragData.startLeft + e.pageX - dragData.startX;
		var top = dragData.startTop + e.pageY - dragData.startY;
		
		if (proxy){
			if (proxy.parent()[0] == document.body){
				if (opts.deltaX != null && opts.deltaX != undefined){
					left = e.pageX + opts.deltaX;
				} else {
					left = e.pageX - e.data.offsetWidth;
				}
				if (opts.deltaY != null && opts.deltaY != undefined){
					top = e.pageY + opts.deltaY;
				} else {
					top = e.pageY - e.data.offsetHeight;
				}
			} else {
				if (opts.deltaX != null && opts.deltaX != undefined){
					left += e.data.offsetWidth + opts.deltaX;
				}
				if (opts.deltaY != null && opts.deltaY != undefined){
					top += e.data.offsetHeight + opts.deltaY;
				}
			}
		}
		
//		if (opts.deltaX != null && opts.deltaX != undefined){
//			left = e.pageX + opts.deltaX;
//		}
//		if (opts.deltaY != null && opts.deltaY != undefined){
//			top = e.pageY + opts.deltaY;
//		}
		
		if (e.data.parent != document.body) {
			left += $(e.data.parent).scrollLeft();
			top += $(e.data.parent).scrollTop();
		}
		
		if (opts.axis == 'h') {
			dragData.left = left;
		} else if (opts.axis == 'v') {
			dragData.top = top;
		} else {
			dragData.left = left;
			dragData.top = top;
		}
	}
	
	function applyDrag(e){
		var state = $.data(e.data.target, 'draggable');
		var opts = state.options;
		var proxy = state.proxy;
		if (!proxy){
			proxy = $(e.data.target);
		}
//		if (proxy){
//			proxy.css('cursor', opts.cursor);
//		} else {
//			proxy = $(e.data.target);
//			$.data(e.data.target, 'draggable').handle.css('cursor', opts.cursor);
//		}
		proxy.css({
			left:e.data.left,
			top:e.data.top
		});
		$('body').css('cursor', opts.cursor);
	}
	
	function doDown(e){
		isDragging = true;
		var state = $.data(e.data.target, 'draggable');
		var opts = state.options;
		
		var droppables = $('.droppable').filter(function(){
			return e.data.target != this;
		}).filter(function(){
			var accept = $.data(this, 'droppable').options.accept;
			if (accept){
				return $(accept).filter(function(){
					return this == e.data.target;
				}).length > 0;
			} else {
				return true;
			}
		});
		state.droppables = droppables;
		
		var proxy = state.proxy;
		if (!proxy){
			if (opts.proxy){
				if (opts.proxy == 'clone'){
					proxy = $(e.data.target).clone().insertAfter(e.data.target);
				} else {
					proxy = opts.proxy.call(e.data.target, e.data.target);
				}
				state.proxy = proxy;
			} else {
				proxy = $(e.data.target);
			}
		}
		
		proxy.css('position', 'absolute');
		drag(e);
		applyDrag(e);
		
		opts.onStartDrag.call(e.data.target, e);
		return false;
	}
	
	function doMove(e){
		var state = $.data(e.data.target, 'draggable');
		drag(e);
		if (state.options.onDrag.call(e.data.target, e) != false){
			applyDrag(e);
		}
		
		var source = e.data.target;
		state.droppables.each(function(){
			var dropObj = $(this);
			if (dropObj.droppable('options').disabled){return;}
			
			var p2 = dropObj.offset();
			if (e.pageX > p2.left && e.pageX < p2.left + dropObj.outerWidth()
					&& e.pageY > p2.top && e.pageY < p2.top + dropObj.outerHeight()){
				if (!this.entered){
					$(this).trigger('_dragenter', [source]);
					this.entered = true;
				}
				$(this).trigger('_dragover', [source]);
			} else {
				if (this.entered){
					$(this).trigger('_dragleave', [source]);
					this.entered = false;
				}
			}
		});
		
		return false;
	}
	
	function doUp(e){
		isDragging = false;
//		drag(e);
		doMove(e);
		
		var state = $.data(e.data.target, 'draggable');
		var proxy = state.proxy;
		var opts = state.options;
		if (opts.revert){
			if (checkDrop() == true){
				$(e.data.target).css({
					position:e.data.startPosition,
					left:e.data.startLeft,
					top:e.data.startTop
				});
			} else {
				if (proxy){
					var left, top;
					if (proxy.parent()[0] == document.body){
						left = e.data.startX - e.data.offsetWidth;
						top = e.data.startY - e.data.offsetHeight;
					} else {
						left = e.data.startLeft;
						top = e.data.startTop;
					}
					proxy.animate({
						left: left,
						top: top
					}, function(){
						removeProxy();
					});
				} else {
					$(e.data.target).animate({
						left:e.data.startLeft,
						top:e.data.startTop
					}, function(){
						$(e.data.target).css('position', e.data.startPosition);
					});
				}
			}
		} else {
			$(e.data.target).css({
				position:'absolute',
				left:e.data.left,
				top:e.data.top
			});
			checkDrop();
		}
		
		opts.onStopDrag.call(e.data.target, e);
		
		$(document).unbind('.draggable');
		setTimeout(function(){
			$('body').css('cursor','');
		},100);
		
		function removeProxy(){
			if (proxy){
				proxy.remove();
			}
			state.proxy = null;
		}
		
		function checkDrop(){
			var dropped = false;
			state.droppables.each(function(){
				var dropObj = $(this);
				if (dropObj.droppable('options').disabled){return;}
				
				var p2 = dropObj.offset();
				if (e.pageX > p2.left && e.pageX < p2.left + dropObj.outerWidth()
						&& e.pageY > p2.top && e.pageY < p2.top + dropObj.outerHeight()){
					if (opts.revert){
						$(e.data.target).css({
							position:e.data.startPosition,
							left:e.data.startLeft,
							top:e.data.startTop
						});
					}
					$(this).trigger('_drop', [e.data.target]);
					removeProxy();
					dropped = true;
					this.entered = false;
					return false;
				}
			});
			if (!dropped && !opts.revert){
				removeProxy();
			}
			return dropped;
		}
		
		return false;
	}
	
	$.fn.draggable = function(options, param){
		if (typeof options == 'string'){
			return $.fn.draggable.methods[options](this, param);
		}
		
		return this.each(function(){
			var opts;
			var state = $.data(this, 'draggable');
			if (state) {
				state.handle.unbind('.draggable');
				opts = $.extend(state.options, options);
			} else {
				opts = $.extend({}, $.fn.draggable.defaults, $.fn.draggable.parseOptions(this), options || {});
			}
			
			if (opts.disabled == true) {
				$(this).css('cursor', '');
//				$(this).css('cursor', 'default');
				return;
			}
			
			var handle = null;
            if (typeof opts.handle == 'undefined' || opts.handle == null){
                handle = $(this);
            } else {
                handle = (typeof opts.handle == 'string' ? $(opts.handle, this) : opts.handle);
            }
			$.data(this, 'draggable', {
				options: opts,
				handle: handle
			});
			
			handle.unbind('.draggable').bind('mousemove.draggable', {target:this}, function(e){
				if (isDragging) return;
				var opts = $.data(e.data.target, 'draggable').options;
				if (checkArea(e)){
					$(this).css('cursor', opts.cursor);
				} else {
					$(this).css('cursor', '');
				}
			}).bind('mouseleave.draggable', {target:this}, function(e){
				$(this).css('cursor', '');
			}).bind('mousedown.draggable', {target:this}, function(e){
				if (checkArea(e) == false) return;
				$(this).css('cursor', '');

				var position = $(e.data.target).position();
				var offset = $(e.data.target).offset();
				var data = {
					startPosition: $(e.data.target).css('position'),
					startLeft: position.left,
					startTop: position.top,
					left: position.left,
					top: position.top,
					startX: e.pageX,
					startY: e.pageY,
					offsetWidth: (e.pageX - offset.left),
					offsetHeight: (e.pageY - offset.top),
					target: e.data.target,
					parent: $(e.data.target).parent()[0]
				};
				
				$.extend(e.data, data);
				var opts = $.data(e.data.target, 'draggable').options;
				if (opts.onBeforeDrag.call(e.data.target, e) == false) return;
				
				$(document).bind('mousedown.draggable', e.data, doDown);
				$(document).bind('mousemove.draggable', e.data, doMove);
				$(document).bind('mouseup.draggable', e.data, doUp);
//				$('body').css('cursor', opts.cursor);
			});
			
			// check if the handle can be dragged
			function checkArea(e) {
				var state = $.data(e.data.target, 'draggable');
				var handle = state.handle;
				var offset = $(handle).offset();
				var width = $(handle).outerWidth();
				var height = $(handle).outerHeight();
				var t = e.pageY - offset.top;
				var r = offset.left + width - e.pageX;
				var b = offset.top + height - e.pageY;
				var l = e.pageX - offset.left;
				
				return Math.min(t,r,b,l) > state.options.edge;
			}
			
		});
	};
	
	$.fn.draggable.methods = {
		options: function(jq){
			return $.data(jq[0], 'draggable').options;
		},
		proxy: function(jq){
			return $.data(jq[0], 'draggable').proxy;
		},
		enable: function(jq){
			return jq.each(function(){
				$(this).draggable({disabled:false});
			});
		},
		disable: function(jq){
			return jq.each(function(){
				$(this).draggable({disabled:true});
			});
		}
	};
	
	$.fn.draggable.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, 
				$.parser.parseOptions(target, ['cursor','handle','axis',
				       {'revert':'boolean','deltaX':'number','deltaY':'number','edge':'number'}]), {
			disabled: (t.attr('disabled') ? true : undefined)
		});
	};
	
	$.fn.draggable.defaults = {
		proxy:null,	// 'clone' or a function that will create the proxy object, 
					// the function has the source parameter that indicate the source object dragged.
		revert:false,
		cursor:'move',
		deltaX:null,
		deltaY:null,
		handle: null,
		disabled: false,
		edge:0,
		axis:null,	// v or h
		
		onBeforeDrag: function(e){},
		onStartDrag: function(e){},
		onDrag: function(e){},
		onStopDrag: function(e){}
	};
	
	$(function(){
		function touchHandler(e) {
			var touches = e.changedTouches, first = touches[0], type = "";

			switch(e.type) {
				case "touchstart": type = "mousedown"; break;
				case "touchmove":  type = "mousemove"; break;        
				case "touchend":   type = "mouseup";   break;
				default: return;
			}
			var simulatedEvent = document.createEvent("MouseEvent");
			simulatedEvent.initMouseEvent(type, true, true, window, 1,
									  first.screenX, first.screenY,
									  first.clientX, first.clientY, false,
									  false, false, false, 0/*left*/, null);

			first.target.dispatchEvent(simulatedEvent);
			if (isDragging){
				e.preventDefault();
			}
		}
		
		if (document.addEventListener){
			document.addEventListener("touchstart", touchHandler, true);
			document.addEventListener("touchmove", touchHandler, true);
			document.addEventListener("touchend", touchHandler, true);
			document.addEventListener("touchcancel", touchHandler, true); 
		}
	});
})(jQuery);
/**
 * droppable - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 */
(function($){
	function init(target){
		$(target).addClass('droppable');
		$(target).bind('_dragenter', function(e, source){
			$.data(target, 'droppable').options.onDragEnter.apply(target, [e, source]);
		});
		$(target).bind('_dragleave', function(e, source){
			$.data(target, 'droppable').options.onDragLeave.apply(target, [e, source]);
		});
		$(target).bind('_dragover', function(e, source){
			$.data(target, 'droppable').options.onDragOver.apply(target, [e, source]);
		});
		$(target).bind('_drop', function(e, source){
			$.data(target, 'droppable').options.onDrop.apply(target, [e, source]);
		});
	}
	
	$.fn.droppable = function(options, param){
		if (typeof options == 'string'){
			return $.fn.droppable.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'droppable');
			if (state){
				$.extend(state.options, options);
			} else {
				init(this);
				$.data(this, 'droppable', {
					options: $.extend({}, $.fn.droppable.defaults, $.fn.droppable.parseOptions(this), options)
				});
			}
		});
	};
	
	$.fn.droppable.methods = {
		options: function(jq){
			return $.data(jq[0], 'droppable').options;
		},
		enable: function(jq){
			return jq.each(function(){
				$(this).droppable({disabled:false});
			});
		},
		disable: function(jq){
			return jq.each(function(){
				$(this).droppable({disabled:true});
			});
		}
	};
	
	$.fn.droppable.parseOptions = function(target){
		var t = $(target);
		return $.extend({},	$.parser.parseOptions(target, ['accept']), {
			disabled: (t.attr('disabled') ? true : undefined)
		});
	};
	
	$.fn.droppable.defaults = {
		accept:null,
		disabled:false,
		onDragEnter:function(e, source){},
		onDragOver:function(e, source){},
		onDragLeave:function(e, source){},
		onDrop:function(e, source){}
	};
})(jQuery);
/**
 * resizable - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 */
(function($){
	var isResizing = false;
	$.fn.resizable = function(options, param){
		if (typeof options == 'string'){
			return $.fn.resizable.methods[options](this, param);
		}
		
		function resize(e){
			var resizeData = e.data;
			var options = $.data(resizeData.target, 'resizable').options;
			if (resizeData.dir.indexOf('e') != -1) {
				var width = resizeData.startWidth + e.pageX - resizeData.startX;
				width = Math.min(
							Math.max(width, options.minWidth),
							options.maxWidth
						);
				resizeData.width = width;
			}
			if (resizeData.dir.indexOf('s') != -1) {
				var height = resizeData.startHeight + e.pageY - resizeData.startY;
				height = Math.min(
						Math.max(height, options.minHeight),
						options.maxHeight
				);
				resizeData.height = height;
			}
			if (resizeData.dir.indexOf('w') != -1) {
				var width = resizeData.startWidth - e.pageX + resizeData.startX;
				width = Math.min(
							Math.max(width, options.minWidth),
							options.maxWidth
						);
				resizeData.width = width;
				resizeData.left = resizeData.startLeft + resizeData.startWidth - resizeData.width;
				
//				resizeData.width = resizeData.startWidth - e.pageX + resizeData.startX;
//				if (resizeData.width >= options.minWidth && resizeData.width <= options.maxWidth) {
//					resizeData.left = resizeData.startLeft + e.pageX - resizeData.startX;
//				}
			}
			if (resizeData.dir.indexOf('n') != -1) {
				var height = resizeData.startHeight - e.pageY + resizeData.startY;
				height = Math.min(
							Math.max(height, options.minHeight),
							options.maxHeight
						);
				resizeData.height = height;
				resizeData.top = resizeData.startTop + resizeData.startHeight - resizeData.height;
				
//				resizeData.height = resizeData.startHeight - e.pageY + resizeData.startY;
//				if (resizeData.height >= options.minHeight && resizeData.height <= options.maxHeight) {
//					resizeData.top = resizeData.startTop + e.pageY - resizeData.startY;
//				}
			}
		}
		
		function applySize(e){
			var resizeData = e.data;
			var t = $(resizeData.target);
			t.css({
				left: resizeData.left,
				top: resizeData.top
			});
			if (t.outerWidth() != resizeData.width){t._outerWidth(resizeData.width)}
			if (t.outerHeight() != resizeData.height){t._outerHeight(resizeData.height)}
//			t._outerWidth(resizeData.width)._outerHeight(resizeData.height);
		}
		
		function doDown(e){
			isResizing = true;
			$.data(e.data.target, 'resizable').options.onStartResize.call(e.data.target, e);
			return false;
		}
		
		function doMove(e){
			resize(e);
			if ($.data(e.data.target, 'resizable').options.onResize.call(e.data.target, e) != false){
				applySize(e)
			}
			return false;
		}
		
		function doUp(e){
			isResizing = false;
			resize(e, true);
			applySize(e);
			$.data(e.data.target, 'resizable').options.onStopResize.call(e.data.target, e);
			$(document).unbind('.resizable');
			$('body').css('cursor','');
//			$('body').css('cursor','auto');
			return false;
		}
		
		return this.each(function(){
			var opts = null;
			var state = $.data(this, 'resizable');
			if (state) {
				$(this).unbind('.resizable');
				opts = $.extend(state.options, options || {});
			} else {
				opts = $.extend({}, $.fn.resizable.defaults, $.fn.resizable.parseOptions(this), options || {});
				$.data(this, 'resizable', {
					options:opts
				});
			}
			
			if (opts.disabled == true) {
				return;
			}
			
			// bind mouse event using namespace resizable
			$(this).bind('mousemove.resizable', {target:this}, function(e){
				if (isResizing) return;
				var dir = getDirection(e);
				if (dir == '') {
					$(e.data.target).css('cursor', '');
				} else {
					$(e.data.target).css('cursor', dir + '-resize');
				}
			}).bind('mouseleave.resizable', {target:this}, function(e){
				$(e.data.target).css('cursor', '');
			}).bind('mousedown.resizable', {target:this}, function(e){
				var dir = getDirection(e);
				if (dir == '') return;
				
				function getCssValue(css) {
					var val = parseInt($(e.data.target).css(css));
					if (isNaN(val)) {
						return 0;
					} else {
						return val;
					}
				}
				
				var data = {
					target: e.data.target,
					dir: dir,
					startLeft: getCssValue('left'),
					startTop: getCssValue('top'),
					left: getCssValue('left'),
					top: getCssValue('top'),
					startX: e.pageX,
					startY: e.pageY,
					startWidth: $(e.data.target).outerWidth(),
					startHeight: $(e.data.target).outerHeight(),
					width: $(e.data.target).outerWidth(),
					height: $(e.data.target).outerHeight(),
					deltaWidth: $(e.data.target).outerWidth() - $(e.data.target).width(),
					deltaHeight: $(e.data.target).outerHeight() - $(e.data.target).height()
				};
				$(document).bind('mousedown.resizable', data, doDown);
				$(document).bind('mousemove.resizable', data, doMove);
				$(document).bind('mouseup.resizable', data, doUp);
				$('body').css('cursor', dir+'-resize');
			});
			
			// get the resize direction
			function getDirection(e) {
				var tt = $(e.data.target);
				var dir = '';
				var offset = tt.offset();
				var width = tt.outerWidth();
				var height = tt.outerHeight();
				var edge = opts.edge;
				if (e.pageY > offset.top && e.pageY < offset.top + edge) {
					dir += 'n';
				} else if (e.pageY < offset.top + height && e.pageY > offset.top + height - edge) {
					dir += 's';
				}
				if (e.pageX > offset.left && e.pageX < offset.left + edge) {
					dir += 'w';
				} else if (e.pageX < offset.left + width && e.pageX > offset.left + width - edge) {
					dir += 'e';
				}
				
				var handles = opts.handles.split(',');
				for(var i=0; i<handles.length; i++) {
					var handle = handles[i].replace(/(^\s*)|(\s*$)/g, '');
					if (handle == 'all' || handle == dir) {
						return dir;
					}
				}
				return '';
			}
			
			
		});
	};
	
	$.fn.resizable.methods = {
		options: function(jq){
			return $.data(jq[0], 'resizable').options;
		},
		enable: function(jq){
			return jq.each(function(){
				$(this).resizable({disabled:false});
			});
		},
		disable: function(jq){
			return jq.each(function(){
				$(this).resizable({disabled:true});
			});
		}
	};
	
	$.fn.resizable.parseOptions = function(target){
		var t = $(target);
		return $.extend({},
				$.parser.parseOptions(target, [
					'handles',{minWidth:'number',minHeight:'number',maxWidth:'number',maxHeight:'number',edge:'number'}
				]), {
			disabled: (t.attr('disabled') ? true : undefined)
		})
	};
	
	$.fn.resizable.defaults = {
		disabled:false,
		handles:'n, e, s, w, ne, se, sw, nw, all',
		minWidth: 10,
		minHeight: 10,
		maxWidth: 10000,//$(document).width(),
		maxHeight: 10000,//$(document).height(),
		edge:5,
		onStartResize: function(e){},
		onResize: function(e){},
		onStopResize: function(e){}
	};
	
})(jQuery);
/**
 * linkbutton - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 */
(function($){
	
	function createButton(target) {
		var opts = $.data(target, 'linkbutton').options;
		var t = $(target);
		
		t.addClass('l-btn').removeClass('l-btn-plain l-btn-selected l-btn-plain-selected');
		if (opts.plain){t.addClass('l-btn-plain')}
		if (opts.selected){
			t.addClass(opts.plain ? 'l-btn-selected l-btn-plain-selected' : 'l-btn-selected');
		}
		t.attr('group', opts.group || '');
		t.attr('id', opts.id || '');
		t.html(
			'<span class="l-btn-left">' +
				'<span class="l-btn-text"></span>' +
			'</span>'
		);
		if (opts.text){
			t.find('.l-btn-text').html(opts.text);
			if (opts.iconCls){
				t.find('.l-btn-text').addClass(opts.iconCls).addClass(opts.iconAlign=='left' ? 'l-btn-icon-left' : 'l-btn-icon-right');
			}
		} else {
			t.find('.l-btn-text').html('<span class="l-btn-empty">&nbsp;</span>');
			if (opts.iconCls){
				t.find('.l-btn-empty').addClass(opts.iconCls);
			}
		}
		
		t.unbind('.linkbutton').bind('focus.linkbutton',function(){
			if (!opts.disabled){
				$(this).find('.l-btn-text').addClass('l-btn-focus');
			}
		}).bind('blur.linkbutton',function(){
			$(this).find('.l-btn-text').removeClass('l-btn-focus');
		});
		if (opts.toggle && !opts.disabled){
			t.bind('click.linkbutton', function(){
				if (opts.selected){
					$(this).linkbutton('unselect');
				} else {
					$(this).linkbutton('select');
				}
			});
		}
		
		setSelected(target, opts.selected)
		setDisabled(target, opts.disabled);
	}
	
	function setSelected(target, selected){
		var opts = $.data(target, 'linkbutton').options;
		if (selected){
			if (opts.group){
				$('a.l-btn[group="'+opts.group+'"]').each(function(){
					var o = $(this).linkbutton('options');
					if (o.toggle){
						$(this).removeClass('l-btn-selected l-btn-plain-selected');
						o.selected = false;
					}
				});
			}
			$(target).addClass(opts.plain ? 'l-btn-selected l-btn-plain-selected' : 'l-btn-selected');
			opts.selected = true;
		} else {
			if (!opts.group){
				$(target).removeClass('l-btn-selected l-btn-plain-selected');
				opts.selected = false;
			}
		}
	}
	
	function setDisabled(target, disabled){
		var state = $.data(target, 'linkbutton');
		var opts = state.options;
		$(target).removeClass('l-btn-disabled l-btn-plain-disabled');
		if (disabled){
			opts.disabled = true;
			var href = $(target).attr('href');
			if (href){
				state.href = href;
				$(target).attr('href', 'javascript:void(0)');
			}
			if (target.onclick){
				state.onclick = target.onclick;
				target.onclick = null;
			}
			opts.plain ? $(target).addClass('l-btn-disabled l-btn-plain-disabled') : $(target).addClass('l-btn-disabled');
		} else {
			opts.disabled = false;
			if (state.href) {
				$(target).attr('href', state.href);
			}
			if (state.onclick) {
				target.onclick = state.onclick;
			}
		}
	}
	
	$.fn.linkbutton = function(options, param){
		if (typeof options == 'string'){
			return $.fn.linkbutton.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'linkbutton');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'linkbutton', {
					options: $.extend({}, $.fn.linkbutton.defaults, $.fn.linkbutton.parseOptions(this), options)
				});
				$(this).removeAttr('disabled');
			}
			
			createButton(this);
		});
	};
	
	$.fn.linkbutton.methods = {
		options: function(jq){
			return $.data(jq[0], 'linkbutton').options;
		},
		enable: function(jq){
			return jq.each(function(){
				setDisabled(this, false);
			});
		},
		disable: function(jq){
			return jq.each(function(){
				setDisabled(this, true);
			});
		},
		select: function(jq){
			return jq.each(function(){
				setSelected(this, true);
			});
		},
		unselect: function(jq){
			return jq.each(function(){
				setSelected(this, false);
			});
		}
	};
	
	$.fn.linkbutton.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.parser.parseOptions(target, 
			['id','iconCls','iconAlign','group',{plain:'boolean',toggle:'boolean',selected:'boolean'}]
		), {
			disabled: (t.attr('disabled') ? true : undefined),
			text: $.trim(t.html()),
			iconCls: (t.attr('icon') || t.attr('iconCls'))
		});
	};
	
	$.fn.linkbutton.defaults = {
		id: null,
		disabled: false,
		toggle: false,
		selected: false,
		group: null,
		plain: false,
		text: '',
		iconCls: null,
		iconAlign: 'left'
	};
	
})(jQuery);
/**
 * pagination - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 * Dependencies:
 * 	linkbutton
 * 
 */
(function($){
	function buildToolbar(target){
		var state = $.data(target, 'pagination');
		var opts = state.options;
		var bb = state.bb = {};	// the buttons;
		
		var pager = $(target).addClass('pagination').html('<table cellspacing="0" cellpadding="0" border="0"><tr></tr></table>');
		var tr = pager.find('tr');
		
		function createButton(name){
			var btn = opts.nav[name];
			var a = $('<a href="javascript:void(0)"></a>').appendTo(tr);
			a.wrap('<td></td>');
			a.linkbutton({
				iconCls: btn.iconCls,
				plain: true
			}).unbind('.pagination').bind('click.pagination', function(){
				btn.handler.call(target);
			});
			return a;
		}

		if (opts.showPageList){
			var ps = $('<select class="pagination-page-list"></select>');
			ps.bind('change', function(){
				opts.pageSize = parseInt($(this).val());
				opts.onChangePageSize.call(target, opts.pageSize);
				selectPage(target, opts.pageNumber);
			});
			for(var i=0; i<opts.pageList.length; i++) {
				$('<option></option>').text(opts.pageList[i]).appendTo(ps);
			}
			$('<td></td>').append(ps).appendTo(tr);
			
			$('<td><div class="pagination-btn-separator"></div></td>').appendTo(tr);
		}
		
		bb.first = createButton('first');
		bb.prev = createButton('prev');
		$('<td><div class="pagination-btn-separator"></div></td>').appendTo(tr);
		
		$('<span style="padding-left:6px;"></span>').html(opts.beforePageText).appendTo(tr).wrap('<td></td>');
		bb.num = $('<input class="pagination-num" type="text" value="1" size="2">').appendTo(tr).wrap('<td></td>');
		bb.num.unbind('.pagination').bind('keydown.pagination', function(e){
			if (e.keyCode == 13){
				var pageNumber = parseInt($(this).val()) || 1;
				selectPage(target, pageNumber);
				return false;
			}
		});
		bb.after = $('<span style="padding-right:6px;"></span>').appendTo(tr).wrap('<td></td>');
		$('<td><div class="pagination-btn-separator"></div></td>').appendTo(tr);
		bb.next = createButton('next');
		bb.last = createButton('last');
		if (opts.showRefresh){
			$('<td><div class="pagination-btn-separator"></div></td>').appendTo(tr);
			bb.refresh = createButton('refresh');
		}
		if (opts.buttons){
			$('<td><div class="pagination-btn-separator"></div></td>').appendTo(tr);
			for(var i=0; i<opts.buttons.length; i++){
				var btn = opts.buttons[i];
				if (btn == '-') {
					$('<td><div class="pagination-btn-separator"></div></td>').appendTo(tr);
				} else {
					var td = $('<td></td>').appendTo(tr);
					var a = $('<a href="javascript:void(0)"></a>').appendTo(td);
					a[0].onclick = eval(btn.handler || function(){});
					a.linkbutton($.extend({}, btn, {
						plain:true
					}));
				}
			}
		}
		$('<div class="pagination-info"></div>').appendTo(pager);
		$('<div style="clear:both;"></div>').appendTo(pager);
	}
	
	function selectPage(target, page){
		var opts = $.data(target, 'pagination').options;
		var pageCount = Math.ceil(opts.total/opts.pageSize) || 1;
		opts.pageNumber = page;
		if (opts.pageNumber < 1){opts.pageNumber = 1;}
		if (opts.pageNumber > pageCount){opts.pageNumber = pageCount}
		refreshData(target, {pageNumber:opts.pageNumber});
//		refreshData(target, {pageNumber:page});
		opts.onSelectPage.call(target, opts.pageNumber, opts.pageSize);
	}
	
	function refreshData(target, param){
		var opts = $.data(target, 'pagination').options;
		var bb = $.data(target, 'pagination').bb;
		
		$.extend(opts, param||{});
		
		var ps = $(target).find('select.pagination-page-list');
		if (ps.length){
			ps.val(opts.pageSize+'');
			opts.pageSize = parseInt(ps.val());
		}
		
		var pageCount = Math.ceil(opts.total/opts.pageSize) || 1;
//		if (opts.pageNumber < 1){opts.pageNumber = 1;}
//		if (opts.pageNumber > pageCount){opts.pageNumber = pageCount}
		bb.num.val(opts.pageNumber);
		bb.after.html(opts.afterPageText.replace(/{pages}/, pageCount));
		
		var pinfo = opts.displayMsg;
		pinfo = pinfo.replace(/{from}/, opts.total==0 ? 0 : opts.pageSize*(opts.pageNumber-1)+1);
		pinfo = pinfo.replace(/{to}/, Math.min(opts.pageSize*(opts.pageNumber), opts.total));
		pinfo = pinfo.replace(/{total}/, opts.total);
		
		$(target).find('div.pagination-info').html(pinfo);
		
		bb.first.add(bb.prev).linkbutton({disabled: (opts.pageNumber == 1)});
		bb.next.add(bb.last).linkbutton({disabled: (opts.pageNumber == pageCount)});
		
		setLoadStatus(target, opts.loading);
	}
	
	function setLoadStatus(target, loading){
		var opts = $.data(target, 'pagination').options;
		var bb = $.data(target, 'pagination').bb;
		opts.loading = loading;
		if (opts.showRefresh){
			if (opts.loading){
				bb.refresh.linkbutton({iconCls:'pagination-loading'});
			} else {
				bb.refresh.linkbutton({iconCls:'pagination-load'});
			}
		}
	}
	
	$.fn.pagination = function(options, param) {
		if (typeof options == 'string'){
			return $.fn.pagination.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var opts;
			var state = $.data(this, 'pagination');
			if (state) {
				opts = $.extend(state.options, options);
			} else {
				opts = $.extend({}, $.fn.pagination.defaults, $.fn.pagination.parseOptions(this), options);
				$.data(this, 'pagination', {
					options: opts
				});
			}
			
			buildToolbar(this);
			refreshData(this);
			
		});
	};
	
	$.fn.pagination.methods = {
		options: function(jq){
			return $.data(jq[0], 'pagination').options;
		},
		loading: function(jq){
			return jq.each(function(){
				setLoadStatus(this, true);
			});
		},
		loaded: function(jq){
			return jq.each(function(){
				setLoadStatus(this, false);
			});
		},
		refresh: function(jq, options){
			return jq.each(function(){
				refreshData(this, options);
			});
		},
		select: function(jq, page){
			return jq.each(function(){
				selectPage(this, page);
			});
		}
	};
	
	$.fn.pagination.parseOptions = function(target){
		var t = $(target);
		return $.extend({},
				$.parser.parseOptions(target, [
					{total:'number',pageSize:'number',pageNumber:'number'},
					{loading:'boolean',showPageList:'boolean',showRefresh:'boolean'}
				]), {
			pageList: (t.attr('pageList') ? eval(t.attr('pageList')) : undefined)
		});
	};
	
	$.fn.pagination.defaults = {
		total: 1,
		pageSize: 10,
		pageNumber: 1,
		pageList: [10,20,30,50],
		loading: false,
		buttons: null,
		showPageList: true,
		showRefresh: true,
		
		onSelectPage: function(pageNumber, pageSize){},
		onBeforeRefresh: function(pageNumber, pageSize){},
		onRefresh: function(pageNumber, pageSize){},
		onChangePageSize: function(pageSize){},
		
		beforePageText: 'Page',
		afterPageText: 'of {pages}',
		displayMsg: 'Displaying {from} to {to} of {total} items',
		
		nav: {
			first: {
				iconCls: 'pagination-first',
				handler: function(){
					var opts = $(this).pagination('options');
					if (opts.pageNumber > 1){$(this).pagination('select', 1)}
				}
			},
			prev: {
				iconCls: 'pagination-prev',
				handler: function(){
					var opts = $(this).pagination('options');
					if (opts.pageNumber > 1){$(this).pagination('select', opts.pageNumber - 1)}
				}
			},
			next: {
				iconCls: 'pagination-next',
				handler: function(){
					var opts = $(this).pagination('options');
					var pageCount = Math.ceil(opts.total/opts.pageSize);
					if (opts.pageNumber < pageCount){$(this).pagination('select', opts.pageNumber + 1)}
				}
			},
			last: {
				iconCls: 'pagination-last',
				handler: function(){
					var opts = $(this).pagination('options');
					var pageCount = Math.ceil(opts.total/opts.pageSize);
					if (opts.pageNumber < pageCount){$(this).pagination('select', pageCount)}
				}
			},
			refresh: {
				iconCls: 'pagination-refresh',
				handler: function(){
					var opts = $(this).pagination('options');
					if (opts.onBeforeRefresh.call(this, opts.pageNumber, opts.pageSize) != false){
						$(this).pagination('select', opts.pageNumber);
						opts.onRefresh.call(this, opts.pageNumber, opts.pageSize);
					}
				}
			}
		}
	};
})(jQuery);
/**
 * tree - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 * Dependencies:
 * 	 draggable
 *   droppable
 *   
 * Node is a javascript object which contains following properties:
 * 1 id: An identity value bind to the node.
 * 2 text: Text to be showed.
 * 3 checked: Indicate whether the node is checked selected.
 * 3 attributes: Custom attributes bind to the node.
 * 4 target: Target DOM object.
 */
(function($){
	/**
	 * wrap the <ul> tag as a tree and then return it.
	 */
	function wrapTree(target){
		var tree = $(target);
		tree.addClass('tree');
		return tree;
	}
	
	function parseTreeData(target){
		var data = [];
		
		getData(data, $(target));
		
		function getData(aa, tree){
			tree.children('li').each(function(){
				var node = $(this);
				var item = $.extend({}, $.parser.parseOptions(this, ['id','iconCls','state']), {
					checked: (node.attr('checked') ? true : undefined)
				});
				
				item.text = node.children('span').html();
				if (!item.text){
					item.text = node.html();
				}
				
				var subTree = node.children('ul');
				if (subTree.length){
					item.children = [];
					getData(item.children, subTree);
				}
				aa.push(item);
			});
		}
		return data;
	}
	
	function bindTreeEvents(target){
		var opts = $.data(target, 'tree').options;
		$(target).unbind().bind('mouseover', function(e){
			var tt = $(e.target);
			var node = tt.closest('div.tree-node');
			if (!node.length){return;}
			node.addClass('tree-node-hover');
			if (tt.hasClass('tree-hit')){
				if (tt.hasClass('tree-expanded')){
					tt.addClass('tree-expanded-hover');
				} else {
					tt.addClass('tree-collapsed-hover');
				}
			}
			e.stopPropagation();
		}).bind('mouseout', function(e){
			var tt = $(e.target);
			var node = tt.closest('div.tree-node');
			if (!node.length){return;}
			node.removeClass('tree-node-hover');
			if (tt.hasClass('tree-hit')){
				if (tt.hasClass('tree-expanded')){
					tt.removeClass('tree-expanded-hover');
				} else {
					tt.removeClass('tree-collapsed-hover');
				}
			}
			e.stopPropagation();
		}).bind('click', function(e){
			var tt = $(e.target);
			var node = tt.closest('div.tree-node');
			if (!node.length){return;}
			if (tt.hasClass('tree-hit')){
				toggleNode(target, node[0]);
				return false;
			} else if (tt.hasClass('tree-checkbox')){
				checkNode(target, node[0], !tt.hasClass('tree-checkbox1'));
				return false;
			} else {
				selectNode(target, node[0]);
				opts.onClick.call(target, getNode(target, node[0]));
			}
			e.stopPropagation();
		}).bind('dblclick', function(e){
			var node = $(e.target).closest('div.tree-node');
			if (!node.length){return;}
			selectNode(target, node[0]);
			opts.onDblClick.call(target, getNode(target, node[0]));
			e.stopPropagation();
		}).bind('contextmenu', function(e){
			var node = $(e.target).closest('div.tree-node');
			if (!node.length){return;}
			opts.onContextMenu.call(target, e, getNode(target, node[0]));
			e.stopPropagation();
		});
	}
	
	function disableDnd(target){
		var nodes = $(target).find('div.tree-node');
		nodes.draggable('disable');
		nodes.css('cursor', 'pointer');
	}
	
	function enableDnd(target){
		var state = $.data(target, 'tree');
		var opts = state.options;
		var tree = state.tree;
		state.disabledNodes = [];
		
		tree.find('div.tree-node').draggable({
			disabled: false,
			revert: true,
			cursor: 'pointer',
			proxy: function(source){
				var p = $('<div class="tree-node-proxy"></div>').appendTo('body');
//				var p = $('<div class="tree-node-proxy tree-dnd-no"></div>').appendTo('body');
				p.html('<span class="tree-dnd-icon tree-dnd-no">&nbsp;</span>'+$(source).find('.tree-title').html());
				p.hide();
				return p;
			},
			deltaX: 15,
			deltaY: 15,
			onBeforeDrag: function(e){
				if (opts.onBeforeDrag.call(target, getNode(target, this)) == false){return false}
				if ($(e.target).hasClass('tree-hit') || $(e.target).hasClass('tree-checkbox')){return false;}
				if (e.which != 1){return false;}
				$(this).next('ul').find('div.tree-node').droppable({accept:'no-accept'});	// the child node can't be dropped
				var indent = $(this).find('span.tree-indent');
				if (indent.length){
					e.data.offsetWidth -= indent.length*indent.width();
				}
			},
			onStartDrag: function(){
				$(this).draggable('proxy').css({
					left:-10000,
					top:-10000
				});
				opts.onStartDrag.call(target, getNode(target, this));
				var node = getNode(target, this);
				if (node.id == undefined){
					node.id = 'easyui_tree_node_id_temp';
					updateNode(target, node);
				}
				state.draggingNodeId = node.id;	// store the dragging node id
			},
			onDrag: function(e){
				var x1=e.pageX,y1=e.pageY,x2=e.data.startX,y2=e.data.startY;
				var d = Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
				if (d>3){	// when drag a little distance, show the proxy object
					$(this).draggable('proxy').show();
				}
				this.pageY = e.pageY;
			},
			onStopDrag: function(){
				$(this).next('ul').find('div.tree-node').droppable({accept:'div.tree-node'}); // restore the accept property of child nodes
				for(var i=0; i<state.disabledNodes.length; i++){
					$(state.disabledNodes[i]).droppable('enable');
				}
				state.disabledNodes = [];
				// get the source node
				var node = findNode(target, state.draggingNodeId);
				if (node && node.id == 'easyui_tree_node_id_temp'){
					node.id = '';
					updateNode(target, node);
				}
				opts.onStopDrag.call(target, node);
			}
		}).droppable({
			accept:'div.tree-node',
			onDragEnter: function(e, source){
				if (opts.onDragEnter.call(target, this, getNode(target, source)) == false){
					allowDrop(source, false);
//					$(source).draggable('proxy').removeClass('tree-dnd-yes').addClass('tree-dnd-no');
					$(this).removeClass('tree-node-append tree-node-top tree-node-bottom');
					$(this).droppable('disable');
					state.disabledNodes.push(this);
				}
			},
			onDragOver: function(e, source){
				if ($(this).droppable('options').disabled){return}
				var pageY = source.pageY;
				var top = $(this).offset().top;
				var bottom = top + $(this).outerHeight();
				
				allowDrop(source, true);
//				$(source).draggable('proxy').removeClass('tree-dnd-no').addClass('tree-dnd-yes');
				$(this).removeClass('tree-node-append tree-node-top tree-node-bottom');
				if (pageY > top + (bottom - top) / 2){
					if (bottom - pageY < 5){
						$(this).addClass('tree-node-bottom');
					} else {
						$(this).addClass('tree-node-append');
					}
				} else {
					if (pageY - top < 5){
						$(this).addClass('tree-node-top');
					} else {
						$(this).addClass('tree-node-append');
					}
				}
				if (opts.onDragOver.call(target, this, getNode(target, source)) == false){
					allowDrop(source, false);
//					$(source).draggable('proxy').removeClass('tree-dnd-yes').addClass('tree-dnd-no');
					$(this).removeClass('tree-node-append tree-node-top tree-node-bottom');
					$(this).droppable('disable');
					state.disabledNodes.push(this);
				}
			},
			onDragLeave: function(e, source){
				allowDrop(source, false);
//				$(source).draggable('proxy').removeClass('tree-dnd-yes').addClass('tree-dnd-no');
				$(this).removeClass('tree-node-append tree-node-top tree-node-bottom');
				opts.onDragLeave.call(target, this, getNode(target, source));
			},
			onDrop: function(e, source){
				var dest = this;
				var action, point;
				if ($(this).hasClass('tree-node-append')){
					action = append;
				} else {
					action = insert;
					point = $(this).hasClass('tree-node-top') ? 'top' : 'bottom';
				}
				
//				setTimeout(function(){
//				}, 0);
				if (opts.onBeforeDrop.call(target, dest, getData(target, source), point) == false){
					$(this).removeClass('tree-node-append tree-node-top tree-node-bottom');
					return;
				}
				action(source, dest, point);
				$(this).removeClass('tree-node-append tree-node-top tree-node-bottom');
			}
		});
		
		function allowDrop(source, allowed){
			var icon = $(source).draggable('proxy').find('span.tree-dnd-icon');
			icon.removeClass('tree-dnd-yes tree-dnd-no').addClass(allowed ? 'tree-dnd-yes' : 'tree-dnd-no');
		}
		
		function append(source, dest){
			if (getNode(target, dest).state == 'closed'){
				expandNode(target, dest, function(){
					doAppend();
				});
			} else {
				doAppend();
			}
			
			function doAppend(){
				var node = $(target).tree('pop', source);
				$(target).tree('append', {
					parent: dest,
					data: [node]
				});
				opts.onDrop.call(target, dest, node, 'append');
			}
		}
		
		function insert(source, dest, point){
			var param = {};
			if (point == 'top'){
				param.before = dest;
			} else {
				param.after = dest;
			}
			
			var node = $(target).tree('pop', source);
			param.data = node;
			$(target).tree('insert', param);
			opts.onDrop.call(target, dest, node, point);
		}
	}
	
	function checkNode(target, nodeEl, checked){
		var opts = $.data(target, 'tree').options;
		if (!opts.checkbox) {return;}
		
		var nodedata = getNode(target, nodeEl);
		if (opts.onBeforeCheck.call(target, nodedata, checked) == false){return;}
		
		var node = $(nodeEl);
		var ck = node.find('.tree-checkbox');
		ck.removeClass('tree-checkbox0 tree-checkbox1 tree-checkbox2');
		if (checked){
			ck.addClass('tree-checkbox1');
		} else {
			ck.addClass('tree-checkbox0');
		}
		if (opts.cascadeCheck){
			setParentCheckbox(node);
			setChildCheckbox(node);
		}
		
		opts.onCheck.call(target, nodedata, checked);
		
		function setChildCheckbox(node){
			var childck = node.next().find('.tree-checkbox');
			childck.removeClass('tree-checkbox0 tree-checkbox1 tree-checkbox2');
			if (node.find('.tree-checkbox').hasClass('tree-checkbox1')){
				childck.addClass('tree-checkbox1');
			} else {
				childck.addClass('tree-checkbox0');
			}
		}
		
		function setParentCheckbox(node){
			var pnode = getParentNode(target, node[0]);
			if (pnode){
				var ck = $(pnode.target).find('.tree-checkbox');
				ck.removeClass('tree-checkbox0 tree-checkbox1 tree-checkbox2');
				if (isAllSelected(node)){
					ck.addClass('tree-checkbox1');
				} else if (isAllNull(node)){
					ck.addClass('tree-checkbox0');
				} else {
					ck.addClass('tree-checkbox2');
				}
				setParentCheckbox($(pnode.target));
			}
			
			function isAllSelected(n){
				var ck = n.find('.tree-checkbox');
				if (ck.hasClass('tree-checkbox0') || ck.hasClass('tree-checkbox2')) return false;
				var b = true;
				n.parent().siblings().each(function(){
					if (!$(this).children('div.tree-node').children('.tree-checkbox').hasClass('tree-checkbox1')){
						b = false;
					}
				});
				return b;
			}
			function isAllNull(n){
				var ck = n.find('.tree-checkbox');
				if (ck.hasClass('tree-checkbox1') || ck.hasClass('tree-checkbox2')) return false;
				var b = true;
				n.parent().siblings().each(function(){
					if (!$(this).children('div.tree-node').children('.tree-checkbox').hasClass('tree-checkbox0')){
						b = false;
					}
				});
				return b;
			}
		}
	}
	
	/**
	 * when append or remove node, adjust its parent node check status.
	 */
	function adjustCheck(target, nodeEl){
		var opts = $.data(target, 'tree').options;
		var node = $(nodeEl);
		if (isLeaf(target, nodeEl)){
			var ck = node.find('.tree-checkbox');
			if (ck.length){
				if (ck.hasClass('tree-checkbox1')){
					checkNode(target, nodeEl, true);
				} else {
					checkNode(target, nodeEl, false);
				}
			} else if (opts.onlyLeafCheck){
				$('<span class="tree-checkbox tree-checkbox0"></span>').insertBefore(node.find('.tree-title'));
//				bindTreeEvents(target);
			}
		} else {
			var ck = node.find('.tree-checkbox');
			if (opts.onlyLeafCheck){
				ck.remove();
			} else {
				if (ck.hasClass('tree-checkbox1')){
					checkNode(target, nodeEl, true);
				} else if (ck.hasClass('tree-checkbox2')){
					var allchecked = true;
					var allunchecked = true;
					var children = getChildren(target, nodeEl);
					for(var i=0; i<children.length; i++){
						if (children[i].checked){
							allunchecked = false;
						} else {
							allchecked = false;
						}
					}
					if (allchecked){
						checkNode(target, nodeEl, true);
					}
					if (allunchecked){
						checkNode(target, nodeEl, false);
					}
				}
			}
		}
	}
	
	/**
	 * load tree data to <ul> tag
	 * ul: the <ul> dom element
	 * data: array, the tree node data
	 * append: defines if to append data
	 */
	function loadData(target, ul, data, append){
		var opts = $.data(target, 'tree').options;
		data = opts.loadFilter.call(target, data, $(ul).prev('div.tree-node')[0]);
		
		if (!append){
			$(ul).empty();
		}
		
		var checkedNodes = [];
		var depth = $(ul).prev('div.tree-node').find('span.tree-indent, span.tree-hit').length;
		appendNodes(ul, data, depth);
//		bindTreeEvents(target);
		if (opts.dnd){
			enableDnd(target);
		} else {
			disableDnd(target);
		}
		
		for(var i=0; i<checkedNodes.length; i++){
			checkNode(target, checkedNodes[i], true);
		}
		
		setTimeout(function(){
			showLines(target, target);
		}, 0);
		
		var nodedata = null;
		if (target != ul){
			var node = $(ul).prev();
			nodedata = getNode(target, node[0]);
		}
		opts.onLoadSuccess.call(target, nodedata, data);
		
		function appendNodes(ul, children, depth){
			for(var i=0; i<children.length; i++){
				var li = $('<li></li>').appendTo(ul);
				var item = children[i];
				
				// the node state has only 'open' or 'closed' attribute
				if (item.state != 'open' && item.state != 'closed'){
					item.state = 'open';
				}
				
				var node = $('<div class="tree-node"></div>').appendTo(li);
				node.attr('node-id', item.id);
				
				// store node attributes
				$.data(node[0], 'tree-node', {
					id: item.id,
					text: item.text,
					iconCls: item.iconCls,
					attributes: item.attributes
				});
				
				$('<span class="tree-title"></span>').html(opts.formatter.call(target, item)).appendTo(node);
//				$('<span class="tree-title"></span>').html(item.text).appendTo(node);
				
				if (opts.checkbox){
					if (opts.onlyLeafCheck){
						if (item.state == 'open' && (!item.children || !item.children.length)){
							if (item.checked){
								$('<span class="tree-checkbox tree-checkbox1"></span>').prependTo(node);
							} else {
								$('<span class="tree-checkbox tree-checkbox0"></span>').prependTo(node);
							}
						}
					} else {
						if (item.checked){
							$('<span class="tree-checkbox tree-checkbox1"></span>').prependTo(node);
							checkedNodes.push(node[0]);
						} else {
							$('<span class="tree-checkbox tree-checkbox0"></span>').prependTo(node);
						}
					}
				}
				
				if (item.children && item.children.length){
					var subul = $('<ul></ul>').appendTo(li);
					if (item.state == 'open'){
						$('<span class="tree-icon tree-folder tree-folder-open"></span>').addClass(item.iconCls).prependTo(node);
						$('<span class="tree-hit tree-expanded"></span>').prependTo(node);
					} else {
						$('<span class="tree-icon tree-folder"></span>').addClass(item.iconCls).prependTo(node);
						$('<span class="tree-hit tree-collapsed"></span>').prependTo(node);
						subul.css('display','none');
					}
					appendNodes(subul, item.children, depth+1);
				} else {
					if (item.state == 'closed'){
						$('<span class="tree-icon tree-folder"></span>').addClass(item.iconCls).prependTo(node);
						$('<span class="tree-hit tree-collapsed"></span>').prependTo(node);
					} else {
						$('<span class="tree-icon tree-file"></span>').addClass(item.iconCls).prependTo(node);
						$('<span class="tree-indent"></span>').prependTo(node);
					}
				}
				for(var j=0; j<depth; j++){
					$('<span class="tree-indent"></span>').prependTo(node);
				}
			}
		}
	}
	
	/**
	 * draw tree lines
	 */
	function showLines(target, ul, called){
		var opts = $.data(target, 'tree').options;
		if (!opts.lines) return;
		
		if (!called){
			called = true;
			$(target).find('span.tree-indent').removeClass('tree-line tree-join tree-joinbottom');
			$(target).find('div.tree-node').removeClass('tree-node-last tree-root-first tree-root-one');
			var roots = $(target).tree('getRoots');
			if (roots.length > 1){
				$(roots[0].target).addClass('tree-root-first');
			} else if (roots.length == 1){
				$(roots[0].target).addClass('tree-root-one');
			}
		}
		$(ul).children('li').each(function(){
			var node = $(this).children('div.tree-node');
			var ul = node.next('ul');
			if (ul.length){
				if ($(this).next().length){
					_line(node);
				}
				showLines(target, ul, called);
			} else {
				_join(node);
			}
		});
		var lastNode = $(ul).children('li:last').children('div.tree-node').addClass('tree-node-last');
		lastNode.children('span.tree-join').removeClass('tree-join').addClass('tree-joinbottom');
		
		function _join(node, hasNext){
			var icon = node.find('span.tree-icon');
			icon.prev('span.tree-indent').addClass('tree-join');
		}
		
		function _line(node){
			var depth = node.find('span.tree-indent, span.tree-hit').length;
			node.next().find('div.tree-node').each(function(){
				$(this).children('span:eq('+(depth-1)+')').addClass('tree-line');
			});
		}
	}
	
	/**
	 * request remote data and then load nodes in the <ul> tag.
	 * ul: the <ul> dom element
	 * param: request parameter
	 */
	function request(target, ul, param, callback){
		var opts = $.data(target, 'tree').options;
		
		param = param || {};
		
		var nodedata = null;
		if (target != ul){
			var node = $(ul).prev();
			nodedata = getNode(target, node[0]);
		}

		if (opts.onBeforeLoad.call(target, nodedata, param) == false) return;
		
		var folder = $(ul).prev().children('span.tree-folder');
		folder.addClass('tree-loading');
		var result = opts.loader.call(target, param, function(data){
			folder.removeClass('tree-loading');
			loadData(target, ul, data);
			if (callback){
				callback();
			}
		}, function(){
			folder.removeClass('tree-loading');
			opts.onLoadError.apply(target, arguments);
			if (callback){
				callback();
			}
		});
		if (result == false){
			folder.removeClass('tree-loading');
		}
	}
	
	function expandNode(target, nodeEl, callback){
		var opts = $.data(target, 'tree').options;
		
		var hit = $(nodeEl).children('span.tree-hit');
		if (hit.length == 0) return;	// is a leaf node
		if (hit.hasClass('tree-expanded')) return;	// has expanded
		
		var node = getNode(target, nodeEl);
		if (opts.onBeforeExpand.call(target, node) == false) return;
		
		hit.removeClass('tree-collapsed tree-collapsed-hover').addClass('tree-expanded');
		hit.next().addClass('tree-folder-open');
		var ul = $(nodeEl).next();
		if (ul.length){
			if (opts.animate){
				ul.slideDown('normal', function(){
					opts.onExpand.call(target, node);
					if (callback) callback();
				});
			} else {
				ul.css('display','block');
				opts.onExpand.call(target, node);
				if (callback) callback();
			}
		} else {
			var subul = $('<ul style="display:none"></ul>').insertAfter(nodeEl);
			// request children nodes data
			request(target, subul[0], {id:node.id}, function(){
				if (subul.is(':empty')){
					subul.remove();	// if load children data fail, remove the children node container
				}
				if (opts.animate){
					subul.slideDown('normal', function(){
						opts.onExpand.call(target, node);
						if (callback) callback();
					});
				} else {
					subul.css('display','block');
					opts.onExpand.call(target, node);
					if (callback) callback();
				}
			});
		}
	}
	
	function collapseNode(target, nodeEl){
		var opts = $.data(target, 'tree').options;
		
		var hit = $(nodeEl).children('span.tree-hit');
		if (hit.length == 0) return;	// is a leaf node
		if (hit.hasClass('tree-collapsed')) return;	// has collapsed
		
		var node = getNode(target, nodeEl);
		if (opts.onBeforeCollapse.call(target, node) == false) return;
		
		hit.removeClass('tree-expanded tree-expanded-hover').addClass('tree-collapsed');
		hit.next().removeClass('tree-folder-open');
		var ul = $(nodeEl).next();
		if (opts.animate){
			ul.slideUp('normal', function(){
				opts.onCollapse.call(target, node);
			});
		} else {
			ul.css('display','none');
			opts.onCollapse.call(target, node);
		}
	}
	
	function toggleNode(target, nodeEl){
		var hit = $(nodeEl).children('span.tree-hit');
		if (hit.length == 0) return;	// is a leaf node
		
		if (hit.hasClass('tree-expanded')){
			collapseNode(target, nodeEl);
		} else {
			expandNode(target, nodeEl);
		}
	}
	
	function expandAllNode(target, nodeEl){
		var nodes = getChildren(target, nodeEl);
		if (nodeEl){
			nodes.unshift(getNode(target, nodeEl));
		}
		for(var i=0; i<nodes.length; i++){
			expandNode(target, nodes[i].target);
		}
	}
	
	function expandToNode(target, nodeEl){
		var nodes = [];
		var p = getParentNode(target, nodeEl);
		while(p){
			nodes.unshift(p);
			p = getParentNode(target, p.target);
		}
		for(var i=0; i<nodes.length; i++){
			expandNode(target, nodes[i].target);
		}
	}
	
	function collapseAllNode(target, nodeEl){
		var nodes = getChildren(target, nodeEl);
		if (nodeEl){
			nodes.unshift(getNode(target, nodeEl));
		}
		for(var i=0; i<nodes.length; i++){
			collapseNode(target, nodes[i].target);
		}
	}
	
	/**
	 * get the first root node, if no root node exists, return null.
	 */
	function getRootNode(target){
		var roots = getRootNodes(target);
		if (roots.length){
			return roots[0];
		} else {
			return null;
		}
	}
	
	/**
	 * get the root nodes.
	 */
	function getRootNodes(target){
		var roots = [];
		$(target).children('li').each(function(){
			var node = $(this).children('div.tree-node');
			roots.push(getNode(target, node[0]));
		});
		return roots;
	}
	
	/**
	 * get all child nodes corresponding to specified node
	 * nodeEl: the node DOM element
	 */
	function getChildren(target, nodeEl){
		var nodes = [];
		if (nodeEl){
			getNodes($(nodeEl));
		} else {
			var roots = getRootNodes(target);
			for(var i=0; i<roots.length; i++){
				nodes.push(roots[i]);
				getNodes($(roots[i].target));
			}
		}
		function getNodes(node){
			node.next().find('div.tree-node').each(function(){
				nodes.push(getNode(target, this));
			});
		}
		return nodes;
	}
	
	/**
	 * get the parent node
	 * nodeEl: DOM object, from which to search it's parent node 
	 */
	function getParentNode(target, nodeEl){
		var ul = $(nodeEl).parent().parent();
		if (ul[0] == target){
			return null;
		} else {
			return getNode(target, ul.prev()[0]);
		}
	}
	
	/**
	 * get the specified state nodes
	 * the state available values are: 'checked','unchecked','indeterminate', default is 'checked'.
	 */
	function getCheckedNode(target, state){
		state = state || 'checked';
		var selector = '';
		if (state == 'checked') {
			selector = 'span.tree-checkbox1';
		} else if (state == 'unchecked'){
			selector = 'span.tree-checkbox0';
		} else if (state == 'indeterminate'){
			selector = 'span.tree-checkbox2';
		}
		
		var nodes = [];
		$(target).find(selector).each(function(){
			var node = $(this).parent();
			nodes.push(getNode(target, node[0]));
		});
		return nodes;
	}
	
	/**
	 * Get the selected node data which contains following properties: id,text,attributes,target
	 */
	function getSelectedNode(target){
		var node = $(target).find('div.tree-node-selected');
		if (node.length){
			return getNode(target, node[0]);
		} else {
			return null;
		}
	}
	
	/**
	 * Append nodes to tree.
	 * The param parameter has two properties:
	 * 1 parent: DOM object, the parent node to append to.
	 * 2 data: array, the nodes data.
	 */
	function appendNodes(target, param){
		var node = $(param.parent);
		
		var ul;
		if (node.length == 0){
			ul = $(target);
		} else {
			ul = node.next();
			if (ul.length == 0){
				ul = $('<ul></ul>').insertAfter(node);
			}
		}
		
		// ensure the node is a folder node
		if (param.data && param.data.length){
			var nodeIcon = node.find('span.tree-icon');
			if (nodeIcon.hasClass('tree-file')){
				nodeIcon.removeClass('tree-file').addClass('tree-folder tree-folder-open');
//				nodeIcon.removeClass('tree-file').addClass('tree-folder');
				var hit = $('<span class="tree-hit tree-expanded"></span>').insertBefore(nodeIcon);
				if (hit.prev().length){
					hit.prev().remove();
				}
			}
		}
		
		loadData(target, ul[0], param.data, true);
		
		adjustCheck(target, ul.prev());
	}
	
	/**
	 * insert node to before or after specified node
	 * param has the following properties:
	 * before: DOM object, the node to insert before
	 * after: DOM object, the node to insert after
	 * data: object, the node data 
	 */
	function insertNode(target, param){
		var ref = param.before || param.after;
		var pnode = getParentNode(target, ref);
		var li;
		if (pnode){
			appendNodes(target, {
				parent: pnode.target,
				data: [param.data]
			});
			li = $(pnode.target).next().children('li:last');
		} else {
			appendNodes(target, {
				parent: null,
				data: [param.data]
			});
			li = $(target).children('li:last');
		}
		if (param.before){
			li.insertBefore($(ref).parent());
		} else {
			li.insertAfter($(ref).parent());
		}
	}
	
	/**
	 * Remove node from tree. 
	 * param: DOM object, indicate the node to be removed.
	 */
	function removeNode(target, nodeEl){
		var parent = getParentNode(target, nodeEl);
		var node = $(nodeEl);
		var li = node.parent();
		var ul = li.parent();
		li.remove();
		if (ul.children('li').length == 0){
			var node = ul.prev();
			
			node.find('.tree-icon').removeClass('tree-folder').addClass('tree-file');
			node.find('.tree-hit').remove();
			$('<span class="tree-indent"></span>').prependTo(node);
			if (ul[0] != target){
				ul.remove();
			}
		}
		if (parent){
			adjustCheck(target, parent.target);
		}
		
		showLines(target, target);
	}
	
	/**
	 * get specified node data, include its children data
	 */
	function getData(target, nodeEl){
		/**
		 * retrieve all children data which is stored in specified array
		 */
		function retrieveChildData(aa, ul){
			ul.children('li').each(function(){
				var node = $(this).children('div.tree-node');
				var nodedata = getNode(target, node[0]);
				var sub = $(this).children('ul');
				if (sub.length){
					nodedata.children = [];
//					getData(nodedata.children, sub);
					retrieveChildData(nodedata.children, sub);
				}
				aa.push(nodedata);
			});
		}
		
		if (nodeEl){
			var nodedata = getNode(target, nodeEl);
			nodedata.children = [];
			retrieveChildData(nodedata.children, $(nodeEl).next());
			return nodedata;
		} else {
			return null;
		}
	}
	
	function updateNode(target, param){
		var opts = $.data(target, 'tree').options;
		var node = $(param.target);
		var oldData = getNode(target, param.target);
		if (oldData.iconCls){
			node.find('.tree-icon').removeClass(oldData.iconCls);
		}
		var data = $.extend({}, oldData, param);
		$.data(param.target, 'tree-node', data);
		
		node.attr('node-id', data.id);
		node.find('.tree-title').html(opts.formatter.call(target, data));
		if (data.iconCls){
			node.find('.tree-icon').addClass(data.iconCls);
		}
		if (oldData.checked != data.checked){
			checkNode(target, param.target, data.checked);
		}
	}
	
	/**
	 * get the specified node
	 */
	function getNode(target, nodeEl){
		var node = $.extend({}, $.data(nodeEl, 'tree-node'), {
			target: nodeEl,
			checked: $(nodeEl).find('.tree-checkbox').hasClass('tree-checkbox1')
		});
		if (!isLeaf(target, nodeEl)){
			node.state = $(nodeEl).find('.tree-hit').hasClass('tree-expanded') ? 'open' : 'closed';
		}
		return node;
	}
	
	function findNode(target, id){
		var node = $(target).find('div.tree-node[node-id=' + id + ']');
		if (node.length){
			return getNode(target, node[0]);
		} else {
			return null;
		}
	}
	
	/**
	 * select the specified node.
	 * nodeEl: DOM object, indicate the node to be selected.
	 */
	function selectNode(target, nodeEl){
		var opts = $.data(target, 'tree').options;
		var node = getNode(target, nodeEl);
		
		if (opts.onBeforeSelect.call(target, node) == false) return;
		
		$('div.tree-node-selected', target).removeClass('tree-node-selected');
		$(nodeEl).addClass('tree-node-selected');
		opts.onSelect.call(target, node);
	}
	
	/**
	 * Check if the specified node is leaf.
	 * nodeEl: DOM object, indicate the node to be checked.
	 */
	function isLeaf(target, nodeEl){
		var node = $(nodeEl);
		var hit = node.children('span.tree-hit');
		return hit.length == 0;
	}
	
	function beginEdit(target, nodeEl){
		var opts = $.data(target, 'tree').options;
		var node = getNode(target, nodeEl);
		
		if (opts.onBeforeEdit.call(target, node) == false) return;
		
		$(nodeEl).css('position', 'relative');
		var nt = $(nodeEl).find('.tree-title');
		var width = nt.outerWidth();
		nt.empty();
		var editor = $('<input class="tree-editor">').appendTo(nt);
		editor.val(node.text).focus();
		editor.width(width + 20);
		editor.height(document.compatMode=='CSS1Compat' ? (18-(editor.outerHeight()-editor.height())) : 18);
		editor.bind('click', function(e){
			return false;
		}).bind('mousedown', function(e){
			e.stopPropagation();
		}).bind('mousemove', function(e){
			e.stopPropagation();
		}).bind('keydown', function(e){
			if (e.keyCode == 13){	// enter
				endEdit(target, nodeEl);
				return false;
			} else if (e.keyCode == 27){	// esc
				cancelEdit(target, nodeEl);
				return false;
			}
		}).bind('blur', function(e){
			e.stopPropagation();
			endEdit(target, nodeEl);
		});
	}
	
	function endEdit(target, nodeEl){
		var opts = $.data(target, 'tree').options;
		$(nodeEl).css('position', '');
		var editor = $(nodeEl).find('input.tree-editor');
		var val = editor.val();
		editor.remove();
		var node = getNode(target, nodeEl);
		node.text = val;
		updateNode(target, node);
		opts.onAfterEdit.call(target, node);
	}
	
	function cancelEdit(target, nodeEl){
		var opts = $.data(target, 'tree').options;
		$(nodeEl).css('position', '');
		$(nodeEl).find('input.tree-editor').remove();
		var node = getNode(target, nodeEl);
		updateNode(target, node);
		opts.onCancelEdit.call(target, node);
	}
	
	$.fn.tree = function(options, param){
		if (typeof options == 'string'){
			return $.fn.tree.methods[options](this, param);
		}
		
		var options = options || {};
		return this.each(function(){
			var state = $.data(this, 'tree');
			var opts;
			if (state){
				opts = $.extend(state.options, options);
				state.options = opts;
			} else {
				opts = $.extend({}, $.fn.tree.defaults, $.fn.tree.parseOptions(this), options);
				$.data(this, 'tree', {
					options: opts,
					tree: wrapTree(this)
				});
				var data = parseTreeData(this);
				if (data.length && !opts.data){
					opts.data = data
				}
//				loadData(this, this, data);
			}
			bindTreeEvents(this);
			
			if (opts.lines){
				$(this).addClass('tree-lines');
			}
			
			if (opts.data){
				loadData(this, this, opts.data);
			} else {
				if (opts.dnd){
					enableDnd(this);
				} else {
					disableDnd(this);
				}
			}
//			if (opts.url){
//			}
			request(this, this);
		});
	};
	
	$.fn.tree.methods = {
		options: function(jq){
			return $.data(jq[0], 'tree').options;
		},
		loadData: function(jq, data){
			return jq.each(function(){
				loadData(this, this, data);
			});
		},
		getNode: function(jq, nodeEl){	// get the single node
			return getNode(jq[0], nodeEl);
		},
		getData: function(jq, nodeEl){	// get the specified node data, include its children
			return getData(jq[0], nodeEl);
		},
		reload: function(jq, nodeEl){
			return jq.each(function(){
				if (nodeEl){
					var node = $(nodeEl);
					var hit = node.children('span.tree-hit');
					hit.removeClass('tree-expanded tree-expanded-hover').addClass('tree-collapsed');
					node.next().remove();
					expandNode(this, nodeEl);
				} else {
					$(this).empty();
					request(this, this);
				}
			});
		},
		getRoot: function(jq){
			return getRootNode(jq[0]);
		},
		getRoots: function(jq){
			return getRootNodes(jq[0]);
		},
		getParent: function(jq, nodeEl){
			return getParentNode(jq[0], nodeEl);
		},
		getChildren: function(jq, nodeEl){
			return getChildren(jq[0], nodeEl);
		},
		getChecked: function(jq, state){	// the state available values are: 'checked','unchecked','indeterminate', default is 'checked'.
			return getCheckedNode(jq[0], state);
		},
		getSelected: function(jq){
			return getSelectedNode(jq[0]);
		},
		isLeaf: function(jq, nodeEl){
			return isLeaf(jq[0], nodeEl);
		},
		find: function(jq, id){
			return findNode(jq[0], id);
		},
		select: function(jq, nodeEl){
			return jq.each(function(){
				selectNode(this, nodeEl);
			});
		},
		check: function(jq, nodeEl){
			return jq.each(function(){
				checkNode(this, nodeEl, true);
			});
		},
		uncheck: function(jq, nodeEl){
			return jq.each(function(){
				checkNode(this, nodeEl, false);
			});
		},
		collapse: function(jq, nodeEl){
			return jq.each(function(){
				collapseNode(this, nodeEl);
			});
		},
		expand: function(jq, nodeEl){
			return jq.each(function(){
				expandNode(this, nodeEl);
			});
		},
		collapseAll: function(jq, nodeEl){
			return jq.each(function(){
				collapseAllNode(this, nodeEl);
			});
		},
		expandAll: function(jq, nodeEl){
			return jq.each(function(){
				expandAllNode(this, nodeEl);
			});
		},
		expandTo: function(jq, nodeEl){
			return jq.each(function(){
				expandToNode(this, nodeEl);
			});
		},
		toggle: function(jq, nodeEl){
			return jq.each(function(){
				toggleNode(this, nodeEl);
			});
		},
		append: function(jq, param){
			return jq.each(function(){
				appendNodes(this, param);
			});
		},
		insert: function(jq, param){
			return jq.each(function(){
				insertNode(this, param);
			});
		},
		remove: function(jq, nodeEl){
			return jq.each(function(){
				removeNode(this, nodeEl);
			});
		},
		pop: function(jq, nodeEl){
			var node = jq.tree('getData', nodeEl);
			jq.tree('remove', nodeEl);
			return node;
		},
		update: function(jq, param){
			return jq.each(function(){
				updateNode(this, param);
			});
		},
		enableDnd: function(jq){
			return jq.each(function(){
				enableDnd(this);
			});
		},
		disableDnd: function(jq){
			return jq.each(function(){
				disableDnd(this);
			});
		},
		beginEdit: function(jq, nodeEl){
			return jq.each(function(){
				beginEdit(this, nodeEl);
			});
		},
		endEdit: function(jq, nodeEl){
			return jq.each(function(){
				endEdit(this, nodeEl);
			});
		},
		cancelEdit: function(jq, nodeEl){
			return jq.each(function(){
				cancelEdit(this, nodeEl);
			});
		}
	};
	
	$.fn.tree.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.parser.parseOptions(target, [
			'url','method',
			{checkbox:'boolean',cascadeCheck:'boolean',onlyLeafCheck:'boolean'},
			{animate:'boolean',lines:'boolean',dnd:'boolean'}
		]));
	};
	
	$.fn.tree.defaults = {
		url: null,
		method: 'post',
		animate: false,
		checkbox: false,
		cascadeCheck: true,
		onlyLeafCheck: false,
		lines: false,
		dnd: false,
		data: null,
		formatter: function(node){
			return node.text;
		},
		loader: function(param, success, error){
			var opts = $(this).tree('options');
			if (!opts.url) return false;
			$.ajax({
				type: opts.method,
				url: opts.url,
				data: param,
				dataType: 'json',
				success: function(data){
					success(data);
				},
				error: function(){
					error.apply(this, arguments);
				}
			});
		},
		loadFilter: function(data, parent){
			return data;
		},
		
		onBeforeLoad: function(node, param){},
		onLoadSuccess: function(node, data){},
		onLoadError: function(){},
		onClick: function(node){},	// node: id,text,checked,attributes,target
		onDblClick: function(node){},	// node: id,text,checked,attributes,target
		onBeforeExpand: function(node){},
		onExpand: function(node){},
		onBeforeCollapse: function(node){},
		onCollapse: function(node){},
		onBeforeCheck: function(node, checked){},
		onCheck: function(node, checked){},
		onBeforeSelect: function(node){},
		onSelect: function(node){},
		onContextMenu: function(e, node){},
		onBeforeDrag: function(node){},	// return false to deny drag
		onStartDrag: function(node){},
		onStopDrag: function(node){},
		onDragEnter: function(target, source){},	// return false to deny drop
		onDragOver: function(target, source){},	// return false to deny drop
		onDragLeave: function(target, source){},
		onBeforeDrop: function(target, source, point){},
		onDrop: function(target, source, point){},	// point:'append','top','bottom'
		onBeforeEdit: function(node){},
		onAfterEdit: function(node){},
		onCancelEdit: function(node){}
	};
})(jQuery);
/**
 * progressbar - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 * Dependencies:
 * 	 none
 * 
 */
(function($){
	function init(target){
		$(target).addClass('progressbar');
		$(target).html('<div class="progressbar-text"></div><div class="progressbar-value"><div class="progressbar-text"></div></div>');
		return $(target);
	}
	
	function setSize(target,width){
		var opts = $.data(target, 'progressbar').options;
		var bar = $.data(target, 'progressbar').bar;
		if (width) opts.width = width;
		bar._outerWidth(opts.width)._outerHeight(opts.height);
		
		bar.find('div.progressbar-text').width(bar.width());
		bar.find('div.progressbar-text,div.progressbar-value').css({
			height: bar.height()+'px',
			lineHeight: bar.height()+'px'
		});
	}
	
	$.fn.progressbar = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.progressbar.methods[options];
			if (method){
				return method(this, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'progressbar');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'progressbar', {
					options: $.extend({}, $.fn.progressbar.defaults, $.fn.progressbar.parseOptions(this), options),
					bar: init(this)
				});
			}
			$(this).progressbar('setValue', state.options.value);
			setSize(this);
		});
	};
	
	$.fn.progressbar.methods = {
		options: function(jq){
			return $.data(jq[0], 'progressbar').options;
		},
		resize: function(jq, width){
			return jq.each(function(){
				setSize(this, width);
			});
		},
		getValue: function(jq){
			return $.data(jq[0], 'progressbar').options.value;
		},
		setValue: function(jq, value){
			if (value < 0) value = 0;
			if (value > 100) value = 100;
			return jq.each(function(){
				var opts = $.data(this, 'progressbar').options;
				var text = opts.text.replace(/{value}/, value);
				var oldValue = opts.value;
				opts.value = value;
				$(this).find('div.progressbar-value').width(value+'%');
				$(this).find('div.progressbar-text').html(text);
				if (oldValue != value){
					opts.onChange.call(this, value, oldValue);
				}
			});
		}
	};
	
	$.fn.progressbar.parseOptions = function(target){
		return $.extend({}, $.parser.parseOptions(target, ['width','height','text',{value:'number'}]));
	};
	
	$.fn.progressbar.defaults = {
		width: 'auto',
		height: 22,
		value: 0,	// percentage value
		text: '{value}%',
		onChange:function(newValue,oldValue){}
	};
})(jQuery);
/**
 * tooltip - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 */
(function($){
	function init(target){
		$(target).addClass('tooltip-f');
	}
	
	function bindEvents(target){
		var opts = $.data(target, 'tooltip').options;
		$(target).unbind('.tooltip').bind(opts.showEvent+'.tooltip', function(e){
			showTip(target, e);
		}).bind(opts.hideEvent+'.tooltip', function(e){
			hideTip(target, e);
		}).bind('mousemove.tooltip', function(e){
			if (opts.trackMouse){
				opts.trackMouseX = e.pageX;
				opts.trackMouseY = e.pageY;
				reposition(target);
			}
		});
	}
	
	function clearTimeouts(target){
		var state = $.data(target, 'tooltip');
		if (state.showTimer){
			clearTimeout(state.showTimer);
			state.showTimer = null;
		}
		if (state.hideTimer){
			clearTimeout(state.hideTimer);
			state.hideTimer = null;
		}
	}
	
	function reposition(target){
		var state = $.data(target, 'tooltip');
		if (!state || !state.tip){return}
		var opts = state.options;
		var tip = state.tip;
		
		if (opts.trackMouse){
			t = $();
			var left = opts.trackMouseX + opts.deltaX;
			var top = opts.trackMouseY + opts.deltaY;
		} else {
			var t = $(target);
			var left = t.offset().left + opts.deltaX;
			var top = t.offset().top + opts.deltaY;
		}
		switch(opts.position){
		case 'right':
			left += t._outerWidth() + 12 + (opts.trackMouse?12:0);
			top -= (tip._outerHeight() - t._outerHeight()) / 2;
			break;
		case 'left':
			left -= tip._outerWidth() + 12 + (opts.trackMouse?12:0);
			top -= (tip._outerHeight() - t._outerHeight()) / 2;
			break;
		case 'top':
			left -= (tip._outerWidth() - t._outerWidth()) / 2;
			top -= tip._outerHeight() + 12 + (opts.trackMouse?12:0);
			break;
		case 'bottom':
			left -= (tip._outerWidth() - t._outerWidth()) / 2;
			top += t._outerHeight() + 12 + (opts.trackMouse?12:0);
			break;
		}
		tip.css({
			left: left,
			top: top,
			zIndex: (opts.zIndex!=undefined ? opts.zIndex : ($.fn.window ? $.fn.window.defaults.zIndex++ : ''))
		});
		opts.onPosition.call(target, left, top);
	}
	
	function showTip(target, e){
		var state = $.data(target, 'tooltip');
		var opts = state.options;
		var tip = state.tip;
		if (!tip){
			tip = $(
				'<div tabindex="-1" class="tooltip">' +
					'<div class="tooltip-content"></div>' +
					'<div class="tooltip-arrow-outer"></div>' +
					'<div class="tooltip-arrow"></div>' +
				'</div>'
			).appendTo('body');
			state.tip = tip;
			updateTip(target);
		}
		tip.removeClass('tooltip-top tooltip-bottom tooltip-left tooltip-right').addClass('tooltip-'+opts.position);
		
		clearTimeouts(target);
		
		state.showTimer = setTimeout(function(){
			reposition(target);
			tip.show();
			opts.onShow.call(target, e);
			
			var arrowOuter = tip.children('.tooltip-arrow-outer');
			var arrow = tip.children('.tooltip-arrow');
			var bc = 'border-'+opts.position+'-color';
			arrowOuter.add(arrow).css({
				borderTopColor:'',
				borderBottomColor:'',
				borderLeftColor:'',
				borderRightColor:''
			});
			arrowOuter.css(bc, tip.css(bc));
			arrow.css(bc, tip.css('backgroundColor'));
		}, opts.showDelay);
	}
	
	function hideTip(target, e){
		var state = $.data(target, 'tooltip');
		if (state && state.tip){
			clearTimeouts(target);
			state.hideTimer = setTimeout(function(){
				state.tip.hide();
				state.options.onHide.call(target, e);
			}, state.options.hideDelay);
		}
	}
	
	function updateTip(target, content){
		var state = $.data(target, 'tooltip');
		var opts = state.options;
		if (content){opts.content = content;}
		if (!state.tip){return;}
		
		var cc = typeof opts.content == 'function' ? opts.content.call(target) : opts.content;
		state.tip.children('.tooltip-content').html(cc);
		opts.onUpdate.call(target, cc);
	}
	
	function destroyTip(target){
		var state = $.data(target, 'tooltip');
		if (state){
			clearTimeouts(target);
			var opts = state.options;
			if (state.tip){state.tip.remove();}
			if (opts._title){
				$(target).attr('title', opts._title);
			}
			$.removeData(target, 'tooltip');
			$(target).unbind('.tooltip').removeClass('tooltip-f');
			opts.onDestroy.call(target);
		}
	}
	
	$.fn.tooltip = function(options, param){
		if (typeof options == 'string'){
			return $.fn.tooltip.methods[options](this, param);
		}
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'tooltip');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'tooltip', {
					options: $.extend({}, $.fn.tooltip.defaults, $.fn.tooltip.parseOptions(this), options)
				});
				init(this);
			}
			bindEvents(this);
			updateTip(this);
		});
	};
	
	$.fn.tooltip.methods = {
		options: function(jq){
			return $.data(jq[0], 'tooltip').options;
		},
		tip: function(jq){
			return $.data(jq[0], 'tooltip').tip;
		},
		arrow: function(jq){
			return jq.tooltip('tip').children('.tooltip-arrow-outer,.tooltip-arrow');
		},
		show: function(jq, e){
			return jq.each(function(){
				showTip(this, e);
			});
		},
		hide: function(jq, e){
			return jq.each(function(){
				hideTip(this, e);
			});
		},
		update: function(jq, content){
			return jq.each(function(){
				updateTip(this, content);
			});
		},
		reposition: function(jq){
			return jq.each(function(){
				reposition(this);
			});
		},
		destroy: function(jq){
			return jq.each(function(){
				destroyTip(this);
			});
		}
	};
	
	$.fn.tooltip.parseOptions = function(target){
		var t = $(target);
		var opts = $.extend({}, $.parser.parseOptions(target, [
			'position','showEvent','hideEvent','content',
			{deltaX:'number',deltaY:'number',showDelay:'number',hideDelay:'number'}
		]), {
			_title: t.attr('title')
		});
		t.attr('title', '');
		if (!opts.content){
			opts.content = opts._title;
		}
		return opts;
	};
	
	$.fn.tooltip.defaults = {
		position: 'bottom',	// possible values are: 'left','right','top','bottom'
		content: null,
		trackMouse: false,
		deltaX: 0,
		deltaY: 0,
		showEvent: 'mouseenter',
		hideEvent: 'mouseleave',
		showDelay: 200,
		hideDelay: 100,
		
		onShow: function(e){},
		onHide: function(e){},
		onUpdate: function(content){},
		onPosition: function(left,top){},
		onDestroy: function(){}
	};
})(jQuery);
/**
 * panel - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 */
(function($){
	$.fn._remove = function(){
		return this.each(function(){
			$(this).remove();
			try{
				this.outerHTML = '';
			} catch(err){}
		});
	}
//	function removeNode(node){
//		node.each(function(){
//			$(this).remove();
//			if ($.browser.msie){
//				this.outerHTML = '';
//			}
//		});
//	}
	function removeNode(node){
		node._remove();
	}
	
	function setSize(target, param){
		var opts = $.data(target, 'panel').options;
		var panel = $.data(target, 'panel').panel;
		var pheader = panel.children('div.panel-header');
		var pbody = panel.children('div.panel-body');
		
		if (param){
			if (param.width) opts.width = param.width;
			if (param.height) opts.height = param.height;
			if (param.left != null) opts.left = param.left;
			if (param.top != null) opts.top = param.top;
		}
		
		opts.fit ? $.extend(opts, panel._fit()) : panel._fit(false);
//		if (opts.fit == true){
//			var p = panel.parent();
//			p.addClass('panel-noscroll');
//			if (p[0].tagName == 'BODY') $('html').addClass('panel-fit');
//			opts.width = p.width();
//			opts.height = p.height();
//		}
		panel.css({
			left: opts.left,
			top: opts.top
		});
		
		if (!isNaN(opts.width)){
			panel._outerWidth(opts.width);
		} else {
			panel.width('auto');
		}
		pheader.add(pbody)._outerWidth(panel.width());
		
		if (!isNaN(opts.height)){
			panel._outerHeight(opts.height);
			pbody._outerHeight(panel.height() - pheader._outerHeight());
		} else {
			pbody.height('auto');
		}
		panel.css('height', '');
		
		opts.onResize.apply(target, [opts.width, opts.height]);
		
		panel.find('>div.panel-body>div').triggerHandler('_resize');
	}
	
	function movePanel(target, param){
		var opts = $.data(target, 'panel').options;
		var panel = $.data(target, 'panel').panel;
		if (param){
			if (param.left != null) opts.left = param.left;
			if (param.top != null) opts.top = param.top;
		}
		panel.css({
			left: opts.left,
			top: opts.top
		});
		opts.onMove.apply(target, [opts.left, opts.top]);
	}
	
	function wrapPanel(target){
		$(target).addClass('panel-body');
		var panel = $('<div class="panel"></div>').insertBefore(target);
		panel[0].appendChild(target);
//		var panel = $(target).addClass('panel-body').wrap('<div class="panel"></div>').parent();
		panel.bind('_resize', function(){
			var opts = $.data(target, 'panel').options;
			if (opts.fit == true){
				setSize(target);
			}
			return false;
		});
		
		return panel;
	}
	
	function addHeader(target){
		var opts = $.data(target, 'panel').options;
		var panel = $.data(target, 'panel').panel;
		if (opts.tools && typeof opts.tools == 'string'){
			panel.find('>div.panel-header>div.panel-tool .panel-tool-a').appendTo(opts.tools);
		}
		removeNode(panel.children('div.panel-header'));
		if (opts.title && !opts.noheader){
			var header = $('<div class="panel-header"><div class="panel-title">'+opts.title+'</div></div>').prependTo(panel);
			if (opts.iconCls){
				header.find('.panel-title').addClass('panel-with-icon');
				$('<div class="panel-icon"></div>').addClass(opts.iconCls).appendTo(header);
			}
			var tool = $('<div class="panel-tool"></div>').appendTo(header);
			tool.bind('click', function(e){
				e.stopPropagation();
			});
			if (opts.tools){
				if (typeof opts.tools == 'string'){
					$(opts.tools).children().each(function(){
						$(this).addClass($(this).attr('iconCls')).addClass('panel-tool-a').appendTo(tool);
					});
				} else {
					for(var i=0; i<opts.tools.length; i++){
						var t = $('<a href="javascript:void(0)"></a>').addClass(opts.tools[i].iconCls).appendTo(tool);
						if (opts.tools[i].handler){
							t.bind('click', eval(opts.tools[i].handler));
						}
					}
				}
			}
			if (opts.collapsible){
				$('<a class="panel-tool-collapse" href="javascript:void(0)"></a>').appendTo(tool).bind('click', function(){
					if (opts.collapsed == true){
						expandPanel(target, true);
					} else {
						collapsePanel(target, true);
					}
					return false;
				});
			}
			if (opts.minimizable){
				$('<a class="panel-tool-min" href="javascript:void(0)"></a>').appendTo(tool).bind('click', function(){
					minimizePanel(target);
					return false;
				});
			}
			if (opts.maximizable){
				$('<a class="panel-tool-max" href="javascript:void(0)"></a>').appendTo(tool).bind('click', function(){
					if (opts.maximized == true){
						restorePanel(target);
					} else {
						maximizePanel(target);
					}
					return false;
				});
			}
			if (opts.closable){
				$('<a class="panel-tool-close" href="javascript:void(0)"></a>').appendTo(tool).bind('click',function(){
					closePanel(target);
					return false;
				});
			}
			panel.children('div.panel-body').removeClass('panel-body-noheader');
		} else {
			panel.children('div.panel-body').addClass('panel-body-noheader');
		}
	}
	
	/**
	 * load content from remote site if the href attribute is defined
	 */
	function loadData(target){
		var state = $.data(target, 'panel');
		var opts = state.options;
		if (opts.href){
			if (!state.isLoaded || !opts.cache){
				state.isLoaded = false;
				clearOuter(target);
				if (opts.loadingMessage){
					$(target).html($('<div class="panel-loading"></div>').html(opts.loadingMessage));
				}
				$.ajax({
					url:opts.href,
					cache:false,
					dataType:'html',
					success:function(data){
						_load(opts.extractor.call(target, data));
						opts.onLoad.apply(target, arguments);
						state.isLoaded = true;
					}
				});
			}
		} else if (opts.content){
			if (!state.isLoaded){
				clearOuter(target);
				_load(opts.content);
				state.isLoaded = true;
			}
		}
		function _load(content){
			$(target).html(content);
			if ($.parser){
				$.parser.parse($(target));
			}
		}
	}
	
	/**
	 * clear objects that placed outer of panel
	 */
	function clearOuter(target){
		var t = $(target);
		t.find('.combo-f').each(function(){
			$(this).combo('destroy');
		});
		t.find('.m-btn').each(function(){
			$(this).menubutton('destroy');
		});
		t.find('.s-btn').each(function(){
			$(this).splitbutton('destroy');
		});
		t.find('.tooltip-f').tooltip('destroy');
	}
	
	function doLayout(target){
		$(target).find('div.panel:visible,div.accordion:visible,div.tabs-container:visible,div.layout:visible').each(function(){
			$(this).triggerHandler('_resize', [true]);
		});
	}
	
	function openPanel(target, forceOpen){
		var opts = $.data(target, 'panel').options;
		var panel = $.data(target, 'panel').panel;
		
		if (forceOpen != true){
			if (opts.onBeforeOpen.call(target) == false) return;
		}
		panel.show();
		opts.closed = false;
		opts.minimized = false;
		var tool = panel.children('div.panel-header').find('a.panel-tool-restore');
		if (tool.length){
			opts.maximized = true;
		}
		opts.onOpen.call(target);
		
		if (opts.maximized == true) {
			opts.maximized = false;
			maximizePanel(target);
		}
		if (opts.collapsed == true) {
			opts.collapsed = false;
			collapsePanel(target);
		}
		
		if (!opts.collapsed){
			loadData(target);
			doLayout(target);
		}
	}
	
	function closePanel(target, forceClose){
		var opts = $.data(target, 'panel').options;
		var panel = $.data(target, 'panel').panel;
		
		if (forceClose != true){
			if (opts.onBeforeClose.call(target) == false) return;
		}
		panel._fit(false);
		panel.hide();
		opts.closed = true;
		opts.onClose.call(target);
	}
	
	function destroyPanel(target, forceDestroy){
		var opts = $.data(target, 'panel').options;
		var panel = $.data(target, 'panel').panel;
		
		if (forceDestroy != true){
			if (opts.onBeforeDestroy.call(target) == false) return;
		}
		clearOuter(target);
		removeNode(panel);
		opts.onDestroy.call(target);
	}
	
	function collapsePanel(target, animate){
		var opts = $.data(target, 'panel').options;
		var panel = $.data(target, 'panel').panel;
		var body = panel.children('div.panel-body');
		var tool = panel.children('div.panel-header').find('a.panel-tool-collapse');
		
		if (opts.collapsed == true) return;
		
		body.stop(true, true);	// stop animation
		if (opts.onBeforeCollapse.call(target) == false) return;
		
		tool.addClass('panel-tool-expand');
		if (animate == true){
			body.slideUp('normal', function(){
				opts.collapsed = true;
				opts.onCollapse.call(target);
			});
		} else {
			body.hide();
			opts.collapsed = true;
			opts.onCollapse.call(target);
		}
	}
	
	function expandPanel(target, animate){
		var opts = $.data(target, 'panel').options;
		var panel = $.data(target, 'panel').panel;
		var body = panel.children('div.panel-body');
		var tool = panel.children('div.panel-header').find('a.panel-tool-collapse');
		
		if (opts.collapsed == false) return;
		
		body.stop(true, true);	// stop animation
		if (opts.onBeforeExpand.call(target) == false) return;
		
		tool.removeClass('panel-tool-expand');
		if (animate == true){
			body.slideDown('normal', function(){
				opts.collapsed = false;
				opts.onExpand.call(target);
				loadData(target);
				doLayout(target);
			});
		} else {
			body.show();
			opts.collapsed = false;
			opts.onExpand.call(target);
			loadData(target);
			doLayout(target);
		}
	}
	
	function maximizePanel(target){
		var opts = $.data(target, 'panel').options;
		var panel = $.data(target, 'panel').panel;
		var tool = panel.children('div.panel-header').find('a.panel-tool-max');
		
		if (opts.maximized == true) return;
		
		tool.addClass('panel-tool-restore');
		
		if (!$.data(target, 'panel').original){
			$.data(target, 'panel').original = {
				width: opts.width,
				height: opts.height,
				left: opts.left,
				top: opts.top,
				fit: opts.fit
			};
		}
		opts.left = 0;
		opts.top = 0;
		opts.fit = true;
		setSize(target);
		opts.minimized = false;
		opts.maximized = true;
		opts.onMaximize.call(target);
	}
	
	function minimizePanel(target){
		var opts = $.data(target, 'panel').options;
		var panel = $.data(target, 'panel').panel;
		panel._fit(false);
		panel.hide();
		opts.minimized = true;
		opts.maximized = false;
		opts.onMinimize.call(target);
	}
	
	function restorePanel(target){
		var opts = $.data(target, 'panel').options;
		var panel = $.data(target, 'panel').panel;
		var tool = panel.children('div.panel-header').find('a.panel-tool-max');
		
		if (opts.maximized == false) return;
		
		panel.show();
		tool.removeClass('panel-tool-restore');
		$.extend(opts, $.data(target, 'panel').original);
//		var original = $.data(target, 'panel').original;
//		opts.width = original.width;
//		opts.height = original.height;
//		opts.left = original.left;
//		opts.top = original.top;
//		opts.fit = original.fit;
		setSize(target);
		opts.minimized = false;
		opts.maximized = false;
		$.data(target, 'panel').original = null;
		opts.onRestore.call(target);
	}
	
	function setProperties(target){
		var opts = $.data(target, 'panel').options;
		var panel = $.data(target, 'panel').panel;
		var header = $(target).panel('header');
		var body = $(target).panel('body');
		
		panel.css(opts.style);
		panel.addClass(opts.cls);
		
		if (opts.border){
			header.removeClass('panel-header-noborder');
			body.removeClass('panel-body-noborder');
		} else {
			header.addClass('panel-header-noborder');
			body.addClass('panel-body-noborder');
		}
		header.addClass(opts.headerCls);
		body.addClass(opts.bodyCls);
		
		if (opts.id){
			$(target).attr('id', opts.id);
		} else {
//			$(target).removeAttr('id');
			$(target).attr('id', '');
		}
	}
	
	function setTitle(target, title){
		$.data(target, 'panel').options.title = title;
		$(target).panel('header').find('div.panel-title').html(title);
	}
	
	var TO = false;
	var canResize = true;
	$(window).unbind('.panel').bind('resize.panel', function(){
		if (!canResize) return;
		if (TO !== false){
			clearTimeout(TO);
		}
		TO = setTimeout(function(){
			canResize = false;
			var layout = $('body.layout');
			if (layout.length){
				layout.layout('resize');
			} else {
				$('body').children('div.panel,div.accordion,div.tabs-container,div.layout').triggerHandler('_resize');
			}
			canResize = true;
			TO = false;
		}, 200);
	});
	
	$.fn.panel = function(options, param){
		if (typeof options == 'string'){
			return $.fn.panel.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'panel');
			var opts;
			if (state){
				opts = $.extend(state.options, options);
				state.isLoaded = false;
			} else {
				opts = $.extend({}, $.fn.panel.defaults, $.fn.panel.parseOptions(this), options);
				$(this).attr('title', '');
				state = $.data(this, 'panel', {
					options: opts,
					panel: wrapPanel(this),
					isLoaded: false
				});
			}
			
//			if (opts.content){
//				$(this).html(opts.content);
//				if ($.parser){
//					$.parser.parse(this);
//				}
//			}
			
			addHeader(this);
			setProperties(this);
			
			if (opts.doSize == true){
				state.panel.css('display','block');
				setSize(this);
			}
			if (opts.closed == true || opts.minimized == true){
				state.panel.hide();
			} else {
				openPanel(this);
			}
		});
	};
	
	$.fn.panel.methods = {
		options: function(jq){
			return $.data(jq[0], 'panel').options;
		},
		panel: function(jq){
			return $.data(jq[0], 'panel').panel;
		},
		header: function(jq){
			return $.data(jq[0], 'panel').panel.find('>div.panel-header');
		},
		body: function(jq){
			return $.data(jq[0], 'panel').panel.find('>div.panel-body');
		},
		setTitle: function(jq, title){
			return jq.each(function(){
				setTitle(this, title);
			});
		},
		open: function(jq, forceOpen){
			return jq.each(function(){
				openPanel(this, forceOpen);
			});
		},
		close: function(jq, forceClose){
			return jq.each(function(){
				closePanel(this, forceClose);
			});
		},
		destroy: function(jq, forceDestroy){
			return jq.each(function(){
				destroyPanel(this, forceDestroy);
			});
		},
		refresh: function(jq, href){
			return jq.each(function(){
				$.data(this, 'panel').isLoaded = false;
				if (href){
					$.data(this, 'panel').options.href = href;
				}
				loadData(this);
			});
		},
		resize: function(jq, param){
			return jq.each(function(){
				setSize(this, param);
			});
		},
		move: function(jq, param){
			return jq.each(function(){
				movePanel(this, param);
			});
		},
		maximize: function(jq){
			return jq.each(function(){
				maximizePanel(this);
			});
		},
		minimize: function(jq){
			return jq.each(function(){
				minimizePanel(this);
			});
		},
		restore: function(jq){
			return jq.each(function(){
				restorePanel(this);
			});
		},
		collapse: function(jq, animate){
			return jq.each(function(){
				collapsePanel(this, animate);
			});
		},
		expand: function(jq, animate){
			return jq.each(function(){
				expandPanel(this, animate);
			});
		}
	};
	
	$.fn.panel.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.parser.parseOptions(target, ['id','width','height','left','top',
		        'title','iconCls','cls','headerCls','bodyCls','tools','href',
		        {cache:'boolean',fit:'boolean',border:'boolean',noheader:'boolean'},
		        {collapsible:'boolean',minimizable:'boolean',maximizable:'boolean'},
		        {closable:'boolean',collapsed:'boolean',minimized:'boolean',maximized:'boolean',closed:'boolean'}
		]), {
			loadingMessage: (t.attr('loadingMessage')!=undefined ? t.attr('loadingMessage') : undefined)
		});
//		return {
//			id: t.attr('id'),
//			width: (parseInt(target.style.width) || undefined),
//			height: (parseInt(target.style.height) || undefined),
//			left: (parseInt(target.style.left) || undefined),
//			top: (parseInt(target.style.top) || undefined),
//			title: (t.attr('title') || undefined),
//			iconCls: (t.attr('iconCls') || t.attr('icon')),
//			cls: t.attr('cls'),
//			headerCls: t.attr('headerCls'),
//			bodyCls: t.attr('bodyCls'),
//			tools: t.attr('tools'),
//			href: t.attr('href'),
//			loadingMessage: (t.attr('loadingMessage')!=undefined ? t.attr('loadingMessage') : undefined),
//			cache: (t.attr('cache') ? t.attr('cache') == 'true' : undefined),
//			fit: (t.attr('fit') ? t.attr('fit') == 'true' : undefined),
//			border: (t.attr('border') ? t.attr('border') == 'true' : undefined),
//			noheader: (t.attr('noheader') ? t.attr('noheader') == 'true' : undefined),
//			collapsible: (t.attr('collapsible') ? t.attr('collapsible') == 'true' : undefined),
//			minimizable: (t.attr('minimizable') ? t.attr('minimizable') == 'true' : undefined),
//			maximizable: (t.attr('maximizable') ? t.attr('maximizable') == 'true' : undefined),
//			closable: (t.attr('closable') ? t.attr('closable') == 'true' : undefined),
//			collapsed: (t.attr('collapsed') ? t.attr('collapsed') == 'true' : undefined),
//			minimized: (t.attr('minimized') ? t.attr('minimized') == 'true' : undefined),
//			maximized: (t.attr('maximized') ? t.attr('maximized') == 'true' : undefined),
//			closed: (t.attr('closed') ? t.attr('closed') == 'true' : undefined)
//		}
	};
	
	$.fn.panel.defaults = {
		id: null,
		title: null,
		iconCls: null,
		width: 'auto',
		height: 'auto',
		left: null,
		top: null,
		cls: null,
		headerCls: null,
		bodyCls: null,
		style: {},
		href: null,
		cache: true,
		fit: false,
		border: true,
		doSize: true,	// true to set size and do layout
		noheader: false,
		content: null,	// the body content if specified
		
		collapsible: false,
		minimizable: false,
		maximizable: false,
		closable: false,
		collapsed: false,
		minimized: false,
		maximized: false,
		closed: false,
		
		// custom tools, every tool can contain two properties: iconCls and handler
		// iconCls is a icon CSS class
		// handler is a function, which will be run when tool button is clicked
		tools: null,	
		
		href: null,
		loadingMessage: 'Loading...',
		extractor: function(data){	// define how to extract the content from ajax response, return extracted data
			var pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
			var matches = pattern.exec(data);
			if (matches){
				return matches[1];	// only extract body content
			} else {
				return data;
			}
		},
		
		onLoad: function(){},
		onBeforeOpen: function(){},
		onOpen: function(){},
		onBeforeClose: function(){},
		onClose: function(){},
		onBeforeDestroy: function(){},
		onDestroy: function(){},
		onResize: function(width,height){},
		onMove: function(left,top){},
		onMaximize: function(){},
		onRestore: function(){},
		onMinimize: function(){},
		onBeforeCollapse: function(){},
		onBeforeExpand: function(){},
		onCollapse: function(){},
		onExpand: function(){}
	};
})(jQuery);
/**
 * window - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 * Dependencies:
 * 	 panel
 *   draggable
 *   resizable
 * 
 */
(function($){
	function setSize(target, param){
		var opts = $.data(target, 'window').options;
		if (param){
			if (param.width) opts.width = param.width;
			if (param.height) opts.height = param.height;
			if (param.left != null) opts.left = param.left;
			if (param.top != null) opts.top = param.top;
		}
		$(target).panel('resize', opts);
	}
	
	function moveWindow(target, param){
		var state = $.data(target, 'window');
		if (param){
			if (param.left != null) state.options.left = param.left;
			if (param.top != null) state.options.top = param.top;
		}
		$(target).panel('move', state.options);
		if (state.shadow){
			state.shadow.css({
				left: state.options.left,
				top: state.options.top
			});
		}
	}
	
	/**
	 *  center the window only horizontally
	 */
	function hcenter(target, tomove){
		var state = $.data(target, 'window');
		var opts = state.options;
		var width = opts.width;
		if (isNaN(width)){
			width = state.window._outerWidth();
		}
		if (opts.inline){
			var parent = state.window.parent();
			opts.left = (parent.width() - width) / 2 + parent.scrollLeft();
		} else {
			opts.left = ($(window)._outerWidth() - width) / 2 + $(document).scrollLeft();
		}
		if (tomove){moveWindow(target);}
	}
	
	/**
	 * center the window only vertically
	 */
	function vcenter(target, tomove){
		var state = $.data(target, 'window');
		var opts = state.options;
		var height = opts.height;
		if (isNaN(height)){
			height = state.window._outerHeight();
		}
		if (opts.inline){
			var parent = state.window.parent();
			opts.top = (parent.height() - height) / 2 + parent.scrollTop();
		} else {
			opts.top = ($(window)._outerHeight() - height) / 2 + $(document).scrollTop();
		}
		if (tomove){moveWindow(target);}
	}
	
	function create(target){
		var state = $.data(target, 'window');
		var win = $(target).panel($.extend({}, state.options, {
			border: false,
			doSize: true,	// size the panel, the property undefined in window component
			closed: true,	// close the panel
			cls: 'window',
			headerCls: 'window-header',
			bodyCls: 'window-body ' + (state.options.noheader ? 'window-body-noheader' : ''),
			
			onBeforeDestroy: function(){
				if (state.options.onBeforeDestroy.call(target) == false) return false;
				if (state.shadow) state.shadow.remove();
				if (state.mask) state.mask.remove();
			},
			onClose: function(){
				if (state.shadow) state.shadow.hide();
				if (state.mask) state.mask.hide();
				
				state.options.onClose.call(target);
			},
			onOpen: function(){
				if (state.mask){
					state.mask.css({
						display:'block',
						zIndex: $.fn.window.defaults.zIndex++
					});
				}
				if (state.shadow){
					state.shadow.css({
						display:'block',
						zIndex: $.fn.window.defaults.zIndex++,
						left: state.options.left,
						top: state.options.top,
						width: state.window._outerWidth(),
						height: state.window._outerHeight()
					});
				}
				state.window.css('z-index', $.fn.window.defaults.zIndex++);
				
				state.options.onOpen.call(target);
			},
			onResize: function(width, height){
				var opts = $(this).panel('options');
				$.extend(state.options, {
					width: opts.width,
					height: opts.height,
					left: opts.left,
					top: opts.top
				});
				if (state.shadow){
					state.shadow.css({
						left: state.options.left,
						top: state.options.top,
						width: state.window._outerWidth(),
						height: state.window._outerHeight()
					});
				}
				
				state.options.onResize.call(target, width, height);
			},
			onMinimize: function(){
				if (state.shadow) state.shadow.hide();
				if (state.mask) state.mask.hide();
				
				state.options.onMinimize.call(target);
			},
			onBeforeCollapse: function(){
				if (state.options.onBeforeCollapse.call(target) == false) return false;
				if (state.shadow) state.shadow.hide();
			},
			onExpand: function(){
				if (state.shadow) state.shadow.show();
				state.options.onExpand.call(target);
			}
		}));
		
		state.window = win.panel('panel');
		
		// create mask
		if (state.mask) state.mask.remove();
		if (state.options.modal == true){
			state.mask = $('<div class="window-mask"></div>').insertAfter(state.window);
			state.mask.css({
				width: (state.options.inline ? state.mask.parent().width() : getPageArea().width),
				height: (state.options.inline ? state.mask.parent().height() : getPageArea().height),
				display: 'none'
			});
		}
		
		// create shadow
		if (state.shadow) state.shadow.remove();
		if (state.options.shadow == true){
			state.shadow = $('<div class="window-shadow"></div>').insertAfter(state.window);
			state.shadow.css({
				display: 'none'
			});
		}
		
		// if require center the window
		if (state.options.left == null){hcenter(target);}
		if (state.options.top == null){vcenter(target);}
		moveWindow(target);
		
		if (state.options.closed == false){
			win.window('open');	// open the window
		}
	}
	
	
	/**
	 * set window drag and resize property
	 */
	function setProperties(target){
		var state = $.data(target, 'window');
		
		state.window.draggable({
			handle: '>div.panel-header>div.panel-title',
			disabled: state.options.draggable == false,
			onStartDrag: function(e){
				if (state.mask) state.mask.css('z-index', $.fn.window.defaults.zIndex++);
				if (state.shadow) state.shadow.css('z-index', $.fn.window.defaults.zIndex++);
				state.window.css('z-index', $.fn.window.defaults.zIndex++);
				
				if (!state.proxy){
					state.proxy = $('<div class="window-proxy"></div>').insertAfter(state.window);
				}
				state.proxy.css({
					display:'none',
					zIndex: $.fn.window.defaults.zIndex++,
					left: e.data.left,
					top: e.data.top
				});
				state.proxy._outerWidth(state.window._outerWidth());
				state.proxy._outerHeight(state.window._outerHeight());
				setTimeout(function(){
					if (state.proxy) state.proxy.show();
				}, 500);
			},
			onDrag: function(e){
				state.proxy.css({
					display:'block',
					left: e.data.left,
					top: e.data.top
				});
				return false;
			},
			onStopDrag: function(e){
				state.options.left = e.data.left;
				state.options.top = e.data.top;
				$(target).window('move');
				state.proxy.remove();
				state.proxy = null;
			}
		});
		
		state.window.resizable({
			disabled: state.options.resizable == false,
			onStartResize:function(e){
				state.pmask = $('<div class="window-proxy-mask"></div>').insertAfter(state.window);
				state.pmask.css({
					zIndex: $.fn.window.defaults.zIndex++,
					left: e.data.left,
					top: e.data.top,
					width: state.window._outerWidth(),
					height: state.window._outerHeight()
				});
				if (!state.proxy){
					state.proxy = $('<div class="window-proxy"></div>').insertAfter(state.window);
				}
				state.proxy.css({
					zIndex: $.fn.window.defaults.zIndex++,
					left: e.data.left,
					top: e.data.top
				});
				state.proxy._outerWidth(e.data.width);
				state.proxy._outerHeight(e.data.height);
			},
			onResize: function(e){
				state.proxy.css({
					left: e.data.left,
					top: e.data.top
				});
				state.proxy._outerWidth(e.data.width);
				state.proxy._outerHeight(e.data.height);
				return false;
			},
			onStopResize: function(e){
				$.extend(state.options, {
					left: e.data.left,
					top: e.data.top,
					width: e.data.width,
					height: e.data.height
				});
				setSize(target);
				state.pmask.remove();
				state.pmask = null;
				state.proxy.remove();
				state.proxy = null;
			}
		});
	}
	
	function getPageArea() {
		if (document.compatMode == 'BackCompat') {
			return {
				width: Math.max(document.body.scrollWidth, document.body.clientWidth),
				height: Math.max(document.body.scrollHeight, document.body.clientHeight)
			}
		} else {
			return {
				width: Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth),
				height: Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight)
			}
		}
	}
	
	// when window resize, reset the width and height of the window's mask
	$(window).resize(function(){
		$('body>div.window-mask').css({
			width: $(window)._outerWidth(),
			height: $(window)._outerHeight()
		});
		setTimeout(function(){
			$('body>div.window-mask').css({
				width: getPageArea().width,
				height: getPageArea().height
			});
		}, 50);
	});
	
	$.fn.window = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.window.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.panel(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'window');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'window', {
					options: $.extend({}, $.fn.window.defaults, $.fn.window.parseOptions(this), options)
				});
				if (!state.options.inline){
//					$(this).appendTo('body');
					document.body.appendChild(this);
				}
			}
			create(this);
			setProperties(this);
		});
	};
	
	$.fn.window.methods = {
		options: function(jq){
			var popts = jq.panel('options');
			var wopts = $.data(jq[0], 'window').options;
			return $.extend(wopts, {
				closed: popts.closed,
				collapsed: popts.collapsed,
				minimized: popts.minimized,
				maximized: popts.maximized
			});
		},
		window: function(jq){
			return $.data(jq[0], 'window').window;
		},
		resize: function(jq, param){
			return jq.each(function(){
				setSize(this, param);
			});
		},
		move: function(jq, param){
			return jq.each(function(){
				moveWindow(this, param);
			});
		},
		hcenter: function(jq){
			return jq.each(function(){
				hcenter(this, true);
			});
		},
		vcenter: function(jq){
			return jq.each(function(){
				vcenter(this, true);
			});
		},
		center: function(jq){
			return jq.each(function(){
				hcenter(this);
				vcenter(this);
				moveWindow(this);
			});
		}
	};
	
	$.fn.window.parseOptions = function(target){
		return $.extend({}, $.fn.panel.parseOptions(target), $.parser.parseOptions(target, [
			{draggable:'boolean',resizable:'boolean',shadow:'boolean',modal:'boolean',inline:'boolean'}
		]));
	};
	
	// Inherited from $.fn.panel.defaults
	$.fn.window.defaults = $.extend({}, $.fn.panel.defaults, {
		zIndex: 9000,
		draggable: true,
		resizable: true,
		shadow: true,
		modal: false,
		inline: false,	// true to stay inside its parent, false to go on top of all elements
		
		// window's property which difference from panel
		title: 'New Window',
		collapsible: true,
		minimizable: true,
		maximizable: true,
		closable: true,
		closed: false
	});
})(jQuery);
/**
 * dialog - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 * Dependencies:
 * 	 window
 *   linkbutton
 * 
 */
(function($){
	/**
	 * wrap dialog and return content panel.
	 */
	function wrapDialog(target){
		var cp = document.createElement('div');
		while(target.firstChild){
			cp.appendChild(target.firstChild);
		}
		target.appendChild(cp);
		
		var contentPanel = $(cp);
		contentPanel.attr('style', $(target).attr('style'));
		$(target).removeAttr('style').css('overflow', 'hidden');
		contentPanel.panel({
			border:false,
			doSize:false,
			bodyCls:'dialog-content'
		});
		return contentPanel;
	}
	
	/**
	 * build the dialog
	 */
	function buildDialog(target){
		var opts = $.data(target, 'dialog').options;
		var contentPanel = $.data(target, 'dialog').contentPanel;
		
		if (opts.toolbar){
			if (typeof opts.toolbar == 'string'){
				$(opts.toolbar).addClass('dialog-toolbar').prependTo(target);
				$(opts.toolbar).show();
			} else {
				$(target).find('div.dialog-toolbar').remove();
				var toolbar = $('<div class="dialog-toolbar"><table cellspacing="0" cellpadding="0"><tr></tr></table></div>').prependTo(target);
				var tr = toolbar.find('tr');
				for(var i=0; i<opts.toolbar.length; i++){
					var btn = opts.toolbar[i];
					if (btn == '-'){
						$('<td><div class="dialog-tool-separator"></div></td>').appendTo(tr);
					} else {
						var td = $('<td></td>').appendTo(tr);
						var tool = $('<a href="javascript:void(0)"></a>').appendTo(td);
						tool[0].onclick = eval(btn.handler || function(){});
						tool.linkbutton($.extend({}, btn, {
							plain:true
						}));
					}
				}
			}
		} else {
			$(target).find('div.dialog-toolbar').remove();
		}
		
		if (opts.buttons){
			if (typeof opts.buttons == 'string'){
				$(opts.buttons).addClass('dialog-button').appendTo(target);
				$(opts.buttons).show();
			} else {
				$(target).find('div.dialog-button').remove();
				var buttons = $('<div class="dialog-button"></div>').appendTo(target);
				for(var i=0; i<opts.buttons.length; i++){
					var p = opts.buttons[i];
					var button = $('<a href="javascript:void(0)"></a>').appendTo(buttons);
					if (p.handler) button[0].onclick = p.handler;
					button.linkbutton(p);
				}
			}
		} else {
			$(target).find('div.dialog-button').remove();
		}
		
		var tmpHref = opts.href;
		var tmpContent = opts.content;
		opts.href = null;
		opts.content = null;
		
		contentPanel.panel({
			closed: opts.closed,
			cache: opts.cache,
			href: tmpHref,
			content: tmpContent,
			onLoad: function(){
				if (opts.height == 'auto'){
					$(target).window('resize');
				}
				opts.onLoad.apply(target, arguments);
			}
		});
		
		$(target).window($.extend({}, opts, {
			onOpen:function(){
				if (contentPanel.panel('options').closed){
					contentPanel.panel('open');
				}
				if (opts.onOpen) opts.onOpen.call(target);
			},
			onResize:function(width, height){
				var wbody = $(target);
				contentPanel.panel('panel').show();
				contentPanel.panel('resize', {
					width: wbody.width(),
					height: (height=='auto') ? 'auto' :
						wbody.height()
						- wbody.children('div.dialog-toolbar')._outerHeight()
						- wbody.children('div.dialog-button')._outerHeight()
				});
				
				if (opts.onResize) opts.onResize.call(target, width, height);
			}
		}));
		
		opts.href = tmpHref;
		opts.content = tmpContent;
	}
	
	function refresh(target, href){
		var contentPanel = $.data(target, 'dialog').contentPanel;
		contentPanel.panel('refresh', href);
	}
	
	$.fn.dialog = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.dialog.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.window(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'dialog');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'dialog', {
					options: $.extend({}, $.fn.dialog.defaults, $.fn.dialog.parseOptions(this), options),
					contentPanel: wrapDialog(this)
				});
			}
			buildDialog(this);
		});
	};
	
	$.fn.dialog.methods = {
		options: function(jq){
			var dopts = $.data(jq[0], 'dialog').options;
			var popts = jq.panel('options');
			$.extend(dopts, {
				closed: popts.closed,
				collapsed: popts.collapsed,
				minimized: popts.minimized,
				maximized: popts.maximized
			});
			var contentPanel = $.data(jq[0], 'dialog').contentPanel;
			
			return dopts;
		},
		dialog: function(jq){
			return jq.window('window');
		},
		refresh: function(jq, href){
			return jq.each(function(){
				refresh(this, href);
			});
		}
	};
	
	$.fn.dialog.parseOptions = function(target){
		return $.extend({}, $.fn.window.parseOptions(target), $.parser.parseOptions(target,['toolbar','buttons']));
	};
	
	// Inherited from $.fn.window.defaults.
	$.fn.dialog.defaults = $.extend({}, $.fn.window.defaults, {
		title: 'New Dialog',
		collapsible: false,
		minimizable: false,
		maximizable: false,
		resizable: false,
		
		toolbar:null,
		buttons:null
	});
})(jQuery);
/**
 * messager - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 * Dependencies:
 * 	linkbutton
 *  window
 *  progressbar
 */
(function($){
	
	/**
	 * show window with animate, after sometime close the window
	 */
	function show(el, type, speed, timeout){
		var win = $(el).window('window');
		if (!win) return;
		
		switch(type){
		case null:
			win.show();
			break;
		case 'slide':
			win.slideDown(speed);
			break;
		case 'fade':
			win.fadeIn(speed);
			break;
		case 'show':
			win.show(speed);
			break;
		}
		
		var timer = null;
		if (timeout > 0){
			timer = setTimeout(function(){
				hide(el, type, speed);
			}, timeout);
		}
		win.hover(
				function(){
					if (timer){
						clearTimeout(timer);
					}
				},
				function(){
					if (timeout > 0){
						timer = setTimeout(function(){
							hide(el, type, speed);
						}, timeout);
					}
				}
		)
		
	}
	
	/**
	 * hide window with animate
	 */
	function hide(el, type, speed){
		if (el.locked == true) return;
		el.locked = true;
		
		var win = $(el).window('window');
		if (!win) return;
		
		switch(type){
		case null:
			win.hide();
			break;
		case 'slide':
			win.slideUp(speed);
			break;
		case 'fade':
			win.fadeOut(speed);
			break;
		case 'show':
			win.hide(speed);
			break;
		}
		
		setTimeout(function(){
			$(el).window('destroy');
		}, speed);
	}
	
	/**
	 * create the message window
	 */
	function createWindow(options){
		var opts = $.extend({}, $.fn.window.defaults, {
			collapsible: false,
			minimizable: false,
			maximizable: false,
			shadow: false,
			draggable: false,
			resizable: false,
			closed: true,
			// set the message window to the right bottom position
			style:{
				left: '',
				top: '',
				right: 0,
				zIndex: $.fn.window.defaults.zIndex++,
				bottom: -document.body.scrollTop-document.documentElement.scrollTop
			},
			onBeforeOpen: function(){
				show(this, opts.showType, opts.showSpeed, opts.timeout);
				return false;
			},
			onBeforeClose: function(){
				hide(this, opts.showType, opts.showSpeed);
				return false;
			}
		}, {
			title: '',
			width: 250,
			height: 100,
			showType: 'slide',
			showSpeed: 600,
			msg: '',
			timeout: 4000
		}, options);
		opts.style.zIndex = $.fn.window.defaults.zIndex++;
		
		var win = $('<div class="messager-body"></div>').html(opts.msg).appendTo('body');
		win.window(opts);
		win.window('window').css(opts.style);
		win.window('open');
		return win;
	}
	
	/**
	 * create a dialog, when dialog is closed destroy it
	 */
	function createDialog(title, content, buttons){
		var win = $('<div class="messager-body"></div>').appendTo('body');
		win.append(content);
		if (buttons){
			var tb = $('<div class="messager-button"></div>').appendTo(win);
			for(var label in buttons){
				$('<a></a>').attr('href', 'javascript:void(0)').text(label)
							.css('margin-left', 10)
							.bind('click', eval(buttons[label]))
							.appendTo(tb).linkbutton();
			}
		}
		win.window({
			title: title,
			noheader: (title?false:true),
			width: 300,
			height: 'auto',
			modal: true,
			collapsible: false,
			minimizable: false,
			maximizable: false,
			resizable: false,
			onClose: function(){
				setTimeout(function(){
					win.window('destroy');
				}, 100);
			}
		});
		win.window('window').addClass('messager-window');
		win.children('div.messager-button').children('a:first').focus();
		return win;
	}
	
	$.messager = {
		show: function(options){
			return createWindow(options);
		},
		
		alert: function(title, msg, icon, fn) {
			var content = '<div>' + msg + '</div>';
			switch(icon) {
				case 'error':
					content = '<div class="messager-icon messager-error"></div>' + content;
					break;
				case 'info':
					content = '<div class="messager-icon messager-info"></div>' + content;
					break;
				case 'question':
					content = '<div class="messager-icon messager-question"></div>' + content;
					break;
				case 'warning':
					content = '<div class="messager-icon messager-warning"></div>' + content;
					break;
			}
			content += '<div style="clear:both;"/>';
			
			var buttons = {};
			buttons[$.messager.defaults.ok] = function(){
				win.window('close');
				if (fn){
					fn();
					return false;
				}
			};
			var win = createDialog(title,content,buttons);
			return win;
		},
		
		confirm: function(title, msg, fn) {
			var content = '<div class="messager-icon messager-question"></div>'
					+ '<div>' + msg + '</div>'
					+ '<div style="clear:both;"/>';
			var buttons = {};
			buttons[$.messager.defaults.ok] = function(){
				win.window('close');
				if (fn){
					fn(true);
					return false;
				}
			};
			buttons[$.messager.defaults.cancel] = function(){
				win.window('close');
				if (fn){
					fn(false);
					return false;
				}
			};
			var win = createDialog(title,content,buttons);
			return win;
		},
		
		prompt: function(title, msg, fn) {
			var content = '<div class="messager-icon messager-question"></div>'
						+ '<div>' + msg + '</div>'
						+ '<br/>'
						+ '<div style="clear:both;"/>'
						+ '<div><input class="messager-input" type="text"/></div>';
			var buttons = {};
			buttons[$.messager.defaults.ok] = function(){
				win.window('close');
				if (fn){
					fn($('.messager-input', win).val());
					return false;
				}
			};
			buttons[$.messager.defaults.cancel] = function(){
				win.window('close');
				if (fn){
					fn();
					return false;
				}
			};
			var win = createDialog(title,content,buttons);
			win.children('input.messager-input').focus();
			return win;
		},
		
		progress: function(options){
			var methods = {
				bar: function(){	// get the progress bar object
					return $('body>div.messager-window').find('div.messager-p-bar');
				},
				close: function(){	// close the progress window
					var win = $('body>div.messager-window>div.messager-body:has(div.messager-progress)');
					if (win.length){
						win.window('close');
					}
				}
			};
			
			if (typeof options == 'string'){
				var method = methods[options];
				return method();
			}
			
			var opts = $.extend({
				title: '',
				msg: '',	// The message box body text
				text: undefined,	// The text to display in the progress bar
				interval: 300	// The length of time in milliseconds between each progress update
			}, options||{});
			
			var content = '<div class="messager-progress"><div class="messager-p-msg"></div><div class="messager-p-bar"></div></div>';
			var win = createDialog(opts.title, content, null);
			win.find('div.messager-p-msg').html(opts.msg);
			var bar = win.find('div.messager-p-bar');
			bar.progressbar({
				text: opts.text
			});
			win.window({
				closable:false,
				onClose:function(){
					if (this.timer){
						clearInterval(this.timer);
					}
					$(this).window('destroy');
				}
			});
			
			if (opts.interval){
				win[0].timer = setInterval(function(){
					var v = bar.progressbar('getValue');
					v += 10;
					if (v > 100) v = 0;
					bar.progressbar('setValue', v);
				}, opts.interval);
			}
			return win;
		}
	};
	
	$.messager.defaults = {
		ok: 'Ok',
		cancel: 'Cancel'
	};
	
})(jQuery);
/**
 * accordion - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 * Dependencies:
 * 	 panel
 * 
 */
(function($){
	
	function setSize(container){
		var opts = $.data(container, 'accordion').options;
		var panels = $.data(container, 'accordion').panels;
		
		var cc = $(container);
		opts.fit ? $.extend(opts, cc._fit()) : cc._fit(false);
//		if (opts.fit == true){
//			var p = cc.parent();
//			p.addClass('panel-noscroll');
//			if (p[0].tagName == 'BODY') $('html').addClass('panel-fit');
//			opts.width = p.width();
//			opts.height = p.height();
//		}
		
		if (opts.width > 0){
			cc._outerWidth(opts.width);
		}
		var panelHeight = 'auto';
		if (opts.height > 0){
			cc._outerHeight(opts.height);
			// get the first panel's header height as all the header height
			var headerHeight = panels.length ? panels[0].panel('header').css('height', '')._outerHeight() : 'auto';
			var panelHeight = cc.height() - (panels.length-1)*headerHeight;
		}
		for(var i=0; i<panels.length; i++){
			var panel = panels[i];
			var header = panel.panel('header');
			header._outerHeight(headerHeight);
			panel.panel('resize', {
				width: cc.width(),
				height: panelHeight
			});
		}
	}
	
	/**
	 * get the current panel
	 */
	function getCurrent(container){
		var panels = $.data(container, 'accordion').panels;
		for(var i=0; i<panels.length; i++){
			var panel = panels[i];
			if (panel.panel('options').collapsed == false){
				return panel;
			}
		}
		return null;
	}
	
	/**
	 * get panel index, start with 0
	 */
	function getPanelIndex(container, panel){
		var panels = $.data(container, 'accordion').panels;
		for(var i=0; i<panels.length; i++){
			if (panels[i][0] == $(panel)[0]){
				return i;
			}
		}
		return -1;
	}
	
	/**
	 * get the specified panel, remove it from panel array if removeit setted to true.
	 */
	function getPanel(container, which, removeit){
		var panels = $.data(container, 'accordion').panels;
		if (typeof which == 'number'){
			if (which < 0 || which >= panels.length){
				return null;
			} else {
				var panel = panels[which];
				if (removeit){
					panels.splice(which,1);
				}
				return panel;
			}
		}
		for(var i=0; i<panels.length; i++){
			var panel = panels[i];
			if (panel.panel('options').title == which){
				if (removeit){
					panels.splice(i, 1);
				}
				return panel;
			}
		}
		return null;
	}
	
	function setProperties(container){
		var opts = $.data(container, 'accordion').options;
		var cc = $(container);
		if (opts.border){
			cc.removeClass('accordion-noborder');
		} else {
			cc.addClass('accordion-noborder');
		}
	}
	
	function wrapAccordion(container){
		var cc = $(container);
		cc.addClass('accordion');
		
		var panels = [];
		cc.children('div').each(function(){
			var opts = $.extend({}, $.parser.parseOptions(this), {
				selected: ($(this).attr('selected') ? true : undefined)
			});
			var pp = $(this);
			panels.push(pp);
			createPanel(container, pp, opts);
		});
		
		cc.bind('_resize', function(e,force){
			var opts = $.data(container, 'accordion').options;
			if (opts.fit == true || force){
				setSize(container);
			}
			return false;
		});
		
		return {
			accordion: cc,
			panels: panels
		}
	}
	
	function createPanel(container, pp, options){
		pp.panel($.extend({}, options, {
			collapsible: false,
			minimizable: false,
			maximizable: false,
			closable: false,
			doSize: false,
			collapsed: true,
			headerCls: 'accordion-header',
			bodyCls: 'accordion-body',
			onBeforeExpand: function(){
				var curr = getCurrent(container);
				if (curr){
					var header = $(curr).panel('header');
					header.removeClass('accordion-header-selected');
					header.find('.accordion-collapse').triggerHandler('click');
				}
				var header = pp.panel('header');
				header.addClass('accordion-header-selected');
				header.find('.accordion-collapse').removeClass('accordion-expand');
			},
			onExpand: function(){
				var opts = $.data(container, 'accordion').options;
				opts.onSelect.call(container, pp.panel('options').title, getPanelIndex(container, this));
			},
			onBeforeCollapse: function(){
				var header = pp.panel('header');
				header.removeClass('accordion-header-selected');
				header.find('.accordion-collapse').addClass('accordion-expand');
			}
		}));
		
		var header = pp.panel('header');
		var t = $('<a class="accordion-collapse accordion-expand" href="javascript:void(0)"></a>').appendTo(header.children('div.panel-tool'));
		t.bind('click', function(e){
			var animate = $.data(container, 'accordion').options.animate;
			stopAnimate(container);
			if (pp.panel('options').collapsed){
				pp.panel('expand', animate);
			} else {
				pp.panel('collapse', animate);
			}
			return false;
		});
		
		header.click(function(){
			$(this).find('.accordion-collapse').triggerHandler('click');
			return false;
		});
	}
	
	/**
	 * select and set the specified panel active
	 */
	function select(container, which){
		var panel = getPanel(container, which);
		if (!panel) return;
		
		var curr = getCurrent(container);
		if (curr && curr[0] == panel[0]){
			return;
		}
		
		panel.panel('header').triggerHandler('click');
	}
	
	function doFirstSelect(container){
		var panels = $.data(container, 'accordion').panels;
		for(var i=0; i<panels.length; i++){
			if (panels[i].panel('options').selected){
				_select(i);
				return;
			}
		}
		if (panels.length){
			_select(0);
		}
		
		function _select(index){
			var opts = $.data(container, 'accordion').options;
			var animate = opts.animate;
			opts.animate = false;
			select(container, index);
			opts.animate = animate;
		}
	}
	
	/**
	 * stop the animation of all panels
	 */
	function stopAnimate(container){
		var panels = $.data(container, 'accordion').panels;
		for(var i=0; i<panels.length; i++){
			panels[i].stop(true,true);
		}
	}
	
	function add(container, options){
		var opts = $.data(container, 'accordion').options;
		var panels = $.data(container, 'accordion').panels;
		if (options.selected == undefined) options.selected = true;

		stopAnimate(container);
		
		var pp = $('<div></div>').appendTo(container);
		panels.push(pp);
		createPanel(container, pp, options);
		setSize(container);
		
		opts.onAdd.call(container, options.title, panels.length-1);
		
		if (options.selected){
			select(container, panels.length-1);
		}
	}
	
	function remove(container, which){
		var opts = $.data(container, 'accordion').options;
		var panels = $.data(container, 'accordion').panels;
		
		stopAnimate(container);
		
		var panel = getPanel(container, which);
		var title = panel.panel('options').title;
		var index = getPanelIndex(container, panel);
		
		if (opts.onBeforeRemove.call(container, title, index) == false) return;
		
		var panel = getPanel(container, which, true);
		if (panel){
			panel.panel('destroy');
			if (panels.length){
				setSize(container);
				var curr = getCurrent(container);
				if (!curr){
					select(container, 0);
				}
			}
		}
		
		opts.onRemove.call(container, title, index);
	}
	
	$.fn.accordion = function(options, param){
		if (typeof options == 'string'){
			return $.fn.accordion.methods[options](this, param);
		}
		
		options = options || {};
		
		return this.each(function(){
			var state = $.data(this, 'accordion');
			var opts;
			if (state){
				opts = $.extend(state.options, options);
				state.opts = opts;
			} else {
				opts = $.extend({}, $.fn.accordion.defaults, $.fn.accordion.parseOptions(this), options);
				var r = wrapAccordion(this);
				$.data(this, 'accordion', {
					options: opts,
					accordion: r.accordion,
					panels: r.panels
				});
			}
			
			setProperties(this);
			setSize(this);
			doFirstSelect(this);
		});
	};
	
	$.fn.accordion.methods = {
		options: function(jq){
			return $.data(jq[0], 'accordion').options;
		},
		panels: function(jq){
			return $.data(jq[0], 'accordion').panels;
		},
		resize: function(jq){
			return jq.each(function(){
				setSize(this);
			});
		},
		getSelected: function(jq){
			return getCurrent(jq[0]);
		},
		getPanel: function(jq, which){
			return getPanel(jq[0], which);
		},
		getPanelIndex: function(jq, panel){
			return getPanelIndex(jq[0], panel);
		},
		select: function(jq, which){
			return jq.each(function(){
				select(this, which);
			});
		},
		add: function(jq, options){
			return jq.each(function(){
				add(this, options);
			});
		},
		remove: function(jq, which){
			return jq.each(function(){
				remove(this, which);
			});
		}
	};
	
	$.fn.accordion.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.parser.parseOptions(target, [
			'width','height',{fit:'boolean',border:'boolean',animate:'boolean'}
		]));
	};
	
	$.fn.accordion.defaults = {
		width: 'auto',
		height: 'auto',
		fit: false,
		border: true,
		animate: true,
		
		onSelect: function(title, index){},
		onAdd: function(title, index){},
		onBeforeRemove: function(title, index){},
		onRemove: function(title, index){}
	};
})(jQuery);
/**
 * tabs - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 *
 * Dependencies:
 * 	 panel
 *   linkbutton
 * 
 */
(function($){
	
	/**
	 * set the tabs scrollers to show or not,
	 * dependent on the tabs count and width
	 */
	function setScrollers(container) {
		var opts = $.data(container, 'tabs').options;
		if (opts.tabPosition == 'left' || opts.tabPosition == 'right'){return}
		
		var header = $(container).children('div.tabs-header');
		var tool = header.children('div.tabs-tool');
		var sLeft = header.children('div.tabs-scroller-left');
		var sRight = header.children('div.tabs-scroller-right');
		var wrap = header.children('div.tabs-wrap');
		
		// set the tool height
		tool._outerHeight(header.outerHeight() - (opts.plain ? 2 : 0));
		
		var tabsWidth = 0;
		$('ul.tabs li', header).each(function(){
			tabsWidth += $(this).outerWidth(true);
		});
		var cWidth = header.width() - tool._outerWidth();
		
		if (tabsWidth > cWidth) {
			sLeft.show();
			sRight.show();
			if (opts.toolPosition == 'left'){
				tool.css({
					left: sLeft.outerWidth(),
					right: ''
				});
				wrap.css({
					marginLeft: sLeft.outerWidth() + tool._outerWidth(),
					marginRight: sRight._outerWidth(),
					width: cWidth - sLeft.outerWidth() - sRight.outerWidth()
				});
			} else {
				tool.css({
					left: '',
					right: sRight.outerWidth()
				});
				wrap.css({
					marginLeft: sLeft.outerWidth(),
					marginRight: sRight.outerWidth() + tool._outerWidth(),
					width: cWidth - sLeft.outerWidth() - sRight.outerWidth()
				});
			}
		} else {
			sLeft.hide();
			sRight.hide();
			if (opts.toolPosition == 'left'){
				tool.css({
					left: 0,
					right: ''
				});
				wrap.css({
					marginLeft: tool._outerWidth(),
					marginRight: 0,
					width: cWidth
				});
			} else {
				tool.css({
					left: '',
					right: 0
				});
				wrap.css({
					marginLeft: 0,
					marginRight: tool._outerWidth(),
					width: cWidth
				});
			}
//			wrap.scrollLeft(0);
		}
	}
	
	function addTools(container){
		var opts = $.data(container, 'tabs').options;
		var header = $(container).children('div.tabs-header');
		if (opts.tools) {
			if (typeof opts.tools == 'string'){
				$(opts.tools).addClass('tabs-tool').appendTo(header);
				$(opts.tools).show();
			} else {
				header.children('div.tabs-tool').remove();
				var tools = $('<div class="tabs-tool"></div>').appendTo(header);
				for(var i=0; i<opts.tools.length; i++){
					var tool = $('<a href="javascript:void(0);"></a>').appendTo(tools);
					tool[0].onclick = eval(opts.tools[i].handler || function(){});
					tool.linkbutton($.extend({}, opts.tools[i], {
						plain: true
					}));
				}
			}
		} else {
			header.children('div.tabs-tool').remove();
		}
	}
	
	function setSize(container) {
		var opts = $.data(container, 'tabs').options;
		var cc = $(container);
		
		opts.fit ? $.extend(opts, cc._fit()) : cc._fit(false);
//		if (opts.fit == true){
//			var p = cc.parent();
//			p.addClass('panel-noscroll');
//			if (p[0].tagName == 'BODY') $('html').addClass('panel-fit');
//			opts.width = p.width();
//			opts.height = p.height();
//		}
		cc.width(opts.width).height(opts.height);
		
		var header = $(container).children('div.tabs-header');
		var panels = $(container).children('div.tabs-panels');
		
		if (opts.tabPosition == 'left' || opts.tabPosition == 'right'){
			header._outerWidth(opts.headerWidth);
			panels._outerWidth(cc.width() - opts.headerWidth);
			header.add(panels)._outerHeight(opts.height);
			var wrap = header.find('div.tabs-wrap');
			wrap._outerWidth(header.width());
			header.find('.tabs')._outerWidth(wrap.width());
		} else {
			header.css('height','');
			header.find('div.tabs-wrap').css('width','');
			header.find('.tabs').css('width','');
			
			header._outerWidth(opts.width);
			
			setScrollers(container);
			
			var height = opts.height;
			if (!isNaN(height)) {
				panels._outerHeight(height - header.outerHeight());
			} else {
				panels.height('auto');
			}
			var width = opts.width;
			if (!isNaN(width)){
				panels._outerWidth(width);
			} else {
				panels.width('auto');
			}
		}
	}
	
	/**
	 * set selected tab panel size
	 */
	function setSelectedSize(container){
		var opts = $.data(container, 'tabs').options;
		var tab = getSelectedTab(container);
		if (tab){
			var panels = $(container).children('div.tabs-panels');
			var width = opts.width=='auto' ? 'auto' : panels.width();
			var height = opts.height=='auto' ? 'auto' : panels.height();
			tab.panel('resize', {
				width: width,
				height: height
			});
		}
	}
	
	/**
	 * wrap the tabs header and body
	 */
	function wrapTabs(container) {
		var tabs = $.data(container, 'tabs').tabs;
		var cc = $(container);
		cc.addClass('tabs-container');
		cc.wrapInner('<div class="tabs-panels"/>');
		$('<div class="tabs-header">'
				+ '<div class="tabs-scroller-left"></div>'
				+ '<div class="tabs-scroller-right"></div>'
				+ '<div class="tabs-wrap">'
				+ '<ul class="tabs"></ul>'
				+ '</div>'
				+ '</div>').prependTo(container);
		
		cc.children('div.tabs-panels').children('div').each(function(i){
			var opts = $.extend({}, $.parser.parseOptions(this), {
				selected: ($(this).attr('selected') ? true : undefined)
			});
			var pp = $(this);
			tabs.push(pp);
			createTab(container, pp, opts);
		});
		
		cc.children('div.tabs-header').find('.tabs-scroller-left, .tabs-scroller-right').hover(
			function(){$(this).addClass('tabs-scroller-over');},
			function(){$(this).removeClass('tabs-scroller-over');}
		);
		cc.bind('_resize', function(e,force){
			var opts = $.data(container, 'tabs').options;
			if (opts.fit == true || force){
				setSize(container);
				setSelectedSize(container);
			}
			return false;
		});
	}
	
	function setProperties(container){
		var opts = $.data(container, 'tabs').options;
		var header = $(container).children('div.tabs-header');
		var panels = $(container).children('div.tabs-panels');
		
		header.removeClass('tabs-header-top tabs-header-bottom tabs-header-left tabs-header-right');
		panels.removeClass('tabs-panels-top tabs-panels-bottom tabs-panels-left tabs-panels-right');
		if (opts.tabPosition == 'top'){
			header.insertBefore(panels);
		}else if (opts.tabPosition == 'bottom'){
			header.insertAfter(panels);
			header.addClass('tabs-header-bottom');
			panels.addClass('tabs-panels-top');
		} else if (opts.tabPosition == 'left'){
			header.addClass('tabs-header-left');
			panels.addClass('tabs-panels-right');
		} else if (opts.tabPosition == 'right'){
			header.addClass('tabs-header-right');
//			header.addClass('tabs-header-left tabs-header-right');
			panels.addClass('tabs-panels-left');
		}
		
		if (opts.plain == true) {
			header.addClass('tabs-header-plain');
		} else {
			header.removeClass('tabs-header-plain');
		}
		if (opts.border == true){
			header.removeClass('tabs-header-noborder');
			panels.removeClass('tabs-panels-noborder');
		} else {
			header.addClass('tabs-header-noborder');
			panels.addClass('tabs-panels-noborder');
		}
		
		$('.tabs-scroller-left', header).unbind('.tabs').bind('click.tabs', function(){
			$(container).tabs('scrollBy', -opts.scrollIncrement);
		});
		
		$('.tabs-scroller-right', header).unbind('.tabs').bind('click.tabs', function(){
			$(container).tabs('scrollBy', opts.scrollIncrement);
		});
	}
	
	function createTab(container, pp, options) {
		var state = $.data(container, 'tabs');
		options = options || {};
		
		// create panel
		pp.panel($.extend({}, options, {
			border: false,
			noheader: true,
			closed: true,
			doSize: false,
			iconCls: (options.icon ? options.icon : undefined),
			onLoad: function(){
				if (options.onLoad){
					options.onLoad.call(this, arguments);
				}
				state.options.onLoad.call(container, $(this));
			}
		}));
		
		var opts = pp.panel('options');
		
		var tabs = $(container).children('div.tabs-header').find('ul.tabs');
		
		opts.tab = $('<li></li>').appendTo(tabs);	// set the tab object in panel options
		opts.tab.append(
				'<a href="javascript:void(0)" class="tabs-inner">' +
				'<span class="tabs-title"></span>' +
				'<span class="tabs-icon"></span>' +
				'</a>'
		);
		opts.tab.unbind('.tabs').bind('click.tabs', {p:pp}, function(e){
			if ($(this).hasClass('tabs-disabled')){return;}
			selectTab(container, getTabIndex(container, e.data.p));
		}).bind('contextmenu.tabs', {p:pp}, function(e){
			if ($(this).hasClass('tabs-disabled')){return;}
			state.options.onContextMenu.call(container, e, $(this).find('span.tabs-title').html(), getTabIndex(container, e.data.p));
		});
		
//		updateTab(container, {
//			tab: pp,
//			options: opts
//		});
		$(container).tabs('update', {
			tab: pp,
			options: opts
		});
	}
	
	function addTab(container, options) {
		var opts = $.data(container, 'tabs').options;
		var tabs = $.data(container, 'tabs').tabs;
		if (options.selected == undefined) options.selected = true;
		
		var pp = $('<div></div>').appendTo($(container).children('div.tabs-panels'));
		tabs.push(pp);
		createTab(container, pp, options);
		
		opts.onAdd.call(container, options.title, tabs.length-1);
		
		setScrollers(container);
		if (options.selected){
			selectTab(container, tabs.length-1);	// select the added tab panel
		}
	}
	
	/**
	 * update tab panel, param has following properties:
	 * tab: the tab panel to be updated
	 * options: the tab panel options
	 */
	function updateTab(container, param){
		var selectHis = $.data(container, 'tabs').selectHis;
		var pp = param.tab;	// the tab panel
		var oldTitle = pp.panel('options').title; 
		pp.panel($.extend({}, param.options, {
			iconCls: (param.options.icon ? param.options.icon : undefined)
		}));
		
		var opts = pp.panel('options');	// get the tab panel options
		var tab = opts.tab;
		
		var s_title = tab.find('span.tabs-title');
		var s_icon = tab.find('span.tabs-icon');
		s_title.html(opts.title);
		s_icon.attr('class', 'tabs-icon');
		
		tab.find('a.tabs-close').remove();
		if (opts.closable){
			s_title.addClass('tabs-closable');
			var a_close = $('<a href="javascript:void(0)" class="tabs-close"></a>').appendTo(tab);
			a_close.bind('click.tabs', {p:pp}, function(e){
				if ($(this).parent().hasClass('tabs-disabled')){return;}
				closeTab(container, getTabIndex(container, e.data.p));
				return false;
			});
		} else{
			s_title.removeClass('tabs-closable');
		}
		if (opts.iconCls){
			s_title.addClass('tabs-with-icon');
			s_icon.addClass(opts.iconCls);
		} else {
			s_title.removeClass('tabs-with-icon');
		}
		
		if (oldTitle != opts.title){
			for(var i=0; i<selectHis.length; i++){
				if (selectHis[i] == oldTitle){
					selectHis[i] = opts.title;
				}
			}
		}
		
		tab.find('span.tabs-p-tool').remove();
		if (opts.tools){
			var p_tool = $('<span class="tabs-p-tool"></span>').insertAfter(tab.find('a.tabs-inner'));
			if (typeof opts.tools == 'string'){
				$(opts.tools).children().appendTo(p_tool);
			} else {
				for(var i=0; i<opts.tools.length; i++){
					var t = $('<a href="javascript:void(0)"></a>').appendTo(p_tool);
					t.addClass(opts.tools[i].iconCls);
					if (opts.tools[i].handler){
//						t.bind('click', eval(opts.tools[i].handler));
						t.bind('click', {handler:opts.tools[i].handler}, function(e){
							if ($(this).parents('li').hasClass('tabs-disabled')){return;}
							e.data.handler.call(this);
						});
					}
				}
			}
			var pr = p_tool.children().length * 12;
			if (opts.closable) {
				pr += 8;
			} else {
				pr -= 3;
				p_tool.css('right','5px');
			}
			s_title.css('padding-right', pr+'px');
		}
		
//		setProperties(container);
		setScrollers(container);
		
		$.data(container, 'tabs').options.onUpdate.call(container, opts.title, getTabIndex(container, pp));
	}
	
	/**
	 * close a tab with specified index or title
	 */
	function closeTab(container, which) {
		var opts = $.data(container, 'tabs').options;
		var tabs = $.data(container, 'tabs').tabs;
		var selectHis = $.data(container, 'tabs').selectHis;
		
		if (!exists(container, which)) return;
		
		var tab = getTab(container, which);
		var title = tab.panel('options').title;
		var index = getTabIndex(container, tab);
		
		if (opts.onBeforeClose.call(container, title, index) == false) return;
		
		var tab = getTab(container, which, true);
		tab.panel('options').tab.remove();
		tab.panel('destroy');
		
		opts.onClose.call(container, title, index);
		
		setScrollers(container);
		
		// remove the select history item
		for(var i=0; i<selectHis.length; i++){
			if (selectHis[i] == title){
				selectHis.splice(i, 1);
				i --;
			}
		}
		
		// select the nearest tab panel
		var hisTitle = selectHis.pop();
		if (hisTitle){
			selectTab(container, hisTitle);
		} else if (tabs.length){
			selectTab(container, 0);
		}
	}
	
	/**
	 * get the specified tab panel
	 */
	function getTab(container, which, removeit){
		var tabs = $.data(container, 'tabs').tabs;
		if (typeof which == 'number'){
			if (which < 0 || which >= tabs.length){
				return null;
			} else {
				var tab = tabs[which];
				if (removeit) {
					tabs.splice(which, 1);
				}
				return tab;
			}
		}
		for(var i=0; i<tabs.length; i++){
			var tab = tabs[i];
			if (tab.panel('options').title == which){
				if (removeit){
					tabs.splice(i, 1);
				}
				return tab;
			}
		}
		return null;
	}
	
	function getTabIndex(container, tab){
		var tabs = $.data(container, 'tabs').tabs;
		for(var i=0; i<tabs.length; i++){
			if (tabs[i][0] == $(tab)[0]){
				return i;
			}
		}
		return -1;
	}
	
	function getSelectedTab(container){
		var tabs = $.data(container, 'tabs').tabs;
		for(var i=0; i<tabs.length; i++){
			var tab = tabs[i];
			if (tab.panel('options').closed == false){
				return tab;
			}
		}
		return null;
	}
	
	/**
	 * do first select action, if no tab is setted the first tab will be selected.
	 */
	function doFirstSelect(container){
		var tabs = $.data(container, 'tabs').tabs;
		for(var i=0; i<tabs.length; i++){
			if (tabs[i].panel('options').selected){
				selectTab(container, i);
				return;
			}
		}
		if (tabs.length){
			selectTab(container, 0);
		}
	}
	
	function selectTab(container, which){
		var opts = $.data(container, 'tabs').options;
		var tabs = $.data(container, 'tabs').tabs;
		var selectHis = $.data(container, 'tabs').selectHis;
		
		if (tabs.length == 0) return;
		
		var panel = getTab(container, which); // get the panel to be activated
		if (!panel) return;
		
		var selected = getSelectedTab(container);
		if (selected){
			selected.panel('close');
			selected.panel('options').tab.removeClass('tabs-selected');
		}
		
		panel.panel('open');
		var title = panel.panel('options').title;	// the panel title
		selectHis.push(title);	// push select history
		
		var tab = panel.panel('options').tab;	// get the tab object
		tab.addClass('tabs-selected');
		
		// scroll the tab to center position if required.
		var wrap = $(container).find('>div.tabs-header>div.tabs-wrap');
		var left = tab.position().left;
		var right = left + tab.outerWidth();
		if (left < 0 || right > wrap.width()){
			var deltaX = left - (wrap.width()-tab.width()) / 2;
			$(container).tabs('scrollBy', deltaX);
		} else {
			$(container).tabs('scrollBy', 0);
		}
		
		setSelectedSize(container);
		
		opts.onSelect.call(container, title, getTabIndex(container, panel));
	}
	
	function exists(container, which){
		return getTab(container, which) != null;
	}
	
	
	$.fn.tabs = function(options, param){
		if (typeof options == 'string') {
			return $.fn.tabs.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'tabs');
			var opts;
			if (state) {
				opts = $.extend(state.options, options);
				state.options = opts;
			} else {
				$.data(this, 'tabs', {
					options: $.extend({},$.fn.tabs.defaults, $.fn.tabs.parseOptions(this), options),
					tabs: [],
					selectHis: []
				});
				wrapTabs(this);
			}
			
			addTools(this);
			setProperties(this);
			setSize(this);
			
			doFirstSelect(this);
		});
	};
	
	$.fn.tabs.methods = {
		options: function(jq){
			return $.data(jq[0], 'tabs').options;
		},
		tabs: function(jq){
			return $.data(jq[0], 'tabs').tabs;
		},
		resize: function(jq){
			return jq.each(function(){
				setSize(this);
				setSelectedSize(this);
			});
		},
		add: function(jq, options){
			return jq.each(function(){
				addTab(this, options);
			});
		},
		close: function(jq, which){
			return jq.each(function(){
				closeTab(this, which);
			});
		},
		getTab: function(jq, which){
			return getTab(jq[0], which);
		},
		getTabIndex: function(jq, tab){
			return getTabIndex(jq[0], tab);
		},
		getSelected: function(jq){
			return getSelectedTab(jq[0]);
		},
		select: function(jq, which){
			return jq.each(function(){
				selectTab(this, which);
			});
		},
		exists: function(jq, which){
			return exists(jq[0], which);
		},
		update: function(jq, options){
			return jq.each(function(){
				updateTab(this, options);
			});
		},
		enableTab: function(jq, which){
			return jq.each(function(){
				$(this).tabs('getTab', which).panel('options').tab.removeClass('tabs-disabled');
			});
		},
		disableTab: function(jq, which){
			return jq.each(function(){
				$(this).tabs('getTab', which).panel('options').tab.addClass('tabs-disabled');
			});
		},
		scrollBy: function(jq, deltaX){	// scroll the tab header by the specified amount of pixels
			return jq.each(function(){
				var opts = $(this).tabs('options');
				var wrap = $(this).find('>div.tabs-header>div.tabs-wrap');
				var pos = Math.min(wrap._scrollLeft() + deltaX, getMaxScrollWidth());
				wrap.animate({scrollLeft: pos}, opts.scrollDuration);
				
				function getMaxScrollWidth(){
					var w = 0;
					var ul = wrap.children('ul');
					ul.children('li').each(function(){
						w += $(this).outerWidth(true);
					});
					return w - wrap.width() + (ul.outerWidth() - ul.width());
				}
			});
		}
	};
	
	$.fn.tabs.parseOptions = function(target){
		return $.extend({}, $.parser.parseOptions(target, [
			'width','height','tools','toolPosition','tabPosition',
			{fit:'boolean',border:'boolean',plain:'boolean',headerWidth:'number'}
		]));
	};
	
	$.fn.tabs.defaults = {
		width: 'auto',
		height: 'auto',
		headerWidth: 150,	// the tab header width, it is valid only when tabPosition set to 'left' or 'right' 
		plain: false,
		fit: false,
		border: true,
		tools: null,
		toolPosition: 'right',	// left,right
		tabPosition: 'top',		// possible values: top,bottom
		scrollIncrement: 100,
		scrollDuration: 400,
		onLoad: function(panel){},
		onSelect: function(title, index){},
		onBeforeClose: function(title, index){},
		onClose: function(title, index){},
		onAdd: function(title, index){},
		onUpdate: function(title, index){},
		onContextMenu: function(e, title, index){}
	};
})(jQuery);
/**
 * layout - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 * Dependencies:
 *   resizable
 *   panel
 */
(function($){
	var resizing = false;	// indicate if the region panel is resizing
	
	function setSize(container){
		var state = $.data(container, 'layout');
		var opts = state.options;
		var panels = state.panels;
		
		var cc = $(container);
		if (container.tagName == 'BODY'){
			cc._fit();
		} else {
			opts.fit ? cc.css(cc._fit()) : cc._fit(false);
		}
		
//		opts.fit ? cc.css(cc._fit()) : cc._fit(false);
//		if (opts.fit == true){
//			var p = cc.parent();
//			p.addClass('panel-noscroll');
//			if (p[0].tagName == 'BODY') $('html').addClass('panel-fit');
//			cc.width(p.width());
//			cc.height(p.height());
//		}
		
		var cpos = {
			top:0,
			left:0,
			width:cc.width(),
			height:cc.height()
		};
		
		// set north panel size
		function setNorthSize(pp){
			if (pp.length == 0) return;
			var opts = pp.panel('options');
			var height = Math.min(Math.max(opts.height, opts.minHeight), opts.maxHeight);
			pp.panel('resize', {
				width: cc.width(),
				height: height,
				left: 0,
				top: 0
			});
			cpos.top += height;
			cpos.height -= height;
		}
		if (isVisible(panels.expandNorth)){
			setNorthSize(panels.expandNorth);
		} else {
			setNorthSize(panels.north);
		}
		
		// set south panel size
		function setSouthSize(pp){
			if (pp.length == 0) return;
			var opts = pp.panel('options');
			var height = Math.min(Math.max(opts.height, opts.minHeight), opts.maxHeight);
			pp.panel('resize', {
				width: cc.width(),
				height: height,
				left: 0,
				top: cc.height() - height
			});
			cpos.height -= height;
		}
		if (isVisible(panels.expandSouth)){
			setSouthSize(panels.expandSouth);
		} else {
			setSouthSize(panels.south);
		}
		
		// set east panel size
		function setEastSize(pp){
			if (pp.length == 0) return;
			var opts = pp.panel('options');
			var width = Math.min(Math.max(opts.width, opts.minWidth), opts.maxWidth);
			pp.panel('resize', {
				width: width,
				height: cpos.height,
				left: cc.width() - width,
				top: cpos.top
			});
			cpos.width -= width;
		}
		if (isVisible(panels.expandEast)){
			setEastSize(panels.expandEast);
		} else {
			setEastSize(panels.east);
		}
		
		// set west panel size
		function setWestSize(pp){
			if (pp.length == 0) return;
			var opts = pp.panel('options');
			var width = Math.min(Math.max(opts.width, opts.minWidth), opts.maxWidth);
			pp.panel('resize', {
				width: width,
				height: cpos.height,
				left: 0,
				top: cpos.top
			});
			cpos.left += width;
			cpos.width -= width;
		}
		if (isVisible(panels.expandWest)){
			setWestSize(panels.expandWest);
		} else {
			setWestSize(panels.west);
		}
		
		panels.center.panel('resize', cpos);
	}
	
	/**
	 * initialize and wrap the layout
	 */
	function init(container){
		var cc = $(container);
		
//		if (cc[0].tagName == 'BODY'){
//			$('html').addClass('panel-fit');
//		}
		cc.addClass('layout');
		
		function _add(cc){
			cc.children('div').each(function(){
				var opts = $.parser.parseOptions(this, ['region',{split:'boolean',minWidth:'number',minHeight:'number',maxWidth:'number',maxHeight:'number'}]);
				var r = opts.region;
				if (r=='north' || r=='south' || r=='east' || r=='west' || r=='center'){
					addPanel(container, opts, this);
//					addPanel(container, {region:r}, this);
				}
			});
		}
		
		cc.children('form').length ? _add(cc.children('form')) : _add(cc);
		
		$('<div class="layout-split-proxy-h"></div>').appendTo(cc);
		$('<div class="layout-split-proxy-v"></div>').appendTo(cc);
		
		cc.bind('_resize', function(e,force){
			var opts = $.data(container, 'layout').options;
			if (opts.fit == true || force){
				setSize(container);
			}
			return false;
		});
	}
	
	/**
	 * Add a new region panel on specified element
	 */
	function addPanel(container, param, el){
		param.region = param.region || 'center';
		var panels = $.data(container, 'layout').panels;
		var cc = $(container);
		var dir = param.region;
		
		if (panels[dir].length) return;	// the region panel is already exists
		
		var pp = $(el);
		if (!pp.length){
			pp = $('<div></div>').appendTo(cc);	// the predefined panel isn't exists, create a new panel instead
		}
		
		// create region panel
		pp.panel($.extend({
			minWidth:10,
			minHeight:10,
			maxWidth:10000,
			maxHeight:10000
		},{
			width: (pp.length ? parseInt(pp[0].style.width) || pp.outerWidth() : 'auto'),
			height: (pp.length ? parseInt(pp[0].style.height) || pp.outerHeight() : 'auto'),
//			split: (pp.attr('split') ? pp.attr('split') == 'true' : undefined),
			doSize: false,
			collapsible: true,
			cls: ('layout-panel layout-panel-' + dir),
			bodyCls: 'layout-body',
			onOpen: function(){
				var tool = $(this).panel('header').children('div.panel-tool');
				tool.children('a.panel-tool-collapse').hide();	// hide the old collapse button
				
				var buttonDir = {north:'up',south:'down',east:'right',west:'left'};
				if (!buttonDir[dir]) return;
				
				var iconCls = 'layout-button-' + buttonDir[dir];
				// add collapse tool to panel header
				var t = tool.children('a.' + iconCls);
				if (!t.length){
					t = $('<a href="javascript:void(0)"></a>').addClass(iconCls).appendTo(tool);
					t.bind('click', {dir:dir}, function(e){
						collapsePanel(container, e.data.dir);
						return false;
					});
				}
				$(this).panel('options').collapsible ? t.show() : t.hide();
			}
		}, param));
		
		panels[dir] = pp;
		
		if (pp.panel('options').split){
			var panel = pp.panel('panel');
			panel.addClass('layout-split-' + dir);
			
			var handles = '';
			if (dir == 'north') handles = 's';
			if (dir == 'south') handles = 'n';
			if (dir == 'east') handles = 'w';
			if (dir == 'west') handles = 'e';
			
			panel.resizable($.extend({}, {
				handles:handles,
				onStartResize: function(e){
					resizing = true;
					
					if (dir == 'north' || dir == 'south'){
						var proxy = $('>div.layout-split-proxy-v', container);
					} else {
						var proxy = $('>div.layout-split-proxy-h', container);
					}
					var top=0,left=0,width=0,height=0;
					var pos = {display: 'block'};
					if (dir == 'north'){
						pos.top = parseInt(panel.css('top')) + panel.outerHeight() - proxy.height();
						pos.left = parseInt(panel.css('left'));
						pos.width = panel.outerWidth();
						pos.height = proxy.height();
					} else if (dir == 'south'){
						pos.top = parseInt(panel.css('top'));
						pos.left = parseInt(panel.css('left'));
						pos.width = panel.outerWidth();
						pos.height = proxy.height();
					} else if (dir == 'east'){
						pos.top = parseInt(panel.css('top')) || 0;
						pos.left = parseInt(panel.css('left')) || 0;
						pos.width = proxy.width();
						pos.height = panel.outerHeight();
					} else if (dir == 'west'){
						pos.top = parseInt(panel.css('top')) || 0;
						pos.left = panel.outerWidth() - proxy.width();
						pos.width = proxy.width();
						pos.height = panel.outerHeight();
					}
					proxy.css(pos);
					
					$('<div class="layout-mask"></div>').css({
						left:0,
						top:0,
						width:cc.width(),
						height:cc.height()
					}).appendTo(cc);
				},
				onResize: function(e){
					if (dir == 'north' || dir == 'south'){
						var proxy = $('>div.layout-split-proxy-v', container);
						proxy.css('top', e.pageY - $(container).offset().top - proxy.height()/2);
					} else {
						var proxy = $('>div.layout-split-proxy-h', container);
						proxy.css('left', e.pageX - $(container).offset().left - proxy.width()/2);
					}
					return false;
				},
				onStopResize: function(){
					$('>div.layout-split-proxy-v', container).css('display','none');
					$('>div.layout-split-proxy-h', container).css('display','none');
					var opts = pp.panel('options');
					opts.width = panel.outerWidth();
					opts.height = panel.outerHeight();
					opts.left = panel.css('left');
					opts.top = panel.css('top');
					pp.panel('resize');
					setSize(container);
					resizing = false;
					
					cc.find('>div.layout-mask').remove();
				}
			}, param));
		}
	}
	
	/**
	 * remove a region panel
	 */
	function removePanel(container, region){
		var panels = $.data(container, 'layout').panels;
		if (panels[region].length){
			panels[region].panel('destroy');
			panels[region] = $();
			var expandP = 'expand' + region.substring(0,1).toUpperCase() + region.substring(1);
			if (panels[expandP]){
				panels[expandP].panel('destroy');
				panels[expandP] = undefined;
			}
		}
	}
	
	function collapsePanel(container, region, animateSpeed){
		if (animateSpeed == undefined) animateSpeed = 'normal';
		var panels = $.data(container, 'layout').panels;
		
		var p = panels[region];
		if (p.panel('options').onBeforeCollapse.call(p) == false) return;
		
		// expand panel name: expandNorth, expandSouth, expandWest, expandEast
		var expandP = 'expand' + region.substring(0,1).toUpperCase() + region.substring(1);
		if (!panels[expandP]){
			panels[expandP] = createExpandPanel(region);
			panels[expandP].panel('panel').click(function(){
				var copts = getOption();
				p.panel('expand',false).panel('open').panel('resize', copts.collapse);
//				p.panel('panel').animate(copts.expand);
				
				p.panel('panel').animate(copts.expand, animateSpeed, function(){
					$(this).unbind('.layout').bind('mouseleave.layout', {region:region}, function(e){
						if (resizing == true) return;
						collapsePanel(container, e.data.region);
					});
				});
				
				return false;
			});
		}
		
		var copts = getOption();
		if (!isVisible(panels[expandP])){
			panels.center.panel('resize',copts.resizeC);
		}
		p.panel('panel').animate(copts.collapse, animateSpeed, function(){
			p.panel('collapse',false).panel('close');
			panels[expandP].panel('open').panel('resize',copts.expandP);
			
			$(this).unbind('.layout');
		});
		
		/**
		 * create expand panel
		 */
		function createExpandPanel(dir){
			var icon;
			if (dir == 'east') icon = 'layout-button-left'
			else if (dir == 'west') icon = 'layout-button-right'
			else if (dir == 'north') icon = 'layout-button-down'
			else if (dir == 'south') icon = 'layout-button-up';
			
			var p = $('<div></div>').appendTo(container).panel({
				cls: 'layout-expand',
				title: '&nbsp;',
				closed: true,
				doSize: false,
				tools: [{
					iconCls: icon,
					handler:function(){
						expandPanel(container, region);
						return false;
					}
				}]
			});
			p.panel('panel').hover(
				function(){$(this).addClass('layout-expand-over');},
				function(){$(this).removeClass('layout-expand-over');}
			);
			return p;
		}
		
		/**
		 * get collapse option:{
		 *   resizeC:{},
		 *   expand:{},
		 *   expandP:{},	// the expand holder panel
		 *   collapse:{}
		 * }
		 */
		function getOption(){
			var cc = $(container);
			if (region == 'east'){
				return {
					resizeC:{
						width:panels.center.panel('options').width + panels['east'].panel('options').width - 28
					},
					expand:{
						left: cc.width() - panels['east'].panel('options').width
					},
					expandP:{
						top: panels['east'].panel('options').top,
						left: cc.width() - 28,
						width: 28,
						height: panels['center'].panel('options').height
					},
					collapse:{
						left:cc.width()
					}
				};
			} else if (region == 'west'){
				return {
					resizeC:{
						width:panels.center.panel('options').width + panels['west'].panel('options').width - 28,
						left:28
					},
					expand:{
						left:0
					},
					expandP:{
						left:0,
						top:panels['west'].panel('options').top,
						width:28,
						height:panels['center'].panel('options').height
					},
					collapse:{
						left:-panels['west'].panel('options').width
					}
				};
			} else if (region == 'north'){
				var hh = cc.height() - 28;
				if (isVisible(panels.expandSouth)){
					hh -= panels.expandSouth.panel('options').height;
				} else if (isVisible(panels.south)){
					hh -= panels.south.panel('options').height;
				}
				panels.east.panel('resize', {top:28, height:hh});
				panels.west.panel('resize', {top:28, height:hh});
				if (isVisible(panels.expandEast)) panels.expandEast.panel('resize', {top:28, height:hh});
				if (isVisible(panels.expandWest)) panels.expandWest.panel('resize', {top:28, height:hh});
				
				return {
					resizeC:{
						top:28,
						height:hh
					},
					expand:{
						top:0
					},
					expandP:{
						top: 0,
						left: 0,
						width: cc.width(),
						height: 28
					},
					collapse:{
						top:-panels['north'].panel('options').height
					}
				};
			} else if (region == 'south'){
				var hh = cc.height() - 28;
				if (isVisible(panels.expandNorth)){
					hh -= panels.expandNorth.panel('options').height;
				} else if (isVisible(panels.north)){
					hh -= panels.north.panel('options').height;
				}
				panels.east.panel('resize', {height:hh});
				panels.west.panel('resize', {height:hh});
				if (isVisible(panels.expandEast)) panels.expandEast.panel('resize', {height:hh});
				if (isVisible(panels.expandWest)) panels.expandWest.panel('resize', {height:hh});
				
				return {
					resizeC:{
						height:hh
					},
					expand:{
						top:cc.height()-panels['south'].panel('options').height
					},
					expandP:{
						top: cc.height() - 28,
						left: 0,
						width: cc.width(),
						height: 28
					},
					collapse:{
						top:cc.height()
					}
				};
			}
		}
	}
	
	function expandPanel(container, region){
		var panels = $.data(container, 'layout').panels;
		
		var eopts = getOption();
		var p = panels[region];
		if (p.panel('options').onBeforeExpand.call(p) == false) return;
		var expandP = 'expand' + region.substring(0,1).toUpperCase() + region.substring(1);
		panels[expandP].panel('close');
		p.panel('panel').stop(true,true);
		p.panel('expand',false).panel('open').panel('resize', eopts.collapse);
		p.panel('panel').animate(eopts.expand, function(){
			setSize(container);
		});
		
		/**
		 * get expand option: {
		 *   collapse:{},
		 *   expand:{}
		 * }
		 */
		function getOption(){
			var cc = $(container);
			if (region == 'east' && panels.expandEast){
				return {
					collapse:{
						left:cc.width()
					},
					expand:{
						left:cc.width() - panels['east'].panel('options').width
					}
				};
			} else if (region == 'west' && panels.expandWest){
				return {
					collapse:{
						left: -panels['west'].panel('options').width
					},
					expand:{
						left:0
					}
				};
			} else if (region == 'north' && panels.expandNorth){
				return {
					collapse:{
						top:-panels['north'].panel('options').height
					},
					expand:{
						top:0
					}
				};
			} else if (region == 'south' && panels.expandSouth){
				return {
					collapse:{
						top:cc.height()
					},
					expand:{
						top:cc.height()-panels['south'].panel('options').height
					}
				};
			}
		}
	}
	
//	function bindEvents(container){
//		var panels = $.data(container, 'layout').panels;
//		var cc = $(container);
//		
//		// bind east panel events
//		if (panels.east.length){
//			panels.east.panel('panel').bind('mouseover','east',_collapse);
//		}
//		
//		// bind west panel events
//		if (panels.west.length){
//			panels.west.panel('panel').bind('mouseover','west',_collapse);
//		}
//		
//		// bind north panel events
//		if (panels.north.length){
//			panels.north.panel('panel').bind('mouseover','north',_collapse);
//		}
//		
//		// bind south panel events
//		if (panels.south.length){
//			panels.south.panel('panel').bind('mouseover','south',_collapse);
//		}
//		
//		panels.center.panel('panel').bind('mouseover','center',_collapse);
//		
//		function _collapse(e){
//			if (resizing == true) return;
//			
//			if (e.data != 'east' && isVisible(panels.east) && isVisible(panels.expandEast)){
//				collapsePanel(container, 'east');
//			}
//			if (e.data != 'west' && isVisible(panels.west) && isVisible(panels.expandWest)){
//				collapsePanel(container, 'west');
//			}
//			if (e.data != 'north' && isVisible(panels.north) && isVisible(panels.expandNorth)){
//				collapsePanel(container, 'north');
//			}
//			if (e.data != 'south' && isVisible(panels.south) && isVisible(panels.expandSouth)){
//				collapsePanel(container, 'south');
//			}
//			return false;
//		}
//	}
	
	function isVisible(pp){
		if (!pp) return false;
		if (pp.length){
			return pp.panel('panel').is(':visible');
		} else {
			return false;
		}
	}
	
	function initCollapse(container){
		var panels = $.data(container, 'layout').panels;
		if (panels.east.length && panels.east.panel('options').collapsed) {
			collapsePanel(container, 'east', 0);
		}
		if (panels.west.length && panels.west.panel('options').collapsed) {
			collapsePanel(container, 'west', 0);
		}
		if (panels.north.length && panels.north.panel('options').collapsed) {
			collapsePanel(container, 'north', 0);
		}
		if (panels.south.length && panels.south.panel('options').collapsed) {
			collapsePanel(container, 'south', 0);
		}
	}
	
	$.fn.layout = function(options, param){
		if (typeof options == 'string'){
			return $.fn.layout.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'layout');
			if (state){
				$.extend(state.options, options);
			} else {
				var opts = $.extend({}, $.fn.layout.defaults, $.fn.layout.parseOptions(this), options);
				$.data(this, 'layout', {
					options: opts,
					panels: {center:$(), north:$(), south:$(), east:$(), west:$()}
				});
				init(this);
//				bindEvents(this);
			}
			setSize(this);
			initCollapse(this);
		});
	};
	
	$.fn.layout.methods = {
		resize: function(jq){
			return jq.each(function(){
				setSize(this);
			});
		},
		panel: function(jq, region){
			return $.data(jq[0], 'layout').panels[region];
		},
		collapse: function(jq, region){
			return jq.each(function(){
				collapsePanel(this, region);
			});
		},
		expand: function(jq, region){
			return jq.each(function(){
				expandPanel(this, region);
			});
		},
		add: function(jq, options){
			return jq.each(function(){
				addPanel(this, options);
				setSize(this);
				if ($(this).layout('panel', options.region).panel('options').collapsed){
					collapsePanel(this, options.region, 0);
				}
			});
		},
		remove: function(jq, region){
			return jq.each(function(){
				removePanel(this, region);
				setSize(this);
			});
		}
	};
	
	$.fn.layout.parseOptions = function(target){
		return $.extend({}, $.parser.parseOptions(target,[{fit:'boolean'}]));
	};
	
	$.fn.layout.defaults = {
		fit: false
	};
})(jQuery);
/**
 * menu - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 */
(function($){
	
	/**
	 * initialize the target menu, the function can be invoked only once
	 */
	function init(target){
		$(target).appendTo('body');
		$(target).addClass('menu-top');	// the top menu
		
		$(document).unbind('.menu').bind('mousedown.menu', function(e){
			var allMenu = $('body>div.menu:visible');
			var m = $(e.target).closest('div.menu', allMenu);
			if (m.length){return}
			$('body>div.menu-top:visible').menu('hide');
		});
		
		var menus = splitMenu($(target));
		for(var i=0; i<menus.length; i++){
			createMenu(menus[i]);
		}
		
		function splitMenu(menu){
			var menus = [];
			menu.addClass('menu');
			menus.push(menu);
			if (!menu.hasClass('menu-content')){
				menu.children('div').each(function(){
					var submenu = $(this).children('div');
					if (submenu.length){
						submenu.insertAfter(target);
						this.submenu = submenu;		// point to the sub menu
						var mm = splitMenu(submenu);
						menus = menus.concat(mm);
					}
				});
			}
			return menus;
		}
		
		function createMenu(menu){
			var width = $.parser.parseOptions(menu[0], ['width']).width;
			if (menu.hasClass('menu-content')){
				menu[0].originalWidth = width || menu._outerWidth();
			} else {
				menu[0].originalWidth = width || 0;
				menu.children('div').each(function(){
					var item = $(this);
					if (item.hasClass('menu-sep')){
//						item.html('&nbsp;');
					} else {
						var itemOpts = $.extend({}, $.parser.parseOptions(this,['name','iconCls','href']), {
							disabled: (item.attr('disabled') ? true : undefined)
						});
						item.attr('name',itemOpts.name || '').attr('href',itemOpts.href || '');
						
						var text = item.addClass('menu-item').html();
						item.empty().append($('<div class="menu-text"></div>').html(text));
						if (itemOpts.iconCls){
							$('<div class="menu-icon"></div>').addClass(itemOpts.iconCls).appendTo(item);
						}
						if (itemOpts.disabled){
							setDisabled(target, item[0], true);
						}
						if (item[0].submenu){
							$('<div class="menu-rightarrow"></div>').appendTo(item);	// has sub menu
						}
						
						bindMenuItemEvent(target, item);
					}
				});
				$('<div class="menu-line"></div>').prependTo(menu);
			}
			setMenuWidth(target, menu);
			menu.hide();
			
			bindMenuEvent(target, menu);
		}
	}
	
	function setMenuWidth(target, menu){
		var opts = $.data(target, 'menu').options;
		var d = menu.css('display');
		menu.css({
			display: 'block',
			left:-10000
		});
		
		menu.find('div.menu-item')._outerHeight(22);
		var width = 0;
		menu.find('div.menu-text').each(function(){
			if (width < $(this)._outerWidth()){
				width = $(this)._outerWidth();
			}
		});
		width += 65;
		menu._outerWidth(Math.max((menu[0].originalWidth || 0), width, opts.minWidth));
		
		menu.css('display', d);
	}
	
	/**
	 * bind menu event
	 */
	function bindMenuEvent(target, menu){
		var state = $.data(target, 'menu');
		menu.unbind('.menu').bind('mouseenter.menu', function(){
			if (state.timer){
				clearTimeout(state.timer);
				state.timer = null;
			}
		}).bind('mouseleave.menu', function(){
			state.timer = setTimeout(function(){
				hideAll(target);
			}, 100);
		});
	}
	
	/**
	 * bind menu item event
	 */
	function bindMenuItemEvent(target, item){
		item.unbind('.menu');
		item.bind('click.menu', function(){
			if ($(this).hasClass('menu-item-disabled')){
				return;
			}
			// only the sub menu clicked can hide all menus
			if (!this.submenu){
				hideAll(target);
				var href = $(this).attr('href');
				if (href){
					location.href = href;
				}
			}
			var item = $(target).menu('getItem', this);
			$.data(target, 'menu').options.onClick.call(target, item);
		}).bind('mouseenter.menu', function(e){
			// hide other menu
			item.siblings().each(function(){
				if (this.submenu){
					hideMenu(this.submenu);
				}
				$(this).removeClass('menu-active');
			});
			// show this menu
			item.addClass('menu-active');
			
			if ($(this).hasClass('menu-item-disabled')){
				item.addClass('menu-active-disabled');
				return;
			}
			
			var submenu = item[0].submenu;
			if (submenu){
				$(target).menu('show', {
					menu: submenu,
					parent: item
				});
			}
		}).bind('mouseleave.menu', function(e){
			item.removeClass('menu-active menu-active-disabled');
			var submenu = item[0].submenu;
			if (submenu){
				if (e.pageX>=parseInt(submenu.css('left'))){
					item.addClass('menu-active');
				} else {
					hideMenu(submenu);
				}
				
			} else {
				item.removeClass('menu-active');
			}
		});
	}
	
	/**
	 * hide top menu and it's all sub menus
	 */
	function hideAll(target){
		var state = $.data(target, 'menu');
		if (state){
			if ($(target).is(':visible')){
				hideMenu($(target));
				state.options.onHide.call(target);
			}
		}
		return false;
	}
	
	/**
	 * show the menu, the 'param' object has one or more properties:
	 * left: the left position to display
	 * top: the top position to display
	 * menu: the menu to display, if not defined, the 'target menu' is used
	 * parent: the parent menu item to align to
	 * alignTo: the element object to align to
	 */
	function showMenu(target, param){
		var left,top;
		var menu = $(param.menu || target);
		if (menu.hasClass('menu-top')){
			var opts = $.data(target, 'menu').options;
			left = opts.left;
			top = opts.top;
			if (param.alignTo){
				var at = $(param.alignTo);
				left = at.offset().left;
				top = at.offset().top + at._outerHeight();
			}
			if (param.left != undefined){left = param.left}
			if (param.top != undefined){top = param.top}
			if (left + menu.outerWidth() > $(window)._outerWidth() + $(document)._scrollLeft()){
				left = $(window)._outerWidth() + $(document).scrollLeft() - menu.outerWidth() - 5;
			}
			if (top + menu.outerHeight() > $(window)._outerHeight() + $(document).scrollTop()){
				top -= menu.outerHeight();
			}
		} else {
			var parent = param.parent;	// the parent menu item
			left = parent.offset().left + parent.outerWidth() - 2;
			if (left + menu.outerWidth() + 5 > $(window)._outerWidth() + $(document).scrollLeft()){
				left = parent.offset().left - menu.outerWidth() + 2;
			}
			var top = parent.offset().top - 3;
			if (top + menu.outerHeight() > $(window)._outerHeight() + $(document).scrollTop()){
				top = $(window)._outerHeight() + $(document).scrollTop() - menu.outerHeight() - 5;
			}
		}
		menu.css({left:left,top:top});
		menu.show(0, function(){
			if (!menu[0].shadow){
				menu[0].shadow = $('<div class="menu-shadow"></div>').insertAfter(menu);
			}
			menu[0].shadow.css({
				display:'block',
				zIndex:$.fn.menu.defaults.zIndex++,
				left:menu.css('left'),
				top:menu.css('top'),
				width:menu.outerWidth(),
				height:menu.outerHeight()
			});
			menu.css('z-index', $.fn.menu.defaults.zIndex++);
			if (menu.hasClass('menu-top')){
				$.data(menu[0], 'menu').options.onShow.call(menu[0]);
			}
		});
	}
	
	function hideMenu(menu){
		if (!menu) return;
		
		hideit(menu);
		menu.find('div.menu-item').each(function(){
			if (this.submenu){
				hideMenu(this.submenu);
			}
			$(this).removeClass('menu-active');
		});
		
		function hideit(m){
			m.stop(true,true);
			if (m[0].shadow){
				m[0].shadow.hide();
			}
			m.hide();
		}
	}
	
	function findItem(target, text){
		var result = null;
		var tmp = $('<div></div>');
		function find(menu){
			menu.children('div.menu-item').each(function(){
				var item = $(target).menu('getItem', this);
				var s = tmp.empty().html(item.text).text();
				if (text == $.trim(s)) {
					result = item;
				} else if (this.submenu && !result){
					find(this.submenu);
				}
			});
		}
		find($(target));
		tmp.remove();
		return result;
	}
	
	function setDisabled(target, itemEl, disabled){
		var t = $(itemEl);
		
		if (disabled){
			t.addClass('menu-item-disabled');
			if (itemEl.onclick){
				itemEl.onclick1 = itemEl.onclick;
				itemEl.onclick = null;
			}
		} else {
			t.removeClass('menu-item-disabled');
			if (itemEl.onclick1){
				itemEl.onclick = itemEl.onclick1;
				itemEl.onclick1 = null;
			}
		}
	}
	
	function appendItem(target, param){
		var menu = $(target);
		if (param.parent){
			if (!param.parent.submenu){
				var submenu = $('<div class="menu"><div class="menu-line"></div></div>').appendTo('body');
				submenu.hide();
				param.parent.submenu = submenu;
				$('<div class="menu-rightarrow"></div>').appendTo(param.parent);
			}
			menu = param.parent.submenu;
		}
		var item = $('<div class="menu-item"></div>').appendTo(menu);
		$('<div class="menu-text"></div>').html(param.text).appendTo(item);
		if (param.iconCls) $('<div class="menu-icon"></div>').addClass(param.iconCls).appendTo(item);
		if (param.id) item.attr('id', param.id);
		if (param.href) item.attr('href', param.href);
		if (param.name) item.attr('name', param.name);
		if (param.onclick){
			if (typeof param.onclick == 'string'){
				item.attr('onclick', param.onclick);
			} else {
				item[0].onclick = eval(param.onclick);
			}
		}
		if (param.handler) item[0].onclick = eval(param.handler);
		
		bindMenuItemEvent(target, item);
		
		if (param.disabled){
			setDisabled(target, item[0], true);
		}
		bindMenuEvent(target, menu);
		setMenuWidth(target, menu);
	}
	
	function removeItem(target, itemEl){
		function removeit(el){
			if (el.submenu){
				el.submenu.children('div.menu-item').each(function(){
					removeit(this);
				});
				var shadow = el.submenu[0].shadow;
				if (shadow) shadow.remove();
				el.submenu.remove();
			}
			$(el).remove();
		}
		removeit(itemEl);
	}
	
	function destroyMenu(target){
		$(target).children('div.menu-item').each(function(){
			removeItem(target, this);
		});
		if (target.shadow) target.shadow.remove();
		$(target).remove();
	}
	
	$.fn.menu = function(options, param){
		if (typeof options == 'string'){
			return $.fn.menu.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'menu');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'menu', {
					options: $.extend({}, $.fn.menu.defaults, $.fn.menu.parseOptions(this), options)
				});
				init(this);
			}
			$(this).css({
				left: state.options.left,
				top: state.options.top
			});
		});
	};
	
	$.fn.menu.methods = {
		options: function(jq){
			return $.data(jq[0], 'menu').options;
		},
		show: function(jq, pos){
			return jq.each(function(){
				showMenu(this, pos);
			});
		},
		hide: function(jq){
			return jq.each(function(){
				hideAll(this);
			});
		},
		destroy: function(jq){
			return jq.each(function(){
				destroyMenu(this);
			});
		},
		/**
		 * set the menu item text
		 * param: {
		 * 	target: DOM object, indicate the menu item
		 * 	text: string, the new text
		 * }
		 */
		setText: function(jq, param){
			return jq.each(function(){
				$(param.target).children('div.menu-text').html(param.text);
			});
		},
		/**
		 * set the menu icon class
		 * param: {
		 * 	target: DOM object, indicate the menu item
		 * 	iconCls: the menu item icon class
		 * }
		 */
		setIcon: function(jq, param){
			return jq.each(function(){
				var item = $(this).menu('getItem', param.target);
				if (item.iconCls){
					$(item.target).children('div.menu-icon').removeClass(item.iconCls).addClass(param.iconCls);
				} else {
					$('<div class="menu-icon"></div>').addClass(param.iconCls).appendTo(param.target);
				}
			});
		},
		/**
		 * get the menu item data that contains the following property:
		 * {
		 * 	target: DOM object, the menu item
		 *  id: the menu id
		 * 	text: the menu item text
		 * 	iconCls: the icon class
		 *  href: a remote address to redirect to
		 *  onclick: a function to be called when the item is clicked
		 * }
		 */
		getItem: function(jq, itemEl){
			var t = $(itemEl);
			var item = {
				target: itemEl,
				id: t.attr('id'),
				text: $.trim(t.children('div.menu-text').html()),
				disabled: t.hasClass('menu-item-disabled'),
				href: t.attr('href'),
				name: t.attr('name'),
				onclick: itemEl.onclick
			}
			var icon = t.children('div.menu-icon');
			if (icon.length){
				var cc = [];
				var aa = icon.attr('class').split(' ');
				for(var i=0; i<aa.length; i++){
					if (aa[i] != 'menu-icon'){
						cc.push(aa[i]);
					}
				}
				item.iconCls = cc.join(' ');
			}
			return item;
		},
		findItem: function(jq, text){
			return findItem(jq[0], text);
		},
		/**
		 * append menu item, the param contains following properties:
		 * parent,id,text,iconCls,href,onclick
		 * when parent property is assigned, append menu item to it
		 */
		appendItem: function(jq, param){
			return jq.each(function(){
				appendItem(this, param);
			});
		},
		removeItem: function(jq, itemEl){
			return jq.each(function(){
				removeItem(this, itemEl);
			});
		},
		enableItem: function(jq, itemEl){
			return jq.each(function(){
				setDisabled(this, itemEl, false);
			});
		},
		disableItem: function(jq, itemEl){
			return jq.each(function(){
				setDisabled(this, itemEl, true);
			});
		}
	};
	
	$.fn.menu.parseOptions = function(target){
		return $.extend({}, $.parser.parseOptions(target, ['left','top',{minWidth:'number'}]));
	};
	
	$.fn.menu.defaults = {
		zIndex:110000,
		left: 0,
		top: 0,
		minWidth: 120,
		onShow: function(){},
		onHide: function(){},
		onClick: function(item){}
	};
})(jQuery);
/**
 * menubutton - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 * Dependencies:
 *   linkbutton
 *   menu
 */
(function($){
	
	function init(target){
		var opts = $.data(target, 'menubutton').options;
		var btn = $(target);
		btn.removeClass('m-btn-active m-btn-plain-active').addClass('m-btn');
		btn.linkbutton($.extend({}, opts, {
			text: opts.text + '<span class="m-btn-downarrow">&nbsp;</span>'
		}));
		
		if (opts.menu){
			$(opts.menu).menu({
				onShow: function(){
					btn.addClass((opts.plain==true) ? 'm-btn-plain-active' : 'm-btn-active');
				},
				onHide: function(){
					btn.removeClass((opts.plain==true) ? 'm-btn-plain-active' : 'm-btn-active');
				}
			});
		}
		setDisabled(target, opts.disabled);
	}
	
	function setDisabled(target, disabled){
		var opts = $.data(target, 'menubutton').options;
		opts.disabled = disabled;
		
		var btn = $(target);
		if (disabled){
			btn.linkbutton('disable');
			btn.unbind('.menubutton');
		} else {
			btn.linkbutton('enable');
			btn.unbind('.menubutton');
			btn.bind('click.menubutton', function(){
				showMenu();
				return false;
			});
			var timeout = null;
			btn.bind('mouseenter.menubutton', function(){
				timeout = setTimeout(function(){
					showMenu();
				}, opts.duration);
				return false;
			}).bind('mouseleave.menubutton', function(){
				if (timeout){
					clearTimeout(timeout);
				}
			});
		}
		
		function showMenu(){
			if (!opts.menu) return;
			
//			var left = btn.offset().left;
//			if (left + $(opts.menu)._outerWidth() + 5 > $(window)._outerWidth()){
//				left = $(window)._outerWidth() - $(opts.menu)._outerWidth() - 5;
//			}
			
			$('body>div.menu-top').menu('hide');
			$(opts.menu).menu('show', {alignTo:btn});
//			$(opts.menu).menu('show', {
//				left: left,
//				top: btn.offset().top + btn.outerHeight()
//			});
			btn.blur();
		}
	}
	
	$.fn.menubutton = function(options, param){
		if (typeof options == 'string'){
			return $.fn.menubutton.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'menubutton');
			if (state){
				$.extend(state.options, options);
			} else {
//				$(this).append('<span class="m-btn-downarrow">&nbsp;</span>');
				$.data(this, 'menubutton', {
					options: $.extend({}, $.fn.menubutton.defaults, $.fn.menubutton.parseOptions(this), options)
				});
				$(this).removeAttr('disabled');
			}
			
			init(this);
		});
	};
	
	$.fn.menubutton.methods = {
		options: function(jq){
			return $.data(jq[0], 'menubutton').options;
		},
		enable: function(jq){
			return jq.each(function(){
				setDisabled(this, false);
			});
		},
		disable: function(jq){
			return jq.each(function(){
				setDisabled(this, true);
			});
		},
		destroy: function(jq){
			return jq.each(function(){
				var opts = $(this).menubutton('options');
				if (opts.menu){
					$(opts.menu).menu('destroy');
				}
				$(this).remove();
			});
		}
	};
	
	$.fn.menubutton.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.linkbutton.parseOptions(target), 
				$.parser.parseOptions(target, ['menu',{plain:'boolean',duration:'number'}]));
	};
	
	$.fn.menubutton.defaults = $.extend({}, $.fn.linkbutton.defaults, {
		plain: true,
		menu: null,
		duration: 100
	});
})(jQuery);
/**
 * splitbutton - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 * Dependencies:
 *   linkbutton
 *   menu
 */
(function($){
	
	function init(target){
		var opts = $.data(target, 'splitbutton').options;
		
		var btn = $(target);
		btn.removeClass('s-btn-active s-btn-plain-active').addClass('s-btn');
		btn.linkbutton($.extend({}, opts, {
			text: opts.text + '<span class="s-btn-downarrow">&nbsp;</span>'
		}));
		
		if (opts.menu){
			$(opts.menu).menu({
				onShow: function(){
					btn.addClass((opts.plain==true) ? 's-btn-plain-active' : 's-btn-active');
				},
				onHide: function(){
					btn.removeClass((opts.plain==true) ? 's-btn-plain-active' : 's-btn-active');
				}
			});
		}
		
		setDisabled(target, opts.disabled);
	}
	
	function setDisabled(target, disabled){
		var opts = $.data(target, 'splitbutton').options;
		opts.disabled = disabled;
		
		var btn = $(target);
		var menubtn = btn.find('.s-btn-downarrow');
		if (disabled){
			btn.linkbutton('disable');
			menubtn.unbind('.splitbutton');
		} else {
			btn.linkbutton('enable');
			menubtn.unbind('.splitbutton');
			menubtn.bind('click.splitbutton', function(){
				showMenu();
				return false;
			});
			var timeout = null;
			menubtn.bind('mouseenter.splitbutton', function(){
				timeout = setTimeout(function(){
					showMenu();
				}, opts.duration);
				return false;
			}).bind('mouseleave.splitbutton', function(){
				if (timeout){
					clearTimeout(timeout);
				}
			});
		}
		
		function showMenu(){
			if (!opts.menu) return;
			
//			var left = btn.offset().left;
//			if (left + $(opts.menu)._outerWidth() + 5 > $(window)._outerWidth()){
//				left = $(window)._outerWidth() - $(opts.menu)._outerWidth() - 5;
//			}
			
			$('body>div.menu-top').menu('hide');
			$(opts.menu).menu('show', {alignTo:btn});
//			$(opts.menu).menu('show', {
//				left: left,
//				top: btn.offset().top + btn.outerHeight()
//			});
			btn.blur();
		}
	}
	
	$.fn.splitbutton = function(options, param){
		if (typeof options == 'string'){
			return $.fn.splitbutton.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'splitbutton');
			if (state){
				$.extend(state.options, options);
			} else {
//				$(this).append('<span class="s-btn-downarrow">&nbsp;</span>');
				$.data(this, 'splitbutton', {
					options: $.extend({}, $.fn.splitbutton.defaults, $.fn.splitbutton.parseOptions(this), options)
				});
				$(this).removeAttr('disabled');
			}
			init(this);
		});
	};
	
	$.fn.splitbutton.methods = {
		options: function(jq){
			return $.data(jq[0], 'splitbutton').options;
		},
		enable: function(jq){
			return jq.each(function(){
				setDisabled(this, false);
			});
		},
		disable: function(jq){
			return jq.each(function(){
				setDisabled(this, true);
			});
		},
		destroy: function(jq){
			return jq.each(function(){
				var opts = $(this).splitbutton('options');
				if (opts.menu){
					$(opts.menu).menu('destroy');
				}
				$(this).remove();
			});
		}
	};
	
	$.fn.splitbutton.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.linkbutton.parseOptions(target), 
				$.parser.parseOptions(target, ['menu',{plain:'boolean',duration:'number'}]));
	};
	
	$.fn.splitbutton.defaults = $.extend({}, $.fn.linkbutton.defaults, {
		plain: true,
		menu: null,
		duration: 100
	});
})(jQuery);
/**
 * searchbox - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 * Dependencies:
 * 	menubutton
 * 
 */
(function($){
	function init(target){
		$(target).hide();
		var span = $('<span class="searchbox"></span>').insertAfter(target);
		var input = $('<input type="text" class="searchbox-text">').appendTo(span);
		$('<span><span class="searchbox-button"></span></span>').appendTo(span);
		
		var name = $(target).attr('name');
		if (name){
			input.attr('name', name);
			$(target).removeAttr('name').attr('searchboxName', name);
		}
		
		return span;
	}
	
	function setSize(target, width){
		var opts = $.data(target, 'searchbox').options;
		var sb = $.data(target, 'searchbox').searchbox;
		if (width) opts.width = width;
		sb.appendTo('body');
		
		if (isNaN(opts.width)){
			opts.width = sb._outerWidth();
		}
		var button = sb.find('span.searchbox-button');
		var menu = sb.find('a.searchbox-menu');
		var input = sb.find('input.searchbox-text');
		sb._outerWidth(opts.width)._outerHeight(opts.height);
		input._outerWidth(sb.width() - menu._outerWidth() - button._outerWidth());
		input.css({
			height: sb.height()+'px',
			lineHeight: sb.height()+'px'
		});
		menu._outerHeight(sb.height());
		
		button._outerHeight(sb.height());
		var bleft = menu.find('span.l-btn-left');
		bleft._outerHeight(sb.height());
		bleft.find('span.l-btn-text,span.m-btn-downarrow').css({
			height: bleft.height()+'px',
			lineHeight: bleft.height()+'px'
		});
		
		sb.insertAfter(target);
	}
	
	function buildMenu(target){
		var state = $.data(target, 'searchbox');
		var opts = state.options;
		
		if (opts.menu){
			state.menu = $(opts.menu).menu({
				onClick:function(item){
					attachMenu(item);
				}
			});
			var item = state.menu.children('div.menu-item:first');
			state.menu.children('div.menu-item').each(function(){
				var itemOpts = $.extend({}, $.parser.parseOptions(this), {
					selected: ($(this).attr('selected') ? true : undefined)
				});
				if (itemOpts.selected) {
					item = $(this);
					return false;
				}
			});
			item.triggerHandler('click');
		} else {
			state.searchbox.find('a.searchbox-menu').remove();
			state.menu = null;
		}
		
		function attachMenu(item){
			state.searchbox.find('a.searchbox-menu').remove();
			var mb = $('<a class="searchbox-menu" href="javascript:void(0)"></a>').html(item.text);
			mb.prependTo(state.searchbox).menubutton({
				menu:state.menu,
				iconCls:item.iconCls
			});
			state.searchbox.find('input.searchbox-text').attr('name', $(item.target).attr('name') || item.text);
			setSize(target);
		}
	}
	
	function bindEvents(target){
		var state = $.data(target, 'searchbox');
		var opts = state.options;
		var input = state.searchbox.find('input.searchbox-text');
		var button = state.searchbox.find('.searchbox-button');
		input.unbind('.searchbox').bind('blur.searchbox', function(e){
			opts.value = $(this).val();
			if (opts.value == ''){
				$(this).val(opts.prompt);
				$(this).addClass('searchbox-prompt');
			} else {
				$(this).removeClass('searchbox-prompt');
			}
		}).bind('focus.searchbox', function(e){
			if ($(this).val() != opts.value){
				$(this).val(opts.value);
			}
			$(this).removeClass('searchbox-prompt');
		}).bind('keydown.searchbox', function(e){
			if (e.keyCode == 13){
				e.preventDefault();
				var name = $.fn.prop ? input.prop('name') : input.attr('name');
				opts.value = $(this).val();
				opts.searcher.call(target, opts.value, name);
				return false;
			}
		});
		
		button.unbind('.searchbox').bind('click.searchbox', function(){
			var name = $.fn.prop ? input.prop('name') : input.attr('name');
			opts.searcher.call(target, opts.value, name);
		}).bind('mouseenter.searchbox', function(){
			$(this).addClass('searchbox-button-hover');
		}).bind('mouseleave.searchbox', function(){
			$(this).removeClass('searchbox-button-hover');
		});
	}
	
	function initValue(target){
		var state = $.data(target, 'searchbox');
		var opts = state.options;
		var input = state.searchbox.find('input.searchbox-text');
		if (opts.value == ''){
			input.val(opts.prompt);
			input.addClass('searchbox-prompt');
		} else { 
			input.val(opts.value);
			input.removeClass('searchbox-prompt');
		}
	}
	
	$.fn.searchbox = function(options, param){
		if (typeof options == 'string'){
			return $.fn.searchbox.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'searchbox');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'searchbox', {
					options: $.extend({}, $.fn.searchbox.defaults, $.fn.searchbox.parseOptions(this), options),
					searchbox: init(this)
				});
			}
			buildMenu(this);
			initValue(this);
			bindEvents(this);
			setSize(this);
		});
	}
	
	$.fn.searchbox.methods = {
		options: function(jq){
			return $.data(jq[0], 'searchbox').options;
		},
		menu: function(jq){
			return $.data(jq[0], 'searchbox').menu;
		},
		textbox: function(jq){
			return $.data(jq[0], 'searchbox').searchbox.find('input.searchbox-text');
		},
		getValue: function(jq){
			return $.data(jq[0], 'searchbox').options.value;
		},
		setValue: function(jq, value){
			return jq.each(function(){
				$(this).searchbox('options').value = value;
				$(this).searchbox('textbox').val(value);
				$(this).searchbox('textbox').blur();
			});
		},
		getName: function(jq){
			return $.data(jq[0], 'searchbox').searchbox.find('input.searchbox-text').attr('name');
		},
		selectName: function(jq, name){
			return jq.each(function(){
				var menu = $.data(this, 'searchbox').menu;
				if (menu){
					menu.children('div.menu-item[name="'+name+'"]').triggerHandler('click');
				}
			});
		},
		destroy: function(jq){
			return jq.each(function(){
				var menu = $(this).searchbox('menu');
				if (menu){
					menu.menu('destroy');
				}
				$.data(this, 'searchbox').searchbox.remove();
				$(this).remove();
			});
		},
		resize: function(jq, width){
			return jq.each(function(){
				setSize(this, width);
			});
		}
	};
	
	$.fn.searchbox.parseOptions = function(target){
		var t = $(target);
		return $.extend({},
				$.parser.parseOptions(target, ['width','height','prompt','menu']), {
			value: t.val(),
			searcher: (t.attr('searcher') ? eval(t.attr('searcher')) : undefined)
		});
	};
	
	$.fn.searchbox.defaults = {
		width:'auto',
		height:22,
		prompt:'',
		value:'',
		menu:null,
		searcher:function(value,name){}
	};
})(jQuery);
/**
 * validatebox - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 * Dependencies:
 * 	 tooltip
 * 
 */
(function($){
	
	function init(target){
		$(target).addClass('validatebox-text');
	}
	
	/**
	 * destroy the box, including it's tip object.
	 */
	function destroyBox(target){
		var state = $.data(target, 'validatebox');
		state.validating = false;
		$(target).tooltip('destroy');
		$(target).unbind();
		$(target).remove();
	}
	
	function bindEvents(target){
		var box = $(target);
		var state = $.data(target, 'validatebox');
		
		box.unbind('.validatebox').bind('focus.validatebox', function(){
			state.validating = true;
			state.value = undefined;
			(function(){
				if (state.validating){
					if (state.value != box.val()){	// when box value changed, validate it
						state.value = box.val();
						if (state.timer){
							clearTimeout(state.timer);
						}
						state.timer = setTimeout(function(){
							$(target).validatebox('validate');
						}, state.options.delay);
					} else {
						fixTipPosition(target);	// correct the tip position
					}
					setTimeout(arguments.callee, 200);
				}
			})();
		}).bind('blur.validatebox', function(){
			if (state.timer){
				clearTimeout(state.timer);
				state.timer = undefined;
			}
			state.validating = false;
			hideTip(target);
		}).bind('mouseenter.validatebox', function(){
			if (box.hasClass('validatebox-invalid')){
				showTip(target);
			}
		}).bind('mouseleave.validatebox', function(){
			if (!state.validating){
				hideTip(target);
			}
		});
	}
	
	/**
	 * show tip message.
	 */
	function showTip(target){
		var state = $.data(target, 'validatebox');
		var opts = state.options;
		$(target).tooltip($.extend({}, opts.tipOptions, {
			content: state.message,
			position: opts.tipPosition,
			deltaX: opts.deltaX
		})).tooltip('show');
		state.tip = true;
	}
	
	function fixTipPosition(target){
		var state = $.data(target, 'validatebox');
		if (state && state.tip){
			$(target).tooltip('reposition');
		}
	}
	
	/**
	 * hide tip message.
	 */
	function hideTip(target){
		var state = $.data(target, 'validatebox');
		state.tip = false;
		$(target).tooltip('hide');
	}
	
	/**
	 * do validate action
	 */
	function validate(target){
		var state = $.data(target, 'validatebox');
		var opts = state.options;
		var box = $(target);
		var value = box.val();
		
		function setTipMessage(msg){
			state.message = msg;
		}
		function doValidate(vtype){
			var result = /([a-zA-Z_]+)(.*)/.exec(vtype);
			var rule = opts.rules[result[1]];
			if (rule && value){
				var param = eval(result[2]);
				if (!rule['validator'](value, param)){
					box.addClass('validatebox-invalid');
					
					var message = rule['message'];
					if (param){
						for(var i=0; i<param.length; i++){
							message = message.replace(new RegExp("\\{" + i + "\\}", "g"), param[i]);
						}
					}
					setTipMessage(opts.invalidMessage || message);
					if (state.validating){
						showTip(target);
					}
					return false;
				}
			}
			return true;
		}
		
		
		if (opts.required){
			if (value == ''){
				box.addClass('validatebox-invalid');
				setTipMessage(opts.missingMessage);
				if (state.validating){
					showTip(target);
				}
				return false;
			}
		}
		if (opts.validType){
			if (typeof opts.validType == 'string'){
				if (!doValidate(opts.validType)){return false;};
			} else {
				for(var i=0; i<opts.validType.length; i++){
					if (!doValidate(opts.validType[i])){return false;}
				}
			}
		}
		
		box.removeClass('validatebox-invalid');
		hideTip(target);
		return true;
	}
	
	$.fn.validatebox = function(options, param){
		if (typeof options == 'string'){
			return $.fn.validatebox.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'validatebox');
			if (state){
				$.extend(state.options, options);
			} else {
				init(this);
				$.data(this, 'validatebox', {
					options: $.extend({}, $.fn.validatebox.defaults, $.fn.validatebox.parseOptions(this), options)
				});
			}
			
			bindEvents(this);
		});
	};
	
	$.fn.validatebox.methods = {
		options: function(jq){
			return $.data(jq[0], 'validatebox').options;
		},
		destroy: function(jq){
			return jq.each(function(){
				destroyBox(this);
			});
		},
		validate: function(jq){
			return jq.each(function(){
				validate(this);
			});
		},
		isValid: function(jq){
			return validate(jq[0]);
		}
	};
	
	$.fn.validatebox.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.parser.parseOptions(target, [
		    'validType','missingMessage','invalidMessage','tipPosition',{delay:'number',deltaX:'number'}
		]), {
			required: (t.attr('required') ? true : undefined)
		});
	};
	
	$.fn.validatebox.defaults = {
		required: false,
		validType: null,
		delay: 200,	// delay to validate from the last inputting value.
		missingMessage: 'This field is required.',
		invalidMessage: null,
		tipPosition: 'right',	// Possible values: 'left','right'.
		deltaX: 0,
		
		tipOptions: {	// the options to create tooltip
			showEvent: 'none',
			hideEvent: 'none',
			showDelay: 0,
			hideDelay: 0,
			zIndex: '',
			onShow: function(){
				$(this).tooltip('tip').css({
					color: '#000',
					borderColor: '#CC9933',
					backgroundColor: '#FFFFCC'
				});
			},
			onHide: function(){
				$(this).tooltip('destroy');
			}
		},
		
		rules: {
			email:{
				validator: function(value){
					return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
				},
				message: 'Please enter a valid email address.'
			},
			url: {
				validator: function(value){
					return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
				},
				message: 'Please enter a valid URL.'
			},
			length: {
				validator: function(value, param){
					var len = $.trim(value).length;
					return len >= param[0] && len <= param[1]
				},
				message: 'Please enter a value between {0} and {1}.'
			},
			remote: {
				validator: function(value, param){
					var data = {};
					data[param[1]] = value;
					var response = $.ajax({
						url:param[0],
						dataType:'json',
						data:data,
						async:false,
						cache:false,
						type:'post'
					}).responseText;
					return response == 'true';
				},
				message: 'Please fix this field.'
			}
		}
	};
})(jQuery);
/**
 * form - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 */
(function($){
	/**
	 * submit the form
	 */
	function ajaxSubmit(target, options){
		options = options || {};
		
		var param = {};
		if (options.onSubmit){
			if (options.onSubmit.call(target, param) == false) {
				return;
			}
		}
		
		var form = $(target);
		if (options.url){
			form.attr('action', options.url);
		}
		var frameId = 'easyui_frame_' + (new Date().getTime());
		var frame = $('<iframe id='+frameId+' name='+frameId+'></iframe>')
				.attr('src', window.ActiveXObject ? 'javascript:false' : 'about:blank')
				.css({
					position:'absolute',
					top:-1000,
					left:-1000
				});
		var t = form.attr('target'), a = form.attr('action');
		form.attr('target', frameId);
		
		var paramFields = $();
		try {
			frame.appendTo('body');
			frame.bind('load', cb);
			for(var n in param){
				var f = $('<input type="hidden" name="' + n + '">').val(param[n]).appendTo(form);
				paramFields = paramFields.add(f);
			}
			form[0].submit();
		} finally {
			form.attr('action', a);
			t ? form.attr('target', t) : form.removeAttr('target');
			paramFields.remove();
		}
		
		var checkCount = 10;
		function cb(){
			frame.unbind();
			var body = $('#'+frameId).contents().find('body');
			var data = body.html();
			if (data == ''){
				if (--checkCount){
					setTimeout(cb, 100);
					return;
				}
				return;
			}
			var ta = body.find('>textarea');
			if (ta.length){
				data = ta.val();
			} else {
				var pre = body.find('>pre');
				if (pre.length){
					data = pre.html();
				}
			}
			if (options.success){
				options.success(data);
			}
//			try{
//				eval('data='+data);
//				if (options.success){
//					options.success(data);
//				}
//			} catch(e) {
//				if (options.failure){
//					options.failure(data);
//				}
//			}
			setTimeout(function(){
				frame.unbind();
				frame.remove();
			}, 100);
		}
	}
	
	/**
	 * load form data
	 * if data is a URL string type load from remote site, 
	 * otherwise load from local data object. 
	 */
	function load(target, data){
		if (!$.data(target, 'form')){
			$.data(target, 'form', {
				options: $.extend({}, $.fn.form.defaults)
			});
		}
		var opts = $.data(target, 'form').options;
		
		if (typeof data == 'string'){
			var param = {};
			if (opts.onBeforeLoad.call(target, param) == false) return;
			
			$.ajax({
				url: data,
				data: param,
				dataType: 'json',
				success: function(data){
					_load(data);
				},
				error: function(){
					opts.onLoadError.apply(target, arguments);
				}
			});
		} else {
			_load(data);
		}
		
		function _load(data){
			var form = $(target);
			for(var name in data){
				var val = data[name];
				var rr = _checkField(name, val);
				if (!rr.length){
					var f = form.find('input[numberboxName="'+name+'"]');
					if (f.length){
						f.numberbox('setValue', val);	// set numberbox value
					} else {
						$('input[name="'+name+'"]', form).val(val);
						$('textarea[name="'+name+'"]', form).val(val);
						$('select[name="'+name+'"]', form).val(val);
					}
				}
				_loadCombo(name, val);
			}
			opts.onLoadSuccess.call(target, data);
			validate(target);
		}
		
		/**
		 * check the checkbox and radio fields
		 */
		function _checkField(name, val){
			var rr = $(target).find('input[name="'+name+'"][type=radio], input[name="'+name+'"][type=checkbox]');
			rr._propAttr('checked', false);
			rr.each(function(){
				var f = $(this);
				if (f.val() == String(val) || $.inArray(f.val(), val) >= 0){
					f._propAttr('checked', true);
				}
			});
			return rr;
		}
		
		function _loadCombo(name, val){
			var form = $(target);
			var cc = ['combobox','combotree','combogrid','datetimebox','datebox','combo'];
			var c = form.find('[comboName="' + name + '"]');
			if (c.length){
				for(var i=0; i<cc.length; i++){
					var type = cc[i];
					if (c.hasClass(type+'-f')){
						if (c[type]('options').multiple){
							c[type]('setValues', val);
						} else {
							c[type]('setValue', val);
						}
						return;
					}
				}
			}
		}
	}
	
	/**
	 * clear the form fields
	 */
	function clear(target){
		$('input,select,textarea', target).each(function(){
			var t = this.type, tag = this.tagName.toLowerCase();
			if (t == 'text' || t == 'hidden' || t == 'password' || tag == 'textarea'){
				this.value = '';
			} else if (t == 'file'){
				var file = $(this);
				file.after(file.clone().val(''));
				file.remove();
			} else if (t == 'checkbox' || t == 'radio'){
				this.checked = false;
			} else if (tag == 'select'){
				this.selectedIndex = -1;
			}
			
		});
		if ($.fn.combo) $('.combo-f', target).combo('clear');
		if ($.fn.combobox) $('.combobox-f', target).combobox('clear');
		if ($.fn.combotree) $('.combotree-f', target).combotree('clear');
		if ($.fn.combogrid) $('.combogrid-f', target).combogrid('clear');
		validate(target);
	}
	
	function reset(target){
		target.reset();
		var t = $(target);
		if ($.fn.combo){t.find('.combo-f').combo('reset');}
		if ($.fn.combobox){t.find('.combobox-f').combobox('reset');}
		if ($.fn.combotree){t.find('.combotree-f').combotree('reset');}
		if ($.fn.combogrid){t.find('.combogrid-f').combogrid('reset');}
		if ($.fn.spinner){t.find('.spinner-f').spinner('reset');}
		if ($.fn.timespinner){t.find('.timespinner-f').timespinner('reset');}
		if ($.fn.numberbox){t.find('.numberbox-f').numberbox('reset');}
		if ($.fn.numberspinner){t.find('.numberspinner-f').numberspinner('reset');}
		validate(target);
	}
	
	/**
	 * set the form to make it can submit with ajax.
	 */
	function setForm(target){
		var options = $.data(target, 'form').options;
		var form = $(target);
		form.unbind('.form').bind('submit.form', function(){
			setTimeout(function(){
				ajaxSubmit(target, options);
			}, 0);
			return false;
		});
	}
	
//	function validate(target){
//		if ($.fn.validatebox){
//			var box = $('.validatebox-text', target);
//			if (box.length){
//				box.validatebox('validate');
////				box.trigger('focus');
////				box.trigger('blur');
//				var invalidbox = $('.validatebox-invalid:first', target).focus();
//				return invalidbox.length == 0;
//			}
//		}
//		return true;
//	}
	function validate(target){
		if ($.fn.validatebox){
			var t = $(target);
			t.find('.validatebox-text:not(:disabled)').validatebox('validate');
			var invalidbox = t.find('.validatebox-invalid');
			invalidbox.filter(':not(:disabled):first').focus();
			return invalidbox.length == 0;
		}
		return true;
	}
	
	$.fn.form = function(options, param){
		if (typeof options == 'string'){
			return $.fn.form.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			if (!$.data(this, 'form')){
				$.data(this, 'form', {
					options: $.extend({}, $.fn.form.defaults, options)
				});
			}
			setForm(this);
		});
	};
	
	$.fn.form.methods = {
		submit: function(jq, options){
			return jq.each(function(){
				ajaxSubmit(this, $.extend({}, $.fn.form.defaults, options||{}));
			});
		},
		load: function(jq, data){
			return jq.each(function(){
				load(this, data);
			});
		},
		clear: function(jq){
			return jq.each(function(){
				clear(this);
			});
		},
		reset: function(jq){
			return jq.each(function(){
				reset(this);
			});
		},
		validate: function(jq){
			return validate(jq[0]);
		}
	};
	
	$.fn.form.defaults = {
		url: null,
		onSubmit: function(param){return $(this).form('validate');},
		success: function(data){},
		onBeforeLoad: function(param){},
		onLoadSuccess: function(data){},
		onLoadError: function(){}
	};
})(jQuery);
/**
 * numberbox - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
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
			return opts.filter.call(target, e);
		}).bind('blur.numberbox', function(){
			setValue(target, $(this).val());
			$(this).val(opts.formatter.call(target, getValue(target)));
		}).bind('focus.numberbox', function(){
//			var vv = getValue(target);
//			if ($(this).val() != vv){
//				$(this).val(vv);
//			}
			var vv = getValue(target);
			if (vv != opts.parser.call(target, $(this).val())){
				$(this).val(opts.formatter.call(target, vv));
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
		
		filter: function(e){
			var opts = $(this).numberbox('options');
			if (e.which == 45){	//-
				return ($(this).val().indexOf('-') == -1 ? true : false);
			}
			var c = String.fromCharCode(e.which);
			if (c == opts.decimalSeparator){
				return ($(this).val().indexOf(c) == -1 ? true : false);
			} else if (c == opts.groupSeparator){
				return true;
			} else if ((e.which >= 48 && e.which <= 57 && e.ctrlKey == false && e.shiftKey == false) || e.which == 0 || e.which == 8) {
				return true;
			} else if (e.ctrlKey == true && (e.which == 99 || e.which == 118)) {
				return true;
			} else {
				return false;
			}
		},
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
			if (parseFloat(s) != s){
				if (opts.prefix) s = $.trim(s.replace(new RegExp('\\'+$.trim(opts.prefix),'g'), ''));
				if (opts.suffix) s = $.trim(s.replace(new RegExp('\\'+$.trim(opts.suffix),'g'), ''));
				if (opts.groupSeparator) s = $.trim(s.replace(new RegExp('\\'+opts.groupSeparator,'g'), ''));
				if (opts.decimalSeparator) s = $.trim(s.replace(new RegExp('\\'+opts.decimalSeparator,'g'), '.'));
				s = s.replace(/\s/g,'');
			}
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
/**
 * calendar - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 */
(function($){
	
	function setSize(target){
		var opts = $.data(target, 'calendar').options;
		var t = $(target);
		if (opts.fit == true){
			var p = t.parent();
			opts.width = p.width();
			opts.height = p.height();
		}
		var header = t.find('.calendar-header');
		t._outerWidth(opts.width);
		t._outerHeight(opts.height);
		t.find('.calendar-body')._outerHeight(t.height() - header._outerHeight());
	}
	
	function init(target){
		$(target).addClass('calendar').html(
				'<div class="calendar-header">' +
					'<div class="calendar-prevmonth"></div>' +
					'<div class="calendar-nextmonth"></div>' +
					'<div class="calendar-prevyear"></div>' +
					'<div class="calendar-nextyear"></div>' +
					'<div class="calendar-title">' +
						'<span>Aprial 2010</span>' +
					'</div>' +
				'</div>' +
				'<div class="calendar-body">' +
					'<div class="calendar-menu">' +
						'<div class="calendar-menu-year-inner">' +
							'<span class="calendar-menu-prev"></span>' +
							'<span><input class="calendar-menu-year" type="text"></input></span>' +
							'<span class="calendar-menu-next"></span>' +
						'</div>' +
						'<div class="calendar-menu-month-inner">' +
						'</div>' +
					'</div>' +
				'</div>'
		);
		
		$(target).find('.calendar-title span').hover(
			function(){$(this).addClass('calendar-menu-hover');},
			function(){$(this).removeClass('calendar-menu-hover');}
		).click(function(){
			var menu = $(target).find('.calendar-menu');
			if (menu.is(':visible')){
				menu.hide();
			} else {
				showSelectMenus(target);
			}
		});
		
		$('.calendar-prevmonth,.calendar-nextmonth,.calendar-prevyear,.calendar-nextyear', target).hover(
			function(){$(this).addClass('calendar-nav-hover');},
			function(){$(this).removeClass('calendar-nav-hover');}
		);
		$(target).find('.calendar-nextmonth').click(function(){
			showMonth(target, 1);
		});
		$(target).find('.calendar-prevmonth').click(function(){
			showMonth(target, -1);
		});
		$(target).find('.calendar-nextyear').click(function(){
			showYear(target, 1);
		});
		$(target).find('.calendar-prevyear').click(function(){
			showYear(target, -1);
		});
		
		$(target).bind('_resize', function(){
			var opts = $.data(target, 'calendar').options;
			if (opts.fit == true){
				setSize(target);
			}
			return false;
		});
	}
	
	/**
	 * show the calendar corresponding to the current month.
	 */
	function showMonth(target, delta){
		var opts = $.data(target, 'calendar').options;
		opts.month += delta;
		if (opts.month > 12){
			opts.year++;
			opts.month = 1;
		} else if (opts.month < 1){
			opts.year--;
			opts.month = 12;
		}
		show(target);
		
		var menu = $(target).find('.calendar-menu-month-inner');
		menu.find('td.calendar-selected').removeClass('calendar-selected');
		menu.find('td:eq(' + (opts.month-1) + ')').addClass('calendar-selected');
	}
	
	/**
	 * show the calendar corresponding to the current year.
	 */
	function showYear(target, delta){
		var opts = $.data(target, 'calendar').options;
		opts.year += delta;
		show(target);
		
		var menu = $(target).find('.calendar-menu-year');
		menu.val(opts.year);
	}
	
	/**
	 * show the select menu that can change year or month, if the menu is not be created then create it.
	 */
	function showSelectMenus(target){
		var opts = $.data(target, 'calendar').options;
		$(target).find('.calendar-menu').show();
		
		if ($(target).find('.calendar-menu-month-inner').is(':empty')){
			$(target).find('.calendar-menu-month-inner').empty();
			var t = $('<table></table>').appendTo($(target).find('.calendar-menu-month-inner'));
			var idx = 0;
			for(var i=0; i<3; i++){
				var tr = $('<tr></tr>').appendTo(t);
				for(var j=0; j<4; j++){
					$('<td class="calendar-menu-month"></td>').html(opts.months[idx++]).attr('abbr',idx).appendTo(tr);
				}
			}
			
			$(target).find('.calendar-menu-prev,.calendar-menu-next').hover(
					function(){$(this).addClass('calendar-menu-hover');},
					function(){$(this).removeClass('calendar-menu-hover');}
			);
			$(target).find('.calendar-menu-next').click(function(){
				var y = $(target).find('.calendar-menu-year');
				if (!isNaN(y.val())){
					y.val(parseInt(y.val()) + 1);
				}
			});
			$(target).find('.calendar-menu-prev').click(function(){
				var y = $(target).find('.calendar-menu-year');
				if (!isNaN(y.val())){
					y.val(parseInt(y.val() - 1));
				}
			});
			
			$(target).find('.calendar-menu-year').keypress(function(e){
				if (e.keyCode == 13){
					setDate();
				}
			});
			
			$(target).find('.calendar-menu-month').hover(
					function(){$(this).addClass('calendar-menu-hover');},
					function(){$(this).removeClass('calendar-menu-hover');}
			).click(function(){
				var menu = $(target).find('.calendar-menu');
				menu.find('.calendar-selected').removeClass('calendar-selected');
				$(this).addClass('calendar-selected');
				setDate();
			});
		}
		
		function setDate(){
			var menu = $(target).find('.calendar-menu');
			var year = menu.find('.calendar-menu-year').val();
			var month = menu.find('.calendar-selected').attr('abbr');
			if (!isNaN(year)){
				opts.year = parseInt(year);
				opts.month = parseInt(month);
				show(target);
			}
			menu.hide();
		}
		
		var body = $(target).find('.calendar-body');
		var sele = $(target).find('.calendar-menu');
		var seleYear = sele.find('.calendar-menu-year-inner');
		var seleMonth = sele.find('.calendar-menu-month-inner');
		
		seleYear.find('input').val(opts.year).focus();
		seleMonth.find('td.calendar-selected').removeClass('calendar-selected');
		seleMonth.find('td:eq('+(opts.month-1)+')').addClass('calendar-selected');
		
		sele._outerWidth(body._outerWidth());
		sele._outerHeight(body._outerHeight());
		seleMonth._outerHeight(sele.height() - seleYear._outerHeight());
	}
	
	/**
	 * get weeks data.
	 */
	function getWeeks(target, year, month){
		var opts = $.data(target, 'calendar').options;
		var dates = [];
		var lastDay = new Date(year, month, 0).getDate();
		for(var i=1; i<=lastDay; i++) dates.push([year,month,i]);
		
		// group date by week
		var weeks = [], week = [];
//		var memoDay = 0;
		var memoDay = -1;
		while(dates.length > 0){
			var date = dates.shift();
			week.push(date);
			var day = new Date(date[0],date[1]-1,date[2]).getDay();
			if (memoDay == day){
				day = 0;
			} else if (day == (opts.firstDay==0 ? 7 : opts.firstDay) - 1){
				weeks.push(week);
				week = [];
			}
			memoDay = day;
		}
		if (week.length){
			weeks.push(week);
		}
		
		var firstWeek = weeks[0];
		if (firstWeek.length < 7){
			while(firstWeek.length < 7){
				var firstDate = firstWeek[0];
				var date = new Date(firstDate[0],firstDate[1]-1,firstDate[2]-1)
				firstWeek.unshift([date.getFullYear(), date.getMonth()+1, date.getDate()]);
			}
		} else {
			var firstDate = firstWeek[0];
			var week = [];
			for(var i=1; i<=7; i++){
				var date = new Date(firstDate[0], firstDate[1]-1, firstDate[2]-i);
				week.unshift([date.getFullYear(), date.getMonth()+1, date.getDate()]);
			}
			weeks.unshift(week);
		}
		
		var lastWeek = weeks[weeks.length-1];
		while(lastWeek.length < 7){
			var lastDate = lastWeek[lastWeek.length-1];
			var date = new Date(lastDate[0], lastDate[1]-1, lastDate[2]+1);
			lastWeek.push([date.getFullYear(), date.getMonth()+1, date.getDate()]);
		}
		if (weeks.length < 6){
			var lastDate = lastWeek[lastWeek.length-1];
			var week = [];
			for(var i=1; i<=7; i++){
				var date = new Date(lastDate[0], lastDate[1]-1, lastDate[2]+i);
				week.push([date.getFullYear(), date.getMonth()+1, date.getDate()]);
			}
			weeks.push(week);
		}
		
		return weeks;
	}
	
	/**
	 * show the calendar day.
	 */
	function show(target){
		var opts = $.data(target, 'calendar').options;
		$(target).find('.calendar-title span').html(opts.months[opts.month-1] + ' ' + opts.year);
		
		var body = $(target).find('div.calendar-body');
		body.find('>table').remove();
		
		var t = $('<table cellspacing="0" cellpadding="0" border="0"><thead></thead><tbody></tbody></table>').prependTo(body);
		var tr = $('<tr></tr>').appendTo(t.find('thead'));
		for(var i=opts.firstDay; i<opts.weeks.length; i++){
			tr.append('<th>'+opts.weeks[i]+'</th>');
		}
		for(var i=0; i<opts.firstDay; i++){
			tr.append('<th>'+opts.weeks[i]+'</th>');
		}
		
		var weeks = getWeeks(target, opts.year, opts.month);
		for(var i=0; i<weeks.length; i++){
			var week = weeks[i];
			var tr = $('<tr></tr>').appendTo(t.find('tbody'));
			for(var j=0; j<week.length; j++){
				var day = week[j];
				$('<td class="calendar-day calendar-other-month"></td>').attr('abbr',day[0]+','+day[1]+','+day[2]).html(day[2]).appendTo(tr);
			}
		}
		t.find('td[abbr^="'+opts.year+','+opts.month+'"]').removeClass('calendar-other-month');
		
		var now = new Date();
		var today = now.getFullYear()+','+(now.getMonth()+1)+','+now.getDate();
		t.find('td[abbr="'+today+'"]').addClass('calendar-today');
		
		if (opts.current){
			t.find('.calendar-selected').removeClass('calendar-selected');
			var current = opts.current.getFullYear()+','+(opts.current.getMonth()+1)+','+opts.current.getDate();
			t.find('td[abbr="'+current+'"]').addClass('calendar-selected');
		}
		
		// calulate the saturday and sunday index
		var saIndex = 6 - opts.firstDay;
		var suIndex = saIndex + 1;
		if (saIndex >= 7) saIndex -= 7;
		if (suIndex >= 7) suIndex -= 7;
		t.find('tr').find('td:eq('+saIndex+')').addClass('calendar-saturday');
		t.find('tr').find('td:eq('+suIndex+')').addClass('calendar-sunday');
		
		t.find('td').hover(
			function(){$(this).addClass('calendar-hover');},
			function(){$(this).removeClass('calendar-hover');}
		).click(function(){
			t.find('.calendar-selected').removeClass('calendar-selected');
			$(this).addClass('calendar-selected');
			var parts = $(this).attr('abbr').split(',');
			opts.current = new Date(parts[0], parseInt(parts[1])-1, parts[2]);
			opts.onSelect.call(target, opts.current);
		});
	}
	
	$.fn.calendar = function(options, param){
		if (typeof options == 'string'){
			return $.fn.calendar.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'calendar');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'calendar', {
					options:$.extend({}, $.fn.calendar.defaults, $.fn.calendar.parseOptions(this), options)
				});
				init(this);
			}
			if (state.options.border == false){
				$(this).addClass('calendar-noborder');
			}
			setSize(this);
			show(this);
			$(this).find('div.calendar-menu').hide();	// hide the calendar menu
		});
	};
	
	$.fn.calendar.methods = {
		options: function(jq){
			return $.data(jq[0], 'calendar').options;
		},
		resize: function(jq){
			return jq.each(function(){
				setSize(this);
			});
		},
		moveTo: function(jq, date){
			return jq.each(function(){
				$(this).calendar({
					year: date.getFullYear(),
					month: date.getMonth()+1,
					current: date
				});
			});
		}
	};
	
	$.fn.calendar.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.parser.parseOptions(target, [
			'width','height',{firstDay:'number',fit:'boolean',border:'boolean'}
		]));
	};
	
	$.fn.calendar.defaults = {
		width:180,
		height:180,
		fit:false,
		border:true,
		firstDay:0,
		weeks:['S','M','T','W','T','F','S'],
		months:['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		year:new Date().getFullYear(),
		month:new Date().getMonth()+1,
		current:new Date(),
		
		onSelect: function(date){}
	};
})(jQuery);
/**
 * spinner - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 * Dependencies:
 *   validatebox
 * 
 */
(function($){
	/**
	 * initialize the spinner.
	 */
	function init(target){
		var spinner = $(
				'<span class="spinner">' +
				'<span class="spinner-arrow">' +
				'<span class="spinner-arrow-up"></span>' +
				'<span class="spinner-arrow-down"></span>' +
				'</span>' +
				'</span>'
				).insertAfter(target);
		$(target).addClass('spinner-text spinner-f').prependTo(spinner);
		return spinner;
	}
	
	function setSize(target, width){
		var opts = $.data(target, 'spinner').options;
		var spinner = $.data(target, 'spinner').spinner;
		if (width) opts.width = width;
		
		var spacer = $('<div style="display:none"></div>').insertBefore(spinner);
		spinner.appendTo('body');
		
		if (isNaN(opts.width)){
			opts.width = $(target).outerWidth();
		}
		var arrow = spinner.find('.spinner-arrow');
		spinner._outerWidth(opts.width)._outerHeight(opts.height);
		$(target)._outerWidth(spinner.width() - arrow.outerWidth());
		$(target).css({
			height: spinner.height()+'px',
			lineHeight: spinner.height()+'px'
		});
		arrow._outerHeight(spinner.height());
		arrow.find('span')._outerHeight(arrow.height()/2);
		
		spinner.insertAfter(spacer);
		spacer.remove();
	}
	
	function bindEvents(target){
		var opts = $.data(target, 'spinner').options;
		var spinner = $.data(target, 'spinner').spinner;
		
		spinner.find('.spinner-arrow-up,.spinner-arrow-down').unbind('.spinner');
		if (!opts.disabled){
			spinner.find('.spinner-arrow-up').bind('mouseenter.spinner', function(){
				$(this).addClass('spinner-arrow-hover');
			}).bind('mouseleave.spinner', function(){
				$(this).removeClass('spinner-arrow-hover');
			}).bind('click.spinner', function(){
				opts.spin.call(target, false);
				opts.onSpinUp.call(target);
				$(target).validatebox('validate');
			});
			
			spinner.find('.spinner-arrow-down').bind('mouseenter.spinner', function(){
				$(this).addClass('spinner-arrow-hover');
			}).bind('mouseleave.spinner', function(){
				$(this).removeClass('spinner-arrow-hover');
			}).bind('click.spinner', function(){
				opts.spin.call(target, true);
				opts.onSpinDown.call(target);
				$(target).validatebox('validate');
			});
		}
	}
	
	/**
	 * enable or disable the spinner.
	 */
	function setDisabled(target, disabled){
		var opts = $.data(target, 'spinner').options;
		if (disabled){
			opts.disabled = true;
			$(target).attr('disabled', true);
		} else {
			opts.disabled = false;
			$(target).removeAttr('disabled');
		}
	}
	
	$.fn.spinner = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.spinner.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.validatebox(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'spinner');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'spinner', {
					options: $.extend({}, $.fn.spinner.defaults, $.fn.spinner.parseOptions(this), options),
					spinner: init(this)
				});
				$(this).removeAttr('disabled');
			}
			state.options.originalValue = state.options.value;
			$(this).val(state.options.value);
			$(this).attr('readonly', !state.options.editable);
			setDisabled(this, state.options.disabled);
			setSize(this);
			$(this).validatebox(state.options);
			bindEvents(this);
		});
	};
	
	$.fn.spinner.methods = {
		options: function(jq){
			var opts = $.data(jq[0], 'spinner').options;
			return $.extend(opts, {
				value: jq.val()
			});
		},
		destroy: function(jq){
			return jq.each(function(){
				var spinner = $.data(this, 'spinner').spinner;
				$(this).validatebox('destroy');
				spinner.remove();
			});
		},
		resize: function(jq, width){
			return jq.each(function(){
				setSize(this, width);
			});
		},
		enable: function(jq){
			return jq.each(function(){
				setDisabled(this, false);
				bindEvents(this);
			});
		},
		disable: function(jq){
			return jq.each(function(){
				setDisabled(this, true);
				bindEvents(this);
			});
		},
		getValue: function(jq){
			return jq.val();
		},
		setValue: function(jq, value){
			return jq.each(function(){
				var opts = $.data(this, 'spinner').options;
				opts.value = value;
				$(this).val(value);
			});
		},
		clear: function(jq){
			return jq.each(function(){
				var opts = $.data(this, 'spinner').options;
				opts.value = '';
				$(this).val('');
			});
		},
		reset: function(jq){
			return jq.each(function(){
				var opts = $(this).spinner('options');
				$(this).spinner('setValue', opts.originalValue);
			});
		}
	};
	
	$.fn.spinner.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.validatebox.parseOptions(target), $.parser.parseOptions(target, [
			'width','height','min','max',{increment:'number',editable:'boolean'}
		]), {
			value: (t.val() || undefined),
			disabled: (t.attr('disabled') ? true : undefined)
		});
	};
	
	$.fn.spinner.defaults = $.extend({}, $.fn.validatebox.defaults, {
		width: 'auto',
		height: 22,
		deltaX: 19,
		value: '',
		min: null,
		max: null,
		increment: 1,
		editable: true,
		disabled: false,
		
		spin: function(down){},	// the function to implement the spin button click
		
		onSpinUp: function(){},
		onSpinDown: function(){}
	});
})(jQuery);
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
/**
 * timespinner - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 * Dependencies:
 *   spinner
 * 
 */
(function($){
	function create(target){
		var opts = $.data(target, 'timespinner').options;
		$(target).addClass('timespinner-f');
		$(target).spinner(opts);
		
		$(target).unbind('.timespinner');
		$(target).bind('click.timespinner', function(){
			var start = 0;
			if (this.selectionStart != null){
				start = this.selectionStart;
			} else if (this.createTextRange){
				var range = target.createTextRange();
				var s = document.selection.createRange();
				s.setEndPoint("StartToStart", range);
				start = s.text.length;
			}
			if (start >= 0 && start <= 2){
				opts.highlight = 0;
			} else if (start >= 3 && start <= 5){
				opts.highlight = 1;
			} else if (start >= 6 && start <= 8){
				opts.highlight = 2;
			}
			highlight(target);
		}).bind('blur.timespinner', function(){
			fixValue(target);
		});
	}
	
	/**
	 * highlight the hours or minutes or seconds.
	 */
	function highlight(target){
		var opts = $.data(target, 'timespinner').options;
		var start = 0, end = 0;
		if (opts.highlight == 0){
			start = 0;
			end = 2;
		} else if (opts.highlight == 1){
			start = 3;
			end = 5;
		} else if (opts.highlight == 2){
			start = 6;
			end = 8;
		}
		if (target.selectionStart != null){
			target.setSelectionRange(start, end);
		} else if (target.createTextRange){
			var range = target.createTextRange();
			range.collapse();
			range.moveEnd('character', end);
			range.moveStart('character', start);
			range.select();
		}
		$(target).focus();
	}
	
	/**
	 * parse the time and return it or return null if the format is invalid
	 */
	function parseTime(target, value){
		var opts = $.data(target, 'timespinner').options;
		if (!value) return null;
		var vv = value.split(opts.separator);
		for(var i=0; i<vv.length; i++){
			if (isNaN(vv[i])) return null;
		}
		while(vv.length < 3){
			vv.push(0);
		}
		return new Date(1900, 0, 0, vv[0], vv[1], vv[2]);
	}
	
	function fixValue(target){
		var opts = $.data(target, 'timespinner').options;
		var value = $(target).val();
		var time = parseTime(target, value);
		if (!time){
			time = parseTime(target, opts.value);
		}
		if (!time){
			opts.value = '';
			$(target).val('');
			return;
		}
		
		var minTime = parseTime(target, opts.min);
		var maxTime = parseTime(target, opts.max);
		if (minTime && minTime > time) time = minTime;
		if (maxTime && maxTime < time) time = maxTime;
		
		var tt = [formatNumber(time.getHours()), formatNumber(time.getMinutes())];
		if (opts.showSeconds){
			tt.push(formatNumber(time.getSeconds()));
		}
		var val = tt.join(opts.separator);
		opts.value = val;
		$(target).val(val);
		
//		highlight(target);
		
		function formatNumber(value){
			return (value < 10 ? '0' : '') + value;
		}
	}
	
	function doSpin(target, down){
		var opts = $.data(target, 'timespinner').options;
		var val = $(target).val();
		if (val == ''){
			val = [0,0,0].join(opts.separator);
		}
		var vv = val.split(opts.separator);
		for(var i=0; i<vv.length; i++){
			vv[i] = parseInt(vv[i], 10);
		}
		if (down == true){
			vv[opts.highlight] -= opts.increment;
		} else {
			vv[opts.highlight] += opts.increment;
		}
		$(target).val(vv.join(opts.separator));
		fixValue(target);
		highlight(target);
	}
	
	
	$.fn.timespinner = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.timespinner.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.spinner(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'timespinner');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'timespinner', {
					options: $.extend({}, $.fn.timespinner.defaults, $.fn.timespinner.parseOptions(this), options)
				});
				create(this);
			}
		});
	};
	
	$.fn.timespinner.methods = {
		options: function(jq){
			var opts = $.data(jq[0], 'timespinner').options;
			return $.extend(opts, {
				value: jq.val(),
				originalValue: jq.spinner('options').originalValue
			});
		},
		setValue: function(jq, value){
			return jq.each(function(){
				$(this).val(value);
				fixValue(this);
			});
		},
		getHours: function(jq){
			var opts = $.data(jq[0], 'timespinner').options;
			var vv = jq.val().split(opts.separator);
			return parseInt(vv[0], 10);
		},
		getMinutes: function(jq){
			var opts = $.data(jq[0], 'timespinner').options;
			var vv = jq.val().split(opts.separator);
			return parseInt(vv[1], 10);
		},
		getSeconds: function(jq){
			var opts = $.data(jq[0], 'timespinner').options;
			var vv = jq.val().split(opts.separator);
			return parseInt(vv[2], 10) || 0;
		}
	};
	
	$.fn.timespinner.parseOptions = function(target){
		return $.extend({}, $.fn.spinner.parseOptions(target), $.parser.parseOptions(target,[
			'separator',{showSeconds:'boolean',highlight:'number'}
		]));
	};
	
	$.fn.timespinner.defaults = $.extend({}, $.fn.spinner.defaults, {
		separator: ':',
		showSeconds: false,
		highlight: 0,	// The field to highlight initially, 0 = hours, 1 = minutes, ...
		spin: function(down){doSpin(this, down);}
	});
})(jQuery);
/**
 * datagrid - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 * Dependencies:
 *  panel
 * 	resizable
 * 	linkbutton
 * 	pagination
 * 
 */
(function($){
	var DATAGRID_SERNO = 0;
	
	/**
	 * Get the index of array item, return -1 when the item is not found.
	 */
	function indexOfArray(a,o){
		for(var i=0,len=a.length; i<len; i++){
			if (a[i] == o) return i;
		}
		return -1;
	}
	/**
	 * Remove array item, 'o' parameter can be item object or id field name.
	 * When 'o' parameter is the id field name, the 'id' parameter is valid.
	 */
	function removeArrayItem(a,o,id){
		if (typeof o == 'string'){
			for(var i=0,len=a.length; i<len; i++){
				if (a[i][o] == id){
					a.splice(i, 1);
					return;
				}
			}
		} else {
			var index = indexOfArray(a,o);
			if (index != -1){
				a.splice(index, 1);
			}
		}
	}
	/**
	 * Add un-duplicate array item, 'o' parameter is the id field name, if the 'r' object is exists, deny the action.
	 */
	function addArrayItem(a,o,r){
		for(var i=0,len=a.length; i<len; i++){
			if (a[i][o] == r[o]){return;}
		}
		a.push(r);
	}
	
	function createStyleSheet(parent){
		var cc = parent || $('head');
		var state = $.data(cc[0], 'ss');
		if (!state){
			state = $.data(cc[0], 'ss', {
				cache: {},
				dirty: []
			});
		}
		return {
			add: function(lines){
				var ss = ['<style type="text/css">'];
				for(var i=0; i<lines.length; i++){
					state.cache[lines[i][0]] = {width: lines[i][1]};
				}
				var index = 0;
				for(var s in state.cache){
					var item = state.cache[s];
					item.index = index++;
					ss.push(s + '{width:' + item.width + '}');
				}
				ss.push('</style>');
				$(ss.join('\n')).appendTo(cc);
				setTimeout(function(){
					cc.children('style:not(:last)').remove();
				}, 0);
			},
			getRule: function(index){
				var style = cc.children('style:last')[0];
				var styleSheet = style.styleSheet ? style.styleSheet : (style.sheet || document.styleSheets[document.styleSheets.length-1]);
				var rules = styleSheet.cssRules || styleSheet.rules;
				return rules[index];
			},
			set: function(selector, width){
				var item = state.cache[selector];
				if (item){
					item.width = width;
					var rule = this.getRule(item.index);
					if (rule){
						rule.style['width'] = width;
					}
				}
			},
			remove: function(selector){
				var tmp = [];
				for(var s in state.cache){
					if (s.indexOf(selector) == -1){
						tmp.push([s, state.cache[s].width]);
					}
				}
				state.cache = {};
				this.add(tmp);
			},
			dirty: function(selector){
				if (selector){
					state.dirty.push(selector);
				}
			},
			clean: function(){
				for(var i=0; i<state.dirty.length; i++){
					this.remove(state.dirty[i]);
				}
				state.dirty = [];
			}
		}
	}
	
	
	function setSize(target, param) {
		var opts = $.data(target, 'datagrid').options;
		var panel = $.data(target, 'datagrid').panel;
		
		if (param){
			if (param.width) opts.width = param.width;
			if (param.height) opts.height = param.height;
		}
		
		if (opts.fit == true){
			var p = panel.panel('panel').parent();
			opts.width = p.width();
			opts.height = p.height();
		}
		
		panel.panel('resize', {
			width: opts.width,
			height: opts.height
		});
	}
	
	function setBodySize(target){
		var opts = $.data(target, 'datagrid').options;
		var dc = $.data(target, 'datagrid').dc;
		var wrap = $.data(target, 'datagrid').panel;
		var innerWidth = wrap.width();
		var innerHeight = wrap.height();
		
		var view = dc.view;
		var view1 = dc.view1;
		var view2 = dc.view2;
		var header1 = view1.children('div.datagrid-header');
		var header2 = view2.children('div.datagrid-header');
		var table1 = header1.find('table');
		var table2 = header2.find('table');
		
		// set view width
		view.width(innerWidth);
		var headerInner = header1.children('div.datagrid-header-inner').show();
		view1.width(headerInner.find('table').width());
		if (!opts.showHeader) headerInner.hide();
		view2.width(innerWidth - view1._outerWidth());
		view1.children('div.datagrid-header,div.datagrid-body,div.datagrid-footer').width(view1.width());
		view2.children('div.datagrid-header,div.datagrid-body,div.datagrid-footer').width(view2.width());
		
		// set header height
		var hh;
		header1.css('height', '');
		header2.css('height', '');
		table1.css('height', '');
		table2.css('height', '');
		hh = Math.max(table1.height(), table2.height());
		table1.height(hh);
		table2.height(hh);
		header1.add(header2)._outerHeight(hh);
		
		// set body height
		if (opts.height != 'auto') {
			var height = innerHeight
					- view2.children('div.datagrid-header')._outerHeight()
					- view2.children('div.datagrid-footer')._outerHeight()
					- wrap.children('div.datagrid-toolbar')._outerHeight();
			wrap.children('div.datagrid-pager').each(function(){
				height -= $(this)._outerHeight();
			});
//			view1.children('div.datagrid-body').height(height);
//			view2.children('div.datagrid-body').height(height);
			
			dc.body1.add(dc.body2).children('table.datagrid-btable-frozen').css({
				position: 'absolute',
				top: dc.header2._outerHeight()
			});
			var frozenHeight = dc.body2.children('table.datagrid-btable-frozen')._outerHeight();
			view1.add(view2).children('div.datagrid-body').css({
				marginTop: frozenHeight,
				height: (height - frozenHeight)
			});
		}
		
		view.height(view2.height());
//		view2.css('left', view1._outerWidth());
	}
	
	function fixRowHeight(target, index, forceFix){
		var rows = $.data(target, 'datagrid').data.rows;
		var opts = $.data(target, 'datagrid').options;
		var dc = $.data(target, 'datagrid').dc;
		
		if (!dc.body1.is(':empty') && (!opts.nowrap || opts.autoRowHeight || forceFix)){
			if (index != undefined){
				var tr1 = opts.finder.getTr(target, index, 'body', 1);
				var tr2 = opts.finder.getTr(target, index, 'body', 2);
				setHeight(tr1, tr2);
			} else {
				var tr1 = opts.finder.getTr(target, 0, 'allbody', 1);
				var tr2 = opts.finder.getTr(target, 0, 'allbody', 2);
				setHeight(tr1, tr2);
				if (opts.showFooter){
					var tr1 = opts.finder.getTr(target, 0, 'allfooter', 1);
					var tr2 = opts.finder.getTr(target, 0, 'allfooter', 2);
					setHeight(tr1, tr2);
				}
			}
		}
		
		setBodySize(target);
		if (opts.height == 'auto'){
			var body1 = dc.body1.parent();
			var body2 = dc.body2;
			var csize = getContentSize(body2);
			var height = csize.height;
			if (csize.width > body2.width()){
				height += 18;
			}
			body1.height(height);
			body2.height(height);
			dc.view.height(dc.view2.height());
		}
		dc.body2.triggerHandler('scroll');
		
		// set body row or footer row height
		function setHeight(trs1, trs2){
			for(var i=0; i<trs2.length; i++){
				var tr1 = $(trs1[i]);
				var tr2 = $(trs2[i]);
				tr1.css('height', '');
				tr2.css('height', '');
				var height = Math.max(tr1.height(), tr2.height());
				tr1.css('height', height);
				tr2.css('height', height);
			}
		}
		// get content size of a container(div)
		function getContentSize(cc){
			var width = 0;
			var height = 0;
			$(cc).children().each(function(){
				var c = $(this);
				if (c.is(':visible')){
					height += c._outerHeight();
					if (width < c._outerWidth()){
						width = c._outerWidth();
					}
				}
			});
			return {width:width,height:height};
		}
	}
	
	function freezeRow(target, index){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var dc = state.dc;
		if (!dc.body2.children('table.datagrid-btable-frozen').length){
			dc.body1.add(dc.body2).prepend('<table class="datagrid-btable datagrid-btable-frozen" cellspacing="0" cellpadding="0"></table>');
		}
		moveTr(true);
		moveTr(false);
		setBodySize(target);
		function moveTr(frozen){
			var serno = frozen ? 1 : 2;
			var tr = opts.finder.getTr(target, index, 'body', serno);
			(frozen ? dc.body1 : dc.body2).children('table.datagrid-btable-frozen').append(tr);
		}
	}
	
	/**
	 * wrap and return the grid object, fields and columns
	 */
	function wrapGrid(target, rownumbers) {
		function getColumns(){
			var frozenColumns = [];
			var columns = [];
			$(target).children('thead').each(function(){
				var opt = $.parser.parseOptions(this, [{frozen:'boolean'}]);
				$(this).find('tr').each(function(){
					var cols = [];
					$(this).find('th').each(function(){
						var th = $(this);
						var col = $.extend({}, $.parser.parseOptions(this, [
    						'field','align','halign','order',
    						{sortable:'boolean',checkbox:'boolean',resizable:'boolean',fixed:'boolean'},
    						{rowspan:'number',colspan:'number',width:'number'}
    					]), {
    						title: (th.html() || undefined),
    						hidden: (th.attr('hidden') ? true : undefined),
    						formatter: (th.attr('formatter') ? eval(th.attr('formatter')) : undefined),
    						styler: (th.attr('styler') ? eval(th.attr('styler')) : undefined),
    						sorter: (th.attr('sorter') ? eval(th.attr('sorter')) : undefined)
    					});
//    					if (!col.align) col.align = 'left';
    					if (th.attr('editor')){
    						var s = $.trim(th.attr('editor'));
    						if (s.substr(0,1) == '{'){
    							col.editor = eval('(' + s + ')');
    						} else {
    							col.editor = s;
    						}
    					}
    					
    					cols.push(col);
					});
					
					opt.frozen ? frozenColumns.push(cols) : columns.push(cols);
				});
			});
			return [frozenColumns, columns];
		}
		
		var panel = $(
				'<div class="datagrid-wrap">' +
					'<div class="datagrid-view">' +
						'<div class="datagrid-view1">' +
							'<div class="datagrid-header">' +
								'<div class="datagrid-header-inner"></div>' +
							'</div>' +
							'<div class="datagrid-body">' +
								'<div class="datagrid-body-inner"></div>' +
							'</div>' +
							'<div class="datagrid-footer">' +
								'<div class="datagrid-footer-inner"></div>' +
							'</div>' +
						'</div>' +
						'<div class="datagrid-view2">' +
							'<div class="datagrid-header">' +
								'<div class="datagrid-header-inner"></div>' +
							'</div>' +
							'<div class="datagrid-body"></div>' +
							'<div class="datagrid-footer">' +
								'<div class="datagrid-footer-inner"></div>' +
							'</div>' +
						'</div>' +
//						'<div class="datagrid-resize-proxy"></div>' +
					'</div>' +
				'</div>'
		).insertAfter(target);
		
		panel.panel({
			doSize:false
		});
		panel.panel('panel').addClass('datagrid').bind('_resize', function(e, force){
			var opts = $.data(target, 'datagrid').options;
			if (opts.fit == true || force){
				setSize(target);
				setTimeout(function(){
					if ($.data(target, 'datagrid')){
						fixColumnSize(target);
					}
				}, 0);
			}
			return false;
		});
		
		$(target).hide().appendTo(panel.children('div.datagrid-view'));
		
		var cc = getColumns();
		var view = panel.children('div.datagrid-view');
		var view1 = view.children('div.datagrid-view1');
		var view2 = view.children('div.datagrid-view2');
		
		var pview = panel.closest('div.datagrid-view');
		if (!pview.length){pview = view};
		var ss = createStyleSheet(pview);
		
		return {
			panel: panel,
			frozenColumns: cc[0],
			columns: cc[1],
			dc: {	// some data container
				view: view,
				view1: view1,
				view2: view2,
				header1: view1.children('div.datagrid-header').children('div.datagrid-header-inner'),
				header2: view2.children('div.datagrid-header').children('div.datagrid-header-inner'),
				body1: view1.children('div.datagrid-body').children('div.datagrid-body-inner'),
				body2: view2.children('div.datagrid-body'),
				footer1: view1.children('div.datagrid-footer').children('div.datagrid-footer-inner'),
				footer2: view2.children('div.datagrid-footer').children('div.datagrid-footer-inner')
			},
			ss: ss
		};
	}
	
	function buildGrid(target){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var dc = state.dc;
		var panel = state.panel;
		
		panel.panel($.extend({}, opts, {
			id: null,
			doSize: false,
			onResize: function(width, height){
				setTimeout(function(){
					if ($.data(target, 'datagrid')){
						setBodySize(target);
						fitColumns(target);
						opts.onResize.call(panel, width, height);
					}
				}, 0);
			},
			onExpand: function(){
				//setBodySize(target);
				fixRowHeight(target);
				opts.onExpand.call(panel);
			}
		}));
		
		state.rowIdPrefix = 'datagrid-row-r' + (++DATAGRID_SERNO);
		state.cellClassPrefix = 'datagrid-cell-c' + DATAGRID_SERNO;
		createColumnHeader(dc.header1, opts.frozenColumns, true);
		createColumnHeader(dc.header2, opts.columns, false);
		createColumnStyle();
		
		dc.header1.add(dc.header2).css('display', opts.showHeader ? 'block' : 'none');
		dc.footer1.add(dc.footer2).css('display', opts.showFooter ? 'block' : 'none');
		
		if (opts.toolbar) {
			if (typeof opts.toolbar == 'string'){
				$(opts.toolbar).addClass('datagrid-toolbar').prependTo(panel);
				$(opts.toolbar).show();
			} else {
				$('div.datagrid-toolbar', panel).remove();
				var tb = $('<div class="datagrid-toolbar"><table cellspacing="0" cellpadding="0"><tr></tr></table></div>').prependTo(panel);
				var tr = tb.find('tr');
				for(var i=0; i<opts.toolbar.length; i++) {
					var btn = opts.toolbar[i];
					if (btn == '-') {
						$('<td><div class="datagrid-btn-separator"></div></td>').appendTo(tr);
					} else {
						var td = $('<td></td>').appendTo(tr);
						var tool = $('<a href="javascript:void(0)"></a>').appendTo(td);
						tool[0].onclick = eval(btn.handler || function(){});
						tool.linkbutton($.extend({}, btn, {
							plain:true
						}));
					}
				}
			}
		} else {
			$('div.datagrid-toolbar', panel).remove();
		}
		
		$('div.datagrid-pager', panel).remove();
		if (opts.pagination) {
			var pager = $('<div class="datagrid-pager"></div>');
			if (opts.pagePosition == 'bottom'){
				pager.appendTo(panel);
			} else if (opts.pagePosition == 'top'){
				pager.addClass('datagrid-pager-top').prependTo(panel);
			} else {
				var ptop = $('<div class="datagrid-pager datagrid-pager-top"></div>').prependTo(panel);
				pager.appendTo(panel);
				pager = pager.add(ptop);
			}
			pager.pagination({
				total:0,
				pageNumber:opts.pageNumber,
				pageSize:opts.pageSize,
				pageList:opts.pageList,
				onSelectPage: function(pageNum, pageSize){
					// save the page state
					opts.pageNumber = pageNum;
					opts.pageSize = pageSize;
					pager.pagination('refresh',{
						pageNumber:pageNum,
						pageSize:pageSize
					});
					
					request(target);	// request new page data
				}
			});
			opts.pageSize = pager.pagination('options').pageSize;	// repare the pageSize value
		}
		
		function createColumnHeader(container, columns, frozen){
			if (!columns) return;
			$(container).show();
			$(container).empty();
			var t = $('<table class="datagrid-htable" border="0" cellspacing="0" cellpadding="0"><tbody></tbody></table>').appendTo(container);
			for(var i=0; i<columns.length; i++) {
				var tr = $('<tr class="datagrid-header-row"></tr>').appendTo($('tbody', t));
				var cols = columns[i];
				for(var j=0; j<cols.length; j++){
					var col = cols[j];
					
					var attr = '';
					if (col.rowspan) attr += 'rowspan="' + col.rowspan + '" ';
					if (col.colspan) attr += 'colspan="' + col.colspan + '" ';
					var td = $('<td ' + attr + '></td>').appendTo(tr);
					
					if (col.checkbox){
						td.attr('field', col.field);
						$('<div class="datagrid-header-check"></div>').html('<input type="checkbox"/>').appendTo(td);
					} else if (col.field){
						td.attr('field', col.field);
						td.append('<div class="datagrid-cell"><span></span><span class="datagrid-sort-icon"></span></div>');
						$('span', td).html(col.title);
						$('span.datagrid-sort-icon', td).html('&nbsp;');
						var cell = td.find('div.datagrid-cell');
						if (opts.sortName == col.field){
							cell.addClass('datagrid-sort-'+opts.sortOrder);
						}
						if (col.resizable == false){
							cell.attr('resizable', 'false');
						}
						if (col.width){
							cell._outerWidth(col.width);
							col.boxWidth = parseInt(cell[0].style.width);
						} else {
							col.auto = true;
						}
//						cell.css('text-align', (col.align || 'left'));
//						if (col.align){cell.css('text-align', col.align)}
						cell.css('text-align', (col.halign || col.align || ''));
						
						// define the cell class
						col.cellClass = state.cellClassPrefix + '-' + col.field.replace(/[\.|\s]/g,'-');
//						col.cellSelector = '.' + col.cellClass;
					} else {
						$('<div class="datagrid-cell-group"></div>').html(col.title).appendTo(td);
					}
					
					if (col.hidden){
						td.hide();
					}
				}
				
			}
			if (frozen && opts.rownumbers){
				var td = $('<td rowspan="'+opts.frozenColumns.length+'"><div class="datagrid-header-rownumber"></div></td>');
				if ($('tr',t).length == 0){
					td.wrap('<tr class="datagrid-header-row"></tr>').parent().appendTo($('tbody',t));
				} else {
					td.prependTo($('tr:first', t));
				}
			}
		}
		
		function createColumnStyle(){
			var lines = [];
			var fields = getColumnFields(target,true).concat(getColumnFields(target));
			for(var i=0; i<fields.length; i++){
				var col = getColumnOption(target, fields[i]);
				if (col && !col.checkbox){
					lines.push(['.'+col.cellClass, col.boxWidth ? col.boxWidth + 'px' : 'auto']);
				}
			}
			state.ss.add(lines);
			state.ss.dirty(state.cellSelectorPrefix);	// mark the old selector as dirty that will be removed
			state.cellSelectorPrefix = '.' + state.cellClassPrefix;
		}
	}
	
	/**
	 * bind the datagrid events
	 */
	function bindEvents(target) {
		var state = $.data(target, 'datagrid');
		var panel = state.panel;
		var opts = state.options;
		var dc = state.dc;
		
		var header = dc.header1.add(dc.header2);
		header.find('input[type=checkbox]').unbind('.datagrid').bind('click.datagrid', function(e){
			if (opts.singleSelect && opts.selectOnCheck) return false;
			if ($(this).is(':checked')){
				checkAll(target);
			} else {
				uncheckAll(target);
			}
			e.stopPropagation();
		});
		
		var cells = header.find('div.datagrid-cell');
		cells.closest('td').unbind('.datagrid').bind('mouseenter.datagrid', function(){
			if (state.resizing){return;}
			$(this).addClass('datagrid-header-over');
		}).bind('mouseleave.datagrid', function(){
			$(this).removeClass('datagrid-header-over');
		}).bind('contextmenu.datagrid', function(e){
			var field = $(this).attr('field');
			opts.onHeaderContextMenu.call(target, e, field);
		});
		
		cells.unbind('.datagrid').bind('click.datagrid', function(e){
			var p1 = $(this).offset().left + 5;
			var p2 = $(this).offset().left + $(this)._outerWidth() - 5;
			if (e.pageX < p2 && e.pageX > p1){
				var field = $(this).parent().attr('field');
				var col = getColumnOption(target, field);
				if (!col.sortable || state.resizing) return;
				
				opts.sortName = field;
//				opts.sortOrder = 'asc';
				opts.sortOrder = col.order || 'asc';
				
				var cls = 'datagrid-sort-' + opts.sortOrder;
				if ($(this).hasClass('datagrid-sort-asc')){
					cls = 'datagrid-sort-desc';
					opts.sortOrder = 'desc';
				} else if ($(this).hasClass('datagrid-sort-desc')){
					cls = 'datagrid-sort-asc';
					opts.sortOrder = 'asc';
				}
				cells.removeClass('datagrid-sort-asc datagrid-sort-desc');
				$(this).addClass(cls);
				
				if (opts.remoteSort){
					request(target);
				} else {
					var data = $.data(target, 'datagrid').data;
					loadData(target, data);
				}
				
				opts.onSortColumn.call(target, opts.sortName, opts.sortOrder);
			}
		}).bind('dblclick.datagrid', function(e){
			var p1 = $(this).offset().left + 5;
			var p2 = $(this).offset().left + $(this)._outerWidth() - 5;
			var cond = opts.resizeHandle == 'right' ? (e.pageX > p2) : (opts.resizeHandle == 'left' ? (e.pageX < p1) : (e.pageX < p1 || e.pageX > p2));
			if (cond){
				var field = $(this).parent().attr('field');
				var col = getColumnOption(target, field);
				if (col.resizable == false) return;
				$(target).datagrid('autoSizeColumn', field);
				col.auto = false;
			}
		});
		
		var resizeHandle = opts.resizeHandle == 'right' ? 'e' : (opts.resizeHandle == 'left' ? 'w' : 'e,w');
		cells.each(function(){
			$(this).resizable({
//				handles:'e',
				handles:resizeHandle,
				disabled:($(this).attr('resizable') ? $(this).attr('resizable')=='false' : false),
				minWidth:25,
				onStartResize: function(e){
					state.resizing = true;
//					header.css('cursor', 'e-resize');
					header.css('cursor', $('body').css('cursor'));
					if (!state.proxy){
						state.proxy = $('<div class="datagrid-resize-proxy"></div>').appendTo(dc.view);
					}
					state.proxy.css({
						left:e.pageX - $(panel).offset().left - 1,
						display:'none'
					});
					setTimeout(function(){
						if (state.proxy) state.proxy.show();
					}, 500);
				},
				onResize: function(e){
					state.proxy.css({
						left:e.pageX - $(panel).offset().left - 1,
						display:'block'
					});
					return false;
				},
				onStopResize: function(e){
					header.css('cursor', '');
					$(this).css('height','');
					var field = $(this).parent().attr('field');
					var col = getColumnOption(target, field);
					col.width = $(this)._outerWidth();
					col.boxWidth = parseInt(this.style.width);
					col.auto = undefined;
					fixColumnSize(target, field);
//					dc.view2.children('div.datagrid-header').scrollLeft(dc.body2.scrollLeft());
					state.proxy.remove();
					state.proxy = null;
					if ($(this).parents('div:first.datagrid-header').parent().hasClass('datagrid-view1')){
						setBodySize(target);
					}
					fitColumns(target);
					opts.onResizeColumn.call(target, field, col.width);
					setTimeout(function(){
						state.resizing = false;
					}, 0);
				}
			});
		});
		
		dc.body1.add(dc.body2).unbind().bind('mouseover', function(e){
			if (state.resizing){return;}
			var tr = $(e.target).closest('tr.datagrid-row');
			if (!doesExist(tr)){return;}
			var index = getIndex(tr);
			highlightRow(target, index);
			e.stopPropagation();
		}).bind('mouseout', function(e){
			var tr = $(e.target).closest('tr.datagrid-row');
			if (!doesExist(tr)){return;}
			var index = getIndex(tr);
			opts.finder.getTr(target, index).removeClass('datagrid-row-over');
			e.stopPropagation();
		}).bind('click', function(e){
			var tt = $(e.target);
			var tr = tt.closest('tr.datagrid-row');
			if (!doesExist(tr)){return;}
			var index = getIndex(tr);
			if (tt.parent().hasClass('datagrid-cell-check')){	// click the checkbox
				if (opts.singleSelect && opts.selectOnCheck){
					if (!opts.checkOnSelect) {
						uncheckAll(target, true);
					}
					checkRow(target, index);
				} else {
					if (tt.is(':checked')){
						checkRow(target, index);
					} else {
						uncheckRow(target, index);
					}
				}
			} else {
				var row = opts.finder.getRow(target, index);
				var td = tt.closest('td[field]',tr);
				if (td.length){
					var field = td.attr('field');
					opts.onClickCell.call(target, index, field, row[field]);
				}
				
				if (opts.singleSelect == true){
					selectRow(target, index);
				} else {
					if (tr.hasClass('datagrid-row-selected')){
						unselectRow(target, index);
					} else {
						selectRow(target, index);
					}
				}
				opts.onClickRow.call(target, index, row);
			}
			e.stopPropagation();
		}).bind('dblclick', function(e){
			var tt = $(e.target);
			var tr = tt.closest('tr.datagrid-row');
			if (!doesExist(tr)){return;}
			var index = getIndex(tr);
			var row = opts.finder.getRow(target, index);
			var td = tt.closest('td[field]',tr);
			if (td.length){
				var field = td.attr('field');
				opts.onDblClickCell.call(target, index, field, row[field]);
			}
			opts.onDblClickRow.call(target, index, row);
			e.stopPropagation();
		}).bind('contextmenu', function(e){
			var tr = $(e.target).closest('tr.datagrid-row');
			if (!doesExist(tr)){return;}
			var index = getIndex(tr);
			var row = opts.finder.getRow(target, index);
			opts.onRowContextMenu.call(target, e, index, row);
			e.stopPropagation();
		});
		dc.body2.bind('scroll', function(){
			var b1 = dc.view1.children('div.datagrid-body');
			b1.scrollTop($(this).scrollTop());
			var c1 = dc.body1.children(':first');
			var c2 = dc.body2.children(':first');
			if (c1.length && c2.length){
				var top1 = c1.offset().top;
				var top2 = c2.offset().top;
				if (top1 != top2){
					b1.scrollTop(b1.scrollTop()+top1-top2);
				}
			}
			
//			dc.view1.children('div.datagrid-body').scrollTop($(this).scrollTop());
			dc.view2.children('div.datagrid-header,div.datagrid-footer')._scrollLeft($(this)._scrollLeft());
			dc.body2.children('table.datagrid-btable-frozen').css('left', -$(this)._scrollLeft());
		});
		
		function getIndex(tr){
			if (tr.attr('datagrid-row-index')){
				return parseInt(tr.attr('datagrid-row-index'));
			} else {
				return tr.attr('node-id');
			}
		}
		function doesExist(tr){
			return tr.length && tr.parent().length;
		}
	}
	
	/**
	 * expand the columns to fit the grid width
	 */
	function fitColumns(target){
		var opts = $.data(target, 'datagrid').options;
		var dc = $.data(target, 'datagrid').dc;
		dc.body2.css('overflow-x', opts.fitColumns?'hidden':'');
		if (!opts.fitColumns){
			return;
		}
		var header = dc.view2.children('div.datagrid-header');
		var fieldWidths = 0;
		var lastColumn;
		var fields = getColumnFields(target, false);
		for(var i=0; i<fields.length; i++){
			var col = getColumnOption(target, fields[i]);
			if (canResize(col)){
				fieldWidths += col.width;
				lastColumn = col;
			}
		}
		var headerInner = header.children('div.datagrid-header-inner').show();
		var leftWidth = header.width() - header.find('table').width() - opts.scrollbarSize;
		var rate = leftWidth / fieldWidths;
		if (!opts.showHeader) headerInner.hide();
		for(var i=0; i<fields.length; i++){
			var col = getColumnOption(target, fields[i]);
			if (canResize(col)){
				var width = Math.floor(col.width * rate);
				addHeaderWidth(col, width);
				leftWidth -= width;
			}
		}
		
		if (leftWidth && lastColumn){
			addHeaderWidth(lastColumn,leftWidth);
		}
		fixColumnSize(target);
		
		function addHeaderWidth(col,width){
			col.width += width;
			col.boxWidth += width;
			header.find('td[field="' + col.field + '"] div.datagrid-cell').width(col.boxWidth);
		}
		function canResize(col){
			if (!col.hidden && !col.checkbox && !col.auto && !col.fixed) return true;
//			if (!col.hidden && !col.checkbox && !col.auto) return true;
		}
	}
	
	/**
	 * adjusts the column width to fit the contents.
	 */
	function autoSizeColumn(target, field){
		var opts = $.data(target, 'datagrid').options;
		var dc = $.data(target, 'datagrid').dc;
		if (field){
			setSize(field);
			if (opts.fitColumns){
				setBodySize(target);
				fitColumns(target);
			}
		} else {
			var canFitColumns = false;
			var fields = getColumnFields(target,true).concat(getColumnFields(target,false));
			for(var i=0; i<fields.length; i++){
				var field = fields[i];
				var col = getColumnOption(target, field);
				if (col.auto){
					setSize(field);
					canFitColumns = true;
				}
			}
			if (canFitColumns && opts.fitColumns){
				setBodySize(target);
				fitColumns(target);
			}
		}
		
		function setSize(field){
			var headerCell = dc.view.find('div.datagrid-header td[field="' + field + '"] div.datagrid-cell');
			headerCell.css('width', '');
			var col = $(target).datagrid('getColumnOption', field);
			col.width = undefined;
			col.boxWidth = undefined;
			col.auto = true;
			$(target).datagrid('fixColumnSize', field);
			var width = Math.max(headerCell._outerWidth(), getWidth('allbody'), getWidth('allfooter'));
			headerCell._outerWidth(width);
			col.width = width;
			col.boxWidth = parseInt(headerCell[0].style.width);
			$(target).datagrid('fixColumnSize', field);
			opts.onResizeColumn.call(target, field, col.width);
			
			// get cell width of specified type(body or footer)
			function getWidth(type){
				var width = 0;
				opts.finder.getTr(target,0,type).find('td[field="' + field + '"] div.datagrid-cell').each(function(){
					var w = $(this)._outerWidth();
					if (width < w){
						width = w;
					}
				});
				return width;
			}
		}
	}
	
	
	/**
	 * fix column size for the specified field
	 */
	function fixColumnSize(target, field){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var dc = state.dc;
		var table = dc.view.find('table.datagrid-btable,table.datagrid-ftable');
		table.css('table-layout','fixed');
		if (field) {
			fix(field);
		} else {
			var ff = getColumnFields(target, true).concat(getColumnFields(target, false));	// get all fields
			for(var i=0; i<ff.length; i++){
				fix(ff[i]);
			}
		}
		table.css('table-layout','auto');
		fixMergedSize(target);
		
		setTimeout(function(){
			fixRowHeight(target);
			fixEditableSize(target);
		}, 0);
		
		function fix(field){
			var col = getColumnOption(target, field);
			if (!col.checkbox){
				state.ss.set('.'+col.cellClass, col.boxWidth ? col.boxWidth + 'px' : 'auto');
			}
		}
	}
	
//	function fixMergedSize(target){
//		var dc = $.data(target, 'datagrid').dc;
//		var cells = dc.body1.add(dc.body2).find('td.datagrid-td-merged>div.datagrid-cell');
//		cells.css('width','').each(function(){
//			$(this)._outerWidth($(this).parent().width());
//		});
//	}
	function fixMergedSize(target){
		var dc = $.data(target, 'datagrid').dc;
		dc.body1.add(dc.body2).find('td.datagrid-td-merged').each(function(){
			var td = $(this);
			var colspan = td.attr('colspan') || 1;
			var width = getColumnOption(target, td.attr('field')).width;
			for(var i=1; i<colspan; i++){
				td = td.next();
				width += getColumnOption(target, td.attr('field')).width+1;
			}
			$(this).children('div.datagrid-cell')._outerWidth(width);
		});
	}
	
	function fixEditableSize(target){
		var dc = $.data(target, 'datagrid').dc;
		dc.view.find('div.datagrid-editable').each(function(){
			var cell = $(this);
			var field = cell.parent().attr('field');
			var col = $(target).datagrid('getColumnOption', field);
			cell._outerWidth(col.width);
			var ed = $.data(this, 'datagrid.editor');
			if (ed.actions.resize) {
				ed.actions.resize(ed.target, cell.width());
			}
		});
	}
	
	function getColumnOption(target, field){
		function find(columns){
			if (columns) {
				for(var i=0; i<columns.length; i++){
					var cc = columns[i];
					for(var j=0; j<cc.length; j++){
						var c = cc[j];
						if (c.field == field){
							return c;
						}
					}
				}
			}
			return null;
		}
		
		var opts = $.data(target, 'datagrid').options;
		var col = find(opts.columns);
		if (!col){
			col = find(opts.frozenColumns);
		}
		return col;
	}
	
	/**
	 * get column fields which will be show in row
	 */
	function getColumnFields(target, frozen){
		var opts = $.data(target, 'datagrid').options;
		var columns = (frozen==true) ? (opts.frozenColumns || [[]]) : opts.columns;
		if (columns.length == 0) return [];
		
		var fields = [];
		
		function getColumnIndex(count){
			var c = 0;
			var i = 0;
			while(true){
				if (fields[i] == undefined){
					if (c == count){
						return i;
					}
					c ++;
				}
				i++;
			}
		}
		
		function getFields(r){
			var ff = [];
			var c = 0;
			for(var i=0; i<columns[r].length; i++){
				var col = columns[r][i];
				if (col.field){
					ff.push([c, col.field]);	// store the field index and name
				}
				c += parseInt(col.colspan || '1');
			}
			for(var i=0; i<ff.length; i++){
				ff[i][0] = getColumnIndex(ff[i][0]);	// calculate the real index in fields array
			}
			for(var i=0; i<ff.length; i++){
				var f = ff[i];
				fields[f[0]] = f[1];	// update the field name
			}
		}
		
		for(var i=0; i<columns.length; i++){
			getFields(i);
		}
		
		return fields;
	}
	
	/**
	 * load data to the grid
	 */
	function loadData(target, data){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var dc = state.dc;
		data = opts.loadFilter.call(target, data);
		data.total = parseInt(data.total);
		state.data = data;
		if (data.footer){
			state.footer = data.footer;
		}
		
		if (!opts.remoteSort){
			var opt = getColumnOption(target, opts.sortName);
			if (opt){
				var sortFunc = opt.sorter || function(a,b){
					return (a>b?1:-1);
				};
				data.rows.sort(function(r1,r2){
					return sortFunc(r1[opts.sortName], r2[opts.sortName])*(opts.sortOrder=='asc'?1:-1);
				});
			}
		}
		
		// render datagrid view
		if (opts.view.onBeforeRender){
			opts.view.onBeforeRender.call(opts.view, target, data.rows);
		}
		opts.view.render.call(opts.view, target, dc.body2, false);
		opts.view.render.call(opts.view, target, dc.body1, true);
		if (opts.showFooter){
			opts.view.renderFooter.call(opts.view, target, dc.footer2, false);
			opts.view.renderFooter.call(opts.view, target, dc.footer1, true);
		}
		if (opts.view.onAfterRender){
			opts.view.onAfterRender.call(opts.view, target);
		}
		
		state.ss.clean();
		
		opts.onLoadSuccess.call(target, data);
		
		var pager = $(target).datagrid('getPager');
		if (pager.length){
			if (pager.pagination('options').total != data.total){
				pager.pagination('refresh',{total:data.total});
//				pager.pagination({total:data.total});
			}
		}
		
		fixRowHeight(target);
//		bindRowEvents(target);
		dc.body2.triggerHandler('scroll');
		
		setSelection();
		$(target).datagrid('autoSizeColumn');
		
		/*
		 * set row selection that previously selected
		 */
		function setSelection(){
			if (opts.idField){
				for(var i=0; i<data.rows.length; i++){
					var row = data.rows[i];
					if (contains(state.selectedRows, row)){
						opts.finder.getTr(target, i).addClass('datagrid-row-selected');
					}
					if (contains(state.checkedRows, row)){
						opts.finder.getTr(target, i).find('div.datagrid-cell-check input[type=checkbox]')._propAttr('checked', true);
					}
				}
			}
			function contains(a,r){
				for(var i=0; i<a.length; i++){
					if (a[i][opts.idField] == r[opts.idField]){
						a[i] = r;
						return true;
					}
				}
				return false;
			}
		}
	}
	
	/**
	 * Return the index of specified row or -1 if not found.
	 * row: id value or row record
	 */
	function getRowIndex(target, row){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var rows = state.data.rows;
		if (typeof row == 'object'){
			return indexOfArray(rows, row);
		} else {
			for(var i=0; i<rows.length; i++){
				if (rows[i][opts.idField] == row){
					return i;
				}
			}
			return -1;
		}
	}
	
	function getSelectedRows(target){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var data = state.data;
		
		if (opts.idField){
			return state.selectedRows;
		} else {
			var rows = [];
			opts.finder.getTr(target, '', 'selected', 2).each(function(){
				var index = parseInt($(this).attr('datagrid-row-index'));
				rows.push(data.rows[index]);
			});
			return rows;
		}
	}
	
	function getCheckedRows(target){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		if (opts.idField){
			return state.checkedRows;
		} else {
			var rows = [];
//			state.dc.view.find('div.datagrid-cell-check input:checked').each(function(){
//				var index = $(this).closest('tr.datagrid-row').attr('datagrid-row-index');
//				rows.push(opts.finder.getRow(target, index));
//			});
			opts.finder.getTr(target, '', 'checked').each(function(){
				rows.push(opts.finder.getRow(target, $(this)));
			});
			return rows;
		}
	}
	
	function scrollTo(target, index){
		var state = $.data(target, 'datagrid');
		var dc = state.dc;
		var opts = state.options;
		var tr = opts.finder.getTr(target, index);
		if (tr.length){
			if (tr.closest('table').hasClass('datagrid-btable-frozen')){return;}
			var headerHeight = dc.view2.children('div.datagrid-header')._outerHeight();
			var body2 = dc.body2;
			var frozenHeight = body2.outerHeight(true) - body2.outerHeight();
			var top = tr.position().top - headerHeight - frozenHeight;
			if (top < 0){
				body2.scrollTop(body2.scrollTop() + top);
			} else if (top + tr._outerHeight() > body2.height() - 18){
				body2.scrollTop(body2.scrollTop() + top + tr._outerHeight() - body2.height() + 18);
			}
		}
	}
	
	function highlightRow(target, index){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		opts.finder.getTr(target, state.highlightIndex).removeClass('datagrid-row-over');
		opts.finder.getTr(target, index).addClass('datagrid-row-over');
		state.highlightIndex = index;
//		scrollTo(target, index);
	}
	
	/**
	 * select a row, the row index start with 0
	 */
	function selectRow(target, index, notCheck){
		var state = $.data(target, 'datagrid');
		var dc = state.dc;
		var opts = state.options;
		var selectedRows = state.selectedRows;
		
		if (opts.singleSelect){
			unselectAll(target);
			selectedRows.splice(0, selectedRows.length);
		}
		if (!notCheck && opts.checkOnSelect){
			checkRow(target, index, true);	// don't select the row again
		}
		
		var row = opts.finder.getRow(target, index);
		if (opts.idField){
			addArrayItem(selectedRows, opts.idField, row);
		}
		opts.finder.getTr(target, index).addClass('datagrid-row-selected');
		opts.onSelect.call(target, index, row);
		scrollTo(target, index);
	}
	/**
	 * unselect a row
	 */
	function unselectRow(target, index, notCheck){
		var state = $.data(target, 'datagrid');
		var dc = state.dc;
		var opts = state.options;
		var selectedRows = $.data(target, 'datagrid').selectedRows;
		
		if (!notCheck && opts.checkOnSelect){
			uncheckRow(target, index, true);	// don't unselect the row again
		}
		opts.finder.getTr(target, index).removeClass('datagrid-row-selected');
		var row = opts.finder.getRow(target, index);
		if (opts.idField){
			removeArrayItem(selectedRows, opts.idField, row[opts.idField]);
		}
		opts.onUnselect.call(target, index, row);
	}
	/**
	 * select all rows on current page
	 */
	function selectAll(target, notCheck){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var rows = state.data.rows;
		var selectedRows = $.data(target, 'datagrid').selectedRows;
		
		if (!notCheck && opts.checkOnSelect){
			checkAll(target, true);	// don't select rows again
		}
		opts.finder.getTr(target, '', 'allbody').addClass('datagrid-row-selected');
		if (opts.idField){
			for(var index=0; index<rows.length; index++){
				addArrayItem(selectedRows, opts.idField, rows[index]);
			}
		}
		opts.onSelectAll.call(target, rows);
	}
	/**
	 * unselect all rows on current page
	 */
	function unselectAll(target, notCheck){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var rows = state.data.rows;
		var selectedRows = $.data(target, 'datagrid').selectedRows;
		
		if (!notCheck && opts.checkOnSelect){
			uncheckAll(target, true);	// don't unselect rows again
		}
		opts.finder.getTr(target, '', 'selected').removeClass('datagrid-row-selected');
		if (opts.idField){
			for(var index=0; index<rows.length; index++){
				removeArrayItem(selectedRows, opts.idField, rows[index][opts.idField]);
			}
		}
		opts.onUnselectAll.call(target, rows);
	}
	
	/**
	 * check a row, the row index start with 0
	 */
	function checkRow(target, index, notSelect){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		if (!notSelect && opts.selectOnCheck){
			selectRow(target, index, true);	// don't check the row again
		}
		var ck = opts.finder.getTr(target, index).find('div.datagrid-cell-check input[type=checkbox]');
		ck._propAttr('checked', true);
		ck = opts.finder.getTr(target, '', 'checked');
		if (ck.length == state.data.rows.length){
			var dc = state.dc;
			var header = dc.header1.add(dc.header2);
			header.find('input[type=checkbox]')._propAttr('checked', true);
		}
		var row = opts.finder.getRow(target, index);
		if (opts.idField){
			addArrayItem(state.checkedRows, opts.idField, row);
		}
		opts.onCheck.call(target, index, row);
	}
	/**
	 * uncheck a row
	 */
	function uncheckRow(target, index, notSelect){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		if (!notSelect && opts.selectOnCheck){
			unselectRow(target, index, true);	// don't uncheck the row again
		}
		var ck = opts.finder.getTr(target, index).find('div.datagrid-cell-check input[type=checkbox]');
		ck._propAttr('checked', false);
		var dc = state.dc;
		var header = dc.header1.add(dc.header2);
		header.find('input[type=checkbox]')._propAttr('checked', false);
		var row = opts.finder.getRow(target, index);
		if (opts.idField){
			removeArrayItem(state.checkedRows, opts.idField, row[opts.idField]);
		}
		opts.onUncheck.call(target, index, row);
	}
	/**
	 * check all checkbox on current page
	 */
	function checkAll(target, notSelect){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var rows = state.data.rows;
		if (!notSelect && opts.selectOnCheck){
			selectAll(target, true);	// don't check rows again
		}
		var dc = state.dc;
		var hck = dc.header1.add(dc.header2).find('input[type=checkbox]');
		var bck = opts.finder.getTr(target, '', 'allbody').find('div.datagrid-cell-check input[type=checkbox]');
		hck.add(bck)._propAttr('checked', true);
		if (opts.idField){
			for(var i=0; i<rows.length; i++){
				addArrayItem(state.checkedRows, opts.idField, rows[i]);
			}
		}
		opts.onCheckAll.call(target, rows);
	}
	/**
	 * uncheck all checkbox on current page
	 */
	function uncheckAll(target, notSelect){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var rows = state.data.rows;
		if (!notSelect && opts.selectOnCheck){
			unselectAll(target, true);	// don't uncheck rows again
		}
		var dc = state.dc;
		var hck = dc.header1.add(dc.header2).find('input[type=checkbox]');
		var bck = opts.finder.getTr(target, '', 'allbody').find('div.datagrid-cell-check input[type=checkbox]');
		hck.add(bck)._propAttr('checked', false);
		if (opts.idField){
			for(var i=0; i<rows.length; i++){
				removeArrayItem(state.checkedRows, opts.idField, rows[i][opts.idField]);
			}
		}
		opts.onUncheckAll.call(target, rows);
	}
	
	
	/**
	 * Begin edit a row
	 */
	function beginEdit(target, index){
		var opts = $.data(target, 'datagrid').options;
		var tr = opts.finder.getTr(target, index);
		var row = opts.finder.getRow(target, index);
		if (tr.hasClass('datagrid-row-editing')) return;
		if (opts.onBeforeEdit.call(target, index, row) == false) return;
		
		tr.addClass('datagrid-row-editing');
		createEditor(target, index);
		fixEditableSize(target);
		
		tr.find('div.datagrid-editable').each(function(){
			var field = $(this).parent().attr('field');
			var ed = $.data(this, 'datagrid.editor');
			ed.actions.setValue(ed.target, row[field]);
		});
		validateRow(target, index);	// validate the row data
	}
	
	/**
	 * Stop edit a row.
	 * index: the row index.
	 * cancel: if true, restore the row data.
	 */
	function endEdit(target, index, cancel){
		var opts = $.data(target, 'datagrid').options;
		var updatedRows = $.data(target, 'datagrid').updatedRows;
		var insertedRows = $.data(target, 'datagrid').insertedRows;
		
		var tr = opts.finder.getTr(target, index);
		var row = opts.finder.getRow(target, index);
		if (!tr.hasClass('datagrid-row-editing')) {
			return;
		}
		
		if (!cancel){
			if (!validateRow(target, index)) return;	// invalid row data
			
			var changed = false;
			var changes = {};
			tr.find('div.datagrid-editable').each(function(){
				var field = $(this).parent().attr('field');
				var ed = $.data(this, 'datagrid.editor');
				var value = ed.actions.getValue(ed.target);
				if (row[field] != value){
					row[field] = value;
					changed = true;
					changes[field] = value;
				}
			});
			if (changed){
				if (indexOfArray(insertedRows, row) == -1){
					if (indexOfArray(updatedRows, row) == -1){
						updatedRows.push(row);
					}
				}
			}
		}
		
		tr.removeClass('datagrid-row-editing');
		
		destroyEditor(target, index);
		$(target).datagrid('refreshRow', index);
		
		if (!cancel){
			opts.onAfterEdit.call(target, index, row, changes);
		} else {
			opts.onCancelEdit.call(target, index, row);
		}
	}
	
	/**
	 * get the specified row editors
	 */
	function getEditors(target, index){
		var opts = $.data(target, 'datagrid').options;
		var tr = opts.finder.getTr(target, index);
		var editors = [];
		tr.children('td').each(function(){
			var cell = $(this).find('div.datagrid-editable');
			if (cell.length){
				var ed = $.data(cell[0], 'datagrid.editor');
				editors.push(ed);
			}
		});
		return editors;
	}
	
	/**
	 * get the cell editor
	 * param contains two parameters: index and field
	 */
	function getEditor(target, param){
		var editors = getEditors(target, param.index);
		for(var i=0; i<editors.length; i++){
			if (editors[i].field == param.field){
				return editors[i];
			}
		}
		return null;
	}
	
	/**
	 * create the row editor and adjust the row height.
	 */
	function createEditor(target, index){
		var opts = $.data(target, 'datagrid').options;
		var tr = opts.finder.getTr(target, index);
		tr.children('td').each(function(){
			var cell = $(this).find('div.datagrid-cell');
			var field = $(this).attr('field');
			
			var col = getColumnOption(target, field);
			if (col && col.editor){
				// get edit type and options
				var edittype,editoptions;
				if (typeof col.editor == 'string'){
					edittype = col.editor;
				} else {
					edittype = col.editor.type;
					editoptions = col.editor.options;
				}
				
				// get the specified editor
				var editor = opts.editors[edittype];
				if (editor){
					var oldHtml = cell.html();
					var width = cell._outerWidth();
					cell.addClass('datagrid-editable');
					cell._outerWidth(width);
					cell.html('<table border="0" cellspacing="0" cellpadding="1"><tr><td></td></tr></table>');
//					cell.children('table').attr('align', col.align);
					cell.children('table').bind('click dblclick contextmenu',function(e){
						e.stopPropagation();
					});
					$.data(cell[0], 'datagrid.editor', {
						actions: editor,
						target: editor.init(cell.find('td'), editoptions),
						field: field,
						type: edittype,
						oldHtml: oldHtml
					});
				}
			}
		});
		fixRowHeight(target, index, true);
	}
	
	/**
	 * destroy the row editor and restore the row height.
	 */
	function destroyEditor(target, index){
		var opts = $.data(target, 'datagrid').options;
		var tr = opts.finder.getTr(target, index);
		tr.children('td').each(function(){
			var cell = $(this).find('div.datagrid-editable');
			if (cell.length){
				var ed = $.data(cell[0], 'datagrid.editor');
				if (ed.actions.destroy) {
					ed.actions.destroy(ed.target);
				}
				cell.html(ed.oldHtml);
				$.removeData(cell[0], 'datagrid.editor');
				
				cell.removeClass('datagrid-editable');
				cell.css('width','');
			}
		});
	}
	
	/**
	 * Validate while editing, if valid return true.
	 */
	function validateRow(target, index){
		var tr = $.data(target, 'datagrid').options.finder.getTr(target, index);
		if (!tr.hasClass('datagrid-row-editing')){
			return true;
		}
		
		var vbox = tr.find('.validatebox-text');
		vbox.validatebox('validate');
		vbox.trigger('mouseleave');
		var invalidbox = tr.find('.validatebox-invalid');
		return invalidbox.length == 0;
	}
	
	/**
	 * Get changed rows, if state parameter is not assigned, return all changed.
	 * state: inserted,deleted,updated
	 */
	function getChanges(target, state){
		var insertedRows = $.data(target, 'datagrid').insertedRows;
		var deletedRows = $.data(target, 'datagrid').deletedRows;
		var updatedRows = $.data(target, 'datagrid').updatedRows;
		
		if (!state){
			var rows = [];
			rows = rows.concat(insertedRows);
			rows = rows.concat(deletedRows);
			rows = rows.concat(updatedRows);
			return rows;
		} else if (state == 'inserted'){
			return insertedRows;
		} else if (state == 'deleted'){
			return deletedRows;
		} else if (state == 'updated'){
			return updatedRows;
		}
		
		return [];
	}
	
	function deleteRow(target, index){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var data = state.data;
		var insertedRows = state.insertedRows;
		var deletedRows = state.deletedRows;
		
		$(target).datagrid('cancelEdit', index);
		
		var row = data.rows[index];
		if (indexOfArray(insertedRows, row) >= 0){
			removeArrayItem(insertedRows, row);
		} else {
			deletedRows.push(row);
		}
		removeArrayItem(state.selectedRows, opts.idField, data.rows[index][opts.idField]);
		removeArrayItem(state.checkedRows, opts.idField, data.rows[index][opts.idField]);
		
		opts.view.deleteRow.call(opts.view, target, index);
		if (opts.height == 'auto'){
			fixRowHeight(target);	// adjust the row height
		}
		$(target).datagrid('getPager').pagination('refresh', {total:data.total});
	}
	
	function insertRow(target, param){
		var data = $.data(target, 'datagrid').data;
		var view = $.data(target, 'datagrid').options.view;
		var insertedRows = $.data(target, 'datagrid').insertedRows;
		view.insertRow.call(view, target, param.index, param.row);
//		bindRowEvents(target);
		insertedRows.push(param.row);
		$(target).datagrid('getPager').pagination('refresh', {total:data.total});
	}
	
	function appendRow(target, row){
		var data = $.data(target, 'datagrid').data;
		var view = $.data(target, 'datagrid').options.view;
		var insertedRows = $.data(target, 'datagrid').insertedRows;
		view.insertRow.call(view, target, null, row);
		insertedRows.push(row);
		$(target).datagrid('getPager').pagination('refresh', {total:data.total});
	}
	
	function initChanges(target){
		var state = $.data(target, 'datagrid');
		var data = state.data;
		var rows = data.rows;
		var originalRows = [];
		for(var i=0; i<rows.length; i++){
			originalRows.push($.extend({}, rows[i]));
		}
		state.originalRows = originalRows;
		state.updatedRows = [];
		state.insertedRows = [];
		state.deletedRows = [];
	}
	
	function acceptChanges(target){
		var data = $.data(target, 'datagrid').data;
		var ok = true;
		for(var i=0,len=data.rows.length; i<len; i++){
			if (validateRow(target, i)){
				endEdit(target, i, false);
			} else {
				ok = false;
			}
		}
		if (ok){
			initChanges(target);
		}
	}
	
	function rejectChanges(target){
		var state = $.data(target, 'datagrid');
		var opts = state.options;
		var originalRows = state.originalRows;
		var insertedRows = state.insertedRows;
		var deletedRows = state.deletedRows;
		var selectedRows = state.selectedRows;
		var checkedRows = state.checkedRows;
		var data = state.data;
		
		function getIds(a){
			var ids = [];
			for(var i=0; i<a.length; i++){
				ids.push(a[i][opts.idField]);
			}
			return ids;
		}
		function doSelect(ids, action){
			for(var i=0; i<ids.length; i++){
				var index = getRowIndex(target, ids[i]);
				if (index >= 0){
					(action=='s'?selectRow:checkRow)(target, index, true);
				}
			}
		}
		
		for(var i=0; i<data.rows.length; i++){endEdit(target, i, true);}
		
		var selectedIds = getIds(selectedRows);
		var checkedIds = getIds(checkedRows);
		selectedRows.splice(0, selectedRows.length);
		checkedRows.splice(0, checkedRows.length);
		
		data.total += deletedRows.length - insertedRows.length;
		data.rows = originalRows;
		loadData(target, data);
		
		doSelect(selectedIds, 's');
		doSelect(checkedIds, 'c');
		
		initChanges(target);
	}
	
	/**
	 * request remote data
	 */
	function request(target, params){
		var opts = $.data(target, 'datagrid').options;
		
		if (params) opts.queryParams = params;
		
		var param = $.extend({}, opts.queryParams);
		if (opts.pagination){
			$.extend(param, {
				page: opts.pageNumber,
				rows: opts.pageSize
			});
		}
		if (opts.sortName){
			$.extend(param, {
				sort: opts.sortName,
				order: opts.sortOrder
			});
		}
		
		if (opts.onBeforeLoad.call(target, param) == false) return;
		
		$(target).datagrid('loading');
		setTimeout(function(){
			doRequest();
		}, 0);
		
		function doRequest(){
			var result = opts.loader.call(target, param, function(data){
				setTimeout(function(){
					$(target).datagrid('loaded');
				}, 0);
				loadData(target, data);
				setTimeout(function(){
					initChanges(target);
				}, 0);
			}, function(){
				setTimeout(function(){
					$(target).datagrid('loaded');
				}, 0);
				opts.onLoadError.apply(target, arguments);
			});
			if (result == false){
				$(target).datagrid('loaded');
			}
		}
	}
	
	function mergeCells(target, param){
		var opts = $.data(target, 'datagrid').options;
		
		param.rowspan = param.rowspan || 1;
		param.colspan = param.colspan || 1;
		
		if (param.rowspan == 1 && param.colspan == 1) return;
		
		var tr = opts.finder.getTr(target, (param.index!=undefined ? param.index : param.id));
		if (!tr.length){return;}
		var row = opts.finder.getRow(target, tr);
		var value = row[param.field];	// the cell value
		
		var td = tr.find('td[field="'+param.field+'"]');
		td.attr('rowspan', param.rowspan).attr('colspan', param.colspan);
		td.addClass('datagrid-td-merged');
		
		for(var i=1; i<param.colspan; i++){
			td = td.next();
			td.hide();
			row[td.attr('field')] = value;
		}
		for(var i=1; i<param.rowspan; i++){
			tr = tr.next();
			if (!tr.length){break;}
			var row = opts.finder.getRow(target, tr);
			var td = tr.find('td[field="'+param.field+'"]').hide();
			row[td.attr('field')] = value;
			for(var j=1; j<param.colspan; j++){
				td = td.next();
				td.hide();
				row[td.attr('field')] = value;
			}
		}
		
		fixMergedSize(target);
	}
	
	$.fn.datagrid = function(options, param){
		if (typeof options == 'string'){
			return $.fn.datagrid.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'datagrid');
			var opts;
			if (state) {
				opts = $.extend(state.options, options);
				state.options = opts;
			} else {
				opts = $.extend({}, $.extend({},$.fn.datagrid.defaults,{queryParams:{}}), $.fn.datagrid.parseOptions(this), options);
				$(this).css('width', '').css('height', '');
				
				var wrapResult = wrapGrid(this, opts.rownumbers);
				if (!opts.columns) opts.columns = wrapResult.columns;
				if (!opts.frozenColumns) opts.frozenColumns = wrapResult.frozenColumns;
				opts.columns = $.extend(true, [], opts.columns);
				opts.frozenColumns = $.extend(true, [], opts.frozenColumns);
				opts.view = $.extend({}, opts.view);
				$.data(this, 'datagrid', {
					options: opts,
					panel: wrapResult.panel,
					dc: wrapResult.dc,
					ss: wrapResult.ss,
					selectedRows: [],
					checkedRows: [],
					data: {total:0,rows:[]},
					originalRows: [],
					updatedRows: [],
					insertedRows: [],
					deletedRows: []
				});
			}
			
			buildGrid(this);
			
			if (opts.data){
				loadData(this, opts.data);
				initChanges(this);
			} else {
				var data = $.fn.datagrid.parseData(this);
				if (data.total > 0){
					loadData(this, data);
					initChanges(this);
				}
			}
			
			setSize(this);
			request(this);
			bindEvents(this);
		});
	};
	
	var editors = {
		text: {
			init: function(container, options){
				var input = $('<input type="text" class="datagrid-editable-input">').appendTo(container);
				return input;
			},
			getValue: function(target){
				return $(target).val();
			},
			setValue: function(target, value){
				$(target).val(value);
			},
			resize: function(target, width){
				$(target)._outerWidth(width);
			}
		},
		textarea: {
			init: function(container, options){
				var input = $('<textarea class="datagrid-editable-input"></textarea>').appendTo(container);
				return input;
			},
			getValue: function(target){
				return $(target).val();
			},
			setValue: function(target, value){
				$(target).val(value);
			},
			resize: function(target, width){
				$(target)._outerWidth(width);
			}
		},
		checkbox: {
			init: function(container, options){
				var input = $('<input type="checkbox">').appendTo(container);
				input.val(options.on);
				input.attr('offval', options.off);
				return input;
			},
			getValue: function(target){
				if ($(target).is(':checked')){
					return $(target).val();
				} else {
					return $(target).attr('offval');
				}
			},
			setValue: function(target, value){
				var checked = false;
				if ($(target).val() == value){
					checked = true;
				}
				$(target)._propAttr('checked', checked);
			}
		},
		numberbox: {
			init: function(container, options){
				var input = $('<input type="text" class="datagrid-editable-input">').appendTo(container);
				input.numberbox(options);
				return input;
			},
			destroy: function(target){
				$(target).numberbox('destroy');
			},
			getValue: function(target){
				$(target).blur();
				return $(target).numberbox('getValue');
			},
			setValue: function(target, value){
				$(target).numberbox('setValue', value);
			},
			resize: function(target, width){
				$(target)._outerWidth(width);
			}
		},
		validatebox: {
			init: function(container, options){
				var input = $('<input type="text" class="datagrid-editable-input">').appendTo(container);
				input.validatebox(options);
				return input;
			},
			destroy: function(target){
				$(target).validatebox('destroy');
			},
			getValue: function(target){
				return $(target).val();
			},
			setValue: function(target, value){
				$(target).val(value);
			},
			resize: function(target, width){
				$(target)._outerWidth(width);
			}
		},
		datebox: {
			init: function(container, options){
				var input = $('<input type="text">').appendTo(container);
				input.datebox(options);
				return input;
			},
			destroy: function(target){
				$(target).datebox('destroy');
			},
			getValue: function(target){
				return $(target).datebox('getValue');
			},
			setValue: function(target, value){
				$(target).datebox('setValue', value);
			},
			resize: function(target, width){
				$(target).datebox('resize', width);
			}
		},
		combobox: {
			init: function(container, options){
				var combo = $('<input type="text">').appendTo(container);
				combo.combobox(options || {});
				return combo;
			},
			destroy: function(target){
				$(target).combobox('destroy');
			},
			getValue: function(target){
				return $(target).combobox('getValue');
			},
			setValue: function(target, value){
				$(target).combobox('setValue', value);
			},
			resize: function(target, width){
				$(target).combobox('resize', width)
			}
		},
		combotree: {
			init: function(container, options){
				var combo = $('<input type="text">').appendTo(container);
				combo.combotree(options);
				return combo;
			},
			destroy: function(target){
				$(target).combotree('destroy');
			},
			getValue: function(target){
				return $(target).combotree('getValue');
			},
			setValue: function(target, value){
				$(target).combotree('setValue', value);
			},
			resize: function(target, width){
				$(target).combotree('resize', width)
			}
		}
	};
	
	$.fn.datagrid.methods = {
		options: function(jq){
			var gopts = $.data(jq[0], 'datagrid').options;
			var popts = $.data(jq[0], 'datagrid').panel.panel('options');
			var opts = $.extend(gopts, {
				width: popts.width,
				height: popts.height,
				closed: popts.closed,
				collapsed: popts.collapsed,
				minimized: popts.minimized,
				maximized: popts.maximized
			});
//			var pager = jq.datagrid('getPager');
//			if (pager.length){
//				var pagerOpts = pager.pagination('options');
//				$.extend(opts, {
//					pageNumber: pagerOpts.pageNumber,
//					pageSize: pagerOpts.pageSize
//				});
//			}
			return opts;
		},
		getPanel: function(jq){
			return $.data(jq[0], 'datagrid').panel;
		},
		getPager: function(jq){
			return $.data(jq[0], 'datagrid').panel.children('div.datagrid-pager');
		},
		getColumnFields: function(jq, frozen){
			return getColumnFields(jq[0], frozen);
		},
		getColumnOption: function(jq, field){
			return getColumnOption(jq[0], field);
		},
		resize: function(jq, param){
			return jq.each(function(){
				setSize(this, param);
			});
		},
		load: function(jq, params){
			return jq.each(function(){
				var opts = $(this).datagrid('options');
				opts.pageNumber = 1;
				var pager = $(this).datagrid('getPager');
				pager.pagination({pageNumber:1});
				request(this, params);
			});
		},
		reload: function(jq, params){
			return jq.each(function(){
				request(this, params);
			});
		},
		reloadFooter: function(jq, footer){
			return jq.each(function(){
				var opts = $.data(this, 'datagrid').options;
				var dc = $.data(this, 'datagrid').dc;
				if (footer){
					$.data(this, 'datagrid').footer = footer;
				}
				if (opts.showFooter){
					opts.view.renderFooter.call(opts.view, this, dc.footer2, false);
					opts.view.renderFooter.call(opts.view, this, dc.footer1, true);
					if (opts.view.onAfterRender){
						opts.view.onAfterRender.call(opts.view, this);
					}
					$(this).datagrid('fixRowHeight');
				}
			});
		},
		loading: function(jq){
			return jq.each(function(){
				var opts = $.data(this, 'datagrid').options;
				$(this).datagrid('getPager').pagination('loading');
				if (opts.loadMsg){
					var panel = $(this).datagrid('getPanel');
					$('<div class="datagrid-mask" style="display:block"></div>').appendTo(panel);
					var msg = $('<div class="datagrid-mask-msg" style="display:block;left:50%"></div>').html(opts.loadMsg).appendTo(panel);
					msg.css('marginLeft', -msg.outerWidth()/2);
				}
			});
		},
		loaded: function(jq){
			return jq.each(function(){
				$(this).datagrid('getPager').pagination('loaded');
				var panel = $(this).datagrid('getPanel');
				panel.children('div.datagrid-mask-msg').remove();
				panel.children('div.datagrid-mask').remove();
			});
		},
		fitColumns: function(jq){
			return jq.each(function(){
				fitColumns(this);
			});
		},
		fixColumnSize: function(jq, field){
			return jq.each(function(){
				fixColumnSize(this, field);
			});
		},
		fixRowHeight: function(jq, index){
			return jq.each(function(){
				fixRowHeight(this, index);
			});
		},
		freezeRow: function(jq, index){
			return jq.each(function(){
				freezeRow(this, index);
			});
		},
		autoSizeColumn: function(jq, field){	// adjusts the column width to fit the contents.
			return jq.each(function(){
				autoSizeColumn(this, field);
			});
		},
		loadData: function(jq, data){
			return jq.each(function(){
				loadData(this, data);
				initChanges(this);
			});
		},
		getData: function(jq){
			return $.data(jq[0], 'datagrid').data;
		},
		getRows: function(jq){
			return $.data(jq[0], 'datagrid').data.rows;
		},
		getFooterRows: function(jq){
			return $.data(jq[0], 'datagrid').footer;
		},
		getRowIndex: function(jq, id){	// id or row record
			return getRowIndex(jq[0], id);
		},
		getChecked: function(jq){
			return getCheckedRows(jq[0]);
		},
		getSelected: function(jq){
			var rows = getSelectedRows(jq[0]);
			return rows.length>0 ? rows[0] : null;
		},
		getSelections: function(jq){
			return getSelectedRows(jq[0]);
		},
		clearSelections: function(jq){
			return jq.each(function(){
				var selectedRows = $.data(this, 'datagrid').selectedRows;
				selectedRows.splice(0, selectedRows.length);
				unselectAll(this);
			});
		},
		clearChecked: function(jq){
			return jq.each(function(){
				var checkedRows = $.data(this, 'datagrid').checkedRows;
				checkedRows.splice(0, checkedRows.length);
				uncheckAll(this);
			});
		},
		scrollTo: function(jq, index){
			return jq.each(function(){
				scrollTo(this, index);
			});
		},
		highlightRow: function(jq, index){
			return jq.each(function(){
				highlightRow(this, index);
				scrollTo(this, index);
			});
		},
		selectAll: function(jq){
			return jq.each(function(){
				selectAll(this);
			});
		},
		unselectAll: function(jq){
			return jq.each(function(){
				unselectAll(this);
			});
		},
		selectRow: function(jq, index){
			return jq.each(function(){
				selectRow(this, index);
			});
		},
		selectRecord: function(jq, id){
			return jq.each(function(){
				var opts = $.data(this, 'datagrid').options;
				if (opts.idField){
					var index = getRowIndex(this, id);
					if (index >= 0){
						$(this).datagrid('selectRow', index);
					}
				}
			});
		},
		unselectRow: function(jq, index){
			return jq.each(function(){
				unselectRow(this, index);
			});
		},
		checkRow: function(jq, index){
			return jq.each(function(){
				checkRow(this, index);
			});
		},
		uncheckRow: function(jq, index){
			return jq.each(function(){
				uncheckRow(this, index);
			});
		},
		checkAll: function(jq){
			return jq.each(function(){
				checkAll(this);
			});
		},
		uncheckAll: function(jq){
			return jq.each(function(){
				uncheckAll(this);
			});
		},
		beginEdit: function(jq, index){
			return jq.each(function(){
				beginEdit(this, index);
			});
		},
		endEdit: function(jq, index){
			return jq.each(function(){
				endEdit(this, index, false);
			});
		},
		cancelEdit: function(jq, index){
			return jq.each(function(){
				endEdit(this, index, true);
			});
		},
		getEditors: function(jq, index){
			return getEditors(jq[0], index);
		},
		getEditor: function(jq, param){	// param: {index:0, field:'name'}
			return getEditor(jq[0], param);
		},
		refreshRow: function(jq, index){
			return jq.each(function(){
				var opts = $.data(this, 'datagrid').options;
				opts.view.refreshRow.call(opts.view, this, index);
			});
		},
		validateRow: function(jq, index){
			return validateRow(jq[0], index);
		},
		updateRow: function(jq, param){	// param: {index:1,row:{code:'code1',name:'name1'}}
			return jq.each(function(){
				var opts = $.data(this, 'datagrid').options;
				opts.view.updateRow.call(opts.view, this, param.index, param.row);
			});
		},
		appendRow: function(jq, row){
			return jq.each(function(){
				appendRow(this, row);
			});
		},
		insertRow: function(jq, param){
			return jq.each(function(){
				insertRow(this, param);
			});
		},
		deleteRow: function(jq, index){
			return jq.each(function(){
				deleteRow(this, index);
			});
		},
		getChanges: function(jq, state){
			return getChanges(jq[0], state);	// state: inserted,deleted,updated
		},
		acceptChanges: function(jq){
			return jq.each(function(){
				acceptChanges(this);
			});
		},
		rejectChanges: function(jq){
			return jq.each(function(){
				rejectChanges(this);
			});
		},
		mergeCells: function(jq, param){
			return jq.each(function(){
				mergeCells(this, param);
			});
		},
		showColumn: function(jq, field){
			return jq.each(function(){
				var panel = $(this).datagrid('getPanel');
				panel.find('td[field="' + field + '"]').show();
				$(this).datagrid('getColumnOption', field).hidden = false;
				$(this).datagrid('fitColumns');
			});
		},
		hideColumn: function(jq, field){
			return jq.each(function(){
				var panel = $(this).datagrid('getPanel');
				panel.find('td[field="' + field + '"]').hide();
				$(this).datagrid('getColumnOption', field).hidden = true;
				$(this).datagrid('fitColumns');
			});
		}
	};
	
	$.fn.datagrid.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.panel.parseOptions(target), $.parser.parseOptions(target, [
			'url','toolbar','idField','sortName','sortOrder','pagePosition','resizeHandle',
			{fitColumns:'boolean',autoRowHeight:'boolean',striped:'boolean',nowrap:'boolean'},
			{rownumbers:'boolean',singleSelect:'boolean',checkOnSelect:'boolean',selectOnCheck:'boolean'},
			{pagination:'boolean',pageSize:'number',pageNumber:'number'},
			{remoteSort:'boolean',showHeader:'boolean',showFooter:'boolean'},
			{scrollbarSize:'number'}
		]), {
			pageList: (t.attr('pageList') ? eval(t.attr('pageList')) : undefined),
			loadMsg: (t.attr('loadMsg')!=undefined ? t.attr('loadMsg') : undefined),
			rowStyler: (t.attr('rowStyler') ? eval(t.attr('rowStyler')) : undefined)
		});
	};
	
	$.fn.datagrid.parseData = function(target){
		var t = $(target);
		var data = {
			total:0,
			rows:[]
		};
		var fields = t.datagrid('getColumnFields',true).concat(t.datagrid('getColumnFields',false));
		t.find('tbody tr').each(function(){
			data.total++;
			var row = {};
			$.extend(row, $.parser.parseOptions(this,['iconCls','state']));
			for(var i=0; i<fields.length; i++){
				row[fields[i]] = $(this).find('td:eq('+i+')').html();
			}
			data.rows.push(row);
		});
		return data;
	};
	
	var defaultView = {
		render: function(target, container, frozen){
			var state = $.data(target, 'datagrid');
			var opts = state.options;
			var rows = state.data.rows;
			var fields = $(target).datagrid('getColumnFields', frozen);
			
			if (frozen){
				if (!(opts.rownumbers || (opts.frozenColumns && opts.frozenColumns.length))){
					return;
				}
			}
			
			var table = ['<table class="datagrid-btable" cellspacing="0" cellpadding="0" border="0"><tbody>'];
			for(var i=0; i<rows.length; i++) {
				// get the class and style attributes for this row
				var cls = (i % 2 && opts.striped) ? 'class="datagrid-row datagrid-row-alt"' : 'class="datagrid-row"';
				var styleValue = opts.rowStyler ? opts.rowStyler.call(target, i, rows[i]) : '';
				var style = styleValue ? 'style="' + styleValue + '"' : '';
				var rowId = state.rowIdPrefix + '-' + (frozen?1:2) + '-' + i;
				table.push('<tr id="' + rowId + '" datagrid-row-index="' + i + '" ' + cls + ' ' + style + '>');
				table.push(this.renderRow.call(this, target, fields, frozen, i, rows[i]));
				table.push('</tr>');
			}
			table.push('</tbody></table>');
			
			$(container).html(table.join(''));
		},
		
		renderFooter: function(target, container, frozen){
			var opts = $.data(target, 'datagrid').options;
			var rows = $.data(target, 'datagrid').footer || [];
			var fields = $(target).datagrid('getColumnFields', frozen);
			var table = ['<table class="datagrid-ftable" cellspacing="0" cellpadding="0" border="0"><tbody>'];
			
			for(var i=0; i<rows.length; i++){
				table.push('<tr class="datagrid-row" datagrid-row-index="' + i + '">');
				table.push(this.renderRow.call(this, target, fields, frozen, i, rows[i]));
				table.push('</tr>');
			}
			
			table.push('</tbody></table>');
			$(container).html(table.join(''));
		},
		
		renderRow: function(target, fields, frozen, rowIndex, rowData){
			var opts = $.data(target, 'datagrid').options;
			
			var cc = [];
			if (frozen && opts.rownumbers){
				var rownumber = rowIndex + 1;
				if (opts.pagination){
					rownumber += (opts.pageNumber-1)*opts.pageSize;
				}
				cc.push('<td class="datagrid-td-rownumber"><div class="datagrid-cell-rownumber">'+rownumber+'</div></td>');
			}
			for(var i=0; i<fields.length; i++){
				var field = fields[i];
				var col = $(target).datagrid('getColumnOption', field);
				if (col){
					var value = rowData[field];	// the field value
					// get the cell style attribute
					var styleValue = col.styler ? (col.styler(value, rowData, rowIndex)||'') : '';
					var style = col.hidden ? 'style="display:none;' + styleValue + '"' : (styleValue ? 'style="' + styleValue + '"' : '');
					
					cc.push('<td field="' + field + '" ' + style + '>');
					
					if (col.checkbox){
						var style = '';
					} else {
						var style = styleValue;
//						style += 'text-align:' + (col.align || 'left') + ';';
						if (col.align){style += ';text-align:' + col.align + ';'}
						if (!opts.nowrap){
							style += ';white-space:normal;height:auto;';
						} else if (opts.autoRowHeight){
							style += ';height:auto;';
						}
					}
					
					cc.push('<div style="' + style + '" ');
					if (col.checkbox){
						cc.push('class="datagrid-cell-check ');
					} else {
						cc.push('class="datagrid-cell ' + col.cellClass);
					}
					cc.push('">');
					
					if (col.checkbox){
						cc.push('<input type="checkbox" name="' + field + '" value="' + (value!=undefined ? value : '') + '"/>');
					} else if (col.formatter){
						cc.push(col.formatter(value, rowData, rowIndex));
					} else {
						cc.push(value);
					}
					
					cc.push('</div>');
					cc.push('</td>');
				}
			}
			return cc.join('');
		},
		
		refreshRow: function(target, rowIndex){
			this.updateRow.call(this, target, rowIndex, {});
		},
		
		updateRow: function(target, rowIndex, row){
			var opts = $.data(target, 'datagrid').options;
			var rows = $(target).datagrid('getRows');
			$.extend(rows[rowIndex], row);
			var styleValue = opts.rowStyler ? opts.rowStyler.call(target, rowIndex, rows[rowIndex]) : '';
			
			function _update(frozen){
				var fields = $(target).datagrid('getColumnFields', frozen);
				var tr = opts.finder.getTr(target, rowIndex, 'body', (frozen?1:2));
				var checked = tr.find('div.datagrid-cell-check input[type=checkbox]').is(':checked');
				tr.html(this.renderRow.call(this, target, fields, frozen, rowIndex, rows[rowIndex]));
				tr.attr('style', styleValue || '');
				if (checked){
					tr.find('div.datagrid-cell-check input[type=checkbox]')._propAttr('checked', true);
				}
			}
			
			_update.call(this, true);
			_update.call(this, false);
			$(target).datagrid('fixRowHeight', rowIndex);
		},
		
		insertRow: function(target, index, row){
			var state = $.data(target, 'datagrid');
			var opts = state.options;
			var dc = state.dc;
			var data = state.data;
			
			if (index == undefined || index == null) index = data.rows.length;
			if (index > data.rows.length) index = data.rows.length;
			
			function _incIndex(frozen){
				var serno = frozen?1:2;
				for(var i=data.rows.length-1; i>=index; i--){
					var tr = opts.finder.getTr(target, i, 'body', serno);
					tr.attr('datagrid-row-index', i+1);
					tr.attr('id', state.rowIdPrefix + '-' + serno + '-' + (i+1));
					if (frozen && opts.rownumbers){
						var rownumber = i+2;
						if (opts.pagination){
							rownumber += (opts.pageNumber-1)*opts.pageSize;
						}
						tr.find('div.datagrid-cell-rownumber').html(rownumber);
//						tr.find('div.datagrid-cell-rownumber').html(i+2);
					}
				}
			}
			
			function _insert(frozen){
				var serno = frozen?1:2;
				var fields = $(target).datagrid('getColumnFields', frozen);
				var rowId = state.rowIdPrefix + '-' + serno + '-' + index;
				var tr = '<tr id="' + rowId + '" class="datagrid-row" datagrid-row-index="' + index + '"></tr>';
//				var tr = '<tr id="' + rowId + '" class="datagrid-row" datagrid-row-index="' + index + '">' + this.renderRow.call(this, target, fields, frozen, index, row) + '</tr>';
				if (index >= data.rows.length){	// append new row
					if (data.rows.length){	// not empty
						opts.finder.getTr(target, '', 'last', serno).after(tr);
					} else {
						var cc = frozen ? dc.body1 : dc.body2;
						cc.html('<table cellspacing="0" cellpadding="0" border="0"><tbody>' + tr + '</tbody></table>');
					}
				} else {	// insert new row
					opts.finder.getTr(target, index+1, 'body', serno).before(tr);
				}
			}
			
			_incIndex.call(this, true);
			_incIndex.call(this, false);
			_insert.call(this, true);
			_insert.call(this, false);
			
			data.total += 1;
			data.rows.splice(index, 0, row);
			
			this.refreshRow.call(this, target, index);
		},
		
		deleteRow: function(target, index){
			var state = $.data(target, 'datagrid');
			var opts = state.options;
			var data = state.data;
			
			function _decIndex(frozen){
				var serno = frozen?1:2;
				for(var i=index+1; i<data.rows.length; i++){
					var tr = opts.finder.getTr(target, i, 'body', serno);
					tr.attr('datagrid-row-index', i-1);
					tr.attr('id', state.rowIdPrefix + '-' + serno + '-' + (i-1));
					if (frozen && opts.rownumbers){
						var rownumber = i;
						if (opts.pagination){
							rownumber += (opts.pageNumber-1)*opts.pageSize;
						}
						tr.find('div.datagrid-cell-rownumber').html(rownumber);
//						tr.find('div.datagrid-cell-rownumber').html(i);
					}
				}
			}
			
			opts.finder.getTr(target, index).remove();
			_decIndex.call(this, true);
			_decIndex.call(this, false);
			
			data.total -= 1;
			data.rows.splice(index,1);
		},
		
		onBeforeRender: function(target, rows){},
		onAfterRender: function(target){
			var opts = $.data(target, 'datagrid').options;
			if (opts.showFooter){
				var footer = $(target).datagrid('getPanel').find('div.datagrid-footer');
				footer.find('div.datagrid-cell-rownumber,div.datagrid-cell-check').css('visibility', 'hidden');
			}
		}
	};
	
	$.fn.datagrid.defaults = $.extend({}, $.fn.panel.defaults, {
		frozenColumns: undefined,
		columns: undefined,
		fitColumns: false,
		resizeHandle: 'right',	// left,right,both
		autoRowHeight: true,
		toolbar: null,
		striped: false,
		method: 'post',
		nowrap: true,
		idField: null,
		url: null,
		data: null,
		loadMsg: 'Processing, please wait ...',
		rownumbers: false,
		singleSelect: false,
		selectOnCheck: true,
		checkOnSelect: true,
		pagination: false,
		pagePosition: 'bottom',	// top,bottom,both
		pageNumber: 1,
		pageSize: 10,
		pageList: [10,20,30,40,50],
		queryParams: {},
		sortName: null,
		sortOrder: 'asc',
		remoteSort: true,
		showHeader: true,
		showFooter: false,
		scrollbarSize: 18,
		rowStyler: function(rowIndex, rowData){},	// return style such as 'background:red'
		loader: function(param, success, error){
			var opts = $(this).datagrid('options');
			if (!opts.url) return false;
			$.ajax({
				type: opts.method,
				url: opts.url,
				data: param,
				dataType: 'json',
				success: function(data){
					success(data);
				},
				error: function(){
					error.apply(this, arguments);
				}
			});
		},
		loadFilter: function(data){
			if (typeof data.length == 'number' && typeof data.splice == 'function'){	// is array
				return {
					total: data.length,
					rows: data
				};
			} else {
				return data;
			}
		},
		
		editors: editors,
		finder:{
			getTr:function(target, index, type, serno){
				type = type || 'body';
				serno = serno || 0;
				var state = $.data(target, 'datagrid');
				var dc = state.dc;	// data container
				var opts = state.options;
				if (serno == 0){
					var tr1 = opts.finder.getTr(target, index, type, 1);
					var tr2 = opts.finder.getTr(target, index, type, 2);
					return tr1.add(tr2);
				} else {
					if (type == 'body'){
						var tr = $('#' + state.rowIdPrefix + '-' + serno + '-' + index);
						if (!tr.length){
							tr = (serno==1?dc.body1:dc.body2).find('>table>tbody>tr[datagrid-row-index='+index+']');
						}
						return tr;
					} else if (type == 'footer'){
						return (serno==1?dc.footer1:dc.footer2).find('>table>tbody>tr[datagrid-row-index='+index+']');
					} else if (type == 'selected'){
						return (serno==1?dc.body1:dc.body2).find('>table>tbody>tr.datagrid-row-selected');
					} else if (type == 'highlight'){
						return (serno==1?dc.body1:dc.body2).find('>table>tbody>tr.datagrid-row-over');
					} else if (type == 'checked'){
						return (serno==1?dc.body1:dc.body2).find('>table>tbody>tr.datagrid-row:has(div.datagrid-cell-check input:checked)');
					} else if (type == 'last'){
						return (serno==1?dc.body1:dc.body2).find('>table>tbody>tr[datagrid-row-index]:last');
					} else if (type == 'allbody'){
						return (serno==1?dc.body1:dc.body2).find('>table>tbody>tr[datagrid-row-index]');
					} else if (type == 'allfooter'){
						return (serno==1?dc.footer1:dc.footer2).find('>table>tbody>tr[datagrid-row-index]');
					}
				}
			},
			getRow:function(target, p){	// p can be row index or tr object
				var index = (typeof p == 'object') ? p.attr('datagrid-row-index') : p;
				return $.data(target, 'datagrid').data.rows[parseInt(index)];
			}
		},
		view: defaultView,
		
		onBeforeLoad: function(param){},
		onLoadSuccess: function(){},
		onLoadError: function(){},
		onClickRow: function(rowIndex, rowData){},
		onDblClickRow: function(rowIndex, rowData){},
		onClickCell: function(rowIndex, field, value){},
		onDblClickCell: function(rowIndex, field, value){},
		onSortColumn: function(sort, order){},
		onResizeColumn: function(field, width){},
		onSelect: function(rowIndex, rowData){},
		onUnselect: function(rowIndex, rowData){},
		onSelectAll: function(rows){},
		onUnselectAll: function(rows){},
		onCheck: function(rowIndex, rowData){},
		onUncheck: function(rowIndex, rowData){},
		onCheckAll: function(rows){},
		onUncheckAll: function(rows){},
		onBeforeEdit: function(rowIndex, rowData){},
		onAfterEdit: function(rowIndex, rowData, changes){},
		onCancelEdit: function(rowIndex, rowData){},
		onHeaderContextMenu: function(e, field){},
		onRowContextMenu: function(e, rowIndex, rowData){}
	});
})(jQuery);
/**
 * propertygrid - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 * Dependencies:
 * 	 datagrid
 * 
 */
(function($){
	var currTarget;
	
	function buildGrid(target){
		var state = $.data(target, 'propertygrid');
		var opts = $.data(target, 'propertygrid').options;
		$(target).datagrid($.extend({}, opts, {
			cls:'propertygrid',
			view:(opts.showGroup ? groupview : undefined),
			onClickRow:function(index, row){
				if (currTarget != this){
//					leaveCurrRow();
					stopEditing(currTarget);
					currTarget = this;
				}
				if (opts.editIndex != index && row.editor){
					var col = $(this).datagrid('getColumnOption', "value");
					col.editor = row.editor;
//					leaveCurrRow();
					stopEditing(currTarget);
					$(this).datagrid('beginEdit', index);
					$(this).datagrid('getEditors', index)[0].target.focus();
					opts.editIndex = index;
				}
				opts.onClickRow.call(target, index, row);
			},
			loadFilter:function(data){
				stopEditing(this);
				return opts.loadFilter.call(this, data);
			},
			onLoadSuccess:function(data){
//				$(target).datagrid('getPanel').find('div.datagrid-group').css('border','');
				$(target).datagrid('getPanel').find('div.datagrid-group').attr('style','');
				opts.onLoadSuccess.call(target,data);
			}
		}));
		$(document).unbind('.propertygrid').bind('mousedown.propertygrid', function(e){
			var p = $(e.target).closest('div.datagrid-view,div.combo-panel');
//			var p = $(e.target).closest('div.propertygrid,div.combo-panel');
			if (p.length){return;}
			stopEditing(currTarget);
			currTarget = undefined;
		});
		
//		function leaveCurrRow(){
//			var t = $(currTarget);
//			if (!t.length){return;}
//			var opts = $.data(currTarget, 'propertygrid').options;
//			var index = opts.editIndex;
//			if (index == undefined){return;}
//			var ed = t.datagrid('getEditors', index)[0];
//			if (ed){
//				ed.target.blur();
//				if (t.datagrid('validateRow', index)){
//					t.datagrid('endEdit', index);
//				} else {
//					t.datagrid('cancelEdit', index);
//				}
//			}
//			opts.editIndex = undefined;
//		}
	}
	
	function stopEditing(target){
		var t = $(target);
		if (!t.length){return}
		var opts = $.data(target, 'propertygrid').options;
		var index = opts.editIndex;
		if (index == undefined){return;}
		var ed = t.datagrid('getEditors', index)[0];
		if (ed){
			ed.target.blur();
			if (t.datagrid('validateRow', index)){
				t.datagrid('endEdit', index);
			} else {
				t.datagrid('cancelEdit', index);
			}
		}
		opts.editIndex = undefined;
	}
	
	$.fn.propertygrid = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.propertygrid.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.datagrid(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'propertygrid');
			if (state){
				$.extend(state.options, options);
			} else {
				var opts = $.extend({}, $.fn.propertygrid.defaults, $.fn.propertygrid.parseOptions(this), options);
				opts.frozenColumns = $.extend(true, [], opts.frozenColumns);
				opts.columns = $.extend(true, [], opts.columns);
				$.data(this, 'propertygrid', {
					options: opts
				});
			}
			buildGrid(this);
		});
	}
	
	$.fn.propertygrid.methods = {
		options: function(jq){
			return $.data(jq[0], 'propertygrid').options;
		}
	};
	
	$.fn.propertygrid.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.datagrid.parseOptions(target), $.parser.parseOptions(target,[{showGroup:'boolean'}]));
	};
	
	// the group view definition
	var groupview = $.extend({}, $.fn.datagrid.defaults.view, {
		render: function(target, container, frozen){
			var state = $.data(target, 'datagrid');
			var opts = state.options;
			var rows = state.data.rows;
			var fields = $(target).datagrid('getColumnFields', frozen);
			
			var table = [];
			var index = 0;
			var groups = this.groups;
			for(var i=0; i<groups.length; i++){
				var group = groups[i];
				
				table.push('<div class="datagrid-group" group-index=' + i + ' style="height:25px;overflow:hidden;border-bottom:1px solid #ccc;">');
				table.push('<table cellspacing="0" cellpadding="0" border="0" style="height:100%"><tbody>');
				table.push('<tr>');
				table.push('<td style="border:0;">');
				if (!frozen){
					table.push('<span style="color:#666;font-weight:bold;">');
					table.push(opts.groupFormatter.call(target, group.fvalue, group.rows));
					table.push('</span>');
				}
				table.push('</td>');
				table.push('</tr>');
				table.push('</tbody></table>');
				table.push('</div>');
				
				table.push('<table class="datagrid-btable" cellspacing="0" cellpadding="0" border="0"><tbody>');
				for(var j=0; j<group.rows.length; j++) {
					// get the class and style attributes for this row
					var cls = (index % 2 && opts.striped) ? 'class="datagrid-row datagrid-row-alt"' : 'class="datagrid-row"';
					var styleValue = opts.rowStyler ? opts.rowStyler.call(target, index, group.rows[j]) : '';
					var style = styleValue ? 'style="' + styleValue + '"' : '';
					var rowId = state.rowIdPrefix + '-' + (frozen?1:2) + '-' + index;
					table.push('<tr id="' + rowId + '" datagrid-row-index="' + index + '" ' + cls + ' ' + style + '>');
					table.push(this.renderRow.call(this, target, fields, frozen, index, group.rows[j]));
					table.push('</tr>');
					index++;
				}
				table.push('</tbody></table>');
			}
			
			$(container).html(table.join(''));
		},
		
		onAfterRender: function(target){
			var opts = $.data(target, 'datagrid').options;
			var dc = $.data(target, 'datagrid').dc;
			var view = dc.view;
			var view1 = dc.view1;
			var view2 = dc.view2;
			
			$.fn.datagrid.defaults.view.onAfterRender.call(this, target);
			
			if (opts.rownumbers || opts.frozenColumns.length){
				var group = view1.find('div.datagrid-group');
			} else {
				var group = view2.find('div.datagrid-group');
			}
			$('<td style="border:0;text-align:center;width:25px"><span class="datagrid-row-expander datagrid-row-collapse" style="display:inline-block;width:16px;height:16px;cursor:pointer">&nbsp;</span></td>').insertBefore(group.find('td'));
			
			view.find('div.datagrid-group').each(function(){
				var groupIndex = $(this).attr('group-index');
				$(this).find('span.datagrid-row-expander').bind('click', {groupIndex:groupIndex}, function(e){
					if ($(this).hasClass('datagrid-row-collapse')){
						$(target).datagrid('collapseGroup', e.data.groupIndex);
					} else {
						$(target).datagrid('expandGroup', e.data.groupIndex);
					}
				});
			});
		},
		
		onBeforeRender: function(target, rows){
			var opts = $.data(target, 'datagrid').options;
			var groups = [];
			for(var i=0; i<rows.length; i++){
				var row = rows[i];
				var group = getGroup(row[opts.groupField]);
				if (!group){
					group = {
						fvalue: row[opts.groupField],
						rows: [row],
						startRow: i
					};
					groups.push(group);
				} else {
					group.rows.push(row);
				}
			}
			
			function getGroup(fvalue){
				for(var i=0; i<groups.length; i++){
					var group = groups[i];
					if (group.fvalue == fvalue){
						return group;
					}
				}
				return null;
			}
			
			this.groups = groups;
			
			var newRows = [];
			for(var i=0; i<groups.length; i++){
				var group = groups[i];
				for(var j=0; j<group.rows.length; j++){
					newRows.push(group.rows[j]);
				}
			}
			$.data(target, 'datagrid').data.rows = newRows;
		}
	});

	$.extend($.fn.datagrid.methods, {
	    expandGroup:function(jq, groupIndex){
	        return jq.each(function(){
	            var view = $.data(this, 'datagrid').dc.view;
	            if (groupIndex!=undefined){
	                var group = view.find('div.datagrid-group[group-index="'+groupIndex+'"]');
	            } else {
	                var group = view.find('div.datagrid-group');
	            }
	            var expander = group.find('span.datagrid-row-expander');
	            if (expander.hasClass('datagrid-row-expand')){
	                expander.removeClass('datagrid-row-expand').addClass('datagrid-row-collapse');
	                group.next('table').show();
	            }
	            $(this).datagrid('fixRowHeight');
	        });
	    },
	    collapseGroup:function(jq, groupIndex){
	        return jq.each(function(){
	            var view = $.data(this, 'datagrid').dc.view;
	            if (groupIndex!=undefined){
	                var group = view.find('div.datagrid-group[group-index="'+groupIndex+'"]');
	            } else {
	                var group = view.find('div.datagrid-group');
	            }
	            var expander = group.find('span.datagrid-row-expander');
	            if (expander.hasClass('datagrid-row-collapse')){
	                expander.removeClass('datagrid-row-collapse').addClass('datagrid-row-expand');
	                group.next('table').hide();
	            }
	            $(this).datagrid('fixRowHeight');
	        });
	    }
	});
	// end of group view definition
	
	$.fn.propertygrid.defaults = $.extend({}, $.fn.datagrid.defaults, {
		singleSelect:true,
		remoteSort:false,
		fitColumns:true,
		loadMsg:'',
		frozenColumns:[[
		    {field:'f',width:16,resizable:false}
		]],
		columns:[[
		    {field:'name',title:'Name',width:100,sortable:true},
		    {field:'value',title:'Value',width:100,resizable:false}
		]],
		
		showGroup:false,
		groupField:'group',
		groupFormatter:function(fvalue,rows){return fvalue}
	});
})(jQuery);
/**
 * treegrid - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 * Dependencies:
 * 	 datagrid
 * 
 */
(function($){
	/**
	 * Get the index of array item, return -1 when the item is not found.
	 */
//	function indexOfArray(a,o){
//		for(var i=0,len=a.length; i<len; i++){
//			if (a[i] == o) return i;
//		}
//		return -1;
//	}
	/**
	 * Remove array item, 'o' parameter can be item object or id field name.
	 * When 'o' parameter is the id field name, the 'id' parameter is valid.
	 */
//	function removeArrayItem(a,o){
//		var index = indexOfArray(a,o);
//		if (index != -1){
//			a.splice(index, 1);
//		}
//	}
	
	function buildGrid(target){
		var state = $.data(target, 'treegrid')
		var opts = state.options;
		$(target).datagrid($.extend({}, opts, {
			url: null,
			data: null,
			loader: function(){
				return false;
			},
			onBeforeLoad: function(){},
			onLoadSuccess: function(){},
			onResizeColumn: function(field, width){
				setRowHeight(target);
				opts.onResizeColumn.call(target, field, width);
			},
			onSortColumn: function(sort,order){
				opts.sortName = sort;
				opts.sortOrder = order;
				if (opts.remoteSort){
					request(target);
				} else {
					var data = $(target).treegrid('getData');
					loadData(target, 0, data);
				}
				opts.onSortColumn.call(target, sort, order);
			},
			onBeforeEdit: function(index, row){
				if (opts.onBeforeEdit.call(target, row) == false) return false;
			},
			onAfterEdit:function(index,row,changes){
				opts.onAfterEdit.call(target, row, changes);
			},
			onCancelEdit:function(index,row){
				opts.onCancelEdit.call(target, row);
			},
			onSelect:function(index){
				opts.onSelect.call(target, find(target, index));
			},
			onUnselect:function(index){
				opts.onUnselect.call(target, find(target, index));
			},
			onSelectAll:function(){
				opts.onSelectAll.call(target, $.data(target, 'treegrid').data);
			},
			onUnselectAll:function(){
				opts.onUnselectAll.call(target, $.data(target, 'treegrid').data);
			},
			onCheck:function(index){
				opts.onCheck.call(target, find(target, index));
			},
			onUncheck:function(index){
				opts.onUncheck.call(target, find(target, index));
			},
			onCheckAll:function(){
				opts.onCheckAll.call(target, $.data(target, 'treegrid').data);
			},
			onUncheckAll:function(){
				opts.onUncheckAll.call(target, $.data(target, 'treegrid').data);
			},
			onClickRow:function(index){
				opts.onClickRow.call(target, find(target, index));
			},
			onDblClickRow:function(index){
				opts.onDblClickRow.call(target, find(target, index));
			},
			onClickCell:function(index,field){
				opts.onClickCell.call(target, field, find(target, index));
			},
			onDblClickCell:function(index,field){
				opts.onDblClickCell.call(target, field, find(target, index));
			},
			onRowContextMenu:function(e,index){
				opts.onContextMenu.call(target, e, find(target, index));
			}
		}));
		if (!opts.columns){
			var dgOpts = $.data(target, 'datagrid').options;
			opts.columns = dgOpts.columns;
			opts.frozenColumns = dgOpts.frozenColumns;
		}
		state.dc = $.data(target, 'datagrid').dc;
		if (opts.pagination){
			var pager = $(target).datagrid('getPager');
			pager.pagination({
				pageNumber:opts.pageNumber,
				pageSize:opts.pageSize,
				pageList:opts.pageList,
				onSelectPage: function(pageNum, pageSize){
					// save the page state
					opts.pageNumber = pageNum;
					opts.pageSize = pageSize;
					
					request(target);	// request new page data
				}
			});
			opts.pageSize = pager.pagination('options').pageSize;	// repare the pageSize value
		}
	}
	
	function setRowHeight(target, idValue){
		var opts = $.data(target, 'datagrid').options;
		var dc = $.data(target, 'datagrid').dc;
		if (!dc.body1.is(':empty') && (!opts.nowrap || opts.autoRowHeight)){
			if (idValue != undefined){
				var children = getChildren(target, idValue);
				for(var i=0; i<children.length; i++){
					setHeight(children[i][opts.idField]);
				}
			}
		}
		$(target).datagrid('fixRowHeight', idValue);
		
		function setHeight(idValue){
			var tr1 = opts.finder.getTr(target, idValue, 'body', 1);
			var tr2 = opts.finder.getTr(target, idValue, 'body', 2);
			tr1.css('height', '');
			tr2.css('height', '');
			var height = Math.max(tr1.height(), tr2.height());
			tr1.css('height', height);
			tr2.css('height', height);
		}
	}
	
	function setRowNumbers(target){
		var dc = $.data(target, 'datagrid').dc;
		var opts = $.data(target, 'treegrid').options;
		if (!opts.rownumbers) return;
		dc.body1.find('div.datagrid-cell-rownumber').each(function(i){
			$(this).html(i+1);
		});
	}
	
	function bindEvents(target){
		var dc = $.data(target, 'datagrid').dc;
		
		var body = dc.body1.add(dc.body2);
		var clickHandler = ($.data(body[0],'events')||$._data(body[0],'events')).click[0].handler;
//		var clickHandler = dc.body1.add(dc.body2).data('events').click[0].handler;
		dc.body1.add(dc.body2).bind('mouseover', function(e){
			var tt = $(e.target);
			var tr = tt.closest('tr.datagrid-row');
			if (!tr.length){return;}
			if (tt.hasClass('tree-hit')){
				tt.hasClass('tree-expanded') ? tt.addClass('tree-expanded-hover') : tt.addClass('tree-collapsed-hover');
			}
			e.stopPropagation();
		}).bind('mouseout', function(e){
			var tt = $(e.target);
			var tr = tt.closest('tr.datagrid-row');
			if (!tr.length){return;}
			if (tt.hasClass('tree-hit')){
				tt.hasClass('tree-expanded') ? tt.removeClass('tree-expanded-hover') : tt.removeClass('tree-collapsed-hover');
			}
			e.stopPropagation();
		}).unbind('click').bind('click', function(e){
			var tt = $(e.target);
			var tr = tt.closest('tr.datagrid-row');
			if (!tr.length){return;}
			if (tt.hasClass('tree-hit')){
				toggle(target, tr.attr('node-id'));
			} else {
				clickHandler(e);
			}
			e.stopPropagation();
		});
	}
	
	/**
	 * create sub tree
	 * parentId: the node id value
	 */
	function createSubTree(target, parentId){
		var opts = $.data(target, 'treegrid').options;
		var tr1 = opts.finder.getTr(target, parentId, 'body', 1);
		var tr2 = opts.finder.getTr(target, parentId, 'body', 2);
		var colspan1 = $(target).datagrid('getColumnFields', true).length + (opts.rownumbers?1:0);
		var colspan2 = $(target).datagrid('getColumnFields', false).length;

		_create(tr1, colspan1);
		_create(tr2, colspan2);
		
		function _create(tr, colspan){
			$('<tr class="treegrid-tr-tree">' +
					'<td style="border:0px" colspan="' + colspan + '">' +
					'<div></div>' +
					'</td>' +
				'</tr>').insertAfter(tr);
		}
	}
	
	/**
	 * load data to specified node.
	 */
	function loadData(target, parentId, data, append){
		var state = $.data(target, 'treegrid');
		var opts = state.options;
		var dc = state.dc;
		data = opts.loadFilter.call(target, data, parentId);
		
		var node = find(target, parentId);
		if (node){
			var node1 = opts.finder.getTr(target, parentId, 'body', 1);
			var node2 = opts.finder.getTr(target, parentId, 'body', 2);
			var cc1 = node1.next('tr.treegrid-tr-tree').children('td').children('div');
			var cc2 = node2.next('tr.treegrid-tr-tree').children('td').children('div');
			if (!append){node.children = [];}
		} else {
			var cc1 = dc.body1;
			var cc2 = dc.body2;
			if (!append){state.data = [];}
		}
		if (!append){
//			state.data = [];
			cc1.empty();
			cc2.empty();
		}
		
		if (opts.view.onBeforeRender){
			opts.view.onBeforeRender.call(opts.view, target, parentId, data);
		}
		opts.view.render.call(opts.view, target, cc1, true);
		opts.view.render.call(opts.view, target, cc2, false);
		if (opts.showFooter){
			opts.view.renderFooter.call(opts.view, target, dc.footer1, true);
			opts.view.renderFooter.call(opts.view, target, dc.footer2, false);
		}
		if (opts.view.onAfterRender){
			opts.view.onAfterRender.call(opts.view, target);
		}
		
		opts.onLoadSuccess.call(target, node, data);
		
		// reset the pagination
		if (!parentId && opts.pagination){
			var total = $.data(target, 'treegrid').total;
			var pager = $(target).datagrid('getPager');
			if (pager.pagination('options').total != total){
				pager.pagination({total:total});
			}
		}
		
		setRowHeight(target);
		setRowNumbers(target);
		$(target).treegrid('autoSizeColumn');
	}
	
	function request(target, parentId, params, append, callback){
		var opts = $.data(target, 'treegrid').options;
		var body = $(target).datagrid('getPanel').find('div.datagrid-body');
		
		if (params) opts.queryParams = params;
		var param = $.extend({}, opts.queryParams);
		if (opts.pagination){
			$.extend(param, {
				page: opts.pageNumber,
				rows: opts.pageSize
			});
		}
		if (opts.sortName){
			$.extend(param, {
				sort: opts.sortName,
				order: opts.sortOrder
			});
		}
		
		var row = find(target, parentId);
		
		if (opts.onBeforeLoad.call(target, row, param) == false) return;
//		if (!opts.url) return;
		
		var folder = body.find('tr[node-id=' + parentId + '] span.tree-folder');
		folder.addClass('tree-loading');
		$(target).treegrid('loading');
		var result = opts.loader.call(target, param, function(data){
			folder.removeClass('tree-loading');
			$(target).treegrid('loaded');
			loadData(target, parentId, data, append);
			if (callback) {
				callback();
			}
		}, function(){
			folder.removeClass('tree-loading');
			$(target).treegrid('loaded');
			opts.onLoadError.apply(target, arguments);
			if (callback){
				callback();
			}
		});
		if (result == false){
			folder.removeClass('tree-loading');
			$(target).treegrid('loaded');
		}
	}
	
	function getRoot(target){
		var rows = getRoots(target);
		if (rows.length){
			return rows[0];
		} else {
			return null;
		}
	}
	
	function getRoots(target){
		return $.data(target, 'treegrid').data;
	}
	
	function getParent(target, idValue){
		var row = find(target, idValue);
		if (row._parentId){
			return find(target, row._parentId);
		} else {
			return null;
		}
	}
	
	function getChildren(target, parentId){
		var opts = $.data(target, 'treegrid').options;
		var body = $(target).datagrid('getPanel').find('div.datagrid-view2 div.datagrid-body');
		var nodes = [];
		if (parentId){
			getNodes(parentId);
		} else {
			var roots = getRoots(target);
			for(var i=0; i<roots.length; i++){
				nodes.push(roots[i]);
				getNodes(roots[i][opts.idField]);
			}
		}
		
		function getNodes(parentId){
			var pnode = find(target, parentId);
			if (pnode && pnode.children){
				for(var i=0,len=pnode.children.length; i<len; i++){
					var cnode = pnode.children[i];
					nodes.push(cnode);
					getNodes(cnode[opts.idField]);
				}
			}
		}
		
		return nodes;
	}
	
	function getSelected(target){
		var rows = getSelections(target);
		if (rows.length){
			return rows[0];
		} else {
			return null;
		}
	}
	
	function getSelections(target){
		var rows = [];
		var panel = $(target).datagrid('getPanel');
		panel.find('div.datagrid-view2 div.datagrid-body tr.datagrid-row-selected').each(function(){
			var id = $(this).attr('node-id');
			rows.push(find(target, id));
		});
		return rows;
	}
	
	function getLevel(target, idValue){
		if (!idValue) return 0;
		var opts = $.data(target, 'treegrid').options;
		var view = $(target).datagrid('getPanel').children('div.datagrid-view');
		var node = view.find('div.datagrid-body tr[node-id=' + idValue + ']').children('td[field=' + opts.treeField + ']');
		return node.find('span.tree-indent,span.tree-hit').length;
	}
	
	function find(target, idValue){
		var opts = $.data(target, 'treegrid').options;
		var data = $.data(target, 'treegrid').data;
		var cc = [data];
		while(cc.length){
			var c = cc.shift();
			for(var i=0; i<c.length; i++){
				var node = c[i];
				if (node[opts.idField] == idValue){
					return node;
				} else if (node['children']){
					cc.push(node['children']);
				}
			}
		}
		return null;
	}
	
	function collapse(target, idValue){
		var opts = $.data(target, 'treegrid').options;
		var row = find(target, idValue);
		var tr = opts.finder.getTr(target, idValue);
		var hit = tr.find('span.tree-hit');
		
		if (hit.length == 0) return;	// is leaf
		if (hit.hasClass('tree-collapsed')) return;	// has collapsed
		if (opts.onBeforeCollapse.call(target, row) == false) return;
		
		hit.removeClass('tree-expanded tree-expanded-hover').addClass('tree-collapsed');
		hit.next().removeClass('tree-folder-open');
		row.state = 'closed';
		tr = tr.next('tr.treegrid-tr-tree');
		var cc = tr.children('td').children('div');
		if (opts.animate){
			cc.slideUp('normal', function(){
				$(target).treegrid('autoSizeColumn');
				setRowHeight(target, idValue);
				opts.onCollapse.call(target, row);
			});
		} else {
			cc.hide();
			$(target).treegrid('autoSizeColumn');
			setRowHeight(target, idValue);
			opts.onCollapse.call(target, row);
		}
	}
	
	function expand(target, idValue){
		var opts = $.data(target, 'treegrid').options;
		var tr = opts.finder.getTr(target, idValue);
		var hit = tr.find('span.tree-hit');
		var row = find(target, idValue);
		
		if (hit.length == 0) return;	// is leaf
		if (hit.hasClass('tree-expanded')) return;	// has expanded
		if (opts.onBeforeExpand.call(target, row) == false) return;
		
		hit.removeClass('tree-collapsed tree-collapsed-hover').addClass('tree-expanded');
		hit.next().addClass('tree-folder-open');
		var subtree = tr.next('tr.treegrid-tr-tree');
		if (subtree.length){
			var cc = subtree.children('td').children('div');
			_expand(cc);
		} else {
			createSubTree(target, row[opts.idField]);
			var subtree = tr.next('tr.treegrid-tr-tree');
			var cc = subtree.children('td').children('div');
			cc.hide();
			request(target, row[opts.idField], {id:row[opts.idField]}, true, function(){
				if (cc.is(':empty')){
					subtree.remove();
				} else {
					_expand(cc);
				}
//				_expand(cc);
			});
		}
		
		function _expand(cc){
			row.state = 'open';
			if (opts.animate){
				cc.slideDown('normal', function(){
					$(target).treegrid('autoSizeColumn');
					setRowHeight(target, idValue);
					opts.onExpand.call(target, row);
				});
			} else {
				cc.show();
				$(target).treegrid('autoSizeColumn');
				setRowHeight(target, idValue);
				opts.onExpand.call(target, row);
			}
		}
	}
	
	function toggle(target, idValue){
		var opts = $.data(target, 'treegrid').options;
		var tr = opts.finder.getTr(target, idValue);
		var hit = tr.find('span.tree-hit');
		if (hit.hasClass('tree-expanded')){
			collapse(target, idValue);
		} else {
			expand(target, idValue);
		}
	}
	
	function collapseAll(target, idValue){
		var opts = $.data(target, 'treegrid').options;
		var nodes = getChildren(target, idValue);
		if (idValue){
			nodes.unshift(find(target, idValue));
		}
		for(var i=0; i<nodes.length; i++){
			collapse(target, nodes[i][opts.idField]);
		}
	}
	
	function expandAll(target, idValue){
		var opts = $.data(target, 'treegrid').options;
		var nodes = getChildren(target, idValue);
		if (idValue){
			nodes.unshift(find(target, idValue));
		}
		for(var i=0; i<nodes.length; i++){
			expand(target, nodes[i][opts.idField]);
		}
	}
	
	function expandTo(target, idValue){
		var opts = $.data(target, 'treegrid').options;
		var ids = [];
		var p = getParent(target, idValue);
		while(p){
			var id = p[opts.idField];
			ids.unshift(id);
			p = getParent(target, id);
		}
		for(var i=0; i<ids.length; i++){
			expand(target, ids[i]);
		}
	}
	
	function append(target, param){
		var opts = $.data(target, 'treegrid').options;
		if (param.parent){
			var tr = opts.finder.getTr(target, param.parent);
			if (tr.next('tr.treegrid-tr-tree').length == 0){
				createSubTree(target, param.parent);
			}
			var cell = tr.children('td[field=' + opts.treeField + ']').children('div.datagrid-cell');
			var nodeIcon = cell.children('span.tree-icon');
			if (nodeIcon.hasClass('tree-file')){
				nodeIcon.removeClass('tree-file').addClass('tree-folder tree-folder-open');
//				nodeIcon.removeClass('tree-file').addClass('tree-folder');
				var hit = $('<span class="tree-hit tree-expanded"></span>').insertBefore(nodeIcon);
				if (hit.prev().length){
					hit.prev().remove();
				}
			}
		}
		loadData(target, param.parent, param.data, true);
	}
	
	function insert(target, param){
		var ref = param.before || param.after;
		var opts = $.data(target, 'treegrid').options;
		var pnode = getParent(target, ref);
		append(target, {
			parent: (pnode?pnode[opts.idField]:null),
			data: [param.data]
		});
		_move(true);
		_move(false);
		setRowNumbers(target);
		
		function _move(frozen){
			var serno = frozen?1:2;
			var tr = opts.finder.getTr(target, param.data[opts.idField], 'body', serno);
			var table = tr.closest('table.datagrid-btable');
			tr = tr.parent().children();
			var dest = opts.finder.getTr(target, ref, 'body', serno);
			if (param.before){
				tr.insertBefore(dest);
			} else {
				var sub = dest.next('tr.treegrid-tr-tree');
				tr.insertAfter(sub.length?sub:dest);
			}
			table.remove();
		}
	}
	
	/**
	 * remove the specified node
	 */
	function remove(target, idValue){
		var opts = $.data(target, 'treegrid').options;
		var tr = opts.finder.getTr(target, idValue);
		tr.next('tr.treegrid-tr-tree').remove();
		tr.remove();
		
		var pnode = del(idValue);
		if (pnode){
			if (pnode.children.length == 0){
				tr = opts.finder.getTr(target, pnode[opts.idField]);
				tr.next('tr.treegrid-tr-tree').remove();
				var cell = tr.children('td[field=' + opts.treeField + ']').children('div.datagrid-cell');
				cell.find('.tree-icon').removeClass('tree-folder').addClass('tree-file');
				cell.find('.tree-hit').remove();
				$('<span class="tree-indent"></span>').prependTo(cell);
			}
		}
		
		setRowNumbers(target);
		
		/**
		 * delete the specified node, return its parent node
		 */
		function del(id){
			var cc;
			var pnode = getParent(target, idValue);
			if (pnode){
				cc = pnode.children;
			} else {
				cc = $(target).treegrid('getData');
			}
			for(var i=0; i<cc.length; i++){
				if (cc[i][opts.idField] == id){
					cc.splice(i, 1);
					break;
				}
			}
			return pnode;
		}
	}
	
	
	$.fn.treegrid = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.treegrid.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.datagrid(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'treegrid');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'treegrid', {
					options: $.extend({}, $.fn.treegrid.defaults, $.fn.treegrid.parseOptions(this), options),
					data:[]
				});
			}
			
			buildGrid(this);
			
			if (state.options.data){
				$(this).treegrid('loadData', state.options.data);
			}
			
			request(this);
			bindEvents(this);
		});
	};
	
	$.fn.treegrid.methods = {
		options: function(jq){
			return $.data(jq[0], 'treegrid').options;
		},
		resize: function(jq, param){
			return jq.each(function(){
				$(this).datagrid('resize', param);
			});
		},
		fixRowHeight: function(jq, idValue){
			return jq.each(function(){
				setRowHeight(this, idValue);
			});
		},
		loadData: function(jq, data){
			return jq.each(function(){
				loadData(this, data.parent, data);
//				loadData(this, null, data);
			});
		},
		reload: function(jq, id){
			return jq.each(function(){
				if (id){
					var node = $(this).treegrid('find', id);
					if (node.children){
						node.children.splice(0, node.children.length);
					}
					var body = $(this).datagrid('getPanel').find('div.datagrid-body');
					var tr = body.find('tr[node-id=' + id + ']');
					tr.next('tr.treegrid-tr-tree').remove();
					var hit = tr.find('span.tree-hit');
					hit.removeClass('tree-expanded tree-expanded-hover').addClass('tree-collapsed');
					expand(this, id);
				} else {
					request(this, null, {});
//					request(this);
				}
			});
		},
		reloadFooter: function(jq, footer){
			return jq.each(function(){
				var opts = $.data(this, 'treegrid').options;
				var dc = $.data(this, 'datagrid').dc;
				if (footer){
					$.data(this, 'treegrid').footer = footer;
				}
				if (opts.showFooter){
					opts.view.renderFooter.call(opts.view, this, dc.footer1, true);
					opts.view.renderFooter.call(opts.view, this, dc.footer2, false);
					if (opts.view.onAfterRender){
						opts.view.onAfterRender.call(opts.view, this);
					}
					$(this).treegrid('fixRowHeight');
				}
			});
		},
		getData: function(jq){
			return $.data(jq[0], 'treegrid').data;
		},
		getFooterRows: function(jq){
			return $.data(jq[0], 'treegrid').footer;
		},
		getRoot: function(jq){
			return getRoot(jq[0]);
		},
		getRoots: function(jq){
			return getRoots(jq[0]);
		},
		getParent: function(jq, id){
			return getParent(jq[0], id);
		},
		getChildren: function(jq, id){
			return getChildren(jq[0], id);
		},
		getSelected: function(jq){
			return getSelected(jq[0]);
		},
		getSelections: function(jq){
			return getSelections(jq[0]);
		},
		getLevel: function(jq, id){
			return getLevel(jq[0], id);
		},
		find: function(jq, id){
			return find(jq[0], id);
		},
		isLeaf: function(jq, id){
			var opts = $.data(jq[0], 'treegrid').options;
			var tr = opts.finder.getTr(jq[0], id);
			var hit = tr.find('span.tree-hit');
			return hit.length == 0;
		},
		select: function(jq, id){
			return jq.each(function(){
				$(this).datagrid('selectRow', id);
			});
		},
		unselect: function(jq, id){
			return jq.each(function(){
				$(this).datagrid('unselectRow', id);
			});
		},
		collapse: function(jq, id){
			return jq.each(function(){
				collapse(this, id);
			});
		},
		expand: function(jq, id){
			return jq.each(function(){
				expand(this, id);
			});
		},
		toggle: function(jq, id){
			return jq.each(function(){
				toggle(this, id);
			});
		},
		collapseAll: function(jq, id){
			return jq.each(function(){
				collapseAll(this, id);
			});
		},
		expandAll: function(jq, id){
			return jq.each(function(){
				expandAll(this, id);
			});
		},
		expandTo: function(jq, id){
			return jq.each(function(){
				expandTo(this, id);
			});
		},
		append: function(jq, param){
			return jq.each(function(){
				append(this, param);
			});
		},
		insert: function(jq, param){
			return jq.each(function(){
				insert(this, param);
			});
		},
		remove: function(jq, id){
			return jq.each(function(){
				remove(this, id);
			});
		},
		pop: function(jq, id){
			var row = jq.treegrid('find', id);
			jq.treegrid('remove', id);
			return row;
		},
		refresh: function(jq, id){
			return jq.each(function(){
				var opts = $.data(this, 'treegrid').options;
				opts.view.refreshRow.call(opts.view, this, id);
			});
		},
		update: function(jq, param){
			return jq.each(function(){
				var opts = $.data(this, 'treegrid').options;
				opts.view.updateRow.call(opts.view, this, param.id, param.row);
			});
		},
		beginEdit: function(jq, id){
			return jq.each(function(){
				$(this).datagrid('beginEdit', id);
				$(this).treegrid('fixRowHeight', id);
			});
		},
		endEdit: function(jq, id){
			return jq.each(function(){
				$(this).datagrid('endEdit', id);
			});
		},
		cancelEdit: function(jq, id){
			return jq.each(function(){
				$(this).datagrid('cancelEdit', id);
			});
		}
	};
	
	$.fn.treegrid.parseOptions = function(target){
		return $.extend({}, $.fn.datagrid.parseOptions(target), $.parser.parseOptions(target,['treeField',{animate:'boolean'}]));
	};
	
	var defaultView = $.extend({}, $.fn.datagrid.defaults.view, {
		render: function(target, container, frozen){
			var opts = $.data(target, 'treegrid').options;
			var fields = $(target).datagrid('getColumnFields', frozen);
			var rowIdPrefix = $.data(target, 'datagrid').rowIdPrefix;
			
			if (frozen){
				if (!(opts.rownumbers || (opts.frozenColumns && opts.frozenColumns.length))){
					return;
				}
			}
			
			var index = 0;
			var view = this;
			var table = getTreeData(frozen, this.treeLevel, this.treeNodes);
			$(container).append(table.join(''));
			
			function getTreeData(frozen, depth, children){
				var table = ['<table class="datagrid-btable" cellspacing="0" cellpadding="0" border="0"><tbody>'];
				for(var i=0; i<children.length; i++){
					var row = children[i];
					if (row.state != 'open' && row.state != 'closed'){
						row.state = 'open';
					}
					
					var cls = (index++ % 2 && opts.striped) ? 'class="datagrid-row datagrid-row-alt"' : 'class="datagrid-row"';
					var styleValue = opts.rowStyler ? opts.rowStyler.call(target, row) : '';
					var style = styleValue ? 'style="' + styleValue + '"' : '';
					var rowId = rowIdPrefix + '-' + (frozen?1:2) + '-' + row[opts.idField];
					table.push('<tr id="' + rowId + '" node-id="' + row[opts.idField] + '" ' + cls + ' ' + style + '>');
					table = table.concat(view.renderRow.call(view, target, fields, frozen, depth, row));
					table.push('</tr>');
					
					if (row.children && row.children.length){
						var tt = getTreeData(frozen, depth+1, row.children);
						var v = row.state == 'closed' ? 'none' : 'block';
						
						table.push('<tr class="treegrid-tr-tree"><td style="border:0px" colspan=' + (fields.length + (opts.rownumbers?1:0)) + '><div style="display:' + v + '">');
						table = table.concat(tt);
						table.push('</div></td></tr>');
					}
				}
				table.push('</tbody></table>');
				return table;
			}
		},
		
		renderFooter: function(target, container, frozen){
			var opts = $.data(target, 'treegrid').options;
			var rows = $.data(target, 'treegrid').footer || [];
			var fields = $(target).datagrid('getColumnFields', frozen);
			
			var table = ['<table class="datagrid-ftable" cellspacing="0" cellpadding="0" border="0"><tbody>'];
			
			for(var i=0; i<rows.length; i++){
				var row = rows[i];
				row[opts.idField] = row[opts.idField] || ('foot-row-id'+i);
				
				table.push('<tr class="datagrid-row" node-id=' + row[opts.idField] + '>');
				table.push(this.renderRow.call(this, target, fields, frozen, 0, row));
				table.push('</tr>');
			}
			
			table.push('</tbody></table>');
			$(container).html(table.join(''));
		},
		
		renderRow: function(target, fields, frozen, depth, row){
			var opts = $.data(target, 'treegrid').options;
			
			var cc = [];
			if (frozen && opts.rownumbers){
				cc.push('<td class="datagrid-td-rownumber"><div class="datagrid-cell-rownumber">0</div></td>');
			}
			for(var i=0; i<fields.length; i++){
				var field = fields[i];
				var col = $(target).datagrid('getColumnOption', field);
				if (col){
					// get the cell style attribute
					var styleValue = col.styler ? (col.styler(row[field], row)||'') : '';
					var style = col.hidden ? 'style="display:none;' + styleValue + '"' : (styleValue ? 'style="' + styleValue + '"' : '');
					
					cc.push('<td field="' + field + '" ' + style + '>');
					
					if (col.checkbox){
						var style = '';
					} else {
						var style = styleValue;
						if (col.align){style += ';text-align:' + col.align + ';'}
//						style += 'text-align:' + (col.align || 'left') + ';';
						if (!opts.nowrap){
							style += ';white-space:normal;height:auto;';
						} else if (opts.autoRowHeight){
							style += ';height:auto;';
						}
					}
					
					cc.push('<div style="' + style + '" ');
					if (col.checkbox){
						cc.push('class="datagrid-cell-check ');
					} else {
						cc.push('class="datagrid-cell ' + col.cellClass);
					}
					cc.push('">');
					
					if (col.checkbox){
						if (row.checked){
							cc.push('<input type="checkbox" checked="checked"');
						} else {
							cc.push('<input type="checkbox"');
						}
						cc.push(' name="' + field + '" value="' + (row[field]!=undefined ? row[field] : '') + '"/>');
					} else {
						var val = null;
						if (col.formatter){
							val = col.formatter(row[field], row);
						} else {
							val = row[field];
//							val = row[field] || '&nbsp;';
						}
						if (field == opts.treeField){
							for(var j=0; j<depth; j++){
								cc.push('<span class="tree-indent"></span>');
							}
							if (row.state == 'closed'){
								cc.push('<span class="tree-hit tree-collapsed"></span>');
								cc.push('<span class="tree-icon tree-folder ' + (row.iconCls?row.iconCls:'') + '"></span>');
							} else {
								if (row.children && row.children.length){
									cc.push('<span class="tree-hit tree-expanded"></span>');
									cc.push('<span class="tree-icon tree-folder tree-folder-open ' + (row.iconCls?row.iconCls:'') + '"></span>');
								} else {
									cc.push('<span class="tree-indent"></span>');
									cc.push('<span class="tree-icon tree-file ' + (row.iconCls?row.iconCls:'') + '"></span>');
								}
							}
							cc.push('<span class="tree-title">' + val + '</span>');
						} else {
							cc.push(val);
						}
					}
					
					cc.push('</div>');
					cc.push('</td>');
				}
			}
			return cc.join('');
		},
		
		refreshRow: function(target, id){
			this.updateRow.call(this, target, id, {});
		},
		
		updateRow: function(target, id, row){
			var opts = $.data(target, 'treegrid').options;
			var rowData = $(target).treegrid('find', id);
			$.extend(rowData, row);
			var depth = $(target).treegrid('getLevel', id) - 1;
			var styleValue = opts.rowStyler ? opts.rowStyler.call(target, rowData) : '';
			
			function _update(frozen){
				var fields = $(target).treegrid('getColumnFields', frozen);
				var tr = opts.finder.getTr(target, id, 'body', (frozen?1:2));
				var rownumber = tr.find('div.datagrid-cell-rownumber').html();
				var checked = tr.find('div.datagrid-cell-check input[type=checkbox]').is(':checked');
				tr.html(this.renderRow(target, fields, frozen, depth, rowData));
				tr.attr('style', styleValue || '');
				tr.find('div.datagrid-cell-rownumber').html(rownumber);
				if (checked){
					tr.find('div.datagrid-cell-check input[type=checkbox]')._propAttr('checked', true);
				}
			}
			
			_update.call(this, true);
			_update.call(this, false);
			$(target).treegrid('fixRowHeight', id);
		},
		
		onBeforeRender: function(target, parentId, data){
			if ($.isArray(parentId)){
				data = {total:parentId.length, rows:parentId};
				parentId = null;
			}
			if (!data) return false;
			
			var state = $.data(target, 'treegrid');
			var opts = state.options;
			if (data.length == undefined){
				if (data.footer){
					state.footer = data.footer;
				}
				if (data.total){
					state.total = data.total;
				}
				data = this.transfer(target, parentId, data.rows);
			} else {
				function setParent(children, parentId){
					for(var i=0; i<children.length; i++){
						var row = children[i];
						row._parentId = parentId;
						if (row.children && row.children.length){
							setParent(row.children, row[opts.idField]);
						}
					}
				}
				setParent(data, parentId);
			}
			
			var node = find(target, parentId);
			if (node){
				if (node.children){
					node.children = node.children.concat(data);
				} else {
					node.children = data;
				}
			} else {
				state.data = state.data.concat(data);
			}
			if (!opts.remoteSort){
				this.sort(target, data);
			}
			
			this.treeNodes = data;
			this.treeLevel = $(target).treegrid('getLevel', parentId);
		},
		
		sort: function(target, data){
			var opts = $.data(target, 'treegrid').options;
			var opt = $(target).treegrid('getColumnOption', opts.sortName);
			if (opt){
				var sortFunc = opt.sorter || function(a,b){
					return (a>b?1:-1);
				};
				_sort(data);
			}
			function _sort(rows){
				rows.sort(function(r1,r2){
					return sortFunc(r1[opts.sortName], r2[opts.sortName])*(opts.sortOrder=='asc'?1:-1);
				});
				for(var i=0; i<rows.length; i++){
					var children = rows[i].children;
					if (children && children.length){
						_sort(children);
					}
				}
			}
		},
		
		transfer: function(target, parentId, data){
			var opts = $.data(target, 'treegrid').options;
			
			// clone the original data rows
			var rows = [];
			for(var i=0; i<data.length; i++){
				rows.push(data[i]);
			}
			
			var nodes = [];
			// get the top level nodes
			for(var i=0; i<rows.length; i++){
				var row = rows[i];
				if (!parentId){
					if (!row._parentId){
						nodes.push(row);
//						removeArrayItem(rows,row);
						rows.splice(i, 1);
						i--;
					}
				} else {
					if (row._parentId == parentId){
						nodes.push(row);
//						removeArrayItem(rows,row);
						rows.splice(i, 1);
						i--;
					}
				}
			}
			
			var toDo = [];
			for(var i=0; i<nodes.length; i++){
				toDo.push(nodes[i]);
			}
			while(toDo.length){
				var node = toDo.shift();	// the parent node
				// get the children nodes
				for(var i=0; i<rows.length; i++){
					var row = rows[i];
					if (row._parentId == node[opts.idField]){
						if (node.children){
							node.children.push(row);
						} else {
							node.children = [row];
						}
						toDo.push(row);
//						removeArrayItem(rows,row);
						rows.splice(i, 1);
						i--;
					}
				}
			}
			return nodes;
		}
	});
	
	$.fn.treegrid.defaults = $.extend({}, $.fn.datagrid.defaults, {
		treeField:null,
		animate: false,
		singleSelect: true,
		view: defaultView,
		loader: function(param, success, error){
			var opts = $(this).treegrid('options');
			if (!opts.url) return false;
			$.ajax({
				type: opts.method,
				url: opts.url,
				data: param,
				dataType: 'json',
				success: function(data){
					success(data);
				},
				error: function(){
					error.apply(this, arguments);
				}
			});
		},
		loadFilter: function(data, parentId){
			return data;
		},
		finder:{
			getTr:function(target, id, type, serno){
				type = type || 'body';
				serno = serno || 0;
				var dc = $.data(target, 'datagrid').dc;	// data container
				if (serno == 0){
					var opts = $.data(target, 'treegrid').options;
					var tr1 = opts.finder.getTr(target, id, type, 1);
					var tr2 = opts.finder.getTr(target, id, type, 2);
					return tr1.add(tr2);
				} else {
					if (type == 'body'){
						var tr = $('#' + $.data(target, 'datagrid').rowIdPrefix + '-' + serno + '-' + id);
						if (!tr.length){
							tr = (serno==1?dc.body1:dc.body2).find('tr[node-id='+id+']');
						}
						return tr;
					} else if (type == 'footer'){
						return (serno==1?dc.footer1:dc.footer2).find('tr[node-id='+id+']');
					} else if (type == 'selected'){
						return (serno==1?dc.body1:dc.body2).find('tr.datagrid-row-selected');
					} else if (type == 'highlight'){
						return (serno==1?dc.body1:dc.body2).find('tr.datagrid-row-over');
					} else if (type == 'checked'){
						return (serno==1?dc.body1:dc.body2).find('tr.datagrid-row:has(div.datagrid-cell-check input:checked)');
					} else if (type == 'last'){
						return (serno==1?dc.body1:dc.body2).find('tr:last[node-id]');
					} else if (type == 'allbody'){
						return (serno==1?dc.body1:dc.body2).find('tr[node-id]');
					} else if (type == 'allfooter'){
						return (serno==1?dc.footer1:dc.footer2).find('tr[node-id]');
					}
				}
			},
			getRow:function(target, p){	// p can be the row id or tr object
				var id = (typeof p == 'object') ? p.attr('node-id') : p;
				return $(target).treegrid('find', id);
			}
		},
		
		onBeforeLoad: function(row, param){},
		onLoadSuccess: function(row, data){},
		onLoadError: function(){},
		onBeforeCollapse: function(row){},
		onCollapse: function(row){},
		onBeforeExpand: function(row){},
		onExpand: function(row){},
		onClickRow: function(row){},
		onDblClickRow: function(row){},
		onClickCell: function(field, row){},
		onDblClickCell: function(field, row){},
		onContextMenu: function(e, row){},
		onBeforeEdit: function(row){},
		onAfterEdit: function(row, changes){},
		onCancelEdit: function(row){}
	});
})(jQuery);
/**
 * combo - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 * Dependencies:
 *   panel
 *   validatebox
 * 
 */
(function($){
	function setSize(target, width){
		var opts = $.data(target, 'combo').options;
		var combo = $.data(target, 'combo').combo;
		var panel = $.data(target, 'combo').panel;
		
		if (width) opts.width = width;
		if (isNaN(opts.width)){
			var c = $(target).clone();
			c.css('visibility','hidden');
			c.appendTo('body');
			opts.width = c.outerWidth();
			c.remove();
		}
		
		combo.appendTo('body');
		
		var input = combo.find('input.combo-text');
		var arrow = combo.find('.combo-arrow');
		var arrowWidth = opts.hasDownArrow ? arrow._outerWidth() : 0;
		
		combo._outerWidth(opts.width)._outerHeight(opts.height);
		input._outerWidth(combo.width() - arrowWidth);
		input.css({
			height: combo.height()+'px',
			lineHeight: combo.height()+'px'
		});
		arrow._outerHeight(combo.height());
		
		panel.panel('resize', {
			width: (opts.panelWidth ? opts.panelWidth : combo.outerWidth()),
			height: opts.panelHeight
		});
		
		combo.insertAfter(target);
	}
	
	/**
	 * create the combo component.
	 */
	function init(target){
		$(target).addClass('combo-f').hide();
		
		var span = $('<span class="combo"></span>').insertAfter(target);
		var input = $('<input type="text" class="combo-text">').appendTo(span);
		$('<span><span class="combo-arrow"></span></span>').appendTo(span);
		$('<input type="hidden" class="combo-value">').appendTo(span);
		var panel = $('<div class="combo-panel"></div>').appendTo('body');
		panel.panel({
			doSize:false,
			closed:true,
			cls:'combo-p',
			style:{
				position:'absolute',
				zIndex:10
			},
			onOpen:function(){
				$(this).panel('resize');
			},
			onClose:function(){
				var state = $.data(target, 'combo');
				if (state){
					state.options.onHidePanel.call(target);
				}
			}
		});
		
		var name = $(target).attr('name');
		if (name){
			span.find('input.combo-value').attr('name', name);
			$(target).removeAttr('name').attr('comboName', name);
		}
		input.attr('autocomplete', 'off');
		
		return {
			combo: span,
			panel: panel
		};
	}
	
	function buildCombo(target){
		var state = $.data(target, 'combo');
		var opts = state.options;
		var combo = state.combo;
		if (opts.hasDownArrow){
			combo.find('.combo-arrow').show();
		} else {
			combo.find('.combo-arrow').hide();
		}
		setDisabled(target, opts.disabled);
		setReadonly(target, opts.readonly);
	}
	
	function destroy(target){
		var state = $.data(target, 'combo');
		var input = state.combo.find('input.combo-text');
		input.validatebox('destroy');
		state.panel.panel('destroy');
		state.combo.remove();
		$(target).remove();
	}
	
	function bindEvents(target){
		var state = $.data(target, 'combo');
		var opts = state.options;
		var panel = state.panel;
		var combo = state.combo;
		var input = combo.find('.combo-text');
		var arrow = combo.find('.combo-arrow');
		
		$(document).unbind('.combo').bind('mousedown.combo', function(e){
			var p = $(e.target).closest('span.combo,div.combo-panel');
			if (p.length){return;}
			$('body>div.combo-p>div.combo-panel:visible').panel('close');
		});
		
//		combo.unbind('.combo');
//		panel.unbind('.combo');
		input.unbind('.combo');
		arrow.unbind('.combo');
		
		if (!opts.disabled && !opts.readonly){
			input.bind('mousedown.combo', function(e){
				$('div.combo-panel').not(panel).panel('close');
				e.stopPropagation();
			}).bind('keydown.combo', function(e){
				switch(e.keyCode){
					case 38:	// up
						opts.keyHandler.up.call(target);
						break;
					case 40:	// down
						opts.keyHandler.down.call(target);
						break;
					case 13:	// enter
						e.preventDefault();
						opts.keyHandler.enter.call(target);
						return false;
					case 9:		// tab
					case 27:	// esc
						hidePanel(target);
						break;
					default:
						if (opts.editable){
							if (state.timer){
								clearTimeout(state.timer);
							}
							state.timer = setTimeout(function(){
								var q = input.val();
								if (state.previousValue != q){
									state.previousValue = q;
									$(target).combo('showPanel');
									opts.keyHandler.query.call(target, input.val());
									validate(target, true);
								}
							}, opts.delay);
						}
				}
			});
			
			arrow.bind('click.combo', function(){
				if (panel.is(':visible')){
					hidePanel(target);
				} else {
					$('div.combo-panel:visible').panel('close');
					$(target).combo('showPanel');
				}
				input.focus();
			}).bind('mouseenter.combo', function(){
				$(this).addClass('combo-arrow-hover');
			}).bind('mouseleave.combo', function(){
				$(this).removeClass('combo-arrow-hover');
			});
		}
	}
	
	/**
	 * show the drop down panel.
	 */
	function showPanel(target){
		var opts = $.data(target, 'combo').options;
		var combo = $.data(target, 'combo').combo;
		var panel = $.data(target, 'combo').panel;
		
		if ($.fn.window){
			panel.panel('panel').css('z-index', $.fn.window.defaults.zIndex++);
		}
		
		panel.panel('move', {
			left:combo.offset().left,
			top:getTop()
		});
		if (panel.panel('options').closed){
			panel.panel('open');
			opts.onShowPanel.call(target);
		}
		
		(function(){
			if (panel.is(':visible')){
				panel.panel('move', {
					left:getLeft(),
					top:getTop()
				});
				setTimeout(arguments.callee, 200);
			}
		})();
		
		function getLeft(){
			var left = combo.offset().left;
			if (left + panel._outerWidth() > $(window)._outerWidth() + $(document).scrollLeft()){
				left = $(window)._outerWidth() + $(document).scrollLeft() - panel._outerWidth();
			}
			if (left < 0){
				left = 0;
			}
			return left;
		}
		function getTop(){
			var top = combo.offset().top + combo._outerHeight();
			if (top + panel._outerHeight() > $(window)._outerHeight() + $(document).scrollTop()){
				top = combo.offset().top - panel._outerHeight();
			}
			if (top < $(document).scrollTop()){
				top = combo.offset().top + combo._outerHeight();
			}
			return top;
		}
	}
	
	/**
	 * hide the drop down panel.
	 */
	function hidePanel(target){
//		var opts = $.data(target, 'combo').options;
		var panel = $.data(target, 'combo').panel;
		panel.panel('close');
//		opts.onHidePanel.call(target);
	}
	
	function validate(target, doit){
		var opts = $.data(target, 'combo').options;
		var input = $.data(target, 'combo').combo.find('input.combo-text');
//		input.validatebox(opts);
		input.validatebox($.extend({}, opts, {
			deltaX: (opts.hasDownArrow ? opts.deltaX : (opts.deltaX>0?1:-1))
		}));
		if (doit){
			input.validatebox('validate');
//			input.trigger('mouseleave');
		}
	}
	
	function setDisabled(target, disabled){
		var state = $.data(target, 'combo');
		var opts = state.options;
		var combo = state.combo;
		if (disabled){
			opts.disabled = true;
			$(target).attr('disabled', true);
			combo.find('.combo-value').attr('disabled', true);
			combo.find('.combo-text').attr('disabled', true);
		} else {
			opts.disabled = false;
			$(target).removeAttr('disabled');
			combo.find('.combo-value').removeAttr('disabled');
			combo.find('.combo-text').removeAttr('disabled');
		}
	}
	
	function setReadonly(target, mode){
		var state = $.data(target, 'combo');
		var opts = state.options;
		opts.readonly = mode==undefined ? true : mode;
		state.combo.find('.combo-text').attr('readonly', opts.readonly ? true : (!opts.editable));
	}
	
	function clear(target){
		var state = $.data(target, 'combo');
		var opts = state.options;
		var combo = state.combo;
		if (opts.multiple){
			combo.find('input.combo-value').remove();
		} else {
			combo.find('input.combo-value').val('');
		}
		combo.find('input.combo-text').val('');
	}
	
	function getText(target){
		var combo = $.data(target, 'combo').combo;
		return combo.find('input.combo-text').val();
	}
	
	function setText(target, text){
		var combo = $.data(target, 'combo').combo;
		combo.find('input.combo-text').val(text);
		validate(target, true);
		$.data(target, 'combo').previousValue = text;
	}
	
	function getValues(target){
		var values = [];
		var combo = $.data(target, 'combo').combo;
		combo.find('input.combo-value').each(function(){
			values.push($(this).val());
		});
		return values;
	}
	
	function setValues(target, values){
		var opts = $.data(target, 'combo').options;
		var oldValues = getValues(target);
		
		var combo = $.data(target, 'combo').combo;
		combo.find('input.combo-value').remove();
		var name = $(target).attr('comboName');
		for(var i=0; i<values.length; i++){
			var input = $('<input type="hidden" class="combo-value">').appendTo(combo);
			if (name) input.attr('name', name);
			input.val(values[i]);
		}
		
		var tmp = [];
		for(var i=0; i<oldValues.length; i++){
			tmp[i] = oldValues[i];
		}
		var aa = [];
		for(var i=0; i<values.length; i++){
			for(var j=0; j<tmp.length; j++){
				if (values[i] == tmp[j]){
					aa.push(values[i]);
					tmp.splice(j, 1);
					break;
				}
			}
		}
		
		if (aa.length != values.length || values.length != oldValues.length){
			if (opts.multiple){
				opts.onChange.call(target, values, oldValues);
			} else {
				opts.onChange.call(target, values[0], oldValues[0]);
			}
		}
	}
	
	function getValue(target){
		var values = getValues(target);
		return values[0];
	}
	
	function setValue(target, value){
		setValues(target, [value]);
	}
	
	/**
	 * set the initialized value
	 */
	function initValue(target){
		var opts = $.data(target, 'combo').options;
		var fn = opts.onChange;
		opts.onChange = function(){};
		if (opts.multiple){
			if (opts.value){
				if (typeof opts.value == 'object'){
					setValues(target, opts.value);
				} else {
					setValue(target, opts.value);
				}
			} else {
				setValues(target, []);
			}
			opts.originalValue = getValues(target);
		} else {
			setValue(target, opts.value);	// set initialize value
			opts.originalValue = opts.value;
		}
		opts.onChange = fn;
	}
	
	$.fn.combo = function(options, param){
		if (typeof options == 'string'){
			return $.fn.combo.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'combo');
			if (state){
				$.extend(state.options, options);
			} else {
				var r = init(this);
				state = $.data(this, 'combo', {
					options: $.extend({}, $.fn.combo.defaults, $.fn.combo.parseOptions(this), options),
					combo: r.combo,
					panel: r.panel,
					previousValue: null
				});
				$(this).removeAttr('disabled');
			}
			buildCombo(this);
			
//			$('input.combo-text', state.combo).attr('readonly', !state.options.editable);
//			setDownArrow(this);
//			setDisabled(this, state.options.disabled);
			
			setSize(this);
			bindEvents(this);
			validate(this);
			initValue(this);
		});
	};
	
	$.fn.combo.methods = {
		options: function(jq){
			return $.data(jq[0], 'combo').options;
		},
		panel: function(jq){
			return $.data(jq[0], 'combo').panel;
		},
		textbox: function(jq){
			return $.data(jq[0], 'combo').combo.find('input.combo-text');
		},
		destroy: function(jq){
			return jq.each(function(){
				destroy(this);
			});
		},
		resize: function(jq, width){
			return jq.each(function(){
				setSize(this, width);
			});
		},
		showPanel: function(jq){
			return jq.each(function(){
				showPanel(this);
			});
		},
		hidePanel: function(jq){
			return jq.each(function(){
				hidePanel(this);
			});
		},
		disable: function(jq){
			return jq.each(function(){
				setDisabled(this, true);
				bindEvents(this);
			});
		},
		enable: function(jq){
			return jq.each(function(){
				setDisabled(this, false);
				bindEvents(this);
			});
		},
		readonly: function(jq, mode){
			return jq.each(function(){
				setReadonly(this, mode);
				bindEvents(this);
			});
		},
		validate: function(jq){
			return jq.each(function(){
				validate(this, true);
			});
		},
		isValid: function(jq){
			var input = $.data(jq[0], 'combo').combo.find('input.combo-text');
			return input.validatebox('isValid');
		},
		clear: function(jq){
			return jq.each(function(){
				clear(this);
			});
		},
		reset: function(jq){
			return jq.each(function(){
				var opts = $.data(this, 'combo').options;
				if (opts.multiple){
					$(this).combo('setValues', opts.originalValue);
				} else {
					$(this).combo('setValue', opts.originalValue);
				}
			});
		},
		getText: function(jq){
			return getText(jq[0]);
		},
		setText: function(jq, text){
			return jq.each(function(){
				setText(this, text);
			});
		},
		getValues: function(jq){
			return getValues(jq[0]);
		},
		setValues: function(jq, values){
			return jq.each(function(){
				setValues(this, values);
			});
		},
		getValue: function(jq){
			return getValue(jq[0]);
		},
		setValue: function(jq, value){
			return jq.each(function(){
				setValue(this, value);
			});
		}
	};
	
	$.fn.combo.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.validatebox.parseOptions(target), $.parser.parseOptions(target, [
			'width','height','separator',
			{panelWidth:'number',editable:'boolean',hasDownArrow:'boolean',delay:'number',selectOnNavigation:'boolean'}
		]), {
			panelHeight: (t.attr('panelHeight')=='auto' ? 'auto' : parseInt(t.attr('panelHeight')) || undefined),
			multiple: (t.attr('multiple') ? true : undefined),
			disabled: (t.attr('disabled') ? true : undefined),
			readonly: (t.attr('readonly') ? true : undefined),
			value: (t.val() || undefined)
		});
	};
	
	// Inherited from $.fn.validatebox.defaults
	$.fn.combo.defaults = $.extend({}, $.fn.validatebox.defaults, {
		width: 'auto',
		height: 22,
		panelWidth: null,
		panelHeight: 200,
		multiple: false,
		selectOnNavigation: true,
		separator: ',',
		editable: true,
		disabled: false,
		readonly: false,
		hasDownArrow: true,
		value: '',
		delay: 200,	// delay to do searching from the last key input event.
		deltaX: 19,
		
		keyHandler: {
			up: function(){},
			down: function(){},
			enter: function(){},
			query: function(q){}
		},
		
		onShowPanel: function(){},
		onHidePanel: function(){},
		onChange: function(newValue, oldValue){}
	});
})(jQuery);
/**
 * combobox - jQuery EasyUI
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
 * 
 */
(function($){
	function findDataItem(data,key,value){
		for(var i=0; i<data.length; i++){
			var item = data[i];
			if (item[key] == value){return item}
		}
		return null;
	}
	
	/**
	 * scroll panel to display the specified item
	 */
	function scrollTo(target, value){
		var panel = $(target).combo('panel');
		var item = panel.find('div.combobox-item[value="' + value + '"]');
		if (item.length){
			if (item.position().top <= 0){
				var h = panel.scrollTop() + item.position().top;
				panel.scrollTop(h);
			} else if (item.position().top + item.outerHeight() > panel.height()){
				var h = panel.scrollTop() + item.position().top + item.outerHeight() - panel.height();
				panel.scrollTop(h);
			}
		}
	}
	
	function nav(target, dir){
		var opts = $(target).combobox('options');
		var panel = $(target).combobox('panel');
		var item = panel.children('div.combobox-item-hover');
		if (!item.length){
			item = panel.children('div.combobox-item-selected');
		}
		item.removeClass('combobox-item-hover');
		if (!item.length){
			item = panel.children('div.combobox-item:visible:' + (dir=='next'?'first':'last'));
		} else {
			if (dir == 'next'){
				item = item.nextAll(':visible:first');
				if (!item.length){
					item = panel.children('div.combobox-item:visible:first');
				}
			} else {
				item = item.prevAll(':visible:first');
				if (!item.length){
					item = panel.children('div.combobox-item:visible:last');
				}
			}
		}
		if (item.length){
			item.addClass('combobox-item-hover');
			scrollTo(target, item.attr('value'));
			if (opts.selectOnNavigation){
				select(target, item.attr('value'));
			}
		}
	}
	
	/**
	 * select the specified value
	 */
	function select(target, value){
		var opts = $.data(target, 'combobox').options;
		var data = $.data(target, 'combobox').data;
		
		if (opts.multiple){
			var values = $(target).combo('getValues');
			for(var i=0; i<values.length; i++){
				if (values[i] == value) return;
			}
			values.push(value);
			setValues(target, values);
		} else {
			setValues(target, [value]);
		}
		
		var item = findDataItem(data, opts.valueField, value);
		if (item){
			opts.onSelect.call(target, item);
		}
	}
	
	/**
	 * unselect the specified value
	 */
	function unselect(target, value){
		var state = $.data(target, 'combobox');
		var opts = state.options;
		var values = $(target).combo('getValues');
		var index = values.indexOf(value+'');
		if (index >= 0){
			values.splice(index, 1);
			setValues(target, values);
		}
		var item = findDataItem(state.data, opts.valueField, value);
		if (item){
			opts.onUnselect.call(target, item);
		}
	}
	
	/**
	 * set values
	 */
	function setValues(target, values, remainText){
		var opts = $.data(target, 'combobox').options;
		var data = $.data(target, 'combobox').data;
		var panel = $(target).combo('panel');
		
		panel.find('div.combobox-item-selected').removeClass('combobox-item-selected');
		var vv = [], ss = [];
		for(var i=0; i<values.length; i++){
			var v = values[i];
			var s = v;
			var item = findDataItem(data, opts.valueField, v);
			if (item){
				s = item[opts.textField];
			}
			vv.push(v);
			ss.push(s);
			panel.find('div.combobox-item[value="' + v + '"]').addClass('combobox-item-selected');
		}
		
		$(target).combo('setValues', vv);
		if (!remainText){
			$(target).combo('setText', ss.join(opts.separator));
		}
	}
	
	/**
	 * load data, the old list items will be removed.
	 */
	function loadData(target, data, remainText){
		var opts = $.data(target, 'combobox').options;
		var panel = $(target).combo('panel');
		
		data = opts.loadFilter.call(target, data);
		$.data(target, 'combobox').data = data;
		
		var selected = $(target).combobox('getValues');
		panel.empty();	// clear old data
		for(var i=0; i<data.length; i++){
			var v = data[i][opts.valueField];
			var s = data[i][opts.textField];
			var item = $('<div class="combobox-item"></div>').appendTo(panel);
			item.attr('value', v);
			if (opts.formatter){
				item.html(opts.formatter.call(target, data[i]));
			} else {
				item.html(s);
			}
			if (data[i]['selected']){
				(function(){
					for(var i=0; i<selected.length; i++){
						if (v == selected[i]) return;
					}
					selected.push(v);
				})();
			}
		}
		if (opts.multiple){
			setValues(target, selected, remainText);
		} else {
			if (selected.length){
				setValues(target, [selected[selected.length-1]], remainText);
			} else {
				setValues(target, [], remainText);
			}
		}
		
		opts.onLoadSuccess.call(target, data);
	}
	
	/**
	 * request remote data if the url property is setted.
	 */
	function request(target, url, param, remainText){
		var opts = $.data(target, 'combobox').options;
		if (url){
			opts.url = url;
		}
//		if (!opts.url) return;
		param = param || {};
		
		if (opts.onBeforeLoad.call(target, param) == false) return;

		opts.loader.call(target, param, function(data){
			loadData(target, data, remainText);
		}, function(){
			opts.onLoadError.apply(this, arguments);
		});
	}
	
	/**
	 * do the query action
	 */
	function doQuery(target, q){
		var opts = $.data(target, 'combobox').options;
		
		if (opts.multiple && !q){
			setValues(target, [], true);
		} else {
			setValues(target, [q], true);
		}
		
		if (opts.mode == 'remote'){
			request(target, null, {q:q}, true);
		} else {
			var panel = $(target).combo('panel');
			panel.find('div.combobox-item').hide();
			var data = $.data(target, 'combobox').data;
			for(var i=0; i<data.length; i++){
				if (opts.filter.call(target, q, data[i])){
					var v = data[i][opts.valueField];
					var s = data[i][opts.textField];
					var item = panel.find('div.combobox-item[value="' + v + '"]');
					item.show();
					if (s == q){
						setValues(target, [v], true);
						item.addClass('combobox-item-selected');
					}
				}
			}
		}
	}
	
	function doEnter(target){
		var t = $(target);
		var panel = t.combobox('panel');
		var opts = t.combobox('options');
		var data = t.combobox('getData');
		var item = panel.children('div.combobox-item-hover');
		if (!item.length){
			item = panel.children('div.combobox-item-selected');
		}
		if (!item.length){return}
		if (opts.multiple){
			if (item.hasClass('combobox-item-selected')){
				t.combobox('unselect', item.attr('value'));
			} else {
				t.combobox('select', item.attr('value'));
			}
		} else {
			t.combobox('select', item.attr('value'));
			t.combobox('hidePanel');
		}
		var vv = [];
		var values = t.combobox('getValues');
		for(var i=0; i<values.length; i++){
			if (findDataItem(data, opts.valueField, values[i])){
				vv.push(values[i]);
			}
		}
		t.combobox('setValues', vv);
	}
	
	/**
	 * create the component
	 */
	function create(target){
		var opts = $.data(target, 'combobox').options;
		$(target).addClass('combobox-f');
		$(target).combo($.extend({}, opts, {
			onShowPanel: function(){
				$(target).combo('panel').find('div.combobox-item').show();
				scrollTo(target, $(target).combobox('getValue'));
				opts.onShowPanel.call(target);
			}
		}));
		
		$(target).combo('panel').unbind().bind('mouseover', function(e){
			$(this).children('div.combobox-item-hover').removeClass('combobox-item-hover');
			$(e.target).closest('div.combobox-item').addClass('combobox-item-hover');
			e.stopPropagation();
		}).bind('mouseout', function(e){
			$(e.target).closest('div.combobox-item').removeClass('combobox-item-hover');
			e.stopPropagation();
		}).bind('click', function(e){
			var item = $(e.target).closest('div.combobox-item');
			if (!item.length){return}
			var value = item.attr('value');
			if (opts.multiple){
				if (item.hasClass('combobox-item-selected')){
					unselect(target, value);
				} else {
					select(target, value);
				}
			} else {
				select(target, value);
				$(target).combo('hidePanel');
			}
			e.stopPropagation();
		});
	}
	
	$.fn.combobox = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.combobox.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.combo(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'combobox');
			if (state){
				$.extend(state.options, options);
				create(this);
			} else {
				state = $.data(this, 'combobox', {
					options: $.extend({}, $.fn.combobox.defaults, $.fn.combobox.parseOptions(this), options)
				});
				create(this);
				loadData(this, $.fn.combobox.parseData(this));
			}
			if (state.options.data){
				loadData(this, state.options.data);
			}
			request(this);
		});
	};
	
	
	$.fn.combobox.methods = {
		options: function(jq){
			var copts = jq.combo('options');
			return $.extend($.data(jq[0], 'combobox').options, {
				originalValue: copts.originalValue,
				disabled: copts.disabled,
				readonly: copts.readonly
			});
		},
		getData: function(jq){
			return $.data(jq[0], 'combobox').data;
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
				$(this).combo('clear');
				var panel = $(this).combo('panel');
				panel.find('div.combobox-item-selected').removeClass('combobox-item-selected');
			});
		},
		reset: function(jq){
			return jq.each(function(){
				var opts = $(this).combobox('options');
				if (opts.multiple){
					$(this).combobox('setValues', opts.originalValue);
				} else {
					$(this).combobox('setValue', opts.originalValue);
				}
			});
		},
		loadData: function(jq, data){
			return jq.each(function(){
				loadData(this, data);
			});
		},
		reload: function(jq, url){
			return jq.each(function(){
				request(this, url);
			});
		},
		select: function(jq, value){
			return jq.each(function(){
				select(this, value);
			});
		},
		unselect: function(jq, value){
			return jq.each(function(){
				unselect(this, value);
			});
		}
	};
	
	$.fn.combobox.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.combo.parseOptions(target), $.parser.parseOptions(target,[
			'valueField','textField','mode','method','url'
		]));
	};
	
	$.fn.combobox.parseData = function(target){
		var data = [];
		var opts = $(target).combobox('options');
		$(target).children('option').each(function(){
			var item = {};
			item[opts.valueField] = $(this).attr('value')!=undefined ? $(this).attr('value') : $(this).html();
			item[opts.textField] = $(this).html();
			item['selected'] = $(this).attr('selected');
			data.push(item);
		});
		return data;
	};
	
	$.fn.combobox.defaults = $.extend({}, $.fn.combo.defaults, {
		valueField: 'value',
		textField: 'text',
		mode: 'local',	// or 'remote'
		method: 'post',
		url: null,
		data: null,
		
		keyHandler: {
			up: function(){nav(this,'prev')},
			down: function(){nav(this,'next')},
			enter: function(){doEnter(this)},
			query: function(q){doQuery(this, q)}
		},
		filter: function(q, row){
			var opts = $(this).combobox('options');
			return row[opts.textField].indexOf(q) == 0;
		},
		formatter: function(row){
			var opts = $(this).combobox('options');
			return row[opts.textField];
		},
		loader: function(param, success, error){
			var opts = $(this).combobox('options');
			if (!opts.url) return false;
			$.ajax({
				type: opts.method,
				url: opts.url,
				data: param,
				dataType: 'json',
				success: function(data){
					success(data);
				},
				error: function(){
					error.apply(this, arguments);
				}
			});
		},
		loadFilter: function(data){
			return data;
		},
		
		onBeforeLoad: function(param){},
		onLoadSuccess: function(){},
		onLoadError: function(){},
		onSelect: function(record){},
		onUnselect: function(record){}
	});
})(jQuery);
/**
 * combotree - jQuery EasyUI
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
 * 	 tree
 * 
 */
(function($){
	/**
	 * create the combotree component.
	 */
	function create(target){
		var opts = $.data(target, 'combotree').options;
		var tree = $.data(target, 'combotree').tree;
		
		$(target).addClass('combotree-f');
		$(target).combo(opts);
		var panel = $(target).combo('panel');
		if (!tree){
			tree = $('<ul></ul>').appendTo(panel);
			$.data(target, 'combotree').tree = tree;
		}
		
		tree.tree($.extend({}, opts, {
			checkbox: opts.multiple,
			onLoadSuccess: function(node, data){
				var values = $(target).combotree('getValues');
				if (opts.multiple){
					var nodes = tree.tree('getChecked');
					for(var i=0; i<nodes.length; i++){
						var id = nodes[i].id;
						(function(){
							for(var i=0; i<values.length; i++){
								if (id == values[i]) return;
							}
							values.push(id);
						})();
					}
				}
				$(target).combotree('setValues', values);
				opts.onLoadSuccess.call(this, node, data);
			},
			onClick: function(node){
				retrieveValues(target);
				$(target).combo('hidePanel');
				opts.onClick.call(this, node);
			},
			onCheck: function(node, checked){
				retrieveValues(target);
				opts.onCheck.call(this, node, checked);
			}
		}));
	}
	
	/**
	 * retrieve values from tree panel.
	 */
	function retrieveValues(target){
		var opts = $.data(target, 'combotree').options;
		var tree = $.data(target, 'combotree').tree;
		var vv = [], ss = [];
		if (opts.multiple){
			var nodes = tree.tree('getChecked');
			for(var i=0; i<nodes.length; i++){
				vv.push(nodes[i].id);
				ss.push(nodes[i].text);
			}
		} else {
			var node = tree.tree('getSelected');
			if (node){
				vv.push(node.id);
				ss.push(node.text);
			}
		}
		$(target).combo('setValues', vv).combo('setText', ss.join(opts.separator));
	}
	
	function setValues(target, values){
		var opts = $.data(target, 'combotree').options;
		var tree = $.data(target, 'combotree').tree;
		tree.find('span.tree-checkbox').addClass('tree-checkbox0').removeClass('tree-checkbox1 tree-checkbox2');
		var vv = [], ss = [];
		for(var i=0; i<values.length; i++){
			var v = values[i];
			var s = v;
			var node = tree.tree('find', v);
			if (node){
				s = node.text;
				tree.tree('check', node.target);
				tree.tree('select', node.target);
			}
			vv.push(v);
			ss.push(s);
		}
		$(target).combo('setValues', vv).combo('setText', ss.join(opts.separator));
	}
	
	$.fn.combotree = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.combotree.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.combo(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'combotree');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'combotree', {
					options: $.extend({}, $.fn.combotree.defaults, $.fn.combotree.parseOptions(this), options)
				});
			}
			create(this);
		});
	};
	
	
	$.fn.combotree.methods = {
		options: function(jq){
			var copts = jq.combo('options');
			return $.extend($.data(jq[0], 'combotree').options, {
				originalValue: copts.originalValue,
				disabled: copts.disabled,
				readonly: copts.readonly
			});
		},
		tree: function(jq){
			return $.data(jq[0], 'combotree').tree;
		},
		loadData: function(jq, data){
			return jq.each(function(){
				var opts = $.data(this, 'combotree').options;
				opts.data = data;
				var tree = $.data(this, 'combotree').tree;
				tree.tree('loadData', data);
			});
		},
		reload: function(jq, url){
			return jq.each(function(){
				var opts = $.data(this, 'combotree').options;
				var tree = $.data(this, 'combotree').tree;
				if (url) opts.url = url;
				tree.tree({url:opts.url});
			});
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
				var tree = $.data(this, 'combotree').tree;
				tree.find('div.tree-node-selected').removeClass('tree-node-selected');
				var cc = tree.tree('getChecked');
				for(var i=0; i<cc.length; i++){
					tree.tree('uncheck', cc[i].target);
				}
				$(this).combo('clear');
			});
		},
		reset: function(jq){
			return jq.each(function(){
				var opts = $(this).combotree('options');
				if (opts.multiple){
					$(this).combotree('setValues', opts.originalValue);
				} else {
					$(this).combotree('setValue', opts.originalValue);
				}
			});
		}
	};
	
	$.fn.combotree.parseOptions = function(target){
		return $.extend({}, $.fn.combo.parseOptions(target), $.fn.tree.parseOptions(target));
	};
	
	$.fn.combotree.defaults = $.extend({}, $.fn.combo.defaults, $.fn.tree.defaults, {
		editable: false
	});
})(jQuery);
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
/**
 * datebox - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 * Dependencies:
 * 	 calendar
 *   combo
 * 
 */
(function($){
	/**
	 * create date box
	 */
	function createBox(target){
		var state = $.data(target, 'datebox');
		var opts = state.options;
		
		$(target).addClass('datebox-f');
		$(target).combo($.extend({}, opts, {
			onShowPanel:function(){
				state.calendar.calendar('resize');
				opts.onShowPanel.call(target);
			}
		}));
		$(target).combo('textbox').parent().addClass('datebox');
		
		/**
		 * if the calendar isn't created, create it.
		 */
		if (!state.calendar){
			createCalendar();
		}
		
		function createCalendar(){
			var panel = $(target).combo('panel');
			state.calendar = $('<div></div>').appendTo(panel).wrap('<div class="datebox-calendar-inner"></div>');
			state.calendar.calendar({
				fit:true,
				border:false,
				onSelect:function(date){
					var value = opts.formatter(date);
					setValue(target, value);
					$(target).combo('hidePanel');
					opts.onSelect.call(target, date);
				}
			});
			setValue(target, opts.value);
			
			var button = $('<div class="datebox-button"></div>').appendTo(panel);
			$('<a href="javascript:void(0)" class="datebox-current"></a>').html(opts.currentText).appendTo(button);
			$('<a href="javascript:void(0)" class="datebox-close"></a>').html(opts.closeText).appendTo(button);
			button.find('.datebox-current,.datebox-close').hover(
					function(){$(this).addClass('datebox-button-hover');},
					function(){$(this).removeClass('datebox-button-hover');}
			);
			button.find('.datebox-current').click(function(){
				state.calendar.calendar({
					year:new Date().getFullYear(),
					month:new Date().getMonth()+1,
					current:new Date()
				});
			});
			button.find('.datebox-close').click(function(){
				$(target).combo('hidePanel');
			});
		}
	}
	
	/**
	 * called when user inputs some value in text box
	 */
	function doQuery(target, q){
		setValue(target, q);
	}
	
	/**
	 * called when user press enter key
	 */
	function doEnter(target){
		var opts = $.data(target, 'datebox').options;
		var c = $.data(target, 'datebox').calendar;
		var value = opts.formatter(c.calendar('options').current);
		setValue(target, value);
		$(target).combo('hidePanel');
	}
	
	function setValue(target, value){
		var state = $.data(target, 'datebox');
		var opts = state.options;
		$(target).combo('setValue', value).combo('setText', value);
		state.calendar.calendar('moveTo', opts.parser(value));
	}
	
	$.fn.datebox = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.datebox.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.combo(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'datebox');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'datebox', {
					options: $.extend({}, $.fn.datebox.defaults, $.fn.datebox.parseOptions(this), options)
				});
			}
			createBox(this);
		});
	};
	
	$.fn.datebox.methods = {
		options: function(jq){
			var copts = jq.combo('options');
			return $.extend($.data(jq[0], 'datebox').options, {
				originalValue: copts.originalValue,
				disabled: copts.disabled,
				readonly: copts.readonly
			});
		},
		calendar: function(jq){	// get the calendar object
			return $.data(jq[0], 'datebox').calendar;
		},
		setValue: function(jq, value){
			return jq.each(function(){
				setValue(this, value);
			});
		},
		reset: function(jq){
			return jq.each(function(){
				var opts = $(this).datebox('options');
				$(this).datebox('setValue', opts.originalValue);
			});
		}
	};
	
	$.fn.datebox.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.combo.parseOptions(target), {
		});
	};
	
	$.fn.datebox.defaults = $.extend({}, $.fn.combo.defaults, {
		panelWidth:180,
		panelHeight:'auto',
		
		keyHandler: {
			up:function(){},
			down:function(){},
			enter:function(){doEnter(this);},
			query:function(q){doQuery(this, q);}
		},
		
		currentText:'Today',
		closeText:'Close',
		okText:'Ok',
		
		formatter:function(date){
			var y = date.getFullYear();
			var m = date.getMonth()+1;
			var d = date.getDate();
			return m+'/'+d+'/'+y;
		},
		parser:function(s){
			var t = Date.parse(s);
			if (!isNaN(t)){
				return new Date(t);
			} else {
				return new Date();
			}
		},
		
		onSelect:function(date){}
	});
})(jQuery);
/**
 * datetimebox - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 * Dependencies:
 * 	 datebox
 *   timespinner
 * 
 */
(function($){
	function createBox(target){
		var state = $.data(target, 'datetimebox');
		var opts = state.options;
		
		$(target).datebox($.extend({}, opts, {
			onShowPanel:function(){
				var value = $(target).datetimebox('getValue');
				setValue(target, value, true);
				opts.onShowPanel.call(target);
			},
			formatter: $.fn.datebox.defaults.formatter,
			parser: $.fn.datebox.defaults.parser
		}));
		$(target).removeClass('datebox-f').addClass('datetimebox-f');
		
		// override the calendar onSelect event, don't close panel when selected
		$(target).datebox('calendar').calendar({
			onSelect:function(date){
				opts.onSelect.call(target, date);
			}
		});
		
		var panel = $(target).datebox('panel');
		if (!state.spinner){
			var p = $('<div style="padding:2px"><input style="width:80px"></div>').insertAfter(panel.children('div.datebox-calendar-inner'));
			state.spinner = p.children('input');
//			state.spinner.timespinner({
//				showSeconds: opts.showSeconds
//			}).bind('mousedown',function(e){
//				e.stopPropagation();
//			});
//			setValue(target, opts.value);
			
			var button = panel.children('div.datebox-button');
			var ok = $('<a href="javascript:void(0)" class="datebox-ok"></a>').html(opts.okText).appendTo(button);
			ok.hover(
				function(){$(this).addClass('datebox-button-hover');},
				function(){$(this).removeClass('datebox-button-hover');}
			).click(function(){
				doEnter(target);
			});
		}
		state.spinner.timespinner({
			showSeconds: opts.showSeconds,
			separator: opts.timeSeparator
		}).unbind('.datetimebox').bind('mousedown.datetimebox',function(e){
			e.stopPropagation();
		});
		setValue(target, opts.value);
	}
	
	/**
	 * get current date, including time
	 */
	function getCurrentDate(target){
		var c = $(target).datetimebox('calendar');
		var t = $(target).datetimebox('spinner');
		var date = c.calendar('options').current;
		return new Date(date.getFullYear(), date.getMonth(), date.getDate(), t.timespinner('getHours'), t.timespinner('getMinutes'), t.timespinner('getSeconds'));
	}
	
	
	/**
	 * called when user inputs some value in text box
	 */
	function doQuery(target, q){
		setValue(target, q, true);
	}
	
	/**
	 * called when user press enter key
	 */
	function doEnter(target){
		var opts = $.data(target, 'datetimebox').options;
		var date = getCurrentDate(target);
		setValue(target, opts.formatter.call(target, date));
		$(target).combo('hidePanel');
	}
	
	/**
	 * set value, if remainText is assigned, don't change the text value
	 */
	function setValue(target, value, remainText){
		var opts = $.data(target, 'datetimebox').options;
		
		$(target).combo('setValue', value);
		if (!remainText){
			if (value){
				var date = opts.parser.call(target, value);
				$(target).combo('setValue', opts.formatter.call(target, date));
				$(target).combo('setText', opts.formatter.call(target, date));
			} else {
				$(target).combo('setText', value);
			}
		}
		var date = opts.parser.call(target, value);
		$(target).datetimebox('calendar').calendar('moveTo', date);
		$(target).datetimebox('spinner').timespinner('setValue', getTimeS(date));
		
		/**
		 * get the time formatted string such as '03:48:02'
		 */
		function getTimeS(date){
			function formatNumber(value){
				return (value < 10 ? '0' : '') + value;
			}
			
			var tt = [formatNumber(date.getHours()), formatNumber(date.getMinutes())];
			if (opts.showSeconds){
				tt.push(formatNumber(date.getSeconds()));
			}
			return tt.join($(target).datetimebox('spinner').timespinner('options').separator);
		}
	}
	
	$.fn.datetimebox = function(options, param){
		if (typeof options == 'string'){
			var method = $.fn.datetimebox.methods[options];
			if (method){
				return method(this, param);
			} else {
				return this.datebox(options, param);
			}
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'datetimebox');
			if (state){
				$.extend(state.options, options);
			} else {
				$.data(this, 'datetimebox', {
					options: $.extend({}, $.fn.datetimebox.defaults, $.fn.datetimebox.parseOptions(this), options)
				});
			}
			createBox(this);
		});
	}
	
	$.fn.datetimebox.methods = {
		options: function(jq){
			var copts = jq.datebox('options');
			return $.extend($.data(jq[0], 'datetimebox').options, {
				originalValue: copts.originalValue,
				disabled: copts.disabled,
				readonly: copts.readonly
			});
		},
		spinner: function(jq){
			return $.data(jq[0], 'datetimebox').spinner;
		},
		setValue: function(jq, value){
			return jq.each(function(){
				setValue(this, value);
			});
		},
		reset: function(jq){
			return jq.each(function(){
				var opts = $(this).datetimebox('options');
				$(this).datetimebox('setValue', opts.originalValue);
			});
		}
	};
	
	$.fn.datetimebox.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.fn.datebox.parseOptions(target), $.parser.parseOptions(target, [
			'timeSeparator',{showSeconds:'boolean'}
		]));
	};
	
	$.fn.datetimebox.defaults = $.extend({}, $.fn.datebox.defaults, {
		showSeconds:true,
		timeSeparator:':',
		
		keyHandler: {
			up:function(){},
			down:function(){},
			enter:function(){doEnter(this);},
			query:function(q){doQuery(this, q);}
		},
		
		formatter:function(date){
			var h = date.getHours();
			var M = date.getMinutes();
			var s = date.getSeconds();
			function formatNumber(value){
				return (value < 10 ? '0' : '') + value;
			}
			var separator = $(this).datetimebox('spinner').timespinner('options').separator;
			var r = $.fn.datebox.defaults.formatter(date) + ' ' + formatNumber(h)+separator+formatNumber(M);
			if ($(this).datetimebox('options').showSeconds){
				r += separator+formatNumber(s);
			}
			return r;
		},
		parser:function(s){
			if ($.trim(s) == ''){
				return new Date();
			}
			var dt = s.split(' ');
			var d = $.fn.datebox.defaults.parser(dt[0]);
			if (dt.length < 2){
				return d;
			}
			var separator = $(this).datetimebox('spinner').timespinner('options').separator;
			var tt = dt[1].split(separator);
			var hour = parseInt(tt[0], 10) || 0;
			var minute = parseInt(tt[1], 10) || 0;
			var second = parseInt(tt[2], 10) || 0;
			return new Date(d.getFullYear(), d.getMonth(), d.getDate(), hour, minute, second);
		}
	});
})(jQuery);
/**
 * slider - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 * Dependencies:
 *  draggable
 * 
 */
(function($){
	function init(target){
		var slider = $('<div class="slider">' +
				'<div class="slider-inner">' +
				'<a href="javascript:void(0)" class="slider-handle"></a>' +
				'<span class="slider-tip"></span>' +
				'</div>' +
				'<div class="slider-rule"></div>' +
				'<div class="slider-rulelabel"></div>' +
				'<div style="clear:both"></div>' +
				'<input type="hidden" class="slider-value">' +
				'</div>').insertAfter(target);
		var name = $(target).hide().attr('name');
		if (name){
			slider.find('input.slider-value').attr('name', name);
			$(target).removeAttr('name').attr('sliderName', name);
		}
		return slider;
	}
	
	/**
	 * set the slider size, for vertical slider, the height property is required
	 */
	function setSize(target, param){
		var state = $.data(target, 'slider');
		var opts = state.options;
		var slider = state.slider;
		
		if (param){
			if (param.width) opts.width = param.width;
			if (param.height) opts.height = param.height;
		}
		if (opts.mode == 'h'){
			slider.css('height', '');
			slider.children('div').css('height', '');
			if (!isNaN(opts.width)){
				slider.width(opts.width);
			}
		} else {
			slider.css('width', '');
			slider.children('div').css('width', '');
			if (!isNaN(opts.height)){
				slider.height(opts.height);
				slider.find('div.slider-rule').height(opts.height);
				slider.find('div.slider-rulelabel').height(opts.height);
				slider.find('div.slider-inner')._outerHeight(opts.height);
			}
		}
		initValue(target);
	}
	
	/**
	 * show slider rule if needed
	 */
	function showRule(target){
		var state = $.data(target, 'slider');
		var opts = state.options;
		var slider = state.slider;
		
		var aa = opts.mode == 'h' ? opts.rule : opts.rule.slice(0).reverse();
		if (opts.reversed){
			aa = aa.slice(0).reverse();
		}
		_build(aa);
		
		function _build(aa){
			var rule = slider.find('div.slider-rule');
			var label = slider.find('div.slider-rulelabel');
			rule.empty();
			label.empty();
			for(var i=0; i<aa.length; i++){
				var distance = i*100/(aa.length-1)+'%';
				var span = $('<span></span>').appendTo(rule);
				span.css((opts.mode=='h'?'left':'top'), distance);
				
				// show the labels
				if (aa[i] != '|'){
					span = $('<span></span>').appendTo(label);
					span.html(aa[i]);
					if (opts.mode == 'h'){
						span.css({
							left: distance,
							marginLeft: -Math.round(span.outerWidth()/2)
						});
					} else {
						span.css({
							top: distance,
							marginTop: -Math.round(span.outerHeight()/2)
						});
					}
				}
			}
		}
	}
	
	/**
	 * build the slider and set some properties
	 */
	function buildSlider(target){
		var state = $.data(target, 'slider');
		var opts = state.options;
		var slider = state.slider;
		
		slider.removeClass('slider-h slider-v slider-disabled');
		slider.addClass(opts.mode == 'h' ? 'slider-h' : 'slider-v');
		slider.addClass(opts.disabled ? 'slider-disabled' : '');
		
		slider.find('a.slider-handle').draggable({
			axis:opts.mode,
			cursor:'pointer',
			disabled: opts.disabled,
			onDrag:function(e){
				var left = e.data.left;
				var width = slider.width();
				if (opts.mode!='h'){
					left = e.data.top;
					width = slider.height();
				}
				if (left < 0 || left > width) {
					return false;
				} else {
					var value = pos2value(target, left);
					adjustValue(value);
					return false;
				}
			},
			onStartDrag:function(){
				opts.onSlideStart.call(target, opts.value);
			},
			onStopDrag:function(e){
				var value = pos2value(target, (opts.mode=='h'?e.data.left:e.data.top));
				adjustValue(value);
				opts.onSlideEnd.call(target, opts.value);
			}
		});
		
		function adjustValue(value){
			var s = Math.abs(value % opts.step);
			if (s < opts.step/2){
				value -= s;
			} else {
				value = value - s + opts.step;
			}
			setValue(target, value);
		}
	}
	
	/**
	 * set a specified value to slider
	 */
	function setValue(target, value){
		var state = $.data(target, 'slider');
		var opts = state.options;
		var slider = state.slider;
		var oldValue = opts.value;
		if (value < opts.min) value = opts.min;
		if (value > opts.max) value = opts.max;
		
		opts.value = value;
		$(target).val(value);
		slider.find('input.slider-value').val(value);
		
		var pos = value2pos(target, value);
		var tip = slider.find('.slider-tip');
		if (opts.showTip){
			tip.show();
			tip.html(opts.tipFormatter.call(target, opts.value));
		} else {
			tip.hide();
		}
		
		if (opts.mode == 'h'){
			var style = 'left:'+pos+'px;';
			slider.find('.slider-handle').attr('style', style);
			tip.attr('style', style +  'margin-left:' + (-Math.round(tip.outerWidth()/2)) + 'px');
		} else {
			var style = 'top:' + pos + 'px;';
			slider.find('.slider-handle').attr('style', style);
			tip.attr('style', style + 'margin-left:' + (-Math.round(tip.outerWidth())) + 'px');
		}
		
		if (oldValue != value){
			opts.onChange.call(target, value, oldValue);
		}
	}
	
	function initValue(target){
		var opts = $.data(target, 'slider').options;
		var fn = opts.onChange;
		opts.onChange = function(){};
		setValue(target, opts.value);
		opts.onChange = fn;
	}
	
	/**
	 * translate value to slider position
	 */
	function value2pos(target, value){
		var state = $.data(target, 'slider');
		var opts = state.options;
		var slider = state.slider;
		if (opts.mode == 'h'){
			var pos = (value-opts.min)/(opts.max-opts.min)*slider.width();
			if (opts.reversed){
				pos = slider.width() - pos;
			}
		} else {
			var pos = slider.height() - (value-opts.min)/(opts.max-opts.min)*slider.height();
			if (opts.reversed){
				pos = slider.height() - pos;
			}
		}
		return pos.toFixed(0);
	}
	
	/**
	 * translate slider position to value
	 */
	function pos2value(target, pos){
		var state = $.data(target, 'slider');
		var opts = state.options;
		var slider = state.slider;
		if (opts.mode == 'h'){
			var value = opts.min + (opts.max-opts.min)*(pos/slider.width());
		} else {
			var value = opts.min + (opts.max-opts.min)*((slider.height()-pos)/slider.height());
		}
		return opts.reversed ? opts.max - value.toFixed(0) : value.toFixed(0);
	}
	
	$.fn.slider = function(options, param){
		if (typeof options == 'string'){
			return $.fn.slider.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'slider');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'slider', {
					options: $.extend({}, $.fn.slider.defaults, $.fn.slider.parseOptions(this), options),
					slider: init(this)
				});
				$(this).removeAttr('disabled');
			}
			
			var opts = state.options;
			opts.min = parseFloat(opts.min);
			opts.max = parseFloat(opts.max);
			opts.value = parseFloat(opts.value);
			opts.step = parseFloat(opts.step);
			
			buildSlider(this);
			showRule(this);
			setSize(this);
		});
	};
	
	$.fn.slider.methods = {
		options: function(jq){
			return $.data(jq[0], 'slider').options;
		},
		destroy: function(jq){
			return jq.each(function(){
				$.data(this, 'slider').slider.remove();
				$(this).remove();
			});
		},
		resize: function(jq, param){
			return jq.each(function(){
				setSize(this, param);
			});
		},
		getValue: function(jq){
			return jq.slider('options').value;
		},
		setValue: function(jq, value){
			return jq.each(function(){
				setValue(this, value);
			});
		},
		enable: function(jq){
			return jq.each(function(){
				$.data(this, 'slider').options.disabled = false;
				buildSlider(this);
			});
		},
		disable: function(jq){
			return jq.each(function(){
				$.data(this, 'slider').options.disabled = true;
				buildSlider(this);
			});
		}
	};
	
	$.fn.slider.parseOptions = function(target){
		var t = $(target);
		return $.extend({}, $.parser.parseOptions(target, [
			'width','height','mode',{reversed:'boolean',showTip:'boolean',min:'number',max:'number',step:'number'}
		]), {
			value: (t.val() || undefined),
			disabled: (t.attr('disabled') ? true : undefined),
			rule: (t.attr('rule') ? eval(t.attr('rule')) : undefined)
		});
	};
	
	$.fn.slider.defaults = {
		width: 'auto',
		height: 'auto',
		mode: 'h',	// 'h'(horizontal) or 'v'(vertical)
		reversed: false,
		showTip: false,
		disabled: false,
		value: 0,
		min: 0,
		max: 100,
		step: 1,
		rule: [],	// [0,'|',100]
		tipFormatter: function(value){return value},
		onChange: function(value, oldValue){},
		onSlideStart: function(value){},
		onSlideEnd: function(value){}
	};
})(jQuery);
