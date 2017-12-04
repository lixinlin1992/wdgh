import com.sunrise.foundation.utils.RequestWrapper;
import com.sunrise.foundation.utils.StringUtil;
import com.sunrise.framework.core.ApplicationManager;
import com.sunrise.framework.struts2.Header;
import com.sunrise.framework.struts2.JsonObject;
import com.sunrise.service.file.FileHelper;
import com.sunrise.service.file.UploadFileBean;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Uploader {

    /**
     * <pre>
     *     上传文件。
     * </pre>
     *
     * @throws Exception
     */
    public void upload() throws Exception {
        RequestWrapper request = ApplicationManager.getRequest();
        Map<String, String> params = new HashMap<String, String>(0);

        ServletFileUpload fileUploader = new ServletFileUpload(new DiskFileItemFactory());
        List<FileItem> items = fileUploader.parseRequest(request);

        // 获取post过来的参数
        for (FileItem item : items) {
            if (item.isFormField()) {
                params.put(item.getFieldName(), item.getString());
            }
        }
        System.out.println(params.get("busiId")+","+params.get("busiType"));
        if (StringUtil.isNull(params.get("busiId")) || StringUtil.isNull(params.get("busiType"))) {
            //TODO 没有指定业务编号，抛异常通知前端
            return;
        }

        JSONArray json = new JSONArray();
        for (FileItem item : items) {
            if (!item.isFormField()) {
                String fileName = item.getName();
                if (fileName.indexOf(":") >= 0)
                    fileName = fileName.substring(fileName.lastIndexOf(File.separator), fileName.length());
                System.out.println(fileName);
                File file = new File(FileHelper.getUploadPath() + File.separator + fileName);
                item.write(file);

                UploadFileBean uploadFile = FileHelper.upload(params.get("busiId"), params.get("busiType"), file, "");
                JSONObject jsono = new JSONObject();
                jsono.put("id", uploadFile.getId());
                jsono.put("name", fileName);
                jsono.put("size", item.getSize());
                jsono.put("url", "!service/file/~java/Downloader.get?id=" + uploadFile.getId());
                if (FileHelper.getKind(file).equals("picture"))
                    jsono.put("thumbURL", "!service/file/~java/Downloader.get?type=thumb&id=" + uploadFile.getId());
                else
                    jsono.put("thumbURL", FileHelper.getThumbUrl(file));
                jsono.put("delUrl", "!service/file/~java/Uploader.del?id=" + uploadFile.getId());
                json.put(jsono);

                file.delete();
            }
        }
        ApplicationManager.getResponse().getWriter().write(json.toString());
    }

    public JsonObject del() throws Exception {
        RequestWrapper request = ApplicationManager.getRequest();
        UploadFileBean file = FileHelper.get(request.getParameter("id"));
        FileHelper.del(file.getId());
        file.getFile().delete();
        file.getThumbFile().delete();
        return new JsonObject(new Header(0, "success"), "");
    }
}