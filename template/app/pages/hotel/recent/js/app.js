/**--
 - Created by Webstorm.
 - User: taoqili
 - Date: 16/4/21
 - Time: 上午10:59
 - To change this template use File | Settings | File Templates.
 */
import listTpl from '../list.tpl'
module.exports = (()=> {
    return qt.definePage({
        templates: {
            header: '<nav class="icon left previous"></nav><h1 class="title qt-bb-x1">最近浏览</h1>',
            body: function (requestData, subPage) {
                return {
                    url:'/api/common/recent',
                    data:{},
                    success:function(data){
                        return _.template(listTpl, {data: data});
                    }
                };
            },
            footer: ''
        }
    })
})();