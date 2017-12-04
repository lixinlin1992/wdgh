rdcp.pformAdapter = [];

rdcp.pformDefaults = {

    // 表单创建前
    beforeFormCreate: function (froms, p) {
    },

    // 表单创建完成
    onFromCreated: function (froms, p) {
    },

    // 表单步骤创建前
    beforeFormStepCreate: function (formIndex, form, p) {
    },

    // 表单步骤创建完成
    onFormStepCreated: function (formIndex, form, p) {
    },

    // 表单步骤按钮条创建
    onFormStepButtonBarCreate: function (formIndex, form, buttonBarContainer, p) {
        var btnPre = $("<a href='javascript:void(0);' class='faceListTableBtn btnPre'>上一步</a>")
        var btnNext = $("<a href='javascript:void(0);' class='faceListTableBtn btnNext'>下一步</a>")
        var btnSubmit = $("<a href='javascript:void(0);' class='faceListTableBtn btnSubmit'>提交</a>")
        btnPre.click(function () {
            rdcp.id(p.id).find(".SR_faceContent").hide();
            rdcp.id(p.id).find("#form_" + p.forms[formIndex - 1].code).show();
        });
        btnNext.click(function () {
            rdcp.id(p.id).find(".SR_faceContent").hide();
            rdcp.id(p.id).find("#form_" + p.forms[formIndex + 1].code).show();
        });
        btnSubmit.click(function () {

        });

        if (formIndex > 0)
            buttonBarContainer.append($("<li>").append(btnPre));
        if (formIndex >= 0 && formIndex < p.forms.length - 1)
            buttonBarContainer.append($("<li>").append(btnNext));
        if (formIndex == p.forms.length - 1)
            buttonBarContainer.append($("<li>").append(btnSubmit));
    },

    // 表单字段创建
    onFormFieldCreate: function (formIndex, form, fieldIndex, field, p) {
    }
};

rdcp.pform = function (id, ds, action, p) {

    var settings = rdcp.extend({}, rdcp.pformDefaults, p);
    settings = rdcp.adapt(settings, rdcp.pformAdapter);
    settings.id = id;
    settings.ds = ds;
    settings.action = action;

    rdcp.request(ds, {}, function (data) {
        var forms = data.body;
        settings.forms = forms;
        if (forms.length > 0)
            var container = rdcp.id(id).addClass("SR_faceContentBox").append("<form class='faceListForm'></form>");

        settings.beforeFormCreate(forms, settings);

        // 生成表单步骤
        rdcp.each(forms, function (index, form) {
            var formTmpl =
                "<div id='form_${form.code}' class='SR_faceContent' {{if index>0}}style='display:none'{{/if}} >" +
                    "<h1>${form.name}</h1>" +
                    "<div class='faceListBox'>" +
                    "<table class='faceListTable'></table>" +
                    "</div>" +
                    "<div class='faceListTableBtnBox'>" +
                    "<ul class='faceListTableUl'></ul>" +
                    "</div>" +
                    "</div>";

            settings.beforeFormStepCreate(index, form, settings);
            var formStepContainer = $.tmpl(formTmpl, {index: index, forms: forms, form: form});

            // buttonBarContainer
            var buttonBarContainer = formStepContainer.find(".faceListTableUl");
            var buttonBarFlag = false;
            if (p.onFormStepButtonBarCreate)
                buttonBarFlag = p.onFormStepButtonBarCreate(index, form, buttonBarContainer, settings);
            if (!buttonBarFlag)
                rdcp.pformDefaults.onFormStepButtonBarCreate(index, form, buttonBarContainer, settings);


            // 生成表单字段
            rdcp.each(form.fields, function (fieldIndex, field) {
                var fieldContainerTmpl =
                    "<tr>" +
                        "<td class='faceListBoxTitle'>${field.name}</td>" +
                        "<td class='faceListBoxFiled'></td>" +
                        "</tr>";
                var fieldContainer = $.tmpl(fieldContainerTmpl, {field: field});
                var $field = settings.onFormFieldCreate(index, forms, fieldIndex, field, settings);
                if (!$field) {
                    if (field.type == "TextField") {
                        return $("<input name='" + field.code + "' type='text' />");
                    }
                }
                if ($field) {
                    fieldContainer.find(".faceListBoxFiled").append($field);
                    formStepContainer.find(".faceListTable").append(fieldContainer);
                }
            });

            container.find(".faceListForm").append(formStepContainer);
            settings.onFormStepCreated(index, form, settings);
        });

        settings.onFromCreated(forms, settings);
    });
}