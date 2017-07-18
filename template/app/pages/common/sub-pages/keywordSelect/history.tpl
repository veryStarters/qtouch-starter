<% var _localStoreDataLen = localStoreData.length; %>
<% if(_localStoreDataLen > 0) { %>
  <div class="box qt-bg-white qt-bb-x1 qt-mb10" data-type="history">
      <div class="title qt-grid qt-plr10 qt-bb-x1 qt-light-grey">
          <div class="col9">
              搜索历史
          </div>
          <div class="more col3 qt-right js-keyword-remove">
              <i class="icon remove qt-font12"></i>
              清空
          </div>
      </div>

      <div class="list qt-center qt-pa10">

          <% var rows = Math.ceil(_localStoreDataLen / 3); %>
          <% var count = rows * 3; %>
          <% var index = 0; %>

          <% for(var i = 0; i < rows; i++) { %>

              <div class="qt-grid <%if(rows > 1){%>qt-bb-x1<%}%> ">

              <% for(var j = 0; j < 3; j++) { %>

                  <% if( j === 0 ) {%>
                      <div class="col4 <%if(i===rows-1){%>qt-pt10<%}else{%>qt-pb10<%}%>" data-qname="<%=localStoreData[index].qname%>" data-dname="<%=localStoreData[index].dname%>"><%=subStr(localStoreData[index].dname,12*2)%></div>
                  <% } else{ %>
                      <%if(localStoreData[index]){%>
                          <div class="col4 qt-bl-x1 <%if(i===rows-1){%>qt-pt10<%}else{%>qt-pb10<%}%>" data-qname="<%=localStoreData[index].qname%>" data-dname="<%=localStoreData[index].dname%>"><%=subStr(localStoreData[index].dname,12*2)%></div>
                      <%}else{%>
                          <div class="col4 <%if(i===rows-1){%>qt-pt10<%}else{%>qt-pb10<%}%>">&nbsp;</div>
                      <%}%>
                  <% } %>

                  <% ++index; %>

              <% }; %>

              </div>

          <% } %>

      </div>
  </div>
  <% } %>
