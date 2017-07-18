import map from './map';

import './label';

//翻页
map.mod['pages'] = {
    config: {
        autoInit: true
    },
    init: function(bm, opt = {}) {

        let dtd = $.Deferred();

        if(this.buzy) {
            dtd.reject();
            return dtd;
        }
        //开始忙碌了...
        this.buzy = true;

        this.page = opt.page || this.page || 1;

        if(opt.type){
            switch(opt.type){
                case 'prev':
                    this.page--;
                    break;
                case 'next':
                    this.page++;
                    break;
            }
        }

        let condition = map.store.get('condition');

        // map.store.set(
        //     'condition', 
        //     $.extend(condition,{page: this.page})
        // );

        let location = opt.location || condition.location || '';

        //有定位
        if(location !== ''){
            let gPoint = map.util.decodePoint(location);
            let bPoint = qt.util.g2BPoint(gPoint.lat, gPoint.lng); 
            map.invoke('marker',{ 
                res: {
                    point: bPoint
                } 
            })
            .done((res)=>{
                map.events.triggerHandler('setcity', res);
            });

            //删除标签，排除标注
            _.each(bm.getOverlays(), (overlay) => {
                if(overlay.content){
                    bm.removeOverlay(overlay);    
                }
            });
        }
        //没定位要清除
        else {
            bm.clearOverlays();
            map.store.set('point', '');
        }

        map.events.triggerHandler('pages.before');

        map.invoke('label', { 
            page: this.page, 
            location: location
        })
        .done((res) => {
            let ret = { 
                page: this.page, 
                pageSize: 15,
                totalPage: res.data.totalPage,
                res: res
            };
            dtd.resolve(ret);
            map.events.triggerHandler('pages.done', ret);
        })
        .fail(() => {
            dtd.reject();
            map.events.triggerHandler('pages.fail');
        })
        .always(() => {
            //我忙完了...
            this.buzy = false;
            map.events.triggerHandler('pages.always');
        });

        return dtd;
    }
}

export default map;