/**
 * Created by lh on 2014/10/10.
 * 区域选择公用，选择后将区域的id和名称填充到传过来的输入框的id的输入框控件
 * @param 区域id输入框的id：id
 * @param 区域名称输入框id：name
 *
 */

/*
* 方法一：获取所有的节点包括省、市、区县
* */
function comboboxArea(id,text)
{
    $('#'+text+'').combobox(
        {
            url : '!property/base/~query/Q_COMM_AREA_COMBOBOX',
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
//                $('#'+id+'').val("");
//                $('#'+text+'').val("");

            }
        });
}

/*
* 方法二：只获取区县页节点
* */
function comboboxCounty(id,text)
{
    $('#'+text+'').combobox(
        {
            url : '!property/base/~query/Q_COMM_AREA_COMBOBOX?justCounty=yes',
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
//                $('#'+id+'').val("");
//                $('#'+text+'').val("");

            }
        });
}

/*
 * 方法三：只获取地市节点
 * */
function comboboxCity(id,text)
{
    $('#'+text+'').combobox(
        {
            url : '!property/base/~query/Q_COMM_AREA_COMBOBOX?justCity=yes',
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
//                $('#'+id+'').val("");
//                $('#'+text+'').val("");

            }
        });
}
