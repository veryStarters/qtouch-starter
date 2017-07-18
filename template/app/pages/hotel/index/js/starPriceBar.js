import startPriceTpl from '../tpl/star-price.tpl';
import '../../../../common/component/range/index';
import '../../../../common/component/multiselector/index';

//星级多选数据
const MULTI_DATA = [
    {text: '经济型', val: '1', checked: false},
    {text: '二星', val: '5', checked: false},
    {text: '三星', val: '2', checked: false},
    {text: '四星', val: '3', checked: false},
    {text: '五星', val: '4', checked: false}
];

//小时多选数据
const MULTI_HOUR_DATA = [
    {text: '&lt; 3小时', val: '0', checked: false},
    {text: '3小时', val: '1', checked: false},
    {text: '4小时', val: '2', checked: false},
    {text: '&gt; 4小时', val: '3', checked: false}
];

//星级价格范围
const RANGE_PRICE_DATA = [0, 150, 300, 500, 800, '不限'];

//钟点价格范围
const RANGE_HOUR_DATA = [0, 50, 80, 100, '不限'];

let cache = (() => {

    /**
     * {
     *     normal: {
     *         star: [ { text: '', val: ''},{...} ],
     *         price: [ left,right ]
     *     }
     *     hour:{
     *         star: [ { text: '', val: ''},{...} ],
     *         hour: [ { text: '', val: ''}]
     *         price: [ left,right ],
     *     }
     * }
     */

    const KEY = 'TOUCH_START_PRICE_BAR';

    const DEF_STR = {
        normal: {},
        hour: {}
    };

    let store = qt.util.localStorage;

    return {
        get: () => {
            let str = store.getItem(KEY);
            return str === '' ? DEF_STR : JSON.parse(str);
        },
        set: (val) => {
            store.setItem(KEY, JSON.stringify(val));
        }
    }

})();

let getCurrentData = (arr, diff) => {
    return _.map(arr, (oItem) => {
        let item = $.extend({}, oItem);
        _.map(diff || [], (hItem) => {
            if (oItem.val === hItem.val) {
                item.checked = true;
            }
        });
        return item;
    });
};

/**
 * 获取文本
 * @param  {String}  'normal' or 'hour'
 * @return {String}
 */
let setText = ($input, type = 'normal') => {

    /**
     * 获取价格文本
     * @param  {Array}  价格范围 [100,200]
     * @return {String}
     */
    let getRangeText = (arr) => {
        let text = '不限价格';
        arr = arr || [];
        if (arr.length === 0 || arr.join('') === '0不限') {
            text = '不限价格';
        }
        else {
            text = '&yen;' + arr[0];
            text += arr[1] === '不限' ? '及以上' : '-&yen;' + arr[1];
        }
        return text;
    };

    /**
     * 获取星级文本
     * @param  {Array}  星级 [{text: '经济型', val: '1'},{text: '二星', val: '1'}]
     * @return {String}
     */
    let getStarText = (arr) => {
        let text = '不限星级';
        arr = arr || [];
        if (arr.length > 0) {
            text = '';
            _.map(arr, (item) => {
                text += item.text;
            });
        }
        return text;
    };

    let data = cache.get()[type],
        text = [];

    text.push(getStarText(data.star));
    if (type === 'hour' && data.hour && data.hour.length > 0) {
        text.push(data.hour[0].text);
    }
    text.push(getRangeText(data.price));

    if (text[0] === '不限星级' && text[1] === '不限价格') {
        $input.addClass('qt-light-grey').changeHtml('不限星级价格');

        $input.siblings('.empty-starprice').addClass('qt-hide');

        return;
    }

    $input.removeClass('qt-light-grey').changeHtml(text.join('，'));
    $input.siblings('.empty-starprice').removeClass('qt-hide');

};

export default {
    setText: setText,
    getData: cache.get,
    events: {
        'tap .star-price': 'starPrice',
        'tap .empty-starprice': 'emptyStarPrice'
    },
    handles: {
        starPrice: function (e) {

            let $input = $(e.currentTarget),
                type = $input.data('for'),
                store = cache.get(),
                data = store[type];

            let opt = {
                type: 'bottom',
                maskOpacity: .5,
                events: {
                    'tap .btn-ok': 'getStarPrice'
                },
                onTapMask: function () {
                    qt.hideSidebar();
                },
                template: _.template(startPriceTpl, {
                    isHour: false
                }),
                handles: {
                    getStarPrice: function (e, content) {

                        let ret = [];

                        //星级
                        _.each(['star', 'hour'], (selector) => {
                            let $elem = $('.js-' + selector, content);
                            if ($elem.length > 0) {
                                data[selector] = $elem.multiselector('status');
                            }
                        });

                        //价格
                        data.price = $('.js-range', content).range('getResult');

                        //写入历史记录
                        cache.set(store);

                        setText($input, type);

                        qt.hideSidebar();
                    },
                }
            };

            switch (type) {
                //全日房
                case 'normal':
                    $.extend(opt, {
                        onReady: function (content) {
                            $('.js-star', content).multiselector({
                                tplData: getCurrentData(MULTI_DATA, data.star)
                            });
                            $('.js-range', content).range({
                                division: RANGE_PRICE_DATA,
                                defVal: data.price || []
                            });
                        }
                    })
                    break;
                //钟点房
                case 'hour':
                    $.extend(opt, {
                        onReady: function (content) {
                            $('.js-star', content).multiselector({
                                tplData: getCurrentData(MULTI_DATA, data.star)
                            });
                            $('.js-hour', content).multiselector({
                                tplData: getCurrentData(MULTI_HOUR_DATA, data.hour),
                                fontSize: 12,
                                multi: false
                            });
                            $('.js-range', content).range({
                                division: RANGE_HOUR_DATA,
                                defVal: data.price || []
                            });
                        },
                        template: _.template(startPriceTpl, {
                            isHour: true
                        })
                    })
                    break;
            }
            ;

            qt.monitor(type === 'hour' ? 'jdhourroom_pgrade' : 'fullhotel_pgrade');

            //底部弹出对话框
            qt.showSidebar(opt);
        },
        emptyStarPrice: function (e) {
            var $me = $(e.currentTarget),
                $starPrice = $me.siblings('.star-price'),
                type = $starPrice.data('for'),
                store = cache.get();

            $starPrice.addClass('qt-light-grey')
                .changeHtml('不限星级价格');

            $me.addClass('qt-hide');

            store[type] = {}
            cache.set(store);
        }
    }
};
