package com.launch;

import com.sunrise.foundation.service.ServiceLauncher;
import com.sunrise.framework.core.DefaultInit;

import javax.servlet.FilterConfig;
import javax.servlet.ServletException;

public class LogicInfoLauncher extends DefaultInit {
	public void init(FilterConfig args0) throws ServletException {
		new ServiceLauncher().launchService("LogicInfoUpdate.ini");
	}
}
