/**
 * User: bearangel
 * 查询管理JS
 **/

var _sysCode = "";
var queryTree = null;//模块树
var queryTreeForSearch = null; //搜索区域的模块树
//var queryTreeForAdd = null; //添加对话框中的
var queryProCfgGrid = null; //处理器配置列表
var queryProGrid = null; // 处理器列表
var queryExeGrid = null; //执行器列表
var queryProParamGrid = null; //处理器参数列表
var queryProDlgStatus = true; //状态码，用于是否关闭处理器配置对话框，关闭：true，不关闭：false

var queryMangerGridParam = {
    //colNames:["ID","查询名称" , "查询编码" , "业务系统" , "模块" , "编辑状态" , "当前编辑用户" , "创建人" ,                "创建时间" , "最后修改人" , "最后修改时间" , "操作"],
    colModel:[
        {
            name:"ID",
            index:"ID",
            width:100,
            hidden:true
        },
        {
            name:"查询名称",
            index:"cq.NAME",
            width:100,
            formatter:function (cell, options, row, tr, td) {
                return "<a href='javascript:void(0);' onclick='_editorQuery(\"" + row['ID'] + "\")'>" + row['cq.NAME'] +
                        "</a>";
            }
        },
        {
            name:"查询编码",
            index:"CODE",
            width:150
        },
        {
            name:"业务系统",
            index:"SYS_CODE",
            width:100
        },
        {
            name:"模块",
            index:"MODULE_ID",
            width:70
        },
        {
            name:"创建人",
            index:"CREATE_USER",
            width:100
        },
        {
            name:"创建时间",
            index:"CREATE_DATE",
            width:120
        },
        {
            name:"最后修改人",
            index:"LAST_EDIT_USER",
            width:120
        },
        {
            name:"最后修改时间",
            index:"LAST_EDIT_DATE",
            width:120
        },
        {
            name:"当前编辑用户",
            index:"EDIT_USER",
            width:120
        },
        {
            name:"编辑状态",
            index:"EDIT_STATUS",
            width:100,
            formatter:function (cell, options, row, tr, td) {
                var _status = "";
                if (row['EDIT_STATUS'] == "0") {
                    _status = "编辑中"
                } else if (row['EDIT_STATUS'] == "1") {
                    _status = "已提交"
                }
                return _status;
            }
        },
        {
            name:"EDIT_USER",
            index:"EDIT_USER",
            hidden:true
        },
        {
            name:"操作",
            index:"operate",
            width:180,
            sortable:false,
            formatter:function (cell, options, row, tr, td) {
                return GRID.button({className:"btn_edit", onclick:"_editorQuery('" + row["ID"] + "');", title:"修改查询"}) +
                        GRID.button({className:"btn_delete", onclick:"_delQuery('" + row["ID"] + "','" + row["cq.NAME"] +
                                "');", title:"删除查询"}) +
                        GRID.button({className:"btn_processor", onclick:"_openQueryProCfgDialog('" + row["ID"] +
                                "');", title:"处理器设置"}) +
                        GRID.button({className:"btn_sync",onclick:"_syncQuery('"+row["ID"]+"','"+row["SYS_CODE"]+"');",title:"同步"})+
                        GRID.button({className:"btn_commit u_" + row["EDIT_STATUS"] + "_" +
                                row["EDIT_USER"], onclick:"_versionCommit('" + row["ID"] + "','" + row['SYS_CODE'] +
                                "');", title:"提交更改"}) +
                        GRID.button({className:"btn_undo u_"+row["EDIT_STATUS"]+"_"+row["EDIT_USER"],onclick:"_versionRevocation('"+row["ID"]+"','"+row["SYS_CODE"]+"','"+row["cq.NAME"]+"');",title:"撤销更改"});;
                /*
                 return "<input value='编辑' type='button' class='grid_button' onclick='_editorQuery(\"" + row['ID'] +"\")'>" +
                 "<input value='删除' type='button' class='grid_button' onclick='_delQuery(\"" + row['ID'] +"\",\"" + row['cq.NAME'] + "\")'>" +
                 "<input value='添加处理器' type='button' class='grid_button' onclick='_openQueryProCfgDialog(\"" + row['ID'] +"\")'>" +
                 "<input value='提交' type='button' class='grid_button commitBtn u_"+row["EDIT_STATUS"]+"_"+row["EDIT_USER"]+"' onclick='_versionCommit(\"" + row['ID'] +"\",\"" + row['SYS_CODE'] + "\")'>";
                 */
            }
        }
    ],
    caption:"查询管理列表",
    multiselect:true,
    width:1000,
    pager:"#pagerdt",
    loadComplete:queryListLoadComplete
};

//查询处理器配置列表
var queryProCfgGridParam = {
    colModel:[
        {
            name:"ID",
            index:"ID",
            width:100,
            hidden:true
        },
        {
            name:"处理器ID",
            index:"PROCESSOR_ID",
            width:100,
            hidden:true
        },
        {
            name:"处理器名字",
            index:"NAME",
            width:100,
            formatter:function (cell, options, row, tr, td) {
                if (row['PROCESSOR_ID'] == "-1") {
                    return "自定义处理器";
                } else {
                    return row['NAME'];
                }

            }
        },
        {
            name:"自定义处理器",
            index:"PROCESSOR_CLASS",
            width:150
        },
        {
            name:"处理器类型",
            index:"TYPE",
            width:100,
            formatter:function (cell, options, row, tr, td) {
                if (row['TYPE'] == "0") {
                    return "预处理";
                } else if (row['TYPE'] == "1") {
                    return "后处理";
                }
            }
        },
        {
            name:"处理器顺序",
            index:"SEQ_NUM",
            width:120
        },
        {
            name:"是否中断",
            index:"BREAK_FLAG",
            width:100,
            formatter:function (cell, options, row, tr, td) {
                if (row['BREAK_FLAG'] == "0") {
                    return "不中断";
                } else if (row['BREAK_FLAG'] == "1") {
                    return "中断";
                }
            }
        },
        {
            name:"备注",
            index:"NOTE",
            width:120
        },
        {
            name:"操作",
            index:"operate",
            width:40,
            sortable:false,
            align:"center",
            formatter:function (cell, options, row, tr, td) {
                if (row['PROCESSOR_ID'] == "-1") {
                    row['NAME'] = "自定义处理器";
                }
                return GRID.button({className:"btn_edit", onclick:"_editorQueryProcessorDialog('" + row["ID"] +
                        "');", title:"修改处理器"}) +
                        GRID.button({className:"btn_delete", onclick:"_delQueryProcessor('" + row["ID"] + "','" +
                                row["NAME"] + "');", title:"删除处理器"});
                /*
                 return "<input value='修改' type='button' class='grid_button' onClick='_editorQueryProcessorDialog(\"" + row['ID'] +"\")'>" +
                 "<input value='删除' type='button' class='grid_button' onClick='_delQueryProcessor(\"" + row['ID'] + "\",\"" + row['NAME'] +"\")'>";
                 */
            }
        }
    ],
    caption:"查询执行器列表",
    multiselect:false,
    width:775,
    pager:"#queryProcessorCgfPagerdt"
};

