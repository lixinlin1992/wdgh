import com.sunrise.foundation.utils.MapBuilder;
import com.sunrise.framework.commonquery.config.Query;
import com.sunrise.framework.core.LoginUser;
import com.sunrise.framework.core.LoginUserSession;
import com.sunrise.framework.module.ModuleException;
import com.sunrise.framework.module.addon.IModuleInitAddon;
import com.sunrise.framework.module.addon.impl.SimpleResourceExcludeAddon;
import com.sunrise.framework.module.res.SimpleResourceType;
import com.sunrise.framework.module.runtime.Module;

import javax.servlet.http.HttpSession;
import java.io.File;
import java.lang.Override;

public class UserLogListenerAddon implements LoginUserSession.IUserLogListener, IModuleInitAddon {

    @Override
    public int login(LoginUser user, HttpSession session) {
        //记录登录日志到表: SYS_L_LOGIN
        try {
            Query.file("!rdcp/~query/USER_LOG", "USER_LOGIN")
                    .execute(MapBuilder.build().p("user_id", user.getId()).p("session_id", session.getId()).p(
                            "login_ip", user.getLoginIp()));
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return 0;
    }

    @Override
    public int logout(LoginUser user, HttpSession session) {
        //更新登录日志表: SYS_L_LOGIN，将注销时间设置为当前时间
        try {
            Query.file("!rdcp/~query/USER_LOG", "USER_LOGOUT").execute(
                    MapBuilder.build().p("session_id", session.getId()));
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return 0;
    }

    @Override
    public void init(Module module) throws ModuleException {
        LoginUserSession.registerListener(this);
        File location = module.getLocation();
        //排除普通转发
        SimpleResourceType.exclude(module.getPath(), new File(location, "querys"));
    }

    @Override
    public void unInit(Module module) throws ModuleException {
        LoginUserSession.unregisterListener(this);
    }
}