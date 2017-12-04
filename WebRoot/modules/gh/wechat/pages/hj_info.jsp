<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" import="java.util.*" isELIgnored="false" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%@ page import="com.sunrise.service.security.entity.SysPUser" %>
<%
	String path = request.getContextPath();
	String port = (request.getServerPort() == 80 || request.getServerPort() == 443) ? "" : ":" + String.valueOf(request.getServerPort());
	String option = request.getParameter("option");
	String basePath = request.getScheme() + "://" + request.getServerName() + port + path + "/";
	request.setAttribute("_basePath", basePath);
%>
<base href="${_basePath}"/>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
	<meta charset="UTF-8">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" />
	<meta content="telephone=no" name="format-detection" />
	<title>会籍信息</title>

	<link href="!gh/wechat/~/css/main2.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/style2.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/shake2.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/font-awesome.min.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/animate.min.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/idangerous.swiper.css" rel="stylesheet" type="text/css">
	<script type="text/javascript" src="!rdcp/script/src/rdcp.js"></script>
	<script type="text/javascript" src="!rdcp/script/lib/jquery/jquery-1.8.0.min.js"></script>
	<script type="text/javascript" src="!property/base/~/scripts/validate/validate.js"></script>

	<style type="text/css">
	 	.return1{
			 font-size: 1.6rem;
			 color: #fff;
			 position: absolute;
			 left: 1rem;
			 top: 0rem;
	 	}
 	</style>

	<%
		String account ="";
		boolean isLogin  = false;
		SysPUser user = (SysPUser) session.getAttribute(LoginUserSession.UserSession_Key);
		if(user != null)
		{
			account = request.getParameter("account")==null?user.getAccount():request.getParameter("account");
			isLogin = true ;
		}

	%>
	<script type="text/javascript">
        isLoginON = <%=isLogin%>;
        if(!isLoginON)
        {
            window.location = "!gh/wechat/~/pages/ghlogin.jsp?page=hj_info";
        }

	</script>
	<script>
		$(document).ready(function(){
			//添加场景
			$("#scene_bth").click(function(){
				$(".reveal-modal-bg").fadeIn(500);
				$(".scene_modal").fadeIn(500);
			});
			$(".reveal-modal-bg,.closed").click(function(){
				$(".modal_img,.reveal-modal-bg").fadeOut(500);
				$(".scene_modal").fadeOut(500);
			});
			//展开悬浮菜单
			$("#side_bth",this).toggle(function(){
				$(".g-tian-nav").fadeIn(200);
			},function(){
				$(".g-tian-nav").fadeOut(200);
			});

			$('.return1').on('click',function(){
				$('body').addClass('animate')
				$(".bigbg").show();
			});
			$('.close,.bigbg').on('click',function(){
				$('body').removeClass('animate');
				$(".bigbg").hide();
			});
			var option = "<%=option%>"
         if(option=='0'){
             $("#edit_btn").hide();
		 }else if(option=='0'){
             $("#edit_btn").show();
		 }
		});
	</script>
</head>
<body>
<div class="warpe">
	<div class="bigbg" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%;display: none;z-index: 9999;"></div>
	<div class="head"  style="position: relative;">
		<a href="javascript:void(0);" onclick="pageReturn();" class="return1">
			<i class="icon-chevron-left"></i>返回</a>
		会籍信息
		<%--<a  href="!gh/wechat/~/pages/hj_to_quit.jsp" class="search animated fadeInRight" style="font-size: 1.4rem;">退会</a>--%>
