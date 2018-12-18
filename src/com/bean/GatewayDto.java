package com.bean;
public class GatewayDto {
	
	private String business_channel;
	private String orderno;
	private String amt;
	private String feename;
	private String back_notify_url;
	private String front_notify_url;
	public GatewayDto(String business_channel,String orderno,String amt,String feename,String back_notify_url,String front_notify_url){
		this.business_channel = business_channel;
		this.orderno = orderno;
		this.amt = amt;
		this.feename = feename;
		this.back_notify_url = back_notify_url;
		this.front_notify_url = front_notify_url;
	}
}
