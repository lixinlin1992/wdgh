/**
 * Created by 123 on 2015/7/16.
 */

var SHAKE_THRESHOLD = 3000;
var last_update = 0;
var x = y = z = last_x = last_y = last_z = 0;

/**
 * 判断单选按钮是否选中
 * @param id 按钮ID
 */
function isSelect(id){
    if($("#"+id).hasClass("com_selectbtnon"))
        return;
    $("#"+id).parent().parent().find("a").removeClass("com_selectbtnon");
    $("#"+id).addClass("com_selectbtnon");
}
/**
 * 复选框是否选中
 * @param id 按钮ID
 */
function isCheck(id) {
    if ($("#"+id).hasClass('com_selectbtnon')) {
        $("#"+id).removeClass("com_selectbtnon");
    } else {
        $("#"+id).addClass("com_selectbtnon");
    }
}

function ysb_alert(title, message) {
    if (message == undefined) {
        message = title;
        title = "提示";
    }
    $("body").attr("style", "overflow-y:hidden");
    $("#alertTitle").text(title);
    $("#alertMessage").text(message);
    $("#shadeDiv").show("normal");
    $("#alertDiv").show("normal");
}

function ysb_unalert() {
    $("body").removeAttr("style");
    $("#shadeDiv").css("display", "none");
    $("#alertDiv").css("display", "none");
}

//添加摇一摇事件
function addDeviceMotion(fn) {
    if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', deviceMotionHandler, false);
        fn(true);
    } else {
        fn(false);
    }
}

//删除摇一摇事件
function removeDeviceMotion() {
    window.removeEventListener("devicemotion", deviceMotionHandler, false);
}

function deviceMotionHandler(eventData) {
    var acceleration = eventData.accelerationIncludingGravity;
    var curTime = new Date().getTime();
    if ((curTime - last_update) > 100) {
        var diffTime = curTime - last_update;
        last_update = curTime;
        x = acceleration.x;
        y = acceleration.y;
        z = acceleration.z;
        var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;
        if (speed > SHAKE_THRESHOLD) {
            //执行回调函数
            if(onDeviceMotion)
                onDeviceMotion();
        }
        last_x = x;
        last_y = y;
        last_z = z;
    }
}
