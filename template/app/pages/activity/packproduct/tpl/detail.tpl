<div class="detail-pop">
    <div class="online-price">
        在线付款
        <span class="price">&yen; <label><%=data.totalPrice %></label></span>
    </div>
    <ul>

        <% _.each(data.packProducts, function(item){ %>
        <%
            var title = item.title;
            if(title.length>maxLen){
                title = title.substr(0,maxLen) + '...'
            }
        %>

        <li>
            <div class="line qt-bt-x1"></div>
            <span class="desc"><%=title%>(<%=item.count%><%=item.unit%>)</span>
            <span class="price">&yen;<%= parseFloat((parseFloat(item.price) + parseFloat(item.ptPrice)).toFixed(2)) %></span>
        </li>
        
        <% }); %>

        <% if(parseFloat(data.totalPtPrice) > 0) { %>
        <li>
            <div class="line qt-bt-x1"></div>
            <span class="desc">已减</span>
            <span class="price">- &yen;<%=data.totalPtPrice%></span>
        </li>
        <% }%>
    </ul>
</div>