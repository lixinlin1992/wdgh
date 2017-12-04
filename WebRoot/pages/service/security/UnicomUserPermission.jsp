<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" " http://www.w3.org/TR/html4/strict.dtd">
<html>
	<title>联通用户数据授权</title>
	<head>
		<jsp:include page="/pages/framework/base.jsp" />
		<script type="text/javascript" src="scripts/datePicker/WdatePicker.js"></script>
		<script type="text/javascript" src="scripts/sunrise/tree.help.js"></script>
		<script type="text/javascript"
			src="scripts/zTree/jquery-ztree-2.1.min.js"></script>


		<script type="text/javascript">
		var treeObject;	//整棵树的对象
		var treeNodeId;
		var treeEvent;
		var nodesCount;
		var nodesMap = new Object() ;//区域的map
		var nodesNetMap = new Object() ;//网点的map	
		var uncheckedNodesMap;//未checek的map
		var allcheckNodes2;//打钩的节点
		var bs;//标识，判断是否初始化完毕
		var disabledNodes = new Object();//创建disabled的map
		var disabledNodesName = new Object();//创建disabled name的map
		var  js = -1;//把disabled的节点用数组记录下来

		/*跳到网点*/
		function createButton(cellValue,options,rowObj){					
			return "<a href='javascript:' onclick='showNodeAttr("+rowObj[0]+");'>" +    rowObj[1]  + "</a>" ;
		}	

		/*设置联通用户表格权限参数*/		 
		var params = {
				colNames : [ '工号','用户名'],
				colModel : [ {
					name : '工号',
					align : 'center',
					index : 'userId',
					sortable:false,	
					width : 10
				}, {
					name : '用户名',
					index : 'name',
					align : 'center',
					sortable:false,
					formatter : createButton,
					width : 10,
					formatoptions : {}
					
				}],
				caption : "联通用户数据授权",
				edit : true,
				multiselect:false,
				width:500,
			//	height:400,
				parentwidth:true,
				pager:'#pagerdt'
			};



  //关键代码
	var zTree1;
	var setting;

		setting = {
			async: true,
			asyncUrl: "framework.do?ds=SYS_P_USER_DATE_TREE_IMPOWER",  //获取节点数据的URL地址
			asyncParam: ["parent_id"],  //获取节点数据时，必须的数据名称，例如：id、name
			asyncParamOther: ["test","true"], //其它参数 ( key, value 键值对格式)
			checkable : "true",
					
			checkType : { "Y": "p", "N": "ps" },			
			callback:{				
				click: zTreeOnClick,
				expand: zTreeOnExpand,
				change: zTreeOnChange,
				collapse: zTreeOnCollapse,
				asyncSuccess: function asyncSuc(event, treeId, msg) {			
					treeObject = zTree1;//树加载完后，把树的对象放出去
					treeNodeId = treeId;
					treeEvent = event;

                    if (msg == undefined) {
                    
                        var _tempNodes = zTree1.getNodes();
                        	
                        nodesCount = _tempNodes;
                        if (_tempNodes.length == 0) {
                            CORE.info("查询失败")
                        } else {
                            if ((_tempNodes[0]).header != undefined) {
                                if ((_tempNodes[0]).header.code != 0&&(_tempNodes[0]).header.code <= 2000) {
                                    CORE.error("错误代码:" + (_tempNodes[0]).header.code + "<br>" + unescape((_tempNodes[0]).header.message), unescape((_tempNodes[0]).body));
                                    return;
                                }
                            }
                            update((_tempNodes[0]).body);
							/*等树加载完后，把有的节点变成map*/
					 		var checkedNodes1 = treeObject.getCheckedNodes(false); //把未选中的节点拿出来
					 		var uncheckedNodes1 =  treeObject.getCheckedNodes(true); //把选中的节点拿出来		
					 		var allNodesLength1  = 	checkedNodes1.length+uncheckedNodes1.length;//所有节点的长度	
					 		for(i=1;i<=allNodesLength1;i++){
					 			 var tttt = treeObject.getNodeByTId("treeDemo_"+i);	//获得每一个节点
					 			 if(tttt.type=="0"){//判断节点类型,0为区域，1为网点		
					 			 	nodesMap[tttt.id] = tttt.tId;//形成区域的map	 		 			 					 			 	
					 			 }else{
					 			 	nodesNetMap[tttt.id] = tttt.tId;//形成网点map					 			 	
					 			 }					 			 				 				 								 			 
					 		}
	                 		/*map 完成*/                         
                        }
                    } else {                    	
                        update(msg);
                    }
                    jQuery('body').hideLoading();

                },              
				asyncError: zTreeOnAsyncError
			}
		};

	var zNodes =[];
    function update(nodes) {
            if (nodes.nodes != null) {
                var temp = nodes.nodes[0].body;
                temp = CORE.unescapeJson(temp);
                zTree1.addNodes(nodes, temp);
                return
            }else{
                nodes = CORE.unescapeJson(nodes);
                zTree1.addNodes(null, nodes);
            }
        }
