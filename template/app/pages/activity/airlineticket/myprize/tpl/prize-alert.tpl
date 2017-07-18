<div class="al-content-wrap">
    <%
    var alButtonA =data.alButtonA || '确定';
    var alButtonB =data.alButtonB || ''
    %>
    <div class="pr-al-content qt-bb-x1">
        <div class="al-msg"><%=data.msg%></div>
    </div>

    <div class="al-button-wrap qt-blue">
        <div class="al-buttonA"><%=alButtonA%></div>
        <% if(alButtonB){ %>
        <div class="al-buttonB qt-bl-x1"><%=alButtonB %></div>
        <% } %>
    </div>

</div>