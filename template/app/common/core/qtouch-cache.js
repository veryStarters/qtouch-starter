/**
 * Created by WebStorm.
 * @date   : 14-8-24
 * @author : 陶启立(taoqili)
 * @link   : touch.qunar.com
 * @desc   :
 */
import $ from 'zepto';
import util from './util.js';
export default  (()=> {

    //页面定义集合,生成于registerPage阶段,数据结构为{routeReg:pageDefine}
    var pages = {},
        pageDefines = {},
        openOptions = {},
        backDatas = {},
        emptyFn = new Function;

    return {
        getPageDefine: function (name) {
            return pageDefines[name];
        },
        setPageDefine: function (name, pageDefine) {

            if (!name || !pageDefine || $.type(pageDefine) !== 'object' || !pageDefine.config) {
                util.log('pageDefine不存在或者数据类型错误');
                return;
            }
            if (pageDefines[name]) {
                util.log('page（' + name + '）已存在，请勿重复注册');
                return;
            }
            pageDefines[name] = pageDefine;
        },
        getPage: function (name) {
            return pages[name];
        },
        setPage: function (name, page) {
            if (!name || !page) {
                return;
            }
            pages[name] = page;
        },
        getOpenOption: function (pageName) {
            return openOptions[pageName];
        },
        setOpenOption: function (pageName, openOption) {
            if (!pageName || !openOption) {
                return;
            }
            openOptions[pageName] = $.extend({
                data: {},
                onOpen: emptyFn,
                onBack: emptyFn,
                beforeOpen:emptyFn,
                beforeBack:emptyFn,
                afterClose:emptyFn
            }, openOption || {});
        },
        setBackData: function (name, data) {
            if (!name || !data) {
                return;
            }
            backDatas[name] = data;
        },
        getBackData: function (name) {
            var backData = backDatas[name];
            delete backDatas[name];
            return backData;
        }


    };
})();