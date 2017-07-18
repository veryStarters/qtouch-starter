<%if(data.inputInfo && data.inputInfo.needEnglishGuestName && data.inputInfo.needEnglishGuestName === true) {%>
<div class="guests-line gj">
    <p class="qt-bb-x1">
        <span class="label">入住人<i class="qt-light-grey icon question user-tips"></i> </span>
        <span class="input">
            <input class="guests-a" type="text" placeholder="姓 如han" value="<%= data.guestLocal.gj.firstName %>"/>
            <input class="guests-b" type="text" placeholder="名 如meimei" value="<%= data.guestLocal.gj.lastName %>"/>
        </span>
    </p>
    <div class="more-guests"></div>
</div>
<%} else {%>
<div class="guests-line">
    <p class="qt-bb-x1">
        <span class="label">入住人</span>
        <span class="input"><input class="guests" type="text" placeholder="每间只需填写一位" value="<%= data.guestLocal.gn.name %>"/></span>
        <%if(data.isLogin) {%>
        <i class="icon add qt-blue add-user"></i>
        <%}%>
    </p>
    <div class="more-guests"></div>
</div>
<%}%>