/*
 - 酒店点评页
 - User: rj.ren
 - Date: 16/6/20
*/

import typeSelectTpl from './../tpl/typeselect.tpl';
import selectDate from './selectDate.js';

module.exports = (() => {
    var util = qt.util,
        req = qt.requestData,
        commentMap = {
            "5": "非常好! 5分",
            "4": "很好! 4分",
            "3": "一般! 3分",
            "2": "差! 2分",
            "1": "糟糕! 1分"
        };
    return qt.definePage({
        config: {
            init: () => {},
            ready: () => {
                // 清空评价输入框
                $('.commenttextarea').val('');
                // 初始化日期选择
                if (req.r !== 2) {
                    selectDate.init();
                }
                bindInputComment();
            }
        },
        events: {
            'tap .oc-triptype': 'typeSelect',
            'click .commentstar': 'commentStarSelect',
            'tap .submit': 'submit'
        },
        handles: {
            // 入住类型选择
            typeSelect: (e) => {
                var tripTypeObj = qt.firstData.tripTypeList;
                qt.showSidebar({
                    type: 'bottom',
                    maskOpacity: .5,
                    onTapMask: () => {
                        qt.hideSidebar();
                    },
                    template: qt.util.template(typeSelectTpl, {
                        data: tripTypeObj
                    }),
                    events: {
                        'tap .typelist li': 'typeselected'
                    },
                    typeselected: (e) => {
                        var $me = $(e.currentTarget),
                            typeObj = {
                                value: $me.data('value'),
                                desc: $me.data('desc')
                            };
                        util.localStorage.setItem('trip_type', JSON.stringify(typeObj));
                        qt.hideSidebar();
                        $('.typename').html(typeObj.desc);
                    }
                });
            },
            // 评分
            commentStarSelect: (e) => {
                var score = Math.ceil(e.originalEvent.layerX / 37),
                    $scorenum = $('.scorenum'),
                    $scoredesc = $('.scoredesc'),
                    $title = $('.commentscore .title'),
                    $userscore = $('.userscore');
                $(".starscore").css("width", 37 * score + "px");
                $title.addClass('qt-hide');
                $userscore.removeClass('qt-hide');
                $scorenum.html(score);
                $scoredesc.html(commentMap[score]);
            },
            // 提交评价
            submit: () => {
                var comment = $('.commenttextarea').val(),
                    score = $('.userscore .scorenum').html(),
                    type = $('.typename').html(),
                    reg = /\s/g,
                    filterComment = comment.replace(reg, ''),
                    checkInDate = '';
                if (req.r == 2) {
                    checkInDate = req.checkInDate;
                } else {
                    checkInDate = $("select[name=year]").val() + '-' + $("select[name=month]").val();
                }
                // 验证提交数据
                if (filterComment.length < 10 || filterComment.length > 1000) {
                    qt.alert("请输入10-1000字的点评内容");
                } else if (type === '请选择') {
                    qt.alert("请选择入住类型");
                } else if (!score) {
                    qt.alert("请为酒店打个分！");
                } else {
                    var tripData = JSON.parse(util.localStorage.getItem('trip_type')),
                        typeValue = tripData.value;
                    $.ajax({
                        url: '/api/hotel/hotelcomment/submit',
                        type: 'POST',
                        dataType: "json",
                        data: {
                            score: score,
                            seq: req.seq,
                            orderNum: req.orderNum,
                            r: req.r,
                            comment: filterComment,
                            checkInDate: checkInDate,
                            tripType: typeValue,
                            commentId: qt.firstData.commentId,
                            wrapperId: qt.requestData.wrapperId
                        },
                        success: (res) => {
                            if (res.ret) {
                                qt.alert({
                                    message: res.data.msg,
                                    onOk: () => {
                                        location.href = res.data.jumpUrl;
                                    }
                                });

                            } else {
                                qt.alert(res.msg);
                            }
                        },
                        error: () => {
                            qt.alert("网络错误，请稍后再试");
                        }
                    });
                }
            }
        }
    });
    // 文本输入框绑定输入监听事件。
    function bindInputComment() {
        $('.commenttextarea').bind('keyup input', function() {
            var allow = 1000,
                $me = $(this),
                $counttip = $('.counttip'),
                val = $me.val(),
                $hascount = $('.hascount'),
                $recount = $('.recount'),
                len = val.length,
                reg = /\s/g,
                reaLen = val.replace(reg, '').length;
            if (reaLen > 0) {
                $counttip.removeClass('qt-hide');
            } else {
                $counttip.addClass('qt-hide');
            }
            // 如果输入超过最大范围，截断超出部分文字
            if (reaLen > allow) {
                var blank = 0;
                var count = 0;
                for (var i = 0; i < len && count <= allow; i++) {
                    if (!/\s/.test(val.charAt(i))) {
                        count++;
                    } else {
                        blank++;
                    }

                }
                var index = allow + blank;
                var str = val.substr(0, index);
                $(this).val(str);
            }
            $hascount.html(reaLen);
            $recount.html((allow - reaLen) < 0 ? 0 : (allow - reaLen));
        });
    }
})();