/**
 * 地图core
 */

let map = (() => {

    let bm;

    return {
        //创建一个zepto对象，
        //用来派发事件和数据存储
        events: $('<i>'),
        load: function(options){

            let me = this,
                noop = function(){},
                opt;

            if(me.store.get('loaded')) return;

            me.store.set('loaded', true); //保存地图加载状态

            opt = me.options = $.extend({
                oneBefore: noop,    //插入地图DOM之前触发
                oneReady: noop,     //地图DOM就绪触发
                oneNewBMap: noop,  // new BMap完成后
                onLoaded: noop    //地图加载完成触发,触发很频繁。包括地图图片加载完成也会触发，谨慎用
            },options);

            me.options.oneBefore();

            //插入地图DOM
            me.$map = $(opt.formId).html(opt.template);
            
            me.options.oneReady();
            
            //初始化地图
            bm = new BMap.Map(opt.id,{
                enableHighResolution: true, // false 为不自动适配高分辨率屏幕
                //devicePixelRatio: 2,
                enableMapClick: false
            });

            me.options.oneNewBMap();

            //初始化事件
            bm.addEventListener('tilesloaded',() => {
                this.options.onLoaded();
            });

            //执行需要自动初始化的模块
            _.each(me.mod, (p) => {
                p.config.autoInit && p.init(bm);
            });
        },
        /**
         * 提供模块调用方法
         * @param  {String} name 模块名
         * @param  {JSON}   opt  配置
         * @return {Object}      返回$.Deferredd对象
         */
        invoke: function(name, opt){
            let mod = this.mod[name];
            if(mod){
                return mod.init(bm, opt);
            }
            else{
                qt.alert(name + '模块不存在...');
            }
        },
        //存放模块
        mod: {},
        //数据仓库
        store: {
            get: (key) => {
                return map.events.data(key);
            },
            set: function(key, val, b) {
                map.events.data(key, val);
                b && map.events.triggerHandler('change' + key.replace(/\b(\w)|\s(\w)/g, function(m){  
                        return m.toUpperCase();
                     }), [val].concat([].slice.call(arguments,3)));
            }
        },
        //卸载方法
        destroy: function() {
            let me = this;
            //卸载事件
            me.events.remove();
            me.events = $('<i>');
            //卸载配置
            me.options = {};
            bm = null;
            loaded = false;
            //卸载DOM
            me.$map.html('');
        },
        //地图操作一些通用方法
        util: {
            //设置地图中心点
            setCenter: function(point, zoom = 12) {
                //根据城市定位
                if(typeof point === 'string' && point !== ''){
                    bm.centerAndZoom(point, zoom);
                }
                //根据经纬度定位
                else if($.isArray(point) && point.length === 2){
                    bm.centerAndZoom(new BMap.Point(point[0],point[1]), zoom);
                }
                //根据IP定位
                else{
                    (new BMap.LocalCity()).get(function(res){
                        bm.centerAndZoom(res.name, res.level);
                    });
                }
            },
            //返回定位信息
            getLocation: function(){
                let dtd = $.Deferred();
                    
                (new BMap.Geolocation()).getCurrentPosition(function(res){
                    if(this.getStatus() == BMAP_STATUS_SUCCESS){
                        dtd.resolve(res);
                    }else if(this.getStatus() == BMAP_STATUS_PERMISSION_DENIED){
                        dtd.reject('您拒绝了位置共享，无法获取您当前的位置');
                    }else{
                        dtd.reject('<p class="qt-black qt-bold qt-font16 qt-pb10">获取当前位置失败！</p>请在设置中开启定位服务和WIFI，以提高定位成功率。');
                    }
                },{enableHighAccuracy: true});

                return dtd;
                //关于状态码
                //BMAP_STATUS_SUCCESS   检索成功。对应数值“0”。
                //BMAP_STATUS_CITY_LIST 城市列表。对应数值“1”。
                //BMAP_STATUS_UNKNOWN_LOCATION  位置结果未知。对应数值“2”。
                //BMAP_STATUS_UNKNOWN_ROUTE 导航结果未知。对应数值“3”。
                //BMAP_STATUS_INVALID_KEY   非法密钥。对应数值“4”。
                //BMAP_STATUS_INVALID_REQUEST   非法请求。对应数值“5”。
                //BMAP_STATUS_PERMISSION_DENIED 没有权限。对应数值“6”。(自 1.1 新增)
                //BMAP_STATUS_SERVICE_UNAVAILABLE   服务不可用。对应数值“7”。(自 1.1 新增)
                //BMAP_STATUS_TIMEOUT   超时。对应数值“8”。(自 1.1 新增)
            },
            // 百度坐标转谷歌坐标
            convertCoord: function(lat, lng){
                let dtd = $.Deferred();
                let point = qt.util.b2GPoint(lat, lng);
                dtd.resolve(encodeURIComponent('gg|' + point.lat + '|' + point.lng));
                return dtd;
            },
            decodePoint: function(str){
                //str => ggenc|NDAuMTMzMjg0MjMzOTQx|MTE2LjA5MDY4ODc0Nzgz
                str = decodeURIComponent(str);
                str = str.split('|');
                return {
                    lat: str[1],
                    lng: str[2]
                }
            }
        }
    };

})();

export default map;