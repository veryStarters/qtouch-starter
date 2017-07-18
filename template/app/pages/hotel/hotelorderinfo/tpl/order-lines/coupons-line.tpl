<%if(data.hasCoupons == true) {%>
<div class="qt-bb-x1 coupons">
    <span class="label">友谊券</span>
    <span class="qt-font14"><span class="qt-orange"><%= data.currencySign%><span class="coupons-price"><%= data.price%></span></span>立减</span>
    <span class="qt-switch <%= data.couponsActive == true ? 'active' : ''%>"><span class="switch-handle"></span></span>
</div>
<%}%>