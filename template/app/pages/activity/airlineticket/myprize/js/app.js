/**
 * Created by taoqili on 15/10/16.
 * 待解决list：
 * 样式导入
 * 缓存
 */
import tpl from './../tpl/index.tpl';
import prizeList from './../tpl/prize-list.tpl';
import prizeAlert from './../tpl/prize-alert.tpl';
module.exports = (()=> {
    var util = qt.util,
        gettingMorePrize = false,
        ua = navigator.userAgent;
    return qt.definePage({
        config: {
            //name: 'myPrize',
            //forceRefresh: true,

            init: function () {
                if(ua.toLowerCase().indexOf('qunar') !== -1) {
                    qt.qunarApi.ready(function () {
                        QunarAPI.hideOptionMenu({});//隐藏右上角的分享按钮
                    });
                }
            },
            ready: function () {
                qt.onScrollStop(function (top) {
                    var scrollBottom = top + window.innerHeight,
                        pageHeight = document.body.scrollHeight;
                    if (scrollBottom < pageHeight) {
                        return;
                    }
                    if (!gettingMorePrize) {
                        getMorePrize();
                    }

                });

            },
        },
        events: function () {
            return {
                'tap .pr-exchange': 'exchange',
                'tap .more_prize': 'morePrize'
            };
        }(),
        templates: {
            header: function () {
                //return '<nav class="icon previous left"></nav><h1 class="title">我的奖品</h1>'
                return ''
            },
            subHeader: function (requestData, subPage) {
                return ''
            },
            body: function (requestData, subPage) {
                return {
                    url: window.location.origin + '/api/activity/airlineticket/ticketfree/record',
                    data: {
                        uparam: qt.requestData.uparam || '',
                    },
                    dataType: 'json',
                    success: function (data) {
                        if (!data.ret) {
                            setTimeout(function(){
                                confirmLogIn();
                            },2000)
                            return '';
                        }
                        if (data.errcode === 0) {
                            return qt.util.template(tpl, data);
                        }
                    },
                    error: function (e) {
                        qt.alert('网络异常，请稍后重试！');
                    }
                }

            },
            footer: ''
        },
        handles: function () {
            return {
                exchange: function (e) {
                    var $me = $(e.currentTarget);
                    if ($me.hasClass('pr-disable')) {
                        return;
                    }
                    var id = $me.attr('data-id') || '',
                        prizeCode = $me.attr('data-prizecode') || '',
                        status = $me.attr('data-prizestatus') || '';

                    //机票免单 已兑换 状态特殊处理
                    if(prizeCode == '888' && status > 0) {
                        schemaSkip($me.attr('data-link'));
                        return;
                    }

                    $.ajax({
                        url: window.location.origin + '/api/activity/airlineticket/ticketfree/exchange',
                        type: 'get',
                        dataType: "json",
                        data: {
                            uparam: qt.requestData.uparam || '',
                            prizeCode: prizeCode,
                            id: id
                        },
                        error: function (xhr) {
                            console.log('数据加载失败！请稍后刷新再次尝试！')
                            //qt.hidePageLoader();
                        },
                        success: function (response) {
                            //qt.hidePageLoader();
                            if (!response.ret) {
                                confirmLogIn();
                                return;
                            }

                            //机票免单，活动结束，可以兑奖，跳订单页或者绑卡页
                            if(prizeCode == '888' && response.data.code != 404) {
                                activityEnd();
                                return;
                            }

                            showAlert({msg: response.data.prompt, schema: response.data.schema});
                            if (response.data.code == 0) {
                                $me.html('已兑换').attr('data-prizestatus', 1).addClass('pr-disable');
                            }
                        }
                    });
                },
                morePrize: function () {
                    if (!gettingMorePrize) {
                        getMorePrize();
                    }
                }
            };
        }()
    });
    function showAlert(data) {
        var alData = {msg: data.msg};
        if (data.schema) {
            alData.alButtonA = '取消';
            alData.alButtonB = '激活';
        }
        qt.showPopup({
            message: qt.util.template(prizeAlert, {data: alData}),
            noHeader: true,
            noFooter: true,
            events: {
                'tap .al-buttonA': 'alButtonA',
                'tap .al-buttonB': 'alButtonB'
            },
            onTapMask: function () {
                qt.hidePopup();
            },
            alButtonA: function (e) {
                qt.hidePopup();
            },
            alButtonB: function (e) {
                qt.hidePopup();
                data.schema && (window.location.href = data.schema);
            }
        })
    };
    function getMorePrize() {
        var $dom = qt.$('.myPrize'),
            currentpage = parseInt($dom.attr('data-currpage')),
            totalpage = parseInt($dom.attr('data-totalpage')),
            $more_prize = qt.$('.more_prize');
        if (currentpage < totalpage) {
            $more_prize.removeClass('qt-hide').html('<span class="icon spinner"></span>加载中....');
            renderPrizeList($dom, currentpage + 1);
        } else {
            $more_prize.addClass('qt-hide');
        }
    }

    function renderPrizeList(dom, page) {
        page = page || 1;
        gettingMorePrize = true;
        $.ajax({
            url: window.location.origin + '/api/activity/airlineticket/ticketfree/record',
            type: 'get',
            dataType: "json",
            data: {
                page: page,
                uparam: qt.requestData.uparam || '',
            },
            error: function (xhr) {
                qt.alert('数据加载失败！请稍后刷新再次尝试！');
                gettingMorePrize = false;
            },
            success: function (data) {
                gettingMorePrize = false;
                if (!data.ret) {
                    confirmLogIn();
                    return;
                }
                //if (data.errcode !== 0) {
                //    qt.alert(data.msg);
                //    return;
                //}
                var html = util.template(prizeList, data),
                    $dom = $(dom);
                $dom.attr('data-totalpage', data.data.totalPage).attr('data-currpage', data.data.currPage);
                $dom.find('.more_prize').remove();
                $dom.append(html);

            }
        });
    }

    function confirmLogIn() {
        if (ua.toLowerCase().indexOf('qunar') !== -1) {
            qt.qunarApi.ready(function () {
                // 调用QunarAPI提供的各种接口
                QunarAPI.checkJsApi({
                    jsApiList: ['login'], // 需要检测的JS接口列表
                    success: function (res) {
                        if (res.login) {
                            QunarAPI.hy.login({
                                shouldOpenLogin: true, // 指示是否允许弹登录界面，不允许时未登录直接返回登录失败,true=允许, false=不允许
                                success: function (res) {
                                    window.location.reload();
                                },
                                fail: function (res) {
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
            window.location.href = qt.commonParam.host.userCenter+'/login.jsp?ret=' + encodeURIComponent(window.location.href)
        }
    }

    function activityEnd() {
        $.ajax({
            url: window.location.origin + '/api/activity/springgift?action=card',
            type: 'get',
            data: {
                uparam: qt.requestData.uparam || '',
            },
            dataType: "json",
            error: function (xhr) {
                console.log('数据加载失败！请稍后刷新再次尝试！');
            },
            success: function (res) {
                // code: 1-未绑卡-绑卡页，0-已绑卡-订单列表页
                //res.data.code = 1;
                if(res.data.code == 0) {
                    schemaSkip(res.data.url);
                }
                else if(res.data.code == 1) {
                    qt.showPopup({
                        message: qt.util.template(prizeAlert, {
                            data: {
                                msg: '为方便您兑换及提现，<br/>需绑定一张银行卡',
                                alButtonA: '取消',
                                alButtonB: '绑卡'
                            }
                        }),
                        noHeader: true,
                        noFooter: true,
                        events: {
                            'tap .al-buttonA': 'alButtonA',
                            'tap .al-buttonB': 'alButtonB'
                        },
                        onTapMask: function () {
                            qt.hidePopup();
                        },
                        alButtonA: function (e) {
                            qt.hidePopup();
                        },
                        alButtonB: function (e) {
                            qt.hidePopup();
                            schemaSkip(res.data.url, true);
                        }
                    });
                }
            }
        });
    }

    function schemaSkip(url, isHideNavBar) {
        if (ua.toLowerCase().indexOf('qunar') !== -1) {
            qt.qunarApi.ready(function () {
                QunarAPI.checkJsApi({
                    jsApiList: ['openWebView'], // 需要检测的JS接口列表
                    success: function (res) {
                        if (res.openWebView) {
                            QunarAPI.hy.openWebView({
                                url: url,

                                // 以下参数当位于大客户端时可用：
                                // 指定view的名称，可以在新页面返回时跳回指定名称的页面
                                name: 'ticketfreeBindCard',
                                // view 通信数据，子view通过getInitData获取（iOS未上线）
                                data: {},
                                // navigation已经满足不了你了，这不重要
                                type: isHideNavBar ? 'navibar-none' : 'navibar-normal',  // 隐藏掉navigation，自己定制吧;
                                // navigation: {
                                //     title: { // 指定标题
                                //         style: 'text', // 标题样式: text: 普通文本 | location: 标题右侧带一个小箭头
                                //         text: '添加银行卡' // 标题文字
                                //     }
                                // },
                                //页面关闭后返回的数据
                                onViewBack: function (res) {
                                    // res： 根据用户反馈的数据展示
                                }
                            });
                        } else {
                            window.location.href = url;
                        }
                    }
                });

            });
        } else {
            window.location.href = url;
        }
    }
})();