//查询处理器列表
var queryProGridParam = {
    colModel:[
        {
            name:"ID",
            index:"ID",
            width:100,
            hidden:true
        },
        {
            name:"处理器名字",
            index:"NAME",
            width:50
        },
        {
            name:"处理器编码",
            index:"CODE",
            width:100
        },
        {
            name:"处理器类名",
            index:"CLASS",
            width:150
        },
        {
            name:"处理器说明",
            index:"NOTE",
            width:120
        },
        {
            name:"操作",
            index:"operate",
            width:150,
            sortable:false,
            align:"center",
            formatter:function (cell, options, row, tr, td) {
                return "<input value='选择' type='button' class='grid_button' onclick='_selectQueryPro(" +
                        CORE.json2str(row) + ");'>";
            }
        }
    ],
    caption:"查询执行器列表",
    multiselect:false,
    width:775,
    pager:"#queryProcessorPagerdt"
};

//查询执行器列表参数
var queryExeGridParam = {
    colNames:["执行器ID", "执行器名称" , "执行器编码" , "执行器类名" , "结果类型" , "执行器说明" , "操作"],
    colModel:[
        {
            name:"执行器ID",
            index:"ID",
            width:80,
            hidden:true
        },
        {
            name:"执行器名称",
            index:"NAME",
            width:70
        },
        {
            name:"执行器编码",
            index:"CODE",
            width:70
        },
        {
            name:"执行器类名",
            index:"CLASS",
            width:150
        },
        {
            name:"结果类型",
            index:"RESULTS",
            width:70
        },
        {
            name:"执行器说明",
            index:"NOTE",
            width:80
        },
        {
            name:"操作",
            index:"operate",
            width:50,
            sortable:false,
            formatter:function (cell, options, row, tr, td) {
                return "<input value='选择' type='button' class='grid_button' onClick='_onSelectQueryExe(" +
                        CORE.json2str(row) + ");'>";
            }
        }
    ],
    caption:"查询执行器列表",
    multiselect:false,
    width:750,
    pager:"#queryExePagerdt"
};


//查询执行器列表参数
var queryParamGridParam = {
    colModel:[
        {
            name:"ID",
            index:"ID",
            width:80,
            hidden:true
        },
        {
            name:"参数名称",
            index:"NAME",
            width:50
        },
        {
            name:"参数编码",
            index:"CODE",
            width:90
        },
        {
            name:"参数值",
            index:"VALUE",
            width:50,
            sortable:false
        },
        {
            name:"备注",
            index:"NOTE",
            width:80
        },
        {
            name:"操作",
            index:"operate",
            width:40,
            align:"center",
            sortable:false,
            formatter:function (cell, options, row, tr, td) {
                return GRID.button({className:"btn_edit", onclick:"_editorQueryParam('" + row["ID"] +
                        "');", title:"修改查询参数"}) +
                        GRID.button({className:"btn_delete", onclick:"_delQueryParam('" + row["ID"] + "','" + row["NAME"] +
                                "');", title:"删除查询参数"});
                /*
                 return "<input value='编辑' type='button' class='grid_button' onClick='_editorQueryParam(\""+row['ID']+"\")'>" +
                 "<input value='删除' type='button' class='grid_button' onClick='_delQueryParam(\""+row['ID']+"\",\""+row['NAME']+"\")'>";
                 */
            }
        }
    ],
    caption:"查询执行器列表",
    multiselect:false,
    width:715,
    pager:"#queryParamPagerdt"
};

//查询语句列表参数
var queryStmtGridParam = {
    colModel:[
        {
            name:"ID",
            index:"ID",
            width:80,
            hidden:true
        },
        {
            name:"查询ID",
            index:"QUERY_ID",
            width:50,
            hidden:true
        },
        {
            name:"执行顺序",
            index:"ORDER_NUM",
            width:20,
            sortable:false
        },
        {
            name:"查询语句",
            index:"STMT",
            width:90,
            sortable:false
        },
        {
            name:"设计数据",
            index:"DESIGN_DATA",
            width:50,
            hidden:true
        },
        {
            name:"操作",
            index:"operate",
            width:20,
            align:"center",
            sortable:false,
            formatter:function (cell, options, row, tr, td) {
                return GRID.button({className:"btn_edit", onclick:"_editorQueryStmtDlg('" + row["ID"] +
                        "');", title:"修改查询参数"}) +
                        GRID.button({className:"btn_delete", onclick:"_delQueryStmt('" + row["ID"] + "');", title:"删除查询参数"});
                /*
                 return "<input value='编辑' type='button' class='grid_button' onClick='_editorQueryParam(\""+row['ID']+"\")'>" +
                 "<input value='删除' type='button' class='grid_button' onClick='_delQueryParam(\""+row['ID']+"\",\""+row['NAME']+"\")'>";
                 */
            }
        }
    ],
    multiselect:false,
    width:715,
    pager:"#queryStmtPagerdt"
};


