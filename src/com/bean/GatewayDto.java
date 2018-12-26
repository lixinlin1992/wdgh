package com.bean;

public class GatewayDto {
	
	private String business_channel;
	private String orderno;
	private String amt;
	private String feename;
	private String back_notify_url;
	private String front_notify_url;

	public String getBusiness_channel() {
		return business_channel;
	}

	public void setBusiness_channel(String business_channel) {
		this.business_channel = business_channel;
	}

	public String getOrderno() {
		return orderno;
	}

	public void setOrderno(String orderno) {
		this.orderno = orderno;
	}

	public String getAmt() {
		return amt;
	}

	public void setAmt(String amt) {
		this.amt = amt;
	}

	public String getFeename() {
		return feename;
	}

	public void setFeename(String feename) {
		this.feename = feename;
	}

	public String getBack_notify_url() {
		return back_notify_url;
	}

	public void setBack_notify_url(String back_notify_url) {
		this.back_notify_url = back_notify_url;
	}

	public String getFront_notify_url() {
		return front_notify_url;
	}

	public void setFront_notify_url(String front_notify_url) {
		this.front_notify_url = front_notify_url;
	}

	public GatewayDto(String business_channel, String orderno, String amt, String feename, String back_notify_url, String front_notify_url){
		this.business_channel = business_channel;
		this.orderno = orderno;
		this.amt = amt;
		this.feename = feename;
		this.back_notify_url = back_notify_url;
		this.front_notify_url = front_notify_url;
	}
}
