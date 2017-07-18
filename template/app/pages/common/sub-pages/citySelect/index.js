/**
 * Created by taoqili on 15/10/16.
 * 待解决list：
 * 样式导入
 * 缓存
 */
import cityListWrapTpl from './cityListWrap.tpl';
import gjCityListTpl from './gjCityList.tpl';
import headerTpl from './header.tpl';
import rightSideBar from './rightSideBar.tpl';
import '../../../../common/component/tab/index';
import '../../../../common/component/suggest/index';
module.exports = (()=> {
    var util = qt.util,
        transferData,
        sidebarData,
        currentRoomType, //用于在切换全日房和钟点房之后是否需要重绘城市列表
        support = $.type(document.elementFromPoint) === 'function';
    return qt.defineSubPage({
        config: {
            name: 'citySelectPage',
            init: function (requestData, subPage) {
                //获取打开子页面时传递过来的数据
                transferData = qt.getTransferData();
            },
            beforeBack: function () {
                qt.hideSidebar();
            },
            onBack: function () {
                qt.hideSidebar();

            },
            beforeOpen: function (requestData, subPage) {
                if (currentRoomType !== transferData.type) {
                    getCity().then(function (data) {
                        currentRoomType = transferData.type;
                        $.extend(data, {
                            support: support,
                            roomType: transferData.type,
                            history: getHistoryCityList()
                        });
                        sidebarData = data;
                        qt.$('.qt-page-body').html(qt.util.template(cityListWrapTpl, {'data': data}));

                        initCityTypeTab();
                        renderGjCity();
                    });
                }


                //设置当前已经选中的城市到城市选择框
                setCityPlaceholder(transferData.city || '');

                //修正钟点房无国际酒店
                fixGjCity();

                //渲染边栏字母导航
                renderSidebar();

            },
            ready: function (requestData, subPage) {

                initCityTypeTab();

                initSuggest();

                //渲染国际城市
                renderGjCity();

                //渲染边缘字母导航
                renderSidebar();

                //设置当前城市名称
                setLocalCity();

                //滚动到顶部事件监听
                addScrollToTopListener();
            }
        },
        events: function () {
            return {
                'tap .city-package .city-grid ': 'returnCity',
                'tap .select-container .item': 'returnCity',
                'tap .city-select .cancel-circle': 'removeSelect',
                'tap .inland .location': 'returnCity',
                'tap .get-location': 'getLocation',
                'tap .page-to-top': 'pageToTop'
            }
        }(),
        templates: {
            header: headerTpl,
            subHeader: '',
            body: function (requestData, subPage) {
                var roomType = transferData.type,
                    url ='/api/hotel/city/' + (roomType === 'normal-room'?'en':'hour');
                currentRoomType = roomType;
                return {
                    url: url,
                    success: function (data) {
                        if (data.errcode !== 0) {
                            qt.alert(data.msg);
                            return '';
                        }
                        $.extend(data, {
                            support: support,
                            roomType: roomType,
                            history: getHistoryCityList()
                        });

                        sidebarData = data;
                        return qt.util.template(cityListWrapTpl, {'data': data});
                    },
                    error: function (e) {
                        console.log(e);
                        return '';
                    }
                }

            },
            footer: ''
        },
        handles: function () {
            return {
                returnCity: function (e, requestData, subPage) {
                    var $me = $(e.currentTarget),
                        $target = $(e.target);
                    if ($target.hasClass('get-location'))return;
                    var city = $me.attr('data-city') || $me.attr('data-key') || $me.find('.text').attr('data-key') || '';
                    addToHistory(city);
                    setSelectedCity(city);
                    setCityPlaceholder(city);
                    subPage.back(city)
                },
                removeSelect: function () {
                    setCityPlaceholder('');
                },
                getLocation: function (e, requestData, subPage) {
                    setLocalCity();
                },
                pageToTop: function () {
                    qt.scrollTo(0);
                }

            };
        }()
    });

    function getCity() {
        var roomType = transferData.type,
            dfd = $.Deferred(),
            url = '/api/hotel/city/' + (roomType === 'normal-room' ? 'en' : 'hour');
        $.ajax({
            url: url,
            dataType: 'json',
            success: function (data) {
                if (data.errcode !== 0) {
                    qt.alert(data.msg);
                    dfd.reject(data);
                }
                $.extend(data, {support: support, roomType: transferData.type});
                sidebarData = data;
                dfd.resolve(data);
            },
            error: function (e) {
                console.log(e);
                dfd.reject(e);
            }
        });
        return dfd;
    }


    function addScrollToTopListener() {
        var $toTop = qt.$('.page-to-top');
        qt.onScrollStop(function (scrollTop) {
            if (scrollTop > 400) {
                $toTop.css('display') === 'none' && $toTop.fadeIn();
            } else {
                $toTop.fadeOut();
            }
        });
    }

    function renderSidebar() {
        if (!sidebarData) return;
        var tpl = util.template(rightSideBar, {'data': sidebarData}),
            firstLetter = '';
        qt.showSidebar({
            template: tpl,
            type: 'right',
            noMask: true,
            offsetY: 100,
            opacity: true,
            events: {
                'touchmove .sidebar-right-side': 'rightSideMove',
                'touchstart .sidebar-right-side': 'rightSideStart',
                'touchend .sidebar-right-side': 'rightSideEnd'
            },
            rightSideStart: function (e) {
                var $rightSide = $('.sidebar-right-side'),
                    top = $rightSide.offset().height / 2 - 20;
                var $touchValue = $('.sidebar-touch-value');
                $touchValue.css({
                    'top': top,
                    'right': window.innerWidth / 2
                });
                this.doLettersNavigate(e);
            },
            rightSideMove: function (e) {
                this.doLettersNavigate(e);
            },
            rightSideEnd: function () {
                firstLetter = '';
                $('.sidebar-touch-value').addClass('qt-hide');
            },
            doLettersNavigate: function (e) {
                e.preventDefault();
                e.stopPropagation();
                var x = e.targetTouches[0].pageX,
                    y = e.targetTouches[0].pageY;
                var $rightSide = $('.sidebar-right-side'),
                    rightSideLeft = $rightSide.offset().left,
                    rightSideRight = $rightSide.offset().width + rightSideLeft;
                if (x >= rightSideLeft && x <= rightSideRight) {
                    var fixTop = $rightSide.offset().top - 100;
                    var $target = qt.$(document.elementFromPoint(x, y - fixTop));
                    var targetHtml = $target.attr('data-letter') || $target.html();
                    if (firstLetter == targetHtml) {
                        return false
                    } else {
                        firstLetter = targetHtml
                    }
                    if (targetHtml == '城市搜索') {
                        qt.scrollTo(0);
                        showTip();
                        return false
                    }
                    var $dom = '';
                    if (targetHtml && !targetHtml.match(/<(.*)>(.*)<\/(.*)>|<(.*)\/>/g)) {
                        var $parent = $('#cityTab .content');
                        $parent = $parent.find(!$parent.find('.active').length ? '.inland' : '.active');
                        $dom = qt.$('.city-title[data-index-key=' + targetHtml + ']', $parent);
                        if ($dom.length > 0) {
                            showTip();
                            scrollTop($dom, '.qt-page-header', 'citySelectPage');
                        }

                    }
                }
                function showTip() {
                    var $touchValue = $('.sidebar-touch-value');
                    $touchValue.html(targetHtml);
                    $touchValue.css('display') == 'none' && $touchValue.removeClass('qt-hide');
                }
            }

        })
    }

    //国际城市渲染
    function renderGjCity() {
        if (transferData.type === 'normal-room') {
            $.ajax({
                url: '/api/hotel/city/gj',
                type: 'get',
                dataType: "json",
                error: function (xhr) {
                    qt.alert('数据加载失败！请稍后刷新再次尝试！')
                },
                success: function (data) {
                    if (data.errcode !== 0) {
                        qt.alert(data.msg);
                        return;
                    }
                    var tpl = util.template(gjCityListTpl, {'data': data, history: getHistoryCityList()});
                    qt.$('.foreign').html(tpl);
                    qt.$('#cityTab').tab('fitToContent');
                }
            });
        }
    }

    function initCityTypeTab() {
        qt.$('#cityTab').tab({
            effect: 'none',
            lineWidth: '50%'
        })
    }

    function initSuggest() {
        qt.$('.js-suggest').suggest({
            url: '/api/hotel/suggest/c', //接口
            keyName: 'city',  //查询关键字
            displayKey: 'display', //显示数据字段
            max: 10, //显示数量
            formId: '.select-container', //搜索结果填充到这个dom
            highLight: true,
            process: function (data) {
                if (data.ret && data.data && data.data.result) {
                    return data.data.result;
                } else {
                    return [];
                }
            },
            //选择节点后callback
            select: function ($item, _suggest) {
                //在events里处理了
            },
            //suggest隐藏
            hide: function () {
                qt.$('.city-container').removeClass('qt-hide');
                qt.$('.select-container').addClass('qt-hide');
                renderSidebar()
            },
            //suggest显示
            show: function () {
                qt.$('.city-container').addClass('qt-hide');
                qt.$('.select-container').removeClass('qt-hide');
                qt.hideSidebar();
            }
        });
    }

    function setLocalCity() {
        if (typeof BMap === 'undefined')return;
        var myCity = new BMap.LocalCity(),
            roomType = transferData.type,
            $localCity = qt.$('.local-city');
        $localCity.html($localCity.html() + ('<i class="icon spinner qt-font12 qt-grey qt-lh"></i>'));
        myCity.get(function (result) {
            var cityName = util.formatCity(result && result.name || '北京');
            $localCity.attr('data-city', cityName).html(cityName);
            $localCity.parent().attr('data-city', cityName);
            //增加个统计
            qt.monitor(roomType === 'hour-room' ? 'jdhourroom_successlocation' : 'fullhotel_successlocation');

        });
    }

    function scrollTop(dom, fix, parentName) {
        var $dom = $(dom),
            top = $dom.offset().top;
        var y = 0;
        if (fix) {
            var fixHeight = qt.$('#' + util.prefix + parentName + ' ' + fix).offset().height;
            y = top - fixHeight;
        } else {
            y = top;
        }
        window.scrollTo(0, y);
    }

    function setSelectedCity(city) {
        if (!city)return;
        if (city === qt.$('.js-suggest').val()) {
            return;
        }
        var roomType = transferData.type,
            oldKeyData = JSON.parse(util.localStorage.getItem('TOUCH_CHECKED') || '{}'),
            newKeyData = {},
            wrapKeyData = {},
            typeData = wrapKeyData[roomType] || {};
        wrapKeyData[roomType] = $.extend(typeData, {city: city, address: ''});
        $.extend(newKeyData, oldKeyData, wrapKeyData);
        util.localStorage.setItem('TOUCH_CHECKED', JSON.stringify(newKeyData));
        renderHistoryCityList();
    }


    function addToHistory(city) {
        if (!city) return;

        var historyCities = getHistoryCityList();
        for (var i = 0; i < historyCities.length; i++) {
            if (historyCities[i].city == city) {
                historyCities.splice(i, 1);
            }
        }
        historyCities.unshift({'city': city});
        util.localStorage.setItem(transferData.type === 'normal-room' ?
            'TOUCH_HISTORY_CITY' : 'TOUCH_HISTORY_CITY_HOUR', JSON.stringify(historyCities.slice(0, 20)) || '[]');
    }

    //钟点房没有国际酒店
    function fixGjCity() {
        var roomType = transferData.type,
            $tabHeader = qt.$('#cityTab .nav'),
            $line = qt.$('#cityTab .line');

        if (roomType === 'normal-room') {
            $tabHeader.removeClass('qt-hide');
            $line.removeClass('qt-hide');
        } else {
            $tabHeader.addClass('qt-hide');
            $line.addClass('qt-hide');
        }
    }


    function setCityPlaceholder(city) {
        qt.$('.js-suggest').val(city).attr('data-city', city);
    }

    function getHistoryCityList() {
        var ls = util.localStorage,
            historyCities = ls.getItem(transferData.type === 'normal-room' ?
                'TOUCH_HISTORY_CITY' : 'TOUCH_HISTORY_CITY_HOUR');
        return JSON.parse(historyCities || '[]');
    }

    function setHistoryCityList(listStr) {

    }

    function renderHistoryCityList() {
        var $history = qt.$('.history-city'),
            cityList = getHistoryCityList(),
            html = [];
        for (var i = 0; i < cityList.length; i++) {
            var city = cityList[i].city || '';
            html.push('<div class="city-package">' +
                '<div class="city-grid ' + ( city.length >= 5 ? 'qt-font12' : '') + '" data-city="' + city + '">' +
                city + '</div></div>');
        }
        if (!html.length) {
            $history.addClass('qt-hide');
        } else {
            $history.removeClass('qt-hide').find('.city-wrap').html(html.join(''));
        }

    }

})();