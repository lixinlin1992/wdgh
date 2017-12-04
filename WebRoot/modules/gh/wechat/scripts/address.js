//省、市、区  
var region_init = function (_region_p, _region_c, _region_d, _region_p_default, _region_c_default, _region_d_default) {  
    var region_p = document.getElementById(_region_p);  
    var region_c = document.getElementById(_region_c);  
    var region_d = document.getElementById(_region_d);  
  
    function option_items_select(cmb, value) {  
        for (var i = 0; i < cmb.options.length; i++) {  
            if (cmb.options[i].value == value) {  
                cmb.selectedIndex = i;  
                return;  
  
            }  
        }  
    }  
  
    //附加value、text  
    function option_items_add(cmb, value, text, obj, i) {  
        var option = document.createElement("OPTION");  
        cmb.options.add(option);  
        option.innerText = text;  
        option.value = value;  
        option.obj = obj;  
    }  
  
    function region_c_change() {  
        region_d.options.length = 0;  
        if (region_c.selectedIndex == -1)return;  
        var item = region_c.options[region_c.selectedIndex].obj;  
        for (var i = 0; i < item.district.length; i++) {  
            option_items_add(region_d, item.district[i].id, item.district[i].name, null, i);  
        }  
        option_items_select(region_d, _region_d_default);  
    }  
  
    function region_p_change() {  
        region_c.options.length = 0;  
        region_c.onchange = null;  
        if (region_p.selectedIndex == -1)return;  
        var item = region_p.options[region_p.selectedIndex].obj;  
        for (var i = 0; i < item.city.length; i++) {  
            option_items_add(region_c, item.city[i].id, item.city[i].name, item.city[i], i);  
        }  
        option_items_select(region_c, _region_c_default);  
        region_c_change();  
        region_c.onchange = region_c_change;  
    }  
  
    for (var i = 0; i < province_enum.length; i++) {  
        option_items_add(region_p, province_enum[i].id, province_enum[i].name, province_enum[i]);  
    }  
    option_items_select(region_p, _region_p_default);  
    region_p_change();  
    region_p.onchange = region_p_change;  
}  
  
  
var province_enum = [  
    //{id: '广东', name: '广东', city: [  
        {id: '深圳市', name: '深圳市', city: [  
        	{id: '', name: '请选择区/县...',district: [
            	{id: '', name: '请选择...'},  
            ]}, 
            {id: '罗湖区', name: '罗湖区',district: [
            	{id: '', name: '请选择...'},  
            	{id: '桂园街道', name: '桂园街道'},  
            	{id: '黄贝街道', name: '黄贝街道'},  
            	{id: '东门街道', name: '东门街道'},  
            	{id: '翠竹街道', name: '翠竹街道'},  
            	{id: '南湖街道', name: '南湖街道'},  
            	{id: '笋岗街道', name: '笋岗街道'},  
            	{id: '东湖街道', name: '东湖街道'},  
            	{id: '莲塘街道', name: '莲塘街道'},  
            	{id: '东晓街道', name: '东晓街道'},  
            	{id: '清水河街道', name: '清水河街道'}  
            ]},  
            {id: '福田区', name: '福田区',district: [
            	{id: '', name: '请选择...'}, 
            	{id: '南园街道', name: '南园街道'}, 
            	{id: '园岭街道', name: '园岭街道'}, 
            	{id: '福田街道', name: '福田街道'}, 
            	{id: '沙头街道', name: '沙头街道'}, 
            	{id: '香蜜湖街道', name: '香蜜湖街道'}, 
            	{id: '梅林街道', name: '梅林街道'}, 
            	{id: '莲花街道', name: '莲花街道'}, 
            	{id: '华富街道', name: '华富街道'}, 
            	{id: '福保街道', name: '福保街道'}, 
            	{id: '华强北街道', name: '华强北街道'}, 
            	{id: '福田保税区', name: '福田保税区'}
            ]},  
            {id: '南山区', name: '南山区',district: [
            	{id: '', name: '请选择...'}, 
            	{id: '南头街道', name: '南头街道'},
            	{id: '南山街道', name: '南山街道'},
            	{id: '沙河街道', name: '沙河街道'},
            	{id: '蛇口街道', name: '蛇口街道'},
            	{id: '招商街道', name: '招商街道'},
            	{id: '粤海街道', name: '粤海街道'},
            	{id: '桃源街道', name: '桃源街道'},
            	{id: '西丽街道', name: '西丽街道'}
            ]},  
            {id: '宝安区', name: '宝安区',district: [
            	{id: '', name: '请选择...'}, 
            	{id: '新安街道', name: '新安街道'},
            	{id: '光明', name: '光明'},
            	{id: '西乡街道', name: '西乡街道'},
            	{id: '福永街道', name: '福永街道'},
            	{id: '沙井街道', name: '沙井街道'},
            	{id: '松岗街道', name: '松岗街道'},
            	{id: '公明', name: '公明'},
            	{id: '石岩街道', name: '石岩街道'},
            	{id: '观澜街道', name: '观澜街道'},
            	{id: '大浪街道', name: '大浪街道'},
            	{id: '龙华街道', name: '龙华街道'},
            	{id: '民治街道', name: '民治街道'},
            	{id: '深圳市宝安国际机场', name: '深圳市宝安国际机场'}
            	
            ]},   
            {id: '龙岗区', name: '龙岗区',district: [
            	{id: '', name: '请选择...'}, 
            	{id: '平湖街道', name: '平湖街道'},
            	{id: '坪地街道', name: '坪地街道'},
            	{id: '坪山街道', name: '坪山街道'},
            	{id: '坑梓街道', name: '坑梓街道'},
            	{id: '葵涌街道', name: '葵涌街道'},
            	{id: '大鹏街道', name: '大鹏街道'},
            	{id: '南澳街道', name: '南澳街道'},
            	{id: '南湾街道', name: '南湾街道'},
            	{id: '坂田街道', name: '坂田街道'},
            	{id: '布吉街道', name: '布吉街道'},
            	{id: '龙城街道', name: '龙城街道'},
            	{id: '龙岗街道', name: '龙岗街道'},
            	{id: '横岗街道', name: '横岗街道'},
            	{id: '深圳市大工业区', name: '深圳市大工业区'}
            	
            ]},  
            {id: '盐田区', name: '盐田区',district: [
            	{id: '', name: '请选择...'}, 
            	{id: '梅沙街道', name: '梅沙街道'},
            	{id: '盐田街道', name: '盐田街道'},
            	{id: '沙头角街道', name: '沙头角街道'},
            	{id: '海山街道', name: '海山街道'},
            	{id: '市保税区（沙头角）', name: '市保税区（沙头角）'},
            	{id: '市保税区（盐田港）', name: '市保税区（盐田港）'}
            	
            ]},  
            {id: '光明新区', name: '光明新区'},  
            {id: '坪山新区', name: '坪山新区'},  
            {id: '大鹏新区', name: '大鹏新区'},  
            {id: '龙华新区', name: '龙华新区'}
            
        ]}
   // ]}  
] 
