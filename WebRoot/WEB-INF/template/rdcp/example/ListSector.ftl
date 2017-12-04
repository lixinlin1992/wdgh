<div style="width:98%;">
    <table id="templateList" style="margin: 0; padding: 0;"></table>
    <div id="pagerdt" style="margin: 0; padding: 0;"></div>
</div>

<script>
    var _gridParam = {
        colNames:["编码","模板名称","创建者","创建时间","操作"],
        colModel:[
            {
                name:"编码",
                index:"id",
                width:100
            },
            {
                name:"模板名称",
                index:"name",
                width:150
            },
            {
                name:"创建者",
                index:"create_user_name",
                width:100
            },
            {
                name:"创建时间",
                index:"create_date",
                width:120
            },
            {
                name:"操作",
                index:"operate",
                width:100,
                sortable:false,
                formatter:function(cell, options, row, tr, td) {
                    return "<input value='修改' type='button' class='grid_button' onclick='editTemplate(\"" + row[0] +
                            "\")'>";
                }
            }
        ],
        caption : "模板列表",
        multiselect:false,
        width:"98%",
        pager: "#pagerdt"
    };

    $(document).ready(function(){
        GRID.create("#templateList", "DS_TEMPLATE_CONFIG_LIST", _gridParam, "QueryForm");
    });
</script>