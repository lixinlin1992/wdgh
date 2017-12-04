var $_id = function (id) {
    return document.getElementById(id);
};

var $_name = function (name) {
    return document.getElementsByName(name);
};


var ajax = function (p) {
    var request;
    //由于跨域访问在IE7下使用 XMLHttpRequest 方式有问题，因此不能使用。原因是微软没有修复这个BUG，而是直接禁用了
//    if (window.XMLHttpRequest) {
//        request = new XMLHttpRequest();
//    } else {
//        request = new ActiveXObject("Microsoft.XMLHTTP");
//    }
    //只有IE支持创建ActiveX控件，因此IE有一个其他浏览器没有的东西，就是ActiveXObject函数。
    try{
        request = new ActiveXObject("Microsoft.XMLHTTP");
    }catch (err){
        request = new XMLHttpRequest();
    }

    if (p.url.indexOf("?") == -1)
        p.url += "?";
    else
        p.url += "&";
    p.url += "___t="+new Date().getTime();

    p.method = p.method || "GET";
    request.open(p.method, p.url, p["sync"] ? false : true);

    //设置发送Cookie
    request.withCredentials = true;

    if (!p["sync"]) {
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200 && p["success"] != undefined) {
                p.success(request.responseText, request.readyState);
            }
        };
    }

    if (p["method"] == "GET") {
        request.send();
    } else {
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send(p["parm"]);
    }
    if (p["sync"]) {
        if (request.readyState == 4 && request.status == 200) {
            return request.responseText;
        }
        return null;
    }
};

/**
 * 往指定的DOM中加入js脚本的引用
 * @param id
 * @param src
 * @private
 */
function _appendJS(doc, id, src) {
    //alert("_appendJS: "+src);
    if (doc.getElementById(id) != undefined)
        return;

    var _script = doc.createElement("script");
    _script.setAttribute("id", id);
    _script.setAttribute("src", src);
    _script.setAttribute("type", "text/javascript");
    doc.getElementsByTagName("head")[0].appendChild(_script);
}

/**
 * 往指定的DOM中加入CSS的引用
 * @param doc
 * @param id
 * @param src
 * @private
 */
function _appendCSS(doc, id, src) {
    //alert("_appendCSS: "+src);
    if (doc.getElementById(id) != undefined)
        return;


    var _css = doc.createElement("link");
    _css.setAttribute('type', 'text/css');
    _css.setAttribute('rel', 'stylesheet');
    _css.setAttribute('href', src);
    doc.getElementsByTagName("head")[0].appendChild(_css);
//    alert("css loaded4");
}

/**
 * 往指定的DOM中追加HTML元素
 * @param doc
 * @param id
 * @param attrs
 * @param html
 * @private
 */
function _appendElement(doc, id, tag, attrs, html) {
    //alert("_appendElement");
    if (doc.getElementById(id) != undefined)
        return;

    var _ele = doc.createElement(tag);
    for (var i = 0; i < attrs.length; i++) {
        _ele.setAttribute(attrs[i]["name"], attrs[i]["value"]);
    }
    _ele.setAttribute("id", id);
    if (html != undefined)
        _ele.innerHTML = html;
    doc.body.appendChild(_ele);
}

function _insertElement(doc, id, tag, attrs, target, html) {
    //alert("_appendElement");
    if (doc.getElementById(id) != undefined)
        return;

    var _ele = doc.createElement(tag);
    for (var i = 0; i < attrs.length; i++) {
        _ele.setAttribute(attrs[i]["name"], attrs[i]["value"]);
    }
    _ele.setAttribute("id", id);
    if (html != undefined)
        _ele.innerHTML = html;
    if (target == undefined || target == null)
        target = doc.body.children(0);

    target.insertAdjacentElement("BeforeBegin", _ele);
}

//设置COOKIE值
function _SetCookies(c_name, c_value, hours, path) {
    var expires = new Date();
    expires.setTime(expires.getTime() + hours * 3600000);
    path = (path == null || path == undefined || path == "") ? "" : ";path=" + path;
    _expires = (typeof hours) == "string" ? "" : ";expires=" + expires.toUTCString();
    document.cookie = c_name + "=" + c_value + _expires + path;
}

//删除COOKIE
function _DelCookies(c_name, path) {
    var expires = new Date(0);
    path = (path == null || path == undefined || path == "") ? "" : ";path=" + path;
    document.cookie = c_name + "=" + ";expires=" + expires.toUTCString() + path;
}

/**
 * 获取Cookie
 * @param c_name
 * @returns {*}
 * @private
 */
function _GetCookie(c_name) {
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start == -1) {
        c_start = c_value.indexOf(c_name + "=");
    }
    if (c_start == -1) {
        c_value = null;
    } else {
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1) {
            c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start, c_end));
    }
    return c_value;
}

/**
 * Created by anchor on 2014/10/23.
 */
var mobileUploadDefault = {
    upload:function(p){
        this._fileSelected(p);
    },
    fileSelected:null,//选中时触发
    uploadProgress:null,//上传进度
    uploadComplete:null,//上传完成
    uploadFailed:null,//上传失败
    uploadCanceled:null,//上传取消
    _fileSelected: function (p) {
        var file = document.getElementById(p.id).files[0];
        if (file) {
            var fileSize = 0;
            if (file.size > 1024 * 1024)
                fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
            else
                fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
            p.fileName=file.name;
            p.fileSize=fileSize;
            p.fileType=file.type;
            p.file=file;
            if(this.fileSelected){
                this.fileSelected(p);
            }
            mobileUploadDefault.uploadFile(p);
        }
    },
    uploadFile: function (p) {
        var fd = new FormData();
        fd.append("fileToUpload", document.getElementById(p.id).files[0]);
        for(var i in p.form){
            fd.append(i, p.form[i]);
        }
        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress",p.uploadProgress, false);

        xhr.addEventListener("load", p.uploadComplete, false);
        xhr.addEventListener("error", p.uploadFailed, false);
        xhr.addEventListener("abort",p.uploadCanceled, false);
        xhr.open("POST", p.url);
        xhr.send(fd);
    }
}
var mobileUpload=function(p){
    var settings= $.extend({},mobileUploadDefault,p);
    settings.upload(settings);
}