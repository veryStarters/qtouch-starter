<div class="facilities qt-bb-x1">
    <% _.each(data.facilities,function(facilitie,index){ %>
    <% if(index>1){ %>
    <div class="hidden-facilities qt-hide"><% } %>
        <div class="facilities_title"><%=facilitie.type%></div>
        <div class="facilities_list">
            <% _.each(facilitie.datas,function(data,index){ %>
            <div>
                <span class="icon-s <%=data.field%>"></span>
                <%=data.item%>
            </div>
            <% }) %>
        </div>
        <% if(index>1){ %>
    </div>
    <% } %>
    <% }) %>
    <% if (data.facilities.length>2) {%>
    <div class="all-facilities">
        <div class="qt-arrow b qt-blue">查看全部设施</div>
    </div>
    <% } %>
</div>
<% if(data.phone && data.phone != '' ) { %>
<a class="hotel-phone qt-blue" href="tel:<%=data.phone%>">
    <div class="qt-bb-x1">
        <span class="icon phone"></span>酒店电话：<%=data.phone%>
    </div>
</a>
<% } %>
<div class="hotel-introduction">
    <% if(data.desc && data.desc != '' ) { %>
    <div class="introduction-bold">酒店介绍</div>
    <div class="introduction qt-lh"><%=data.desc%></div>
    <% } %>
    <% if(data.whenFitment && data.whenFitment != '' ) { %>
    <div class="introduction-bold">最近装修时间:<%=data.whenFitment%>年</div>
    <% } %>
</div>


