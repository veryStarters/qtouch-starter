/**
 * Created by taoqili on 15/11/10.
 */
import $ from 'zepto';
import util from '../../core/util.js';
import mask from './mask.js';
import qtAnimate from '../../core/qtouch-animate.js'
export default (()=> {
    var emptyFn = new Function,
        defaultTpl = '<p class="qt-center qt-lh2 qt-bg-blue qt-white">聪明你的旅行！</p>',
        defaultOpt = {},
        onAnimating;
    return {
        show: function (opt) {
            if (onAnimating)return;
            onAnimating = true;
            if ($.type(opt) === 'string') {
                defaultTpl = opt;
                opt = null;
            }
            opt = $.extend({
                type: 'top',//bottom,left,right
                events: {},
                template: defaultTpl,
                duration: 1000 * 60 * 1000,
                opacity: false,
                maskOpacity: 0.4,
                hideImmediately:false,
                noMask: false,
                offsetX: 0,
                offsetY: 0,
                beforeShow:emptyFn,
                onShow: emptyFn,
                onHide: emptyFn,
                onReady: emptyFn,
                onTapMask: emptyFn,
                zIndex: setTimeout(0) + 100  //默认一个zIndex(100+)， setTimeout(0) 返回一个自增整型
            }, opt || {});

            if ($('.qt-sidebar.active').length) {
                onAnimating = false;
                return;
            }

            if (opt.tpl) {
                opt.template = opt.tpl;
            }
            defaultOpt = opt;
            var me = this,
                type = opt.type.toLowerCase(),
                typeDirMaps = {left: 'Right', right: 'Left', bottom: 'Up', top: 'Down'},
                topOrBottom = type === 'top' || type === 'bottom',
                $win = $(window),
                winHeight = $win.height(),
                $sidebar = $('.qt-sidebar.' + type).html(opt.template),
                offsetX = opt.offsetX,
                offsetY = opt.offsetY;

            util.delegateEvents($sidebar, opt, $sidebar, me);
            $.type(opt.onReady) === 'function' && opt.onReady.call(opt, $sidebar);

            switch (type) {
                case 'top':
                    offsetX && $sidebar.css('left', offsetX);
                    $sidebar.css('top', offsetY);
                    break;
                case 'bottom':
                    offsetX && $sidebar.css('left', offsetX);
                    $sidebar.css('top', winHeight - $sidebar.height() - offsetY);

                    // 监听页面高度变化
                    $(window).resize( function () {
                        $sidebar.css('top', $win.height() - $sidebar.height() - offsetY);
                    });

                    break;
                case 'left':
                    offsetX && $sidebar.css('left', offsetX);
                    $sidebar.css('top', offsetY);
                    break;
                case 'right':
                    offsetX && $sidebar.css('right', offsetX);
                    $sidebar.css('top', offsetY);
                    break;
                default :
                    break;
            }

            if (opt.opacity) {
                $sidebar.css('background-color', 'transparent');
            }
            $sidebar.height(function () {
                if (!topOrBottom) {
                    return winHeight;
                }
                var h = 0;
                $sidebar.children().each(function (index, item) {
                    var $item = $(item);
                    h += $item.height() + parseInt($item.css('margin-top'), 10) + parseInt($item.css('margin-bottom'), 10);
                });
                return h;
            }());

            if($sidebar.height() > winHeight - offsetY) {
                $sidebar.css('max-height', winHeight - offsetY - 80);
            }
            $sidebar.addClass('active')
                    .css('zIndex', opt.zIndex);
            $sidebar.data('type', type);
            !opt.noMask && mask.show({
                opacity: opt.maskOpacity,
                onTap: opt.onTapMask,
                zIndex: opt.zIndex - 1
            });

            $.type(opt.beforeShow) === 'function' && opt.beforeShow.call(opt, $sidebar);

            qtAnimate.slide($sidebar, typeDirMaps[type] + 'In', function () {
                $sidebar.show();
                setTimeout(function () {
                    me.hide();
                }, +opt.duration);
                $sidebar.attr({'class': ''}).addClass('qt-sidebar ' + type + ' active');
                opt.onShow && $.type(opt.onShow) === 'function' && opt.onShow.call(opt, $sidebar);
                onAnimating = false;
            });

        },
        hide: function (hideImmediately) {
            var $sidebar = $('.qt-sidebar.active');
            if (!$sidebar.length)return;

            if (onAnimating) {
                setTimeout(function () {
                    hide();
                }, 333);
                return;
            }
            hide();

            function hide() {
                onAnimating = true;
                var type = $sidebar.data('type'),
                    typeDirMaps = {left: 'Left', right: 'Right', bottom: 'Down', top: 'Up'};
                if (hideImmediately||defaultOpt.hideImmediately) {
                    clear(type);
                    return;
                }
                qtAnimate.slide($sidebar, typeDirMaps[type] + 'Out', function(){
                    clear(type)
                });
            }

            function clear(type) {
                var hideHandle = defaultOpt.onHide;
                !defaultOpt.noMask && mask.hide(hideImmediately||defaultOpt.hideImmediately,function(){
                    hideHandle && $.type(hideHandle) === 'function' && hideHandle.call(defaultOpt, $sidebar);
                });
                $sidebar.hide();
                $sidebar.html('').attr({'style': '', 'class': ''}).addClass('qt-sidebar ' + type);
                onAnimating = false;
                $(window).unbind('resize');
            }


        }
    };


})();