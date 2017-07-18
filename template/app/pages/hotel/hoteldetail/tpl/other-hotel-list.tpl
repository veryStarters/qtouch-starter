<% _.each(data,function(hotel,index){ %>
<li class="qt-grid qt-arrow r" data-categorycode="<%=hotel.categorycode%>">
    <div class="col10">
        <%=hotel.categoryName%>
    </div>
    <div class="col2 qt-right qt-pr10">
        <span class="qt-blue qt-font12"><%=hotel.count%></span>
    </div>
</li>
<% }) %>
