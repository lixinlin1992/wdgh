<%@ page language="java" import="com.sunrise.framework.core.LoginUserSession" pageEncoding="UTF-8" %>
<%@ page import="com.sunrise.framework.var.Var" %>
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
                    <textarea style="display:none;" id="content_text" name="content_text"></textarea>
                    <input type="hidden" id="manu_id" name="manu_id"/>
                    <table border="0">
                        <table>
                        <tr>
                            <td class="SR_searchTitle" style="width: 80px;">标题: </td>
                            <td>
                                <input type="text" name="company" id="company" class="SR_pureInput" style="width: 400px;"/>
                            </td>
                        </tr>
                        </table>
                        <table>
                        <tr>
                            <td class="SR_searchTitle" style="width: 80px;">作者一: </td>
                            <td class="SR_searchTitle" style="width: 80px;">工号: </td>
                            <td>
                                <input type="text" name="author_one_account" id="author_one_account" class="SR_pureInput" onChange="accountToName1(this.id)"/>
                            </td>
                            <td class="SR_searchTitle" style="width: 80px;">姓名: </td>
                            <td>
                                <input type="text" name="author_one" id="author_one" class="SR_pureInput"/>
                            </td>
                        </tr>
                        <tr>
                            <td class="SR_searchTitle" style="width: 80px;">作者二: </td>
                            <td class="SR_searchTitle" style="width: 80px;">工号: </td>
                            <td>
                                <input type="text" name="author_two_account" id="author_two_account" class="SR_pureInput" style="width: 150px;" onChange="accountToName2(this.id)"/>
                            </td>
                            <td class="SR_searchTitle" style="width: 80px;">姓名: </td>
                            <td>
                                <input type="text" name="author_two" id="author_two" class="SR_pureInput" style="width:150px"/>
                            </td>
                        </tr>
                        <tr>
                            <td class="SR_searchTitle" style="width: 80px;">作者三: </td>
                            <td class="SR_searchTitle" style="width: 80px;">工号: </td>
                            <td>
                                <input type="text" name="author_three_account" id="author_three_account" class="SR_pureInput" style="width: 150px;" onChange="accountToName3(this.id)"/>
                            </td>
                            <td class="SR_searchTitle" style="width: 80px;">姓名: </td>
                            <td>
                                <input type="text" name="author_three" id="author_three" class="SR_pureInput" style="width:150px"/>
                            </td>
                        </tr>
                        </table>
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
           onclick="examineManu(manu_id)" title="">审核</a>
        <a class="btn_cancel" href="javascript:void(0);"
           onclick="cancel()" title="">取消</a>

    </div>
</div>

<div id="dialog" style="display: none;padding:0px !important;">
    <div class="SR_Space">
        <div class="SR_inputTable">
            <div class="SR_inputTableContent">
                <form name="examineManuForm" id="examineManuForm" onsubmit="return false;">
                    <table>
                        <tr>
                            <td class="SR_inputTitle">
                                审核结果：
                            </td>
                            <td>
                                <select name="state" class="SR_pureInput" id="state"
                                        style="width: 180px;" onchange="changeType()">
                                    <option value="0">
                                        --请选择--
                                    </option>
                                    <option value="1">
                                        通过审核
                                    </option>
                                    <option value="2">
                                        未通过审核
                                    </option>
                                </select>
                            </td>
                            <input type="hidden" name="manu_id2" id="manu_id2">
                        </tr>
                        <tr  id="comment" name="comment">
                            <td class="SR_inputTitle">
                                审核意见：
                            </td>
                            <td>
                                <textarea id="remarks" name="remarks" style="width: 240px;height:45px"></textarea>
                            </td>&nbsp;
                        </tr>
                    </table>
                </form>
            </div>
        </div>
    </div>

