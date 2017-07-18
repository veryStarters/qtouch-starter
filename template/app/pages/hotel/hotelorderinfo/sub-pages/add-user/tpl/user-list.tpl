<% _.each(data, function(item){ %>
  <li class="user-item qt-bb-x1" data-name="<%= item.name %>" data-mobile="<%= item.mobile %>" data-id="<%= item.id %>">
    <i class="icon checkbox <%= item.checked %>"></i>
    <span class="user-name"><%= item.name %></span>
    <span class="user-phone">+<%= item.mobile %></span>
  </li>
<% }) %>
