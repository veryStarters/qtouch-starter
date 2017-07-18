/**
 * Created by jiaqi.zheng on 16/1/4.
 */
import _ from 'underscore';
import Billboard from './billboard.js';
import Turntable from './turntable.js';
import lotteryAlert from '../tpl/lottery-alert.tpl';
import alAlert from '../tpl/al-alert.tpl';
module.exports = (() => {
    var util = qt.util;
    var turntable,
        jsApi = false,
        lotterying = false,
        ua = navigator.userAgent,
        spotInterval = '';
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
        }(),
        randdir = function() {
            return ('00000' + Math.ceil(Math.random() * 100000)).slice(-5);
        };

    //普通青年,基本完全自理
    return qt.definePage({
        //系统初始化时执行

        config: {
            init: function() {
                document.addEventListener('QunarJSBridgeReady_v1', function() {
                    QunarJSBridge.call('hideMenuButton', {}, function(data) {}); //隐藏右上角的分享按钮
                }, false);

                $(window).on('pageshow', setNavStatus);
                setNavStatus();

                function setNavStatus() {
                    qt.qunarApi.ready(function () {
                        if(qua.android || qua.androidLife || qua.iphone || qua.iphoneLife || qua.iphonePro) {
                            QunarAPI.hideOptionMenu({});//隐藏右上角的分享按钮
                            QunarAPI.hy.navRefresh(
                                // 与openWebview中的navigation字段相同，详情见附录1。
                                {
                                    title: {
                                        style: 'text',
                                        text: '春节回家·机票免单'
                                    }
                                }
                            );
                        }

                        QunarAPI.onMenuShare({
                            title: '去哪儿网新年钜惠，邀好友抢"机票免单”大奖', // 标题
                            link: window.location.origin + '/activity/springgift/' + randdir() + '?couponId=' + (qt.$('.lottery-num').attr('data-couponid') || '') + '&bd_source=' + qt.commonParam.cookieBdSource, // 链接URL
                            desc: '春节回家我要免费坐飞机，跪求你帮我赢得免单机会！你也可以拿300元会员红包！', // 描述
                            imgUrl: 'http://img1.qunarzz.com/m_appPromotion/wap/1601/38/9c6f3c9d6e807ef7.png', // 分享图标
                            success: function () {
                                qt.monitor('ticketfree_share_total')
                            },// 用户确认分享后执行的回调函数
                            cancel: function () {
                            } // 用户取消分享后执行的回调函数
                        });
                    });
                }
            },
            ready: function() {
                var billboard = new Billboard('.billboard', {
                    items: getAwardsList(),
                    lineHeight: 25,
                    onReady: function() {
                        qt.$('.billboard').append('<div class="rewards-mask"></div><div class="border-mask"></div>');
                    }
                });
                billboard.startAutoPlay();

                turntable = new Turntable('.roate-arrow', {})
                checkJsApi();
                checkChance();

                startSpotInterval();

                if (navigator.userAgent.toLowerCase().indexOf('android') != -1) {
                    qt.$('.ios-rule').addClass('qt-hide');
                }

            }
        },
        events: {
            'tap .start-button': 'startLottery',
            'touchstart .start-button': 'touchstart',
            'touchend .start-button': 'touchend',
            'tap .weixin': 'shareWeixin',
            'tap .address-book': 'shareAddressBook',
            'tap .my-prize,.my-prize-start': 'myPrize',
            'tap .prize-baodian': 'prizeBaodian',
            'tap .prize-desc': 'prizeDesc',
            'tap .mian-close': 'mianClose',
        },
        templates: {},
        handles: {
            startLottery: function(e) {
                if (!checkLogIn() || lotterying) {
                    return;
                }
                doStartLottery();
            },
            touchstart: function(e) {
                $(e.currentTarget).attr('src', 'http://source.qunar.com/site/images/wap/touch/images/v2/images1x/start-lot-act.png');
            },
            touchend: function(e) {
                $(e.currentTarget).attr('src', 'http://source.qunar.com/site/images/wap/touch/images/v2/images1x/start-lot.png');
            },
            shareAddressBook: function() {
                qt.monitor('ticketfree_shareAddressBook_click')
                if (!checkLogIn()) {
                    return;
                }
                doShareAddBook();
            },
            shareWeixin: function() {
                qt.monitor('ticketfree_shareWeixin_click');
                if (!checkLogIn()) {
                    return;
                }
                doShare();

            },
            myPrize: function() {
                qt.monitor('ticketfree_myPrize_click');
                if (!checkLogIn()) {
                    return;
                }
                toMyPrize();
            },
            prizeBaodian: function() {
                qt.monitor('ticketfree_prizeBaodian_click');
                if (!checkLogIn()) {
                    return;
                }

                if (ua.toLowerCase().indexOf('qunar') !== -1) {
                    qt.qunarApi.ready(function () {
                        QunarAPI.checkJsApi({
                            jsApiList: ['openWebView'], // 需要检测的JS接口列表
                            success: function(res) {
                                if (res.openWebView) {
                                    QunarAPI.hy.openWebView({
                                        url: window.location.origin + '/activity/airlineticket/prizebaodian',

                                        // 以下参数当位于大客户端时可用：
                                        // 指定view的名称，可以在新页面返回时跳回指定名称的页面
                                        name: 'nameOfView',
                                        // view 通信数据，子view通过getInitData获取（iOS未上线）
                                        data: {},
                                        // navigation已经满足不了你了，这不重要
                                        type: 'navibar-normal', // 隐藏掉navigation，自己定制吧;
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
                                                text: '免单宝典' // 标题文字
                                            }
                                        },
                                        //页面关闭后返回的数据
                                        onViewBack: function(res) {
                                            // res： 根据用户反馈的数据展示
                                        }
                                    });
                                } else {
                                    window.location.href = '/activity/airlineticket/prizebaodian';
                                }
                            }
                        });

                    });
                } else {
                    window.location.href = '/activity/airlineticket/prizebaodian';
                }
            },
            prizeDesc: function() {
                qt.monitor('ticketfree_prizeDesc_click')
                if (!checkLogIn()) {
                    return;
                }
                //var opendata = {
                //    data: {
                //        flight_exchange_time: qt.firstData.flight_exchange_time,
                //        other_exchange_time: qt.firstData.other_exchange_time
                //    },
                //    onBack: function (data) {
                //    }
                //};
                //prizeDesc.open(opendata);
                var touchUrl = window.location.origin + '/activity/airlineticket/prizedesc' + '?flight_exchange_time=' + encodeURIComponent(qt.firstData.flight_exchange_time || '') + '&other_exchange_time=' + encodeURIComponent(qt.firstData.other_exchange_time || '');
                if (ua.toLowerCase().indexOf('qunar') !== -1) {
                    qt.qunarApi.ready(function () {
                        QunarAPI.checkJsApi({
                            jsApiList: ['openWebView'], // 需要检测的JS接口列表
                            success: function(res) {
                                if (res.openWebView) {
                                    QunarAPI.hy.openWebView({
                                        url: touchUrl,

                                        // 以下参数当位于大客户端时可用：
                                        // 指定view的名称，可以在新页面返回时跳回指定名称的页面
                                        name: 'nameOfView',
                                        // view 通信数据，子view通过getInitData获取（iOS未上线）
                                        data: {},
                                        // navigation已经满足不了你了，这不重要
                                        type: 'navibar-normal', // 隐藏掉navigation，自己定制吧;
                                        navigation: {
                                            title: { // 指定标题
                                                style: 'text', // 标题样式: text: 普通文本 | location: 标题右侧带一个小箭头
                                                text: '我的奖品' // 标题文字
                                            }
                                        },
                                        //页面关闭后返回的数据
                                        onViewBack: function(res) {
                                            // res： 根据用户反馈的数据展示
                                        }
                                    });
                                } else {
                                    window.location.href = touchUrl;
                                }
                            }
                        });

                    });
                } else {
                    window.location.href = touchUrl;
                }
            },
            mianClose: function() {
                QunarAPI.hy.closeWebView({
                    name: '' // 非必填。不填回退到上级。如果位于大客户端内，可指定view名称，直接回退到该名称的view上
                        // 非必须。view 通信，传递数据到指定view
                        ,
                    data: {}
                });
            }

        }
    });

    function checkLogIn(noSkip) {
        var commonParam = qt.commonParam;
        if (commonParam.isLogin) {
            return true;
        } else {
            if (noSkip) {
                return false;
            }
            if (ua.toLowerCase().indexOf('qunar') !== -1) {
                qt.qunarApi.ready(function () {
                    // 调用QunarAPI提供的各种接口
                    QunarAPI.checkJsApi({
                        jsApiList: ['login'], // 需要检测的JS接口列表
                        success: function(res) {
                            if (res.login) {
                                QunarAPI.hy.login({
                                    shouldOpenLogin: true, // 指示是否允许弹登录界面，不允许时未登录直接返回登录失败,true=允许, false=不允许
                                    success: function(res) {
                                        window.location.reload();
                                    },
                                    fail: function(res) {
                                        console.log('%s %s', res.code, res.errmsg);
                                    }
                                });
                            } else {
                                qt.alert('请您升级至最新版客户端，升级享受去哪儿更好服务 ~');
                            }
                        }
                    });
                })
            } else {
                window.location.href = qt.commonParam.host.userCenter + '/mobile/login.jsp?ret=' + encodeURIComponent(window.location.href)
            }
            return false;
        }

    }

    function checkChance() {
        if (!checkLogIn(true)) {
            return;
        }
        $.ajax({
            url: '/api/activity/airlineticket/ticketfree/chance',
            type: 'get',
            dataType: "json",
            data: {
                uparam: qt.requestData.uparam || ''
            },
            error: function(xhr) {
                console.log('数据加载失败！请稍后刷新再次尝试！')
            },
            success: function(response) {
                if (!response.ret) {
                    confirmLogIn();
                    return;
                }
                //活动已经结束
                if (response.data.code == 404) {
                    $('.end-button,.my-prize').removeClass('qt-hide');
                    $('.fixed-wrap,.img-wrap .start-button,.img-wrap .roate-arrow-wrap,.my-prize-start').addClass('qt-hide');
                    return false;
                }

                if (response.data.code !== 0) {
                    qt.alert(response.data.msg);
                    qt.$('.lottery-num').attr('data-code', response.data.code).attr('data-msg', response.data.msg);
                    return '';
                }
                var $lotteryNum = qt.$('.lottery-num');
                $lotteryNum.html(response.data.chance).attr('data-couponId', response.data.couponId);

            }
        });

    }

    function skip(scheme, touchUrl, bdSource) {
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
                success: function() {},
                fail: function() {}
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

    function doStartLottery() {
        var $lotteryNum = qt.$('.lottery-num');
        if ($lotteryNum.attr('data-code')) {
            qt.alert($lotteryNum.attr('data-msg'));
            return;
        }

        if ($lotteryNum.html() == '0') {
            qt.showPopup({
                message: qt.util.template(lotteryAlert, {
                    data: {
                        jsApi: jsApi
                    }
                }),
                noHeader: true,
                noFooter: true,
                events: {
                    'tap .invite-weixin': 'inviteWeixin',
                    'tap .invite-address-book': 'inviteAddBook',
                    'tap .lo-close': 'close'
                },
                onTapMask: function() {
                    qt.hidePopup();
                },
                close: function() {
                    qt.hidePopup();
                },
                inviteWeixin: function(e) {
                    qt.hidePopup();
                    if (!checkLogIn()) {
                        return;
                    }
                    doShare();
                },
                inviteAddBook: function() {
                    qt.hidePopup();
                    if (!checkLogIn()) {
                        return;
                    }
                    doShareAddBook();
                }

            })
        } else {
            getPrize();

        }
    }

    function doShowResult(data) {
        var status = data.status,
            msg = data.msg || '',
            alData = {};
        if (status == 0) {
            alData.prize = true;
            alData.msg = msg;
            alData.alButtonA = '稍后再说';
            alData.alButtonB = '立即兑换';
        } else if (status == 1) {
            alData.alButtonA = '取消';
            alData.alButtonB = '再抽一次';
        }
        qt.showPopup({
            message: qt.util.template(alAlert, {
                data: alData
            }),
            noHeader: true,
            noFooter: true,
            events: {
                'tap .al-buttonA': 'alButtonA',
                'tap .al-buttonB': 'alButtonB'
            },
            onHide: function() {

            },
            onTapMask: function() {
                qt.hidePopup();
                turntable.reset();
            },
            alButtonA: function(e) {
                qt.hidePopup();
                turntable.reset();
            },
            alButtonB: function(e) {
                qt.hidePopup();
                turntable.reset();
                if (status == 1) {
                    doStartLottery();
                } else if (status == 0) {
                    toMyPrize();
                }
            }
        })
    }

    function toMyPrize() {
        //var opendata = {
        //    data: {},
        //    onBack: function (data) {
        //    }
        //};
        //myPrize.open(opendata);
        var touchUrl = window.location.origin + '/activity/airlineticket/myprize' + '?uparam=' + encodeURIComponent(qt.requestData.uparam);
        if (ua.toLowerCase().indexOf('qunar') !== -1) {
            qt.qunarApi.ready(function () {
                QunarAPI.checkJsApi({
                    jsApiList: ['openWebView'], // 需要检测的JS接口列表
                    success: function(res) {
                        if (res.openWebView) {
                            QunarAPI.hy.openWebView({
                                url: touchUrl,

                                // 以下参数当位于大客户端时可用：
                                // 指定view的名称，可以在新页面返回时跳回指定名称的页面
                                name: 'nameOfView',
                                // view 通信数据，子view通过getInitData获取（iOS未上线）
                                data: {},
                                // navigation已经满足不了你了，这不重要
                                type: 'navibar-normal', // 隐藏掉navigation，自己定制吧;
                                navigation: {
                                    title: { // 指定标题
                                        style: 'text', // 标题样式: text: 普通文本 | location: 标题右侧带一个小箭头
                                        text: '我的奖品' // 标题文字
                                    }
                                },
                                //页面关闭后返回的数据
                                onViewBack: function(res) {
                                    // res： 根据用户反馈的数据展示
                                }
                            });
                        } else {
                            window.location.href = touchUrl;
                        }
                    }
                });

            });
        } else {
            window.location.href = touchUrl;
        }
    }

    function doShareAddBook() {
        skip('uc/inviteFriends?from=4', '', qt.commonParam.cookieBdSource);
    }

    function getPrize() {
        turntable && (turntable.start(), lotterying = true);
        startSpotInterval(100);
        $.ajax({
            url: '/api/activity/airlineticket/ticketfree/start',
            type: 'get',
            dataType: "json",
            data: {
                uparam: qt.requestData.uparam || ''
            },
            error: function(xhr) {
                err();
                qt.alert('网络异常，请稍后再试');
            },
            success: function(response) {
                if (!response.ret) {
                    err();
                    confirmLogIn();
                    return;
                }
                if (response.data.code !== 0) {
                    err();
                    qt.alert(response.data.prizeDesc);
                    return;
                }
                var $lotteryNum = qt.$('.lottery-num');
                $lotteryNum.html(response.data.chance);
                if (!turntable) {
                    return;
                }
                if (response.data.prizeCode == 888) { //机票，火车票，免单
                    prizeTo(0, response.data.prizeDesc);
                } else if (response.data.prizeCode == 801) { //度假代金券
                    prizeTo(120, response.data.prizeDesc);
                } else if (response.data.prizeCode == 802) { //格拉瓦代金券
                    prizeTo(60, response.data.prizeDesc);
                } else if (response.data.prizeCode == 803) { //唯品会代金券
                    prizeTo(240, response.data.prizeDesc);
                } else if (response.data.prizeCode == 804) { //qq阅读半月会员
                    prizeTo(300, response.data.prizeDesc);
                } else {
                    turntable && turntable.onEnded(function() {
                        lotterying = false;
                        startSpotInterval(300);
                        response.data.chance > 0 ? doShowResult({
                            status: 1
                        }) : doShowResult({
                            status: 2
                        });
                    });
                    turntable && turntable.endToDeg(180);
                }
            }
        });

        function prizeTo(deg, msg) {
            turntable && turntable.onEnded(function() {
                lotterying = false;
                startSpotInterval(300);
                doShowResult({
                    status: 0,
                    msg: msg
                });
            });
            turntable && turntable.endToDeg(deg);
        }

        function err() {
            lotterying = false;
            turntable && turntable.onEnded(function() {});
            turntable && turntable.endToDeg(0);
            startSpotInterval(300);
        }

    }

    function startSpotInterval(time) {
        time = time || 300;
        clearInterval(spotInterval);
        spotInterval = setInterval(function() {
            $('.highlights').toggleClass('qt-hide');
        }, time)
    }

    function getAwardsList() {
        var list = [];
        for (var i = 0; i < 100; i++) {
            list.push('<div>恭喜' + getPhoneNum() + '</div><div>获得' + getPeizeRandon() + '</div>');
        }
        return list;
    }

    function getAwards() {
        return '<div>恭喜' + getPhoneNum() + '</div><div>获得' + getPeizeRandon() + '</div>'
    }

    function getPhoneNum() {
        var tensList = [3, 5, 8],
            tens = tensList[Math.round(Math.random() * 2)];
        return '' + 1 + tens + getHundredsRandon(tens) + '****' + getRandon() + getRandon() + getRandon() + getRandon();
    }

    function getRandon(num) {
        num = num || 9;
        return Math.round(Math.random() * num);
    }

    function getHundredsRandon(tens) {
        tens = tens || 3;
        var corrData = {
            3: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            5: [0, 1, 2, 3, 5, 6, 7, 8, 9],
            8: [2, 6, 7, 8, 9]
        }
        return corrData[tens][getRandon(corrData[tens].length - 1)];
    }

    function getPeizeRandon() {
        var prizeList = [
            '免单大奖',
            '10元格瓦拉@电影代金券',
            '100元度假代金券',
            '88元唯品会代金券',
            'QQ阅读半个月会员'
        ]
        return prizeList[Math.round(Math.random() * 4)];
    }

    function confirmLogIn() {
        qt.confirm({
            noHeader: true,
            contentCenter: true,
            message: '请登录后重试!',
            animate: 'scaleDownIn',
            onOk: function() {
                if (ua.toLowerCase().indexOf('qunar') !== -1) {
                    qt.qunarApi.ready(function () {
                        // 调用QunarAPI提供的各种接口
                        QunarAPI.checkJsApi({
                            jsApiList: ['login'], // 需要检测的JS接口列表
                            success: function(res) {
                                if (res.login) {
                                    QunarAPI.hy.login({
                                        shouldOpenLogin: true, // 指示是否允许弹登录界面，不允许时未登录直接返回登录失败,true=允许, false=不允许
                                        success: function(res) {
                                            window.location.reload();
                                        },
                                        fail: function(res) {
                                            console.log('%s %s', res.code, res.errmsg);
                                        }
                                    });
                                } else {
                                    qt.alert('请您升级至最新版客户端，升级享受去哪儿更好服务 ~');
                                }
                            }
                        });
                    })
                } else {
                    window.location.href = qt.commonParam.host.userCenter + '/mobile/login.jsp?ret=' + encodeURIComponent(window.location.href)
                }
            },
            onCancel: function() {}
        })
    }
})();