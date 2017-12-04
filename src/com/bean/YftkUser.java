/**
 * @(#)YftkUser.java 2017/7/2
 * 版权所有 (c) 2008-2017 广州市森锐电子科技有限公司
 *
 */
package com.bean;

/**
 * @author lxl
 * @version 1.0 2017/7/2
 * @since JDK1.6
 */
public class YftkUser {
    int user_id;
    String nick_name;//昵称
    int gender;//性别：1-男,0-女
    String birthday;//生日
    String sx;//生肖
    String nation;//民族
    int org;//学校-关联code表
    String department;//学院
    int height;//身高-关联code表
    int degree;//学历-关联code表
    int marriage_state;//婚姻状况-关联code表
    int hometown;//籍贯-关联area表
    int marriage_time;//想何时结婚-关联code表
    int emp_type;//职业类别-关联code表
    int salary;//月薪-关联code表
    int house;//居住情况-关联code表
    int car;//购车情况-关联code表
    int friend_status;//征友状态-关联code表,只有征友状态为“正在寻缘中”时，其他用户才能搜索到您
    String real_name;//真实姓名
    String email;//邮箱,登陆账号
    String phone;//手机号
    String qq;//qq号
    String note;//内心独白
    String img_path;//头像地址-关联image表，type为0
    int is_effective;//用户状态,1-有效
    int age;//年龄

    public int getIs_effective() {
        return is_effective;
    }

    public void setIs_effective(int is_effective) {
        this.is_effective = is_effective;
    }

    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public String getNick_name() {
        return nick_name;
    }

    public void setNick_name(String nick_name) {
        this.nick_name = nick_name;
    }

    public int getGender() {
        return gender;
    }

    public void setGender(int gender) {
        this.gender = gender;
    }

    public String getBirthday() {
        return birthday;
    }

    public void setBirthday(String birthday) {
        this.birthday = birthday;
    }

    public String getSx() {
        return sx;
    }

    public void setSx(String sx) {
        this.sx = sx;
    }

    public String getNation() {
        return nation;
    }

    public void setNation(String nation) {
        this.nation = nation;
    }

    public int getOrg() {
        return org;
    }

    public void setOrg(int org) {
        this.org = org;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
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

    public int getHometown() {
        return hometown;
    }

    public void setHometown(int hometown) {
        this.hometown = hometown;
    }

    public int getMarriage_time() {
        return marriage_time;
    }

    public void setMarriage_time(int marriage_time) {
        this.marriage_time = marriage_time;
    }

    public int getEmp_type() {
        return emp_type;
    }

    public void setEmp_type(int emp_type) {
        this.emp_type = emp_type;
    }

    public int getSalary() {
        return salary;
    }

    public void setSalary(int salary) {
        this.salary = salary;
    }

    public int getHouse() {
        return house;
    }

    public void setHouse(int house) {
        this.house = house;
    }

    public int getCar() {
        return car;
    }

    public void setCar(int car) {
        this.car = car;
    }

    public int getFriend_status() {
        return friend_status;
    }

    public void setFriend_status(int friend_status) {
        this.friend_status = friend_status;
    }

    public String getReal_name() {
        return real_name;
    }

    public void setReal_name(String real_name) {
        this.real_name = real_name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getQq() {
        return qq;
    }

    public void setQq(String qq) {
        this.qq = qq;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getImg_path() {
        return img_path;
    }

    public void setImg_path(String head_img) {
        this.img_path = head_img;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
