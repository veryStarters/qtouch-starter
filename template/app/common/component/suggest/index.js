/**
 * @date   : 15-7-20
 * @author : 王文清(wenqing.wang)
 * @link   : touch.qunar.com
 * @desc   : suggest组件
 */
(function($) {

    'use strict';

    var _ = require('underscore'),
        tpl = require('./index.tpl');

    function Suggest(ele, options) {
        var me = this;
        me.$ele = $(ele);
        me.options = $.extend({}, Suggest.defaults, options || {});
        me.__reqId = -1;
        me.__lastRid = 0;
        me.eventKey = '.suggest' + (+new Date());
        me.init();
    }

    Suggest.prototype = {
        constructor: Suggest,
        init: function() {
            var me = this,
                opts = me.options;

            // 缓存
            me.cache = {};

            // 设置自定义方法
            if ($.isFunction(opts.renderList)) {
                me.renderList = opts.renderList;
            }
            if ($.isFunction(opts.getData)) {
                me.getData = opts.getData;
            }
            if ($.isFunction(opts.select)) {
                me.select = opts.select;
            }

            me.render();
            me.initEvent();
        },
        render: function() {
            var me = this,
                opts = me.options;

            me.$suggest = $(opts.template).hide();
            me.$list = $('.list', me.$suggest);
            me.$form = opts.formId ? $(opts.formId) : me.$ele.parent();
            if (opts.toolbar) {
                $('.toolbar', me.$suggest).show();
                opts.btnClose && $('.close', me.$suggest).show();
                opts.btnClear && $('.clear', me.$suggest).show();
            }

            // 获得单条suggest模板
            me.itemTpl = me.$list.html().replace(/&lt;/g, '<').replace(/&gt;/g, '>');

            me.$list.html('');
            me.$form.append(me.$suggest);
        },
        initEvent: function() {
            var me = this,
                opts = me.options,
                disable = false, //fix 非自动提交点击时候会继续触发 input时间
                callback = _.debounce(function() {
                    if (disable) {
                        disable = false;
                        return;
                    }
                    // 获得Input输入
                    var query = $.trim(me.$ele.val());

                    me.cache[opts.url + query] ?
                        me.updateSuggest(me.cache[opts.url + query]) :
                        me.getData(query); //jshint ignore:line

                }, opts.lazy);

            me.$ele.on('input focus blur', callback);

            me.$suggest
                // 点击结果列表
                .on('tap', '.item', function() {
                    var $this = $(this),
                        data = $('span',$this).data();
                    me.$ele.val($this.text());
                    me.hide();
                    if (opts.save) {
                        me.setStorageData(data);
                    }
                    if ($.isFunction(me.select)) {
                        me.select($this, me);
                    }
                    disable = true;
                })
                //清除历史记录
                .on('tap', '.clear', function() {
                    me.clearStorageData();
                    me.hide();
                })
                //关闭
                .on('tap', '.close', function() {
                    disable = false;
                    me.hide();
                });
        },
        request: function(query) {
            var me = this,
                opts = me.options,
                param = $.extend({}, opts.param);

            param[opts.keyName || me.$ele.attr('name')] = query;

            $.ajax({
                type: 'GET',
                url: opts.url,
                data: param,
                dataType: opts.dataType,
                jsonp: opts.jsonp,

                success: (function(rid) {
                    return function(data) {
                        if (rid < me.__lastRid) {
                            return;
                        }
                        me.__lastRid = rid;
                        //修改数据格式
                        if ($.isFunction(opts.process)) {
                            data = opts.process(data);
                        }
                        me.updateSuggest(data);
                        me.cache[opts.url + query] = data;
                    };
                }(++me.__reqId))
            });
        },
        getData: function(query) {
            var me = this;
            if (query === '') {
                if(me.options.save){
                    me.updateSuggest(me.getStorageData(), true);
                }
                else{
                    me.hide();    
                }
                return;
            }
            me.request(query);
        },
        clearStorageData: function() {
            localStorage.removeItem(this.options.saveKey);
        },
        setStorageData: function(query) {
            var me = this,
            list = _.filter(me.getStorageData(), function(item) {
                return item[me.options.displayKey] !== query[me.options.displayKey];
            });
            list.unshift(query);
            localStorage.setItem(me.options.saveKey, JSON.stringify(list.slice(0, me.options.max)));
        },
        getStorageData: function() {
            return JSON.parse(localStorage.getItem(this.options.saveKey)) || [];
        },
        hide: function() {
            var me = this;
            me.$suggest.hide();
            me.options.tapDocHide && $(document).off('tap' + me.eventKey);
            $.isFunction(me.options.hide) && me.options.hide();
        },
        show: function() {
            var me = this;
            me.$suggest.show();
            me.options.tapDocHide && me.tapDocHide();
            $.isFunction(me.options.show) && me.options.show();
        },
        tapDocHide: function() {
            var me = this;
            _.delay(function(){
                $(document).on('tap' + me.eventKey, function(e){
                    var $target = $(e.currentTarget);
                    if($target.closest(me.$suggest).length === 0 && $target.closest(me.$ele)){
                        _.delay(function(){
                            me.hide();
                            $(document).off('tap' + me.eventKey);
                        }, me.options.lazy + 10);
                    }
                });
            },0);
        },
        updateSuggest: function(data, options) {
            var me = this,
                len = data && data.length;
            if (len < 1) {
                me.hide();
                return;
            }
            me.options.save && $('.clear', me.$suggest).toggle(options || false);
            me.renderList(data);
            me.show();
        },
        renderList: function(data) {
            var me = this,
                $wrap = $('<div></div>'),
                key = $.trim(me.$ele.val()),
                keyLen = key.length,
                $str, text, pos;
            _.each(data.slice(0, this.options.max), (item) => {
                $str = $(me.itemTpl);
                _.each(item, (val, key) => {
                    $('span',$str).attr('data-'+ key,val);
                });

                text = item[me.options.displayKey];
                if(me.options.highLight) {
                    pos = text.indexOf(key);
                    if(pos > -1){
                        text = text.substr(0, pos) 
                             + '<em class="qt-blue">' + text.substr(pos, keyLen) + '</em>' 
                             + text.substr(pos + keyLen);
                    }
                }
                $('span',$str).html(text);
                $wrap.append($str);
            });
            this.$list.html($wrap.html());
        },
        destroy: function() {
            this.$ele.off()
                .remove();
        }
    };

    Suggest.defaults = {
        // 请求数据
        url: '', // Suggest请求的url
        param: {}, // 请求的参数，与ajax data参数一致
        keyName: null, // 查询关键词字段名, 默认为input的name属性
        dataType: 'json', // 请求方法，与ajax dataType参数一致
        jsonp: 'callback', // jsonp callback字段名
        displayKey: 'val', // 显示数据的 key 名称

        // 自定义方法
        process: null, // 请求成功返回数据的预处理方法
        renderList: null, // 渲染结果列表的方法
        getData: null, // input有输入后触发的方法
        select: null, // tap列表后触发的方法

        // 功能配置
        lazy: 300, // 当输入框内容超过n毫秒未改变，才发送请求
        save: false, // 是否通过localStorage保存搜索记录
        saveKey: 'qt-search-history', // 通过localStorage保存历史记录的key

        //ui
        toolbar: false, //是否显示工具栏 
        btnClose: false, //是否显示关闭按钮
        btnClear: false, //是否显示清除历史按钮

        //单击其他地方关闭suggest
        tapDocHide: true,

        // 显示
        formId: null, // append到何处，若为空，则默认为input所在父级
        max: 6, // 显示结果列表最大记录

        highLight: false, //关键字高亮

        // 模板
        template: tpl
    };

    //zepto插件化
    $.pluginModularize('suggest', Suggest);

})(Zepto);
