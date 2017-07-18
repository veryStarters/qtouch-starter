<div class="head">
    <div class="scores-cricle qt-blue" data-score="<%=data.commentData.score%>"></div>
    <div class="scores-list">
        <% _.each(data.commentData.tagList,function(tag,index){ %>
        <div><%=tag.name%><span><%=tag.avgScore%></span>分</div>
        <% }) %>
    </div>
</div>
<div id="scoresTab" class="qt-tab">
    <ul class="nav qt-btb-x1">
        <li class="" data-commentType="0">
            <div>全部</div>
            <div><%=data.commentData.allTotal%>条</div>
            <div class="hr qt-br-x1"></div>
        </li>
        <% if(data.commentData.goodTotal > 0){ %>
        <li class="" data-commentType="1">
            <div>好评</div>
            <div><%=data.commentData.goodTotal%>条</div>
            <div class="hr qt-br-x1"></div>
        </li>
        <% } %>
        <% if(data.commentData.mediumTotal > 0){ %>
        <li class="" data-commentType="3">
            <div>中评</div>
            <div><%=data.commentData.mediumTotal%>条</div>
            <div class="hr qt-br-x1"></div>
        </li>
        <% } %>
        <% if(data.commentData.badTotal > 0){ %>
        <li class="" data-commentType="2">
            <div>差评</div>
            <div><%=data.commentData.badTotal%>条</div>
        </li>
        <% } %>
    </ul>
    <div class="line"></div>
    <div class="content">
        <div data-totalPage="<%=data.totalPageNum%>" data-currentPage="<%=data.currentPageNum%>">

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
                <div class="comment-detail <% if(com.content.length>100){%>add-arrow-down<%} %>">
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
            <a class="commentbtn" href="">我要点评</a>
        </div>
        <% if(data.commentData.goodTotal > 0){ %>
        <div>
            <div class="qt-blue loading-wrap">
                <span class="icon spinner"></span>
                加载中....
            </div>
        </div>
        <% } %>
        <% if(data.commentData.mediumTotal > 0){ %>
        <div>
            <div class="qt-blue loading-wrap">
                <span class="icon spinner"></span>
                加载中....
            </div>
        </div>
        <% } %>
        <% if(data.commentData.badTotal > 0){ %>
        <div>
            <div class="qt-blue loading-wrap">
                <span class="icon spinner"></span>
                加载中....
            </div>
        </div>
        <% } %>
    </div>
</div>






