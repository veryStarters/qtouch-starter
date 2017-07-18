/**
 * Created by taoqili on 15/11/10.
 */
import $ from 'zepto';
export default (()=> {
    var $cur,
        $mask,
        $win = $(window),
        $body = $('body'),
        backScrollTop = 0;
    return {
        show: function (opt) {
            opt = $.extend({
                opacity: 0.2,
                onTap: new Function,
                zIndex: setTimeout(0) + 100  //默认一个zIndex(100+)， setTimeout(0) 返回一个自增整型
            }, opt || {});
            $mask = $('.qt-mask').css('zIndex', opt.zIndex);

            if ($mask.hasClass('active')) return;

            $body.addClass('qt-overflow');
            backScrollTop = $win.scrollTop();

            $cur = $('.qt-page-wrapper.active');
            !$cur.length && ($cur = $('.qt-wrapper'));
            $mask.addClass('active').css('height', $('body').get(0).scrollHeight + 40).fadeIn(100, '', opt.opacity);
            $mask.on('touchmove', function (e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }).one('tap', function () {
                opt.onTap && $.type(opt.onTap) === 'function' && opt.onTap();
            })
        },
        hide: function (hideImmediately, callback) {
            if (!$cur || !$cur.length) return;

            $body.removeClass('qt-overflow');
            if (hideImmediately) {
                clear();
            } else {
                $mask.fadeOut(200, function () {
                    clear()
                });
            }
            function clear(){
                $mask.removeClass('active')
                     .css('zIndex', '');
                $win.scrollTop(backScrollTop);
                callback && typeof callback === 'function' && callback();
            }
        }
    }

})();