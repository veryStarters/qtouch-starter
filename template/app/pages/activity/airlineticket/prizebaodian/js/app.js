/**
 * Created by jiaqi.zheng on 16/1/4.
 */
import _ from 'underscore';

module.exports = (()=> {
    var util = qt.util,
        ua = navigator.userAgent,
        jsApi = false;

    //普通青年,基本完全自理
    return qt.definePage({
        //系统初始化时执行

        config: {
            init: function () {
                document.addEventListener('QunarJSBridgeReady_v1', function () {
                    QunarJSBridge.call('hideMenuButton', {}, function (data) {
                    });//隐藏右上角的分享按钮
                }, false);

                $(window).on('pageshow', setNavStatus);
                setNavStatus();
                function setNavStatus() {
                    if (ua.toLowerCase().indexOf('qunar') !== -1) {
                        qt.qunarApi.ready(function () {
                            QunarAPI.hideOptionMenu({});//隐藏右上角的分享按钮
                        });
                    }
                }

            },
            ready: function () {
                checkJsApi();

                qt.qunarApi.ready(function () {
                    QunarAPI.onMenuShare({
                        title: '免单宝典', // 标题
                        link: window.location.href, // 链接URL
                        desc: '免单宝典', // 描述
                        imgUrl: 'http://source.qunar.com/site/images/wap/touch/images/v2/images1x/fenxiang.png', // 分享图标
                        success: function () {
                        },// 用户确认分享后执行的回调函数
                        cancel: function () {
                        } // 用户取消分享后执行的回调函数
                    });
                });
            }
        },
        events: {
            'click .miandan': 'backToTicketFree',
            'click .fenxiang': 'share'
        },
        templates: {},
        handles: {
            backToTicketFree: function () {
                qt.monitor('baodian_miandan_click');
                if (ua.toLowerCase().indexOf('qunar') !== -1) {
                    //window.location.href = '/activity/ticketfree'
                    qt.qunarApi.ready(function () {
                        QunarAPI.checkJsApi({
                            jsApiList: ['openWebView'], // 需要检测的JS接口列表
                            success: function (res) {
                                if (res.openWebView) {
                                    QunarAPI.hy.openWebView({
                                        url: window.location.origin + '/activity/airlineticket/ticketfree',

                                        // 以下参数当位于大客户端时可用：
                                        // 指定view的名称，可以在新页面返回时跳回指定名称的页面
                                        name: 'nameOfView',
                                        // view 通信数据，子view通过getInitData获取（iOS未上线）
                                        data: {},
                                        // navigation已经满足不了你了，这不重要
                                        type: 'navibar-normal',  // 隐藏掉navigation，自己定制吧;
                                        /*
                                         * type:{
                                         * navibar-normal
                                         * navibar-transparent, // 透明导航条
                                         * navibar-none, // 无导航条
                                         * }
                                         */
                                        // 调整导航栏的外观，详情见附录1
                                        navigation: {
                                            title: { // 指定标题
                                                style: 'text', // 标题样式: text: 普通文本 | location: 标题右侧带一个小箭头
                                                text: '春节回家，机票免单' // 标题文字
                                            }
                                        },
                                        //页面关闭后返回的数据
                                        onViewBack: function (res) {
                                            // res： 根据用户反馈的数据展示
                                        }
                                    });
                                } else {
                                    window.location.href = '/activity/airlineticket/ticketfree';
                                }
                            }
                        });

                    });
                } else {
                    var scheme = 'hy?url=' + encodeURIComponent(window.location.origin + '/activity/airlineticket/ticketfree');
                    skip(scheme, '', qt.commonParam.cookieBdSource)
                }
            },
            share: function () {
                qt.monitor('baodian_fenxiang_click');
                if (ua.toLowerCase().indexOf('qunar') !== -1) {
                    doShare();
                } else {
                    qt.alert('请使用浏览器自带分享功能进行分享');
                }

            }
        }
    });
    function skip(scheme, touchUrl, bdSource) {
        var qua = function () {
            var ua = navigator.userAgent;
            return {
                iphonePro: ua.indexOf("QunariPhonePro") !== -1,
                iphoneLife: ua.indexOf("QunariPhoneLife") !== -1,
                iphone: ua.indexOf("QunariPhone") !== -1,
                androidLife: ua.indexOf("qunaraphonelife") !== -1,
                android: ua.indexOf("qunaraphone") !== -1,
                ipad: /ipad/ig.test(ua)
            }
        }();
        bdSource = bdSource || '';
        scheme = scheme || 'home';
        touchUrl = touchUrl || ('download?bd_source=' + bdSource);
        var url = "";
        if (qua.iphonePro) {
            url = "qunariphonepro://" + scheme;
        } else if (qua.iphoneLife) {
            url = "qunariphonelife://" + scheme;
        } else if (qua.iphone) {
            url = "qunariphone://" + scheme;
        } else if (qua.androidLife) {
            url = "qunaraphonelife://" + scheme;
        } else if (qua.android) {
            url = "qunaraphone://" + scheme;
        } else {
            var hscheme = encodeURIComponent(scheme);
            var tUrl = encodeURIComponent(touchUrl);
            url = 'http://touch.qunar.com/h5/client?bd_source=' + bdSource + '&sScheme=0&scheme=' + hscheme + '&touchUrl=' + tUrl;
        }
        window.location.href = url;
    }

    function doShare() {
        if (jsApi) {
            QunarAPI.hy.showShareItems({
                success: function () {
                },
                fail: function () {
                }
            });
        } else {
            qt.alert('请您升级至最新版客户端，升级享受去哪儿更好服务 ~');
        }
    }

    function checkJsApi() {
        qt.qunarApi.ready(function () {
            // 调用QunarAPI提供的各种接口
            QunarAPI.checkJsApi({
                jsApiList: ['showShareItems'], // 需要检测的JS接口列表
                success: function (res) {
                    if (res.showShareItems) {
                        jsApi = true;
                    } else {
                        jsApi = false;
                    }
                }
            });
        })
    }
})();
