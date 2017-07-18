/**
 * Created by taoqili on 15/8/28.
 */
//import _ from 'underscore';
import loginPage from '../../common/sub-pages/login/'
import '../../../common/component/range/index'
module.exports = (()=> {
    var util = qt.util;
    //普通青年,基本完全自理
    return qt.definePage({
        config: {
            init: function (data) {
                util.log('pageInit');
            },
            //仅执行一次
            ready: function (data) {
                util.log('pageDone');
                $('#range').range({
                    division: [0, 50, 80, 100, '不限'],
                    isSingle: true
                });
                testActivityAttached();

                qt.qunarApi.ready(function(){
                    QunarAPI.hy.getInitData({
                        success: function(data){
                            console.log('接收' + JSON.stringify(data || {}));
                        }
                    });
                })
            },
            onOpen: function () {
                util.log('pageOnOpen')
            }
        },

        events: {
            'tap .alert': 'alert',
            'tap .confirm': 'confirm',
            'tap .popup': 'popup',
            'tap .get-ua': 'getUA',
            'tap .open-page': 'openPage',
            'tap .open-page1': 'openPage1',
            'tap .top-side': 'showTopSidebar',
            'tap .bottom-side': 'showBottomSidebar',
            'tap .left-side': 'showLeftSidebar',
            'tap .right-side': 'showRightSidebar',
            'tap .qunarapi': 'qunarapi'
        },
        templates: {
             //header:'',
            //第一种情形
            header: '<h1 class="title">去哪儿旅行1</h1>',
            //第二种情形
            subHeader: function (requestData) {
                return '<div class="openSelect">打开page1</div><div class="open">打开page2</div>';
            },
            //第三种情形，支持多个请求同时调用，但建议每次只调用一个以提升性能
            body: {
                url: ['/api/hotel/test','/api/hotel/test2'],
                type:'POST',
                data: [{a: 1}],
                success: function (data1, data2) {
                    return _.template(testTpl, {name: data1.name})
                },
                error: function () {
                }
            },
            //第四种情形，功能同第三种
            footer: function (requestData) {
                return {
                    url: ['/api/hotel/test', '/api/hotel/test'],
                    data: [{a: 1}, {b: 2}],
                    success: function (data1, data2) {
                        return _.template(testTpl, {name: data1, value: data2})
                    },
                    error: function () {

                    }
                }
            },
            //footer: 'xxxxx'
        },
        handles: {
            qunarapi: function() {
                qt.qunarApi.ready(function(){
                    QunarAPI.hy.closeWebView({
                        data: {
                            quantity: 3,
                            sightName: "迪士尼",
                            totalPrice: 1003,
                            extra: {
                                orderInfoList: [1,2]
                            } 
                        }
                    });
                })
            },
            alert: function (e, requestData, subPage) {
                //简单版
                //qt.alert('1112', function () {
                //    util.log('点击了OK按钮');
                //});
                // 通用版
                 qt.alert({
                    message:'测试4测试4测试4测试4测试4测试4测试4测试4测试4测试4测试4测试4测试4测试4测试4',
                    animate:'ai-shake',
                    onOk:function(){
                        util.log('点击了确定按钮')
                    }
                 })

            },
            confirm: function () {
                //简单版
                //qt.confirm('你确定取消吗？',function(){
                //    util.log('点击了确定')
                //},function(){
                //    util.log('点击了取消')
                //})
                //通用版
                qt.confirm({
                    noHeader: true,
                    contentCenter: true,
                    message: '你确定要取消吗？',
                    animate: 'scaleDownIn',
                    onOk: function () {
                        util.log('点击了确定');
                    },
                    onCancel: function () {
                        util.log('点击了取消');
                    }
                })
            },
            popup: function () {
                qt.showPopup({
                    animate: 'slideDownIn',
                    //noFooter: true,
                    events: {
                        'tap div': 'testClick'
                    },
                    onTapMask: function (e) {
                        qt.hidePopup();
                    },
                    //message: {
                    //    url: '/api/hotel/test',
                    //    success: function (data) {
                    //        return '<div style="height: 500px">' + JSON.stringify(data) + '</div>';
                    //    }
                    //},
                    message: '<div>测试测试测试测试测试测试测试测试测试测试测试测试</div>',
                    testClick: function (e) {
                        util.log('点击了div')
                    }
                })
            },
            getUA: function () {
                qt.showPopup({
                    animate: 'scaleIn',
                    message: '系统：' + JSON.stringify($.os) + '<br/>' +
                    '浏览器：' + JSON.stringify($.browser)
                })
            },
            openPage: function (e) {
                loginPage.open({
                    data: {test: 1},
                    onOpen: function () {
                        util.log('loginPage被打开了！')
                    },
                    onBack: function (data) {
                        util.log('loginPage返回了数据：' + JSON.stringify(data))
                    }
                })
            },
            openPage1: function (e) {
                loginPage.open({
                    data: {test: 2},
                    onOpen: function () {
                        util.log('loginPage被打开了！')
                    },
                    onBack: function (data) {
                        util.log('loginPage返回了数据：' + JSON.stringify(data))
                    }
                })
            },
            showTopSidebar: function () {
                var tpl = '<div class="qt-center qt-bg-yellow qt-lh6"><i class="icon home qt-blue"></i>这里可以是任意的的html文本</div>'
                qt.showSidebar({
                    events: {
                        'tap .qt-center': 'test'
                    },
                    duration: 2000,
                    template: tpl,
                    offsetX:10,
                    offsetY:10,
                    onShow: function ($sidebar) {
                        util.log('打开了顶部下滑层')
                    },
                    onHide: function ($sidebar) {
                        util.log('关闭了顶部下滑层')
                    },
                    test: function (e, $sidebar) {
                    }
                });
                //setTimeout(function () {
                //    qt.hideSidebar();
                //}, 2000);
            },
            showBottomSidebar: function () {
                var tpl = '<div style="height: 300px" class="qt-center qt-bg-yellow qt-lh6"><i class="icon home qt-blue"></i>这里可以是任意的的html文本</div>'
                qt.showSidebar({
                    template: tpl,
                    type: 'bottom',
                    offsetX:100,
                    offsetY:10,
                    onShow: function ($sidebar) {
                        util.log('打开了底部下滑层')
                    },
                    onHide: function ($sidebar) {
                        util.log('关闭了底部上滑层')
                    }
                });
                setTimeout(function () {
                    qt.hideSidebar()
                }, 2000)
            },
            showLeftSidebar: function () {
                var tpl = '<div style="height: 300px" class="qt-center qt-bg-yellow qt-lh6"><i class="icon home qt-blue"></i>这里可以是任意的的html文本</div>'
                qt.showSidebar({
                    template: tpl,
                    type: 'left',
                    offsetX:10,
                    offsetY:10,
                    onShow: function ($sidebar) {
                        util.log('打开了左侧右滑层')
                    },
                    onHide: function ($sidebar) {
                        util.log('关闭了左侧右滑层')
                    }
                });
                setTimeout(function () {
                    qt.hideSidebar()
                }, 2000)
            },
            showRightSidebar: function () {
                var tpl = '<div style="height: 300px" class="qt-center qt-bg-yellow qt-lh6"><i class="icon home qt-blue"></i>这里可以是任意的的html文本</div>'
                qt.showSidebar({
                    template: tpl,
                    type: 'right',
                    noMask: true,
                    offsetX:10,
                    offsetY:10,
                    onShow: function ($sidebar) {
                        util.log('打开了右侧左滑层')
                    },
                    onHide: function ($sidebar) {
                        util.log('打开了右侧左滑层')
                    }
                });
                //setTimeout(function () {
                //    qt.hideSidebar()
                //}, 2000)
            }

        }
    });


    function testActivityAttached(){
        var $link = $('<a>超值组合跳转</a>');
        $('body').append($link);

        $link.on('tap', function(){

            var url = window.location.origin + '/activity/packproduct';

            qt.qunarApi.ready(function(){
                QunarAPI.hy.openWebView({
                    url: url,
                    data: {a:'父级页面传递的数据'},
                    // 调整导航栏的外观，详情见附录1
                    navigation: {
                        left: { // 指定左侧按钮
                            style: 'text', // 按钮样式: text: 文本按钮 | icon: 图标按钮, 不填则保留一个默认的返回按钮
                            text: '取消', // 按钮样式为text时，应用此字段作为按钮文字
                            icon: '\uf067' // 按钮样式为icon时，应用此字段作为图标
                        }
                    },
                    //页面关闭后返回的数据
                    onViewBack: function(res){
                        res && alert('onViewBack:' + JSON.stringify(res));
                    }
                });
            });
        });
    }

    //文艺青年,双向绑定
    //return qt.defineVM({
    //
    //})
})();
