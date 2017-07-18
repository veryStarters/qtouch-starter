import Tpl from './index.tpl';
function Circle(ele, options) {
    this.opt = $.extend({
        anchor: ele,     //页面锚点
        tpl: '',         //组件模板，需要传入Circle完整html结构
        num: 150,
        total_num: 100,
        time: 2000,
        skip: 1,
        size: '30px',
        border_size: '1px'
    }, options);
    this.init();
}
Circle.prototype = {
    init: function () {
        this.opt.num=parseFloat(this.opt.num);
        var me = this,
            opt = me.opt;
        var defaultTpl = Tpl,
            $anchor = $(opt.anchor),
            $tpl = $(opt.tpl || defaultTpl);

        me.$tpl = $tpl;
        me.initCircle();
        $tpl.css({width: opt.size, height: opt.size});
        $tpl.find('.ci_circle').css({'border-width': opt.border_size});
        $anchor.html($tpl);
        clearInterval(me.inertval);
        clearInterval(me.inertval2);
    },
    initCircle: function () {
        var me = this,
            $tpl = me.$tpl,
            prefix = $.fx.cssPrefix,
            $leftCircle = $tpl.find('.ci_leftcircle'),
            $rightCircle = $tpl.find('.ci_rightcircle');
        me.left_cricle_start = -135, me.left_cricle_end = 45;
        me.right_cricle_start = -135, me.right_cricle_end = 45;
        me.center_radius_start = 45, me.center_radius_end = 315;
        var leftCirclCss = {}
        leftCirclCss[prefix + 'transform'] = 'rotate3d(0,0,1,' + me.left_cricle_start + 'deg)';
        leftCirclCss[prefix + 'transition'] = prefix + 'transform 0s';
        $leftCircle.css(leftCirclCss);
        var rightCircleCss = {}
        rightCircleCss[prefix + 'transform'] = 'rotate3d(0,0,1,' + me.right_cricle_start + 'deg)';
        rightCircleCss[prefix + 'transition'] = prefix + 'transform 0s';
        $rightCircle.css(rightCircleCss);
    },
    circleStart: function () {
        var me = this, opt = me.opt;
        var total_num = opt.total_num, time = opt.time, num = opt.num;
        var ricle_each = 180 * 2 / total_num, transitionTime = time / 1000;
        var $tpl = me.$tpl,
            prefix = $.fx.cssPrefix,
            $leftCircle = $tpl.find('.ci_leftcircle'),
            $rightCircle = $tpl.find('.ci_rightcircle');
        me.initCircle();
        clearTimeout(me.Timeout);
        me.Timeout = setTimeout(function () {
            if (num <= total_num / 2) {
                var leftcircle_deg = me.left_cricle_start + num * ricle_each;
                var leftCircleCss = {};
                leftCircleCss[prefix + 'transform'] = 'rotate3d(0,0,1,' + leftcircle_deg + 'deg)';
                leftCircleCss[prefix + 'transition'] = prefix + 'transform linear ' + transitionTime + 's';
                $leftCircle.css(leftCircleCss);

            } else if (num <= total_num) {
                var rightcircle_deg = me.right_cricle_start + (num - total_num / 2) * ricle_each;
                var leftTransitionTime = total_num / 2 / num * transitionTime,
                    rightTransitionTime = (num - total_num / 2) / num * transitionTime;
                var rightCircleCss = {};
                rightCircleCss[prefix + 'transform'] = 'rotate3d(0,0,1,' + rightcircle_deg + 'deg)';
                rightCircleCss[prefix + 'transition'] = prefix + 'transform linear ' + rightTransitionTime + 's';
                $leftCircle.on('webkitTransitionEnd', function () {
                    $rightCircle.css({
                        'transform': 'rotate3d(0,0,1,' + rightcircle_deg + 'deg)',
                        '-webkit-transform': 'rotate3d(0,0,1,' + rightcircle_deg + 'deg)',
                        'transition': 'transform linear ' + rightTransitionTime + 's',
                        '-webkit-transition': '-webkit-transform linear ' + rightTransitionTime + 's'
                    });
                    $leftCircle.off('webkitTransitionEnd');
                })
                var leftCircleCss = {};
                leftCircleCss[prefix + 'transform'] = 'rotate3d(0,0,1,' + me.left_cricle_end + 'deg)';
                leftCircleCss[prefix + 'transition'] = prefix + 'transform linear ' + leftTransitionTime + 's';
                $leftCircle.css({
                    'transform': 'rotate3d(0,0,1,' + me.left_cricle_end + 'deg)',
                    '-webkit-transform': 'rotate3d(0,0,1,' + me.left_cricle_end + 'deg)',
                    'transition': 'transform linear ' + leftTransitionTime + 's',
                    '-webkit-transition': '-webkit-transform linear ' + leftTransitionTime + 's'
                });

            }
            var start = 0;
            clearInterval(me.inertval);
            me.inertval = setInterval(function () {
                if (start <= num) {
                    $tpl.find('.ci_txt_center').html(start.toFixed(1));
                    start += opt.skip
                } else {
                    clearInterval(me.inertval);
                    $tpl.find('.ci_txt_center').html(num.toFixed(1));
                }
            }, time / num * opt.skip);
        }, 100)
    }
}

module.exports = Circle;