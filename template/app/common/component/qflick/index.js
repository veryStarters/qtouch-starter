/**
 * Created by WebStorm.
 * @date   : 14-12-23
 * @author : 郑家骐(jiaqi.zheng)
 * @link   : touch.qunar.com
 * @desc   :
 */
(function ($) {

    function QFlick(ele,options) {
        this.opt = $.extend({
            anchor    : ele,     //页面锚点
            tpl       : '',      //组件模板，需要传入QFlick组件完整html机构，为高级用法不建议使用
            lineHeight: 40,      //文字行高
            transitionTime:0.3,  //动画时间--最好设置在0.6以下
            do3dEffect: false,   //是否做3D变换
            head      : '',      //QFlick头部显示的内容
            noHeader  : true,    //是否显示头部
            custom    : '',      //QFlick自定义部分显示的内容
            noCustom  : true,    //是否显示自定义部分
            title     : '',      //QFlick标题部分显示的内容
            noTitle   : false,   //是否显示标题部分
            events    : {},      //用户自定义事件{'click':function(){}}
            parts     : []       //设置QFlick纵向滚动选择部分
        }, options || {});
        this.init();
        this.initEvents();
    }

    function part($part, $flick, do3dEffect, transitionTime, $tpl) {
        this.$part = $part;
        this.$flick = $flick;
        this.do3dEffect = do3dEffect;
        this.$tpl = $tpl;
        this.transitionTime=transitionTime;
        this.init();
    }

    QFlick.prototype = {
        constructor  : QFlick,
        init         : function () {
            var me = this,
                opt = me.opt;
            var defaultTpl =
                '<div class="qt-flick-class"><!--添加自定义clss，来定制样式--> ' +
                '<div class="qt-flick"> ' +
                '<div class="sp-head">  ' +
                '<div>取消</div>     ' +
                '<div>确认</div>    ' +
                '</div>                 ' +
                '<div class="custom"><br/><br/><br/></div><!--添加自定义内容-->  ' +
                '<div class="part-title-collection"><!--part标题--> ' +
                '<div>推荐排序</div>                   ' +
                '<div>价格/星级</div>         ' +
                '</div>                          ' +
                '<div class="sp-center" >            ' +
                '<div class="part" data-part-id="part1"><!--id非必须-->  ' +
                '<div class="line-div"></div>  ' +
                '<div class="in-sp-center">  ' +
                '<div >推荐排序</div>    ' +
                '<div >价格升序</div>   ' +
                '<div class="active">价格降序</div>  ' +
                '<div >评价降序</div>      ' +
                '</div> ' +
                '</div>  ' +
                '</div>   ' +
                '</div>    ' +
                '</div>';
            me.$anchor = $(opt.anchor);
            me.$tpl = $(opt.tpl || defaultTpl);
            me.do3dEffect = opt.do3dEffect === '' ? false : opt.do3dEffect;
            me.$flick = me.$tpl.find('.qt-flick');
            me.$thisPart = me.$tpl.find('.part');
            me.checkedDom = '';
            me.checkedPart = '';
            me.parts = {};
            me.$tpl.on("touchmove", me.$flick, function (e) {
                e.stopPropagation();
                e.preventDefault();
            });

            var inparts = opt.parts;
            if (inparts) {
                var tplHtml = '';
                var spCenter = me.$tpl.find('.sp-center');
                spCenter.html('');
                for (var i = 0; i < inparts.length; i++) {
                    var inpart = inparts[i];
                    var partTpl = inpart.partTpl;
                    var id = inpart.id;
                    tplHtml = '<div class="part" data-part-id=' + id + '>' +
                        '<div class="line-div"></div>' +
                        '<div class="in-sp-center">' +
                        partTpl +
                        '</div>' +
                        '</div>';
                    spCenter.append(tplHtml);
                }
                me.$thisPart = me.$tpl.find('.part');
            }
            ;

//          perspective属性检测
            var getStyleProperty = (function () {
                var prefixes = ['', '-ms-', '-moz-', '-webkit-', '-khtml-', '-o-'];
                var reg_cap = /-([a-z])/g;

                function getStyle(css, el) {
                    el = el || document.documentElement;
                    var style = el.style, test;
                    for (var i = 0, l = prefixes.length; i < l; i++) {
                        test = (prefixes[i] + css).replace(reg_cap, function ($0, $1) {
                            return $1.toUpperCase();
                        });
                        if (test in style) {
                            return test;
                        }
                    }
                    return null;
                }

                return getStyle;
            })();
            if (!getStyleProperty('perspective')) {
                me.do3dEffect = false;
            }

            me.$tpl.find('.in-sp-center div').css({'height': opt.lineHeight + 'px', 'line-height': opt.lineHeight + 'px'});
            me.$tpl.find('.line-div').css({'height': opt.lineHeight + 'px'})

            me.$anchor.append(me.$tpl);
            opt.head && me.$flick.find('.sp-head').html(opt.head);
            opt.noHeader && me.$flick.find('.sp-head').css({'display': 'none'});
            opt.custom && me.$flick.find('.custom').html(opt.custom);
            opt.noCustom && me.$flick.find('.custom').css({'display': 'none'});
            opt.title && me.$flick.find('.part-title-collection').html(opt.title);
            opt.noTitle && me.$flick.find('.part-title-collection').css({'display': 'none'});
            var events = opt.events;
            $.each(events, function (index, event) {
                var kv = $.trim(index).split(/^(\w+)\s+/);
                if (kv.length != 3)return;
                me.$tpl.on(kv[1], kv[2], me.$thisPart, function (e) {
                    var evt = opt[event];
                    evt && evt.call(this, me.$thisPart, e);
                });
            });

            me.$flick.css({'display': 'block'});
            me.$thisPart.each(function (index) {
                $(this).attr('data-id', index);
                var newPart = new part($(this), me.$flick, me.do3dEffect ,opt.transitionTime, me.$tpl);
                me.parts[index] = newPart;
            });

        },
        checkedChange: function (fun) {                             //选定的行变换时触发回调函数fun，回调函数参数包括selectedDom(选定的dom元素), partId(所属part的data-part-id值)
            for (var part in this.parts) {
                this.parts[part].checkedChange(fun);
            }
        },
        initEvents   : function () {
            var me = this;
            me.$tpl.on('tap', '.sp-head>div', function () {
                me.hide();
            });

            $(window).on('resize', function () {
                var windowHeight = window.innerHeight;
                me.$flick.css({'top': windowHeight + 'px'});

            });

        },
        appendColumn : function (tpl) {                               //添加新的可滑动纵列，参数tpl--{partTpl: '',id: ''}
            var me = this, opt = me.opt;
            var $spCenter = me.$tpl.find('.sp-center');
            var partTpl = tpl.partTpl;
            var id = tpl.id;
            var tplHtml = '<div class="part" data-part-id=' + id + '>' +
                '<div class="line-div"></div>' +
                '<div class="in-sp-center">' +
                partTpl +
                '</div>' +
                '</div>';
            var $tpl=$(tplHtml);

            $tpl.find('.in-sp-center div').css({'height': opt.lineHeight + 'px', 'line-height': opt.lineHeight + 'px'});
            $tpl.find('.line-div').css({'height': opt.lineHeight + 'px'});
            $spCenter.append($tpl);

            var dataID = me.$tpl.find('.part').length - 1;
            $tpl.attr('data-id', dataID);
//            debugger
            var newPart = new part($tpl, me.$flick, me.do3dEffect, opt.transitionTime);
            me.parts[dataID] = newPart;

        },
        fixPosition  : function (part, doAnimation) {                  //恢复part中选中行的位置
            var $part = $(part);
            var dataID = $part.attr('data-id');
            var partObj = this.parts[dataID];
            partObj.fixPosition(doAnimation);
        },
        setSelect    : function (parameter, partId, doAnimation) {      //设置part中要选中的行,parameter--{'html': price}||{'class': price}||{'data-xxx': price}设置选择方式,partId--要设置选择的part的id,doAnimation--是否使用过渡动画
            var me = this;
            var $part = me.$tpl.find('.part[data-part-id=' + partId + ']');

            var judge = true;
            if ($part.length > 0) {
                var $innerSort = $part.find('.in-sp-center div');
                $innerSort.each(function (index) {
                    var $this = $(this);
                    judge = true;
                    $.each(parameter, function (index, item) {
                        if (index == 'html') {
                            judge = judge && ($this.html() == item);
                        } else {
                            judge = judge && ($this.attr(index) == item);
                        }
                    });
                    if (judge) {
                        $innerSort.removeClass("active");
                        $this.addClass('active');
                        return false;
                    }
                });
                me.fixPosition($part, doAnimation);
            }

        },

        show     : function () {                                   //显示qflick
            var me = this;
            me.$flick.css({'display': "block"});
        },
        hide     : function (fun) {                                //隐藏qflick
            var me = this;
            me.$flick.css({'display': "none"});
        },
        destroy  : function () {                              //销毁qflick
            var me = this;
            me.$tpl.off();
            $(window).off('resize');
            me.$tpl.find('.in-sp-center').off();
            me.$tpl.find('.part').off();
            this.$tpl.remove();
        },
        getCheckedData: function (partId, sel) {                    //获得被选中的数据，partId--要获取数据的part,sel--'html'||'dom'||'data-xxx'设置返回数据的方式
            var me = this;
            var $spCenter = me.$flick.find('.part[data-part-id="' + partId + '"]');
            if (sel == 'html') {
                return  $spCenter.find('.active').html();
            } else if (sel == 'dom') {
                return  $spCenter.find('.active');
            } else {
                return  $spCenter.find('.active').attr(sel);
            }
        }

    }
    part.prototype = {
        init         : function () {
            var me = this;
            var $part = me.$part;
            var $spCenter = me.$flick.find('.sp-center');
            var $lineDiv = $part.find('.line-div');
            var spCenterHeight = $spCenter.get(0).offsetHeight;
            var lineDivHeight = $lineDiv.get(0).offsetHeight;
            var lineDivTop = spCenterHeight / 2 - lineDivHeight / 2;
            $lineDiv.css({'top': lineDivTop});
            var $inspCenter = null;
            var startY = 0;
            var Y = 0;
            var startTop = 0;
            var inspCenterHeight, lineDivTop, lineDivHeight, MaxHeight, MinHeight,
                endTop, nowTop, difference, innerSortHeight, N, INspCenterChild, INspCenterChildNum,
                lineDiv, $innerSort;
            var touchSpeed, touchTime, startDate, endDate;
            me.transitioning = true;
            var NowN = -1;
            me.touchEnd = true;
            $part.on("touchstart", touchstart);
            $part.on("touchend", touchend);

            me.fixPosition(false);

            function touchstart(e) {
                me.touchEnd = false;
                var $thisPart = $(this);
                clearInterval(me.transitioning);
                $inspCenter = $thisPart.find('.in-sp-center');
                $innerSort = $thisPart.find('.in-sp-center div');
                $inspCenter.css({'-webkit-transition': ''});
                $innerSort.css({'-webkit-transform': ''});
                $innerSort.css({'-webkit-transition': ''});
                me.$thisPart = $thisPart;
                startDate = new Date();
                startTop = getTransformY($inspCenter.css('-webkit-transform'));
                startY = e.targetTouches[0].pageY;
                Y = startY;
                inspCenterHeight = $inspCenter.get(0).offsetHeight;
                lineDiv = $thisPart.find('.line-div').get(0);
                lineDivTop = lineDiv.offsetTop;
                lineDivHeight = lineDiv.offsetHeight;
                MaxHeight = lineDivTop + lineDivHeight + 20;
                MinHeight = lineDivTop - inspCenterHeight - 20;
                innerSortHeight = $innerSort.get(0).offsetHeight;
                INspCenterChild = $inspCenter.children();
                INspCenterChildNum = $inspCenter.children().length;
                $thisPart.on("touchmove", touchmove);

            }

            function touchmove(e) {
                Y = e.targetTouches[0].pageY;
                endTop = startTop + (Y - startY);
                if (endTop >= MinHeight && endTop <= MaxHeight) {
                    $inspCenter.css({'-webkit-transform': 'translate3d(0, ' + endTop + 'px, 0)'});
                    setCheck();
                } else if (endTop < MinHeight) {
                    $inspCenter.css({'-webkit-transform': 'translate3d(0, ' + MinHeight + 'px, 0)'});
                    setCheck();
                } else if (endTop > MaxHeight) {
                    $inspCenter.css({'-webkit-transform': 'translate3d(0, ' + MaxHeight + 'px, 0)'});
                    setCheck();
                }

            }

            function touchend(e) {
                $(this).off("touchmove");
                me.touchEnd = true;
                if (endTop >= MinHeight && endTop <= MaxHeight) {
                    var distance = (Y - startY);
                    endDate = new Date();
                    touchTime = (endDate.getTime() - startDate.getTime());
                    touchSpeed = distance / touchTime;
                    if (Math.abs(touchSpeed) > 0.3) {
                        var inchingTime = touchTime * 2;
                        var inchingLength = touchSpeed * inchingTime;
                        var startTop = getTransformY($inspCenter.css('-webkit-transform'));
                        var eachTop = startTop;
                        var n = 1;
                        var multiplier = 2 * inchingLength / inchingTime;
                        clearInterval(me.transitioning);
                        me.transitioning = setInterval(function () {
                            eachTop = eachTop + ( multiplier * (1 - n / inchingTime));
                            $inspCenter.css({'-webkit-transform': 'translate3d(0, ' + eachTop + 'px, 0)'});
                            setCheck(eachTop);
                            n++;
                            if (n > inchingTime || eachTop > MaxHeight || eachTop < MinHeight) {
                                clearInterval(me.transitioning);
                                me.fixPosition(true);
                            }
                        }, 1);
                        return;
                    }
                }
                me.fixPosition(true);
            }

            function setCheck(eachTop) {
                nowTop = eachTop || getTransformY($inspCenter.css('-webkit-transform'));
                difference = lineDivTop - nowTop;
                N = Math.ceil((difference + (innerSortHeight / 2)) / innerSortHeight);
                if (N <= 1) {
                    N = 1;
                } else if (N >= INspCenterChildNum) {
                    N = INspCenterChildNum;
                }
                if (NowN != N) {
                    NowN = N;
                    var $selectedDom = $(INspCenterChild[N - 1]);
                    $innerSort.removeClass("active");
                    $selectedDom.addClass("active");
                    me.checkedDom = INspCenterChild[N - 1];
                    me.checkedPart = $part[0];

                }
            }

            function getTransformY(webkittransform) {
                if (!webkittransform || webkittransform.match(/matrix/)) {
                    return 0;
                } else {
                    return parseInt(webkittransform.match(/\s([^,]*)px,/)[1]);
                }
            }

        },
        checkedChange: function (fun) {
            this.checkedChangeFun = fun;
        },
        fixPosition  : function (doAnimation) {
            if (this.touchEnd) {
                var me = this;
                clearInterval(me.transitioning);
                var $part = me.$part;
                var $thislineDiv = $part.find('.line-div');
                var thislineDivTop = $thislineDiv.get(0).offsetTop;
                var $INspCenter = $part.find('.in-sp-center');
                var INspCenterChildNum = $INspCenter.children().length;
                var thisinnerSortHeight;
                var $inSpCenterDiv = $part.find('.in-sp-center div');
                var func = me.checkedChangeFun;
                func && func(me.checkedDom, $(me.checkedPart).attr('data-part-id'));
                $inSpCenterDiv.each(function (index) {
                    var that = this;
                    thisinnerSortHeight = this.offsetTop;
                    if ($(that).hasClass('active')) {
                        var moveToTop = thislineDivTop - thisinnerSortHeight;
                        var moveLength = moveToTop;
//                        debugger
                        if (!doAnimation) {
//                            $INspCenter.css({'-webkit-transform': 'translate3d(0, ' + moveLength + 'px, 0)'})
                            $INspCenter.css({'-webkit-Transition': 'all 0.1s ease-out'});
                        } else if (index == 0 || index == INspCenterChildNum - 1) {
                            $INspCenter.css({'-webkit-Transition': 'all '+me.transitionTime+'s ease-out'});
//                            debugger
                        } else {
                            $INspCenter.css({'-webkit-Transition': 'all '+me.transitionTime+'s ease-out'});
                        }
                        if (me.do3dEffect) {
                            $(that).css({'-webkit-Transition': 'all '+me.transitionTime+'s ease-out', '-webkit-transform': 'translateZ(10px)'});
                            $(that).prev().css({'-webkit-Transition': 'all '+me.transitionTime+'s ease-out', '-webkit-transform': 'translateZ(7px) rotateX(5deg)'});
                            $(that).prev().prev().css({'-webkit-Transition': 'all '+me.transitionTime+'s ease-out', '-webkit-transform': 'translateZ(0px) rotateX(5deg)'});
                            $(that).next().css({'-webkit-Transition': 'all '+me.transitionTime+'s ease-out', '-webkit-transform': 'translateZ(7px) rotateX(-5deg)'});
                            $(that).next().next().css({'-webkit-Transition': 'all .'+me.transitionTime+'s ease-out', '-webkit-transform': 'translateZ(0px) rotateX(-5deg)'});
                            $part.css({'-webkit-perspective': '100px', 'perspective': '100px'});
                            $INspCenter.css({'transform-style': 'preserve-3d', '-webkit-transform-style': 'preserve-3d'});
                        }
                        $INspCenter.css({'-webkit-transform': 'translate3d(0, ' + moveLength + 'px, 0)'});
//                        $INspCenter.on('webkitTransitionEnd', function () {
//                            $INspCenter.css({'-webkit-Transition': ''});
//                            $INspCenter.off('webkitTransitionEnd');
//                        });
                        return false;
                    }
                });
            }
        }
    };

    //插件化且模块化
    $.pluginModularize('qflick', QFlick);
})(Zepto);


