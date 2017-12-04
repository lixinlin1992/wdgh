/**
 * @(#)DbjzNotice.java 2017/7/2
 * 版权所有 (c) 2008-2017 广州市森锐电子科技有限公司
 *
 */
package com.bean;

/**
 * @author lxl
 * @version 1.0 2017/7/2
 * @since JDK1.6
 */
public class DbjzNotice {
    int id;
    String title;
    String copy_from;
    int hits;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    String content;
    public String getPut_time() {
        return put_time;
    }

    public void setPut_time(String put_time) {
        this.put_time = put_time;
    }

    String put_time;
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCopy_from() {
        return copy_from;
    }

    public void setCopy_from(String copy_from) {
        this.copy_from = copy_from;
    }

    public int getHits() {
        return hits;
    }

    public void setHits(int hits) {
        this.hits = hits;
    }
}
