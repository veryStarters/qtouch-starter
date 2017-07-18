/**
 * Created by taoqili on 15/10/15.
 */
import $ from 'zepto';

var animateNames = {
    none: [['', ''], ['', '']],
    slide: [
        ['slideLeftOut', 'slideLeftIn'],
        ['slideRightOut', 'slideRightIn']
    ],
    cover: [
        ['', 'slideLeftIn'],
        ['slideRightOut', '']
    ],
    coverFlip: [
        ['flipOut', 'slideLeftIn'],
        ['slideRightOut', 'flipIn']
    ],
    slideUp: [
        ['', 'slideUpIn'],
        ['slideDownOut', '']
    ],
    slideDown: [
        ['', 'slideDownIn'],
        ['slideUpOut', '']
    ],
    popup: [
        ['', 'scaleIn'],
        ['scaleOut', '']
    ],
    flip: [
        ['', 'flipIn'],
        ['flipOut', '']
    ],
    scaleDown: [
        ['', 'scaleDownIn'],
        ['scaleUpOut', '']
    ]
};

export default class Page {

    constructor(ele, opt) {
        this.$ele = $(ele);
        this.opened = false;
        this.options = $.extend({}, opt || {});
        this.init();
        this.initEvent();
    }

    init() {

    }

    initEvent() {

    }

    render() {

    }

    open(url, opt) {
        console.log(this.options);
    }

    close() {

    }

    toggle() {

    }

    destroy() {

    }


}