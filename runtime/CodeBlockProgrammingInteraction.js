// $('.right-container').find('.rectangle').map((i,el)=>{
//   return el.getAttribute('data-rectangle-id')
// })

define([
  'lodash',
  'taoQtiItem/portableLib/jquery_2_1_1',
  'qtiCustomInteractionContext',
  'taoQtiItem/portableLib/OAT/util/event',
  'taoQtiItem/qtiCreator/model/mixin/editable',
  'taoQtiItem/qtiCreator/model/mixin/editableInteraction',
  'CodeBlockProgrammingInteraction/creator/Rectangle',
  'CodeBlockProgrammingInteraction/lib/Sortable',
  'CodeBlockProgrammingInteraction/lib/timeworker',
  'CodeBlockProgrammingInteraction/creator/ToCode',
  'CodeBlockProgrammingInteraction/creator/widget/config',

], function (_, $, qtiCustomInteractionContext, event, editable, editableInteraction, Rectangle, Sortable, timeWorker, ToCode, config) {

  var liquidsInteraction = {

    /**
     ']jjghgh * Custom Interaction Hook API: id
     */
    id: -1,
    peintResult:'',
    /**
     * Custom Interaction Hook API: getTypeIdentifier
     * A unique identifier allowing custom interactions to be identified within an item.
     * @returns {String} The unique identifier of this PCI Hook implementation.
     */
    getTypeIdentifier: function () {
      return 'CodeBlockProgrammingInteraction';
    },
    _currentResponse: {base: {string: ""}},
    /**
     *
     *
     * @param {String} id
     * @param {Node} dom
     * @param {Object} config - json
     */
    initialize: function (id, dom) {
      // Register the value for the 'id' attribute of this Custom Interaction Hook instance.
      // We consider in this proposal that the 'id' attribute
      this.id = id;
      this.dom = dom;
      window.dom = dom
      var self = this;

      // Tell the rendering engine that I am ready.
      // Please note that in this proposal, we consider the 'id' attribute to be part of the
      // Custom Interaction Hood API. The Global Context will then inspect the 'id' attribute
      // to know which instance of the PCI hook is requesting a service to be achieved.
      qtiCustomInteractionContext.notifyReady(this);

      //add method on(), off() and trigger() to the current object
      event.addEventMgr(this);
      let repeatFlag = !!($(dom).find('.interaction-state').attr('data-repeat-flag'));

      let exectime = $(dom).find('.interaction-state').attr('data-repeat-flag');

      dom.addEventListener('changeRepeatFlag', function (e) {
        repeatFlag = e.detail;
      })

      //動作時間変更時
      dom.addEventListener('changeExecTime', function (e) {
        exectime = e.detail;
        $(dom).find('.interaction-state').attr('data-exec-time', e.detail)
      })

      if (!$(dom).find('.interaction-state').attr('data-exec-time')) {
        $(dom).find('.interaction-state').attr('data-exec-time', 5)
      }
      
      new Sortable($(dom).find('.left-container').get(0), {
        group: {
          name: 'shared',
          pull: 'clone',
          put: false,
        },
        filter: ".filter",
        animation: 150,
        onAdd: function (evt) {
          console.log(evt)
        }
      });
      Sortable.create($(dom).find('.right-container').get(0), {
        group: 'shared',
        invertSwap: true,
        filter: ".filter",
        onAdd: function (evt) {
        //追加された時
          // 要素直前・直後の空白を削除する
          if($(evt.item).closest('.edit-answer, .runtime').length > 0){
            $(evt.item).prevUntil('[class*="box-"]').remove();
            $(evt.item).nextUntil('[class*="box-"]').remove();  
          }

          if($(document).find('.right-container .rectangle').length > 30){
            $(evt.item).remove();
            alert('解答欄に追加できる短冊型コードは、30個までです。');
            return false;
          }
          
          // el内のboxを検索しbox-noneがあればset-nestを追加
          const createSortable = (evt) => $(evt.item).find('.box-none').each((_, el) => {
            new Sortable(el, {
              onAdd: createSortable,
              group: {
                name: 'shared',
                invertSwap: true,
              },
              animation: 150,
            })
          })
          createSortable(evt)
          if (!repeatFlag) {
            const id = evt.item.getAttribute('data-rectangle-id')
            const rightTargets = $(dom).find('.right-container').children(`[data-rectangle-id=${id}]`).get()
            for (el of rightTargets) {
              if (el === evt.item) continue;
              evt.item.remove();
              return;
            }
          }
        },
        onFilter: function (evt) {
        },
        animation: 100,
      });

      const defaultData = $(dom).find('.questionState').attr('data-question-state');
      if (defaultData){
        const {leftRectangles, rightRectangles, rightAnserangles} = JSON.parse(defaultData);
        const initialData = JSON.stringify({leftRectangles, rightRectangles, rightAnserangles})
        Rectangle.setRectangles(dom, initialData)
      }

      $(dom).on('click', '.right-container .rmv', function () {
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
        // let rectid = $parent[0].getAttribute("data-rectangle-id")
        // checkSameLocked(rectid)
      })
    

      // テキストボックスの広がり
      $(dom).on('input', '.form-rect', function(){
          $(this).val(function(i, v){
            return v.replace(/(\,|\'|\"|\!|\=|\/|\+|\-|\~|\*|\%|\<|\>|\||\&|\?|\^|\(|\))/g,'');
          })
          if($(this).val().length > 8){
            const thiswidth = config.inputTextFieldWidth;
            const next_pixel = thiswidth + (($(this).val().length - 8) * 8);
            $(this).css('width', next_pixel + 'px');
          }
          $(this).attr('value',$(this).val());
      });

      // ドロップダウンの広がり
      $(dom).on('change', '.form-rect-select', function(){
        const select_val = $(this).val();
        if($(this).val().length > 13){
          const thiswidth = 130;
          let next_pixel = thiswidth + (($(this).val().length - 8) * 8);
          if(next_pixel > 200){
            next_pixel = 200;
          }
          $(this).css('width', next_pixel + 'px');
        }else{
          $(this).css('width', '130px');
        }
        $(this).find('option').not(`[value="${select_val}"]`).removeAttr('selected');
        $(this).find('option[value="'+select_val+'"]').attr('selected','selected');
      });

      
      
      
      
      // 実行ボタンを押さなくても短冊の移動をしただけで回答にJSONをセットするための処理
      $(dom).find('.right-container').on("DOMSubtreeModified propertychange change input", () => {
        
        console.log('なにか変更されました');
        
        // tocode
        const code = ToCode.createCode($(dom).find('.right-container').get(0), true, {exectime:$(dom).find('.interaction-state').attr('data-exec-time')});       
        // 移動しただけなのでresultは含めない
        const printResult = [];
        // codeblock
        const codeblock = $(dom).find('.right-container > .rectangle').not(('.right-container > .spacerectangle')).get().map((el) => {
            const getTansaku = (rectangleEl)=>{
              const nests = $(rectangleEl).children('.box-none').get();
              if (!nests.length) return{
                id:rectangleEl.getAttribute('data-rectangle-id'),
                type:rectangleEl.getAttribute('data-rectangle-type')
              }
              return {
                id:rectangleEl.getAttribute('data-rectangle-id'),
                type:rectangleEl.getAttribute('data-rectangle-type'),
                nests:nests.map((nest)=>{
                  const values = []
                  for (const childRectangle of nest.children)
                    values.push(getTansaku(childRectangle))
                  return values
                })
              }
            }
            return getTansaku(el)
        });
        
        $(dom).find('.right-container .rectangle').each((i, el) => {
          const input = $(el).children('.show-value').find('input').get(0)
          const select = $(el).children('.show-value').find('select').get(0)
          const getTansaku = (rectangleEl)=>{
            const nests = $(rectangleEl).children('.box-none').get();
            if(!nests.length)

            return {
              id:rectangleEl.getAttribute('data-rectangle-id'),
              nests:nests.length?nests.map((nest)=>{
                const values = []
                nest.children.forEach((childRectangle)=>{
                  getTansaku(childRectangle)
                })
                return values
              }):undefined
            }
          }
        
            const textbox = []
            const dropdown = []
            if (input) {
              const id = el.getAttribute('data-rectangle-show-value').match(/\¥textField_([a-zA-Z0-9]{1,3})/)[1]
              const value = input.value
              textbox.push({
                [id]: value
              })
            }
            if (select) {
              const id = el.getAttribute('data-rectangle-show-value').match(/\¥selectBox_([a-zA-Z0-9]{1,3})\[.+?\]/)[1]
              const value = select.value;
              dropdown.push({
                [id]: value
              })
            }
            self._currentResponse = {
              base: {
                string: JSON.stringify({
                  result: printResult,
                  code,
                  codeblock,
                  textbox,
                  dropdown,
                })
              }
            }
            
          self.trigger('responsechange', [self.getResponse().base.string]);
          
        });
});


      
      
      
      $(dom).find('.exec-btn').on("click", () => {

        const code = ToCode.createCode($(dom).find('.right-container').get(0), true, {exectime:$(dom).find('.interaction-state').attr('data-exec-time')});        
        

        const $execResultEl = $(dom).find('.exec-print');
        
        //解答欄に何も設定されてないときのエラー
        const result_element = $(dom).find('.right-container');
        const input_items = result_element[0].querySelectorAll('.form-rect');
        const select_items = result_element[0].querySelectorAll('.form-rect-select');
        const nest_items = result_element[0].querySelectorAll("[data-nest]")

        let empty_input = [];
        let empty_select = [];
        let empty_arrowitem = 0;
        let nets_overlimit = 0;
        let error_status = 0;

        //未入力のinputがないかチェック
        Array.from(input_items).forEach((item) => {
          const val = item.value;
          if(!val){
            empty_input.push(item);
          }

          //入力許可ワードのチェック
          const validation_value = item.parentNode.parentNode.getAttribute('data-rectangle-arrowinput-value')
          if(validation_value){
            const validation_value_array = validation_value.split(',');
            for(var i = 0; i < val.length; i++){
              if(validation_value_array.indexOf(val.charAt(i)) > -1){
              } else{
                empty_arrowitem = 1;
              }
            }
          }
        });
        
        //未選択のドロップダウンがないかチェック
        Array.from(select_items).forEach((item) => {
          const val = item.value;
          if(!val){
            empty_select.push(item);
          }
        });

        Array.from(nest_items).forEach((item) => {
          if(item.querySelectorAll('[data-nest="nest"] > .box-none > [data-nest="nest"]:first-child').length > 4){
            nets_overlimit = 1;
          }
        });

        //警告判定
        const warn = $(dom).find('.block-alert-border')[0];
        if(warn){
          alert("短冊型コードの編集が完了していません。短冊型コードに適切な値を入力して再度実行してください。")
          error_status = 1;
        }
        if(empty_input.length){
          alert("未入力のテキストボックスがあります。テキストボックスを入力後に再度実行してください。")
          error_status = 1;
        }
        if(empty_select.length){
          alert("未選択のドロップダウンリストがあります。ドロップダウンリストから選択後に再度実行してください。")
          error_status = 1;
        }
        if(empty_arrowitem === 1){
          alert("テキストボックスに利用できない文字列が含まれています。テキストボックスの入力内容を見直して再度実行してください。")
          error_status = 1;
        }
        if(!result_element.html()){
          alert('解答が入力されていません。解答欄に短冊型コードを設定して再度実行してください。');
          error_status = 1;
        }
        if(nets_overlimit === 1){
          alert('繰り返し短冊型コードは５階層までしか利用できません。');
          error_status = 1;
        }
        if(error_status === 1){
          return false;
        }else{
          if(confirm('プログラムを実行します。よろしいですか？')){
            
            var blobURL = URL.createObjectURL( new Blob([ '(',

            function(){
              self.addEventListener('message', function(code) {
                try {
                  const codeFunction = new Function('printBlock', code.data)
                  const printResult = [];

                  const printBlock = (printTarget) => {
                    if (typeof printTarget === "object") {
                      try {
                        printResult.push(JSON.stringify(printTarget));
                      } catch {
                        printResult.push('表示出来ないオブジェクトです。');
                      }
                      return;
                    }
                    printResult.push(printTarget);
                  }

                  codeFunction(printBlock);
                  self.postMessage({ result: printResult })
                } catch (e) {
                  let error;
                  switch (e === -10 ? e:e.constructor){
                    case -10:{
                      error = '規定回数以上の繰り返し処理が実行されたためプログラムを停止しました。プログラムに問題がないか確認のうえ再度実行してください。';
                      break;
                    }
                    case TypeError || ReferenceError:{
                      error = 'エラーが発生しました。変数の利用に誤りがないか確認してください。';
                      break;
                    }
                    case SyntaxError || RangeError:{
                      error = 'エラーが発生しました。構文に誤りがないか確認してください。';
                      break;
                    }
                    default:{
                      console.log(e);
                      error = 'エラーが発生しました。プログラムを再度確認してください。';
                    }
                  }
                  self.postMessage({ error });
                }
              }, false)
            }.toString(),

            ')()' ], { type: 'application/javascript' } ) )

          const worker = new Worker( blobURL );
          
          const codeString = JSON.stringify({code:ToCode.createCode($(dom).find('.right-container').get(0), true, {exectime:$(dom).find('.interaction-state').attr('data-exec-time')})});
          
          worker.postMessage(code);
        
          exec(worker)
          }else{
            return false;
          }
        }

        function exec(worker){
          try {
            let finish = false;
            worker.addEventListener('message', function(message) {
              const { error, result } = message.data ?? {};
              if (error) {
                $execResultEl.text(error);
                finish = true;
                return;
              } else if (!result) {
                return;
              }

              const showExecResults = result.map((str, index) => {
                //string[]を形式をhtml形式に変更する
                return `<div><span>${str}</span></div>`
              });
              $execResultEl.html(showExecResults);
              $execResultEl.append('<p class="result-complete">プログラムの実行が完了しました。</p>');
              finish = true

              self._currentResponse = {
                base: {
                  string: JSON.stringify({
                    result,
                    code,
                    codeblock,
                    textbox,
                    dropdown,
                  })
                }
              }
              self.trigger('responsechange', [self.getResponse().base.string]);
            }, false);

            let exectime = $(dom).find('.interaction-state').attr('data-exec-time');
            setTimeout(() => {
              if(!finish){
                worker.terminate();
                alert('プログラムが長時間実行されたためプログラムを停止しました。プログラムに問題がないか確認のうえ再度実行してください。')
              }
            } , exectime * 1000)
      
          } catch (e) {
            console.error(e); // unexpected error
          }
        }
        
        const textbox = []
        const dropdown = []
        $(dom).find('.right-container .rectangle').each((i, el) => {
            const input = $(el).children('.show-value').find('input').get(0)
            const select = $(el).children('.show-value').find('select').get(0)
            const getTansaku = (rectangleEl)=>{
              const nests = $(rectangleEl).children('.box-none').get();
              if(!nests.length)


              return {
                id:rectangleEl.getAttribute('data-rectangle-id'),
                nests:nests.length?nests.map((nest)=>{
                  const values = []
                  nest.children.forEach((childRectangle)=>{
                    getTansaku(childRectangle)
                  })
                  return values
                }):undefined
              }
            }
          if (input) {
            const id = el.getAttribute('data-rectangle-show-value').match(/\¥textField_([a-zA-Z0-9]{1,3})/)[1]
            const value = input.value
            textbox.push({
              [id]: value
            })
          }
          if (select) {
            const id = el.getAttribute('data-rectangle-show-value').match(/\¥selectBox_([a-zA-Z0-9]{1,3})\[.+?\]/)[1]
            const value = select.value;
            dropdown.push({
              [id]: value
            })
          }
          return el.getAttribute('data-rectangle-id')
        });
        
        const codeblock = $(dom).find('.right-container > .rectangle').not(('.right-container > .spacerectangle')).get().map((el) => {
        // const codeblock = $(dom).find('.right-container > .rectangle').get().map((el) => {
          const getTansaku = (rectangleEl)=>{
            const nests = $(rectangleEl).children('.box-none').get();
            if (!nests.length) return{
              id:rectangleEl.getAttribute('data-rectangle-id'),
              type:rectangleEl.getAttribute('data-rectangle-type')
            }
            return {
              id:rectangleEl.getAttribute('data-rectangle-id'),
              type:rectangleEl.getAttribute('data-rectangle-type'),
              nests:nests.map((nest)=>{
                const values = []
                for (const childRectangle of nest.children)
                  values.push(getTansaku(childRectangle))
                return values
              })
            }
          }
          return getTansaku(el)
        })
      })

      
      //リセットボタンクリック時の挙動
      $(dom).find('.reset-btn').on("click", function(){
        if(!confirm('解答欄を元の状態に戻します。よろしいですか？')){
          return false;
        }else{
          const defaultRightData = $(dom).find('.questionState').attr('data-question-state');
          const {leftRectangles, rightRectangles} = JSON.parse(defaultRightData);
          $('.right-container').empty();
          $('.right-container').html(rightRectangles);
          $('.exec-print').empty();
        }
      })
    },

    /**
     * Programmatically set the response following the json schema described in
     * http://www.imsglobal.org/assessment/pciv1p0cf/imsPCIv1p0cf.html#_Toc353965343
     *
     * @param {Object} interaction
     * @param {Object} response
     */
    setResponse: function (response) {
      this._currentResponse = response;

      if (typeof response?.base.string === 'string') {
        // 不完全だが、強引に「実行結果」の見た目を復元する
        // エラー時は復元されないし、exec後の処理をコピペして模倣しているだけなので、何らかの不整合が起きるかもしれない。
        const { result } = JSON.parse(response.base.string);
        if (result?.length) {
          const showExecResults = result.map((str, index) => {
            //string[]を形式をhtml形式に変更する
            return `<div><span>${str}</span></div>`
          });
          const $execResultEl = $(dom).find('.exec-print');
          $execResultEl.html(showExecResults);
          $execResultEl.append('<p class="result-complete">プログラムの実行が完了しました。</p>');
        }
      }
    },

    getResponse: function () {
      //ここのレスポンスがサーバーに保存される
      return this._currentResponse;
    },
    execCode: function () {
      const code = ToCode.createCode($(dom).find(".right-container").get(0), true, {exectime:$(dom).find('.interaction-state').attr('data-exec-time')})
      const codeFileUrl = URL.createObjectURL(new Blob([code], {type: 'application/text'}))
      var myWorker = new Worker(codeFileUrl);
    },
    /**
     * Remove the current response set in the interaction
     * The state may not be restored at this point.
     *
     * @param {Object} interaction
     */
    resetResponse: function () {
      this._currentResponse = {base: {string: ""}};
    },

    /**
     * Reverse operation performed by render()
     * After this function is executed, only the inital naked markup remains
     * Event listeners are removed and the state and the response are reset
     *
     * @param {Object} interaction
     */
    destroy: function () {
    },

    /**
     * Restore the state of the interaction from the serializedState.
     *
     * @param {Object} interaction
     * @param {Object} serializedState - json format
     */
    setSerializedState: function (state) {
      if (state?.questionRectangles) {
        Rectangle.setRectangles(dom, state.questionRectangles)
      }
      if (state && state.response) {
        // 上のsetRectanglesでDOMSubtreeModifiedなどが発生して一旦 this._currentResponse が初期化されるが
        // その「後」にここで state.response で上書きすることで、保存しておいた値を復元する強引な方法。
        // 当然ながらDOMを再度触ったらresponseは消えるが、それは仕様上正しい。
        this.setResponse(state.response);
      }
    },

    /**
     * Get the current state of the interaction as a string.
     * It enables saving the state for later usage.
     *
     * @param {Object} interaction
     * @returns {Object} json format
     */
    getSerializedState: function () {
      const rightRectangles = $('.right-container').html();
      const questionRectangles = JSON.stringify({ rightRectangles });

      return {response: this.getResponse(), questionRectangles };
    },

    _callbacks: [],

    createRectangle: function () {

    }
  };
  _.extend(liquidsInteraction, editable);
  _.extend(liquidsInteraction, editableInteraction);

  qtiCustomInteractionContext.register(liquidsInteraction);

});
