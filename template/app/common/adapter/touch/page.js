/**
 * Created by taoqili on 15/10/15.
 */
import $ from 'zepto';
import util from '../../core/util.js'
export default (()=> {

    return {
        /**
         *
         * @param url
         * 打开一个scheme           hotel/xxadf/xxx
         * 打开一个内嵌webview       touch.qunar.com/
         * @param opt
         */

        open: function (url, opt) {
            if (!url)return;
            opt = $.extend({
                data: {},
                type: 'webview' //scheme
            }, opt || {});
            var ua = navigator.userAgent.match(/((?:Q|q)unar.+?)\/(\d+)/),
                prefix = ua && ua.length >= 3 ? ua[1].toLowerCase() : '',
                query = '';
            if (!$.isEmptyObject(opt.data)) {
                query = util.param2query(param);
            }
            url = url + (url.indexOf('?') === -1 ? '?' : '&') + query;
            if(url.endsWith('?')){
                url = url.replace('?','');
            }
            if (!prefix) {
                if (opt.type === 'webview') {
                    location.href = url;
                }
                return;
            }

            if (opt.type === 'webview') {
                location.href = prefix + '://hy?url=' + encodeURIComponent(url);
            } else {
                location.href = prefix + '://' + url;
            }
        }
    };

})();