<#--
	@author 李嘉伟
	@date: 2012-3-12
	
	系列配置例子:
	[
		{
			"pattern":"",//关系整个elements模板,用作选取哪个图表类型
			...
			"values":[
				{
					"pattern":"",//关系整个elements模板的values配置 
					...
				}
			]
		}
	]
	
	
	tooltip内置参数:
	#val# 该X轴的值
	#total# 该系列的总值
	#percent# 该X轴的值在总值的百分比
	#label# 该X轴的标签
	#radius# 该饼图半径
	
-->
<#--X轴、Y轴、系列的相关参数配置-->
<#assign x_config=json(unescape(config.params.xaxis_config!"{}"),"$.")!>
<#assign s_config=json(unescape(config.params.series_config!"[]"),"$.")!>
<#assign y_config=json(unescape(config.params.yaxis_config!"{}"),"$.")!>
<#-- 颜色索引 -->
<#assign colorsIndex = 0/>
<#--内置颜色，当系列没有指定颜色的时候，从这里选择一种颜色-->
<#assign _DEFAULT_COLORS=["#800000","#696969","#CD5C5C","#F08080","#FF6347",
"#A0522D","#D2691E","#DEB887","#006400","#00FF00","#90EE90","#FFD700","#2E8B57",
"#008080","#2F4F4F","#00FFFF","#1E90FF","#4169E1","#7B68EE","#FF00FF","#DB7093","#DC143C"]>

