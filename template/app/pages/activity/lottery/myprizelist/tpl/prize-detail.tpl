<div class="prize-result qt-border-x1 r5 qt-pa10">
    <div class="prize-content">
        <%if (!data.isMaterial){%>
        <p class="prize-name"><%= data.name%></p>
        <p class="prize-count"><%= data.awardMoney%>元</p>
        <%}else{%>
        <p class="prize-title-only"><%= data.name%></p>
        <%}%>
        <% if (data.imageUrl) {%>
        <div class="prize-img-content">
            <img class="prize-img" src="<%= data.imageUrl %>"/>
        </div>
        <%}%>
        <span class="prize-desc"><%= data.desc %></span>
    </div>

    <div class="btns">
        <%if (!data.isMaterial){%>
        <div class="positive-btn use-now">立即使用</div>
        <div class="negetive-btn close-popup">再看看</div>
        <%}else{%>
        <div class="negetive-btn close-popup">好的</div>
        <%}%>
    </div>
</div>
