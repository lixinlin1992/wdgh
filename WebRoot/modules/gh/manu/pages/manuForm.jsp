<%@ page language="java" import="com.sunrise.framework.core.LoginUserSession" pageEncoding="UTF-8" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
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
    <title>提交稿件</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <link href="themes/default/css/index.css" rel="stylesheet" type="text/css">
    <link href="themes/default/css/sunrise.css" rel="stylesheet" type="text/css">
    <link href="themes/brisk_orange/css/commonbtn.css" rel="stylesheet" type="text/css">
    <script type="text/javascript" src="!comm/~/scripts/getParamsFromPaCode.js"></script>
    <script type="text/javascript" src="scripts/editor/kindeditor.js"></script>
    <link href="!service/file/~/css/editfile.css" rel="stylesheet" type="text/css"/>
    <%
        String option = request.getParameter("option");
        String manu_id = request.getParameter("manu_id");
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
                <form id="manuForm" name="manuForm">
                    <textarea style="display:none;" id="content" name="content"></textarea>
                    <textarea style="display:none" id="content_text" name="content_text"></textarea>
                    <input type="hidden" id="manu_id" name="manu_id"/>
                    <table border="0">
                        <tr>
                            <td class="SR_searchTitle" style="width: 80px;">标题: </td>
                            <td  style="width: 180px;">
                                <input type="text" name="company" id="company" class="SR_pureInput"/>
                            </td>
                            <td class="SR_searchTitle" style="width: 80px;">作者一: </td>
                            <td  style="width: 180px;">
                                <input type="text" name="author_one" id="author_one" class="SR_pureInput"/>
                            </td>
                            <td class="SR_searchTitle" style="width: 80px;">作者二: </td>
                            <td  style="width: 180px;">
                                <input type="text" name="author_two" id="author_two" class="SR_pureInput"/>
                            </td>
                            <td class="SR_searchTitle" style="width: 80px;">作者三: </td>
                            <td  style="width: 180px;">
                                <input type="text" name="author_three" id="author_three" class="SR_pureInput"/>
                            </td>
                        </tr>
<!--                        <tr>
                            <td class="SR_searchTitle" style="width: 100px;">作者三:</td>
                            <td  style="width: 300px;">
                                <input type="text" name="author_three" id="author_three" class="SR_pureInput"/>
                            </td>
                            <td class="SR_searchTitle" style="width: 100px;">备注:</td>
                            <td  style="width: 300px;">
                                <textarea id="remarks" name="remarks" rows="5" cols="30"></textarea>
                            </td>
                        </tr>-->
                    </table>
                </form>
            </div>
        </div>
    </div>
    <div class="SR_moduleBox">
        <div class="SR_moduleTitle">首页图片</div>
    </div>
    <div align="center">
        <div class="SR_searchTableBox">
            <div id="uploadDlg">
                <div id="uploader"></div>
                <input type="hidden" id="fileUrl"/>
            </div>
        </div>
    </div>
    <div class="SR_moduleBox">
        <div class="SR_moduleTitle">信息内容</div>
        <div class="SR_moduleRight">
        </div>
    </div>
    <div id="myEditor"></div>
    <textarea id="editor_id" name="body" style="width:700px;height:300px;"></textarea>
    <div class="SR_moduleBox">
        <div class="SR_moduleTitle">附件列表</div>
    </div>
    <div align="center">
        <div class="SR_searchTableBox">
            <div id="uploadDlg2">
                <div id="uploader2"></div>
                <input type="hidden" id="fileUrl2"/>
            </div>
        </div>
    </div>
</div>
<div>
    <div class="floatSmallBtn" style="width: 500px;" align="center">
        <a class="btn_commit" href="javascript:void(0);"
           onclick="sureBtn();" title="">提交</a>
        <a class="btn_cancel" href="javascript:void(0);"
           onclick="cancel()" title="">取消</a>
    </div>
