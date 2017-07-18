<div class="filter-filter">
<ul class="qt-pa10 content">
    <% if(!data.isHour && data.checkInType && data.checkInType.length) { %>
    <li class="qt-bb-x1" data-key="CT">
        <h5>入住类型筛选</h5>
        <div class="detail">
            <%_.each(data.checkInType, function(item,index) {%>
            <% var pClass = item.checked ? 'active' : '';%>
            <p class="qt-btb-x1 qt-bl-x1 r5 <%= pClass%>" data-path="<%= item.path%>" data-value="<%= item.qname%>"><%= item.dname%></p>
            <% }) %>
        </div>
    </li>
    <% } %>
    <% if(data.bedType && data.bedType.length) { %>
    <li class="qt-bb-x1" data-key="RT">
        <h5>房型</h5>
        <div class="detail">
            <%_.each(data.bedType, function(item,index) {%>
            <% var pClass = item.checked ? 'active' : '';%>
            <p class="qt-btb-x1 qt-bl-x1 r5 <%= pClass%>" data-path="<%= item.path%>" data-value="<%= item.qname%>"><%= item.dname%></p>
            <% }) %>
        </div>
    </li>
    <%}%>
    <% if(data.hotelType && data.hotelType.length) { %>
    <li class="qt-bb-x1" data-key="HT">
        <h5>酒店类型</h5>
        <div class="detail">
            <%_.each(data.hotelType, function(item,index) {%>
            <% var pClass = item.checked ? 'active' : '';%>
            <p class="qt-btb-x1 qt-bl-x1 r5 <%= pClass%>" data-path="<%= item.path%>" data-value="<%= item.qname%>"><%= item.dname%></p>
            <% }) %>
        </div>
    </li>
    <% } %>
    <% if(!data.isHour && data.bnbTags && data.bnbTags.length) { %>
    <li class="qt-bb-x1" data-key="BN">
        <h5>特色体验</h5>
        <div class="detail">
            <%_.each(data.bnbTags, function(item,index) {%>
            <% var pClass = item.checked ? 'active' : '';%>
            <p class="qt-btb-x1 qt-bl-x1 r5 <%= pClass%>" data-path="<%= item.path%>" data-value="<%= item.qname%>"><%= item.dname%></p>
            <% }) %>
        </div>
    </li>
    <% } %>
    <% if(data.brandCnt && data.brandCnt.length) { %>
    <li class="qt-bb-x1" data-key="BR">
        <h5>品牌<i class="icon arrow-down-5 qt-grey show-more"></i></h5>
        <div class="detail show-some">
            <%_.each(data.brandCnt, function(item,index) {%>
            <% var pClass = item.checked ? 'active' : '';%>
            <p class="qt-btb-x1 qt-bl-x1 r5 <%= pClass%>" data-path="<%= item.path%>" data-value="<%= item.qname%>"><%= item.dname%></p>
            <% }) %>
        </div>
    </li>
    <% } %>
    <% if(data.condition && data.condition.length) { %>
    <li class="qt-bb-x1"  data-key="C">
        <h5>设施服务 (可多选)</h5>
        <div class="detail">
            <%_.each(data.condition, function(item,index) {%>
            <% var pClass = item.checked ? 'active' : '';%>
            <p class="qt-btb-x1 qt-bl-x1 r5 <%= pClass%>" data-path="<%= item.path%>" data-value="<%= item.qname%>"><%= item.dname%></p>
            <% }) %>
        </div>
    </li>
    <% } %>
    <% if(!data.isHour && data.tripFeature && data.tripFeature.length) { %>
    <li class="qt-bb-x1" data-key="RI">
        <h5>出行特色</h5>
        <div class="detail">
            <%_.each(data.tripFeature, function(item,index) {%>
            <% var pClass = item.checked ? 'active' : '';%>
            <p class="qt-btb-x1 qt-bl-x1 r5 <%= pClass%>" data-path="<%= item.path%>" data-value="<%= item.qname%>"><%= item.dname%></p>
            <% }) %>
        </div>
    </li>
    <% } %>
</ul>
<div class="qt-grid qt-pa10 operation-btn">
    <button class="col4 empty">清空</button>
    <button class="col8 submit">确定</button>
</div>
</div>