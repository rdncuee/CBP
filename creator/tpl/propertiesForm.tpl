<div class="panel">
    <div>
        <input style="width: 13px;margin-bottom: 20px;" type="checkbox" name="repeat_flg">選択肢の繰り返し利用
        <span class="icon-help tooltipstered" title="有効にした場合、選択短冊を繰り返し利用することができます。"></span>
    </div>
    <div>
        <label for="" class="has-icon">{{__ "プログラム動作時間"}}</label>
        <span class="icon-help tooltipstered" title="設定した時間が経過した場合、強制的にプログラムの実行を中断します。"></span>
        <input type="text" style="width: 80%;" name="exectime" value="{{#if exectime}}{{exectime}}{{else}}5{{/if}}" placeholder=""/> 秒
    </div>
</div>
