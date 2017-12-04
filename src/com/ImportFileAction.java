package com;
import java.io.File;
import java.util.HashMap;
import java.util.Map;

import com.sunrise.framework.struts2.BaseAction;
import com.sunrise.framework.struts2.Header;
import com.sunrise.framework.struts2.JsonObject;
import com.sunrise.service.upload.uploadHelper;
import com.tool.ImageHandler;

/**
 * @author 欧顺平
 *
 */
public class ImportFileAction extends BaseAction {
	private File[] file;
	private String[] fileName;
	private String note[];

	//对应个主表的order_id
	private long import_order_id;
	//各主表的tableName
	private String table_name;
	private String longitude;
	private String latitude;
	private String time;

	public JsonObject importInfo() throws Exception {
		System.out.println("开始上传文件。。。。。。。");
		Map<String,Object> resultMap = new HashMap<String, Object>();
		if (fileName != null) {
			uploadHelper.uploadFile(file, fileName, note, table_name+"_"+import_order_id,
					import_order_id);
		}
		System.out.println("文件上传结束。。。。。。。");
		return new JsonObject(new Header(0, "success"), resultMap.put("msg", "成功"));
	}

	public JsonObject importMarkInfo() throws Exception {
		System.out.println("开始上传文件。。。。。。。");
		System.out.println("开始添加水印。。。。。。。");
		System.out.println("经度:"+longitude+",纬度："+latitude+"时间:time");
		ImageHandler.addMarkToImg(longitude,latitude,time,file);
		System.out.println("成功添加水印。。。。。。。");
		Map<String,Object> resultMap = new HashMap<String, Object>();
		if (fileName != null) {
			uploadHelper.uploadFile(file, fileName, note, table_name+"_"+import_order_id,
					import_order_id);
		}
		System.out.println("文件上传结束。。。。。。。");
		return new JsonObject(new Header(0, "success"), resultMap.put("msg", "成功"));
	}

	public File[] getFile() {
		return file;
	}

	public void setFile(File[] file) {
		this.file = file;
	}

	public String[] getNote() {
		return note;
	}

	public void setNote(String[] note) {
		this.note = note;
	}

	public String[] getFileFileName() {
        return fileName;
    }

    public void setFileFileName(String[] fileName) {
        this.fileName = fileName;
    }

	public long getImport_order_id() {
		return import_order_id;
	}

	public void setImport_order_id(long import_order_id) {
		this.import_order_id = import_order_id;
	}

	
	public String getTable_name()
	{
		return table_name;
	}

	public void setTable_name(String table_name)
	{
		this.table_name = table_name;
	}
	public void setLongitude(String longitude){
		this.longitude = longitude;
	}
	public String getLongitude(){
		return this.longitude;
	}
	public void setLatitude(String latitude){
		this.latitude = latitude;
	}
	public String getLatitude(){
		return this.latitude;
	}
	public void setTime(String time){
		this.time = time;
	}
	public String getTime(){
		return this.time;
	}
	@Override
	protected String defaultAction() throws Exception {
		return null;
	}

}
