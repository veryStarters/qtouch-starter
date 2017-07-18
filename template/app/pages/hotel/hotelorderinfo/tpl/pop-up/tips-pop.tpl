<ul class="tips-pop">
    <%_.each(weakTips, function(item, index) {%>
    <%if(item.isHide == false || item.name == 'vouch') return false;%>
    <li>
        <span class="title"><%= item.title %>：</span>
        <span class="qt-grey content"><%= item.desc %></span>
    </li>
    <%})%>
</ul>
