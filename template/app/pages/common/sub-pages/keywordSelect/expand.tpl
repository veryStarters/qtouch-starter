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
    <% var rows=Math.ceil(values.length/4);%>
    <div class="keywordlist qt-center qt-pa10">
      <% for(var i=0;i<rows;i++) {%>
        <div class="keywordline">
          <% var itemData=values.slice(i*4,(i+1)*4); %>
          <% for(var j=0;j<4;j++) {%>
            <% var valueItem=itemData[j]; %>
            <% if(valueItem) { %>
              <div class=" qt-bl-x1 qt-bb-x1 qt-pb10  keyworditem <%if(i==0){ %>qt-bt-x1 <%}%> <%if(j==3){ %>qt-br-x1 <%}%>" data-qname="<%=valueItem.qname%>">
                <%= valueItem.qname %>
              </div>
            <% }else{%>
              <% if((i==rows-1)&&(j==3)) { %>
                <div class=" qt-bl-x1 qt-bb-x1 qt-br-x1 qt-pb10 upanddown up" >
                   <span class="icon arrow-up"></span>
                </div>
              <% }else{ %>
                <div class=" qt-bl-x1 qt-bb-x1 qt-pb10 keyworditem <%if(j==3){ %>qt-br-x1 <%}%>"></div>
              <% } %>
            <% } %>
          <% } %>
        </div>
      <% } %>
    </div>
</div>
