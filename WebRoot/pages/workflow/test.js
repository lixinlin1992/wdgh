define(function(require,exports,module){
  function e(){this.resize(),this.bError=!1,this.oLanLogin=null,this.szDefaultUser="admin"}
  var t,a,n,o,i,r,s,l;
  t=require("common"),a=require("base64"),n=require("webSession"),o=require("translator"),
  i=require("dialog"),r=require("utils"),_oEncryption=require("encryption"),
  s=require("isapi/response"),l=null,
  e.prototype={resize:function(){},
      init:function(){
          $.ajaxSetup({statusCode:{401:function(){}}});
          var e=this,a=o.getLanguage("Login");
          return e.oLanLogin=o.appendLanguage(a,t.m_oLanCommon),document.title=o.getValue("login"),
            document.cookie||navigator.cookieEnabled?(
                e.initController(),
                $("#username").focus(),
                e.getDeviceActiveStat(),void 0):
                (e.bError=!0,i.alert(o.getValue("cookieError"),null,function(){e.bError=!1}),void 0)},
      initController:function(){
          var e=this,t=document.createElement("input");
          t.type="text";
          var a=t.placeholder!==void 0;
          angular.module("loginApp",[]).controller("loginController",
              function($scope,$document,$compile){
                  l=$scope,decodeURI(document.URL),$scope.oLan=e.oLanLogin,
                      $scope.szErrorTip="",$scope.username="",
                      $scope.password="",$scope.activeUsername=e.szDefaultUser,
                      $scope.activePassword="",$scope.activePasswordConfirm="",
                      $scope.activePasswordStatus=!1,
                      $scope.showLanguageList=function(e){
                          e.stopPropagation(),
                          $("#language_list").toggle()},
                      $scope.changeLanguage=function(t){
                          e.changeLanguage(t.target.id)},
                      $scope.login=function(t){
                          "anonymous"==t&&(this.username="anonymous",this.password="******"),
                              $scope.szErrorTip="",
                              e.doLogin(this,$compile)},
                      $scope.docPress=function(t){
                          13!=t.which||e.bError||e.doLogin(this,$compile)},
                      $document.on("click",function(){
                          $("#language_list").hide()})}).directive("placeholder",function(){
                  return{restrict:"A",scope:!1,require:"ngModel",
                      link:function(e,t,n){if(!a){
                          var o=parseInt(t.css("padding-left").replace("px",""),10),
                              i=parseInt(t.css("padding-top").replace("px",""),10),
                              r=parseInt(t.css("border-top-width").replace("px",""),10);
                          e.$watch(""+n.ngModel,function(e){
                              if(!angular.isUndefined(e)){
                                  var a=t.data("placeholder");
                                  if(a||(a=$("<label class='placeholder'>"+n.placeholder+"</label>"),
                                          a.click(function(){t.focus()}),t.data("placeholder",a))
                                          ,""===e){
                                   $(t).parent().append(a);
                                      var s=Math.round((t.height()-a.height())/2)+r+i;
                                      a.css({left:t.position().left+o+"px",top:t.position().top+s+"px"})}
                                  else
                                      a.remove(),
                                      t.removeData("placeholder")}})}}}}).directive("strength",function(){
                  return{restrict:"A",scope:{lan:"=",oPassword:"=",oUsername:"="},controller:function($scope){
                      $scope.$watch("oPassword",function(e){
                          l.activePasswordStatus=!0;
                          var t=$($scope.element).find(".userstrength");
                          switch(r.checkPasswordComplexity(e,$scope.oUsername)){
                              case 1:t.eq(0).css("backgroundColor","#FC657E"),t.eq(1).css("backgroundColor",""),
                                  t.eq(2).css("backgroundColor",""),$scope.lan.pswstrength=$scope.lan.weakPwd;break;
                              case 2:t.eq(0).css("backgroundColor","#FFC85D"),t.eq(1).css("backgroundColor","#FFC85D"),
                                  t.eq(2).css("backgroundColor",""),$scope.lan.pswstrength=$scope.lan.normalPwd;break;
                              case 3:t.eq(0).css("backgroundColor","#65D25D"),t.eq(1).css("backgroundColor","#65D25D"),
                                  t.eq(2).css("backgroundColor","#65D25D"),$scope.lan.pswstrength=$scope.lan.goodPwd;break;
                              default:t.css("backgroundColor",""),$scope.lan.pswstrength="",l.activePasswordStatus=!1}})},
                      template:"<div class='validate'><span><span class='userstrength'></span><span class='userstrength'></span><span class='userstrength'></span><span ng-bind='lan.pswstrength'></span></span></div><div class='clear'></div><div><label ng-bind='lan.passwordValidTips'></label></div>",
                      link:function(e,t){e.element=t}}}),
              angular.bootstrap(document.body,["loginApp"])},
      doLogin:function($scope,$compile){
          var e=this;
          if(e.checkLogin($scope)){
              (new Date).getTime();
              var a=$scope.password;"anonymous"===$scope.username&&(a="******"),
                  t.doLogin($scope.username,a,e.loginSuccess,e.loginError,e,[$scope,$compile])}},
      loginSuccess:function(e,s,$scope,$compile){
          var c=this,u=$(s),p=r.nodeValue(s,"isSupportLoginTiming","b");
          n.setItem("timecorrect",p);
          var d=function(){
              var e=$scope.username+":"+$scope.password;
              if(t.m_bSession){
                  var o=r.nodeValue(s,"sessionID");
                  n.setItem("sessionId",o),e=r.encodeAES(a.encode(e),MD5(o))}
              n.setItem("userInfo",a.encode(e));
              var i=decodeURI(document.URL),l=r.getURIParam("page",i);
              if(""!==l){
                  var c=l,u=l.match(/\[&?(.*?)\]/),p="";
                  null!==u&&(p=u[1],c=l.replace(u[0],"")),-1===c.indexOf(".asp")&&(c=c.concat(".asp")),
                  "paramconfig.asp"===c&&(c="config.asp"),window.location.href=""===p?c:c+"?"+p}
              else window.location.href="preview.asp"};
          if("false"==$(s).find("isActivated").eq(0).text())
              c.showChangePswd();
          else{
              if("true"===u.find("isRiskPassword").eq(0).text()){
                  var m=20,g="<div><p style='line-height:"+m+"px;'>"+o.getValue("riskPwdTips")+"</p></div>";
                  return i.confirm(g,300,function(){
                      return $scope.activeUsername=$scope.username,$scope.szPwdErrorTip="",
                          i.html("",$("#active").get(0),300,null,function(){
                              return $scope.activePassword=$scope.activePassword.replace(/\s/g,""),
                                  $scope.activePasswordConfirm=$scope.activePasswordConfirm.replace(/\s/g,""),
                                  $scope.activePassword!==$scope.activePasswordConfirm||""===$scope.activePassword?(
                                      ""===$scope.activePassword?$scope.szPwdErrorTip=o.getValue("password")+o.getValue("nullTips"):$scope.activePassword!==$scope.confirmPassword&&($scope.szPwdErrorTip=o.getValue("passNotMatch")),i.alert($scope.szPwdErrorTip),!1):r.checkPasswordComplexity(l.activePassword,l.activeUsername)?(WebSDK.WSDK_GetDeviceConfig(t.m_szHostName,
                                      "user",null,{
                                          success:function(e,a){
                                              $(a).find("User").each(function(){
                                                  if($(this).find("userName").eq(0).text()===$scope.username){
                                                      var e=r.createXml();
                                                      e.appendChild(e.createProcessingInstruction("xml","version='1.0' encoding='utf-8'"));
                                                      var a=e.createElement("password");
                                                      return a.appendChild(e.createTextNode($scope.activePassword)),
                                                          $(this).get(0).appendChild(a),e.appendChild(this),
                                                          WebSDK.WSDK_SetDeviceConfig(t.m_szHostName,"userModify",{user:$(this).find("id").eq(0).text()},
                                                              {data:e,success:function(){
                                                                  $scope.password=$scope.activePassword,d()},
                                                                  error:function(){d()}}),!1}})},
                                          error:function(){d()}}),void 0):!1},
                              function(){d()}),
                          $("#activePassword").focus(),$compile(angular.element("#active"))($scope),
                      $scope.$$phase||$scope.$apply(),$("#active").hide().show(),!1},
                      function(){d()}),
                      void 0}d()}},
      loginError:function(e,t,$scope){
          var a=this;a.bError=!0;var n=r.nodeValue(t,"subStatusCode");
          if("maxSessionUserLink"===n){
              var s="<div style='padding: 10px;'>"+o.getValue("maxUserLink")+"</div>";
              return i.alert(s,null,function(){
                  a.bError=!1,$("#username").focus(),
                      $("#password").blur(),$scope.username="",$scope.password="",$scope.szErrorTip="",
                      $scope.$apply()}),void 0}
          if(504==e)
              i.alert(o.getValue("connectTimeout"),null,function(){a.bError=!1});
          else if(401===e){
              var l=$(t);
              if("lock"===l.find("lockStatus").eq(0).text()){
                  var c=parseInt(l.find("unlockTime").eq(0).text(),10),
                      u="";60>c?u=o.getValue("seconds"):(c=Math.ceil(c/60),
                      u=o.getValue("minute"));
                  var s="<div style='padding: 10px;'>"+o.getValue("userLock",[c,u])+"</div>";
                  return i.alert(s,null,function(){
                      a.bError=!1,$("#username").focus(),$("#password").blur(),$scope.username="",$scope.password="",$scope.szErrorTip="",$scope.$apply()}),
                      void 0}
              var p=l.find("retryLoginTime").eq(0).text();
              $("#username").focus(),$("#password").blur(),
                  $scope.szErrorTip=""===p?o.getValue("loginError"):o.getValue("loginLockError",[p]),
                  a.bError=!1,$scope.username="",$scope.password="",$scope.$apply()}
          else i.alert(o.getValue("networkError"),null,function(){a.bError=!1})},
      checkLogin:function($scope){
          return 0==r.lengthw($scope.username)?(
              $scope.szErrorTip=o.getValue("inputUsername"),$("#username").focus(),!1):
              0==r.lengthw($scope.password)?($scope.szErrorTip=o.getValue("inputPassword"),
                  $("#password").focus(),!1):r.isChinese($scope.username)?($("#username").focus(),
                  $("#username").focus(),$scope.szErrorTip=o.getValue("notSupportZhUser"),
                  $scope.username="",$scope.$apply(),!1):r.isChinese($scope.password)?($("#password").focus(),
                  $scope.szErrorTip=o.getValue("notSupportZhPass"),$scope.password="",$scope.$apply(),!1):!0},
      changeLanguage:function(e){
          $.cookie("language",e),location.href=location.href},
      getDeviceActiveStat:function(){
          var e=this;WebSDK.WSDK_Activate(t.m_szHostName,t.m_iHttpProtocal,t.m_iHttpPort,
              {cmd:"activateStatus",success:function(t,a){
                  "true"!=r.nodeValue(a,"Activated")&&e.showChangePswd()}})},
      showChangePswd:function(){
          var e=this;
          $("body").unbind("keydown keypress").bind("keydown",function(t){
              13===t.keyCode&&(e.doActive(),l.$apply())}),
              i.html({szTitle:o.getValue("activeDevice"),szContent:$("#active").get(0),nWidth:300,
                  cbOk:function(){
                      return e.doActive(),l.$apply(),!1},oButtons:{bOK:!0}}),
              $("#activePassword").focus()},doActive:function(){
              var e=this,t=1024;
              return l.activePassword!==l.activePasswordConfirm?(
              i.alert(o.getValue("passNotMatch")),void 0):(r.checkPasswordComplexity(l.activePassword,l.activeUsername)&&($.browser.msie&&9>parseInt($.browser.version,10)&&(t=256),_oEncryption.encryptPassword(l.activePassword,t,e.activeDevice)),
              void 0)},
      activeDevice:function(e){
          var a=r.parseXmlFromStr("<?xml version='1.0' encoding='UTF-8'?><ActivateInfo><password>"+e+"</password></ActivateInfo>");
          WebSDK.WSDK_Activate(t.m_szHostName,t.m_iHttpProtocal,t.m_iHttpPort,{
              cmd:"activate",type:"PUT",processData:!1,data:a,
              success:function(){
                  l.username=l.activeUsername,l.password=l.activePassword,
                      $("#password").val(l.password),l.login()},
              error:function(e,t,a){s.saveState(a)}})}},module.exports=new e});