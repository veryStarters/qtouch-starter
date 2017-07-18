/**
 * Created by taoqili on 15/8/7.
 */
import $ from 'zepto';
import util from './util.js';
import adapter from '../adapter/adapter.js';
import qtCache from './qtouch-cache.js';
export default (()=> {
    var renderNum = 0,
        needRenderNum = 0,
        timer,
        loadingTimer,
        $curLoader,
        mask = adapter.mask,
        requestData = $.extend({}, window.REQ || {}, util.query2param(decodeURIComponent(location.search).substr(1)));
    return {
        requestData: requestData,
        showPageLoader: function (message, black) {
            var me = this,
                $pageLoader = $('.qt-page-loader');
            message = message || '页面加载中…';

            $pageLoader.addClass(black ? 'qt-bg-black' : 'qt-bg-white');

            $pageLoader.find('p.loading-text').html(message);
            me.showLoader($pageLoader.find('.loading-icon'));
            if ($pageLoader.hasClass('active'))return;
            mask.show({
                opacity: .3,
                zIndex: 9997
            });
            $pageLoader.addClass('active').fadeIn(100);

            //加载异常之后的处理
            if (timer) clearTimeout(timer);
            timer = setTimeout(function () {
                if ($pageLoader.hasClass('active')) {
                    $pageLoader.find('.loading-text').html('<p>：(　加载失败了…</p><div class="qt-btns qt-border-rb10 ' + (!black ? "qt-bg-white" : "qt-bg-black") + '"><span class="btn smaller js-retry">重试</span><span class="btn smaller js-back">返回</span></div>');
                }
            }, 16000);

            //如果有内部按钮，则内部按钮的事件仅需绑定一次，
            if ($pageLoader.data('init') !== 'true') {
                $pageLoader.on('touchend', '.close-btn,.js-back', function (e) {
                    me.hidePageLoader();
                    util.prevent(e);
                    return false;
                });

                $pageLoader.on('touchmove', function (e) {
                    util.prevent(e);
                    return false;
                });

                $pageLoader.on('touchend', '.js-retry', function () {
                    location.reload();
                });
                $pageLoader.attr('data-init', 'true');
            }
        },
        /**
         * @method hidePageLoader 隐藏页面加载器
         */
        hidePageLoader: function (message) {
            if (loadingTimer) clearInterval(loadingTimer);
            message = message || '页面加载中…';
            if (timer) clearTimeout(timer);
            var $pageLoader = $('.qt-page-loader');
            if (!$pageLoader.hasClass('active'))return;
            mask.hide();
            $pageLoader.fadeOut(200, function () {
                $pageLoader.removeClass('active').removeClass('qt-bg-white').removeClass('qt-bg-black');
                $('p.loading-text', $pageLoader).html(message);
            });
        },
        //事件绑定初始化
        initEvents: function (pageDefine, $page, subPage) {
            var me = this,
                reqData = subPage ? subPage.requestData : requestData;

            util.delegateEvents($page, pageDefine, reqData, subPage);


            //下载条
            $page.on('tap', '.qt-client-download .close', function () {
                $(this).parents('.qt-client-download').fadeOut();
                qt.monitor('close_download_layer');
            });
            $page.on('tap', '.qt-client-download .download', function () {
                if (/MicroMessenger/i.test(navigator.userAgent)) {
                    location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.Qunar';
                } else {
                    location.href = 'http://touch.qunar.com/h5/download?bd_source=fixeddownload'
                }
                return false;
            });


            //为子页面绑定返回时的回调函数
            $page.on('tap', '.qt-header .previous,.qt-page-header .previous,.page-back', function () {
                var monitor = pageDefine.config && pageDefine.config.backMonitor;
                if (monitor && $.type(monitor) === 'function') {
                    monitor(reqData, subPage);
                    return;
                }
                if (subPage) {
                    subPage.back({_self_: true});
                } else {
                    history.go(-1);
                    pageDefine.config.onBack && pageDefine.config.onBack({_self_: true});

                }
            });

            //beforeReady切面
            $page.on('beforeReady', function (e) {
                //关闭加载浮层
                me.hidePageLoader();
            });

            //监听渲染完成事件
            $page.on('renderComplete', function () {
                //渲染完成时fix部分属性
                if ($page.find('.qt-sub-header,.qt-page-sub-header').hasClass('qt-hide')) {
                    $page.find('.qt-body,.qt-page-body').css('padding-top', 50);
                }

                var ready = pageDefine.config && pageDefine.config.ready ? pageDefine.config.ready : new Function;
                $page.trigger('beforeReady');
                ready.call(pageDefine, reqData, subPage);
                if (subPage) {
                    subPage.isReady = true;
                }
            });

        },

        //模板初始化
        initTemplates: function (pageDefine, $page, subPage) {
            var me = this,
                templates = pageDefine.templates || {},
                prefix = !subPage ? '.qt-' : '.qt-page-',
                className;
            //init时重置renderNum，用于监视当前已经render的模块数量
            renderNum = 0;
            needRenderNum = function () {
                var num = 0;
                for (var i in templates)if (templates.hasOwnProperty(i)) {
                    num++;
                }
                return num;
            }();
            if ($.isEmptyObject(templates)) {
                $page.trigger('renderComplete');
                return;
            }
            $.each(templates, function (index, template) {
                className = function (t) {
                    t = t !== 'subHeader' ? t : 'sub-header';
                    return prefix + t.toLowerCase();
                }(index);
                var $dom = $page.find(className);
                me.renderTpl($dom, template, subPage, pageDefine, $page);
            });
        },

        //模板渲染
        renderTpl: function ($dom, tplOpt, subPage, pageDefine, $page) {
            var me = this,
                type = $.type(tplOpt),
                reqData = !subPage ? requestData : subPage.requestData;
            if (type === 'function') {
                tplOpt = !subPage ? tplOpt.call(pageDefine, reqData) : tplOpt.call(pageDefine, reqData, subPage);
                type = $.type(tplOpt);
            }
            if (type === 'string') {
                //只有当tplOpt是string时才执行真正的渲染，所有渲染的唯一入口。
                $dom.html(tplOpt);

                //渲染模块数量等于应渲染数量时，页面渲染完成
                renderNum++;
                if (renderNum === needRenderNum) {
                    $page.trigger('renderComplete');
                }

                //修复各种为空元素造成的样式问题
                $dom = $dom.hasClass('qt-header') || $dom.hasClass('qt-page-header') ? $dom.parent() : $dom;
                if (!tplOpt) {
                    $dom.addClass('qt-hide');
                } else {
                    $dom.removeClass('qt-hide');
                }
                return;
            }
            me.asyncRender($dom, tplOpt, subPage, pageDefine, $page);
        },

        //处理异步渲染
        asyncRender: function ($dom, tplOpt, subPage, pageDefine, $wrapper) {
            var me = this;
            if ($.type(tplOpt) !== 'object' || !tplOpt.url || !tplOpt.success) {
                util.log('Ajax请求缺少必要的参数，请检查url或者success或者整个ajax参数对象是否存在');
                return;
            }
            tplOpt = $.extend({
                data: {}
            }, tplOpt);
            //监听自身的渲染事件，等待异步数据返回时触发
            $dom.on('render', function (type, html) {
                me.renderTpl($dom, html, subPage, pageDefine, $wrapper);
            });

            var urlList = $.type(tplOpt.url) === "string" ? [tplOpt.url] : tplOpt.url,
                dataList = $.type(tplOpt.data) === "object" ? [tplOpt.data] : tplOpt.data,
                success = $.type(tplOpt.success) === 'function' ? tplOpt.success : function () {
                };
            //如果when(ajax)中存在success，则其中的success在请求成功时会被执行
            //由于此处我们不需要单个回调的调用，但又为了在代码写法上跟单个ajax请求保持一致，所以暂时通过移除该回调的方式进行
            delete tplOpt.url;
            delete tplOpt.data;
            delete tplOpt.success;

            var ajaxList = function () {
                var ret = [];
                $.each(urlList, function (index, url) {
                    ret.push($.ajax($.extend({
                        url: url,
                        data: dataList[index]
                    }, tplOpt)));
                    util.log('正在发送请求至：' + url + '; query:' + JSON.stringify(dataList[index]));
                });
                return ret;
            }();
            $.when.apply(this, ajaxList).then(function () {
                var tmpResults = [].slice.call(arguments),
                    results = [];
                //单个返回结果
                if (ajaxList.length === 1) {
                    tmpResults = [tmpResults]
                }
                $.each(tmpResults, function (index, ret) {
                    results.push($.type(ret[0]) === 'string' ? JSON.parse(ret[0]) : ret[0]);
                });
                $dom.trigger('render', success.apply(this, results));
            })

        },
        showLoader: function (selector, message) {
            var $sel = $(selector);
            $sel.html('<div class="qt-luotuo"><span class="icon q-luotuo"></span></div>');
            if (message) {
                $sel.append('<p>' + message + '</p>')
            }
            $curLoader = $sel.find('.qt-luotuo');
            var classes = "q-luotuo-1 q-luotuo-2 q-luotuo-3 q-luotuo-4 q-luotuo".split(' '),
                index = 0;
            loadingTimer && clearInterval(loadingTimer);
            loadingTimer = setInterval(function () {
                var $luotuo = $sel.find('.icon');
                $luotuo.attr('class', '').addClass('icon ' + classes[index]);
                index++;
                if (index > classes.length - 1) {
                    index = 0;
                }
            }, 180);
        },
        hideLoader: function (selector) {
            loadingTimer && clearInterval(loadingTimer);
            if (selector) {
                $curLoader = $(selector).find('.qt-luotuo');
            }
            $curLoader.fadeOut(300, function () {
                $curLoader.remove();
            });
        },
        showTips : function (options) {
            let me = this,
                $tips = $('.qt-tips'),
                opt = $.extend({
                    mask: false,
                    maskOpacity: .3,
                    message: '数据加载中…',
                    zIndex: setTimeout(0) + 100,
                    position: 'top',   // top or bottom
                    wrapOpacity: 0.9
                }, options);

            if (!$tips.hasClass('qt-hide'))return;

            timer && clearTimeout(timer);
            timer = _.delay(() => {
                $tips.addClass(opt.position);

                $tips.html(opt.message)
                    .css({zIndex: opt.zIndex, opacity: opt.wrapOpacity})
                    .removeClass('qt-hide')
                    .fadeIn(100);

                if(opt.mask) {
                    mask.show({
                        opacity: opt.maskOpacity,
                        zIndex: opt.zIndex - 1
                    });
                }

            }, 100);
                
        },
        hideTips : function () {
            timer && clearTimeout(timer);
            var $tips = $('.qt-tips');
            if ($tips.hasClass('qt-hide'))return;

            mask.hide();
            $tips.fadeOut(200, function () {
                $tips.addClass('qt-hide')
                    .removeClass('top')
                    .removeClass('bottom');
            });
        }
    };
})();