<% var type=isHistory?"history":data.type %>
<% var values=isHistory?data:data.values %>

<div class="box qt-bg-white qt-bb-x1 qt-mb10" data-type="<%= type %>">
    <% if(!isHistory) {%>
    <div class="title qt-plr10">
        <div class="col9 qt-font14">
            <% var iconName=type=="brandhotel"?"q-near-hotel":type;%>
            <i class="titleicon icon qt-red <%= iconName %>"></i>
            <%= data.title %>
        </div>
    </div>
    <% }else {%>
      <% if(values.length>0){ %>
        <div class="title qt-grid qt-plr10">
            <div class="col9 qt-font14">
              <i class="titleicon icon q-browse-history qt-red"></i>
              搜索历史
            </div>
            <div class="more col3 qt-right js-keyword-remove qt-font14">
                <i class="icon remove"></i>
                清空
            </div>
        </div>
      <% } %>
    <% } %>
    <% if(values.length>0){%>
      <% var isOver=values.length>8?true:false;%>
      <div class="keywordlist qt-center qt-pa10">
        <% var lineData=values.slice(0,4) %>
        <div class="keywordline">
          <% for(var i=0;i<4;i++) {%>
             <% var lineItem=lineData[i] %>
              <% if(lineItem) { %>
                <div class=" qt-bl-x1 qt-bb-x1 qt-pb10  keyworditem <%if(i==3){ %>qt-br-x1 <%}%> qt-bt-x1" data-qname="<%=lineItem.qname%>"><%= lineItem.qname %></div>
              <% }else{%>
                <div class=" qt-bl-x1 qt-bb-x1 qt-pb10  keyworditem <%if(i==3){ %>qt-br-x1 <%}%> qt-bt-x1"></div>
              <% } %>
          <% } %>
        </div>
        <% lineData=isOver?values.slice(4,7):values.slice(4,8); %>
        <% if(lineData[0]) { %>
          <div class="keywordline">
            <% for(var i=0;i<4;i++) {%>
                <% var lineItem=lineData[i] %>
                <% if(lineItem) { %>
                  <div class=" qt-bl-x1 qt-bb-x1 qt-pb10  keyworditem <%if(i==3){ %>qt-br-x1 <%}%>" data-qname="<%=lineItem.qname%>">
                    <%= lineItem.qname %>
                  </div>
                <% }else{%>
                  <% if(isOver&&i==3){ %>
                  <div class=" qt-bl-x1 qt-bb-x1 qt-br-x1 qt-pb10 upanddown down" >
                     <span class="icon arrow-down"></span>
                  </div>
                  <% } else{%>
                  <div class=" qt-bl-x1 qt-bb-x1 qt-pb10 keyworditem <%if(i==3){ %>qt-br-x1 <%}%>"></div>
                  <% } %>
                <% } %>
            <% }%>
          </div>
        <% } %>
      </div>
    <%}%>

</div>
