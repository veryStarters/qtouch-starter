/**
 * zhan.chen
 * 2015.11
 */

import ruleLayerTpl from '../tpl/ruleLayer.tpl';
import roomListTpl from '../tpl/room-list.tpl';
import proRoomListTpl from '../tpl/pro-room-list.tpl';
import otherHotelListTpl from '../tpl/other-hotel-list.tpl';
import subpageImagelist from '../../../common/sub-pages/imagelist/';
import subpageImageview from '../../../common/sub-pages/imageview/';
import Circle from '../../../../common/component/cricle/index.js';
import comment from './comment/index.js';
import map from '../../../common/sub-pages/map/';
import facilities from './facilities/index.js';
import calendar from '../../../common/sub-pages/calendar/index';
import calendarHandle from '../../../common/sub-pages/calendar/canlendar-handle';
import decodemix from './decodemix.js'

import timeSelectTpl from '../tpl/time-select.tpl';

module.exports = (()=> {
    const util = qt.util;
    var first = true;

    //新增 试睡
    var sleepTask = '', productId = '';   //试睡标记

    return qt.definePage({
        config: {
            init: function (requestData) {
                $(window).on('pageshow', function(){
                    qt.hidePopup();
                });
            },
            ready: function (requestData) {

                requestData.sleepTask ? sleepTask = requestData.sleepTask : '';
                requestData.productId ? productId = requestData.productId : '';

                //圆形进度条
                var circle = new Circle('.circle', {
                    num: qt.$('.circle').attr('data-score'),
                    total_num: 5,
                    time: 1000,
                    skip: 0.1
                });
                circle.circleStart();
                initCalendar();
                renderPrice(requestData.checkInDate, requestData.checkOutDate);

                //浮层红包
                RedLayer && RedLayer.buildFloatingLayer('huodong1',qt.commonParam.cookieBdSource);
            },
            backMonitor: function (requestData) {
                //显式返回来源页面的，优先返回
                if (requestData.back === 'history') {
                    history.go(-1);
                    return;
                }

                var ref = document.referrer;
                //所有非显式指明要返回原页面的跨协议、无referrer的，或者referrer非qunar.com域的，全部返回到list页
                if (
                    !ref
                    || ref.indexOf('qunar.com') === -1
                ) {
                    qt.href().controller('/hotel/hotellist')
                        .param({
                            seq: '',
                            history: '',
                            city: requestData.city || '北京'
                        }).exec();
                    return;
                }
                //默认返回源页面
                history.go(-1);
            }
        },
        events: {
            'tap .hotelimage,.hotel-info-mask': 'openImageList',
            'tap .room-list > li > .room-content-head': 'showRoomContent',
            'tap .show-all-room': 'showAllRoom',
            'tap li[data-for="map"]': 'showMap',
            'tap .comment': 'openCommen',
            'tap .facilities': 'openFacilities',
            'tap .room-name-wrap': 'showRuleLayer',
            'tap .time-select': 'timeChange',
            'tap .room-imgs > div': 'viewRoomImage',
            'tap .room-price-wrap,.order-icon': 'skipToHotelOrder',
            'tap .to-client': 'skipToClient',
            'tap .other-hotel-list > li': 'skipToHotelList',
            'tap .detail-home': 'goHome'
        },
        templates: {},
        handles: {
            goHome: function () {
                location.href = '/';
            },
            openImageList: function (e) {
                let imgcount = qt.$('.imgcount').html().replace('张', '') * 1;
                if (imgcount === 0) {
                    return;
                }
                let data = {
                  seq: qt.requestData.seq
                };
                let panoid = qt.firstData.info.panoid;
                ///////////////////全景模拟数据/////////////////////
                //console.log(panoid);
                //panoid = '0300220000130910053359018IN';
                //panoid = '0901170000140905210020320IN';
                ///////////////////////////////////////////////////
                if (panoid) {
                  data.panoid = panoid;
                }
                subpageImagelist.open({
                    data: data,
                    onOpen: function () {
                    },
                    onBack: function (data) {
                    }
                });
                qt.monitor('hoteldetail_image');
            },
            showRoomContent: function (e) {
                doShowRoomContent(e.currentTarget);
            },
            showAllRoom: function (e) {
                var $me = $(e.currentTarget),
                    $showAllRoom = $me.parent().find('li');
                $showAllRoom.removeClass('qt-hide');
                $me.addClass("qt-hide");
            },
            openCommen: function (e) {
                var noComment = $(e.currentTarget).attr('data-nocomment');
                var opendata = {
                    data: {
                        hotelName: qt.$('.hotel-name').html()
                    },
                    onBack: function (data) {

                    }
                };
                !noComment && comment.open(opendata);
                qt.monitor('hoteldetail_comment');
            },
            showMap: function (e) {
                let req = qt.requestData;

                map.open({
                    data: {
                        title: $('.hotel-name').text(),
                        point: function () {
                            let p = $('.hotel-name').attr('data-gpoint').split(',');
                            //return qt.util.g2BPoint(p[0], p[1]);
                            return {lat: p[0], lng: p[1]};
                        }(),
                        seq: req.seq,
                        isGJ: qt.firstData.isGJ,
                        checkInDate: req.checkInDate,
                        checkOutDate: req.checkOutDate,
                        address: $('.hotel-address').text()
                    }
                });
                qt.monitor('hoteldetail_map');
            },
            openFacilities: function (e) {
                var opendata = {
                    data: {
                        hotelName: qt.$('.hotel-name').html()
                    },
                    onBack: function (data) {

                    }
                };
                facilities.open(opendata);
                qt.monitor('hoteldetail_service');

            },
            showRuleLayer: function (e) {
                var $me = $(e.currentTarget),
                    $parent = $me.parent(),
                    data = {
                        room: $parent.attr('data-room') || '',
                        showRoomName: $parent.attr('data-showRoomName') || '',
                        wrapperName: $parent.attr('data-wrapperName') || '',
                        speed: $parent.attr('data-speed') || '',
                        reliable: $parent.attr('data-reliable') || '',
                        otaInfoDesc: JSON.parse($parent.attr('data-otaInfoDesc') || '{}'),
                        otainfoTagList: JSON.parse($parent.attr('data-otainfoTagList') || '[]'),
                        rtDescInfo: JSON.parse($parent.attr('data-rtDescInfo') || '[]'),
                        bookingRate: $parent.attr('data-bookingRate') || '',
                        confirmTime: $parent.attr('data-confirmTime') || '',
                        price: $parent.attr('data-otaPrice') || '',
                        currency: $parent.find('.currency').html() || '',
                        ptDesc: $parent.find('.pt-desc').html() || '',
                        orderInfoUrl: $parent.attr('data-orderInfoUrl') || '',
                        tag: $parent.attr('data-tag') || '',
                        orderInfoPayStr: $parent.attr('data-orderInfoPayStr') || '',
                        tagList: JSON.parse($parent.attr('data-tagList') || '[]'),
                        basicInfoList: JSON.parse($parent.attr('data-basicInfoList') || '[]'),
                        license: JSON.parse($parent.attr('data-license') || '{}'),
                    };

                qt.showPopup({
                    message: qt.util.template(ruleLayerTpl, {data: data}),
                    noHeader: true,
                    noFooter: true,

                    events: {
                        'tap .ruleLayer-booking-button': 'toHotelOrder',
                        'tap .view-license': 'viewLicense'
                    },
                    onClick: function (e) {
                        var $cur = $(e.target);
                        if(!$cur.hasClass('view-license')) {
                            qt.hidePopup();    
                        }
                    },
                    onTapMask: function () {
                        qt.hidePopup();
                    },
                    toHotelOrder: function (e) {
                        var $me = $(e.currentTarget),
                            orderinfourl = $me.attr('data-orderinfourl'),
                            tag = $me.attr('data-tag');
                        toHotelOrderInfo(orderinfourl, tag);

                    },
                    viewLicense: function(e) {
                        var $cur = $(e.currentTarget),
                            imgs = $cur.data('imgs');
                            
                        if(!imgs.length > 0) {
                            return;
                        }
                        
                        subpageImageview.open({
                            forceRefresh: true,
                            data: {
                                imglist: [{
                                    imgNodes: imgs
                                }],
                                title: ' ',
                                tplImage: '<img src="<%- url %>" title="<%- title %>" />',
                                tplInfo: imgs.length > 1 ? undefined : '<p><span><%- title %></span></p>'
                            },
                            onOpen: function () {
                                $('body').addClass('qt-overflow');
                            },
                            onBack: function (data) {
                                $('body').removeClass('qt-overflow');
                            }
                        });
                    }
                })
            },
            timeChange: function (e) {
                var currentDom = $(e.currentTarget),
                    currentHour = new Date().getHours(),
                    selectedDate = getCurrentSelectDate(currentDom),
                    data = {
                        currentDate: qt.commonParam.currentDateStr || '',
                        selecteds: selectedDate,
                        isRange: qt.requestData.type == '2' || sleepTask ? false : true,   // false 为单天,true 为两天 //新增试睡，判断是否isRange 修改
                        title: '选择入住离店日期'
                    };

                //若当前时间小于早上六点,则询问是否为凌晨入住
                if (currentHour < 6) {
                    qt.confirm({
                        noHeader: true,
                        contentCenter: true,
                        message: '凌晨入住？',
                        onOk: function () {
                            var currentDate = util.dateToStr(new Date()),
                                preDate = util.preDayStr(currentDate);

                            calendarOpen($.extend(data, {
                                startDate: preDate,
                                selecteds: [preDate, currentDate]
                            }), currentDom);
                        },
                        onCancel: function () {
                            calendarOpen(data, currentDom);
                        }
                    })
                } else {
                    calendarOpen(data, currentDom);
                }
                qt.monitor('hoteldetail_change_calendar');

            },
            viewRoomImage: function (event) {
                // console.log('viewRoomImage');
                let index = $(event.currentTarget).index();
                if (!$(event.currentTarget).html()) {
                    return;
                }
                let list = $(event.target).closest('.room-imgs').data('imgs');
                // console.log(index, list);
                subpageImageview.open({
                    forceRefresh: true,
                    data: {
                        imglist: [{
                            imgNodes: list
                        }],
                        title: list[0].tag,
                        index: index,
                        tplImage: '<img src="<%- url %>" title="<%- title %>" />'
                    },
                    onOpen: function () {
                        $('body').addClass('qt-overflow');
                    },
                    onBack: function (data) {
                        $('body').removeClass('qt-overflow');
                    }
                });
            },
            skipToHotelOrder: function (e) {
                var $me = $(e.currentTarget),
                    $parent = $me.parent(),
                    orderinfourl = $parent.attr('data-orderinfourl'),
                    tag = $parent.attr('data-tag');
                toHotelOrderInfo(orderinfourl, tag);
            },
            skipToClient: function(e) {
            	qt.monitor('5discount_app_book');
            	qt.confirm({
                    message: 'Touch.qunar.com暂不支持此报价预订，如需预订请使用最新版去哪儿客户端',
                    okText: '使用客户端',
                    cancelText: '下载客户端',
                    onTapMask:function(){
                        qt.hidePopup();
                    },
                    onOk: function () {
                    	qt.monitor('5discount_app_open');
                        util.log('使用去哪儿客户端');
                        var requestData = qt.requestData;
                        var schema = 'hotel/detail?cityUrl='+requestData.cityUrl+'&fromDate='+requestData.checkInDate+'&toDate='+requestData.checkOutDate+'&ids='+requestData.seq+'&needRoomVendor=0&fromForLog=222';
                        window.location.href = "http://touch.qunar.com/h5/client?bd_source=" + qt.commonParam.cookieBdSource + '&sScheme=0&scheme=' + encodeURIComponent(schema) + '&touchUrl=' + encodeURIComponent('hotel/hoteldetail'+location.search);
                    },
                    onCancel: function () {
                    	qt.monitor('5discount_app_download');
                        util.log('下载去哪儿客户端');
                        window.location.href = "http://touch.qunar.com/h5/download?down_bdsource=5zhe_appdown&immediate=1";
                    }
                })
            },
            skipToHotelList: function (e) {
                var requestData = qt.requestData,
                    $timeSelect = qt.$('.time-select'),
                    category = $(e.currentTarget).attr('data-categorycode');
                var param = {
                    seq: requestData.seq,
                    type: requestData.type,
                    checkInDate: $timeSelect.attr('data-in') || '',
                    checkOutDate: $timeSelect.attr('data-out') || '',
                    category: category
                };
                window.location.href = '/hotel/hotellist?' + util.param2query(param);
            }
        }
    });

    function initCalendar() {
        if (!qt.requestData.checkInDate) {
            var calendarDate = calendarHandle.getShowDate(),
                $box = qt.$('.time-select'),
                isRange = qt.requestData.type == '2' ? false : true,
                data = isRange ? calendarDate.storeDate.range : calendarDate.storeDate.single;

            $box.changeHtml(util.template(timeSelectTpl, {data: data}));

            isRange ?
                qt.href().param({checkInDate: data.detail[0].date, checkOutDate: data.detail[1].date}).replace() :
                qt.href().param('checkInDate', data.detail[0].date).replace();
            return;
        }

        if (qt.requestData.type != '2') {
            let count = util.getDateDiff(qt.$('.time-select').data('in'), qt.$('.time-select').data('out'));
            qt.$('.count-day').html(count);
        }
    }

//从dom中获取当前页面默认的入住,离店时间
    function getCurrentSelectDate(currentDom) {
        var selectDate = [],
            $timeBox = qt.$('.time-select');

        qt.requestData.type == '2' ?
            selectDate = [$timeBox.data('in')] :
            selectDate = [$timeBox.data('in'), $timeBox.data('out')];

        return selectDate;
    }

//打开日历页面
    function calendarOpen(opts, currentDom) {
        calendar.open({
            data: opts,
            onBack: function (data) {
                console.log(data);
                if (!data || data['_self_']) {
                    return false;
                }

                let detail = data.detail;

                if (!detail || currentDom.data('in') === detail[0].date && currentDom.data('out') === detail[1].date) {
                    return false;
                }

                data.isRange = opts.isRange;
                //新增 试睡
                if (sleepTask && qt.requestData.type != '2') {
                    data = $.extend( data , {
                        isRange: true,
                        detail : [
                            data.detail[0],
                            {
                                date: qt.util.nextDayStr(data.detail[0].date)    //自动增长一天
                            }
                        ]
                    });

                    detail = data.detail;
                }

                currentDom.html(util.template(timeSelectTpl, {data: data}));

                data.isRange ?
                    qt.href().param({checkInDate: detail[0].date, checkOutDate: detail[1].date}).replace() :
                    qt.href().param('checkInDate', detail[0].date).replace();

                currentDom.attr('data-in', detail[0].date)
                    .attr('data-out', detail[1] ? detail[1].date : '');

                calendarHandle.changePartStore(opts.isRange ? 'range' : 'single', data);

                renderPrice(detail[0].date, detail[1] ? detail[1].date : '');
            }
        });
    }

    function renderPrice(checkInDate, checkOutDate) {
        if (qt.requestData.type != 2) {
            renderRoomPrice(checkInDate, checkOutDate);
        } else {
            renderProHourRoomPrice();
        }

        if(qt.commonParam.skin.nearby) {
            renderOtherHotel(checkInDate, checkOutDate);
        }
    }

    //加载物理房型报价
    function renderRoomPrice(checkInDate, checkOutDate) {
        var requestData = qt.requestData,
            type = requestData.type,
            $roomList = qt.$('.room-list'),
            tpl = roomListTpl;
        $roomList.html('<div class="qt-bt-x1 loading-wrap room-loading"><span class="qt-blue icon spinner"></span> <span class="qt-blue">房型加载中....</span> </div>');
        $.ajax({
            url: '/api/hotel/hoteldetail/price',
            type: 'get',
            dataType: "json",
            data: {
                seq: requestData.seq,
                checkInDate: checkInDate,
                checkOutDate: checkOutDate,
                type: type,
                sleepTask: sleepTask,   //试睡
                productId: productId    //试睡
            },
            error: function (xhr) {
                console.log('数据加载失败！请稍后刷新再次尝试！')
            },
            success: function (data) {
                if (data.errcode !== 0) {
                    qt.alert(data.msg);
                    return '';
                }
                //console.log(data);
                $roomList.html(qt.util.template(tpl, data)).fadeIn();
                expandRoomContent();
            }
        });
    }

    //首次进入展开对应序号的物理房型报价，对应hash #expandNum=1
    function expandRoomContent(){
        var expandNum = qt.href().hash('expandNum'),
            dom,
            doScroll = false;
        if(!expandNum){
            dom = $('.room-list>li[data-type="0"]').eq(0).find('.room-content-head')
        }else{
            if(isNaN(expandNum)){
                return;
            }
            dom = $('.room-list>li:nth-child('+expandNum+')>.room-content-head');
        }
        if(!dom || dom.length === 0){
            return;
        }
        doShowRoomContent(dom,doScroll);
    }

    //展开对应的物理房型报价
    function doShowRoomContent(dom,doScroll){
        var $me = $(dom),
            $roomContent = $me.next('.room-content'),
            expandNum;
        if($me.length <= 0){
            return;
        }
        $me.toggleClass("t");
        $roomContent.toggleClass('qt-hide');
        if ($me.hasClass("t")) {
            expandNum = $('.room-list').children().indexOf($(dom).parent()[0]);
            if(expandNum >= 0){
                expandNum = expandNum + 1;
                qt.href().hash({expandNum : expandNum}).replace();
            }
            renderProRoomPrice($me,doScroll);
            $me.next('.room-content').find('.room-imgs img').lazyload();
        }
    }

    //加载产品房型报价
    function renderProRoomPrice(me,doScroll) {
        doScroll = (doScroll!=='' && doScroll!==undefined) ? doScroll : true;
        var $me = $(me);
        if ($me.attr('data-loadingpro') === 'false') {
            return
        }
        var requestData = qt.requestData,
            $timeSelect = qt.$('.time-select'),
            roomName = $me.attr('data-roomname') || '',
            type = $me.attr('data-type') || '0';
        $.ajax({
            url: '/api/hotel/hoteldetail/price',
            type: 'get',
            dataType: "json",
            data: {
                seq: requestData.seq,
                checkInDate: $timeSelect.attr('data-in') || '',
                checkOutDate: $timeSelect.attr('data-out') || '',
                type: type,
                desc: 'price',
                room: roomName,
                sleepTask: sleepTask,
                productId: productId
            },
            error: function (xhr) {
                console.log('数据加载失败！请稍后刷新再次尝试！')
            },
            success: function (data) {
                if (data.errcode !== 0) {
                    qt.alert(data.msg);
                    return '';
                }
                //console.log(data);
                first && (decodemix(data.data.css), first = false);
                $me.attr('data-loadingpro', 'false');
                data['isGJ'] = qt.firstData.isGJ;
                data['isHour'] = qt.requestData.type == 2;
                $me.next('.room-content').find('.pro-room-list').html(qt.util.template(proRoomListTpl, data)).fadeIn();
                if( $('body').attr('scrollHeight') - $(window).height() <= 100){
                    return;
                }
                if(!doScroll){
                    return;
                }
                qt.scrollTo($me.offset().top);
            }
        });

    };
    //加载钟点房产品房型报价
    function renderProHourRoomPrice() {
        var requestData = qt.requestData,
            $timeSelect = qt.$('.time-select'),
            $proRoomListHour = qt.$('.pro-room-list-hour');
        $proRoomListHour.html('<div class="qt-bt-x1 loading-wrap"> <span class="qt-blue icon spinner"></span> <span class="qt-blue">报价加载中....</span> </div>');
        $.ajax({
            url: '/api/hotel/hoteldetail/price',
            type: 'get',
            dataType: "json",
            data: {
                seq: requestData.seq,
                checkInDate: $timeSelect.attr('data-in') || '',
                type: 2,
                desc: 'price'
            },
            error: function (xhr) {
                console.log('数据加载失败！请稍后刷新再次尝试！')
            },
            success: function (data) {
                if (data.errcode !== 0) {
                    qt.alert(data.msg);
                    return '';
                }
                //console.log(data);
                first && (decodemix(data.data.css), first = false);
                data['isGJ'] = qt.firstData.isGJ;
                data['isHour'] = qt.requestData.type == 2;
                $proRoomListHour.html(qt.util.template(proRoomListTpl, data)).fadeIn();
            }
        });

    };
    //加载附近，同品牌酒店
    function renderOtherHotel(checkInDate, checkOutDate) {
        var requestData = qt.requestData,
            $otherHotelList = qt.$('.other-hotel-list');
        $otherHotelList.html('');
        $.ajax({
            url: '/api/hotel/rechotel',
            type: 'get',
            dataType: "json",
            data: {
                seq: requestData.seq,
                checkInDate: checkInDate || '',
                checkOutDate: checkOutDate || '',
                type: requestData.type
            },
            error: function (xhr) {
                console.log('数据加载失败！请稍后刷新再次尝试！')
            },
            success: function (data) {
                if (data.errcode !== 0) {
                    qt.alert(data.msg);
                    return '';
                }
                //console.log(data);
                $otherHotelList.html(qt.util.template(otherHotelListTpl, data)).fadeIn();
            }
        });
    }


    //跳转到填单页
    function toHotelOrderInfo(orderinfourl, tag) {
        window.location.href = orderinfourl.replace('%s', tag);
    }
})
();
