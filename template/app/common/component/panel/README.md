
## panel 组件

### options

| 参数         |  说明                   |
| :----------| :---------------------|
| animate     | bool， 是否进行动画 default: true      |
| position    | [left, right, top, bottom], panel打开的位置 default: left|
| display     | overlay, panel的呈现方式，暂只支持overlay |
| lock        | 是否展示蒙层 mask   default: false |
| dismissable | bool，当点击非panel区域时关闭panel default: true|
| content     | 自定义panel内容        |
| timing      | ['ease-in', 'ease-out', 'linear', 'ease-in-out'], default ease    | 
| duration    | 打开panel的动画时间 default: 300ms |
| height\width | 自定义宽或高 只能出现其一，且和position有关，自带单位|
| page        | 开启page模式，值为page的id　　　　　｜

### APIS
***
**open( )** 
参数: 无
用途: 打开panel
***
**hide( )**
参数: 无
用途: 关闭panel
***
**toggle( )**
参数: 无
用途: 打开或关闭toggle
***
**destory( )**
参数: 无
用途:  销毁panel
***

### events
| 事件名          |    说明           |
|:--------       |:-----------------|
|beforeOpen      |打开panel之前触发   |
|afterOpen       |当panel完全打开之后触发，如果animate = false, 其无效|
|beforeClose     |关闭之前触发        |
|afterClose      | 关闭之后触发，如果animate = false, 其无效| 

### demo

*html*
``` html
<button class = "qt-panel-toggle"></button>
<div class = "qt-panel"></div>
```
*javascript*
``` javascript
$('.my-panel').panel({
	position: 'bottom',
	timing: 'ease-in',
	lock: 'true',
});
$('.qt-panel-toggle').click(function() {
	$('.qt-panel').panel('toggle');
	//$('.qt-panel').data('panel').toggle();
});
```


