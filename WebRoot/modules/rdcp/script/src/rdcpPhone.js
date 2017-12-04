/**
 * rdcp.js<br>
 * RDCPJS的入口,该类主要负责定义及加载各种JS模块<br>
 * 由于该类在执行时还没引入jquery,因为jquery因是RDCPJS其中的一个模块<br>
 * 所以请不要在该类中使用任何jquery语法
 *
 * @author Cow
 * @date 2013-2-27
 */
var rdcp = {

    /**
     * 版本号<br>
     * 尾数为奇数则为测试版,尾数为偶数则为稳定版
     */
    version: 0.1,

    /**
     * baseScriptPath:从WebRoot开始,指定RDCPJS根目录.如:'scripts/RDCPJS/'<br>
     */
    baseScriptPath: '!rdcp/script/',

    /**
     * rdcpScriptPath:从baseScriptPath开始,指定rdcp.js的路径.<br>
     * 1. 'src/rdcp.js' 直接加载源码,方便调试.<br>
     * 2. 'rdcp.js' 加载单个文件,经过压缩,文件比较小适用于正式部署<br>
     */
    rdcpScriptPath: 'src/rdcp.js',

    /**
     * Ajax包含发送请求的url字符串
     */
    url: "framework.do",

    /**
     * 登录页面地址
     */
    loginPage: "pages/login.jsp",

    /**
     * 业务系统编码
     */
    syscode: "",

    /**
     * 默认加载模块
     */
    defaultLoadModules: [ 'rdcpui' ],

    /**
     * rdcp所有模块定义<br>
     * 所有模块定义在这里,如模块之间依赖关系,则需指定dependencies属性<br>
     */
    rdcpModules: {
        jquery: {
            js: [ 'lib/jquery/jquery-1.8.0.min.js' ]
        },
        locale: {
            js: [ 'src/locale/rdcp.lang.zh-cn.js' ]
        },
        rdcpcore: {
            js: ['lib/json/json2.js', 'src/core/rdcp.json.js', 'src/core/rdcp.string.js', 'src/core/rdcp.array.js',
                'src/core/rdcp.dom.js', 'src/core/rdcp.adapter.js', 'src/ajax/rdcp.ajax.js', 'src/core/rdcp.key.js'],
            dependencies: [  'locale', 'jquery' ]
        },
        easyui: {
            js: [ 'lib/easyui/jquery-easyui-1.3.3/jquery.easyui.min.js',
                'lib/easyui/jquery-easyui-1.3.3/plugins/jquery.combobox-bugfixed.js',
                'lib/easyui/jquery-easyui-1.3.3/locale/easyui-lang-zh_CN.js' ],
            css: [ 'lib/easyui/jquery-easyui-1.3.3/themes/gray/easyui.css'],
            dependencies: [ 'rdcpcore' ],
            onload: function (p) {
                jQuery.parser.parse();
            }
        },
        rdcpui: {
            js: [ 'src/ui/rdcp.window.js', 'src/ui/rdcp.tree.js', 'src/ui/rdcp.grid.js', 'src/ui/rdcp.dateBox.js', 'src/ui/rdcp.form.js',
                'src/ui/rdcp.comboBox.js', 'src/ui/rdcp.tips.js', 'src/ui/rdcp.menu.js', 'src/ui/rdcp.menu.lowerNavMenuBuilder.js',
                'src/ui/rdcp.mask.js', 'src/ui/rdcp.messages.js','src/ui/rdcp.dialog.js'],
            dependencies: [ 'locale', 'rdcpcore', 'easyui' ]
        },
        highcharts: {
            js: ['lib/highcharts/Highcharts-3.0.1/js/highcharts.js']
        },
        rdcpchart: {
            js: ['src/ui/rdcp.linechart.js'],
            dependencies: ['highcharts']
        }
    },

    rdcpLoadStatus: 'loading', // RDCP加载状态'ready', 'loading'

    /**
     * 模块加载信息
     */
    moduleLoadStatus: 'ready',// 模块加载状态'ready','loading'
    preLoadModules: [], // 预加载模块列表
    loadedModules: [], // 已加载模块列表

    /**
     * JS加载信息
     */
    jsLoadStatus: 'ready', // 模块加载状态'ready','loading'
    preLoadJS: [],// 预加载JS列表
    loadedJS: [],// 已加载JS列表

    /**
     * CSS加载信息
     */
    cssLoadStatus: 'ready',// 模块加载状态'ready','loading'
    preLoadCSS: [],// 预加载CSS列表
    loadedCSS: []// 已加载CSS列表

};

