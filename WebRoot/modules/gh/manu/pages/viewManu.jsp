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
    <script type="text/javascript" src="!gh/manu/~/scripts/viewManu.js"></script>
    <link href="!service/file/~/css/editfile.css" rel="stylesheet" type="text/css">
    <title>预览稿件</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <link href="themes/default/css/index.css" rel="stylesheet" type="text/css">
    <link href="!gh/index/~/css/reset.css" rel="stylesheet" />
    <link href="!gh/index/~/css/list.css" rel="stylesheet" />
    <%
        String manu_id = request.getParameter("manu_id");
        String tag = request.getParameter("tag");
    %>
</head>
<body>
<div class="content f-l" style="width:100%;">
    <div class="g-article-con" style="width:80%; margin:0 auto;" id="content">
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
                            <input type="hidden" name="manu_id" id="manu_id">
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
<div id="dialog2" style="display: none;padding:0px !important;">
    <div class="SR_Space">
        <div class="SR_inputTable">
            <div class="SR_inputTableContent">
                <form name="approveManuForm" id="approveManuForm" onsubmit="return false;">
                    <table>
                        <tr>
                            <td class="SR_inputTitle">
                                审批结果：
                            </td>
                            <td>
                                <select name="state" class="SR_pureInput" id="state2"
                                        style="width: 180px;" onchange="changeType()">
                                    <option value="0">
                                        --请选择--
                                    </option>
                                    <option value="3">
                                        通过审批
                                    </option>
                                    <option value="4">
                                        未通过审批
                                    </option>
                                </select>
                            </td>
                            <input type="hidden" name="manu_id" id="manu_id2">
                        </tr>
                        <tr  id="comment2" name="comment">
                            <td class="SR_inputTitle">
                                审批意见：
                            </td>
                            <td>
                                <textarea id="remarks2" name="remarks" style="width: 240px;height:45px"></textarea>
                            </td>&nbsp;
                        </tr>
                    </table>
                </form>
            </div>
        </div>
    </div>
</div>
<i class="clear"></i>
<!--列表页内容区 End-->
<div>
    <div class="floatSmallBtn" style="width: 500px;" align="center">
        <a class="btn_commit" href="javascript:void(0);"
           onclick="editManu(manu_id,tag);" title="">修改</a>
        <a id="shenhe" name="shenhe" class="btn_cancel" href="javascript:void(0);"
           onclick="examineManu(manu_id)" title="">审核</a>
        <a id="shenpi" name="shenpi" class="btn_cancel" href="javascript:void(0);"
           onclick="approveManu(manu_id)" title="">审批</a>
        <a class="btn_cancel" href="javascript:void(0);"
           onclick="cancel()" title="">取消</a>
    </div>
</div>
<div class="clearfix"></div>
</body>
<script type="text/javascript">
    //获取history_id
    var manu_id = "<%=manu_id%>";
    var tag = "<%=tag%>";
    //获取服务器根路径
    var serverBasePath = "<%=basePath%>";
    rdcp.ready(function () {
        rdcp.request('!gh/manu/~query/Q_GET_MANU_INFO', 'manu_id=' + manu_id, function (data) {
            var obj = data.body;
            var html = "";
            html +="<h1>"+obj.company+"</h1>";
            html += "<p class='g-article-data'>作者一:"+obj.author_one+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;作者二:"
                +obj.author_two+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;作者三:"+obj.author_three+"</p>";
            html += "<div class='g-article-content'>"+obj.content+"</div>";
            $("#content").html(html);
            if(tag==1)  //tag=1 表示从管理稿件界面过来的
            {
                $("#shenpi").hide();
                $("#shenhe").hide();
            }else if(tag==2)////tag=1 表示从审批界面过来的
            {
                $("#shenhe").hide();

            }else  {
                $("#shenpi").hide(); //表示从审核界面过来

            }
        });
    });

    function cancel()
    {
            CloseTab("viewManu"+manu_id, "预览信息");
    }


</script>

</html>
