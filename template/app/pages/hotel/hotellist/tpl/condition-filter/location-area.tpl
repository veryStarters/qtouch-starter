<div class="location-area-filter">
    <%if(data.errmsg) {%>
    <div class="qt-grey content empty">
        <p class="load-failed"></p>
        <p class="tips"><%= data.errmsg%></p>
    </div>
    <%} else {%>
    <div class="content">
        <ul class="left-nav qt-br-x1">
            <% if(data.distance && data.distance.data.length) { %>
            <li class="qt-bb-x1 qt-br-x1 distance-nav" data-for="distance"><%= data.distance.name%></li>
            <% } %>
            <% if (data.areas && data.areas.data.length) {%>
            <li class="qt-bb-x1 qt-br-x1 business-nav" data-for="business"><%= data.areas.name%></li>
            <% } %>
            <% if (data.administrativeArea && data.administrativeArea.data.length) {%>
            <li class="qt-bb-x1 qt-br-x1 administration-nav" data-for="administration"><%= data.administrativeArea.name%></li>
            <% } %>
            <% if (data.airAndStation && data.airAndStation.data.length) {%>
            <li class="qt-bb-x1 qt-br-x1 station-nav" data-for="station"><%= data.airAndStation.name%></li>
            <% } %>
            <% if (data.subways && data.subways.data.length) {%>
            <li class="qt-bb-x1 qt-br-x1 metro-nav" data-for="metro"><%= data.subways.name%></li>
            <% } %>
            <% if (data.hotSpots && data.hotSpots.data.length && data.hotSpots.data[0].spots.length) {%>
            <li class="qt-bb-x1 qt-br-x1 scenic-spots-nav" data-for="scenic-spots"><%= data.hotSpots.name%></li>
            <% } %>
            <% if (data.universitys && data.universitys.data.length) {%>
            <li class="qt-bb-x1 qt-br-x1 have-fun-nav" data-for="have-fun"><%= data.universitys.name%></li>
            <% } %>
            <% if (data.healthCares && data.healthCares.data.length) {%>
            <li class="qt-bb-x1 qt-br-x1 hospital-nav" data-for="hospital"><%= data.healthCares.name%></li>
            <% } %>
        </ul>
        <div class="right-detail">
            <% if(data.distance && data.distance.data.length) { %>
            <div class="qt-hide pl40 select-box radio-select distance" data-parent="distance-nav" data-key="D">
                <ul>
                    <%_.each(data.distance.data, function(item,index) {%>
                    <% var liClass = item.checked ? 'active checked' : '';%>
                    <li class="<%= item.qname === '' ? 'all '+liClass : liClass%>" data-path="<%=item.path%>"  data-value="<%= item.qname %>">
                        <i class="icon checkmark"></i>
                        <p class="qt-bb-x1 col10"><%= item.dname %></p>
                    </li>
                    <% }) %>
                </ul>
            </div>
            <% } %>
            <% if (data.areas && data.areas.data.length) {%>
            <div class="qt-hide pl40 select-box checkbox-select business" data-parent="business-nav" data-key="T">
                <div class="all" data-value="">
                    <i class="icon checkmark"></i>
                    <p class="qt-bb-x1 col10">不限</p>
                </div>
                <ul>
                    <%_.each(data.areas.data, function(item,index) {%>
                    <% var liClass = item.checked ? 'active checked' : '', checked = item.checked ? 'checked' : '';%>
                    <li class="<%= liClass%>" data-path="<%=item.path%>" data-value="<%= item.qname %>">
                        <i class="icon checkbox <%= checked%>"></i>
                        <p class="qt-bb-x1 col10"><%= item.dname %></p>
                    </li>
                    <%})%>
                </ul>
            </div>
            <% } %>

            <% if (data.administrativeArea && data.administrativeArea.data.length) {%>
            <div class="qt-hide pl40 select-box checkbox-select administration" data-parent="administration-nav" data-key="R">
                <div class="all" data-value="">
                    <i class="icon checkmark"></i>
                    <p class="qt-bb-x1 col10">不限</p>
                </div>
                <ul>
                    <%_.each(data.administrativeArea.data, function(item,index) {%>
                    <% var liClass = item.checked ? 'active checked' : '', checked = item.checked ? 'checked' : '';%>
                    <li class="<%= liClass%>" data-path="<%=item.path%>" data-value="<%= item.qname %>">
                        <i class="icon checkbox <%= checked%>"></i>
                        <p class="qt-bb-x1 col10"><%= item.dname %></p>
                    </li>
                    <%})%>
                </ul>
            </div>
            <% } %>

            <% if (data.airAndStation && data.airAndStation.data.length) {%>
            <div class="qt-hide pl40 select-box checkbox-select station"  data-parent="station-nav" data-key="B">
                <div class="all" data-value="">
                    <i class="icon checkmark"></i>
                    <p class="qt-bb-x1 col10">不限</p>
                </div>
                <ul>
                    <%_.each(data.airAndStation.data, function(item,index) {%>
                    <% var liClass = item.checked ? 'active checked' : '', checked = item.checked ? 'checked' : '';%>
                    <li class="<%= liClass%>" data-path="<%=item.path%>" data-value="<%= item.qname %>">
                        <i class="icon checkbox <%= checked%>"></i>
                        <p class="qt-bb-x1 col10"><%= item.dname %></p>
                    </li>
                    <%})%>
                </ul>
            </div>
            <% } %>

            <% if (data.subways && data.subways.data) {%>
            <div class="qt-hide second-level metro">
                <ul class="pl20 qt-br-x1 second-nav">
                    <%_.each(data.subways.data, function(item,index) {%>
                    <li class="qt-bb-x1 qt-br-x1 metro<%= index%>" data-parent="metro-nav" data-for="subways<%= index%>"><%= item.name %></li>
                    <%})%>
                </ul>
                <%_.each(data.subways.data, function(pitem,pindex) {%>
                <div class="qt-hide pl40 select-box radio-select metro1 subways<%= pindex%>"  data-parent="metro<%= pindex%>" data-key="B">
                    <ul class="qt-br-x1">
                        <li class="all" data-value="">
                            <i class="icon checkmark"></i>
                            <p class="qt-bb-x1 col10">不限</p>
                        </li>
                        <%_.each(pitem.stations, function(item,index) {%>
                        <% var liClass = item.checked ? 'active checked' : '';%>
                        <li class="<%= liClass%>" data-path="<%=item.path%>" data-value="<%= item.qname %>">
                            <i class="icon checkmark"></i>
                            <p class="qt-bt-x1 col10"><%= item.dname %></p>
                        </li>
                        <%})%>
                    </ul>
                </div>
                <%})%>
            </div>
            <% } %>

            <% if (data.hotSpots && data.hotSpots.data.length && data.hotSpots.data[0].spots.length) {%>
            <div class="qt-hide second-level scenic-spots">
                <ul class="pl20 qt-br-x1 second-nav">
                    <%_.each(data.hotSpots.data, function(item,index) {%>
                    <% if(item.spots.length) {%>
                    <li class="qt-bb-x1 qt-br-x1 scenic-spots-<%= index%>" data-parent="scenic-spots-nav" data-for="spots<%= index%>"><%= item.name %></li>
                    <%}%>
                    <%})%>
                </ul>
                <%_.each(data.hotSpots.data, function(pitem,pindex) {%>
                <% if(pitem.spots.length) {%>
                <div class="qt-hide pl40 select-box radio-select metro1 spots<%= pindex%>"  data-parent="scenic-spots-<%= pindex%>" data-key="B">
                    <ul class="qt-br-x1">
                        <li class="all" data-value="">
                            <i class="icon checkmark"></i>
                            <p class="qt-bb-x1 col10">不限</p>
                        </li>
                        <%_.each(pitem.spots, function(item,index) {%>
                        <% var liClass = item.checked ? 'active checked' : '';%>
                        <li class="<%= liClass%>" data-path="<%=item.path%>" data-value="<%= item.qname %>">
                            <i class="icon checkmark"></i>
                            <p class="qt-bb-x1 col10"><%= item.dname %></p>
                        </li>
                        <%})%>
                    </ul>
                </div>
                <%}%>
                <%})%>
            </div>
            <% } %>

            <% if (data.universitys && data.universitys.data.length) {%>
            <div class="qt-hide pl40 select-box checkbox-select have-fun" data-parent="have-fun-nav" data-key="B">
                <div class="all" data-value="">
                    <i class="icon checkmark"></i>
                    <p class="qt-bb-x1 col10">不限</p>
                </div>
                <ul>
                    <%_.each(data.universitys.data, function(item,index) {%>
                    <% var liClass = item.checked ? 'active checked' : '', checked = item.checked ? 'checked' : '';%>
                    <li class="<%= liClass%>" data-path="<%=item.path%>" data-value="<%= item.qname %>">
                        <i class="icon checkbox <%= checked%>"></i>
                        <p class="qt-bb-x1 col10"><%= item.dname %></p>
                    </li>
                    <%})%>
                </ul>
            </div>
            <% } %>

            <% if (data.healthCares && data.healthCares.data.length) {%>
            <div class="qt-hide pl40 select-box checkbox-select hospital" data-parent="hospital-nav" data-key="B">
                <div class="all" data-value="">
                    <i class="icon checkmark"></i>
                    <p class="qt-bb-x1 col10">不限</p>
                </div>
                <ul>
                    <%_.each(data.healthCares.data, function(item,index) {%>
                    <% var liClass = item.checked ? 'active checked' : '', checked = item.checked ? 'checked' : '';%>
                    <li class="<%= liClass%>" data-path="<%=item.path%>" data-value="<%= item.qname %>">
                        <i class="icon checkbox <%= checked%>"></i>
                        <p class="qt-bb-x1 col10"><%= item.dname %></p>
                    </li>
                    <%})%>
                </ul>
            </div>
            <% } %>
        </div>
    </div>
    <%}%>
    <div class="qt-grid qt-pa10 operation-btn">
        <button class="col4 empty">清空</button>
        <button class="col8 submit">确定</button>
    </div>
</div>