rdcp.ready(function(){
//    		rdcp.request("!szbo/phone/~query/Q_LOAD_USER_ROLE_CHECK","",function(data){
//    			rdcp.id("role").val(data.body.rows[0].CHECKNUM);
//    			//alert(1);
//    		});
//    		
//    		rdcp.request("!szbo/phone/~query/Q_LOAD_USER_ROLE_BUSIMGR","",function(data){
//    			//alert(1);
//    			
//    			
//    			if(data.body.rows[0].CHECKNUM==1){
//    				$("#bsrep").show();
//    				$("#report").show();
//    				$("#visitMabge").show();
//    			}else{
//    				$("#bsrep").show();
//    				$("#forw").show();
//    				$("#cusvisit").show();
//    				$("#report").show();
//    				$("#marketMabge").show();
//    				$("#visitMabge").show();
//    			}
//    			
//    			if(data.body.rows[0].CHECKNUM>=10){
//    				
//    				$("#visitMabge").show();
//    			
//    			}
//    			
//    		});
    		
    		//测试地理位置
    		/*rdcp.request("!szbo/phone/~java/Http.getPositon","",function(data){
    			var position=data.result.formatted_address;
    			rdcp.id("positionjson").val(position);
    			alert(position);
    		});*/
    	});
    	
    	function gobusi(){
    		var role=$("#role").val();
    		window.location = "!szbo/phone/~/pages/busiForwardList.jsp?role="+role;
    	}
    	
    	
    	function gocustomer(){
    		var role=$("#role").val();
    		window.location = "!whBusiness/wechat/~/pages/customerVisitList.jsp?role="+role;
    	}
    	function preBusi(){
    		window.location = "!gh/wechat/~/pages/repBusi.jsp";
    	}
    	function goreport(){
    		var role=$("#role").val();
    		window.location = "!szbo/phone/~/pages/reportMenu.jsp?role="+role;
    	}
