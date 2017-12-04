

<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<script type="text/javascript" src="!gh/index/~/scripts/idangerous.swiper.min.js"></script>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";

	String key = request.getParameter("showkeycode");
%>



<!DOCTYPE html>
<html>
<head>
	<link rel="shortcut icon" type="image/x-icon" href="pages/images/favicon.ico" media="screen" />
	<meta name ="renderer" content="webkit">
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=2.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0">
	<title>武汉大学工会</title>
	<base href="<%=basePath%>">
	<link href="!gh/mobile/css/bootstrap.min.css" tppabs="!gh/mobile/css/bootstrap.min.css" rel="stylesheet">
	<link href="!gh/mobile/css/main.css" tppabs="!gh/mobile/css/main.css" rel="stylesheet">
	<link href="!gh/mobile/css/css.css" tppabs="!gh/mobile/css/css.css" rel="stylesheet">

	<%--<link href="!gh/mobile/css/list.css" rel="stylesheet" />--%>

	<script type="text/javascript" src="!gh/mobile/scripts/jquery.min.js"></script>
	<script src="!gh/mobile/scripts/bootstrap.min.js" type="text/javascript"></script>
	<script type="text/javascript" src="!rdcp/script/src/rdcp.js"></script>


	<style>
		.g-list-main .content h3 span i.hr { position: absolute; left: 0; bottom: -2px; height: 2px; background: #DB0D0A; display: block; width: 100%;}
		.g-list-main .content h3 { font-size: 18px; color: #B50C09; height: 40px; line-height: 40px; border-bottom: 2px solid #DDDDDD;}
		.g-page { margin: 20px 0;}
		.g-page a { margin: 0 5px;}
		.g-page a , .g-page .red { display: inline; color: #CC0000;}

		.g-article-con>h1 { font-size: 20px; color: #1E1E1E; text-align: center; margin: 30px 0 0; line-height: 1.5;}
		.g-article-data { text-align: center; font-size: 12px; color: #797979; margin-bottom: 10px;}
		.clear { width: 0 !important; height: 0 !important; display: block !important; overflow: hidden !important; visibility: hidden !important; clear: both !important; content: "." !important; margin: 0 !important; padding: 0 !important; line-height: 0 !important;}
		.g-list-main .content h3 span {
			position: relative;
			display: inline-block;
			padding: 0 10px;
		}
	</style>
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
                        html += "<li><a  href='!gh/mobile/~/pages/subMenu.jsp?code_table="+t.CODE_TABLE+"&code_num="+t.SUB_TYPE+"&detail_id="+t.ID+"'><p class='f-l tit'>"+t.TITLE+"</p>";
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

</head>
<body style="margin:0;padding:1">
<r:include resource="!gh/mobile/~/pages/header.jsp"/>

<!--列表页内容区-->
<div class="g-list-container">
	<!--内容-->
	<div class="g-list-main">
		<div class="content f-r" style="width:100%;">
			<h3><span id="menu_name2"><i class="hr"></i>站内搜索</span><i class="clear"></i></h3>
			<ul id="data_list">
				<li><a href="javascript:void(0);" onclick="showDetail(142);"><p class="f-l tit">test1</p><p class="f-r time">2017-06-28 17:19:39</p></a><p><a href="javascript:void(0);" onclick="showDetail(142);"></a></p></li>
			</ul>
			<div class="g-page" id="pages"></div>
			<div class="g-article-con" id="content"></div>
		</div>
		<i class="clear"></i>

	</div>
</div>
<!--列表页内容区 End-->


<r:include resource="!gh/mobile/~/pages/footer.jsp"/>
</body>
</html>

