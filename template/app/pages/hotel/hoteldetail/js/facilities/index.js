/**
 * Created by taoqili on 15/10/16.
 * 待解决list：
 * 样式导入
 * 缓存
 */
import tpl from './index.tpl';
module.exports = (()=> {
    var util = qt.util;
    return qt.defineSubPage({
        config: {
            name: 'facilities',
            animate:'slideUp'
        },
        events: function () {
            return {
                'tap .all-facilities': 'showAllFacilities',
            };
        }(),
        templates: {
            header: function () {
                var transferData = qt.getTransferData();
                return '<nav class="icon previous left"></nav><h1 class="title">' + (transferData.hotelName || '') + '</h1>'
            },
            subHeader: function (requestData, subPage) {
                return ''
            },
            body: function (requestData, subPage) {
                return {
                    url: '/api/hotel/hoteldetail/info',
                    data: {
                        seq: requestData.seq,
                    },
                    dataType: 'json',
                    success: function (data) {
                        if (data.errcode === 0) {
                            return qt.util.template(tpl, data);
                        } else {
                            qt.alert(data.msg);
                            return '';
                        }
                    },
                    error: function () {
                        qt.alert('网络异常，请稍后重试！');
                    }
                }

            },
            footer: ''
        },
        handles: function () {
            return {
                showAllFacilities: function (e) {
                    var $me = $(e.currentTarget),
                        $qtArrow = $me.find('.qt-arrow');
                    if ($qtArrow.hasClass('t')) {
                        $qtArrow.html('查看全部设施').removeClass('t');
                    } else {
                        $qtArrow.html('收起').addClass('t');
                    }
                    qt.$('.hidden-facilities').toggleClass("qt-hide");
                }
            };
        }()
    });

})();