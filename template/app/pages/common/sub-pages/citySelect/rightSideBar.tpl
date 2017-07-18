<div class="sidebar-touch-value qt-hide"></div>
<div class="sidebar-right-side">
    <div data-letter="城市搜索"><span class="icon search" data-letter="城市搜索"></span></div>
    <div data-letter="历史选择"><span class="icon star" data-letter="历史选择"></span></div>
    <% _.each(data.data,function(data,index){ %>
        <% _.each(data,function(citys,letter){
            if(letter=='热门城市'){%>
                <div data-letter="<%= letter%>"><span class="icon rocket" data-letter="<%= letter%>"></span></div>
            <% }else{%>
                <div data-letter="<%= letter%>"><span> <%= letter%></span></div>
            <% }%>
        <% }) %>
    <% }) %>
</div>