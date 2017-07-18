/**
 * Created by taoqili on 15/9/25.
 */
import calendar from '../../../common/sub-pages/calendar/index';
import keywordPage from '../../../common/sub-pages/keywordSelect/index';
import cityPage from '../../../common/sub-pages/citySelect/index';
import calendarHandle from './../../../common/sub-pages/calendar/canlendar-handle';
import starPriceBar from './starPriceBar';
import timeSelectTpl from '../tpl/time-select.tpl';

module.exports = (() => {

    var util = qt.util,
        currentNavTab,
        discoverHotelShow = false;
    //普通青年,基本完全自理
    return qt.definePage({
        config: {
            init: function() {
                function viewFresh() {
                    // 附近酒店操作
                    renderLocalLocation();
                    renderLocalCity('normal-room');
                    renderLocalCity('hour-room');
                }

                $(window).on('pageshow', viewFresh);
            },
            ready: function() {

                // 若hash中roomType=2,则进入钟点房页面
                var hashInfo = util.getHashInfo(util.getHash()),
                    $roomTabs = $('.qt-control-line-group li');
                if (hashInfo.param.roomType === '1') {
                    $roomTabs.filter('[data-for="hour-room"]').trigger('tap');
                }

                currentNavTab = $roomTabs.filter('.active').data('for');

                // header中tab 下划线进入效果
                tabLineEffect();

                starPriceBar.setText(qt.$('.js-select-normal .star-price'), 'normal');
                starPriceBar.setText(qt.$('.js-select-hour .star-price'), 'hour');

                // 日历初始化
                initCalendar();

                window.addEventListener("orientationchange", function() {
                    tabLineEffect();
                }, false);

                //浮层红包
                RedLayer && RedLayer.buildFloatingLayer('huodong1', qt.commonParam.cookieBdSource);
                //弹出红包
                RedLayer && RedLayer.buildPopupLayer('huodong1', qt.commonParam.cookieBdSource);

                // 友谊券分享
                if(qt.requestData.bd_source == 'weixin_touch') {
                    qt.qunarApi.ready(function () {
                        QunarAPI.onMenuShare({
                            title: '去哪儿旅行-友谊券订酒店立减20元！', // 标题
                            link: location.href , // 链接URL
                            desc: '这是一个来自朋友的问候：点击链接预订，立享友谊价哦~', // 描述
                            imgUrl: 'http://simg1.qunarzz.com/site/images/zhuanti/huodong/coupons.png', // 分享图标
                            success: function () {
                            },// 用户确认分享后执行的回调函数
                            cancel: function () {
                            } // 用户取消分享后执行的回调函数
                        });
                    })
                }
            },
            backMonitor: function() {
                location.href = '/';
            }
        },
        events: function() {
            return $.extend({
                'tap .qt-control-line-group li': 'controlTabSwitch',
                'tap .my-location': 'myLocation',
                'tap .time-select': 'toCalendar',
                'tap .key-word-line .key-word': 'toKeywordSelect',
                'tap .key-word-line .empty-keyword': 'emptyKeyword',
                'tap .city-selected': 'toCitySelect',

                'tap .nearby-hotel': 'getNearbyList',
                'tap .submit': 'redirectList',

                'tap .recent': 'toRecent',
                'tap .order-list': 'toOrderList'
            }, starPriceBar.events);
        }(),
        templates: {},
        handles: function() {
            return $.extend({
                // 获取我的位置
                myLocation: function(e) {
                    var $citySelector = qt.$('#' + currentNavTab + ' .city-selected'),
                        $keywords = qt.$('#' + currentNavTab + ' .key-word');

                    $citySelector.html('努力定位中<i class="icon spinner qt-light-grey"></i>');

                    util.location(function(data) {

                        if (data && data.address) {
                            data.address.length > 5 ? $citySelector.css('fontSize', '18px') : $citySelector.css('fontSize', '24px');
                            $citySelector.html(data.address)
                                .attr('data-address', data.address)
                                .attr('data-city', data.city)
                                .attr('data-location', data.qPoint);
                            $keywords.changeHtml('搜索酒店名、地名、地标')
                                .attr('data-dname', '')
                                .attr('data-qname', '')
                                .addClass('qt-light-grey')

                            .siblings('.empty-keyword')
                                .addClass('qt-hide');

                            refreshLocalCityKeyword(currentNavTab, {
                                city: data.city,
                                address: data.address,
                                location: data.qPoint,
                                qname: '',
                                dname: ''
                            });
                        } else {
                            qt.alert('定位失败，请刷新后重试！');
                            $citySelector.changeHtml($citySelector.data('address') || $citySelector.data('city') || '选择城市')
                        }

                    }, function(cityName) {

                        if (cityName) {
                            $citySelector.html(cityName).attr('data-city', cityName).attr('data-address', '');
                            $keywords.changeHtml('搜索酒店名、地名、地标')
                                .attr('data-dname', '')
                                .attr('data-qname', '')
                                .addClass('qt-light-grey')

                            .siblings('.empty-keyword')
                                .addClass('qt-hide');

                            refreshLocalCityKeyword(currentNavTab, {
                                city: cityName,
                                address: '',
                                qname: '',
                                dname: ''
                            });
                        } else {
                            qt.alert('定位失败，请刷新后重试！')
                        }

                    }, 5000);

                },

                // 日历选择
                toCalendar: function(e) {
                    var currentDom = $(e.currentTarget),
                        currentHour = new Date().getHours(),
                        data = {
                            currentDate: qt.commonParam.currentDateStr || '',
                            selecteds: getCurrentSelectDate(currentDom),
                            isRange: currentDom.data('timeselect') == 2, // false 为单天,true 为两天
                            title: '选择入住离店日期'
                        };

                    //若当前时间小于早上六点,则询问是否为凌晨入住
                    if (currentHour < 6) {
                        qt.confirm({
                            noHeader: true,
                            contentCenter: true,
                            message: '凌晨入住？',
                            onOk: function() {
                                var currentDate = util.dateToStr(new Date()),
                                    preDate = util.preDayStr(currentDate);

                                calendarOpen($.extend(data, {
                                    startDate: preDate,
                                    selecteds: [preDate, currentDate]
                                }), currentDom);
                            },
                            onCancel: function() {
                                calendarOpen(data, currentDom);
                            }
                        })
                    } else {
                        calendarOpen(data, currentDom);
                    }
                },

                // 关键字选择
                toKeywordSelect: function(e) {
                    var $keywords = qt.$('#' + currentNavTab + ' .key-word');
                    keywordPage.open({
                        data: {
                            isNormal: currentNavTab == 'normal-room',
                            dname: _.unescape($keywords.data('dname')),
                            qname: $keywords.data('qname'),
                            city: qt.$('#' + currentNavTab + ' .city-selected').data('city')
                        },
                        onBack: function(data) {
                            if (!data || data._self_) {
                                return false;
                            }
                            if (data.dname) {
                                $keywords.changeHtml(data.dname)
                                    .attr('data-dname', data.dname)
                                    .attr('data-qname', data.qname)
                                    .removeClass('qt-light-grey');

                                $keywords.siblings('.empty-keyword').removeClass('qt-hide');
                            } else {
                                $keywords.changeHtml('搜索酒店名、地名、地标')
                                    .attr('data-dname', '')
                                    .attr('data-qname', '')
                                    .addClass('qt-light-grey')

                                .siblings('.empty-keyword')
                                    .addClass('qt-hide');

                                //refreshLocalCityKeyword(currentNavTab, {city: cityName, address: '', qname: '', dname: ''});
                            }

                        }
                    });
                },
                emptyKeyword: function(e) {
                    var $me = $(e.currentTarget),
                        $keywords = $me.siblings('.key-word');

                    $me.addClass('qt-hide');
                    $keywords.changeHtml('搜索酒店名、地名、地标')
                        .attr('data-dname', '')
                        .attr('data-qname', '')
                        .addClass('qt-light-grey');

                    refreshLocalCityKeyword(currentNavTab, {
                        dname: '',
                        qname: ''
                    });
                },

                // 城市选择
                toCitySelect: function(e) {
                    var $target = $(e.currentTarget),
                        city = $target.attr('data-city') || '北京',
                        openData = {
                            data: {
                                type: currentNavTab,
                                city: city
                            },
                            onBack: function(data) {
                                if (!data || data._self_ || data == city) {
                                    return false;
                                }
                                setCitySelected(currentNavTab, data);
                            }
                        };

                    cityPage.open(openData);

                    // 埋点
                    currentNavTab === 'normal-room' ? qt.monitor('fullhotel_cityquery') : qt.monitor('jdhourroom_cityquery');

                },

                //nav tab switch
                controlTabSwitch: function(e) {
                    var $target = $(e.currentTarget);

                    if ($target.hasClass('active')) {
                        return;
                    }

                    $target.addClass('active').siblings().removeClass('active');
                    currentNavTab = $target.data('for');
                    qt.$('#' + currentNavTab).removeClass('qt-hide')
                        .siblings(':not(.submit-box)').addClass('qt-hide');

                    //下划线进入效果
                    tabLineEffect();

                    // 钟点房不显示 发现酒店  && 埋点 && 钟点房标示
                    if (currentNavTab == 'normal-room') {
                        history.replaceState('', '', '#');
                        discoverHotelShow && qt.$('.discover-hotel').removeClass('qt-hide');
                        qt.monitor('fullhotel');
                    } else {
                        history.replaceState('', '', '#roomType=1');
                        qt.$('.discover-hotel').addClass('qt-hide');
                        qt.monitor('jdhourroom');
                    }
                },

                // 我附近的酒店 获取位置
                getNearbyList: function(e) {
                    var $icon = $(e.currentTarget).find('.icon');

                    if ($icon.hasClass('spinner')) {
                        return false;
                    }

                    $icon.removeClass('q-near-hotel').addClass('spinner');

                    currentNavTab === 'normal-room' ? qt.monitor('fullhotel_nearbyhotel') : qt.monitor('jdhourroom_nearbyhotel');
                    var histortyLocation = util.localStorage.getItem('TOUCH_LOCATION');

                    if (histortyLocation) {

                        // 我附近的酒店,钟点房、全日房跳转统计
                        if (currentNavTab === 'normal-room') {
                            qt.monitor('fullhotel_getLocationSuccess');
                        } else {
                            qt.monitor('jdhourroom_getLocationSuccess');
                        }
                        $icon.addClass('q-near-hotel').removeClass('spinner');
                        skipToHotelList(histortyLocation);

                    } else {
                        util.location(function(data) {
                            var location = data.qPoint;
                            util.localStorage.setItem('TOUCH_LOCATION', location);

                            // 我附近的酒店,钟点房、全日房跳转统计
                            if (currentNavTab === 'normal-room') {
                                qt.monitor('fullhotel_getLocationSuccess');
                            } else {
                                qt.monitor('jdhourroom_getLocationSuccess');
                            }
                            $icon.addClass('q-near-hotel').removeClass('spinner');

                            skipToHotelList(location);

                        }, function(cityName) {

                            $icon.addClass('q-near-hotel').removeClass('spinner');

                            qt.alert({
                                title: '定位失败！',
                                message: '<div class="qt-font14 qt-lh">您可以在设置中开启定位服务和WIFI，以提高定位成功率。或在搜索框中输入您想找的地名或酒店名</div>',
                                okText: '知道了',
                                onOk: function() {
                                    skipToHotelList('', cityName);
                                }
                            });
                        });
                    }
                },

                // 条件搜索提交
                redirectList: function(e) {
                    skipToHotelList();
                },

                // 最近浏览
                toRecent: function() {
                    location.href = '/hotel/view?name=hotel/recent';
                },

                // 我的订单
                toOrderList: function() {
                    if(currentNavTab == 'normal-room') {
                        location.href = '/hotel/hotelorderlist';
                    }else {
                        location.href = '/hotel/hotelorderlist?type=2';
                    }
                }
            }, starPriceBar.handles);
        }()
    });

    //从dom中获取当前页面默认的入住,离店时间
    function getCurrentSelectDate(currentDom) {
        var selectDate = [];
        _.forEach(currentDom.find('li'), function(item) {
            selectDate.push(qt.$(item).data('date'));
        });
        return selectDate;
    }

    //打开日历页面
    function calendarOpen(opts, currentDom) {
        calendar.open({
            data: opts,
            onOpen: function() {},
            onBack: function(data) {
                if (!data || data['_self_']) {
                    return false;
                }

                data.isRange = opts.isRange;

                currentDom.html(util.template(timeSelectTpl, data));

                calendarHandle.changePartStore(data.isRange ? 'range' : 'single', data);
            }
        });

    }

    /** 页面初始化方法 start */
    // 日历初始化
    function initCalendar() {
        var calendarDate = calendarHandle.getShowDate(),
            boxDom = qt.$('.time-select');

        // 若 全日房或钟点房 时间须换成localStorage中时间, 则重新渲染( 默认渲染的是后端返回的今日,明日时间 )
        calendarDate.rangeTimeChange &&
            qt.$('.time-select[data-timeselect="2"]').html(util.template(timeSelectTpl, calendarDate.storeDate.range));
        calendarDate.singleTimeChange &&
            qt.$('.time-select[data-timeselect="1"]').html(util.template(timeSelectTpl, calendarDate.storeDate.single));
    }

    //加载本地存储城市和关键字
    function renderLocalCity(roomType) {
        var $citySelected = qt.$('.city-selected[data-for="' + roomType.split('-')[0] + '"]'),
            oldCityData = JSON.parse(util.localStorage.getItem('TOUCH_CHECKED') || '{}'),
            data = oldCityData[roomType] || {},
            requestCity = qt.requestData.city;
        data.city = requestCity ? requestCity : data.city ? data.city : '北京';

        data.address && data.address.length > 5 || data.city.length > 5 ? $citySelected.css('fontSize', '18px') : $citySelected.css('fontSize', '24px');

        $citySelected.changeHtml(data.address || data.city)
            .removeClass('qt-light-grey')
            .attr('data-city', data.city)
            .attr('data-address', data.address || '')
            .attr('data-location', data.location || '');

        data.dname && qt.$('.key-word[data-for="' + roomType.split('-')[0] + '"]').changeHtml(data.dname)
            .attr('data-dname', data.dname)
            .attr('data-qname', data.qname)
            .removeClass('qt-light-grey')

        .siblings('.empty-keyword')
            .removeClass('qt-hide');

        roomType == 'normal-room' && initDiscoverHotel(data.city);
    }

    //加载本地位置信息
    function renderLocalLocation() {
        var location = util.localStorage.getItem('TOUCH_LOCATION'),
            $nearbyhotelspan = qt.$('.nearby-hotel');
        if (location && qt.requestData.localSearch === 1) {
            $('.re-location').removeClass('qt-hide');
            $nearbyhotelspan.attr('data-location', location);
        } else {
            $nearbyhotelspan.attr('data-location', '');
        }
    }

    // 发现酒店初始化
    function initDiscoverHotel(city) {

        var discoverDom = qt.$('.discover-hotel');
        currentNavTab === 'normal-room' ? discoverDom.removeClass('qt-hide') : currentNavTab === 'normal-room' && discoverDom.removeClass('qt-hide');

        // 初始化页面没参数, 则从localStorage中取城市,若 为空 则 默认 北京
        !city && (city = '北京');

        $.ajax({
            url: '/api/hotel/findhotelcity',
            dataType: "json",
            data: {
                cityName: city
            },
            success: function(res) {

                if (res.ret && res.data.isShow) {
                    discoverDom.find('a').attr('href', qt.commonParam.host.touch + '/h5/hotel/HotelChoice?cityUrl=' + res.data.cityUrl + '&cityName=' + res.data.cityName);
                    currentNavTab === 'normal-room' && discoverDom.removeClass('qt-hide');
                    discoverHotelShow = true;
                } else {
                    res.data.cityName != '北京' ? initDiscoverHotel('北京') : discoverDom.addClass('qt-hide');
                }
            }
        });
    }
    /** 页面初始化方法 end */

    //设置城市关键字
    function setCitySelected(roomType, city) {
        var $citySelected = qt.$('#' + roomType + ' .city-selected'),
            $keywords = qt.$('#' + roomType + ' .key-word');

        city.length > 5 ? $citySelected.css('fontSize', '18px') : $citySelected.css('fontSize', '24px');
        $citySelected.changeHtml(city).attr('data-city', city).attr('data-address', '');

        $keywords.data('dname') && $keywords.changeHtml('搜索酒店名、地名、地标')
            .attr('data-dname', '')
            .attr('data-qname', '')
            .addClass('qt-light-grey');

        $keywords.siblings('.empty-keyword')
            .addClass('qt-hide');

        // 全日房 城市 发生变化时,须同步改变发现酒店中 城市
        roomType === 'normal-room' && initDiscoverHotel(city);
    }

    // 更新城市关键字本地缓存
    function refreshLocalCityKeyword(roomType, newObj) {
        var oldData = JSON.parse(util.localStorage.getItem('TOUCH_CHECKED') || '{}'),
            data = $.extend(oldData[roomType] ? oldData[roomType] : oldData[roomType] = {}, newObj);

        util.localStorage.setItem('TOUCH_CHECKED', JSON.stringify(oldData));
    }

    //跳转到酒店列表
    function skipToHotelList(location, cityData) {
        qt.monitor('hotel_index_submit');
        var type = currentNavTab;

        var $city = qt.$('#' + type + ' .city-selected'),
            city = '',
            keywords = $('#' + type + ' .key-word').attr('data-qname');

        $city.attr('data-address') ? location = $city.attr('data-location') : city = $city.attr('data-city');

        var date = getCurrentSelectDate(qt.$('#' + type + ' .time-select')) || [];

        var starPrice = starPriceBar.getData()[type.replace('-room', '')];

        starPrice.price = starPrice.price || [];

        var params = {
            //城市
            city: city || '北京',

            //日历
            checkInDate: date[0] || '',
            checkOutDate: date[1] || '',

            //关键字
            keywords: keywords,

            extra: {
                //星级
                L: (starPrice.star || []).map((item) => {
                    return item.val;
                }).join(','),

                //小时
                DU: (starPrice.hour || []).map((item) => {
                    return item.val;
                }).join(','),

                MIN: starPrice.price[0] > 0 ? starPrice.price[0] : 0,
                MAX: starPrice.price[1] > 0 ? starPrice.price[1] : 0
            }
        };
        params.extra = encodeURIComponent(JSON.stringify(params.extra));

        type === 'hour-room' ? params.type = 2 : '';
        location ? (delete params.city, delete params.keywords, params.location = location) : '';
        cityData && (params.city = cityData, delete params.keywords);
        // 若为钟点房,跳转页面前用hash做标记,以便返回时能定位到钟点房
        type === 'hour-room' && history.replaceState('', '', '#roomType=1');
        //window.location.href = qt.commonParam.host.touch + '/h5/hotel/hotellist?' + util.param2query(params);
        window.location.href = '/hotel/hotellist?' + util.param2query(params);
    }

    //header中tab 下划线进入效果
    function tabLineEffect() {
        var $activeTab = qt.$('.qt-control-line-group .active'),
            transItems = {
                width: '30%'
            };
        transItems[$.fx.cssPrefix + 'transform'] = 'translate3d(' + ($activeTab.length ? $activeTab[0].offsetLeft : 0) + 'px, 0, 0)';
        qt.$('.line').css(transItems);
    }
})();
