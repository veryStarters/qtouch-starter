<div id="room-preference-wrapper">
  <div class="tips-container">
    <span class="tips-content qt-font12 qt-red">酒店针对您的偏好尽量安排，但不能保证，请您谅解</span>
  </div>

  <!--单选要求-->
  <div class="specialRequireOpts">
    <% _.each(specialRequireOpts, function(item,index){ %>
      <div class="preference-container" data-id="<%= index%>">
        <div class="preference-title-wrapper qt-btb-x1">
          <div class="title-content qt-font12"><%= item.title%></div>
        </div>
        <div class="preference-content-wrapper">
          <ul class="preference-list">
            <%_.each(item.fields, function(obj, index){ %>
              <li>
                <div class="choose-wrapper">
                  <i class="icon <%= obj.checked == true ? 'checkmark' : ''%>"></i>
                </div>
                <div class="choose-content qt-font14 <%= index+1 == item.fields.length ? '' : 'qt-bb-x1' %> <%= obj.checked == true ? 'qt-color-header' : ''%>"><%= obj.key%></div>
              </li>
            <%})%>
          </ul>
        </div>
      </div>
    <%})%>
  </div>

  <!--房间要求-->
  <div class="room-preference-container">
    <% if (otherRequireOpts.length === 1) { %>
      <% if (otherRequireOpts[0] === '相近房间' && roomCount > 1) { %>
        <div class="preference-title-wrapper qt-btb-x1">
          <div class="title-content qt-font12">房间要求</div>
        </div>
        <div class="preference-content-wrapper">
          <ul class="preference-list-inline">
            <li>
              <span class="choose-content"><%= otherRequireOpts[0] %></span>
            </li>
          </ul>
        </div>
      <% }%>
    <% } else if (otherRequireOpts.length > 1) { %>
    <div class="preference-title-wrapper qt-btb-x1">
      <div class="title-content qt-font12">房间要求</div>
    </div>
    <div class="preference-content-wrapper">
      <ul class="preference-list-inline">
        <%_.each(otherRequireOpts, function(item){  %>
          <% if (item == '相近房间') { %>
            <% if (roomCount > 1) { %>
        <li>
          <span class="choose-content"><%= item%></span>
        </li>
            <% } %>
          <% }else { %>
        <li>
          <span class="choose-content"><%= item%></span>
        </li>
          <% } %>
        <%})%>
      </ul>
    </div>
    <%}%>
  </div>

  <!--其他要求-->
  <% if (needOtherRequire) {%>
  <div class="other-preference-container">
    <div class="preference-title-wrapper qt-btb-x1">
    </div>
    <div class="preference-content-wrapper">
      <div class="other-preference-header">
        <span class="title qt-font14">我还有其他要求</span>
        <span class="qt-switch" data-on="" data-off=""><span class="switch-handle"></span></span>
      </div>
      <div class="other-wrapper">
        <div class="other-textarea-wrapper">
          <textarea class="other-textarea" placeholder="<%= defaultOtherRequire %>" maxlength="<%= otherRequireMaxWords %>"></textarea>
          <span class="input-tips qt-font14">还可以输入<span class="rest-num"><%= otherRequireMaxWords %></span>个字</span>
        </div>
      </div>
    </div>
  </div>
  <% } %>
</div>
