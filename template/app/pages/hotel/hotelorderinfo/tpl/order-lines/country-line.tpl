<%if( data.needContactCountry == 1 || data.needContactCountry == 2  ) {%>
<div class="qt-bb-x1 qt-arrow r country-line" data-value="<%= data.contactCountryList[0].code%>">
<span class="label">国家</span>
<span class="val"><%= data.contactCountryList[0].name%></span>
</div>
<%}%>