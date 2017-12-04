import com.alibaba.fastjson.JSON;
import com.sunrise.foundation.dbutil.DBManager;
import com.sunrise.foundation.utils.RequestWrapper;
import com.sunrise.foundation.utils.StringUtil;
import com.sunrise.framework.commonquery.CommonQueryHelper;
import com.sunrise.framework.commonquery.config.Query;
import com.sunrise.framework.core.ApplicationManager;
import com.sunrise.framework.module.runtime.ModuleURL;
import com.sunrise.framework.struts2.Header;
import com.sunrise.framework.struts2.JsonObject;

import java.io.File;

public class Menu {

    private RequestWrapper request = ApplicationManager.getRequest();

    public ModuleURL test() {
        System.out.println("这是一个动态生成的Java12312312312323");
        return new ModuleURL("!rdcp~java/Common.success?message=返回ModuleURL");
    }

    public Object main() {
        String name = request.getParameter("name");

        return "Menu方法已经执行了，传入的参数："+name;
    }

    public Object string() {
        return "返回String示例";
    }

    public Object json(){
        return new JsonObject(new Header(100,"OK"),"操作成功，返回json");
    }

    public Object intTest() {
        return 2;
    }

    public Object doubleTest() {
        return 123334456.12312312323d;
    }

    public Object fuck(){
        return "请使用文明用语,   "+ApplicationManager.getRequest().getParameter("name");
    }
}