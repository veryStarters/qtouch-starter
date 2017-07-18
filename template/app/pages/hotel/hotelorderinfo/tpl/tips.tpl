<%_.each(weakTips, function(item, index) {%>
<%if(item.isHide == true && item.name != 'vouch') return false;%>
<li class="ellipsis <%= item.name%> <%= item.isHide == true ? 'qt-hide' : ''%>">
    <span class="title"><%= item.title %>：</span>
    <span class="qt-grey content"><%= item.desc %></span>
</li>
<%})%>