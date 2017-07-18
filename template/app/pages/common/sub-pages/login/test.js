/**
 * Created by taoqili on 15/10/16.
 * 待解决list：
 * 样式导入
 * 缓存
 */
import qt from 'qt';
//import css from './main.less';
module.exports = (()=> {
    var util = qt.util;
    return qt.defineSubPage({
        config: {
            name: 'loginPage1',
            //页面初始化时执行
            init: function (requestData, subPage) {
                util.log('子页面loginPage1初始化')
            },
            //页面渲染完成时执行
            ready: function (requestData, subPage) {
                util.log('子页面loginPage1渲染完成')
            }
        },
        events: {
            'tap .test22': 'test'
        },
        templates: {
            header: '<nav class="icon left previous"></nav><title>page1</title>',
            subHeader: '',
            body: function (requestData, subPage) {
                return '<div style="height: 1000px;background: red" class="test22"> 返回page页面：</div><br />' + JSON.stringify(requestData)
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
                qt.util.log('子页面事件触发');
                subPage.back({'name': '传回父页面的数据'});
            }
        }
    })
})();