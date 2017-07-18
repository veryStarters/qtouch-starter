<div class="col10">
    <%_.each(data.detail,function(item,index,detail) {%>
        <span><%= item.date %></span>
        <span><%= index == 0 ? '入住' : '离店'%></span>
    <%});%>
</div>
<% if(data.isRange) { %>
<div class="col2 qt-right qt-mr10">
    <span class="qt-blue qt-font12">共<span class="count-day"><%= data.dateCount%></span>晚</span>
</div>
<%}%>