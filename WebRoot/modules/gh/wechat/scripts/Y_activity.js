rdcp.ready(function(){
    loadData();
});
function loadData(){
    rdcp.request("!gh/wechat/~java/Yftk.getActivityInfo",null,function(data){
        var row = data.body.rows;
        for(var i=0;i<row.length;i++){
            var html = "<div class='postall'>";
            html += "<a href='!gh/wechat/~/pages/yftk/Y_activityIntroduction.jsp?culture_id="+row[i].activity_id+"'>";
            html +="<p>"+row[i].subject+"</p>";
          /*  html += "<span class='puff_right place animated fadeInRight'><label class='color_y'>时间："+row[i].start_time+"</label></span>";*/
            html += "<div class='post_img post_img02 animated bounceIn'> <img src='"+row[i].subject_pic+"'> </div>"+
            " <span class='puff_left'>查看详情</span></a>";
        }
        $("#main_list").html(html);
    });
}
