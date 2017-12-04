/**
 * 表格的封装
 */
var GRID = {
    version: "0.1", //表格版本
    provider: "jqGrid"//表格提供者
};

var $_grids = [];

//绑定页面resize事件
/*
 $(window).bind('resize',
 function() {
 for (var i = 0; i < $_grids.length; i++) {
 var g = $_grids[i];
 if (g.getGridParam()['parentwidth']) {
 g.setGridWidth(g.parent().width() * 96.5 / 100);
 } else {
 g.setGridWidth($(window).width() * 96.5 / 100);
 }
 }
 }).trigger('resize');
 */
//在页面关闭的时候清空缓存
$(window).bind('unload',
        function () {
            $_grids = [];
        }).trigger('unload');


GRID.convertPostData = function (postData) {
    if (postData == null || postData == undefined)
        return "";
    var tmp = "";
    if (postData["page"] != undefined)
        tmp += "&page=" + postData["page"];
    if (postData["sidx"] != undefined)
        tmp += "&orderField=" + postData["sidx"];
    if (postData["sord"] != undefined)
        tmp += "&orderType=" + postData["sord"];
    if (postData["rows"] != undefined)
        tmp += "&pageSize=" + postData["rows"];
    return tmp;
};

GRID.addPostData2Form = function (formName, pdata) {
    var form = $("form[name='" + formName + "']");
    if ("true" != form.attr("_pdata_added")) {
        if ($("form[name='" + formName + "'] input[name='page']").length == 0)
            form.append("<input type=\"hidden\" name=\"page\">");
        if ($("form[name='" + formName + "'] input[name='pageSize']").length == 0)
            form.append("<input type=\"hidden\" name=\"pageSize\" value=\"20\">");
        if ($("form[name='" + formName + "'] input[name='orderField']").length == 0)
            form.append("<input type=\"hidden\" name=\"orderField\">");
        if ($("form[name='" + formName + "'] input[name='orderType']").length == 0)
            form.append("<input type=\"hidden\" name=\"orderType\">");
        if ($("form[name='" + formName + "'] input[name='_sysCode']").length == 0)
            form.append("<input type=\"hidden\" name=\"_sysCode\">");

        form.attr("_pdata_added", "true");
    }
    if (pdata["page"] != undefined)
        $("form[name='" + formName + "'] input[name='page']").attr("value", pdata["page"]);
    if (pdata["sidx"] != undefined)
        $("form[name='" + formName + "'] input[name='orderField']").attr("value", pdata["sidx"]);
    if (pdata["sord"] != undefined)
        $("form[name='" + formName + "'] input[name='orderType']").attr("value", pdata["sord"]);
    if (pdata["rows"] != undefined)
        $("form[name='" + formName + "'] input[name='pageSize']").attr("value", pdata["rows"]);
    if (CORE != undefined)
        $("form[name='" + formName + "'] input[name='_sysCode']").attr("value", CORE.syscode);

};

/**
 * 根据提供的dataSource在容器id中重新创建一个数据表格
 * @param {Object} id 容器ID
 * @param {Object} datasource 表格数据资源名称
 * @param {Object} params 附加参数
 * @param {Object} formName 表单名称
 */
GRID.rebuild = function (id, dataSource, gridParams, formName) {
	$(id).GridUnload();
	GRID.create(id,dataSource,gridParams,formName);
}

/**
 * 根据提供的dataSource在容器id中创建一个数据表格
 * @param {Object} id 容器ID
 * @param {Object} datasource 表格数据资源名称
 * @param {Object} params 附加参数
 * @param {Object} formName 表单名称
 */
