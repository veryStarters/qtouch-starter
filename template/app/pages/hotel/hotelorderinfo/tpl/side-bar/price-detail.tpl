<ul class="price-detail">
    <% _.each( detailFees, function(item) { %>
    <li class="<%= item.isHide && item.isHide == true ? 'qt-hide' : ''%>">
        <p class="title">
            <span class="item"><%= item.name %></span>
            <span class="price"><%= item.price %></span>
        </p>

        <% _.each(item.list, function(pre) { %>
        <p class="tips <%= pre.isHide && pre.isHide == true ? 'qt-hide' : ''%>"><span class="left"><%= pre.name %></span><span class="right"><%= pre.name.indexOf('立减') > -1 || pre.name.indexOf('友谊券') > -1 ? '- '+pre.price : pre.price %></span><span class="center"></span></p>
        <%});%>

        <!-- 到店支付的描述信息在担保或定金情况下不显示 -->
        <%if(item.desc != '' && (item.text != 'front_pay' || item.text == 'front_pay' && !isDeposit && !hasVouch )) {%>
        <p class="tips"><%= item.desc %></p>
        <%}%>
    </li>
    <%});%>
</ul>