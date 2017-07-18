/**
 * Created by taoqili on 15/8/7.
 */
import _ from 'underscore';
export default (()=> {
    var storage = {};
    return {
        prefix: 'qt_page_',
        log: function (msg) {
            console && console.log("%c【" + this.dateFormat(new Date, 'yyyy-MM-dd hh:mm:ss') + "】" + msg, "color:green;line-height:1.5");
        },
        template: function () {
            return _.template.apply(this, arguments);
        },
        inherits: function (subClass, superClass) {
            //使用一个空函数来承接父类的原型，并通过实例化该空函数来构造需要的子类原型
            var newFun = function () {
            };
            newFun.prototype = superClass.prototype;
            var instance = new newFun();
            subClass.prototype = $.extend(instance, subClass.prototype);
            //修正子类构造函数
            subClass.prototype.constructor = subClass;
        },
        schemePrefix: function () {
            var ua = navigator.userAgent;
            if (ua.indexOf("QunariPhonePro") !== -1) return 'qunariphonepro';
            if (ua.indexOf("QunariPhoneLife") !== -1) return 'qunariphonelife';
            if (ua.indexOf("QunariPhone") !== -1) return 'qunariphone';
            if (ua.indexOf("qunaraphonelife") !== -1) return 'qunaraphonelife';
            return $.os.ios ? 'qunariphone' : 'qunaraphone';
        },
        changeHash: function (key, value) {
            if (!key)return;
            var me = this;
            //TODO 在ios下有时候存在location.href改变时history不会改变的情况，从而导致无法触发popstate，此处暂时使用延时队列解决
            setTimeout(function () {
                var hash = location.hash.substr(1),
                    hashInfo = me.getHashInfo(hash),
                    oldValue = hashInfo.param[key],
                    href = location.href,
                    path = href.split('#', 2)[0];
                if (oldValue === undefined) {
                    location.href = path + '#' + key + '=' + value;
                } else {
                    if (value === undefined) {
                        delete hashInfo.param[key];
                    } else if (oldValue !== value) {
                        hashInfo.param[key] = value;
                    }
                    location.href = path + '#' + me.param2query(hashInfo.param);
                }
            }, 15)

        },
        // Gets the true hash value. Cannot use location.hash directly due to bug
        // in Firefox where location.hash will always be decoded.
        getHash: function (url) {
            url = url || location.href;
            return url.replace(/^[^#]*#?\/?(.*)\/?$/, '$1')
        },
        /**
         * hash参数解析
         * @param hash
         * @example
         * {{
         *     hash: 'hotel/index/index/city=1&test=2',
         *     action: 'hotel/index/index/',
         *     query: 'city=1&test=2',
         *     param: {
         *         city:'1',
         *         test:'2'
         *     }
         * }}
         */
        getHashInfo: function (hash) {
            var hashInfo = {hash: hash, action: '', query: '', param: {}};
            if (hash) {
                var lastIndex = hash.lastIndexOf('/') + 1;
                hashInfo.action = hash.substring(0, lastIndex);
                hashInfo.query = hash.substring(lastIndex);
                hashInfo.param = this.query2param(hashInfo.query);
            }
            return hashInfo;
        },
        /**
         * a=1&b=2&c=中国  =》 {a:"1","b":2,c:"%E4%B8%AD%E5%9B%BD"}
         * @param query
         * @returns {{}}
         */
        query2param: function (query) {
            if (typeof query !== "string")return {};
            var param = {},
                params, kv;
            params = query.split('&');
            for (var i = 0, len = params.length; i < len; i++) {
                if (!params[i])continue;
                kv = params[i].split('=');
                if (kv[0] && kv[1]) param[kv[0]] = kv[1];
            }
            return param;
        },
        /**
         * {a:"1","b":2,c:"%E4%B8%AD%E5%9B%BD"}  =>  a=1&b=2&c="中国"
         * @param param
         * @returns {*}
         */
        param2query: function (param) {
            if (typeof param !== 'object') return '';
            var queries = [];
            for (var i in param) if (param.hasOwnProperty(i)) {
                param[i] && queries.push(i + '=' + param[i])
            }
            return queries.join('&');
        },
        dateToStr: function (date, showHms) {
            date = this.dateToJson(date);
            return date.y + '-' + this.fixZero(date.m) + '-' + this.fixZero(date.d) + (!showHms ? '' : ' ' + this.fixZero(date.hh) + ':' + fixZero(date.mm) + ':' + fixZero(date.ss) + ' ' + date.mmss);
        },
        fixZero:function (int) {
            return int < 10 ? '0' + int : int;
        },
        strToJson: function (dateStr) {
            return this.dateToJson(this.strToDate(dateStr));
        },
        strToDate: function (dateStr) {
            dateStr = dateStr || '1970-01-01';
            var date = dateStr.split('-');
            return new Date(date[0], +date[1] - 1, date[2]);
        },
        dateToJson: function (date) {
            return {
                y: date.getFullYear(),
                m: date.getMonth() + 1,
                d: date.getDate(),
                hh: date.getHours(),
                mm: date.getMinutes(),
                ss: date.getSeconds(),
                mmss: date.getMilliseconds(),
                w: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()]
            }
        },
        preDayStr: function (dateStr) {
            var date = this.strToDate(dateStr);
            date.setDate(date.getDate() - 1);
            return this.dateToStr(date);
        },
        nextDayStr: function (dateStr) {
            var date = this.strToDate(dateStr);
            return this.dateToStr(new Date((date / 1000 + 86400) * 1000));
        },
        oneDayStr: function (dateStr, num) {
            var date = this.strToDate(dateStr);
            date.setDate(date.getDate() + num);
            return this.dateToStr(date);
        },
        getDateDiff: function (startDate, endDate) {
            var startTime = new Date(startDate).getTime(),
                endTime = new Date(endDate).getTime();
            return Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24);
        },
        compareDate: function (myDateStr, OtherDateStr) {
            return new Date(myDateStr).getTime() > new Date(OtherDateStr).getTime();
        },
        dateFormat: function (date, format) {
            var o = {
                "M+": date.getMonth() + 1,
                "d+": date.getDate(),
                "h+": date.getHours(),
                "m+": date.getMinutes(),
                "s+": date.getSeconds(),
                "q+": Math.floor((date.getMonth() + 3) / 3),
                "S": date.getMilliseconds()
            };
            if (/(y+)/.test(format))
                format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)if (o.hasOwnProperty(k)) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
            return format;
        },
        prevent: function (e) {
            e.stopPropagation();
            e.preventDefault();
        },
        /**
         * 本地存储通用方法；若浏览器处于不支持状态，则会调用内存对象存储
         * @examples
         * util.localStorage.setItem('name1','value1');
         * util.localStorage.getItem('name1');
         * util.localStorage.removeItem('name1');
         */
        localStorage: function () {
            var support = true;
            try {
                localStorage.setItem('___test___', '1');
                localStorage.removeItem('___test___');
            } catch (e) {
                support = false;
            }
            return {
                setItem: function (key, val) {
                    if (!key)return;
                    support ? localStorage.setItem(key, val) : (storage[key] = val);
                },
                getItem: function (key) {
                    return support ? (localStorage.getItem(key) || '') : (storage[key] || '');
                },
                removeItem: function (key) {
                    support ? localStorage.removeItem(key) : delete storage[key];
                }
            };

            //有效期版本
            //var support = true,
            //    separate = '__|__',
            //    keepTimes = {};
            //try {
            //    localStorage.setItem('___test___', '1');
            //    localStorage.removeItem('___test___');
            //} catch (e) {
            //    support = false;
            //}
            //return {
            //    setItem: function (key, val, keepTime) {
            //        if (!key)return;
            //        keepTime && (keepTimes[key] = keepTime);
            //        var time = Date.now();
            //        val = time + separate + val;
            //        support ? localStorage.setItem(key, val) : (storage[key] = val);
            //    },
            //    getItem: function (key) {
            //        if (!key) return;
            //        var time = Date.now(),
            //            keepTime = keepTimes[key],
            //            result = ((support ? localStorage.getItem(key) : storage[key]) || '').split(separate),
            //            result_time = result[0],
            //            result_value = result[1];
            //        if (!keepTime || (time - result_time <= keepTime)) {
            //            return result_value;
            //        } else {
            //            this.removeItem(key);
            //        }
            //    },
            //    removeItem: function (key) {
            //        support ? localStorage.removeItem(key) : delete storage[key];
            //    }
            //}
        }(),
        /**
         *
         * @param selector
         * @param option
         * @param context 不定参数集合，将会按顺序传递给事件句柄
         */
        delegateEvents: function (selector, option, ...context) {
            if (!selector || !option || !option.events) return;

            var events = option.events,
                $dom = $(selector);

            if (!$dom.length) return;

            $dom.off();
            $.each(events, function (index, event) {
                var kv = $.trim(index).split(/^(\w+)\s+/);
                if (kv.length != 3)return;
                $dom.on(kv[1], kv[2], function (e) {
                    var handle = option[event] || option.handles[event];
                    handle && typeof handle === 'function' && handle.apply(option, [e].concat(context));
                });
            });
        },
        //百度转谷歌坐标
        b2GPoint: function (bdLat, bdLng) {
            var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
            var x = bdLng - 0.0065, y = bdLat - 0.006;
            var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
            var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
            var gcjLng = z * Math.cos(theta);
            var gcjLat = z * Math.sin(theta);
            return {'lat': gcjLat, 'lng': gcjLng};
        },
        //谷歌转百度坐标
        g2BPoint: function (gLat, gLng) {
            let bLng, bLat, z, theta, x_pi = 3.14159265358979324 * 3000.0 / 180.0,
                x = gLng, y = gLat;
            z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
            theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
            bLng = z * Math.cos(theta) + 0.0065;
            bLat = z * Math.sin(theta) + 0.006;
            return {'lat': bLat, 'lng': bLng};
        },
        //定位城市格式化
        formatCity: function (cityName) {
            if (!cityName)return '';
            if (/香港/.test(cityName)) {
                cityName = '香港';
            } else if (/澳门/.test(cityName)) {
                cityName = '澳门';
            } else {
                cityName = cityName.split(/县|市|区/)[0];
            }
            return cityName;
        },

        //定位
        location: function (detailFn, onlyCityNameFn, timeOut) {
            if (typeof BMap === 'undefined')return;
            var me = this,
                emptyFn = new Function();

            detailFn = $.type(detailFn) === 'function' ? detailFn : emptyFn;
            onlyCityNameFn = $.type(onlyCityNameFn) === 'function' ? onlyCityNameFn : emptyFn;
            timeOut = $.type(timeOut) === 'number' ? timeOut : 5000;

            var locationTimeout = false, //指定timeout之后，如果还没定位成功，那即使之后定位成功了，也不予执行
                localCity = new BMap.LocalCity(),
                geolocation = new BMap.Geolocation(),
                timer = setTimeout(function () {
                    locationTimeout = true;
                    localCity.get(getCityName);
                }, timeOut);
            geolocation.getCurrentPosition(function (r) {
                if (this.getStatus() == '0' && !locationTimeout) {
                    clearTimeout(timer);
                    var googleLocation = me.b2GPoint(r.point.lat || 0, r.point.lng || 0),
                        gcjLat = googleLocation.lat,
                        gcjLng = googleLocation.lng,
                        qPoint = "gg|" + gcjLat + "|" + gcjLng,
                        returnData = {
                            bdPoint: r.point,
                            ggPoint: {lat: gcjLat, lng: gcjLng},
                            qPoint: qPoint
                        };
                    new BMap.Geocoder().getLocation(r.point, function (l) {
                        returnData.address = l.addressComponents.city + '' + l.addressComponents.district + '' + l.addressComponents.street;
                        returnData.city = l.addressComponents.city;
                        detailFn(returnData);
                    });

                } else if (!locationTimeout) {
                    clearTimeout(timer);
                    localCity.get(getCityName);
                }
            }, {enableHighAccuracy: true});

            function getCityName(result) {
                var cityName = me.formatCity(result && result.name);
                onlyCityNameFn(cityName);
            }
        },
        cookie: function (key, value, path, expires) {
            var cookie = document.cookie,
                start = cookie.indexOf(key + "="),
                end;
            if (value) {
                document.cookie = encodeURIComponent(key) + '=' + encodeURIComponent(value) + ((expires == null) ? '' : ';expires=' + expires.toGMTString()) + ((path == null) ? '' : ';path=' + path);
                return;
            }
            if (start != -1) {
                start = start + key.length + 1;
                end = cookie.indexOf(";", start);
                if (end == -1) {
                    end = cookie.length;
                }
                return decodeURIComponent(cookie.substring(start, end))
            }
        }


    }
})();
