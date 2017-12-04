<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>





  <div class="bottom">
    <div class="container">
       <div class="row">
          <div class="col-sm-4 col-md-3 col-lg-4 text-center">
              <p class="mb30"><a href="index-1.htm" tppabs="index.htm"><img src="!gh/mobile/img/logo152.png" alt=""></a></p>
          </div>
          <div class="col-sm-12 col-md-4 col-lg-3 text-center">
             <ul class="list-inline pt30">

                <li class="toggleCode">
                  <p>
                   <%--  <a href="http://newmedia.whu.edu.cn/wechatwelcome" tppabs="http://newmedia.whu.edu.cn/wechatwelcome" target="_blank">   --%>
                       <a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzIwMzgxMTczNg==&scene=110#wechat_redirect" tppabs="https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzIwMzgxMTczNg==&scene=110#wechat_redirect" target="_blank">

                       <span class="icon icon-wechat"></span>
                     </a>
                  </p>
                  <p>官方微信</p>
                  <div class="codeSpan" style="display: none">   <img src="!gh/index/~/images/code-wx.jpg" tppabs="http://www.whu.edu.cn/ch_template/img/code-wx.jpg" alt="官方微信"></div>
                </li>



                <li class="toggleCode">
                  <p>
                     <a href="http://weibo.com/wuhandaxue" tppabs="http://weibo.com/wuhandaxue" target="_blank">
                       <span class="icon icon-sina"></span>
                     </a>
                  </p>
                  <p>官方微博</p>
                  <div class="codeSpan" style="display: none"><img src="!gh/index/~/images/code-wb.png" tppabs="http://www.whu.edu.cn/ch_template/img/code-wb.png" alt="官方微博"></div>
                </li>
                <li class="toggleCode">
                   <p>
                      <a href="http://i.whu.edu.cn/" tppabs="http://i.whu.edu.cn/" target="_blank">
                        <span class="icon icon-app"></span>
                      </a>
                   </p>
                   <p>移动应用</p>
                   <div class="codeSpan" style="display: none" ><img src="!gh/index/~/images/code-yd.png" tppabs="http://www.whu.edu.cn/ch_template/img/code-yd.png" alt="移动应用"></div>
                </li>


                <li class="toggleCode">
                  <p>
                    <a href="http://bbs.whu.edu.cn" tppabs="http://bbs.whu.edu.cn/" target="_blank">
                      <span class="icon icon-ss"></span>
                    </a>
                  </p>
                  <p>珞珈山水</p>

                </li>


             </ul>
          </div>
       </div>
    </div>
  </div>

  <nav class="navbar navbar-default navbar-top footer" role="navigation">
    <div class="container">
      <div class="row">
        <div class="col-sm-12 col-md-8">
          <ul class="nav navbar-nav">
            <li>
              <a>
                <span class="cp">Copyright武汉大学工会委员会2017　地址：湖北省武汉市武汉大学　邮编：430072      &nbsp; &nbsp;          制作单位：武汉大观科技有限公司</span>　

                <span class="ba">鄂ICP备05003330
                  <span onclick="window.open('http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=42010602000219')">鄂公网安备42010602000219</span>
                </span>
              </a>
            </li>
          </ul>
        </div>
        <div class="col-sm-12 col-md-4">
          <ul class="nav navbar-nav navbar-link pull-right">
            <li><a href="mailto:wlxxs@whu.edu.cn" target="_blank">联系我们 </a></li>
           <%--<li><a href="wldh.htm" tppabs="wldh.htm" target="_blank">网站地图 </a></li>--%>
              <%--<li><a href="http://www.whu.edu.cn/wldh.htm" tppabs="http://www.whu.edu.cn/wldh.htm" target="_blank">网站地图 </a></li>--%>
            <li><a href="http://nic.whu.edu.cn" tppabs="http://nic.whu.edu.cn/" target="_blank">信息中心 </a></li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
<script type="text/javascript">
    $(".toggleCode").each(function(){
        var code = $(this).find('.codeSpan');
        $(this).hover(function() {
            code.show();
        }, function() {
            code.hide();
        });
    });
</script>