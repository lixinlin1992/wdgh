<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sunrise.framework.core.ApplicationManager" %>
<%
//	String path = request.getContextPath();
//	String basePath = request.getScheme() + "://"
//			+ request.getServerName() + ":" + request.getServerPort()
//			+ path + "/";
  String path = request.getContextPath();
  String basePath = path.length()==1?path:(path+"/"); 

%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>新洲欢迎您</title>
  <base href="<%=basePath%>">
  <link href="pages/css/main.css" rel="stylesheet" type="text/css">
  <link href="pages/css/index.css" rel="stylesheet" type="text/css">
  <script type="text/javascript" src="pages/js/jquery-1.10.2.min.js"></script>
  <script type="text/javascript" src="pages/js/jquery.slideBox.min.js" type="text/javascript"></script>
  <script type="text/javascript" src="pages/js/jquery.tab.js"></script>
  <script type="text/javascript" src="pages/js/jcarousellite_index.js"></script>
  <script type="text/javascript" src="pages/js/jquery-powerSwitch.js"></script>
  <script type="text/javascript" src="pages/js/jquery.sudoSlider.min.js"></script>
  <script type="text/javascript" src="pages/js/jquery.flash.js"></script>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
</head>


<body>
<!--[if IE 6]>
<script src="/js/DD_belatedPNG.js"></script>
<script>DD_belatedPNG.fix('.yc_logo img,.yc_shadow,.yc_shadow_bot img,.sub_content,.img_mark,.yc_gzcy_left_menu li span img');</script>
<script>
  document.execCommand("BackgroundImageCache", false, true);
</script>
<![endif]-->
<div class="yc_bg_flash flash-replaced" id="bgFlash" style="background:url(pages/images/bg_sea.jpg) no-repeat center top">
  <div class="index_banner" id="banner_tabs2">
    <ul>
      <li class="first"><a href="content.html" target="_blank"></a></li>
      <li class="second"><a href="content.html" target="_blank"></a></li>
    </ul>
    <cite style="display:none;">
      <span class="cur">1</span><span>2</span>
    </cite>
  </div>
  <div class="alt"></div>
</div>
<header class="yc_header">
  <div class="yc_topBox"> </div>
