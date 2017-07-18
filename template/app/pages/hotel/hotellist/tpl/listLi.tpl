<% _.each(data.hotels, function(item) {%>
<% var attr = item.attrs %>
<li class="qt-bb-x1" data-id="<%= item.id%>">
<div class="list-img">
    <% if(attr.imageID && attr.imageID != '' ){ %>
    <img src="<%= attr.imageID %>" />
    <% } else { %>
    <img src="http://simg1.qunarzz.com/site/images/wap/touch/images/default.png"  />
    <%}%>
</div>
<div class="list-info">
    <p class="qt-black hotel-title"><%= attr.hotelName %></p>
    <p class="base-info clearfix">
        <span class="left">
                <%if(isHour) {%>
                    <% if(attr.CommentScore != "0.0") { %>
                        <span class="qt-blue qt-font14"><%= attr.CommentScore %>分</span>
                    <%} else {%>
                        暂无评论
                    <%}%>
                    <% _.each(item.services,function(service){%>
                        <span class="icon <%= service.css%>"></span>
                    <%})%>
                <%} else {%>
                    <% if(attr.CommentScore != "0.0" && attr.CommentCount != "0") { %>
                    <span class="qt-blue qt-font14"><%= attr.CommentScore %>分</span> / <%= attr.CommentCount %>条评论
                    <% } else if(attr.CommentScore != "0.0") { %>
                    <span class="qt-blue qt-font14"><%= attr.CommentScore %>分</span>
                    <% } else if(attr.CommentCount != "0") { %>
                    <%= attr.CommentCount %>条评论
                    <%} else {%>
                    暂无评论
                    <%}%>
                <%}%>
        </span>
        <% if(item.price > 0){%>
        <span class="right"><span class="qt-orange qt-mr5 price"><span class="qt-grey qt-font12"><%= item.hour && item.hour != ''? item.hour+'小时 /': '' %> </span><i>&yen</i><%= item.price %></span>起</span>
        <%}else if( -1 == item.price ) {%>
        <span class="right"><span class="qt-grey qt-font12">满房</span></span>
        <% }else{%>
        <span class="right"><span class="qt-grey qt-font12">暂无报价</span></span>
        <%}%>
    </p>
    <p class="list-tips clearfix">
        <%if(isHour) {%>
            <span><%= item.transactCheckinTime %></span>
            <%if(item.lmOldPrice && item.lmEcPrice) {%>
            <span class="qt-fr lm-price"><del class="qt-mr5">原价<i>&yen</i><%= item.lmOldPrice %></del><span class="qn_blue">省<i class="mon">&yen</i><%= item.lmEcPrice%></span></span>
            <%} else {%>
            <% _.each(item.tagList, function(tag){%>
            <span class="qt-border-x1 r5 <%= tag.color%> tag"><%= tag.label %></span>
            <%})%>
            <%}%>
        <%} else {%>
            <span><%= attr.dangciText %></span>
            <!--service 因数据范围小并且 返回格式固定原因,暂时用枚举-->
            <% _.each(item.services,function(service){%>
            <span class="icon <%= service.css%>"></span>
            <%})%>
            <%if(item.lmOldPrice && item.lmEcPrice) {%>
            <span class="qt-fr lm-price"><del class="qt-mr5">原价<i>&yen</i><%= item.lmOldPrice %></del><span class="qn_blue">省<i class="mon">&yen</i><%= item.lmEcPrice%></span></span>
            <%} else {%>
            <% _.each(item.tagList, function(tag){%>
            <span class="qt-border-x1 r5 <%= tag.color%> tag"><%= tag.label %></span>
            <%})%>
            <%}%>
        <%}%>
    </p>
    <p class="location"><%= item.showAddr %></p>
</div>
</li>
<%})%>