<div class="qt-bb-x1 box">
    <h6 class="qt-bb-x1">选择房间数</h6>
    <div class="qt-bb-x1 qt-arrow r room-count">
        <span class="qt-blue label">房间数</span>
        <span class="val"><%= data.curData.roomCount %></span>
    </div>
</div>

<div class="room-detail">
<%_.each(data.curData.detail, function(item, index) {%>
<div id="room<%= index %>" class="qt-btb-x1 box">
    <h6 class="qt-bb-x1">房间<%= index+1 %></h6>
    <div class="qt-bb-x1 qt-arrow r adult-count" data-value="<%= item.adult %>">
        <span class="qt-blue label">成人数</span>
        <span class="val"><%= item.adult %></span>
    </div>
    <div class="qt-bb-x1 qt-arrow r child-count" data-value="<%= item.children %>">
        <span class="qt-blue label">儿童数</span>
        <span class="val"><%= item.children %></span>
    </div>
    <div class="age-box">
        <%if(item.children > 0) {%>
        <% for(var i=0,len=item.age.length; i<len; i++) {%>
        <div id="child-age-<%= i %>" class="qt-bb-x1 qt-arrow r" data-value="<%= item.age[i].key %>">
            <span class="qt-blue label">儿童1年龄</span>
            <span class="val"><%= item.age[i].key %></span>
        </div>
        <%}%>
        <%}%>
    </div>
</div>
<%});%>
</div>

<a href="javascript:;" class="qt-bg-red submit">确定</a>

