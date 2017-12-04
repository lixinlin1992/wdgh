<%@ page language="java" pageEncoding="UTF-8" %>
<%@ taglib prefix="r" uri="http://www.sunrisetech.com/rdcp/" %>
<!DOCTYPE>
<html>
<title>简单上传</title>
<link href="!service/file/~/css/editfile.css" rel="stylesheet" type="text/css"/>
<head>
    <r:include resource="!rdcp/pages/listBase.jsp"/>
    <script>
        rdcp.ready(function () {

        });
        var uploadDlgOpt =
        {
            title : "上传文件",
            id : "publicUploadDlg",
            width : "550",
            height : "320",
            modal : true,
            buttons :[
                {
                    text : '确定',
                    handler : function()
                    {
                        var busiId = $("#publicBusiId").val();
                        var busiType = $("#publicBusiType").val();
                        var divId = $("#publicDivId").val();
                        publicShowFiles(busiId,busiType,divId);
                        $("#publicUploadDlg").dialog("close");
                    }
                },
                {
                    text : '返回',
                    handler : function()
                    {
                        $("#publicUploadDlg").dialog("close");
                    }
                }]
        };
        function publicUploadFile(busiId,busiType,divId){
            $("#publicUploader").html("");
            $("#publicBusiId").val(busiId);
            $("#publicBusiType").val(busiType);
            $("#publicDivId").val(divId);
            rdcp.uploader("publicUploader", {busiId: busiId, busiType: busiType}, {
                onSuccess: function (file) {
//                    alert(file.id);
//                    alert(file.name);
//                    alert(file.size);
//                    alert(file.url);
//                    alert(file.thumbURL);
//                    alert(file.delUrl);
                }
            });
            rdcp.dialog(uploadDlgOpt);
        }
        function publicShowFiles(busiId,busiType,div_id){
            rdcp.request("!service/file/~query/Q_FILE_GET_FILE_LIST",{"busiId":busiId,"busiType":busiType},function(data){
                var files = data.body.rows;
                $("#"+div_id).html("");
                for(var i=0;i<files.length;i++){
                    var name = files[i].cell[3];
                    var id = files[i].cell[0];
                    var $TR = $("<TR>");
                    $TR.append();
                    $TR.append("<td>" + name + "</td>");
                    var html = "<tr id='file_" + id + "'>";
                    html += "<td>" + name + "</td>";
                    html = "<td><a href=\"javascript:void(0);\" onclick=\"publicDownloadFile('" + id + "');\" class=\"btn_leading_out\">下载</a>";
                    html += "<a href=\"javascript:void(0);\" class=\"btn_delete\" onclick=\"publicDelFile('" + id + "');\">删除</a></td></tr>";
                    $TR.append(html);
                    $("#"+div_id).append($TR);
                }
            });
        }

        function publicDownloadFile(id){
            var url="!service/file/~java/Downloader.get?id=" + id;
            window.open(url);
        }

        function publicDelFile(id){
            rdcp.request("!service/file/~java/Uploader.del?id="+id, {}, function () {
                $("#file_"+id).remove();
            });
        }
    </script>
</head>
<body>
<div id="publicUploadDlg" style="display:none;">
    <input type="hidden" id="publicBusiId"/>
    <input type="hidden" id="publicBusiType"/>
    <input type="hidden" id="publicDivId"/>
   <div id="publicUploader"></div>
</div>
</body>
</html>
