/**
 * Created by taoqili on 15/10/26.
 */
import $ from 'zepto';
import util from './util.js';
import qtCache from './qtouch-cache.js';
import qtAnimate from './qtouch-animate.js';
import qtCore from './qtouch-core.js';
export default (()=> {
    var hashHistory = [],
        backScrollTop = 0,
        $win = $(window),
        lock;
    return {
        init: function () {
            var hash = util.getHash(),
                hashInfo = util.getHashInfo(hash),
                requestData = qtCore.requestData,
                $bgPage;

            //直接刷新subPage页面时调回主页面
            if (hashInfo.param['subPage']) {
                delete hashInfo.param['subPage'];
                history.replaceState('', '', '#' + util.param2query(hashInfo.param));
            }

            $(window).off('popstate').on('popstate', function (event) {
                if (lock)return;
                lock = true;
                var hash = util.getHash(),
                    hashInfo = util.getHashInfo(hash),
                    name = hashInfo.param['subPage'],
                    historyLength = hashHistory.length,
                    $wrapper = $('body > .qt-wrapper'),
                    $curPage = $('.qt-page-wrapper.active'),
                    pageDefine,
                    subPage,
                    openOpt;
                //清除所有选取
                getSelection && getSelection().removeAllRanges();

                //关闭页面加载条
                qtCore.hidePageLoader();

                //blur文本框
                $('input').each(function () {
                    this.blur && this.blur()
                });

                //如果hash中不存在name，需要检测当前是否处于子页面状态，如果是，则子页面退出,返回页面首页；否则不做任何处理
                if (!name) {
                    if ($curPage.length) {
                        $bgPage = $wrapper;
                        name = $curPage.attr('id').replace(util.prefix, '');
                        openOpt = qtCache.getOpenOption(name);
                        historyLength && (hashHistory.length = historyLength - 1);
                        closePage(name, $curPage, openOpt);
                    }
                    return lock = false;
                }

                //hash中存在name时，当前仍然可能处于两种状态：
                //1、返回到上一个subPage或者首页；2、新打开一个subPage
                if (hashHistory[historyLength - 2] === hash) {
                    if ($curPage.length) {
                        $bgPage = $('#' + util.prefix + name);
                        name = $curPage.attr('id').replace(util.prefix, '');
                        openOpt = qtCache.getOpenOption(name);
                        historyLength && (hashHistory.length = historyLength - 1);
                        closePage(name, $curPage, openOpt);
                    }
                    return lock = false;
                }

                $bgPage = $curPage.length ? $curPage : $wrapper;


                //保存历史访问记录
                hashHistory.push(hash);

                //从缓存中获取page数据
                pageDefine = qtCache.getPageDefine(name);
                subPage = qtCache.getPage(name);
                if (!pageDefine || !subPage) {
                    util.log('未定义的Page:' + name);
                    return lock = false;
                }
                openOpt = qtCache.getOpenOption(name);
                pageDefine && openPage.call(subPage, pageDefine, openOpt || {});
                lock = false;
            });


            function openPage(pageDefine, openOpt) {

                var me = this,
                    cfg = pageDefine.config,
                    name = cfg.name,
                    $page = $('#' + util.prefix + name),

                    $body = $('body');

                $page.removeClass('qt-hide');
                //设置当前page
                qt && (qt.$cur = $page);

                me.init.call(cfg, requestData, me);
                me.requestData = requestData;

                if (openOpt.forceRefresh || cfg.forceRefresh || !me.hasInit) {
                    qtCore.initEvents(pageDefine, $page, me);
                    qtCore.initTemplates(pageDefine, $page, me);
                    me.hasInit = true;
                }
                
                $page.css('zIndex', openOpt.zIndex ? openOpt.zIndex : (setTimeout(0) + 100)); //默认一个zIndex(100+)， setTimeout(0) 返回一个自增整型

                //TODO 如果在一个子页面a打开一个新的子页面b，那么应该让a滚到顶部，而不是body

                //记录父页面当前位置，并移动到顶部，准备开始动画
                backScrollTop = $win.scrollTop();
                $win.scrollTop(0);

                //解决手机浏览器下transform时fixed的子页面头部抖动问题
                if (cfg.fixedSubHeader) {
                    var $pageSubHeader = $page.find('.qt-page-sub-header'),
                        $pageBody = $page.find('.qt-page-body');
                    $pageSubHeader.css('top', -50);
                    $pageBody.css('top', $pageSubHeader.height() - 50);
                }
                cfg.beforeOpen.call(cfg, requestData, me);

                qtAnimate.transition($bgPage, $page, false, function () {
                    //翻页动画完成时打开页面加载浮层，如果此时已经加载完成，则不打开
                    !me.isReady && qtCore.showPageLoader();
                    //隐藏父页面，防止子页面比父页面短从而露出内容
                    $bgPage.addClass('qt-hide');
                    if ($bgPage.hasClass('qt-page-wrapper')) {
                        $bgPage.removeClass('active');
                    }
                    $pageSubHeader && $pageSubHeader.length && $pageSubHeader.css('top', 0);

                    //修正子页面高度
                    //11.26修改  适配城市关键字切换时的计算错误。
                    var bodyHeight = $body.height();
                    //pageHeight = $('.qt-page-header-wrapper', $page).height() + $('.qt-page-scroll-wrapper', $page).height();
                    //$page.height(bodyHeight > pageHeight ? bodyHeight : pageHeight);
                    $page.height(bodyHeight);
                    openOpt.onOpen && $.type(openOpt.onOpen) === 'function' && openOpt.onOpen.call(cfg, requestData, me);
                    cfg.onOpen.call(cfg, requestData, me);
                    lock = false;
                });
            }

            function closePage(name, $page, openOpt) {
                var pageDefine = qtCache.getPageDefine(name) || {},
                    cfg = pageDefine.config || {};
                $bgPage.removeClass('qt-hide');
                qt.$cur = $bgPage;

                if ($bgPage.hasClass('qt-page-wrapper')) {
                    $bgPage.addClass('active');
                }

                //修复子页面回退时出现的上下抖动先想
                var backMarginTop = $page.css('margin-top');
                $page.css('margin-top',backScrollTop);

                cfg.beforeBack.call(cfg, requestData);
                qtAnimate.transition($bgPage, $page, true, function () {
                    $win.scrollTop(backScrollTop);
                    $page.css('margin-top',backMarginTop);
                    $page.addClass('qt-hide');
                    cfg.afterClose && cfg.afterClose.call(cfg, requestData);
                    var backData = qtCache.getBackData(name);
                    openOpt && openOpt.onBack && openOpt.onBack(backData);
                    cfg.onBack.call(cfg, requestData);
                    lock = false;
                })
            }
        }
    };


})();