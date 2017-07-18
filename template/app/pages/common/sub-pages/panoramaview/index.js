/**
* 酒店内部全景图预览页 subpage
* zhan.chen
* 2015.12.25
 */

module.exports = (()=> {
    const util = qt.util;
    let panoid = null;
    let info = '酒店内部全景图预览';
    let panorama = null;
    let panoResult = false;
    let timer = null;

    const hideAndShowElement = function (method, sel) {
      if ($.os.android) {
        let osVer = $.os.version;
        let osVerNum = osVer.replace(/\./g, '') * 1;
        if(osVerNum < 440) { // 4.4.0以下
          method = 'hide';
        }
      }
      qt.$(sel)[method]();
    }

    const hideLoading = function () {
      if ($.os.android) {
        let osVer = $.os.version;
        let osVerNum = osVer.replace(/\./g, '') * 1;
        if(osVerNum < 440) { // 4.4.0以下
          $('.panoramaview .loading').hide();
        }
      }
    }

    return qt.defineSubPage({
        config: {
          name: 'Panoramaview',
          animate: [
            ['', 'scaleIn'],
            ['slideRightOut', '']
          ],
          //页面初始化时执行
          init: function (requestData, subPage) {
            panoResult = false;
          },
          //页面渲染完成时执行
          ready: function (requestData, subPage) {
            // panoResult || hideAndShowElement('show', '.loading');
            hideLoading();
            panoid = qt.getTransferData('panoid');
            if(!panorama) {
              panorama = new BMap.Panorama('panorama-main');
              panorama.setOptions({
                indoorExitControl: false,
                indoorSceneSwitchControl: false
              });
              panorama.setPov({heading: 10, pitch: 0});
              panorama.addEventListener('thumbnail_complete', () => {
                console.log('thumbnail_complete');
                hideAndShowElement('hide', '.loading');
                hideAndShowElement('hide', '.error');
                panoResult = true;
              });
              panorama.addEventListener('noresult', () => {
                console.log('noresult');
                hideAndShowElement('hide', '.loading');
                hideAndShowElement('show', '.error');
                panoResult = true;
              });
              panorama.addEventListener('error', (error) => {
                console.log('error');
                hideAndShowElement('hide', '.loading');
                hideAndShowElement('show', '.error');
                panoResult = true;
              });
            }
            panorama.setId(panoid);
            timer && clearTimeout(timer);
            timer = setTimeout(() => {
              if(!panoResult) { // 没有结果
                hideAndShowElement('hide', '.loading');
                hideAndShowElement('show', '.error');
                panoResult = false;
              }
            }, 20000);
          },
          onOpen:function(){
            // panoResult || hideAndShowElement('show', '.loading');
            hideLoading();
            panoid = qt.getTransferData('panoid');
            info = qt.getTransferData('info');
            qt.$('.pv-title').html(info);
            if(panorama) {
              hideAndShowElement('hide', '.error');
              panorama.setId(panoid);
              timer && clearTimeout(timer);
              timer = setTimeout(() => {
                if(!panoResult) { // 没有结果
                  hideAndShowElement('hide', '.loading');
                  hideAndShowElement('show', '.error');
                  panoResult = false;
                }
              }, 20000);
            }
          },
          onBack: function() {
            timer && clearTimeout(timer);
            timer = null;
            $('.panoramaview .loading').show();
            hideLoading();
            $('.panoramaview .error').hide();
            $('.pv-nav .pv-title').html('');
          }
        },
        events: {
          'tap .error>.goback': 'goBack'
        },
        templates: {
          header: '',
          subHeader: '',
          body: function () {
            info = qt.getTransferData('info') || '酒店内部全景图预览';
            return [
              `<div class="pv-nav">`,
                `<div class="qt-fl qt-ml10">`,
                  `<span class="icon previous page-back"></span>`,
                `</div>`,
                `<span class="pv-title">${info}</span>`,
              `</div>`,
              `<div class="panoramaview">`,
                `<div id="panorama-main"></div>`,
                `<div class="loading">正在加载全景图 . . . </div>`,
                `<div class="error">`,
                  `<div class="error-text">加载失败</div>`,
                  `<div class="goback"><span>返 回</span></div>`,
                `</div>`,
              `</div>`
            ].join('');
          }
        },
        handles: {
          goBack: function () {
            panoResult = false;
            qt.$('.pv-nav .previous').trigger('tap');
          }
        }
    })
})();