<%--		<a href="#" class="search" id="side_bth"><i class="icon-plus"></i> &nbsp;</a>
		<ul class="g-tian-nav">
			<li>
				<a href="add_proposals.html">
					新增提案
				</a>
			</li>
			<li>
				<a href="my_proposals.html">
					我的提案
				</a>
			</li>

		</ul>--%>
	</div>
	<form name="trade_form" id="trade_form" method="post">
		<input type="hidden" name="apply_type" id="apply_type" value="1">
		<div class="inter_add">
			<ul>
				<li class="animated bounceInLeft">
					<a href="javascript:;">
						<span class="puff_left">会籍状态：</span>
						<span class="puff_right">
						<input  type="text" id="trade_status" name="trade_status" readonly/>
					</span>
						<i class="icon-angle-right"></i>
					</a>
				</li>
				<li class="animated bounceInLeft">
					<a href="javascript:;">
						<span class="puff_left">入会时间：</span>
						<span class="puff_right">
						<input  type="text" id="intrade_date" name="intrade_date" readonly/>
					</span>
						<i class="icon-angle-right"></i>
					</a>
				</li>

				<li class="animated bounceInLeft">
					<a href="javascript:;">
						<span class="puff_left">所属工会：</span>
						<span class="puff_right">
                            <select id="dept_id" name="dept_id" dir="rtl">
                               <option value="-1">--请选择--</option>
                            </select>
					</span>
						<i class="icon-angle-right"></i>
					</a>
				</li>
			</ul>
		</div>
	<div class="inter_add">

		<ul>
			<li class="animated bounceInLeft">
				<a href="javascript:;">
					<span class="puff_left">工号：</span>
					<span class="puff_right">
						<input  type="text" id="account" name="account" readonly/>
					</span>
					<i class="icon-angle-right"></i>
				</a>
			</li>
			<li class="animated bounceInLeft">
				<a href="javascript:;">
					<span class="puff_left">姓名：</span>
					<span class="puff_right">
						<input  type="text" id="name" name="name" readonly/>
					</span>
					<i class="icon-angle-right"></i>
				</a>
			</li>
			<li class="animated bounceInLeft">
				<a href="javascript:;">
					<span class="puff_left">性别：</span>
					<span class="puff_right">
						<select id="sex" name="sex" dir="rtl">
                                <option value="-1">--请选择--</option>
                                <option value="1">男</option>
                                <option value="0">女</option>
                        </select>

					</span>
					<i class="icon-angle-right"></i>
				</a>
			</li>
			</ul>
		</div>
			<div class="inter_add">
				<ul>
			<li class="animated bounceInLeft">
				<a href="javascript:;">
					<span class="puff_left">出生年月：</span>
					<span class="puff_right">
						<input  type="text" id="birthday" name="birthday" />
					</span>
					<i class="icon-angle-right"></i>
				</a>
			</li>
			<li class="animated bounceInLeft">
				<a href="javascript:;">
					<span class="puff_left">政治面貌：</span>
					<span class="puff_right">
						<select id="political_status" name="political_status" dir="rtl">
                                <option value="-1">--请选择--</option>

                        </select>
					</span>
					<i class="icon-angle-right"></i>
				</a>
			</li>
			<li class="animated bounceInLeft">
				<a href="javascript:;">
					<span class="puff_left">民族：</span>
					<span class="puff_right">
						<input  type="text" id="nation" name="nation" />
					</span>
					<i class="icon-angle-right"></i>
				</a>
			</li>
			<li class="animated bounceInLeft">
				<a href="javascript:;">
					<span class="puff_left">证件类型：</span>
					<span class="puff_right">
						<select id="card_type" name="card_type" dir="rtl">
							<option value="-1">--请选择--</option>
							<option value="1">身份证</option>
							<option value="2">一卡通</option>
						</select>
					</span>
					<i class="icon-angle-right"></i>
				</a>
			</li>
			<li class="animated bounceInLeft">
				<a href="javascript:;">
					<span class="puff_left">证件号：</span>
					<span class="puff_right">
						<input  type="text" id="card_no" name="card_no" />
					</span>
					<i class="icon-angle-right"></i>
				</a>
			</li><li class="animated bounceInLeft">
			<a href="javascript:;">
				<span class="puff_left">学历：</span>
				<span class="puff_right">
						<select id="qualifications" name="qualifications"  dir="rtl">
							<option value="-1">--请选择--</option>
						</select>
					</span>
				<i class="icon-angle-right"></i>
			</a>
		</li><li class="animated bounceInLeft">
			<a href="javascript:;">
				<span class="puff_left">学位：</span>
				<span class="puff_right">
						<select id="degree" name="degree"  dir="rtl">
							<option value="-1">--请选择--</option>
						</select>
					</span>
				<i class="icon-angle-right"></i>
			</a>
		</li><li class="animated bounceInLeft">
			<a href="javascript:;">
				<span class="puff_left">岗位名称：</span>
				<span class="puff_right">
						<input  type="text" id="post" name="post" />
					</span>
				<i class="icon-angle-right"></i>
			</a>
		</li><li class="animated bounceInLeft">
			<a href="javascript:;">
				<span class="puff_left">职务职称：</span>
				<span class="puff_right">
						<input  type="text" id="duties" name="duties" />
					</span>
				<i class="icon-angle-right"></i>
			</a>
		</li>
			<li class="animated bounceInLeft">
				<a href="javascript:;">
					<span class="puff_left">电子邮箱：</span>
					<span class="puff_right">
						<input  type="text" id="email" name="email" />
					</span>
					<i class="icon-angle-right"></i>
				</a>
			</li>
			<li class="animated bounceInLeft">
				<a href="javascript:;">
					<span class="puff_left">手机号：</span>
					<span class="puff_right">
						<input  type="text" id="tele_phone" name="tele_phone"/>
					</span>
					<i class="icon-angle-right"></i>
				</a>
			</li>
			<li class="animated bounceInLeft">
				<a href="javascript:;">
					<span class="puff_left">备注：</span>
					<span class="puff_right">
						<input  type="text" id="memo" name="memo" />
					</span>
					<i class="icon-angle-right"></i>
				</a>
			</li>
		</ul>
	</div>

	</form>
	<div class="id_bth inersest_bth animated bounceIn">
		<a id="edit_btn" href="" onclick="edit_submit();">保存修改</a>
	</div>
