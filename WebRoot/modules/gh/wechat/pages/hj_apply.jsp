<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" import="java.util.*" isELIgnored="false" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%@ page import="com.sunrise.service.security.entity.SysPUser" %>
<%
	String path = request.getContextPath();
	String port = (request.getServerPort() == 80 || request.getServerPort() == 443) ? "" : ":" + String.valueOf(request.getServerPort());
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
	<link href="!gh/wechat/~/css/main.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/style.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/shake.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/font-awesome.min.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/animate.min.css" rel="stylesheet" type="text/css">


	<%--<script type="text/javascript" src="!rdcp/script/src/rdcp.js"></script>--%>
	<r:include resource="!rdcp/~/pages/listBase.jsp"/>

<%--	<link href="!gh/wechat/~/css/idangerous.swiper.css" rel="stylesheet" type="text/css">
	<script type="text/javascript" src="!rdcp/script/src/rdcp.js"></script>
	<script type="text/javascript" src="!rdcp/script/lib/jquery/jquery-1.8.0.min.js"></script>--%>

<%--<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="com.sunrise.framework.core.ApplicationManager" %>
<%@page import="com.sunrise.service.security.entity.SysPUser" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%@taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>-

    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
   &lt;%&ndash; <r:include resource="!rdcp/~/pages/listBasePhone.jsp"/>&ndash;%&gt;
    <r:include resource="!rdcp/~/pages/listBase.jsp"/>
   &lt;%&ndash; <link href="!gh/wechat/~/css/moblieIndex.css" rel="stylesheet" type="text/css"/>
    <script type="text/javascript" src="themes/brisk_Orange/js/iepngfix_tilebg.js"></script>&ndash;%&gt;
    &lt;%&ndash;<script type="text/javascript" src="!gh/wechat/~/scripts/login.js"></script>&ndash;%&gt;


	<meta charset="UTF-8">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" />
	<meta content="telephone=no" name="format-detection" />
	<title>会籍信息</title>
	<link href="!gh/wechat/~/css/main.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/style.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/shake.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/font-awesome.min.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/animate.min.css" rel="stylesheet" type="text/css">
	<link href="!gh/wechat/~/css/idangerous.swiper.css" rel="stylesheet" type="text/css">--%>
	<script type="text/javascript" src="!gh/wechat/~/js/jquery-1.8.3.min.js"></script>
	<script type="text/javascript" src="!gh/wechat/~/js/wo.js"></script>


	<script type="text/javascript" src="!property/base/~/scripts/validate/validate.js"></script>

		<!-- 日期插件js -->
		<script src="!gh/wechat/~/js/datetime/jquery-1.11.1.min.js"></script>
		<script src="!gh/wechat/~/js/datetime/mobiscroll.core.js"></script>
		<script src="!gh/wechat/~/js/datetime/mobiscroll.widget.js"></script>
		<script src="!gh/wechat/~/js/datetime/mobiscroll.scroller.js"></script>
		<script src="!gh/wechat/~/js/datetime/mobiscroll.util.datetime.js"></script>
		<script src="!gh/wechat/~/js/datetime/mobiscroll.datetimebase.js"></script>
		<script src="!gh/wechat/~/js/datetime/mobiscroll.widget.ios.js"></script>
		<script src="!gh/wechat/~/js/datetime/mobiscroll.i18n.zh.js"></script>
		<link href="!gh/wechat/~/css/datetime/mobiscroll.animation.css" rel="stylesheet" type="text/css" />
		<link href="!gh/wechat/~/css/datetime/mobiscroll.widget.css" rel="stylesheet" type="text/css" />
		<link href="!gh/wechat/~/css/datetime/mobiscroll.widget.ios.css" rel="stylesheet" type="text/css" />
		<link href="!gh/wechat/~/css/datetime/mobiscroll.scroller.css" rel="stylesheet" type="text/css" />
		<link href="!gh/wechat/~/css/datetime/mobiscroll.scroller.ios.css" rel="stylesheet" type="text/css" />
		<script type="text/javascript">
            $(function () {
                var nowData=new Date();
                var opt= {
                    theme:'ios', //设置显示主题
                    mode:'scroller', //设置日期选择方式，这里用滚动
                    display:'bottom', //设置控件出现方式及样式
                    preset : 'datetime', //日期:年 月 日 时 分
                    minDate: nowData,
                    // maxDate:new Date(nowData.getFullYear(),nowData.getMonth(),nowData.getDate()+7,22,00),
                    dateFormat: 'yy-mm', // 日期格式,显示小时分钟加上dd
                    dateOrder: 'yymm', //面板中日期排列格式,显示小时分钟加上dd
                    stepMinute: 5, //设置分钟步长
                    yearText:'年',
                    monthText:'月',
                    dayText:'日',
                    hourText:'时',
                    minuteText:'分',
                    lang:'zh' //设置控件语言};
                };
                $('#dateinput').mobiscroll(opt);
                $('#dateinput2').mobiscroll(opt);
            });
		</script>
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
		SysPUser user = (SysPUser) session.getAttribute(LoginUserSession.UserSession_Key);
		account = user.getAccount();
		System.out.println(account);
	%>
	</head>
