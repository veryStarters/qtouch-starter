<% _.each(data, function(item, i){%>
<li class="address-item">
  <div class="choose-wrapper">
    <i class="icon <%= item.choosed == true ? 'checkmark' : '' %>"></i>
  </div>
  <div class="choose-content qt-bb-x1" data-id="<%= i%>">
    <p class="qt-font14"><span class="address-name"><%= item.name %></span><span class="address-phonenumber">+<%= item.mobile %></span></p>
    <p class="grey-color qt-font12"><span class="address-detail"><%= item.provinceName %><%= item.cityName %><%= item.districtName %></span><span class="mail-code"><%= item.zipcode %></span></p>
  </div>
</li>
<%})%>
