	/**
		add: 生产单元的,没有团队经理的,统一发给智慧办
	**/
	
	
	rdcp.ready(function(){
		
		//微信端文件上传
		rdcp.loadJS(
			{
				url : "scripts/upload/ajaxfileupload.js",
				onload : function()
				{
				}
			});
	
			//初始化商机地址下拉框
			
			 //region_init("select_province","select_city","select_area",'深圳市','',''); 
			
			//根据角色来判断可以报备哪些级别的商机
			
			/** 临时的角色编码
				1，对大客户营销中心的客户经理，只允许报备A级和B级商机 118
				2，对区分公司的集客客户经理，只允许报备A级和C级商机   119
				3，公司非集客客户经理，只允许报备A级和D级商机  120
			**/
			//start
			rdcp.request('!szbo/busiManage/~query/Q_GET_GROUP_BUSI_CLASS', "", function (data) {
				//alert(data.body['rows'][0]['NUM']);
				var num = data.body['rows'][0]['NUM'];
				
				var busiHtml="";
				//A
				var busiHtml_A = "<li><input name='busi_class_name'  type='radio' value='A' onchange='setBusiClass(this.value,1);'/>&nbsp;&nbsp;A级:总标超60万/月收超10万、政府重大项目</li>";
				//B
				var busiHtml_B = "<li><input name='busi_class_name'  type='radio' value='B' onchange='setBusiClass(this.value,2);'/>&nbsp;&nbsp;B级:名单制客户固网月收超3万/移网超500户</li>";
				//C
				var busiHtml_C = "<li><input name='busi_class_name'  type='radio' value='C' onchange='setBusiClass(this.value,3);'/>&nbsp;&nbsp;C级:单客户月收超1万/移网超100户</li>";
				//D
				var busiHtml_D = "<li><input name='busi_class_name'  type='radio' value='D' onchange='setBusiClass(this.value,4);'/>&nbsp;&nbsp;D级:企业级商机</li>";
				//E
				var busiHtml_E = "<li><input name='busi_class_name'  type='radio' value='E' onchange='setBusiClass(this.value,5);'/>&nbsp;&nbsp;E级:营业厅集客线商机</li>";
				
				//alert(num);
				switch (num){
					case '1':
						busiHtml+=busiHtml_A;
						busiHtml+=busiHtml_B;
						busiHtml+=busiHtml_E;
						break;
					case '2':
						busiHtml+=busiHtml_A;
						busiHtml+=busiHtml_C;
						busiHtml+=busiHtml_E;
						break;
					case '3':
						busiHtml+=busiHtml_A;
						busiHtml+=busiHtml_D;
						busiHtml+=busiHtml_E;
						break;
					case '4':
						busiHtml+=busiHtml_A;
						busiHtml+=busiHtml_D;
						busiHtml+=busiHtml_E;
						break;
				}
				
				$("#busi_class_html").append(busiHtml);
				
				
				//微信端动态生成商机分类
				var busiHtmlMobile="";
				//A
				var busiHtmlMobile_A = "<li><input name='busi_class_name'  type='radio' value='A' onchange='setBusiClass(this.value,1);'/>A级:总标超60万/月收超10万、政府重大项目</li>";
				//B
				var busiHtmlMobile_B = "<li><input name='busi_class_name'  type='radio' value='B' onchange='setBusiClass(this.value,2);'/>B级:名单制客户固网月收超3万/移网超500户</li>";
				//C
				var busiHtmlMobile_C = "<li><input name='busi_class_name'  type='radio' value='C' onchange='setBusiClass(this.value,3);'/>C级:单客户月收超1万/移网超100户</li>";
				//D
				var busiHtmlMobile_D = "<li><input name='busi_class_name'  type='radio' value='D' onchange='setBusiClass(this.value,4);'/>D级:企业级商机</li>";
				//E
				var busiHtmlMobile_E = "<li><input name='busi_class_name'  type='radio' value='E' onchange='setBusiClass(this.value,4);'/>E级:营业厅集客线商机</li>";
				
				//alert(num);
				switch (num){
					case '1':
						busiHtmlMobile+=busiHtmlMobile_A;
						busiHtmlMobile+=busiHtmlMobile_B;
						busiHtmlMobile+=busiHtmlMobile_E;
						break;
					case '2':
						busiHtmlMobile+=busiHtmlMobile_A;
						busiHtmlMobile+=busiHtmlMobile_C;
						busiHtmlMobile+=busiHtmlMobile_E;
						break;
					case '3':
						busiHtmlMobile+=busiHtmlMobile_A;
						busiHtmlMobile+=busiHtmlMobile_D;
						busiHtmlMobile+=busiHtmlMobile_E;
						break;
					case '4':
						busiHtmlMobile+=busiHtmlMobile_A;
						busiHtmlMobile+=busiHtmlMobile_D;
						busiHtmlMobile+=busiHtmlMobile_E;
						break;
				}
				
				$("#busi_class_html_mobile").append(busiHtmlMobile);
			//end
			
			
			//获取序列
			rdcp.request('!szbo/busiManage/~query/Q_GET_BS_REP_INFO_SEQ', "", function (data) {
	        		$("#seqNum").val(data.body['rows'][0]['SEQNUM']);
	        });
	        
						
		   	
		   	 	
			//项目预计规模下拉框
			/**rdcp.dropdown2("busi_pro_fee", '!szbo/busiManage/~query/Q_COMMON_GET_SELECT?code_table=BI_REP_BUSINESS_TYPE&code_field=BUSI_PRO_FEE', {loadComplete: function () {
		    }});
			//牵头单位下拉框
			rdcp.dropdown2("busi_pro_unit", '!szbo/busiManage/~query/Q_COMMON_GET_SELECT?code_table=BI_REP_BUSINESS_TYPE&code_field=BUSI_PRO_UNIT', {loadComplete: function () {
		    }});
			//实施时间下拉框
			rdcp.dropdown2("busi_pro_time", '!szbo/busiManage/~query/Q_COMMON_GET_SELECT?code_table=BI_REP_BUSINESS_TYPE&code_field=BUSI_PRO_TIME', {loadComplete: function () {
		    }});**/
	            //加载业务类型下拉框
			    rdcp.dropdown2("busiType_1", '!szbo/busiManage/~query/Q_COMMON_GET_SELECT?code_table=BI_REP_BUSINESS_TYPE&code_field=BUSINESS_TYPE_NAME', {loadComplete: function () {
			    }});
		   });
		    
    });
    //新增业务类型
	function addBusiType(){
		
		//获取当前table的总行数
		var tableTrNum=$("#busiTable").find("tr").length;
		
		if(tableTrNum==5){//三个业务类型,table最多5行
			$.messager.alert('提示', '已经超出现有的业务类型个数,不允许再添加.', 'error');
			return;
		}
		
		
		//获取当前table的总行数-1
		var tableNewTrNum=tableTrNum-1;
		
		//每行的信息串
		var tableTrStr="<tr id='busiTypeTr_"+tableNewTrNum+"'><td><input name='busiTypeSelectB_"+tableNewTrNum+"' id='busiTypeSelectB_"+tableNewTrNum+"'  type='hidden'/><select name='busiType_"+tableNewTrNum+"' id='busiType_"+tableNewTrNum+"' onclick='getOnClickValue(this.value,"+tableNewTrNum+")' onchange='sumBusiType(1,"+tableNewTrNum+");'></select></td>"+
					   "<td><input type='hidden' name='busiTypeNumF_"+tableNewTrNum+"' id='busiTypeNumF_"+tableNewTrNum+"'/><input name='busiTypeNum_"+tableNewTrNum+"' id='busiTypeNum_"+tableNewTrNum+"' class='orlongInput' style='text-align: center' type='text' onchange='sumNum("+tableNewTrNum+")'/></td>"+
					   "<td><input type='hidden' name='busiTypeFeeF_"+tableNewTrNum+"' id='busiTypeFeeF_"+tableNewTrNum+"'/><input name='busiTypeFee_"+tableNewTrNum+"' id='busiTypeFee_"+tableNewTrNum+"' class='orlongInput' style='text-align: center' type='text' onchange='sumFee("+tableNewTrNum+")' onFocus='getOnFocusValue(this.value,"+tableNewTrNum+")'/></td>"+
			           "<td><a class='btn_delete' href='javascript:void(0);'  onclick='delBusiType("+tableNewTrNum+")'>删除</a></td></tr>";
		
		//增加一行,即在倒数第二行插入一行
		$("#busiEndTr").before(tableTrStr);
		
		//加载新增的业务类型下拉框
		rdcp.dropdown2("busiType_"+tableNewTrNum, '!szbo/busiManage/~query/Q_COMMON_GET_SELECT?code_table=BI_REP_BUSINESS_TYPE&code_field=BUSINESS_TYPE_NAME', {loadComplete: function () {
		}});
		
	}
    //删除业务类型一行
	function delBusiType(trNum){
		//减掉金额
		//修改前的合计
		var sumFeeNum=parseFloat($("#sumFee").text());
		var delTrFee=parseFloat($("#busiTypeFee_"+trNum).val()!=""?$("#busiTypeFee_"+trNum).val():0);
		$("#sumFee").empty(); 
		$("#sumFee").append(sumFeeNum-delTrFee); 
		
		//获取当前业务类型的值
		var busiTypeID=$("#busiType_"+trNum).val();
		
		//总费用清零
		$("#busiTypeFeeAll_"+busiTypeID).val("0");
		$("#busiTypeNumAll_"+busiTypeID).val("0");
		
		
		//删除行
		$("tr[id='busiTypeTr_"+trNum+"']").remove();
		
		
	}
	//合计数量
	function sumNum(id){
		if(isNaN($("#busiTypeNum_"+id).val())||parseFloat($("#busiTypeNum_"+id).val())<0){
        	$("#busiTypeNum_"+id).val("");
        	$.messager.alert('提示', '请输入大于0的有效数字!', 'error');
        	return ;
		}
		var selectValue=$("#busiType_"+id).val();
		
		if(selectValue==0){
			$("#busiTypeNumAll_0").val($("#busiTypeNum_"+id).val());
		}
		if(selectValue==1){
			$("#busiTypeNumAll_1").val($("#busiTypeNum_"+id).val());
		}
	}
	//合计费用
	function sumFee(id){
		var numaBefore=parseFloat($("#busiTypeFeeF_"+id).val()!=""?$("#busiTypeFeeF_"+id).val():0);
		if(isNaN($("#busiTypeFee_"+id).val())||parseFloat($("#busiTypeFee_"+id).val())<0){
        	$("#busiTypeFee_"+id).val(numaBefore);
        	$.messager.alert('提示', '请输入大于0的有效数字!', 'error');
        	return ;
		 }
		var numAfter=parseFloat($("#busiTypeFee_"+id).val()!=""?$("#busiTypeFee_"+id).val():0);
		//修改前的合计
		var sumFeeNum=parseFloat($("#sumFee").text());
		
		//内容
		$("#sumFee").empty(); 
		$("#sumFee").append(sumFeeNum-numaBefore+numAfter);
		
		//下拉框业务类型的金额汇总
		sumBusiType(2,id);
	}
	
	//获取修改之前的值
	function getOnFocusValue(value,id){
		$("#busiTypeFeeF_"+id).val(value);
	}
	//获取下拉框修改前的值  注：  隐藏标签应该动态生成。跟下拉框同步。
	function getOnClickValue(value,id){
		if(value!=-1){
			$("#busiTypeSelectB_"+id).val(value);
		}
		
		//是系统集成的,数量为不可填
		
		if(value==0){
			$("#busiTypeNumAll_0").val($("#busiTypeNum_"+id).val());
		}
		if(value==1){
			$("#busiTypeNumAll_1").val($("#busiTypeNum_"+id).val());
		}
		if(value==2){
			//alert(value);
			$("#busiTypeNum_"+id).attr("disabled",true) ;
		}else{
			$("#busiTypeNum_"+id).attr("disabled",false) ;
		}
	}
	
	//商机报备的业务类型金额汇总 type:1下拉框 2文本框
	function sumBusiType(type,id){
		//获取当前业务类型的值
		var busiTypeID=$("#busiType_"+id).val();
		//获取之前业务类型的值
		var beforeVal=$("#busiTypeSelectB_"+id).val();//获取已经选择的值。有错 不是0  是动态
		
		//只有三种业务类型,不可以重复选择业务类型
		if(type=='1'){
			//有选择&且选择的业务类型已经有记录
			if(busiTypeID!=-1&&$("#busiTypeFeeAll_"+busiTypeID).val()!=0){
				$.messager.alert('提示', '已经选择该业务类型,请重新选择', 'error');
				//返回之前选择前的值
				$("#busiType_"+id).val($("#busiTypeSelectB_"+id).val());
				return;
			}
		}
		
		
		//获取当前金额
		var busiTypeFee=parseFloat($("#busiTypeFee_"+id).val()!=""?$("#busiTypeFee_"+id).val():0);
		//获取之前金额
		var busiTypeFeeF=parseFloat($("#busiTypeFeeF_"+id).val()!=""?$("#busiTypeFeeF_"+id).val():0);
		if(busiTypeID!=-1){//有选择
			//获取当前已选择的业务类型总金额
			var busiTypeFeeAll=parseFloat($("#busiTypeFeeAll_"+busiTypeID).val());
		}else{
			$("#busiTypeFeeAll_"+beforeVal).val("0");
		}
		//文本框&移网 有错：不应该分业务类型
		if(type=='1'){
			
			if(beforeVal!=-1){//之前不是新选择的
				//之前的业务类型总额赋值为0
				$("#busiTypeFeeAll_"+beforeVal).val("0");//清零
				$("#busiTypeFeeAll_"+busiTypeID).val(busiTypeFee);//赋值当前的值
			}else{//之前是新选择的
				$("#busiTypeFeeAll_"+busiTypeID).val(busiTypeFee);//赋值当前的值
			}
		}
		//文本框&已有选择
		if(type=='2'&&busiTypeID!=-1){
			//减去之前的值,加上现有的值
			$("#busiTypeFeeAll_"+busiTypeID).val(busiTypeFeeAll-busiTypeFeeF+busiTypeFee);
		}
	}
	
	//提交表单
	function addBusi(){
		//alert(sys_team_member);
		//商机名称不可为空
		var busi_name=$("#busi_name").val();
		//商机级别不可为空
		var busi_class=$("#busi_class").val();
		//需求描述不可为空
		var requ_des=$("#requ_des").val();
		//客户名称不可为空
		var cust_name=$("#cust_name").val();
		//客户联系人不可为空
		var cust_per=$("#cust_per").val();
		//客户联系电话不可为空
		var cust_phone=$("#cust_phone").val();
		//商机地址不可为空
		var busi_addr=$("#busi_addr_show").val();
		
		//业务类型的总费用
		var sumValue=parseFloat($("#busiTypeFeeAll_0").val())+parseFloat($("#busiTypeFeeAll_1").val())+parseFloat($("#busiTypeFeeAll_2").val());
		
		/**if(teamManage==""){
			$.messager.alert('提示', '您没有相对应的团队经理,不能发起报备商机!', 'error');
			return;
		}**/
		
		if(busi_name==""){
			$.messager.alert('提示', '商机名称不可为空!', 'error');
			return;
		}
		if(busi_class==""){
			$.messager.alert('提示', '请选择商机分类!', 'error');
			return;
		}
		if(cust_name==""){
			$.messager.alert('提示', '客户名称不可为空!', 'error');
			return;
		}
		if(cust_per==""){
			$.messager.alert('提示', '客户联系人不可为空!', 'error');
			return;
		}
		if(cust_phone==""){
			$.messager.alert('提示', '客户联系电话不可为空!', 'error');
			return;
		}
		if(busi_addr==""){
			$.messager.alert('提示', '商机地址不可为空!', 'error');
			return;
		}
		if(requ_des==""){
			$.messager.alert('提示', '需求描述不可为空!', 'error');
			return;
		}
		if(sumValue=="0"){
			$.messager.alert('提示', '业务类型不可为空,请选择业务类型!', 'error');
			return;
		}
	
		startWorkflow();
	}
	
	//发起工作流
	function startWorkflow(){
			rdcp.mask($("body"), "正在报备商机...");
			//ISPRO="生产单元";//临时
			//teamManage="8826E8A1A61F4FDDBD5160711D4B6FFA0000";//临时
			//工作流
            
		rdcp.request("!whBusiness/wechat/~query/Q_ADD_REP_BUSI",rdcp.id("addBusiForm").serialize(),function(data){
			if (data.header.code == 0) {
				alert("here");
				 rdcp.unmask($("body"));
				 $.messager.alert('提示', '添加成功!', 'info',function(){
					 	history.go(-1);
		          });
			
		      } else {
		          $.messager.alert('提示', '操作失败!', 'error',function(){
		          		//CloseTab("addBusi","报备新商机");
		          		history.go(-1); 
	    				//location.reload(); 
		          });
		      }
			});
	}
	
	//取消 关闭选项卡
	function cancelBusi(){
		CloseTab("addBusi","报备新商机");
	}
	
	/**
	   自动生成商机级别 ：有三个下拉框选择的值决定.type:是哪个下拉框.
	   商机级别,由下拉框选择的值得出的区间来决定.
	   项目预计规模:busi_pro_fee_value
	   牵头单位:busi_pro_unit_value
	   实施时间:busi_pro_time_value
	   区间在后台的sql来实现
	**/
	function getBusiClass(type){
		
		
		//全部都不选
		if($("#busi_pro_fee").val()=='-1'&&$("#busi_pro_unit").val()=='-1'&&$("#busi_pro_time").val()=='-1'){
			$("#busi_class_value").val("0");
			$("#busi_class").val("");
			return;
		}
		
		if(type=='busi_pro_fee'){
			if($("#busi_pro_fee").val()!=-1){
				rdcp.request('!szbo/busiManage/~query/Q_GET_BUSI_CLASS?busiType=BUSI_PRO_FEE&busiTypeId='+$("#busi_pro_fee").val(), "", function (data) {
	        		$("#busi_pro_fee_value").val(data.body['rows'][0]['VALUE']);
	        		//合计三个下拉框对应的值算区间,给予等级
	        		sumClassValue();
	        	});
			}else{
				    $("#busi_pro_fee_value").val("0");//不选清零
	        		//合计三个下拉框对应的值算区间,给予等级
	        		sumClassValue();
			}
		}
		if(type=='busi_pro_unit'){
			if($("#busi_pro_unit").val()!=-1){
				rdcp.request('!szbo/busiManage/~query/Q_GET_BUSI_CLASS?busiType=BUSI_PRO_UNIT&busiTypeId='+$("#busi_pro_unit").val(), "", function (data) {
	        		$("#busi_pro_unit_value").val(data.body['rows'][0]['VALUE']);
	        		//合计三个下拉框对应的值算区间,给予等级
	        		sumClassValue();
	        	});
	        }else{
				    $("#busi_pro_unit_value").val("0");//不选清零
				    //合计三个下拉框对应的值算区间,给予等级
	        		sumClassValue();
			}
		}
		if(type=='busi_pro_time'){
			if($("#busi_pro_time").val()!=-1){
				rdcp.request('!szbo/busiManage/~query/Q_GET_BUSI_CLASS?busiType=BUSI_PRO_TIME&busiTypeId='+$("#busi_pro_time").val(), "", function (data) {
	        		$("#busi_pro_time_value").val(data.body['rows'][0]['VALUE']);
	        		//合计三个下拉框对应的值算区间,给予等级
	        		sumClassValue();
	        	});
	        }else{
				    $("#busi_pro_time_value").val("0");//不选清零
				    //合计三个下拉框对应的值算区间,给予等级
	        		sumClassValue();
			}
		}
	}
	
	/**
	 **	合计三个下拉框对应的值算区间,给予等级
	**/
		function sumClassValue(){
			var sumValue=parseFloat($("#busi_pro_fee_value").val())+parseFloat($("#busi_pro_unit_value").val())+parseFloat($("#busi_pro_time_value").val())
			
			//全选
			if($("#busi_pro_fee").val()!='-1'&&$("#busi_pro_unit").val()!='-1'&&$("#busi_pro_time").val()!='-1'){
				//A:(120=10+10+100 ;1020=1000+10+10 ; 10110=10000+10+100; 11010=10000+10+1000
				if(sumValue==120||sumValue==1020||sumValue==10110||sumValue==11010){
					$("#busi_class_value").val("1");
					$("#busi_class").val("A");
					return;
				}
				//B:(210=100+100+10 ;1020=1000+100+100 ; 10110=10000+100+10 ; 11100=10000+100+1000
				if(sumValue==210||sumValue==1200||sumValue==10110||sumValue==11100){
					$("#busi_class_value").val("2");
					$("#busi_class").val("B");
					return;
				}
				//C:(2010=1000+1000+10 ;1020=1000+1000+100 ; 
				if(sumValue==2010||sumValue==2100){
					$("#busi_class_value").val("3");
					$("#busi_class").val("C");
					return;
				}
			}
			
			if((sumValue>=20&&sumValue<=30)||(sumValue>=200&&sumValue<=300)||(sumValue>=2000&&sumValue<=3000)||(sumValue>=10010&&sumValue<=10020)||(sumValue>=10100&&sumValue<=10200)){
				if(sumValue>=20&&sumValue<=30){
					$("#busi_class_value").val("1");
					$("#busi_class").val("A");
				}
				if(sumValue>=200&&sumValue<=300){
					$("#busi_class_value").val("2");
					$("#busi_class").val("B");
				}
				if(sumValue>=2000&&sumValue<=3000){
					$("#busi_class_value").val("3");
					$("#busi_class").val("C");
				}
				if(sumValue>=10010&&sumValue<=10020){
					$("#busi_class_value").val("1");
					$("#busi_class").val("A");
				}
				if(sumValue>=10100&&sumValue<=10200){
					$("#busi_class_value").val("2");
					$("#busi_class").val("B");
				}
			}else{
				$("#busi_class_value").val("4");
				$("#busi_class").val("D");
			}
		}
		
		/**
			商机报备的附件上传
		**/
		function upLoadBusiFile(){
			uploadFileInfo($("#seqNum").val(),'BS_REP_INFO','addOrderInfo');
		}
		//手机微信拍照附件上传
		function upLoadBusiFileMobile(){
			uploadFileInfoMobile($("#seqNum").val(),'BS_REP_INFO','addOrderInfo');
		}
		
		//set 商机等级
		function setBusiClass(value,num){
			//alert(value);
			$("#busi_class").val(value);
			$("#busi_class_value").val(num);
		}
		//拼装商机地址 $("#busi_addr_show").val()
		/*function sum_address(){
		
			$("#busi_addr").val($("#select_province").val()+$("#select_city").val()+$("#select_area").val()+$("#busi_addr_show").val());
			
		}*/
		
		//微信端附件上传
		//上传附件 的方法
		function importFileInfo()
		{
			rdcp.id("import_order_id").val($("#seqNum").val());
			rdcp.id("table_name").val('BS_REP_INFO');
			rdcp.id("div_name").val('addOrderInfo');
			//alert($("#table_name").val());
			//console.log($("#upfile").val());
			if ($("#upfile").val() == "")
			{
				$.messager.alert("提示","请选择需要上传的附件.","warning");
				return;
			} else
			{	
				//alert($("#upfile").val()+$("#import_order_id").val()+$("#table_name").val()+$("#div_name").val());
				rdcp.mask($("#mask"),'文件上传中');
				COMMON.upload(
				{
					url : '!szbo/base~ds/DS_IMPORT_FILE',
					formName : 'addBusiForm'
				}, function(data)
				{
					rdcp.unmask($("#mask"));
					$.messager.alert('提示', '文件上传成功!', 'info');
					lookAddOrderInfo($("#import_order_id").val(), $("#table_name").val(), $("#div_name").val());
				});
			}
		}
		//添加需求但 填充页面 
		function lookAddOrderInfo(order_id, table_name, div_name)
		{
			$("#import_order_id").val(order_id);
			$("#table_name").val(table_name);
			$("#div_name").val(div_name);
			rdcp.request("!szbo/base/~query/Q_FILE_INFO_LOOK", "id=" + order_id + "&table_name=" + table_name, function(data)
			{
				var div_name = $('#div_name').val();
				$("#" + div_name).empty();
				for ( var i = 0; i < data.body.rows.length; i++)
				{
					$("#" + div_name).append('<div class="imgInformationBox" id="updateInfo">' + '<div class="imgInformation"><font id="' + data.body.rows[i].cell[0] + '">' + data.body.rows[i].cell[1] + '&nbsp;&nbsp;<input type="hidden" id="filepath'+data.body.rows[i].cell[0]+'" value="'+data.body.rows[i].cell[2]+'"></font></div><div class="imgTools"><a class="btn_delete" href="javascript:void(0)" id="uploadfiledel' + data.body.rows[i].cell[0] + '" name="accessoriesdelete" onclick="uploadfiledel(' + data.body.rows[i].cell[0] + ')">删除</a>' + '</div></div>');
				}
			});

		}

		//删除附件
		function uploadfiledel(id)
		{
			var order_id = $("#import_order_id").val();
			var table_name = $("#table_name").val();
			var div_name = $("#div_name").val();
			$.messager.confirm('确认操作', '确定要删除附件？', function(r)
			{
				if (r)
				{
					rdcp.request("!szbo/base/~query/Q_FILE_INFO_DEL", "id=" + id, function(data)
					{
						lookAddOrderInfo(order_id, table_name, div_name);
					});
				}
			});

		}