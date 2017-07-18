/**
 * Created by WebStorm.
 * @date   : 15-5-7
 * @author : 陶启立(taoqili)
 * @link   : touch.qunar.com
 * @desc   :
 */
!(function ($) {
    //组件插件化
    $.pluginize = function (name, Module) {
        if ($.fn[name]) {
            return;
        }
        $.fn[name] = function (options) {
            options = options || {};
            var arg = [].splice.call(arguments, 1),
                ret;
            //插件主体
            this.each(function () {
                var $me = $(this),
                    module = $me.data(name);
                if (module) {
                    if (typeof options === "string") {
                        ret = module[options].apply(module, arg);
                    }
                    return;
                }
                if (typeof options === "object") {
                    //将实例化后的插件缓存在dom结构里
                    module = new Module(this, options);
                    $me.data(name, module);
                    return;
                }
            });
            return ret === undefined ? this : ret;
        }
    };
    //组件模块化
    $.modularize = function (module) {
        if (typeof define === 'function' && (define.amd || define.cmd)) {
            if (define.amd) {
                // AMD 规范，for：requirejs
                define(function () {
                    return module;
                });
            } else if (define.cmd) {
                // CMD 规范，for：seajs
                define(function (require, exports, module) {
                    module.exports = module;
                });
            }
        }
    };
    $.pluginModularize = function (name, Module) {
        $.pluginize(name, Module);
        $.modularize(Module);
    };
    $.modularize($);


    //设置改变元素内容过渡动画方法   设置的内容,过渡动画类型(字符串 如:'down';或对象)
    $.fn['changeHtml'] = function () {
        var animit = {
            slideDown: ['slideDownIn50', 'slideDownOut50'],
            slideUp: ['slideUpIn50', 'slideUpOut50'],
            slideLeft: ['slideLeftFadeIn', 'slideLeftFadeOut'],
            slideRight: ['slideRightFadeIn', 'slideRightFadeOut'],
            rotateIn: ['rotateFadeIn', 'fadeOut'],
            popup: ['popup', 'fadeOut'],

        };
        return function (html, data) {

            return this.each(function () {
                var me = this;
                if (me.onAnimation)return;
                var $me = $(me),
                    $oldHtmlWrap,
                    $newHtmlWrap,
                    oldHtml = $me.html(),
                    typeData = {
                        type: 'slideUp',
                        time: '.3'
                    },
                    time,
                    cssData;
                me.oldStyle = $me[0].style.cssText;
                me.onAnimation = false;
                var oldHeight = parseFloat($me.css('height')),
                    oldWidth = parseFloat($me.css('width')),
                    newHeight,
                    newWidth,
                    parentHeight,
                    parentWidth;
                $me.html(html);
                if (!$me.is(':visible')) {
                    return me;
                }
                if (data && typeof data == 'string') {
                    typeData.type = data;
                } else if (data && typeof data == 'object') {
                    $.extend(typeData, data);
                }
                var animitData = animit[typeData.type];
                var doParentAnimation = checkAnimatType(typeData.type);
                newHeight = parseFloat($me.css('height'));
                newWidth = parseFloat($me.css('width'));
                parentHeight = oldHeight > newHeight ? oldHeight : newHeight;
                parentWidth = oldWidth > newWidth ? oldWidth : newWidth;
                cssData = {
                    height: parentHeight + 'px',
                    width: parentWidth + 'px',
                    position: 'relative',
                    overflow: 'hidden'
                };
                doParentAnimation ? cssData.width = oldWidth : '';
                $me.css(cssData);
                $me.html(
                    '<div class="qt-change-oldhtml-wrap" style="position: absolute;height: 100%;width: 100%;">' +
                    oldHtml +
                    '</div>' +
                    '<div class="qt-change-newhtml-wrap" style="opacity: 0;position: absolute;height: 100%;width: 100%;">' +
                    html +
                    '</div>');
                $oldHtmlWrap = $me.find('.qt-change-oldhtml-wrap');
                $newHtmlWrap = $me.find('.qt-change-newhtml-wrap');

                if (!animitData) {
                    return me;
                }
                time = typeData.time;
                me.onAnimation = true;
                if (doParentAnimation) {
                    $newHtmlWrap.one('webkitAnimationStart', function () {
                        $me.css({
                            'transition': 'width ' + time + 's',
                            '-webkit-transition': 'width ' + time + 's',
                            'width': newWidth
                        })
                    })
                }

                oldHtml && $oldHtmlWrap.css({
                    'animation-timing-function': 'linear',
                    '-webkit-animation-timing-function': 'linear',
                    'animation-fill-mode': 'both',
                    '-webkit-animation-fill-mode': 'both',
                    'animation-duration': time + 's',
                    '-webkit-animation-duration': time + 's'
                }).addClass(animitData[1] || 'fadeOut');
                var $newHtmlWrapCss = {
                    'animation-timing-function': 'linear',
                    '-webkit-animation-timing-function': 'linear',
                    'animation-fill-mode': 'both',
                    '-webkit-animation-fill-mode': 'both',
                    'animation-delay': time + 's',
                    '-webkit-animation-delay': time + 's',
                    'animation-duration': time + 's',
                    '-webkit-animation-duration': time + 's'
                };
                !oldHtml && (delete $newHtmlWrapCss['animation-delay'], delete $newHtmlWrapCss['-webkit-animation-delay']);
                $newHtmlWrap.css($newHtmlWrapCss).addClass(animitData[0] || 'popup');

                $newHtmlWrap.one('webkitAnimationEnd', function () {
                    $me.html(html).attr('style', me.oldStyle);
                    me.onAnimation = false;
                })
            });


            function checkAnimatType(type) {
                var typeList = {'slideLeft': true, 'slideRight': true};
                return typeList[type];
            }

        }

    }();

    $.fn.lazyload = function (opts) {
        var lazyList = Array.prototype.slice.call(this);
        $(window).on('resize', function () {
            checkViewAndLoad(lazyList);
        }).on('scroll', _.throttle(function () {
            checkViewAndLoad(lazyList);
        }, 100));

        checkViewAndLoad(lazyList);
        function checkViewAndLoad(lazyList) {
            var top = 0;
            $.each(lazyList, function (index, item) {
                top = item.getBoundingClientRect().top;
                if (top >= 0 && top < window.innerHeight && !$(item).attr('src')) {
                    var $item = $(item);
                    $item.is(':visible') && $item.css({'opacity': '0'}).on('load', function (e) {
                        $(this).addClass('fadeIn animating');
                    }).attr('src', $(item).attr('lazy_src'));
                }
            })
        }

        return this;

    }
})(Zepto);
