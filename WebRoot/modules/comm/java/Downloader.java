import com.sunrise.foundation.file.FileUtil;
import com.sunrise.foundation.utils.RequestWrapper;
import com.sunrise.foundation.utils.StringUtil;
import com.sunrise.framework.core.ApplicationManager;
import com.sunrise.service.file.FileHelper;
import com.sunrise.service.file.UploadFileBean;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.DataInputStream;
import java.io.FileInputStream;

public class Downloader {

    public void get() throws Exception {
        RequestWrapper request = ApplicationManager.getRequest();
        String id = request.getParameter("id");

        UploadFileBean file = FileHelper.get(id);


        HttpServletResponse response = ApplicationManager.getResponse();

        System.out.println(file.getName());

        response.setHeader("Content-Disposition", "inline; filename=\"" + new String(file.getName().getBytes(), "ISO8859-1") + "\"");
        response.setContentType("application/octet-stream");

        int bytes = 0;
        ServletOutputStream op = response.getOutputStream();
        byte[] bbuf = new byte[1024];
        DataInputStream in = null;
        if (!StringUtil.isNull(request.getParameter("type"))){
            response.setContentType(FileUtil.getType(file.getThumbFile().getName()));
            response.setContentLength((int) file.getThumbFile().length());
            in = new DataInputStream(new FileInputStream(file.getThumbFile()));}
        else{
            response.setContentType(FileUtil.getType(file.getFile().getName()));
            response.setContentLength((int) file.getFile().length());
            in = new DataInputStream(new FileInputStream(file.getFile()));
        }
        while ((in != null) && ((bytes = in.read(bbuf)) != -1)) {
            op.write(bbuf, 0, bytes);
        }
        in.close();
        op.flush();
        op.close();
    }
}