</header>
<div class="yc_container">
  <div class="yc_nav_top boxImg"><img src="pages/images/img_nav_top.png" width="1000" height="6"></div>
  <div class="yc_shadow">
    <nav class="yc_nav">
      <div class="yc_nav_menu">
        <div class="yc_menu"><a class="yc_menu_link_first" href="index.html" title="首页"></a></div>
        <div class="yc_menu"><a class="yc_menu_link" href="info.html" target="_blank"></a>
          <div class="yc_submenu yc_menu1" style="display: none;">
            <div class="triangle"></div>
            <div class="yc_sub_content">
              <div class="yc_subleft fl">
                <ul>
                  <li><a href="#zjyc/ycgk/">新洲概况</a></li>
                  <li><a href="#zjyc/jzyg/">建制沿革</a></li>
                  <li><a href="#zjyc/xzqh">行政区划</a></li>
                  <li><a href="#zjyc/dlhj">地理环境</a></li>
                  <li><a href="#zjyc/zrzy">自然资源</a></li>
                  <li><a href="#zjyc/rwls">人文历史</a></li>
                  <li><a href="#zjyc/mfms">民风民俗</a></li>
                  <li><a href="#zjyc/mytc">名优特产</a></li>
                  <li><a href="#zjyc/jjfz">经济发展</a></li>
                  <li><a href="#zjyc/yxyc">影像新洲</a></li>
                </ul>
              </div>
              <div class="yc_subright fl"><a href="##"><img src="pages/images/img_sub1.jpg" alt="" width="187" height="149"></a></div>
            </div>
          </div>
        </div>
        <div class="yc_menu"><a class="yc_menu_link" href="info.html" target="_blank"></a>
          <div class="yc_submenu yc_menu2">
            <div class="triangle"></div>
            <div class="yc_sub_content">
              <div class="yc_sublist">
                <ul>
                  <li><a href="#zfxxgk.aspx">政府信息公开专栏</a></li>
                  <li><a href="#xxgk/gzdt/">工作动态</a></li>
                  <li><a href="#xxgk/tzgg/">通知公告</a></li>
                  <li><a href="#ldzy.aspx">领导专页</a></li>
                  <li><a href="#xxgk/jgsz/">机构设置</a></li>
                  <li><a href="#xxgk/zcjd/">政策解读</a></li>
                  <li><a href="#xxgk/ghjh/">规划计划</a></li>
                  <li><a href="#xxgk/czzj/">财政资金</a></li>
                  <li><a href="#xxgk/hjbh/">环境保护</a></li>
                  <li><a href="#xxgk/aqsc/">安全生产</a></li>
                  <li><a href="#xxgk/zdcq/">征地拆迁</a></li>
                  <li><a href="#xxgk/ggzy/">公共资源</a></li>
                  <li><a href="#xxgk/zdxm/">重点项目</a></li>
                  <li><a href="#xxgk/yjgl/">应急管理</a></li>
                  <li><a href="#xxgk/zfwj/">政府文件</a></li>
                  <li><a href="#xxgk/zfhy/">政府会议</a></li>
                  <li><a href="#xxgk/cxjs/">城乡建设</a></li>
                  <li><a href="#xxgk/rsxx/">人事信息</a></li>
                  <li><a href="#xxgk/tjxx/">统计信息</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="yc_menu"><a class="yc_menu_link" href="info.html" target="_blank"></a>
          <div class="yc_submenu yc_menu3">
            <div class="triangle"></div>


            <a href="content.html"></a>

          </div>
        </div>
        <div class="yc_menu"><a class="yc_menu_link" href="about.html" target="_blank"></a>
          <div class="yc_submenu yc_menu4" style="display:none;">
            <div class="triangle"></div>
            <div class="yc_sub_content">
              <div class="yc_subleft4 fl">
                <ul>
                  <li><a href="content.html">走进社区</a></li>
                  <li><a href="content.html">新洲书画</a></li>
                  <li><a href="content.html">游在新洲</a></li>
                  <li><a href="content.html">住在新洲</a></li>
                  <li><a href="content.html">新洲美食</a></li>
                </ul>
              </div>
              <div class="yc_subright fl"><a href="content.html"><img src="pages/images/img_sub3.jpg" alt="" width="187" height="149"></a></div>
            </div>
          </div>
        </div>
        <div class="yc_menu">
          <a class="yc_menu_link" href="info.html" target="_blank"></a>
          <div class="yc_submenu yc_menu5" style="display: none;">
            <div class="triangle"></div>
            <div class="yc_sub_content">
              <div class="yc_subleft4 fl">
                <ul>
                  <li><a href="content.html">招商动态</a></li>
                  <li><a href="content.html">优惠政策</a></li>
                  <li><a href="content.html">投资环境</a></li>
                  <li><a href="content.html">审批公告</a></li>
                  <li><a href="content.html">项目推荐</a></li>
                </ul>
              </div>
              <div class="yc_subright fl"><a href="content.html" target="_blank"><img src="pages/images/img_sub3.jpg" alt="" width="187" height="149"></a></div>
            </div>
          </div>
        </div>
      </div>
      <!--yc_nav_menu-->
      <form name="f1" action="http://www.baidu.com/baidu">
        <div class="yc_search">
          <input type="text" name="word" class="yc_s_input fl" value="请输入关键字" onFocus="if(this.value==&#39;请输入关键字&#39;)this.value=&#39;&#39;;" onBlur="if(this.value==&#39;&#39;)this.value=&#39;请输入关键字&#39;">
          <!--<input class="yc_btn_Asearch fl" type="image" value="搜索">-->
          <input name="tn" type="hidden" value="bds">
          <input name="cl" type="hidden" value="3">
          <input name="ct" type="hidden" value="2097152">
          <input name="si" type="hidden" value="#">
        </div>
        <!--search-->
      </form>
    </nav>
    <iframe width="100%" scrolling="no" height="2600" frameborder="0" allowtransparency="true" src="pages/main1.jsp"></iframe>
  </div>
