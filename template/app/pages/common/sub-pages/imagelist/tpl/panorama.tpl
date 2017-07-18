<div class="pano-list">
  <% _.each(listGroup, function(group, index) { %>
    <div class="group">
      <% if (multipleCatalogFlag) { %>
        <h2 class="type"><%- group.type %></h2>
      <% } else { %>
        <span class="space"></span>
      <% } %>
      <ul>
        <% _.each(group.list, function(val, idx) { %>
          <li class="pano-pic" data-panoid="<%- val.PID %>" data-info="<%- val.Info %>">
            <img src="http://pcsv0.map.bdimg.com/?qt=pr3d&fovy=75&quality=50&panoid=<%- val.PID %>&heading=10&pitch=<%- val.Pitch %>&width=300&height=200" title="<%- val.Info %>" />
            <span><%- val.Info %></span>
          </li>
        <% }); %>
      </ul>
    </div>
  <% }); %>
</div>
