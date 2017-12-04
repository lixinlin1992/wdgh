var process_detail_monitor_list_params = {
    colModel : [ {
        name : 'ID',
        index : 'id',
        width : "10%",
        hidden : true,
        align : "center",
        sortable : false,
        formatoptions : {}
    },{
        name : '环节名称',
        index : 'act_name',
        width : "10%",
        hidden : false,
        align : "center",
        sortable : false,
        formatoptions : {}
    }, {
        name : '环节ID',
        index : 'act_id',
        width : "10%",
        hidden : false,
        align : "center",
        sortable : false,
        formatoptions : {}
    }, {
        name : '流程定义ID',
        index : 'proc_def_id',
        width : "12%",
        align : "center",
        hidden : true,
        sortable : false,
        formatoptions : {}
    }, {
        name : '流程实例ID',
        index : 'end_time',
        width : "10%",
        align : "center",
        hidden : true,
        sortable : false,
        formatoptions : {}
    }, {
        name : '开始时间',
        index : 'start_date',
        width : "10%",
        align : "center",
        sortable : false,
        formatoptions : {}
    }, {
        name : '结束时间',
        index : 'end_time',
        width : "10%",
        align : "center",
        sortable : false,
        formatoptions : {}
    }, {
        name : '任务时长',
        index : 'duration',
        width : "10%",
        align : "center",
        sortable : false,
        formatter: function(cellValue,option,rowObject){
            return durationFormat(Number(cellValue),"mil");
        },
        formatoptions : {}
    },{
        name : '级别',
        index : 'level',
        width : "10%",
        align : "center",
        sortable : false,
        hidden : true,
        formatoptions : {}
    }],
    caption : "任务委托列表",
    multiselect : false,
    width : "100%",
    pager : "#listPagerdt",
    subGrid: true,
    subGridRowExpanded:function(subGridId,rowId){
        loadTask(subGridId,rowId);
    }
};

//缓存任务
var  actCache = {};


$(function(){
    GRID.create("#processDetailMonitorList","DS_PROCESS_DETAIL_MONITOR_LIST",process_detail_monitor_list_params,"processDetailMonitorForm");
});

/**
 * 装载环节任务数据
 * @param actInstId
 * @return {*}
 */
var loadTask = function(subgridId,actInstId){
    var _html = "";
    var subGrid = $("#"+subgridId);
    if(actCache[actInstId]){
        subGrid.html(actCache[actInstId]);
    }else{
        CORE.request("DS_PROCESS_TASK_MONITOR_LIST",{data:"actInstId="+actInstId},function(body,header){
            if(header.code == 0){
                _html += "<div><table>"
                _html += "<tr class='ui-widget-content jqgrow ui-row-ltr ui-state-highlight'>" +
                    "<td class=''>任务负责人</td>" +
                    "<td class=''>任务状态</td>" +
                    "<td class=''>任务开始时间</td>" +
                    "<td class=''>任务完成时间</td>" +
                    "<td class=''>任务时长</td>" +
                    "</tr>";

                for(var i=0; i<body.length; i++){
                    _html += "<tr class='ui-widget-content jqgrow ui-row-ltr ui-state-highlight'>" +
                        "<td class=''>"+body[i]["deal_user"]+"</td>" +
                        "<td class=''>"+body[i]["delete_reason"]+"</td>" +
                        "<td class=''>"+body[i]["start_time"]+"</td>" +
                        "<td class=''>"+body[i]["end_time"]+"</td>" +
                        "<td class=''>"+durationFormat(Number(body[i]["duration"]),"mil")+"</td>" +
                        "</tr>";

                }
                _html += "</table></div>"
            }else{
                CORE.error("加载任务数据出错",body);
            }
            actCache[actInstId] = _html;

            subGrid.html(actCache[actInstId]);
            subGrid.expandSubGridRow(actInstId);
        });
    }
};

var durationFormat = function(duration,flag){
    if(duration instanceof Number || duration <= 0){
        return "";
    }
    var result = "";
    var mod;
    switch(flag){
        case "mil":
            var sec = parseInt(duration / 1000,0);
            return durationFormat(sec,"sec");
        case "sec":
            var min = parseInt(duration / 60,0);
            mod = duration % 60;
            result = durationFormat(min,"min");
            return result += mod+"秒";
        case "min":
            var hour = parseInt(duration / 60,0);
            mod =  duration % 60;
            result = durationFormat(hour,"hour");
            return  result += mod + "分钟";
        case "hour":
            var day = parseInt(duration / 24,0);
            mod = duration % 24;
            result = durationFormat(day,"day");
            return result +=  mod +"小时";
        case "day":
            result = duration;
            return result + "天" ;
        default :
            return "";
    }
};