//处理器参数列表参数
var queryProcessorParamGridParam = {
    colModel:[
        {
            name:"ID",
            index:"ID",
            width:80,
            hidden:true
        },
        {
            name:"参数名称",
            index:"NAME",
            width:50
        },
        {
            name:"参数编码",
            index:"CODE",
            width:90
        },
        {
            name:"参数值",
            index:"VALUE",
            width:90
        },
        {
            name:"备注",
            index:"NOTE",
            width:80
        },
        {
            name:"操作",
            index:"operate",
            width:40,
            align:"center",
            sortable:false,
            formatter:function (cell, options, row, tr, td) {
                return GRID.button({className:"btn_edit", onclick:"_editQueryProcessorParam('" + row["ID"] +
                        "');", title:"修改执行器"}) +
                        GRID.button({className:"btn_delete", onclick:"_delQueryProcessorParam('" + row["ID"] + "','" +
                                row["NAME"] + "');", title:"删除执行器"});
                /*
                 return "<input value='编辑' type='button' class='grid_button' onClick='_editQueryProcessorParam(\""+row['ID']+"\")'>" +
                 "<input value='删除' type='button' class='grid_button' onClick='_delQueryProcessorParam(\""+row['ID']+"\",\""+row['NAME']+"\")'>";
                 */
            }
        }
    ],
    caption:"查询执行器列表",
    multiselect:false,
    width:530,
    pager:"#queryProcessorParamPagerdt"
};


//添加查询配置对话框配置
var _addQueryDlgOpt = {
    title:"添加查询配置",
    width:"820",
    height:"550",
    modal:true,
    bgiframe:true,
    resizable:false,
    buttons:{
        "取消":function () {
            $("#addQueryDialog").dialog("close");
        },
        "保存":function () {
            var sqlStmts = $("#addQueryDialog").find("textarea[name='sql_stmt_item']");
            var sqls = "";
            for(var i=0; i< sqlStmts.length; i++){
                if(i>0){
                    sqls += ";";
                }
                sqls += $(sqlStmts[i]).val();
            }
            $("#sql_stmt_add").text(sqls);

            var templateFlagArray = $("#addQueryDialog").find("input[name='templateFlag']");
            for(var i=0; i<templateFlagArray.length; i++){
                if(!$(templateFlagArray[i]).attr("checked")){
                    $(templateFlagArray[i]).val(0);
                    $(templateFlagArray[i]).attr("checked","true");
                }
            }

            CORE.submitForm("DS_ADD_CFG_QUERY", "addQueryForm", {}, function (body, header) {
                if (header.code == 0) {
                    CORE.tip("查询配置添加成功");
                    $("#addQueryDialog").dialog("close");
                    GRID.reload("queryManagerList");
                } else {
                    CORE.error("查询配置添加失败", body);
                }
            });
        }
    }
};


//编辑查询配置对话框配置
var _editorQueryDlgOpt = {
    title:"编辑查询配置",
    width:"750",
    height:"550",
    modal:true,
    bgiframe:true,
    resizable:false,
    buttons:{
        "取消":function () {
            $("#editorQueryDialog").dialog("close");
        },
        "保存":function () {
            _mergerStmt($("#queryStmtList"));
            CORE.submitForm("DS_CFG_QUERY_UPDATE", "editorQueryForm", {}, function (body, header) {
                if (header.code == 0) {
                    CORE.tip("查询配置编辑成功");
                    GRID.reload("queryManagerList");   //刷新参数列表
                    $("#editorQueryDialog").dialog("close");
                } else {
                    CORE.error("查询配置编辑失败", body);
                }
            });
        }
    }
};

//选择模块对话框配置
/*
 var _QueryTreeDlgOpt = {
 title:"选择模块",
 width:"400",
 height:"500",
 modal:true,
 bgiframe:true,
 resizable:false,
 buttons:{
 '清空':function () {
 $("#moduleName").val("");
 $("#moduleId").val("");
 $("#queryTreeDialog").dialog("close");
 }
 }
 };
 */

//执行器列表话框配置
var _QueryExeDlgOpt = {
    title:"查询执行器列表",
    width:"800",
    height:"470",
    modal:true,
    bgiframe:true,
    resizable:false,
    buttons:{
        "取消":function () {
            $("#queryExeDialog").dialog("close");
        },
        '使用自定义执行器':function () {
            $("input[name='executor_name']").val("自定义执行器");
            $("input[name='executor_id']").val("-1");
            $("input[name='executor_result']").val("自定义结果类型");
            $("#queryExeDialog").dialog("close");
        }
    }
};

//处理器配置列表话框配置
var _QueryProcessorCfgDlgOpt = {
    title:"处理器配置列表",
    width:"800",
    height:"400",
    modal:true,
    bgiframe:true,
    resizable:false,
    buttons:{
    }
};

//处理器列表话框配置
var _QueryProcessorDlgOpt = {
    title:"处理器列表",
    width:"800",
    height:"400",
    modal:true,
    bgiframe:true,
    resizable:false,
    buttons:{
        "取消":function () {
            $("#queryProcessorDialog").dialog("close");
        },
        '使用自定义处理器':function () {
            $("#processor_id").val("-1");
            $("#processor_name").val("自定义处理器");
            $("#queryProcessorDialog").dialog("close");
        }
    }
};

