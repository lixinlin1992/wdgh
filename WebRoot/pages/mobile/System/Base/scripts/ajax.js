/**
 * Created by carl on 2015/7/4.
 * 异步请求
 */
var sys = {
    loginKey: "_LoginInfo",
    /**
     * 基础url
     */
    //转发到index页面
    dispatch: function () {
        if (sys.isLogin()) {
        	
            var data = Local.getStoreJson(sys.loginKey);
            var record = {
				MEMBER_ID:data.body.memberId,
				MEMBER_CODE:data.body.memberCode,
				AREA_ID:data.body.areaId,
				ACCOUNT:data.body.account
            }
            console.log(record);
            document.addEventListener('deviceready', function() {
            	setReadIDCardData(record);//将数据传入二合一设备
            	getControlService();
            	console.log("deviceready》》》》》》》》》》...................");
            	 
            	//RWCardClient.setSessionId(Local.getStoreJson(sys.loginKey).body.sessionId);
            });
            location.href = APP_CONFIG.HOME_PAGE;
            
        } else {
            var href = location.href;
            //不是在登陆页面
            if(href && href.indexOf("login.html") < 0)
                location.href = APP_CONFIG.LOGIN_PAGE;//"ESale/Mall/UI/pages/login.html";
        }
    },
    //是否已经登陆
    isLogin: function () {
    	
    	
        if (Local.getStore(sys.loginKey) && Local.getStore(sys.loginKey).length > 10) {
            return true;
        }
        return false;
    },
    logOut: function () {
        Local.saveStore(sys.loginKey, '');
    }
};