GRID.create = function (id, dataSource, gridParams, formName) {
    if ($("form[name='" + formName + "']").length == 0)
        $("body").append("<form name=\"" + formName + "\"></form>");
    //alert($("form[name='"+formName+"']").serialize());
    var params = CORE.jsonClone(gridParams);//李嘉伟 2013-04-12 修改重建列表动态添加列的BUG
    params['datatype'] = function (pdata) {
        jQuery('body').showLoading({
            'addClass': 'loading-indicator-bars'
        });
        GRID.addPostData2Form(formName, pdata);
        $.ajax({
            url: 'framework.do?ds=' + dataSource + "&_t=" + new Date(),
            data: $("form[name='" + formName + "']").serialize() + "&_t=" + new Date(),
            //data:pdata,
            dataType: "json",
            complete: function (data, stat) {
                jQuery('body').hideLoading();
                if (stat == "success") {
                    var thegrid = jQuery(id);
                    var jsonData = CORE.str2json(data.responseText);
                    if (jsonData.header.code == 0) {
                        if (jsonData.body["rows"] == undefined || jsonData.body["rows"].length == 0)
                            CORE.tip("没有加载到数据记录");
                        thegrid[0].addJSONData(jsonData.body);
                        if (typeof gridParams["loadComplete"] === "function")
                            gridParams["loadComplete"](jsonData.body);
                    } else {
                        jQuery('body').hideLoading();
                        CORE.error("装载表格数据发生错误", JSON.stringify(jsonData.body));
                    }
                }
                $('.ui-jqgrid-btable tr:odd').addClass('odd');
                $('.ui-jqgrid-btable tr:even').addClass('even');
            },
            error: function (data) {
                jQuery('body').hideLoading();
                var jsonData = CORE.str2json(data.responseText);
                CORE.error("装载表格数据发生错误", JSON.stringify(jsonData.body));
            }

        });
    };
    params['mtype'] = "POST";
    params['height'] = params["height"] || "100%";
    params['width'] = params['width'] || "100%";
    //alert(jQuery('body').width());
    //params['width'] = jQuery('body').width();
    params['viewrecords'] = params['viewrecords'] || true;
    params['sortorder'] = params['sortorder'] || 'desc';
    params['caption'] = params['caption'] || '森锐框架表格';
    params['cellEdit'] = params['cellEdit'] || false;
    params['multiselect'] = params['multiselect'] || false;
    params['enableSearch'] = false;
    params['loadui'] = "block";
    if (params['shrinkToFit'] == undefined)
        params['shrinkToFit'] = true; //李嘉伟 2012-3-12 修改,该参数决定了表格是否有水平滚动条.将由外部控制
    //李嘉伟 2012-12-11 修改,添加参数决定是否全数据展示
    if (params['paging'] == undefined || params['paging']) {
        params['rowNum'] = params['rowNum'] || 15;
        params['rowList'] = params['rowList'] || [10, 15, 20, 30];
        params['pager'] = params['pager'] || '#pagerdt';
    }else
    	params['rowNum'] = '';

    //表格formatter函数获取表格数据格式转换，由通过下标获取数据转换为由键获取数据，键值为colModel的index属性
    var _colModels = params['colModel'];
    for (var i = 0; i < _colModels.length; i++) {
        var _colModel = _colModels[i];
        if (typeof(_colModel['formatter']) === "function") {
            (function () {
                var _formatter = _colModel['formatter'];
                _colModel['formatter'] = function (cellValue, options, rowObject, tr, td) {
                    var _rowObject = {};
                    if (rowObject.length != undefined) {
                        //应该使用colModel的长度来设置键，为了兼容先前先前不规范取数方式，故使用rowObject长度设置键
                        for (var j = 0; j < rowObject.length; j++) {
                            //由于使用rowObject长度设置键，可能出现越界现象，因此需要对取键名时做判断
                            if (_colModels[j] != undefined) {
                                _rowObject[_colModels[j]['index']] = rowObject[j];
                            }
                            _rowObject[j] = rowObject[j];
                        }
                    }
                    else {
                        _rowObject = rowObject;
                    }
                    return _formatter(cellValue, options, _rowObject, tr, td);
                }
            })();
        }
    }

    if (params["colNames"] == null || params["colNames"] == undefined) {
        params["colNames"] = [];
        $.each(params["colModel"], function (i, n) {
            if (n["label"] != null && n["label"] != undefined && n["label"] != "")
                params["colNames"].push(n["label"]);
            else
                params["colNames"].push(n["name"]);
        });
    }

    //计算宽度
    var _percent = 96.5;
    if ((typeof(params["width"]) === 'string') && params["width"].indexOf("%") != -1) {
        _percent = parseFloat(params["width"].substring(0, params["width"].indexOf("%")));
    }
    //alert(_percent);
    if (params['parentwidth']) {
        params['width'] = $(id).parent().width() * _percent / 100;
    } else if (!params["width"] || ((typeof(params["width"]) === 'string') && params["width"].indexOf("%") != -1)) {
        //没有指定宽度，或者指定了百分比宽度
        params['width'] = $(window).width() * _percent / 100;
    }

    //多级表头
    var groupDataOrg = params["groupData"];
    if (groupDataOrg == null || groupDataOrg == undefined) {
        groupDataOrg = {};
        for (var i = 0; i < params["colNames"].length; i++) {
            groupDataOrg[params["colNames"][i]] = [];
        }
    }
    params["groupData"] = GRID.getGroupData(groupDataOrg, params["colModel"]);
    //alert(CORE.json2str(groupDataOrg));

    jQuery(id).jqGrid(params);

    var pager = params["pager"];
    jQuery(id).jqGrid('navGrid', pager, {
        edit: false, //params['edit'] || false,
        add: false, //params['add'] || false,
        del: false, //params['del'] || false,
        search: false,
        refresh: false
    });
    jQuery(id).jqGrid('navButtonAdd', pager, {
        caption: "刷新",
        onClickButton: function () {
            //jQuery(id).jqGrid('setColInfos');
            $(id).trigger("reloadGrid");
        },
        buttonicon: "ui-icon-refresh"
    });
    /*
     jQuery(id).jqGrid('navButtonAdd', pager, {
     caption:"选择列",
     onClickButton:function () {
     jQuery(id).jqGrid('columnChooser');
     }
     });
     */

    //建立多级表头
    GRID.buildGroupHeader(id, params);

    //设置冻结列
    try {
        jQuery(id).jqGrid('setFrozenColumns');
    } catch (e) {
    }
    var g = $(id);
    //加入到缓存
    $_grids.push(g);

    //$(window).trigger('resize');
    /*
     if (gridParams['parentwidth']) {
     g.setGridWidth(g.parent().width() * 96.5 / 100);
     } else {
     g.setGridWidth($(window).width() * 96.5 / 100);
     }
     */
    return g;
};

