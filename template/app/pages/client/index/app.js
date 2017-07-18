/**
 * Created by taoqili on 15/8/28.
 */
import qt from 'qt';
module.exports = (()=> {
    /**
     * client接口参数说明
     * @scheme    客户端scheme,无需拼接前缀,从hotel或者home开始; 也可以设置成touch地址,表示通过客户端的webview来打开该地址
     *            格式上有如下两种形式
     *            1、加密（http://wiki.corp.qunar.com/download/attachments/58042497/AESCoderIMF.java?version=1&modificationDate=1434524650000）
     *            2、编码（urlEncode）
     * @sScheme   指定scheme的格式, 默认值为1,表示采用加密方式;如无加密需求,可设置为0
     * @schemeProtocol   客户端伪协议名称,默认为qunariphone(IOS)或者qunaraphone(ADR);
     * @touchUrl  当调起客户端scheme失败时访问的touch页面地址,通常为download,下载客户端
     * @downType  指定客户端下载方式,1表示应用宝,2标识appStore,3标识去哪儿渠道下载
     * @navigator 默认0,有native导航头,且包含title;1,有导航头,但不包含title,需要通过qunarAPI设置;2,隐藏导航头
     */
    var util = qt.util,
        data = qt.firstData,
        req = qt.requestData,
        useHy = req.type === 1 || data.scheme && data.scheme.indexOf('http') !== -1,
        ua = navigator.userAgent,
        isWX = /MicroMessenger/ig.test(ua),
        isQQ = /MQQBrowser/ig.test(ua),
        isQunar = /qunar/ig.test(ua),
        isAndroid = /android/ig.test(ua),
        isIos = /iphone|ipod/ig.test(ua),
        iosVer8 = /OS [1-8]_\d like Mac OS X/ig.test(ua),
        schemePrefix = req.schemeProtocol || util.schemePrefix(),
        downType = function () {

            //微信或者QQ内,默认走应用宝
            if (isWX || isQQ) {
                return req.downType || 1;
            }
            return qt.requestData.downType || 3;
        }(),
        touchUrl = function () {
            var url = data.touchUrl;
            if (!url)return '';

            //兼容老版,如果touchUrl不以http开头,则自动加上老版h5前缀
            if (url.indexOf('http') !== 0) {
                url = encodeURIComponent('http://touch.qunar.com/h5/' + decodeURIComponent(url));
            }
            return url;
        }(),
        downUrl = [
            '',
            encodeURIComponent('http://a.app.qq.com/o/simple.jsp?pkgname=com.Qunar'),
            encodeURIComponent('https://itunes.apple.com/cn/app/id395096736'),
            encodeURIComponent('http://touch.qunar.com/h5/download?bd_source=' + qt.commonParam.cookieBdSource)
        ][downType];


    //普通青年,完全自理
    return qt.definePage({
        config: {
            ready: function () {
                var $iframe = $('#iframe'),
                    scheme = data.scheme || 'home',
                    appScheme = schemePrefix + '://' + (!useHy ? scheme : ('hy?url=' + encodeURIComponent(scheme)));

                if (useHy) {
                    let type = +req.navigator || 0;
                    appScheme += ('&type=' + (type === 0 ? 'browser' : type === 1 ? 'navibar-none' : ''));
                }

                //在去哪儿客户端内的,直接调起scheme
                if (isQunar) {
                    location.href = appScheme;
                    return;
                }

                //微信、QQ里面不需要尝试调起客户端,直接走下载流程;除非强制指定了downType
                if (isWX || isQQ) {
                    if (+downType === 3) {
                        $('.share img').attr('src',
                            'http://simg1.qunarzz.com/site/images/wap/touch/images/v2/zhuanti/wx_downloadView/' +
                            (isIos ? 'ios' : 'android') + '_download2.jpg');
                        $('.share').show();
                        return;
                    }
                    location.href = decodeURIComponent(downUrl);
                    return;
                }

                //不在客户端&微信内统一显示正在
                qt.showLoader('.loading', '正在尝试打开客户端, 请稍候… ');

                //其他渠道下尝试调起客户端
                if (iosVer8) {
                    $iframe.src = appScheme;
                } else {
                    location.href = appScheme;
                }

                setTimeout(function () {
                    if (document.webkitHidden || document.hidden || document.visibilityState === 'hidden') {
                        console.log(downUrl);
                    } else {
                        location.href = decodeURIComponent(touchUrl || downUrl);
                    }
                }, 3000)

            }
        }

    });


})();
