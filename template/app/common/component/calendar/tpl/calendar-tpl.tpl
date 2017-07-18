<%_.each(data, function(item) { %>
<div class="calendar-body">
    <table>
        <thead>
        <tr>
            <th colspan="7"><h5><%= item.year %>年<%= item.month %>月</h5></th>
        </tr>
        </thead>
        <%_.each(item.weeks, function(weekItem) { %>
        <tr class="days">
            <% _.each(weekItem, function(dayItem) {%>
            <td class="<%= dayItem.className %>" data-day="<%= dayItem.dateStr %>"><p><%= dayItem.html %></p></td>
            <% }) %>
        </tr>
        <% }) %>
    </table>
</div>
<% }) %>