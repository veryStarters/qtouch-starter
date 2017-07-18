import map from './map';

//创建标签模块
map.mod['label'] = {
    config: {
        autoInit: false
    },
    init: function(bm, opt = {}){

        let condition = map.store.get('condition');

        this.options = {
            url: '/api/hotel/hotellist'
        };
        if($.isEmptyObject(condition.extra)){
            condition.extra = '';
        }
        else{
            //因为不知道传进来的这个字段是否是源码还是已经编码过一次了
            //为保证是源码，先解码一次，在编码
            condition.extra = decodeURIComponent(condition.extra);
            condition.extra = encodeURIComponent(condition.extra);
        }

        this.requestParams = $.extend({
            page: 1
        }, condition, opt);
        
        return this.request()
                    .done((res) => {
                        this.render(bm, res);
                    })
                    .fail(() => {
                        map.util.setCenter(this.requestParams.city);
                        //bm.setZoom(12);
                        qt.alert('未找到符合您条件的酒店，请您扩大搜索范围');
                    })
                    .always(() => {
                        delete this.requestParams.page;
                        //修改URL
                        qt.href()
                          .param(this.requestParams)
                          .replace();
                    });
    },
    request: function(){
        let dtd = $.Deferred(),
            storeKey = 'label.cache',
            dataKey = this.options.url + $.param(this.requestParams),
            store = map.store.get(storeKey) || {},
            succFn = (res) => {
                if(res.errcode === 0 && res.data && res.data.hotels && res.data.hotels.length){
                    dtd.resolve(res);
                }
                else{
                    dtd.reject(res);
                }
            };

        if(store[dataKey]){
            succFn(store[dataKey]);
        }
        else{
            $.ajax({
                url : this.options.url + '?' + qt.util.param2query(this.requestParams),
                //不可以用data，因为zepto内部要编码
                //data : this.requestParams,
                dataType:'json',
                success: (res) => {
                    store[dataKey] = res;
                    map.store.set(storeKey, store);
                    succFn(res);
                },
                error: () => {
                    qt.util.log(arguments);
                }
            });
        }

        return dtd;
    },
    starMap: {
        '5': '五星级酒店',
        '4': '四星级酒店',
        '3': '三星级酒店',
        '<2': '二星及其他'
    },
    dangciMap: {
        '5': '二星及其他',
        '4': '豪华(同五星)',
        '3': '高档(同四星)',
        '2': '三星及舒适',
        '1': '经济型'
    },
    render: function(bm, res) {
        let params = {
                city: this.requestParams.city || '',
                cityUrl: this.requestParams.cityUrl || '',
                extra: this.requestParams.extra || '',
                checkInDate: this.requestParams.checkInDate || '',
                checkOutDate: this.requestParams.checkOutDate || '',
                keywords: this.requestParams.keywords || '',
                location: this.requestParams.location || '',
                type: this.requestParams.type || ''
            },
            hotels = res.data.hotels,
            len = hotels.length,
            points = [],
            zIndex = 0,
            i = 0,
            item, x, y, label, point, bPoint, price, tplData,
            star, url, iw;

        for(; i < len; i++){
            item = hotels[i],
            x = item.attrs.gpoint.split(',')[1];  //从后端获得的数据的lng和lat的顺序与BMap.Point反着
            y = item.attrs.gpoint.split(',')[0];
            bPoint = qt.util.g2BPoint(y, x);
            point = new BMap.Point(bPoint.lng, bPoint.lat);
            points.push(point);
            price = parseInt(item.price);

            if(price > 0){
                if(price === res.data.minPrice){
                    tplData = { className: 'bg-min', text: '&yen;' + item.price + '<em>起</em>' };
                    zIndex = 2;
                }
                else {
                    tplData = { className: '', text: '&yen;' + item.price + '<em>起</em>' };
                    zIndex = 1
                }
            } else if (price === -1) {
                tplData = { className: 'bg-empty', text: '已满房' };
            } else {
                tplData = { className: 'bg-empty', text: '暂无报价' };
            }

            //添加标签
            label = new BMap.Label(
                _.template('<div class="label <%=className%>"><%=text%></div>', tplData),
                {'position': point,'offset': new BMap.Size(-24,-25)}
            );
            label.setStyle({border : 'none',backgroundColor :'none',paddingBottom : '5px'});
            bm.addOverlay(label);
            star = item.attrs.dangciText;

            ((_item,_label,_point)=>{

                url = "/hotel/hoteldetail?city="+params.city+'&cityUrl='+params.cityUrl+'&checkInDate='+params.checkInDate+'&checkOutDate='+params.checkOutDate+'&keywords='+params.keywords+'&type='+params.type+'&extra='+ params.extra+'&location='+params.location+'&seq='+item.id + '#state=map';

                let iw = new BMap.InfoWindow(`<div class="iw-cnt">
                                                  <a href="${url}" class="iw-title">
                                                      ${_item.attrs.hotelName}
                                                  </a>
                                                  <a href="${url}" class="iw-desc">
                                                      <div class="iw-poi-cnt qt-arrow r-thick">${star + "　" + _item.attrs.CommentScore}分 /  ${_item.attrs.CommentCount}个评论</div>
                                                  </a>
                                              </div>`,
                                              {'enableMessage':false,'offset':new BMap.Size(0,-25)}
                                            );

                _label.addEventListener('click',function(){
                    this.setZIndex(3);
                    bm.panTo(_point);
                    bm.openInfoWindow(iw,_point);
                });
                iw.addEventListener('close',function(){
                    if(_label.content.indexOf('bg-min') !== -1){
                        _label.setZIndex(2);
                    }else if(_label.content.indexOf('bg-empty') !== -1){
                        _label.setZIndex(0);
                    }else{
                        _label.setZIndex(1);
                    }
                });
            })(item,label,point);
        }
        
        bm.setZoom(bm.getViewport(points).zoom);

        if(map.store.get('point')){
            bm.panTo(map.store.get('point'));  
        }
        else{
            bm.setViewport(points,{
                enableAnimation: false,
                margins: [20,30,10,20]
            });
        }
    }
};

export default map;