/**
* 图片列表预览页 subpage
* zhan.chen
* 2015.11.16
 */
import tplPanorama from './tpl/panorama.tpl';
import Tabslider from '../../../../common/component/tabslider/';
import Waterflow from '../../../../common/component/waterflow/';
import subpageImageview from '../imageview/';
 import subpagePanoramaview from '../panoramaview/';

module.exports = (()=> {
    const util = qt.util;
    let imglist = null;
    let imglistAll = []; // 全部图片列表
    let curIdx = 0;
    let curList = []; // 当前显示的列表
    let tabs = null;
    let tabslider = null;
    let waterflow = null;
    let panoid = null;
    let panoramaList = null;
    let curTab = 0;

    const getPanorama = (panoid) => { // 获取内景图数据
      if (panoramaList) { // 已有数据
        return;
      }
      let panoramaNodes = '<div class="pano-loading">全景图获取中...</div>';
      qt.$('.il-panorama').html(panoramaNodes);
      $.ajax({
        url: `http://pcsv0.map.bdimg.com/?qt=guide&sid=${panoid}`,
        type: 'GET',
        success: (res) => {
          let result = typeof(res) === 'string' ? JSON.parse(res) : res;
          let list = result.content;
          if (!list || list.length <= 0) {
            panoramaNodes = '<div class="pano-empty">加载失败</div>';
            qt.$('.il-panorama').html(panoramaNodes);
          } else {
            let tempListGroup = [
              {
                type: '客房',
                list: []
              },
              {
                type: '设施',
                list: []
              },
              {
                type: '正门',
                list: []
              },
              {
                type: '其他',
                list: []
              }
            ];
            list.map((elem, index) => {
              if (elem.Catalog) { // 有catalog分类号的项
                switch (parseInt(elem.Catalog)) {
                  case 1:
                    fillPanoData(tempListGroup[2].list, elem);
                    break;
                  case 2: case 3: case 4: case 5: case 6: case 7: case 8:
                    fillPanoData(tempListGroup[0].list, elem);
                    break;
                  case 9: case 10: case 11: case 12:
                    fillPanoData(tempListGroup[1].list, elem);
                    break;
                  default:
                }
              } else if (elem.Catalog === '') { // catalog没有值的项
                fillPanoData(tempListGroup[3].list, elem);
              }
            });
            // 过滤掉空的分组
            let listGroup = _.filter(tempListGroup, (val) => {
              return val.list.length > 0;
            });
            let multipleCatalogFlag = !(listGroup.length === 1 && listGroup[0].type === '其他');
            panoramaNodes = util.template(tplPanorama, {
              listGroup,
              multipleCatalogFlag
            });
            qt.$('.il-panorama').html(panoramaNodes);
          }
        },
        error: (err) => {
          console.log(err);
          panoramaNodes = '<div class="pano-empty">加载失败</div>';
          qt.$('.il-panorama').html(panoramaNodes);
        }
      });
    }

    const fillPanoData = (list, elem) => {
      list.push({
        PID: elem.PID,
        Catalog: elem.Catalog,
        Info: elem.Info,
        Pitch: elem.Pitch
      });
    }

    const updateRem = (doc, win) => {
      let docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
          let clientWidth = docEl.clientWidth;
          if (!clientWidth) return;
          docEl.style.fontSize = 20 * (clientWidth / 320) + 'px';
        };
      if (!doc.addEventListener) return;
      win.addEventListener(resizeEvt, recalc, false);
      doc.addEventListener('DOMContentLoaded', recalc, false);
      recalc();
    }

    const tabslide = function(event, data) {
      let idx = data && data.idx || 0;
      if (curIdx === idx) {
        return;
      } else {
        curIdx = idx;
        if (curIdx === 0) {
          curList = imglistAll;
        } else {
          curList = imglist[curIdx-1].imgNodes;
        }
        qt.$('.il-imglist .load-complete').remove();
        waterflow.reload(curList);
      }
    }

    const imageClick = function(event, data) {

      let index = data && data.index || 0;
      let image = curList[index];
      subpageImageview.open({
        forceRefresh: true,
        data: {
          imglist: imglist,
          title: image.tag,
          index: image.idx,
          tplImage: '<img src="<%- big %>" title="<%- title %>" data-id="<%- idx %>" />'
        },
        onOpen: function () {
          $('body').addClass('qt-overflow');
        },
        onBack: function (data) {
          $('body').removeClass('qt-overflow');
        }
      });
    }

    const imageLoadComplete = function (event, data) {
      if(document.body.scrollHeight > window.innerHeight) {
        let loadCompleteHtml = [
          `<div class="load-complete">`,
            `<span>没有更多图片了</span>`,
          `</div>`
        ].join('');
        qt.$('.il-imglist').append(loadCompleteHtml);
      }
    }

    return qt.defineSubPage({
        config: {
          name: 'imageList',
          animate: [
            ['', 'scaleIn'],
            ['slideRightOut', '']
          ],
          forceRefresh: false,
          //页面初始化时执行
          init: function (requestData, subPage) {
             updateRem(document, window);
          },
          //页面渲染完成时执行
          ready: function (requestData, subPage) {

            if(imglist.length  === 0) {
              qt.$('.il-imglist').html('没有数据');
              return;
            }

            // 初始化tabslider组件
            let totalCount = 0;
            tabs = _.map(imglist, (val, idx) => {
              imglistAll = imglistAll.concat(val.imgNodes);
              totalCount += val.imgNodes.length;
              return {
                name: val.tag,
                count: val.imgNodes.length
              };
            });
            tabs = [{
              name: '全部',
              count: totalCount
            }].concat(tabs);
            let tplTab = [
              '<div class="item">',
                '<p><%- tab.name %></p>',
                '<p><%- tab.count %></p>',
              '</div>'
            ].join('');
            tabslider = new Tabslider(tabs, tplTab);
            let tabslideDom = tabslider.init(qt.$('.il-imggroup')[0]);
            tabslideDom.on('clicktabslider', (event, data) => tabslide(event, data));

            // 初始化waterflow组件
            curIdx = 0;
            curList = imglistAll;
            waterflow = new Waterflow({
              type: 'TYPE_DEFINE',
              // tpl: '<img width="100%" src="<%- url %>" title="<%- title %>" data-id="<%- idx %>" />',
              saveMode: true,
              tpl: '<img width="100%" height="100%" src="<%- url %>" title="<%- title %>" data-id="<%- idx %>" />',
              list: curList
            });
            let waterflowDom = waterflow.init(qt.$('.il-imglist'));
            waterflowDom.on('waterflow_click', (event, data) => imageClick(event, data));
            waterflowDom.on('waterflow_loadcomplete', (event, data) => imageLoadComplete(event, data));

            // 给waterflow组件添加 滑到底部加载更多 的处理
            qt.onScrollStop((scrollTop) => {
              if (qt.$cur.attr('id').indexOf('imageList') > -1 && curTab === 0) {
                let winHeight = window.innerHeight;
                let scrollHeight = document.body.scrollHeight;
                if (winHeight + scrollTop >= scrollHeight - 300) {
                  waterflow.loadMore();
                }
              }
            });

          }
        },
        events: {
           'tap .qt-control-group>li': 'switchTab', // 切换顶栏tab页
           'tap .pano-pic': 'panoClick', // 点击全景图
        },
        templates: {
          header: function () {
            panoid = qt.getTransferData('panoid') || null;
            let header = [`<nav class="icon previous left"></nav>`];
            if (panoid) {
              header = header.concat([
                `<ul class="qt-control-group qt-font16">`,
                    `<li class="active"><i class="icon image"></i> 照片</li>`,
                    `<li><i class="icon q-360 lineheight0"></i> 内景</li>`,
                `</ul>`
              ]);
            } else {
              header = header.concat([
                `<h2 class="title"><i class="icon image"></i> 照片</h2>`
              ]);
            }
            return header.join('');
          },
          body: function () {
            return  {
              url: '/api/hotel/hoteldetail/image',
              type:'GET',
              data: {
                seq: qt.getTransferData('seq')
              },
              success: function (res) {
                imglist = res.data && res.data.images || [];
                return [
                    `<div class="il-imglist"></div>`,
                    `<div class="il-imggroup"></div>`,
                    `<div class="il-panorama" style="display: none">panorama</div>`
                  ].join('');
              },
              error: function () {
              }
            };
          }
        },
        handles: {
          switchTab: function (event) {
            let target = $(event.currentTarget);
            if (!target.hasClass('active')) {
              target.addClass('active').siblings('li').removeClass('active');
              curTab = target.index();
              let $imgGroup = qt.$('.il-imggroup'),
                $imgList = qt.$('.il-imglist'),
                $panorama = qt.$('.il-panorama');
              switch (curTab) {
                case 0: // 照片
                  $imgGroup.show();
                  $imgList.show();
                  $panorama.hide();
                  break;
                case 1: // 内景
                  getPanorama(panoid);
                  $panorama.show();
                  $imgGroup.hide();
                  $imgList.hide();
                  break;
                default:
              }
            }
           },
           panoClick: function(event) {
             console.log('panoClick');
             let panoid = $(event.currentTarget).data('panoid');
             let info = $(event.currentTarget).data('info');
             console.log(panoid, info);
             subpagePanoramaview.open({
               data: {
                 info: info,
                 panoid: panoid
               },
               onOpen: function () {
                 $('body').addClass('qt-overflow');
               },
               onBack: function (data) {
                 $('body').removeClass('qt-overflow');
               }
             });
           }
        }
    })
})();
