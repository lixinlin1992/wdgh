import com.sunrise.foundation.utils.ParamStringUtil;
import com.sunrise.foundation.utils.RequestWrapper;
import com.sunrise.framework.core.Constants;
import com.sunrise.framework.module.ModuleException;
import com.sunrise.framework.module.addon.impl.DefaultSecurity;
import com.sunrise.framework.module.dispatch.IDispatch;
import com.sunrise.framework.module.dispatch.http.HttpDispatch;
import com.sunrise.framework.module.dispatch.http.HttpDispatchFeature;
import com.sunrise.framework.module.res.IResource;
import com.sunrise.framework.module.res.IResourceDispatcher;
import com.sunrise.framework.module.res.IResourceManager;
import com.sunrise.framework.module.res.IResourceType;
import com.sunrise.framework.module.runtime.Module;
import com.sunrise.framework.module.runtime.ModuleManager;
import com.sunrise.framework.module.runtime.ModuleURL;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.lang.Override;
import java.lang.String;
import java.util.Map;

/**
 * 实现遗留权限的控制
 */
public class LegacyResourceType implements IResourceType, IResourceManager, IResourceDispatcher {

    @Override
    public String getCode() {

        return "legacy";
    }

    @Override
    public String getName() {
        return "遗留资源访问接口";
    }

    @Override
    public IResourceManager getManager() {
        return this;
    }

    @Override
    public String getResourceLocation(ModuleURL url) {
        File loc = getResourceFile(url);
        return loc == null ? "" : loc.getAbsolutePath();
    }

    @Override
    public File getResourceFile(ModuleURL url) {
        String path = url.getResourcePath();
        if (path.startsWith("framework.do"))
            return null;

        return new File(Constants.getWebRoot(), path);
    }

    @Override
    public IResourceDispatcher getDispatcher(IDispatch dispatch) {
        return this;
    }

    @Override
    public IResource get(ModuleURL url) throws ModuleException {
        Module m = ModuleManager.instance().getModule(url.getModulePath());
        if (m == null || !m.getConfig().hasOption("params", "LegacySupportFlag"))
            return null;
        return new LegacyResource(url);
    }

    @Override
    public void init(Map params) throws ModuleException {

    }

    @Override
    public void dispatch(IResource resource, IDispatch dispatch) throws ModuleException {
        try {
            HttpDispatchFeature fe = (HttpDispatchFeature) dispatch.getFeature(null);

            RequestWrapper request = fe.getRequest();
            HttpServletResponse response = fe.getResponse();

            String url = ((LegacyResource) resource).getUrl().getResourcePath();
            if (url.startsWith("framework.do")) {
                String qryStr = null;
                int idx = url.indexOf("/");

                if (idx > 0)
                    qryStr = url.substring(idx + 1);


                url = "framework.do?" + qryStr.replaceAll("/", "&");
            }
            url = request.getContextPath() + "/" + url;
            System.out.println("===========================" + url);

            response.sendRedirect(url);

//            String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
//
//            request.setRequestUrl(basePath + request.getContextPath() + url);
//            request.setRequestUri(request.getContextPath() + url);
//
//            request.getRequestDispatcher(url).forward(request, response);
        } catch (Exception ex) {
            ex.printStackTrace();
            throw new ModuleException("M-00010", ex);
        }
    }

    class LegacyResource implements IResource {
        //private String resourceUrl;
        private ModuleURL url;

//        LegacyResource(String resourceUrl) {
//            this.resourceUrl = resourceUrl;
//        }

        LegacyResource(ModuleURL url) {
            this.url = url;
        }

        @Override
        public IResourceType getType() {
            return LegacyResourceType.this;
        }

        @Override
        public ModuleURL getUrl() {
            return this.url;
        }
    }
}