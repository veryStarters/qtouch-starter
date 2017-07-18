# Tip组件

### 初始化参数

| 参数名 | 说明 |
| --- | --- |
| content（可选） | 提示内容 |
| duration（可选） | 提示展示持续时长 |
| effect（可选） | 动画效果。可选值：fade, slideleft, slideright, slideup, slidedown |
| autoHide（可选） | 是否展示后自动隐藏 |
| position（可选） | 展示位置。可选值：static, top, bottom, 定位对象{ left: 0, top: 0, right: 0, bottom } |

---

### 方法

#### info(content/cfg)

参数：content/cfg 文本内容或参数配置

用途：以info形式展示content文本；如果参数为object，则重新设置参数后，再展示文本内容。


#### warn(content/cfg)

参数：同上

用途：同上，但以warn形式展示文本

#### error(content/cfg)

参数：同上

用途：同上，但以error形式展示文本

#### success(content/cfg)

参数：同上

用途：同上，但以success形式展示文本

#### show(content/cfg)

参数：同上

用途：同上，但以上次形式展示文本

#### hide()

用途：隐藏展示

---

### 事件

无