/**
 * 获取表格中选中的数据
 * @param {Object} gridId 表格ID
 * @param {Object} colName 列名称
 * @return
 */
GRID.getSelectRow = function (gridId, colName) {
    var _grid_obj = $("#" + gridId);
    var rowid = _grid_obj.getGridParam("selarrrow");
    var datas = [];
    for (var i = 0; i < rowid.length; i++) {
        var _rd__ = _grid_obj.getRowData(rowid[i]);
        if (colName != null && colName != undefined) {
            datas.push(_rd__[colName]);
        } else {
            datas.push(_rd__);
        }
    }
    return datas;
};

/**
 * 选定指定行
 * @param {Object} gridId 表格ID
 * @param {Object} rowid 要选中的行号
 */
GRID.selectRow = function (gridId,rowIds) {
    var _grid_obj = $("#" + gridId);
    if(rowIds!=undefined && rowIds != null){
        for(var i=0; i<rowIds.length; i++){
            _grid_obj.setSelection(rowIds[i]);
        }
    }
    var _row_ids_ = _grid_obj.getGridParam("selarrrow");
    var datas = [];
    for(var j=0; j<_row_ids_.length; j++){
        var rowData = _grid_obj.getRowData(_row_ids_[j]);
        datas.push(rowData);
    }
    return datas;
};

/**
 *
 * @param {Object} gridId 表格ID
 * @param {Object} dataSource
 * @param {Object} params
 */
GRID.reload = function (gridId) {
    var _postData =  $("#" + gridId).getGridParam("postData");
    _postData.page = "1";
    $("#" + gridId).setGridParam(_postData);

    $("#" + gridId).trigger("reloadGrid");
};


/**
 * 生成表格内部按钮的html
 * @param opt
 * url              要跳转的URL
 * onclick          单击事件
 * className        按钮样式
 * title            提示信息
 * label            标签
 * @return 返回表格中的按钮HTML内容
 */
