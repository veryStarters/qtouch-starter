<ul class="recommend-sort">
    <%_.each(data, function(item,index) {%>
    <% var liClass = item.checked ? 'active' : '';%>
    <li class="<%= liClass%>" data-path="<%= item.path%>" data-value="<%= item.qname%>">
        <i class="icon checkmark"></i>
        <p class="qt-bb-x1"><%= item.dname%></p>
    </li>
    <% }) %>
</ul>