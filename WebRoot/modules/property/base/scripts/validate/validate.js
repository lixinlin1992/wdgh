/**
 * Created by lh on 2014/10/10.
 */
/**
 * 验证不能为空
 * @param id
 * @param value
 * @param flag  0-输入框, -1-下拉列表(select)
 */
function isNull(id, value, flag) {
    switch (flag) {
        case -1:
            if ($("#" + id).val() == -1) {
                if (!$("#span_" + id).is(":visible")) {
                    $("#" + id).after('<span align="right" id="span_' + id + '"><font color="red">必选！</font> </span>');
                }
                $("#" + id).focus();
                return true;
            }else{
                if ($("#span_" + id).is(":visible")) {
                    $("#span_" + id).remove();
                }
                return false;
            }
            break;
        case 1:
            if ('' == $("#" + id).combobox('getValue')) {
                if (!$("#span_" + id).is(":visible")) {
                    $("#" + id).after('<span id="span_' + id + '"><font color="red">必填！</font> </span>');
                }
                $("#" + id).focus();
                return true;
            }else{
                if ($("#span_" + id).is(":visible")) {
                    $("#span_" + id).remove();
                }
                return false;
            }
            break;
        case 2:
            if ('' == $("#" + id).datebox("getValue")) {
                if (!$("#span_" + id).is(":visible")) {
                    $("#" + id).after('<span id="span_' + id + '"><font color="red">必填！</font> </span>');
                }
                $("#" + id).focus();
                return true;
            }else{
                if ($("#span_" + id).is(":visible")) {
                    $("#span_" + id).remove();
                }
                return false;
            }
            break;
        default :
            if ($("#" + id).val() == '') {

                if (!$("#span_" + id).is(":visible")) {
                    $("#" + id).after('<span id="span_' + id + '"><font color="red">必填！</font> </span>');
                }
                //$("#" + id).focus();
                return true;
            }else{
                if ($("#span_" + id).is(":visible")) {
                    $("#span_" + id).remove();
                }
                return false;
            }
    }
}

function isNumber(id, value) {
    var result = $("#" + id).val().match(/^[\+\-]?\d*?\.?\d*?$/);
    if (null == result) {
        if (!$("#number_span_" + id).is(":visible")) {
            $("#" + id).after('<span id="number_span_' + id + '"><font color="red">数字！</font> </span>');
        }
//        $("#" + id).val('');
        $("#" + id).focus();
        return true;
    }else{
        if ($("#number_span_" + id).is(":visible")) {
            $("#number_span_" + id).remove();
        }
        return false;//是数字
    }
}

function lessNum(id,value) {
	var result = $("#" + id).val().match(/^[\+\-]?\d*?\.?\d*?$/);
    if (null == result) {
        if (!$("#number_span_" + id).is(":visible")) {
            $("#" + id).after('<span id="number_span_' + id + '"><font color="red">数字！</font> </span>');
        }
//        $("#" + id).val('');
        $("#" + id).focus();
        return true;
    }else{
    	if (parseFloat($("#" + id).val()) > parseFloat(value) ){
    		if (!$("#number_span_" + id).is(":visible")) {
                $("#" + id).after('<span id="number_span_' + id + '"><font color="red">不能大于电表最大读数：'+value+'</font> </span>');
            }
    		return true;
    	} else  if ($("#number_span_" + id).is(":visible")) {
            $("#number_span_" + id).remove();
            return false;//是数字
        }
    }
}