GRID.button = function (opt) {
    return "<a href='" + (opt["url"] ? opt["url"] : "javascript://noop/") + "' onclick=\"" +
            (opt["onclick"] ? opt["onclick"].replaceAll("\"", "\\\"") : "") + "\" class=\"grid_btn " +
            (opt["className"] ? opt["className"] : "") + "\" title=\"" + (opt["title"] ? opt["title"] : "") + "\">" +
            (opt["label"] ? opt["label"] : "") + "</a>"
};


/*====================================================================================================
 * 以下是生成多级表头结构数据的算法，以及替换jqGrid表头的实现
 *
 =====================================================================================================*/

/**
 * 遍历多级表头结构定义数据，并生成一个map，map的格式为：
 * {
 *     "L_1_A":{"name":"L_1_A","parent":""},
 *     "L_1_B":{"name":"L_1_B","parent":""},
 *     "L_2_A":{"name":"L_2_A","parent":"L_1_A"},
 *     "L_2_B":{"name":"L_2_B","parent":"L_1_A"},
 *     "L_2_C":{"name":"L_2_C","parent":"L_1_B"},
 *     "L_2_D":{"name":"L_2_D","parent":"L_1_B"},
 *     "L_3_A":{"name":"L_3_A","parent":"L_2_D"},
 *     "L_3_B":{"name":"L_3_B","parent":"L_2_D"}
 * }
 *
 * @param data 多级表头定义数据，遵循下面的格式：
 * {
 *    "L_1_A":["L_2_A","L_2_B"],
 *    "L_1_B":["L_2_C","L_2_D"],
 *    "L_2_D":["L_3_A","L_3_B"]
 * }
 * 上面的数据中，最底层的列应当按照colModel中出现的顺序进行组织。
 *
 */
GRID.getGroupTreeInfo = function (data) {
    var _allmap = {};
    $.each(data, function (i, n) {
        var _n = _allmap[i];
        if (_n == null) {
            _n = {"name": i, "parent": ""};
            _allmap[i] = _n;
        }
        $.each(n, function (j, m) {
            var _m = _allmap[m];
            if (_m == null) {
                _m = {"name": m, "parent": i};
                _allmap[m] = _m;
            } else {
                _m["parent"] = i;
            }
        });
    });

    return _allmap;
};

/**
 * 用从下往上递归的方式找计算每个节点的深度depth
 * 算法：
 * 1. 如果存在上级节点，则深度为上级节点的深度+1
 * 2. 如果不存在上级节点，则深度为1
 *
 * @param map
 * @param node
 */
GRID.getParentDepth = function (map, node) {
    var _p = map[node["parent"]];
    if (_p == null || _p == undefined)
        return 0;
    else if (_p["depth"] == null || _p["depth"] == undefined)
        _p["depth"] = GRID.getParentDepth(map, _p) + 1;

    return _p["depth"];
};

/**
 * 处理多级表头中某个树节点的相关信息，包括
 * isparent     根据是否包含子元素决定true/false
 * colspan      包含的下级列的数量（隐藏列将被忽略）
 * colIndex     对应colModel中的列，只有isparent为false的时候才会处理
 * @param map   所有表头节点的Map数据
 * @param node  要处理的节点数据
 * @param modelMap  根据colModel转换得到的Map对象
 */
GRID.calcColDatas = function (map, node, modelMap) {
    var _colspan = 0;
    $.each(map, function (i, n) {
        if (n["parent"] == node["name"]) {
            if (n["calc_status"] == null || n["calc_status"] == undefined || !n["calc_status"])
                GRID.calcColDatas(map, n, modelMap);
            _colspan += n["colspan"];
        }
    });
    if (_colspan == 0) {
        node["isparent"] = false;
        //考虑隐藏的列
        var _tmpModel = modelMap[node["name"]];
        node["colspan"] = (_tmpModel != null && _tmpModel != undefined && _tmpModel["hidden"] == true) ? 0 : 1;
        node["colIndex"] = (_tmpModel != null && _tmpModel != undefined) ? _tmpModel["colIndex"] : -1;
    } else {
        node["isparent"] = true;
        node["colspan"] = _colspan;
    }
    node["calc_status"] = true;
};

