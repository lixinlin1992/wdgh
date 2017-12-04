/**
 * @(#)resourceAccessMonitor.js 13-12-13 上午11:26
 * CopyRight 2013.  All rights reserved
 *
 */
/**
 * User: kinz
 */
var resLogGridParam =
{
    sortName: 'REQUEST_TIME',
    sortOrder: 'DESC',
    idField: 'ID',
    fitColumns: true,
    rownumbers:true,
    columns: [
        [
            {field: 'MODULE_PATH', title: '模块路径', sortable: true, align: 'left', width: 120},
            {field: 'RES_PATH', title: '资源路径', sortable: true, align: 'left', width: 300},
            {field: 'REQUEST_TIME', title: '请求时间', sortable: true, align: 'center', width: 100},
            {field: 'BEGIN_TIME', title: '处理开始时间', sortable: true, align: 'center', width: 100},
            {field: 'FINISH_TIME', title: '处理结束时间', sortable: true, align: 'center', width: 100},
            {field: 'RESPONSE_TIME', title: '响应时长', sortable: true, align: 'center', width: 70},
            {field: 'USER_NAME', title: '操作用户', sortable: false, align: 'center', width: 70}
        ]
    ]
};