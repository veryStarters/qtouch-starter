<ul class="order-change-list">
	<% _.each(data, function(item){%>
	    <li>
	    	<div class="order-change-title">
	    		<em><%= item.initiator%></em>
	    		<%=item.updateTime%>
	    	</div>
	    	<% if(item.detail&&item.detail.length>0) {%>
		    <div class="order-change-content">
		    	<% _.each(item.detail,function(detailItem) {%>
		    		<div>
			    		<div class="order-change-label"><%=detailItem.title%></div>
			    		<div class="order-change-desc"><%=detailItem.content%></div>
			    	</div>
		    	<%})%>
		    </div>
	    	<%}%>
	    </li>
    <%})%>
</ul>