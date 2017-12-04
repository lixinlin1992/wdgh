<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%
    String path = request.getContextPath();
    String port = (request.getServerPort() == 80 || request.getServerPort() == 443) ? "" : ":" + String.valueOf(request.getServerPort());
    String basePath = request.getScheme() + "://" + request.getServerName() + port + path + "/";
    String curUserName = LoginUserSession.getLoginUserInfo() == null ? "null" : LoginUserSession.getLoginUserInfo().getName();
    request.setAttribute("_basePath", basePath);
    request.setAttribute("_curUserId", curUserName);
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <base href="${_basePath}"/>
    <r:include resource="!rdcp/pages/listBase.jsp"/>
    <script type="text/javascript" src="!rdcp/script/src/rdcp.js"></script>
    <script type="text/javascript" src="!rdcp/script/lib/jquery/jquery-1.8.0.min.js"></script>
    <link href="!service/file/~/css/editfile.css" rel="stylesheet" type="text/css">
    <title>历史文化</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <link href="themes/default/css/index.css" rel="stylesheet" type="text/css">
    <link href="themes/default/css/sunrise.css" rel="stylesheet" type="text/css">
    <link href="themes/brisk_orange/css/commonbtn.css" rel="stylesheet" type="text/css">
    <script type="text/javascript" src="!comm/~/scripts/getParamsFromPaCode.js"></script>
    <script type="text/javascript" src="scripts/editor/kindeditor.js"></script>
    <link href="!service/file/~/css/editfile.css" rel="stylesheet" type="text/css"/>
    <%
        String option = request.getParameter("option");
        String id = request.getParameter("id");
    %>
</head>
<body style="background:#f4f4f4;">
<div class="SR_Space">
    <div class="SR_moduleBox">
        <div class="SR_moduleTitle">基础信息</div>
    </div>
    <div align="center">
        <!-- 搜索标头开始-->
        <div class="SR_searchTableBox">
            <div class="barquerycontent">
                <form id="schoolCultureForm" name="schoolCultureForm">
                    <textarea style="display:none;" id="content" name="content"></textarea>
                    <table border="0">
                        <tr>
                            <td class="SR_searchTitle" style="width: 100px;">标题:</td>
                            <td  style="width: 300px;">
                                <input type="text" name="title" id="title" class="SR_pureInput"  style="width: 280px;"/>
                            </td>
                            <td class="SR_searchTitle" style="width: 100px;">信息类别:</td>
                            <td>
                                <select id="type" name="type">
                                    <option value="">--请选择--</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </td>
                            <td>
                                <input type="hidden" name="id" id="id"/>
                            </td>
                            <td class="SR_searchTitle" style="width: 100px;">发布日期:</td>
                            <td style="width: 300px;">
                              <input type="text" name="create_time" id="create_time"  class="easyui-datetimebox"/>

                            </td>
                        </tr>
                    </table>
                </form>
            </div>
        </div>
    </div>
    <div class="SR_moduleBox">
        <div class="SR_moduleTitle">信息内容</div>
        <div class="SR_moduleRight">
        </div>
    </div>
    <div id="myEditor"></div>
    <textarea id="editor_id" name="body" style="width:700px;height:300px;">
</textarea>
</div>
<div>
    <div class="floatSmallBtn" style="width: 500px;" align="center">
        <a class="btn_commit" href="javascript:void(0);"
           onclick="sureBtn();" title="">提交</a>
        <a class="btn_cancel" href="javascript:void(0);"
           onclick="cancel()" title="">取消</a>
    </div>
</div>
<div id="uploadDlg">
    <div id="uploader"></div>
    <input type="hidden" id="fileUrl"/>
</div>
<!--style给定宽度可以影响编辑器的最终宽度-->
</body>
<script type="text/javascript">
    //获取操作类型 add or edit
    var option = "<%=option%>";
    //获取history_id
    var id = "<%=id%>";
    //获取服务器根路径
    var serverBasePath = "<%=basePath%>";
    //定义编辑器
    var editor;
    //初始化编辑器
    KindEditor.ready(function(K) {
        //创建一个编辑器
        editor = K.create('textarea[id="editor_id"]', {
            allowFileManager : true,//是否打开文件管理功能
            allowImageRemote : false,//是否允许上传网络图片
            pasteType : 2,//粘贴类型为HTML粘贴
            height : "400",//高度
            width : "100%"//宽度
        });
    });
    //rdcp.JS初始化
    rdcp.ready(function () {
        //填充历史文化类型下拉列表getParamsByPaCode(id,code_table,code_fields,callback)
        getParamsByPaCode("type", "BI_STAFF_SERVICE", "TYPE", function () {
            if (option == "add") {
            }
            else if (option == "edit") {
                //如果option为edit，则加载表单
                rdcp.form.load("schoolCultureForm", "!gh/staffService/~query/Q_GET_STAFF_SERVICE_INFO", 'id=' + id, function (data) {
                    editor.insertHtml(data.body.content);
                });
            }
        });
    });
    //提交方法
    function sureBtn() {
        //获取编辑器内容
        var title = $("#title").val();
        var type = $("#type").val();
        var content = editor.html();
        $("#content").val(content);
        if (title == "" || title == null) {
            $.messager.alert('提示', '请输入标题！', 'info');
            return false;
        }
        if (type == "-1" || type == null){
            $.messager.alert('提示', '请选择信息类别！', 'info');
            return false;
        }
        if (content == "" || content == null) {
            $.messager.alert('提示', '请编辑内容！', 'info');
            return false;
        }
        if (option == "add") {
            rdcp.form.submit("schoolCultureForm", {
                url: "!gh/staffService/~query/Q_ADD_STAFF_SERVICE",
                success: function (data) {
                    $.messager.alert('提示', '信息发布成功！', 'info',function () {
                        cancel();
                    });
                }
            }, {"mask": true});
        }
        else if (option == "edit"){
            rdcp.form.submit("schoolCultureForm", {
                url: "!gh/staffService/~query/Q_UPDATE_STAFF_SERVICE" ,
                success: function (data) {
                    $.messager.alert('提示', '信息修改成功！', 'info',function () {
                        cancel();
                    });
                }
            }, {"mask": true});
        }
    }
    function cancel()
    {
        if (option == "add") {
            CloseTab("addInfoDiffusion", "发布教工服务信息");
        }
        else if (option == "edit"){
            CloseTab("editInfoDiffusion", "修改教工服务信息");
        }
    }
</script>
</html>
