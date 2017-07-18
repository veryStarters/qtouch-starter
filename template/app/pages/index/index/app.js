/**
 * Created by taoqili on 15/8/28.
 */
import _ from 'underscore';
import loginPage from '../../common/sub-pages/login/index.js';
import loginPage1 from '../../common/sub-pages/login/test.js';
import testTpl from './tpl/test.tpl';

module.exports = (()=> {
    var util = qt.util;
    //普通青年,基本完全自理
    return qt.definePage({
        config: {
            init: function (data) {

            },
            ready: function (data) {
            }
        },

        events: {
            'tap .openSelect': 'open',
            'tap .open': 'open1',
        },
        templates: {
            //header:'',
            //第一种情形
            //header: '<h1 class="title">去哪儿旅行1</h1>',
            //第二种情形
            //subHeader: function (requestData) {
            //    return '<div class="openSelect">打开page1</div><div class="open">打开page2</div>';
            //},
            //第三种情形，支持多个请求同时调用，但建议每次只调用一个以提升性能
            //body: {
            //    url: ['/api/hotel/test','/api/hotel/test2'],
            //    type:'POST',
            //    data: [{a: 1}],
            //    success: function (data1, data2) {
            //        return _.template(testTpl, {name: data1.name})
            //    },
            //    error: function () {
            //    }
            //},
            //第四种情形，功能同第三种
            //footer: function (requestData) {
            //    return {
            //        url: ['/api/hotel/test', '/api/hotel/test'],
            //        data: [{a: 1}, {b: 2}],
            //        success: function (data1, data2) {
            //            return _.template(testTpl, {name: data1, value: data2})
            //        },
            //        error: function () {
            //
            //        }
            //    }
            //},
            //footer: 'xxxxx'
        },
        handles: {
            open: function (event, requestData) {
                //qt.showPageLoader(11111);
                //qt.scrollSupport('.test1',{maxHeight:100})
                loginPage.open({
                    data: {name: 'taoqili', password: '123456'},
                    onOpen: function () {
                        util.log('从主页面打开了子页面loginPage')
                    },
                    onBack: function (data) {
                        util.log('子页面loginPage返回给主页面的数据:' + JSON.stringify(data))
                    }
                });
            },
            open1:function(){
                loginPage1.open({
                    data:{test:1},
                    onOpen: function () {
                        util.log('从主页面打开了子页面loginPage1')
                    },
                    onBack: function (data) {
                        util.log('子页面loginPage1返回给主页面的数据:' + JSON.stringify(data))
                    }
                });
            },
            getLoaction:function(){
                qt.showSidebar({
                    template:'gfgfffgfg'
                })
            }
        }
    });


    //文艺青年,双向绑定
    //return qt.defineVM({
    //
    //})
})();