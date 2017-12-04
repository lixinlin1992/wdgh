import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.bean.YftkUser;
import com.bean.YftkCode;
import com.bean.FriendCondition;
import com.sunrise.foundation.dbutil.QueryRunner;
import com.sunrise.foundation.dbutil.ResultSetHandler;
import com.sunrise.foundation.dbutil.StringHandler;
import com.sunrise.foundation.utils.RequestWrapper;
import com.sunrise.framework.core.ApplicationManager;
import com.sunrise.framework.struts2.Header;

import javax.servlet.http.HttpSession;
import java.lang.Exception;
import java.lang.Object;
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
    //final static String url = "jdbc:mysql://210.42.122.139:3306/piefriend?user=root&password=123456&useUnicode=true&characterEncoding=UTF8";
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
    public YftkUser getUserInfo(){
        RequestWrapper request = ApplicationManager.getRequest();
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String user_id = request.getParameter("user_id");
        Connection conn = getConn();
        String sql = "select u.user_id,nick_name,gender,DATE_FORMAT(birthday,'%Y-%c-%d') birthday,nation,org,department,height,degree,marriage_state,\n" +
                "hometown,marriage_time,emp_type,salary,house,car,friend_status,real_name,email,phone,qq,note,\n" +
                "i.img_path,u.is_effective\n" +
                "from user u\n" +
                "left join image i on u.user_id=i.user_id and i.img_type=0 " +
                "where 1=1 ";
        if(email!=null)
            sql += "and u.email='"+email+"' and u.password=md5('"+password+"')";
        if(user_id!=null)
            sql += "and u.user_id="+user_id;
        YftkUser user = null;
        try {
            user = (YftkUser)QueryRunner.queryBean(conn,sql,YftkUser.class);
            conn.close();
        }
        catch (Exception e){
            e.printStackTrace();
            return user;
        }
        return user;
    }
    public JSONObject getUserInfo2(){
        YftkUser user = getUserInfo();
        Map<String, Object> map = new HashMap<String,Object>();
        map.put("body",user);
        return (JSONObject)JSON.toJSON(map);
    }
    public JSONObject getFriendCondition(){
        RequestWrapper request = ApplicationManager.getRequest();
        String user_id = request.getParameter("user_id");
        Connection conn = getConn();
        String sql = "select id,user_id,min_age,max_age,min_height,max_height,org,degree,marriage_state,nation,hometown " +
                "from friend_condition where user_id="+user_id;
        FriendCondition fc = null;
        JSONObject json;
        HashMap map = new HashMap();
        try {
            fc = (FriendCondition)QueryRunner.queryBean(conn,sql,FriendCondition.class);
            map.put("header",new Header(0,"success"));
            map.put("body",fc);
            json = (JSONObject) JSON.toJSON(map);
            conn.close();
        }
        catch (Exception e){
            e.printStackTrace();
            map.put("header",new Header(-1,"fail"));
            map.put("errorMsg",e.getMessage());
            json = (JSONObject) JSON.toJSON(map);
        }
        return json;
    }
    public JSONObject login() {
        Map<String, Object> map = new HashMap<String,Object>();
        YftkUser user = getUserInfo();
        JSONObject json;
        map.put("header",new Header(0,"success"));
        if(user!=null){
            if(user.getIs_effective()==1) {
                map.put("body", "1");
                HttpSession session = ApplicationManager.getSession();
                session.setAttribute("YftkUser", user);
            }
            else{
                map.put("body", "-1");
                map.put("errorMsg", "账号未通过审核");
            }
        }
        else {
            map.put("body", "-1");
            map.put("errorMsg", "账号或密码错误");
        }
        json = (JSONObject)JSON.toJSON(map);
        return json;
    }
    public JSONObject getCodes() {
        Connection conn = getConn();
        RequestWrapper request = ApplicationManager.getRequest();
        String code_key = request.getParameter("code_key");
        String sql = "select code_type,code_value,code,parent_code from (\n" +
                "select code_type,code_value,code,-1 parent_code from code as a\n" +
                "union all\n" +
                "select type,name,id,parent_id from area as b) as c\n" +
                "where c.code_type in (" + code_key + ")\n" +
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
            map.put("length",list.size());
            json = (JSONObject)JSONObject.toJSON(map);
            conn.close();
        }
        catch (Exception e ){
            e.printStackTrace();
            return new JSONObject();
        }
        return json;
    }
    public JSONObject updateFriendCondition(){
        RequestWrapper request = ApplicationManager.getRequest();
        String friendCondition = (String)request.getParameter("friendCondition");
        JSONObject json = JSON.parseObject(friendCondition);
        FriendCondition fc = JSONObject.toJavaObject(json,FriendCondition.class);
        Connection conn = getConn();
        Map<String, Object> map = new HashMap<String,Object>();
        JSONObject json2;
        String sql = "update friend_condition set min_age=?,max_age=?,min_height=?,max_height=?,org=?,degree=?,\n" +
                "    marriage_state=?,nation=?,hometown=?,update_time=now()\n" +
                "    where id=?";
        try{
            Object[] objects = new Object[]{fc.getMin_age(),fc.getMax_age(),fc.getMin_height(),fc.getMax_height(),
            fc.getOrg(),fc.getDegree(),fc.getMarriage_state(),fc.getNation(),fc.getHometown(),fc.getId()};
            QueryRunner.update(conn,sql,objects);
            conn.close();
            map.put("header",new Header(0,"success"));
            json2 = (JSONObject) JSON.toJSON(map);
        }
        catch (Exception e){
            e.printStackTrace();
            map.put("header",new Header(-1,"fail"));
            map.put("errorMsg",e.getMessage());
            json2 = (JSONObject) JSON.toJSON(map);
        }
        return json2;
    }
    public JSONObject updateUserInfo() {
        RequestWrapper request = ApplicationManager.getRequest();
        String userInfo = (String)request.getParameter("userInfo");
        JSONObject json = JSON.parseObject(userInfo);
        YftkUser user = JSONObject.toJavaObject(json,YftkUser.class);
        Connection conn = getConn();
        Map<String, Object> map = new HashMap<String,Object>();
        JSONObject json2;
        String sql = "update user set gender=?,nation=?,department=?,height=?,degree=?,"+
                "marriage_state=?,hometown=?,marriage_time=?,emp_type=?,salary=?,house=?,car=?,friend_status=?"+
               " where user_id=?";
        try{
            Object[] objects = new Object[]{user.getGender(),user.getNation(),
             user.getDepartment(),user.getHeight(),user.getDegree(),
             user.getMarriage_state(),user.getHometown(),user.getMarriage_time(),user.getEmp_type(),
             user.getSalary(),user.getHouse(),user.getCar(),user.getFriend_status(),user.getUser_id()};
            QueryRunner.update(conn,sql,objects);
            conn.close();
            map.put("header",new Header(0,"success"));
            json2 = (JSONObject) JSON.toJSON(map);
        }
        catch (Exception e){
            e.printStackTrace();
            map.put("header",new Header(-1,"fail"));
            map.put("errorMsg",e.getMessage());
            json2 = (JSONObject) JSON.toJSON(map);
        }
        return json2;
    }
    public JSONObject updateField() {
        RequestWrapper request = ApplicationManager.getRequest();
        String user_id = request.getParameter("user_id");
        String note = request.getParameter("note");
        Connection conn = getConn();
        Map<String, Object> map = new HashMap<String,Object>();
        JSONObject json2;
        String sql = "update user set ";
        if(note!=null) {
            sql += "note='"+note+"' where user_id="+user_id;
        }
        try{
            QueryRunner.update(conn,sql);
            conn.close();
            map.put("header",new Header(0,"success"));
            json2 = (JSONObject) JSON.toJSON(map);
        }
        catch (Exception e){
            e.printStackTrace();
            map.put("header",new Header(-1,"fail"));
            map.put("errorMsg",e.getMessage());
            json2 = (JSONObject) JSON.toJSON(map);
        }

        return json2;
    }
    public JSONObject updatePassword() {
        RequestWrapper request = ApplicationManager.getRequest();
        String user_id = request.getParameter("user_id");
        String old_pass = request.getParameter("old_pass");
        String new_pass1 = request.getParameter("new_pass1");
        String new_pass2 = request.getParameter("new_pass2");
        Connection conn = getConn();
        Map<String, Object> map = new HashMap<String,Object>();
        JSONObject json2;
        String sql = "select count(user_id) cou from user where user_id="+user_id+" and password=md5('"+old_pass+"')";
        try{
            String count = QueryRunner.queryResultSet(conn, sql, new Object[]{}, new StringHandler());
            if(count.equals("0")) {
                map.put("header",new Header(0,"success"));
                map.put("body","-1");
                map.put("errorMsg","密码错误");
            }
            else {
                sql = "update user set password=md5('"+new_pass1+"') where user_id="+user_id;
                QueryRunner.update(conn,sql);
                map.put("header",new Header(0,"success"));
                map.put("body","1");
                json2 = (JSONObject) JSON.toJSON(map);
            }
            json2 = (JSONObject) JSON.toJSON(map);
            conn.close();
        }
        catch (Exception e){
            e.printStackTrace();
            map.put("header",new Header(-1,"fail"));
            map.put("errorMsg",e.getMessage());
            json2 = (JSONObject) JSON.toJSON(map);
        }

        return json2;
    }
    public JSONObject loginOut() {
        HttpSession session = ApplicationManager.getSession();
        session.setAttribute("YftkUser", null);
        Map<String, Object> map = new HashMap<String,Object>();
        map.put("header",new Header(0,"success"));
        return (JSONObject) JSON.toJSON(map);
    }
    public static void main(String args[]){
        YftkAction action = new YftkAction();
        action.getUserInfo();
    }
}
