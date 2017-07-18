/**
 * Created by taoqili on 15/10/16.
 * 待解决list：
 * 样式导入
 * 缓存
 */
import tpl from './../tpl/index.tpl';
module.exports = (()=> {
    var util = qt.util,
        ua = navigator.userAgent;
    return qt.definePage({
        config: {
            //name: 'prizeDesc',
            init: function () {
                if(ua.toLowerCase().indexOf('qunar') !== -1) {
                    qt.qunarApi.ready(function () {
                        QunarAPI.hideOptionMenu({});//隐藏右上角的分享按钮
                    });
                }
            }
        },
        events: function () {
        }(),
        templates: {
            header: function () {
                //return '<nav class="icon previous left"></nav><h1 class="title">奖品说明</h1>'
                return ''
            },
            subHeader: function () {
                return ''
            },
            body: function () {
                return qt.util.template(tpl, {data: {
                    flight_exchange_time:qt.requestData.flight_exchange_time || '',
                    other_exchange_time:qt.requestData.other_exchange_time || ''
                }})

            },
            footer: ''
        },
        handles: function () {

        }()
    });

})();