//添加处理器话框配置
var _addQueryProcessorDlgOpt = {
    title:"添加处理器配置",
    width:"560",
    height:"450",
    modal:true,
    bgiframe:true,
    resizable:false,
    buttons:{
        '取消':function () {
            $("#queryProcessorEditorDialog").dialog("close");
        },
        '保存':function () {
            CORE.submitForm("DS_CFG_QUERY_PROCESSOR_ADD", "queryProEditorForm", {}, function (body, header) {
                if (header.code == 0) {
                    CORE.tip("处理器配置添加成功");
                    GRID.reload("queryProcessorCfgList");
                    //设置查询ID queryID
                    $("#processorParamForm").find("input[name='query_id']").val($("#queryProEditorForm").find("input[name='query_id']").val());
                    $("#processorParamForm").find("input[name='processor_id']").val(body);
                    queryProDlgStatus = true;
                    //重置处理器参数表单
                    document.getElementById("processorParamForm").reset();
                    $("#processorParamDialog").dialog(_addProcessorParamDlgOpt);
//                    $("#queryProcessorEditorDialog").dialog("close");
                } else {
                    CORE.error("处理器配置添加失败", body);
                }
            });
        }
    }
};

//编辑处理器话框配置
var _editorQueryProcessorDlgOpt = {
    title:"编辑处理器配置",
    width:"560",
    height:"450",
    modal:true,
    bgiframe:true,
    resizable:false,
    buttons:{
        '取消':function () {
            $("#queryProcessorEditorDialog").dialog("close");
        },
        '保存':function () {
            CORE.submitForm("DS_CFG_QUERY_PROCESSOR_UPDATE", "queryProEditorForm", {}, function (body, header) {
                if (header.code == 0) {
                    CORE.tip("处理器配置修改成功");
                    GRID.reload("queryProcessorCfgList");
                    $("#queryProcessorEditorDialog").dialog("close");
                } else {
                    CORE.error("处理器配置修改失败", body);
                }
            });
        },
        '添加处理器参数':function () {
            //重置处理器参数表单
            document.getElementById("processorParamForm").reset();
            //设置处理器参数表单的查询ID，处理器ID
            $("#processorParamForm").find("input[name='query_id']").val($("#queryProEditorForm").find("input[name='query_id']").val());
            $("#processorParamForm").find("input[name='processor_id']").val($("#queryProEditorForm").find("input[name='id']").val());
            queryProDlgStatus = false;
            $("#processorParamDialog").dialog(_addProcessorParamDlgOpt);
        }
    }
};

//查询配置参数添加对话框
var _addQueryParamDlgOpt = {
    title:"添加查询配置参数",
    width:"550",
    height:"260",
    modal:true,
    bgiframe:true,
    resizable:false,
    buttons:{
        '取消':function () {
            $("#queryParamEditorDialog").dialog("close");
        },
        '保存':function () {
            CORE.submitForm("DS_ADD_CFG_QUERY_PARAMS", "queryParamEditorForm", {}, function (body, header) {
                if (header.code == 0) {
                    CORE.tip("查询配置参数添加成功");
                    GRID.reload("queryParamList");   //刷新参数列表
                    $("#queryParamEditorDialog").dialog("close");
                } else {
                    CORE.error("查询配置参数添加失败", body);
                }
            });
        }
    }
};


//查询配置参数编辑对话框
var _editorQueryParamDlgOpt = {
    title:"编辑查询配置参数",
    width:"550",
    height:"260",
    modal:true,
    bgiframe:true,
    resizable:false,
    buttons:{
        '取消':function () {
            $("#queryParamEditorDialog").dialog("close");
        },
        '保存':function () {
            CORE.submitForm("DS_CFG_QUERY_PARAM_UPDATE", "queryParamEditorForm", {}, function (body, header) {
                if (header.code == 0) {
                    CORE.tip("修改成功");
                    GRID.reload("queryParamList");   //刷新参数列表
                    $("#queryParamEditorDialog").dialog("close");
                } else {
                    CORE.error("修改失败", body);
                }
            });
        }
    }
};


//添加查询配置参数对话框
var _addProcessorParamDlgOpt = {
    title:"添加查询处理器参数",
    width:"500",
    height:"300",
    modal:true,
    bgiframe:true,
    resizable:false,
    buttons:{
        '取消':function () {
            $("#processorParamDialog").dialog("close");
            if (queryProDlgStatus) {
                $("#queryProcessorEditorDialog").dialog("close");
            }
        },
        '保存并关闭对话框':function () {
            CORE.submitForm("DS_CFG_QUERY_PROCESSOR_PARAM_ADD", "processorParamForm", {}, function (body, header) {
                if (header.code == 0) {
                    CORE.tip("添加成功");
                    GRID.reload("queryProcessorParamList");   //刷新参数列表
                    $("#processorParamDialog").dialog("close");
                    if (queryProDlgStatus) {
                        $("#queryProcessorEditorDialog").dialog("close");
                    }
                } else {
                    CORE.error("添加失败", body);
                }
            });
        },
        '保存并添加参数':function () {
            CORE.submitForm("DS_CFG_QUERY_PROCESSOR_PARAM_ADD", "processorParamForm", {}, function (body, header) {
                if (header.code == 0) {
                    CORE.tip("添加成功");
                    GRID.reload("queryProcessorParamList");   //刷新参数列表
                    document.getElementById("processorParamForm").reset();
                } else {
                    CORE.error("添加失败", body);
                }
            });
        }
    }
};

//编辑查询配置参数对话框
var _editProcessorParamDlgOpt = {
    title:"编辑查询处理器参数",
    width:"500",
    height:"300",
    modal:true,
    bgiframe:true,
    resizable:false,
    buttons:{
        '取消':function () {
            $("#processorParamDialog").dialog("close");
        },
        '保存':function () {
            CORE.submitForm("DS_CFG_QUERY_PROCESSOR_PARAM_UPDATE", "processorParamForm", {}, function (body, header) {
                if (header.code == 0) {
                    CORE.tip("添加成功");
                    GRID.reload("queryProcessorParamList");   //刷新参数列表
                    $("#processorParamDialog").dialog("close");
                } else {
                    CORE.error("添加失败", body);
                }
            });
        }
    }
};


//查询设计器对话框配置
var _queryBuilderDlgOpt = {
    title:"查询设计器",
    width:"850",
    height:"550",
    modal:true,
    bgiframe:true,
    resizable:false,
    buttons:{
        '关闭':function () {
            $("#queryBuilderDig").dialog("close");
        },
        '保存':function(){
            document.getElementsByName("queryBuilder")[1].svaStmt();
            $("#queryBuilderDig").dialog("close");
        }
    }
};

