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
rdcp.mobileUpload=function(p){
    var settings= $.extend({},mobileUploadDefault,p);
    settings.upload(settings);
}