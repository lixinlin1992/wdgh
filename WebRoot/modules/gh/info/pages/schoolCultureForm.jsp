<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<%@ page import="com.sunrise.framework.core.LoginUserSession" %>
<%
    String path = request.getContextPath() + "/";
    String port = (request.getServerPort() == 80 || request.getServerPort() == 443) ? "" : ":" + String.valueOf(request.getServerPort());
    String basePath = request.getScheme() + "://" + request.getServerName() + port + path.replace("//","");
    String curUserName = LoginUserSession.getLoginUserInfo() == null ? "null" : LoginUserSession.getLoginUserInfo().getName();
    request.setAttribute("_basePath", basePath);
    request.setAttribute("_curUserId", curUserName);
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <base href="${_basePath}"/>
    <r:include resource="!rdcp/pages/listBase.jsp"/>
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
        String culture_id = request.getParameter("culture_id");
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
                                <select id="type" name="type" onchange="changeType()">
                                    <option value="">--请选择--</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="3">4</option>
                                    <option value="3">5</option>
                                </select>
                            </td>
                            <td>
                                <input type="hidden" name="culture_id" id="culture_id"/>
                            </td>
                            <td class="SR_searchTitle" style="width: 100px;">发布日期:</td>
                            <td style="width: 300px;">
                                 <input type="text" name="create_time" id="create_time"  class="easyui-datetimebox"/>

                            </td>
                        </tr>
                        <tr id="movie_tr1" style="display:none;">
                            <td class="SR_searchTitle" style="width: 100px;">电影类型:</td>
                            <td><input type="text" name="movie_type" id="movie_type" class="SR_pureInput"/></td>
                            <td class="SR_searchTitle" style="width: 100px;">播放时间:</td>
                            <td><input type="text" name="play_time" id="play_time"  class="easyui-datetimebox"/></td>
                        </tr>
                        <tr id="movie_tr2" style="display:none;">
                            <td class="SR_searchTitle" style="width: 100px;">播放地点:</td>
                            <td><input type="text" name="play_place" id="play_place" class="SR_pureInput"/></td>
                            <%--<td>--%>
                                <%--<select>--%>
                                    <%--<option>梅园小操场</option>--%>
                                    <%--<option>小礼堂</option>--%>
                                <%--</select>--%>
                            <%--</td>--%>
                            <td class="SR_searchTitle" style="width: 100px;">演员:</td>
                            <td><input type="text" name="actors" id="actors" class="SR_pureInput"/></td>
                        </tr>
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
    <div>
        <div class="SR_moduleBox">
            <div class="SR_moduleTitle">信息内容</div>
            <div class="SR_moduleRight">
            </div>
        </div>
        <div id="myEditor"></div>
        <textarea id="editor_id" name="body" style="width:700px;height:300px;"></textarea>
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
    var culture_id = "<%=culture_id%>";
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
        getParamsByPaCode("type", "BI_SCHOOL_CULTURE", "TYPE", function () {
            if (option == "add") {
              rdcp.request("!gh/info/~query/Q_GET_INFO_ID",{"seq":"bi_gh_info_seq"},function(data){
                culture_id = data.body.seq;
                $("#culture_id").val(culture_id);
                initUpload();
              });
            }
            else if (option == "edit") {
                //如果option为edit，则加载表单
                rdcp.form.load("schoolCultureForm", "!gh/info/~query/Q_GET_SCHOOL_CULTURE_INFO", 'culture_id=' + culture_id, function (data) {
                    changeType();
                    editor.insertHtml(data.body.content);
                    initUpload();
                    loadFiles(data.body.file_ids,data.body.file_names);
                });
            }
        });
    });
    //提交方法
    function sureBtn() {
        //获取编辑器内容
        var title = $("#title").val();
        var type = $("#type").val();
        var movie_type = $("#movie_type").val();
        var play_time = $("#play_time").val();
        var play_place = $("#play_place").val();
        var actors = $("#actors").val();
        var content = editor.html();
        $("#content").val(content);
        if (title == "" || title == null) {
            $.messager.alert('提示', '请输入信息标题！', 'info');
            return false;
        }
        if (type == "" || type == null){
            $.messager.alert('提示', '请选择信息类别！', 'info');
            return false;
        }
        if(type=="4"){
            if(movie_type==""||movie_type==null){
                $.messager.alert('提示', '请填写电影类型！', 'info');
                return false;
            }
            if(play_place==""||play_place==null){
                $.messager.alert('提示', '请填写播放地点！', 'info');
                return false;
            }
            if(actors==""||actors==null){
                $.messager.alert('提示', '请填写参演演员！', 'info');
                return false;
            }
        }
        if(content == "" || content == null){
            $.messager.alert('提示', '请编辑信息内容！', 'info');
            return false;
        }
        if (option == "add") {
            rdcp.form.submit("schoolCultureForm", {
                url: "!gh/info/~query/Q_ADD_SCHOOL_CULTURE",
                success: function (data) {
                    $.messager.alert('提示', '信息发布成功！', 'info',function () {
                        cancel();
                    });
                }
            }, {"mask": true});
        }
        else if (option == "edit"){
            $("#culture_id").val(culture_id);
            rdcp.form.submit("schoolCultureForm", {
                url: "!gh/info/~query/Q_UPDATE_SCHOOL_CULTURE" ,
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
            CloseTab("addSchoolCulture", "发布信息");
        }
        else if (option == "edit"){
            CloseTab("editSchoolCulture", "修改信息");
        }

    }
    function changeType() {
        var type = $("#type").val();
        if(type=="4"){  //电影消息
            $("#movie_tr1").show();
            $("#movie_tr2").show();
        }
        else{
            $("#movie_tr1").hide();
            $("#movie_tr2").hide();
       }
    }
    function initUpload(){
      rdcp.uploader("uploader", {busiId: culture_id, busiType: "BI_SCHOOL_CULTURE"}, {
          onSuccess: function (file) {
          }
      });
    }
    function loadFiles(file_ids,file_names){
      if(file_ids!=""){
          var ids = file_ids.split(",");
          var names = file_names.split(",");
          for(var i=0;i<ids.length;i++){
            var html = "<li id='file_"+ids[i]+"' class='SR_uploadFileBox'><div class='SR_uploadFileBoxBtn'>" +
            "<div class='SR_imgName'><h2>"+names[i]+"</h2></div><input class='SR_uploaderDel' type='button' onclick=\"publicDelFile('"+ids[i]+"')\"></div><div class='SR_uploadImg'>" +
            "<img src='!service/file/~java/Downloader.get?type=thumb&id="+ids[i]+"'/></div></li>";
            $("#uploader").find(".SR_uploadFileList ul").append(html);
          }
      }
    }
    function publicDelFile(id) {
        if (confirm("确定要删除文件吗？"))
        rdcp.request("!service/file/~java/Uploader.del?id=" + id, {}, function () {
            $("#file_" + id).remove();
        });
    }
</script>
</html>
