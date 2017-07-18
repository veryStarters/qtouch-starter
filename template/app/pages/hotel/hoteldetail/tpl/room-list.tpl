<% if(data.price.length == 0){ %>
    <div class="qt-bt-x1 loading-wrap room-loading">
        <span class="qt-blue">暂无报价</span>
    </div>
<% }else{ %>
    <% _.each(data.price,function(room,index){ %>
    <!--<% if(room.type==2){ %>-->
    <!--<li class="separate-li"></li>-->
    <!--<% } %>-->
    
    <li data-type="<%=room.type%>" class="add-border">
        <div class="qt-grid qt-pa10 qt-arrow b room-content-head <% if(room.type==2){ %> qt-bt-x1 <% } %>" data-loadingPro="true" data-type="<%=room.type%>"
             data-roomname="<%=room.name%>">
            <div class="name-wrap qt-overflow">
                <div class="qt-font16 room-name text-overflow">
                    <% if(room.type==2){ %>
                    <span class="icon-s hour-room qt-bg-yellow"></span>
                    <% } %>
                    <%=room.name%>
                </div>
                <div class="text-overflow">
                    <span class="qt-font12 qt-grey"><%=room.roomDesc%></span>
                    <!--<span class="qt-font12 qt-grey">双床1mx2</span>-->
                </div>
                <div class="qt-font12 text-overflow">
                	<% _.each(room.orderList, function(tag, index){ %>
                    	<span class="qt-orange"><i class="<%= tag.color %>"></i><%= tag.label %></span>
                    <% }) %>
                </div>
            </div>
            <div class="price-wrap">
                <% if(room.type==2 && room.hour>0){ %>
                <span class="qt-font14 qt-grey"><%=room.hour%>小时 /</span>
                <% } %>
                <span class="qt-font12 qt-orange"><%=room.currency%></span>
                <span class="qt-font20 qt-orange"><%=room.lowPrice%></span>
                <span class="qt-font12">起</span>
            </div>
        </div>
        <div class="bgf0 room-content qt-hide">
            <% if(room.images && room.images.length!=0){ %>
            <div class="room-imgs" data-imgs='<%=JSON.stringify(room.images)%>'>
                <% _.each(room.images,function(image,index){ %>
                <% if(index>4){return} %>
                <div>
                    <% if(index == 4){ %>
                    <div>
                        <img class="r5" lazy_src="<%= image.smallUrl %>">

                        <div class="img-mask"><span>查看更多</span></div>
                    </div>
                    <% }else{ %>
                    <img class="r5" lazy_src="<%= image.smallUrl %>">
                    <% } %>
                </div>
                <% }) %>
            </div>
            <% } %>
            <ul class="qt-list bgf0 pro-room-list no-last-child-border">
                <div class="qt-bt-x1 loading-wrap">
                    <span class="qt-blue icon spinner"></span>
                    <span class="qt-blue">报价加载中....</span>
                </div>
            </ul>

        </div>
    </li>
    
    <%  }) %>
<% } %>