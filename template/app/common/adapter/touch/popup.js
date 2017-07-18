/**
 * Created by taoqili on 15/11/3.
 */
import util from '../../core/util.js';
import mask from './mask.js';
export default (()=> {

    var defaultTitle = '',
        defaultMsg = '总有你要的低价',
        defaultAnimate = 'bounceIn',
        emptyFn = new Function,
        oppAnimates = {
            'bounceIn': 'bounceOut',
            'slideLeftIn': 'slideRightOut',
            'slideRightIn': 'slideLeftOut',
            'scaleIn': 'scaleOut',
            'scaleDownIn': 'scaleUpOut',
            'slideUpIn': 'slideDownOut',
            'slideDownIn': 'slideUpOut'
        },
        defaultOptions = {
            title: defaultTitle,
            noHeader: false,
            noFooter: false,
            contentCenter: false,
            wrapBackground:'#fff',
            wrapOpacity:1,
            //preventTouchMove: true,
            autoHide: false,    // 若希望自动隐藏,则设值为毫秒数
            events: {},
            buttons: [
                {
                    label: '确定',
                    className: 'ok',
                    action: function () {
                    }
                }
            ],
            message: '',
            maskOpacity:.2,
            animate: defaultAnimate,      //显示动画
            onReady: emptyFn,
            onShow: emptyFn,
            onHide: emptyFn,
            onCancel: emptyFn,
            onTapMask: emptyFn,
            onClick: emptyFn
        }, popup;

    function Popup(opt) {
        var me = this;
        me.opt = $.extend({
            zIndex: setTimeout(0) + 100  //默认一个zIndex(100+)， setTimeout(0) 返回一个自增整型
        }, defaultOptions, opt);
        me.render();
        me.initEvents();
    }

    Popup.prototype = {
        constructor: Popup,
        render: function () {
            var me = this,
                $popup = $('.qt-popup');
            if (!$popup.length) {
                $popup = $('<div class="qt-popup"></div>');
                $popup.appendTo($('body'));
            }
            $popup.css('height', $(window).height());
            me.$popup = $popup;
            var html = fixTpl.call(me, me.opt.template || me.opt.tpl || me.opt.message);
            if ($.type(html) !== 'object') {
                render.call(me, $popup, html);
                var $content = $popup.find('.popup-content');
                $content.parents('.qt-popup-wrap').css({
                    'background-color':me.opt.wrapBackground,
                    'opacity':me.opt.wrapOpacity
                });
                fixHeight($content);
            } else {
                render.call(me, $popup, '<div class="qt-center qt-grey qt-font14"><div class="icon spinner qt-blue qt-font20"></div><p class="qt-mt10">加载中，请稍后…</p></div>');
                $popup.on('render', function (type, tpl) {
                    var $content = $popup.find('.popup-content');
                    $content.html(tpl).fadeIn();
                    fixHeight($content);
                });
            }

            //限定popup的最大高度不能超过窗口高度-196
            function fixHeight($content) {
                var maxHeight = $(window).height() - 196;
                if ($content.height() > maxHeight) {
                    $content.height(maxHeight);
                }
            }
        },
        initEvents: function () {
            var me = this,
                $popup = $('.qt-popup');
            $popup.on('domReady', function () {
                var opt = me.opt,
                    $content = $('.popup-content', $popup);
                util.delegateEvents($content, opt, $popup, me);
                $('.close-btn', $popup).on('touchend', function (e) {
                    me.close();
                    me.opt.onCancel.call(me);
                    util.prevent(e);
                });
                var $btns = $('.popup-btns', $popup);
                $.each(opt.buttons, function (index, btn) {
                    $('.' + btn.className, $btns).on('touchend', function (e) {
                        btn.action && btn.action.call(me);
                        me.close();
                        util.prevent(e);
                    })
                });
                opt.onReady.call(me, $content);
            }).on('tap', function (e) {
                if ($(e.target).hasClass('qt-popup')) {
                    me.opt.onTapMask(e);
                }else {
                    me.opt.onClick(e);
                }
            })
        },
        open: function () {
            var me = this,
                opt = me.opt;

            $('.qt-popup').addClass('active')
            	          .css('zIndex', opt.zIndex);
            //$('.qt-wrapper,.qt-pages-wrapper').addClass('filter-blur');
            opt.onShow && opt.onShow.call(me);
            if (opt.autoHide) {
                setTimeout(function () {
                    me.close();
                }, opt.autoHide)
            }
            setTimeout(function () {
                mask.show({
                    opacity: opt.maskOpacity,
                    zIndex: opt.zIndex - 1
                });
            });
        },
        close: function () {
            var me = this;
            $('.qt-popup').on($.fx.animationEnd, function () {
                var $thiz = $(this);
                //$('.qt-wrapper,.qt-pages-wrapper').removeClass('filter-blur');
                me.opt.onHide && me.opt.onHide.call(me);
                setTimeout(function () {
                    $thiz.remove();
                    mask.hide();
                });
                popup = null;
            }).addClass('animation animating ' + (oppAnimates[me.opt.animate] || 'bounceOut'))
            //.attr('tabindex',1).trigger('click');
        }
    };

    function render($popup, tpl) {
        var me = this,
            opt = me.opt,
            htmls = ['<div class="qt-popup-wrap" style="width: ' +
            (opt.width || ($(window).width() - 40)) + ( +opt.width ? 'px' : '') + ';">'];
        !opt.noHeader && htmls.push('<div class="popup-header"><span class="qt-black qt-bold">' + opt.title + '</span></div>');
        htmls.push('<div class="popup-content" style="' +
            (opt.height ? ('height:' + opt.height + 'px') : '') +
            (opt.contentCenter ? 'text-align: center' : '')+ '">' + (tpl || '') + '</div>');
        if (!opt.noFooter && opt.buttons.length) {
            var btns = [''];
            _.each(opt.buttons, function (btn, index, buttons) {
                btns.push('<p class="qt-blue btn small ' +
                    (btn.className || '') + ' ' +
                    (buttons.length == 2 ? 'col6' : buttons.length == 3 ? 'col4' : 'col12') + ' ' +
                    (index > 0 ? 'qt-bl-x1' : '') +
                    '">' + (btn.label || '确定') + '</p>');
            });
            htmls.push('<div class="qt-grid popup-btns qt-bt-x1">' + btns.join('') + '</div>');
        }
        //!opt.noHeader && htmls.push('<div class="close-btn icon cancel-circle qt-grey"></div>');
        htmls.push('</div>');
        $popup.html(htmls.join(''));

        $('.qt-popup-wrap').on($.fx.animationEnd, function () {
            $(this).removeClass(me.opt.animate).removeClass('animation animating');
        }).addClass(opt.animate + ' animation animating');
        //延迟触发，否则有可能触发不成功
        setTimeout(function () {
            $popup.trigger('domReady', me);
        }, 0);
    }

    function fixTpl(tpl) {
        var me = this,
            type = $.type(tpl),
            html = '';
        switch (type) {
            case 'function':
            case 'object':
                //调用模板定义函数
                html = type === 'function' ? tpl.call(me, qt && qt.requestData ? qt.requestData : {}) : tpl;
                //依据返回值进行渲染
                if ($.type(html) === "object") {
                    if (!html.url || !html.success) {
                        return '';
                    }
                    util.log('正在发送请求至：' + html.url + '; query:' + JSON.stringify(html.data));
                    $.ajax({
                        url: html.url || '',
                        method: html.method || 'get',
                        data: html.data || {},
                        dataType: html.dataType || 'json',
                        success: function (data) {
                            util.log('收到响应data：' + JSON.stringify(data));
                            $('.qt-popup').trigger('render', html.success(data));
                        },
                        error: html.error || function (e) {
                            util.error(JSON.stringify(arguments));
                        }
                    });
                }
                break;
            case 'string':
            case 'number':
                html = tpl;
                break;
            default :
        }
        return html;
    }

    function alert(opt, onOk) {
        if (popup)return;
        opt = opt || {};
        if ($.type(opt) !== "object") {
            opt = {message: opt, onOk: onOk}
        }
        //var winWidth = $(window).width();
        //if (opt.width && opt.width > winWidth) {
        //    opt.width = winWidth - 40;
        //}
        popup = new Popup({
            title: opt.title || defaultTitle,
            width: opt.width,
            noHeader: opt.noHeader,
            contentCenter: opt.contentCenter,
            animate: opt.animate || defaultAnimate,
            message: opt.message,
            zIndex: opt.zIndex,
            buttons: [
                {
                    label: opt.okText || '确定',
                    className: 'ok',
                    action: function () {
                        opt.onOk && opt.onOk.call(popup);
                        popup.close();
                    }
                }
            ]
        });
        popup.open();
    }

    function confirm(opt, onOk, onCancel) {
        if (popup) return;
        opt = opt || {};
        if ($.type(opt) === "string") {
            opt = {message: opt, onOk: onOk, onCancel: onCancel}
        }
        popup = new Popup({
            title: opt.title || defaultTitle,
            width: opt.width,
            noHeader: opt.noHeader,
            contentCenter: opt.contentCenter,
            animate: opt.animate || defaultAnimate,
            message: opt.message,
            zIndex: opt.zIndex,
            onTapMask:opt.onTapMask,
            buttons: [
                {
                    label: opt.cancelText ||'取消',
                    className: 'cancel',
                    action: function () {
                        opt.onCancel && opt.onCancel.call(popup);
                        popup.close();
                    }
                },
                {
                    label: opt.okText || '确定',
                    className: 'ok',
                    action: function () {
                        opt.onOk && opt.onOk.call(popup);
                        popup.close();
                    }
                }
            ]
        });
        popup.open();
    }

    return {
        alert: alert,
        confirm: confirm,
        show: function (opt) {
            if (popup)return;
            popup = new Popup(opt);
            popup.open();
        },
        hide: function () {
            if (!popup)return;
            popup.close();
        }
    }

})()
