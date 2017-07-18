
# Example

## 用例

	//zepto plugin
    $(".test").example({
        title: 'zepto plugin!'
    }).click(function () {
        $('.test').example('show');
    });
    
	//module
	var Example = require('plugins/example/example'),
        example = new Example('#test', {
            title: 'requireJs!'
        });
    example.$ele
        .css('color', 'green')
        .click(function () {
            example.show();
        });

## API

**show():** 默认居中显示dialog

**showAtXY( x, y):** 显示到具体的位置    

**showAtAnchor( ele, offset ):** 显示到   

**hide:**  隐藏 
