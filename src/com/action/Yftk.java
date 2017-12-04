package com.action;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.bean.ParamCode;
import com.bean.Province;
import com.bean.YftkUser;
import com.sunrise.foundation.dbutil.QueryRunner;
import com.sunrise.foundation.dbutil.ResultSetHandler;
import com.sunrise.foundation.utils.RequestWrapper;
import com.sunrise.framework.core.ApplicationManager;
import com.sunrise.framework.struts2.Header;
import org.eclipse.swt.internal.win32.PROCESS_INFORMATION;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.text.SimpleDateFormat;
import java.util.*;

public class Yftk {

    final static String url = "jdbc:mysql://120.55.169.203:3306/yftk?user=root&password=root&useUnicode=true&characterEncoding=UTF8";

    public static Connection getConn() {
        Connection conn = null;
        try {
            Class.forName("com.mysql.jdbc.Driver");
            conn = DriverManager.getConnection(url);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return conn;
    }

    public JSONObject discoverFate() {
        Connection conn = getConn();
        Map<String, Object> map = new HashMap<String, Object>();
        RequestWrapper request = ApplicationManager.getRequest();
        String gender = request.getParameter("gender");
        String marriageState = request.getParameter("marriageState");
        String height = request.getParameter("height");
        String age = request.getParameter("age");
        String province = request.getParameter("province");
        String degree = request.getParameter("degree");
        String org = request.getParameter("org");
        String sql = "select u.user_id, u.nick_name, u.gender, u.birthday, u.marriage_state, u.degree, u.emp_type, u.hometown, i.img_path from user u,image i where is_effective=1 and u.user_id=i.user_id and i.img_type=0";
        if (gender != null && !gender.equals("-1")) {
            sql += " and gender=" + gender;
        }
        if (marriageState != null && !marriageState.equals("-1")) {
            sql += " and marriage_state=" + marriageState;
        }
        if (height != null && !height.equals("-1")) {
            if (height.equals("1")) {
                sql += " and height>=150 and height<170";
            } else if (height.equals("2")) {
                sql += " and height>=170 and height<180";
            } else if (height.equals("3")) {
                sql += " and height>=180";
            }
        }
        Date end = new Date();
        Calendar c = Calendar.getInstance();
        c.setTime(end);
        int year = c.get(Calendar.YEAR);
        int startYear, endYear;
        if (age != null && !age.equals("-1")) {
            if (age.equals("1")) {
                startYear = year - 25;
                endYear = year - 20;
                sql += " and birthday>='" + startYear + "-01-01' and birthday<='" + endYear + "-01-01'";
            } else if (age.equals("2")) {
                startYear = year - 28;
                endYear = year - 25;
                sql += " and birthday>='" + startYear + "-01-01' and birthday<='" + endYear + "-01-01'";
            } else if (age.equals("3")) {
                startYear = year - 30;
                endYear = year - 28;
                sql += " and birthday>='" + startYear + "-01-01' and birthday<='" + endYear + "-01-01'";
            }
        }
        if (province != null && !province.equals("-1")) {
            sql += " and hometown in " + getAreasByProvCode(province);
        }
        if (degree != null && !degree.equals("-1")) {
            sql += " and degree=" + degree;
        }
        if (org != null && !org.equals("-1")) {
            sql += " and org=" + org;
        }
        JSONObject json;
        try {
            ArrayList userList = (ArrayList) QueryRunner.queryResultSet(conn, sql, new ResultSetHandler<Object>() {
                @Override
                public Object handle(ResultSet rs) throws Exception {
                    ArrayList<YftkUser> list = new ArrayList<YftkUser>();
                    YftkUser yftkUser;
                    while (rs.next()) {
                        yftkUser = new YftkUser();
                        yftkUser.setUser_id(rs.getInt("user_id"));
                        yftkUser.setNick_name(rs.getString("nick_name"));
                        yftkUser.setGender(rs.getInt("gender"));
                        yftkUser.setBirthday(rs.getString("birthday"));
                        yftkUser.setMarriage_state(rs.getInt("marriage_state"));
                        yftkUser.setDegree(rs.getInt("degree"));
                        yftkUser.setEmp_type(rs.getInt("emp_type"));
                        yftkUser.setHometown(rs.getInt("hometown"));
                        yftkUser.setImg_path(rs.getString("img_path"));
                        Date start = new SimpleDateFormat("yyyy-MM-dd").parse(rs.getString("birthday"));
                        Date end = new Date();
                        Calendar c1 = Calendar.getInstance();
                        Calendar c2 = Calendar.getInstance();
                        c1.setTime(start);
                        c2.setTime(end);
                        int year1 = c1.get(Calendar.YEAR);
                        int year2 = c2.get(Calendar.YEAR);
                        yftkUser.setAge(year2 - year1);
                        list.add(yftkUser);
                    }
                    return list;
                }
            });
            map.put("header", new Header(0, "success"));
            map.put("body", new HashMap());
            json = (JSONObject) JSON.toJSON(map);
            json.getJSONObject("body").put("total", userList.size());
            json.getJSONObject("body").put("rows", userList);
        } catch (Exception e) {
            e.printStackTrace();
            map.put("header", new Header(-1, "fail"));
            map.put("errorMsg", e.getMessage());
            json = (JSONObject) JSON.toJSON(map);
            return json;
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        return json;
    }

    public String getAreasByProvCode(String provCode) {
        Connection conn = getConn();
        String sql = "select id from area where parent_id=" + provCode;
        final ArrayList<Integer> cityIds = new ArrayList<Integer>();
        final ArrayList<Integer> allIds = new ArrayList<Integer>();
        allIds.add(Integer.parseInt(provCode));
        try {
            QueryRunner.queryResultSet(conn, sql, new ResultSetHandler<Object>() {
                @Override
                public Object handle(ResultSet rs) throws Exception {
                    while (rs.next()) {
                        cityIds.add(rs.getInt("id"));
                        allIds.add(rs.getInt("id"));
                    }
                    return null;
                }
            });
            for (Integer cityId : cityIds) {
                sql = "select id from area where parent_id=" + cityId;
                QueryRunner.queryResultSet(conn, sql, new ResultSetHandler<Object>() {
                    @Override
                    public Object handle(ResultSet rs) throws Exception {
                        while (rs.next()) {
                            allIds.add(rs.getInt("id"));
                        }
                        return null;
                    }
                });
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        StringBuilder result = new StringBuilder();
        result.append("(");
        int size = allIds.size();
        for (int i = 0; i < size; i++) {
            result.append(allIds.get(i));
            if (i == size - 1) {
                result.append(")");
            } else {
                result.append(",");
            }
        }
        return result.toString();
    }

    public JSONObject getUserInfo() {
        Connection conn = getConn();
        Map<String, Object> map = new HashMap<String, Object>();
        RequestWrapper request = ApplicationManager.getRequest();
        String userId = request.getParameter("userId");
        String sql = "select u.department, u.emp_type, u.hometown, u.org, u.house, u.car, u.nation, u.user_id, u.nick_name, u.note, u.gender, u.birthday, u.marriage_state, u.height, i.img_path from user u,image i where u.is_effective=1 and u.user_id=i.user_id and i.img_type=0 and u.user_id=" + userId;
        JSONObject json;
        try {
            ArrayList userList = (ArrayList) QueryRunner.queryResultSet(conn, sql, new ResultSetHandler<Object>() {
                @Override
                public Object handle(ResultSet rs) throws Exception {
                    ArrayList<YftkUser> list = new ArrayList<YftkUser>();
                    YftkUser yftkUser;
                    while (rs.next()) {
                        yftkUser = new YftkUser();
                        yftkUser.setEmp_type(rs.getInt("emp_type"));
                        yftkUser.setDepartment(rs.getString("department"));
                        yftkUser.setHometown(rs.getInt("hometown"));
                        yftkUser.setOrg(rs.getInt("org"));
                        yftkUser.setHouse(rs.getInt("house"));
                        yftkUser.setCar(rs.getInt("car"));
                        yftkUser.setNation(rs.getString("nation"));
                        yftkUser.setUser_id(rs.getInt("user_id"));
                        yftkUser.setNick_name(rs.getString("nick_name"));
                        yftkUser.setNote(rs.getString("note"));
                        yftkUser.setGender(rs.getInt("gender"));
                        yftkUser.setBirthday(rs.getString("birthday"));
                        yftkUser.setMarriage_state(rs.getInt("marriage_state"));
                        yftkUser.setHeight(rs.getInt("height"));
                        yftkUser.setImg_path(rs.getString("img_path"));
                        Date start = new SimpleDateFormat("yyyy-MM-dd").parse(rs.getString("birthday"));
                        Date end = new Date();
                        Calendar c1 = Calendar.getInstance();
                        Calendar c2 = Calendar.getInstance();
                        c1.setTime(start);
                        c2.setTime(end);
                        int year1 = c1.get(Calendar.YEAR);
                        int year2 = c2.get(Calendar.YEAR);
                        yftkUser.setAge(year2 - year1);
                        list.add(yftkUser);
                    }
                    return list;
                }
            });
            map.put("header", new Header(0, "success"));
            map.put("body", new HashMap());
            json = (JSONObject) JSON.toJSON(map);
            json.getJSONObject("body").put("total", userList.size());
            json.getJSONObject("body").put("rows", userList);
        } catch (Exception e) {
            e.printStackTrace();
            map.put("header", new Header(-1, "fail"));
            map.put("errorMsg", e.getMessage());
            json = (JSONObject) JSON.toJSON(map);
            return json;
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        return json;
    }

    public JSONObject getDistricts() {
        Connection conn = getConn();
        Map<String, Object> map = new HashMap<String, Object>();
        String sql = "select id,name from area where type = 'province'";
        JSONObject json;
        try {
            ArrayList userList = (ArrayList) QueryRunner.queryResultSet(conn, sql, new ResultSetHandler<Object>() {
                @Override
                public Object handle(ResultSet rs) throws Exception {
                    ArrayList<Province> list = new ArrayList<Province>();
                    Province province;
                    while (rs.next()) {
                        province = new Province();
                        province.setId(rs.getInt("id"));
                        province.setName(rs.getString("name"));
                        list.add(province);
                    }
                    return list;
                }
            });
            map.put("header", new Header(0, "success"));
            map.put("body", new HashMap());
            json = (JSONObject) JSON.toJSON(map);
            json.getJSONObject("body").put("total", userList.size());
            json.getJSONObject("body").put("rows", userList);
        } catch (Exception e) {
            e.printStackTrace();
            map.put("header", new Header(-1, "fail"));
            map.put("errorMsg", e.getMessage());
            json = (JSONObject) JSON.toJSON(map);
            return json;
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        return json;
    }

    public JSONObject getParamCodes() {
        Connection conn = getConn();
        Map<String, Object> map = new HashMap<String, Object>();
        RequestWrapper request = ApplicationManager.getRequest();
        String sql = "select code_type, code, code_value from code where code_type in ('degree','org')";
        JSONObject json;
        try {
            ArrayList userList = (ArrayList) QueryRunner.queryResultSet(conn, sql, new ResultSetHandler<Object>() {
                @Override
                public Object handle(ResultSet rs) throws Exception {
                    ArrayList<ParamCode> list = new ArrayList<ParamCode>();
                    ParamCode paramCode;
                    while (rs.next()) {
                        paramCode = new ParamCode();
                        paramCode.setCodeType(rs.getString("code_type"));
                        paramCode.setCode(rs.getInt("code"));
                        paramCode.setCodeValue(rs.getString("code_value"));
                        list.add(paramCode);
                    }
                    return list;
                }
            });
            map.put("header", new Header(0, "success"));
            map.put("body", new HashMap());
            json = (JSONObject) JSON.toJSON(map);
            json.getJSONObject("body").put("total", userList.size());
            json.getJSONObject("body").put("rows", userList);
        } catch (Exception e) {
            e.printStackTrace();
            map.put("header", new Header(-1, "fail"));
            map.put("errorMsg", e.getMessage());
            json = (JSONObject) JSON.toJSON(map);
            return json;
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        return json;
    }
}