//页面加载后执行代码块
$(function () {
    //创建查询配置主表
    GRID.create("#queryManagerList", "DS_QUERY_MANAGER_LIST", queryMangerGridParam, "queryManagerForm");
    //创建查询配置参数表格
    GRID.create("#queryParamList", "DS_CFG_QUERY_PARAM_LIST", queryParamGridParam, "queryParamFrom");
    //创建查询配置参数表格
    GRID.create("#queryStmtList", "DS_QUERY_STMT_LIST", queryStmtGridParam, "queryParamFrom");
    //装载模块树
    queryTree = new ZTree("query_tree", "DS_QUERY_TREE", {nodeClicked:queryModuleSelect});

    //在添加查询参数按钮上绑定点击事件。该事件功能为想一个查询配置表单中添加一组查询配置参数
    $("#addQueryParam").click(function () {
        var _queryParams = $("#queryParamTemplate").clone(true);
        _queryParams.show();
        _queryParams.removeAttr("id");
        $("form[name='addQueryForm']").append(_queryParams);
    });
    //为每个查询配置参数的删除按钮添加点击事件：在DOM中删除改配置参数表单
    $("input[name='deleteParam']").click(function () {
        $(this).parentsUntil("div").remove();
    });

    //在添加查询语句按钮桑绑定点击事件，在表单中添加一个查询语句输入框
    $("#addStmt").click(function(){
        var _addStmt = $("#queryStmtTemplate").clone(true);
        _addStmt.removeAttr("id");
        $("tr[name='sql_stmt_td']").before(_addStmt);
    });

    //为每个查询配置参数的删除按钮添加点击事件：在DOM中删除改配置参数表单
    $("input[name='sql_stmt_delete_btn']").click(function () {
        var temp = $(this).parentsUntil("tr").parent().remove();
    });
});

/**
 *  查询表单模块选择事件处理函数
 */
function _moduleNameSelect() {
//    queryTreeForSearch = new ZTree("queryTree", "DS_QUERY_TREE", {nodeClicked:queryModuleForSearch});
//    $("#queryTreeDialog").dialog(_QueryTreeDlgOpt);
    var pageTreeForSearch =  selectModule(function(treeNode) {
        if (treeNode != null && treeNode.type == '0') {
    		$("#q_sys_code").val(treeNode.sys);
//    		$("#sysName").val(treeNode.name);
        } else if (treeNode != null) {
    		$("#moduleId").val(treeNode.id);
    		$("#moduleName").val(treeNode.name);
    		$("#q_sys_code").val(treeNode.sys_code);
//    		$("#sysName").val(treeNode.parentNode.sys_name);
        }
    },"",true);
}

//添加按钮处理函数
function _addQuery() {
    document.getElementById("addQueryForm").reset();
    //初始化选中的模块
    var _curNode = queryTree.getSelectedNode();
    if (_curNode != null && _curNode.type == '1') {
        $("input[name='sys_code']").val(_curNode.sys);
        $("input[name='sys_name']").val(_curNode.sys_name);
        $("input[name='module_name']").val(_curNode.name);
        $("input[name='module_id']").val(_curNode.id);
    }

    $("#addQueryDialog").dialog(_addQueryDlgOpt);
}

//编辑按钮处理函数
function _editorQuery(rowID) {
    $("#query_id_param").val(rowID);
    $("#queryId_editor").val(rowID);
    CORE.request("DS_CFG_QRY_EXECUTOR_INFO", {data:"id=" + rowID}, function (data) {
        var _results = data["results"] ? data["results"].split(";") : [];
        $("select[name='executor_result'] option[gen='true']").remove();
        var _exesel = $("select[name='executor_result']");
        for (var i = 0; i < _results.length; i++) {
            _exesel.append("<option value='" + _results[i] + "' gen='true'>" + _results[i] + "</option>");
        }
        CORE.loadForm("DS_EDITOR_CFG_QUERY", "editorQueryForm", {"data":"id=" + rowID + "&editStatus=1",
            "loadComplete":function () {
                GRID.reload("queryParamList");
                GRID.reload("queryStmtList");
                _sysCode = $("#sys_code_editor").val();  //设置系统编码的全局变量，主要用于查询设计器
                $("#editorQueryDialog").dialog(_editorQueryDlgOpt);
            }
        });
    });
}

function _delQuery(rowId, name) {
    CORE.confirm("确定要删除" + name + ",注意：删除后将不可能恢复", function () {
        CORE.request("DS_CFG_QUERY_DEL", {'data':"id=" + rowId + "&query_id=" + rowId + "&objectName=" + name},
                function (body, header) {
                    if (header.code == 0) {
                        CORE.tip("删除成功");
                        GRID.reload("queryManagerList");
                    } else {
                        CORE.error("删除失败", body);
                    }
                });
    });
}

//模块树弹出窗口处理函数
function _moduleSelectOnAddQuery() {
    //queryTreeForAdd = new ZTree("queryTree", "DS_QUERY_TREE", {nodeClicked:queryModuleForAdd});
    //$("#queryTreeDialog").dialog(_QueryTreeDlgOpt);
    selectModule(function (node) {
        $("input[name='sys_code']").val(node.sys_code);
        $("input[name='sys_name']").val(node.sys_name);
        $("input[name='module_name']").val(node.name);
        $("input[name='module_id']").val(node.id);
        _sysCode = node.sys_code; //设置系统编码的全局变量，主要用于查询设计器
    }, '', false, true);
}

/**
 * 查询处理器列表对话框
 * @param id
 */
