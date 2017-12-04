rdcp.ready(function(){
    loadData();
});
function loadData(){
    rdcp.request("!gh/wechat/~query/Q_LOAD_ORGANIZATION_LIST",{"table_name":"BI_SCHOOL_CULTURE","type":"2"},function(data){
        var rows = data.body.rows;
        for(var i=0;i<rows.length;i++){
            var html = "<div class='postall'>";
            html += "<a href='!gh/wechat/~/pages/W_organizationIntroduction.jsp?culture_id="+rows[i].ID+"'>";
            html += "<div class='post_m'><p>"+rows[i].TITLE+"</p></div>";
            html +="<div class='post_img post_img02 animated bounceIn'> <img src='!service/file/~java/Downloader.get?id="+rows[i].IMGID+"'> </div>"+
           " <div class='post_b'> <span class='puff_left'>查看详情</span> </div> </a>";
            $("#main_list").append(html);
        }
    });
}
