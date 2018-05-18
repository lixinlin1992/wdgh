/**
 * @(#)SiantAction.java 2017/9/21
 * 版权所有 (c) 2008-2017 广州市森锐电子科技有限公司
 *
 */
import com.alibaba.fastjson.JSONObject;
import com.siant.assp.ias.sp.saml11.principle.PrincipalAdapter;
import com.siant.assp.ias.sp.saml11.util.SPUtil;
import com.sunrise.foundation.dbutil.BeanListHandler;
import com.sunrise.foundation.dbutil.QueryRunner;
import com.sunrise.foundation.dbutil.ResultSetHandler;
import com.sunrise.foundation.utils.MD5Encryptor;
import com.sunrise.framework.commonquery.CommonQueryHelper;
import com.sunrise.framework.commonquery.QueryContext;
import com.sunrise.framework.core.LoginUser;
import com.sunrise.framework.core.LoginUserSession;
import com.sunrise.framework.core.UserGroup;
import com.sunrise.framework.spring.BaseAction;
import com.sunrise.framework.struts2.Header;
import com.sunrise.service.security.UserLogService;
import com.sunrise.service.security.entity.SysPUserGroup;
import com.sunrise.framework.struts2.JsonObject;

import java.lang.System;
import java.sql.ResultSet;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.sunrise.foundation.utils.RequestWrapper;
import com.sunrise.framework.core.ApplicationManager;

import javax.faces.application.Application;
import javax.servlet.http.HttpSession;
import org.jasig.cas.client.authentication.AttributePrincipal;
import java.security.Principal;
/**
 * @author lxl
 * @version 1.0 2017/9/21
 * @since JDK1.6
 */
public class LdapAction{

    public JsonObject loginByLdap() throws Exception{
        RequestWrapper request = ApplicationManager.getRequest();
        Map<String,Object> resultMap = new HashMap<String, Object>();
        //获取统一身份认证平台传回的人事号
        //PrincipalAdapter p = (PrincipalAdapter) SPUtil.getUserPrincipal(request);
        //String personNo = p.getName();
        String personNo = request.getParameter("personNo");
        System.out.println("personNo:"+personNo);
        //根据人事号获取用户信息
        UserLogService userLogService = new UserLogService();
        String sql = "select id,account,password from sys_p_user where account='"+personNo+"'";
        HashMap<String,Object> params = (HashMap)QueryRunner.queryResultSet(sql, new ResultSetHandler<Object>() {
            @Override
            public Object handle(ResultSet rs) throws Exception {
                HashMap<String, String> params = new HashMap<String, String>();
                while (rs.next()) {
                    params.put("user_id", rs.getString("id"));
                    params.put("loginName", rs.getString("account"));
                    params.put("password", rs.getString("password"));
                }
                return params;
            }
        });
        System.out.println("user_id:"+params.get("user_id"));
        if(params.get("user_id")==""||params.get("user_id")==null){
            return new JsonObject(new Header(-1, "用户不存在"), resultMap.put("msg", "用户不存在"));
        }
        //用获取的用户信息进行登录
        LoginUser user = (LoginUser) CommonQueryHelper.executeQuery("service/security/Q_FRAMEWORK_SERVICE_SECURITY.xml", "Q_LOGIN_USER_INFO", params, QueryContext.create());
        List userGroups = (List)CommonQueryHelper.executeQuery("service/security/Q_FRAMEWORK_SERVICE_SECURITY.xml", "Q_USER_GROUP_LIST", params, QueryContext.create(), new BeanListHandler(SysPUserGroup.class));
        System.out.println(userGroups.size());
        if(userGroups != null) {
            user.setUserGroups((UserGroup[])userGroups.toArray(new SysPUserGroup[userGroups.size()]));
        }
        System.out.println("userGroup load success");
        System.out.println("ip:"+request.getRemoteAddr());
        String user_ip1 = request.getRemoteAddr();
        user.setLoginTerminal("WEB");
        user.setLoginIp(user_ip1);
        user.setLoginTime(new Date());
        int loginCode = LoginUserSession.userLogin(user);
        System.out.println(loginCode);

        if(loginCode == 0){
            return new JsonObject(new Header(0, "统一认证成功"), resultMap.put("msg", "统一认证成功"));
        }
        else{
            return new JsonObject(new Header(-1, "统一认证失败"), resultMap.put("msg", "统一认证失败"));
        }
    }
    public static void main(String args[]) throws Exception{
        LdapAction ldapAction = new LdapAction();
        ldapAction.loginByLdap();
    }
}
