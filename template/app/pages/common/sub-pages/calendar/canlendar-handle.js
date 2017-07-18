/**
 * Created by lqq.li on 15/11/20.
 */
module.exports = (() => {
    var util = qt.util,
        storeKey = 'TOUCH_SEARCH_CALANDER_DATE',
        localStorage = util.localStorage,
        storeDate = JSON.parse(decodeURIComponent(localStorage.getItem(storeKey)) || '{}'),

        today = qt.commonParam.currentDateStr,
        tomorrow = qt.commonParam.tomorrowDateStr,
        todayJson = qt.commonParam.currentDate,
        tomorrowJson = qt.commonParam.tomorrowDate,
        weekData = '周日 周一 周二 周三 周四 周五 周六'.split(' '),

    // 区间日期是否用localStorage标示, 默认为true
        rangeTimeChange = true,
        singleTimeChange = true,
    // 设置localstorage
        setLocalStorage = (data) => {
            localStorage.setItem(storeKey, JSON.stringify(data));
        },

    //分别改变区间日历/单天日历  key分别为 range  single
        changePartStore = (key, val) => {
            storeDate[key] = val;
            setLocalStorage(storeDate);
        },
    // 获取localstorage
        getLocalStorage = () => {
            return storeDate;
        },

    // 获取要显示的数据
        getShowDate = () => {

            // 若localStorage 中起始日期 小于 当前日期, 则 将当前日期存入缓存
            if (!storeDate || !storeDate.range || util.compareDate(today, storeDate.range.detail[0].date)) {
                storeDate.range = {
                    isRange: true,
                    dateCount: 1,
                    detail: [{
                        date: today,
                        day: todayJson[2],
                        month: todayJson[1],
                        week: weekData[todayJson[3] - 1],
                        year: todayJson[0],
                        isToday: true,
                        isTomorrow: false,
                        isHouTian: false
                    }, {
                        date: tomorrow,
                        day: tomorrowJson[2],
                        month: tomorrowJson[1],
                        week: weekData[todayJson[3] - 1],
                        year: tomorrowJson[0],
                        isToday: false,
                        isTomorrow: true,
                        isHouTian: false
                    }]
                };
                rangeTimeChange = false;
            }

            if (!storeDate || !storeDate.single || util.compareDate(today, storeDate.single.detail[0].date)) {
                storeDate.single = {
                    isRange: false,
                    dateCount: 1,
                    detail: [{
                        date: today,
                        day: todayJson[2],
                        month: todayJson[1],
                        week: weekData[todayJson[3] - 1],
                        year: todayJson[0],
                        isToday: true,
                        isTomorrow: false,
                        isHouTian: false
                    }]
                };
                singleTimeChange = false;
            }

            if (!rangeTimeChange || !singleTimeChange) {
                setLocalStorage(storeDate);
            }

            // 返回页面 时间是否需要重新渲染标示,并返回数据
            return {
                rangeTimeChange: rangeTimeChange,
                singleTimeChange: singleTimeChange,
                storeDate: storeDate
            };
        };

    return {
        changePartStore: changePartStore,
        setLocalStorage: setLocalStorage,
        getLocalStorage: getLocalStorage,
        getShowDate: getShowDate
    }
})();