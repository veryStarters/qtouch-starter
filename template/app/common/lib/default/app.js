/**
 * Created by taoqili on 15/8/28.
 */
import qt from 'qt';
module.exports = (()=> {
    //普通青年,完全自理
    return qt.definePage({
        events:{
            'tap div':'test'
        },
        test:function(e){
            console.log('点击测试');
        }
    });


    //文艺青年,双向绑定
    //return qt.defineVM({
    //
    //})
})();