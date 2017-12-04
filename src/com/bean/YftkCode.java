/**
 * @(#)YftkCode.java 2017/7/2
 * 版权所有 (c) 2008-2017 广州市森锐电子科技有限公司
 *
 */
package com.bean;

/**
 * @author lxl
 * @version 1.0 2017/7/2
 * @since JDK1.6
 */
public class YftkCode {
    String code_type;
    String code_value;
    int code;
    int parent_code;

    public String getCode_type() {
        return code_type;
    }

    public void setCode_type(String code_type) {
        this.code_type = code_type;
    }

    public String getCode_value() {
        return code_value;
    }

    public void setCode_value(String code_value) {
        this.code_value = code_value;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public int getParent_code() {
        return parent_code;
    }

    public void setParent_code(int parent_code) {
        this.parent_code = parent_code;
    }
}
