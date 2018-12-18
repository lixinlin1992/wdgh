package com.bean;
public class GatewayNotifyDto {

	private String type;
	private String status;
	private String union_order_no;
	private String orderno;
	private String amt;
	private String settledate;
	private String paytime;

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getUnion_order_no() {
		return union_order_no;
	}

	public void setUnion_order_no(String union_order_no) {
		this.union_order_no = union_order_no;
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

	public String getSettledate() {
		return settledate;
	}

	public void setSettledate(String settledate) {
		this.settledate = settledate;
	}

	public String getPaytime() {
		return paytime;
	}

	public void setPaytime(String paytime) {
		this.paytime = paytime;
	}
}
