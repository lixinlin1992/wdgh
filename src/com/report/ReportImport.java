package com.report;


import com.sunrise.foundation.dbutil.DBException;
import com.sunrise.framework.commonquery.QueryContext;
import com.sunrise.framework.commonquery.config.Query;
import com.sunrise.framework.core.Log;

import java.io.*;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Kent hilton on 14-4-18.
 */


public class ReportImport {
    public static void Import(String path,String database,String areaList,String year,String month,String reportName){
        //使用Unirest工具类
//        HttpResponse<InputStream> resp = null;
        System.out.println("database   -->"+database+"<--     path     -->"+path);
        
        try {
        	System.out.println("syear      -->"+year+"<--      month   -->"+month+"<--     sareaid   -->"+areaList);
            String fileName =reportName;
            String fullPath = path+"\\"+fileName+".xls";
            System.out.println(fullPath);
            FileOutputStream out=new FileOutputStream(fullPath);
            QueryContext cxt = QueryContext.create();
            Map<String, Object> params = new HashMap<String, Object>();
            params.put("s_year", year);
            params.put("s_month", month);
            params.put("s_area_id", areaList);
            
            cxt.set(QueryContext.CONTEXT_OUT_STREAM,out);
            Query.file("!property/warnReport/~query/downloads/"+database,database).execute(params,cxt);
            out.close();
            Log.debug("NET导出成功");

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (DBException e) {
            e.printStackTrace();
        } catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
    }
}
