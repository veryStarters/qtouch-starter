/**
 * Created by taoqili on 15/8/5.
 */
module.exports = function (grunt) {
    var env = grunt.option('deploy-type') || 'local';
    return {
        name: 'touch.qunar.com',
        //此处的adapter仅起到指示作用，
        //具体的配置生效位置为app/common/adapter/adapter.js中的顶部代码
        adapter: 'default',
        //默认模板类型 (jade,velocity)
        template: 'vm',
        //默认运行环境 (dev,beta,prod)
        env: env,
        //环境目录
        path: {
            app: './app',
            dev: './dev',
            tmp: './tmp',
            dist: './prd',
            yaml:'./.yaml'
        },
        //直连线上js代码调试
        statics: {
            //'/common/common.js':'http://mobileqzz.beta.qunar.com/mobile-hotel/prd/common/common.3ee9a709.js',
            //'/pages/hotel/index/main.js':'http://mobileqzz.beta.qunar.com/mobile-hotel/prd/pages/hotel/index/main.7397cd6b.js'
        },
        qzzUrl: {
            dev: '//l-wap1.wap.dev.cn6.qunar.com/mobile-hotel/prd',
            beta: '//mobileqzz.beta.qunar.com/mobile-hotel/prd',
            prod: '//q.qunarzz.com/mobile-hotel/prd'
        },
        //本地模拟数据接口和线上数据接口之间的映射关系
        apiAdapter: {
            '/api/hotel/test': 'http://touch.qunar.com/?rtype=1',
            '/api/hotel/city/en': 'http://l-tcdev2.wap.dev.cn0.qunar.com:8080/api/hotel/city/en',
            '/api/hotel/city/gj': 'http://l-tcdev2.wap.dev.cn0.qunar.com:8080/api/hotel/city/gj',
            '/api/hotel/city/hour': 'http://l-tcdev2.wap.dev.cn0.qunar.com:8080/api/hotel/city/hour',
            '/api/hotel/suggest/k': 'http://l-tcdev2.wap.dev.cn0.qunar.com:8080/api/hotel/suggest/k',
            '/api/hotel/suggest/c': 'http://l-hotel5.wap.beta.cn0.qunar.com:9090/api/hotel/suggest/c',
            '/api/hotel/findhotelcity': 'http://l-hotel5.wap.beta.cn0.qunar.com:9090/api/hotel/findhotelcity',
            '/api/hotel/holiday': 'http://l-hotel5.wap.beta.cn0.qunar.com:9090/api/hotel/holiday',
            '/api/hotel/city/convert': 'http://l-hotel5.wap.beta.cn0.qunar.com:9090/api/hotel/city/convert',
            '/api/hotel/hotelMaplist': 'http://touch.qunar.com/h5/hotel/hotelMaplist',
            '/api/hotel/hotellist': 'http://l-tcdev2.wap.dev.cn0.qunar.com:8080/api/hotel/hotellist',
            '/api/hotel/navigate': 'http://l-wap1.wap.dev.cn6.qunar.com:8090/api/hotel/navigate',
            '/api/hotel/hoteldetail/comment': 'http://l-tcdev2.wap.dev.cn0.qunar.com:8080/api/hotel/hoteldetail/comment',
            '/api/hotel/hoteldetail/info': 'http://l-tcdev2.wap.dev.cn0.qunar.com:8080/api/hotel/hoteldetail/info',
            '/api/hotel/hoteldetail/price': 'http://l-tcdev2.wap.dev.cn0.qunar.com:8080/api/hotel/hoteldetail/price',
            '/api/hotel/hoteldetail/image': 'http://l-tcdev2.wap.dev.cn0.qunar.com:8080/api/hotel/hoteldetail/image',
            '/api/hotel/hoteldetail/surroundings':'http://l-tcdev2.wap.dev.cn0.qunar.com:8080/api/hotel/hoteldetail/surroundings',
            '/api/hotel/rechotel':'http://l-tcdev2.wap.dev.cn0.qunar.com:8080/api/hotel/rechotel',
            //'/api/hotel/hotelorderquery/vcode':'http://l-tcdev2.wap.dev.cn0.qunar.com:8080/api/hotel/hotelorderquery/vcode',
            //'/api/hotel/hotelorderquery':'http://l-tcdev2.wap.dev.cn0.qunar.com:8080/api/hotel/hotelorderquery',
            //'/api/activity/airlineticket/ticketfree/chance':'http://l-wap1.wap.dev.cn6.qunar.com:8090/api/activity/airlineticket/ticketfree/chance',
            '/api/activity/airlineticket/ticketfree/start': 'http://l-wap1.wap.dev.cn6.qunar.com:8090/api/activity/airlineticket/ticketfree/start',
            '/api/activity/airlineticket/ticketfree/record': 'http://l-tcdev2.wap.dev.cn0.qunar.com:8080/api/activity/airlineticket/ticketfree/record',
            '/api/activity/springgift': 'http://l-tcdev2.wap.dev.cn0.qunar.com:8080/api/activity/springgift',
            //'/api/activity/springgift': 'http://l-wap1.wap.dev.cn6.qunar.com:8090/api/activity/springgift'

            '/api/common/addresscode': 'http://l-tcdev2.wap.dev.cn0.qunar.com:8080/api/common/addresscode',
            //'/api/common/recent': 'http://l-tcdev2.wap.dev.cn0.qunar.com:8080/api/common/recent',
            '/h5/hotel/hotelordercheckprice': 'http://tcdev2.dev.qunar.com/h5/hotel/hotelordercheckprice',
            //'/api/hotel/hotelordercheckprice': '/api/hotel/hotelorderinfo/guestsinfochange.js',
            '/api/hotel/hotelbook': 'http://l-tcdev2.wap.dev.cn0.qunar.com:8080/api/hotel/hotelbook',
            '/api/activity/callbackolduser': 'http://l-hotel8.wap.beta.cn0.qunar.com:9090//api/activity/callbackolduser',
            '/api/activity/logincode': 'http://l-hotel8.wap.beta.cn0.qunar.com:9090//api/activity/logincode',
            '/api/activity/lottery/query': 'http://l-hotel5.wap.beta.cn0.qunar.com:9090/api/activity/lottery/query',
            '/api/activity/lottery/add': 'http://l-hotel5.wap.beta.cn0.qunar.com:9090/api/activity/lottery/add',
            '/api/activity/lottery/myprizelist': 'http://l-hotel5.wap.beta.cn0.qunar.com:9090/api/activity/lottery/myprizelist',
            '/api/activity/lottery/shake': 'http://l-hotel5.wap.beta.cn0.qunar.com:9090/api/activity/lottery/shake',
            '/api/activity/lottery/award': 'http://l-hotel5.wap.beta.cn0.qunar.com:9090/api/activity/lottery/award',
            '/api/hotel/hotelorderlist': 'http://l-tcdev2.wap.dev.cn0.qunar.com:8080/api/hotel/hotelorderlist',
            //'/api/hotel/hotelordertoken': 'http://l-tcdev2.wap.dev.cn0.qunar.com:8080/api/hotel/hotelordertoken',
            '/api/hotel/hotelorderlink': 'http://l-tcdev2.wap.dev.cn0.qunar.com:8080/api/hotel/hotelorderlink',
            '/api/user/getcode': 'http://tcdev.dev.qunar.com/api/common/user/getcode',
            '/api/activity/festivalVoucher': 'http://tcdev.dev.qunar.com/api/activity/festivalVoucher'
        },
        //模拟线上controller提供的模板变量
        controllerAdapter:{
            '/hotel/hotellist':'http://l-tcdev2.wap.dev.cn0.qunar.com:8080/hotel/hotellist.c',
            // '/hotel/hotelorderlist':'http://l-tcdev1.wap.dev.cn0.qunar.com:8080/hotel/hotelorderlist.c',
             '/hotel/hotelorderquery':'http://l-tcdev2.wap.dev.cn0.qunar.com:8080/hotel/hotelorderquery.c',
            '/hotel/hoteldetail':'http://l-tcdev2.wap.dev.cn0.qunar.com:8080/hotel/hoteldetail.c',
            '/client/hotelorderstatusdetail':'http://l-tcdev1.wap.dev.cn0.qunar.com:8080/client/hotelorderstatusdetail.c',
            //'/activity/airlineticket/ticketfree':'http://l-wap1.wap.dev.cn6.qunar.com:8090/activity/airlineticket/ticketfree.c'
            '/hotel/hotelorderinfo':'http://l-wap1.wap.dev.cn6.qunar.com:8090/hotel/hotelorderinfo.c',
            //'/hotel/hotelorderdetail':'http://l-tcdev2.wap.dev.cn0.qunar.com:8080/hotel/hotelorderdetail.c',
            '/hotel/hotelorderresult':'http://l-tcdev2.wap.dev.cn0.qunar.com:8080/hotel/hotelorderresult.c',
            '/activity/lottery':'http://l-hotel5.wap.beta.cn0.qunar.com:9090/activity/lottery.c',
            '/client':'http://l-tcdev1.wap.dev.cn0.qunar.com:8080/client.c'
        }
    }
};
