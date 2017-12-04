package com.report;

import static com.report.ReportImport.Import;

/**
 * Created by Kent hilton on 14-4-20.
 */
public class ReportDatabase {
    public void ReportDatabase(String path, String areaList, String[] reportList,String date,String quarter){
    	String s_year = date.substring(0, 4);
        String s_month = date.substring(4,6);
        
        System.out.println("syear      -->"+s_year+"<--      month      -->"+s_month+"$");
        for(int j=0;j<reportList.length;j++){
            if ("通信机房用电量台账".equals(reportList[j])){
                Import(path,"Q_HOUSE_ELEC_LIST",areaList,s_year,s_month,"通信机房用电量台账");
            }
            if ("基站节能减排技术应用情况".equals(reportList[j])){
                Import(path,"Q_ENERGY_SAVE_USED_LIST",areaList,s_year,s_month,"基站节能减排技术应用情况统计表");
            }
            if ("接入网机房节能减排技术应用情况".equals(reportList[j])){
                Import(path,"Q_NET_HOUSE_ENERGY_SAVE_USED_LIST",areaList,s_year,s_month,"接入网机房节能减排技术应用情况");
            }
            if ("IDC用电量汇总表".equals(reportList[j])){
                Import(path,"Q_EC_IDC_REPORT_LIST",areaList,s_year,s_month,"IDC用电量汇总表");
            }
            if ("通信局房用电量汇总新表".equals(reportList[j])){
                Import(path,"Q_COMMUNICATION_ENERGY_LIST",areaList,s_year,s_month,"通信局房用电量汇总新表");
            }
            if ("节能减排工作成效报表".equals(reportList[j])){
                Import(path,"Q_ENERGY_SAVE_LIST",areaList,s_year,s_month,"节能减排工作成效报表");
            }
            if ("节能设备后评价报表".equals(reportList[j])){
                Import(path,"Q_ENERGY_SAVE_PJ_LIST",areaList,s_year,quarter,"节能设备后评价报表");
            }
            if ("年新增年能应用机房汇总详表".equals(reportList[j])){
                Import(path,"Q_NEW_ADD_SAVED_ROOM_LIST",areaList,s_year,s_month,"年新增节能应用机房汇总详表");
            }
            if ("通信机房环境温度管理情况汇总".equals(reportList[j])){
                Import(path,"Q_TXJF_WD_MANAGE_LIST",areaList,s_year,s_month,"通信机房环境温度管理情况汇总");
            }
            if ("通信机房节能技术应用信息统计".equals(reportList[j])){
                Import(path,"Q_TXJF_HOUSE_ELEC_USED_LIST",areaList,s_year,s_month,"通信机房节能技术应用信息统计");
            }
            if ("年局站数量和耗电累计报表".equals(reportList[j])){
                Import(path,"Q_JUZ_NUM_ELEC_SUM_LIST",areaList,s_year,s_month,"年局站数量和耗电累计报表");
            }
            if ("地市基站用电量汇总".equals(reportList[j])){
                Import(path,"Q_PROP_MONTH_POWER_COLLECT_LIST",areaList,s_year,s_month,"地市基站用电量汇总");
            }
            if ("基站月用电量台账".equals(reportList[j])){
                Import(path,"Q_PROP_MONTH_POWER_LEDGER_LIST",areaList,s_year,s_month,"基站月用电量台账");
            }
            if ("接入网机房月用电量台账".equals(reportList[j])){
                Import(path,"Q_EC_NET_HOUSE_MONTH_REPORT_LIST",areaList,s_year,s_month,"接入网机房月用电量台账");
            }
            if ("地市接入网机房用电量汇总".equals(reportList[j])){
                Import(path,"Q_EC_AREA_NET_HOUSE_ELEC_ALL_LIST",areaList,s_year,s_month,"地市接入网机房用电量汇总");
            }
            if ("基站月用电量总分析报表".equals(reportList[j])){
                Import(path,"Q_PROP_ELEC_ALL_FX_LIST",areaList,s_year,s_month,"基站月用电量汇总分析报表");
            }
            if ("基站节能设备单载频能耗评估".equals(reportList[j])){
                Import(path,"Q_PROP_ES_USED_PG_LIST",areaList,s_year,s_month,"基站节能设备单载频能耗评估");
            }
        }
    }
}
