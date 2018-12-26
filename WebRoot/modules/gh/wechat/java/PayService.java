//package WebRoot.modules.gh.wechat.java;
import com.alibaba.fastjson.JSONObject;
import com.bean.GatewayDto;
import com.bean.GatewayNotifyDto;
import com.common.Constant;
import com.sunrise.framework.core.ApplicationManager;
import com.sunrise.foundation.utils.RequestWrapper;
import com.util.JsonMapper;
import com.util.SignatureUtil;
public class PayService {
    public JSONObject pay(){
        RequestWrapper req = ApplicationManager.getRequest();
        String json = getJsonStr(req);
        String sign = SignatureUtil.sign(json, Constant.keyInner);
        /*
        这里要加入插入数据库订单表的操作
         */
        System.out.println("json:"+json);
        System.out.println("sign:"+sign);
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("json",json);
        jsonObject.put("sign",sign);
        return jsonObject;
    }

    public String getJsonStr(RequestWrapper req){
        String business_channel = req.getParameter("business_channel");
        String orderno = req.getParameter("orderno");
        String amt = req.getParameter("amt");
        String feename = req.getParameter("feename");
        String back_notify_url = req.getParameter("back_notify_url");
        String front_notify_url = req.getParameter("front_notify_url");

        return JsonMapper.getInstance().toJson(new GatewayDto(business_channel, orderno, amt, feename, back_notify_url, front_notify_url));
    }

    public void receivePayStatus(){
        try{
        RequestWrapper req = ApplicationManager.getRequest();
        //接收支付网关返回结果
        String json = req.getParameter("json");
        GatewayNotifyDto returnDto = JsonMapper.getInstance().toObject(json, GatewayNotifyDto.class);
        //返回支付网关状态，需要修改订单的支付状态
        if(returnDto.getStatus() == "00"){
            //系统做其他处理返回状态
            System.out.println("成功");
        }else{
            System.out.println("失败");
        }

    } catch (Exception e) {
        e.printStackTrace();
    }
    }
}