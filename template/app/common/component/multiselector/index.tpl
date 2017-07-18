<div class="qt-multiselector qt-grid qt-font<%=fontSize%>">
    <% var len = items.length; %>
    <% _.each(items,function(item, index){ %>
        <div class="btn qt-border 
                <% if(index === 0) {%>
                    lt
                <% }else if( index === len - 1) { %>
                    rb
                <% } %>
             " data-checked="<%=item.checked%>" data-val="<%=item.val%>" ><%=item.text%></div>  
    <% }); %>
    <div class="col2 btn btn-more qt-border r5" data-val="all">不限</div>
</div>