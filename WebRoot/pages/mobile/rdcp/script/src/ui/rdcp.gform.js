rdcp.gformDefaults = {
    // 整个向导表单创建完成,function(data, p){}
    onCreate:null,
    onStepCreate:null,

    onFieldCreate:null,

    //下一步
    onStepNext:null,
    //上一步
    onStepPre: null,
    //提交
    onSubmit:function(data,p){
        $.messager.alert('提示', '无法提交表单，请自定义onSubmit！', 'info');
    },



    //创建步骤
    createStep:function(data,p){
        var stepTmpl =
            "<div id='form_${form.code}' class='SR_faceContent' {{if index>0}}style='display:none'{{/if}} >" +
                "<h1>${form.name}</h1>" +
                "<div class='faceListBox'>" +
                "<table class='faceListTable'></table>" +
                "</div>" +
                "<div class='faceListTableBtnBox'>" +
                "<ul class='faceListTableUl'></ul>" +
                "</div>" +
                "</div>";
        data.stepContainer = $.tmpl(stepTmpl, {index: data.index, form: data.form});
        var  buttonBarContainer=data.stepContainer.find(".faceListTableUl");
        var  buttonData={index:data.index,buttonContainer:buttonBarContainer,form:data.form};
        if (data.index > 0){
            rdcp.gformDefaults.createPreBtn(buttonData,p);
        }
        if (data.index >= 0 && data.index < p.forms.length - 1){
            rdcp.gformDefaults.createNextBtn(buttonData,p);
        }
        if (data.index == p.forms.length - 1){
            rdcp.gformDefaults.createSubBtn(buttonData,p);
        }

       if(p.onStepCreate){
           p.onStepCreate(data,p);
       }


    },

    //创建字段
    _createField:function(data,p){
        var fieldContainerTmpl =
            "<tr>" +
                "<td class='faceListBoxTitle'>${field.name}</td>" +
                "<td class='faceListBoxFiled'></td>" +
                "</tr>";
        var fieldContainer = $.tmpl(fieldContainerTmpl, {field: data.field});
        data.fieldContainer=fieldContainer;

        //判断用户是否写了createField
        if(p.createField){
            if(p.createField(data,p)){
                data.stepContainer.find(".faceListTable").append(fieldContainer);
                return;
            }
        }
        var fieldDefault;
        if (data.field.type == "TextField") {
            fieldDefault="<input name='" + data.field.code + "' type='text'  />";
        }
        else if(data.field.type=="hiddenField"){
            fieldDefault="<input name='" + data.field.code + "' type='hidden'  />";
        }
        else if(data.field.type=="radioField"){
            fieldDefault="<input name='" + data.field.code + "' type='radio'  />";
        }
        else if(data.field.type=="readOnlyField"){
            fieldDefault="<input name='" + data.field.code + "' type='text' readonly='readonly'  />";
        }
        else if(data.field.type=="checkboxField"){
            fieldDefault="<input name='" + data.field.code + "' type='checkbox'   />";
        }
        else if(data.field.type=="passwordField"){
            fieldDefault="<input name='" + data.field.code + "' type='password'   />";
        }
        else if(data.field.type=="textareaField"){
            fieldDefault="<textarea name='"+data.field.code+"' rows='5' cols='20'></textarea>"
        }
        else if(data.field.type=="emptyField"){
            fieldDefault=data.field.code;
        }
        if(p.onFieldCreate){
            p.onFieldCreate(data,p);
        }
        fieldContainer.find(".faceListBoxFiled").append(fieldDefault);
        data.stepContainer.find(".faceListTable").append(fieldContainer);
    },
    //创建下一步按钮
    createNextBtn:function(data,p){
        var btnNext = $("<a href='javascript:void(0);' class='faceListTableBtn btnNext'>下一步</a>");
        btnNext.click(function () {
            if(p.onStepNext){
                if(!p.onStepNext(data,p)){
                    return;
                }
            }
            rdcp.id(p.id).find(".SR_faceContent").hide();
            rdcp.id(p.id).find("#form_" + p.forms[data.index + 1].code).show();
        });
        data.buttonContainer.append($("<li>").append(btnNext));

    },
    //创建上一步按钮
    createPreBtn:function(data,p){
        var btnPre = $("<a href='javascript:void(0);' class='faceListTableBtn btnPre'>上一步</a>");
        btnPre.click(function () {
            if(p.onStepPre){
                if(!p.onStepPre(data,p)){
                    return;
                }
            }
            rdcp.id(p.id).find(".SR_faceContent").hide();
            rdcp.id(p.id).find("#form_" + p.forms[data.index - 1].code).show();
        });
        data.buttonContainer.append($("<li>").append(btnPre));

    },
    //创建提交按钮
    createSubBtn:function(data,p){
        var btnSubmit = $("<a href='javascript:void(0);' class='faceListTableBtn btnSubmit'>提交</a>");
        btnSubmit.click(function () {
            p.onSubmit(data,p);
        });
        data.buttonContainer.append($("<li>").append(btnSubmit));
    },
    /**
     * 跳转到指定的step
     * @param stepNum 为step步骤号
     */
    toStep:function(stepIndex,p){
        if(p.forms[stepIndex]){
            rdcp.id(p.id).find(".SR_faceContent").hide();
            rdcp.id(p.id).find("#form_" + p.forms[stepIndex].code).show();
        }
        else{
            $.messager.alert('提示', 'index：'+stepIndex+'不存在', 'info');
        }
    }
};


/**
 * 创建向导表单
 * @param id 表单容器id
 * @param seqId 表单向导批次号
 * @param action 表单的提交地址
 * @param p 扩展属性
 */
rdcp.gform = function (id, seqId, action, p) {
    var settings = rdcp.extend({}, rdcp.gformDefaults, p);
    settings.id = id;
    settings.seqId = seqId;
    settings.action = action;
    // 获取向导表单数据
    var ds = "!ESale/System/Form/~java/Form.getForm?seqId=" + settings.seqId;
    rdcp.request(ds, null, function (data) {
        settings.forms = data.body;

        //移除上一次请求内容 防止内容重复
        rdcp.id(settings.id).find('.faceListForm').remove();


        if (settings.forms.length > 0){
            //生成整体页面容器
            var container = rdcp.id(settings.id).addClass("SR_faceContentBox").append("<form class='faceListForm'></form>");
            //对表单进行遍历
            rdcp.each(settings.forms, function (formIndex, form) {

                var stepData={index:formIndex,stepContainer:{},form:form};
                rdcp.gformDefaults.createStep(stepData,settings);

                //对字段就行遍历
                rdcp.each(form.fields,function(fieldIndex, field){
                    var fieldData={index:fieldIndex,field:field,stepContainer:stepData.stepContainer};
                    rdcp.gformDefaults._createField(fieldData,settings);
                });

                //把生成好的step加入页面中
                container.find(".faceListForm").append(stepData.stepContainer);
            });
            if(settings.onCreate){
                var formData={container:container,forms:data.body};
                settings.onCreate(formData,settings);
            }
        }
        else{
            $.messager.alert('提示','当前无可用的表单','info');
            return;
        }

    }, null);
};

