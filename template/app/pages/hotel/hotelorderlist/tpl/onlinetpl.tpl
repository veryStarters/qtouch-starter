<% if(!data.order || !data.order.length) { %>
<p class="load-failed"></p>
<p class="errmsg">没有查询到相关订单</p>
<% } else {%>
<ul class="order-result-list">
<%_.each(data.order, function(item, index) {%>
<li data-ordernum="<%= item.orderNo %>" data-other="<%= item.isOther %>" data-wrapperid="<%= item.wrapperId %>">
    <a href="<%= item.detail %>">
    <div class="order-info qt-black">
        <p class="qt-bb-x1 order-title">
            <i class="icon q-near-hotel qt-red"></i>
            <span>酒店</span>
            		<span class="<% if(item.orderStatusColor == 1){ %>
                		qt-grey
            		<% } else if(item.orderStatusColor == 2 ){ %>
                		qt-orange
            		<% } else{ %>
                		qt-blue
            		<% } %> qt-fr "><%= item.orderStatus %>
            		</span>
        </p>
        <div class="order-detail">
            <p class="qt-lh2 qt-bold clearfix">
                <span class="hotelname qt-bold"><%= item.hotelName %></span>
                <span class="qt-fr"><i class="currency"><%= item.currencySign == '' ? '￥' : item.currencySign %></i><%=item.totalPrice %></span>
            </p>
            <p class="qt-font12">
                <%= item.checkIn %> 至 <%= item.checkOut %>
            </p>
            <p class="qt-font12 qt-grey roomname">
                <%= item.roomName %>
            </p>
        </div>
    </div>
    </a>
</li>
<%})%>
</ul>

<% if(data.page >= data.count) { %>
<div class="qt-center qt-blue qt-mb10 load-more active">
已加载全部
<% }else { %>
<div class="qt-center qt-blue qt-mb10 load-more">
查看更多<i class="qt-hide icon spinner"></i>
<% }%>
</div>
<%}%>

