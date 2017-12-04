import com.alibaba.fastjson.JSONObject;
import com.sunrise.framework.core.ApplicationManager;
import com.sunrise.foundation.utils.StringUtil;

public class Common {

    public class Test{

    }

    public Object success() {
        new Test();
        JSONObject json = new JSONObject();

        String message = ApplicationManager.getRequest().getParameter("message");
        if (message == null || message.isEmpty())
            message = "操作成功";

        json.put("header", getHead(0, message));
        json.put("body", "");
        return json;
    }

    public Object fail() {
        JSONObject json = new JSONObject();

        String message = ApplicationManager.getRequest().getParameter("message");
        Integer code = StringUtil.getInt(ApplicationManager.getRequest().getParameter("code"));

        if (message == null || message.isEmpty())
            message = "操作失败";
        if (code == null)
            code = -1;

        json.put("header", getHead(code, message));

        return json;
    }

    private JSONObject getHead(int code, String message) {
        JSONObject h = new JSONObject();
        h.put("code", code);
        h.put("message", message);
        return h;
    }
}