/**
 * Created by WebStorm.
 * @date   : 14-8-9
 * @author : 陶启立(taoqili)
 * @link   : touch.qunar.com
 * @desc   : popstate，但是hash没change就是无需保留状态的
 */
export default (() => {
    /**
     * 结构[[currentOut,targetIn],[backCurrentOut,backTargetIn]]
     */
    var switchNames = {
            cover: [
                ['', 'slideLeftIn'],
                ['slideRightOut', '']
            ],
            slideUp: [
                ['', 'slideUpIn'],
                ['slideDownOut', '']
            ],
            slideDown: [
                ['', 'slideDownIn'],
                ['slideUpOut', '']
            ],
            popup: [
                ['', 'scaleIn'],
                ['scaleOut', '']
            ],
            scaleDown: [
                ['', 'scaleDownIn'],
                ['scaleUpOut', '']
            ],
            flip: [
                ['', 'flipIn'],
                ['flipOut', '']
            ]
        },
        $backgroundPage, $tarPage, tarBackClass, callback, isBack;
    return {
        //执行转场动画
        transition: function ($fromPage, $toPage, goBack, fn) {

            if (!$toPage) return;

            //搜集相关参数
            $tarPage = $toPage;
            $backgroundPage = $fromPage;
            callback = fn;
            isBack = goBack;
            tarBackClass = $toPage.attr('class');

            var switchType = $tarPage.data('transition') || 'cover',
                switchName;

            //如果不需要动画，则直接展示
            if (switchType === "none") return;

            switchName = switchNames[switchType];
            if (!switchName || !switchName.length) {
                switchName = switchNames['cover'];
            }

            switchName = isBack ? switchName[1] : switchName[0];

            $backgroundPage.removeClass('active');

            //safari等浏览器下需要将动画先置入执行队列，
            //20151021补充：iphone6之后又TMD反过来了,擦！
            //setTimeout(function () {

            $tarPage.on($.fx.animationEnd, pageTransEnd);
            $tarPage.addClass('active')
            $tarPage.addClass('animation ' + (switchName[isBack ? 0 : 1] ? "animating " + switchName[isBack ? 0 : 1] : ''));
            //}, 0)
        },
        slide: function (selector, type, callback) {
            if (!selector)return;
            var $tar = $(selector);
            type = type || 'DownIn';
            $tar.on($.fx.animationEnd, function () {
                $tar.off($.fx.animationEnd);
                $tar.removeClass('animating').removeClass('animation').removeClass('slide' + type);
                callback && callback($tar);
            }).addClass('animating animation slide' + type);
        },
        //动画相关
        flash: function (selector, once) {
            var me = this;
            $(selector).addClass('qt-flash');
            if (once) {
                setTimeout(function () {
                    me.flashEnd(selector);
                }, 1000)
            }
        },
        flashEnd: function (selector) {
            $(selector).removeClass('qt-flash')
        },
        shake: function (selector, once) {
            var me = this;
            $(selector).addClass('qt-shake');
            if (once) {
                setTimeout(function () {
                    me.shakeEnd(selector);
                }, 300)
            }
        },
        shakeEnd: function (selector) {
            $(selector).removeClass('qt-shake')
        },
        rotate: function (selector, once, dir) {
            var me = this;
            $(selector).addClass(!dir ? 'qt-rotate' : 'qt-rotate-rev');
            if (once) {
                setTimeout(function () {
                    me.rotateEnd(selector);
                }, 1000)
            }
        },
        rotateEnd: function (selector) {
            $(selector).removeClass('qt-rotate').removeClass('qt-rotate-rev')
        }
    };

    function pageTransEnd() {
        isBack && $backgroundPage.addClass('active');
        $tarPage.attr('class', tarBackClass)[isBack ? 'removeClass' : 'addClass']('active');
        //卸载事件绑定，并触发动画结束事件
        $tarPage.off($.fx.animationEnd).trigger('animationEnd', isBack ? 'back' : 'open');
        //执行回调
        callback && callback();
        //释放全局变量
        $tarPage = null;
    }

})();
