<%if(data.needBookingEmail || data.needContactEmail == 1 || data.needContactEmail == 2 ) {%>
<div class="qt-bb-x1 email-line" data-checked="<%= data.needContactEmail == 2 || data.needBookingEmail == true ? true : false %>">
    <span class="label">电子邮箱</span>
    <span class="input"><input class="email" type="text" placeholder="用于接收确认邮件"/></span>
</div>
<%}%>