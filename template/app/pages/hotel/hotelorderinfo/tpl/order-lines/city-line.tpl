<%if( data.needContactCity == 1 || data.needContactCity == 2  ) {%>
<div class="qt-bb-x1 city-line" data-checked="<%= data.needContactCity == 2 ? true : false %>">
<span class="label">城市</span>
<span class="input"><input class="city" type="text" placeholder="城市"/></span>
</div>
<%}%>