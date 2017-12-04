function $$(element){
 if(arguments.length>1){
  for(var i=0,length=arguments.length,elements=[];i<length;i++){
   elements.push($$(arguments[i]));
  }
  return elements;
 }
 if(typeof element=="string"){
  return document.getElementById(element);
 }else{
  return element;
 }
}
var Class={
 create:function(){
  return function(){
   this.initialize.apply(this,arguments);
  }
 }
}
Function.prototype.bind=function(object){
 var method=this;
 return function(){
  method.apply(object,arguments);
 }
}
var Scroll=Class.create();
Scroll.prototype={
 initialize:function(element,height){
  this.element=$$(element);
  this.element.innerHTML+=this.element.innerHTML;
  this.height=height;
  this.maxHeight=this.element.scrollHeight/2;
  this.counter=0;
  this.scroll();
  this.timer="";
  this.element.onmouseover=this.stop.bind(this);
  this.element.onmouseout=function(){this.timer=setTimeout(this.scroll.bind(this),1000);}.bind(this);
 },
 scroll:function(){
  if(this.element.scrollTop<this.maxHeight){
   this.element.scrollTop++;
   this.counter++;
  }else{
   this.element.scrollTop=0;
   this.counter=0;
  }
  
  if(this.counter<this.height){
   this.timer=setTimeout(this.scroll.bind(this),22);
  }else{
   this.counter=0;
   this.timer=setTimeout(this.scroll.bind(this),3126);
  }
 },
 stop:function(){
  clearTimeout(this.timer);
 }
}
var myscroll=new Scroll("myscroll",25);