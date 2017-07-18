import pageTpl from './../tpl/index.tpl';
import detailPopTpl from './../tpl/detail.tpl';
import tipTpl from './../tpl/tip.tpl';
import appendixTpl from './../tpl/appendix.tpl';
import dataModel from './dataModel';

/**
 * 第三方接入，返回数据格式
 * {
        num: 3, //总份数
        name: '迪士尼', //名称
        price: 1003, //价格
        //搭售展示
        display: [
            ['第一组第一行'，'第一组第二行',...],
            ['第二组第一行'，'第二组第二行',...],
            ...
        ],
        //更多信息，原样返回填单页 
        extra: {
            orderInfoList: [
                {...预定信息1...},
                {...预定信息2...},
                {...预定信息3...}
                ]
        }
    }
 */


module.exports = (()=> {

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

    function fixAndroid() {
        var ua = navigator.userAgent;
        if(qua.android || qua.androidLife) {
            $('.qt-header-wrapper,.qt-header').height(50);
            $('.qt-scroll-wrapper').css('padding-top', 50);
            $('.qt-header').css('padding-top', 0);
            $('.qt-header .title').css('margin-top', 0);

            //无奈的兼容性...
            //小米4
            if(/MI 4LTE/ig.test(ua)) {
                $('.wrap .items .item .list li .right .sub-title .qt-arrow').css('top', 1);
            }
            else {
                $('.wrap .items .item .list li .right .sub-title .qt-arrow').css('top', -1);
            }
            //$('.wrap .items .item .list li .right .tag span').css('height', 13);
        }
    }

    var skip = function (scheme, touchUrl, bdSource) {
        bdSource = bdSource || '';
        scheme = scheme || 'home';
        touchUrl = touchUrl || ('download?bd_source=' + bdSource);
        var url = '';
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
    };

    var getReturnData = function () {
        //深度拷贝，避免直接修改源对象
        var data = $.extend(true, {}, dataModel.getResult());

        //返回数据格式里面没有 salePrice 字段，所以要删掉
        data.packProducts.map((item) => {
            delete item.salePrice;
            return item;
        });

        return data;
    };

    var appendixPrefix = 'ext_';

    //返回客户端数据
    var retApp = {
        def: {}, //保存初始数据
        // b true 返回初始数据，也就是取消
        result: function(b) {
            var data = getReturnData(),
                sExt = dataModel.getExt(),
                extra = {};

            b && (data = this.def);

            // data.bookInfo = JSON.stringify(
            //     $.extend({_test:'aaaa'},JSON.parse(qt.firstData.bookInfo) || '{}')
            // );
            data.bookInfo = qt.firstData.bookInfo;
            
            if(!b) {
                extra = JSON.parse(qt.firstData.extra || '{}');
                extra.packProductExtra = {};
                
                _.forEach(sExt, function(item, key){
                    extra.packProductExtra[appendixPrefix + key] = item;
                });
                
                data.extra = JSON.stringify(extra);
    
                //判断是否有扩展,已选的有没有选择完
                //检测组合套餐 
                var valimsg = '',
                    productid = '';
                var forces = qt.firstData.forcePackProductInfos;
                if(forces && forces.length > 0) {
                    _.forEach(forces, function(item) {
                        if(item.packBookingUrl && sExt[item.productId] === undefined) {
                            valimsg = item.packVaildateMsg;
                            productid = item.productId;
                            return false;
                        }
                    });
                }
                
                $('.checkbox.checked').each(function(){
                    var $this = $(this),
                        $li = $this.parents('li'),
                        pid = $li.attr('data-productid'),
                        $appendix = $('.appendix', $li);
                        
                    if($appendix.length > 0 && sExt[pid] === undefined) {
                        valimsg = $appendix.attr('data-msg');
                        productid = pid;
                        return false;
                    }
                });
                
                if(valimsg !== '') {
                    var zIndex = 51;
                    qt.hideSidebar(true);
                    qt.showPopup({
                        message: valimsg,
                        zIndex: 110,
                        onShow: function() {
                            zIndex = $('.qt-mask').css('zIndex');
                            $('.qt-mask').css('zIndex', 110);
                            $('.qt-popup.active').css('zIndex',120);
                        },
                        onHide: function() {
                            $('.qt-mask').css('zIndex', zIndex);
                        },
                        buttons: [
                            {
                                label: '取消',
                                className: 'cancel',
                                action: function () {
                                    qt.hidePopup();
                                }
                            },
                            {
                                label: '前往填写',
                                className: 'ok',
                                action: function () {
                                    $('.appendix', $('[data-productid="'+productid+'"]:first')).trigger('tap');
                                    qt.hidePopup();
                                }
                            }
                        ]
                    })
                    return false;
                }
            }
            //总价为0，且搭售数据为第三方返回，则直接关闭
            else if(data.totalPrice == 0) {
                var isclose = false;
                if(qt.firstData.forcePackProductInfos && qt.firstData.forcePackProductInfos.length > 0) {
                    _.each(qt.firstData.forcePackProductInfos, function(item) {
                        if(item.packBookingUrl) {
                            isclose = true; 
                        }
                    });
                }
                if(isclose) {
                    qt.qunarApi.ready(function () {
                        QunarAPI.hy.closeWebView({
                            //data: data
                        });
                    })
                    
                    return;
                }
            }
            console.log(data);
            //return false;
            qt.qunarApi.ready(function () {
                //给IOS返回数据
                QunarAPI.packs.packInfoBack({
                    data: data
                });

                //给native返回数据，这个接口目前只能安卓可以接收到，IOS未上线
                QunarAPI.hy.closeWebView({
                    data: data
                });
            });
        }
    };
    
    return qt.definePage({
        config: {
            backMonitor: function() {
                retApp.result(true);
            },
            init: function () {
            },
            ready: function () {
                fixAndroid();
                qt.qunarApi.ready(function () {
                    //注册一个方法， packInfoBack
                    //给native返回数据，IOS用
                    QunarAPI.register('packInfoBack', 'packInfoBack', 'packs');
                })
                
                var params,
                    arr = [];

                if (REQ.params) {
                    try {
                        params = JSON.parse(REQ.params);

                        !params.packProducts && (params.packProducts = []);
                        
                        //加载扩展信息
                        params.extra = JSON.parse(params.extra || '{}');
                        if(params.extra.packProductExtra) {
                            _.forEach(params.extra.packProductExtra, function(item, key) {
                                if(key.indexOf(appendixPrefix) > -1) {
                                    dataModel.setExt(key.replace(appendixPrefix, ''), item);
                                    $('div', $('.appendix', $('[data-productid="'+key.replace(appendixPrefix, '')+'"]')).removeClass('yellow hide')).addClass('qt-bt-x1').html(
                                        _.template(appendixTpl, item) 
                                    );
                                }
                            });
                        }

                        if (params.packProducts.length > 0) {
                            _.each(params.packProducts, (item) => {
                                // 初始化复选框
                                // 当前产品是超值组合套餐，需要减去mincount后再设置状态
                                var count = item.count;
                                if(qt.firstData.forcePackProductInfos) {
                                    $.each(qt.firstData.forcePackProductInfos, function(index, fp){
                                        if(item.productId === fp.productId
                                            && (fp.packBookingUrl === undefined || fp.packBookingUrl === '')) {
                                            count = item.count - fp.minCount;  
                                            if(count <= 0) {
                                                arr.push(fp.productId);
                                            } 
                                        }
                                        else {
                                            arr.push(fp.productId);
                                        }
                                    });
                                }
                                
                                if (count > 0) {
                                    var $productItem = $('li[data-productid="' + item.productId + '"]');
                                    this.handles.changeNum.apply(this, [$productItem, ~~count]);
                                }

                            });
                            
                        }
                        
                    } catch (e) {
                        console.log('请求参数格式错误', e);
                    }
                }

                if(arr.length > 0 && qt.firstData.forcePackProductInfos) {
                    $.each(qt.firstData.forcePackProductInfos, function(index, item) {
                        if(arr.indexOf(item.productId) > -1) {
                            dataModel.update({
                                productId: item.productId,
                                count: item.minCount,
                                select: true,
                                forePrd: true
                            });
                        }
                    });
                    this.handles.changeTotal();
                }

                retApp.def = getReturnData();
                retApp.def.extra = qt.firstData.extra || '{}';

                qt.qunarApi.ready(function () {

                    //售罄提示
                    if (qt.firstData.tips) {
                        //qt.alert(qt.firstData.tips);
                        qt.showPopup({
                            message: '<div class="tip-content">' + qt.firstData.tips + '</div>',
                            zIndex: 110,
                            noHeader: true,
                            noFooter: true,
                            autoHide: 3000,
                            wrapBackground: 'rgba(0,0,0,.7)',
                            contentPadding: 0,
                            onTapMask: function () {
                                qt.hidePopup();
                            },
                            onShow: function() {
                                $('.qt-popup').on('touchmove.packproduct', function() {
                                   return false;
                                });
                            },
                            onHide: function() {
                                $('.qt-popup').off('touchmove.packproduct');
                            }
                        });
                    }

                    QunarAPI.hy.setWebViewAttr({
                        // webView是否可以滚动
                        scrollEnabled: false, //是否允许native滚动（Android无效）
                        // iOS滑动出document区域，展示出的背景颜色
                        backgroundColor: '#fff' // webview的背景颜色（Android无效）
                    });
                });
            },
        },
        events: {
            //qunariphone://hotel/webDialog?url=xxx 搭售产品的详情地址配置成这样  xxx是产品的详情页面
            //'tap .back': 'back',
            'tap .list .right,.requiredPackage .detailColumn': 'openInfo',
            'tap .list .left': 'checkbox',
            'tap .numbar .minus,.numbar .plus': 'changeNum',  //加减号
            'tap .total-bar .count': 'showDetail', //显示隐藏明细
            'tap .btn-done': 'done', //完成
            'tap .appendix': 'openAppendix'
        },
        templates: {
            body: function () {

                var data = qt.firstData.packProducts;

                //有搭售数据
                if(qt.firstData.forcePackProductInfos && qt.firstData.forcePackProductInfos.length > 0) {
                    var arr = [];
                    _.each(qt.firstData.forcePackProductInfos, function(fp) {
                        var flag = true;
                        _.filter(data, function(pds){
                            var d = _.find(pds.productInfos, function(p){
                                return p.productId == fp.productId;
                            });
                            
                            //packProducts存在
                            if(d){
                                flag = false;
                            }
                        });
                        if(flag) {
                            arr.push({productInfos: [fp]});
                        }
                    });
                    data = data.concat(arr);
                }

                dataModel.setStore(data, qt.firstData.forcePackProductInfos);

                return qt.util.template(pageTpl, {
                    data: qt.firstData.packProducts || [],
                    forcePackProductInfos: qt.firstData.forcePackProductInfos || [],
                    headPtTips: qt.firstData.headPtTips,
                    titleMaxLen: function () {
                        var winW = $(window).width();
                        if (winW <= 320) {
                            return 31;
                        } else if (winW > 320 && winW <= 375) {
                            return 39;
                        } else {
                            return 45;
                        }
                    }(),
                    getLabel: function(tag) {
                        var maps = {
                            "免预约": 'http://simg1.qunarzz.com/site/images/wap/home/recommend/mianyuyue.png',
                            "随时退": 'http://simg1.qunarzz.com/site/images/wap/home/recommend/suishitui.png',
                            "不可取消": 'http://simg1.qunarzz.com/site/images/wap/home/recommend/bukequxiao.png',
                            "请提前一天预约": 'http://simg1.qunarzz.com/site/images/wap/home/recommend/tiqianyitianyuyue.png'
                        };
                        
                        return maps[tag] ? maps[tag] : maps['请提前一天预约'];
                    }
                });
            }()
        },
        handles: {
            openInfo: function (e) {
                if ($(e.target).parents('.numbar').length > 0 
                    || $(e.target).hasClass('numbar')
                    || $(e.target).parents('.appendix').length > 0 
                    || $(e.target).hasClass('appendix')) {
                    return;
                }
                var $this = $(e.currentTarget),
                    url = $this.attr('data-ota') || '';
                if(url != '') {
                    skip('hotel/webDialog?url=' + encodeURIComponent(url));
                }
            },
            checkbox: function (e) {
                var $this = $(e.currentTarget),
                    $checkbox = $('.checkbox', $this),
                    $li = $checkbox.parents('li'),
                    pid = $li.attr('data-productid');

                $checkbox.toggleClass('checked');

                if($checkbox.hasClass('ext')) {
                    var ext = dataModel.getExt(pid);
                    // if($checkbox.hasClass('checked')) {
                    //     //没有选过，直接打开页面
                    //     if(ext.num === undefined) {
                    //         $('.appendix', $li).removeClass('hide');
                    //         return;
                    //     }
                    // }
                    $('.appendix', $li)[ $checkbox.hasClass('checked') ? 'removeClass': 'addClass']('hide');
                    ext && dataModel.update({
                        productId: pid,
                        count: ~~ext.num,
                        select: $checkbox.hasClass('checked')
                    });
                }
                else {
                    dataModel.update({
                        productId: pid,
                        count: ~~$li.find('.num').text(),
                        select: $checkbox.hasClass('checked')
                    });    
                }

                this.handles.changeTotal();
            },
            changeTotal: function () {
                var content = '.total-bar',
                    currencySign = '',
                    data = dataModel.getResult(),
                    unit = data.packProducts.length > 0 ? data.packProducts[0].unit : '张',
                    count = 0;

                $.each(data.packProducts, (index, val) => {
                    count += val.count;
                });

                $('.t-price', content).html(currencySign + data.totalPrice);

                var text = [];

                if(count > 0) {
                    text.push('已选' + count + '张');
                }

                if(parseFloat(data.totalPtPrice) > 0) {
                    text.push('已减&yen' + data.totalPtPrice);
                }

                if(parseFloat(data.totalPtPrice) > 0 || count > 0) {
                    $('.price', content).removeClass('single');
                    $('.t-minus', content).html(text.join('，'));
                }
                else {
                    $('.t-minus', content).html('');
                    $('.price', content).addClass('single');
                }

                $('.tipbar', content)[data.packProducts.length > 0 ? 'removeClass' : 'addClass']('qt-hide');
            },
            changeNum: function (e, count) {
                var $this = e.currentTarget
                        ? $(e.currentTarget)   //$('.minus') || $('.plus')
                        : e,  //$('li[data-productid]="1"')
                    $li, $num, max, num;

                //页面加载初始化处理逻辑, 处理默认份数与选中checkbox
                if (typeof count === 'number') {
                    $li = $this;
                    $num = $('.num', $li);
                    num = count;
                    $num.html(count);
                }
                //点击加减按钮处理逻辑
                else {
                    if ($this.hasClass('disabled')) {
                        return;
                    }
                    $li = $this.parents('li');
                    $num = $('.num', $li);
                    num = ~~$num.text(); // ~~转整
                    $num.html(
                        $this.hasClass('plus')
                            ? ++num
                            : --num
                    );
                }

                max = ~~$num.attr('data-max');

                $('.minus', $li)[num === 1 ? 'addClass' : 'removeClass']('disabled');

                //处理最大份数
                $('.plus', $li)[num === max ? 'addClass' : 'removeClass']('disabled');

                //有加减操作时候，checkbox控件自动选中
                $('.checkbox', $li).addClass('checked');

                dataModel.update({
                    productId: $li.attr('data-productid'),
                    count: num,
                    select: true
                });

                this.handles.changeTotal();
            },
            showDetail: function (e) {
                var $this = $(e.currentTarget),
                    busy = $this.data('busy'),
                    $arrow = $this.find('.tipbar span'),
                    hideBar = function () {
                        
                        qt.hideSidebar();
                    };

                if (busy || $this.find('.tipbar').hasClass('qt-hide')) {
                    return;
                }

                //处理连续点击情况
                $this.data('busy', true);

                //隐藏明细
                if ($arrow.hasClass('b')) {
                    qt.hideSidebar();
                }
                //显示明细
                else {
                    qt.showSidebar({
                        type: 'bottom',
                        maskOpacity: .5,
                        onTapMask: function () {
                            qt.hideSidebar();
                        },
                        onShow: function () {
                            $arrow.removeClass('t')
                                  .addClass('b');
                            $this.data('busy', false);
                        },
                        onHide: function () {
                            $this.data('busy', false);
                            $arrow.removeClass('b')
                                  .addClass('t');
                        },
                        zIndex: 99,
                        offsetY: $('.total-bar').height(),
                        template: qt.util.template(detailPopTpl, {
                            data: dataModel.getResult(),
                            maxLen: function () {
                                var winW = $(window).width();
                                if (winW <= 320) {
                                    return 14;
                                } else if (winW > 320 && winW <= 375) {
                                    return 18;
                                } else {
                                    return 22;
                                }
                            }()
                        })
                    });
                }
            },
            done: function () {
                retApp.result();
            },
            openAppendix: function(e) {
                var me = this,
                    $this = $(e.currentTarget),
                    url = $this.attr('data-url'),
                    pid = $this.parents('[data-productid]').attr('data-productid');
                
                /** mock start */
                    
                // var res = {
                //     num: 3, //总份数
                //     name: '迪士尼', //名称
                //     price: 1200, //价格
                //     //搭售展示
                //     display: [
                //         ['2张 成人票 5月28日游玩','10101101023020320'],
                //         ['1张 儿童票 5月28日游玩','10101101023020320']
                //     ],
                //     //更多信息，原样返回填单页 
                //     extra: {
                //         orderInfoList: [1,2,3,4,6]
                //     }
                // };
                // dataModel.setExt(pid, res);
                // $('div', $this).addClass('qt-bt-x1').html(
                //     _.template(appendixTpl, res) 
                // );
                // $this.removeClass('yellow');
                // dataModel.update({
                //     productId: pid,
                //     count: res.num,
                //     select: true
                // });
                
                // $('.left .checkbox', $this.parents('li')).addClass('checked');

                // me.handles.changeTotal();
                // return false;
                /** mock end */

                qt.qunarApi.ready(function () {
                    QunarAPI.hy.openWebView({
                        url: url,
                        data: dataModel.getExt(pid),
                        type: 'navibar-none',
                        //页面关闭后返回的数据
                        onViewBack: function(res){
                            console.log('openWebView', url, res);
                            if(res.num && res.price) {
                                dataModel.setExt(pid, res);
                                $('div', $this).addClass('qt-bt-x1').html(
                                    _.template(appendixTpl, res) 
                                );
                                $this.removeClass('yellow');
                                dataModel.update({
                                    productId: pid,
                                    count: res.num,
                                    select: true
                                });
                                
                                $('.left .checkbox', $this.parents('li')).addClass('checked');

                                me.handles.changeTotal();
                            }
                        }
                    });
                });
            }
        }
    });


})();
