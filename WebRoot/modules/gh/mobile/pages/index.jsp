<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<link href="!gh/mobile/~/css/index.css" rel="stylesheet" />
<style>

    .item{

        position:relative;
        font-size:15px;
        top:0;
    }
    #para1
    {
        position:absolute;
        right:15px;
        top:0;
        color:#999999;
        font-size:15px;
        line-height:34px;
    }

    #para2
    {
        position:absolute;
        right:15px;
        top:0;
        color:#999999;
        font-size:15px;
        line-height:34px;
    }
    .arrow-right{
        display:inline-block;
        width:15px;
        height:15px;


        cursor: pointer;
        position: relative;
        top: 3px;
    }


</style>
<script type="text/javascript">
var newsIndex = 1;

rdcp.ready(function(){
  rdcp.request("!gh/mobile/~query/Q_LOAD_INDEX_DATA",{},function(data){
//      加载标题
    var rows = data.body.rows;
    for(var i=0;i<rows.length;i++){
      if(rows[i].CODE_TABLE=="BI_NEWS_CENTER"&&rows[i].CODE_NUM==1)
        loadNewsCenter(rows[i]);
      else if(rows[i].CODE_TABLE=="BI_NEWS_CENTER"&&rows[i].CODE_NUM==2)
        loadJcdt(rows[i]);
      else if(rows[i].CODE_TABLE=="FGPH"&&newsIndex<8)
	  {
		  loadFgph(rows[i]);
		  newsIndex++;
	  }
     else if(rows[i].CODE_TABLE=="BI_POLICY_REGULATION")
         loadZcfg(rows[i]);
     else if(rows[i].CODE_TABLE=="BI_NOTICE")
        loadTzgg(rows[i]);
    }
  });
},rdcp.defaultLoadModules3);
  function loadNewsCenter(obj){
    var html = "<li><div class='media'><a class='pull-left' href='!gh/mobile/~/pages/detail.jsp?code_table="+obj.CODE_TABLE+"&detail_id="+obj.ID+"'><div class='imgCon'>";
    html += "<img src='!service/file/~java/Downloader.get?id="+obj.FILE_ID+"' width= '120'></div></a>";
    html += "<div class='media-body'><h5 class='media-heading text-nowrap'><a href='!gh/mobile/~/pages/detail.jsp?code_table="+obj.CODE_TABLE+"&detail_id="+obj.ID+"'>"+obj.TITLE+"</a></h5>";
    html += "<a href='!gh/mobile/~/pages/detail.jsp?code_table="+obj.CODE_TABLE+"&detail_id="+obj.ID+"'><p class='text-grey'>"+obj.CONTENT+"</p></a></div></div></li>";
//    加载标题下面的内容
    $("#news_list").append(html);
  }
  function loadJcdt(obj){
    var html = "<li class='item'  ><a href='!gh/mobile/~/pages/detail.jsp?code_table= "+obj.CODE_TABLE+"&detail_id="+obj.ID+"'><img src= '!gh/mobile/~~/images/list-icon-2.png'>"+obj.TITLE+"</a></li>";
    $("#jcdt_list").append(html);
  }
  function loadFgph(obj){
    var html = "<li class='item'><i id= 'fgtzi'></i><a href='javascript:void(0);'><img src= '!gh/mobile/~/images/notice-arrow-right.png'>"+obj.TITLE+"投稿量："+obj.ID+"</a></li>";
    $("#fgph_list").append(html);
  }
function loadZcfg(obj){
//    var html = "<li><a href='javascript:void(0);'>"+obj.TITLE+"</a><span class='item-time'>"+obj.CREATE_TIME+"</span></li>";
   var html = "<li class='item'><i ></i> <a  href='!gh/mobile/~/pages/detail.jsp?code_table=BI_POLICY_REGULATION&detail_id="+obj.ID+"' ><img src= '!gh/mobile/~~/images/notice-arrow-right.png'>"+obj.TITLE+"</a><span  id= 'para1'  >"+obj.CREATE_TIME+"</span></li>";

    $("#zcfg_list").append(html);
}
function loadTzgg(obj){
    var html = "<li class='item'><i></i><a  href='!gh/mobile/~/pages/detail.jsp?code_table=BI_NOTICE&detail_id="+obj.ID+"'><img src= '!gh/mobile/~/images/notice-arrow-right.png'>"+obj.TITLE+"</a><span   id= 'para2'  >"+obj.CREATE_TIME+"</span></li>";
    $("#tzgg_list").append(html);
}

