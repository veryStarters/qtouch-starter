<%_.each(detail,function(item,index,detail) {%>
<p class="<%= detail.length == 1 ? 'single-date' : '' %>" data-date="<%= item.date %>"><%= index == 0 ? '住' : '离'%><span class="qt-ml5"><%= item.month %>-<%= item.day %></span></p>
<% });%>