</div>



<script type="text/javascript">
    var account = "<%=account%>";
    rdcp.ready(function(){
        if(isLoginON)
		{
		    rdcp.request( "!gh/wechat/~query/Q_LOAD_USER_TRADE_STATUS",{"account":account},function (data) {
		        if(data.body.trade_status == 0)
				{
                    window.location = "!gh/wechat/~/pages/hj_to_apply.jsp";
				}
				else if(data.body.trade_status == 2)
				{
                    window.location = "!gh/wechat/~/pages/hj_quited.jsp";
				}
				else if(data.body.trade_status == 1)
				{
                        rdcp.request("!gh/tradeManage/~query/Q_LOAD_TRADE_PARAM_CODE",{},function(data){
                            var p = data.body.rows;
                            for(var i=0;i<p.length;i++){
                                var html = "<option value='"+p[i].CODE_NUM+"'>"+p[i].NAME+"</option>";
                                $("#"+p[i].CODE).append(html);
                            }

							rdcp.form.load("trade_form", "!gh/tradeManage/~query/Q_LOAD_USER_TRADE_INFO", {"account":account}, function (data) {
                                });
                            });
				}
				else if(data.body.trade_status == 3)
				{
				    window.location = "!gh/wechat/~/pages/hj_info_quited.jsp";
				}
				else
				{
                    window.location = "!gh/wechat/~/pages/hj_to_apply.jsp";
				}
            });
		}
/*        rdcp.form.load("trade_form", "!gh/wechat/~query/Q_LOAD_USER_TRADE_INFO", {"account":account}, function (data) {

        });*/

    });
    function edit_submit() {
/*        var memo = $("#memo").val();
        var account = $("#account").val();
        rdcp.request("!gh/wechat/~query/Q_USER_TRADE_INFO_UPDATE",{"account":account,"memo":memo},function(data){
            if(data==1)
            {
                alert("提交成功,等待审核！");
                window.location="!gh/wechat/~/pages/hj_info.jsp";
            }
        });*/
            //   $.messager.alert("提示","操作成功!","info");
            //   rdcp.grid.reload("listdt");
            //  $("#delTradeDlg").dialog("close");
        $("#apply_type").val(1);
        var total = 0;
        if (isNull("sex", "", -1)) total++;
        if (isNull("birthday", "", 0)) total++;
        if (isNull("political_status", "", -1)) total++;
        if (isNull("nation", "", 0)) total++;
        if (isNull("email", "", 0)) total++;
        if (isNull("card_type", "", -1)) total++;
        if (isNull("card_no", "", 0)) total++;
        if (isNull("qualifications", "", -1)) total++;
        if (isNull("degree", "", -1)) total++;
        if (isNull("post", "", 0)) total++;
		/*        if (isNull("duties", "", 0)) total++;
		 if (isNull("memo", "", 0)) total++;*/
        if (total > 0) return;
        rdcp.form.submit("trade_form", {
            url: "!gh/tradeManage/~query/Q_ADD_TRADE_APPLY",
            success: function (data) {
                $.messager.alert('提示', '申请提交成功，请等待审核结果！', 'info', function () {
                    // cancel();
                });
                //  window.location="!gh/wechat/~/pages/hj_info.jsp";
            }
        }, {"mask": true});

    }
    function pageReturn() {
		window.location="!gh/wechat/~/pages/hj_index.jsp";
	}

</script>
</body>
</html>