</div>
<input type="hidden" id="CUR_USER_ID"  name="CUR_USER_ID"  value="<%=Var.get("RU.CUR_USER.id")%>" >
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
    //根据工号获取作者姓名
    function accountToName1(author_one_account) {
        var gonghao = document.getElementById("author_one_account").value;
        rdcp.request("!gh/manu/~query/Q_ACCOUNT_TO_NAME", 'author_one_account=' + gonghao, function (data) {
            author_one = data.body.author_one;
            $("#author_one").val(author_one);
        });
    }

    function accountToName2(author_two_account) {
        var gongh= document.getElementById("author_two_account").value;
        rdcp.request("!gh/manu/~query/Q_ACCOUNT_TO_NAME2", 'author_two_account=' + gongh, function (data) {
            author_two = data.body.author_two;
            $("#author_two").val(author_two);
        });
    }

    function accountToName3(author_three_account) {
        var ghao= document.getElementById("author_three_account").value;
        rdcp.request("!gh/manu/~query/Q_ACCOUNT_TO_NAME3", 'author_three_account=' + ghao, function (data) {
            author_three= data.body.author_three;
            $("#author_three").val(author_three);
        });
    }

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
        var author_one= $("#author_one").val();
        var author_two= $("#author_two").val();
        var author_three= $("#author_three").val();
        var author_one_account= $("#author_one_account").val();
        var author_two_account= $("#author_two_account").val();
        var author_three_account= $("#author_three_account").val();
        var content = editor.html();
        var text = editor.text();
        $("#content_text").val(text);
        $("#content").val(content);
        if (company == "" || company == null) {
            $.messager.alert('提示', '请输入标题！', 'info');
            return false;
        }
        if (author_one_account == "" || author_one_account== null){
            $.messager.alert('提示', '请填写作者一的工号！', 'info');
            return false;
        }
        if(author_one_account.length<8){
            $.messager.alert('提示','请正确填写作者一的工号！','info');
            return false;
        }
        if (content == "" || content == null) {
            $.messager.alert('提示', '请编辑稿件内容！', 'info');
            return false;
        }
        if (option == "add") {
//            rdcp.form.submit("manuForm", {
//                url: "!gh/manu/~query/Q_ADD_MANU",
//                success: function (data) {
//                    $.messager.alert('提示', '稿件信息发布成功！', 'info',function () {
//                        parent.refreshGrid();
//                        cancel();
//                    });
//                }
//            }, {"mask": true});
            var CUR_USER_ID= $("#CUR_USER_ID").val();
            rdcp.request("!gh/manu/~java/Dbjz_manu.dbjzApply",{"manu_id":manu_id,"company":company,"CUR_USER_ID":CUR_USER_ID,"content":content,"author_one":author_one,"author_two":author_two,"author_three":author_three,"content_text":text,"author_one_account":author_one_account,"author_two_account":author_two_account,"author_three_account":author_three_account},function(data){
                if(data.header.code == 0)
                {
                    $.messager.alert("提示","插入成功！","info",function () {
                        cancel();

                    });
                }
            });

        }
        else if (option == "edit"){
            $("#manu_id").val(manu_id);
            rdcp.form.submit("manuForm", {
                url: "!gh/manu/~query/Q_UPDATE_MANU" ,
                success: function (data) {
                    $.messager.alert('提示', '稿件信息修改成功！', 'info',function () {
                        parent.refreshGrid();
//                        cancel();
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

    function examineManu(manu_id) {
        $("#manu_id2").val(manu_id);
        rdcp.dialog(dlgOpts);
    }

    var dlgOpts = {
        title: "稿件审核",
        id: "dialog",
        width: "450",
        height: "200",
        parentwidth: true,
        modal: true,
        buttons: [
            {
                text: '确定',
                handler: function () {
                    var state = $("#state").val();
                    var remarks=$("#remarks").val().trim();
                    if (state == 0) {
                        $.messager.alert('提示', '请输入审核结果！', 'info');
                        return false;
                    }else if(state==4&&(remarks.length==0||remarks==null)){
                        $.messager.alert('提示', '请输入审核意见！', 'info');
                        return false;
                    }
                    rdcp.form.submit("examineManuForm", {url: "!gh/manu/~query/Q_EXAMINEMANU_2",
                        success: function (data) {
                            if (data.header.code == 0) {
                                $("#dialog").dialog("close");
                                $.messager.alert('提示', '稿件审核成功！', 'info');
                                $("#remarks").attr("value","");
                                CloseTab("editManu", "修改信息");
//                                window.location.href="!gh/manu/~/pages/manuManage.jsp";
                            } else {
                                $.messager.alert('提示', '稿件审核失败！', 'error');
                            }
                        }
                    });

                }
            },
            {
                text: '取消',
                handler: function () {
                    $("#dialog").dialog("close");
                    $("#remarks").attr("value","");
                }
            }
        ]
    };
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
    function publicDelFile(id){
        rdcp.request("!service/file/~java/Uploader.del?id="+id, {}, function () {
            $("#file_"+id).remove();
        });
    }




</script>
</html>
