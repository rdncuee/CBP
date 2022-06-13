define([
  'taoQtiItem/portableLib/jquery_2_1_1',
  'CodeBlockProgrammingInteraction/creator/widget/config',
  'CodeBlockProgrammingInteraction/lib/beautify'

], function ($, config, beautify) {
  return {
    /**
     *
     * @param rectangleContainer 短冊のある場所 (DOM)
     * @param executableCode 実行用コードか
     * @returns {string}
     */
    createCode(rectangleContainer, executableCode=false, options) {
      if (!rectangleContainer) throw new Error('解答欄が見つかりません。');
      let code = "";

      for (const rectangle of rectangleContainer.children)
        code += this.rectangleToCode(rectangle, executableCode)
    
      return beautify.js_beautify(code);
    },
    rectangleToCode(rectangle, codeAddWhileCount = false) {
      const $rectangle = $(rectangle);
      const type = $rectangle.attr('data-rectangle-type') || "";
      const codeid = $rectangle.attr('data-rectangle-id') || "";

      if (!type) return "";
      const baseCode = this.getBaseCode(type,codeAddWhileCount,codeid);

      //コード埋め込み
      let replaceCode = baseCode.replace("#", $rectangle.attr('data-rectangle-exec-value'))

      if (replaceCode.match(/\¥textField_([a-zA-Z0-9]{3})/)) {
        const inputValue = $rectangle.find('input').val();
        replaceCode = replaceCode.replace(/\¥textField_([a-zA-Z0-9]{3})/, inputValue)
      }
      if (replaceCode.match(/\¥selectBox_([a-zA-Z0-9]{3})/)) {
        const selectValue = $rectangle.find('select').val();
        replaceCode = replaceCode.replace(/\¥selectBox_([a-zA-Z0-9]{3})/, selectValue)
      }
      //子がいない場合
      if (!baseCode.includes('$'))
        return replaceCode;

      const transformCode = ['$', "%%"];
      //ネストの数だけfor
      $rectangle.children('.box-none').each((index, nest) => {
        let nestCode = "";
        for (const rectangle of nest.children)
          nestCode += this.rectangleToCode(rectangle)
        replaceCode = replaceCode.replace(transformCode[index], nestCode);
      })
      return replaceCode
    },
    getBaseCode(rectangleType,codeAddWhileCount = false,codeid) {
      switch (rectangleType) {
        case "while":
          return codeAddWhileCount ? `var __flag__${codeid} = 0;/* SYSTEM */ while(#){__flag__${codeid}++;/* SYSTEM */ if(__flag__${codeid}===${config.maxWhileNum}) throw -10;$}`: 'while(#){$}'
        case "for":
          return codeAddWhileCount ? `var __flag__${codeid} = 0;/* SYSTEM */ for(#){__flag__${codeid}++;/* SYSTEM */ if(__flag__${codeid}===${config.maxWhileNum}) throw -10;$}`: 'for(#){$}'
        case "if":
          return "if(#){$}"
        case "ifElse":
          return "if(#){$}else{%%}"
        case "print":
          return "printBlock(#); "
        default:
          return  '#';
      }
    },
  }
});

