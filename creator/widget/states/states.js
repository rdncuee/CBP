define([
    'taoQtiItem/qtiCreator/widgets/states/factory',
    'taoQtiItem/qtiCreator/widgets/interactions/customInteraction/states/states',
    'CodeBlockProgrammingInteraction/creator/widget/states/Question',
    'CodeBlockProgrammingInteraction/creator/widget/states/Answer',
    'CodeBlockProgrammingInteraction/creator/widget/states/Correct',
], function(factory, states){
    return factory.createBundle(states, arguments, ['map']);
});
