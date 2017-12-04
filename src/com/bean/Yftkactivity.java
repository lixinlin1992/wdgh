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
public class Yftkactivity {
    int activity_id;//活动id
    String sponsor;//负责人
    String subject;//活动主题
    String subject_pic;//主题照片
    String activity_time;//活动时间
    String contact;//联系
    String fee;//费用
    int sum_limit;//人数限制
    String address;//地址
    String content;//活动内容
    String launch_time;//发起时间
    String start_time;//开始时间
    String end_time;//截止时间



    public int getActivity_id()  { return activity_id; }

    public void setActivity_id(int activity_id) {this.activity_id = activity_id;}

    public String getSponsor() {
        return sponsor;
    }

    public void setSponsor(String sponsor) { this.sponsor = sponsor;}


    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject= subject;
    }

    public String getSubject_pic() {
        return subject_pic;
    }

    public void setSubject_pic(String subject_pic) { this.subject_pic = subject_pic;}

    public String getActivity_time() {
        return activity_time;
    }

    public void setActivity_time(String activity_time) {
        this.activity_time = activity_time;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact= contact;
    }

    public String getFee() {
        return fee ;
    }

    public void setFee(String fee ) {
        this.fee= fee;
    }

    public int getSum_limit() { return sum_limit;}

    public void setSum_limit(int sum_limit) {
        this.sum_limit = sum_limit;
    }


    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) { this.content = content;}

    public String getLaunch_time() {
        return launch_time;
    }

    public void setLaunch_time(String launch_time) {
        this.launch_time = launch_time;
    }

    public String getStart_time() {
        return start_time;
    }

    public void setStart_time(String start_time) {
        this.start_time= start_time;
    }

    public String getEnd_time() {
        return end_time;
    }

    public void setEnd_time(String end_time) {
        this.end_time = end_time;
    }

}
