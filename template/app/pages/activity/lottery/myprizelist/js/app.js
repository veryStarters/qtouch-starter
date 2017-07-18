import indexTpl from '../tpl/index.tpl';//初始页面
import prizeDetailTpl from '../tpl/prize-detail.tpl';   //弹窗详情
import prizeListTpl from '../tpl/prize-list.tpl';//列表
import errTpl from '../tpl/err.tpl';//列表

module.exports = (()=> {

    var util = qt.util;
    var prizeList = [];
    var href = location.search.slice(1);
    var urlParams = util.query2param(href);
    var bdSource = urlParams.bd_source || 'yaoyiyao_tongyong';
    var uiConfig = window.YYYConfig[bdSource];

    //普通青年,基本完全自理
    return qt.definePage({
        config: {
            init: function () {

            },
            ready: function () {
                var mobile = util.localStorage.getItem('mobile');
                //获取奖项列表
                $.ajax({
                    url: '/api/activity/lottery/myprizelist',
                    data: {
                        mobile: mobile
                    },
                    dataType: 'json',
                    type: 'get',
                    success: function(res) {
                        if (res.ret) {
                            if (res.errcode === 0) {
                                prizeList = res.data.awardRecords;
                            }

                            var $dom = util.template(prizeListTpl, res);

                            $('.content').html($dom);

                            $('.prize-list .prize-wrapper').css({
                                background: uiConfig.popUpContentColor
                            });

                            $('.prize-list .prize-name,.prize-list .prize-title-only').css({
                                color: uiConfig.popUpContentColor
                            });

                        } else {
                            var $errTpl = util.template(errTpl, res);
                            showPopup($errTpl);
                        }
                    },
                    error: function() {
                        qt.alert('服务器繁忙，请稍后再试！');
                    }
                })
            }
        },
        events: {
            'tap .prize-wrapper': 'seePrizeDetail',
            'tap .goto-shake-page': 'gotoShakePage',
            'tap .goto-main-activity': 'gotoMainActivity'
        },
        templates: {
            body: function(){
                $('body,.qt-wrapper').css({
                    background: uiConfig.popUpBackground
                })
                return _.template(indexTpl, {data: uiConfig})
            }
        },
        handles: {
            seePrizeDetail: function(e){
                var $target = $(e.currentTarget);

                var index = parseInt($target.attr('data-index'), 10);

                var prizeData = prizeList[index];

                showPopup(util.template(prizeDetailTpl, {data: prizeData}));
            },

            gotoShakePage: function(e){
                qt.monitor('yaoyiyao_gotoShakePage');
                location.href = location.origin +'/activity/lottery?bd_source=' + bdSource;
            },

            gotoMainActivity: function(e){
                qt.monitor('yaoyiyao_gotoMainActivity');
                location.href = uiConfig.toMainLink + '&bd_source=' + bdSource;
            }

        }
    });

    function showPopup(tpl) {
        qt.showPopup({
            noHeader: true,
            noFooter: true,
            events: {
                'tap .use-now': 'useNow',   //立即使用
                'tap .close-popup' : 'closePopup'   //关闭弹窗
            },
            onShow: function(){

                //弹窗背景颜色
                $('.prize-result').css({
                    background: uiConfig.popUpBackground
                })

                //更改title ，button 颜色
                $('.prize-title span,.vcode_get,.positive-btn,.prize-wrapper').css({
                    background: uiConfig.popUpContentColor
                });
                $('.prize-name,.prize-title-only').css({
                    color: uiConfig.popUpContentColor
                });
            },
            useNow: function(){
                qt.monitor('yaoyiyao_useNow');
                document.location = uiConfig.toMainLink + '&bd_source=' + bdSource;
            },
            closePopup: function(){
                qt.hidePopup();
            },
            message: function () {
                return tpl;
            }(),
            wrapBackground: 'transparent'
        })
    }
})();
