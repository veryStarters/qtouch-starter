import map from './map';

import './marker';
import './pages';

//获取当前位置模块
map.mod['location'] = {
    config: {
        autoInit: false
    },
    init: function(bm, opt = {}) {
        let dtd = $.Deferred();
        map.util.getLocation()
           .then(
                (res) => {
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
                    
                    //map.invoke('marker', { res: res});
                    map.util.convertCoord(res.point.lat,res.point.lng)
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
                                    localSearch: 1
                                })
                            );

                            map.invoke('pages',{ location: data, page: 1 })
                               .done((res)=>{
                                    map.store.set('condition', condition, true, res);
                               })
                               .always(() => {
                                    dtd.resolve();    
                               })
                            
                       },(msg) => {
                            dtd.reject(msg);
                       });
               }, 
               (msg) => {
                    dtd.reject(msg);
               }
            );

        return dtd;
    }
};

export default map;