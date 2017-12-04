//列表参数
var process_list_params = {
    colModel:[
        {
            name:'流程编号',
            index:'deployId',
            width:"5px",
            align:"center",
            sortable:false,
            formatoptions:{}
        },
        {
            name:'部署名称',
            index:'deployName',
            width:"10%",
            align:"center",
            sortable:false,
            formatoptions:{}
        },
        {
            name:'部署时间',
            index:'deployTime',
            width:"8%",
            align:"center",
            sortable:false,
            formatoptions:{}
        },
        {
            name:'流程定义编号',
            index:'procDefId',
            width:"15%",
            align:"center",
            sortable:false,
            formatoptions:{}
        },
        {
            name:'流程定义名称',
            index:'procDefName',
            width:"10%",
            align:"center",
            sortable:false,
            formatoptions:{}
        },
        {
            name:'流程定义编码',
            index:'procDefKey',
            width:"10%",
            align:"center",
            sortable:false,
            formatoptions:{}
        },
        {
            name:'版本',
            index:'procDefVersion',
            width:"5%",
            align:"center",
            sortable:false,
            formatoptions:{}
        },
        {
            name:'流程定义',
            index:'xmlName',
            width:"15%",
            align:"center",
            sortable:false,
            formatter:genGetProcessResourceRequestStr,
            formatoptions:{}
        },
        {
            name:'流程图片',
            index:'pngName',
            width:"13%",
            align:"center",
            sortable:false,
            formatter:genGetProcessResourceRequestStr,
            formatoptions:{}
        },
        {
            name:'未完成任务数',
            index:'unfinishTaskCount',
            width:"8%",
            align:"center",
            sortable:false,
            formatter:genRunningTaskDetailRequestStr,
            formatoptions:{}
        },
        {
            name:'操作',
            index:'unfinishTaskCount',
            width:"10%",
            align:"center",
            sortable:false,
            formatter:genProcessOperateRequestStr,
            formatoptions:{}
        }
    ],
    caption:"流程列表",
    edit:true,
    multiselect:false,
    width:"100%",
    pager:"#pagerdt"
};

processDeployFormDialogOpt = {
    title:"上传信息",
    width:"350px",
    height:"150",
    modal:true,
    bgiframe:true,
    resizable:false,
    buttons:{
        '取消':function () {
            $("#processDeployFormDialog").dialog("close");
        },
        '提交':function () {
            if ($("#file").val() == "" || $("#file").val() == null || $("#deployName").val() == ""
                    || $("#deployName").val() == null) {
                CORE.info("<font color='red'>流程名称</font>或<font color='red'>部署文件</font>不能为空！");
                return;
            }
            COMMON.upload({
                url:'framework.do?ds=DS_DEPLOYED_PROCESS',
                formName:'processDeployForm'
            }, function (data) {
                $("#processDeployFormDialog").dialog("close");
                GRID.reload("processList");
            });
        }
    }
};

/**
 * 生成操作列的超链接
 *
 * @param cellvalue
 * @param options
 * @param rowObject
 * @returns {String}
 */
function genProcessOperateRequestStr(cellvalue, options, rowObject) {

    var procDefKey = rowObject['procDefKey'];
    var processStartBtnClickFun = "startProcessAndFowardToTaskHandlePage('" + procDefKey + "')";
    var processStartBtn = "<a href=\"javascript:void(0);\" onClick=\"" + processStartBtnClickFun + "\">启动</a>";

    var deployId = rowObject[0];
    var processDelBtnClickFun = "BPM.unDeployProcess('" + deployId + "')";
    var processDelBtn = "<a href=\"javascript:void(0);\" onClick=\"" + processDelBtnClickFun + "\">删除</a>";

    return processStartBtn + " " + processDelBtn;
}

/**
 * 生成未完成任务热点超链接
 *
 * @param cellvalue
 * @param options
 * @param rowObject
 * @returns {String}
 */
function genRunningTaskDetailRequestStr(cellvalue, options, rowObject) {
    var url = $("#basePath").val() + "/pages/bpm/activiti/bpm-trace/task-running-list.jsp?procDefId=" +
            rowObject['procDefId'];
    var showRunningTaskDetailBtn = "<a href='" + url + "' class='hover'>" + cellvalue + "</a>";
    return showRunningTaskDetailBtn;
}

/**
 * 生成请求流程图片的超链接
 *
 * @param cellvalue
 * @param options
 * @param rowObject
 * @returns {String}
 */
function genGetProcessResourceRequestStr(cellvalue, options, rowObject) {
    var deployId = rowObject[0];
    var resourceName = cellvalue;
    var showProcessResourceBtnClickFun = "BPM.showProcessResourceWin('" + deployId + "','" + resourceName + "')";
    var showProcessResourceBtn = "<a href=\"javascript:void(0);\" onClick=\"" + showProcessResourceBtnClickFun + "\">"
            + cellvalue + "</a>";
    return showProcessResourceBtn;
}

/**
 * 打开流程部署页面对话框
 */
function openProcessDeployFormDialog() {
    $("#processDeployFormDialog").dialog(processDeployFormDialogOpt);
}

/**
 * 发起流程并跳转到任务处理页面
 *
 * @param procDefId
 *            流程定义ID
 */
function startProcessAndFowardToTaskHandlePage(procDefKey) {
    BPM.startProcessByKey(procDefKey, "");
}


// 初始化
$(function () {
    GRID.create("#processList", "DS_PROCESS_LIST", process_list_params, "QueryForm");
});
