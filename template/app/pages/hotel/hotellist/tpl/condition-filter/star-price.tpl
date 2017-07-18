<div class="star-price-filter">
    <div class="content">
        <div class="js-star qt-bb-x1 qt-ptb10">
            <div class="qt-multiselector qt-grid qt-font<%=fontSize%>">
                <% var len = data.data.starData.length; %>
                <% _.each(data.data.starData,function(item, index){ %>
                <div class="btn qt-border
                <% if(index === 0) {%>
                    lt
                <% }else if( index === len - 1) { %>
                    rb
                <% } %>
             " data-checked="<%=item.checked%>" data-val="<%= item.qname%>" ><%= item.dname%></div>
                <% }); %>
                <div class="col2 btn btn-more qt-border r5" data-val="all">不限</div>
            </div>
        </div>
        <% if(data.isHour){ %>
        <div class="js-hour qt-bb-x1 qt-ptb10">
            <div class="qt-multiselector qt-grid qt-font<%=fontSize%>">
                <% var len = data.data.hourData.length; %>
                <% _.each(data.data.hourData,function(item, index){ %>
                <div class="btn qt-border
                <% if(index === 0) {%>
                    lt
                <% }else if( index === len - 1) { %>
                    rb
                <% } %>
             " data-checked="<%=item.checked%>" data-val="<%= item.qname%>" ><%= item.dname%></div>
                <% }); %>
                <div class="col2 btn btn-more qt-border r5" data-val="all">不限</div>
            </div>
        </div>
        <% } %>
        <div class="js-range qt-ptb10">
            <div class="qt-range">
                <span class="drop left"></span>
                <span class="drop right"></span>
                <i class="progress qt-bg-blue">
                    <i class="left qt-bg-grey"></i>
                    <i class="right qt-bg-grey"></i>
                </i>
                <ul class="mark qt-grid qt-blue"></ul>
            </div>
        </div>
    </div>
    <div class="qt-pa10 operation-btn">
        <button class="empty">清空</button>
        <button class="submit">确定</button>
    </div>
</div>