<div class="shake-content">
    <div class="content-wrapper">
            <img src="<%= shakeBgImg %>" class="content-img"/>
            <img src="<%= shakeImg %>" class="content-img absolute"/>
        <% if (errcode === 1 || errcode === 7) { %>
            <div class="img_mask"></div>
            <div class="status-text" ><%= msg %></div>
        <% } %>
    </div>
    <% if(errcode === 0){%>
    <div class="shake-times">今日还可以摇<span class="avaliable-time"><%= data.times %></span>次
        <%if (!showBtn){%>
        <span class="check-myprizelist">查看我的奖品</span>
        <%}%>
    </div>
    <%}%>
</div>
<div class="btns">
    <%if (showBtn){%>
    <div class="common-btn share-btn" style="background-image: url('<%= shareBtnImg %>');">邀请好友，再赢<span class="share-more">3次</span>摇奖机会</div>
    <div class="common-btn check-prize-btn" style="background-image: url('<%= myPrizeBtnImg %>');">查看我的奖品</div>
    <%}%>
    <!-- <div class="common-btn test-shake" style="background-image: url('<%= myPrizeBtnImg %>');">测试摇一摇</div> -->
</div>
<div class="notice">
    <% if(errcode === 0 || errcode === 1 ||errcode === 7){%>
    <div class="activity-time">活动有效期 <%= data.beginTime %> - <%= data.endTime %></div>
    <%}%>
    <% if(errcode === 0){%>
        <%if(data.awardRecords && data.awardRecords.length > 0){%>
        <div class="getPrize" style="background: <%= prizeDataBg %>;">
            <div class="prize-list-wrapper">
                <ul class="prize-list">
                    <% _.each(data.awardRecords, function(item) { %>
                        <li class="prize-item"><%= item.mobile.substr(0,3) + '****' + item.mobile.substr(7,4) %> 刚刚摇中
                            <%if(!item.isMaterial){%><%= item.awardMoney%>元 <%}%>
                            <%= item.awardTitle %>
                        </li>
                    <%})%>
                </ul>
            </div>
        </div>
        <%}%>
    <%}%>
</div>
