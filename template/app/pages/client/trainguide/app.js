/**
 * Created by taoqili on 15/8/28.
 */
import qt from 'qt';
module.exports = (()=> {
    //普通青年,完全自理
    return qt.definePage({
        config: {
            ready: function () {
                var bodyHeight = $('.qt-body').height() + 6;
                $('#iframe').attr('src', 'webviewjscallback://ready?height=' + bodyHeight);
            }
        },
        events: {
            'tap div.skip': 'skipToHourRoom'
        },
        skipToHourRoom: function (e) {
            var req = qt.requestData,
                fromForLog = req.fromForLog ||'181',
                checkInDate = time2date(req.checkInDate),
                checkOutDate = qt.util.nextDayStr(checkInDate),
                city = req.city || '',
                keyword = req.keyword||'';

            $.ajax({
                url: '/api/hotel/city/convert?city=' + city,
                dataType: 'json',
                success: function (data) {
                    var cityUrl = data.data || '';
                    location.href = qt.util.schemePrefix() + '://hotel/hourRoomList?city=' + city + '&cityUrl=' + cityUrl + '&fromDate=' + checkInDate + '&q=' + keyword+ '&toDate=' + checkOutDate + '&fromForLog='+ fromForLog
                }

            });
            qt.monitor('train_guide_hour');

        },
        templates: {
            header: ''
        }
    });//火车票返回的时间格式形如 201607021224
    function time2date(time) {
        var now = new Date(), date;
        time = time || (qt.util.dateToStr(now).replace(/-/g, '') + '0000');
        date = ('' + time).substr(0, 8);
        date = date.substr(0, 4) + '-' + date.substr(4, 2) + '-' + date.substr(6, 2);
        return date;
    }

})();