/**
 * Created by taoqili on 15/8/28.
 */
import Shake from './shake';
import bodyTpl from './tpl/body.tpl';
import templateTpl from './tpl/template.tpl';
import prizeTpl from './tpl/prize.tpl';
import loginTpl from './tpl/login.tpl';
import errTpl from './tpl/err.tpl';

import config from './config';
import Tip from '../../../common/component/tip/index.js'
import popupTpl from './tpl/popup.tpl';
module.exports = (()=> {

    var uiConfig = window.YYYConfig || config;

    var util = qt.util;
    var isLogin = qt.commonParam.isLogin;
    var cityName = '';//定位城市

    var isdisabled = false; //验证码可点击
    var jsApi = false;  //判断是否在quanrApi中
    var canShake = true; //摇一摇
    var myShakeEvent; //摇一摇事件对象
    var instance;
    var href = location.search.slice(1);
    var urlParams = util.query2param(href);
    var bdSource = urlParams.bd_source || 'yaoyiyao_tongyong';
    uiConfig = uiConfig[bdSource] ;

    //浏览器类型
    var qua = function () {
        var ua = navigator.userAgent;
        return {
            iphonePro: ua.indexOf("QunariPhonePro") !== -1,
            iphoneLife: ua.indexOf("QunariPhoneLife") !== -1,
            iphone: ua.indexOf("QunariPhone") !== -1,
            androidLife: ua.indexOf("qunaraphonelife") !== -1,
            android: ua.indexOf("qunaraphone") !== -1,
            weixin: ua.toLowerCase().indexOf('micromessenger') !== -1
        }
    }();

    var noPrizeMsg = [
        '差一点就能中奖了呢，请再接再厉噢',
        '没摇中，一定是姿势不对',
        '你就是传说中的脸黑星人，再试一次吧',
        '你有很强壮的肱二头肌，但是也摇不中奖',
        '今天天气好晴朗，但是摇不到奖',
        '没摇中，洗个手再试试',
        '你与大奖只有一个摇一摇的距离，再试试吧',
        '没中奖，可能是因为长得太帅',
        '人生的真谛就是坚持，再试一次吧',
        '没摇中，去哪儿送你一个么么哒~'
    ];

    //普通青年,完全自理
    return qt.definePage({
        config: {
            init: function () {
                //防止重复添加事件
                window.removeEventListener('devicemotion', function(){}, false);
            },
            ready: function () {
                document.title = uiConfig.title;
                $('body').css('background', uiConfig.background);

                //定位城市
                var myCity = new BMap.LocalCity();
                myCity.get(locationFun);

                //查询活动状态
                checkActivityStatus();
                //检测QunarApi
                checkJsApi();

                qt.qunarApi.ready(function () {
                    QunarAPI.onMenuShare({
                        title: uiConfig.title, // 标题
                        link: window.location.origin + '/activity/lottery/?bd_source=' + bdSource , // 链接URL
                        desc: uiConfig.title, // 描述
                        imgUrl: 'http://img1.qunarzz.com/m_appPromotion/wap/1605/91/734f1c35cf62eaf7.png', // 分享图标
                        success: function () {
                        },// 用户确认分享后执行的回调函数
                        cancel: function () {
                        } // 用户取消分享后执行的回调函数
                    });
                })
            }
        },
        templates: {
            body: function () {
                return _.template(bodyTpl, {data: uiConfig})
            }
        },
        events: {
            'tap .rules-header': 'showRuleDetails',
            'tap .check-prize-btn,.check-myprizelist': 'checkMyPrizeList', //查看我的奖品
            'tap .test-shake': 'test',  //模拟摇一摇
            'tap .share-btn': 'ShareActivity',//分享
            'tap .m_mask': 'hideMask', //隱藏遮罩层
            'tap .ad-wrapper': 'tapAd', //点击广告
            'tap .linkToImg': 'linkToImg',
            '': ''
        },

        linkToImg: function(){
            qt.monitor('yaoyiyao_clickImg');
            location.href = uiConfig.toMainLink + '&bd_source=' + bdSource;
        },

        tapAd: function(e){
            var $target = $(e.currentTarget);
            var url = $target.attr('data-url');
            document.location = url;
        },

        test: function (e) {
            shakeHappening();
        },

        checkMyPrizeList: function() {
            // var mobile = util.localStorage.getItem('mobile');
            qt.monitor('yaoyiyao_goToMyPrizeList');

            if (isLogin) {
                location.href = location.origin + '/activity/lottery/myprizelist?bd_source=' + bdSource;
            } else {
                showPopup(loginTpl);
                $('.user').show();
                $('.user #mobile')[0].focus();
                initLogin();
            }
        },

        showRuleDetails: function () {
            $('.rules-detail').show();
            $('.see-detail').css('opacity',0);
        },

        ShareActivity: function () {
            share();
        },
        hideMask: function (e) {
            var $target = $(e.currentTarget);
            $target.hide();
        }
    });

    function locationFun(result){
        cityName = result && result.name;
        if (!cityName) {
            cityName = '';
        } else if (/香港/.test(cityName)) {
            cityName = '香港';
        } else if (/澳门/.test(cityName)) {
            cityName = '澳门';
        } else {
            cityName = cityName.split('市')[0];
        }
    }

    function prizeListInterval(){
        var ulHeight = $('.prize-list').height();
        var wrapperHeight = $('.prize-list-wrapper').height();

        if (ulHeight > wrapperHeight) {
            setInterval(function(){

                //把第一个挪到最后一个位置上去
                var $dom = $('.prize-list li:first').clone();
                $('.prize-list').append($dom);
                $('.prize-list li:first').remove();

            }, 1000);
        }
    }

    function operateShakeTimes(times) {

        util.localStorage.setItem('shakeTimes', times);

        //更改界面上展示
        $('.avaliable-time').text(times);
    }

    function showPopup(tpl) {

        qt.showPopup({
            noHeader: true,
            noFooter: true,
            animate: 'bounceIn',
            events:{
                'tap .get-prize-now': 'getPrizeNow',    //立即领取
                'tap .close-popup': 'closePopup',   //关闭弹窗(再摇一次、不想要、取消， 明日再战)
                'tap .goto-myprizelist' : 'goToMyPrizeList',    //查看我的奖品
                'tap .goto-main-activity': 'gotoMainActivity', //去主会场
                'tap .share-btn' : 'shareActivityPopup',    //分享
                'tap .vcode_get': 'getVcode',   //获取验证码
                'tap .getBtn': 'getPrizeBtn',   //登陆后领奖
                'tap .giveUpAward': 'giveUpAward',  //放弃
                'tap .login' : 'login', //  登陆

            },
            onShow: function(){

                //弹窗背景颜色
                $('.prize-result').css({
                    background: uiConfig.popUpBackground
                })

                //更改title ，button 颜色
                $('.prize-title span,.vcode_get,.positive-btn,.prize-wrapper').css({
                    background: uiConfig.popUpContentColor
                })
            },

            shareActivityPopup: function(){
                qt.hidePopup();
                share();
            },
            login: function(){
                qt.monitor('yaoyiyao_login');

                instance.login({
                   mobile: $('#mobile').val(),
                   smscode: $('#smscode').val(),
                   onsuccess: function(data) {
                        location.href = location.origin + '/activity/lottery/myprizelist?bd_source=' + bdSource;
                   },
                   onfail: function(data) {
                       showTip({
                           content: data.errmsg,
                           autoHide: true
                       });
                   }
               })
            },

            getPrizeBtn: function(e){
                var $target = $(e.currentTarget);
                var sign = $target.closest('.user').find('.prize-sign').text();
                getPrize(sign);
            },

            getVcode: function() {
                qt.monitor('yaoyiyao_sendSMSCode');

                var $vcode_get = $('.vcode_get');

                if(isdisabled) {
                    return;
                }

                //获取短信验证码
                instance.sendSMSCode({
                    mobile: $('#mobile').val(),
                    captcha: $('#captcha_input').val(),
                    onsuccess: function(data) {
                        util.localStorage.setItem('mobile', $('#mobile').val());

                        isdisabled = true;

                        countDown(60,
                            function(sec) {
                                if(sec == 0) return;
                                $vcode_get.changeHtml(sec,'popup');
                            },
                            function () {
                                $vcode_get.changeHtml('重新获取','popup');
                                isdisabled = false;
                            }
                        );
                    },
                    onfail: function(data) {
                        showTip({
                            content: data.errmsg,
                            autoHide: true
                        });
                    }
                })
            },

            getPrizeNow: function(e){

                qt.monitor('yaoyiyao_getPrizeNow');

                var $target = $(e.currentTarget);

                // var mobile = util.localStorage.getItem('mobile');
                var sign = $target.closest('.prize-result').find('.prize-sign').text();
                if (isLogin) {
                    //领奖
                    getPrize(sign);
                } else {
                    //如果登陆框可见
                    var visible = $('.user').css('display');
                    if (visible === 'none') {
                        initLogin();

                        $('.user').show();
                        $('.user #mobile')[0].focus();
                    } else {
                        //先登录
                        instance.login({
                           mobile: $('#mobile').val(),
                           smscode: $('#smscode').val(),
                           onsuccess: function(data) {
                               isLogin = true;
                               //领奖
                               getPrize(sign);
                           },
                           onfail: function(data) {
                               showTip({
                                   content: data.errmsg,
                                   autoHide: true
                               });
                           }
                       })
                    }
                }
            },

            giveUpAward: function(){
                qt.monitor('yaoyiyao_giveUpAward');
            },

            closePopup: function(){

                qt.hidePopup();

                instance = null;

                isdisabled = false;
            },

            gotoMainActivity: function(){
                qt.monitor('yaoyiyao_gotoMainActivity');
                location.href = uiConfig.toMainLink + '&bd_source=' + bdSource;
            },

            goToMyPrizeList: function(){
                qt.monitor('yaoyiyao_goToMyPrizeList');
                location.href = location.origin + '/activity/lottery/myprizelist?bd_source=' + bdSource;
            },

            message: function () {
                return tpl;
            }(),
            wrapBackground: 'transparent'
        })
    }

    function countDown(sec, func, complete) {
        let ID = setInterval(function () {
            sec --;
            if(typeof func == 'function') {
                func(sec);
            }
            if(sec < 1) {
                window.clearInterval(ID);
                if(typeof complete == 'function') {
                    complete();
                }
            }
        },1000);
    }

    function initLogin(){
        //初始化对象
        if (!instance) {
            instance = ucAPI.quickLogin.create({
                origin: 'hotel-yaoyiyao', //页面标识
                mobileInput: document.getElementById('mobile'), //手机号输入框
                syncLoginStatus: true, //登录成功后是否同步登录态到大客户端
                weixinAuth: false,
                registerAuto:true//自动注册
            });
        }

        instance.on('needShowCaptcha', function() {
            $('#captcha-area').show().find('img').attr('src', instance.getCaptchaUrl());
        })
        instance.on('needHideCaptcha', function() {
            $('#captcha-area').hide();
        });
    }

    function checkActivityStatus() {
        var mobile = util.localStorage.getItem('mobile');
        var postData = {
            url: '/api/activity/lottery/query',
            type: 'get',
            dataType: 'json'
        };

        if (mobile) {
            var sendData = {};
            sendData.mobile = mobile;
            postData.data = sendData;
        }

        $.ajax($.extend(
            postData,
               {
                    success: function(data) {

                        data = $.extend(data, uiConfig);

                        var $html = util.template(templateTpl, data);
                        $('.shake-content-wrapper').append($html);

                        if (data.errcode === 0) {
                            //本地记录可以摇的次数
                            util.localStorage.setItem('shakeTimes', data.data.times);

                            //初始化摇一摇
                            myShakeEvent = new Shake({
                                threshold: 15,
                                shakeFun: shakeHappening
                            });

                            prizeListInterval();
                        } else if (data.errcode === 1 || data.errcode === 7) {
                            // //活动未开始或已结束 动态生成蒙层
                            setTimeout(function(){
                                var wrapperHeight = $('.content-wrapper').height();
                                $('.img_mask').css({
                                    'height': wrapperHeight + 'px',
                                    'width': wrapperHeight + 'px',
                                    'border-radius': wrapperHeight + 'px',
                                    'opacity': '0.4',
                                    'position': 'absolute',
                                    'top': '0',
                                    'left': '50%',
                                    'margin-left': '-' + wrapperHeight/2 + 'px' ,
                                    'background': '#333'
                                });
                            }, 1000);
                        } else {
                            var $errTpl = util.template(errTpl, data);
                            showPopup($errTpl);
                        }
                    },
                    error: function(res) {
                        qt.alert('服务器繁忙，请稍后再试！');
                    }
               }
        ));
    }

    //摇的事件
    function shakeHappening() {

        var shakeTimes = util.localStorage.getItem('shakeTimes');
        var mobile = util.localStorage.getItem('mobile');
        var postData = {
            url: '/api/activity/lottery/shake',
            type: 'get',
            dataType: 'json'
        };
        var sendData = {};
        sendData.times = shakeTimes;
        sendData.cityName = cityName;

        if (mobile) {
            sendData.mobile = mobile;
        }

        postData.data = sendData;

        if (canShake) {
            canShake = false;

            shakeAndPlay(function(){
                qt.monitor('yaoyiyao_shake');
                // 抽奖请求
                $.ajax($.extend(
                    postData,
                    {
                        success: function(res) {
                            canShake = true;

                            if (res.ret) {
                                //如果没抽中，随机展示文案
                                if (res.errcode === 3 ) {
                                    var randomNumber = parseInt(Math.random() * 10, 10);
                                    res.msg = noPrizeMsg[randomNumber];

                                }
                                //展示抽奖结果
                                var resultTpl = util.template(prizeTpl, res);
                                showPopup(resultTpl);

                                if(res.errcode != 6) {
                                    operateShakeTimes( res.data.times);
                                } else {
                                    operateShakeTimes( 0 );
                                }

                            } else {
                                var $errTpl = util.template(errTpl, res);
                                showPopup($errTpl);
                            }
                        },
                        error: function(res) {
                            canShake = true;
                            qt.alert('服务器繁忙，请稍后再试！');
                        }
                    }
                ));
            });

        } else {
            qt.alert('你摇的太频繁了!');
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

    function getPrize(sign) {
        var mobile = util.localStorage.getItem('mobile');
        $.ajax({
            url: '/api/activity/lottery/award',
            data: {
                mobile: mobile,
                sign: sign
                ,cityName: cityName
            },
            dataType: 'json',
            type: 'get',
            success: function (res) {
                if (res.ret) {
                    if (res.errcode === 0) {
                        //领奖成功

                        $('.title').find('.prize-title').hide().end().find('.award').show();
                        $('#mobile').val('');
                        $('#smscode').val('');
                        $('.user').hide();

                        $('.quanr-account').text(res.data.mobile).closest('.get-prize-result').show();

                        $('.prize-result .btns div').hide();
                        $('.prize-result .btns .award').show();

                    } else {
                        showTip({
                            content: res.msg,
                            autoHide: true
                        });
                    }
                } else {
                    showTip({
                        content: res.msg,
                        autoHide: true
                    });
                }
            },

            error: function() {
                alert('服务器繁忙，请稍后再试！');
            }
        })
    }

    function share(){

        qt.monitor('yaoyiyao_share');

        var mobile = util.localStorage.getItem('mobile');
        var postData = {
            url: '/api/activity/lottery/add',
            type: 'get',
            dataType: 'json'
        };
        if (mobile) {
            var sendData = {};
            sendData.mobile = mobile;
            postData.data = sendData;
        }

        //发送增加请求
        $.ajax($.extend(
            postData,
            {
                success: function(res) {

                    setTimeout(function(){
                        if (res.ret) {
                            if (res.errcode === 0) {

                                operateShakeTimes(res.data.times);

                            }
                        }
                    }, 5000);
                },
                error: function(res) {
                    alert('服务器繁忙，请稍后再试！');
                }
            }

        ));

        if (qua.iphonePro || qua.iphoneLife || qua.iphone || qua.androidLife || qua.android) {
            if (jsApi) {
                QunarAPI.hy.showShareItems({
                    success: function () {
                    },
                    fail: function () {
                    }
                });
            } else {
                showTip({
                    content: '点击右上角，邀请小伙伴一起来摇奖吧！',
                    autoHide: true
                });
            }
        } else if (qua.weixin) {
            $('.m_mask').show();
        } else {
            showTip({
                content: '点击浏览器分享按钮，邀请小伙伴一起来摇奖吧！',
                autoHide: true
            });
        }
    }

    function shakeAndPlay(callback) {
        shake();
        play();
        setTimeout(function () {
            callback && typeof callback === "function" && callback();
        }, 1600);
    }

    function shake() {
        var $img = $('.content-img.absolute');
        qt.shake($img);
        setTimeout(function () {
            qt.shakeEnd($img);
        }, 1600)
    }

    function play() {
        var myAudio = document.querySelector('#myAudio');
        myAudio.play();
        setTimeout(function () {
            myAudio.pause();
        }, 1600)
    }

    function showTip(obj) {
        $('#showtoast').find('.content').html(obj.content).end().css('display', 'block');
        if(obj.autoHide){
            setTimeout(function(){
                $('#showtoast').css('display', 'none');
            }, 2000);
        }
    }
})();
