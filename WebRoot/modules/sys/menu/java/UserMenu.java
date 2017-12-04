import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.SerializeConfig;
import com.sunrise.foundation.utils.MD5Encryptor;
import com.sunrise.foundation.utils.RequestWrapper;
import com.sunrise.framework.core.ApplicationManager;
import com.sunrise.framework.core.LoginUser;
import com.sunrise.framework.core.LoginUserSession;
import com.sunrise.framework.module.addon.impl.DefaultSecurity;
import com.sunrise.framework.module.addon.impl.ModuleMenuInitAddon;

import java.util.ArrayList;
import java.util.List;

public class UserMenu {

    private RequestWrapper request = ApplicationManager.getRequest();
    private LoginUser user = LoginUserSession.getLoginUserInfo();
    private SerializeConfig config = new SerializeConfig();

    public UserMenu() {
        config.setAsmEnable(false);
    }

    /**
     * 获取用户当前有权限的菜单
     *
     * @return
     */
    public Object main() {
        try {
            String parentId = request.getParameter("parent_id");
            if (parentId == null || parentId.isEmpty())
                parentId = ModuleMenuInitAddon.getNum("/");

            List<ModuleMenuInitAddon.MenuInfo> tmp = ModuleMenuInitAddon.getSubMenu(parentId);
            //System.out.println("----------------------------------" + (tmp == null ? 0 : tmp.size()));
            //进行权限的检测
            List<ModuleMenuInitAddon.MenuInfo> subMenus = new ArrayList<ModuleMenuInitAddon.MenuInfo>();
            if (tmp != null)
                subMenus.addAll(tmp);

            for (int i = 0; i < subMenus.size(); i++) {
                ModuleMenuInitAddon.MenuInfo mi = subMenus.get(i);
                if (mi.getUrl() != null && !mi.getUrl().isEmpty() &&
                        DefaultSecurity.accessCheck(user, mi.getModuleUrl())) {
                    continue;
                } else if (getSubMenuCount(mi) > 0) {
                    continue;
                } else {
                    subMenus.remove(i);
                    i--;
                }
//                if (mi.getUrl() == null || mi.getUrl().isEmpty()) {
//                    //检查子菜单是否有权限
//                    if (getSubMenuCount(mi) <= 0) {
//                        subMenus.remove(i);
//                        i--;
//                    }
//                } else {
//                    if (!DefaultSecurity.accessCheck(user, mi.getModuleUrl())) {
//                        subMenus.remove(i);
//                        i--;
//                    }
//                }
            }

            JSONObject json = JSON.parseObject("{header:{code:0,message:''}}");
            json.put("body", subMenus == null ? new ArrayList<ModuleMenuInitAddon.MenuInfo>() : subMenus);
            return json;
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }

    private int getSubMenuCount(ModuleMenuInitAddon.MenuInfo m) {
        List<ModuleMenuInitAddon.MenuInfo> subMenus = ModuleMenuInitAddon.getSubMenu(m.getId());
        if (subMenus == null || subMenus.size() == 0)
            return 0;

        for (ModuleMenuInitAddon.MenuInfo i : subMenus) {
            if (i.getUrl() != null && !i.getUrl().isEmpty() && DefaultSecurity.accessCheck(user, i.getModuleUrl()))
                return 1;
            else if (getSubMenuCount(i) > 0)
                return 1;
        }
        return 0;
    }
}