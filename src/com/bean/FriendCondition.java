/**
 * @(#)FriendCondition.java 2017/9/23
 * 版权所有 (c) 2008-2017 广州市森锐电子科技有限公司
 *
 */
package com.bean;

/**
 * @author lxl
 * @version 1.0 2017/9/23
 * @since JDK1.6
 */
public class FriendCondition {
    int id;
    int user_id;
    int min_age;
    int max_age;
    int min_height;
    int max_height;
    int org;
    int degree;
    int marriage_state;
    String nation;
    String hometown;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public int getMin_age() {
        return min_age;
    }

    public void setMin_age(int min_age) {
        this.min_age = min_age;
    }

    public int getMax_age() {
        return max_age;
    }

    public void setMax_age(int max_age) {
        this.max_age = max_age;
    }

    public int getMin_height() {
        return min_height;
    }

    public void setMin_height(int min_height) {
        this.min_height = min_height;
    }

    public int getMax_height() {
        return max_height;
    }

    public void setMax_height(int max_height) {
        this.max_height = max_height;
    }

    public int getOrg() {
        return org;
    }

    public void setOrg(int org) {
        this.org = org;
    }

    public int getDegree() {
        return degree;
    }

    public void setDegree(int degree) {
        this.degree = degree;
    }

    public int getMarriage_state() {
        return marriage_state;
    }

    public void setMarriage_state(int marriage_state) {
        this.marriage_state = marriage_state;
    }

    public String getNation() {
        return nation;
    }

    public void setNation(String nation) {
        this.nation = nation;
    }

    public String getHometown() {
        return hometown;
    }

    public void setHometown(String hometown) {
        this.hometown = hometown;
    }
}
