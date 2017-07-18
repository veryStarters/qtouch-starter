
# Calendar用法

## 引入

import Calendar from '../../../../common/component/calendar/index.js';

import calendarTpl from './tpl/calendar-tpl.tpl';


## 实例化

var calendar = new Calendar(data);

## 使用详细说明

**案例一** 若无自定义样式,一切用组件生成都ok,只在意用户选完的结果
* 则 实例化时 参数 必传项 onBack(选择完成后回调)
* autoRender 一定要为true [默认即为true,不要改变即可]

**案例二** 若样式可以接受组件中样式 / 组件中一部分样式,有需要自定义部分
* 则 实例化时 参数 必传项 autoRender: false
* new 完后可调用 getHeader(),getSubHeader(),getBody() 得到内容自己渲染
* 渲染完后 须调用 initEvent 方法 初始化事件;

**案例三** 若样式一点都不想用组件中样式
* 则 实例化时 参数 必传项 autoRender: false
* new完后,调用 getData 方法,得到日历数据,自行渲染
* 渲染完后 须调用 initEvent 方法 初始化事件;


## 参数(以对象形式传入,即为 data 对象中的key)

**autoRender** 是否组件自己渲染初始化事件, 默认为true, 为false时,外部可使用 getHeader(),getSubHeader(),getBody() 得到内容自己渲染,或使用getData()得到数据,自行写模板渲染

**isRange:** 是否是区间选择 true or false , 默认为true

**startDate:** 可选的开始日期, 默认为当前日期

**endDate:** 可选的结束日期, 默认为开始日期的90天后

**selecteds:** 初始选择日期,为数组 eg: ['2015-11-15','2015-11-16'] or ['2015-11-15'], 默认为空,选中 当前日期 跟 次日

**offDay:** 调休日期,为对象,从后端获取

**holiday:** 假期日期,为对象,从后端获取

** beforeShow:** 进入日历页面前回调

**beforeHide:** 日历页面退出前回调

**beforeDestory:** 销毁前回调

**onStateChange:** 选择状态后改变回调,可带一个参数 为 -- 当前点击的dom元素

**onSelectedDone:** 日期选择完成回调


## 方法

**getData:** 初始渲染数据的生成及返回,可直接用此数据去渲染,eg: $('.xx').html( qt.util.template(calendarTpl, {'data' : calendar.getData()}) );

**getHeader:** 得到头部html,自行渲染

**getSubHeader:** 得到次头部html,自行渲染

**getBody:** 得到日历详细html,自行渲染

**initEvents:** 自行渲染完后,须初始化 事件绑定,若 autoRender 为 true 则忽略此方法

**initSelecteds:** 初始化选中日期

**selectDay:** 响应日历页面选择事件,在页面日期点击时调用 此方法 ,要带参数 e 哦!!

**getSelecteds:** 获取当前选中元素

**getSelectedTimeInfo:** 计算选中日期详细信息,及间隔天数,自动按照当前选中的日期进行计算,无需传参

**show:** 显示

**hide:** 隐藏

**destory:** 销毁
