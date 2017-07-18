<div class="myPrize" data-totalPage="<%=data.totalPage%>" data-currPage="<%=data.currPage%>">
    <% if(!data.list || data.list==0){ %>
    <div class="no-prize">
        <img src="http://source.qunar.com/site/images/wap/touch/images/v2/images1x/no-prize.png">

        <div class="no-prize-text">
            亲~你还没有奖品呦~<br/>
            快快去抽奖吧~
        </div>
    </div>
    <% }else{ %>
    <div class="tip">
        所有奖品兑换截止时间：2016年3月31日
    </div>
    <% _.each(data.list,function(prize,index){ %>
    <%
    var img='';
    if(prize.prizeCode == 888){
        img='mian.png';
    }else if(prize.prizeCode == 801){
        img='dujia100.png';
    }else if(prize.prizeCode == 802){
        img='1c85e69f62b4998f3d1356a44e26ac00.png';
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
        if(prize.prizeCode != 888) {
            statusClass='pr-disable';
        }
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

                <div><%if(prize.prizeCode == 888){%>兑换开始时间:2016年3月1日<%}%></div>

                <!--<div><%=prize.ctime%></div>-->
            </div>
            <div class="pr-exchange <%=statusClass%>" data-id="<%=prize.id%>" data-prizeCode="<%=prize.prizeCode%>"
                 data-link="<%if(prize.prizeStatus > 0 && prize.prizeCode == 888){%><%=data.processUrl%><%}%>"
                 data-prizeStatus="<%=prize.prizeStatus%>"><%=statusTxt%>
            </div>
        </div>
    </div>
    <% }) %>
    <% if(data.totalPage != data.currPage){ %>
    <div class="more_prize qt-blue">更多...</div>
    <% } %>
    <% } %>
</div>

