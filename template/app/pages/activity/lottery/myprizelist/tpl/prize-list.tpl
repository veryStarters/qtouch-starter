<%if(errcode === 0 && data.awardRecords.length > 0){%>
    <div class="prize-list">
        <div class="prize-desc">已放入你的去哪儿网账户<%= data.mobile%></div>
        <div class="tickets">
            <%_.each(data.awardRecords , function(item, index){%>
                <div class="prize-wrapper" data-index="<%= index %>">
                    <div class="prize-content">
                        <div class="content-wrapper">
                            <%if(!item.isMaterial){%>
                            <p class="prize-name"><%= item.name%></p>
                            <p class="prize-count"><%= item.awardMoney%>元</p>
                            <%} else {%>
                            <p class="prize-title-only"><%= item.name%></p>
                            <%}%>
                        </div>
                    </div>
                </div>
            <%})%>
        </div>
    </div>

<%} else {%>
    <div class="no-prize">
        <p>还没有摇到奖品哦~</p>
        <p>快去参与摇奖吧~</p>
    </div>
<%}%>
