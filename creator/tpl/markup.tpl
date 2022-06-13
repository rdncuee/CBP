<div class="CodeBlockProgrammingInteraction">
    
    <div class="popup js-popup">
        <div class="popup-inner">
            <div class="modal-header-box">
                <p>JavaScriptコード</p>
            </div>
            <div class="print-box scroll">
                <pre>
                    <code class="printJsCode"></code>
                </pre>
            </div>
            <div>
                <button class="js-popup-change" style="color: #0e5d91 !important">閉じる</button>
            </div>
        </div>
    </div>
    


    <div class="popup exec-result-popup">
        <div class="popup-inner">
            <div class="modal-header-box">
                <p>実行結果正答</p>
            </div>
            <div class="print-box scroll exec-area"></div>
            <div>
                <button class="result-popup-close" style="color: #0e5d91 !important">閉じる</button>
            </div>
        </div>
    </div>
    
    <div
            data-html-editable="true"
            data-placeholder="問題文フィールド"
            style="position: relative;"
            class="question-title cke_editable cke_editable_inline cke_contents_ltr" tabindex="0"
            spellcheck="false"
            role="textbox"
    >
    {{#if title}}
    {{{title}}}
    {{else}}
    <p>解答欄に追加できる短冊型コードは、30個までです。</p>
    <p id="alert-repeat">この問題では、短冊型コードを繰り返し利用することはできません。</p>
    <p>繰り返し短冊型コードは５階層までしか利用できません。</p>
    <p>条件分岐短冊型コードは５階層までしか利用できません。</p>
    {{/if}}
    </div>
    <div class="display-none questionState interaction-state" data-repeat-flag="{{repeatFlag}}" data-question-state="{{questionState}}" data-exec-time="{{exectime}}"></div>
    <div class="root">
        <div class="root-left root-child-border">
            <p class="root-child-title p-gray color-blue">短冊型コード選択肢</p>
            <div class="btns">
                <button class="addRectangle addcode pbtn-pi" data-edit="question" data-role="add-option">process</button>
                <button class="addRectangle addwhile pbtn-pi" data-edit="question" data-role="add-option">while</button>
                <button class="addRectangle addfor pbtn-pi" data-edit="question" data-role="add-option">for</button>
                <button class="addRectangle addif pbtn-pi" data-edit="question" data-role="add-option">if</button>
                <button class="addRectangle addifelse pbtn-pi" data-edit="question" data-role="add-option"><p style="margin-bottom:4px;margin-top:2px">if</p><p>else</p></button>
                <button class="addRectangle addprint pbtn-pi" data-edit="question" data-role="add-option">print</button>
            </div>
            <div class="rectangleContainer left-container"></div>
        </div>
        <div class="root-right">
            <div class="root-child-border root-answer">
                <p class="root-child-title p-gray">解答欄<span class="attention_span">正答管理タブ画面で使用している短冊型コードを編集した場合は、正答が初期化されます。</span></p>
                <div>
                    <button class="pbtn-pi addSpaceBlock color-blue" style="color: #0e5d91 !important;margin-bottom: 10px;line-height: 1em;" data-edit="question" data-role="add-option">+ 空白コードを追加</button>
                </div>
                <div class="rectangleContainer right-container"></div>
            </div>
            <div class="root-child-border root-exec">
                <p class="root-child-title p-gray">実行結果</p>
                <div class="exec-print"></div>
            </div>
            <div class="root-child-border" style="display:flex">
                <button class="pbtn-pi-tite pbtn-pi-noborder js-popup-change" data-edit="question" style="color: #0e5d91 !important">
                    JavaScriptコード
                </button>
                <button class="pbtn-pi-tite pbtn-pi-noborder pbtn-pi-gray reset-btn">リセット</button>
                <button class="pbtn-pi-tite pbtn-pi-noborder pbtn-pi-green exec-btn">実行</button>
                <button class="pbtn-pi-tite pbtn-pi-noborder result-popup" data-edit="question" style="color: #0e5d91 !important">
                    実行結果正答の確認
                </button>
            </div>
        </div>
    </div>
</div>
