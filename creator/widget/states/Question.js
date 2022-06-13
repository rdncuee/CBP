define([
  'taoQtiItem/qtiCreator/widgets/states/factory',
  'taoQtiItem/qtiCreator/widgets/interactions/states/Question',
  'taoQtiItem/qtiCreator/widgets/helpers/formElement',
  'tpl!CodeBlockProgrammingInteraction/creator/tpl/propertiesForm',
  'tpl!CodeBlockProgrammingInteraction/creator/tpl/choicePanel',
  'CodeBlockProgrammingInteraction/creator/widget/utils',
  'CodeBlockProgrammingInteraction/creator/Rectangle',
  'CodeBlockProgrammingInteraction/creator/Panel',
  'CodeBlockProgrammingInteraction/creator/ToCode',
  
], function (stateFactory, Question, formElement, formTpl, choiceTpl, utils, Rectangle, Panel, ToCode) {
  let observer;
  let initialized = false;
  const LiquidsInteractionStateQuestion = stateFactory.extend(Question, function (...args) {
    //ここは問題タブが有効になった際に叩かれる
    //add transparent protective layer\
 
    const widget = this.widget;
    const $container = this.widget.$container
      , $prompt = $container.find(".prompt")
      , interaction = this.widget.element
      , $title = $container.find('.question-title');
    interaction.data('repeatFlag', !!($(document).find('.interaction-state').attr('data-repeat-flag')));
    const repeatFlag = interaction.metaData.repeatFlag;
    const printText = interaction.metaData.printText;
    const printArea = document.getElementsByClassName("alert-print")[0];

    //実行結果ボタン
    document.getElementsByClassName("reset-btn")[0].style.display = "none"
    document.getElementsByClassName("exec-btn")[0].style.display = "none"
    document.getElementsByClassName("result-popup")[0].style.display = "none"

    const defaultData = $container.find('.questionState').attr('data-question-state')||"{}";
     //短冊復元処理
     if(interaction.metaData?.questionState){
      Rectangle.setRectangles($container.get(0),interaction.metaData.questionState)
     } else {
        if(defaultData){
          //初期状態
          const {leftRectangles = "", rightRectangles = "", rightAnserangles = ""} = JSON.parse(defaultData);
          const initialData = JSON.stringify({leftRectangles, rightRectangles})
          try{
            Rectangle.setRectangles(dom, initialData)
          }catch(e) {
            console.log(e)
          }
        }
     }
    
    if(printText) {
      printArea.innerHTML = "";
      Array.from(printText.children).map((item) => printArea.appendChild(item));
    };
    $('input[name="repeat_flg"]').attr('checked', repeatFlag)
      .on('click', function () {
        const checked = this.checked;
        interaction.data('repeatFlag', checked)
        interaction.updateMarkup();
        $container.find('.interaction-state').attr('data-repeat-flag', checked ? 'true' : '');

        if(this.checked){
          $('#alert-repeat').hide();
        }else{
          $('#alert-repeat').show();
        }
        
        const changeRepeatFlagEvent = new CustomEvent('changeRepeatFlag', {detail: checked});
        widget.$container.find('.CodeBlockProgrammingInteraction').get(0).dispatchEvent(changeRepeatFlagEvent);
    });
    
    
    $('input[name="exectime"]').on('input',function(e){
      interaction.data('exectime', e?.target.value);
      $container.find('.interaction-state').attr('exectime', e?.target.value);
      const changeExecTimeEvent = new CustomEvent('changeExecTime', {detail: e?.target.value});
        widget.$container.find('.CodeBlockProgrammingInteraction').get(0).dispatchEvent(changeExecTimeEvent);
        interaction.updateMarkup();
      });

    //保存処理
    const saveQuestion = () => {

      const defaultData = $container.find('.questionState').attr('data-question-state');

      let rightAnserangles;
      if(interaction.metaData.answerState) {
        rightAnserangles = JSON.parse(interaction.metaData.answerState)?.rightAnserangles
      }else {
        rightAnserangles = JSON.parse(defaultData||"{}")?.rightAnserangles
      }
      const leftRectangles = $('.edit-question').find('.left-container').html();
      const rightRectangles = $('.edit-question').find('.right-container').html();
      // $('.questionState').attr('data-question-state',JSON.stringify({leftRectangles, rightRectangles}));
      $('.questionState').attr('data-question-state',JSON.stringify({leftRectangles, rightRectangles, rightAnserangles}));
      interaction.data('questionState', JSON.stringify({
        leftRectangles,
        rightRectangles,
        rightAnserangles
      }));
      interaction.data('title', $title.html());
      interaction.updateMarkup();
    }
    if (!observer) {
      observer = new MutationObserver(records => {
        console.log('変更がありました');
        
        if($('.exec-area').html()){
          alert('編集操作を行ったため、設定した正答をクリアしました。');
          $('.exec-area').empty();
        }
        interaction.data('isInit', true)
        interaction.data('isInitResult', true)
        saveQuestion()
      })
    }
    saveQuestion();
    observer.observe($container.get(0), {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: [
        "data-rectangle-type",
        "data-rectangle-show-value",
        "data-rectangle-exec-value",
        "data-rectangle-id",
        "data-rectangle-arrowinput-value",
      ]
    })
    const createId = () => {
      //TODO　良いロジック浮かんだら変更　30ループ程度出し大丈夫そう
      for (let i = 1; i <= 30; i++) {
        if (!$container.find(`[data-rectangle-id=code_${i}]`).length)
          return "code_" + i
      }
    }
    let targetId = null;
    //選択中の短冊にbox-shadowをつける
    const changeTarget = (target) => {
      if(targetId) {
        const prevs = document.getElementsByClassName('current')
        Array.from(prevs).forEach((prev) => {
          prev.classList.remove("current");
        })
      }
      
      targetId = target.getAttribute("data-rectangle-id")
      const currents = document.querySelectorAll(`[data-rectangle-id=${targetId}`)
      currents.forEach((current) => {
        current.classList.add("current")
      })
    }

    const checkSameLocked = (rectid) => {
      const sameCode = Array.from(document.getElementsByClassName("right-container")[0].querySelectorAll(`[data-rectangle-id=${rectid}]`))
      const sameCodeLocked = sameCode.filter((item) => item.lastElementChild.classList.contains("locked"))
   
      if(sameCodeLocked.length && sameCode.length == sameCodeLocked.length){
        $('.left-container > [data-rectangle-id="' + rectid + '"]').hide();
      }
    }

    $container.on('click', '.right-container .lock', function () {
      let rectid = $(this).parent().attr('data-rectangle-id');
      $(this).parent().find('.rmv').remove();
      $(this).parent().append('<div class="locked"></div>');
      $(this).parent().addClass('filter');
      $(this).eq(1).remove();
      $(this).remove();
      checkSameLocked(rectid)
    })

    $container.on('click', '.right-container .locked', function () {
        $(this).parent().removeClass('filter');
        let rectid = $(this).parent().attr('data-rectangle-id');
        $('.left-container > [data-rectangle-id="' + rectid + '"]').show();
        $(this).parent().append('<div class="rmv"></div>');
        $(this).parent().append('<div class="lock"></div>');
        $(this).parent().find('.locked').remove();
    })

    $container.on('click', '.rectangle', function (e) {
      e.stopPropagation();
      changeTarget(this);
      const preValue = this.getAttribute('data-rectangle-id');
      Panel.createPanel(this, $container)
      if(this.getAttribute('data-rectangle-exec-value').length < 1){
        this.classList.add('block-alert-border');
        this.classList.add('filter');
        this.querySelector('.block-alert').classList.remove('d-none');
        $('#execRectangleValue').after('<section class="alertsection"><p>識別子:'+preValue+' 実行コードが未入力です。</p></section>')
      }
    });

    $container.on('click', '.left-container .rmv', function () {
      const $parent = $(this).parent();
      $(`.right-container .rectangle[data-rectangle-id="${$parent.attr("data-rectangle-id")}"] > .rmv`).click();
      if (confirm('選択した短冊型コードを削除します。よろしいですか？')) {
        $parent.remove()
      }
    });

    $container.on('click', '.right-container .rmv', function () {
      const $parent = $(this).parent();
      const $addPositionEl = $parent.next();
      const $appendContainer = $parent.parent();
      const appendEl = [];
      $parent.children('.box-none').each((_, nest) => {
        appendEl.push(nest.children);
      })

      if ($addPositionEl.length) {
        for (const el of appendEl)
          $addPositionEl.before(el);
      } else {
        for (const el of appendEl)
          $appendContainer.append(
            el
          )
      }
      $parent.remove()
      let rectid = $parent[0].getAttribute("data-rectangle-id")
      checkSameLocked(rectid)
    })

    $title.attr('contenteditable', true);

    //問題文フィールド変更
    $title.on('input', () => {
      const outputHTML = $title.html();
      if ($title.text()) {
        $title.removeClass('cke-placeholder')
      } else {
        $title.addClass('cke-placeholder')
      }
    })

    //panel内の値が変わったら保存
    $container.find('.js-popup-change').on('click', () => {
      const code = ToCode.createCode($container.find('.right-container').get(0));
      $container.find('.printJsCode').text(code);

      const popup = $container.find('.js-popup').get(0)
      popup.classList.toggle('is-show');
    })

    $container.find('.reset-btn').on('click', () => {
      if($container.find('.reset-btn').closest('.edit-question').length > 0){
        alert('試験問題管理タブ画面では利用できません。正答管理タブ画面で利用してください。');
        return false;
      }
    });
    $container.find('.exec-btn').on('click', () => {
      if($container.find('.exec-btn').closest('.edit-question').length > 0){
        alert('試験問題管理タブ画面では利用できません。正答管理タブ画面で利用してください。');
        return false;
      }
    });


    //.edit-question 
  
    $container.find('.addRectangle').on('click', function(){
      console.log('---addrectangle---')
          const id = createId();
        console.log($container.find(".left-container .rectangle").length);
          
      if ($container.find(".left-container .rectangle").length >= 30) {
        console.log('tuika--')
        return alert('短冊型コード選択肢に追加できる短冊型コードは、30個までです。');
        return false;
      }
      var rectype = '';
      // // clickしたボタンの種類から種別を分岐する
      if($(this).hasClass('addfor')){
        rectype = 'for';
      }
      else if($(this).hasClass('addwhile')){
        rectype = 'while';
      }
      else if($(this).hasClass('addcode')){
        rectype = 'process';
      }
      else if($(this).hasClass('addif')){
        rectype = 'if';
      }
      else if($(this).hasClass('addifelse')){
        rectype = 'ifElse';
      }
      else if($(this).hasClass('addprint')){
        rectype = 'print';
      }
      
      const rectangle = Rectangle.createRectangle({id:id, type:rectype, showValue:id.replaceAll('_', "#")});
      $container.find(".left-container").append(rectangle);
    });

    $container.find('.addSpaceBlock').on('click', () => {
      const space_rectangle = '<div class="rectangle spacerectangle">空白パーツ<div class="rmv"><i class="type-close js-remove"></i></div></div>';
      $("#item-editor-choice-property-bar").hide();
      if($(document).find('.edit-question .right-container .rectangle').length > 30){
          alert('解答欄に追加できる短冊型コードは、30個までです。');
      }else{
        $container.find(".right-container").append(space_rectangle);
      }
    });
    $container.find('.spacerectangle').on('click', () => {
      $("#item-editor-choice-property-bar").hide();
    });

    
    //実行結果正答が入力されている場合注意を表示
    if($('.exec-area').html()){
      $('.attention_span').show();
    }

    interaction.updateMarkup()
    initialized = true
  }, function (event) {
    observer && observer.disconnect();

    const widget = this.widget;
    const $title = widget.$container.find('.question-title');
    $title.attr('contenteditable', false);
    $title.removeClass('cke-placeholder')
    $title.off('input');

    widget.$container.off('click', '.rectangle');
    widget.$container.off('click', '.left-container .rmv')
    widget.$container.off('click', '.right-container .rmv')

    $(window).trigger('exitQuestion')
    $(document).off('change', '#choicePanel input');
    $(document).off('change', '#choicePanel textarea');

    $('[data-edit="question"]').hide();
    widget.$container.find('.addRectangle').off('click')
    widget.$container.find('.addSpaceBlock').off('click')
    widget.$container.find('.choicePanel').off('click')
    widget.$container.find('.exec-btn').off('click')
    widget.$container.find('.reset-btn').off('click')

    widget.$container.find('.js-popup-change').off('click')

    widget.$container.off('click', '.right-container .lock')
    widget.$container.off('click', '.right-container .locked')

    

  });
  LiquidsInteractionStateQuestion.prototype.testRun = function () {

  }
  LiquidsInteractionStateQuestion.prototype.initForm = function () {
    $('[data-edit="question"]').show();
    var _widget = this.widget,
      $form = _widget.$form,
      interaction = _widget.element,
      response = interaction.getResponseDeclaration();
    const $title = _widget.$container.find('.question-title');
    if (!$title.text()) {
      $title.addClass('cke-placeholder')
    }
    //render the form using the form template
    $form.html(formTpl({
      serial: response.serial,
      identifier: interaction.attr('responseIdentifier')
    }));

    //init form javascript
    formElement.initWidget($form);

    //init data change callbacks
    formElement.setChangeCallbacks($form, interaction, {

      identifier: function (i, value) {
        response.id(value);
        interaction.attr('responseIdentifier', value);
      }
    });

  };

  return LiquidsInteractionStateQuestion;
});
