/**
 * sunrisegrid v1.0
 * Copyright (c) 2008 蒋杰龙  森锐科技
 * Date: 2011-3-24
 */
;
(function($) {

    $.sgrid = $.sgrid || {};
    $.extend($.sgrid, {
        extend : function(methods) {
            $.extend($.fn.sunriseGird, methods);
            if (!this.no_legacy_api) {
                $.fn.extend(methods);
            }
        }
    });

    var defulteOptions = {
        url : "",
        height : 150,
        width : 300,
        page : 1,
        rowNum : 10,
        total : null,
        records : 0,
        maxButtons : 9,
        colNames : [],
        colModel: [],
        caption : null,
        captionable : false,
        multiselect : false,
        formName : null,
        dataSource : null,
        algin : "center",
        footerrow : false,
        globalSortable:false,
        onSelectRow : function() {
        },
        ondblClickRow : function() {
        },
        onSelectPage : function() {
        },
        sort : function() {
        },
        success : function() {
        },
        error : function() {
        },
        complete : function() {
        }
    };

    //插件主体代码
    $.fn.sunriseGird = function(options) {

        return this.each(function() {

            /**
             * kinz 2011.05.06 添加，该函数以后考虑抽取到公用函数库
             * 获取一个字符串的像素长度和高度
             * @param str
             */
            var getStrPx = function(str, css) {
                var _d = document.createElement("span");
                _d.className = css;
                $(_d).css({display:"inline",padding:"0px",visibility:"hidden"}).html(str);
                $("body").append(_d);
                var _result = {width:_d.offsetWidth,height:_d.offsetHeight};
                $(_d).remove();
                //return $(_d).width;
                return _result;
            };
            /**
             * kinz 2011.05.06 添加
             * 智能设置列宽，并计算实际的宽度
             * 1. 如果列宽中出现绝对宽度，则所有都使用绝对宽度来重新计算百分比
             * 2. 如果百分比总和超过100%，则重新计算分配，保证总和等于100%
             * 3. 如果百分比总和低于100%，则重新计算分配，保证总和等于100%
             * 4. 如果出现没有设置宽度的列，则
             * @param colModels
             */
            var smartColWidth = function(colModels) {
                var _mode = 0;//0 表示百分比宽度模式，1 表示绝对宽度模式
                var _totalWidth = 0;//所有列的宽度总和
                var _colCount = 0;//要展示的列数量
                $.each(colModels, function(i, n) {
                    //alert(i+"\n\r"+n);
                    if (n.hidden)
                        return;
                    var _colWidthMode = 1;
                    var _colWidth = 0;
                    _colCount ++;
                    if (!n.width) {
                        //没有指定宽度，使用表头文字的宽度
                        //_colWidth = 1;
                        _colWidth = getStrPx(n.name, "ui_grid_btable").width;
                    } else {
                        //指定宽度，看看宽度是什么模式
                        if ((typeof n.width === 'string')) {
                            if (n.width.indexOf("%") != -1) {
                                //百分比模式
                                _colWidthMode = 0;
                                _colWidth = parseInt(n.width.substring(0, n.width.indexOf("%")));
                            } else if (n.width.toLowerCase().indexOf("px") != -1) {
                                //指定了像素
                                _colWidthMode = 1;
                                _colWidth = parseInt(n.width.substring(0, n.width.indexOf("px")));
                            } else {
                                //还是绝对列宽模式
                                _colWidthMode = 1;
                                _colWidth = parseInt(n.width);
                            }
                        } else {
                            //该列是绝对列宽模式
                            _colWidthMode = 1;
                            _colWidth = n.width;
                        }
                    }

                    n.width = _colWidth;
                    if (_mode == 0 && _colWidthMode == 1)
                        _mode = 1;

                    _totalWidth += _colWidth;
                });
                //如果所有列都没有指定宽度，则自动设置为百分比模式，并平均各列宽度
                if (_totalWidth == 0)
                    _mode = 0;
                //alert("列宽模式: " + (_mode == 0 ? "百分比" : "绝对") + "\t" + "总宽度: " + _totalWidth);
                //开始进行调整
                $.each(colModels, function(i, n) {
                    if (n.hidden)
                        return;
                    //如果是百分比模式
                    if (_mode == 0) {
                        if (_totalWidth == 0)
                            n.width = (100 / _colCount) + "%";
                        else
                            n.width = ((100 * n.width) / _totalWidth) + "%";
                    } else {

                    }
                });
            };


            //获取一个id随机数
            Math.random();
            var id = $(this).attr("id");//Math.floor(Math.random() * 9999999 + 1);
            //alert(id);

            //缓存表格数据
            var cacheData;

            //缓存被选中得表格数据
            var cacheSelectData = {};

            //保存formatter函数
            var formatterMapping = {
                showlink : function(formatoptions, row) {
                    var href = formatoptions.baseLinkUrl + "?" + formatoptions.idName + "=" + row;
                    return "<a href='" + href + "' target='" + formatoptions.target + "'>" + row + "</a>";
                }
            };

            var message;
            //设置表格参数
            var o = $.extend(true, {}, defulteOptions, options);

            if (this.tagName != "DIV" && this.tagName != "TABLE") {
                message = "所选择的容器标签不是div或者是Table";
                o.error(message);
                return;
            }

            $(this).empty();
            var gv, ca , ti , bo , tb;
            if (o.colNames.length == 0) {
                for (var i = 0; i < o.colNames.length; i++) {
                    o.colNames[i] = o.colModel[i].label || o.colModel.name;
                }
            }

            if (o.colNames.length != o.colModel.length) {
                message = "colNames与colModeL数量设置不一致";
                o.error(message);
            }

            /**事件绑定编辑区**/

            //解决单双击事件冲突计时器
            var timer = null;
            var events = {
                /**
                 * 行滑动颜色变换和点击颜色变换事件
                 */
                rowsEvent : function() {
                    root.find('.ui_grid_row').bind({
                        mousemove : function() {
                            var $tr = $(this);
                            $tr.addClass('ui_grid_row_highlight').siblings().removeClass('ui_grid_row_highlight');
                        },

                        click : function(event) {
                            var $tr = $(this);
                            //如果点击的是一个控件（除去内部添加的复选框），则不处理该事件
                            if (event.target.nodeName.toLowerCase() == "input" &&
                                    event.target.id.indexOf("cd_listdata_") < 0) {
                                return;
                            }
                            //解决单双击冲突问题
                            clearTimeout(timer);
                            if (event.detail == 2) {
                                return;
                            }

                            timer = setTimeout(function() {
                                //执行点击回调函数
                                o.onSelectRow($tr.attr('data'), $tr.attr("rowNum"));
                            }, 300);

                            if (o.multiselect == true) {
                                $tr.toggleClass("ui_grid_row_selected");

                                //判断行是否选中，选中则写入选中缓存，否则删除
                                if($tr.hasClass("ui_grid_row_selected")){
                                    addCacheSelectData($tr.attr('data'));
                                }else{
                                    delCacheSelectData($tr.attr('data'));
                                }

                                //判断事件是否来源于checkbox，如果是则阻止事件冒泡
                                if (event.target.tagName == "INPUT") {
                                    event.stopPropagation();
                                    return;
                                }
                                if ($tr.find(":checkbox").is(":checked")) {
                                    $tr.find(":checkbox").removeAttr("checked");

                                } else {
                                    $tr.find(":checkbox").attr("checked", "checked");

                                }
                            } else {
                                $tr.addClass("ui_grid_row_selected").siblings().removeClass("ui_grid_row_selected");
                                cacheSelectData = {};
                                addCacheSelectData($tr.attr('data'));
                            }
                        },

                        dblclick : function(event) {
                            var $tr = $(this);
                            //解决单双击冲突问题
                            clearTimeout(timer);
                            o.ondblClickRow($tr.attr('id'), $tr.attr("rowNum"));
                        }
                    });
                },

                /**
                 * checkbox点击事件
                 */
                checkboxEvent : function() {
                    var selector = "#cd_listdata_" + id;
                    $(selector).bind("click", function() {
                        if ($(selector).is(":checked")) {
                            root.find(".cbox").attr("checked", "checked");
                            var $trs = root.find(".ui_grid_row");
                            $trs.addClass("ui_grid_row_selected");
                            $.each($trs,function(key,data){
                                addCacheSelectData($(data).attr('data'));
                            });
                        } else {
                            root.find(".cbox").removeAttr("checked");
                            root.find(".ui_grid_row").removeClass("ui_grid_row_selected");
                            cacheSelectData = {};//清空选中得数据库缓存
                        }
                    });
                },

                /**
                 * 标题排序点击事件
                 * @param selector
                 * @param colModel
                 */
                sortEvent : function(selector, colModel) {
                    var jsonData = "";
                    var sortVal = "";
                    selector.bind("click", function() {
                        var $sSpan = $(selector.selector).find(".sort-ui");
                        if ($sSpan.parent().attr("sort") == undefined || $sSpan.parent().attr("sort") == "asc") {
                            sortVal = "desc";
                            //selector.find("span").removeClass().addClass("ui_grid_desc_img");
                            //selector.attr("sort", "desc").siblings().removeAttr("sort");
                            $sSpan.removeClass().addClass("ui_grid_desc_img sort-ui");
                            $sSpan.parent().attr("sort", "desc").siblings().removeAttr("sort");
                        } else {
                            sortVal = "asc";
                            //selector.find("span").removeClass().addClass("ui_grid_asc_img");
                            //selector.attr("sort", "asc").siblings().removeAttr("sort");
                            $sSpan.removeClass().addClass("ui_grid_asc_img sort-ui");
                            $sSpan.parent().attr("sort", "asc").siblings().removeAttr("sort");
                        }
                        //selector.siblings().find("span").removeClass().addClass("ui_grid_no_sort_img");
                        $sSpan.parent().siblings().find("span .sort-ui").removeClass().addClass("ui_grid_no_sort_img sort-ui");
                        o.orderType = sortVal;
                        o.orderField = colModel.index;
                        o.sort(o.page, sortVal, colModel.index);
                    });
                },

                pageEvent : function() {
                    $("#page_" + id).find("a").bind({
                        "click":function() {
                            var orderField = "";
                            var orderType = "";
                            root.find(".ui_grid_btable thead").find("th").each(function() {
                                if ($(this).attr("sort") != undefined) {
                                    orderType = $(this).attr("sort");
                                    for (var i = 0; i < o.colModel.length; i++) {
                                        if ($.trim($(this).text()) == $.trim(o.colModel[i].name)) {
                                            orderField = o.colModel[i].index;
                                        }
                                    }
                                }
                            });
                            addJsonData(o.onSelectPage($(this).attr('value'), orderType, orderField));
                        }
                    });

                    /**
                     * 翻页输入跳转点解时间
                     */
                    $("#jumpButton"+id).click(function(){
                        if($("#jumpPage"+id).val()=="" && $("#jumpPage"+id).val()==null){
                            return;
                        }
                        if(Number($("#jumpPage"+id).val()) > o.total){
                            $("#jumpPage"+id).val(o.total);
                        }
                        var orderField = "";
                        var orderType = "";
                        root.find(".ui_grid_btable thead").find("th").each(function() {
                                if ($(this).attr("sort") != undefined) {
                                    orderType = $(this).attr("sort");
                                    for (var i = 0; i < o.colModel.length; i++) {
                                        if ($.trim($(this).text()) == $.trim(o.colModel[i].name)) {
                                            orderField = o.colModel[i].index;
                                        }
                                    }
                                }
                            });
                        addJsonData(o.onSelectPage($("#jumpPage"+id).val(), orderType, orderField));
                    });
                }

            };
            
            //生成工具条主体
           	var altdiv = $("#altlayer");
   			if (altdiv.length == 0) 
            	$("body").append("<div style='visibility:hidden;border:1px solid black;padding:5px;font-size:12px;background-color:#FFF;position:absolute;' id='altlayer'></div>");

            gv = "<div id='ui_grid_view_" + id + "' class='ui_grid_view'></div>";
            var css = {"width":o.width,"height":o.height};
            //判断表格位置
            switch (o.algin) {
                case "center":
                    css.margin = "0 auto";
                    break;
                case "right":
                    css.float = "right";
                    break;
                case "left":
                    break;
            }
            if (this.tagName == "TABLE") {
                $(this).css(css);
                $(this).append("<tr><td></td></tr>");
                $(this).find("td").append(gv);
            } else {
                $(this).append(gv);
                $('#ui_grid_view_' + id).css(css);
            }

            var root = $('#ui_grid_view_' + id);

            //判断如果有设置表格标题则生成标题
            if (o.captionable == true && o.caption != null) {
                ca = "<div class='ui_grid_titlebar'><span class='ui_grid_title'>" + o.caption + "</span></div>";
                root.append(ca);
            }

            //生成表格主体
            bo = "<div class='ui_grid_bdiv'></div>";
            root.append(bo);
            var btable = "<table style='width:100%' id='listdata" + id + "' class='ui_grid_btable'></table>";
            root.find(".ui_grid_bdiv").append(btable);


            //生成表头
            root.find(".ui_grid_btable").append("<thead><tr></tr></thead>");
            var hth = "";
            var isMulti = o.multiselect;
            //判断如果是多选则生成一个带多选框的<th>
            if (isMulti == true) {
                var tempTh = "<th id='cb_"+id+"' style='width:18px'><input id='cd_listdata_" + id +
                        "' class='cbox' type='checkbox'></th>";
                root.find(".ui_grid_btable thead").find("tr").append(tempTh);
                //绑定点解事件，当点击表示多选框时，将选择所有行
                events['checkboxEvent']();

            }


            //kinz 2011.05.06 添加对列宽进行重新计算的功能
            //smartColWidth(o.colModel);


            for (var i = 0; i < o.colNames.length; i++) {
                var colModel = (o.colModel)[i];
                var width = colModel.width;
                var _label = colModel["label"] || colModel["name"];
              
				//TH表头添加tooltip 2011.10.11 李嘉伟
				var th_tooltip = "";
				if($.browser.msie){
					if($.browser.version == "6.0") 
						th_tooltip = " onMouseOver='showTip(event,\"" + _label + "\");' "+
	                   				   " onMouseOut='hideTip();'";
	                else
						th_tooltip = "title='" + _label + "'";
				}else
					th_tooltip = "title='" + _label + "'";
                
                hth = "<th id='h_" + o.colNames[i] + "_" + id + "'><span " + th_tooltip +                 
                	  ">" + _label + "</span></th>";

                root.find(".ui_grid_btable thead").find("tr").append(hth);
                if (colModel.hidden == true) {
                    root.find('#h_' + o.colNames[i] + "_" + id).css({"display":"none"});
                }
                $("#h_" + o.colNames[i] + "_" + id).css({"text-align":"center","width":width});
                //绑定表头点击排序事件
                if (colModel.sortable != false && o.globalSortable == true ) {
                    $("#h_" + o.colNames[i] + "_" + id).append("<span class='ui_grid_no_sort_img sort-ui'>&nbsp;&nbsp;</span>");
                    $("#h_" + o.colNames[i] + "_" + id).css({"cursor":"pointer"});
                    events['sortEvent']($("#h_" + o.colNames[i] + "_" + id), o.colModel[i]);
                }
            }
            //添加表格body
            root.find(".ui_grid_btable").append("<tbody></tbody>");

            //如果footerrow为true则添加表脚
            if(o.footerrow){
                root.find(".ui_grid_btable").append("<tfoot></tfoot>");
            }

            //生成工具条
            tb = "<div class='ui_grid_toolbar'><table>" +
                    "<tr><td id='navButton_" + id + "' class='ui_view_navButton'></td>" +
                    "<td id='page_" + id + "' class='ui_view_page'></td></tr>" +
                    "</table></div>";
            root.append(tb);


            /**内部函数编辑区**/

            /**
             * 设置json数据，生成数据表格
             * @param jsonData
             */
            var addJsonData = function(jsonData) {
                root.find(".ui_grid_btable>tbody").empty();
                var tempData;
                var rowDatas;
                var userData; //合计数据
                try {
                    if (typeof(jsonData) == "string") {
                        tempData = eval('(' + jsonData + ')');
                    } else {
                        tempData = jsonData;
                    }
                    rowDatas = tempData.rows;
                    o.total = tempData.total;
                    o.page = tempData.page;
                    o.records = tempData.records;
                    userData = tempData.userdata;
                    setCacheData(tempData);
                } catch(e) {
                    message = "格式出错:" + jsonData;
                    o.error(message, e);
                    return;
                }
                if (rowDatas == undefined || rowDatas.length == 0) {
                    var colspanVal = o.multiselect == true ? o.colModel.length + 1 : o.colModel.length;
                    var _hiddenVal = 0;
                    for (var i = 0; i < o.colModel.length; i++) {
                        if ((o.colModel[i]).hidden == true) {
                            _hiddenVal++;
                        }
                    }
                    var emptyDiv = "<tr><td colspan='" + (colspanVal - _hiddenVal) +
                            "'><div style='text-align:center;'>没有记录！！</div></td></tr>";
                    $("#listdata" + id).find("tbody").append(emptyDiv);
                } else {
                    var _tbody = $("<tbody></tbody>");
                    for (var i = 0; i < rowDatas.length; i++) {
                        _tbody.append(addCell(rowDatas[i], i + 1));
                    }
                    $("#listdata" + id).find("tbody").replaceWith(_tbody);
                }

                //如果footerrow为true,userData不为空则生成表脚
                root.find(".ui_grid_btable>tfoot").empty();
                if(o.footerrow && userData!=undefined){
                    var _tfoot = $("<tfoot></tfoot>");
                    _tfoot.append(addFooter(userData));
                    $("#listdata" + id).find("tfoot").replaceWith(_tfoot);
                }
                o.complete();
                //如果分页参数小于0代表改表格不用分页
                if(o.total >= 0){
                    createPager(o);
                }

                //绑定事件
                events['rowsEvent']();
                
            };

            /**
             * 根据数据生成表格中一行数据
             * 修改人：蒋杰龙
             * 修改目的：生成表格数据由每生成一个单元就直接添加到DOM渲染，改为先将所有数据先在内存中操作完成后再添加到DOM中渲染，提供性能
             * @param rowData
             */
            var addCell = function(rowData, rowNum) {
                var rowClass;
                if(rowNum%2 != 0){
                    rowClass = "ui_grid_row_odd"
                }else{
                    rowClass = "ui_grid_row_even";
                }
                var btr = $("<tr rowNum='" + rowNum + "' id='_row_" + id + "_" + rowNum + "' class='ui_grid_row "+rowClass+"' data='"+rowData.id+"'></tr>");

                var rows = rowData.cell;
                var btd = "";

                //判断如果是多选则生成一个带多选框的<td>
                if (isMulti == true) {
                    var tempTd = "<td style='width:20px;text-align:center'><input id='cd_listdata_" + id + "_" +
                            rowNum +
                            "' class='cbox' type='checkbox'></td>";
                    $(btr).append(tempTd);
                }
                for (var i = 0; i < o.colNames.length; i++) {
                    var tempRowData = "";
                    if (rows[i] != undefined) {
                        tempRowData = rows[i];
                    }
                    var tdVal = "";
                    var colModel = (o.colModel)[i];
                    var name = colModel.name;
                    var width = colModel.width;
                    var align = colModel.align || "center";
                    var formatter = colModel.formatter;
										
					var nobr_tooltip = "";
					if($.browser.msie){
						if($.browser.version == "6.0") 
							nobr_tooltip = " onMouseOver='showTip(event,\"" + tempRowData + "\");' "+
	                    				   " onMouseOut='hideTip();'";
	                    else
							nobr_tooltip = "title='" + tempRowData + "'";
					}else
						nobr_tooltip = "title='" + tempRowData + "'";
					
					if(typeof(formatter) === "function"){
                        var checkFormatter = formatter(tempRowData, colModel, rowData.cell, btr, btd);
                        if(checkFormatter != undefined && checkFormatter.indexOf("type='button'")>0)
							nobr_tooltip = "";
					}
					
                    btd = $("<td name='" + name + "' ><span style='padding:3px;'><nobr "+nobr_tooltip+"></nobr></td>");
                    
                    //查找formater注册的函数
                    if (typeof(formatter) === "function") {
                        tdVal = formatter(tempRowData, colModel, rowData.cell, btr, btd);
                    } else {
                        if (formatterMapping[formatter] == undefined) {
                            tdVal = tempRowData;
                        } else {
                            tdVal = formatterMapping[formatter](colModel.formatoptions, tempRowData, btr, btd);
                        }
                    }
                    //btd = "<td name='" + name + "' title='" + tempRowData + "'>" + tdVal + "</td>";
                    btd.find("nobr").html(tdVal);
                    $(btr).append(btd);
                    if (colModel.hidden == true) {
                        $(btr).find("td[name='" + name + "']").css({"display":"none"});
                    }
                    $(btr).find("td[name='" + name + "']").css({"text-align":align,"width":width});
                }

                return btr;
            };

            /**
             * 生成表脚
             * @param footData
             */
             var addFooter = function(footData){
                           var _colNames = o.colNames;
                           var _colModes = o.colModel;
                           var ftr = $("<tr class='ui_grid_footer'></tr>");
                           for(var i=0; i<_colNames.length; i++){
                               var _style = "";
                               var _colMode = _colModes[i];
                               var _td = $("<td style=''></td>");
                               if(i==0 && o.multiselect){
                                   _td.attr("colspan","2");
                               }
                               if(_colMode.hidden){
                                   _style += "display:none;";
                               }
                               if(footData[_colMode.index]!=undefined){
                                   _style += "text-align:"+_colMode.align+";";
                                   _td.html(footData[_colMode.index]);
                               }
                               _td.attr("style",_style);
                               ftr.append(_td);
                           }
                           return ftr;
                       };
            
            /**
             * 根据ID获取一行数据
             * 返回格式：{colName:value}
             * @param id
             */
            var getRowData = function(id) {
                var colNames = o.colNames;
                var cacheData = getCacheData();
                var jsonData = "{";

                if (cacheData == undefined) {
                    return "";
                }

                var rows = cacheData.rows;
                $.each(rows, function(i) {
                    var isBreak = true;
                    var row = rows[i];
                    if (row.id == id) {
                        var cell = row.cell;
                        $.each(colNames, function(i) {
                            if (i > 0) {
                                jsonData += ",";
                            }
                            jsonData += "'" + colNames[i] + "'" + ":" + "'" + cell[i] + "'";
                        });
                        jsonData += "}";
                        isBreak = false;
                    }
                    return isBreak;
                });

                try {
                    jsonData = eval('(' + jsonData + ')');
                } catch(e) {
                    jsonData = "";
                }
                return jsonData;
            };

            /**
             * 生成翻页工具条
             */
            var createPager = function(options) {
                $("#page_" + id).empty();
                var _pageUl = "<div></div>";
                $("#page_" + id).append(_pageUl);
                var start = Math.max(1, options.page - parseInt(options.maxButtons / 2));
                var end = Math.min(options.total, start + options.maxButtons - 1);
                var start = Math.max(1, end - options.maxButtons + 1);
                var total = options.total;
                var records = options.records;
                var _span = "<span>总记录:"+records+"</span><span>总页数:"+total+"</span>";
                _span += "<span>跳转到<input type='text' style='width:20px;height:18px;font-size:10px;' id='jumpPage"+id+"' value='"+options.page+"'>页" +
                        " <label style='font-size:11px;cursor:pointer;text-indent:10px;color:#0000EE;text-decoration:underline;' id='jumpButton"+id+"' class='page_go'>确定</label></span>";
                $("#page_" + id).find("div").append(_span);
                if (options.records >= 1) {
                    if (options.page == 1) {
                        var _span = "<span>首页</span><span>上一页</span>";
                        $("#page_" + id).find("div").append(_span);
                    } else {
                        var _a = "<a value='1'>首页</a><a value='" + (parseInt(options.page) - 1) + "'>上一页</a>";
                        $("#page_" + id).find("div").append(_a);
                    }
                }

                for (var i = start; i <= end; i++) {
                    if (i == options.page) {
                        var _span = "<span>" + i + "</span>";
                        $("#page_" + id).find("div").append(_span);
                    } else {
                        var _a = "<a value='" + i + "'>" + i + "</a>";
                        $("#page_" + id).find("div").append(_a);
                    }
                }

                if (options.records >= 1) {
                    if (options.page == options.total) {
                        var _span = "<span>下一页</span><span>末页</span>";
                        $("#page_" + id).find("div").append(_span);
                    } else {
                        var _a = "<a value='" + (parseInt(options.page) + 1) + "'>下一页</a><a value='" + options.total +
                                "'>末页</a>";
                        $("#page_" + id).find("div").append(_a);
                    }
                }
                //绑定事件
                events['pageEvent']();

            };

            /**
             * 设置缓存数据
             * @param tempData
             */
            var setCacheData = function(tempData) {
                cacheData = tempData;
                //清空选择缓存
                cacheSelectData = {};
            };

            /**
             * 获取缓存数据
             */
            var getCacheData = function() {
                return cacheData;
            };

            /**
             * 获取选中的表格缓存数据
             * @return {*}
             */
            var getCacheSelectData = function(){
                return cacheSelectData;
            };

            /**
             * 添加选中数据到缓存
             * @param id   行ID
             */
            var addCacheSelectData = function(id){
            	if(getRowData(id) == ""){
            		return;
            	}
                cacheSelectData[id] = getRowData(id);
            };

            /**
             *  从缓存中删除退选得数据
             * @param id   行ID
             */
            var delCacheSelectData = function(id){
                var tempCacheSelectData = getCacheSelectData();
                cacheSelectData = {}; //清空缓存
                $.each(tempCacheSelectData,function(key,data){
                    if(id == key){  //判断如果key等于要删除得ID 则跳过不将数据添加到缓存中
                        return;
                    }
                    cacheSelectData[key] = data;
                });
            };

            /**
             * 根据Id选中行
             * @param id
             * @param flag  true:根据ID选中数据，false:根据ID退选数据
             */
            var selectRow = function(id,flag){
                $tr = root.find("tr[data='"+id+"']");
                if(flag){
                	$tr.addClass("ui_grid_row_selected");
                    $tr.find(":checkbox").attr("checked", "checked");
                    addCacheSelectData(id);
                }else{
                	$tr.removeClass("ui_grid_row_selected");
                    $tr.find(":checkbox").removeAttr("checked");
                    delCacheSelectData(id);
                }
            };

            /**API对外公布编辑区**/

            this.addJSONData = function(jsonData) {
                addJsonData(jsonData)
            };

            this.getRowData = function(id) {
                return getRowData(id);
            };

            this.getCacheData = function() {
                return getCacheData();
            };

            this.getCacheSelectData = function(){
                return getCacheSelectData();
            };

            this.selectRow = function(id,flag){
                return selectRow(id,flag);
            };

            this.o = o;

        });
    };

    $.sgrid.extend({
    /**
     * 添加功能区域
     * this： 表示一个表格数组，用于存放所以的表格对象的引用，其顺序为HTML DOM中表格的顺序
     * 例子：
     *      $(".test").sunriseGrid(params);
     *      <div id="grid1" class="test"></div>
     *      <div id="gird2" class="test"></div>
     *
     * 此时 this将包含2个表格引用 this[0] --> grid1 , this[1] --> grid2
     *
     * 请注意：当使用$("#grid1")时，this仍然是一个数组，要引用改表格对象应该使用this[0].
     */


        /**
         * 添加一行数据
         * @param rowid  id
         * @param rdata  表格数据  数据格式["name":"value"],name为colModel的name
         * @param pos
         */
        addRowData : function(rowid, rdata, pos) {
            try {
                if (typeof(rdata) == "string") {
                    rdata = eval('(' + rdata + ')');
                }
            } catch(e) {
                this[0].o.error("数据格式不正确！", e);
                return;
            }
            var colModel = this[0].o.colModel;
            var cacheData = this[0].getCacheData() == undefined ? new Object() : this[0].getCacheData();

            var rowDatas = cacheData.rows;

            var tempData = [];
            for (var i = 0; i < colModel.length; i++) {
                var name = colModel[i].name;
                tempData[i] = rdata[name] == undefined ? " " : rdata[name];
            }

            if (rowDatas != undefined) {
                if (pos == undefined || pos > rowDatas.length) {
                    var i = rowDatas.length;
                    rowDatas[i] = new Object();
                    rowDatas[i].id = rowid;
                    rowDatas[i].cell = tempData;
                } else {
                    for (var i = rowDatas.length; i > pos - 1; i--) {
                        rowDatas[i] = rowDatas[i - 1];
                    }
                    rowDatas[pos - 1] = new Object();
                    rowDatas[pos - 1].id = rowid;
                    rowDatas[pos - 1].cell = tempData;
                }
            } else {
                rowDatas = [];
                rowDatas[0] = new Object();
                rowDatas[0].id = rowid;
                rowDatas[0].cell = tempData;
            }
            cacheData['rows'] = rowDatas;
            this[0].addJSONData(cacheData);
        },

        /**
         * 删除数据
         * @param rowid
         */
        delRowData : function(rowid) {
            var cacheData = this[0].getCacheData();
            var rowDatas = cacheData.rows;
            for (var i = 0; i < rowDatas.length; i++) {
                var rowData = rowDatas[i];
                if (rowData.id == rowid) {
                    rowDatas.splice(i, 1);
                    i--;
                }
            }

            cacheData.rows = rowDatas;
            this[0].addJSONData(cacheData);

        },

        /**
         * 设置一行数据
         * @param rowid 行号
         * @param rowdata  数据
         */
        setRowData : function(rowid, rowdata) {
            try {
                if (typeof(rowdata) == "string") {
                    rowdata = eval('(' + rowdata + ')');
                }
            } catch(e) {
                this[0].o.error("数据格式不正确！", e);
                return;
            }
            var colModel = this[0].o.colModel;
            var cacheData = this[0].getCacheData() == undefined ? new Object() : this[0].getCacheData();

            var tempData = [];
            for (var i = 0; i < colModel.length; i++) {
                var name = colModel[i].name;
                tempData[i] = rowdata[name] == undefined ? " " : rowdata[name];
            }

            var rowDatas = cacheData.rows;
            if (rowDatas != undefined) {
                for (var i = 0; i < rowDatas.length; i++) {
                    var rowData = rowDatas[i];
                    if (rowData.id == rowid) {
                        rowData.cell = tempData;
                        rowDatas[i] = rowData;
                    }
                }
            } else {
                this[0].o.error("记录为空");
            }

            cacheData['rows'] = rowDatas;
            this[0].addJSONData(cacheData);
        },

        /**
         * 返回选择行数据
         */
        onSelectRow : function() {
            var grid = this[0];
            var _cacheSelectData = grid.getCacheSelectData();
            var selectRows = [];
            $.each(_cacheSelectData,function(key,data){
                selectRows.push(data);
            });
//            var selectRow = $(grid).find(".ui_grid_row_selected");
//            $.each(selectRow, function(i) {
//                var cellData = grid.getRowData(selectRow[i].getAttribute("data"));
//                selectRows[i] = cellData;
//            });



            return selectRows;
        },

        /**
         * 清除数据
         */
        clearGridData : function() {
            this[0].addJSONData("{}");
        },

        /**
         * 获取行数据
         * @param id
         */
        getRowData : function(id) {
            return this[0].getRowData(id)
        },

        /**
         * 获取配置
         */
        getOptions : function(){
            return this[0].o;
        },

        /**
         * 获取表格所有数据
         * @return {Array}
         */
        getAllRowData : function(){
            var datas = [];
            var colModel = this.getOptions().colModel;
            var cacheDatas = this[0].getCacheData().rows;
            $.each(cacheDatas,function(i) {
                var cacheData = cacheDatas[i].cell;
                var rowData = {};
                for(var j=0; j<cacheData.length; j++){
                    if(colModel[j] != undefined){
                        rowData[colModel[j].index] = cacheData[j];
                    }
                }
                datas.push(rowData);
            });
            return datas;
        },

        selectRow : function(id,flag){
            var grid = this[0];
            grid.selectRow(id,flag);
        }
    });

})(jQuery);
//获取绝对坐标
function getElePos(aim){
	var t = 0;
	var l = 0;
	while(aim)
    {
	  t += aim.offsetTop;
	  l += aim.offsetLeft;
	  aim = aim.offsetParent;            
    } 	
	return [l, t];
}
//获得滚动条的长度
function getEleScroll(aim){
	var t = 0;
	var l = 0;
	aim = aim.parentNode;
	while(aim.nodeName!="HTML"){
		t += aim.scrollTop;
		l += aim.scrollLeft;
		aim = aim.parentNode;
	}
	return [l,t];
}
//显示提示条
function showTip(event,tooltip){
	var obj=event.srcElement ? event.srcElement : event.target;
	if(tooltip!='') {
		$("#altlayer").css("visibility","visible");
		var cord = getElePos(obj);
		var scrollcord = getEleScroll(obj);
		var absolute_left = cord[0]-scrollcord[0];
		var absolute_top = cord[1]-scrollcord[1];
		$("#altlayer").css("left",absolute_left+obj.offsetWidth/3);
		$("#altlayer").css("top",absolute_top-obj.offsetHeight*2);		
		$("#altlayer").css("zIndex",obj.style.zIndex + 999999999999999);
		$("#altlayer").empty();
		$("#altlayer").append(tooltip);
	}
}
//隐藏提示条
function hideTip(){
	$("#altlayer").css("visibility","hidden");
}