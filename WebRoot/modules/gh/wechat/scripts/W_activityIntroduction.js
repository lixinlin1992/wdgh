rdcp.ready(function(){
    var cultureId = $("#cultureId").val();
    showcontent(cultureId);
});

//展示活动具体内容   展示社团组织的详情   展示电影的详情
function showcontent(cultureId){
    rdcp.request("!gh/wechat/~query/Q_LOAD_DetailContent",{"table_name":"BI_SCHOOL_CULTURE","id":cultureId},function(data){
        var rows = data.body.rows;
        html = "<div class='fin_txt'>";
        html += "<span>"+rows[0].CONTENT+"</span><span class='puff_right place animated fadeInRight'></span></div>";
        $("#main").html(html);
    });
}