</div>
<!--style给定宽度可以影响编辑器的最终宽度-->
</body>
<script type="text/javascript">
    //获取操作类型 add or edit
    var option = "<%=option%>";
    //获取history_id
    var manu_id = "<%=manu_id%>";
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
        getParamsByPaCode("type", "BI_MANU", "TYPE", function () {
            if (option == "add") {
                rdcp.request("!gh/info/~query/Q_GET_INFO_ID",{"seq":"bi_manu_seq"},function(data){
                    manu_id = data.body.seq;
                    $("#manu_id").val(manu_id);
                    initUpload();
                });
            }
            else if (option == "edit") {
                //如果option为edit，则加载表单
                rdcp.form.load("manuForm", "!gh/manu/~query/Q_GET_MANU_INFO", 'manu_id=' + manu_id, function (data) {
                    editor.insertHtml(data.body.content);
                    initUpload();
                    if (data.body.file_ids != "") {
                        //加载首页图片
                        loadFiles(data.body.file_ids, data.body.file_names, "index_img");
                    }
                    if(data.body.attach_ids != ""){
                        //加载附件列表
                        loadFiles(data.body.attach_ids, data.body.attach_names,"attach");
                    }
                });
            }
        });

    });
    //提交方法
    function sureBtn() {
        //获取编辑器内容
        var company = $("#company").val();
        var author_one = $("#author_one").val();
        var content = editor.html();
        var text = editor.text();
        $("#content_text").val(text);
        $("#content").val(content);
        if (company == "" || company == null) {
            $.messager.alert('提示', '请输入标题！', 'info');
            return false;
        }
        if (author_one == "" || author_one == null){
            $.messager.alert('提示', '请填写作者一！', 'info');
            return false;
        }
        if (content == "" || content == null) {
            $.messager.alert('提示', '请编辑稿件内容！', 'info');
            return false;
        }
        if (option == "add") {
            rdcp.form.submit("manuForm", {
                url: "!gh/manu/~query/Q_ADD_MANU",
                success: function (data) {
                    $.messager.alert('提示', '稿件信息发布成功！', 'info',function () {
                        parent.refreshGrid();
                        cancel();
                    });
                }
            }, {"mask": true});
        }
        else if (option == "edit"){
            $("#manu_id").val(manu_id);
            rdcp.form.submit("manuForm", {
                url: "!gh/manu/~query/Q_UPDATE_MANU" ,
                success: function (data) {
                    $.messager.alert('提示', '稿件信息修改成功！', 'info',function () {
                        parent.refreshGrid();
                        cancel();
                    });
                }
            }, {"mask": true});
        }
    }
    function cancel()
    {
        if (option == "add") {
            CloseTab("addManu", "发布信息");
        }
        else if (option == "edit"){
            CloseTab("editManu", "修改信息");
        }

    }
    function initUpload(){
        rdcp.uploader("uploader", {busiId: manu_id, busiType: "BI_MANU"}, {
            onSuccess: function (file) {
            }
        });
        rdcp.uploader("uploader2", {busiId: manu_id, busiType: "BI_MANU_ATTACH"}, {
            onSuccess: function (file) {
            }
        });
    }
    function loadFiles(file_ids,file_names,type){
        var ids = file_ids.split(",");
        var names = file_names.split(",");
        for(var i=0;i<ids.length;i++){
            var html = "<li id='file_"+ids[i]+"' class='SR_uploadFileBox'><div class='SR_uploadFileBoxBtn'>" +
                    "<div class='SR_imgName'><h2>"+names[i]+"</h2></div><input class='SR_uploaderDel' type='button' onclick=\"publicDelFile('"+ids[i]+"')\"></div><div class='SR_uploadImg'>";
            if(type == "index_img") {
                html += "<img src='!service/file/~java/Downloader.get?type=thumb&id=" + ids[i] + "'/></div></li>";
                $("#uploader").find(".SR_uploadFileList ul").append(html);
            }
            else if(type == "attach") {
                html += "<img src='!service/file/~/images/defaults.png'/></div></li>";
                $("#uploader2").find(".SR_uploadFileList ul").append(html);
            }
        }
    }
</script>
</html>
