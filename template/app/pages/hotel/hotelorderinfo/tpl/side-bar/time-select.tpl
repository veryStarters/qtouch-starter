<div class="radio-box">
    <h2 class="qt-font16">最晚到店
        <span class="<%= hasVouch == true ? '' : 'qt-hide' %> qt-font14 qt-mr15 qt-fr qt-orange vouch-detail">需担保 <span class="price"><%= currencySign +''+ vouchMoney%></span></span></h2>
    <p class="qt-font12 qt-bb-x1 sub-title"><%= data.arriveWarmTips %></p>
    <ul class="qt-font14 limit-height">
        <%_.each(data.times, function(item) {%>
        <li class="<%= item.key == curKey ? 'active' : '' %>" data-key="<%= item.key %>" data-value="<%= item.value %>" data-vouch="<%= item.needVouch %>">
            <i class="icon checkmark"></i>
            <p class="qt-bb-x1"><%= item.key %> <%if(item.needVouch) {%><span class="qt-fr qt-mr20 vouch-tips">需担保</span><%}%> </p>
        </li>
        <%});%>
    </ul>
</div>