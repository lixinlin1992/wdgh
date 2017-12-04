/**
 * Created by Administrator on 2017/6/26.
 */

rdcp.ready(function(){
    loadData();
});
function loadData(){
    rdcp.request("!gh/wechat/~query/Q_LOAD_MOVIE_LIST",{"table_name":"BI_SCHOOL_CULTURE","type":"4"},function(data){
        var rows = data.body.rows;
        var html = "<ul class='movielist'>";
        for(var i=0;i<rows.length;i++){
            html += "<li class='item'><a  href='!gh/wechat/~/pages/W_movieIntroduction.jsp?culture_id="+rows[i].ID+"' data-bid='b_MWTWF' " +
            "data-lab='{ index:1, movie_id:248645, module_name:'cell' }'>" +
            "<div class='movie-cover'> <img class='lazy' src='!service/file/~java/Downloader.get?id="+rows[i].IMGID+"'></div>" +
            "<div class='movie-content '><div class='flexRow flex-item flex-middle text-ellipsis'>" +
            "<span class='movie-name'>影片名称："+rows[i].TITLE+"</span></div><p>影片类型："+rows[i].MOVIE_TYPE+"</p>" +
            "<p>主演："+rows[i].ACTORS+"</p><p class='movie-show'>时间:" +
            rows[i].PLAY_TIME+"</p><p class='dyxx-addr-hr'>地点:"+rows[i].PLAY_PLACE+"</p></div> </a>" +
            "</li>";
        }
        html += "</ul>";
        $("#main_list").append(html);
    });
}


//JS控制
/*
<li class="item">
<a href="dyxx-detail.html" data-bid="b_MWTWF" data-lab="{ index:1, movie_id:248645, module_name:'cell' }">
<div class="movie-cover">
<img class="lazy" src="img/filmpic.jpg">
</div>
<div class="movie-content ">
<div class="flexRow flex-item flex-middle text-ellipsis">
<span class="movie-name">变形金刚5：最后的骑士</span>
<div class="movie-rating">
<span class="score">7.4</span>
</div>
</div>
<p>动作,冒险,科幻</p><p>主演:马克·沃尔伯格,伊莎贝拉·莫奈,劳拉·哈德克</p>        <p class="movie-show">今天104家影院放映3185场</p><p class="dyxx-addr-hr">地点：梅园小剧场</p>
</div>
</a>
<a style="display: none;" class="movie-btn" href="/cinema/movie/248645?_v_=yes" data-bid="b_MWTWF" data-lab="{ index:1, movie_id:248645, module_name:'buy_btn' }">购票</a>
</li>*/
