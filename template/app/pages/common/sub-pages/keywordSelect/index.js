/**
 * Created by lqq.li on 16/4/21.
 */
import '../../../../common/component/suggest/index';
import tplKeyword from './keyword.tpl';
import tplExpand from './expand.tpl';
import tplRetract from './retract.tpl';


module.exports = (() => {
    /**
     * 接口数据缓存
     * @type {Object}
     * {
     *     'url + param': data
     * }
     */
    let cache = (() => {

        let __cache = {};

        let createKey = (keys) => {
            let ret = [];
            for (let key in keys) {
                ret.push(keys[key]);
            }
            return ret.sort().join('');
        };

        return {
            get: function(...keys) {
                return __cache[createKey(keys)];
            },
            set: function(val, ...keys) {
                __cache[createKey(keys)] = val;
            }
        };

    })();

    let subStr = (str, len) => {
        let result = '',
            strlen = str.length,
            chrlen = str.replace(/[^\x00-\xff]/g, '**').length,
            i = 0,
            j = 0,
            chr;

        //没有超过直接返回
        if (chrlen <= len) {
            return str;
        }

        //例如：12字 以 11字 + '...' 表示，所以要减2，给'...'留位置
        len = len - 2;

        for (; i < strlen; i++) {
            chr = str.charAt(i);
            //字符为1，字为2，防止截取办字出现乱码
            /[\x00-\xff]/.test(chr) ? j++ : j += 2;

            if (j <= len) {
                result += chr;
            } else {
                return result + '...';
            }
        }
    };
    const API_KEYWORD_PAGE = '/api/hotel/navigate';
    const API_SUGGEST = '/api/hotel/suggest/k';
    const util = qt.util;
    var keywordsData = {},
        showAllFlag = {},
        navData = [];

    return qt.defineSubPage({
        config: {
            name: 'keyWordPage',
            forceRefresh: true,
            animate: 'slideDown',
            init: function(requestData, subPage) {
                keywordsData = qt.getTransferData();
            },
            ready: function(requestData, subPage) {
                var dname = $.trim(keywordsData.dname);
                if(dname){
                  qt.$('.search-key').val(dname)
                      .attr('data-dname', dname)
                      .attr('data-qname', keywordsData.qname);
                  qt.$('.cancel-circle').removeClass('qt-hide');
                }

                initPage(subPage);
            },
            backMonitor: function(requestData, subPage) {
                var keywordEmpty = !qt.$('.search-key').val();

                setCityKeywordLocal({
                    city: keywordsData.city,
                    dname: '',
                    qname: ''
                });

                if (keywordEmpty) {
                    subPage.back({
                        qname: '',
                        dname: ''
                    });
                }

                subPage.back();
            }
        },
        events: {
            'tap .search-box .cancel-circle': 'clearSuggestKeyword',
            'tap .keyworditem': 'backKeyword',
            'tap .upanddown': 'expandKeyword',
            'tap .m-keyword .js-keyword-remove': 'clearLocalKeyword',
            'tap .sure-btn': 'sure'
        },
        templates: {
            header: `<div class="qt-bb-x1 keyword-header">
					    <nav class="icon previous left"></nav>
					    <div class="keyword-select">
					        <div class="qt-input search-box">
					            <span class="icon search"></span>
					            <input type="text" class="qt-font14 search-key" placeholder="搜索酒店名、地名、地标">
					            <span class="icon cancel-circle qt-hide"></span>
					        </div>
					        <div class="qt-blue sure-btn">确定</div>
					    </div>
					</div>`,
            body: `<section class="key-word-box">
                    <div class="m-keyword"></div>
                    <div class="suggest-keyword-wrap qt-hide"></div>
				</section>`,
            footer: ''
        },
        handles: {
            clearSuggestKeyword: function(e) {
                var $me = $(e.currentTarget);
                $me.addClass('qt-hide');
                qt.$('.search-key').val('')
                    .attr('data-dname', '')
                    .attr('data-qname', '');
            },
            clearLocalKeyword: function(e, requestData, subPage) {
                qt.confirm({
                    contentCenter: true,
                    message: '确认要清除所有搜索历史吗？',
                    okText: '确认清除',
                    animate: 'slideLeftIn',
                    onOk: function() {
                        localStore().remove();
                        initPage(subPage);
                        qt.monitor(keywordsData.isNormal ? 'fullhotel_clearquery' : 'jdhourroom_clearquery');
                    }
                });
            },
            // 关键字收起和展开
            expandKeyword: function(e) {
                let $elem = $(e.currentTarget),
                    $parent = $elem.parents('.box'),
                    $type = $parent.data('type'),
                    data = $type === 'history' ? localStore().get() : _.where(navData, {
                        type: $type
                    })[0],
                    historyFlag = $type === 'history' ? true : false;
                if ($elem.hasClass('down')) {
                    $parent.replaceWith(_.template(tplExpand, {
                        data: data,
                        isHistory: historyFlag
                    }));
                } else {
                    $parent.replaceWith(_.template(tplRetract, {
                        data: data,
                        isHistory: historyFlag
                    }));
                }
            },
            backKeyword: function(e, requestData, subPage) {
                let $elem = $(e.currentTarget),
                    data = {
                        qname: $elem.attr('data-qname'),
                        dname: $elem.attr('data-dname') || $elem.text()
                    };
                //如果点的是空白补位区域，则不响应
                if (data.dname === '') {
                    return false;
                } else {
                    //统计数据映射
                    let countMap = {
                        newTradeArea: 'recommendq',
                        airMixTrain: 'airstation',
                        cheaperBrands: 'economic',
                        higherBrands: 'highgrade',
                        history: 'historyquery'
                    };

                    qt.monitor(
                        (keywordsData.isNormal ? 'fullhotel_' : 'jdhourroom_') + countMap[$elem.closest('.box').attr('data-type')]
                    );

                    setCityKeywordLocal({
                        city: keywordsData.city,
                        dname: data.dname,
                        qname: data.qname
                    });
                    data.dname && localStore().set({
                        'dname': data.dname,
                        'qname': data.qname
                    });

                    subPage.back(data);
                    // }
                }

            }
        },
        sure: function(e, requestData, subPage) {
            var keyword = qt.$('.search-key').val();

            setCityKeywordLocal({
                city: keywordsData.city,
                dname: keyword,
                qname: keyword
            });
            keyword && localStore().set({
                'dname': keyword,
                'qname': keyword
            });

            subPage.back({
                dname: keyword,
                qname: keyword
            });
        }
    });

    function updateLocalStoreContent(isLoad) {
        let $content = $('.js-localStoreContent'),
            tpl = _.template(tplRetract, {
                isHistory: true,
                data: localStore().get()
            });
        if (!isLoad) {
            $content.html(tpl);
        }

        return tpl;
    }

    // 关键字搜索历史本地存储
    function localStore() {

        /**
         *  [{dname,qname},{...}]
         */

        const KEY = 'TOUCH_HISTORY_KEYWORD';
        const MAX_COUNT = 19; //保存最大记录数

        let store = qt.util.localStorage;

        return {
            get: function() {
                return JSON.parse(store.getItem(KEY) || '[]');
            },
            set: function(val) {
                let data = _.filter(this.get(), function(item) {
                    return item.qname !== val.qname;
                });
                data.unshift(val);
                store.setItem(KEY, JSON.stringify(data.slice(0, MAX_COUNT)));
            },
            remove: function() {
                store.removeItem(KEY);
            }
        }

    }

    // 城市关键字本地存储
    function setCityKeywordLocal(keyData) {
        if (!$.isEmptyObject(keyData)) {
            var oldKeyData = JSON.parse(util.localStorage.getItem('TOUCH_CHECKED') || '{}'),
                newKeyData = {},
                wrapKeyData = {};
            wrapKeyData[keywordsData.isNormal ? 'normal-room' : 'hour-room'] = keyData;
            $.extend(newKeyData, oldKeyData, wrapKeyData);
            util.localStorage.setItem('TOUCH_CHECKED', JSON.stringify(newKeyData));
        }
    }

    // 页面数据初始化
    function initPage(subPage) {
        if (cache.get('city') && cache.get('city') == keywordsData.city) {
            qt.$('.m-keyword').html(
                _.template(tplKeyword, {
                    localStoreData: updateLocalStoreContent(true)
                })
            );
            _.forEach(cache.get(API_KEYWORD_PAGE, keywordsData.city), function(item) {
                qt.$('.js-keywordContent').append(_.template(tplRetract, {
                    data: item,
                    isHistory: false
                }));
            });

        } else {
            qt.showPageLoader();
            $.ajax({
                url: '/api/hotel/navigate',
                dataType: 'json',
                data: {
                    city: keywordsData.city
                },
                success: (res) => {
                    if (res.errcode === 0) {
                        let data = res.data.datas;
                        navData = data;
                        cache.set(data, API_KEYWORD_PAGE, keywordsData.city);
                        qt.$('.m-keyword').html(
                            _.template(tplKeyword, {
                                localStoreData: updateLocalStoreContent(true)
                            })
                        );
                        _.forEach(data, function(item) {
                            qt.$('.js-keywordContent').append(_.template(tplRetract, {
                                data: item,
                                isHistory: false
                            }));
                        });

                    }
                    //速度太快会闪，稍微延迟一下...
                    setTimeout(() => {
                        qt.hidePageLoader();
                    }, 300);
                }
            });
        }
        cache.set(keywordsData.city, 'city');

        initSuggest(subPage);
        window.scrollTo(0, 0);
    }

    // 搜索推荐初始化
    function initSuggest(subPage) {
        let me = this,
            $suggest = qt.$('.search-key'),
            oSuggest = $suggest.data().suggest,
            url = API_SUGGEST + '?city=' + encodeURIComponent(keywordsData.city);
        if (oSuggest) {
            oSuggest.options.url = url;
        } else {
            $suggest.suggest({
                url: url, //接口
                keyName: 'keywords', //查询关键字
                displayKey: 'ahead', //显示数据字段
                max: 10, //显示数量
                highLight: true,
                formId: '.suggest-keyword-wrap', //搜索结果填充到这个dom

                //数据预处理
                process: function(res) {
                    if (res.errcode === 0) {
                        return res.data;
                    }
                    return [];
                },

                //选择节点后callback
                select: function($item, _suggest) {
                    let ahead = $('span', $item).attr('data-ahead'),
                        data = {
                            qname: ahead,
                            dname: ahead
                        };
                    //$.extend(me.retPageData, data);
                    //me.localStore.set(data);
                    //me.updateLocalStoreContent();
                    _suggest.$ele.val(ahead)
                        .attr('data-dname', ahead)
                        .attr('data-qname', ahead);

                    //统计
                    qt.monitor(keywordsData.isNormal ? 'fullhotel_suggestselect' : 'jdhourroom_suggestselect');

                    setCityKeywordLocal({
                        city: keywordsData.city,
                        dname: data.dname,
                        qname: data.qname
                    });
                    data.dname && localStore().set({
                        'dname': data.dname,
                        'qname': data.qname
                    });

                    subPage.back($.extend({
                        city: keywordsData.city
                    }, data));
                },

                //suggest隐藏
                hide: function() {
                    $('.m-keyword').removeClass('qt-hide');
                    $('.suggest-keyword-wrap').addClass('qt-hide');
                },

                //suggest显示
                show: function() {
                    $('.m-keyword').addClass('qt-hide');
                    $('.suggest-keyword-wrap').removeClass('qt-hide');
                }
            });
        }
    }
})();
