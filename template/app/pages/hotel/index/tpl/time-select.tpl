<%if(isRange) { %>
<i class="mlf35 icon calendar"></i>
<ul class="qt-bb-x1">
    <%_.each(detail,function(item,index) {%>
    <li class="" data-date="<%= item.date %>">
        <span class="month"><%= item.month %>月</span>
        <span class="day"><%= item.day %>日</span>
        <span class="qt-font12 qt-mr5 qt-grey week"><%= item.isToday == true ? '今天' : item.isTomorrow == true ? '明天' : item.isHouTian == true ? '后天' : item.week %></span>
        <span class="qt-font12 qt-mr5 qt-grey"><%= index == 0 ? '入住' : '离店'%></span>
        <%if(index != 0) {%>
        <span class="qt-font12 qt-grey night">共<span><%= dateCount %></span>晚</span>
        <%}%>
    </li>
    <% });%>
</ul>

<% } else {%>
<i class="mlf35 icon calendar"></i>
<ul class="qt-bb-x1">
<%_.each(detail,function(item,index) {%>
<li class="lh34" data-date="<%= item.date %>">
    <span class="month"><%= item.month %>月</span>
    <span class="day"><%= item.day %>日</span>
    <span class="qt-font12 qt-mr5 qt-grey week"><%= item.isToday == true ? '今天' : item.isTomorrow == true ? '明天' : item.isHouTian == true ? '后天' : item.week %></span>
    <span class="qt-font12 qt-grey">入住</span>
</li>
<% });%>
</ul>
<%}%>
