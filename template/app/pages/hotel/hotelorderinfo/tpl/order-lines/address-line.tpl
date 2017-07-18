<%if( data.needContactAddress == 1 || data.needContactAddress == 2  ) {%>
<div class="qt-bb-x1 address-line" data-checked="<%= data.needContactAddress == 2 ? true : false %>">
<span class="label">地址</span>
<span class="input"><input class="address" type="text" placeholder="地址"/></span>
</div>
<%}%>