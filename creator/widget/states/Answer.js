define([
  'taoQtiItem/qtiCreator/widgets/states/factory',
  'taoQtiItem/qtiCreator/widgets/interactions/states/Answer',
  'taoQtiItem/qtiCreator/widgets/interactions/helpers/answerState',
  'CodeBlockProgrammingInteraction/creator/Rectangle',
  'CodeBlockProgrammingInteraction/creator/widget/config'
], function (stateFactory, Answer, answerStateHelper, Rectangle, config) {
  let observer;
  let resetFlag = false;
  var LiquidsInteractionStateAnswer = stateFactory.extend(Answer, function () {
    
    const $container = this.widget.$container, interaction = this.widget.element;
    
    interaction.data('repeatFlag', interaction.metaData.repeatFlag)
    interaction.data('exectime', interaction?.metaData?.exectime||5)
    interaction.data('test', 'aaaaa')

    //ボタン表示
    const jsCodeBtn = document.getElementsByClassName("js-popup-change")[1].style.display = "inline-block"
    document.getElementsByClassName("result-popup")[0].style.display = "inline-block"
    document.getElementsByClassName("exec-btn")[0].style.display = "inline-block"
    document.getElementsByClassName("reset-btn")[0].style.display = "inline-block"
    // const resulPpopup = document.getElementsByClassName("result-popup")[0].style.display = "block"

    $('.attention_span').hide();

    //問題文
    const printArea = document.getElementsByClassName("alert-print")[0];

    //カレント表示解除
    Array.from(document.getElementsByClassName("current")).forEach((item) => {item.classList.remove("current")})

    const defaultData = $container.find('.questionState').attr('data-question-state')||"{}";

      //短冊復元処理
      // if(interaction.metaData?.questionState !== undefined){
      if(interaction.metaData?.isInit){
        let leftRectangles = "", rightRectangles = "", rightAnserangles = ""
        if(defaultData){
          leftRectangles = JSON.parse(defaultData)?.leftRectangles;
          rightRectangles = JSON.parse(defaultData)?.rightRectangles;
          rightAnserangles = JSON.parse(defaultData)?.rightAnserangles;
        }
        if(JSON.parse(interaction.metaData?.questionState||"{}")?.rightRectangles!= rightRectangles || interaction.metaData?.isInit) {
          //問題タブの回答欄が編集されていた場合
          console.log("問題タブの回答欄が編集されていた場合")
          Rectangle.setRectangles($container.get(0),interaction.metaData.questionState)
        } else {
            //問題タブの回答欄が編集されていない場合
            console.log(JSON.parse(interaction.metaData?.questionState||"{}")?.rightRectangles)
            console.log('問題タブの回答欄が編集されていない場合')
          if(interaction.metaData.answerState){
            //解答タブ側で編集していた場合
            console.log('解答タブ側で編集していた場合')
            Rectangle.setRectangles($container.get(0),interaction.metaData.answerState)
          }
        }

      }else{
        //初期状態
        let leftRectangles = "", rightRectangles = "", rightAnserangles = ""
        if(defaultData){
          leftRectangles = JSON.parse(defaultData)?.leftRectangles;
          rightRectangles = JSON.parse(defaultData)?.rightRectangles;
          rightAnserangles = JSON.parse(defaultData)?.rightAnserangles;
        }
        const initialData = JSON.stringify({leftRectangles, rightRectangles:rightAnserangles})
        try{
          Rectangle.setRectangles(dom, initialData)
        }catch(e){
          console.log(e)
        }
    }

    interaction.data('isInit', false)

    $container.find('.spacerectangle').addClass('filter');
    
    $container.find('.rectangleContainer').on('input', () => {
      saveAnswer()
    });
    
    //forward to one of the available sub state, according to the response processing template
    answerStateHelper.forward(this.widget);
    const saveAnswer = () => {
      if(interaction.metaData?.isInitResult) {
        //問題タブで編集等があった際に実行結果正答を削除
        $('.exec-area')[0].innerHTML = "";
        interaction.data('isInitResult', false)
      }
      const rightRectangles = JSON.parse(interaction.metaData.questionState||"{}")?.rightRectangles||JSON.parse(defaultData)?.rightRectangles;
      const leftRectangles = $('.edit-answer').find('.left-container').html();
      const rightAnserangles = $('.edit-answer').find('.right-container').html();
      interaction.data('answerState', JSON.stringify({
          leftRectangles,
          rightRectangles,
          rightAnserangles
      }));

      interaction.data('questionState', JSON.stringify({
        leftRectangles,
        rightRectangles,
        rightAnserangles
      }));
      
      interaction.updateMarkup();
    }
    if (!observer) {
      observer = new MutationObserver(records => {
        // 変化が発生したときの処理を記述
        saveAnswer()
      })
    }
    saveAnswer();
    observer.observe($container.get(0), {
      childList: true,
      subtree: true,
      attributeFilter: [
        "data-rectangle-type",
        "data-rectangle-show-value",
        "data-rectangle-exec-value",
        "data-rectangle-id",
        "data-rectangle-arrowinput-value",
        "value",
        "selected"
      ]
    })
    //ここにアンサーの状況変更のイベントを書いていく
    //短冊の状況を保存する
  }, function () {
    observer && observer.disconnect();
  });

  LiquidsInteractionStateAnswer.prototype.initResponseForm = function initResponseForm() {
    answerStateHelper.initResponseForm(this.widget, {
      rpTemplates: ['MATCH_CORRECT'],
    });
  };

  return LiquidsInteractionStateAnswer;
});
