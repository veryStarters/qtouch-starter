(function($, undefined) {

    var tpl = require('./index.tpl'),
        _ = require('underscore');

    function Module(ele, options) {
        this.$ele = $(ele);
        this.options = $.extend({},Module.defaultOptions, options || {});
        this.init();
    }

    Module.prototype = {

        constructor: Module,

        eventName: function(event) {
            var me = this;
            return event.split(/\s/).map(function(val) {
                return val + '.' + me.options.namesapce;
            }).join(' ');
        },

        init: function() {
            var division = this.options.division;
            if (!($.isArray(division) && division.length >= 2)) {
                return false;
            }

            if (this.$ele.children().length === 0) {
                this.render();
            } else {
                this.create();
            }

            if (this.$ele.hasClass('qt-range')) {
                this.$ele = this.$ele;
            } else if (this.$ele.find('.qt-range').length > 0) {
                this.$ele = this.$ele.find('.qt-range');
            }

            if (this.options.isSingle) {
                this.$ele.find('.left').remove();
            }

            this.$drop = this.$ele.find('.drop');

            this.styleFixed();

            this.initEvent();

            if(this.options.defVal.length > 0){
                this.moveTo(this.options.defVal[0],this.options.defVal[1]);
            }
        },

        create: function($wrapper) {
            $wrapper = $wrapper || this.$ele;
            var division = this.options.division;
            var length = this.options.division.length;
            var domArray = [];

            for (var i = 0; i < length; i++) {
                domArray.push('<li><span>' + (typeof division[i] === 'number' ? ('&yen' + division[i]) : division[i]) + '</span></li>');
            }

            $wrapper.find('.mark').html(domArray.join(''));
        },

        styleFixed: function() {
            var me = this;
            var $ele = this.$ele;
            var $lastSpan = $ele.find('.mark span').last();
            $lastSpan.css('margin-left', -$lastSpan.width() / 2 + 'px');
            var dropWidth = 0;

            dropWidth = this.$drop.width();
            if (me.options.width) {
                $ele.width(me.options.width);
                $ele.find('.mark').width($ele.width() - dropWidth);
            }
        },

        //渲染
        render: function() {
            var $wrapper = $(_.template(tpl)());
            this.create($wrapper);
            this.$ele.append($wrapper);
        },

        destory: function() {
            this.$ele.off('.qtrange');
            this.$drop.off('.qtrange');
            this.$ele.remove();
        },
        //初始化事件绑定
        initEvent: function() {
            var me = this;
            var index = this.options.division.length - 1;
            var wrapperWidth = me.$ele.find('.mark').width();
            var divisionValue = me.divisionValue = wrapperWidth / index;

            var $left = this.$ele.find('.drop.left');
            var $right = this.$ele.find('.drop.right');

            // if (this.options.isSingle) {
            //     me.$ele.find('.left').remove();
            // }

            me.$ele.find('.left,.right').on(me.eventName('webkitTransitionEnd transitionend'), function() {
                me.$ele.find('.left,.right').css('transition', 'initial');
            });

            $left.length > 0 && ($left.get(0).movePos = 0);
            $right.length > 0 && ($right.get(0).movePos = 0);

            me.$ele.on(me.eventName('touchmove'), function(e) {
                e.preventDefault();
            });

            var selfWidth = $left.width();
            $left
                .on(me.eventName('touchstart'), function(e) {
                    this.x0 = e.touches[0].pageX;
                    this.pos = $(this).position().left;
                })
                .on(me.eventName('touchmove'), function(e) {
                    this.x1 = e.touches[0].pageX;
                    this.deltaX = this.x1 - this.x0;
                    var left = this.pos + this.deltaX;
                    if (!me.options.isSingle && (wrapperWidth - left - $right.get(0).movePos) <= divisionValue) {
                        return false;
                    }
                    if (left < wrapperWidth && left >= 0) {
                        $(this).css('left', left + 'px');
                        this.movePos = left;
                        me.$ele.find('.progress .left').width(left + 'px');
                    }


                });

            $right
                .on(me.eventName('touchstart'), function(e) {
                    this.x0 = e.touches[0].pageX;
                    this.pos = Number($(this).css('right').slice(0, -2));
                })
                .on(me.eventName('touchmove'), function(e) {
                    this.x1 = e.touches[0].pageX;
                    this.deltaX = this.x0 - this.x1;
                    var right = this.pos + this.deltaX;
                    if (!me.options.isSingle && (wrapperWidth - right - $left.get(0).movePos) <= divisionValue) {
                        return false;
                    }
                    if (right < wrapperWidth - selfWidth && right >= 0) {
                        $(this).css('right', right + 'px');
                        this.movePos = right;
                        me.$ele.find('.progress .right').width(right + 'px');
                    }
                });

            var touchEndHandler = function() {
                var pos = this.movePos;
                var posMod = pos % divisionValue;
                var result = pos - posMod;
                if (divisionValue / posMod < 2) {
                    result += divisionValue;
                }
                if (posMod > 5) {
                    me.$ele.find('.left,.right').css('transition', 'all ease .2s');
                }

                this.movePos = result;
                
                if ($(this).hasClass('left')) {
                    $(this).css('left', result + 'px');
                    me.$ele.find('.progress .left').width(result + 'px');
                } else {
                    $(this).css('right', result + 'px');
                    me.$ele.find('.progress .right').width(result + 'px');
                }
            };

            me.$ele.on(me.eventName('touchend'), '.drop', touchEndHandler);

            if(me.options.isSingle){
                me.$ele.find('.mark span').on('tap', function(){
                    $right.get(0).movePos = divisionValue * (index - $('.mark span').index($(this)));
                    touchEndHandler.call($right.get(0));
                });
            }
            else{
                me.$ele.find('.mark span:first').on('tap', function(){
                    $left.get(0).movePos = 0;
                    touchEndHandler.call($left.get(0));
                });

                me.$ele.find('.mark span:last').on('tap', function(){
                    $right.get(0).movePos = 0;
                    touchEndHandler.call($right.get(0));
                });
            }
        },

        moveTo: function(leftVal,rightVal){
            var me = this,
                opt = me.options,
                arr = ['left', 'right'];

            if(opt.isSingle){
                arr = ['right'];
                rightVal = leftVal;
            }

            arr.forEach(function(name){
                var index = opt.division.indexOf(name === 'left' ? leftVal : rightVal),
                    step  = me.divisionValue * (name === 'left' ? index : opt.division.length - 1 - index);
                //debugger;
                if(index > -1){
                    $('.drop.' + name,me.$ele)
                        .css(name, step + 'px')
                        .get(0).movePos = step;
                    $('.progress .' + name,me.$ele).width(step + 'px');
                }
            });
        },

        getResult: function() {
            var me = this;
            var indexList = [];
            var index = me.options.division.length - 1;

            if (me.options.isSingle) {
                return me.options.division[index - parseInt(this.$drop.get(0).movePos / me.divisionValue)];
            } else {
                this.$drop.each(function() {
                    if ($(this).hasClass('left')) {
                        indexList.push(me.options.division[parseInt(this.movePos / me.divisionValue)]);
                    } else {
                        indexList.push(me.options.division[index - parseInt(this.movePos / me.divisionValue)]);
                    }
                });
                return indexList;
            }

        }

    };

    Module.defaultOptions = {
        width: '100%',
        isSingle: false,
        namesapce: 'qtrange',
        division: [],
        defVal:[]
    };

    $.pluginModularize('range', Module);
})(Zepto);
