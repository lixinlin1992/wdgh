import com.sunrise.foundation.utils.ClassUtils;
import com.sunrise.framework.module.ModuleException;
import com.sunrise.framework.module.addon.IModuleInitAddon;
import com.sunrise.framework.module.res.IResourceType;
import com.sunrise.framework.module.res.ResourceTypeFactory;
import com.sunrise.framework.module.runtime.Module;

import java.lang.Override;

public class LegacySupportAddon implements IModuleInitAddon {

    @Override
    public void init(Module module) throws ModuleException {
        try {
            ResourceTypeFactory
                    .registType(ClassUtils.instanceObj(IResourceType.class, "!rdcp/~java/LegacyResourceType"));
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        //在这里添加遗留资源的参数
        module.getConfig().set("params","LegacySupportFlag","1");
    }

    @Override
    public void unInit(Module module) throws ModuleException {

    }
}