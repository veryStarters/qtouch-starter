/**
 * Created by WebStorm.
 * @date   : 15-5-6
 * @author : 陶启立(taoqili)
 * @link   : touch.qunar.com
 * @desc   :
 */
(function ($) {

    /**
     * 构造函数
     * @param ele
     * @param options
     * @constructor
     */
    function Slider(ele, options) {
        var me = this;
        //保持对页面锚点的引用
        me.$ele = $(ele);
        me.options = $.extend({
            //defaultOptions
            fullscreen: false,                   //全屏模式，作用域为当前整个页面
            width: $(window).width(),            //默认宽度
            autoStart: true,                     //自动开始
            loop: true,                          //循环轮播图
            speed: 400,                          //滑动速度
            interval: 3000,                      //间隔时间
            itemType: 'li',                      //默认的滑块类型
            itemTpl:function(){
                return '<li><a title="<%= data.desc %>" href="<%= data.url %>"><img src="<%= data.src %>" /></a></li>';
            }(),
            data: {
                title: '什么什么活动',
                items: [
                    {
                        url: 'http://www.baidu.com',
                        src: 'xxxx.jpg',
                        desc: '描述一'
                    }
                ]
            },
            onSlideEnd: function (index, $item) { //滚动结束回调
                me.$ele.trigger('slideEnd', index, $item)
            }
        }, options || {});
        me.index = 0;
        me.init();
    }

    /**
     * 原型方法
     * @type {{constructor: Slider, init: Function, render: Function, initEvent: Function, show: Function}}
     */
    Slider.prototype = {
        constructor: Slider,
        //初始化
        init: function () {
            var me = this,
                opt = me.options;
            me.render();
            me.initEvent();

            opt.autoStart && me.start();

            //全屏模式下关闭页面默认的回弹效果
            if (opt.fullscreen) {
                $(document).on('touchmove', function (e) {
                    e.preventDefault();
                });
            }
        },
        //渲染相关
        render: function () {
            var me = this,
                opt = me.options,
                $slider = me.$ele.find('.qt-slider');

            //页面中光存在一个占位符时
            if (!$slider.length) {
                var tagName = opt.itemType.toLowerCase() === 'li' ? 'ul' : 'div';
                me.$ele.html('<div class="qt-slider"><' + tagName + ' class="qt-slider-items"></' + tagName + '></div>')
                $slider = me.$ele.find('.qt-slider');
            }

            //如果存在轮播数据，那么渲染之
            if (opt.data && opt.data.items && opt.data.items.length) {
                me.addItems(opt.data.items);
            }

            me.$slider = $slider;
            me.$itemCon = $slider.find('.qt-slider-items');
            me.$items = me.$itemCon.children();
            me.length = me.$items.length;
        },
        //初始化事件绑定
        initEvent: function () {
            var me = this,
                $con = me.$itemCon,
                isTouched = false,   //是否开始touch
                isSliding = false,   //是否处于左右移动状态
                deltaX = 0,          //当前移动偏移量
                startInfo;           //初始手指位置信息

            if ($con.data('init'))return;

            function touchStart(event) {
                var e = event.touches ? event.touches[0] : event;
                startInfo = {
                    pageX: e.pageX,
                    pageY: e.pageY,
                    time: Date.now()
                };
                deltaX = 0;
                isTouched = true;
                isSliding = false;
            }

            function touchMove(event) {
                if (!isTouched) return;
                var index = me.index;
                var e = event.touches ? event.touches[0] : event;
                deltaX = e.pageX - startInfo.pageX;
                if (!isSliding) {
                    //根据X、Y轴的偏移量判断用户的意图是左右滑动还是上下滑动
                    isSliding = Math.abs(deltaX) > Math.abs(e.pageY - startInfo.pageY)
                }
                if (isSliding) {
                    event.preventDefault();
                    //判定是否达到了边界即第一个右滑、最后一个左滑
                    if (!index && deltaX > 0 || index == me.length - 1 && deltaX < 0) {
                        return;
                    }
                    var pos = (deltaX - index * me.opt.width);
                    me.$con.css('-webkit-transform', 'translate3D(' + pos + 'px,0,0)');
                }
            }

            function touchEnd(event) {
                var index = me.index;
                //判定是否跳转到下一个卡片
                //滑动时间小于250ms或者滑动X轴的距离大于屏幕宽度的1/3，则直接跳转到下一个卡片
                var needSliding = (Date.now() - startInfo.time) < 250 && Math.abs(deltaX) > 20 || Math.abs(deltaX) > me.opt.width / 3;
                //判定是否达到了边界即第一个右滑、最后一个左滑
                var isPastBounds = !index && deltaX > 0 || index == me.length - 1 && deltaX < 0;
                if (isSliding) {
                    if (me.opt.onBeforeSlide(index, deltaX)) {
                        me.slideTo(index + ( needSliding && !isPastBounds ? (deltaX < 0 ? 1 : -1) : 0 ));
                    } else {
                        me.slideTo(index);
                    }
                }
                isTouched = false;
            }

            $con.on('touchstart', touchStart);
            $con.on('touchmove', touchMove);
            $con.on('touchend', touchEnd);
            $con.data('hasInit', 1);
        },
        slideTo: function (index) {
            var me = this;
            if (index === me.index)return;
            if (index < 0)index = 0;
            if (index >= me.length) index = me.length - 1;
            me.$itemCon.css({
                '-webkit-transition-duration': me.opt.speed + 'ms',
                '-webkit-transform': 'translate3D(' + -(index * me.opt.width) + 'px,0,0)'
            });
            me.index = index;
            me.options.onSlideEnd(index, me.$items.eq(index));
        },
        start: function () {
            var me = this;
            me.timer = setInterval(function () {
                if (me.index == me.length - 1) {
                    me.slideTo(0);
                } else {
                    me.next();
                }
                me.autoPlay();
            }, me.opt.interval);
        },
        stop: function () {
            this.timer && clearInterval(this.timer) && delete this.timer;
        },
        next: function () {
            var me = this;
            if (me.index < me.length - 1) {
                me.slideTo(me.index + 1);
            } else {
                me.slideTo(0);
            }
        },
        prev: function () {
            var me = this;
            if (me.index > 0) {
                me.slideTo(me.index - 1);
            } else {
                me.slideTo(me.length - 1)
            }
        },
        addItem: function (item) {

        },
        addItems: function (items) {
            var me = this,
                tagName = me.options.itemType.toLowerCase() || 'div';
            $.each(items, function (i, item) {
                me.$itemCon.append('<' + tagName + '>' + item + '</' + tagName + '>');
                me.length++;
            });


        },
        removeItem: function (item) {

        }

    };

    //插件化且模块化
    $.pluginModularize('slider', Slider);
})(Zepto);

