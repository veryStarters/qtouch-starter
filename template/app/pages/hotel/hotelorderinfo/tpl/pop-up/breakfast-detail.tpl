<ul class="breakfast-detail-content">
    <%_.each(data, function(item) {%>
    <li class="tips"><span class="left"><%= item.date %></span><span class="right"><%= item.value %></span><span class="center"></span></li>
    <%})%>
</ul>