</div>
</body>
<script type="text/javascript">
  $(document).ready(function(){
    var sudoSlider = $("#slider").sudoSlider({
      slideCount:4,
      continuous:true,
      numeric:false,
      prevNext:true,
      continuous:true,
      auto:true,
      speed:800,
      pause:3000,
      prevHtml:'<a href="content.html" class="prevBtn"></a>',
      nextHtml:'<a href="content.html" class="nextBtn"></a>'
    });
    $("#slider li").on("mouseenter",function(){
      $(this).find(".img_mark").fadeIn(200).removeClass("nodis");
    })
    $("#slider li").on("mouseleave",function(){
      $(this).find(".img_mark").fadeOut(200).addClass("nodis")
    })
    $(".yc_menu").on("mouseenter",function(){
      $(this).find(".yc_submenu").slideDown(300);
    });
    $(".yc_menu").on("mouseleave",function(){
      $(this).find(".yc_submenu").slideUp(200);
    });

    $('#demo1').slideBox();
    $('#demo2').slideBox({
      direction : 'top',//left,top#方向
      duration : 0.3,//滚动持续时间，单位：秒
      easing : 'linear',//swing,linear//滚动特效
      delay : 5,//滚动延迟时间，单位：秒
      startIndex : 1//初始焦点顺序
    });
    $('#demo3').slideBox({
      duration : 0.3,//滚动持续时间，单位：秒
      easing : 'linear',//swing,linear//滚动特效
      delay : 5,//滚动延迟时间，单位：秒
      hideClickBar : false,//不自动隐藏点选按键
      clickBarRadius : 10
    });
    $('#demo4').slideBox({
      hideBottomBar : true//隐藏底栏
    });
  });
  (function(){
    if(!Function.prototype.bind){
      Function.prototype.bind = function(obj){
        var owner = this,args = Array.prototype.slice.call(arguments),callobj = Array.prototype.shift.call(args);
        return function(e){e=e||top.window.event||window.event;owner.apply(callobj,args.concat([e]));};
      };
    }
  })();
  var banner_tabs = function(id){
    this.ctn = document.getElementById(id);
    this.adLis = null;
    this.btns = null;
    this.animStep = 0.1;//动画速度0.1～0.9
    this.switchSpeed =6;//自动播放间隔(s)
    this.defOpacity = 1;
    this.tmpOpacity = 1;
    this.crtIndex = 0;
    this.crtLi = null;
    this.adLength = 0;
    this.timerAnim = null;
    this.timerSwitch = null;
    this.init();
  };
  banner_tabs.prototype = {
    fnAnim:function(toIndex){
      if(this.timerAnim){window.clearTimeout(this.timerAnim);}
      if(this.tmpOpacity <= 0){
        this.crtLi.style.opacity = this.tmpOpacity = this.defOpacity;
        this.crtLi.style.filter = 'Alpha(Opacity=' + this.defOpacity*100 + ')';
        this.crtLi.style.zIndex = 0;
        this.crtIndex = toIndex;
        return;
      }
      this.crtLi.style.opacity = this.tmpOpacity = this.tmpOpacity - this.animStep;
      this.crtLi.style.filter = 'Alpha(Opacity=' + this.tmpOpacity*100 + ')';
      this.timerAnim = window.setTimeout(this.fnAnim.bind(this,toIndex),50);
    },
    fnNextIndex:function(){
      return (this.crtIndex >= this.adLength-1)?0:this.crtIndex+1;
    },
    fnSwitch:function(toIndex){
      if(this.crtIndex==toIndex){return;}
      this.crtLi = this.adLis[this.crtIndex];
      for(var i=0;i<this.adLength;i++){
        this.adLis[i].style.zIndex = 0;
      }
      this.crtLi.style.zIndex = 2;
      this.adLis[toIndex].style.zIndex = 1;
      for(var i=0;i<this.adLength;i++){
        this.btns[i].className = '';
      }
      this.btns[toIndex].className = 'cur'
      this.fnAnim(toIndex);
    },
    fnAutoPlay:function(){
      this.fnSwitch(this.fnNextIndex());
    },
    fnPlay:function(){
      this.timerSwitch = window.setInterval(this.fnAutoPlay.bind(this),this.switchSpeed*1000);
    },
    fnStopPlay:function(){
      window.clearTimeout(this.timerSwitch);
    },
    init:function(){
      this.adLis = this.ctn.getElementsByTagName('li');
      this.btns = this.ctn.getElementsByTagName('cite')[0].getElementsByTagName('span');
      this.adLength = this.adLis.length;
      for(var i=0,l=this.btns.length;i<l;i++){
        with({i:i}){
          this.btns[i].index = i;
          this.btns[i].onclick = this.fnSwitch.bind(this,i);
          this.btns[i].onclick = this.fnSwitch.bind(this,i);
        }
      }
      this.adLis[this.crtIndex].style.zIndex = 2;
      this.fnPlay();
      this.ctn.onmouseover = this.fnStopPlay.bind(this);
      this.ctn.onmouseout = this.fnPlay.bind(this);
    }
  };
  var player1 = new banner_tabs('banner_tabs2');
</script>
</html>
