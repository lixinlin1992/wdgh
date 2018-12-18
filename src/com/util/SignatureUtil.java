package com.util;

import org.apache.log4j.Logger;

import com.common.Constant;

/**
 * 
 * <p>Title: SignatureUtil </p>
 * <p>Copyright: Copyright (c) 2015 </p>
 * <p>Description: 签名处理工具类 </p>
 * 
 * @author LD
 * 
 * @date 2015-08-06
 */
public class SignatureUtil {

    private static Logger logger = Logger.getLogger(SignatureUtil.class);

    public static final String KEY_JOSN = "json";
    public static final String KEY_SIGNATURE = "signature";
    public static final String KEY_SIGN = "sign";

    /**
     * Sign data by json and signature
     * 
     * @param json
     * @return
     * @throws Exception
     */
    public static String sign(String json, String key) {
        return EncryptionUtil.md5EncryptOutHex(json + key);
    }

    /**
     * Assemble the signature of the string like: json=xxx&signature=xxx
     * 
     * @param jsonObj
     * @return
     * @throws Exception
     */
    public static String assembleJsonDefault(Object obj, String key) {
        String json = JsonMapper.getInstance().toJson(obj);
        String signature = sign(json, key);

        String result = KEY_JOSN + "=" + json + "&" + KEY_SIGNATURE + "=" + signature;
        logger.info(String.format("Assemble the signature of the string: %s", result));
        return result;
    }

    /**
     * Check signature by json and key
     * 
     * @param json
     * @param signature
     * @return
     * @throws Exception
     */
    public static boolean signCheck(String json, String key, String signature) {
        boolean status = EncryptionUtil.md5EncryptOutHex(json + key).equals(signature);
        logger.info("Signature check status：" + status);
        return status;
    }

    /**
     * 
     * @param json
     * @return
     */
    public static String getJsonValue(String json) {
        if (json.indexOf(KEY_JOSN) != -1 && (json.indexOf(KEY_SIGN) != -1 || json.indexOf(KEY_SIGNATURE) != -1)) {
            String[] arrs = json.split("&");
            String result = arrs[0].startsWith(KEY_JOSN) ? arrs[0] : arrs[1];
            String signature = arrs[0].startsWith(KEY_SIGN) || arrs[0].startsWith(KEY_SIGNATURE) ? arrs[0] : arrs[1];

            result = result.substring(result.indexOf("=") + 1);
            signature = signature.substring(signature.indexOf("=") + 1);

            if (!signCheck(result, Constant.keyInner, signature)) {
                throw new RuntimeException("Check signature error!");
            }
            return result;
        }
        return json;
    }

}
