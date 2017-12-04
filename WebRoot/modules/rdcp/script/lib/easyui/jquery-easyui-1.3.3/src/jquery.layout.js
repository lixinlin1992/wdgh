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
