# multiselector组件

### 初始化参数

| 参数名 | 说明 |
| --- | --- |
| width | 容器宽度 |
| onChecked | 选择事件回调|
| onUnchecked | 解除选择回调|
| tplData | 内容模版如：[{text: '经济型', val: 'aaa', checked: true},{text: '1星', val: 'aaab', checked: true}]|


---

### 方法

#### toggle(ele, isCallback)

参数：ele为要切换的button,isCallback是否需要回调

用途：切换check状态。


#### chooseAll()

用途：全选

#### status()

参数：type: 如果type为array则返回数组

用途：获取一组按钮选择的状态

