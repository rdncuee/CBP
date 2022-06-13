<div id="choicePanel">
    <div>
        <label for="identifier">識別子</label>
        <span class="icon-help tooltipstered" title="短冊型コードの識別子です。重複しない値を設定してください。"></span>
        <input type="text" value="{{identifier}}" id="identifier"/>
    </div>
    <div style="margin-top: 8px;">
        <label for="identifier">短冊種別</label>
        <span class="icon-help tooltipstered" title="短冊型コードの種別です。"></span>
        <div>
            <input style="width:16px" id="process" value="process" name="processType" type="radio"/>
            <label for="process">
                処理
            </label>
        </div>
        <div>
            <input style="width:16px" id="while" value="while" name="processType" type="radio"/>
            <label for="while">
                繰り返し(while)
            </label>
        </div>
        <div>
            <input style="width:16px" id="for" value="for" name="processType" type="radio"/>
            <label for="for">
                繰り返し(for)
            </label>
        </div>
        <div>
            <input style="width:16px" id="if" value="if" name="processType" type="radio"/>
            <label for="if">
                条件分岐(if)
            </label>
        </div>
        <div>
            <input style="width:16px" id="ifElse" value="ifElse" name="processType" type="radio"/>
            <label for="ifElse">
                条件分岐(if-else)
            </label>
        </div>
        <div>
            <input style="width:16px" id="print" value="print" name="processType" type="radio"/>
            <label for="print">出力(print)</label>
        </div>
    <div style="margin-top: 8px;">
        <label for="execRectangleValue">実行コード</label>
        <span class="icon-help tooltipstered" title="短冊型コードに関連付けるJavaScriptのソースコートです。try-catchは、プログラムが適切に実行できなくなる恐れがあるため、利用しないでください。"></span>

        <textarea id="execRectangleValue"></textarea>
    </div>
    <div style="margin-top: 8px;">
        <label for="showRectangleValue">表示内容</label>
        <span class="icon-help tooltipstered" title="短冊型コードに表示する表示内容です。"></span>
        <textarea id="showRectangleValue"></textarea>
    </div>
    <div style="margin-top: 8px;">
        <label for="arrowRectangleValue">入力許可ワード</label>
        <span class="icon-help tooltipstered" title="テキストボックスに入力可能な文字列を指定します。文字列はカンマ区切りで指定します。"></span>
        <textarea id="arrowRectangleValue"></textarea>
    </div>
</div>
