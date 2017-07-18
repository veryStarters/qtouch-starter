<div class="city-container">
    <div id="cityTab" class="qt-tab">
        <ul class="nav <%if(data.roomType=='hour-room'){%>qt-hide<%}%>">
            <li class="nav-en"><span>国内</span></li>
            <li class="nav-gj"><span>国际</span></li>
        </ul>
        <div class="line <%if(data.roomType=='hour-room'){%>qt-hide<%}%>"></div>
        <div class="content">
            <div class="inland">
                <div class="city-title">当前城市</div>
                <div class="location qt-btb-x1">
                    <span class="local-city">北京</span>
                    <i class="icon target-2 qt-blue get-location"></i>
                </div>
                <div class="history-city <% if(!data.history.length) {%> qt-hide <% } %> ">
                    <div class="city-title cityHisTitle" data-index-key="历史选择">历史选择</div>
                    <div class="city-wrap">
                        <%_.each(data.history,function(city,index) { %>
                        <div class="city-package">
                            <div class="city-grid" data-city="<%=city.city%>"><%=city.city%></div>
                        </div>
                        <%})%>
                    </div>
                </div>

                <div class="city-title" data-index-key="热门城市">热门城市</div>
                <div class="city-wrap js-popular-city">
                    <% _.each(data.data,function(data,index){ %>
                    <% _.each(data['热门城市'],function(data,index){ %>
                    <% if(data.cityName.length>=5){%>
                    <div class="city-package">
                        <div class="city-grid qt-font12" data-city="<%= data.cityName%>" data-city-type="en">
                            <%=data.cityName%>
                        </div>
                    </div>
                    <%}else{%>
                    <div class="city-package">
                        <div class="city-grid " data-city="<%= data.cityName%>" data-city-type="en">
                            <%=data.cityName%>
                        </div>
                    </div>
                    <%}%>
                    <% }) %>
                    <% }) %>
                </div>

                <% if(!data.support){%>
                <div class="city-title">字母排序</div>
                <div class="letters-navigation city-letters-navigation">
                    <% var i=1,d=data.data;
                    if(d[0]['热门城市']){d.shift()}%>
                    <% _.each(d,function(citys,index){ %>
                    <% _.each(citys,function(citys,letter){ %>
                    <% if(i%4==1){ %>
                    <div>
                        <%}%>
                        <div><%=letter%></div>
                        <% if(i%4==0 || i==d.length){ %>
                    </div>
                    <% } %>
                    <% i++ %>
                    <% }) %>
                    <% }) %>
                </div>
                <%}%>
                <div class="city-list">
                    <% _.each(data.data,function(data,index){ %>
                    <% _.each(data,function(citys,letter){
                    if(letter!='热门城市'){%>
                    <div class="city-title" data-index-key="<%= letter%>"><%= letter%></div>
                    <div class="city-wrap ">
                        <% _.each(citys,function(city,num){ %>
                        <% if(city.cityName.length>=5){ %>
                        <div class="city-package">
                            <div class="city-grid qt-font12" data-city="<%= city.cityName%>"
                                 data-city-type="en"><%= city.cityName%>
                            </div>
                        </div>
                        <% }else{ %>
                        <div class="city-package">
                            <div class="city-grid " data-city="<%= city.cityName%>" data-city-type="en">
                                <%= city.cityName%>
                            </div>
                        </div>
                        <% } %>
                        <% }) %>
                    </div>
                    <% }}) %>
                    <% return false %>
                    <% }) %>

                </div>
            </div>
            <div class="foreign"></div>
        </div>
        <div class="page-to-top qt-to-top" style="display: none"><i class="icon q-top qt-bold36 qt-white qt-center"></i></div>
    </div>
</div>
<div class="select-container qt-hide"></div>




