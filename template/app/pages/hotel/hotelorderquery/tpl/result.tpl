<div class="order-result-box">
<% if(!data|| !data.length) { %>
	<p class="load-failed"></p>
	<p class="errmsg"><%= '没有查询到相关订单'%></p>
<% } else {%>
<ul class="order-result-list">
    <%_.each(data, function(item, index) {%>
    <li data-ordernum="<%= item.orderNo %>" data-mobile="<%= item.smobile %>" data-url="<%= item.detailUrl %>">
        	<div class="order-info qt-black">
            	<p class="qt-bb-x1 order-title">
            		<i class="icon q-near-hotel qt-red"></i>
            		<span>酒店</span>
            		<span class="<% if(item.orderStautsColor == 1){ %> 
                		qt-grey 
            		<% } else if(item.orderStautsColor == 2 ){ %> 
                		qt-orange 
            		<% } else{ %> 
                		qt-blue 
            		<% } %> qt-fr "><%= item.orderStatus %>
            		</span>
            	</p>
            	<div class="order-detail">
					<p class="qt-lh2 qt-bold clearfix">
						<span class="hotelname qt-bold"><%= item.hotelName %></span>
						<span class="qt-fr"><%= item.currencySign %><%=item.totalPrice %></span>
					</p>
					<p class="qt-font12">
						<%= item.checkIn %> 至 <%= item.checkOut %>
					</p>
					<p class="qt-font12 qt-grey roomname">
						<%= item.roomName %>
					</p>
				</div>
            </div>
    </li>
    <%})%>
</ul>
<%}%>
</div>