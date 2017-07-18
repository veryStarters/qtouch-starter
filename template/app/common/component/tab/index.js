/**
 * @date   : 15-5-11
 * @author : 王文清(wenqing.wang)
 * @link   : touch.qunar.com
 * @desc   : 选项卡组件
 */
(function($) {

    /**
     * 选项卡构造函数
     * @param {[type]} ele     [description]
     * @param {[type]} options [description]
     * 
     * ```html部分
     *  <div class="qt-tab">
     *      <ul class="nav">
     *          <li><span>标题A</span></li>
     *          <li><span>标题B</span></li>
     *          <li><span>标题C</span></li>
     *      </ul>
     *      <div class="line"></div>
     *      <div class="content">
     *          <div>内容A</div>
     *          <div>内容B</div>
     *          <div>内容C</div>
     *      </div>
     *  </div>
     * ```
     * 
     * ```js部分
     * $('#tab-demo').tab();
     * ```
     * 
     */
    function Tab(ele, options) {

        this.$ele = $(ele);

        this.options = $.extend({}, Tab.defaults, options || {});

        this.init();
    }


    Tab.prototype = {

        constructor: Tab,

        init: function() {
            this.render();
            this.initEvent();
            this.switchTo(this.options.activeIndex);
        },

        /**
         * 输出结构
         */
        render: function() {
            var me = this,
                opts = me.options,
                items = opts.items,
                $nav = $('<ul class="nav"></ul>'),
                $content = $('<div class="content"></div>');

            //有模板引擎可以替换此代码
            if (items.length > 0) {
                $.each(items, function(v, o) {
                    $('<li ' + (o.url ? ' data-url="' + o.url + '"' : '') + '><span>' + o.title + '</span></li>').appendTo($nav);
                    $('<div class="' + opts.effect + '">' + (o.url ? '' : o.content) + '</div>').appendTo($content);
                });
                me.$ele.append($nav, $('<div class="line"></div>'), $content);
            }
            else{
                $('.content', me.$ele).children().addClass(opts.effect);
            }

            me.$nav = $('.nav', me.$ele);
            me.$line = $('.line', me.$ele);
            me.$content = $('.content', me.$ele);
        },

        /**
         * 初始化事件
         */
        initEvent: function() {
            var me = this,
                eventHandler = $.proxy(function(e) {
                    me.switchTo($(e.target).closest('li').index());
                }, me);

            me.$nav.on('tap', 'li', eventHandler);
        },

        /**
         * 切换到index选项卡
         * @param  {Numbar} index 选项卡索引，从0开始
         * @return {Object}       提供链式调用
         */
        switchTo: function(index) {
            var me = this,
                opts = me.options,
                $navChildren = me.$nav.children(),
                $curChild = $navChildren.eq(index),
                $contentChildren = me.$content.children(),
                from, to, toWidth, toSpanWidth;


            //相同标签不需要在切换
            if (me.buzy || $curChild.hasClass('active')) {
                return;
            }
            
            from = $.extend({
                'length': 1
            }, $navChildren.eq(opts.activeIndex).removeClass('active'));
            from.div = $contentChildren.eq(opts.activeIndex);
            from.index = opts.activeIndex;
            //$navChildren.removeClass('anim');
            // to = $.extend({
            //     'length': 1
            // }, $curChild.addClass('active anim')).one($.fx.animationEnd,function(){
            //     $curChild.removeClass('anim');
            // });
            to = $.extend({
                'length': 1
            }, $curChild.addClass('active'));

            to.div = $contentChildren.eq(index);
            to.index = index;

            //线条
            if (me.$line.length > 0) {
                toWidth = to.width();
                if(opts.lineWidth.indexOf('px') > -1){
                    toSpanWidth = parseInt(opts.lineWidth);
                }
                else if(opts.lineWidth.indexOf('%') > -1){
                    toSpanWidth = parseInt(opts.lineWidth) / 100 * toWidth;
                }
                else{
                    toSpanWidth = to.children().width();   
                }
                me.$line.css({
                    'top': me.$nav.height() - 2,    
                    'width': toSpanWidth,
                    'display': 'block',
                    '-webkit-transform': 'translate3d(' + (toWidth * index + parseFloat((toWidth - toSpanWidth) / 2)) + 'px, 0, 0)'
                });
            }
            
            opts.activeIndex = index;

            //动画
            me.effect[opts.effect].call(me, to, from);

            //ajax异步请求
            me.ajax(to);

            me.$ele.trigger('switch', [to, from]);

            return me;
        },

        /**
         * 修正容器高度
         */
        fitToContent:function(div){
            var me = this;
            if(!div){
                div = me.$content.children().eq(me.options.activeIndex);
            }
            me.$content.css(
                'minHeight',
                div.height() +
                parseFloat(me.$content.css('border-top-width')) + //上边框
                parseFloat(me.$content.css('border-bottom-width')) //下边框
            );
        },

        ajax: function(to){
            var me = this,
                tpl = {
                    loading:'<div class="loading"></div>',
                    error:'<div class="error">内容加载失败!</div>'
                },
                url = to.attr('data-url'),
                loaded = {},
                prevXHR;
                
            to.div.find('.loading').remove();
            to.div.find('.error').remove();

            //如果没有URL说明不是异步请求
            //如果有加载过，或者tab内容不为空
            if(!url || loaded[to.index] || to.div.text()) return;

            //如果选项卡已经切换出去，则把没有加载玩的xhr abort了
            (prevXHR = me.xhr) && setTimeout(function(){
                prevXHR.abort();
            }, 400);

            //如果加载在50ms内完成了，就没必要再去显示 loading了
            me.timer = setTimeout(function () {
                to.div.html(tpl.loading);
            }, 50);

            me.xhr = $.ajax({
                url:url,
                beforeSend:function (xhr,settings) {
                    var e = $.Event('beforeLoad');
                    me.$ele.trigger(e,[xhr,settings,to]);
                    if(e.defaultPrevented) return false;
                },
                success:function(res){
                    var e = $.Event('beforeRender');
                    clearTimeout(me.timer);
                    me.$ele.trigger(e,[res,to]);
                    if(!e.defaultPrevented){
                        to.div.html(res);
                        loaded[to.index] = true;
                    }
                    delete me.xhr;
                    me.fitToContent(to.div);
                },
                error:function(){
                    var e = $.Event('loadError');
                    me.$ele.trigger(e,to);
                    if(!e.defaultPrevented){
                        to.div.html(tpl.error);
                    }
                    loaded[to.index] = false;
                    delete me.xhr;
                }
            });
        },

        /**
         * 销毁
         */
        destroy: function() {
            this.$ele.off()
                .remove();
        }
    };

    /**
     * effect
     */
    $.extend(Tab.prototype, {
        effect: {
            'none': function(to, from) {
                from.div.removeClass('active');
                to.div.addClass('active');
                this.fitToContent(to.div);
            },
            'fade': function(to, from) {
                var endEvent = $.fx.transitionEnd + '.tab';
                if(to.index !== from.index){
                    from.div.removeClass('fade-in').one(endEvent,function(e){
                        from.div.hide();
                    });
                }
                to.div.css('display','block').addClass('fade-in');
                this.fitToContent(to.div);
            },
            'slide':function(to, from){
                var me = this,
                    endEvent = $.fx.animationEnd + '.tab',
                    reverse = to.index > from.index ? '' : '-reverse';

                //fix 第一次默认的时候，有动画效果
                if(to.index == from.index){
                    to.div.addClass('active');
                    me.fitToContent(to.div);
                    return;
                }
                me.buzy = true;
                from.div.addClass('slide-out' + reverse);
                to.div.addClass('active slide-in' + reverse).one(endEvent,function(e){
                    //解除绑定
                    to.div.off(endEvent);
                    from.div.removeClass('slide-out' + reverse).removeClass('active');
                    to.div.removeClass('slide-in' + reverse);
                    me.fitToContent(to.div);
                    me.buzy = false;
                });
            }
        }
    });

    /**
     * 默认选项
     * @type {Object}
     */
    Tab.defaults = {
        /**
         * 初始时哪个为选中状态，索引从0开始
         * @type {Number}
         */
        activeIndex: 0,
        
        /**
         * 线条宽度，默认 auto 
         * 可以设置  1px  或者  1%
         */
        lineWidth: 'auto',

        /**
         * 设置切换动画，目前只支持'fade','slide'，默认'none'无动画
         * @type {String}
         */
        effect: 'none',

        /**
         * rander数据
         * @type {Array}
         * 
         *       [
         *           {
         *               'title':'标签',
         *               'url':'../qunar/index'   //异步请求
         *           },
         *           {
         *               'title':'标签',
         *               'content':'内容'         //静态内容
         *           }
         *       ]
         *
         */
        items: []
    };

    //模块化
    $.pluginModularize('tab', Tab);

    /**
     * @event switch
     * @param {Event} e
     * @param {Object} to(选项卡li)  to.div(内容div) to.index(索引)
     * @param {Object} from(选项卡li)  to.div(内容div) to.index(索引)
     * @description 切换完后触发
     */
    

    /**
     * @event beforeLoad
     * @param {Event} e 
     * @param {Object} xhr xhr对象
     * @param {Object} settings ajax请求的参数
     * @param {Object} to(选项卡li)  to.div(内容div) to.index(索引)
     * @description 在请求前触发，可以通过e.preventDefault()或者return false来取消此次ajax请求
     */
    

    /**
     * @event beforeRender
     * @param {Event} e
     * @param {Object} response 异步返回值
     * @param {Object} to(选项卡li)  to.div(内容div) to.index(索引)
     * @description 在请求数据完成触发，可以通过此方来自行写render，然后通过e.preventDefault()来阻止，将response输出在div上
     */
    
    
    /**
     * @event loadError
     * @param {Event} e 
     * @param {Object} to(选项卡li)  to.div(内容div) to.index(索引)
     * @description 当ajax请求内容失败时触发，如果此事件被preventDefault了，则不会把自带的错误信息Render到div上
     */

})(Zepto);
