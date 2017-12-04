rdcp.ready(function(){
});

function searchFate() {
    var gender = $("#gender").val();
    var marriageState = $("#marriageState").val();
    var height = $("#height").val();
    var age = $("#age").val();
    var province = $("#province").val();
    var degree = $("#degree").val();
    var org = $("#org").val();
    var url = "!gh/wechat/~/pages/yftk/Y-s-result.jsp?gender=" + gender + "&marriageState=" + marriageState
    + "&height=" + height + "&age=" + age + "&province=" + province + "&degree=" + degree + "&org=" + org;
    window.location = url;
}