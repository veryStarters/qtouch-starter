<div class="shake-wrap" style="background: <%= data.background %>">
    <img src="http://img1.qunarzz.com/m_appPromotion/wap/1605/bb/782d474ee45534f7.jpg" style="height: 0;" />
    <div class="linkToImg">
        <img src="<%= data.linkToMain %>" class="linkTo"/>
    </div>
    <div class="shake-header">
        <img class="header-img" src="<%=data.headImg%>"/>
    </div>
    <div class="shake-content-wrapper">

    </div>
    <div class="rules">
        <div class="rules-header">
            活动说明 <i class="icon arrow-down see-detail"></i>
        </div>
        <div class="rules-detail">
            <ol class="rule-list">
                <%_.each(data.rules,function(rule,index){ %>
                <li><%= rule %></li>
                <% }) %>
            </ol>
        </div>
    </div>
    <% if (data.ad) {%>
    <div class="ad-wrapper" data-url="<%= data.ad.url %>">
        <img src="<%= data.ad.imgUrl%>" class="ad-img"/>
    </div>
    <%}%>
    <div class="m_mask">
        <div class="container">
            <div class="img">
                <img src="http://simg1.qunarzz.com/site/images/wap/touch/images/v2/zhuanti/red/share_in_wx.png"/>
            </div>
        </div>
    </div>

    <div id="showtoast">
        <div class="content"></div>
    </div>
</div>
