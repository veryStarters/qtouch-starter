import map from './map';

import './marker';
import './pages';

//长按地图模块
map.mod['longpress'] = {
    config: {
        autoInit: true
    },
    init: function(bm, opt = {}) {
        let store = map.store.get('condition') || {};

        //有这个参数的时候禁止长按地图选择目的地。。
        //不晓得逻辑。
        if($.trim(store.category) !== '') return;

        this.events(bm);
    },
    events: function(bm){

        let me = this,
            longtimer = 600,
            st,et,timer;
        //模拟长按
        bm.addEventListener('touchstart', function(e) {
            if(e.touches.length > 1) return;

            timer && clearTimeout(timer);
            timer = setTimeout(() => {
                me.getPoint(e);
            },longtimer);
            st = +new Date();
        }, false);

        bm.addEventListener('touchmove', function() {
            timer && clearTimeout(timer);
        }, false);

        bm.addEventListener('touchend', function() {
            if(+new Date() - st <= longtimer){
                timer && clearTimeout(timer);
            }
        }, false);
    },
    getPoint: function(e) {
        let condition = map.store.get('condition');

        let extra = condition.extra;

        if($.isEmptyObject(condition.extra)){
            extra = '';
        }
        else{
            if(typeof extra === 'string'){
                extra = decodeURIComponent(extra);
                extra = JSON.parse(extra);    
            }
            extra.R && (extra.R = ''); //行政区
            extra.LA && (extra.LA = ''); //商圈
            extra.T && (extra.T = ''); //商圈
            extra = encodeURIComponent(JSON.stringify(extra));
        }

        map.events.triggerHandler('longpress.before');
        //map.invoke('marker',{ res: e });
        map.util.convertCoord(e.point.lat,e.point.lng)
           .then((data)=>{
            
                //清空这些字段
                map.store.set(
                    'condition', 
                    $.extend(condition,{
                        keywords: '',
                        extra: extra,
                        city: '',
                        cityUrl: '',
                        location: data,
                        page: 1,
                        localSearch: 2
                    })
                );

                map.invoke('pages',{ location: data, page: 1 })
                   .done((res)=>{
                        map.store.set('condition', condition, true, res);
                   })
                   .always(() => {
                        map.events.triggerHandler('longpress.done');
                   });
           },(msg) => {
                qt.alert(msg);
           });
    }
};

export default map;