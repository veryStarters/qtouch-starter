<% if(!orders.length) { %>
<p class="load-failed"></p>
<p class="errmsg">没有查询到本地相关订单</p>
<% } else {%>
<ul class="order-result-list">
    <%_.each(orders, function(item, index) {%>
    <li  data-ordernum="<%= item.orderno %>" data-wrapperid="<%= item.wrapperid %>" data-mobile="<%= item.mobile %>">
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
                    <span class="hotelname qt-bold"><%= item.hotelname %></span>
                    <span class="qt-fr"><i class="currency"><%= item.currency == '' ? '￥' : item.currency %></i><%=item.price %></span>
                </p>
                <p class="qt-font12">
                    <%=qt.util.dateFormat(new Date(item.t),'yyyy-MM-dd hh:mm:ss')%>
                </p>
                <p class="qt-font12 qt-grey roomname">
                    <%= item.roomname %>
                </p>
            </div>
        </div>
    </li>
    <%})%>
</ul>
<%}%>