/**
 * 获取具体某个模块的加载状态
 *
 * @param p
 *            {moduleName:'jquery'}
 * @returns 'unload','loaded','loading'
 */
rdcp.getModuleStatus = function (p) {
    var moduleName = p.moduleName;

    for (var i = 0; i < rdcp.preLoadModules.length; i++) {
        if (rdcp.preLoadModules[i] == moduleName) {
            return 'loading';
        }
    }

    for (var i = 0; i < rdcp.loadedModules.length; i++) {
        if (rdcp.loadedModules[i] == moduleName) {
            return 'loaded';
        }
    }

    return 'unload';
};

/**
 * 获取具体某个JS的加载状态
 *
 * @param p
 *            {url:'lib/jquery/jquery-1.8.0.min.js'}
 * @returns 'unload','loaded','loading'
 */
rdcp.getScriptStatus = function (p) {
    var url = p.url;

    for (var i = 0; i < rdcp.preLoadJS.length; i++) {
        if (rdcp.preLoadJS[i] == url) {
            return 'loading';
        }
    }

    for (var i = 0; i < rdcp.loadedJS.length; i++) {
        if (rdcp.loadedJS[i] == url) {
            return 'loading';
        }
    }

    return 'unload';
};

/**
 * 获取具体某个CSS的加载状态
 *
 * @param p
 *            {url:'lib/easyui/jquery-easyui-1.3.2/themes/icon.css'}
 * @returns 'unload','loaded','loading'
 */
rdcp.getCSSStatus = function (p) {
    var url = p.url;

    for (var i = 0; i < rdcp.preLoadCSS.length; i++) {
        if (rdcp.preLoadCSS[i] == url) {
            return 'loading';
        }
    }

    for (var i = 0; i < rdcp.loadedCSS.length; i++) {
        if (rdcp.loadedCSS[i] == url) {
            return 'loading';
        }
    }

    return 'unload';
};

/**
 * 添加指定模块到预加载列表<br>
 *
 * @param p
 *            {modules:['jquery', 'easyui']}
 */
rdcp.addPreLoadModules = function (p) {
    for (var i = 0; i < p.modules.length; i++) {
        var moduleName = p.modules[i];
        var rdcpModule = rdcp.rdcpModules[moduleName];
        if (rdcpModule != undefined) {

            // 如果模块有依赖,则递归本方法,优先添加依赖模块到预加载列表
            if (rdcpModule.dependencies != undefined) {
                rdcp.addPreLoadModules({
                    modules: rdcpModule.dependencies
                });
            }

            // 如果模块没被加载或预加载,则添加到预加载列表
            var moduleStatus = rdcp.getModuleStatus({
                moduleName: moduleName
            });

            if (moduleStatus == 'unload')
                rdcp.preLoadModules.push(moduleName);
        }
    }
};

/**
 * 加载预加载模块<br>
 *
 * @param p {}
 */
