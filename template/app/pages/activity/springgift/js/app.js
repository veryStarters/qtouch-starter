/**
 * Created by changan.song on 2016/1/7.
 */
import _ from 'underscore';
import resultTpl from '../tpl/result.tpl';
import indexTpl from '../tpl/index.tpl';

module.exports = (()=> {

    var util = qt.util;
    var isdisabled = false;
    //普通青年,基本完全自理
    return qt.definePage({
        config: {
            init: function () {
                    var _Captcha = {
                        initCaptcha:function(duration){
                            var interval = duration || 1000*60*3 ;
                            $.getJSON('https://secapi.qunar.com/api/noCaptcha/get.json?callback=?', function(captcha){
                                util.cookie('QN254',captcha,'/',new Date(Date.now() + interval));
                            });
                            window.Timer = setTimeout(this.initCaptcha,interval);
                        },
                        refreshCaptcha:function(){
                            clearTimeout(window.Timer);
                            this.initCaptcha();
                        }
                    }
                    _Captcha.initCaptcha();
                    $.Captcha = _Captcha;
            },
            ready: function () {
            }
        },
        events: {
            'tap .vcode_get': 'getVcode',
            'tap .getBtn': 'getPacket',
            'tap .jumpBtn': 'jumpTo'
        },
        templates: {
            body:function(){
                let userId = qt.commonParam.userId || 'default';
                let springgift = util.localStorage.getItem('springgift');
                springgift = springgift ? JSON.parse(springgift) : {};
                if(springgift[userId] == '0') {
                    return util.template(resultTpl,{code: 0});
                }else if(springgift[userId] == '-1'){
                    return util.template(resultTpl,{code: -1});
                }else {
                    return util.template(indexTpl,{});
                }

            }
        },
        handles: {
            getVcode: function() {
                let phone = $('.phone input').val();
                let $vcode_get = $('.vcode_get');

                if(isdisabled) {
                    return;
                }
                if(!phone) {
                    qt.alert('手机号码为空，请输入手机号码');
                    return;
                }
                if(!checkPhone(phone)) {
                    qt.alert('手机号码有误，请重新输入');
                    return;
                }
                if(navigator.onLine != undefined) {
                    if(!navigator.onLine){
                        qt.alert('网络异常，请稍后再试');
                        return;
                    }
                }
                $.ajax({
                    url: '/api/activity/springgift',
                    type: 'get',
                    dataType: 'json',
                    data: {
                        action: 'smsCode',
                        mobile: phone
                    },
                    success: function(data) {
                        if(!data.ret) {
                            qt.alert('服务器繁忙，请稍后再试！');
                        }else if(!data.data.ret) {
                            qt.alert(data.data.errmsg)
                        }
                    },
                    error: function (err) {
                        qt.alert('服务器繁忙，请稍后再试！');
                    }
                });

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
            getPacket: function (e, req) {
                let phone = $('.phone input').val();
                let vcode = $('.vcode_input input ').val();
                let couponId = req.couponId;
                let $qt_body = $('.qt-body');

                if(!phone) {
                    qt.alert('手机号码为空，请输入手机号码');
                    return;
                }
                if(!checkPhone(phone)) {
                    qt.alert('手机号码有误，请重新输入');
                    return;
                }
                if(!vcode) {
                    qt.alert('验证码为空，请输入验证码');
                    return;
                }
                if(navigator.onLine != undefined) {
                    if(!navigator.onLine){
                        qt.alert('网络异常，请稍后再试');
                        return;
                    }
                }
                qt.showPageLoader();
                $.ajax({
                    url: '/api/activity/springgift',
                    type: 'get',
                    dataType: 'json',
                    data: {
                        action: 'submit',
                        mobile: phone,
                        couponId: couponId,
                        vcode: vcode
                    },
                    success: function (data) {
                        qt.hidePageLoader();
                        if(!data.ret) {
                            qt.alert('服务器繁忙，请稍后再试！');
                        }else {
                            data = data.data;
                            switch (data.code) {
                                case 0:
                                    location.href = data.url;
                                    break;
                                case -1:
                                    qt.alert('验证码错误');
                                    $.Captcha.refreshCaptcha();
                                    break;
                                case -2:
                                    ;
                                default :
                                    $qt_body.html(util.template(resultTpl,{code: data.code}));
                            }
                        }
                    },
                    error: function(err) {
                        qt.hidePageLoader();
                        qt.alert('服务器繁忙，请稍后再试！');
                    }
                });
            },
            
            jumpTo: function() {
                location.href = 'http://touch.qunar.com/h5/client?bd_source=qunar&sScheme=0&scheme=' + encodeURIComponent('hy?url=' + encodeURIComponent(qt.commonParam.host.touch + '/activity/airlineticket/ticketfree')) + '&touchUrl=download';
            }
        }
    });

    function checkPhone(phone) {
        return /^1[0-9]{10}$/.test(phone);
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
})();