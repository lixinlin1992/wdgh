<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<link href="!gh/index/~/css/idangerous.swiper.css" rel="stylesheet" />
<link href="!gh/index/~/css/index.css" rel="stylesheet" />
<script type="text/javascript" src="!gh/index/~/scripts/idangerous.swiper.min.js"></script>
<div class="index-main">
	<!-- banner -->
	<div class="public-container">
		<div class="index-bannner">
			<!--swiper-->
			<div class="swiper1">
				<!--<a class="arrow-left" href="#"></a>-->
				<!--<a class="arrow-right" href="#"></a>-->
				<div class="swiper-container">
					<div class="swiper-wrapper"   id="swiper_banner">

						<%--<div class="swiper-slide"><img src="!gh/index/~/images/banner.jpg" alt="banner" title="banner"/></div>--%>
						<%--<div class="swiper-slide"><img src="!gh/index/~/images/banner02.jpg" alt="banner" title="banner"/></div>--%>
						<%--<div class="swiper-slide"><img src="!gh/index/~/images/banner04.jpg" alt="banner" title="banner"/></div>--%>
						<%--<div class="swiper-slide"><img src="!gh/index/~/images/banner.jpg" alt="banner" title="banner"/></div>--%>
					</div>
				</div>
				<div class="pagination"></div>
			</div>
			<!--swiper-->
		</div>

	<!-- 公告 -->
	<div class="g-gonggao">
		<div class="index-notice f-l">
			<span>HOT:</span>
			<!--swiper-->
			<div class="swiper5">
				<!--<a class="arrow-left" href="#"></a>-->
				<!--<a class="arrow-right" href="#"></a>-->
				<div class="swiper-container">
					<div class="swiper-wrapper" id="swiper_notice_list">
					</div>
				</div>
				<div class="pagination"></div>
			</div>
			<!--swiper-->
			<div class="index-notice-arrow">
				<i class="arrow-left"></i>
				<i class="arrow-right"></i>
			</div>
		</div>
		<div class="g-search f-r">
			<form action="pages/search.jsp">
				<input class="wd" name="key" type="text">
				<input class="btn" type="image" src="!gh/index/~/images/g-btn.jpg">
			</form>
		</div>
		<i class="clear"></i>
	</div>

	<!-- 最新文章图文列表 -->
		<div class="index-newarticle mt10">
			<div class="index-col-3 border">
				<!--swiper-->
				<div class="swiper2">
					<a class="arrow-left" href="#"></a>
					<a class="arrow-right" href="#"></a>
					<div class="swiper-container">
						<div class="swiper-wrapper" id="news_div3">

						</div>
					</div>
					<div class="pagination"></div>
				</div>
				<!--swiper-->

				<div class="mt11">
					<div class="mt11-title" id="news_title3"></div>
					<div class="mt11-content" id="news_content3"></div>
				</div>

			</div>

			<div class="index-col-3 ml15 border g-zxdt">
				<div class="index-col-title">
					<div class="title-left">
						<span>综合新闻</span>
					</div>
					<div class="title-right">
						<a href="pages/subMenu.jsp?code_table=BI_NEWS_CENTER&code_num=1" target="_blank"><i></i></a>
					</div>
				</div>
				<ul class="index-col-list list1" id="news_ul1">
				</ul>
				<i class="clear"></i>
			</div>
		</div>
		<div class="clearfix"></div>
	<!-- 功能展示和中印尼关系部分 -->
	<div class="index-fun mt10">
		<div class="index-menu border">
			<ul style="margin-top: 12px;">
				<li class="item"><i class="people"></i><a href="http://tian.whu.edu.cn/login.php" target="_blank">提案系统</a></li>
				<li class="item"><i class="file"></i><a href="pages/login.jsp" target="_blank">会籍管理</a></li>
				<li class="item"><i class="char"></i><a href="http://huzhu.whu.edu.cn/" target="_blank">大病救助</a></li>
				<li class="item"><i class="cg"></i><a href="http://sjygh.whu.edu.cn/login.jsp" target="_blank">缘分天空</a></li>
			</ul>
			<div class="index-contact">
				<img src="!gh/index/~/images/ad1.jpg" style=" margin: 0 auto" alt=""></a>
			</div>
		</div>
		<div class="index-fun-article border ml10">
			<div class="fun-article-title">
				<div class="title-left">
					<i></i>
					<span>基层动态</span>
					<div class="title-bg"></div>
					<div class="more"><a target="_blank" href="pages/subMenu.jsp?code_table=BI_NEWS_CENTER&code_num=2">更多+</a></div>
				</div>
				<div class="title-right"><i></i></div>
			</div>
			<div class="func-artic-left fl">
				<!--swiper-->
				<div class="swiper3">
					<!--<a class="arrow-left" href="#"></a>-->
					<!--<a class="arrow-right" href="#"></a>-->
					<div class="swiper-container">
						<div class="swiper-wrapper" id="jcdt_div">
						</div>
					</div>
					<div class="pagination"></div>
				</div>
				<!--swiper-->
			</div>
			<ul class="index-fun-list fr" id="jcdt_ul">
			</ul>
		</div>
	</div>
	<div class="clearfix"></div>
	<!-- 部分栏目最新内容部分 -->
	<div class="index-category-new mt15">
		<div class="index-col-3 border ml10 ml10-w" style="margin-left:0;">
			<div class="col-title">
				<span class="title-text fl">发稿排行</span>
				<div class="col-wytg"><a target="_blank" href="pages/login.jsp"><img src="!gh/index/~/images/wytg.png"></a></div>
			</div>
			<div class="col-list clearfix swiper6">
				<div class="swiper-container">
                	<ul class="swiper-wrapper index-col-list list-num" sstyle="display: none" id="tg_ul"></ul>
                </div>
			</div>
		</div>
		<div class="index-col-3 border ml10 ml10-w"  style="height: 278px">
			<div class="col-title">
				<span class="title-text fl">通知公告</span>
				<div class="col-more fr"><a target="_blank" href="pages/subMenu.jsp?code_table=BI_NOTICE"><i></i></a></div>
			</div>
			<div class="col-list clearfix">
                <div class="index-lately" id="notice_div"></div>
				<ul class="index-col-list list3" id="notice_ul">
				</ul>
			</div>
		</div>
		<div class="index-col-3 border ml10 ml10-w">
			<div class="col-title">
				<span class="title-text fl">政策法规</span>
				<div class="col-more fr"><a target="_blank" href="pages/subMenu.jsp?code_table=BI_POLICY_REGULATION"><i></i></a></div>
			</div>
			<div class="col-list clearfix">
				<ul class="index-col-list list3" id="policy_ul">
				</ul>
			</div>
		</div>
	</div>
	<div class="clearfix"></div>
 </div>
 <div class="clearfix"></div>
