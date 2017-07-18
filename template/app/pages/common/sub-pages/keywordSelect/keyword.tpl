<% var isEmpty = $.trim(localStoreData) === '' %>

<div class="qt-bg-grey qt-font12 <%if(!isEmpty){%>qt-bb-x1<%}%>">
    <div class="js-localStoreContent"><%=localStoreData%></div>
    <div class="js-keywordContent"></div>
</div>
