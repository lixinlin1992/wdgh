package com.action;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.bean.DbjzMember;
import com.bean.DbjzNotice;
import com.bean.YftkCode;
import com.bean.YftkUser;
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
public class YftkAction {
    final static String url = "jdbc:mysql://120.55.169.203:3306/yftk?user=root&password=root&useUnicode=true&characterEncoding=UTF8";
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
    public void getUserInfo(){
        Connection conn = getConn();
        Map<String, Object> map = new HashMap<String,Object>();
        String sql = "select u.user_id,nick_name,gender,DATE_FORMAT(birthday,'%Y-%c-%d'),nation,org,department,height,degree,marriage_state,\n" +
                "hometown,marriage_time,emp_type,salary,house,car,friend_status,real_name,email,phone,qq,note,\n" +
                "i.img_path,u.is_effective\n" +
                "from user u\n" +
                "left join image i on u.user_id=i.user_id and i.img_type=0 " +
                "where u.user_id=10004";
        YftkUser user = null;
        JSONObject json;
        try {
            user = (YftkUser)QueryRunner.queryBean(conn,sql,YftkUser.class);
            map.put("header",new Header(0,"success"));
            if(user==null)
              map.put("body","");
            else
              map.put("body",user);
            json = (JSONObject) JSON.toJSON(map);
            System.out.println(json);
        }
        catch (Exception e){
            e.printStackTrace();
            map.put("header",new Header(-1,"fail"));
            map.put("errorMsg",e.getMessage());
            json = (JSONObject) JSON.toJSON(map);
        }
    }
    public JSONObject getCodes() {
        Connection conn = getConn();
        String sql = "select code_type,code_value,code,parent_code from (\n" +
                "select code_type,code_value,code,-1 parent_code from code as a\n" +
                "union all\n" +
                "select type,name,id,parent_id from area as b) as c\n" +
                "order by parent_code,code";
        Map<String, Object> map = new HashMap<String,Object>();
        JSONObject json;
        try {
            ArrayList list = (ArrayList)QueryRunner.queryResultSet(conn, sql, new ResultSetHandler<Object>() {
                @Override
                public Object handle(ResultSet rs) throws Exception {
                    ArrayList<YftkCode> list = new ArrayList<YftkCode>();
                    YftkCode code;
                    while (rs.next()) {
                        code = new YftkCode();
                        code.setCode_type(rs.getString("code_type"));
                        code.setCode_value(rs.getString("code_value"));
                        code.setCode(rs.getInt("code"));
                        code.setParent_code(rs.getInt("parent_code"));
                        list.add(code);
                    }
                    return list;
                }
            });
            map.put("codes",list);
            json = (JSONObject)JSONObject.toJSON(map);
        }
        catch (Exception e ){
            e.printStackTrace();
            return new JSONObject();
        }
        return json;
    }
    public static void main(String args[]){
        YftkAction action = new YftkAction();
        System.out.println(action.getCodes());
    }
}
