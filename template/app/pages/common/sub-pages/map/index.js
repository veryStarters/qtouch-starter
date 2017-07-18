import tpl from './index.tpl';
import bmap from './baidu';
import gmap from './google';

export default (() => {

    let map;

    return qt.defineSubPage({

        config: {
            name: 'map',
            ready: function() {

                let tabH = qt.$('.tab').height();

                //国际城市去掉一些功能
                if(qt.getTransferData().isGJ) {
                    map = gmap;
                    tabH = 0;
                    qt.$('.tab,.i-location,.i-hotel').hide();
                }
                else{
                    map = bmap;
                }

                $('#map').height(
                    $(window).height() - qt.$('.qt-page-header-wrapper').height() - tabH
                );

                map.load();
            }
        },
        templates: {
            header: function () {
                let trafer = qt.getTransferData() || {},
                    title = trafer.title || '';
                return [
                    `<nav class="icon previous left"></nav>`,
                    `<h1 class="title">${title}</h1>`
                ].join('');
            },
            body: tpl
        },
        events: {
            'tap .mod-map .tab li': 'switchInfo', //切换信息
            'tap .map-content .i-location': 'getLocation', //定位
            'tap .map-content .i-hotel': 'panToHotel'  //移动到酒店
        },
        handles: {
            switchInfo: function(e) {
                let $this = $(e.currentTarget),
                    $parent = $this.parent(), //数据缓存在父级DOM上
                    data = $parent.data('res'),
                    type = $this.attr('data-for'),
                    trafer = qt.getTransferData();

                if($this.hasClass('active')){
                    return;
                }

                $this.addClass('active').siblings('li').removeClass('active');

                if(data){
                    map.renderMap(type, data[type]);
                }
                else{
                    $.ajax({
                        url: '/api/hotel/hoteldetail/surroundings',
                        dataType: 'json',
                        data: {
                            seq: trafer.seq,
                            checkInDate: trafer.checkInDate,
                            checkOutDate: trafer.checkOutDate
                        },
                        success: (res) => {
                            if(res.errcode === 0){
                                $parent.data('res', res.data);
                                map.renderMap(type, res.data[type]);
                            }
                        }
                    });
                }
            },
            getLocation: function(e) {
                let $this = $(e.currentTarget);

                if($this.data('load')) {
                    return;
                }

                $this.data('load', true);

                map.getLocation()
                   .done(()=>{
                        $this.data('load', false);
                   });
            },
            panToHotel: function() {
                map.panTo();
            }
        }

    });

})();

