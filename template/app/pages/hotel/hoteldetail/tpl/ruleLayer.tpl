<div class="ruleLayer">
    <div class="ruleLayer-title">
        <%=data.room%>
        <% if(data.showRoomName){ %>
        <% if(data.room){ %>- <% } %><%=data.showRoomName%>
        <% } %>
    </div>
    <div class="ruleLayer-content">
        <div class="ruleLayer-list">
            <% _.each(data.rtDescInfo,function(info,index){ %>
            <div>
                <% _.each(info,function(val,key){ %>
                <div><%= key %></div>
                <div><%= val %></div>
                <% }) %>
            </div>
            <% }) %>
        </div>
        <% if(!_.isEmpty(data.otainfoTagList)){ %>
        <div class="ruleLayer-info qt-bt-x1">
            <% _.each(data.otainfoTagList,function(item,index){ %>
            <div class="ruleLayer-info-name"><span class="qt-border-x1 r5 <%= item.color %> tag"><%= item.name %></span></div>
            <div><%= item.desc %></div>
            <% }) %>
        </div>
        <% } %>
        <% if(!_.isEmpty(data.otaInfoDesc)){ %>
        <div class="ruleLayer-info qt-bt-x1">
            <% _.each(data.otaInfoDesc,function(val,key){ %>
            <div class="ruleLayer-info-name"><%= key %></div>
            <div><%= val %></div>
            <% }) %>
        </div>
        <% } %>
        <div class="ruleLayer-info qt-bt-x1">
            <div class="ruleLayer-info-name">
                <%=data.wrapperName%>
            </div>
            <div>
                预订成功率：<%=data.bookingRate%>
            </div>
            <div>
                平均预订时长：<%=data.confirmTime%>
            </div>
            <% if(data.license.customerName !== undefined && data.license.customerName !== '') { %>
                <div>
                    <%=data.license.customerName%>
                </div>
            <% } %>
            <%if(data.license.imgList !== undefined && data.license.imgList.length > 0) { %>
                <div class="view-license" data-imgs='<%= JSON.stringify(data.license.imgList)%>'>
                    查看营业执照 &gt;
                </div>
            <%}%>
        </div>
        <div class="ruleLayer-info qt-bt-x1 padding0">
            <% _.each(data.tagList,function(tag,index){ %>
            <% if(tag.most){ %>
            <div class="qt-ptb5">
                <span class="best-icon <%=tag.color%>"><%=tag.label%></span>
                <% if(tag.label=='可靠'){ %>
                预订成功率最高的代理商
                <% }else if(tag.label=='快确认'){ %>
                确认订单最快的代理商
                <% } %>
            </div>
            <% } %>
            <% }) %>
        </div>
    </div>
    <div class="ruleLayer-booking qt-bt-x1">
        <div class="ruleLayer-ota-price-info">
            <div class="ruleLayer-position">
                <div class="ruleLayer-ota-price-wrap qt-orange qunar_mix">
                    <span class="price-text"><%=data.orderInfoPayStr%><i><%=data.currency%></i></span>
                    <span class="price"><%=data.price%></span>
                </div>
                <div class="qt-grid qt-font12"><%=data.ptDesc%></div>
            </div>
        </div>
        <div class="ruleLayer-booking-button" data-orderInfoUrl="<%= data.orderInfoUrl%>" data-tag="<%= data.tag%>">
            立即预订
        </div>
    </div>
</div>
