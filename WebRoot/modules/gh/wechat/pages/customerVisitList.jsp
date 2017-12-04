<%--
User: Larry
--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>客户日常拜访列表</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <r:include resource="!rdcp/~/pages/listBase.jsp"/>
    <link href="!whBusiness/wechat/~/css/moblieIndex.css" rel="stylesheet" type="text/css"/>
    <script type="text/javascript">
    	//初始化函数
			rdcp.ready(function(){
		    		rdcp.request("!whBusiness/wechat/~query/Q_LOAD_CUST_LIST",null,function(data) {
		    			rdcp.mask($("body"),'');
		    			if(data.header.code == 0){
		    				rdcp.unmask($("body"));
		    				var object=data.body.rows;
		    				
		    				if(object.length==0){
		    	            	var html= '<li><div class="article"><p>' + "无结果" +'</p></div></li>';
		    	        	    $("#uid").append(html);
		    	    		}else{
		    	    			for(var i=0;i<object.length;i++) {
		    	                    insertRowa("",object[i]);
		    	                }
		    	    		}
		    			}
		    			/*var object=data.body.rows;
		                for(var i=0;i<object.length;i++) {
		                    insertRowa("",object[i]);
		                }*/
		             });
		    		
		    	//插入一行对象
		    	function insertRowa(rowIndex,rowData){
		    		custcode=rowData.CUST_ID;
		    		custccode=rowData.CUST_CODE;
		    		custname=rowData.CUSTOMER_NAME;
		    		vrId=rowData.VRID;
		    		
		    		
		    		//判断当前用户是否为团队经理
					/*if($("#role").val()==1){
						var html= '<li><div class="article"><p>' + custname +'</p></div>'
			    	    +'<div class="tools"><a class="reply" href="javascript:void(0);" onclick="comment(\''+ custcode +'\')">评论</a></div></li>';
			    	    $("#uid").append(html);
					}else{
						var html= '<li><div class="article"><p>' + custname +'</p></div>'
			    	    +'<div class="tools"><a class="reply" href="javascript:void(0);" onclick="comment(\''+ custcode +'\')">评论</a>'
			    	    +'<a class="pushOn" href="javascript:void(0);" onclick="pushTureBusi(\''+ custcode +'\',\''+ custname+'\')">拜访</a></div></li>';
			    	    $("#uid").append(html);
					}*/
		    		if(vrId=="0"){//没有开始拜访的记录
		    			var html= '<li><div class="article"><p>' + custname +"<br/>"+"("+custccode+")"+'</p></div>'
			    	    +'<div class="tools">'
			    	    +'<a class="pushOn" href="javascript:void(0);" onclick="pushTureBusi(\''+ custcode +'\',\''+ custname+'\',\''+ vrId+'\')">开始拜访</a></div></li>';
			    	    $("#uid").append(html);
		    		}else{
		    			var html= '<li><div class="article"><p><font color=#FF0000>' + custname +"<br/>"+"("+custccode+")--拜访未完成"+'</font></p></div>'
			    	    +'<div class="tools">'
			    	    +'<a class="pushOn" href="javascript:void(0);" onclick="pushTureBusi(\''+ custcode +'\',\''+ custname+'\',\''+ vrId+'\')">结束拜访</a></div></li>';
			    	    $("#uid").append(html);
		    		}
					
		    	};
		     });
			
			//客户拜访 pushType:0没有开始拜访,大于0已经开始拜访
			function pushTureBusi(custcode,custname,vrId){		
				//window.location="!szbo/phone/~/pages/customerVisit.jsp?pushType="+vrId+"&custcode="+custcode+"&custname="+custname;
				//是否可以结束拜访,设置了时间间隔
				rdcp.request('!szbo/phone/~query/Q_IS_NEW_VISIT?custname='+custname+"&custcode="+custcode, rdcp.id("addVisitForm").serialize(), function (data) {
		        		if(data.body['rows'][0]['NUM'] != '0'&&vrId=="0"){	
		        			$.messager.alert('提示', '存在未完成的拜访记录,不可开始拜访!', 'info',function(){
								
				       		});
		        		}else{
		        			if(data.body['rows'][1]['NUM'] != '0'){	
			        			$.messager.alert('提示', '该客户当天已拜访,不可重复拜访!', 'info',function(){
									
					       		});
			        		}else{
			        			window.location="!whBusiness/wechat/~/pages/custVisit.jsp?pushType="+vrId+"&custcode="+custcode+"&custname="+custname;
			        		}
		        		}
		        		
		        })
			}
			
			//客户拜访详细
			function comment(custcode){		
				window.location="!szbo/phone/~/pages/customerVisitComment.jsp?custcode="+custcode;
			}
			
			function htmlempty(){
				$("#uid").empty();
				
				rdcp.request("!whBusiness/wechat/~query/Q_LOAD_CUST_LIST",{"customer_name":rdcp.id("customer_name").val()},function(data) {
		            var object=data.body.rows;
		            
		            if(object.length==0){
		            	var html= '<li><div class="article"><p>' + "无结果" +'</p></div></li>';
		        	    $("#uid").append(html);
		    		}else{
		    			for(var i=0;i<object.length;i++) {
		                    insertRowb("",object[i]);
		                }
		    		}
		         });
				
			//插入一行对象
			function insertRowb(rowIndex,rowData){
					custcode=rowData.CUST_ID;
		    		custccode=rowData.CUST_CODE;
		    		custname=rowData.CUSTOMER_NAME;
		    		vrId=rowData.VRID;
		    		
		    		
		    		//判断当前用户是否为团队经理
					/*if($("#role").val()==1){
						var html= '<li><div class="article"><p>' + custname +'</p></div>'
			    	    +'<div class="tools"><a class="reply" href="javascript:void(0);" onclick="comment(\''+ custcode +'\')">评论</a></div></li>';
			    	    $("#uid").append(html);
					}else{
						var html= '<li><div class="article"><p>' + custname +'</p></div>'
			    	    +'<div class="tools"><a class="reply" href="javascript:void(0);" onclick="comment(\''+ custcode +'\')">评论</a>'
			    	    +'<a class="pushOn" href="javascript:void(0);" onclick="pushTureBusi(\''+ custcode +'\',\''+ custname+'\')">拜访</a></div></li>';
			    	    $("#uid").append(html);
					}*/
		    		if(vrId=="0"){//没有开始拜访的记录
		    			var html= '<li><div class="article"><p>' + custname +"<br/>"+"("+custccode+")"+'</p></div>'
			    	    +'<div class="tools">'
			    	    +'<a class="pushOn" href="javascript:void(0);" onclick="pushTureBusi(\''+ custcode +'\',\''+ custname+'\',\''+ vrId+'\')">开始拜访</a></div></li>';
			    	    $("#uid").append(html);
		    		}else{
		    			var html= '<li><div class="article"><p><font color=#FF0000>' + custname +"<br/>"+"("+custccode+")--拜访未完成"+'</font></p></div>'
			    	    +'<div class="tools">'
			    	    +'<a class="pushOn" href="javascript:void(0);" onclick="pushTureBusi(\''+ custcode +'\',\''+ custname+'\',\''+ vrId+'\')">结束拜访</a></div></li>';
			    	    $("#uid").append(html);
		    		}
		    		
				/**custcode=rowData.CUST_ID;
				custname=rowData.CUSTOMER_NAME;
				
				var html= '<li><div class="article"><p>' + custname +"<br/>"+"("+custccode+")"+'</p></div>'
			    +'<div class="tools"><a class="reply" href="javascript:void(0);" onclick="comment(\''+ custcode +'\')">评论</a>'
			    +'<a class="pushOn" href="javascript:void(0);" onclick="pushTureBusi(\''+ custcode +'\',\''+ custname+'\')">拜访</a></div></li>';
			    $("#uid").append(html);**/
				
			};
			}
    </script>
