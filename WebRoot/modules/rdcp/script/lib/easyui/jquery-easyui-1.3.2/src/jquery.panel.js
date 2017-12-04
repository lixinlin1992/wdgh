/**
 * panel - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: jeasyui@gmail.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 */
(function($){
	function removeNode(node){
		node.each(function(){
			$(this).remove();
			if ($.browser.msie){
				this.outerHTML = '';
			}
		});
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
