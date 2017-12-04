import com.sunrise.foundation.utils.RequestWrapper;
import com.sunrise.foundation.utils.StringUtil;
import com.sunrise.framework.core.ApplicationManager;
import com.sunrise.framework.core.LoginUserSession;
import com.sunrise.framework.core.SessionContext;
import com.sunrise.framework.module.runtime.ModuleURL;

import javax.servlet.http.HttpSession;
import java.lang.String;
import java.util.Map;

public class Logout {

    RequestWrapper request = ApplicationManager.getRequest();

    public Object main() {
        try {
            String sessionId = request.getParameter("session_id");
            String userId = request.getParameter("user_id");

            if (sessionId == null || sessionId.isEmpty() || userId == null || userId.isEmpty())
                return new ModuleURL("!rdcp~java/Common.fail?message=无法注销，参数不正确");

            Map<String, HttpSession> sessions = LoginUserSession.getUserSession(StringUtil.getLong(userId), null);

            for (HttpSession s : sessions.values()) {
                if (sessionId.equals(s.getId())) {
                    LoginUserSession.userLogout(s);
                    return new ModuleURL("!rdcp~java/Common.success?message=用户已经被强制注销");
                }
            }

            HttpSession session = SessionContext.get(sessionId);
            if (session != null) {
                LoginUserSession.userLogout(session);
                return new ModuleURL("!rdcp~java/Common.success?message=用户已经被强制注销");
            }

            return new ModuleURL("!rdcp~java/Common.fail?message=无法注销，未找到登录信息，请刷新列表");
        } catch (Exception ex) {
            return new ModuleURL("!rdcp~java/Common.fail?message=强制注销失败");
        }
    }
}