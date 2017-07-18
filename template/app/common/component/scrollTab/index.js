/**
 * Created by WebStorm.
 * @date   : 15-10-27
 * @author : 郑家骐(jiaqi.zheng)
 * @link   : touch.qunar.com
 * @desc   :
 */

import scrollTabTpl from './scrollTab.tpl';
//(function ($) {
    function ScrollTab(ele,options) {
        this.opt = $.extend({
            anchor    : ele,     //页面锚点
            tpl       : '',      //组件模板，需要传入QFlick组件完整html结构，为高级用法不建议使用
            events    : {},      //用户自定义事件{'click':function(){}}
            tabs      : [],      //设置选择按钮
            contents  : [],      //设置对应的内容
            doAnimat  :'true',   //是否做展开动画
            onlyFirstAnimat:'true',//仅做首次展开动画
            animatTime:'300ms',  //展开动画时间
            vertical  :'false',  //是否纵向
            defaultHeight:'150px',//默认高度
            defaultWidth :'100%'//默认宽度

        }, options || {});
        this.init();
        //this.initEvents();
    }
    ScrollTab.prototype = {
        constructor  : ScrollTab,
        init         : function () {
            var me = this,
                opt = me.opt;
            var defaultTpl =scrollTabTpl,
                $anchor = $(opt.anchor),
                $tpl = $(opt.tpl || defaultTpl),
                $scrollTabTitle=$tpl.find('.qt-scrollTab-title'),
                $scrollTabContent=$tpl.find('.qt-scrollTab-content'),
                $scrollTabTitleDiv=$tpl.find('.qt-scrollTab-title>div'),
                $scrollTabContentDiv=$tpl.find('.qt-scrollTab-content>div');
            me.$tpl=$tpl;
            me.$scrollTabContentDiv=$scrollTabContentDiv;

            $scrollTabContentDiv.css({'height':opt.defaultHeight,'width':opt.defaultWidth})

            if(opt.tabs.length==0 || opt.contents.length==0){
                buildScrollTab();
            }else {
                var tabs = opt.tabs,
                    contents=opt.contents,
                    $oFragment = $(document.createDocumentFragment());
                $.each(tabs, function (index, tab) {
                    var $tab=$(document.createElement('div')),html=tab.html;
                    $tab.attr('for',tab.for);
                    if(!isEmptyObject(tab.attrs)){
                        $.each(tab.attrs, function (index, attr) {
                            $tab.attr(index,attr);
                        })
                    }
                    $tab.html(typeof html =='function' ? html() : html);
                    tab.active && tab.active=='true' && $tab.addClass('qt-scrollTab-active');
                    $tab.css(tab.css);
                    $oFragment.append($tab);
                })
                $scrollTabTitle.html($oFragment);

                $.each(contents, function (index, content) {
                    var $content=$(document.createElement('div')),html=content.html;
                    $content.attr('name',content.name);
                    if(!isEmptyObject(content.attrs)){
                        $.each(content.attrs, function (index, attr) {
                            $content.attr(index,attr);
                        })
                    }
                    $content.html(typeof html =='function' ? html() : html);
                    $content.css({'height':opt.defaultHeight,'width':opt.defaultWidth}).css(content.css);
                    $oFragment.append($content);
                })
                $scrollTabContent.html($oFragment);
                buildScrollTab();
            }
            function buildScrollTab(){
                $anchor.append($tpl);
                me.showContent($tpl.find('.qt-scrollTab-active').attr('for'));
                ScrollTabDomReady();
            }


            var events = opt.events;
            $.each(events, function (index, event) {
                var kv = $.trim(index).split(/^(\w+)\s+/);
                if (kv.length != 3)return;
                me.$tpl.on(kv[1], kv[2],function (e) {
                    var evt = opt[event];
                    evt && evt.call(this,e);
                });
            });

            function ScrollTabDomReady(){
                $scrollTabTitleDiv=$tpl.find('.qt-scrollTab-title>div'),
                    $scrollTabContentDiv=$tpl.find('.qt-scrollTab-content>div');
                me.$scrollTabContentDiv=$scrollTabContentDiv;

                $scrollTabContent.on('touchmove',function(e){
                    e.stopPropagation();
                })
                //debugger
                $scrollTabTitleDiv.on('click',function(){
                    //debugger
                    var $me=$(this),datafor=$me.attr('for');
                    if($me.hasClass('qt-scrollTab-active')){
                        $scrollTabTitleDiv.removeClass('qt-scrollTab-active');
                        me.hideContent();
                    }else{
                        $scrollTabTitleDiv.removeClass('qt-scrollTab-active');
                        $me.addClass('qt-scrollTab-active');
                        me.showContent(datafor);
                        me.checkedChangeFun($me);
                    }

                })
            }

            function isEmptyObject(obj){
                if(obj && typeof(obj)=='object'){
                    for(var n in obj){return false}
                }
                return true;
            }
        },
        oncheckedChange: function (fun) {
            if(fun && typeof(fun)=='function'){
                this.checkedChangeFun = fun;
            }else{
                this.checkedChangeFun=function(){};
            }
        },
        showContent:function(datafor){
            if(datafor){
                var me=this,
                    $forpart=me.$tpl.find('.qt-scrollTab-content>div[name="'+datafor+'"]'),
                    $scrollTabContentDiv=me.$tpl.find('.qt-scrollTab-content>div'),
                    windowHeight = window.innerHeight,
                    forpartHeight=$forpart.css('height'),
                    doAnimat=me.opt.doAnimat,
                    animatTime=me.opt.animatTime,
                    onlyFirstAnimat=me.opt.onlyFirstAnimat;
                if(onlyFirstAnimat=='true'){
                    if(!$scrollTabContentDiv.hasClass('qt-scrollTab-block')){
                        animatShow();
                    }else{
                        noAnimatShow();
                    }
                }else if(doAnimat=='true'){
                    animatShow();
                }else{
                    noAnimatShow();
                }

                function animatShow(){
                    me.$scrollTabContentDiv.removeClass('qt-scrollTab-block');
                    $forpart.css({'height':'0px'}).addClass('qt-scrollTab-block');
                    $forpart.one('webkitTransitionEnd',function(){
                        $forpart.css({'transition': '','-webkit-transition': '','height':forpartHeight})
                    })
                    setTimeout(function(){
                        $forpart.css({'transition': 'height linear '+animatTime,'-webkit-transition': 'height linear '+animatTime,'height':forpartHeight})
                    },10)
                }
                function noAnimatShow(){
                    me.$scrollTabContentDiv.removeClass('qt-scrollTab-block');
                    $forpart.addClass('qt-scrollTab-block');
                }
                $('.qt-wrapper').css({'height': windowHeight + 'px'}).addClass('qt-scrollTab-overHidden');
            }

        },
        hideContent:function(){
            var me=this,
                doAnimat=me.opt.doAnimat,
                animatTime=me.opt.animatTime,
                onlyFirstAnimat=me.opt.onlyFirstAnimat,
                $forpart=me.$tpl.find('.qt-scrollTab-content .qt-scrollTab-block'),
                forpartHeight=$forpart.css('height');
            if(doAnimat || onlyFirstAnimat){
                $forpart.one('webkitTransitionEnd',function(){
                    me.$scrollTabContentDiv.removeClass('qt-scrollTab-block');
                    $forpart.css({'transition': '','-webkit-transition': '','height':forpartHeight})
                })
                $forpart.css({'transition': 'height linear '+animatTime,'-webkit-transition': 'height linear '+animatTime})
                setTimeout(function(){
                    $forpart.css({'height':0})
                },10);
                $('.qt-wrapper').css({'height': 'auto'}).removeClass('qt-scrollTab-overHidden');

            }else{
                me.$scrollTabContentDiv.removeClass('qt-scrollTab-block');
                $('.qt-wrapper').css({'height': 'auto'}).removeClass('qt-scrollTab-overHidden');
            }

        }

    }


    //插件化且模块化
    //$.pluginModularize('scrollTab', ScrollTab);
//})(Zepto);
//module.exports = {a:1};
module.exports = ScrollTab;


