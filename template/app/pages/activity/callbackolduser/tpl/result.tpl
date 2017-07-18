<!-- 结果页 成功&&失败 -->

<% if (status === 3){%>
  <!--抢完了-->
  <div class="no-gift-wrapper">
      <div class="result_redwp">
          <div class="red_bg">
              <img src="http://simg1.qunarzz.com/site/images/zhuanti/huodong/callbackolduser_20160324_outofservice.png" alt=""/>
          </div>
      </div>
      <div class="shareBtn">分享领礼包</div>
  </div>
<%} else {%>
  <div class="result">
      <div class="result_redwp">
          <div class="red_bg">
              <img src="http://simg1.qunarzz.com/site/images/zhuanti/huodong/callbackolduser_20160324_getresult.png" alt=""/>
          </div>
          <div class="top_tips">
              <%if (status === 0) { %>
                <p class="get-result">成功领取</p>
                <p class="get-detail"><span class="detail-gift">&yen; <%= coupons[0].couponMoney %></span><span class="detail-desc"><%= coupons[0].couponTitle %></span></p>
              <% } else if (status === 2) { %>
                <p class="get-result">已领取</p>
                <p class="get-detail"><span class="detail-gift">&yen; <%= coupons[0].couponMoney %></span><span class="detail-desc"><%= coupons[0].couponTitle %></span></p>
              <% } else { %>
                <p class="get-result-failed">不要太贪心哦</p>
                <p class="get-detail-failed">您账户里还有<span class="detail-gift">&yen; <%= amount %></span>会员红包</p>
              <% } %>
                <p class="get-qunar-account">您的去哪儿账户<span class="qunar-account"><%= safeMobile %></span></p>
                <p class="change-number">换手机号抢礼包 ></p>
          </div>
      </div>

      <div class="goToUseBtn">立即使用</div>
      <div class="inviteBtn"><%= shareMsg %></div>
  </div>
<%}%>
