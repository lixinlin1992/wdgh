/**
 * @(#)tools.api.js.js 11-11-3 下午2:18
 * CopyRight 2011.  All rights reserved
 *
 *
 */
/**
 * User: kinz
 *
 * {
 'id':'',
 'name':'',
 'description':"",
 'author':"",
 'version':"",
 'date':"",
 'propertis':[
 'name':"",
 'code':"",
 'type':"",
 'editor':"",
 'required':"true",
 'description':""
 ],
 'methods':[
 {
 'name':'main',
 'note':'主函数',
 'return':'无返回值',
 'params':[{'name':'','code':'','type':'','required':'','default':''}]
 }
 ]
 }
 */


RDCP.buildApiTipHtml = function(api, tip_id) {
    var _html = "<div style='min-width:600px;'>" +
            "<div style='width:100%; background-color: #dcdcdc;' onclick='$(\"#" +
            tip_id +
            "\").poshytip(\"hide\");'><span>API查看，点击关闭</span><a style='float: right;' href='javascript:void(0);' onclick='$(\"#" +
            tip_id + "\").poshytip(\"hide\");'>关闭</a></div>" +
        //"<br><div style='width:100%;height:3px;background-color: #C60000;'></div>" +
            "<div style='width:100%;height:350px;overflow: auto'>";

    //显示基本信息
    _html += "<h6>基本信息</h6><div style='width:97%;height:2px;background-color: #C60000;'></div>";
    _html += "<div style='width:100%;'>" +
            "<br><b>名称</b>：" + api["name"] +
            "<br><b>ID</b>：" + api["id"] +
            "<br><b>作者</b>：" + api["author"] +
            "<br><b>日期</b>：" + api["date"] +
            "<p><b>详细描述</b>：" + api["description"] +
            "</div>";

    //显示属性列表
    _html += "<br><h6>属性信息</h6><div style='width:97%;height:2px;background-color: #C60000;'></div><br>";
    _html += "<table class='methodTable' cellpadding='0' cellspacing='0'>" +
            "<tr>" +
            "<th width='100'><nobr>名称</nobr></th><th width='80'><nobr>类型</nobr></th><th width='50'><nobr>必填</nobr></th><th width='60'><nobr>编辑器</nobr></th><th><nobr>说明</nobr></th>" +
            "</tr>";
    $.each(api["properties"], function(i, n) {
        _html += "<tr><td>" + n["name"] + "</td><td>" + n["type"] + "</td><td>" +
                ("true" == n["required"] ? "是" : "否") + "</td><td style='width:80px !important;'>" + n["editor"] + "</td><td>" + n["description"] +
                "</td></tr>"
    });
    _html += "</table>";

    //显示方法列表
    _html += "<br><h6>方法列表</h6><div style='width:97%;height:2px;background-color: #C60000;'></div><br>";
    _html += "<table class='methodTable' cellpadding='0' cellpadding='0' cellspacing='0'>" +
            "<tr>" +
            "<th><nobr>函数名</nobr></th><th><nobr>参数</nobr></th><th><nobr>返回值</nobr></th><th><nobr>函数说明</nobr></th>" +
            "</tr>";

    $.each(api["methods"], function(i, n) {
        _html += "<tr><td>" + n["name"] + "</td><td>";
        var _counter = 0;
        $.each(n["params"], function(i, m) {
            _counter++;
            _html += "<div style='100%;'><b>" + m["name"] + "&nbsp;&nbsp;</b></div>"
        });
        if (_counter == 0)
            _html += "-";
        _html += "</td><td>" + n["return"] + "</td><td>" + n["note"] + "</td></tr>";
    });
    _html += "</table>"
    _html += "</div></div>";
    return _html;
}

RDCP.buildApiTipHtml.testData = {
    'id':'TEST_ID',
    'name':'测试控件',
    'description':"测试描述",
    'author':"kinz",
    'version':"1.0",
    'date':"2011-11-03",
    'properties':[
        {
            'name':"列表数据",
            'code':"listdata",
            'type':"string",
            'editor':"html",
            'required':"true",
            'description':"列表数据描述"}
    ],
    'methods':[
        {
            'name':'main',
            'note':'主函数',
            'return':'无返回值',
            'params':[
                {'name':'列索引','code':'colindex','type':'字符串','required':'false','default':'id'}
            ]
        },
        {
            'name':'test',
            'note':'测试函数',
            'return':'无返回值',
            'params':[]
        }
    ]
};