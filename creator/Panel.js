define([
    'taoQtiItem/portableLib/jquery_2_1_1',
    'tpl!CodeBlockProgrammingInteraction/creator/tpl/choicePanel',
    'CodeBlockProgrammingInteraction/creator/Rectangle',
    'CodeBlockProgrammingInteraction/creator/widget/config',
    'CodeBlockProgrammingInteraction/lib/Sortable'
], function ($, choiceTpl, Rectangle, config,Sortable) {
    return {
        createPanel(targetEl, dom) {
            if(!targetEl.classList.contains('spacerectangle')){
                $("#item-editor-choice-property-bar").show();
                const $panel = $("#item-editor-choice-property-bar .panel")
    
                $panel.children().remove();
                const identifier = targetEl.getAttribute('data-rectangle-id')
                $panel.html(choiceTpl({
                    identifier: identifier,
                }));
                $("#showRectangleValue").val(targetEl.getAttribute('data-rectangle-show-value').replace(/<br>/,"\n"));
                $("#execRectangleValue").val(targetEl.getAttribute('data-rectangle-exec-value'));
                if(!targetEl.getAttribute('data-rectangle-arrowinput-value')){
                    $("#arrowRectangleValue").val("a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,0,1,2,3,4,5,6,7,8,9");                
                }else{
                    $("#arrowRectangleValue").val(targetEl.getAttribute('data-rectangle-arrowinput-value'));
                }
                this._addPanelEvent(dom, targetEl);
            }else{                
                $("#item-editor-choice-property-bar").hide();
            }
        },
        _addPanelEvent(dom, targetEl) {
            const self = this;
            let id = targetEl.getAttribute('data-rectangle-id');

            //------------ID入力欄
            const $idInputText = $('#choicePanel #identifier'); //識別子入力する所
            let preIdentifierValue = $idInputText.val();

            // left-containerの短冊の識別子をすべてfindTartgetsに入れる;
            const findTargets = (id, all) => $(dom).find(`${all ? "" : ".left-container "}[data-rectangle-id=${id}]`)

            $idInputText.change(function () {
                const value = $(this).val();
                //入力した識別子がすでに存在する場合
                if (findTargets(value).length) {
                    $(this).val(preIdentifierValue);
                    $('.left-container [data-rectangle-id="'+id+'"]').addClass('block-alert-border');
                    $('.left-container [data-rectangle-id="'+id+'"]').find('.block-alert').removeClass('d-none');
                    $('#sidebar-right-choice-properties').find('#identifier').parent().append('<section class="alertsection"><p>識別子:'+value+' 識別子が他の短冊型コードと重複しています。</p></section>')
                }
                else{
                    $('#sidebar-right-choice-properties').find('#identifier').next('.alertsection').remove();
                }
                const $targets = $(dom).find(`[data-rectangle-id=${id}]`);
                $targets.attr("data-rectangle-id", value);
                id = value;
            });

            //------識別子
            let preValue = $idInputText.val();
            $("#identifier").on('input', function () {
                const inputValue = $idInputText.val();
                if (inputValue.match(/[^0-9a-z_]/gi)//半角英数アンダーバー
                    || !inputValue.match(/_/g) //_0個
                    || inputValue.match(/_/g).length > 1
                    || new Blob([inputValue]).size > config.inputIdMax
                ) {//__2個
                    $idInputText.val(preValue);
                    return;
                }
                preValue = $idInputText.val();
            });

            //------実行コードチェック
            $('#execRectangleValue').on('input', function() {
                const inputValue = $(this).val();
                if(inputValue == ''){
                    $('.left-container [data-rectangle-id="'+preValue+'"]').addClass('block-alert-border');
                    $('.left-container [data-rectangle-id="'+preValue+'"]').addClass('filter');
                    $('.left-container [data-rectangle-id="'+preValue+'"]').find('.block-alert').removeClass('d-none');
                    $('#execRectangleValue').after('<section class="alertsection"><p>識別子:'+preValue+' 実行コードが未入力です。</p></section>')
                }else{
                    $('.left-container [data-rectangle-id="'+preValue+'"]').removeClass('block-alert-border');
                    $('.left-container [data-rectangle-id="'+preValue+'"]').removeClass('filter');
                    $('.left-container [data-rectangle-id="'+preValue+'"]').find('.block-alert').addClass('d-none');
                    $('#execRectangleValue').next('.alertsection').remove();
                }
                $('.attention_span').hide();
                $('.exec-area').empty();
            });
            //------表示内容チェック
            $('#showRectangleValue').on('input', function() {
                const inputValue = $(this).val();
                if(inputValue == ''){
                    $('.left-container [data-rectangle-id="'+preValue+'"]').addClass('block-alert-border');
                    $('.left-container [data-rectangle-id="'+preValue+'"]').addClass('filter');
                    $('.left-container [data-rectangle-id="'+preValue+'"]').find('.block-alert').removeClass('d-none');
                    $('#showRectangleValue').after('<section class="alertsection"><p>識別子:'+preValue+' 表示内容が未入力です。</p></section>')
                }else{
                    $('.left-container [data-rectangle-id="'+preValue+'"]').removeClass('block-alert-border');
                    $('.left-container [data-rectangle-id="'+preValue+'"]').removeClass('filter');
                    $('.left-container [data-rectangle-id="'+preValue+'"]').find('.block-alert').addClass('d-none');
                    $('#showRectangleValue').next('.alertsection').remove();
                }
            });

            //------ラジオボタン
            $(`input[value=${targetEl.getAttribute('data-rectangle-type')}]:radio`).attr("checked", true)
            $(`input[name="processType"]:radio`).change(function () {
                console.log(findTargets(id));
                findTargets(id, true).each((_, el) => {
                    const $el = $(el);
                    $el.attr('data-rectangle-type', $(this).val());

                    const $addPositionEl = $el.next();
                    const $appendContainer = $el.parent();
                    const $newRectangle = $(self._changeRectangle(el));

                    const appendEl = [];
                    $el.children('.box-none').each((_, nest) => {
                        appendEl.push(nest.children);
                    })

                    el.remove();

                    if(appendEl.length && $newRectangle.find('.box-none').length){
                        for(const childEl of appendEl ){
                            $($newRectangle.find('.box-none').get(0)).append(childEl)
                        }
                    }else{
                        if($addPositionEl.length){
                            for(const childEl of appendEl ){
                                $addPositionEl.before(childEl);
                            }

                        }else{
                            for(const childEl of appendEl ){
                                $appendContainer.append(childEl);
                            }
                        }

                    }
                    if ($addPositionEl.length) {

                        $addPositionEl.before($newRectangle);
                    } else {
                        $appendContainer.append(
                            $newRectangle
                        )
                    }

                    $newRectangle.find('.box-none').each((_,el)=>{
                        new Sortable(el,{
                            group: 'shared',
                            animation: 150,
                            onAdd(evt){
                                const createSortable = (evt) => $(evt.item).find('.box-none').each((_, el) => {
                                    new Sortable(el, {
                                        group: 'shared',
                                        animation: 150,
                                        onAdd:createSortable
                                    })
                                })
                                createSortable(evt)
                            }
                        })
                    })

                    
                    $newRectangle[0].classList.add("current")
                })
            });

            !(() => {
                const $evtTarget = $("#showRectangleValue");
                let preValue = $evtTarget.val();
                $evtTarget.on('input', function () {
                    const value = $(this).val();
                    const disableChange = config.inputShowValueMax < new Blob([value]).size
                    if (!disableChange)
                        preValue = value;
                    $(this).val(preValue);

                    Rectangle.changeShowValue(findTargets(id, true), preValue)

                })
            })();

            !(() => {
                const $evtTarget = $("#execRectangleValue");
                let preValue = $evtTarget.val();
                $evtTarget.on('input', function () {
                    const value = $(this).val();
                    const disableChange = config.inputExecValueMax < new Blob([value]).size;
                    if (!disableChange)
                        preValue = value;
                        $(this).val(preValue);
                    Rectangle.changeExecValue(findTargets(id, true), preValue)
                })
            })();

            !(() => {
                const $evtTarget = $("#arrowRectangleValue");
                let preValue = $evtTarget.val();
                $evtTarget.on('input', function () {
                    const value = $(this).val();
                    const disableChange = config.inputarrowValueMax < new Blob([value]).size
                    if (!disableChange)
                        preValue = value;
                    $(this).val(preValue);

                    Rectangle.changearrowRectangleValue(findTargets(id, true), preValue)

                })
            })();


        },
        _changeRectangle(el, object) {
            const type = el.getAttribute('data-rectangle-type');
            const alert = !el.classList.contains('block-alert-border');
            return Rectangle.createRectangle({
                id: el.getAttribute('data-rectangle-id'),
                type: el.getAttribute('data-rectangle-type'),
                showValue: el.getAttribute("data-rectangle-show-value"),
                execValue: el.getAttribute('data-rectangle-exec-value'),
                arrowinputValue: el.getAttribute('data-rectangle-arrowinput-value'),
                alertStatus: alert
            })
        }
    }
});