function _openQueryProCfgDialog(queryId) {
    VERSION.permissionsCheck("ID", queryId, "RDC_CFG_QUERY", function (body, header) {
        if (header.code == 0) {
            $("#queryId_pro").val(queryId == undefined ? "" : queryId);
            if (queryProCfgGrid == null) {
                queryProCfgGrid = GRID.create("#queryProcessorCfgList", "DS_CFG_QUERY_PROCESSOR_LIST",
                        queryProCfgGridParam, "queryProcessorCfgForm");
            } else {
                GRID.reload("queryProcessorCfgList");
            }
            $("#queryProcessorCfgDialog").dialog(_QueryProcessorCfgDlgOpt);
        } else {
            CORE.error("发生错误", body);
        }
    });
}

/**
 * 打开添加处理器对话框
 */
function _addQueryProcessorDialog() {
    document.getElementById("queryProEditorForm").reset()
    $("#query_id_pro_editor").val($("#queryId_pro").val());

    //将处理器参数表单的id值清空
    $("#processorParamForm").find("input[name='processor_id']").val("");
    //如果处理器参数列表为空则创建表格，否则刷新表格
    if (queryProParamGrid == null) {
        queryProParamGrid = GRID.create("#queryProcessorParamList", "DS_PROCESSOR_PARAM_LIST",
                queryProcessorParamGridParam, "processorParamForm");
    } else {
        GRID.reload("queryProcessorParamList");
    }
    $("#queryProcessorEditorDialog").dialog(_addQueryProcessorDlgOpt);
}


/**
 * 打开添加处理器对话框
 */
function _openQueryProDialog() {
    if (queryProGrid == null) {
        queryProGrid = GRID.create("#queryProcessorList", "DS_QUERY_PROCESSOR_LIST", queryProGridParam, "");
    } else {
        GRID.reload("queryProcessorList");
    }
    $("#queryProcessorDialog").dialog(_QueryProcessorDlgOpt);
}

/**
 * 处理器选择事件函数
 * @param rowObject
 */
function _selectQueryPro(rowObject) {
    $("#processor_id").val(rowObject['ID']);
    $("#processor_name").val(rowObject['NAME']);
    $("#processor_class").val("");
    $("#queryProcessorDialog").dialog("close");
}

/**
 * 打开编辑处理器对话框
 * @param id
 */
function _editorQueryProcessorDialog(id) {
    CORE.loadForm("DS_LOAD_CFG_QUERY_PROCESSOR", "queryProEditorForm", {'data':"id=" + id, 'loadComplete':function () {

        $("#processorParamForm").find("input[name='processor_id']").val($("#queryProEditorForm").find("input[name='id']").val());
        //如果处理器参数列表为空则创建表格，否则刷新表格
        if (queryProParamGrid == null) {
            queryProParamGrid = GRID.create("#queryProcessorParamList", "DS_PROCESSOR_PARAM_LIST",
                    queryProcessorParamGridParam, "processorParamForm");
        } else {
            GRID.reload("queryProcessorParamList");
        }
        $("#queryProcessorEditorDialog").dialog(_editorQueryProcessorDlgOpt);
    }});

}

function _delQueryProcessor(id, name) {
    CORE.confirm("确定要删除" + name + ",注意：删除后将不可能恢复",
            function () {
                CORE.request("DS_CFG_QUERY_PROCESSOR_DEL", {'data':"id=" + id}, function (body, header) {
                    if (header.code == 0) {
                        CORE.tip("删除成功");
                        GRID.reload("queryProcessorCfgList");

                    } else {
                        CORE.error("删除失败", body);
                    }
                });
            });
}


/**
 * 查询执行器列表对话框
 */
function _openQueryExeDialog() {
    if (queryExeGrid == null) {
        queryExeGrid = GRID.create("#queryExeList", "DS_QUERY_EXECUTOR_LIST", queryExeGridParam, "");
    } else {
        GRID.reload("queryExeList");
    }
    $("#queryExeDialog").dialog(_QueryExeDlgOpt);
}

/**
 * 添加查询配置参数
 */
function _openAddQueryParamDialog() {
    document.getElementById("queryParamEditorForm").reset();
    $("#queryIdForParam").val($("#query_id_param").val());
    $("#queryParamEditorDialog").dialog(_addQueryParamDlgOpt);
}

/**
 * 删除查询配置参数
 * @param id
 */
function _delQueryParam(id, name) {
    CORE.confirm("确定要删除" + name + ",注意：删除后将不可能恢复", function () {
        CORE.request("DS_CFG_QUERY_PARAM_DEL", {'data':"id=" + id}, function (body, header) {
            if (header.code == 0) {
                CORE.tip("删除成功");
                GRID.reload("queryParamList");   //刷新参数列表
            } else {
                CORE.error("删除失败", body);
            }
        });
    });
}

/**
 * 版本提交处理函数
 * @param id
 */
function _versionCommit(id, sysCode) {
    VERSION.versionCommit("ID", id, "RDC_CFG_QUERY", sysCode, function (body, header) {
        if (header.code == 0) {
            GRID.reload("queryManagerList");   //刷新参数列表
        }
    });
}

/**
 * 版本撤销
 * @param key
 * @param keyValue
 * @param tableName
 * @param sysCode
 * @param objectName
 */
function _versionRevocation(keyValue,sysCode,objectName){
    VERSION.versionRevocation("ID",keyValue,"RDC_CFG_QUERY",sysCode,objectName,function(){
        GRID.reload("queryManagerList");
    });
}

/**
 * 编辑查询配置参数
 * @param id
 */
function _editorQueryParam(id) {
    CORE.loadForm("DS_CFG_QUERY_PARAM_EDITOR", "queryParamEditorForm", {'data':"id=" + id, 'loadComplete':function () {
        $("#queryParamId").val(id);
        $("#queryParamEditorDialog").dialog(_editorQueryParamDlgOpt);
    }});
}

/**
 * 编辑处理器参数
 * @param id
 */
function _editQueryProcessorParam(id) {
    CORE.loadForm("DS_CFG_LOAD_PROCESSOR_PARAM", "processorParamForm", {'data':"id=" + id, 'loadComplete':function () {
        $("#processorParamDialog").dialog(_editProcessorParamDlgOpt);
    }});
}

