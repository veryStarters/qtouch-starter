<% _.each(data.commentData.comments,function(com,index){ %>
<div class="qt-bb-x1">
    <div class="qt-grid">
        <div class="flex1 comment-title"><%=com.title%></div>
        <div class="stars">
            <% for(var i=0;i < com.score;i++){ %>
            <span class="qt-blue"></span>
            <% } %>
            <% if(com.score < 5){
            for(var i=0;i < 5-com.score;i++){
            %>
            <span></span>
            <% }} %>
        </div>
    </div>
    <% var content = com.content.replace(/\n{1,}/g,'<br/><br/>') %>
    <div class="comment-detail <% if(com.content.length>70){%>add-arrow-down<%} %>">
        <%=content%>
    </div>
    <div class="comment-imgs" data-imgs='<%=JSON.stringify(com.imgs)%>'>
        <%
        var length=com.imgs.length;
        _.each(com.imgs,function(img,index){ %>
        <% if(index>5){return false} %>
        <% if(index===5 && length>6){ %>
        <div>
            <div>
                <img lazy_src="<%=img.smallUrl%>">
                <div class="img-mask"><span>看更多...</span></div>
            </div>
        </div>
        <% }else{ %>
        <div>
            <img lazy_src="<%=img.smallUrl%>">
        </div>
        <% } %>
        <% }) %>
    </div>
    <div class="comment-name-wrap">
        <div><%=com.author%></div>
        <div><%=com.date%></div>
    </div>
</div>
<% }) %>
<% if(data.totalPageNum != data.currentPageNum){ %>
<div class="more_comment qt-blue">更多...</div>
<% } %>