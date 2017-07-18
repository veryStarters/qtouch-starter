/*
 - 订单详情页
 - User: rj.ren
 - Date: 16/6/12
*/
// import map from '../../../common/sub-pages/map/';
// import changeHistoryPage from '../sub-pages/order-status/index'
// import extendPopTpl from './../tpl/extend.tpl';
import detailPopTpl from './../tpl/detail.tpl';

module.exports = (() => {
    var util = qt.util,
        firstData = qt.firstData,
        requestData = qt.requestData,
        currentParam = {
            wrapid: requestData.wrapperId,
            type: requestData.type,
            smobile: requestData.smobile
        };
    return qt.definePage({
        config: {
            ready: () => {
                if (qt.$('.js-invoicewarmtip').length > 0) {
                    processInvoiceInfo();
                }
            },
            init: () => {
                if(qt.firstData.needLink) {
                    orderSync();
                }
            }
            //backMonitor: (requestData) => {
            //    location.href = '/hotel/hotelorderlist?statusType=0&type=' + requestData.type;
            //}
        },
        events: {
            'tap .cancelcashbacktip': 'cancelCashBackTip',
            'tap .cancelorder': 'cancelOrder',
            'tap .refundorder': 'refundOrder',
            'tap .canceltip': 'showCancelTip',
            'tap .showfeedetail': 'showFeeDetail',
            'tap .telagent': 'telAgent',
            'tap .showrequire': 'showRequire',
            'tap .showinvoicedetail': 'showInvoiceDetail',
            'tap .vouchrule': 'showVouchRule',
            'tap .signup': 'signUp',
            'tap .otherinfo .otherinfoitem': 'getOtherInfo',
            'tap .showaccount': 'showAccount',
            'tap .servicephones': 'telServicePhones'
        },
        handles: {
            telServicePhones: (e) => {
                var $me = $(e.currentTarget);
                location.href = $me.data('url');
            },
            // 关闭返现提示
            cancelCashBackTip: (e) => {
                $(e.currentTarget).parent().css('display', 'none');
            },
            // 取消订单
            cancelOrder: (e) => {
                var $me = $(e.currentTarget);
                qt.confirm({
                    message: '你确定要取消该订单吗？',
                    onOk: () => {
                        setTimeout(() => {
                            getToken($me, 'cancel')
                        }, 1000);
                    }
                });
            },
            // 申请退款
            refundOrder: (e) => {
                var $me = $(e.currentTarget);
                qt.confirm({
                    message: '是否确认退掉全部房间？退款金额：￥' + $me.data('totalprice') + '元',
                    onOk: () => {
                        setTimeout(() => {
                            getToken($me, 'refund')
                        }, 1000);
                    }
                });
            },

            // 查看订单取消规则
            showCancelTip: (e) => {
                var cancelRule = firstData.order.cancelRule,
                    extraRule = firstData.order.extra.alertMsg,
                    $me = $(e.currentTarget),
                    cancel = $me.data('cancel'),
                    extra = $me.data('extra'),
                    msg = '';
                if (cancel) {
                    msg += "<p><span class='icon notification qt-red'></span><span class='qt-ml5 qt-middle'>" + cancelRule.cancelName + "</span></p><p class='qt-grey qt-font12 qt-ml25 '>" + cancelRule.cancelRule + "</p>"
                }
                if (extra && extraRule && extraRule != '') {
                    msg += "<p><span class='icon q-star-price qt-blue'></span><span class='qt-ml5 qt-middle'>" + firstData.order.orderInfo.ptTypeDesc + "</span></p><p class='qt-grey qt-font12 qt-ml25 '>" + extraRule.replace(/\n/g, '<br>') + "</p>"
                }
                qt.showPopup({
                    noFooter: true,
                    message: msg,
                    onTapMask: (e) => {
                        qt.hidePopup();
                    },
                    onClick: (e) => {
                        qt.hidePopup();
                    }
                })
            },
            // 查看担保规则
            showVouchRule: (e) => {
                var vouchRule = firstData.order.orderInfo.vouchInfo.vouchRule;
                qt.showPopup({
                    noFooter: true,
                    message: "<p><span class='icon q-star-price qt-blue'></span><span class='qt-ml5 qt-middle'> 担保规则</span></p><p class='qt-grey qt-font12 qt-ml25'>" + vouchRule + "</p>",
                    onTapMask: (e) => {
                        qt.hidePopup();
                    },
                    onClick: (e) => {
                        qt.hidePopup();
                    }
                })
            },

            // 展示费用明细
            showFeeDetail: (e) => {
                var detailObj = firstData.order.discountInfo;
                qt.showSidebar({
                    type: 'bottom',
                    maskOpacity: .5,
                    onTapMask: () => {
                        qt.hideSidebar();
                    },
                    template: qt.util.template(detailPopTpl, {
                        data: detailObj
                    })
                });
            },

            // 前往客户端签到领取返现
            signUp: (e) => {
                var $me = $(e.currentTarget),
                    param = {
                        wrapperId: currentParam.wrapid,
                        orderNo: $me.data('orderno'),
                        contactPhone: $me.data('mobile')
                    },
                    href = 'hotel/orderDetail?' + util.param2query(param);
                location.href = util.schemePrefix() + '://' + href;
            },

            getOtherInfo: (e) => {
                var $me = $(e.currentTarget),
                    type = $me.data('type');
                switch (type) {
                    case 'hotel':
                        toHotel($me);
                        break;
                        // case 'location':
                        //     showMap($me);
                        //     break;
                }
            },

            // 展示用户其他要求
            showRequire: (e) => {
                var $me = $(e.currentTarget),
                    $arrow = $me.find('.icon'),
                    $requireContent = $me.find('.requirecontent');
                if ($arrow.hasClass('arrow-down')) {
                    $arrow.removeClass("arrow-down").addClass('arrow-up');
                } else {
                    $arrow.removeClass("arrow-up").addClass('arrow-down');
                }

                $requireContent.toggleClass('qt-hide');
            },

            // 展示更多发票信息
            showInvoiceDetail: (e) => {
                var $me = $(e.currentTarget),
                    $arrow = $me.find('.icon'),
                    $invoiceDetailCont = $me.find('.invoicedetail');
                if ($arrow.hasClass('arrow-down')) {
                    $arrow.removeClass("arrow-down").addClass('arrow-up');
                } else {
                    $arrow.removeClass("arrow-up").addClass('arrow-down');
                }
                $invoiceDetailCont.toggleClass('qt-hide');


            }
        }
    });
    // 发票温馨提示信息展示样式预处理
    function processInvoiceInfo() {
        var invoiceWarmTip = firstData.order.invoiceInfo.invoicePostWarmTips,
            colorSpan = invoiceWarmTip.colorSpan,
            text = invoiceWarmTip.text,
            substrArray = [];

        if (text && text !== '') {
            if (colorSpan && colorSpan.length > 0) {
                substrArray = _.map(colorSpan, (item) => {
                    return text.substring(item[0], item[1]);
                });

                _.forEach(substrArray, (item) => {
                    text = text.replace(item, "<span class='qt-red'>" + item + "</span>");
                });
            }
        }
        qt.$('.js-invoicewarmtip').html(text);

    }
    // 跳转到酒店详情页
    function toHotel($item) {
        var param = {
            city: $item.data('city'),
            seq: $item.data('seq'),
            firstRoomName: $item.data('firstroomname'),
            isLM: 0,
            extra: encodeURIComponent('{re:rebooking}')
        };
        location.href = '/hotel/hoteldetail?' + util.param2query(param);
    }

    function dealOrder(token, type) {
        var msg = type === 'cancel' ? '订单取消成功' : '订单退款成功';
        $.ajax({
            url: '/api/hotel/hotelorderdeal',
            type: 'post',
            dataType: 'json',
            data: {
                token: token,
                opType: type === 'cancel' ? 1 : 2,
                wrapperId: currentParam.wrapid
            },
            success: (res) => {
                if (res.ret) {
                    qt.alert(msg, () => {
                        location.reload();
                    });
                } else {
                    qt.alert(res.msg);
                }
            },
            error: () => {
                qt.alert('网络错误，请稍后再试');
            }
        })
    }

    function getToken($me, type) {
        $.ajax({
            url: '/api/hotel/hotelordertoken',
            type: 'post',
            dataType: 'json',
            data: {
                orderNo: $me.data('orderno'),
                smobile: $me.data('mobile')
            },
            success: (res) => {
                if (res && !res.data) {
                    qt.alert('操作失败，请重试');
                } else {
                    dealOrder(res.data, type);
                }
            },
            error: () => {
                qt.alert('网络错误，请稍后再试');
            }
        })
    }

    //订单同步
    function orderSync() {
        var orders = [{
            orderno: qt.requestData && qt.requestData.orderNum,
            mobile: qt.firstData.order && qt.firstData.order.orderInfo && qt.firstData.order.orderInfo.smobile,
            wrapperId: qt.requestData && qt.requestData.wrapperId
        }];

        qt.confirm({
            noHeader: true,
            contentCenter: true,
            message: '当前订单是否绑定到当前账号?',
            okText: '绑定',
            cancelText: '忽略',
            onOk: function () {
                // 同步
                $.ajax({
                    url: '/api/hotel/hotelorderlink',
                    data: {
                        orders: JSON.stringify(orders)
                    },
                    dataType: 'json',
                    success: function(data) {
                        if (data && data.ret) {
                            setTimeout(function () {
                                qt.alert({
                                    message: '订单同步成功！',
                                    onOk: function () {
                                        localStorage.removeItem('horder_' + qt.requestData.orderNum);
                                        localStorage.removeItem('zorder_' + qt.requestData.orderNum);
                                    }
                                })
                            }, 600);
                        }
                    },
                    error: function() {
                        setTimeout(function () {
                            qt.confirm({
                                message: '离线订单关联失败，请点击确定按钮，再次尝试',
                                onOk: function() {
                                    orderSync();
                                }
                            })
                        }, 600);
                    }
                })
            }
        });
    }
})();
// 延住选择
// showExtendOptions: function() {
//     var detailObj = qt.firstData.extendInfo;
//     qt.showSidebar({
//         type: 'bottom',
//         maskOpacity: .5,
//         onTapMask: function() {
//             qt.hideSidebar();
//         },
//         events: {
//             'tap .extendlist li': 'selectExtendTime'
//         },
//         selectExtendTime: function(e) {
//             var $me = $(e.currentTarget);
//             console.log($me.data('time') + "" + $me.data('price'));
//             qt.hideSidebar();
//         },
//         template: qt.util.template(extendPopTpl, {
//             data: detailObj
//         })
//     });
// },
// 打开酒店位置地图
// function showMap($item) {
//     map.open({
//         data: {
//             title: $item.data('hotelname'),
//             point: function() {
//                 let p = $item.data('gpoint').split(',');
//                 return {
//                     lat: p[0],
//                     lng: p[1]
//                 };
//             }(),
//             seq: $item.data('seq'),
//             isGJ: qt.firstData.isGJ,
//             checkInDate: $item.data('checkin'),
//             checkOutDate: $item.data('checkout')
//         }
//     });
// }

// 展示订单变更历史，调用子页面
// showChangeHistory: function(e) {
//     var $me = $(e.currentTarget),
//         status = $me.data('status');
//     changeHistoryPage.open({
//         data: qt.firstData.orderAmendingLogs
//     });
// }