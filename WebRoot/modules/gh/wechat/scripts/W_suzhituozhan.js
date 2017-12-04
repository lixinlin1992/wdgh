rdcp.ready(function(){
    loadData();
});
function loadData(){
    rdcp.request("!gh/wechat/~query/Q_LOAD_INFO_LIST",{"table_name":"BI_SCHOOL_CULTURE","type":"5"},function(data){
        var rows = data.body.rows;
        for(var i=0;i<rows.length;i++){
            var html = "<div class='postall'>";
            html += "<a href='!gh/wechat/~/pages/W_suzhiIntroduction.jsp?culture_id="+rows[i].ID+"'>";
        //    html += "<span>"+rows[i].CREATE_USER+"</span><span class='puff_right place animated fadeInRight'><label class='color_y'>时间："+rows[i].CREATE_TIME+"</label>";
            html += "<div class='post_m'><p>"+rows[i].TITLE+"</p></div></div>";

            $("#main_list").append(html);
        }
    });
}
