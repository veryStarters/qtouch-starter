<div class="al-content-wrap">
    <%
    var alButtonA =data.alButtonA || '确定';
    var alButtonB =data.alButtonB || ''

    %>
    <div class="al-content qt-bb-x1">
        <% if(!data.prize){ %>
        <div class="al-title">哦哦~没有中奖~</div>
        <div class="al-msg">土豪不差钱，继续再接再历！</div>
        <% }else{ %>
        <img class="al-content-img" src="http://source.qunar.com/site/images/wap/touch/images/v2/images1x/congratulations.png">
        <div class="al-bold qt-pt10">获得“<%=data.msg%>”奖励</div>
        <% } %>
    </div>

    <div class="al-button-wrap qt-blue">
        <div class="al-buttonA"><%=alButtonA%></div>
        <% if(alButtonB){ %>
        <div class="al-buttonB qt-bl-x1"><%=alButtonB %></div>
        <% } %>
    </div>

</div>