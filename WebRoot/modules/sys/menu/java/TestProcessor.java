import com.sunrise.framework.commonquery.QueryContext;
import com.sunrise.framework.commonquery.config.ProcessorInfo;
import com.sunrise.framework.commonquery.proc.IQueryProcessor;

import java.lang.Exception;
import java.lang.Override;
import java.lang.String;

public class TestProcessor implements IQueryProcessor{

    @Override
    public String getName() {
        return null;
    }

    @Override
    public void process(QueryContext cxt, ProcessorInfo info) throws Exception {
        System.out.println("------这是利用模块Java资源实现的一个查询处理器");
    }
}