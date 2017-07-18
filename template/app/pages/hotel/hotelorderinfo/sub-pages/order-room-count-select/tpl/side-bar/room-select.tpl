<div class="radio-box">
    <h2 class="qt-bb-x1 qt-font16">请选择房间数</h2>
    <ul class="qt-font14">
        <%for(var i=data.minRooms; i<=data.maxRooms; i++) {%>
        <li class="<%= i == data.curData.roomCount ? 'active' : ''%>" data-value="<%= i %>">
            <i class="icon checkmark"></i>
            <p class="qt-bb-x1"><%= i %></p>
        </li>
        <%}%>
    </ul>
</div>