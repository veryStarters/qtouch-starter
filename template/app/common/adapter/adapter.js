/**
 * Created by taoqili on 15/8/6.
 */

import popup from './touch/popup';
import sidebar from './touch/sidebar';
import page from './touch/page';
import mask from './touch/mask';
//import ready from './default/ready';
//import location from  './default/location';
//import localStorage from './default/localStorage';
export default (()=> {
    return {
        popup: popup,
        sidebar: sidebar,
        mask: mask,
        page: page,
        ajax: function () {
            return $.ajax.apply(this, arguments);
        },
        ready: function (callback) {
            $(callback);
        },
        monitor: function (name) {
            if (!name)return;
            setTimeout(function () {
                $.get('/h5/monitor?name=' + name);
            }, 0);
        }
        //location: location,
        //localStorage: localStorage
    };
})();
