/**
 * Created by taoqili on 15/10/16.
 * 待解决list：
 * 样式导入
 * 缓存
 */
import Circle from '../../../../../common/component/cricle/index.js';
import Tab from '../../../../../common/component/tab/index';
import ImageView from '../../../../common/sub-pages/imageview/';
import tpl from './index.tpl';
import commentListTpl from './comment-list.tpl';
module.exports = (() => {
    var util = qt.util,
        circle;
    return qt.defineSubPage({
        config: {
            name: 'comment',
            init: function(requestData, subPage) {},
            beforeBack: function() {},
            onBack: function() {},
            beforeOpen: function(requestData, subPage) {
                circle && circle.initCircle();
            },
            afterClose: function(requestData, subPage) {

            },
            onOpen: function(requestData, subPage) {
                circle && circle.circleStart();
            },
            ready: function(requestData, subPage) {
                qt.$('.comment-imgs img').lazyload();
                circle = new Circle('.scores-cricle', {
                    num: $('.scores-cricle').attr('data-score') || 0,
                    total_num: 5,
                    time: 1000,
                    skip: 0.1,
                    size: '40px'
                });
                circle.circleStart();
                qt.$('#scoresTab').tab({
                    effect: 'slide',
                    lineWidth: '100%',
                }).on('switch', function(e, to, from) {
                    var $to = $(to.div[0]),
                        commentType = $(to[0]).attr('data-commentType');
                    $to.find('.loading-wrap').length !== 0 && renderCommentList(requestData.seq, $to, commentType);
                });
                qt.onScrollStop(function(top) {
                    var scrollBottom = top + window.innerHeight,
                        pageHeight = document.body.scrollHeight;
                    if (scrollBottom < pageHeight) {
                        return;
                    }
                    getMoreComment(requestData.seq);

                });
            },
        },
        events: function() {
            return {
                'tap .add-arrow-down': 'showMore',
                'tap .more_comment': 'moreComment',
                'tap .comment-imgs>div': 'viewImage',
                'tap .commentbtn': 'goComment'
            };
        }(),
        templates: {
            header: function() {
                return '<nav class="icon previous left"></nav><h1 class="title">' + qt.getTransferData().hotelName + '</h1>'
            },
            subHeader: function(requestData, subPage) {
                return ''
            },
            body: function(requestData, subPage) {
                return {
                    url: '/api/hotel/hoteldetail/comment',
                    data: {
                        seq: requestData.seq,
                    },
                    success: function(data) {
                        if (data.errcode === 0) {
                            return qt.util.template(tpl, data);
                        } else {
                            qt.alert(data.msg);
                            return '';
                        }
                    },
                    error: function() {
                        return ''
                    }
                }

            },
            footer: ''
        },
        handles: function() {
            return {
                showMore: function(e) {
                    var $me = $(e.currentTarget);
                    $me.hasClass('arrow-up') ? $me.css({
                        'max-height': '55px'
                    }) : $me.css({
                        'max-height': 'none'
                    });
                    $me.toggleClass('arrow-up');

                },
                moreComment: function(e, requestData, subPage) {
                    getMoreComment(requestData.seq);
                },
                viewImage: function(event) {
                    // console.log('viewImage');
                    let index = $(event.currentTarget).index();
                    // console.log($(event.currentTarget).html(), !!$(event.currentTarget).html());
                    if (!$(event.currentTarget).html()) {
                        return;
                    }
                    let list = $(event.target).closest('.comment-imgs').data('imgs');
                    // console.log(index, list);
                    ImageView.open({
                        forceRefresh: true,
                        data: {
                            imglist: [{
                                imgNodes: list
                            }],
                            title: list[0].tag,
                            index: index,
                            tplImage: '<img src="<%- url %>" title="<%- title %>" />'
                        },
                        onOpen: function() {
                            $('body').addClass('qt-overflow');
                        },
                        onBack: function(data) {
                            $('body').removeClass('qt-overflow');
                        }
                    });
                },
                goComment: function(e, requestData) {
                    location.href = 'hotelcomment?r=1&seq=' + requestData.seq + '&hotelName=' + qt.getTransferData().hotelName;
                }
            };
        }()
    });

    function getMoreComment(seq) {
        var $dom = qt.$('.content>.active'),
            commentType = qt.$('.nav>.active').attr('data-commentType'),
            currentpage = parseInt($dom.attr('data-currentpage')),
            totalpage = parseInt($dom.attr('data-totalpage')),
            $more_comment = qt.$('.more_comment');
        if (currentpage < totalpage) {
            $more_comment.removeClass('qt-hide').html('<span class="icon spinner"></span>加载中....');
            renderCommentList(seq, $dom, commentType, currentpage + 1, true);
        } else {
            $more_comment.addClass('qt-hide')
        }
    }

    function renderCommentList(seq, dom, commentType, commentPage, append) {
        commentPage = commentPage || 1;
        $.ajax({
            url: '/api/hotel/hoteldetail/comment',
            type: 'get',
            dataType: "json",
            data: {
                seq: seq,
                commentType: commentType || 0,
                commentPage: commentPage
            },
            error: function(xhr) {
                qt.alert('数据加载失败！请稍后刷新再次尝试！')
            },
            success: function(data) {
                if (data.errcode !== 0) {
                    qt.alert(data.msg);
                    return;
                }
                var html = util.template(commentListTpl, data),
                    $dom = $(dom);
                $dom.attr('data-totalpage', data.data.totalPageNum).attr('data-currentpage', data.data.currentPageNum);
                append ? ($dom.find('.more_comment').remove(), $dom.append(html)) : $dom.html(html);
                qt.$('.comment-imgs img').lazyload();
                qt.$('#scoresTab').tab('fitToContent');

            }
        });
    }

})();