function _delQueryProcessorParam(id, name) {
    CORE.confirm("确定要删除" + name + ",注意：删除后将不可能恢复", function () {
        CORE.request("DS_CFG_QUERY_PROCESSOR_PARAM_DEL", {'data':"id=" + id}, function (body, header) {
            if (header.code == 0) {
                CORE.tip("删除成功");
                GRID.reload("queryProcessorParamList");   //刷新参数列表
            } else {
                CORE.error("删除失败", body);
            }
        });
    });
}

/**
 * 批量版本提交
 */
function _versionCommitBatch(){
    var _grid = $("#queryManagerList");
    var rowIds = _grid.getGridParam("selarrrow");
    if(rowIds.length == 0 ){
        CORE.info("没有选择任何版本记录！！");
        return ;
    }

    var _data = [];
    for(var i=0; i<rowIds.length; i++){
        var _rowData= _grid.getRowData(rowIds[i]);
        var _dataArray = {};
        _dataArray['key'] = "ID";
        _dataArray['keyvalue'] = _rowData['ID'];
        _dataArray['tablename'] = "RDC_CFG_QUERY";
        _dataArray['objectname'] = _rowData['查询名称'];
        _dataArray['syscode'] = _rowData['业务系统'];
        _data.push(_dataArray);
    }

    VERSION.versionCommitBatch(_data,function(){
        GRID.reload("queryManagerList");   //刷新参数列表
    });
}

/**
 * 批量撤销
 */
function _versionRevocationBatch(){
    var _grid = $("#queryManagerList");
    var rowIds = _grid.getGridParam("selarrrow");
    if(rowIds.length == 0 ){
        CORE.info("没有选择任何版本记录！！");
        return ;
    }

    var _data = [];
    for(var i=0; i<rowIds.length; i++){
        var _rowData= _grid.getRowData(rowIds[i]);
        var _dataArray = {};
        _dataArray['key'] = "ID";
        _dataArray['keyvalue'] = _rowData['ID'];
        _dataArray['tablename'] = "RDC_CFG_QUERY";
        _dataArray['objectname'] = _rowData['查询名称'];
        _dataArray['syscode'] = _rowData['业务系统'];
        _data.push(_dataArray);
    }

    VERSION.versionRevocationBatch(_data,function(){
        GRID.reload("queryManagerList");   //刷新参数列表
    });
}

/**
 * 删除查询语句
 * @param id
 */
function _delQueryStmt(id){
    CORE.confirm("确定要删除该语句,注意：删除后将不可能恢复", function () {
        CORE.request("DS_QUERY_STMT_DEL", {'data':"id=" + id}, function (body, header) {
            if (header.code == 0) {
                CORE.tip("删除成功");
                GRID.reload("queryStmtList");   //刷新参数列表
            } else {
                CORE.error("删除失败", body);
            }
        });
    });
}

/**
 * 编辑查询语句
 * @param id
 */
function _editorQueryStmtDlg(id){
    //查询设计器对话框配置
    var _queryStmtDlgOpt = {
        title:"编辑查询语句",
        width:"500",
        height:"280",
        modal:true,
        bgiframe:true,
        resizable:false,
        buttons:{
            '取消':function () {
                $("#queryStmtDlg").dialog("close");
            },
            '清空':function () {
                document.getElementById("queryStmtform").reset();
                $("#queryStmtDlg").find("textarea[name='sql_stmt_item']").removeAttr("readonly");
            },
            '保存':function () {
                //修复添加查询语句时候使用模板语法时候出现的“\”，会自动转换为“<!---->”的问题
                var sqlStmt = $("#queryStmtform").find("textarea[name='sql_stmt_item']").val();
                var re = new RegExp("/",'g');  //g为全局搜索
                $("#queryStmtform").find("textarea[name='sql_stmt_item']").val(sqlStmt.replace(re,"&#47;"))

                CORE.submitForm("DS_QUERY_STMT_UPDATE", "queryStmtform", {}, function (body, header) {
                    if (header.code == 0) {
                        CORE.tip("修改成功");
                        GRID.reload("queryStmtList");   //刷新参数列表
                        $("#queryStmtDlg").dialog("close");
                    } else {
                        CORE.error("修改失败", body);
                    }
                });
            }
        }
    };

    CORE.loadForm("DS_LOAD_QUERY_STMT", "queryStmtform", {"data":"id="+id,
            "loadComplete":function () {
                $("#queryStmtDlg").find("textarea[name='sql_stmt_item']").removeAttr("readonly");

                //将“&#47;” 转换为"/"
                var sqlStmt = $("#queryStmtform").find("textarea[name='sql_stmt_item']").val();
                var re = new RegExp("&#47;",'g');
                $("#queryStmtform").find("textarea[name='sql_stmt_item']").val(sqlStmt.replace(re,"/"))

                $("#queryStmtDlg").dialog(_queryStmtDlgOpt);
                var queryModelVal = $("#queryStmtDlg").find("textarea[name='query_model']").val();
                if(queryModelVal != undefined && queryModelVal != ""){
                    $("#queryStmtDlg").find("textarea[name='sql_stmt_item']").attr("readonly","true");
                    _openQueryBuilderDlg($("#queryStmtDlg").find("input[name='designBtn']"));
                }
            }
        });
}

/**
 * 添加查询语句
 * @param id
 */