rdcp.loadPreLoadModules = function (p) {

    // 如果预加载列表中还有需要加载的模块,则加载列表中的第一个
    if (rdcp.preLoadModules.length > 0) {
        var rdcpModule = rdcp.rdcpModules[rdcp.preLoadModules[0]];

        // 如果当前模块有需要加载的CSS,则加载所有需要加载的CSS
        // 由于加载CSS无需要关注CSS的加载顺序,所以无需要像加载JS那样控制加载顺序
        if (rdcpModule.css != undefined) {
            for (var k = 0; k < rdcpModule.css.length; k++) {
                var url = rdcp.baseScriptPath + rdcpModule.css[k];
                rdcp.loadCSS({
                    url: url
                });
            }
        }

        // 如果当前模块模块有需要加载的JS,则把需要加载的则JS放到JS预加载列表
        if (rdcpModule.js != undefined) {
            rdcp.addPreLoadJS({
                js: rdcpModule.js
            });
        }

        // 加载JS预加载列表中的所有JS
        rdcp.loadPreLoadJS({
            onload: function () {
                // 如果当前模块的所有JS加载完则代表该模块已经加载完
                // 把预加载列表中的第一个去除掉,并加入到已加载列表,并递归本方法
                var loadedModule = rdcp.preLoadModules.shift();

                if (rdcp.rdcpModules[loadedModule].onload != undefined) {
                    rdcp.rdcpModules[loadedModule].onload();
                }
                rdcp.loadedModules.push(loadedModule);
                rdcp.loadPreLoadModules(p);
            }
        });
    }
    // 如果预加载列表中没有需要加载的模块,则代表所有模块加载完毕,执行回调函数
    else if (rdcp.preLoadModules.length <= 0) {
        rdcp.rdcpLoadStatus = 'ready';
        p.onload();
    }

};

/**
 * 加载指定模块<br>
 *
 * @param p
 *            {modules:['jquery', 'easyui'], onload:function(p){}}
 */
rdcp.loadModules = function (p) {
    if (undefined == p || undefined == p.modules)
        return;
    // 将需要加载的模块添加到预加载列表
    rdcp.addPreLoadModules(p);
    // 加载预加载列表里面的所有模块
    rdcp.loadPreLoadModules(p);
};

/**
 * 添加指定JS到预加载列表<br>
 *
 * @param p
 *            {js:['xxx.js', 'xxx.js']}
 */
rdcp.addPreLoadJS = function (p) {
    for (var j = 0; j < p.js.length; j++) {
        var url = rdcp.baseScriptPath + p.js[j];
        var scriptStatus = rdcp.getScriptStatus({
            url: url
        });
        if (scriptStatus == 'unload') {
            rdcp.preLoadJS.push(url);
        }
    }
};

/**
 * 加载预加载JS<br>
 *
 * @param p
 *            {onload:function}
 */
rdcp.loadPreLoadJS = function (p) {

    // 如果预加载列表中还有需要加载的JS,则加载列表中的第一个
    if (rdcp.preLoadJS.length > 0) {
        var url = rdcp.preLoadJS[0];
        rdcp.loadJS({
            url: url,
            onload: function () {
                // JS加载完后,把预加载列表中的第一个去除掉,并加入到已加载列表,并递归本方法
                rdcp.loadedJS.push(rdcp.preLoadJS.shift());
                rdcp.loadPreLoadJS(p);
            }
        });
    }
    // 如果预加载列表中没有需要加载的JS,则代表所有JS加载完毕,执行回调函数
    else if (rdcp.preLoadJS.length <= 0) {
        p.onload();
    }
};

/**
 * 加载JS文件
 *
 * @param p
 *            {url:'lib/jquery/jquery-1.8.0.min.js', onload:function(){ } }
 */
rdcp.loadJS = function (p) {
    var done = false;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.language = 'javascript';
    script.src = p.url;
    script.onload = script.onreadystatechange = function () {
        if (!done && (!script.readyState || script.readyState == 'loaded' || script.readyState == 'complete')) {
            done = true;
            script.onload = script.onreadystatechange = null;
            if (p.onload != undefined) {
                p.onload.call(script);
            }
        }
    };
    document.getElementsByTagName("head")[0].appendChild(script);
};

/**
 * 加载单个CSS文件 *
 *
 * @param p
 *            {url:'lib/jquery/jquery-1.8.0.min.js', onload:function(){ } }
 */
rdcp.loadCSS = function (p) {
    var url = p.url;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.media = 'screen';
    link.href = url;
    document.getElementsByTagName('head')[0].appendChild(link);
    if (p.onload != undefined) {
        p.onload.call(link);
    }
};


var onloads = [];
rdcp.ready = function (onload) {
    onloads.push(onload);
    window.onload = function () {
        rdcp.loadModules({
            modules: rdcp.defaultLoadModules,
            onload: function () {
                $(document).ready(function () {
                    rdcp.each(onloads, function (i) {
                        onloads[i]();
                    });
                });
            }
        });
    }

};
