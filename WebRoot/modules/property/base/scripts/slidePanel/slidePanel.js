var slideDefault={
  success:null
};
/**
 * 开启滑动框函数
 * @param id 滑出框id
 * @param url 嵌入页面地址
 */
var slidePanel=function(id,url,p){
    var settings = rdcp.extend({},slideDefault, p);

    var panel=$('.sys_slidePanel');
    var _div=$("#"+id);
    for(var i=0;i<panel.length;i++){
        if($(panel[i]).attr('isOpen')=='true'&&id!=panel[i].id){
            $(function(){_closeSlidePanel(panel[i].id);});
        }
    }
    rdcp.mask($(document.body));
    if(url==undefined||url==null||url==""){
        if(_div.attr('href')==undefined||_div.attr('href')==""){
            _openSlidePanel(id);
            if(settings.success){
                settings.success();
            }
        }
        else{
            _div.load(_div.attr('href'),"",function(){
                _openSlidePanel(id);
                _div.attr('openType','url'); //打开类型为链接型 为关闭的时候清空数据
                $.parser.parse("#"+id);
                if(settings.success){
                    settings.success();
                }

            });
        }

    }
    else{
        _div.load(url,"",function(){
            _openSlidePanel(id);
            _div.attr('openType','url'); //打开类型为链接型 为关闭的时候清空数据
            $.parser.parse("#"+id);
            if(settings.success){
                settings.success();
            }
        });
    }
}
/**
 * 关闭函数
 */
var closeSlidePanel=function(){
    var panel=$('.sys_slidePanel');
    for(var i=0;i<panel.length;i++){
        if($(panel[i]).attr('isOpen')=='true'){
            $(function(){_closeSlidePanel(panel[i].id);});
        }
    }
}
var _openSlidePanel=function(id){
    var _div=$('#'+id);
    var _width=_div.width();
//    _div.attr("style","display:block;");
    if(_width>960){
        _width=960;
        _div.width(_width);
    }
    if(_div.attr('isOpen')!='true'){
        _div.css({'background':'#f5f5f5','border':'1px solid #eeeeee','overflow': 'auto','position': 'absolute','background':'white','width':_width,'top':'0px','right':-_width,'z-index':2000,'position':'absolute','height':'100%'});
        _div.append("<div style='position: absolute;z-index: 9999;left: -8px;top: -8px;width: 16px;height: 16px;'>"+
            "<a  href='javascript:void(0);' onclick=\"_closeSlidePanel('"+id+"')\"></a></div>");
        _div.show();
        _div.addClass('sys_slidePanel');
        _div.attr('isOpen','true');
        _div.animate({right:0});
    }
}
var _closeSlidePanel=function (id){
    var _div=$('#'+id);
    var _width=_div.width();

    _div.attr('isOpen','false');
    if(_div.attr('openType')=='url'){
        _div.animate({right:(_width<=0?_width:-_width)-10},function(){
            _div.empty();
            _div.attr("style","display:none;");
            rdcp.unmask($(document.body));
        }); //清空加载页面的数据
        return;
    }
    _div.animate({right:(_width<=0?_width:-_width)-10},function(){
        _div.attr("style","display:none;");
        rdcp.unmask($(document.body));
    });

};
var slideP={};
slideP.open=function(id,url,p){
    slidePanel(id,url,p);
}
slideP.close=function(p){
    closeSlidePanel();
}