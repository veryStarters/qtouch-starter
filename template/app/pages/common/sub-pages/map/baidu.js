export default (function() {

    let bm, //百度地图
        hotelPoint; //酒店坐标

    /**
     * 添加标注
     * @param  {Object} point 坐标信息 { lat: '', lng: ''}
     * @param  {String} type  类型 
     * @return BMap.Lable
     */
    let addLabel = (point, type = 'hotel') => {

        // css className map
        let icon = {
            hotel: 'office', //当前酒店
            restaurant: 'q-food', //餐饮
            ent: 'q-recreation', //娱乐
            park: 'q-menpiao', //景点
            traffic: 'q-train' //交通
        }

        let label = new BMap.Label(
            `<div class="label ${type}"><i class="icon ${icon[type]}"></i><i class="icon arrow-down-4 dot"></i></div>`, {
                'position': point,
                'offset': new BMap.Size(-24, -25)
            }
        );

        label.setStyle({
            border: 'none',
            backgroundColor: 'none',
            paddingBottom: '5px'
        });

        if (type === 'hotel') {
            label.setZIndex(2);
        }

        bm.addOverlay(label);

        return label;
    };

    /**
     * 给标签添加弹层显示详细信息
     * @param  {Object BMap.Label} label 百度地图标签
     * @param  {Object BMap.Point} point 百度坐标
     * @param  {Object} json  模板数据 { name: '名称', distance: '距离' }
     */
    let addPop = (label, point, json) => {
        let iwTpl = '<div class="iw-cnt">' + '<a class="iw-title"><%-name%></a>' + '<%if(distance > 0) {%><a class="iw-desc qt-font14 qt-lh2">' + '<%if(Math.round(distance) > 1000){%>' + '距目的地<%-(Math.round(distance)/1000).toFixed(1)%>公里' + '<%}else{%>' + '距目的地<%-distance%>米' + '<%}%>' + '</a><% }else{%>' + '<a class="iw-address"><%-address%></a>' + '<%}%>' + '</div>';

        let iw = new BMap.InfoWindow(
            _.template(iwTpl, json), {
                'enableMessage': false,
                'offset': new BMap.Size(0, -25)
            }
        );

        label.addEventListener('click', function() {
            this.setZIndex(3);
            bm.panTo(point);
            bm.openInfoWindow(iw, point);
        });

        iw.addEventListener('close', function() {
            label.setZIndex($(label.content).hasClass('hotel') ? 2 : 1);
        });
    };

    /**
     * 在地图输出各个地点
     * @param  {String} name 类型
     * @param  {Array}  data 数据
     */
    let renderMap = (type, data) => {

        let points = [],
            point, bPoint, x, y;

        //清除现有的标签
        _.each(bm.getOverlays(), (overlay) => {
            //保留酒店label，其他都干掉
            if (!$(overlay.content).hasClass('hotel')) {
                bm.removeOverlay(overlay);
            }
        });

        /* item => {
               "distance": "26174",
               "name": "北京首都国际机场",
               "gpoint": "40.054990,116.614739" 
           }
         */
        _.each(data, (item) => {

            x = item.gpoint.split(',')[1]; //从后端获得的数据的lng和lat的顺序与BMap.Point反着
            y = item.gpoint.split(',')[0];
            bPoint = qt.util.g2BPoint(y, x);
            point = new BMap.Point(bPoint.lng, bPoint.lat);
            points.push(point);

            addPop(
                addLabel(point, type),
                point, {
                    'name': item.name,
                    'distance': item.distance
                }
            );
        });

        points.push(hotelPoint);

        //bm.setZoom(bm.getViewport(points).zoom);

        bm.setViewport(points, {
            enableAnimation: true,
            margins: [20, 30, 10, 20]
        });

    };

    /**
     * 加载当前线路到酒店的线路规划
     * @param  {BMap.Point} point 起点的百度地图坐标
     */
    let loadLine = (point) => {
        //清除线路
        _.each(bm.getOverlays(), (overlay) => {
            if (overlay.content === undefined) {
                bm.removeOverlay(overlay);
            }
        });

        let driving = new BMap.DrivingRoute(bm, {
            renderOptions: {
                map: bm,
                autoViewport: true
            }
        });

        driving.search(point, hotelPoint);

        driving.setMarkersSetCallback(function(arr) {
            bm.removeOverlay(arr[arr.length - 1].marker);
        });
    };

    let panTo = () => {
        bm.panTo(hotelPoint);
    };

    let getLocation = () => {
        let dtd = $.Deferred();
        (new BMap.Geolocation()).getCurrentPosition(function(res) {
            switch (this.getStatus()) {
                case BMAP_STATUS_SUCCESS:
                    loadLine(res.point);
                    break;
                case BMAP_STATUS_PERMISSION_DENIED:
                    qt.alert({
                        message: '您拒绝了位置共享，无法获取您当前的位置',
                        okText: '知道了'
                    });
                    break;
                default:
                    qt.alert({
                        title: '获取当前位置失败！',
                        message: '请在设置中开启定位服务和WIFI，以提高定位成功率。',
                        okText: '知道了'
                    });
            }
            // if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            //     loadLine(res.point);
            // } else if (this.getStatus() == BMAP_STATUS_PERMISSION_DENIED) {
            //     qt.alert({
            //         message: '您拒绝了位置共享，无法获取您当前的位置',
            //         okText: '知道了'
            //     });
            // } else {
            //     qt.alert({
            //         title: '获取当前位置失败！',
            //         message: '请在设置中开启定位服务和WIFI，以提高定位成功率。',
            //         okText: '知道了'
            //     });
            // }
            dtd.resolve();
        }, {
            enableHighAccuracy: true
        });

        return dtd;
    };

    let load = () => {

        let traferData = qt.getTransferData(),
            g2bPoint = qt.util.g2BPoint(traferData.point.lat, traferData.point.lng),
            ggPoint = qt.requestData.location || qt.util.localStorage.getItem('TOUCH_LOCATION'); //gg|39.9776174065379|116.30568382070295

        hotelPoint = new BMap.Point(g2bPoint.lng, g2bPoint.lat);

        //初始化地图
        bm = new BMap.Map('map', {
            enableHighResolution: true,
            enableMapClick: false
        });

        //加载中心点
        bm.centerAndZoom(hotelPoint, 16);

        addPop(addLabel(hotelPoint), hotelPoint, {
            'name': traferData.title,
            'distance': 0,
            'address': traferData.address
        });

        if (ggPoint) {
            ggPoint = ggPoint.split('|');
            if (ggPoint.length === 3) {
                //google => baidu point
                ggPoint = qt.util.g2BPoint(ggPoint[1], ggPoint[2]);
                //loadLine(new BMap.Point(ggPoint.lng, ggPoint.lat));
                loadLine(new BMap.Point(ggPoint[2], ggPoint[1]));
            }
        }
    };

    return {
        load, renderMap, panTo, getLocation
    };

})();