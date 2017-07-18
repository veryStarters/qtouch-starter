<div id="room<%= index%>" class="qt-btb-x1 box">
    <h6 class="qt-bb-x1">房间<%= index+1 %></h6>
    <div class="qt-bb-x1 qt-arrow r adult-count" data-value="<%= data.defaultAdults %>">
        <span class="qt-blue label">成人数</span>
        <span class="val"><%= data.defaultAdults %></span>
    </div>
    <div class="qt-bb-x1 qt-arrow r child-count" data-value="<%= data.defaultChildrens %>">
        <span class="qt-blue label">儿童数</span>
        <span class="val"><%= data.defaultChildrens %></span>
    </div>
    <div class="age-box">
        <%if(data.defaultChildrens > 0){ %>
        <% for(var i=0; i<data.defaultChildrens; i++) {%>
        <div id="child-age-<%= i %>" class="qt-bb-x1 qt-arrow r" data-value="<%= data.defaultChildrenAge.value %>">
            <span class="qt-blue label">儿童<%= i+1 %>年龄</span>
            <span class="val"><%= data.defaultChildrenAge.key %></span>
        </div>
        <%}%>
        <%}%>
    </div>
</div>