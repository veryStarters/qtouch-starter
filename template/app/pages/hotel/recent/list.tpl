<%if(!data.ret) {%>
<p class="errmsg"><%= msg || '很抱歉,查询最近浏览记录失败!'%></p>
<%} else if(!data.data || !data.data.length) {%>
<p class="errmsg"><%= '您最近还没有浏览记录!'%></p>
<%} else { %>
<ul>
    <%_.each(data.data, function(item, index) {%>
    <li class="qt-bb-x1">
        <a href="/hotel/hoteldetail?seq=<%= item.seq%>">
        <div class="list-info">
            <p class="qt-black hotel-title"><%= item.hotelName %></p>

            <p class="base-info clearfix">
                <span class="left">
                    <span class="qt-blue qt-font14"><%= item.score %>分</span> / <%= item.commentCount %>条评论
                </span>
                <span class="right"><span class="qt-orange qt-mr5 price"><span class="qt-grey qt-font12"></span><i>¥</i><%= item.price %></span>起</span>
            </p>
            <p class="time">浏览时间  <%= item.browseTime %></p>
        </div>
        </a>
    </li>
    <%})%>
</ul>
<%}%>