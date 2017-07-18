<div class="radio-box">
    <h2 class="qt-bb-x1 qt-font16">国家</h2>
    <ul class="qt-font14 limit-height">
        <%_.each(data, function(item) {%>
        <li class="<%= item.code == curValue ? 'active' : '' %>" data-key="<%= item.name %>" data-value="<%= item.code %>">
            <i class="icon checkmark"></i>
            <p class="qt-bb-x1"><%= item.name %></p>
        </li>
        <%});%>
    </ul>
</div>