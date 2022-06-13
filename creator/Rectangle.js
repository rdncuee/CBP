define([
  'taoQtiItem/portableLib/jquery_2_1_1',
  'tpl!CodeBlockProgrammingInteraction/creator/tpl/rectangle',
  'CodeBlockProgrammingInteraction/creator/widget/config',
  'CodeBlockProgrammingInteraction/lib/Sortable',


], function ($, rectangleTpl, config, Sortable) {

  return {
    createRectangle(idOrObject) {
      const nestTypes = ['while', 'for', 'if'];
      const doubleNestTypes = ['ifElse'];
      
      if (typeof idOrObject === "object") {
        return rectangleTpl(
          {
            ...idOrObject,
            convertShowValue: this._getConvertShowValue(idOrObject.showValue),
            nest: nestTypes.includes(idOrObject.type),
            doubleNest: doubleNestTypes.includes(idOrObject.type)
          }
        )
      } else {
        return rectangleTpl({
          id: idOrObject,
          showValue: idOrObject.replaceAll('_', "#"),
          convertShowValue: idOrObject.replaceAll('_', "#"),
          execValue: "",
          type: "process"
        })
      }
    },
    changeShowValue($target, str) {
      $target.children('.show-value').html(this._getConvertShowValue(str));
      $target.attr('data-rectangle-show-value', str);
    },
    changeExecValue($target, str) {
      $target.attr('data-rectangle-exec-value', str);
    },
    changearrowRectangleValue($target, str) {
      $target.attr('data-rectangle-arrowinput-value', str);
    },
    setRectangles(targetDom, state) {
      const {leftRectangles, rightRectangles, rightAnserangles} = JSON.parse(state);
      $(targetDom).find('.left-container').html(leftRectangles);
      $(targetDom).find('.right-container').html(rightRectangles);
      $(targetDom).find('.sortable-ghost').removeClass('sortable-ghost');

      $(targetDom).find('.right-container').find('[data-nest="nest"]').each((_, el) => {
        $(el).find('.box-none').each((_, el) => {
          new Sortable(el, {
            group: {
              name: 'shared',
              invertSwap: true,
            },
            animation: 150,
            onAdd: function (evt) {
              const createSortable = (evt) => $(evt.item).find('.box-none').each((_, el) => {
                new Sortable(el, {
                  group: {
                    name: 'shared',
                    invertSwap: true,
                  },
                  animation: 150,
                  onAdd: createSortable
                })
              })
              createSortable(evt)
            }
          });//TODO
        })
      })
    },
    ResetRectangles(targetDom, state) {
    },
    _getConvertShowValue(str) {
      
      //改行コードをすべて brに変更
      let preValue_after = str.replace(/\r?\n/g, "<br>");

      const MAX_LINE_NUM = config.maxLineNum;

      let lines = preValue_after.split("<br>");

      if (lines.length > MAX_LINE_NUM) {
        let result = "";
        for (let i = 0; i < MAX_LINE_NUM; i++) {
          result += lines[i] + "<br>";
        }
        preValue_after = result;
      }

      const input_text = preValue_after.match(/\¥textField_([a-zA-Z0-9]{1,3})/);
      const select_text = preValue_after.match(/\¥selectBox_([a-zA-Z0-9]{1,3})\[.+?\]/);

      if (input_text) {
        preValue_after = preValue_after.replace(/\¥textField_([a-zA-Z0-9]{1,3})/, '<input type="text" class="form-rect" data-input-id="' + input_text[0] + '">');
      }
      if (select_text) {
        const select_el = document.createElement('select');
        select_el.classList.add('form-rect-select');

        let array = select_text[0].match(/\[.*\]/);
        array = array[0].replace(/\[|\]/g, '');
        array = array.split(",");

        const option_first = document.createElement('option');
        option_first.value = '';
        option_first.textContent = '選択してください'
        select_el.appendChild(option_first);
        
        for (var i = 0; i < array.length; i++) {
          if (i >= 10) {
            break;
          }
          const option_el = document.createElement('option');
          option_el.value = array[i];
          option_el.textContent = array[i];
          select_el.appendChild(option_el);
        }
        preValue_after = preValue_after.replace(/\¥selectBox_([a-zA-Z0-9]{1,3})\[.+?\]/, select_el.outerHTML);
      }

      return preValue_after;
    }

  }
});