</script>


  <div class="container">
    <div class="row">
      <div class="col-sm-12">
        <p class="page-header bb1">
          综合新闻 <small class="text-green text-uppercase">headline</small>
          <a href="!gh/mobile/~/pages/subMenu_zhxw.jsp?code_table=BI_NEWS_CENTER&code_num=1" class="pull-right text-grey font14"><span class="icon icon-more"></span> 更多</a>
        </p>
      </div>
      <div class="col-sm-6 col-md-4">
        <div class="panel panel-success ctrl-xs">
          <div class="panel-body">
             <ul class="list-unstyled list-news" id="news_list"></ul>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-4">
        <p class="page-header bb1">
          基层动态 <small class="text-green text-uppercase">dynamics</small>
          <a href="!gh/mobile/~/pages/subMenu_jcdt.jsp?code_table=BI_NEWS_CENTER&code_num=2" class="pull-right text-grey font14"><span class="icon icon-more"></span> 更多</a>


        </p>
        <div class="panel">
           <div>
             <ul class="list-unstyled list" id="jcdt_list">
             </ul>
          </div>
        </div>
      </div>


        <div class="row">
      <div class="col-sm-4">
         <p class="page-header bb1">
           发稿排行 <small class="text-green text-uppercase">Press</small>
             <a href="!gh/mobile/~/pages/subMenu_fgph.jsp?code_table=null&code_num=null"  class="pull-right text-grey font14"><span class="icon icon-more"></span> 更多</a>
         </p>
         <div class="panel">
           <div>
              <ul class="list-unstyled list" id="fgph_list">
              </ul>
           </div>
         </div>
      </div>
    </div>

        <div class="row">
      <div class="col-sm-4">
          <p class="page-header bb1">
              通知公告 <small class="text-green text-uppercase">info</small>
              <a href="!gh/mobile/~/pages/subMenu.jsp?code_table=BI_NOTICE&code_num=1" tppabs="ztwz.htm"   class="pull-right text-grey font14"><span class="icon icon-more"></span> 更多</a>
          </p>
          <div class="panel">
              <div>
                  <ul class="list-unstyled list" id="tzgg_list">
                  </ul>
              </div>
          </div>
      </div>
  </div>


<div class="col-sm-4">
    <p class="page-header bb1">
        政策法规 <small class="text-green text-uppercase">policies</small>
        <a href="!gh/mobile/~/pages/subMenu.jsp?code_table=BI_POLICY_REGULATION&code_num=1"   class="pull-right text-grey font14"><span class="icon icon-more"></span> 更多</a>
    </p>
    <div class="panel">
        <div>
            <ul class="list-unstyled list" id="zcfg_list">
            </ul>
        </div>
    </div>
</div>
</div>


    <div class="col-sm-12">
      <p class="page-header bb1">
        友情链接 <small class="text-green text-uppercase">link</small>
        <%--<a href="ztwz.htm" tppabs="ztwz.htm" target="_blank" class="pull-right text-grey font14"><span class="icon icon-more"></span> 更多</a>--%>

      </p>
      <div class="f-link">
          <ul><li><a href="http://www.whu.edu.cn/" target="_blank"><img src="!gh/mobile/~/images/g-yqlj-demo.jpg"></a></li><li class="t-a">武汉大学官网</li></ul>
          <ul class="m-l"><li><a href="http://info.whu.edu.cn/xxgkqd/jbxx/jgdbdhqk/xgzd.htm" target="_blank"><img src="!gh/mobile/~/images/g-yqlj02.jpg"></a></li><li class="t-a">信息公开网</li></ul>
      </div>
      <div class="f-link">
          <ul><li><a href="http://www.acftu.org/" target="_blank"><img src="!gh/mobile/~/images/g-yqlj03.jpg"></a></li><li class="t-a">中华全国总工会</li></ul>
          <ul class="m-l"><li><a href="http://www.hbzgh.org.cn/" target="_blank"><img src="!gh/mobile/~/images/g-yqlj06.jpg"></a></li><li class="t-a">湖北工会网</li></ul>

      </div>
    </div>
  </div>