<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" isELIgnored="false" %>
<%@ page import="com.sunrise.foundation.dbutil.meta.MetaDataHelper,com.sunrise.foundation.utils.StringUtil" %>
<%@ page import="com.sunrise.tools.querydesigner.meta.ConnectionInfo" %>
<%@ page import="com.thoughtworks.xstream.XStream" %>
<%@ page import="com.thoughtworks.xstream.io.xml.DomDriver" %>
<%@ page import="java.sql.Connection" %>
<%@ page import="java.sql.DriverManager" %>
<%@ page import="com.sunrise.foundation.dbutil.*" %>
<%@ page import="java.sql.ResultSet" %>
<%@ page import="com.sunrise.foundation.dbutil.meta.TableInfo" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.util.Set" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.sql.SQLException" %>
<%@ page import="java.io.PrintWriter" %>
<%@ page import="com.sunrise.rdcp.system.DBconfigLoader" %>
<%
    Connection connection = null;
//    DriverManager.getConnection("jdbc:oracle:thin:@sunrisetech.dyndns.org:1555:SRDB","rdcp_test","rdcp_test");
    try{
        String sysCode = (String)request.getParameter("sysCode");
        String scheme = null;
        if(sysCode != null && sysCode.trim() != ""){
            try{
                connection = DBManager.getProfile(sysCode).getConnection();
            }catch (SQLException e){
                out.print(e.getMessage());
                return;
            }
            String schemeSql = "select DB_USER from RDC_SYS_DBCONFIG where sys_code = ? and default_flag = ?";
            String dbUserStr = QueryRunner.queryResultSet(schemeSql,new Object[]{sysCode,1},new StringHandler());
            if(dbUserStr != null && dbUserStr.trim() != ""){
                scheme = DBManager.getScheme(dbUserStr);
            }else{
                out.print(-1);
                out.flush();
                throw new Exception("没有配置业务数据库");
            }
        }else{
            scheme = DBManager.getScheme(null);
        }
        Map<String, TableInfo> tTableInfoMap = new HashMap<String, TableInfo>();
        MetaDataHelper.loadAllTableInfos(connection, null, scheme,tTableInfoMap);

        ConnectionInfo conInfo = new ConnectionInfo();
        conInfo.setIdentifierQuoteString(connection.getMetaData().getIdentifierQuoteString());
        conInfo.setMaxColumnNameLength(connection.getMetaData().getMaxColumnNameLength());
        conInfo.setSchema(scheme);
        conInfo.setTableCache(tTableInfoMap);
//        Set<String> key = tTableInfoMap.keySet();
//        out.println("一共有"+tTableInfoMap.size()+"张表</br>");
//        for(String k : key){
//            if(k.equals("R_B_NET_SUM")) {
//                out.println("########################");
//            }
//            out.println(tTableInfoMap.get(k).getTable_Name()+"</br>");
//        }
        XStream xStream = new XStream(new DomDriver());
        xStream.toXML(conInfo,out);
    }finally {
        DBManager.close(connection);
    }

%>