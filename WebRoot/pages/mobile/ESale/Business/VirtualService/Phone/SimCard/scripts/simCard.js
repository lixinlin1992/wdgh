function InsertIDCard(obj) {

    var result = {};
    result.name = obj.name;	//姓名
    result.sex = obj.gender ? (obj.gender == '男' ? '1' : '2') : "1";	//性别
    result.nation = "汉";	//民族
    result.address = obj.paper_addr ? obj.paper_addr : ' ';	//地址
    result.cardNo = obj.paper_num ? obj.paper_num : ' ';	//身份号码
    result.issuedAt = obj.str_office ? obj.str_office : '无';	//签发机关
    result.effectedDate = obj.paper_stime ? obj.paper_stime.replace(/-/g, '') : ' ';	//开始时间
    result.expiredDate = obj.paper_time ? obj.paper_time.replace(/-/g, '') : ' ';	//终止有效期
    result.CardReaderId = '0000000000';
    $.ajax({
        type: "get",
        url: APP_CONFIG.SERVER_URL+ "!ESale/System/IDCard/~java/IDCardINFO.InsertIDCard?data=" +
        encodeURIComponent(JSON.stringify(result)),
        //data:result,
        success: function (data) {
            //alert(data);

            data = eval("(" + data + ")");
            if (data.header.code == 0) {
                //alert(data);
                result.ID = data.body.ID;
            } else {
                AlertDialog('提示', '储存身份证信息失败');
            }
        },
        async: false
    });

    return result.ID;
}
function OnUploadBegin() {
    $("#upload_text").empty().append("图片正在上传，请耐心等待...");
}
//使用系统自带的照相功能上传图片
function takePhoto(type) {
    $('#progressBar').css("width", "0%").empty().append('0%');
    TakePhoneUpload("{'busiId':'Account','busiType':'APP','size':1000,'_param':'" + type + "'}", 'print');
}
//回调
function OnUploadFinish(result) {
    if (result) {
        result = $.parseJSON(result)[0];
        if (result.id) {
            $('#progressBar').css("width", "100%").empty().append('100%');
            imgData[result._param] = result.id;
            $("#new_img_" + result._param).parent().css("background", "url('" + APP_CONFIG.SERVER_URL+ result.thumbURL + "')");
        }
        $("#upload_text").empty().append("图片上传成功");
    } else {
        $("#upload_text").empty().append("图片上传失败!请重新上传...");
    }

}
function ocr(obj) {
    if (imgData.front && imgData.contrary)
        Base.OCR(imgData.front, imgData.contrary, obj);//自动识别
    else {
        $(obj).button('reset');
        AlertDialog('提示', '请上传身份证正反面');
    }

}

function sendMessage(devId, creatorName) {
    Base.sendMessage(devId, creatorName + "的订单已经生成,请注意接收查看", function (result) {
        if (result) {

        } else {
            //alert(result);
        }
    });
}

function changeUploadByTerminal() {
    //如果是iphone 则使用js上传的功能
    if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
        $('#new_img_front').hide().prevAll().show();
        $('#new_img_contrary').hide().prevAll().show();
        $('#new_img_hand').hide().prevAll().show();
        $('#new_img_writeCard').hide().prevAll().show();
    }
}
changeUploadByTerminal();