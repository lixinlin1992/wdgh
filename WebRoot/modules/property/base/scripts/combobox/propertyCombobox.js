/**
 * Created by lh on 2014/10/10.
 * 区域选择公用，选择后将区域的id和名称填充到传过来的输入框的id的输入框控件
 * @param 区域id输入框的id：id
 * @param 区域名称输入框id：name
 *
 */

/*
* 方法一：获取所有的未删除得基站：is_delete=1 or null
* */
function comboboxAllProperty(id,text,callback,onselect)
{
    $('#'+text+'').combobox(
        {
            url : '!property/base/~query/Q_COMM_PROPERTY_COMBOBOX',
            valueField : 'id',
            textField : 'text',
            mode : 'remote',
            onSelect : function(rec)
            {
                $('#'+id+'').val(rec.id);
                $('#'+text+'').val(rec.text);
                if(onselect!=null&&onselect!=''){
                    onselect();
                }
            },
            onLoadSuccess : function()
            {
                $('#'+id+'').val("");
                $('#'+text+'').val("");
                if(callback!=null&&callback!=''){
                    callback();
                }
            }
        });
}

/*
* 方法二：获取is_delete=1的基站
* */
function comboboxActiveProperty(id,text,callback)
{
    $('#'+text+'').combobox(
        {
            url : '!property/base/~query/Q_COMM_PROPERTY_COMBOBOX?justActive=yes',
            valueField : 'id',
            textField : 'text',
            mode : 'remote',
            onSelect : function(rec)
            {
                $('#'+id+'').val(rec.id);
                $('#'+text+'').val(rec.text);
            },
            onLoadSuccess : function()
            {
                $('#'+id+'').val("");
                $('#'+text+'').val("");
                if(callback!=null&&callback!=''){
                    callback();
                }
            }
        });
}

