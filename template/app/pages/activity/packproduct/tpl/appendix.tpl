<% _.each(display, function(col) { %>
    <div class="info">
    <% _.each(col, function(row) {%>
        <p><%=row%></p>
    <% }); %>
    </div>    
<% }); %>