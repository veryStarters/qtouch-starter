<div class="radio-box">
    <h2 class="qt-bb-x1 qt-font16">发票内容</h2>
    <ul class="qt-font14">
        <%_.each(data, function(item) {%>
        <li class="<%= item.value == curValue ? 'active' : '' %>" data-key="<%= item.key %>" data-value="<%= item.value %>">
            <i class="icon checkmark"></i>
            <p class="qt-bb-x1"><%= item.key %></p>
        </li>
        <%});%>
    </ul>
</div>