/**
 * Created by taoqili on 15/10/16.
 * 待解决list：
 * 样式导入
 * 缓存
 */
import qt from 'qt';
import loginPage1 from './test.js';
//import css from './main.less';
module.exports = (()=> {
    var util = qt.util;

    return qt.defineSubPage({
        config: {
            name: 'loginPage',
            //forceRefresh: true,
            fixedSubHeader:true,
            //页面初始化时执行
            init: function (requestData, subPage) {
                util.log('子页面loginPage初始化')
            },
            //页面渲染完成时执行
            ready: function (requestData, subPage) {
                util.log('子页面loginPage渲染完成')
            }
        },
        events: {
            'tap .test22': 'test',
        },
        templates: {
            header: '<nav class="icon left previous"></nav><input class="qn-input" style="margin: 5px 50px" type="text" placeholder="请输入搜索关键词" />',
            subHeader: 'kkkk',
            body: function (requestData, subPage) {
                return '<div style="height: 1000px;" class="test22">打开page1页：</div><br />' + JSON.stringify(requestData)
            },
            footer: {
                url: '/api/hotel/test',
                success: function () {
                    return '返回的数据'
                }
            }
        },
        handles: {
            test: function (event, requestData, subPage) {
                //subPage.back({a:1});
                util.log('子页面事件触发');
                //subPage.back({'name': '传回父页面的数据'});
                loginPage1.open({
                    data: {},
                    onOpen: function () {
                        util.log('从loginPage打开了子页面loginPage1')
                    },
                    onBack: function (data) {
                        util.log('子页面loginPage1返回给loginPage的数据:' + JSON.stringify(data))
                    }
                })
            }
        }
    })
})();