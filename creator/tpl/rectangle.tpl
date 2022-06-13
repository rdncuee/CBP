<div data-rectangle-type="{{type}}" data-rectangle-show-value="{{showValue}}" data-rectangle-exec-value="{{execValue}}" data-rectangle-id="{{id}}" data-nest="{{#if nest}}nest{{/if}}{{#if doubleNest}}nest{{/if}}" data-rectangle-arrowinput-value="{{arrowinputValue}}" class="rectangle box-{{type}}"
>
<div class="show-value">{{{convertShowValue}}}</div>
    {{#if nest}}
            <div class="box-none list"></div>
    {{/if}}
    {{#if doubleNest}}
            <div class="list box-none"></div>
            <div>でなければ</div>
            <div class="list box-none"></div>
    {{/if}}
<div class="rmv"><i class="type-close js-remove"></i></div><div class="lock"></div><div class="block-alert d-none">！</div>
</div>
