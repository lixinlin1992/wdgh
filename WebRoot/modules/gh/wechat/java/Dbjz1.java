//import com.alibaba.fastjson.JSON;
//import com.alibaba.fastjson.JSONObject;
//import com.bean.DbjzMember;
//import com.bean.DbjzNotice;
//import com.bean.DbjzApply;
//import com.sunrise.foundation.dbutil.QueryRunner;
//import com.sunrise.foundation.dbutil.ResultSetHandler;
//import com.sunrise.framework.struts2.Header;
//import java.lang.reflect.Member;
//import java.sql.Connection;
//import java.sql.DriverManager;
//import java.sql.ResultSet;
//import java.util.ArrayList;
//import java.util.HashMap;
//import java.util.Map;
//import com.sunrise.foundation.utils.RequestWrapper;
//import com.sunrise.framework.core.ApplicationManager;
//import javax.servlet.http.HttpSession;
//import java.util.ArrayList;
//import java.text.SimpleDateFormat;
//import java.util.Date;
//public class Dbjz {
//    final static  String [] Status= new String[]{"待审批","初审未通过","初审通过","人事部未通过","人事部通过","财务部未通过","财务部通过","校医院未通过","校医院通过","终审未通过","终审通过"};
//    final static String url = "jdbc:mysql://210.42.122.140:3306/jzxtdata?user=root&password=huweishen.com&useUnicode=true&characterEncoding=UTF8";
//    public static Connection getConn(){
//        Connection conn = null;
//        try {
//            Class.forName("com.mysql.jdbc.Driver");
//            conn = DriverManager.getConnection(url);
//        }
//        catch (Exception e){
//            e.printStackTrace();
//        }
//        return conn;
//    }
//    public JSONObject getUserInfo(){
//        RequestWrapper request = ApplicationManager.getRequest();
//        String userName = request.getParameter("userName");
//        String userAccount = request.getParameter("userAccount");
//        Connection conn = getConn();
//        Map<String, Object> map = new HashMap<String,Object>();
//        String sql = "select id,titleory as gh,numbere as account,usernameio name,sexmbrder sex,rxgzsjptio rxsj,"+
//                "rhsjtypeme rhsj,bzqknameio bzqk from jzxt_member where numbere=? and usernameio=?";
//        DbjzMember member = null;
//        JSONObject json;
//        try {
//            member = (DbjzMember)QueryRunner.queryResultSet(conn, sql, new Object[]{userAccount,userName},  new ResultSetHandler<Object>() {
//                @Override
//                public Object handle(ResultSet rs) throws Exception {
//                    DbjzMember member1 = new DbjzMember();
//                    while (rs.next()) {
//                        //获取每一个菜单数据，并且加入到缓存中
//                        member1.setId(Integer.valueOf(rs.getString("id")));
//                        member1.setAccount(rs.getString("account"));
//                        member1.setName(rs.getString("name"));
//                        member1.setGh(rs.getString("gh"));
//                        member1.setSex(rs.getString("sex"));
//                        member1.setBzqk(rs.getString("bzqk"));
//                        member1.setRxsj(rs.getString("rxsj"));
//                        member1.setRhsj(rs.getString("rhsj"));
//                    }
//                    return member1;
//                }
//            });
//            map.put("header",new Header(0,"success"));
//            if(member==null)
//                map.put("body","");
//            else
//                map.put("body",member);
//            json = (JSONObject) JSON.toJSON(map);
//        }
//        catch (Exception e){
//            e.printStackTrace();
//            map.put("header",new Header(-1,"fail"));
//            map.put("errorMsg",e.getMessage());
//            json = (JSONObject) JSON.toJSON(map);
//            return json;
//        }
//        return json;
//    }
//    public JSONObject login() {
//       Map<String, Object> map = new HashMap<String,Object>();
//       JSONObject json = getUserInfo();
//       System.out.println(json.getJSONObject("body"));
//       DbjzMember member = JSON.toJavaObject(json.getJSONObject("body"),DbjzMember.class);
//       map.put("header",new Header(0,"success"));
//       System.out.println(member.getId());
//       if(member.getAccount()!=null){
//           map.put("body","1");
//           HttpSession session = ApplicationManager.getSession();
//           session.setAttribute("dbjzMember",member);
//       }
//       else {
//           map.put("body", "-1");
//       }
//       json = (JSONObject)JSON.toJSON(map);
//       return json;
//    }
//    public JSONObject getNotices(){
//        Connection conn = getConn();
//        Map<String, Object> map = new HashMap<String,Object>();
//        RequestWrapper request = ApplicationManager.getRequest();
//        String id = request.getParameter("id");
//        String sql = "select id,title,copyfrom copy_from,hitstetime hits,FROM_UNIXTIME(puttime,'%Y-%c-%d %H:%i:%S') put_time,contente content " +
//                "from jzxt_article";
//        if(id != null)
//          sql += " where id="+id;
//        JSONObject json;
//        try {
//            ArrayList notices = (ArrayList)QueryRunner.queryResultSet(conn, sql, new ResultSetHandler<Object>() {
//                @Override
//                public Object handle(ResultSet rs) throws Exception {
//                    ArrayList<DbjzNotice> list = new ArrayList<DbjzNotice>();
//                    DbjzNotice notice;
//                    while (rs.next()) {
//                        notice = new DbjzNotice();
//                        notice.setId(Integer.valueOf(rs.getString("id")));
//                        notice.setTitle(rs.getString("title"));
//                        notice.setCopy_from(rs.getString("copy_from")==null?"":rs.getString("copy_from"));
//                        notice.setHits(Integer.valueOf(rs.getString("hits")));
//                        notice.setPut_time(rs.getString("put_time"));
//                        notice.setContent(rs.getString("content"));
//                        list.add(notice);
//                    }
//                    return list;
//                }
//            });
//            System.out.println(notices.size());
//            map.put("header",new Header(0,"success"));
//            map.put("body",new HashMap());
//            json = (JSONObject) JSON.toJSON(map);
//            json.getJSONObject("body").put("total",notices.size());
//            json.getJSONObject("body").put("rows",notices);
//        }
//        catch (Exception e){
//            e.printStackTrace();
//            map.put("header",new Header(-1,"fail"));
//            map.put("errorMsg",e.getMessage());
//            json = (JSONObject) JSON.toJSON(map);
//            return json;
//        }
//        return json;
//    }
//    public JSONObject dbjzApply(){
//        Connection conn = getConn();
//        Map<String, Object> map = new HashMap<String,Object>();
//        RequestWrapper request = ApplicationManager.getRequest();
//        String username = request.getParameter("username");
//        String number = request.getParameter("number");
//        String titleory = request.getParameter("titleory");
//        String telueuid = request.getParameter("telueuid");
//        String bzqkstemio = request.getParameter("bzqkstemio");
//        String hhzjbntnal = request.getParameter("hhzjbntnal");
//        String zfjeriptio = request.getParameter("zfjeriptio");
//
//        long createtime = System.currentTimeMillis() / 1000;
//        String status = "0";
//        System.out.println("\nuserName "+ username+ " " +number + "\n"+titleory + " "+telueuid +"\n"+ bzqkstemio+" " + hhzjbntnal+" "+zfjeriptio);
//
//        String sql = "insert into jzxt_dbjz (username,number,titleory,telueuid,bzqkstemio,hhzjbntnal,zfjeriptio,createtime,status)" +
//                "values (?,?,?,?,?,?,?,?,?)";
//        JSONObject json;
//        try {
//            QueryRunner.update(conn, sql,  new Object[]{username,number ,titleory,telueuid ,bzqkstemio, hhzjbntnal,zfjeriptio,createtime,status} );
//
//
//
//            map.put("header",new Header(0,"success"));
//            map.put("body",new HashMap());
//            json = (JSONObject) JSON.toJSON(map);
//        }
//        catch (Exception e){
//            e.printStackTrace();
//            map.put("header",new Header(-1,"fail"));
//            map.put("errorMsg",e.getMessage());
//            json = (JSONObject) JSON.toJSON(map);
//            return json;
//        }
//        return json;
//    }
//    public JSONObject dbjzSubmit(){
//        Connection conn = getConn();
//        Map<String, Object> map = new HashMap<String,Object>();
//        RequestWrapper request = ApplicationManager.getRequest();
//        String number = request.getParameter("number");
//        String sql = "select id ,hhzjbntnal,FROM_UNIXTIME(createtime,'%Y-%c-%d %H:%i:%S') createtime,status "+
//                "from jzxt_dbjz where number =?";
//        System.out.println("!!! "+ number);
//        String status = request.getParameter("status");
//        if(status != null)
//            sql += " and status ="+status;
//        System.out.println("!!!@ "+ status);
//
//        JSONObject json;
//        try {
//            ArrayList applies = (ArrayList)QueryRunner.queryResultSet(conn, sql,new Object[]{number}, new ResultSetHandler<Object>() {
//                @Override
//                public Object handle(ResultSet rs) throws Exception {
//                    ArrayList<DbjzApply> list = new ArrayList<DbjzApply>();
//                    DbjzApply apply;
//                    while (rs.next()) {
//                        apply = new DbjzApply();
//                        apply.setId(Integer.valueOf(rs.getString("id")));
//                        apply.setTitle(rs.getString("hhzjbntnal"));
//                        int status = Integer.valueOf(rs.getString("status"));
//                        if(status <=10 && status >=0)
//                            apply.setStatus(Status[status]);
//                        else apply.setStatus(Status[0]);
//                        apply.setCreatetime(rs.getString("createtime"));
//
//                        list.add(apply);
//                        System.out.println("@@@ "+apply.getTitle());
//                    }
//                    return list;
//                }
//            });
//
//            map.put("header",new Header(0,"success"));
//            map.put("body",new HashMap());
//            json = (JSONObject) JSON.toJSON(map);
//            json.getJSONObject("body").put("total",applies.size());
//            if(!applies.isEmpty())
//            {
//                json.getJSONObject("body").put("rows",applies);
//            }
//
//        }
//        catch (Exception e){
//            e.printStackTrace();
//            map.put("header",new Header(-1,"fail"));
//            map.put("errorMsg",e.getMessage());
//            json = (JSONObject) JSON.toJSON(map);
//            return json;
//        }
//        return json;
//    }
//
//
//    public JSONObject tkbzApply(){
//        Connection conn = getConn();
//        Map<String, Object> map = new HashMap<String,Object>();
//        RequestWrapper request = ApplicationManager.getRequest();
//        String name = request.getParameter("name");
//        String number = request.getParameter("number");
//        String gh= request.getParameter("gh");
//        String sex= request.getParameter("sex");
//        String birthday= request.getParameter("birthday");
//        String zwzc= request.getParameter("zwzc");
//        String bysr= request.getParameter("bysr");
//
//        String jtcy= request.getParameter("jtcy");
//        String poxm= request.getParameter("poxm");
//        String poysr= request.getParameter("poysr");
//        String jtzsr= request.getParameter("jtzsr");
//        String pozwzc= request.getParameter("pozwzc");
//        String pogzdw= request.getParameter("pogzdw");
//        String address= request.getParameter("address");
//        String tel= request.getParameter("tel");
//        String bzqk= request.getParameter("bzqk");
//        String content= request.getParameter("content");
//
//
//        long createtime  = System.currentTimeMillis() / 1000;;
//        String status = "0";
//       // System.out.println("!!!\n"+usernamess+","+numbergent+","+titlerdero+","+sextusatae+","+birthdayme+","+zwzcrkdere+","+bysrtetime+","+jtcytetime+","+poxmorder+","+poysrsskme+","+jtzsrkptio+","+pozwzctime+","+pogzdwtime+","+addresshio+","+teltentent+","+bzqkretime+","+contentmee+","+createtime+","+statusent);
//
//        String sql = "insert into jzxt_tkbz (usernamess,numbergent,titlerdero,sextusatae,birthdayme,zwzcrkdere,bysrtetime,jtcytetime,poxmorder,poysrsskme,jtzsrkptio,pozwzctime,pogzdwtime,addresshio,teltentent,bzqkretime,contentmee,createtime,statusent)" +
//                "values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
//        JSONObject json;
//        try {
//            QueryRunner.update(conn, sql,  new Object[]{name,number,gh,sex,birthday,zwzc,bysr,jtcy,poxm,poysr,jtzsr,pozwzc,pogzdw,address,tel,bzqk,content,createtime,status} );
//
//
//
//            map.put("header",new Header(0,"success"));
//            map.put("body",new HashMap());
//            json = (JSONObject) JSON.toJSON(map);
//        }
//        catch (Exception e){
//            e.printStackTrace();
//            map.put("header",new Header(-1,"fail"));
//            map.put("errorMsg",e.getMessage());
//            json = (JSONObject) JSON.toJSON(map);
//            return json;
//        }
//        return json;
//    }
//
//    public JSONObject tkbzSubmit(){
//            Connection conn = getConn();
//            Map<String, Object> map = new HashMap<String,Object>();
//            RequestWrapper request = ApplicationManager.getRequest();
//            String number = request.getParameter("number");
//            String sql = "select contentmee, FROM_UNIXTIME(createtime,'%Y-%c-%d %H:%i:%S') createtime,statusent "+
//            "from jzxt_tkbz where numbergent =? ";
//            System.out.println("!!! "+ number);
//            String status = request.getParameter("status");
//            if(status != null)
//                sql += " and statusent ="+status;
//            System.out.println("!@@ "+ status);
//
//            JSONObject json;
//            try {
//            ArrayList applies = (ArrayList)QueryRunner.queryResultSet(conn, sql,new Object[]{number}, new ResultSetHandler<Object>() {
//                @Override
//                public Object handle(ResultSet rs) throws Exception {
//                ArrayList<DbjzApply> list = new ArrayList<DbjzApply>();
//                DbjzApply apply;
//                while (rs.next()) {
//                apply = new DbjzApply();
//               // apply.setId(Integer.valueOf(rs.getString("idssion_id")));
//                apply.setTitle(rs.getString("contentmee"));
//                int status = Integer.valueOf(rs.getString("statusent")).intValue();
//                if (status <= 10 && status >= 0)
//                apply.setStatus(Status[status]);
//                else apply.setStatus(Status[0]);
//
//              //  SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//              //  String dateString = formatter.format(Integer.valueOf(rs.getString("createtime")));
//                apply.setCreatetime(rs.getString("createtime"));
//
//                list.add(apply);
//                System.out.println("@@@ "+rs.getString("createtime") +" "+apply.getCreatetime());
//                }
//                return list;
//                }
//                });
//
//                map.put("header",new Header(0,"success"));
//                map.put("body",new HashMap());
//                json = (JSONObject) JSON.toJSON(map);
//                json.getJSONObject("body").put("total",applies.size());
//                if(!applies.isEmpty())
//                {
//                json.getJSONObject("body").put("rows",applies);
//                }
//            }
//                catch (Exception e){
//                e.printStackTrace();
//                map.put("header",new Header(-1,"fail"));
//                map.put("errorMsg",e.getMessage());
//                json = (JSONObject) JSON.toJSON(map);
//                return json;
//            }
//        return json;
//        }
//}
