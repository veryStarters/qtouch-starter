<% _.each(data.list,function(prize,index){ %>
<%
var img='';
if(prize.prizeCode == 888){
img='mian.png';
}else if(prize.prizeCode == 801){
img='dujia100.png';
}else if(prize.prizeCode == 802){
img='quyoubao.png';
}else if(prize.prizeCode == 803){
img='vip.png';
}else if(prize.prizeCode == 804){
img='qqshu.png';
}
var statusClass='',statusTxt='';
if(prize.prizeStatus==0){
statusTxt='兑换';
}else if(prize.prizeStatus==1){
statusTxt='已兑换';
statusClass='pr-disable';
}else if(prize.prizeStatus==2){
statusTxt='兑换中';
}
%>
<div class="prize">
    <div class="pr-img-wrap">
        <img src="http://source.qunar.com/site/images/wap/touch/images/v2/images1x/<%=img%>">
    </div>
    <div class="pr-content-wrap qt-bb-x1">
        <div class="pr-content">
            <div><%=prize.prizeDesc%></div>
            <div><%=prize.ctime%></div>
        </div>
        <div class="pr-exchange <%=statusClass%>" data-id="<%=prize.id%>" data-prizeCode="<%=prize.prizeCode%>"
             data-prizeStatus="<%=prize.prizeStatus%>"><%=statusTxt%>
        </div>
    </div>
</div>
<% }) %>
<% if(data.totalPage != data.currPage){ %>
<div class="more_prize qt-blue">更多...</div>
<% } %>
