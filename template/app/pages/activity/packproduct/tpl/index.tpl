<div class="wrap">
    <% if(forcePackProductInfos && forcePackProductInfos.length > 0) { %>
        <%
            var forcePack = forcePackProductInfos;
            var totalDiscount = 0;
            _.each(forcePack, function(item) {
                totalDiscount += parseFloat(item.perPtPrice*item.minCount);
            });
            totalDiscount = parseFloat(totalDiscount.toFixed(2));
        %>

        <% if(headPtTips) { %>
        <div class="tips qt-bb-x1">
            <dl>
                <dt>套餐优惠：</dt>
                <dd><%=headPtTips%></dd>
            </dl>
        </div>
        <% } %>

        <% _.each(forcePack, function(item){ %>
        <%
            var title = item.title;
            if(title.length > titleMaxLen){
                title = title.substr(0,titleMaxLen) + '...';
            }
        %>
        <div class="requiredPackage qt-bb-x1" data-productid="<%=item.productId%>">
            <div class="flex <% if(item.packBookingUrl === undefined || item.packBookingUrl === '') {%>pb12<% } %>">
                <div class="tagColumn">
                    <span class="packageTag">套餐</span>
                </div>
                <div class="detailColumn" data-ota="<%-item.otaDocScheme%>">
                    <div class="name">
                        <span><%-title%></span>
                        <% if(item.otaDocScheme != undefined && item.otaDocScheme != '') { %>
                        <i class="qt-arrow r"></i>
                        <% } %>
                    </div>
                    <div class="date"><%-item.validityPeriod%></div>
                    <% if(item.labels && item.labels.length > 0) { %>
                    <div class="tag">
                        <% _.each(item.labels, function(tag) { console.log(tag.label)%>
                        <span style="border: 1px solid <%=tag.bgColor%>;color:<%=tag.fontColor%>" ><%=tag.label%></span>
                        <% }); %>
                    </div>
                    <% } %>
                    
                    <% if(item.packBookingUrl !== undefined && item.packBookingUrl !== '') {%>
                    <div class="price">
                        <span class="salePrice red">&yen;<%-item.salePrice%></span> 起
                    </div>
                    <% } else { %>
                    <div class="originalPrice">&yen;<%-item.originalPrice%> / <%-item.unit%></div>
                    <div class="price">
                        <span class="salePrice red">&yen;<%-item.salePrice%></span><span> / <%-item.unit%><span>
                        <span class="cutDown qt-font12">已减&yen;<%-item.perPtPrice%></span>
                        <span class="count">× <%-item.minCount%></span>
                    </div>
                    <% } %>
                </div>
            </div>
            <% if(item.packBookingUrl !== undefined && item.packBookingUrl !== '') {%>
            <div class="appendix yellow" data-url="<%=item.packBookingUrl%>" data-msg="<%-item.packVaildateMsg%>">
                <div class="qt-arrow r"><%=item.packTips%></div>
            </div>
            <% } %>
        </div>
        <% }); %>
    <% } %>

    <% if(data.length > 0) {%>

        <% if(forcePackProductInfos && forcePackProductInfos.length > 0) { %>
        <fieldset class="separationLine">
            <legend>您还有以下选择</legend>
        </fieldset>
        <% } %>

        <div class="items">
            <% _.each(data, function(category){ %>
                <%if(category.productInfos.length>0) {%>
                <div class="item qt-bb-x1" data-type="<%=category.type%>">
                    <div class="title qt-bb-x1"><span class="line" style="background:<%=category.typeColor %>;"></span><%=category.typeName%></div>
                    <ul class="list">
                        <% _.each(category.productInfos, function(item){ %>
                        <li class="qt-bb-x1" data-productid="<%=item.productId%>">

                                <div class="flex">
                                    
                                    <div class="left">
                                        <% if(item.packBookingUrl !== undefined && item.packBookingUrl !== '') {%>
                                            <i class="icon checkbox ext"></i>
                                        <% }else {%>
                                            <% if(item.saleType == 1) %>
                                            <i class="icon checkbox"></i>
                                            <% else { %>
                                            <span class="end">售罄</span>
                                            <% } %>
                                        <% } %>
                                    </div>

                                    <div class="right" data-ota="<%=item.otaDocScheme%>">
                                        <div class="sub-title">
                                            <%
                                                var title = item.title
                                                if(title.length > titleMaxLen){
                                                    title = title.substr(0,titleMaxLen) + '...';
                                                }
                                            %>
                                            <span><%=title%></span>
                                            <% if(item.otaDocScheme != undefined && item.otaDocScheme != '') { %>
                                            <i class="qt-arrow r"></i>
                                            <% } %>
                                        </div>
                                        <p class="time"><%=item.validityPeriod%></p>

                                        <% if(item.labels && item.labels.length > 0) { %>
                                        <div class="tag">
                                            <% _.each(item.labels, function(tag) { %>
                                                <span style="border: 1px solid <%=tag.bgColor%>;color:<%=tag.fontColor%>" ><%=tag.label%></span>
                                            <% }); %>
                                        </div>
                                        <% } %>

                                        <% if(item.packBookingUrl !== undefined && item.packBookingUrl !== '') {%>
                                        <div class="price">
                                            <span class="red">&yen;<%=item.salePrice%></span> 起
                                        </div>
                                        <% } else { %>
                                            <div class="price">
                                                <span class="red">&yen;<%=item.salePrice%></span><span> / <%=item.unit%></span>
                                                <span class="del qt-font12">&yen;<%=item.originalPrice%> / <span class="qt-font12"><%=item.unit%></span></span>
                                            </div>

                                            <% if(item.saleType == 1) { %>
                                            <div class="numbar">
                                                <span class="i-icon minus qt-border-x1 <%if(item.defaultCount==1){%>disabled<%}%>"></span>
                                                <span class="num qt-border-x1" data-min="<%=item.minCount%>" data-max="<%=item.maxCount%>"><%=item.defaultCount%></span>
                                                <span class="i-icon plus qt-border-x1 <%if(item.defaultCount==item.maxCount){%>disabled<%}%>"></span>
                                            </div>
                                            <% } %>
                                        <% } %>
                                    
                                    </div>
                                    
                                </div>
                                
                                <% if(item.packBookingUrl !== undefined && item.packBookingUrl !== '') {%>
                                <div class="appendix yellow hide" data-url="<%=item.packBookingUrl%>" data-msg="<%-item.packVaildateMsg%>">
                                    <div class="qt-arrow r"><%=item.packTips%></div>
                                </div>
                                <% } %>
                            </li>
                        <% }); %>
                    </ul>
                </div>
                <% }else{ %>
                    <%if(data.length == 1){%>
                        <div class="empty">
                            <p><img src="http://simg1.qunarzz.com/site/images/wap/hlist/failed-bg.png" /></p>
                            <p>销售太火爆了~产品都已被抢光</p>
                        </div>
                    <%}%>
                <%}%>
            <% }); %>
        </div>

    <% } %>
    
    <% if(data.length == 0 && forcePackProductInfos.length == 0){ %>
    <div class="items">
        <div class="empty">
            <p><img src="http://simg1.qunarzz.com/site/images/wap/hlist/failed-bg.png" /></p>
            <p>销售太火爆了~产品都已被抢光</p>
        </div>
    </div>
    <% } %>
        

</div>
