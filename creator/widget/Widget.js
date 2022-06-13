define([
    'taoQtiItem/qtiCreator/widgets/interactions/customInteraction/Widget',
    'taoQtiItem/portableElementRegistry/ciRegistry',
    'CodeBlockProgrammingInteraction/creator/widget/states/states',
    'lodash'
], function(Widget,ciRegistry, states,_){

    var LiquidsInteractionWidget = Widget.clone();

    LiquidsInteractionWidget.initCreator = function(){

        this.registerStates(states);

        Widget.initCreator.call(this);
    };
    LiquidsInteractionWidget.createToolbar = function(options){

        var creator = ciRegistry.getAuthoringData(this.element.typeIdentifier);
        options = _.defaults(options || {}, {title : "Programming Interaction"});

        return Widget.createToolbar.call(this, options);
    };
    return LiquidsInteractionWidget;
});
