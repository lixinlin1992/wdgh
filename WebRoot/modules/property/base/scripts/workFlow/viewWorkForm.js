/**
 * Created by lh on 2014/10/24.
 */

rdcp.ready(function () {


    /*
     * 加载工单历史
     * */
    loadHandleHistory($("#woId").val());
});




/*
 * 加载工单历史
 * */
function loadHandleHistory(woId) {
    rdcp.request('!property/base/~query/workFlow/Q_LOAD_WO_HANDLE_HISTORY', {"woId": woId},
        function (data) {
            rdcp.unmask($(document.body));
            var suc = data.header.code;
            var rows = data.body.rows;
            if (0 == suc) {
                for (var i = 0; i < rows.length; i++) {
                    $("#span_handleHistory").append("<p>&nbsp;&nbsp;&nbsp;&nbsp;" + rows[i].HANDLER + "-[" + rows[i].HANDLETIME + "]-" + rows[i].NODENAME + "-" + rows[i].HANDLERESULT + "-" + rows[i].HANDLENOTE + "</p>");
                }
                rdcp.request('!property/base/~query/workFlow/Q_GET_HISTORY_FORM_URL', {"woId":woId}, function (data) {
                     //alert( data.body.formurl)
                    rdcp.unmask($(document.body));
                    if (0 == data.header.code) {
                        var formUrl = data.body.formurl;
                        if(formUrl!=''&&formUrl!=null&&formUrl!=undefined){
                            rdcp.load("span_objectForm", formUrl, '', {
                                    onLoad: function(){ initForm();}
                                }
                            );
                        }
                    }
                }, {mask: true});
            }
        }, {mask: true});
}
