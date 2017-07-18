<div class="radio-box">
    <h2 class="qt-bb-x1 qt-font16">配送方式</h2>
    <!--<p class="qt-font12 sub-title">放大法法师法师</p>-->
    <ul class="qt-font14">
        <%_.each(data, function(item) {%>
        <li class="<%= item.value == curValue ? 'active' : '' %>"  data-value="<%= item.value %>" data-key="<%= item.key %>" data-intrafee="<%= item.intraCityPostMoney %>" data-otherfee="<%= item.otherCityPostMoney %>">
            <i class="icon checkmark"></i>
            <p class="qt-bb-x1"><%= item.value %></p>
        </li>
        <%});%>
    </ul>
</div>