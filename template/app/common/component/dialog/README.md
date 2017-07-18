# Dialog组件

### 初始化参数

| 参数名 | 说明 |
| --- | --- |
| title (可选) | 设置弹窗标题 |
| okText (可选) | 设置确定按钮文案 |
| cancelText (可选) | 设置取消按钮文案 |
| onOk (可选) | 确定按钮回调函数 |
| onCancel (可选) | 取消按钮回调函数 |
| content (可选) | 弹窗内容 |
| header (可选) | 弹窗头部内容 |
| footer (可选) | 弹窗底部内容 |

---

### 方法

#### show(position[opt])

参数：position（可选）指定弹窗显示位置

用途：显示弹窗。


#### hide()

用途：隐藏弹窗。

#### setOkText(text)

参数：text

用途：设置确定按钮文案

#### setCancelText(text)

参数：text

用途：设置取消按钮文案

#### destroy()

用途：销毁弹窗实例

#### setContent(html)

参数：html

用途：设置弹窗内容

#### setHeader(html)

参数：html

用途：设置弹窗头部内容

#### setFooter(html)

参数：html

用途：设置弹窗底部内容

#### stopShow()

用途：阻止下次弹窗展示

#### resetStopShow()

用途：取消阻止下次弹窗展示

#### stopHide()

用途：阻止下次弹窗隐藏

#### resetStopHide()

用途：取消阻止下次弹窗隐藏

---

### 事件

| 事件名 | 说明 |
| --- | --- |
| beforeshow | 将要显示弹窗前触发 |
| aftershow | 弹窗展示后触发  |
| beforehide | 将要隐藏弹窗前触发  |
| afterhide | 弹窗隐藏后触发 |
| destroy | 销毁实例时触发 |
| ok | 点击确定按钮时触发 |
| cancel | 点击取消按钮时触发 |