<#assign maxVal=0/>
<#assign minVal=100000/>
{
    "header":{"code":"0","message":"success","isAlert":"false"},
    "body":{    
	    <#-- 其他属性 -->
	    <#if config.params.bg_colour?? && config.params.bg_colour != "undefined" && config.params.bg_colour !="">  
	    "bg_colour":"${config.params.bg_colour}", 
	    </#if>
<#if config.params.revers?? && config.params.revers=="true">
        "elements":[
        <#list xaxis as x><#assign _datas=dataset.getReportDatas(x)>
            {
                "type":"line","text":"${x.label!""}",
                "values":[
                <#list _datas as d>
                	<#if d??>
                		${d.yaxis.value!"null"}
                		<#if d.yaxis.value??&&maxVal&lt;d.yaxis.value><#assign maxVal=d.yaxis.value></#if>
                		<#if d.yaxis.value??&&minVal&gt;d.yaxis.value><#assign minVal=d.yaxis.value></#if>
                	<#else>0
                	</#if>
                	<#if d_has_next>,</#if>
                </#list>
                ]
            }<#if x_has_next>,</#if>
        </#list>
        ],
        "x_axis":{
            "labels":{
                "labels":[<#list series as s>"${s.label!"-"}"<#if s_has_next>,</#if></#list>]
            }
        },
<#else>
        "elements":[
            <#list series as s>
                <#list s_config as s_cfg>
                <#-- 遍历系列配置，匹配每一个模式 -->
                <#if s_cfg?? && s_cfg.pattern?? && s.value?matches(s_cfg.pattern)><#assign _s_c=s_cfg><#break></#if></#list>
                <#if !_s_c??><#assign _s_c=json("{}","$.")></#if>
                <#assign _datas=dataset.getReportDatas(s)><#-- 获取数据源的该系列数据 -->
            {
                <#assign _c_type=_s_c.type!"line">
                "type":"${_s_c.type!"line"}",<#--系列的图表类型，line、bar、bar_3d、bar_glass、hbar、scatter_line、pie，默认使用line-->
                <#-- 线条宽度 -->
                <#if _s_c.width?? && _s_c.type?? && (_s_c.type?starts_with("bar") || _s_c.type == "hbar")>
                	"barwidth":${_s_c.width},
                <#elseif _s_c.width?? && _s_c.type??>
                	"width":${_s_c.width},
                </#if>
                <#-- pie类型则需要填充colours对象 -->
                <#if _s_c.type?? && _s_c.type == "pie">
                <#if _s_c.random??>
                <#if _s_c.colours?? && _s_c.colours?size != 0>
                "colours":[
                	<#list _s_c.colours as _s_c_colour>
                	   "${_s_c_colour}"<#if _s_c_colour_has_next>,</#if>
                	</#list>
                ],
                <#else>
                "colours":[
                	<#list _DEFAULT_COLORS as _s_c_colour>
                	   "${_s_c_colour}"<#if _s_c_colour_has_next>,</#if>
                	</#list>
                ],
                </#if>
                </#if>
                </#if><#-- colours属性填充结束 -->
                <#-- scatter_line必须提供dot-style -->
                <#if _s_c.dot_style??>
	            "dot-style": {
	                "type": "${_s_c.dot_style!"solid-dot"}"
	            },
	            </#if>
                <#--"colour":"${_s_c.colour!(_DEFAULT_COLORS[s_index]!"#000000")}",&lt;#&ndash;系列的颜色&ndash;&gt;-->
                <#--"font-size":${_s_c["font-size"]!"10"},&lt;#&ndash;字体的大小&ndash;&gt;-->
                "dot-size":${_s_c["dot-size"]!"6"},<#--line类型的点大小-->
                "text":"${s.label!""}",
                <#if _s_c["on-show"]??><#assign _o_s=_s_c["on-show"]>
                "on-show":{
                    "type":"${_o_s.type!"fade-in"}",<#--弹出方式, 此外还有 drop 和 grow-up,fade-in,mid-slide,explode,shrink-in -->
                    "cascade":${_o_s.cascade!"1"},<#--不通柱子之间的间隔，bar图使用-->
                    "delay":${_o_s.delay!"0.5"}<#--延迟时间-->
                },
                </#if>
                <#--线图的相关配置-->
                <#--饼图相关配置-->
                <#if _c_type=="pie">
                <#if !_s_c.animate?? || _s_c.animate?string == "true">
                "animate":[<#--动画效果，可以直接指定true启用默认动画效果-->
                    {
                        "type":"bounce",<#--鼠标滑过时，使用弹跳效果-->
                        <#if !_s_c.animate_distance??>
                        "distance":20 <#--弹跳距离-->
                        <#else>
                        "distance":${_s_c.animate_distance} <#--弹跳距离-->
                        </#if>
                    },
                    {
                        "type":"fade"
                    }
                ],
                <#if _s_c.radius??>
                "radius":"${_s_c.radius}",
                </#if>
                </#if>
                "gradient-fill":true,<#--渐变颜色效果-->
                "no-labels":false,<#--是否显示标签-->
                </#if>
                <#if _s_c.tip??>"tip":"${_s_c.tip!}",</#if><#-- 悬浮提示tooltip -->
                <#-- 图表点的值 -->
                "values":[
                <#-- 判断图表Y轴值是否匹配模式 -->
                <#list _datas as d>
                <#if d??>
                	<#if _s_c.values??>
                		<#list _s_c.values as _s_v>
                			<#if _s_v.pattern?? && d.yaxis.value?? && (d.yaxis.value?string)?matches(_s_v.pattern)>
                				<#assign _v=_s_v/>
                				<#break>
                			</#if>
                		</#list>
                	</#if>
                <#if _v??>{
                <#--这里要分开不同的图表进行处理-->
                <#-- 横向图表hbar -->
                <#if _s_c.type?? && _s_c.type == "hbar">
		        	"right":${d.yaxis.value!"0"},
		        <#else>
                	"value":${d.yaxis.value!"0"},
                </#if>
                <#-- pie类型需要设置label -->
                <#if _s_c.type?? && _s_c.type == "pie">
		        	"label":"${d.xaxis.label!"-"}",
                </#if>
                <#-- 线性图表line -->
                <#if _c_type=="line">
                "type":"${_v.type!"dot"}",<#--单独设置点的类型-->
                "dot-size":${_v["dot-size"]!"5"},<#--单独设置点的大小-->
                "hollow":${(_v.hollow?string)!"false"},<#--是否空心-->
                "halo-size":${_v["halo-size"]!"0"},<#--光晕大小-->
                <#--所有柱状图-->
                <#elseif _c_type?starts_with("bar")>
                "top":${_v.top!(d.yaxis.value!"0")},
                "bottom":${_v.bottom!"0"},</#if>
                <#-- tooltip设置 -->
                <#if _v.tip??>"tip":"${_v.tip!}",</#if>
                "on-click":"${_v["on-click"]!"#"}"
                <#if _c_type=="pie"><#elseif _s_c.random??>
				    <#if _s_c.colours??>
				    	<#if colorsIndex == 0 || colorsIndex &gt; (_s_c.colours?size-1)>
				    		<#assign colorsIndex = 0/>
				    	</#if>
				        ,"colour":"${_s_c.colours[colorsIndex]}"
				    	<#assign colorsIndex = colorsIndex+1/>
					<#else>
				    	<#if colorsIndex == 0 || colorsIndex &gt; (_DEFAULT_COLORS?size-1)>
				    		<#assign colorsIndex = 0/>
				    	<#else>
				    	</#if>
				        ,"colour":"${_DEFAULT_COLORS[colorsIndex]}"
				    	<#assign colorsIndex = colorsIndex+1/>
					</#if>
                <#else>
                ,"colour":"${_v.colour!(_s_c.colour!(_DEFAULT_COLORS[s_index]!"#000000"))}"
                </#if>
                }<#else>
                	<#-- 横向图表设置 -->
	                <#if _s_c.type?? && _s_c.type == "hbar">
		                {
		                  "right":${d.yaxis.value!"0"}
			              <#if _s_c.random??>
				              <#if _s_c.colours??>
						    	  <#if colorsIndex == 0 || colorsIndex &gt; (_s_c.colours?size-1)>
						    		  <#assign colorsIndex = 0/>
						    	  </#if>
				             	  ,"colour":"${_s_c.colours[colorsIndex]}"
						          <#assign colorsIndex = colorsIndex+1/>
					          <#else>
						    	  <#if colorsIndex == 0 || colorsIndex &gt; (_DEFAULT_COLORS?size-1)>
						    		  <#assign colorsIndex = 0/>
						    	  </#if>
				                  ,"colour":"${_DEFAULT_COLORS[colorsIndex]}"
						    	  <#assign colorsIndex = colorsIndex+1/>
					          </#if>
			              <#else>
			              	  ,"colour":"${_s_c.colour!(_DEFAULT_COLORS[s_index]!"#000000")}"
			              </#if>

		                }
		            <#-- pie类型需要设置label -->
		            <#elseif _s_c.type?? && _s_c.type == "pie">
		                {
		                    "value":${d.yaxis.value!"0"},
				        	"label":"${d.xaxis.label!"-"}"
<#--			              <#if _s_c.random??>
				              <#if _s_c.colours??>
						    	  <#if colorsIndex == 0 || colorsIndex &gt; (_s_c.colours?size-1)>
						    		  <#assign colorsIndex = 0/>
						    	  </#if>
				             	  ,"colour":"${_s_c.colours[colorsIndex]}"
						          <#assign colorsIndex = colorsIndex+1/>
					          <#else>
						    	  <#if colorsIndex == 0 || colorsIndex &gt; (_DEFAULT_COLORS?size-1)>
						    		  <#assign colorsIndex = 0/>
						    	  </#if>
				                  ,"colour":"${_DEFAULT_COLORS[colorsIndex]}"
						    	  <#assign colorsIndex = colorsIndex+1/>
					          </#if>
			              <#else>
			              	  ,"colour":"${_s_c.colour!(_DEFAULT_COLORS[s_index]!"#000000")}"
			              </#if>
-->
						}
		            <#-- scatter_line类型需要设置label -->  
		            <#elseif _s_c.type?? && _s_c.type == "scatter_line">
		                {
		                    "value":${d.yaxis.value!"null"}			        	
			              <#if _s_c.random??>
				              <#if _s_c.colours??>
						    	  <#if colorsIndex == 0 || colorsIndex &gt; (_s_c.colours?size-1)>
						    		  <#assign colorsIndex = 0/>
						    	  </#if>
				             	  ,"colour":"${_s_c.colours[colorsIndex]}"
						          <#assign colorsIndex = colorsIndex+1/>
					          <#else>
						    	  <#if colorsIndex == 0 || colorsIndex &gt; (_DEFAULT_COLORS?size-1)>
						    		  <#assign colorsIndex = 0/>
						    	  </#if>
				                  ,"colour":"${_DEFAULT_COLORS[colorsIndex]}"
						    	  <#assign colorsIndex = colorsIndex+1/>
					          </#if>
			              <#else>
			              	  ,"colour":"${_s_c.colour!(_DEFAULT_COLORS[s_index]!"#000000")}"
			              </#if>
						}
	                <#else>
		                ${d.yaxis.value!"null"}
	                </#if>
                </#if>
                <#if d.yaxis.value??&&maxVal&lt;d.yaxis.value><#assign maxVal=d.yaxis.value></#if>
                <#if d.yaxis.value??&&minVal&gt;d.yaxis.value><#assign minVal=d.yaxis.value></#if>
                <#else>0</#if><#if d_has_next>,</#if>
                </#list>]
            }<#if s_has_next>,</#if>
                </#list>
        ],
        "x_axis":<#if _s_c.type?? && _s_c.type == "pie">null<#else>{
            "stroke":${x_config.stroke!"1"},<#--X轴的粗细-->
            "tick-height":${x_config["tick-height"]!"5"},<#--X轴刻度长度-->
            "colour":"${x_config.colour!"#000000"}",<#--X轴颜色-->
            "grid-colour":"${x_config["grid-colour"]!"#DCDCDC"}",<#--网格线颜色-->
            "3d":${x_config["3d"]!"0"},<#--是否显示3D -->
            <#-- 获取系列配置的图表类型 -->
            <#list series as s>
            <#list s_config as s_cfg>
	            <#if s_cfg?? && s_cfg.pattern?? && s.value?matches(s_cfg.pattern)>
	            	<#assign _s_c=s_cfg><#break>
	            </#if>
            </#list>
            </#list>
            <#if !_s_c??><#assign _s_c=json("{}","$.")></#if>
            <#-- 若是hbar类型则特殊操作 -->
            <#if _s_c.type?? && _s_c.type=="hbar">
            <#assign _seriesMaxValue = dataset.getSeriesMaxValue()/>
            "steps":${x_config.steps!(_seriesMaxValue/10)?int},<#--刻度间隔-->
            "min":${x_config.min!"0"},<#--最小刻度-->
            "max":${y_config.max!_seriesMaxValue},<#--最大刻度-->
            "offset":${x_config.offset!"0"}<#--(0/1), 是否根据数据图形和标签的宽度进行延展-->
            <#else>
            <#-- 非hbar类型 -->
            "steps":<#if x_config.max?? && x_config.max != "" &&  x_config.max != 0>${x_config.steps!"1"}<#else><#if xaxis?size != 1>${x_config.steps!"1"}<#else>2</#if></#if>,<#--刻度间隔-->"min":${x_config.min!"0"},<#--最小刻度-->
             <#if x_config.max?? && x_config.max != "" &&  x_config.max != 0>"max":${x_config.max},<#else><#if xaxis?size != 1>"max":${xaxis?size-1},<#else></#if></#if><#--最大刻度-->
            "offset":${x_config.offset!"1"},<#--(0/1), 是否根据数据图形和标签的宽度进行延展-->
            "labels":{
                <#if x_config.labels??><#assign _labels=x_config.labels>
                "rotate":"${_labels.rotate!""}",<#--标签显示方向-->
                "size":${_labels.size!"10"},<#--标签字体大小-->
                "steps":${_labels.steps!"1"},<#--标签间隔-->
                "visible-steps":${_labels["visible-steps"]!"1"},<#--可见标签间隔，会覆盖上面参数-->
                "align":"${_labels.align!"center"}",<#--旋转的标签居中对齐，默认是较高的一端对其到刻度上-->
                </#if>
                "labels":[<#if _labels??><#assign _label_cfgs=_labels.labels!><#assign _def_label_cfg=_labels["default-label"]!></#if>
                <#list xaxis as x><#assign _label_cfg=_def_label_cfg!>
                <#if _label_cfgs??><#list _label_cfgs as c><#if c?? && c.pattern?? && x.value?matches(c.pattern)><#assign _label_cfg=c><#break></#if></#list></#if>
                <#if !_label_cfg??></#if>
                <#if !_label_cfg??>"${x.label!"-"}"<#else>
                {"text":"${x.label!"-"}","visible":${(_label_cfg.visible?string)!"true"},"colour":"${_label_cfg.colour!"#000000"}","rotate":${_label_cfg.rotate!"0"}}
                </#if>
                <#if x_has_next>,</#if>
                </#list>]
            }
            </#if>
        }</#if>,
</#if>
        "title":{
            "text":"${config.params.title!""}"
        },
        "y_axis":<#if _s_c.type?? && _s_c.type == "pie">null<#else>{
            "stroke":${y_config.stroke!"1"},
            "tick-length":${y_config["tick-length"]!"5"},
            "colour":"${y_config.colour!"#000000"}",
            "grid-colour":"${y_config["grid-colour"]!"#DCDCDC"}",
            <#-- 获取系列配置的图表类型 -->
            <#list series as s>
            <#list s_config as s_cfg>
	            <#if s_cfg?? && s_cfg.pattern?? && s.value?matches(s_cfg.pattern)>
	            	<#assign _s_c=s_cfg><#break>
	            </#if>
            </#list>
            </#list>
            <#if !_s_c??><#assign _s_c=json("{}","$.")></#if>
            <#if _s_c.type?? && _s_c.type=="hbar">
            	"steps":${y_config.steps!"1"},<#--刻度间隔-->
            	"offset":${y_config.offset!"1"},
                "labels":[<#if _labels??><#assign _label_cfgs=_labels.labels!><#assign _def_label_cfg=_labels["default-label"]!></#if>
                <#list xaxis as x><#assign _label_cfg=_def_label_cfg!>
                <#if _label_cfgs??><#list _label_cfgs as c><#if c?? && c.pattern?? && x.value?matches(c.pattern)><#assign _label_cfg=c><#break></#if></#list></#if>
                <#if !_label_cfg??></#if>
	            <#if !_label_cfg??>"${x.label!"-"}"<#else>
	            "${x.label!"-"}"
	            </#if>
	            <#if x_has_next>,</#if>
	            </#list>]
	        <#else>
	        <#-- Y轴是否小数(默认是) -->
	        <#if y_config.showpoint?? && y_config.showpoint == "0">
	        	<#assign y_config_maxValue = y_config.max!(maxVal?int)/>
	        	<#assign minVal = minVal?int/>
	        <#else>
	        	<#assign y_config_maxValue = y_config.max!(maxVal)/>
	        </#if>
	        <#-- Y轴是否小数(默认是) -->
	        <#if y_config.showpoint?? && y_config.showpoint == "0">
				<#assign original_config_yStep = ((y_config_maxValue-minVal)/10) />
				<#assign temp_y_config_maxValue = y_config_maxValue?int/>
				<#assign temp_original_config_yStep = original_config_yStep?int/>
				<#if (temp_original_config_yStep * 12) &lt; temp_y_config_maxValue>
					<#assign original_config_yStep = (y_config_maxValue/10) />
				</#if>
        		<#assign y_config_stepsValue = y_config.steps!(original_config_yStep?int)/>
        	<#else>
        		<#if y_config_maxValue == minVal>
	        		<#assign minVal = 0/>
        		</#if>

				<#assign original_config_yStep = ((y_config_maxValue-minVal)/10) />
				<#assign temp_y_config_maxValue = y_config_maxValue?int/>
				<#assign temp_original_config_yStep = original_config_yStep?int/>
				<#if (temp_original_config_yStep * 12) &lt; temp_y_config_maxValue>
					<#assign original_config_yStep = (y_config_maxValue/10) />
				</#if>

        		<#assign y_config_stepsValue = y_config.steps!original_config_yStep/>
        	</#if>
            "steps":${y_config_stepsValue},<#--刻度间隔-->
            "offset":${y_config.offset!"0"},
            "3d":${y_config["3d"]!"0"},<#--是否显示3D -->
            <#if y_config.minpattern?? && y_config.minpattern == "minval">
             "min":${y_config.min!minVal},<#--最小刻度-->
            <#else>
             "min":${y_config.min!"0"},<#--最小刻度-->
			</#if>
			"max":${y_config_maxValue}<#--最大刻度-->
            </#if>
        }</#if>
    }
}