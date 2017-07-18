/**
 * Created by lqq.li on 16/3/7.
 */
import addUser from '../sub-pages/add-user/index';
import roomPreference from '../sub-pages/room-preference/index';
import shippingAddress from '../sub-pages/shipping-address/index';

import priceInfoUtil from './price-info-util';
import orderLine from './order-line';

import guestsAddTpl from '../tpl/guests-add.tpl';
import timeSelectTpl from '../tpl/side-bar/time-select.tpl';
import countryTpl from '../tpl/side-bar/country.tpl';
import invoiceTypeTpl from '../tpl/side-bar/invoice-type.tpl';
import invoiceContentTpl from '../tpl/side-bar/invoice-content.tpl';
import postTypeTpl from '../tpl/side-bar/post-type.tpl';
import breakfastDetailTpl from '../tpl/pop-up/breakfast-detail.tpl';

import tipsTpl from '../tpl/tips.tpl';
import tipsPopTpl from '../tpl/pop-up/tips-pop.tpl';
import priceDetailTpl from '../tpl/side-bar/price-detail.tpl';
import topTipsTpl from '../tpl/side-bar/top-tips.tpl';
import roomCountPage from '../sub-pages/order-room-count-select/index';
import validate from './validate';

module.exports = (() => {

    var util = qt.util,
        isGongLue = navigator.userAgent.indexOf('qunartravel') !== -1,
        roomInfo = qt.firstData.roomInfo,
        submitParam = {},
        curData = {},
        guestLocal;

    try {
        guestLocal = JSON.parse(decodeURIComponent(localStorage.getItem('GUESTS_INFO')) || '{}')
    } catch (e) {
        guestLocal = {
            // 国际
            gj: {
                firstName: '',
                lastName: '',
                mobile: ''
            },
            // 国内
            gn: {
                name: '',
                mobile: ''
            }
        }
    };

    return qt.definePage({
        config: {
            init: function() {

                if (isGongLue && navigator.userAgent.indexOf('ios') !== -1) {
                    $('.qt-header-wrapper').addClass('client');
                }

                //若返回data为空,则不执行js
                if ($.isEmptyObject(qt.firstData)) {
                    return false;
                }

                // 若有错误提示消息
                if (qt.href().param('err')) {
                    var errms = decodeURIComponent(qt.href().param('err'));
                    if (errms == '与已提交订单重复，请取消相同入住日期订单后重试。') {
                        qt.alert({
                            title: '提交订单失败！',
                            message: errms,
                            okText: '查看订单',
                            onOk: function() {
                                location.href = isGongLue ? 'http://touch.travel.qunar.com/client/order#order.list' : 'http://touch.qunar.com/h5/hotel/hotelorderlist';
                            }
                        });
                    } else {
                        qt.$('.err-box').removeClass('qt-hide').find('.err span').html(errms);
                    }
                }

                // 变价提示
                var priceChange = roomInfo.priceChange,
                    toast = roomInfo.isPriceChangeTipsToast;
                if (priceChange) {
                    if (toast) {

                        setTimeout(qt.showSidebar({
                            events: {
                                'tap .radio-box li': 'invoiceType'
                            },
                            template: _.template(topTipsTpl, {
                                msg: priceChange
                            }),
                            offsetY: 50,
                            noMask: true,
                            zIndex:20,
                            beforeShow: function () {
                                qt.$('.qt-header').addClass('sidebar-zindex');
                            },
                            onShow: function() {
                                setTimeout(function() {
                                    qt.hideSidebar();
                                }, 3000);
                            },
                            onHide: function() {
                                qt.$('.qt-header').removeClass('sidebar-zindex');
                            }
                        }), 1000);


                    } else {
                        qt.alert({
                            noHeader: true,
                            message: priceChange
                        });
                    }
                }

                // 联系人 跟 电话号 的localStorage
                if ($.isEmptyObject(guestLocal)) {
                    guestLocal = {
                        // 国际
                        gj: {
                            firstName: '',
                            lastName: '',
                            mobile: ''
                        },
                        // 国内
                        gn: {
                            name: '',
                            mobile: ''
                        }
                    }
                }

                submitParam = {
                    tag: qt.requestData.tag || '',
                    city: qt.requestData.city || '',
                    keywords: qt.requestData.keywords || '',
                    checkInDate: qt.requestData.checkInDate || '',
                    checkOutDate: qt.requestData.checkOutDate || '',
                    wrapperId: qt.requestData.wrapperId || '',
                    roomId: qt.requestData.roomId || '',
                    logicBit: qt.requestData.logicBit || '',
                    mobilePriceType: qt.requestData.mobilePriceType || '',
                    hotelId: qt.requestData.hotelId || '',
                    seq: qt.requestData.seq || '',
                    planId: qt.requestData.planId || '',
                    bd_ssid: qt.requestData.bb_ssid || '',
                    bd_sign: qt.requestData.bd_sign || '',
                    countryCode: roomInfo.countryCode || '',
                    currencySign: roomInfo.currencySign || '',
                    type: qt.requestData.type || 0,
                    needBookingEmail: roomInfo.inputInfo ? roomInfo.inputInfo.needBookingEmail : false,
                    otherRequire: ''
                };
                curData = {
                    room: {
                        roomCount: qt.requestData.roomCount
                    },
                    price: {
                        expressFee: 0, // 发票快递费
                        hasVouch: false, // 是否有担保
                        vouchCount: roomInfo.vouchRule ? roomInfo.vouchRule.length : 0,
                        vouchType: 0, // 担保类型
                        vouchRule: '',
                        vouchBy: {
                            time: false,
                            count: false
                        }, // 担保为超时还是超量
                        info: qt.firstData.priceInfos[0], // 当前房间数对应的priceInfo
                        payTypeDesc: roomInfo.payTypeDesc, // 支付类型
                        payType: roomInfo.payType, // 0-预付,1-现付
                        ptType: roomInfo.ptType, // 优惠类型
                        ptTypeDesc: roomInfo.ptTypeDesc, //优惠类型说明
                        currencySign: roomInfo.currencySign,
                        hasCoupons: qt.firstData.friendInfo && !_.isEmpty(qt.firstData.friendInfo),   //是否有友谊券
                        couponsActive: true,  //友谊券是否激活
                        couponsPrice: 0     //友谊券优惠价格
                    },
                    //住宿偏好 子页面传递过来的数据，提交时不用处理
                    roomPreferenceData: {
                        '房型要求': '',
                        '无烟房': '',
                        '房间要求': '',
                        '其他要求': ''
                    },
                    //发票 配送地址，子页面传递过来的数据，提交时手动处理
                    shippingAddressData: {
                        name: '',	//发票配送收件人姓名
                        mobile: '',//发票配送收件人电话
                        city: '',	//发票配送地址的市code
                        cityName: '',	//发票配送地址的市中文名
                        detail: '',	//发票配送地址的街道
                        district: '',	//发票配送地址的区code
                        districtName: '',	//发票配送地址的区中文名
                        province: '',	//发票配送地址的省code
                        provinceName: '',	//发票配送地址的省中文名
                        zipcode: ''	//发票配送地址的邮编
                    },
                    //友谊券数据
                    couponsData: {}
                };

                // 获取友谊券状态
                couponsStatusInit();

            },
            ready: function() {
                // 统计
                monitor('page');

                //若返回data为空,则不执行js
                if ($.isEmptyObject(qt.firstData)) {
                    return false;
                }

                if (qt.commonParam && qt.commonParam.isLogin) {
                    qt.$('.login').remove();
                }

                // 数据渲染
                var orderBase = orderLine.roomLine({
                        inputInfo: roomInfo.inputInfo,
                        req: qt.requestData
                    })
                    .concat(orderLine.timeLine({
                        arriveTimes: qt.firstData.arriveTimes,
                        currencySign: roomInfo.currencySign,
                        vouchMoney: qt.firstData.priceInfos[0].totalVouchMoney
                    }))
                    .concat(orderLine.guestsLine({
                        guestLocal: guestLocal,
                        inputInfo: roomInfo.inputInfo,
                        isLogin: qt.commonParam.isLogin
                    }))
                    .concat(orderLine.phoneLine({
                        isGj: roomInfo.inputInfo ? roomInfo.inputInfo.needEnglishGuestName : false,
                        guestLocal: guestLocal
                    }))
                    .concat(orderLine.emailLine(roomInfo.inputInfo))
                    .concat(orderLine.cardLine(roomInfo))
                    .concat(orderLine.countryLine(roomInfo.inputInfo))
                    .concat(orderLine.cityLine(roomInfo.inputInfo))
                    .concat(orderLine.addressLine(roomInfo.inputInfo))
                    .concat(orderLine.zcodeLine(roomInfo.inputInfo)),

                    couponsSelect = curData.price.hasCoupons ? orderLine.couponsLine({
                        hasCoupons: curData.price.hasCoupons,
                        couponsActive: curData.price.couponsActive,
                        currencySign: curData.price.currencySign,
                        price: curData.couponsData.priceInfo.amount.amount
                    }) : '',

                    personalNeeds = orderLine.accommodationLine(qt.firstData)
                    .concat(orderLine.invoiceLine({
                        invoiceInfo: roomInfo.invoiceInfo,
                        currencySign: roomInfo.currencySign,
                        invoiceMoney: qt.firstData.priceInfos[0].totalPrice
                    }));

                $('.room-option').html(orderBase);
                couponsSelect.trim() ? $('.coupons-option').html(couponsSelect) : $('.coupons-option').addClass('qt-hide');
                personalNeeds.trim() ? $('.personal-needs').html(personalNeeds) : $('.personal-needs').addClass('qt-hide');

                // 担保 及 价格 初始化
                if (curData.price.vouchCount > 0) {
                    priceInfoUtil.hasVouch(curData, {
                        count: qt.requestData.roomCount,
                        time: qt.firstData.arriveTimes.times[qt.firstData.arriveTimes.defaultKey].key
                    });
                    priceInfoUtil.vouchDomChange(curData);
                }
                priceInfoUtil.refreshPrice(curData);

                tipsInit();
            },
            backMonitor: function() {

                if ($.isEmptyObject(qt.firstData)) {
                    if (isGongLue) {
                        qt.qunarApi.ready(function () {
                            QunarAPI.hy.closeWebView();
                        });
                        return;
                    }
                    history.go(-1);
                } else {
                    qt.confirm({
                        noHeader: true,
                        contentCenter: true,
                        message: '订单尚未提交，返回将放弃填写？',
                        okText: '继续填写',
                        cancelText: '返回',
                        onOk: function() {},
                        onCancel: function() {
                            var ua = navigator.userAgent;
                            if (ua.indexOf('qunartravel') !== -1) {
                                qt.qunarApi.ready(function () {
                                    QunarAPI.hy.closeWebView();
                                });
                                return;
                            }
                            history.go(-1);
                        }
                    });
                }
            }
        },
        events: {
            'tap .to-break-detail': 'toBreakDetail',
            'tap nav.login': 'toLogin',

            'tap .gj-room': 'roomCountSelect',
            'tap .room-account .minus': 'roomMinus',
            'tap .room-account .plus': 'roomPlus',
            'tap .time-line': 'arriveTimeChange',
            'tap .add-user': 'addUser',
            'tap .accommodation-line': 'accommodationLike',
            'tap .country-line': 'countrySwitch',
            'tap .user-tips': 'userTips',
            'tap .coupons .qt-switch': 'couponsSwitch',

            'tap .invoice .qt-switch': 'invoiceSwitch',
            'tap .invoice-tip': 'invoiceTip',
            'tap .invoice-type': 'invoiceTypeChange',
            'tap .invoice-content': 'invoiceContentChange',
            'tap .address_content': 'addInvoiceAddress',

            'tap .detail-btn': 'priceDetail',
            'tap .submit-btn': 'submit',

            'tap .tips': 'showEllipsis',
            'tap .more-tips': 'showAllTips',
            'focus .order-option input': 'inputFocus',
            'blur .order-option input': 'inputBlur',
            'tap .qt-sidebar.bottom h2': 'noMove',
            'tap .sub-title': 'noMove'

        },
        templates: {},
        handles: {
            toLogin: function() {
                var loc = window.location,
                    ret = encodeURIComponent(loc.href);
                loc.href = qt.commonParam.host.userCenter + '/mobile/login.jsp?goBack=1&ret=' + ret;
            },
            //早餐详情
            toBreakDetail: function() {
                qt.showPopup({
                    title: '早餐明细',
                    noFooter: true,
                    message: _.template(breakfastDetailTpl, {
                        data: qt.firstData.breakfast.detail
                    }),
                    onTapMask: function(e) {
                        qt.hidePopup();
                    },
                    onClick: function(e) {
                        qt.hidePopup();
                    }
                })
            },

            roomCountSelect: function(e) {
                var $me = $(e.currentTarget),
                    oldRoomNum = curData.room.roomCount;

                roomCountPage.open({
                    data: {
                        curData: curData.room.detail ? curData.room : ''
                    },
                    onBack: function(data) {

                        if (!data || data._self_) return;

                        curData.room = data.room;
                        $me.find('.val').text('房间' + data.room.roomCount + ' 成人' + data.room.adultsCount + ' 儿童' + data.room.childrenCount);
                        submitParam.guestInfos = JSON.stringify( data.room.guestInfos );

                        curData.price.info = data.price ? data.price[0] : curData.price.info;
                        curData.price.info.taxation = data.taxation ? data.taxation : curData.price.info.taxation;
                        changeRooms(oldRoomNum, data.room.roomCount);
                        cancellationTipsChange();
                    }
                });
            },

            // 房间数 减少 && 添加
            roomMinus: function(e) {
                var $me = $(e.currentTarget),
                    $num = $me.siblings('span'),
                    curNum = parseInt($num.text().trim(), 10);

                if ($me.hasClass('off')) {
                    return;
                }

                if (curNum > qt.requestData.minRooms) {
                    curNum--;
                    $num.text(curNum);

                    _.each(qt.firstData.priceInfos, function(item, index) {
                        if (item.bookNum === curNum) {
                            curData.price.info = item;
                            return false;
                        }
                    });

                    changeRooms(curNum + 1, curNum, "-");
                    curData.room.roomCount = curNum;

                    curNum === qt.requestData.minRooms && $me.addClass('off');
                    curNum === qt.requestData.maxRooms - 1 && $me.siblings('.plus').removeClass('off');
                }
            },
            roomPlus: function(e) {
                var $me = $(e.currentTarget),
                    $num = $me.siblings('span'),
                    curNum = parseInt($num.text().trim(), 10);

                if (curNum < qt.requestData.maxRooms) {
                    curNum++;
                    $num.text(curNum);

                    _.each(qt.firstData.priceInfos, function(item, index) {
                        if (item.bookNum === curNum) {
                            curData.price.info = item;
                            return false;
                        }
                    });

                    changeRooms(curNum - 1, curNum, "+");
                    curData.room.roomCount = curNum;

                    curNum === qt.requestData.maxRooms && $me.addClass('off');
                    curNum === qt.requestData.minRooms + 1 && $me.siblings('.minus').removeClass('off');
                }
            },

            //房间保留时间
            arriveTimeChange: function(e) {
                var $btn = $(e.currentTarget),
                    curValue = $btn.attr('data-value'),
                    curKey = $btn.attr('data-key');
                qt.$('input').blur();

                setTimeout(qt.showSidebar({
                    events: {
                        'tap .radio-box li': 'arriveTime'
                    },
                    type: 'bottom',
                    template: _.template(timeSelectTpl, {
                        data: qt.firstData.arriveTimes,
                        curKey: curKey,
                        hasVouch: curData.price.hasVouch,
                        vouchMoney: curData.price.info.totalVouchMoney,
                        currencySign: roomInfo.currencySign
                    }),
                    offsetY: 0,
                    onTapMask: function() {
                        qt.hideSidebar();
                    },
                    arriveTime: function(e) {
                        var $me = $(e.currentTarget),
                            newKey = $me.attr('data-key'),
                            newValue = $me.attr('data-value');

                        if ($me.hasClass('active')) {
                            qt.hideSidebar();
                            return false;
                        }
                        if ($me.attr('data-vouch') == 'true') {
                            $('.qt-sidebar .vouch-detail').removeClass('qt-hide');
                        } else {
                            $('.qt-sidebar .vouch-detail').addClass('qt-hide');
                        }
                        $me.addClass('active').siblings().removeClass('active');
                        $btn.attr('data-value', newValue);
                        $btn.attr('data-key', newKey);
                        $btn.find('.val').text(newKey);
                        qt.hideSidebar();

                        if (curData.price.vouchCount > 0) {
                            priceInfoUtil.hasVouch(curData, {
                                time: newKey
                            });
                            priceInfoUtil.vouchDomChange(curData);
                            priceInfoUtil.refreshPrice(curData);
                            vouchTipsChange();
                        }
                    }
                }), 1000);
            },

            //添加常用联系人
            addUser: function() {
                var roomCount = curData.room.roomCount; //房间总数
                var curretUser = []; //已填写姓名
                _.each($('.guests-line input'), function(item) {
                    if ($(item).val()) {
                        curretUser.push($(item).val())
                    }
                })

                var options = {
                    rooms: roomCount,
                    currentChoosed: curretUser, //已选中姓名
                    title: "选择常用联系人"
                }
                addUser.open({
                    data: options,
                    onBack: function(data) {

                        if (!data._self_) {
                            $('.guests-line input').val('');
                            _.each(data, function(obj, index) {
                                $('.guests-line input').eq(index).val(obj.name);
                                if (!index) {
                                    $('.phone-line input').val(obj.mobile.split('-')[1]);
                                }
                            })
                        }
                    }
                })
            },

            //住宿偏好选择
            accommodationLike: function() {
                var options = qt.firstData.require;

                options.roomCount = curData.room.roomCount;
                // options.otherRequireOpts = ['有窗','相近房间','test']
                //已经选中的数据
                options.choosed = curData.roomPreferenceData;

                roomPreference.open({
                    data: options,
                    onBack: function(data) {
                        if (!data._self_) {
                            curData.roomPreferenceData = $.extend(curData.roomPreferenceData, data);
                            $('.accommodation-line .accommodation-content').empty();
                            //住宿偏好 提交数据
                            var submitValue = [];
                            _.each(data, function(value, key) {
                                //无要求的不展示
                                if (value !== '无床型偏好' && value !== '无要求' && value !== '无其他要求' && value !== '') {
                                    $('.accommodation-line .accommodation-content').append('<p>' + value + '</p>');
                                    submitValue.push(value);
                                }
                            });

                            //如果没有偏好设置，默认展示无住宿偏好
                            if ($('.accommodation-line .accommodation-content p').length == 0) {
                                $('.accommodation-line .accommodation-content').append('<p>无</p>');
                            }
                            submitParam.otherRequire = submitValue.join(',');
                        }
                    }
                })
            },

            // 国家选择
            countrySwitch: function(e) {
                var $btn = $(e.currentTarget),
                    curValue = $btn.attr('data-value');
                qt.$('input').blur();

                qt.showSidebar({
                    events: {
                        'tap .radio-box li': 'countryChange'
                    },
                    type: 'bottom',
                    template: _.template(countryTpl, {
                        data: roomInfo.inputInfo.contactCountryList,
                        curValue: curValue
                    }),
                    offsetY: 0,
                    onTapMask: function() {
                        qt.hideSidebar();
                    },
                    countryChange: function(e) {
                        var $me = $(e.currentTarget);

                        if ($me.hasClass('active')) {
                            qt.hideSidebar();
                            return false;
                        }

                        $me.addClass('active').siblings().removeClass('active');
                        $btn.attr('data-value', $me.attr('data-value'));
                        $btn.find('.val').text($me.attr('data-key'));
                        qt.hideSidebar();
                    }
                });
            },

            //入住人提示
            userTips: function() {
                qt.showPopup({
                    title: '入住人填写说明',
                    noFooter: true,
                    message: `<ol class="user-tips-content">
						<li>房间入住人需为入住手续办理人,且所填写姓名与所持证件一致,订单提交后入住人无法更改</li>
						<li>只能填写英文或拼音,限3-20字符</li>
						<li>入住人姓名不能重复填写</li>
					</ol>`,
                    onTapMask: function(e) {
                        qt.hidePopup();
                    },
                    onClick: function(e) {
                        qt.hidePopup();
                    }
                })
            },

            couponsSwitch: function (e) {
                var $btn = $(e.currentTarget);

                if($btn.hasClass('active')) {
                    $btn.removeClass('active');
                    curData.price.couponsActive = false;
                    priceInfoUtil.refreshPrice(curData);
                    qt.monitor('orderinfo-coupons-switch-close');
                    return ;
                }
                $btn.addClass('active');
                qt.monitor('orderinfo-coupons-switch-open');
                curData.price.couponsActive = true;
                    priceInfoUtil.refreshPrice(curData);
            },

            //是否需要发票
            invoiceSwitch: function(e) {
                var $btn = qt.$(e.currentTarget),
                    $parent = $btn.parents('.invoice'),
                    $detail = qt.$('.invoice-detail'),
                    $charge = qt.$('.express-charge'),
                    $tip = qt.$('.invoice-tip'),
                    $no = qt.$('.no-invoice'),
                    $fee = qt.$('.express-fee');

                if ($btn.hasClass('active')) {
                    $btn.removeClass('active');
                    $detail.addClass('qt-hide');
                    $charge.addClass('qt-hide');
                    $tip.addClass('qt-hide');
                    $no.removeClass('qt-hide');
                    $parent.removeClass('on');

                    curData.price.expressFee = 0;
                    priceInfoUtil.refreshPrice(curData);

                    return;
                }

                $btn.addClass('active');
                $detail.removeClass('qt-hide');
                $charge.removeClass('qt-hide');
                $tip.removeClass('qt-hide');
                $no.addClass('qt-hide');
                $parent.addClass('on');

                curData.price.expressFee = $fee.length ? parseInt($fee.attr('data-value'), 10) : 0;
                priceInfoUtil.refreshPrice(curData);
            },

            //发票提示信息
            invoiceTip: function() {
                qt.showPopup({
                    title: '发票说明',
                    noFooter: true,
                    message: roomInfo.invoiceInfo.invoicePostWarmTips.text,
                    onTapMask: function(e) {
                        qt.hidePopup();
                    },
                    onClick: function(e) {
                        qt.hidePopup();
                    }
                })
            },

            //发票类型选择
            invoiceTypeChange: function(e) {
                var $btn = $(e.currentTarget),
                    curValue = $btn.attr('data-value');
                qt.$('input').blur();

                qt.showSidebar({
                    events: {
                        'tap .radio-box li': 'invoiceType'
                    },
                    type: 'bottom',
                    template: _.template(invoiceTypeTpl, {
                        data: roomInfo.invoiceInfo.invoiceType,
                        curValue: curValue
                    }),
                    offsetY: 0,
                    onTapMask: function() {
                        qt.hideSidebar();
                    },
                    invoiceType: function(e) {
                        var $me = $(e.currentTarget);

                        if ($me.hasClass('active')) {
                            qt.hideSidebar();
                            return false;
                        }

                        $me.addClass('active').siblings().removeClass('active');
                        $btn.attr('data-value', $me.attr('data-value'));
                        $btn.find('.val').text($me.attr('data-key'));
                        qt.hideSidebar();
                    }
                });
            },

            //发票内容选择
            invoiceContentChange: function(e) {
                var $btn = $(e.currentTarget),
                    curValue = $btn.attr('data-value');
                qt.$('input').blur();

                qt.showSidebar({
                    events: {
                        'tap .radio-box li': 'invoiceContent'
                    },
                    type: 'bottom',
                    template: _.template(invoiceContentTpl, {
                        data: roomInfo.invoiceInfo.invoiceContent,
                        curValue: curValue
                    }),
                    offsetY: 0,
                    onTapMask: function() {
                        qt.hideSidebar();
                    },
                    invoiceContent: function(e) {
                        var $me = $(e.currentTarget);

                        if ($me.hasClass('active')) {
                            qt.hideSidebar();
                            return false;
                        }

                        $me.addClass('active').siblings().removeClass('active');
                        $btn.attr('data-value', $me.attr('data-value'));
                        $btn.find('.val').text($me.attr('data-key'));
                        qt.hideSidebar();
                    }
                });
            },

            //添加配送地址
            addInvoiceAddress: function(e) {
                var $me = $(e.currentTarget),
                    options = curData.shippingAddressData;

                shippingAddress.open({
                    data: options,
                    onBack: function(data) {

                        if (!data._self_) {
                            curData.shippingAddressData = $.extend(curData.shippingAddressData, data);

                            var $fee = qt.$('.express-fee'),
                                intrafee = $me.attr('data-intrafee'),
                                otherfee = $me.attr('data-otherfee');
                            // 更新邮费
                            $.each(roomInfo.invoiceInfo.intraCitys, function(item) {
                                if (item == data.city || item == data.district || item == data.province) {
                                    curData.price.expressFee = parseFloat(intrafee);
                                    return false;
                                }
                                curData.price.expressFee = parseFloat(otherfee);
                            });
                            // 邮费变化则更新价格
                            if (curData.price.expressFee != $fee.attr('data-value')) {
                                $fee.html(curData.price.expressFee).attr('data-value', curData.price.expressFee);
                                priceInfoUtil.refreshPrice(curData);
                            }

                            //展示传递过来的地址
                            var tpl = `<p class="val"><span class="address-name"><%= data.name %></span><span class="address-phonenumber">+<%= data.mobile %></span></p>
					    		<p class="address-detail"><span class="address-detail"><%= data.provinceName %><%= data.cityName %><%= data.districtName %><%= data.detail %></span><span class="mail-code"><%= data.zipcode %></span></p>`;
                            var $address = _.template(tpl, {
                                data: data
                            });
                            $('.address_content .address-content').empty().append($address);
                        }
                    }
                })
            },

            // 展示所有省略提示
            showEllipsis: function(e) {
                var $me = $(e.currentTarget);
                $me.find('li.ellipsis').removeClass('ellipsis');
            },

            // 展示所有的提示
            showAllTips: function(e) {
                qt.showPopup({
                    noHeader: true,
                    noFooter: true,
                    message: _.template(tipsPopTpl, {
                        weakTips: roomInfo.weakTips
                    }),
                    onTapMask: function(e) {
                        qt.hidePopup();
                    },
                    onClick: function(e) {
                        qt.hidePopup();
                    }
                });
            },

            // input 聚焦事件
            inputFocus: function() {
                qt.hideSidebar();
                qt.$('.submit-box').removeClass('fixed');
                qt.$('.qt-header').removeClass('fixed');
            },

            // input blur事件
            inputBlur: function() {
                qt.$('.submit-box').addClass('fixed');
                qt.$('qt-header').addClass('fixed');
            },

            priceDetail: function(e) {
                var $me = $(e.currentTarget),
                    detailFees = priceInfoUtil.getDetailFeeData(curData);

                if ($me.hasClass('active')) {
                    $me.removeClass('active');
                    qt.hideSidebar();
                    return false;
                }
                $me.addClass('b').removeClass('t');
                $me.addClass('active');
                //$('.submit-box').addClass('sidebar-zindex');

                qt.$('input').blur();

                qt.showSidebar({
                    events: {},
                    type: 'bottom',
                    template: _.template(priceDetailTpl, {
                        detailFees: detailFees,
                        hasVouch: curData.price.hasVouch, // 是否担保
                        isDeposit: qt.requestData.payType == 3 // 是否定金
                    }),
                    zIndex: 20,
                    offsetY: 50,
                    onTapMask: function() {
                        qt.hideSidebar();
                    },
                    onHide: function () {
                        //$('.submit-box').removeClass('sidebar-zindex');
                        $me.removeClass('b').addClass('t');
                    }
                });
            },

            submit: function(e) {

                var $me = $(e.currentTarget),
                    param = getParam();

                if ($me.hasClass('active')) {
                    return false;
                }

                if (!param) {
                    return false;
                }

                $me.addClass('active');

                if (roomInfo.needCreditCard) {
                    location.href = qt.firstData.VouchBookURL + '?needCreditCard=' + roomInfo.needCreditCard + '&isNew=true&' + qt.util.param2query(param);
                }

                return curData.price.hasVouch && roomInfo.isCPCWARRANT ? location.href = qt.firstData.VouchBookURL + '?isNew=true&' + qt.util.param2query(param) : ajaxSubmit(param);

            },
            noMove: function(e) {
                e.preventDefault();
                return false;
            }
        }
    });

    // 房间数改变 价格改变
    function changeRooms(oldNum, curNum, changeType) {
        var priceInfo = qt.firstData.priceInfos;

        if (curData.price.vouchCount > 0) {
            priceInfoUtil.hasVouch(curData, {
                count: curNum
            });
            priceInfoUtil.vouchDomChange(curData);
            vouchTipsChange();
        }

        if(curData.price.hasCoupons) {
            refreshCouponsPrice( curNum );
            qt.$('.coupons-price').html(curData.price.couponsPrice);
        }

        qt.$('.invoice-money').html(curData.price.info.totalPrice);
        priceInfoUtil.refreshPrice(curData);

        changeType ? roomsChange(oldNum, curNum, changeType) : roomsChangeRandom(oldNum, curNum);
    }

    //房间数逐步改变
    function roomsChange(oldNum, curNum, changeType) {
        var $box = $('.more-guests'),
            $guests = $box.children(),
            len = $guests.length,
            $last = $($guests[len - 1]),
            isEnglish = $('.guests-line').hasClass('gj');

        if (!len && changeType === '+') {
            $box.append(_.template(guestsAddTpl, {
                isGj: isEnglish
            }));

            !isEnglish && $('.guests').attr('placeholder', '房间1 每间只需填写一位');
            return false;
        }

        if (changeType === '+') {
            var $clone = $($last.clone()),
                $input = $clone.find('input');

            $input.val('');

            !isEnglish && $input.attr('placeholder', '房间' + curNum + ' 姓名不能重复填写');

            $box.append($clone);
        } else {
            $last.remove();
            !isEnglish && curNum == 1 && $('.guests').attr('placeholder', '每间只需填写一位');
        }
    }

    // 房间数随机改变,用于 国际需要儿童信息的情况
    function roomsChangeRandom(oldNum, newNum) {
        var $box = $('.more-guests');

        if (newNum == 1) {
            $box.empty();
            return false;
        }

        if (oldNum > newNum) {
            for (var i = oldNum; i > newNum; i--) {
                $box.children().last().remove();
            }
            return false;
        }

        var tempHtml = [],
            tpl = _.template(guestsAddTpl, {
                isGj: true
            });

        for (var j = oldNum; j < newNum; j++) {
            tempHtml.push(tpl);
        }

        $box.append(tempHtml.join(''));
    }

    // 提示信息初始化
    function tipsInit() {
        var $tips = qt.$('.tips');

        // 若为定金模式,则规则中加入定金规则,若为担保模式,则加入担保规则
        if (qt.requestData.payType == 3 && roomInfo.depositDes) {
            roomInfo.weakTips.unshift({
                title: '定金规则',
                desc: roomInfo.depositDes,
                isHide: false
            });

        } else if (roomInfo.vouchRule && roomInfo.vouchRule.length > 0) {
            roomInfo.weakTips.unshift({
                title: '担保规则',
                desc: curData.price.vouchRule,
                name: 'vouch',
                isHide: !curData.price.hasVouch
            });
        }

        $tips.html(_.template(tipsTpl, {
            weakTips: roomInfo.weakTips
        }));

        if ($tips.find('li').length < roomInfo.weakTips.length) {
            qt.$('.more-tips').removeClass('qt-hide');
        }
    }

    // 担保提示更新
    function vouchTipsChange() {
        var $dom = qt.$('.tips .vouch');
        $dom.find('.content').html(curData.price.vouchRule);
        curData.price.hasVouch ? $dom.removeClass('qt-hide') : $dom.addClass('qt-hide');
    }

    // 取消提示更新
    function cancellationTipsChange() {
        qt.$('.tips .cancellation>.content').html(roomInfo.cancellation);
    }

    // 提交param校验及获取
    function getParam() {
        var price = curData.price,
            param = {};

        var $timeLine = qt.$('.time-line'),
            $phoneLine = qt.$('.phone-line').length ? qt.$('.phone-line').find('.phone') : '',
            $guestsLine = qt.$('.guests-line').length ? qt.$('.guests-line').find('p') : [],
            $emailLine = qt.$('.email-line').length ? qt.$('.email-line').find('.email') : '',
            $cardLine = qt.$('.card-line').length ? qt.$('.card-line').find('.card') : '',
            $cityLine = qt.$('.city-line').length ? qt.$('.city-line') : '',
            $addressLine = qt.$('.address-line').length ? qt.$('.address-line') : '',
            $zcodeLine = qt.$('.zcode-line').length ? qt.$('.zcode-line') : '',
            $invoiceTitle = qt.$('.invoice-title:visible').length ? qt.$('.invoice-title').find('input') : '',
            $invoiceAddress = qt.$('.address_content:visible').length ? qt.$('.address_content:visible') : '',
            isInvoice = qt.$('.invoice').hasClass('on') ? 1 : 0,
            invoiceList = {},
            guestsList = {};

        if ($guestsLine.length && roomInfo.inputInfo && roomInfo.inputInfo.needEnglishGuestName) {

            $.each($guestsLine, function(index, item) {
                var $first = $(item).find('.guests-a'),
                    $last = $(item).find('.guests-b'),
                    firstName = $first.val(),
                    lastName = $last.val();

                if (!validate.separateNameValidate(firstName, $first, lastName, $last, index + 1)) {
                    return false;
                }
                guestsList['guest' + (index + 1)] = firstName + '/' + lastName;

                if (index == 0) {
                    guestLocal.gj.firstName = firstName;
                    guestLocal.gj.lastName = lastName;
                    guestLocal.gj.mobile = $phoneLine && $phoneLine.val();
                }
            });

            // 校验出错,则终止
            if ($guestsLine.length != _.keys(guestsList).length) {
                return false;
            }

        } else if ($guestsLine.length) {

            $.each($guestsLine, function(index, item) {
                var $dom = $(item).find('input'),
                    name = $dom.val();

                if (!validate.singleNameValidate(name, $dom, index + 1)) {
                    return false;
                }
                guestsList['guest' + (index + 1)] = name;

                if (index == 0) {
                    guestLocal.gn.name = name;
                    guestLocal.gn.mobile = $phoneLine && $phoneLine.val();
                }
            });

            // 校验出错,则终止
            if ($guestsLine.length != _.keys(guestsList).length) {
                return false;
            }

        }

        if ($phoneLine && !validate.telephoneValidate($phoneLine.val(), $phoneLine)) {
            return false;
        }

        if ($emailLine && !validate.emailValidate($emailLine.val(), $emailLine)) {
            return false;
        }

        if ($cardLine && !validate.idCardValidate($cardLine.val(), $cardLine)) {
            return false;
        }

        if ($cityLine && $cityLine.attr('data-checked') == 'true' && !validate.cityValidate($cityLine.find('.city').val(), $cityLine.find('.city'))) {
            return false;
        }

        if ($addressLine && $addressLine.attr('data-checked') == 'true' && !validate.addressValidate($addressLine.find('.address').val(), $addressLine.find('.address'))) {
            return false;
        }

        if ($zcodeLine && $zcodeLine.attr('data-checked') == 'true' && !validate.zipCodeValidate($zcodeLine.find('.zcode').val(), $zcodeLine.find('.zcode'))) {
            return false;
        }

        if (isInvoice) {

            if ($invoiceTitle && !validate.invoiceTitleValidate($invoiceTitle.val(), $invoiceTitle)) {
                return false;
            }

            switch (roomInfo.invoiceInfo.invoiceGetType) {
                case 1:
                    if ($invoiceAddress && !validate.invoiceAddrValidate($invoiceAddress.find('.val').html())) {
                        return false;
                    }

                    var addrData = curData.shippingAddressData;
                    invoiceList = {
                        invoiceTitle: $invoiceTitle.val(),
                        invoiceContactName: addrData.name,
                        invoiceContactPhone: addrData.mobile,
                        invoicePostCity: addrData.provinceName + '/' + addrData.cityName + '/' + addrData.districtName,
                        invoicePostCityCode: addrData.city,
                        invoicePostStreet: addrData.detail,
                        invoiceZipCode: addrData.zipcode
                    };
                    break;
                case 5:
                    invoiceList = {
                        invoiceTitle: $invoiceTitle.val()
                    };
                    break;
            }
        }

		param = {
			payMoney: price.info.totalPrice,   // totalPrice
			totalPrize: price.info.totalPrize,
			totalVouchMoney: price.info.totalVouchMoney,
			referTotalPrice: price.info.referTotalPrice,
			referCurrencySign: roomInfo.referCurrencySign,
			isVouch: price.hasVouch,
			vouchType: price.vouchType, // price.vouchType
			vouchRule: encodeURIComponent(price.vouchRule),  // price.vouchRule
			extra: encodeURIComponent(roomInfo.extraParam),  // 跟guestInfos同时出现
			cancellation: roomInfo.cancellation,   // 退款说明
			isInvoice: $('.invoice').hasClass('on') ? 1 : 0,
			invoiceGetType: roomInfo.invoiceInfo.invoiceGetType, // 发票领取方式
			roomCount: curData.room.roomCount,
			arriveTime: $timeLine.length ? qt.$('.time-line').attr('data-key') + '|' + qt.$('.time-line').attr('data-value') : '',
			idCard: $cardLine && $cardLine.val(),
			bedTypeKey: '',
			email: $emailLine && $emailLine.val(),
			mobile: $phoneLine && $phoneLine.val(),
			bookCountry: qt.$('.country-line').attr('data-value') || '',
			bookCity: $cityLine && $cityLine.find('.city').val(),
			bookAdd: $addressLine && $addressLine.find('.address').val(),
			bookZipCode: $zcodeLine && $zcodeLine.find('.zcode').val(),
            userFriendCoupons: price.hasCoupons && price.couponsActive
		};
        localStorage.setItem('GUESTS_INFO', JSON.stringify(guestLocal));

        return $.extend(submitParam, param, guestsList, invoiceList);
    }


    function ajaxSubmit(param) {
        qt.showMask();
        qt.showLoader(qt.$('.order-loading'));
        $.ajax({
            url: '/api/hotel/hotelbook',
            type: "post",
            data: param,
            dataType: 'json',
            success: function(res) {
                if (res.ret) {
                    monitor('success');
                } else {
                    monitor('fail');
                }

                qt.hideMask(1);
                qt.hideLoader();
                $('.submit-btn').removeClass('active');

                // 保存离线单
                if (res.ret && res.data.mobile && res.data.orderno) {
                    var orderLocal = {
                        'orderno': res.data.orderno,
                        'hotelname': res.data.hotelname,
                        'price': res.data.price,
                        'currency': res.data.currency,
                        'roomname': res.data.roomname,
                        'mobile': res.data.mobile,
                        'wrapperid': res.data.wrapperid,
                        'sn': res.data.sn,
                        't': parseInt(res.data.t, 10) || +new Date()
                    };

                    qt.requestData.type == 2 ?
                        localStorage.setItem('zorder_' + res.data.orderno, JSON.stringify(orderLocal)) :
                        localStorage.setItem('horder_' + res.data.orderno, JSON.stringify(orderLocal));
                }

                if (res.ret && res.data && res.data.isClientCashier) {

                    gongLuePay(res.data);

                } else {
                    // 若信息不为空,则弹框,否则直接跳转
                    if (res.msg && res.msg != '') {
                        qt.showMask();
                        qt.alert({
                            noHeader: true,
                            message: res.msg,
                            onOk: function() {
                                // 若错误且在攻略,则关闭填单页,否则跳转
                                !res.ret && isGongLue ?
                                    res.data && res.data.pageto ?
                                        qt.qunarApi.ready(function () {
                                            QunarAPI.hy.closeWebView();
                                        }) : '' :
                                    res.data && res.data.pageto ?
                                    window.location.href = res.data.pageto : '';
                            }
                        })
                    } else {
                        // 若错误且在攻略,则关闭填单页,否则跳转
                        !res.ret && isGongLue ?
                            res.data && res.data.pageto && res.data.pageto.indexOf('hotelorderinfo') != -1 ?
                                window.location.href = res.data.pageto :
                                qt.qunarApi.ready(function () {
                                    QunarAPI.hy.closeWebView();
                                }) :
                            res.data && res.data.pageto ? window.location.href = res.data.pageto : '';
                    }

                }
            },
            error: function(xhr) {
                monitor('error');
                $('.submit-btn').removeClass('active');
            }
        });
    }

    // 调起攻略支付弹层
    function gongLuePay(param) {
        qt.qunarApi.ready(function () {
            QunarAPI.register('openQpay', 'gonglue.qpay', 'gonglue');
            QunarAPI.gonglue.openQpay({
                success: function(data) {

                    // status状态:
                    switch (data.status) {
                        case 1:
                            param.orderResultUrl ? window.location.href = param.orderResultUrl : '';
                            break;
                        case 3:
                        case 4:
                            qt.alert({
                                title: '尚未完成支付！',
                                message: '请前往订单详情继续支付，或取消订单后重新预订。',
                                okText: '查看订单',
                                onOk: function() {
                                    location.href = 'http://touch.travel.qunar.com/client/order#order.list';
                                }
                            });
                            break;
                        case 7:
                            qt.alert({
                                noHeader: true,
                                message: '抱歉，订单价格已发生变化，需要您在订单详情取消订单后重新预订。',
                                onOk: function() {
                                    location.href = 'http://touch.travel.qunar.com/client/order#order.list';
                                }
                            });
                            break;
                    }
                },
                fail: function(data) {},

                payToken: param.payToken,
                fkey: param.Fkey,
                cashierUrl: param.cashierUrl
            });
        });
    }

    // 获取当前订单是否支持友谊券,并存储数据
    function couponsStatusInit() {
        var friendInfo = qt.firstData.friendInfo;

        if(_.isEmpty(friendInfo)) {
            return ;
        }

        curData.couponsData = {
            categoryId: friendInfo.categoryId,
            useTitle: friendInfo.useTitle,
            functionType: friendInfo.functionType,
            promotionType: friendInfo.promotionType,
            promotionCode: friendInfo.promotionCode,
            couponId: friendInfo.couponId,
            promotionName: friendInfo.promotionName,
            priceInfo: {}
        };

        refreshCouponsPrice();
    }

    function refreshCouponsPrice(roomCount) {
        var roomCount = roomCount || curData.room.roomCount;

        curData.couponsData.priceInfo = _.find(qt.firstData.friendInfo.roomNights, function (item) {
            return roomCount == item.roomNum
        });

        curData.price.couponsPrice = curData.couponsData.priceInfo.amount.amount;
    }

    // 数据统计
    function monitor(name) {
        var monitorName = 'hotelorderinfo';
        switch (qt.requestData.payType) {
            case 0:
                monitorName = monitorName.concat('_yufu');

                switch (qt.requestData.type) {
                    case '0':
                        qt.monitor(monitorName.concat('_normal_' + name));
                        break;
                    case '1':
                        qt.monitor(monitorName.concat('_lm_' + name));
                        break;
                    case '2':
                        qt.monitor(monitorName.concat('_hour_' + name));
                        break;
                }
                break;

            case 1:
                monitorName = monitorName.concat('_xianfu');

                if (name != 'page') {
                    if (curData.price.hasVouch) {
                        monitorName = monitorName.concat('_vouch');
                    } else {
                        monitorName = monitorName.concat('_novouch');
                    }
                }

                switch (qt.requestData.type) {
                    case '0':
                        qt.monitor(monitorName.concat('_normal_' + name));
                        break;
                    case '1':
                        qt.monitor(monitorName.concat('_lm_' + name));
                        break;
                    case '2':
                        qt.monitor(monitorName.concat('_hour_' + name));
                        break;
                }
                break;
        }

    }

})();