define([
    'taoQtiItem/qtiCreator/widgets/states/factory',
    'taoQtiItem/qtiCreator/widgets/choices/states/states',
    'CodeBlockProgrammingInteraction/creator/widget/choice/Question',
    'CodeBlockProgrammingInteraction/creator/widget/choice/Choice'
], function(factory, states){
    return factory.createBundle(states, arguments);
});
