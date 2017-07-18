<div class="radio-box">
    <h2 class="qt-bb-x1 qt-font16">请选择儿童1年龄</h2>
    <ul class="qt-font14 child-age">
        <%_.each(data.childrenAgeOpts, function(item){%>
        <li class="<%= item.value == curValue? 'active' : ''%>"  data-value="<%= item.value %>" data-key="<%= item.key%>">
            <i class="icon checkmark"></i>
            <p class="qt-bb-x1"><%= item.key %></p>
        </li>
        <%});%>
    </ul>
</div>