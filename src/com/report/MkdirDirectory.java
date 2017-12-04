package com.report;

import java.io.File;

public class MkdirDirectory {
    //创建文件夹
    public File createDir(String path) {
        File dirFile = null;
        try {
            dirFile = new File(path);
            if (!(dirFile.exists()) && !(dirFile.isDirectory())) {
                dirFile.mkdirs();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return dirFile;
    }
    //获取相对路径
    public String getPath()
    {
        String path;
        File file=new File("");
        path=file.getAbsolutePath();
        path=path+("\\Main\\WebContent\\WEB-INF");
        return path;
    }
}