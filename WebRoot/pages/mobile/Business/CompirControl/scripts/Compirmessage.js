app.registerCtrl("Compirmessage", ["$scope", "$srhttp", "$rootScope", "$routeParams",
	function($scope, $srhttp, $rootScope, $routeParams) {
		var arry=[];//定义一个空数组
		var resert=false;
		$rootScope.apptitle="抄表管理";
		$(".appHeader").find("a").eq(1).hide();
		$(".appHeader").find("a").eq(2).show();
		var clicknum=1;
		//获取信息
		//var ishistory=0;
		$scope.getdata=function(a,b,c,d,e,f,opt){
			$(".appHeader").find("a").eq(1).hide();
			$(".appHeader").find("a").eq(2).show();
			$srhttp.post("!property/mobile/~query/Q_AMMETER_READING_LIST",{
				hsorgId:"",
				ishistory:0,
				page:a,
				rows:b,
				sacode:e,
				saname:f,
				sarbegind:"",
				sarendd:"",
				sorgName:"",
				spcode:c,
				spname:d
			},function(data){
				$("#g1").show();
				$("#g2").hide();
				$("#g3").hide();
				if(data instanceof Object){
				if (data.header.code == 0) {
					if(resert){
						resert=false;
						arry=[];
					}
					for(var j=0;j<data.body.rows.length;j++){
						arry.push(data.body.rows[j]);
					}
					$scope.mylist=arry;
					Local.saveStoreJson("Compirmessage",arry);
					if(data.body.rows.length<10){
						$("#g3").show();
						$("#g1").hide();
					}
				}else{
					alert("请求数据失败！");
				}}
			},opt);
		};
		if(Local.getStoreJson("Compirmessage")==null){
			$scope.getdata(1,10);
		}else{
			$scope.mylist=Local.getStoreJson("Compirmessage");
		}


		$scope.getmoredata=function(){
			clicknum++;
			$("#g1").hide();
			$("#g2").show();
			$scope.g_query(clicknum,{mask:false});


		}
		$scope.g_query=function(num,p){
			if(p==undefined){
				clicknum=1;
				resert=true;
			}
			var num=num?num:1;
			var p=p?p:{};
			var PROPERTY_CODE="";
			var PROPERTY_NAME="";
			var DEVICE_CODE="";
			var DEVICE_NAME="";
			var PROPERTY_CODE_NAME= $("#PROPERTY_CODE_NAME").val();
			var DEVICE_CODE_NAME= $("#DEVICE_CODE_NAME").val();
			if(/^[0-9a-zA-Z]+$/.test(PROPERTY_CODE_NAME)){
				PROPERTY_CODE=PROPERTY_CODE_NAME;
			}else{
				PROPERTY_NAME=PROPERTY_CODE_NAME;
			}
			if(/^[0-9a-zA-Z_]+$/.test(DEVICE_CODE_NAME)){
				DEVICE_CODE=DEVICE_CODE_NAME;
			}else{
				DEVICE_NAME=DEVICE_CODE_NAME;
			}
			$scope.getdata(1*num,10,PROPERTY_CODE,PROPERTY_NAME,DEVICE_CODE,DEVICE_NAME,p);
		};

		$scope.g_edit=function(event){
			var id=event.target.getAttribute("attr");
			var ammeter_id=event.target.getAttribute("attr1");
			$srhttp.post("!property/mobile/~query/Q_AMMETER_READING_FORM_SHOW",{
				id:id,
				ammeter_id:ammeter_id
			},function(data){
				Local.saveStoreJson("g_form",data);
				hrefJump("messageforedit");
			});
		}
	}
]);