</div>
<script type="text/javascript">
var index = 1;
var index2=1;
var index_banner=1;
var INDEX_DATA;
var mySwiper4;
rdcp.ready(function(data){
  loadIndexData();
});
function loadIndexData(){
  rdcp.request("!gh/index/~query/Q_LOAD_INDEX_DATA",{},function(data){
     INDEX_DATA = data.body.rows;
     loadNotice();
  });
};
function loadNotice(){
  var is_index = true;
  for(var i=0;i<INDEX_DATA.length;i++){
    var html = "";
    var t= INDEX_DATA[i];
	//加载滚动图片
	if(t.DATA_TYPE=="BANNER" && t.SUB_TYPE=="-1"&&index_banner<5){
	   var ids = t.FILE_IDS.split(",");
	   var html = "<div class=\"swiper-slide\"> <img  alt=\"banner\"  src='!service/file/~java/Downloader.get?id="+ids[0]+" '/></div>";
	   $("#swiper_banner").append(html);
	   index_banner++;
	}
	//加载通知公告
    if(t.DATA_TYPE=="BI_NOTICE"&&index2<5){
		index2++;
       html = "<div class='swiper-slide'><a target='_blank' href='"+getSubUrl(t.DATA_TYPE,t.SUB_TYPE,t.ID)+"'>"+t.TITLE+"</a></div>";
       $("#swiper_notice_list").append(html);
       if(is_index){
         html = "<div class='lately-date fl'><span class='date-day'>"+t.CREATE_TIME.substring(8,10)+"</span></br>";
         html +="<span class='date-other'>"+t.CREATE_TIME.substring(0,7)+"</span></div>";
         html +="<div class='lately-cont'><p class='lately-title'><a target='_blank' href='"+getSubUrl(t.DATA_TYPE,t.SUB_TYPE,t.ID)+"'>"+t.TITLE+"</a></p>";
         html +="<span class='lately-des'>"+t.TITLE+"</span></div>";
         $("#notice_div").append(html);
         is_index = false;5
       }
       else{
         html = "<li class='item'><i></i><a target='_blank' href='"+getSubUrl(t.DATA_TYPE,t.SUB_TYPE,t.ID)+"'>"+t.TITLE+"</a><span class='item-time'>"+t.CREATE_TIME.substring(5,10)+"</span></li>";
         $("#notice_ul").append(html);
       }
    }
    if(t.DATA_TYPE=="BI_POLICY_REGULATION"){
      html = "<li class='item'><i></i><a target='_blank' href='"+getSubUrl(t.DATA_TYPE,t.SUB_TYPE,t.ID)+"'>"+t.TITLE+"</a><span class='item-time'>"+t.CREATE_TIME.substring(5,10)+"</span></li>";
      $("#policy_ul").append(html);
    }



        if (t.DATA_TYPE == "TGSL"&&index<8) {
            html = "<li class='item swiper-slide i" + index + "'><i></i><a href='javascript:void(0);'>" + t.TITLE + "投稿量：&nbsp;&nbsp;&nbsp;" + t.ID + "</a><span class='item-time'></span></li>";
            $("#tg_ul").append(html);
            index++;
        }

    if(t.DATA_TYPE=="BI_NEWS_CENTER" && t.SUB_TYPE=="1"){
	  var ids = t.FILE_IDS.split(",");
	  var html = "<li class='item pic-item' style='margin-left: 13px;'><a target='_blank' href='"+getSubUrl(t.DATA_TYPE,t.SUB_TYPE,t.ID)+"'>"+
	  "<img src='!service/file/~java/Downloader.get?type=thumb&id="+ids[0]+"'/><div class='txt'>"+
	  "<h2>"+t.TITLE+"</h2><p class='item-title'>"+t.CONTENT+"..."+t.CREATE_TIME.substring(5,10)+"</p></div></a></li>";
	  $("#news_ul1").append(html);
	}
	if(t.DATA_TYPE=="BI_NEWS_CENTER" && t.SUB_TYPE=="2"){
	  var ids = t.FILE_IDS.split(",");
	  for(var j=0;j<ids.length;j++){
	    if(ids[j]!=""){
	      html ="<div class='swiper-slide'><img src='!service/file/~java/Downloader.get?id="+ids[j]+"'/></div>";
	      $("#jcdt_div").append(html);
	    }
	  }
	  html = "<li class='item'><i></i><a target='_blank' href='"+getSubUrl(t.DATA_TYPE,t.SUB_TYPE,t.ID)+"'>"+t.TITLE+"</a><span class='item-time'>"+t.CREATE_TIME.substring(5,10)+"</span></li>";
	  $("#jcdt_ul").append(html);
	}
	if(t.DATA_TYPE=="BI_NEWS_CENTER" && t.SUB_TYPE=="3"){
	  var ids = t.FILE_IDS.split(",");
	  for(var j=0;j<ids.length;j++){
	    if(ids[j]!=""){
		  html ="<div class='swiper-slide'><img src='!service/file/~java/Downloader.get?id="+ids[j]+"'/></div>";
		  $("#news_div3").append(html);
		}
	  }
	  html = "<a target='_blank' href='"+getSubUrl(t.DATA_TYPE,t.SUB_TYPE,t.ID)+"'>"+t.TITLE+"</a>";
	  $("#news_title3").append(html);
	  $("#news_content3").html(t.CONTENT);
	}
  }
  newSwiper1();
  newSwiper2();
  newSwiper3();
  newSwiper4();
  newSwiper5();
  newSwiper6();
}
function loadPolicy(){
  var t= INDEX_DATA[i];
  if(t.DATA_TYPE=="BI_POLICY_REGULATION"){
    var html = "<li class='item'><i></i><a href='javascript:void(0);'>"+t.TITLE+"</a><span class='item-time'>"+t.CREATE_TIME.substring(5,10)+"</span></li>";
    $("#policy_ul").append(html);
  }
}
function getSubUrl(code_table,code_num,detail_id){
  var url = "pages/subMenu.jsp?";
  if(code_table!=null && code_table!=undefined)
    url += "code_table="+code_table;
  if(code_num!=null && code_num!=undefined)
    url += "&code_num="+code_num;
  if(detail_id!=null && detail_id!=undefined)
    url += "&detail_id="+detail_id;
  return url;
}
function newSwiper1(){
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
}

