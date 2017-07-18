<div class="qt-bb-x1 qt-arrow r time-line" data-value="<%= data.arriveTimes.value%>" data-key="<%= data.arriveTimes.key%>">
    <span class="label">保留到</span>
    <span class="val"><%= data.arriveTimes.key%></span>
    <span class="<%= data.arriveTimes.needVouch == false ? 'qt-hide' : '' %> guarantee time">需要担保<span class="qt-ml5 qt-red"><%= data.currencySign%><%= data.vouchMoney%></span></span>
</div>