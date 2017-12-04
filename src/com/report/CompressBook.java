package com.report;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.tools.zip.ZipEntry;
import org.apache.tools.zip.ZipOutputStream;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.regex.Pattern;

public class CompressBook {
    private Log log= LogFactory.getLog(this.getClass().getName());
    private static String ZIP_ENCODEING = "GBK";

    public CompressBook() {}

    /**
    * inputFile 输入一个文件夹
    * zipFileName 输出一个压缩文件夹
    */
    public void zip(String zipFileName, String inputFile)throws Exception{
        File file=new File(zipFileName);
        zip(inputFile,file);
    }
    private void zip(String zipFileName, File inputFile) throws Exception {
        log.debug("准备开始压缩...");
        // 未指定压缩文件名，默认为源文件
        if (zipFileName == null || zipFileName.equals("")){
            zipFileName = inputFile.getName();
        }
        // 添加".zip"后缀
        if (!zipFileName.endsWith(".zip")){
            zipFileName += ".zip";
        }
        // 创建文件夹
        String path = Pattern.compile("[\\/]").matcher(zipFileName).replaceAll(File.separator);
        int endIndex = path.lastIndexOf(File.separator);
        path = path.substring(0, endIndex);
        File file = new File(path);
        file.mkdirs();
        ZipOutputStream out = new ZipOutputStream(new FileOutputStream(zipFileName));
        out.setEncoding(ZIP_ENCODEING);
        zip(out, inputFile, "");
        out.close();
    }

    private void zip(ZipOutputStream out, File f, String base) throws Exception {
        if (f.isDirectory()) {
            File[] fl = f.listFiles();
            out.putNextEntry(new ZipEntry(base + "/"));
            base = base.length() == 0 ? "" : base + "/";
            for (int i = 0; i < fl.length; i++) {
                zip(out, fl[i], base + fl[i].getName());
            }
        }else {
            out.putNextEntry(new ZipEntry(base));
            FileInputStream in = new FileInputStream(f);
            int b;
            System.out.println(base);
            while ((b = in.read()) != -1) {
                out.write(b);
            }
            in.close();
        }
    }
}