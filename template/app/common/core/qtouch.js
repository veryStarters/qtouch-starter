/**
 * Created by taoqili on 15/8/6.
 */
import $ from 'zepto';
import util from './util.js';
import adapter from '../adapter/adapter.js';
import qtCore from './qtouch-core.js';
import qtCache from './qtouch-cache.js';
import qtScroll from './qtouch-scroll.js';
import qtAnimate from './qtouch-animate.js';
import definePage from './qtouch-define-page.js';
import defineSubPage from './qtouch-define-sub-page.js';
export default (()=> {
    var requestData = qtCore.requestData,
        $wrapper = $('.qt-wrapper'),
        qunarApiStatus = {
            cache: [],
            loading : {
                gonglue: false,
                common: false
            }
        };
    return window.QTouch = window.qt = {
        //初始数据相关
        requestData: requestData,
        commonParam: window.COMMON_PARAM || {},
        firstData: window.FIRST_DATA || {},
        isClient: /q|Qunar/g.test(navigator.userAgent),
        $cur: $wrapper,

        //静态短路类
        util: util,
        $: function (selector, context) {
            var $cur = this.$cur || $('body');
            return $(selector, (context ? $cur.find($(context).selector) : $cur));
        },
        ajax: function () {
            var options = Array.prototype.slice.call(arguments);
            options.data = options.data || {};
            var csrfToken = util.cookie('csrfToken');
            csrfToken && $.extend(options.data, {csrfToken: csrfToken});
            return adapter.ajax.apply(this, options)
        },

        //系统api相关
        ready: adapter.ready,
        definePage: definePage,
        defineSubPage: defineSubPage,
        onScroll: qtScroll.onScroll,
        onScrollUp: qtScroll.onScrollUp,
        onScrollDown: qtScroll.onScrollDown,
        onScrollStop: qtScroll.onScrollStop,
        scrollTo: qtScroll.scrollTo,
        addScrollTopper: qtScroll.addScrollTopper,

        //统计相关
        monitor: adapter.monitor,

        /**
         * 父子页面之间传递的数据对象
         * @param key  若传入key，则获取该key对应的value，否则获取整个传递对象
         * @returns {*}
         */
        getTransferData: function (key) {
            var pageName = this.$cur.attr('id').replace(util.prefix, ''),
                openOption = qtCache.getOpenOption(pageName);
            if (!openOption || !openOption.data) {
                return;
            }
            return key ? openOption.data[key] : openOption.data;
        },
        //hy、page相关
        /**
         * 尝试通过客户端打开网页，如果客户端不存在，则使用浏览器打开
         * @param url  默认可以省略http://touch.qunar.com域，如果需要跳转到非touch.qunar.com域，请传入完整url链接
         * @param data  链接可以携带的参数对象
         */
        openWebView: function (url, data) {
            adapter.page.open(url, {
                type: 'webview',
                data: data || {}
            })
        },
        /**
         * 尝试打开客户端的activity
         * @param schemeUrl  可以省略客户端前缀，即如果要打开 qunariphone://usercenter/ ，仅传入usercenter/即可
         * @param data schemeUrl中需要携带的参数对象
         */
        openScheme: function (schemeUrl, data) {
            adapter.page.open(schemeUrl, {
                type: 'scheme',
                data: data || {}
            })
        },
        /**
         * 打开一个普通页面或者一个子页面。如果是打开子页面，则url为subPage的name
         * @param url
         * @param opt
         */
        openPage: function (url, opt) {
            if (!url)return;
            if (url.indexOf('http') === 0 || url.indexOf('//') === 0) {
                location.href = url;
                return;
            }
            var subPage = qtCache.getPage(url);
            if (!subPage) {
                util.log('子页面不存在！');
                return;
            }
            subPage.open(opt);
        },
        /**
         * 替换系统location.href赋值
         * @param url
         * @returns {{param: Function, hash: Function, replace: Function, exec: Function}}
         */
        href: function (url) {
            //可以认为直接调到第三方页面
            if (url && (url.indexOf('http') === 0 || url.indexOf('//') === 0)) {
                location.href = url;
                return;
            }
            var loc = location,
                hash = util.getHash(),
                hashInfo = util.getHashInfo(hash),
                query = loc.search.substr(1),
                param = util.query2param(query),
                controller,
                initParams = function (key, value, obj) {
                    var params = {};
                    if (typeof key === 'string') {
                        if (value !== undefined) {
                            params[key] = value;
                        } else {
                            return obj && obj[key];
                        }
                    } else if (typeof key === 'object') {
                        params = key;
                    }
                    return params;
                },
                initUrl = function () {
                    return (!controller ? loc.pathname : controller) + '?' + util.param2query(param) +
                        (!$.isEmptyObject(hashInfo.param) ? '#' + util.param2query(hashInfo.param) : '');
                };
            return {
                controller: function (control) {
                    controller = control;
                    return this;
                },
                param: function (key, value) {
                    if (typeof key === 'string' && value === undefined) {
                        return initParams(key, undefined, param);
                    }
                    $.extend(param, initParams(key, value));
                    return this;
                },
                hash: function (key, value) {
                    if (typeof key === 'string' && value === undefined) {
                        return initParams(key, undefined, hashInfo.param)
                    }
                    $.extend(hashInfo.param, initParams(key, value));
                    return this;
                },
                replace: function () {
                    history.pushState && history.replaceState({}, document.title, initUrl());
                    //更新requestData
                    $.extend(qt.requestData, param);
                },
                exec: function () {
                    loc.href = loc.origin + initUrl();
                }
            }
        },

        //动画相关
        flash: qtAnimate.flash,
        flashEnd: qtAnimate.flashEnd,
        shake: qtAnimate.shake,
        shakeEnd: qtAnimate.shakeEnd,
        rotate: qtAnimate.rotate,
        rotateEnd: qtAnimate.rotateEnd,


        //UI相关
        showMask: adapter.mask.show,
        hideMask: adapter.mask.hide,
        showLoader: qtCore.showLoader,
        hideLoader: qtCore.hideLoader,
        showPageLoader: qtCore.showPageLoader,
        hidePageLoader: qtCore.hidePageLoader,
        showTips: qtCore.showTips,
        hideTips: qtCore.hideTips,
        alert: adapter.popup.alert,
        confirm: adapter.popup.confirm,
        showPopup: adapter.popup.show,
        hidePopup: adapter.popup.hide,
        showSidebar: function (opt) {
            adapter.sidebar.show(opt);
        },
        hideSidebar: function (opt) {
            adapter.sidebar.hide(opt);
        },

        qunarApi: {
            ready: function (callback) {
                var isGonglue = navigator.userAgent.indexOf('qunartravel') !== -1;

                // QunarAPI不存在则加载,否则去执行
                if(typeof QunarAPI == 'undefined' || isGonglue && !QunarAPI.gonglue) {

                    // 缓存方法
                    qunarApiStatus.cache.push({callback: callback});

                    // 若正在加载,则返回
                    if(!isGonglue && qunarApiStatus.loading.common || isGonglue && qunarApiStatus.loading.gonglue) {
                        return false;
                    }

                    // 加载
                    var qunarApiUrl = isGonglue ? 'http://q.qunarzz.com/travel_client/prd/scripts/qunarapi.js' : '/common/lib/qunarApi.js';
                    var head = document.getElementsByTagName('head')[0];
                    var script = document.createElement('script');
                    script.setAttribute('src', qunarApiUrl);
                    head.appendChild(script);

                    isGonglue ? qunarApiStatus.loading.gonglue = true : qunarApiStatus.loading.common = true;

                    // 加载成功,执行缓存中方法
                    script.onload = function () {
                        QunarAPI.config({wxUrl: '/api/activity/weixin/signature'});
                        QunarAPI.ready(function () {
                            for(var i = 0; i < qunarApiStatus.cache.length; i++) {
                                if(qunarApiStatus.cache[i].callback.toString().indexOf('gonglue') != -1) {
                                    QunarAPI.gonglue ? (qunarApiStatus.cache[i].callback.call(QunarAPI), qunarApiStatus.cache.splice(i, 1), i--) : '';
                                }else {
                                    qunarApiStatus.cache[i].callback.call(QunarAPI);
                                    qunarApiStatus.cache.splice(i, 1);
                                    i--;
                                }
                            }
                        })
                    };

                }else {
                    callback.call(QunarAPI);
                }
            }
        }
    };

})();
