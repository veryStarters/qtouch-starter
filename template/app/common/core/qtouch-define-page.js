/**
 * Created by taoqili on 15/10/16.
 */
import util from './util.js'
import qtCore from './qtouch-core.js'
import qtRoute from './qtouch-route.js'
export default (()=> {
    return function (pageDefine) {
        var emptyFn = new Function;
        pageDefine = $.extend({
            config: {},
            events: {},
            templates: {},
            handles: {}
        }, pageDefine || {});
        return {
            init: function () {
                var init = pageDefine.config.init || emptyFn,
                    $wrapper = $('body > .qt-wrapper'),
                    loc = util.localStorage;

                //新老touch工程中的localStorage差异
                try {
                    var date = loc.getItem('TOUCH_SEARCH_CALANDER_DATE') || loc.removeItem('TOUCH_CHECKED');
                    JSON.parse(date || '{}');
                } catch (e) {
                    loc.removeItem('TOUCH_SEARCH_CALANDER_DATE');
                    loc.removeItem('TOUCH_LOCATION');
                    loc.removeItem('TOUCH_CHECKED');
                    loc.removeItem('TOUCH_HISTORY_KEYWORD');
                    loc.removeItem('TOUCH_HISTORY_CITY');
                    loc.removeItem('TOUCH_HISTORY_CITY_HOUR');
                }

                init.call(pageDefine, qtCore.requestData);
                //事件绑定初始化
                qtCore.initEvents(pageDefine, $wrapper);
                //模板初始化
                qtCore.initTemplates(pageDefine, $wrapper);
                //路由初始化
                qtRoute.init();
            }
        };


    }
})();