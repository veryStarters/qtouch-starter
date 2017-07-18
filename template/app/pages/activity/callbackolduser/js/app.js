/**
 * Created on 2016/1/7.
 */
import _ from 'underscore';
import resultTpl from '../tpl/result.tpl';//领取结果
import indexTpl from '../tpl/index.tpl';//初始页面

module.exports = (()=> {

    var util = qt.util;
    var isdisabled = false;
    var jsApi = false;

    var href = location.search.slice(1);
    var urlParams = util.query2param(href);
    var hotelSeq = urlParams.hotelseq;
    var bdSource = urlParams.bd_source;

    //浏览器类型
    var qua = function () {
        var ua = navigator.userAgent;
        return {
            iphonePro: ua.indexOf("QunariPhonePro") !== -1,
            iphoneLife: ua.indexOf("QunariPhoneLife") !== -1,
            iphone: ua.indexOf("QunariPhone") !== -1,
            androidLife: ua.indexOf("qunaraphonelife") !== -1,
            android: ua.indexOf("qunaraphone") !== -1,
            weixin: ua.toLowerCase().indexOf('micromessenger')!==-1
        }
    }();

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

              //检测是否有领取
              checkLocalPhone();

              //检测QunarApi
              checkJsApi();

                qt.qunarApi.ready(function () {
                    QunarAPI.onMenuShare({
                        title: '去哪儿礼包限时放送，预订酒店5折起，还有200元现金拿不停！', // 标题
                        link: window.location.origin + '/activity/callbackolduser/?bd_source=' + bdSource + '&hotelseq=' + hotelSeq, // 链接URL
                        desc: '去哪儿礼包限时放送，预订酒店5折起，还有200元现金拿不停！', // 描述
                        imgUrl: 'http://img1.qunarzz.com/m_appPromotion/wap/1604/49/eaadd72fa27de5f7.png', // 分享图标
                        success: function () {
                        },// 用户确认分享后执行的回调函数
                        cancel: function () {
                        } // 用户取消分享后执行的回调函数
                    });
                })
            }
        },
        events: {
            'tap .vcode_get': 'getVcode',//获取验证码
            'tap .getBtn': 'getPacket',//获取礼包
            'tap .goToUseBtn': 'goToUseBtn',  //  立即使用
            'tap .default-hide': 'showOrHideRegular',//展示规则
            'tap .inviteBtn,.shareBtn': 'inviteBtn', // 分享
            'tap .change-number': 'changePhoneNumber', //更换手机号
            'tap .m_mask': 'hideMask' //隱藏遮罩层
        },
        templates: {
            body:function(){
                // let userId = qt.commonParam.userId || 'default';
                // let callbackolduser = util.localStorage.getItem('callbackolduser');
                // callbackolduser = callbackolduser ? JSON.parse(callbackolduser) : {};
                // if(callbackolduser[userId] == '0') {
                //     return util.template(resultTpl,callbackolduser);
                // }else {
                    // return util.template(indexTpl,{});
                // }

                return indexTpl;
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
                    url: '/api/activity/logincode',
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
                let $qt_body = $('.template-wrapper');

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

                getPacketCoupou(phone, vcode);
            },

            goToUseBtn: function(){
              var fromForLog = getfromForLog(bdSource);

              //加监控
              qt.monitor('callbackolduser_goToUse');

              if (!hotelSeq) {
                var searchUrl = '';
                var search = '://hotel/main?bd_source='+bdSource+'&fromForLog='+fromForLog+'&cat'+bdSource;;//参数不全
                //hotelSeq不存在 客户端里跳转到酒店搜索主页，非客户端去应用宝
                if (qua.iphonePro) {
                    searchUrl = "qunariphonepro" + search;
                } else if (qua.iphoneLife) {
                    searchUrl = "qunariphonelife" + search;
                } else if (qua.iphone) {
                    searchUrl = "qunariphone" + search;
                } else if (qua.androidLife) {
                    searchUrl = "qunaraphonelife" + search;
                } else if (qua.android) {
                    searchUrl = "qunaraphone" + search;
                } else {
                    //去应用宝
                    searchUrl = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.Qunar';
                }
                window.location.href = searchUrl;

              } else {
                //hotelSeq 存在

                  var detailUrl = '';
                  var detail = '://hotel/detail?type=1&ids='+hotelSeq+'&needRoomVendor=0&fromForLog='+fromForLog+'&cat'+bdSource;//参数不全

                  //hotelSeq不存在 客户端里跳转到酒店搜索主页，非客户端去应用宝
                  if (qua.iphonePro) {
                      detailUrl = "qunariphonepro" + detail;
                  } else if (qua.iphoneLife) {
                      detailUrl = "qunariphonelife" + detail;
                  } else if (qua.iphone) {
                      detailUrl = "qunariphone" + detail;
                  } else if (qua.androidLife) {
                      detailUrl = "qunaraphonelife" + detail;
                  } else if (qua.android) {
                      detailUrl = "qunaraphone" + detail;
                  } else {
                    //浏览器中  安装qunar客户端 -- 唤起 ，否则 去appstore
                    var hscheme = encodeURIComponent('hotel/detail/?ids=' + hotelSeq + '&needRoomVendor=0');
                    var touchUrl = ('download?bd_source=' + bdSource)
                    var tUrl = encodeURIComponent(touchUrl);
                    detailUrl = 'http://touch.qunar.com/h5/client?bd_source=' + bdSource + '&sScheme=0&scheme=' + hscheme + '&touchUrl=' + tUrl;
                  }

                  window.location.href = detailUrl;
              }
            },

            inviteBtn: function(){
              //加监控
              qt.monitor('callbackolduser_inviteFriend');

              if (qua.iphonePro || qua.iphoneLife || qua.iphone || qua.androidLife || qua.android){
                if (jsApi) {
                    QunarAPI.hy.showShareItems({
                        success: function () {
                        },
                        fail: function () {
                        }
                    });
                } else {
                  qt.alert('点击分享按钮，给小伙伴发礼包吧');
                }
              } else if (qua.weixin) {
                   $('.m_mask').show();
              } else {
                qt.alert('点击浏览器分享按钮，给小伙伴发礼包吧');
              }
            },

            changePhoneNumber: function(){
              //加监控
              qt.monitor('callbackolduser_changePhoneNumber');

              $('.qt-body').html(indexTpl);
              $('.regular_wp').find('.default-hide').hide().end().find('.regular').show();
              $.Captcha.refreshCaptcha();
              util.localStorage.setItem('phone', '');
            },

            showOrHideRegular:function(){
              $('.regular_wp').find('.default-hide').hide().end().find('.regular').show();
            },

            hideMask: function(e){
              var $target = $(e.currentTarget);
              $target.hide();
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

    function getfromForLog(bdSource) {
        var bd_source = bdSource || '';
        return 1000 + parseInt(bd_source.replace('huodong', '') || 0);
    };

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

    function checkLocalPhone(){
      var phone = util.localStorage.getItem('phone');
      if (phone) {
        getPacketCoupou(phone);
      }
    }

    function getPacketCoupou(phone, vcode){

      var $qt_body = $('.template-wrapper');
      var senderData = {
        action: 'submit'
      }
      senderData.mobile = phone;
      if (vcode) {
        senderData.vcode = vcode;
      }

      qt.showPageLoader();
      $.ajax({
          url: '/api/activity/callbackolduser',
          type: 'get',
          dataType: 'json',
          data: senderData,
          success: function (data) {
              qt.hidePageLoader();
              if(!data.ret) {
                  qt.alert('服务器繁忙，请稍后再试！');
              }else {
                  data = data.data;
                  if ( data.status < 0) {
                    qt.alert(data.msg);
                    $.Captcha.refreshCaptcha();
                  } else {
                    util.localStorage.setItem('phone',phone);
                    $qt_body.html(util.template(resultTpl,data));
                    data.couponId ? $('.hasNoRight').show() : $('.hasNoRight').hide();
                    $('.regular_wp').find('.default-hide').show().end().find('.regular').hide();
                  }
              }
          },
          error: function(err) {
              qt.hidePageLoader();
              qt.alert('服务器繁忙，请稍后再试！');
          }
      });
    }

    function randdir() {
        return ('00000' + Math.ceil(Math.random()*100000)).slice(-5);
    }
})();
