/**
 * @(#)config.js 7/30/2015 16:50
 * CopyRight 2015.  All rights reserved
 *
 */
/**
 * User: kinz
 */

/**
 * 系统的配置文件
 * @type {{}}
 */
var APP_CONFIG = {
	APP_NAME: "湖南物业系统",
	//SERVER_URL: "http://sunrisetech.myftp.org:8401/esaleb-new/",
	//SERVER_URL:"http://192.168.100.166:8080/esaleb/",
	//SERVER_URL: "http://sunrisetech.myftp.org:8401/esaleb/",
	//SERVER_URL: "http://www.esaleb.com/",
	//SERVER_URL:"http://esw.esaleb.com/",//新版正式库web
	//SERVER_URL: "http://192.168.100.160:8080/esaleb/",
	//SERVER_URL:"http://sunrisetech.myftp.org:20081/",
	SERVER_URL: "http://192.168.31.137:8080/hnprop/",
	//SERVER_URL:"http://113.57.239.242:6100/esaleb/",
	//SERVER_URL: "http://localhost:8080/esaleb/",
	//SERVER_URL: "http://sunrisetech.myftp.org:8800/esaleb/",
	//LOGIN_PAGE: "ESale/Mall/UI/pages/login.html",
	LOGIn_PAGE: "Business/CellControl/pages/mainFunction.html",
	HOME_PAGE: "index.html#/home",

	OPERATOR: 'ESALEB',

	APP_URL_API: "http://www.pgyer.com/apiv1/app/viewGroup", //请求接口
	APP_AID_ANDROID: "52dd54ce187c7cc7a64a829acb5f35d2", //参数
	APP_API_KEY_ANDROID: "ed68187944cbd1c2bd479755e7cd176f", //参数
	APP_UPDATE_URL_ANDROID: "http://www.pgyer.com/apiv1/app/install?aId=52dd54ce187c7cc7a64a829acb5f35d2&_api_key=ed68187944cbd1c2bd479755e7cd176f", //下载地址

	APP_AID_IOS: "a3facebb1f19f84731e4664559ca3f21",
	APP_API_KEY_IOS: "ed68187944cbd1c2bd479755e7cd176f",
	APP_UPDATE_URL_IOS: "itms-services://?action=download-manifest&url=https%3A%2F%2Fwww.pgyer.com%2Fapiv1%2Fapp%2Fplist%3FaId%3Da3facebb1f19f84731e4664559ca3f21%26_api_key%3Ded68187944cbd1c2bd479755e7cd176f",

	//二合一设备管控系统接入帐号
	ACCESS_ACCOUNT: 'esaleb',
	ACCESS_PASSWORD: ''
};
