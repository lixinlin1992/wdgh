package com.action;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.bean.DbjzMember;
import com.bean.DbjzNotice;
import com.sunrise.foundation.dbutil.QueryRunner;
import com.sunrise.foundation.dbutil.ResultSetHandler;
import com.sunrise.foundation.utils.RequestWrapper;
import com.sunrise.framework.core.ApplicationManager;
import com.sunrise.framework.struts2.Header;

import javax.servlet.http.HttpSession;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * @author lxl
 * @version 1.0 2017/7/1
 * @since JDK1.6
 */
public class DbAction {
    final static String url = "jdbc:mysql://120.55.169.203:3306/world?user=root&password=root&useUnicode=true&characterEncoding=UTF8";
    public static Connection getConn(){
        Connection conn = null;
        try {
            Class.forName("com.mysql.jdbc.Driver");
            conn = DriverManager.getConnection(url);
        }
        catch (Exception e){
            e.printStackTrace();
        }
        return conn;
    }
    public JSONObject getUserInfo(){
        RequestWrapper request = ApplicationManager.getRequest();
        Connection conn = getConn();
        Map<String, Object> map = new HashMap<String,Object>();
        String sql = "select id,titleory as gh,numbere as account,usernameio name,sexmbrder sex,rxgzsjptio rxsj,"+
                "rhsjtypeme rhsj,bzqknameio bzqk from jzxt_member where numbere=? and usernameio=?";
        DbjzMember member = null;
        JSONObject json;
        try {
            member = (DbjzMember)QueryRunner.queryResultSet(conn, sql, new Object[]{"00003193", "吴爱军"},  new ResultSetHandler<Object>() {
                @Override
                public Object handle(ResultSet rs) throws Exception {
                    DbjzMember member1 = new DbjzMember();
                    while (rs.next()) {
                        //获取每一个菜单数据，并且加入到缓存中
                        member1.setId(Integer.valueOf(rs.getString("id")));
                        member1.setAccount(rs.getString("account"));
                        member1.setName(rs.getString("name"));
                        member1.setGh(rs.getString("gh"));
                        member1.setSex(rs.getString("sex"));
                        member1.setBzqk(rs.getString("bzqk"));
                        member1.setRxsj(rs.getString("rxsj"));
                        member1.setRhsj(rs.getString("rhsj"));
                    }
                    return member1;
                }
            });
            map.put("header",new Header(0,"success"));
            if(member==null)
              map.put("body","");
            else
              map.put("body",member);
            HttpSession session = ApplicationManager.getSession();
            System.out.println(member.getSex());
            json = (JSONObject) JSON.toJSON(map);
            System.out.println(json.toString());
        }
        catch (Exception e){
            e.printStackTrace();
            map.put("header",new Header(-1,"fail"));
            map.put("errorMsg",e.getMessage());
            json = (JSONObject) JSON.toJSON(map);
            return json;
        }
        return json;
    }
    public JSONObject getNotices(){
        Connection conn = getConn();
        Map<String, Object> map = new HashMap<String,Object>();
        String sql = "select id,title,copyfrom copy_from,hitstetime hits,FROM_UNIXTIME(puttime,'%Y-%c-%d %H:%i:%S') put_time " +
                "from jzxt_article";
        JSONObject json;
        try {
            ArrayList notices = (ArrayList)QueryRunner.queryResultSet(conn, sql, new ResultSetHandler<Object>() {
                @Override
                public Object handle(ResultSet rs) throws Exception {
                    ArrayList<DbjzNotice> list = new ArrayList<DbjzNotice>();
                    DbjzNotice notice;
                    while (rs.next()) {
                        notice = new DbjzNotice();
                        notice.setId(Integer.valueOf(rs.getString("id")));
                        notice.setTitle(rs.getString("title"));
                        notice.setCopy_from(rs.getString("copy_from")==null?"":rs.getString("copy_from"));
                        notice.setHits(Integer.valueOf(rs.getString("hits")));
                        notice.setPut_time(rs.getString("put_time"));
                        list.add(notice);
                    }
                    return list;
                }
            });
            System.out.println(notices.size());
            map.put("header",new Header(-1,"fail"));
            map.put("body",new HashMap());
            json = (JSONObject) JSON.toJSON(map);
            json.getJSONObject("body").put("total",notices.size());
            json.getJSONObject("body").put("rows",notices);
        }
        catch (Exception e){
            e.printStackTrace();
            map.put("header",new Header(-1,"fail"));
            map.put("errorMsg",e.getMessage());
            json = (JSONObject) JSON.toJSON(map);
            return json;
        }
        return json;
    }
    public static void main(String args[]){
        DbAction dbAction = new DbAction();
        dbAction.getNotices();
    }
}
