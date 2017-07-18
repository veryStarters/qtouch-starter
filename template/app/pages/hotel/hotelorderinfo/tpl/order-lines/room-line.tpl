<%if(!data.inputInfo || !data.inputInfo.needChildrenInfo) {%>
<div class="qt-bb-x1 room-line" data-room="<%= data.req.roomCount %>">
    <span class="label">房间数</span>
    <span class="room-account">
        <!-- roomCount 从详情页带过来的不准确,所以在这里跟minRooms比较后,重新赋值 -->
        <%if(data.req.roomCount <= data.req.minRooms) { data.req.roomCount = data.req.minRooms %>
        <i class="lt minus off"></i>
        <%}else {%>
        <i class="lt minus"></i>
        <%}%>
        <span class=""><%= data.req.roomCount <= data.req.minRooms ? data.req.minRooms : data.req.roomCount %></span>
        <%if(data.req.roomCount >= data.req.maxRooms) {%>
        <i class="rt plus off"></i>
        <%}else {%>
        <% if(!data.isGongLue) { %><i class="rt plus"></i> <%}%>
        <%}%>
    </span>
    <span class="qt-hide guarantee count">需要担保<span class="qt-red fee"></span></span>
</div>
<%} else {%>
<% var inputInfo = data.inputInfo;%>
<div class="qt-bb-x1 room-line gj-room">
    <div class="qt-arrow r">
        <span class="label">房间数及人数</span>
        <span class="val">房间<%= data.req.roomCount %> 成人<%= inputInfo.defaultAdults %> 儿童<%= inputInfo.defaultChildrens %></span>
    </div>
    <p class="qt-grey qt-font12 qt-lh1 line-tip-2">请按实际入住情况选择人数，否则入住时可能会收取额外的费用</p>
</div>
<%}%>