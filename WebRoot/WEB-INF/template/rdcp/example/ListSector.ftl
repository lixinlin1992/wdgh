<div style="width:98%;">
    <table id="templateList" style="margin: 0; padding: 0;"></table>
    <div id="pagerdt" style="margin: 0; padding: 0;"></div>
</div>

<script>
    var _gridParam = {
        colNames:["����","ģ������","������","����ʱ��","����"],
        colModel:[
            {
                name:"����",
                index:"id",
                width:100
            },
            {
                name:"ģ������",
                index:"name",
                width:150
            },
            {
                name:"������",
                index:"create_user_name",
                width:100
            },
            {
                name:"����ʱ��",
                index:"create_date",
                width:120
            },
            {
                name:"����",
                index:"operate",
                width:100,
                sortable:false,
                formatter:function(cell, options, row, tr, td) {
                    return "<input value='�޸�' type='button' class='grid_button' onclick='editTemplate(\"" + row[0] +
                            "\")'>";
                }
            }
        ],
        caption : "ģ���б�",
        multiselect:false,
        width:"98%",
        pager: "#pagerdt"
    };

    $(document).ready(function(){
        GRID.create("#templateList", "DS_TEMPLATE_CONFIG_LIST", _gridParam, "QueryForm");
    });
</script>