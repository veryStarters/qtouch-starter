/**
 * Created by taoqili on 15/11/20.
 */
export default {
    apis: {
        //酒店列表
        hotelListApi: 'api/hotellist',
        //钟点房列表
        hotelHourListApi: 'api/hotelhourlist',
        //酒店热门搜索关键词
        hotKeywordsApi: 'api/hotkeywords',
        //酒店详情
        hotelDetailApi: 'api/hoteldetail',
        //钟点房酒店详情
        hotelHourDetailApi: 'api/hotelhourdetail',
        //酒店设施
        hotelDeviceApi: 'api/hoteldevice',
        //酒店报价
        hotelPriceApi: 'api/hotelprice',
        //钟点房酒店报价
        hotelHourPriceApi: 'api/hotelhourprice',
        //酒店图片
        hotelImgApi: 'api/hotelimg',
        //酒店订单列表
        hotelOrderListApi: 'api/hotelorderlist',
        //团购订单列表
        hotelGroupOrederListApi: 'api/grouporderlist',
        //城市提示
        citySuggestApi: 'api/citysuggest',
        //城市列表
        cityListApi: 'api/citylist',
        //关键词搜索提示
        keywordSuggestApi: 'api/keywordsuggest',
    },
    //用户中心运行api
    usercenterApis: {
        dev: 'http://ucenter.beta.qunar.com/userExt/accredit.jsp',
        beta: 'http://ucenter.beta.qunar.com/userExt/accredit.jsp',
        prod: 'http://user.qunar.com/userExt/accredit.jsp'
    }
}