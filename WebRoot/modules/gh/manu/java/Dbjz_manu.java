import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.bean.DbjzMember;
import com.bean.DbjzNotice;
import com.bean.DbjzApply;
import com.sunrise.foundation.dbutil.QueryRunner;
import com.sunrise.foundation.dbutil.ResultSetHandler;
import com.sunrise.framework.struts2.Header;
import java.lang.reflect.Member;
import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import com.sunrise.foundation.utils.RequestWrapper;
import com.sunrise.framework.core.ApplicationManager;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.text.SimpleDateFormat;
import java.util.Date;
public class Dbjz_manu {

    private static String USERNAMR = "whgh";
    private static String PASSWORD = "whgh_2017";
    private static String DRVIER = "oracle.jdbc.driver.OracleDriver";
    private static String URL = "jdbc:oracle:thin:@localhost:1521:orcl";

    // 创建一个数据库连接
    Connection connection = null;
    // 创建预编译语句对象，一般都是用这个而不用Statement
    PreparedStatement pstm = null;
    // 创建一个结果集对象
    ResultSet rs = null;

    public void AddData(int id,String content) {
        connection = getConnection();
        String sqlStr = "insert into MANU values(?,?)";
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
    public JSONObject dbjzApply(){
        connection = getConnection();
//        String sqlStr = "insert into bi_manu(id,content) values(?,?)";
       /* String sqlStr = " insert into bi_manu(id,company,job_num,content,state,create_user,create_time,author_one,author_two,author_three,dept_id," +
                "content_text,author_one_account,author_two_account,author_three_account)" +
                "select ?,?,123,?,-1,123," +
                "sysdate,?,?,?,dept_id,?,?,?,? " +
                "from sys_p_user where id=1";*/
        String sqlStr = " insert into bi_manu(id,company,job_num,content,state,create_user,create_time,author_one,author_two,author_three,dept_id," +
                "content_text,author_one_account,author_two_account,author_three_account)" +
                "select ?,?,?,?,-1,?," +
                "sysdate,?,?,?,dept_id,?,?,?,? " +
                "from sys_p_user where id=?";


        Connection conn = getConnection();
        Map<String, Object> map = new HashMap<String,Object>();
        RequestWrapper request = ApplicationManager.getRequest();
        String manu_id = request.getParameter("manu_id");
        String company = request.getParameter("company");
        String CUR_USER_ID = request.getParameter("CUR_USER_ID");
        String content = request.getParameter("content");
        String author_one = request.getParameter("author_one");
        String author_two = request.getParameter("author_two");
        String author_three = request.getParameter("author_three");
        String content_text = request.getParameter("content_text");
        String author_one_account = request.getParameter("author_one_account");
        String author_two_account = request.getParameter("author_two_account");:
        String author_three_account = request.getParameter("author_three_account");
       /* String manu_id ="269";
        String company ="11";
        String content = "232323";
        String author_one = "郑现镇";
        String author_two = "唐兴亮";
        String author_three = "232323";
        String content_text = "sasassa";
        String author_one_account = "";
        String author_two_account = "";
        String author_three_account ="";*/
//        String id="9";
//        String content ="hello";
        System.out.println("id："+manu_id);
        System.out.println("content："+content);
        System.out.println("company："+company);
        System.out.println("content："+content);
        System.out.println("author_one："+author_one);
        System.out.println("author_two："+author_two);
        System.out.println("author_three："+author_three);
        System.out.println("content_text："+content_text);
        System.out.println("author_one_account："+author_one_account);
        System.out.println("author_two_account："+author_two_account);
        System.out.println("author_three_account："+author_three_account);




        JSONObject json;
        try {
            //QueryRunner.update(conn, sql,  new Object[]{username,number ,titleory,telueuid ,bzqkstemio, hhzjbntnal,zfjeriptio,createtime,status} );
            QueryRunner.update(conn, sqlStr,  new Object[]{manu_id,company,CUR_USER_ID,content,CUR_USER_ID,author_one,author_two,author_three,content_text,author_one_account,author_two_account,author_three_account,CUR_USER_ID} );
            map.put("header",new Header(0,"success"));
            map.put("body",new HashMap());
            json = (JSONObject) JSON.toJSON(map);
            System.out.println("写入成功");

        }
        catch (Exception e){
            e.printStackTrace();
            map.put("header",new Header(-1,"fail"));
            map.put("errorMsg",e.getMessage());
            json = (JSONObject) JSON.toJSON(map);
            return json;

        }finally {
            ReleaseResource();


        }
        return json;

    }

    public static void main(String args[]){
        Dbjz_manu test= new Dbjz_manu();
//        manuInsert.AddData(1,"测试");
        test.dbjzApply();
    }


}
