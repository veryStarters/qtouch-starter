function Billboard(ele, options) {
    this.opt = {
        anchor: ele || '',                     //页面锚点
        transitionTime: 1.5,                   //过渡动画时间
        autoplay: false,                        //是否自动播放
        intervalTime: 2000,                   //自动轮播时间间隔
        loop: true,                           //循环模式
        limit: 5,                               //滚动内容行数
        lineHeight: '30',                        //行高
        items: [],
        onReady: function () {
        }                                       //init完成
    };
    $.extend(this.opt, options);
    this.init(this.opt);
};

Billboard.prototype = {
    init: function (opt) {
        var me = this, opt = me.opt;
        build();
        var $anchor = $(opt.anchor);
        onTransitionEnd();
        opt.autoplay && me.startAutoPlay();

        function build() {
            var $defaultTpl = $('<div class="billboard-scroll-list" style="position: relative;width: 100%;' + $.fx.cssPrefix + 'transform:translate3d(0,0,-1px);"' + '></div>'),
                itemLength = opt.items.length;
            me.realLimit = itemLength > opt.limit ? opt.limit + 1 : itemLength;
            me.lastItemIndex = itemLength > opt.limit ? opt.limit : itemLength - 1;
            for (var i = 0; i < me.realLimit; i++) {
                var $div = $('<div style="position: absolute;height:' + opt.lineHeight + 'px;' + $.fx.cssPrefix + 'transform:translate3d(0,' + i * opt.lineHeight + 'px,0);"' + '></div>');
                $div.html(opt.items[i]);
                $defaultTpl.append($div);
            }
            $(opt.anchor).html($defaultTpl);
        }

        function onTransitionEnd() {
            $anchor.on($.fx.transitionEnd, '.billboard-scroll-list', function () {
                me.opt.loop && loop();
            })
        }

        function loop() {
            var $billboardScrollList = $(me.opt.anchor).find('.billboard-scroll-list'),
                $firstItem = $billboardScrollList.find('>div:first-child'),
                items = me.opt.items,
                nextIndex = me.lastItemIndex + 1 >= items.length ? 0 : me.lastItemIndex + 1;
            me.addTranslate($firstItem, 0, 0, me.realLimit * me.opt.lineHeight);
            //$firstItem.html(items[nextIndex]);
            $billboardScrollList.append($firstItem);
            me.lastItemIndex = nextIndex;
        }

        me.opt.onReady();
    },
    scrollTop: function () {
        this.opt.autoplay && this.setLinePosition();
        this.addTranslate($(this.opt.anchor).find('.billboard-scroll-list'), this.opt.transitionTime, 0, -parseInt(this.opt.lineHeight));
    },
    setTransition: function (dom, transitionTime, TranslateX, TranslateY, TranslateZ) {
        var $dom = $(dom),
            cssPrefix = $.fx.cssPrefix,
            cssData = {};
        ($dom.css('transition-duration') !== (transitionTime || 0) + 's') && (cssData[cssPrefix + 'transition-duration'] = transitionTime + 's');
        cssData[cssPrefix + 'transform'] = 'translate3d(' + (TranslateX || 0) + 'px,' + (TranslateY || 0) + 'px,' + (TranslateZ || 0) + 'px)';
        $dom.css(cssData);
    },
    getTranslate: function (sel) {
        var $sel = $(sel);
        var transformString = $sel.css($.fx.cssPrefix + 'transform');
        if (transformString && transformString != undefined) {
            var translate3d = transformString.split('translate3d')[1];
            if (translate3d && translate3d != undefined) {
                var match = translate3d.match(/-?\d+/g);
                var translateX = parseInt(match[0]), translateY = parseInt(match[1]), translateZ = parseInt(match[2]);
                return {translateX: translateX, translateY: translateY, translateZ: translateZ}
            }

        }
        return {translateX: 0, translateY: 0, translateZ: 0}
    },
    addTranslate: function (sel, transitionTime, translateX, translateY, translateZ) {
        var translateStart = this.getTranslate(sel);
        var setTranslateX = translateStart.translateX + (translateX || 0),
            setTranslateY = translateStart.translateY + (translateY || 0),
            setTranslateZ = translateStart.translateZ + (translateZ || 0);
        this.setTransition($(sel), transitionTime, setTranslateX, setTranslateY, setTranslateZ);
    },
    startAutoPlay: function () {
        var me = this;
        me.opt.autoplay = true;
        me.interval = setInterval(function () {
            me.scrollTop();
        }, me.opt.intervalTime);
    },
    stopAutoPlay: function () {
        me.opt.autoplay = false;
        clearInterval(this.interval);
    },
    onReady: function (fun) {
        this.opt.onReady = fun;
    },
    setLinePosition: function () {
        var me = this,
            $billboardScrollList = $(me.opt.anchor).find('.billboard-scroll-list'),
            lineList = $billboardScrollList.find('>div'),
            translateY = me.getTranslate($billboardScrollList).translateY;

        $.each(lineList, function (index, item) {
            //console.log(item);
            me.setTransition(item, 0, 0, (Math.abs(translateY) + index * me.opt.lineHeight));
        })
    }

};
module.exports = Billboard;