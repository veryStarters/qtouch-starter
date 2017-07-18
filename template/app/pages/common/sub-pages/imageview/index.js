/**
* 图片大图预览页 subpage
* zhan.chen
* 2015.12.17
 */
import Imagebrowser from '../../../../common/component/imagebrowser/';

module.exports = (()=> {
    const util = qt.util;
    let imagebrowser = null;
    let list = null;

    const imageSwitch = (event, data) => { // 更新标题栏的分类名
      // console.log('imageSwitch', data.index);
      let index = data && data.index || 0;
      qt.$('.iv-title').html(list[index] && list[index].tag || '酒店图片');
    }

    return qt.defineSubPage({
        config: {
          name: 'imageView',
          forceRefresh: true,
            animate:'slideUp',
          //页面初始化时执行
          init: function (requestData, subPage) {
            imagebrowser = null;
            list = null;
            // 数据处理
            let imglist = qt.getTransferData('imglist');
            list = _.flatten(_.map(imglist, (group, index) => {
              return _.map(group.imgNodes, (val, idx) => {
                return $.extend({}, val, {
                  index: idx+1, // 图片在当前分组中的序号 从1开始
                  total: group.imgNodes.length // 当前分组中图片的数目
                });
              });
            }));

            // console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-');
            // console.log(list);
            // console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=');

          },
          //页面渲染完成时执行
          ready: function (requestData, subPage) {
            // util.log('子页面 imageView 渲染完成');

            let config = {
              list: list,
              index: qt.getTransferData('index') || 0,
              margin: 20,
              // enableZoom: false,
            }
            let tplImage = qt.getTransferData('tplImage');
            tplImage && (config.tplImage = tplImage);
            let tplInfo = qt.getTransferData('tplInfo');
            tplInfo && (config.tplInfo = tplInfo);
            imagebrowser = new Imagebrowser(config);
            if (list && list.length > 0) { // list有内容 才开始初始化
              let imagebrowserDOM = imagebrowser.init(qt.$('.imagebrowser')[0]);
              imagebrowserDOM.on('imagebrowser_slide', (event, data) => imageSwitch(event, data));
            }

          }
        },
        events: {
          // 'imagebrowser_slide .imagebrowser': 'imageSwitch' //图片切换事件
        },
        templates: {
          header: '',
          subHeader: '',
          body: function () {
            let title = qt.getTransferData('title') || '酒店图片';
            return [
              `<div class="iv-nav">`,
                `<div class="qt-fl qt-ml10">`,
                  `<span class="icon previous page-back"></span>`,
                `</div>`,
                `<span class="iv-title">${title}</span>`,
              `</div>`,
              `<div class="imagebrowser"></div>`
            ].join('');
          }
        },
        handles: {

        }
    })
})();