</head>
<body>
<div class="SR_moblieBox">
	<!--手机页面标题Begin-->
	<div class="SR_title">
		<div class="SR_titleBg">
			<a class="leftBtn" href="javascript:history.go(-1);">返回</a>
			<h1>商机管理系统</h1>
			<a class="rightBtn" href="javascript:history.go(-1);">首页</a>
		</div>
	</div>
	
	<!--手机页面标题Begin-->
	<!--页面表单Begin-->
	<div class="SR_discussListBox">
		<div class="SR_discussListContent">
			<!--收缩模块Begin-->
				<div class="SR_moblieSearch">
					<table cellspacing="0" cellpadding="0s">
						<tr>
							<td><input class="SR_moblieSearchInput" type="text" name="customer_name" id="customer_name"/></td>
							<td width="60px"><a class="SR_moblieSearchBtn" href="javascript:void();" onclick="htmlempty();">搜索</a></td>
						</tr>
					</table>
				</div>
			<!--收缩模块End-->
			<!--一个回复块Begin-->
			<div class="SR_discussList">
				<input type="hidden"  name="role" id="role" value="<%=request.getParameter("role")%>"/>
				<ul id="uid">
					
				</ul>
			</div>
			<!--一个回复块End-->
		</div>
	</div>
	<!--页面表单End-->
</div>
</body>
</html>