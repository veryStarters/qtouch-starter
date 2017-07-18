function Turntable(ele, options) {
    this.opt = {
        anchor: ele || '',                     //页面锚点
        transitionTime: .5,                   //动画一圈时间
        items: [],
        onEnded: function () {
        }                                       //init完成
    };
    $.extend(this.opt, options);
    this.init(this.opt);
};

Turntable.prototype = {
    init: function (opt) {
        var me = this, opt = me.opt, $anchor = $(opt.anchor);
        me.stop = false;
        me.endDeg = 0;
        initListening();
        initListeningTransitionEnd();

        function initListening() {
            $anchor.on('webkitAnimationIteration', function (e) {
                var $this = $(this);
                if (!me.stop) {
                    return
                }
                $this.removeClass('animate qt-rotate');
                var cssPrefix = $.fx.cssPrefix,
                    cssData = {},
                    stopDeg = (parseInt(me.endDeg) + 720),
                    time = parseFloat(opt.transitionTime) / 360 * stopDeg * 1.5;
                cssData[cssPrefix + 'transition-duration'] = '0' + 's';
                cssData[cssPrefix + 'transition-timing-function'] = 'ease-out';
                cssData[cssPrefix + 'transform'] = 'rotate(0deg)';
                $this.css(cssData);
                setTimeout(function () {
                    cssData[cssPrefix + 'transition-duration'] = time + 's';
                    cssData[cssPrefix + 'transform'] = 'rotate(' + stopDeg + 'deg)';
                    $this.css(cssData);
                }, 1)

            })
        }

        function initListeningTransitionEnd() {
            $anchor.on($.fx.transitionEnd, function (e) {
                me.opt.onEnded(parseInt(me.endDeg));
            });
        }

    },
    start: function () {
        var $anchor = $(this.opt.anchor),
            cssData = {},
            cssPrefix = $.fx.cssPrefix;
        cssData[cssPrefix + 'animation-timing-function'] = 'linear';
        cssData[cssPrefix + 'animation-duration'] = this.opt.transitionTime + 's';
        cssData[cssPrefix + 'animation-iteration-count'] = 'infinite';
        cssData[cssPrefix + 'animation-direction'] = 'normal';
        this.stop = false;
        $anchor.css(cssData).addClass('qt-rotate');

    },
    endToDeg: function (endDeg) {
        this.endDeg = endDeg || 0;
        this.stop = true;
    },
    onEnded: function (endfun) {
        this.opt.onEnded = endfun;
    },
    reset: function(){
        $(this.opt.anchor).removeAttr('style');
    }

}
;
module.exports = Turntable;