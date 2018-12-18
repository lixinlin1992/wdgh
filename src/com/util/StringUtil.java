package com.util;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;

import org.apache.log4j.Logger;

/**
 * 
 * <p>Title: StringUtil </p>
 * <p>Copyright: Copyright (c) 2015 </p>
 * <p>Description: 字符串数据处理工具类 </p>
 * 
 * @author LD
 * 
 * @date 2015-08-06
 */
public class StringUtil {

    private static Logger logger = Logger.getLogger(StringUtil.class);

    public static boolean isEmpty(String str) {
        return null == str || str.trim().length() == 0;
    }

    public static boolean isEmptyOrNull(Object... objects) {
        for (Object o : objects) {
            if (null == o || o.toString().trim().length() == 0) {
                return true;
            }
        }
        return false;
    }

    public static String readStream(InputStream in, String charset) {
        StringBuffer sb = new StringBuffer();
        try {
            Reader r = new InputStreamReader(in, charset);
            int length = 0;
            for (char[] c = new char[1024]; (length = r.read(c)) != -1;) {
                sb.append(c, 0, length);
            }
            r.close();
            return sb.toString();
        } catch (Exception e) {
            logger.error(String.format("Read stream to string error: %s", e.getMessage()), e);
            return null;
        }
    }
}
