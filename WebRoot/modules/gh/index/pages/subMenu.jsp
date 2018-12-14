<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<link href="!gh/index/~/css/index.css" rel="stylesheet" />
<link href="!gh/index/~/css/main.css" rel="stylesheet" />
<link href="!gh/index/~/css/list.css" rel="stylesheet" />
<link href="!gh/index/~/css/idangerous.swiper.css" rel="stylesheet"/>
<script type="text/javascript" src="!gh/index/~/scripts/idangerous.swiper.min.js"></script>
<%
  String code_table = request.getParameter("code_table");
  String code_num = request.getParameter("code_num");
  String detail_id = request.getParameter("detail_id");
%>
<script type="text/javascript">
//总页数
var all_page;
//当前页
var this_page = 1;
//每页记录数
var rows = 10;
movie_rows = 3;
//父分类
var code_table = "<%=code_table%>";
//子分类编码
var code_num = "<%=code_num%>";
var detail_id = "<%=detail_id%>";
//子分类名称
var code_name;
//子分类
var SUB_MENUS;
//子分类查询url
var menu_urls = [{"code_table":"BI_NOTICE","code_nums":[{"code_num":"2","url":"!gh/index/~query/Q_LOAD_SUB_MENU_FILE_DATA"}]}];
//详情url
var detail_urls = [{"code_table":"BI_GH_INFO","code_nums":[{"code_num":"1","url":"!gh/index/~query/Q_LOAD_SUB_MENU_DATA_DETAIL"}]}];
rdcp.ready(function(){
   loadSubMenus();
},rdcp.defaultLoadModules2);
//加载子分类和标题
function loadSubMenus(){
    rdcp.request("!gh/index/~query/Q_LOAD_SUB_MENU_LIST",{"code_table":code_table},function(data){
      SUB_MENUS = data.body.rows;
      $("#subMenu1").html(SUB_MENUS[0].MENU_NAME);
      $("#subMenu2").html(SUB_MENUS[0].MENU_NAME);
      if(code_num == "null"){
        code_num = SUB_MENUS[1].MENU_CODE;
        code_name = SUB_MENUS[1].MENU_NAME;
      }
      for(var i=1;i<SUB_MENUS.length;i++){
        var t = data.body.rows[i];
        var html = "";
        if(code_num == t.MENU_CODE){
          html += "<li id='li"+t.MENU_CODE+"' class='on'>";
          code_name = t.MENU_NAME;
        }
        else
          html += "<li id='li"+t.MENU_CODE+"'>";
        html += "<a href='javascript:void(0);' onclick=\"changeCodeNum('"+t.CODE_TABLE+"','"+t.MENU_CODE+"')\"><i class='jiantou'></i>"+t.MENU_NAME+"</a></li>";
        $("#submenu_list").append(html);
      }
      $("#menu_name1").html(code_name);
      $("#menu_name2").html(code_name+"<i class='hr'></i>");
      if(detail_id == "null"){
          loadData();
      }
      else
        showDetail(detail_id);
    });
}
//加载右边列表数据
function loadData(){
  if(code_table=="BI_SCHOOL_CULTURE"&&(code_num=="2"||code_num=="4")){
    loadMovieData();
    $("#data_list").html("");
  }
  else{   //基本页面
    loadCommonData();
    $("#main").html("<ul id='movie_list' class='movielist'></ul>");
  }
}
function loadCommonData() {
	$("#data_list").html("");
	var url = getUrl("menu");
	rdcp.request(url, {
		"code_table": code_table,
		"code_num": code_num,
		"page": this_page,
		"rows": rows
	}, function (data) {
		var list = data.body.rows;
		all_page = parseInt(data.body.total / rows);
		all_page += data.body.total % rows > 0 ? 1 : 0;
		if (list != null && code_table == "BI_GH_INFO" && code_num == "1") {
			showDetail(list[0].ID);
        }
// else if (code_table == "BI_ADVANCED_PEOPLE" && code_num == "1") { //先进人物全国劳模改展示页面效果 by xyj
//			var w = {};
//			for (var i = 0; i < list.length; i++) {
//				var t = list[i];
//				var html = "";
//				var deptName = t.DEPT_NAME;
//				var id = t.ID;
//				var personName = t.TITLE;
//				if (!(deptName in w)) {
//					w[deptName] = {};
//				}
//				w[deptName][id] = personName;
//			}
//			for (var deptName in w) {
//				var personList = w[deptName];
//				html += '<div class="yuanxi-item"><p class="tit">' + deptName + '</p>';
//				for (var key in personList) {
//					if (personList.hasOwnProperty(key)) {
//						html += '<ul class="yuanxilist"><li class="f-l"><a href="javascript:void(0);" onclick=\"showDetail('+key+');\">'+personList[key]+'</a></li>';				}
//					}
//				html += '<li class="clear"></li></ul></div></div>';
//				html += '<i class="clear"></i>';
//			}
//			$("#data_list").append(html);
//		}
		else {
			for (var i = 0; i < list.length; i++) {
				var t = list[i];
				var html = "";
				if (code_table == "BI_NOTICE" && code_num == "2") {
					html += "<li><p class='f-l tit'><a href='!service/file/~java/Downloader.get?id=" + t.FILE_ID + "' target='_blank'>[" + t.TITLE + "]--" + t.CREATE_TIME + "</a></p>";
					html += "<p class='f-r time'><a target='_blank' href='!service/file/~java/Downloader.get?id=" + t.FILE_ID + "'>[点击下载]</a></p></li>";
				}
				//解决基层动态点击更多后列表项的链接问题
				else if(code_table=="BI_NEWS_CENTER"){
                    html += "<li><a href='"+getSubUrl("BI_NEWS_CENTER","2",t.ID)+"' onclick=\"showDetail(" + t.ID + ");\"><p class='f-l tit'>" + t.TITLE + "</p>";
                    html += "<p class='f-r time'>" + t.CREATE_TIME + "</p></a></li>";
                }
				else {
					html += "<li><a href='javascript:void()' onclick=\"showDetail(" + t.ID + ");\"><p class='f-l tit'>" + t.TITLE + "</p>";
					html += "<p class='f-r time'>" + t.CREATE_TIME + "</p></a></li>";
				}
				$("#data_list").append(html);
			}
		}
		$("#data_list").show();
		$("#pages").show();
		$("#content").hide();
		loadFooter();
	});
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

function loadMovieData(){
  $("#main").html("<ul id='movie_list' class='movielist'></ul>");
  var url = getUrl("menu");
  rdcp.request(url,{"code_table":code_table,"code_num":code_num,"page":this_page,"rows":movie_rows},function(data){
    var list = data.body.rows;
    all_page = parseInt(data.body.total/movie_rows);
    all_page += data.body.total%movie_rows>0?1:0;
    for(var i=0;i<list.length;i++){
      var t = list[i];
      if(code_num == "4"){  //电影消息
          var html = "<li class='item' style='height: 130px;'><a href='javascript:void(0);' onclick='showDetail("+t.ID+");'>";
          html += "<div class='movie-cover'><img class='lazy' src='!service/file/~java/Downloader.get?type=thumb&id="+t.FILE_ID+"'></div>";
          html += "<div class='movie-content'><div class='flexRow flex-item flex-middle text-ellipsis'>";
          html += "<span class='movie-name'>"+t.TITLE+"</span></div><p>类型："+t.MOVIE_TYPE+"</p>";
          html += "<p>主演："+t.ACTORS+"</p><p class='dyxx-addr-hr'>时间："+t.PLAY_TIME+" &nbsp;&nbsp;&nbsp;地点："+t.PLAY_PLACE+"</p></div></a></li>";
          $("#movie_list").append(html);
      }
      else if(code_num == "2"){ //社团组织
         var html = "<div class='postall'><a href='javascript:void(0);' onclick='showDetail("+t.ID+")'>";
         html += "<div class='post_m'><p>"+t.TITLE+"</p></div><div class='post_img post_img02 animated bounceIn'>";
         html += "<img style='height:200px;' src='!service/file/~java/Downloader.get?type=thumb&id="+t.FILE_ID+"'></div>";
         html += "<div class='post_b'><span class='puff_left'>查看详情</span></div></a></div>";
         $("#main").append(html);
      }

    }
    $("#movie_list").show();
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
//切换分类
function changeCodeNum(codeTable,codeNum){
  code_table = codeTable;
  $("#li"+code_num).attr("class","");
  code_num = codeNum;
  $("#li"+code_num).attr("class","on");
  for(var i=0;i<SUB_MENUS.length;i++){
    if(code_num==SUB_MENUS[i].MENU_CODE)
      code_name = SUB_MENUS[i].MENU_NAME;
  }
  $("#menu_name1").html(code_name);
  $("#menu_name2").html(code_name+"<i class='hr'></i>");
  loadData();
}
//显示详情
function showDetail(id){
  var url = getUrl("detail");
  rdcp.request("!gh/index/~query/Q_ADD_VIEW_TIMES",{"code_table":code_table,"id":id},function(data){
    rdcp.request(url,{"code_table":code_table,"id":id},function(data) {
        $("#data_list").hide();
        $("#main").html("<ul id='movie_list' class='movielist'></ul>");
        $("#pages").hide();
        $("#content").show();
        var obj = data.body;
        var html = "";
        html += "<h1>" + obj.title + "</h1>";
        //修改视频在线页面展示 xyj 2017/8/5
        if (code_table == "BI_ELECTRONIC_PHOTO" && code_num == "2") {
            html += "<p class='g-article-data'>类别:" + obj.type + "&nbsp;&nbsp;&nbsp;&nbsp;发布人:" + obj.user_name +
            "&nbsp;&nbsp;&nbsp;&nbsp;浏览次数:" + obj.view_times + "次&nbsp;&nbsp;&nbsp;&nbsp;发布时间:" + obj.create_time + "</p>";
            html += "<div class='g-article-content' style='text-align: center;'>" + obj.content + "</div>";
        }
        else {
            html += "<p class='g-article-data'>类别:" + obj.type + "&nbsp;&nbsp;&nbsp;&nbsp;发布人:" + obj.user_name +
            "&nbsp;&nbsp;&nbsp;&nbsp;浏览次数:" + obj.view_times + "次&nbsp;&nbsp;&nbsp;&nbsp;发布时间:" + obj.create_time + "</p>";
            html += "<div class='g-article-content'>" + obj.content + "</div>";
        }
        if (data.body.file_ids != "") {
            var file_ids = data.body.file_ids.split(",");
            var file_names = data.body.file_names.split(",");
            html += "<h3>附件列表</h3><table>";

            for(var i=0;i<file_ids.length;i++){
                html += "<tr><td><a href='!service/file/~java/Downloader.get?id="+file_ids[i]+"' target='_blank' style='text-decoration:underline;'>"+file_names[i]+"</a></td></tr>"
            }
            html += "</table>";
        }
        $("#content").html(html);
      });
  });

}
//返回请示url
function getUrl(type){
  var url;
  if(type=="menu")
    url = "!gh/index/~query/Q_LOAD_SUB_MENU_DATA";
  if(type=="detail")
    url = "!gh/index/~query/Q_LOAD_SUB_MENU_DATA_DETAIL";
  if(type=="menu"){
      for(var i=0;i<menu_urls.length;i++){
        if(menu_urls[i].code_table==code_table){
          var temp = menu_urls[i].code_nums;
          for(var j=0;j<temp.length;j++){
            if(temp[j].code_num==code_num)
              url = temp[j].url;
          }
        }
      }
  }
  if(type=="detail"){
    for(var i=0;i<detail_urls.length;i++){
        if(detail_urls[i].code_table==code_table){
          var temp = detail_urls[i].code_nums;
          for(var j=0;j<temp.length;j++){
            if(temp[j].code_num==code_num)
              url = temp[j].url;
          }
        }
    }
  }
  return url;
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
		 <!-- 公告 -->
		 <div class="g-gonggao">
			 <div class="index-notice f-l">
				 <span>HOT:</span>
				 <!--swiper-->
				 <div class="swiper5">

					 <div class="swiper-container">
						 <div class="swiper-wrapper">
							 <div class="swiper-slide"><a href="">欢迎访问武汉大学工会官方网站！</a></div>
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

		<!--列表页内容区-->
		<div class="g-list-container">
			<!--面包屑-->
			<div class="g-list-mbx">
				<img src="!gh/index/~/images/g-icon-home.jpg" style="display: inline-block; margin-right: 5px;" alt=""><a id="a_index" href="pages/home.jsp">首页</a>  >   <a id="subMenu1" href="pages/subMenu.jsp?code_table=<%=code_table%>"></a>  >   <a id="menu_name1" href="javascript:void(0);"></a>
			</div>
			<!--内容-->
			<div class="g-list-main">
				<div class="menu f-l">
					<div class="g-list-menu-item">
						<h3><a id="subMenu2" href="javascript:void(0);"><img src="!gh/index/~/images/g-icon-news.png" alt=""></a></h3>
						<ul id="submenu_list">
						</ul>
					</div>
				</div>
				<div class="content f-r">
					<h3><span id="menu_name2"><i class="hr"></i></span><i  class="clear"></i></h3>
					<div class="swiper-container">
                        <div class="swiper-wrapper" style="width:100%;">
                            <div class="swiper-slide" style="width:100%;">
                                <div class="content-slide">
                                    <div id="main" class="main">

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
					<ul id="data_list">
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
$('.g-yqlj-left:eq(0)').on('click', function(e){
    e.preventDefault();
    mySwiper4.swipePrev()
});
$('.g-yqlj-left2').on('click', function(e){
    e.preventDefault();
    mySwiper4.swipeNext()
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