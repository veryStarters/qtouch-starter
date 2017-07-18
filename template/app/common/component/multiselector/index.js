(function($, undefined) {

    "use strict";

    var tpl = require('./index.tpl'),
        _ = require('underscore');

    Module.defaultOptions = {
        width: '',
        fontSize: 13,
        multi: true,
        onChecked: function() {},
        onUnchecked: function() {},
        //[{text: '经济型', checked: true},{text: '1星', checked: true}]
        tplData: []
    };

    function Module(ele, options) {
        this.$ele = $(ele);
        this.options = $.extend({},Module.defaultOptions, options || {});
        this.init();
    }

    Module.prototype = {

        constructor: Module,

        init: function() {
            var me = this,
                opt = me.options;
            if (me.$ele.children().length == 0 && opt.tplData.length > 0) {
                me.render();
            }

            if (me.$ele.hasClass('qt-multiselector')) {
                me.$ele = me.$ele;
            } else if (me.$ele.find('.qt-multiselector').length > 0) {
                me.$ele = me.$ele.find('.qt-multiselector');
            }
            me.$child = me.$ele.find('.btn');
            me.len = me.$child.length - 1;
            me.create();
            me.initEvent();
            me.styleFixed();
        },
        create: function() {
            var me = this,
                opt = me.options,
                $checked = $('.btn[data-checked="true"]', me.$ele);

            if ($checked.length === me.len) {
                $checked.attr('data-checked', false);
                $checked = $(me.$child[me.len]).attr('data-checked', true);
            } else if ($checked.length === 0) {
                $checked = $(me.$child[me.len]).attr('data-checked', true);
            }
            $checked.addClass('choose');
        },
        //渲染
        render: function() {
            this.$ele.html(
                _.template(tpl, {
                    items: this.options.tplData,
                    fontSize: this.options.fontSize
                })
            );
        },
        styleFixed: function() {
            var me = this;
            if (me.options.width) {
                this.$ele.width(me.options.width);
            }
        },
        //初始化事件绑定
        initEvent: function() {
            var me = this;
            this.$ele.on('tap', '.btn', function() {
                me.toggle(this, true);
            });
        },
        toggle: function(ele, isCallback) {
            var me = this,
                opt = me.options,
                $ele = $(ele),
                data = $ele.data();
            
            if (opt.multi) {
                if ($ele.attr('data-checked') == 'true') {
                    // 已经是不限不能取消
                    if(data.val === 'all'){
                        return;
                    }
                    $ele.attr('data-checked', false)
                        .removeClass('choose');
                    if($('.btn[data-checked="true"]', me.$ele).length === 0){
                        $(me.$child[me.len])
                            .attr('data-checked', true)
                            .addClass('choose');
                    }
                } else {
                    if(data.val === 'all' || $('.btn[data-checked="true"]', me.$ele).length === me.len - 1){
                        $(me.$child[me.len]).attr('data-checked', true)
                            .addClass('choose')
                            .siblings()
                            .attr('data-checked', false)
                            .removeClass('choose')
                    }
                    else{
                        $(me.$child[me.len])
                            .attr('data-checked', false)
                            .removeClass('choose');
                        $ele.attr('data-checked', true)
                            .addClass('choose');
                    }
                }
                isCallback && opt.onUnchecked(ele, data.val);
            } else {
                if ($ele.attr('data-checked') == 'true') {
                    if(data.val === 'all') {
                        return;
                    }
                    $ele.attr('data-checked', false)
                        .removeClass('choose');
                    $(me.$child[me.len])
                        .attr('data-checked', true)
                        .addClass('choose');
                } else {
                    $ele.attr('data-checked', true)
                        .addClass('choose')
                        .siblings()
                        .attr('data-checked', false)
                        .removeClass('choose');
                }
                isCallback && opt.onChecked(ele, data.val);
            }
        },

        chooseAll: function() {
            if (this.options.multi) {
                $(this.$child[this.len]).attr('data-checked', true).addClass('choose')
                    .siblings().attr('data-checked', false).removeClass('choose')
            }
        },

        status: function() {
            var ret = [];
            this.$child.each(function(index) {
                if ($(this).attr('data-val') !== 'all' && $(this).attr('data-checked') === 'true') {
                    ret.push({
                        val: $(this).attr('data-val'),
                        text: $(this).text()
                    });
                }
            });
            return ret;
        }


    };

    $.pluginModularize('multiselector', Module);
})(Zepto);