//关键代码结束

	function getTime() {
		var now= new Date();
		var hour=now.getHours();
		var minute=now.getMinutes();
		var second=now.getSeconds();
		return (hour+":"+minute+":"+second);	
	}
	/*点击用户 展示数据授权树的节点 跟 jqgrid 关联在一起*/
	function showNodeAttr(userId){		
	
		if(js>=0){//把diabled节点的name初始
			for(i=0;i<=js;i++){
				//alert("disabledNodes.length:"+js+" "+disabledNodes[i]+" "+disabledNodesName[i]);
				$("#"+ disabledNodes[i] +"_span").empty().text(disabledNodesName[i]);				
			}								
		}
	
		bs = true;//用来判断初始化是否完毕
		/*清空节点前把先把disabled去掉*/
		var cancerDis =  treeObject.getCheckedNodes(true); 
		if(cancerDis.length>0){
			for(i=0;i<cancerDis.length;i++){				
				$("#"+ cancerDis[i].tId +"_check").removeAttr("disabled");
			}
		}
			
		document.getElementById('ltUserId').value = userId;//把用户id放进form中			
		var alreadyCheckedNodes =  treeObject.getCheckedNodes(true);//找那些已经打钩的节点，如果长度大于0就，把整棵树清空			
		if(alreadyCheckedNodes.length>0){//根节点如果打钩，就再点一次让整棵树不打钩
			$("#treeDemo_1_check").trigger("click");//清空节点
			var openNode = treeObject.getNodeByTId("treeDemo_1");							
		}
		/*改变父子节点关系 Y是打钩，N是取消，p是父亲节点，s是孩子结点*/
		var tmpSetting = treeObject.getSetting();
		tmpSetting.checkType = {"Y": "", "N": "ps" };
		treeObject.updateSetting(tmpSetting);
		
		/*展开第一层节点*/
		var openNode = treeObject.getNodeByTId("treeDemo_1");					
		treeObject.expandNode(openNode, true,false); 
		
		/*请求网点授权的数据 把网点打上钩*/
		CORE.request("DS_SYS_P_USER_DATE_N",{data:'userId='+userId},function(msg2){
			//alert(msg.rows.length);
			/*把网点打勾*/
			 js = -1;//disabled计数器，每次都初始
			for(i=0;i<msg2.rows.length;i++){								
				//alert(msg2.rows[i].cell[3]);	
				var  keyValue = nodesNetMap[''+msg2.rows[i].cell[0]];
				if(msg2.rows[i].cell[2]==1){//判断是否与业务相关，是的就disabled
					js = js+1;
					$("#"+ keyValue +"_check").removeAttr("disabled").trigger("click").attr("disabled","disabled");//打钩加业务相关							
					text2 =  msg2.rows[i].cell[4]+"("+msg2.rows[i].cell[3]+")";									
					$("#"+ keyValue +"_span").empty().text(text2);
					disabledNodes[js] = keyValue;//形成disabled的map
					disabledNodesName[js] = msg2.rows[i].cell[4];//形成disabled name的map					
				}else{
					$("#"+ keyValue +"_span").empty().text(msg2.rows[i].cell[4]);
					$("#"+ keyValue +"_check").removeAttr("disabled").trigger("click");//打钩与加业务不相关
				}						
			}
			/*调用区域打钩*/			
			clickAreaChecked(userId);	
		});	
	}
	/*区域打钩*/
	function clickAreaChecked(userId){	
		/*请求数据，把区域的节点的打上勾*/				
		CORE.request("DS_SYS_P_USER_DATE_OA",{data:'userId='+userId},function(msg){
			for(i=0;i<msg.rows.length;i++){						
				var  keyValue = nodesMap[''+msg.rows[i].cell[0]];	
				if(keyValue!=undefined){
					$("#"+ keyValue +"_check").trigger("click");//打钩
				}									
			}	
			/*把父子影响关系改回来*/
			var tmpSetting = treeObject.getSetting();
			tmpSetting.checkType = {"Y": "ps", "N": "ps" };//Y是打钩，N是取消，p是父亲节点，s是孩子结点
			treeObject.updateSetting(tmpSetting);		
			bs = false;
			allcheckNodes2 = treeObject.getCheckedNodes();	
		});
	}
	function zTreeOnClick(event, treeId, treeNode) {	

	}
	function zTreeOnExpand(event, treeId, treeNode) {	
	
	}
	function zTreeOnCollapse(event, treeId, treeNode) {	
		
	}
	
	function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
		
	}

	function zTreeOnAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
	
	}

	function refreshTree(asyncUrl) {

	}

	function getNow() {

	}
	
	function addArea(){

	}
	
	function editArea(){

	}
	
	function delArea(){
		
	}
	/*让disabled的节点样式保持打钩状态*/
	function zTreeOnChange (event, treeId, treeNode){
		if(bs){
			return;
		}else{							
			for(t=0;t<allcheckNodes2.length;t++){
				if($("#"+allcheckNodes2[t].tId+"_check").attr("disabled")){						
					//$("#"+allcheckNodes2[t].tId+"_check").removeClass();//attr("class","chk checkbox_true_full");
					$("#"+allcheckNodes2[t].tId+"_check").addClass("chk checkbox_true_full");
				}
			}
		}
	}
		
		

	
	function reloadarea(){
		zTree1 = $("#treeDemo").zTree(setting, zNodes);
	}
	function show1(){
		jQuery("body").showLoading();	
		show2();
	}
	function show2(){
		/*创建区县表格*/
		GRID.create("#listdt", "SYS_P_USER_DATE_GRID", params,"test");	
		zTree1 = $("#treeDemo").zTree(setting, zNodes);	
	}		
	/*创建树 创建表格*/
	$().ready(function(){	
		show1();		
	});
	/*修改用户授权提交表单*/
	function checkedNodesAdd(){
		var allCheckedNodes	= treeObject.getCheckedNodes();//获取所有打钩节点对象
		if(allCheckedNodes.length>0){//如果有打钩的节点
			$("p").empty();//清空，以便放下一次提交的数据
			document.getElementById('oaBs').value = "";
			document.getElementById('nBs').value = "";
			for(i=0;i<allCheckedNodes.length;i++){
				if(allCheckedNodes[i].type==0){//区域
					$("#functionId").append("<input type='hidden' name='function_ids_oa' value=\""+allCheckedNodes[i].id+"\"\>");
					document.getElementById('oaBs').value = 1;				
				}else{//网点
					//拿到于业务无关的节点
					if($("#"+ allCheckedNodes[i].tId +"_check").attr("disabled")){						
					}else{//没有与业务相关的，就可以添加到数据库
						$("#functionId").append("<input type='hidden' name='function_ids_n' value=\""+allCheckedNodes[i].id+"\"\>");
				        document.getElementById('nBs').value = 1;	
					}				
				}
			}
			
			CORE.submitForm("DS_SYS_P_USER_DATE_ADD","userMsgForm",{},function(){CORE.info("操作成功！");})
		}else{//删掉整棵树
			document.getElementById('oaBs').value = 0;
			document.getElementById('nBs').value = 0;
			/*删除所有节点*/
			CORE.submitForm("DS_SYS_P_USER_DATE_ADD","userMsgForm",{},function(){CORE.info("操作成功！");})
			var openNode = treeObject.getNodeByTId("treeDemo_1");
			//treeObject.expandNode(openNode, false,true);//关闭整棵树
		}
	}


			</script>
	</head>

	<body style="padding: 0; margin: 0">
		<jsp:include page="/pages/navbar.jsp" />
		<div class="modules">
			<div class="barquery">
				<div class="barquerycenter">
					联通用户数据授权
				</div>
				<div class="barqueryright"></div>
			</div>
			<div style="clear: both;" class="barquerycontent" align="center">
				<table>
					<tr>
						<td>
							<form id="test" name="test"
								onsubmit="GRID.reload('listdt');return false">
								<table class="content_List">
									<tr>
										<td class="contenttd">
											工号：
										</td>
										<td align="left">
											<input type="text" id="userIdText" name="userIdText" />
										</td>
										<td>
											<input type="submit" Class="btnquery_mouseout"
												onmouseover="this.className='btnquery_mouseover'"
												onmouseout="this.className='btnquery_mouseout'" value="" />
										</td>
									</tr>
								</table>
							</form>
						</td>
					</tr>
					<tr>
						<td valign="top">
							<div>
								<table id="listdt" style="margin: 0; padding: 0;"></table>
								<div id="pagerdt" style="margin: 0; padding: 0;"></div>
							</div>
						</td>
						<td>
							<div style="width: 300px; height: 420px; overflow-y: auto;"
								align="left">
								<ul id="treeDemo" class="tree"></ul>
								<!-- 树所在 -->
							</div>
						</td>
					</tr>
					<tr>
						<td>
						</td>
						<td>
							<form id="userMsgForm" name="userMsgForm">
								<!-- 联通用户id -->
								<input type="hidden" name="ltUserId" id="ltUserId" />
								<input type="hidden" name="oaBs" id="oaBs" value="" />
								<!-- 区域标识 判断是否有区域被打钩-->
								<input type="hidden" name="nBs" id="nBs" value="" />
								<!-- 网点标识 判断是否有网点被打钩-->
								<p id="functionId"></p>
								<input type="button" value="确定" class="btnfunctionout"
									onclick=" checkedNodesAdd();" />
							</form>
						</td>
					</tr>
				</table>
			</div>
		</div>		
		<!-- 区域选择 -->
		<div id="_dialog" style="display: none;">
			<iframe width="100%" height="100%" id="frameInDialog"></iframe>
		</div>

	</body>
</html>

