## 开始

**A.** 新建本地工程目录，到gitlab上clone项目

**B.** 在工程根目录执行如下命令，并等待安装完成

    npm install
    
**C.** 执行命令(手机上测试时，往往需要指定ip，可在server后增加参数： --host=192.168.*.* )
    
    grunt server [--host=192.168.*.*] [--port=8080] [--open=true]
    
**D.** 浏览器中输入http://localhost:3001访问 （默认无修改host和port情况下）
    
## 系统使用说明

###一、目录说明
   
   **A.** api : 模拟数据接口，按照api请求路径组织目录。如请求酒店列表，则接口地址为  
   
    /api/hotel/hotellist 
    
   **B.** app : 工程源码目录，分common和pages两个子目录，分别表示公用源码及页面级源码
   
   其中app/common/component为公用组件目录，pages/common/为公用子页面或者模板片段目录
   
   **C.** config : 构建系统配置目录,包含api模拟数据的线上线下环境切换配置
   
   **D.** 除此之外的其余目录均为临时目录或构建目录，跟开发无关
   
### 二、开发约定
   
   **A.** 开发时主要的工作目录在app目录下, 一般集中在app/pages和app/common/component两个目录
   
   **B.** 在pages目录下，除了common外，每个一级子目录代表一个模块，现有包括首页(index)、酒店(hotel)、用户中心(user)、活动(activity)五个
   
   **C.** 每个模块下的一个目录代表一个独立可访问页面（可直接刷新浏览器,简称page), 默认index目录为该模块的起始页
      
   **D.** 除了C中所说的可独立访问页面之外，系统还存在一些诸如城市选择、日历选择和关键词选择等独立访问无意义的页面，它们被称为子页面(简称subPage)
   
   **E.** 每个可独立访问页(page)的文件夹都至少包含如下几个文件：
     
   *index.vm* : 页面后端模板文件，可以在此定义需要后端渲染的模块内容
   
   *main.js* : 页面入口js文件，理论上无需修改其中内容，仅作为导入主应用(app.js)的入口
   
   *app.js* : 页面主应用js文件，业务逻辑在此实现
   
   *main.less* : 页面样式文件，若页面引入了其他组件(component), 需要在此导入对应component的样式文件
   
   其他如模板文件等按照各个页面的特点进行定义，不做强制规定
   
   **F.** 定义一个可独立访问页面(page)和一个非独立访问页面(subPage)基本相同，区别有如下几点：
   
   *1.* page通过qt.definePage方法来定义；subPage通过qt.defineSubPage来定义
   
   *2.* page的配置参数(config)中只存在init和ready两个回调；subPage除前面两个外，还存在name、animate、forceRefresh等参数
   
   *3.* page有一个完整的目录结构,独占一个非pages/common底下的目录；subPage统一存于pages/common/sub-pages/目录底下，通常仅包含一个js文件和一个less文件
   
   **G.** 在所有definePage和defineSubPage中都可以随意使用qt或者QTouch变量，系统提供的绝大部分功能都存在于该对象内部
   
   **H.** qt对象提供的功能包括但不限于对话框、加载浮层、遮罩、滚动页面等，更多的功能仍在不断开发中
   
   **I.** 样式上采用原子组合方式来写，虽然一个元素上可能由很多个class组成，但在样式定义的总量上应该是比较小的
   
   **J.** /index/test/页面将会包含了系统提供的绝大部分js和css组件示例，之后还会不断补充
   
   **K.** 页面内获取元素使用 **qt.$** 代替 **$** ,防止误操作非本页面元素
   
   **L.** 获取元素时原则上需使用自己定义的class或者id，禁止通过 **qt-** 开头的类来获取元素
   
   
   
### 三、一些细节
    
   
