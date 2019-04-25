import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.sunrise.foundation.utils.RequestWrapper;
import com.sunrise.framework.core.ApplicationManager;
import com.sunrise.framework.struts2.Header;

import java.sql.*;
import java.util.HashMap;
import java.util.Map;

public class Dbjz_manu {

    private static String USERNAMR = "whgh";
    private static String PASSWORD = "whgh_2017";
    private static String DRVIER = "oracle.jdbc.driver.OracleDriver";
    private static String URL = "jdbc:oracle:thin:@localhost:1521:orcl";
/*
    private static String USERNAMR = "gonghui";
    private static String PASSWORD = "gonghui";
    private static String DRVIER = "oracle.jdbc.driver.OracleDriver";
    private static String URL = "jdbc:oracle:thin:@//10.113.1.50:1521/orcl";*/


    // 创建一个数据库连接
    Connection connection = null;
    // 创建预编译语句对象，一般都是用这个而不用Statement
    PreparedStatement pstm = null;
    // 创建一个结果集对象
    ResultSet rs = null;

    public void AddData(int id, String content) {
        connection = getConnection();
        String sqlStr = "insert into BI_MANU(id,content) values(?,?)";
        try {
            // 执行插入数据操作
            pstm = connection.prepareStatement(sqlStr);
            pstm.setInt(1, id);
            pstm.setString(2, content);
            pstm.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            ReleaseResource();
        }
    }

    /**
     * 获取Connection对象
     *
     * @return
     */
    public Connection getConnection() {
        try {
            Class.forName(DRVIER);
            connection = DriverManager.getConnection(URL, USERNAMR, PASSWORD);
            System.out.println("成功连接数据库");
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("class not find !", e);
        } catch (SQLException e) {
            throw new RuntimeException("get connection error!", e);
        }

        return connection;
    }

    /**
     * 释放资源
     */
    public void ReleaseResource() {
        if (rs != null) {
            try {
                rs.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        if (pstm != null) {
            try {
                pstm.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        if (connection != null) {
            try {
                connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }


    //从前端获取所需的值
    public JSONObject dbjzApply() {
        connection = getConnection();

        String sqlStr = " insert into bi_manu(id,company,job_num,content,state,create_user,create_time,author_one,author_two,author_three,dept_id," +
                "content_text,author_one_account,author_two_account,author_three_account)" +
                "values( ?,?,?,?,-1,?," +
                "sysdate,?,?,?,?,?,?,?,?)";


        Map<String, Object> map = new HashMap<String, Object>();

        RequestWrapper request = ApplicationManager.getRequest();
        String manu_id = request.getParameter("manu_id");
        String company = request.getParameter("company");
        String CUR_USER_ID = request.getParameter("CUR_USER_ID");
        String job_num = request.getParameter("CUR_USER_ID");
        String content = request.getParameter("content");
        String author_one = request.getParameter("author_one");
        String author_two = request.getParameter("author_two");
        String author_three = request.getParameter("author_three");
        String content_text = request.getParameter("content_text");
        String author_one_account = request.getParameter("author_one_account");
        String author_two_account = request.getParameter("author_two_account");
        String author_three_account = request.getParameter("author_three_account");
        String create_user = request.getParameter("CUR_USER_ID");
        String dept_id = "";

    /*  String  manu_id="11";
        String company="11";
        String job_num="11";
        String content="11";
        String create_user="11";
        String author_one="11";
        String author_two="11";
        String author_three="11";
        String dept_id="2";
        String content_text="11";
        String author_one_account="11";
        String author_two_account="11";
        String author_three_account="11";
        String CUR_USER_ID="1";*/

     /*   System.out.println("id：" + manu_id);
        System.out.println("content：" + content);
        System.out.println("company：" + company);
        System.out.println("content：" + content);
        System.out.println("author_one：" + author_one);
        System.out.println("author_two：" + author_two);

        System.out.println("content_text：" + content_text);
        System.out.println("author_one_account：" + author_one_account);
        System.out.println("author_two_account：" + author_two_account);
        System.out.println("author_three_account：" + author_three_account);
*/


        JSONObject json;
        try {
            Connection conn = getConnection();
            Statement sta = null;

            sta = conn.createStatement();
            String sql = "select DEPT_ID from sys_p_user where id=" + CUR_USER_ID;
            sta = conn.createStatement();
            rs = sta.executeQuery(sql);

            if (rs.next()) {
                dept_id = rs.getString(1);
            }


//            String sqlStr = " insert into BI_MANU(id,company) values(?,?)";
            pstm = conn.prepareStatement(sqlStr);
            pstm.setInt(1, Integer.parseInt(manu_id));
            pstm.setString(2, company);
            pstm.setString(3, job_num);
            pstm.setString(4, content);
//            pstm.setString(5, state);
            pstm.setString(5, create_user);
//            pstm.setString(7, create_time);
            pstm.setString(6, author_one);
            pstm.setString(7, author_two);
            pstm.setString(8, author_three);
            pstm.setString(9, dept_id);
            pstm.setString(10, content_text);
            pstm.setString(11, author_one_account);
            pstm.setString(12, author_two_account);
            pstm.setString(13, author_three_account);
            pstm.executeUpdate();
            System.out.println("写入成功");
            map.put("header", new Header(0, "success"));
            map.put("body", new HashMap());
            json = (JSONObject) JSON.toJSON(map);
            System.out.println("写入成功");

        } catch (Exception e) {
            e.printStackTrace();
            map.put("header", new Header(-1, "fail"));
            map.put("errorMsg", e.getMessage());
            json = (JSONObject) JSON.toJSON(map);
            return json;

        } finally {
            ReleaseResource();


        }
        return json;

    }

    public static void main(String args[]) {
        Dbjz_manu test = new Dbjz_manu();
//        manuInsert.AddData(1,"测试");
        test.dbjzApply();
    }


}
