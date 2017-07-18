<%if(data.invoiceInfo.invoiceGetType == 1) {%>
<div class="qt-bb-x1 invoice">
    <span class="label">发票</span>
    <span class="qt-font14 no-invoice">不需要发票</span>
    <span class="qt-hide express-charge">快递费 <span class="qt-red"><%= data.currencySign %></span><span class="qt-red express-fee" data-value="<%= data.invoiceInfo.postType[0].intraCityPostMoney %>"><%= data.invoiceInfo.postType[0].intraCityPostMoney %></span></span>
    <span class="qt-switch"><span class="switch-handle"></span></span>

    <p class="qt-grey qt-font12 qt-hide line-tip invoice-tip"><span class="invoice-type"><%= data.invoiceInfo.invoiceType[0].key %></span> (金额: <%= data.currencySign %><span class="invoice-money"><%= data.invoiceMoney %></span> ),<%= data.invoiceInfo.invoiceGetLabel %><i class="icon qt-grey question"></i></p>
</div>
<div class="invoice-detail qt-hide">
    <p class="qt-bb-x1 qt-arrow r invoice-type" data-value="<%= data.invoiceInfo.invoiceType[0].value %>">
        <span class="label">发票类型</span>
        <span class="val"><%= data.invoiceInfo.invoiceType[0].key %></span>
    </p>
    <p class="qt-bb-x1 invoice-title">
        <span class="label">发票抬头</span>
        <span class="input"><input class="user" type="text" placeholder="请输入个人/单位名称"/></span>
    </p>
    <p class="qt-bb-x1 qt-arrow r invoice-content" data-value="<%= data.invoiceInfo.invoiceContent[0].value %>">
        <span class="label">发票内容</span>
        <span class="val"><%= data.invoiceInfo.invoiceContent[0].key %></span>
    </p>

    <div class="qt-bb-x1 qt-arrow r address_content" data-intrafee="<%= data.invoiceInfo.postType[0].intraCityPostMoney %>" data-otherfee="<%= data.invoiceInfo.postType[0].otherCityPostMoney %>">
        <span class="label">配送地址</span>
        <div class="address-content">
          <p>请选择</p>
        </div>
    </div>
</div>
<%} else if(data.invoiceInfo.invoiceGetType == 2) {%>
<div class="qt-bb-x1 invoice-line">
    <span class="label">发票</span>
    <span class="val"><%= data.invoiceInfo.invoiceGetLabel %></span>
</div>
<%} else if(data.invoiceInfo.invoiceGetType == 3) {%>
<div class="qt-bb-x1 invoice-line">
    <span class="label">发票</span>
    <span class="val"><%= data.invoiceInfo.invoiceGetLabel %></span>
</div>
<%} else if(data.invoiceInfo.invoiceGetType == 5) {%>
<div class="qt-bb-x1 invoice">
    <span class="label">发票</span>
    <span class="qt-font14 no-invoice">不需要发票</span>
    <span class="qt-switch"><span class="switch-handle"></span></span>
    <p class="qt-grey qt-font12 qt-lh1 qt-hide line-tip invoice-tip"><%= data.invoiceInfo.invoicePostWarmTips.text %></p>
</div>
<div class="invoice-detail qt-hide">
    <p class="qt-bb-x1 invoice-title">
        <span class="label">发票抬头</span>
        <span class="input"><input class="user" type="text" placeholder="请输入个人/单位名称"/></span>
    </p>
</div>
<%}%>
