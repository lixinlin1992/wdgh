rdcp.ready(function () {
    getUserInfo();
});

function getUserInfo() {
    var codes;
    var userId = $("#userId").val();
    rdcp.request("!gh/wechat/~java/YftkAction.getCodes", {}, function (data) {
        codes = data;
        rdcp.request("!gh/wechat/~java/Yftk.getUserInfo", "userId=" + userId, function (data) {
                var dataObj = data.body.rows,
                    con = "",
                    genderStr = "",
                    marriageStateStr = "",
                    degreeStr = "",
                    empTypeStr = "",
                    department = "",
                    house = "",
                    car = "",
                    department = "",
                    hometown = "";
                var province, city, area;
                hometown = dataObj[0].hometown;
                department = dataObj[0].department;
                genderStr = dataObj[0].gender == "1" ? "男" : "女";
                for (var i = 0; i < codes.length; i++) {
                    var d = codes.codes[i];
                    if (d.code_type == "org" && d.code == dataObj[0].org) {
                        department = d.code_value + department;
                    }
                    if (d.code_type == "degree" && d.code == dataObj[0].degree) {
                        degreeStr = d.code_value;
                    }
                    if (d.code_type == "marriage_state" && d.code == dataObj[0].marriage_state) {
                        marriageStateStr = d.code_value;
                    }
                    if (d.code_type == "emp_type" && d.code == dataObj[0].emp_type) {
                        empTypeStr = d.code_value;
                    }
                    if (d.code_type == "house" && d.code == dataObj[0].house) {
                        house = d.code_value;
                    }
                    if (d.code_type == "car" && d.code == dataObj[0].car) {
                        car = d.code_value;
                    }
                    if (d.code_type == "area" && d.code == hometown) {
                        area = d.code_value;
                        hometown = d.parent_code;
                    }
                }
                for (var i = 0; i < codes.length; i++) {
                    var d = codes.codes[i];
                    if (d.code_type == "city" && d.code == hometown) {
                        city = d.code_value;
                        hometown = d.parent_code;
                    }
                }
                for (var i = 0; i < codes.length; i++) {
                    var d = codes.codes[i];
                    if (d.code_type == "province" && d.code == hometown) {
                        province = d.code_value;
                        hometown = province + city + area;
                    }
                }
                $("#userImg").css({
                    "background":"url('"+dataObj[0].img_path+"') no-repeat",
                    "background-size":"cover"
                });
                var con = "<div class='first_line'><span class='clearfix'>昵称：" + dataObj[0].nick_name + "</span></div><div class='vip_info'></div>" +
                    "<div class='zeou_tj'> <p><br> </p> <p> 内心独白：";
                if (dataObj[0].note == null) {
                    con += "无";
                } else {
                    con += dataObj[0].note;
                }
                con += "</p></div> <div class='qingyuan_btn'> " +
                    "<span class='say_hi' data_src='104417033'></span><span class='send_mail' objmemberid='104417033'></span></div>";
                $("#note").html(con); //把内容入到这个div中即完成
                con = "<p><label>详细资料</label> <i class='icon-volume-down color_y'></i></p>" +
                    "<p class='animated fadeInLeft'><label class='color_g'>性别：</label><span>" + genderStr + "</span></p>" +
                    "<p class='animated fadeInLeft'><label class='color_g'>年龄：</label><span>" + dataObj[0].age + "岁</span></p>" +
                    "<p class='animated fadeInLeft'><label class='color_g'>婚姻状态：</label><span>" + marriageStateStr + "</span></p>" +
                    "<p class='animated fadeInRight'><label class='color_g'>所在单位：</label><span>" + department + "</span></p>" +
                    "<p class='animated fadeInLeft'><label class='color_g'>籍贯：</label><span>" + hometown + "</span></p>" +
                    "<p class='animated fadeInRight'><label class='color_g'>民族：</label><span>" + dataObj[0].nation + "</span></p>" +
                    "<p class='animated fadeInLeft'><label class='color_g'>身高：</label><span>" + dataObj[0].height + "厘米</span></p>" +
                    "<p class='animated fadeInRight'><label class='color_g'>职业：</label><span>" + empTypeStr + "</span></p>" +
                    "<p class='animated fadeInLeft'><label class='color_g'>购车：</label><span>" + car + "</span></p>" +
                    "<p class='animated fadeInLeft'><label class='color_g'>住房：</label><span>" + house + "</span></p>";
                $("#detail").html(con);
            }
        );
    });
}