/**
 * 生成多级表头的结构，结构如下：
 *
 *[
 *    {
 *        "L_1_A":{"colspan":"2","rowspan":"1","isparent":"true","width":"","colIndex":"-1"},
 *        "L_1_B":{"colspan":"3","rowspan":"1","isparent":"true","width":"","colIndex":"-1"}
 *    },
 *    {
 *        "L_2_A":{"colspan":"1","rowspan":"2","isparent":"false","width":"","colIndex":"0"},
 *        "L_2_B":{"colspan":"1","rowspan":"2","isparent":"false","width":"","colIndex":"1"},
 *        "L_2_C":{"colspan":"1","rowspan":"2","isparent":"false","width":"","colIndex":"2"},
 *        "L_2_D":{"colspan":"2","rowspan":"1","isparent":"true","width":"","colIndex":"-1"}
 *    },
 *    {
 *        "L_3_A":{"colspan":"1","rowspan":"1","isparent":"false","width":"","colIndex":"3"},
 *        "L_3_B":{"colspan":"1","rowspan":"1","isparent":"false","width":"","colIndex":"4"}
 *    }
 *]
 *
 * 上面的数据中，表示这个多级表头共有3级，总共有5列，
 * 第一级有两列，第一列包含3列，第二列包含2列
 * 第二级有4列，第一、二、三列都是最底层的列，colIndex对应colModel中的位置（从0开始），第四列包含2列
 * 第三级有两列，分别对应colModel中位置为4、5的列
 *
 * isparent表示了是否最底层的列，最底层的列必须能对应到colModel中的列
 * width属性目前没有使用
 *
 * @param data
 * @param colModel
 */
GRID.getGroupData = function (data, colModel) {
    var _rows = [];
    var _maxDepth = 1;
    var _colModel = {};
    for (var i = 0; i < colModel.length; i++) {
        _colModel[colModel[i]["name"]] = colModel[i];
        colModel[i]["colIndex"] = i;
    }
    var _map = GRID.getGroupTreeInfo(data);

    //计算深度，从上而下
    $.each(_map, function (i, n) {
        if (n["depth"] == null || n["depth"] == undefined)
            n["depth"] = GRID.getParentDepth(_map, n) + 1;
        if (_maxDepth < n["depth"])
            _maxDepth = n["depth"];
    });

    //计算每层节点的广度，从下而上
    $.each(_map, function (i, n) {
        GRID.calcColDatas(_map, n, _colModel);
        var _rm = _rows[n["depth"] - 1];
        if (_rm == null) {
            _rm = {};
            _rows[n["depth"] - 1] = _rm;
        }
        _rm[n["name"]] = {
            "colspan": n["colspan"],
            "rowspan": n["isparent"] ? 1 : _maxDepth - n["depth"] + 1,
            "isparent": n["isparent"],
            "width": n["width"],
            "colIndex": n["colIndex"]
        }
    });

    return _rows;
};


/**
 * 根据已经生成的多级表头数据生成对应结构的表头，并将jqGrid的表头进行替换
 * 1. 最底层的表头使用clone从原有表头复制过来，使用clone可保留其事件
 * 2. 原有表头需要保留，并必须在表头的第一行（只将该行高度设置为1），因为表头table的table-layout为fixed，个列的宽度将由第一行的列决定，
 *    在多级表头的情况下显然会由于列宽不确定而导致错位的问题
 * 3. 如果打开多选模式，还要增加一列
 * 4. 这里重写了jqGrid的dragEnd事件处理函数，以接管列大小修改的功能
 * 5. 在表头table中替换掉表头行之后，还需要重新设置 jqGrid 的headers属性的值
 * @param gridId jqGrid表格ID
 * @param params jqGrid表格的参数
 */
