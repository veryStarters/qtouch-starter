<div class="radio-box">
    <h2 class="qt-bb-x1 qt-font16">请选择成人数</h2>
    <ul class="qt-font14">
        <% for(var i=0,len=data.adultsNumPreRoom.length; i< len; i++) {%>
        <%      item = data.adultsNumPreRoom[i]; %>
        <li class="<%= item == curValue ? 'active' : '' %>" data-value="<%= item %>">
            <i class="icon checkmark"></i>
            <p class="qt-bb-x1"><%= item %></p>
        </li>
        <% if(item == maxPerson) break;%>
        <%}%>
    </ul>
</div>