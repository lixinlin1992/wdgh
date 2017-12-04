/**
 * [图片自适应]
 * @param  {[type]} obj  [object]
 * @param  {[type]} size [width,height]
 * @param  {[type]} bl   [bool]
 */
function reset_pic(obj, size,bl) {
    if(size = 'auto') {
      var dW = obj.parentNode.offsetWidth;
      var dH = obj.parentNode.offsetHeight
    }else {
      size = size.split(',');
      var dW = size[0];
      var dH = size[1];
    }
    var img = new Image();
    img.src = obj.src;
    if(img.width/img.height >= dW/dH) {
        if(img.width > dW) {
            obj.width = dW;
            obj.height = img.height*dW/img.width;
        }else {
            obj.width = img.width;
            obj.height = img.height > dH ? img.height*img.width/dW : img.height;
        }
    }else {
        if(img.height > dH) {
            obj.height = dH;
            obj.width = img.width*dH/img.height;
        }else {
            obj.height = img.height;
            obj.width = img.width > dW ? img.height*img.width/dH : img.width;
        }
    }
 
     if(obj.currentStyle)
    {
      //return obj.currentStyle[name];
      obj.style.marginTop = (dH-parseInt(obj.currentStyle['height']))/2+'px';
    }
    else
    {
      obj.style.marginTop = (dH-obj.height)/2+'px';
    }
  if(bl)
  {
    obj.style.marginLeft = 0;
  }else
  {
    if(obj.currentStyle)
    {
      //return obj.currentStyle[name];
      obj.style.marginLeft = (dW-parseInt(obj.currentStyle['width']))/2+'px';
    }
    else
    {
      obj.style.marginLeft = (dW-obj.width)/2+'px';
    }
  }
 
}





