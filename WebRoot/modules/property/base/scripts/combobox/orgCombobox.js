/**
 * Created by lh on 2014/8/28.
 * 区域选择公用，选择后将区域的id和名称填充到传过来的输入框的id的输入框控件
 * @param 区域id输入框的id：id
 * @param 区域名称输入框id：name
 *
 */
function comboboxAdminOrg(id,text,callback)
{
    $('#'+text+'').combobox(
        {
            url : '!property/base/~query/Q_COMM_ORG_COMBOBOX',
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
                callback();
            }
        });
}