<body style="background-color: #fff !important;">
<div class="warpe">
	<div class="head">
		<a href="!gh/wechat/~/pages/ghmenu.jsp" class="return1"><i class="icon-chevron-left"></i> 返回</a>
		入会申请
		<a href="javascript:void(0);"  onclick="apply_submit()" class="search animated fadeInRight" style="font-size: 1.4rem;">提交</a>
	</div>
	<form name="trade_form" id="trade_form" method="post">
		<input type="hidden" name="apply_type" id="apply_type" value="0">
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
						<input  type="text" id="name" name="name"  readonly/>
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
                                <option value="1" >男</option>
                                <option value="0">女</option>
                        </select>
					</span>
					<i class="icon-angle-right"></i>
				</a>
			</li>


			<li class="animated bounceInLeft">
				<a href="javascript:;">
					<span class="puff_left">出生年月：</span>
					<span class="puff_right">
						<input  type="text" id="birthday" name="birthday" onfocus="WdatePicker({dateFmt : 'yyyy-MM-dd'})" />
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
						<input  type="text"id="card_no" name="card_no" />
					</span>
					<i class="icon-angle-right"></i>
				</a>
			</li>

			<li class="animated bounceInLeft">
				<a href="javascript:;">
					<span class="puff_left">学历：</span>
					<span class="puff_right">
						<select id="qualifications" name="qualifications" dir="rtl" >
							<option value="-1">--请选择--</option>
						</select>
					</span>
					<i class="icon-angle-right"></i>
				</a>
			</li><li class="animated bounceInLeft">
			<a href="javascript:;">
				<span class="puff_left">学位：</span>
				<span class="puff_right">
						<select id="degree" name="degree" dir="rtl" >
							<option value="-1">--请选择--</option>
						</select>
					</span>
				<i class="icon-angle-right"></i>
			</a>
		</li>
			<li class="animated bounceInLeft">
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
					<span class="puff_left">手机号：</span>
					<span class="puff_right">
						<input  type="text" id="tele_phone" name="tele_phone"  />
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
					<span class="puff_left">备注：</span>
					<span class="puff_right">
						<input  type="text" id="memo" name="memo" />
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
					<span class="puff_left">所属工会：</span>
					<span class="puff_right">
						<select id="dept_id" name="dept_id" dir="rtl" >
							<option value="-1">--请选择--</option>
						</select>
					</span>
					<i class="icon-angle-right"></i>
				</a>
			</li>
			<%--<li class="animated bounceInLeft">
				<a href="javascript:;">
					<span class="puff_left">会籍状态备注：</span>
					<span class="puff_right">
						<input  type="text" d="trade_memo" name="trade_memo"  />
					</span>
					<i class="icon-angle-right"></i>
				</a>
			</li>--%>
			<li class="animated bounceInLeft">
				<a href="javascript:;">
					<span class="puff_right">同意《中华全总工会入会申请书》</span>
					<span class="puff_left">
						<input  type="checkbox" id="is_agree" />
					</span>
					<i class="icon-angle-right"></i>
				</a>
			</li>
		</ul>
	</div>
	</form>
</div>
<script type="text/javascript">
    var account = "<%=account%>";
    var option = "add";
    var apply_id = "";
    rdcp.ready(function() {
        rdcp.request("!gh/tradeManage/~query/Q_LOAD_TRADE_PARAM_CODE", {}, function (data) {
            var p = data.body.rows;
            for (var i = 0; i < p.length; i++) {
                var html = "<option value='" + p[i].CODE_NUM + "'>" + p[i].NAME + "</option>";
                $("#" + p[i].CODE).append(html);
            }
            rdcp.form.load("trade_form", "!gh/tradeManage/~query/Q_LOAD_TRADE_APPLY_INFO", {
                "load_type": option,
                "apply_id": apply_id
            }, function (data) {

            });
//            rdcp.form.load("trade_form", "!gh/wechat/~query/Q_LOAD_USER_TRADE_INFO", {"account": account}, function (data) {
//
//            });


        });

    });
    function apply_submit() {
        if(sex.value==""){
            sex.value=-1;
		}
		if(political_status.value==""){
            political_status.value=-1;
		}
        if(card_type.value==""){
            card_type.value=-1;
        }
        if(qualifications.value==""){
            qualifications.value=-1;
        }
        if(degree.value==""){
            degree.value=-1;
        }
        if(dept_id.value==""){
            dept_id.value=-1;
        }
        $("#apply_type").val(0);
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
		if (isNull("dept_id", "", -1)) total++;
//        if (isNull("memo", "", 0)) total++;
        if (total > 0) return;
        var flag = $('#is_agree').prop('checked');
        if (flag != true) {
            $.messager.alert("提示", "请勾选同意《中华全总工会入会申请书》!", 'info');
            return;
        }
        rdcp.form.submit("trade_form", {
            url: "!gh/tradeManage/~query/Q_ADD_TRADE_APPLY",
            success: function (data) {
                $.messager.alert('提示', '入会申请提交成功，请等待审核结果！', 'info', function () {
                    // cancel();
                    window.location="!gh/wechat/~/pages/hj_index.jsp";
                });

            }
        }, {"mask": true});
    }

</script>
</body>
</html>