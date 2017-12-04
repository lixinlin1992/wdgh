(function($) {

	// 比例jquery全局注册一个名字为dateDiv的方法
	// 到时调用方式为：$("#abc").dateDiv(options);
	// 需要传入一个数组参数，用于自定高度、宽度等
	$.fn.dateDiv = function(options) {

		// 默认的设置
		var defaultOpts = {
			width : "200px",
			height : "200px"
		};

		// 将传入的options与defaultOpts作融合，并把整合后的数组赋值给opts
		var opts = $.extend(defaultOpts, options);

		// 把当前DIV转换成jquery对象
		$curDiv = $(this);

		$curDiv.css("width", opts.width).css("height", opts.height);
		$curDiv.css("width", opts.width).css("height", opts.height);
		
	};
});