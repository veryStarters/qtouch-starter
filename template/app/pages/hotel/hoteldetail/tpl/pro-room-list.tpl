<% if(data.price.length == 0){ %>
<div class="qt-bt-x1 loading-wrap room-loading">
    <span class="qt-blue">暂无报价</span>
</div>
<% }else{ %>

<% _.each(data.price,function(room,index){ %>

<li class="<% if(index>4){ %> qt-hide<% } %>">
    <% var wrap = data.otaInfo ?
            data.otaInfo[room.wrapperid] ?
                data.otaInfo[room.wrapperid] : {bookingRate:'-',confirmTime:'-'}
            : {bookingRate:'-',confirmTime:'-'};

        if(!wrap || !wrap.bookingRate ) { return ;}
    %>
    <div data-bookingRate="<%= wrap.bookingRate %>" data-confirmTime="<%= wrap.confirmTime %>"
         data-rtDescInfo='<%= JSON.stringify(room.rtDescInfo)%>'
         data-otaInfoDesc='<%= JSON.stringify(room.otaInfoDesc)%>'
         data-otainfoTagList='<%= JSON.stringify(room.otainfoTagList) %>'
         data-orderInfoUrl='<%= room.orderInfoUrl%>' data-tag="<%= data.tag%>"
         data-reliable="<%= room.reliable%>" data-speed="<%= room.speed%>"
         data-room="<%= room.room%>" data-showRoomName="<%= room.showRoomName%>"
         data-license='<%= JSON.stringify(room.license)%>'
         data-wrapperName="<%= room.wrapperName%>" data-orderInfoPayStr="<%= room.orderInfoPayStr%>"
         data-otaPrice="<%=room.otaPriceMix%>" data-tagList='<%= JSON.stringify(room.tagList)%>'>
        <!--<% if(room.low){ %>-->
        <!--<div class="lowest">最低价</div>-->
        <!--<% } %>-->
        <div class="flex1 room-name-wrap qt-overflow">
            <%if(isHour) {%>
                <div class="qt-font16 text-overflow "><%=room.showRoomName%></div>
                <div class="qt-font12 text-overflow qt-grey qt-lh"><%=room.camelCoinSrvTimeDesc%></div>
                <div class="qt-font12 text-overflow qt-grey qt-lh"><%=room.wrapperName%></div>
            <%} else {%>
                <div class="qt-font16 text-overflow "><%=room.wrapperName%></div>
                <div class="qt-font14 text-overflow qt-lh qt-heavy-grey"><%=room.showRoomName%></div>
            <%}%>
            
             <div class="qt-font12 qt-grey">
	        	<%_.each(room.basicInfoList, function(info, index){ %>
	        	<% if(index != 0){ %>
	        		|
	        	<% } %>
	        	<span class="<% if(((info.desc.indexOf("取消") > -1) && (info.desc !='不可取消')) || ((info.desc.indexOf("早") > -1) && (info.desc != '无早'))){ %> font-green <%} else{ %> <% }%>">
	        		<%=info.desc %>
	        	</span>
	        	<% }) %>
        	</div>

            <div>
                <% _.each(room.tagList,function(tag,index){
                        if(tag.most){ return false; } %>
                <span class="room-icon <%=tag.color%>"><%=tag.label%></span>

                <% }) %>
            </div>
        </div>
        <div class="qt-right qt-pr10 room-price-wrap ">
            <div class="qt-orange qt-font20 qunar_mix">
                <span class="qt-font12 currency"><%=room.currency%></span>
                <%=room.priceMix%>
            </div>
            <% if(room.ptDesc && isGJ!=true){ %>
            <div class="qt-font12 qt-grey qunar_mix1 old-price"><span class="old-price-span">原价</span><span><%=room.currency%></span><%=room.showPriceMix%>
            </div>
            <% } %>
            <div class="qt-font12 qt-grey pt-desc"><%=room.ptDesc%></div>
        </div>
        <div class="order-btn <% if(room.is5discount){ %> to-client <% }else { %> order-icon <% } %>">
            <span><%=room.pricePayStr%></span>
        </div>
    </div>

</li>
<% if(index==4 && data.price.length>5){ %>
<li class="qt-center no-flex qt-blue show-all-room">查看全部报价</li>
<% } %>

<% }) %>
<% } %>