function _addQueryStmtDlg(){
    //查询设计器对话框配置
    var _queryStmtDlgOpt = {
        title:"添加查询语句",
        width:"500",
        height:"280",
        modal:true,
        bgiframe:true,
        resizable:false,
        buttons:{
            '取消':function () {
                $("#queryStmtDlg").dialog("close");
            },
            '保存':function () {
                var queryId = $("#query_id_param").val();

                //修复添加查询语句时候使用模板语法时候出现的“\”，会自动转换为“<!---->”的问题
                var sqlStmt = $("#queryStmtform").find("textarea[name='sql_stmt_item']").val();
                var re = new RegExp("/",'g');  //g为全局搜索
                $("#queryStmtform").find("textarea[name='sql_stmt_item']").val(sqlStmt.replace(re,"&#47;"))

                CORE.submitForm("DS_QUERY_STMT_ADD", "queryStmtform", {data:'query_id='+queryId}, function (body, header) {
                    if (header.code == 0) {
                        CORE.tip("添加成功");
                        GRID.reload("queryStmtList");   //刷新参数列表
                        $("#queryStmtDlg").dialog("close");
                    } else {
                        CORE.error("添加失败", body);
                    }
                });
            }
        }
    };


    document.getElementById("queryStmtform").reset();
    $("#queryStmtDlg").dialog(_queryStmtDlgOpt);
    $("#queryStmtDlg").find("textarea[name='sql_stmt_item']").removeAttr("readonly");
//    _openQueryBuilderDlg($("#queryStmtDlg").find("input[name='designBtn']"));
}

/**
 * 模块树的节点选择事件
 * @param event
 * @param treeId
 * @param treeNode
 */
var queryModuleSelect = function (event, treeId, treeNode) {
    //如果点击的节点是具体查询配置节点，则不弹出添加对话框
    if (!treeNode.isParent) {
        _editorQuery(treeNode.id);
        return;
    }
    //如果id == 0 表示选中的节点为为根节点，即不是模块，数据源只能挂着在模块下面
    if (treeNode.id != 0) {
        if (treeNode.type == '0') {
            //选中的是业务系统
            $("#q_sys_code").val(treeNode.id);
            $("#moduleName").val(treeNode.name);
            $("#moduleId").val('');
        } else {
            //选中的是模块
            $("#q_sys_code").val('');
            $("#moduleName").val(treeNode.name);
            $("#moduleId").val(treeNode.id);
        }
        GRID.reload('queryManagerList')
    }
}

/**
 * 搜索表单的模块树的节点选择事件
 * @param event
 * @param treeId
 * @param treeNode
 */
var queryModuleForSearch = function (event, treeId, treeNode) {
    if (treeNode.id == 0 || !treeNode.isParent) {
        CORE.tip("请选择模块节点");
        return;
    }

    if (treeNode.type == '0') {
        //选中的是业务系统
        $("#q_sys_code").val(treeNode.id);
        $("#moduleName").val(treeNode.name);
        $("#moduleId").val('');
    } else {
        //选中的是模块
        $("#q_sys_code").val('');
        $("#moduleName").val(treeNode.name);
        $("#moduleId").val(treeNode.id);
    }
    $("#queryTreeDialog").dialog("close");
}


/**
 * 模块树的节点选择事件
 * @param event
 * @param treeId
 * @param treeNode
 */
//var queryModuleForAdd = function (event, treeId, treeNode) {
//    //如果id == 0 表示选中的节点为为根节点，即不是模块，数据源只能挂着在模块下面
//    if (treeNode.id == 0 || !treeNode.isParent) {
//        CORE.tip("请选择模块节点");
//        return;
//    }
//    $("input[name='sys_code']").val(treeNode.sys);
//    $("input[name='module_name']").val(treeNode.name);
//    $("input[name='module_id']").val(treeNode.id);
//    $("#queryTreeDialog").dialog("close");
//}

/**
 * 查询执行器列表选择按钮处理函数
 * @param row
 */
var _onSelectQueryExe = function (row) {
    //alert(row["RESULTS"]);
    $("input[name='executor_name']").val(row['NAME']);
    $("input[name='executor_id']").val(row['ID']);
    var _results = row["RESULTS"] ? row["RESULTS"].split(";") : [];
    //$("input[name='executor_result']").val(row['RESULTS']);
    $("select[name='executor_result'] option[gen='true']").remove();
    var _exesel = $("select[name='executor_result']");
    for (var i = 0; i < _results.length; i++) {
        _exesel.append("<option value='" + _results[i] + "' gen='true'>" + _results[i] + "</option>");
    }
    $("#queryExeDialog").dialog("close");
}

/**
 * 打开查询器对话框
 */
var selectorOjb = null;
function _openQueryBuilderDlg(obj){
    selectorOjb = obj;
    $("#queryBuilderDig").dialog(_queryBuilderDlgOpt);
}

/**
 * 查询设计器调用：保存查询设计器的数据模型
 * @param str
 */
function _saveQueryModel(sqlStr,queryModelStr){
    var _textArea = $(selectorOjb).parentsUntil("tr").find("textarea[name='sql_stmt_item']");
    var _queryModel = $(selectorOjb).parentsUntil("tr").find("textarea[name='query_model']");
    $(_textArea).val(sqlStr);
    $(_queryModel).val(queryModelStr);
//    $("#connectionStr").text(escape(str));
}

/**
 * 查询设计器调用：装载查询设计器的数据模型
 */
function _loadQueryModel(){
    var queryModel =  $("#queryStmtDlg").find("textarea[name='query_model']").val();
    if(queryModel == undefined || queryModel == ''){
        return '';
    }
    return queryModel;
}
/**
 * 查询语句合并
 * @param _grid  表格对象
 */
function _mergerStmt(_grid){
    var IDs = _grid.getDataIDs();

    var sqls = "";
    for(var i=0; i< IDs.length; i++){
        var _rowData = _grid.getRowData(IDs[i]);
        if(i>0){
            sqls += ";";
        }
        sqls += _rowData['查询语句'];
    }
    $("#sql_stmt_editor").val(sqls);
}

/**
 * 用于applet输出错误信息
 * @param message
 */
function _error4Applet(message){
    CORE.error("警告："+message);
    $("#queryBuilderDig").dialog("close");
}

/**李嘉伟2012年5月25日修改 同步功能***/
function _syncQuery(queryId,syscode){
	CORE.request("DS_SYNC_OBJECT",{data:"objId="+queryId+"&syscode="+syscode+"&tablenames=RDC_CFG_QUERY"}, function(data) {
		CORE.info(data);
	});
}