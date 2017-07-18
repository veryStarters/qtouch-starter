<div class="prize-result qt-border-x1 r5 qt-pa10">
    <% if(errcode === 0) { %>
        <!--中奖-->
        <div class="title">
                <span class="prize-title award">
                    <span>领</span>
                    <span>取</span>
                    <span>成</span>
                    <span>功</span>
                </span>
                <span class="prize-title prize">
                    <span>中</span>
                    <span>奖</span>
                    <span>啦</span>
                </span>
        </div>
        <div class="tickets">
            <div class="prize-wrapper">
                <div class="prize-content">
                    <div class="content-wrapper">
                        <p class="prize-sign" style="display: none;"><%= data.awardRecords[0].sign %></p>
                        <%if ( !data.awardRecords[0].isMaterial ) {%>
                        <p class="prize-name"><%= data.awardRecords[0].awardTitle %></p>
                        <p class="prize-count"><%= data.awardRecords[0].awardMoney %>元</p>
                        <%}else{%>
                        <p class="prize-title-only"><%= data.awardRecords[0].awardTitle %></p>
                        <%}%>
                    </div>
                </div>
            </div>

            <!--这一块详细字段待确认-->
            <% if (data.awardRecords[0].imageUrl ) {%>
            <div class="prize-img-content">
                <img class="prize-img" src="<%= data.awardRecords[0].imageUrl %>"/>
            </div>
            <%}%>

            <div class="prize-desc"><%= data.awardRecords[0].desc %></div>

            <div class="prize-desc get-prize-result">已放入你的去哪儿网账户<div class="quanr-account"></div></div>
        </div>
        <div class="user">

            <div class="register_body">
                <div class="phone">
                    <input type="tel" placeholder="输入您的手机号" maxlength="11" id="mobile"/>
                </div>
                <div style="display:none;padding-top: 7px;height: 44px;" id="captcha-area">
                    <input type="text" style="width:65px;float:left;margin-right:5px;height:30px;" id="captcha_input">
                    <img width="105" height="30" style="cursor:pointer" src="" id="captcha" class="captcha f_r" alt="">
                </div>
                <div class="vcode">
                    <div class="vcode_input">
                        <input type="tel" placeholder="短信验证码" maxlength="6" id="smscode"/>
                    </div>
                    <div class="vcode_get">获取验证码</div>
                </div>
                <!-- <div class="getBtn" data-text="领取礼包">领取礼包</div> -->
            </div>
        </div>
        <div class="btns">
            <div class="positive-btn get-prize-now">立即领取</div>
            <div class="negetive-btn close-popup giveUpAward">不想要，再摇一次</div>
            <div class="positive-btn close-popup award">再摇一次</div>
            <div class="negetive-btn goto-myprizelist award">查看我的奖品</div>
        </div>
    <%} else if(errcode === 3)  {%>

        <!--没中奖-->
        <div class="tickets">
            <div class="no-prize-desc"><%= msg %></div>
        </div>

        <div class="btns">
            <div class="positive-btn close-popup">再摇一次</div>
        </div>
    <%} else if(errcode === 10)  {%>

        <%if (data.hasShared) { %>
            <!--分享过-->
            <div class="tickets">
                <div class="prize-desc">今日摇奖机会已用完~</div>
            </div>

            <div class="btns">
                <div class="positive-btn  goto-main-activity">去主会场看看</div>
                <div class="negetive-btn close-popup">明日再战</div>
            </div>
        <% } else { %>
            <!--没有分享过-->
            <div class="tickets">
                <div class="prize-desc">今日摇奖机会已用完~</div>
                <div class="prize-desc">分享给好友，还可以再赢3次摇奖机会，大奖在等你哦~</div>
            </div>

            <div class="btns">
                <div class="positive-btn  share-btn">立即分享</div>
                <div class="negetive-btn close-popup">明日再战</div>
            </div>
        <% } %>

    <%} else {%>
        <div class="tickets">
            <div class="prize-desc">今日摇奖机会已用完~现在去主会场，特价爆款酒店、度假、机票、门票等你来疯抢！</div>
        </div>

        <div class="btns">
            <div class="positive-btn  goto-main-activity">去主会场看看</div>
            <div class="negetive-btn close-popup">明日再战</div>
        </div>
    <% } %>
</div>
