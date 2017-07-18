/**
 * 地图页面
 * 
 */
import tplMap from '../tpl/map.tpl';
import map from './map/map';
import './map/label';
import './map/location';
import './map/longpress';
import './map/marker';
import './map/pages';

let util = qt.util;

module.exports = (() => {

    /**
     * 多层混入
     * @param  {Object} receive   接收者
     * @param  {Object} supplier  提供者
     * @return {Object} 混合后对象
     */
    let depthMix = (() => {

        //处理相同 function  
        let mergeFn = function(){
            let queue = [].slice.call(arguments);
            return function (){
                let fn;
                while(fn = queue.shift()) {
                    fn.apply(this, [].slice.call(arguments));
                }
            }
        };

        return function mix(receive, supplier) {
            let args = [].slice.call(arguments),
                i = 1,
                key;

            while (supplier = args[i++]) {
                for (key in supplier) {
                    if ($.isPlainObject(supplier[key])) {
                        //接收者没有则初始化 {} 避免 undefinded.属性 报错
                        !receive[key] && (receive[key] = {});
                        mix(receive[key], supplier[key]);
                    }
                    else {
                        if(receive[key]) {
                            if($.isFunction(supplier[key])){
                                receive[key] = mergeFn(receive[key], supplier[key]);
                            }
                            else{
                                util.log(`注意：模块[${key}]与接收者有冲突`);
                            }
                            
                        }
                        else{
                            receive[key] = supplier[key];    
                        }
                    }
                }
            };

            return receive;
        };

    })();

    //地图，列表切换动画
    let toggleEffect = {
        buzy: false,
        'in': 'animating filpCenterIn',
        'out': 'animating filpCenterOut',
        'inrev': 'animating filpCenterInRev',
        'outrev': 'animating filpCenterOutRev',
    };

    // fix 动画效果闪动问题，闪动产生是由 .qt-sub-header{ top: -50px; } 引起
    let fixEffect = {
        start: function(){
            $('.qt-sub-header').css({'paddingTop':0,'top':50});
        },
        end: function(){
            $('.qt-sub-header').css({'paddingTop':'', 'top': ''});
        }
    };

    // 步骤动画..  animStep.push().push().exec();
    let animStep = {
        _queue: [],
        push: function(/*selector, effect, callback*/) {
            this._queue.push([].slice.call(arguments));
            return this;
        },
        exec: function(){
            let eventEnd = $.fx.animationEnd,
                fx = this._queue.shift();
    
            if(fx) {
                $(fx[0])
                    .addClass(fx[1])
                    .one(eventEnd, () => {
                        $(fx[0]).removeClass(fx[1]);
                        fx[2] && fx[2]();
                        this.exec();
                    });
            }
        }
    };

    //分页，防止快速点击
    let getPageBuzy = false;

    return {
        /**
         * 多层混入到父级页面
         */
        mix: function(obj) {
            return depthMix(obj, this.definePage);
        },
        // 返回地图对象
        core: map,
        //页面
        definePage: {
            config: {
                ready : function(requestData){
                    //console.log(requestData)
                    //监听翻页完成后处理UI
                    let me = this;
                    map.events
                        .on('pages.before', function(){
                            qt.showTips();
                        })
                        .on('pages.done', function(e, res) {
                            let $prev = $('.pages .page[data-type="prev"]', map.$map),
                                $next = $('.pages .page[data-type="next"]', map.$map);

                            // 只有一页
                            if(res.totalPage === 1){
                                $prev.addClass('disabled');
                                $next.addClass('disabled');   
                            }
                            else{
                                $prev[res.page === 1 ? 'addClass' : 'removeClass']('disabled');
                                $next[res.page === res.totalPage || res.totalPage === 1 ? 'addClass' : 'removeClass']('disabled');    
                            }
                            
                            $('.pages .number',map.$map).html(`第${(res.page-1)*res.pageSize+1}~${res.pageSize * res.page}家`);
                        })
                        .on('pages.fail', function(){
                            $('.pages .page', map.$map).addClass('disabled');
                            $('.pages .number', map.$map).html('共找到0家');
                        })
                        .on('pages.always', function(){
                            qt.hideTips();
                        })
                        .on('longpress.before', function(){
                            //长按地图不需要在提示了
                            $('.longpress', map.$map).remove();
                        })
                        //筛选条件改变时触发
                        .on('filterConditionChange', function(e, _condition,callback){
                            //当前是地图模式，城市切换成国际的时候，切换回列表模式
                            if(map.store.get('isGj')){
                                $('#toggleMap').trigger('tap');
                                return false;
                            }
                            map.store.set('condition', _condition);
                            getPageBuzy = true;
                            map.invoke('pages', { page: 1 })
                               .done(function(data){
                                   callback && callback(data.res.data||{});
                               })
                               .always(()=>{
                                    getPageBuzy = false;
                               });
                        });

                    if(map.store.get('isGj')){
                        $('#toggleMap').addClass('qt-hide');
                    }

                    if(qt.href().hash('state') === 'map') {
                        $('#toggleMap').trigger('tap');
                    }
                }
            },
            events: {
                'tap #toggleMap': 'toggleMap', //列表与地图模块切换
                'tap .map-content .get-location': 'getLocation', //浏览器定位
                'tap .map-content .pages .page': 'getPages' // 翻页
            },
            handles: {
                toggleMap: function(e, requestData) {
                    qt.hideSidebar(1);
                    qt.$('.qt-client-download').hide();

                    //map menu
                    let $this = $(e.currentTarget),
                        $list = $('.list-content'),
                        $map = $('.map-content'),
                        qtHref = qt.href();
                    
                    //动画未完，不能切换
                    if(toggleEffect.buzy) return;
                    toggleEffect.buzy = true;
                    window.scrollTo(0,0);
                    fixEffect.start();

                    //显示地图
                    if($this.hasClass('map')){

                        $this.removeClass('map')
                             .addClass('menu');

                        map.events.triggerHandler('showMap');
                        qt.monitor('hotellist_from_list_to_map');
                        animStep
                            .push($list, toggleEffect.out, () => {
                                $list.addClass('qt-hide');
                                qt.showLoader($('.loading', $map), '地图加载中...');
                                $map.removeClass('qt-hide');  
                            })
                            .push($map, toggleEffect.in, () => {
                                fixEffect.end();

                                //地图加载过
                                if(map.store.get('loaded')){
                                    map.invoke('pages', { page: 1 });
                                }
                                //第一次加载
                                else{
                                    map.load({
                                        id: 'bmap',
                                        formId: $map,
                                        template: _.template(tplMap,{ category: requestData.category || '' }),
                                        oneBefore: () => {
                                            qt.hideLoader();
                                            $map.height($(window).height() - $('.qt-sub-header').height());
                                        },
                                        // new BMap 后触发
                                        oneNewBMap: () => {
                                            let location = map.store.get('condition').location || '',
                                                point;
                                            //加载 market
                                            if(location !== ''){
                                                point = map.util.decodePoint(location);
                                                map.util.setCenter([point.lng,point.lat]);
                                            }
                                        }
                                    });
                                }
                                qtHref.hash('state', 'map').replace();
                                toggleEffect.buzy = false;
                            })
                            .exec();
                    }
                    //显示列表
                    else{
                        $this.addClass('map')
                             .removeClass('menu');

                        qt.monitor('hotellist_from_map_to_list')

                        animStep
                            .push($map, toggleEffect.outrev, () => {
                                $map.addClass('qt-hide');
                                $list.removeClass('qt-hide');
                            })
                            .push($list, toggleEffect.inrev, () => {
                                fixEffect.end();
                                toggleEffect.buzy = false;
                                map.events.triggerHandler('showList');
                                qtHref.hash('state', 'list').replace();
                            })
                            .exec();
                    }
                },
                getLocation: function(e) {
                    let $this = $(e.currentTarget),
                        icon = $this.html();

                    if($this.hasClass('loading')) {
                        return;
                    }

                    //移除长按地图提示
                    $('.longpress', map.$map).remove();

                    $this.html('正在获取位置...').addClass('loading');

                    qt.monitor('hotellist_longtap_locaiton');


                    map.invoke('location')
                       .fail((msg) => {
                            qt.alert({
                                message: msg,
                                okText: '知道了'
                            });
                        })
                       .always(() => {
                            $this.html(icon).removeClass('loading');
                       });
                },
                getPages: function(e) {
                    let $this = $(e.currentTarget);
                    
                    if($this.hasClass('disabled') || getPageBuzy){
                        return;
                    }
                    getPageBuzy = true;

                    // data-type  =>  prev or next
                    map.invoke('pages', { type: $this.attr('data-type') })
                       .always(() => {
                            getPageBuzy = false;
                       });
                }
            }
        }
    }

})();
