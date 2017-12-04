rdcp.ready(function () {
            if (top.location.href != location.href) {
                top.location.href = location.href;
                return;
            }

            document.loginForm.loginName.focus();
        });
//此方法为微信 绑定及人力登录返回
        function loginsysDrop() {
            if ($("#loginName").val() == "" || $("#loginName").val() == null) {
                $.messager.alert('提示', '帐号不能为空', 'error');
                return;
            }
            else if ($("#password").val() == "" || $("#password").val() == null) {
                $.messager.alert('提示', '密码不能为空', 'error');
                return;
            }
           /*  else if ($("#validateCode").val() == "" || $("#validateCode").val() == null) {
                alert("验证码不能为空");
                return;
            }  */
            else {
            	//判断OA帐号是否已被绑定
            	/*rdcp.request("!szbo/phone/~query/Q_OA_ACCOUNT_CHECK",{"account":$("#loginName").val()},function(data){
            		if(data.body.rows[0].CHECKNUM==1){
            			$.messager.alert('提示', '此OA帐号已被其他用户绑定,请检查!', 'error');
            		}else{*/
            			rdcp.request("!szbo/base/~java/SZBOLogin.Login", rdcp.id("loginForm_id").serialize(), function (data) {
                        	if(data.header.code==0){
                        		rdcp.request("!szbo/phone/~query/Q_ROLE_MANAGER",rdcp.id("loginForm_id").serialize(),function(data){
                        			/*alert(data.body.rows[0].USERROLE);*/
                        			if(data.body.rows[0].USERROLE==1){
                        				window.location = "!szbo/phone/~/pages/leadMenu.jsp?wxcode="+$("#wxcode").val();
                        			}else if(data.body.rows[0].USERROLE==0){
                        				window.location = "!szbo/phone/~/pages/notLeadMenu.jsp?wxcode="+$("#wxcode").val();
                        			}else if(data.body.rows[0].USERROLE==2){
                        				window.location = "!szbo/phone/~/pages/commonUserMenu.jsp?wxcode="+$("#wxcode").val();
                        			}
                        		}); 
                        		/*window.location = "!szbo/phone/~/pages/leadMenu.jsp";*/
                        	}
                        });
            	/*	}
            	});*/
            }
        }
        function loginsys(nextPage) {
            if ($("#loginName").val() == "" || $("#loginName").val() == null) {
                alert("用户名不能为空");
                return;
            }
            else if ($("#password").val() == "" || $("#password").val() == null) {
                alert("密码不能为空");
                return;
            }
           /*  else if ($("#validateCode").val() == "" || $("#validateCode").val() == null) {
                alert("验证码不能为空");
                return;
            }  */
            else {
                /*rdcp.request("!szbo/base/~java/SZBOLogin.Login", rdcp.id("loginForm_id").serialize(), function (data) {
                	if(data.header.code==0){
                        alert(data.header.message);
                        window.location = "${_basePath}";
                	}
                    else
                    {
                        alert(data.header.message);
                    }
                });*/
                rdcp.request("DS_USER_LOGIN", rdcp.id("loginForm_id").serialize(), function (data) {
                 if (data.header.code == 0) {
                	 //判断角色，控制菜单，目前只有客户拜访和商机报备
                     window.location = "!gh/wechat/~/pages/"+nextPage+".jsp";

                 }
                 else
                 {
                    alert(data.header.message);
                 }
                });
            }
        }
        function reGetImage() {
            imgurl = "framework.do?ds=DS_FRAMEWORK_SECURITY_VALIDATE_CODE&r=" + new Date();
            $("#vimg").attr("src", imgurl);
        }