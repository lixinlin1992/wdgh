rdcp.ready(function(){
    var cultureId = $("#cultureId").val();
    showcontent(cultureId);
});

//展示交友活动具体内容
function showcontent(cultureId){
    rdcp.request("!gh/wechat/~java/Yftk.getActivityDetail",{"id":cultureId},function(data){
        var row = data.body.rows;
         html = "<div class='fin_txt'>";
        html+="<p>"+row[0].subject+"</p> <div class='post_img post_img02 animated bounceIn'> <img src='"+row[0].subject_pic+"'> </div>";
        html+= "<span class='animated fadeInLeft'>"+row[0].content+"</span></div>";
        html+="<div class='group_txt'>"+
        "<p><label>活动须知</label> <i class='icon-volume-down color_y'></i></p>"+
        "<p class='animated fadeInRight'><label class='color_g'>开始日期：</label><span>"+row[0].start_time+"</span></p>"+
        "<p class='animated fadeInLeft'><label class='color_g'>结束日期：</label><span>"+row[0].end_time+"</span></p>"+
        "<p class='animated fadeInLeft'><label class='color_g'>活动时间：</label><span>"+row[0].activity_time+"</span></p>"+
        "<p class='animated fadeInRight'><label class='color_g'>人数限制：</label><span>"+row[0].sum_limit+"</span></p>"+
        "<p class='animated fadeInLeft'><label class='color_g'>联系方式：</label><span>"+row[0].contact+"</span></p>"+
        "<p class='animated fadeInRight'><label class='color_g'>费  用：</label><span>"+row[0].fee+"</span></p>"+
        "<p class='animated fadeInLeft'><label class='color_g'>具体地点：</label><span>"+row[0].address+"</span></p>"+
        "<p class='animated fadeInRight'><label class='color_g'>举办单位：</label><span>"+row[0].sponsor+"</span></p></div>";
        $("#main_list").html(html);
    });
}

/*
<a href="javascript:;">
<div class="post_t">
<img src="!gh/wechat/~/img/pic7.jpg">
<span>管理员：龙五</span>
</div>
<div class="post_m">
<p>已登录进婚恋信息网络系统的朋友请填写电子版和纸质版“联谊活动报名登记表”，并准备一张本人近期生活照，传送给工会办公室</p>
<p><span class="puff_left color_y">时间：本周六</span> <span class="puff_right color_y">地点：知音湖</span> </p>
</div>
<div class="post_img post_img02 animated bounceIn">
<img src="!gh/wechat/~/img/pic7.jpg">
</div>
<div class="group_txt">
<p><label>活动须知</label> <i class="icon-volume-down color_y"></i></p>
<p class="animated fadeInRight"><label class="color_g">开始日期：</label><span>2017-06-17（本周六）</span></p>
<p class="animated fadeInLeft"><label class="color_g">结束日期：</label><span>2017-06-18（本周日）</span></p>
<p class="animated fadeInRight"><label class="color_g">人数限制：</label><span>35人</span></p>
<p class="animated fadeInLeft"><label class="color_g">联系方式：</label><span>027-67884374</span></p>
<p class="animated fadeInRight"><label class="color_g">费  用：</label><span>无</span></p>
<p class="animated fadeInLeft"><label class="color_g">具体地点：</label><span>蔡甸知音湖（武汉职工疗养院）</span></p>
<p class="animated fadeInRight"><label class="color_g">活动提示：</label><span>注意合理着装，注意安全</span></p>
</div>
<div class="post_b">
<span class="puff_left">30分钟前</span>
</div>
</a>--%>*/