function newSwiper2(){
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
}

function newSwiper3(){
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
}
// swiper4
function newSwiper4(){
	mySwiper4 = new Swiper('.swiper4 .swiper-container',{
		//pagination: '.swiper4 .pagination',
		loop:true,
		grabCursor: true,
		paginationClickable: true,
		autoplay: 5000,
		slidesPerView: 7,
		slidesPerGroup: 7
	});
	$('.g-yqlj-left:eq(0)').on('click', function(e){
		e.preventDefault();
		mySwiper4.swipePrev()
	});
	$('.g-yqlj-left2').on('click', function(e){
		e.preventDefault();
		mySwiper4.swipeNext()
	});
}
// swiper4

function newSwiper5(){
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
}
function newSwiper6(){
	var mySwiper6 = new Swiper('.swiper6 .swiper-container',{
		//pagination: '.swiper4 .pagination',
		loop:true,
		grabCursor: true,
		paginationClickable: true,
		autoplay: 3000,
		mode: 'vertical',
		slidesPerView: 7,
		slidesPerGroup: 1,
		loopAdditionalSlides:2

	});
	$('.g-gonggao .arrow-left').on('click', function(e){
		e.preventDefault();
		mySwiper6.swipePrev()
	});
	$('.g-gonggao .arrow-right').on('click', function(e){
		e.preventDefault();
		mySwiper6.swipeNext()
	});
}
</script>