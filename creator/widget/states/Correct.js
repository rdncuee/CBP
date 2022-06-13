define([
  'taoQtiItem/qtiCreator/widgets/states/factory',
  'taoQtiItem/qtiCreator/widgets/states/Correct',
  'CodeBlockProgrammingInteraction/creator/ToCode',
  'lodash'
], function (stateFactory, Correct, ToCode, _) {
  var LiquidsInteractionStateCorrect = stateFactory.create(Correct, function () {
    var widget = this.widget;
    const $container = this.widget.$container
      , $prompt = $container.find(".prompt")
      , interaction = this.widget.element
      , $title = $container.find('.question-title');
    var responseDeclaration = interaction.getResponseDeclaration();
    var correct = _.values(responseDeclaration.getCorrect());
    
    let correctItems = []
    if(correct.length){
      correctItems = JSON.parse(correct).result
    }
    
    interaction.onPci('responsechange', function (response) {
      correctItems = JSON.parse(response).result
      responseDeclaration.setCorrect([response]);
    });

    $container.find('.js-popup-change').on('click', () => {
      const code = ToCode.createCode($container.find('.right-container').get(0));
      $container.find('.printJsCode').text(code);

      const popup = $container.find('.js-popup').get(0)
      popup.classList.toggle('is-show');
    });
    
    $container.find('.result-popup').on('click', () => {
      var result_value = $('.exec-print').html();
      $('.exec-area').html(result_value);
      $('.exec-area').find('p').remove();
      const popup = $container.find('.exec-result-popup').get(0)
      popup.classList.add('is-show');
    });


    $container.find('.result-popup-close').on('click', () => {
      const popup = $container.find('.exec-result-popup').get(0)
      popup.classList.remove('is-show');
    });

    $container.on('click', '.edit-correct .right-container', () => {
    });

  }, function () {
    var widget = this.widget;
    var interaction = widget.element;
  });

  return LiquidsInteractionStateCorrect;
});
