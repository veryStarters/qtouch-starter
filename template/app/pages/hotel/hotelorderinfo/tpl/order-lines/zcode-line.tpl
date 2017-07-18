<%if( data.needContactZipCode == 1 || data.needContactZipCode == 2  ) {%>
<div class="qt-bb-x1 zcode-line" data-checked="<%= data.needContactZipCode == 2 ? true : false %>">
<span class="label">邮政编码</span>
<span class="input"><input class="zcode" type="text" placeholder="邮政编码"/></span>
</div>
<%}%>