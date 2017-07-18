
## flick 轻拂组件

## 用例

	<div class="qt-flick-class"><!--添加自定义clss，来定制样式-->
        <div class="qt-flick">
            <div class="sp-head">
                <div>取消</div>
                <div>确认</div>
            </div>
            <div class="custom">自定义内容<br/><br/><br/></div><!--添加自定义内容-->
            <div class="part-title-collection"><!--part标题-->
                <div>推荐排序</div>
                <div>价格/星级</div>
            </div>
            <div class="sp-center" >
                <div class="part" data-part-id="part1"><!--data-part-id必须-->
                    <div class="line-div"></div>
                    <div class="in-sp-center">
                        <div >推荐排序</div>
                        <div >价格升序</div>
                        <div class="active">价格降序</div>
                        <div >评价降序</div>
                    </div>
                </div>
                <div class="part" data-part-id="part2">
                    <div class="line-div"></div>
                    <div class="in-sp-center">
                        <div >推荐排序2</div>
                        <div >价格升序3</div>
                        <div >价格降序4</div>
                        <div >评价降序5</div>
                        <div class="active">评价降序6</div>
                        <div >评价降序7</div>
                        <div >推荐排序8</div>
                        <div >价格升序9</div>
                    </div>
                </div>
                <div class="part" data-part-id="part3">
                    <div class="line-div"></div>
                    <div class="in-sp-center">
                        <div >推荐排序2</div>
                        <div >价格升序3</div>
                        <div >价格降序4</div>
                        <div >评价降序5</div>
                        <div class="active">评价降序6</div>
                        <div >评价降序7</div>
                        <div >推荐排序8</div>
                        <div >价格升序9</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    //zepto plugin
        $('.slideContainer').qflick({
            anchor: '.slideContainer',
            do3dEffect: true,
            title: '<div>价格</div><div>星级</div>',
            parts: [
                {
                    partTpl: '<div class="active">价格不限</div>  ' +
                            '<div >&yen;100以下</div>  ' +
                            '<div >&yen;100-&yen;150</div> ' +
                            '<div >&yen;150-&yen;200</div> ' +
                            '<div >&yen;200-&yen;300</div> ' +
                            '<div >&yen;300-&yen;500</div> ' +
                            '<div class="a" data-ppp="a">&yen;500以上</div>',
                    id: 'part1'
                },
                {
                    partTpl: '<div class="active">星级不限</div>  ' +
                            '<div >经济型</div>  ' +
                            '<div >二星级/其他</div> ' +
                            '<div >三星级/舒适</div> ' +
                            '<div >四星级/高档</div> ' +
                            '<div >五星级/豪华</div>',
                    id: 'part2'
                }
            ]
        });

    //module
    var Tab = require('plugins/qflick/qflick'),
        tab = new QFlick('.slideContainer',{
            do3dEffect: true,
            title: '<div>价格</div><div>星级</div>',
            parts: [
                {
                    partTpl: '<div class="active">价格不限</div>  ' +
                            '<div >&yen;100以下</div>  ' +
                            '<div >&yen;100-&yen;150</div> ' +
                            '<div >&yen;150-&yen;200</div> ' +
                            '<div >&yen;200-&yen;300</div> ' +
                            '<div >&yen;300-&yen;500</div> ' +
                            '<div class="a" data-ppp="a">&yen;500以上</div>',
                    id: 'part1'
                },
                {
                    partTpl: '<div class="active">星级不限</div>  ' +
                            '<div >经济型</div>  ' +
                            '<div >二星级/其他</div> ' +
                            '<div >三星级/舒适</div> ' +
                            '<div >四星级/高档</div> ' +
                            '<div >五星级/豪华</div>',
                    id: 'part2'
                }
            ]
        });

## 参数

**ele** -- 页面锚点

**options** --  配置参数

    {
        anchor    : ele,     //页面锚点
        tpl       : '',      //组件模板，需要传入QFlick组件完整html机构，为高级用法不建议使用
        lineHeight: 40,      //文字行高
        transitionTime:0.3,  //动画时间--最好设置在0.6s以下
        do3dEffect: false,   //是否做3D变换
        head      : '',      //QFlick头部显示的内容
        noHeader  : true,    //是否显示头部
        custom    : '',      //QFlick自定义部分显示的内容
        noCustom  : true,    //是否显示自定义部分
        title     : '',      //QFlick标题部分显示的内容
        noTitle   : false,   //是否显示头部部分
        events    : {},      //用户自定义事件{'click':function(){}}
        parts     : []       //设置QFlick纵向滚动选择部分
    }

## API

**checkedChange(fun):** 选定的行变换时触发回调函数fun，回调函数参数包括selectedDom(选定的dom元素), partId(所属part的data-part-id值)

**appendColumn(tpl):** 添加新的可滑动纵列，参数tpl--{partTpl: '',id: ''}

**setSelect(parameter, partId, doAnimation):** 设置part中要选中的行,parameter--{'html': price}||{'class': price}||{'data-xxx': price}设置选择方式,partId--要设置选择的part的id,doAnimation--是否使用过渡动画

**show():**  显示qflick

**hide():**  隐藏qflick

**destroy():**  销毁qflick

**getCheckedData(partId, sel):**  获得被选中的数据，partId--要获取数据的part,sel--'html'||'dom'||'data-xxx'设置返回数据的方式
