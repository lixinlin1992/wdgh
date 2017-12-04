/**
 * 初始化
 */
rdcp.ready(function() {
	//TODO 初始化遮罩层
	$.extend($.fn,{
        mask: function(msg,maskDivClass){
            this.unmask();
            // 参数
            var op = {
                opacity: 0.8,
                z: 10000,
                bgcolor: '#ccc'
            };
            var original=$(document.body);
            var position={top:0,left:0};
                        if(this[0] && this[0]!==window.document){
                            original=this;
                            position=original.position();
                        }
            // 创建一个 Mask 层，追加到对象中
            var maskDiv=$('<div class="maskdivgen">&nbsp;</div>');
            maskDiv.appendTo(original);
            var maskWidth=original.outerWidth();
            if(!maskWidth){
                maskWidth=original.width();
            }
            var maskHeight=original.outerHeight();
            if(!maskHeight){
                maskHeight=original.height();
            }
            maskDiv.css({
                position: 'absolute',
                top: position.top,
                left: position.left,
                'z-index': op.z,
              width: maskWidth,
                height:maskHeight,
                'background-color': op.bgcolor,
                opacity: 0
            });
            if(maskDivClass){
                maskDiv.addClass(maskDivClass);
            }
            if(msg){
                var msgDiv=$('<div style="position:absolute;border:#6593cf 1px solid; padding:2px;background:#ccca"><div style="line-height:24px;border:#a3bad9 1px solid;background:white;padding:2px 10px 2px 10px">'+msg+'</div></div>');
                msgDiv.appendTo(maskDiv);
                var widthspace=(maskDiv.width()-msgDiv.width());
                var heightspace=(maskDiv.height()-msgDiv.height());
                //alert(heightspace/2-2);
                msgDiv.css({
                            cursor:'wait',
                            bottom:(300),
                            left:(widthspace/2-2)
                  });
              }
              maskDiv.fadeIn('fast', function(){
                // 淡入淡出效果
                $(this).fadeTo('slow', op.opacity);
            });
            return maskDiv;
        },
     unmask: function(){
                 var original=$(document.body);
                     if(this[0] && this[0]!==window.document){
                        original=$(this[0]);
                  }
                  original.find("> div.maskdivgen").fadeOut('slow',0,function(){
                      $(this).remove();
                  });
        }
    });
});

var openWin = {
	title : "选择片区",
	width : "400",
	height : "400",
	modal : true
};
/**
 * 选择片区
 * @param id 存放区域Id
 * @param name 存放区域名称 
 */
function areaChose(id, name) {
	openWin.title='选择片区';
	openWin.width='400';
	openWin.height='400';
	$("#commOrgTree").show();
    rdcp.tree("commOrgTree", "!comm/~query/Q_LOAD_COMM_ORG_TREE", {
        onSelect: function (node) {
        	//TODO horgId:表单中存放片区id的隐藏域 orgName:片区名
            $("#"+id).val(node.id);
            $("#"+name).val(node.text);
            $("#commOrgTree").dialog("close");
        }
    });
    $("#commOrgTree").dialog(openWin);
    document.getElementById("commOrgTree").style.overflow = "auto";
} 


