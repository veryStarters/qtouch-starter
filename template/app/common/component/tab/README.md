
# Example

## 用例

``` html
    <div id="demo" class="qt-tab">
        <ul class="qt-tab-nav">
            <!--同步-->
            <li><span>标题A</span></li>
            <li><span>标题B</span></li>
            <li><span>标题C</span></li>

            <!--异步-->
            <li data-url="../../url.php?t=1">标题</li>
        </ul>
        <div class="qt-tab-line"></div>
        <div class="qt-tab-content">
            <div>内容A</div>
            <div>内容B</div>
            <div>内容C</div>
        </div>
    </div>
```

``` javascript
    //zepto plugin
    $("#demo").tab();

	//module
	var Tab = require('plugins/tab/tab'),
        tab = new Tab('#demo');

```

## 参数

**activeIndex:** 初始索引

**effect:** 效果 'none','fade','slide'

**items:** rander模式数据


``` javascript 
    [
        {
            'title':'标签',
            'url':'../qunar/index'
        },
        {
            'title':'标签',
            'content':'内容'
        }
    ]
```

## 方法

**switchTo(index):** 切换到 index 选项卡（index 索引从0开始）
**destroy** 销毁

## 事件

**beforeLoad** ajax请求前触发   

**beforeRender** ajax返回数据后触发

**loadError** ajax请求失败时触发

**switch** 切换完后触发