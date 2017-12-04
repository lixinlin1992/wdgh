<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<link href="!gh/index/~/css/reset.css" rel="stylesheet" />
<link href="!gh/index/~/css/public.css" rel="stylesheet" />
<link href="!gh/index/~/css/list.css" rel="stylesheet" />
<!-- header -->


 <div class="public-header">
	<div class="public-header-top">
		<div class="public-container">
			<div class="public-left">
				<p>欢迎访问武汉大学工会官方网站！</p>
			</div>
			<ul class="public-header-list">
				<li class="item"><i class="call"></i><a href="#">&nbsp;</a></li>
				<li class="item"><i class="home"></i><a href="http://ghwx.whu.edu.cn">门户旧址</a></li>
				<li class="item"><i class="sc"></i><a href="#" onclick="javascript:addFavorite2()">加入收藏</a></li>
				<div id="phone_content">
				<div class="help-tip">
					<p><img  src="!gh/index/~/images/tel.png" width="300"  /></p>
				</div>
			</div>
			</ul>


		</div>
	</div>
	<div class="public-header-middle public-container clearfix">
		<div class="public-left">
			<div class="logo"><a href="pages/home.jsp"></a></div>
		</div>
		<div class="public-left g-menu">
			<ul id="menu_list">
				<li class="item on"><a href="pages/home.jsp">网站首页</a><i class="hr"></i></li>
			</ul>
				<!--<input type="text" class="public-input-text"/>-->
				<!--<input type="submit" class="public-input-btn" value=""/>-->
		</div>
	</div>
 </div>
<script type="text/javascript">
var INDEX_MENUS;
rdcp.ready(function(){
  loadMenus();
});
function loadMenus(){
  rdcp.request("!gh/index/~query/Q_INDEX_MENU_LIST",{},function(data){
    INDEX_MENUS = data.body.rows;
    for(var i=0;i<INDEX_MENUS.length;i++){
      var html = "";
      var t = INDEX_MENUS[i];
      if(t.MENU_TYPE=="1"){
        html += "<li class='item'><a href='javascript:void(0);'>"+t.MENU_NAME+"</a><i class='hr'></i><ul class='sub1' id='sub_menu"+t.MENU_ID+"'></ul></li>";
        $("#menu_list").append(html);
      }
      else if(t.MENU_TYPE=="2"){
        html += "<li class='item2'><a href='"+t.MENU_URL+"'>"+t.MENU_NAME+"</a></li>";
        $("#sub_menu"+t.P_MENU_ID).append(html);
      }
    }
  });
}
</script>

<%--加入收藏--%>
<script>
    function addFavorite2() {
        var url = window.location;
        var title = document.title;
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("360se") > -1) {
            alert("由于360浏览器功能限制，请按 Ctrl+D 手动收藏！");
        }
        else if (ua.indexOf("msie 8") > -1) {
            window.external.AddToFavoritesBar(url, title); //IE8
        }
        else if (document.all) {
            try{
                window.external.addFavorite(url, title);
            }catch(e){
                alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
            }
        }
        else if (window.sidebar) {
            window.sidebar.addPanel(title, url, "");
        }
        else {
            alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
        }
    }
</script>



<!--header-->