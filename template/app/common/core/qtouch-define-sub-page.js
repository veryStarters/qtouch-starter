/**
 * Created by taoqili on 15/10/11.
 */
import $ from 'zepto';
import util from './util.js';
import qtRoute from './qtouch-route.js';
import qtCache from './qtouch-cache.js';
import defaultTpl from './subpage-tpl.tpl';
export default  (()=> {
    var emptyFn = new Function();

    return function (pageDefine) {
        pageDefine = $.extend({
            config: {}
        }, pageDefine || {});
        pageDefine.config = $.extend({
            name: '',
            animate: 'cover',
            forceRefresh: false,
            fixedSubHeader: false,
            beforeOpen: emptyFn,
            afterClose: emptyFn,
            beforeBack: emptyFn,
            onBack: emptyFn,
            onOpen: emptyFn,
            init: emptyFn,
            ready: emptyFn
        }, pageDefine.config);

        var cfg = pageDefine.config,
            name = cfg.name,
            animate = cfg.animate,
            $pagesWrapper = $('body > .qt-pages-wrapper'),
            $page = $(defaultTpl);
        if (cfg.fixedSubHeader) {
            $page.find('.qt-page-sub-header').addClass('fixed')
        }
        if (!name) {
            util.log('子页面名称未定义！');
            return;
        }

        var id = util.prefix + name;
        $page.attr('id', id);
        $page.data('transition', animate);
        $pagesWrapper.append($page);
        var subPage = {
            init: cfg.init,
            ready: cfg.ready,
            onOpen: cfg.onOpen,
            beforeOpen: cfg.beforeOpen,
            afterClose: cfg.afterClose,
            onBack: cfg.onBack,
            beforeBack: cfg.beforeBack,
            open: function (opt) {
                qtCache.setOpenOption(name, opt);
                util.changeHash('subPage', name);
            },
            back: function (data) {
                qtCache.setBackData(name, data);
                history.back();
            }
        };
        qtCache.setPageDefine(name, pageDefine);
        qtCache.setPage(name, subPage);

        return subPage;
    }
})();