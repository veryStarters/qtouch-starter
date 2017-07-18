<div class="history-city <% if(!history.length) {%> qt-hide <% } %> ">
    <div class="city-title cityHisTitle" data-index-key="历史选择">历史选择</div>
    <div class="city-wrap">
        <%_.each(history,function(city,index) { %>
        <div class="city-package">
            <div class="city-grid" data-city="<%=city.city%>"><%=city.city%></div>
        </div>
        <%})%>
    </div>
</div>

<div class="city-title" data-index-key="热门城市">热门城市</div>
<% _.each(data.data,function(data){ %>
<% _.each(data,function(citys,letter){ %>
    <% if(letter == '热门城市'){ %>
    <div class="city-wrap js-popular-gj-city">

        <% _.each(citys,function(city){ %>
            <%if(city.cityName.length>=5){%>
            <div class="city-package">
                <div class="city-grid qt-font12" data-city="<%= city.cityName%>" data-city-type="gj"><%= city.cityName%></div>
            </div>
            <%}else{%>
            <div class="city-package">
                <div class="city-grid " data-city="<%= city.cityName%>" data-city-type="gj"><%= city.cityName%></div>
            </div>
            <%}%>

        <% }) %>
        </div>

    <% } %>

<% }) %>
<% }) %>
<div class="gj-city-list">
    <% _.each(data.data,function(data,index){ %>
    <% _.each(data,function(citys,letter){
    if(letter!='热门城市'){%>
    <div class="city-title" data-index-key="<%= letter%>"><%= letter%></div>
    <div class="city-wrap ">
        <% _.each(citys,function(city,num){ %>
        <% if(city.cityName.length>=5){ %>
        <div class="city-package">
            <div class="city-grid qt-font12" data-city="<%= city.cityName%>" data-city-type="en"><%= city.cityName%></div>
        </div>
        <% }else{ %>
        <div class="city-package">
            <div class="city-grid " data-city="<%= city.cityName%>" data-city-type="en"><%= city.cityName%></div>
        </div>
        <% } %>
        <% }) %>
    </div>
    <% }}) %>
    <% return false %>
    <% }) %>
</div>