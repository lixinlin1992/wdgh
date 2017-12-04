rdcp.ready(function () {
    getResults()
});

function getResults() {
    var codes;
    var gender = $("#gender").val();
    var marriageState = $("#marriageState").val();
    var height = $("#height").val();
    var age = $("#age").val();
    var province = $("#province").val();
    var degree = $("#degree").val();
    var org = $("#org").val();
    rdcp.request("!gh/wechat/~java/YftkAction.getCodes", {}, function (data) {
        codes = data;
        rdcp.request("!gh/wechat/~java/Yftk.discoverFate", "gender=" + gender + "&marriageState=" + marriageState
            + "&height=" + height + "&age=" + age + "&province=" + province + "&degree=" + degree + "&org=" + org, function (data) {
                var dataObj = data.body.rows,
                    con = "",
                    genderStr = "",
                    marriageStateStr = "",
                    degreeStr = "",
                    empTypeStr = "",
                    hometown = "";
                var province, city, area;
                $.each(dataObj, function (index, item) {
                    hometown = item.hometown;
                    genderStr = item.gender == "1" ? "男" : "女";
                    for (var i = 0; i < codes.length; i++) {
                        var d = codes.codes[i];
                        if (d.code_type == "degree" && d.code == item.degree) {
                            degreeStr = d.code_value;
                        }
                        if (d.code_type == "marriage_state" && d.code == item.marriage_state) {
                            marriageStateStr = d.code_value;
                        }
                        if (d.code_type == "emp_type" && d.code == item.emp_type) {
                            empTypeStr = d.code_value;
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
                    con += "<div class='interest_list'><ul><li class='animated bounceInLeft'><a href='!gh/wechat/~/pages/yftk/yftk-user-detail.jsp?userId="
                        + item.user_id
                        + "'><img src='" + item.img_path + "'><div class='list_r'><p><span>"
                        + item.nick_name + "</span><span class='color_y'> "
                        + genderStr + "  "
                        + item.age
                        + "岁 " + degreeStr + " "
                        + marriageStateStr
                        + "</span></p><p>" + empTypeStr + "  " + hometown + "</p> <p></p> <p></p>" +
                        "<i class=' icon-angle-right'></i></div></a></li> </ul></div>";
                });
                if (con == "") {
                    con = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
                        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;无符合条件的结果";
                }
                $("#result").html(con); //把内容入到这个div中即完成
            }
        )
        ;
    });
}