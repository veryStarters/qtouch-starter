module.exports = (() => {
    var util = qt.util,
        schema = util.schemePrefix();
    return qt.definePage({
        config: {
            init: function() {},
            ready: function() {}
        },
        events: {
            'tap .showhotel a': 'toHotelList'
        },
        handles: {
            toHotelList: () => {
                var todayDate = util.dateFormat(new Date(), "yyyy-MM-dd"),
                    params = {
                        fromDate: todayDate,
                        toDate: util.nextDayStr(todayDate),
                        city: encodeURIComponent('首尔'),
                        cityUrl: 'seoul',
                        fromForLog: 259
                    };
                window.location.href =schema+"://hotel/main?"+util.param2query(params)+"&keyword=";
            }
        }
    });
})();
