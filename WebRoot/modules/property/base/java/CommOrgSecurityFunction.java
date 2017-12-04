/**
 * @(#)CommOrgSecurityFunction.java 11-5-16
 * CopyRight 2011.  All rights reserved
 *
 */

import com.sunrise.foundation.utils.StringUtil;
import com.sunrise.framework.commonquery.QueryContext;
import com.sunrise.framework.commonquery.func.EvalResult;
import com.sunrise.framework.commonquery.func.FunctionHelper;
import com.sunrise.framework.commonquery.func.FunctionParam;
import com.sunrise.framework.commonquery.func.IQueryFunction;
import com.sunrise.framework.core.LoginUser;
import com.sunrise.framework.core.LoginUserSession;
import com.sunrise.framework.module.ModuleException;
import com.sunrise.framework.module.addon.IModuleInitAddon;
import com.sunrise.framework.module.runtime.Module;
import com.sunrise.service.security.entity.SysPUser;

import javax.servlet.http.HttpServletRequest;

/**
 * 机构/区域授权函数
 * 使用：
 * [commorg(字段名,用户ID,是否继承部门权限)]
 * <p/>
 * 参数说明：
 * 字段名：在查询中，用以关联机构区域的字段，如有别名，需要提供别名。该参数必需提供
 * 用户ID：用户ID，如果不指定，将自动从session中获取。传入null表示不指定
 * 是否继承部门权限：默认继承，如不需要继承，请传入false
 *
 * @author kinz
 * @version 1.0 11-5-16
 * @since JDK1.6
 */
public class CommOrgSecurityFunction implements IQueryFunction,IModuleInitAddon {

    @Override
    public void init(Module module) throws ModuleException {
        FunctionHelper.registerFunction(this);
    }

    @Override
    public void unInit(Module module) throws ModuleException {

    }

    public String getName() {
        return "commorg";
    }

    public EvalResult eval(QueryContext cxt, FunctionParam... params) throws Exception {
        EvalResult result = new EvalResult();

        String field = null;
        Long userId = null;
        Boolean extend = null;

        if (params.length < 1)
            throw new Exception("必需提供字段参数");
        field = params[0].getName();
        if (StringUtil.isNull(field))
            throw new Exception("必需提供字段参数");

        if (params.length > 1)
            userId = StringUtil.getLong(params[1].getName());

        if (userId == null) {
            LoginUser user = LoginUserSession.getLoginUserInfo();
            if (user != null)
                userId = user.getId();
        }

        if (userId == null) {
            HttpServletRequest request = (HttpServletRequest) cxt.get(QueryContext.CONTEXT_REQUEST);
            if (request != null) {
                SysPUser user = (SysPUser) request.getSession().getAttribute(LoginUserSession.UserSession_Key);
                if (user != null)
                    userId = user.getId();
            }
        }

        if (userId == null)
            userId = StringUtil.getLong(StringUtil.valueOf(cxt.getParams().get("_userId")));

        if (userId == null)
            throw new Exception("无法获取到当前的用户信息，请在函数中提供，或者在参数中提供 _userId 参数");

        if (params.length > 2)
            extend = StringUtil.getBoolean(params[2].getName());
        if (extend == null)
            extend = true;

        StringBuilder sb = new StringBuilder();
        sb.append(field).append(" IN (SELECT ORG_ID FROM SYS_P_USER_ORG WHERE USER_ID=? ");
        if (extend)
            sb.append(
                    " UNION ALL SELECT dog.ORG_ID FROM SYS_P_DEPT_ORG dog INNER JOIN SYS_P_USER u ON u.DEPT_ID=dog.DEPT_ID AND u.ID=? " +
                            " WHERE NOT EXISTS (SELECT ORG_ID FROM SYS_P_USER_ORG WHERE USER_ID=?) ");
        sb.append(")");

        result.setEvalSql(sb.toString());
        //result.setEvalParam(extend ? new Long[]{userId, userId} : userId);
        if (extend)
            result.setEvalParam(new Object[]{userId,userId, userId});
        else
            result.setEvalParam(userId);

        return result;
    }


}
