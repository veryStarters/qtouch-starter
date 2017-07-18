import map from './map';

//创建标注模块
map.mod['marker'] = {
    config: {
        autoInit: false
    },
    init: function(bm, opt = {}) {

        let dtd = $.Deferred();

        let point = new BMap.Point(opt.res.point.lng, opt.res.point.lat);

        map.store.set('point', point);

        let marker = new BMap.Marker(point);
        
        marker.enableMassClear();
        bm.clearOverlays();
        //bm.panTo(point);

        let label,
            text = '目的地';

        let getInfo = function(){
                let _dtd = $.Deferred();
                if(opt.res.address){
                    _dtd.resolve(opt.res.address);
                }
                else{
                    let gc = new BMap.Geocoder();
                    gc.getLocation(point, function(res){
                        _dtd.resolve(res && res.addressComponents);
                    });
                }
                return _dtd;
            };

        getInfo()
            .done((addComp) => {
                if(addComp && (addComp.city || addComp.district || addComp.street)){
                    text = addComp.city + addComp.district + addComp.street;
                }
                label = new BMap.Label(`<div class="label marker">${text}</div>`,{'position':point,'offset':new BMap.Size(-75,-25)});

                label.setStyle({border : 'none',backgroundColor :'none',paddingBottom : '5px'});
                marker.setLabel(label);
                bm.addOverlay(marker);

                dtd.resolve(addComp);
            });

        return dtd;
    }
};

export default map;