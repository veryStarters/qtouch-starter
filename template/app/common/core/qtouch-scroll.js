/**
 * Created by WebStorm.
 * @date   : 14-8-24
 * @author : 陶启立(taoqili)
 * @link   : touch.qunar.com
 * @desc   :
 */
import $ from 'zepto';
import util from './util.js';
export default  (()=> {

    var $win = $(window),
        initCallback = function (callback) {
            return callback && typeof callback === 'function' ? callback : new Function;
        },
        backScrollTop = 0;
    return {
        onScroll: function (callback,speed) {
            callback = initCallback(callback);
            $win.on('scroll', _.throttle(function (e) {
                var scrollTop = $win.scrollTop();
                callback(scrollTop > backScrollTop ? 'up' : 'down', scrollTop, e);
                backScrollTop = scrollTop;
            }, speed||100))
        },
        onScrollUp: function (callback,speed) {
            callback = initCallback(callback);
            $win.on('scroll', _.throttle(function (e) {
                var scrollTop = $win.scrollTop();
                scrollTop > backScrollTop && callback(scrollTop, e);
                backScrollTop = scrollTop;
            }, speed||100))
        },
        onScrollDown: function (callback,speed) {
            callback = initCallback(callback);
            $win.on('scroll', _.throttle(function (e) {
                var scrollTop = $win.scrollTop();
                scrollTop < backScrollTop && callback(scrollTop, e);
                backScrollTop = scrollTop;
            }, speed||100))
        },
        onScrollStop: function (callback) {
            callback = initCallback(callback);
            $win.on('scroll', _.debounce(function (e) {
                callback($('body').attr('scrollTop'));
            }, 100));
        },
        /**
         * 滚动到指定位置
         * @param top
         * @param callback
         * @param speed
         */
        scrollTo: function (top, callback, speed) {
            callback = initCallback(callback);
            var scrollTop = $win.scrollTop(),
                $body = $('body'),
                bodyScrollHeight = $body.attr('scrollHeight'),
                scrollUp;
            if (!top || top < 0) {
                top = 0;
            } else if (top > bodyScrollHeight) {
                top = bodyScrollHeight;
            }
            scrollUp = top <= scrollTop;

            //页面已经在底部
            if(!scrollUp && bodyScrollHeight === (scrollTop + $win.height())){
                return;
            }
            var maxSteps = 200;

            var timer = setInterval(function () {
                var scrollTop = $win.scrollTop(),
                    step;
                maxSteps--;
                if(!maxSteps){
                    $win.scrollTop(top);
                    timer && clearInterval(timer);
                    return;
                }
                if (scrollUp) {
                    step = Math.ceil((scrollTop - top) / 12);
                    if (scrollTop <= top) {
                        callback();
                        timer && clearInterval(timer);
                    }
                    scrollTop -= step;
                    if (scrollTop < 0) {
                        scrollTop = 0;
                    }
                } else {
                    step = Math.ceil((top - scrollTop) / 12);
                    if (scrollTop >= top) {
                        callback();
                        timer && clearInterval(timer);
                    }
                    scrollTop += step;
                    if (scrollTop > top) {
                        scrollTop = top;
                    }
                }
                $win.scrollTop(scrollTop);
            }, speed || 10);

            this.onScrollStop(function () {
                timer && clearInterval(timer);
            });

            $body.one('touchmove',function(){
                timer && clearInterval(timer);
            })
        },
        showScrollTopper: function () {

        },
        hideScrollTopper:function(){

        }
    };
})();