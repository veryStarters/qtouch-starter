<div class="od-detailpop">
    <ul>
        <% _.each(data.detailFees, function(item){ %>
        <li class="detailitem"> 
            <p class="qt-font14 qt-black clearfix qt-pb5">
                <span class="qt-fl"><%=item.text%></span>
                <span class="qt-fr qt-orange"><%=item.price%></span>
            </p>
            
            <% if(item.detailFees&&item.detailFees.length>0) {%>
                <% _.each(item.detailFees,function(detailItem,index){%>
                <div class="qt-font12 qt-grey qt-pb5 pricedetail">
                    <div><%=detailItem.text%></div>
                    <% if(detailItem.price!='')%>
                    <div class="dashedline"></div>
                    <div><%=detailItem.price%></div>
                </div>
                <% })%>                
            <%}%>           
        </li>     
        <% }) %>
    </ul>
    <% if(data.rule&&data.rule!='')%>
    <div class="ruletip">
        <p class="qt-font14 qt-black qt-pb5">规则说明</p>
        <p class="qt-font12 qt-grey">
            <%=data.rule%>
        </p>
    </div>
</div>