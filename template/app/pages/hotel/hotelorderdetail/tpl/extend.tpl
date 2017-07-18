<div class="extendpop">
    <p class="qt-black qt-bold qt-font14 qt-bg-grey title">您需要延住多久</p>
    <ul class="qt-font12 extendlist">
        <% _.each(data, function(item){ %>
        <li class="qt-bb-x1" data-price="<%=item.price%>" data-time="<%=item.time%>">
            <span class="qt-grey qt-mr10"><%=item.time%></span>
            <span class="qt-orange"><%=item.currencySign%><%=item.price%></span>
        </li>
        <% }); %>
    </ul>
</div>