/**
 * @(#)DbjzUser.java 2017/7/1
 * 版权所有 (c) 2008-2017 广州市森锐电子科技有限公司
 *
 */
package com.bean;

/**
 * @author lxl
 * @version 1.0 2017/7/1
 * @since JDK1.6
 */
public class DbjzMember {
    int id;
    String account;
    String name;
    String gh;
    String sex;
    String rxsj;
    String rhsj;
    String bzqk;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGh() {
        return gh;
    }

    public void setGh(String gh) {
        this.gh = gh;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public String getRxsj() {
        return rxsj;
    }

    public void setRxsj(String rxsj) {
        this.rxsj = rxsj;
    }

    public String getRhsj() {
        return rhsj;
    }

    public void setRhsj(String rhsj) {
        this.rhsj = rhsj;
    }

    public String getBzqk() {
        return bzqk;
    }

    public void setBzqk(String bzqk) {
        this.bzqk = bzqk;
    }
}
