package com.report;

import com.opensymphony.xwork2.ActionSupport;

import java.io.File;

/**
 * Created by Kent hilton on 14-4-10.
 */

/**
 * 处理多个附件下载
 */
public class MultiFileDownloadAction extends ActionSupport {
    private static final long serialVersionUID = 2743077909387361587L;
    //接收JSP页面传递过来的附件的路径
    private String attachmentPath;
    //最终压缩后的zip文件的路径，传递给通用的下载Action
    private String fileName;

    /**
     *下载多个附件
     * 实现：将多个附件压缩成zip包，然后再下载zip包
     */
    public String downloadMultiFile(String path) throws Exception {
        //使用当前时间生成文件名称
        //String formatDate=new SimpleDateFormat("yyyyMMddHHmmssSSS").format(new Date());
        //压缩后的zip文件存放路径
        String[] name1=attachmentPath.split("\\\\");
        String name=name1[name1.length-1];
        fileName = path+name+".zip";
        System.out.println(fileName);

        CompressBook compressBook=new CompressBook();
        DeleteFile deleteFile = new DeleteFile();

        if(attachmentPath!=null&&!"".equals(attachmentPath)){
            //将多个附件的路径存放取出
            String[] attachmentPathArray=attachmentPath.split(",");
            if(attachmentPathArray!=null&&attachmentPathArray.length>0){
                File[] files=new File[attachmentPathArray.length];
                for(int i=0;i<attachmentPathArray.length;i++){
                    if(attachmentPathArray[i]!=null){
                        File file=new File(attachmentPathArray[i].trim());
                        if(file.exists()){
                            files[i]=file;
                        }
                    }
                }
                //将多个附件压缩成zip
                compressBook.zip(attachmentPath,fileName);
                //压缩完成后删除文件
                deleteFile.deleteDirectory(attachmentPath);
            }
        }

        return SUCCESS;
    }
    public String getAttachmentPath() {
        return attachmentPath;
    }
    public void setAttachmentPath(String attachmentPath) {
        this.attachmentPath = attachmentPath;
    }
    public String getFileName() {
        return fileName;
    }
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

}
