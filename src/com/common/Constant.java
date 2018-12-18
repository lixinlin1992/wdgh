package com.common;

public class Constant {
	//加密签名
	public static String keyInner = "5bd0974c873d23086c0daaf5debebfe2";
	//接口访问地址
	public static String url = "http://wxpc.zhihuianxin.net:8073/paycenter";
	//支付接口名称
	public static String gateway_web_url = url + "/gateway_web";
	//退款接口名称
	public static String refund_url = url + "/refund";
	//总对账
	public static String balanceall = url + "/balanceall";
	//明细对账
	public static String balancedetail_url = url + "/balancedetail";
	//查询
	public static String query_url = url + "/query";

}