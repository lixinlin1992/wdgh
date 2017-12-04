<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<link href="!gh/index/~/css/index.css" rel="stylesheet" />
<link href="!gh/index/~/css/list.css" rel="stylesheet" />
<link href="!gh/index/~/css/idangerous.swiper.css" rel="stylesheet"/>
<script type="text/javascript" src="!gh/index/~/scripts/idangerous.swiper.min.js"></script>
<%
  String key = request.getParameter("key");
%>
<script type="text/javascript">
var key = "<%=key%>";
//总页数
var all_page;
//当前页
var this_page = 1;
//每页记录数
var rows = 20;
rdcp.ready(function(){
  loadData();
});
//加载右边列表数据
function loadData(){
  $("#data_list").html("");
  rdcp.request("!gh/index/~query/Q_LOAD_SEARCH_DATA",{"key":key,"page":this_page,"rows":rows},function(data){
    var list = data.body.rows;
    all_page = parseInt(data.body.total/rows);
    all_page += data.body.total%rows>0?1:0;
    for(var i=0;i<list.length;i++){
    var t = list[i];
      var html = "";
      if(t.CODE_TABLE=="BI_NOTICE" && t.CODE_NUM=="2"){
        html += "<li><a href='!service/file/~java/Downloader.get?id="+t.FILE_ID+"' target='_blank'><p class='f-l tit'>"+t.TITLE+"</p>";
        html += "<p class='f-r time'>"+t.CREATE_TIME+"<p></a></li>";
      }
      else{
        html += "<li><a target='_blank' href='pages/subMenu.jsp?code_table="+t.CODE_TABLE+"&code_num="+t.SUB_TYPE+"&detail_id="+t.ID+"'><p class='f-l tit'>"+t.TITLE+"</p>";
        html += "<p class='f-r time'>"+t.CREATE_TIME+"<p></a></li>";
      }
      $("#data_list").append(html);
    }
    $("#data_list").show();
    $("#pages").show();
    $("#content").hide();
    loadFooter();
  });

}
//加载底部分页链接
function loadFooter(){
  var html = "";
  html += "<a href='javascript:void(0);' onclick=\"toPage("+(this_page-1)+")\">上一页</a>"
  for(var i=1;i<=all_page;i++){
    html += "<a href='javascript:void(0);' onclick=\"toPage("+i+")\">"+i+"</a>";
  }
  html += "<a href='javascript:void(0);' onclick=\"toPage("+(this_page+1)+")\">下一页</a>";
  html += "共<span class='red'>" + this_page+"/"+all_page + "</span>页";
  $("#pages").html(html);
}
//跳转到某页
function toPage(page){
  if(page<1 || page>all_page)
    return;
  this_page = page;
  loadData();
}
</script>
<div class="index-main">
	 <!-- banner -->
	 <div class="public-container">
		 <div class="index-bannner">
			 <!--swiper-->
			 <div class="swiper1">
				 <!--<a class="arrow-left" href="#"></a>-->
				 <!--<a class="arrow-right" href="#"></a>-->
				 <div class="swiper-container">
					 <div class="swiper-wrapper">
						 <div class="swiper-slide"><img src="!gh/index/~/images/banner04.jpg" alt="banner" title="banner"/></div>
						 <div class="swiper-slide"><img src="!gh/index/~/images/banner.jpg" alt="banner" title="banner"/></div>
						 <div class="swiper-slide"><img src="!gh/index/~/images/banner02.jpg" alt="banner" title="banner"/></div>
					 </div>
				 </div>
				 <div class="pagination"></div>
			 </div>
			 <!--swiper-->
		 </div>
		<!--列表页内容区-->
		<div class="g-list-container">
			<!--内容-->
			<div class="g-list-main">
				<div class="content f-r" style="width:100%;">
					<h3><span id="menu_name2"><i class="hr"></i>站内搜索</span><i class="clear"></i></h3>
					<ul id="data_list">
					  <li><a href="javascript:void(0);" onclick="showDetail(142);"><p class="f-l tit"></p><p class="f-r time"></p></a><p><a href="javascript:void(0);" onclick="showDetail(142);"></a></p></li>
					</ul>
					<div class="g-page" id="pages"></div>
					<div class="g-article-con" id="content"></div>
				</div>
				<i class="clear"></i>

			</div>
		</div>
		<!--列表页内容区 End-->
 </div>
 <div class="clearfix"></div>
</div>

<script type="text/javascript">
var mySwiper = new Swiper('.swiper1 .swiper-container',{
    pagination: '.swiper1 .pagination',
    loop:true,
    grabCursor: true,
    paginationClickable: true,
    autoplay: 5000
});
$('.swiper1 .arrow-left').on('click', function(e){
    e.preventDefault();
    mySwiper.swipePrev()
});
$('.swiper1 .arrow-right').on('click', function(e){
    e.preventDefault();
    mySwiper.swipeNext()
});
// swiper1

// swiper2
var mySwiper2 = new Swiper('.swiper2 .swiper-container',{
    pagination: '.swiper2 .pagination',
    loop:true,
    grabCursor: true,
    paginationClickable: true,
    autoplay: 5000
});
$('.swiper2 .arrow-left').on('click', function(e){
    e.preventDefault();
    mySwiper2.swipePrev()
});
$('.swiper2 .arrow-right').on('click', function(e){
    e.preventDefault();
    mySwiper2.swipeNext()
});
// swiper2

// swiper3
var mySwiper3 = new Swiper('.swiper3 .swiper-container',{
    pagination: '.swiper3 .pagination',
    loop:true,
    grabCursor: true,
    paginationClickable: true,
    autoplay: 5000
});
$('.swiper3 .arrow-left').on('click', function(e){
    e.preventDefault();
    mySwiper3.swipePrev()
});
$('.swiper3 .arrow-right').on('click', function(e){
    e.preventDefault();
    mySwiper3.swipeNext()
});
// swiper3

// swiper4
var mySwiper4 = new Swiper('.swiper4 .swiper-container',{
    //pagination: '.swiper4 .pagination',
    loop:true,
    grabCursor: true,
    paginationClickable: true,
    autoplay: 5000,
    slidesPerView: 7,
    slidesPerGroup: 7
});

// swiper4

// swiper5
var mySwiper5 = new Swiper('.swiper5 .swiper-container',{
    //pagination: '.swiper4 .pagination',
    loop:true,
    grabCursor: true,
    paginationClickable: true,
    autoplay: 4000,
    mode: 'vertical'

});
$('.g-gonggao .arrow-left').on('click', function(e){
    e.preventDefault();
    mySwiper5.swipePrev()
});
$('.g-gonggao .arrow-right').on('click', function(e){
    e.preventDefault();
    mySwiper5.swipeNext()
});
</script>