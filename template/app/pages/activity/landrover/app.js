/**
 * Created by taoqili on 15/8/28.
 */
//import _ from 'underscore';
module.exports = (()=> {
    return qt.definePage({
        templates: {
            header: '<nav class="icon previous left"></nav><h1 class="title">去哪儿&路虎携手送好礼</h1>'
                    },

         events: {
            'tap .btn': 'showQuestionnaire',
            'tap .text': 'showClientHotel',
            '': ''
        },

        showQuestionnaire:function () {
        	// body...
        	qt.monitor('landrover-questionnaire');
        	location.href ='http://www.sojump.hk/jq/9001141.aspx'
        },

        showClientHotel:function () {
        	// body...
        	qt.monitor('ClientHotel');
        	location.href ='http://touch.qunar.com/client/?sScheme=0&scheme=hotel%2Fmain%3FcityUrl%3Dbeijing_city&downType=3'
        }

    })
})();
