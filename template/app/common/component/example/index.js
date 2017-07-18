/**
 * Created by WebStorm.
 * @date   : 15-5-6
 * @author : 陶启立(taoqili)
 * @link   : touch.qunar.com
 * @desc   :
 */
(function ($) {

    function Example(ele, options) {
        //保留对
        this.$ele = $(ele);
        this.options = $.extend({
            //defaultOptions
            title: '去哪儿网'
        }, options || {});
        this.init();
    }

    Example.prototype = {
        constructor: Example,
        //初始化，必须实现
        init: function () {
            this.render();
            this.initEvent();
        },
        //渲染，必须实现
        render: function () {

        },
        //事件绑定，必须实现
        initEvent: function () {

        },

        show: function () {
            console.log('hello,' + this.options.title);
            return '1';
        },
        showAtAnchor: function (ele, dir, offset) {

        },
        showAtXY: function (x, y) {

        },
        hide: function () {
            console.log("I'm dying!")
        }
    };

    //插件化且模块化
    $.pluginModularize('example', Example);
})(Zepto);

