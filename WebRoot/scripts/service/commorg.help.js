/**
 * Created by IntelliJ IDEA.
 * User: kinz
 * Date: 11-4-14
 * Time: 上午11:01
 * 提供公用组织机构的一些功能接口
 */

/**
 * 选择组织机构节点
 * @param name 名称
 * @param options
 * select : 选中后触发的事件
 * multi : 是否多选
 * rootId : 根节点ID
 */
function selectCommOrg(name,options){
    return buildSelectTree("DS_COMMORG_TREE",name,options);
}