GRID.buildGroupHeader = function (gridId, params) {
    //不需要构建多级表头，直接返回
    if (params["groupData"] == null || params["groupData"] == undefined || params["groupData"].length == 1)
        return;
    //var $_htable = $("table[aria-labelledby='gbox_"+gridId+"']");
    //alert(CORE.json2str(groupData));
    if (gridId.indexOf("#") != -1)
        gridId = gridId.substring(1, gridId.length);
    var $_htable = $("#gview_" + gridId).find(".ui-jqgrid-htable").children("thead");
    //var $_htable = $("table[aria-labelledby='gbox_"+gridId+"']").children("thead");
    $_htable.attr("grid_id", gridId);
    //alert($_htable.html());
    $_htable.find("tr").attr("id", "__old_header");
    //$_htable.parent().css({"table-layout":"auto !important"});
    //alert($("#"+gridId)[0].p.colModel[0].name);
    $_grid = $("#" + gridId)[0].grid;
    //alert($_grid.dragEnd);
    $_grid.dragEnd = function () {
        var p = $("#" + gridId)[0].p;
        this.hDiv.style.cursor = "default";
        if (this.resizing) {
            var idx = this.resizing.idx,
                    nw = this.headers[idx].newWidth || this.headers[idx].width;

            nw = parseInt(nw, 10);
            this.resizing = false;
            $("#rs_m" + $.jgrid.jqID(p.id)).css("display", "none");
            p.colModel[idx].width = nw;
            this.headers[idx].width = nw;
            //this.headers[idx].el.style.width = nw + "px";
            this.headers[idx].elOrg.style.width = nw + "px";
            this.cols[idx].style.width = nw + "px";
            if (this.footers.length > 0) {
                this.footers[idx].style.width = nw + "px";
            }
            if (p.forceFit === true) {
                nw = this.headers[idx + p.nv].newWidth || this.headers[idx + p.nv].width;
                this.headers[idx + p.nv].width = nw;
                this.headers[idx + p.nv].el.style.width = nw + "px";
                this.cols[idx + p.nv].style.width = nw + "px";
                if (this.footers.length > 0) {
                    this.footers[idx + p.nv].style.width = nw + "px";
                }
                p.colModel[idx + p.nv].width = nw;
            } else {
                p.tblwidth = this.newWidth || p.tblwidth;
                $('table:first', this.bDiv).css("width", p.tblwidth + "px");
                $('table:first', this.hDiv).css("width", p.tblwidth + "px");
                this.hDiv.scrollLeft = this.bDiv.scrollLeft;
                if (p.footerrow) {
                    $('table:first', this.sDiv).css("width", p.tblwidth + "px");
                    this.sDiv.scrollLeft = this.bDiv.scrollLeft;
                }
            }
            if ($.isFunction(p.resizeStop)) {
                p.resizeStop.call(this, nw, idx);
            }
        }
        this.curGbox = null;
        document.onselectstart = function () {
            return true;
        };
    };
    //alert($_grid.headers);
    $.each(params["groupData"], function (i, n) {
        var $tr = $("<tr>");
        if (i == 0 && params["multiselect"]) {
            var $cbTh = $_htable.find("#" + gridId + "_cb").clone(true);
            $cbTh.attr("rowspan", params["groupData"].length);
            $tr.append($cbTh);
        }
        $.each(n, function (j, m) {
            var $th;
            var $oldTh = $_htable.find("#" + gridId + "_" + j);
            if (m["isparent"]) {
                $th = $("<th>").addClass("ui-state-default ui-th-column-header ui-th-ltr").css({"height": "22px", "border-top-width": "0px", "border-top-style": "none", "border-top-color": "initial"}).html(j);
                if (m["colspan"] > 1)$th.attr("colspan", m["colspan"]);
            } else {
                $th = $oldTh.clone(true);
                if (m["rowspan"] > 1)$th.attr("rowspan", m["rowspan"]);
                //$oldTh.html("").height(0);
                //alert(j+"   "+$($_grid.headers[m["colIndex"]].el).html());
                if (m["colIndex"] >= 0) {
                    var _idx = m["colIndex"];
                    if (params["multiselect"])
                        _idx += 1;
                    $_grid.headers[_idx].el = $th[0];
                    $_grid.headers[_idx]["elOrg"] = $oldTh[0];
                }
            }
            $tr.append($th);
        });
        $_htable.append($tr);
    });
    $("tr:first", $_htable).removeAttr("class").attr("style", "height:auto;");
    $("tr:first th", $_htable).each(function (i) {
        $(this).html("").height(0);
    });
};

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * 多级表头算法结束
 *
 =====================================================================================================*/