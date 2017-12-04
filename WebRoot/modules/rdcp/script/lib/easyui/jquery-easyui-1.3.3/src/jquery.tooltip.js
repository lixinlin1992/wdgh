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
