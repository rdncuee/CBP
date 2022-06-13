define([
    'lodash',
    'taoQtiItem/qtiCreator/model/mixin/editable',
    'taoQtiItem/qtiCreator/model/mixin/editableInteraction',
    'CodeBlockProgrammingInteraction/creator/widget/Widget',
    'tpl!CodeBlockProgrammingInteraction/creator/tpl/markup'
], function (_, editable, editableInteraction, Widget, markupTpl) {
    var methods = {};
    _.extend(methods, editable);
    _.extend(methods, editableInteraction);
    
    var _typeIdentifier = 'CodeBlockProgrammingInteraction';

    //since we assume we are in a tao context, there is no use to expose the a global object for lib registration
    //all libs should be declared here

    return _.extend(methods, {
        /**
         * (required) Get the typeIdentifier of the custom interaction
         *
         * @returns {String}
         */
        getTypeIdentifier: function () {
            return _typeIdentifier;
        },
        /**
         * (required) Get the widget prototype
         * Used in the renderer
         *
         * @returns {Object} Widget
         */
        getWidget: function () {
            // if($('#questionState').text()){
            //     JSON.parse($('#questionState').text()).forEach(rectangle=>{
            //         console.log(32323232323)
            //         new Rectangle(rectangle);
            //     })
            // }
            return Widget;
        },
        /**
         * (optional) Get the default properties values of the pci.
         * Used on new pci instance creation
         *
         * @returns {Object}
         */
        getDefaultProperties: function (pci) {
            return {switcher: false};
        },
        /**
         * (optional) Callback to execute on the
         * Used on new pci instance creation
         *
         * @returns {Object}
         */
        afterCreate: function (pci) {
            console.log("afterCreate")
            //do some stuff
        },
        /**
         * (required) Gives the qti pci xml template
         *
         * @returns {function} handlebar template
         */
        getMarkupTemplate: function () {
            console.log("getMarkupTemplate")
            let repeatFlag = !!($(document).find('.interaction-state').attr('data-repeat-flag'))
            if(repeatFlag){
                $('input[name="repeat_flg"]').attr('checked', repeatFlag);
            }
            let exectime = $(document).find('.interaction-state').attr('data-exec-time')
            if(exectime){
                $('input[name="exectime"]').val(exectime);
            }
            return markupTpl;
        },
        /**
         * (optional) Allows passing additional data to xml template
         *
         * @returns {function} handlebar template
         */
        getMarkupData: function (pci, defaultData) {
            console.log("getMarkupData")
            defaultData.answerState = pci.data("answerState") || defaultData.answerState;
            defaultData.questionState = pci.data("questionState") || defaultData.questionState;
            defaultData.title = pci.data("title") || defaultData.title;
            defaultData.prompt = pci.data("prompt") || defaultData.prompt;
            defaultData.repeatFlag = pci.data("repeatFlag") || defaultData.repeatFlag;
            defaultData.exectime = pci.data("exectime") || defaultData.exectime;
            return defaultData;
        }
    });
});

// define('test_a/creator/widget/states/Question', [
//     "jquery",
//     "i18n",
//     "taoQtiItem/qtiCreator/widgets/states/factory",
//     "taoQtiItem/qtiCreator/widgets/interactions/states/Question",
//     "taoQtiItem/qtiCreator/widgets/helpers/formElement",
//     "taoQtiItem/qtiCreator/editor/simpleContentEditableElement",
//     "taoQtiItem/qtiCreator/editor/containerEditor",
// ], function ($, __, stateFactory, Question, formElement, simpleEditor, simpleEditor) {
//     "use strict";
//
//     function toBoolean(value, defaultValue) {
//         return "undefined" == typeof value ? defaultValue : value === !0 || "true" === value
//     }
//
//     function configChangeCallBack(interaction, value, name) {
//         interaction.prop(name, value),
//             interaction.triggerPci("configChange", [interaction.getProperties()])
//     }
//
//     var MathEntryInteractionStateQuestion = stateFactory.extend(Question, function () {
//
//         toBoolean(interaction.prop("useGapExpression"), !1) && this.createAddGapBtn();
//         this.addMathFieldListener();
//     }, function () {
//         var $container = this.widget.$container
//         var $prompt = $container.find(".prompt");
//         simpleEditor.destroy($container);
//         containerEditor.destroy($prompt);
//         this.removeAddGapBtn();
//     });
//     return MathEntryInteractionStateQuestion.prototype.initForm = function () {
//         var $gapStyleBox, $gapStyleSelector, self = this, _widget = this.widget, $form = _widget.$form,
//             interaction = _widget.element, response = interaction.getResponseDeclaration();
//     }
// })
//
