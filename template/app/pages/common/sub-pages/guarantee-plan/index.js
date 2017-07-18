import qt from 'qt';

module.exports = (() => {
    return qt.defineSubPage({
        config: {
            name: 'guarantee',
            animate: 'popup'
        },
        templates: {
            header: `<nav class="icon previous left"></nav><div class="calendar-title">酒店服务保障计划</div>`,
            body: `<div class="qt-grid title">
						<div class="col4 left"><i class="icon q-bao"></i></div>
						<div class="col8 qt-pt10 title-content">
							<p class="qt-font16 small">到店有房,酒店预订有保障</p>
							<p class="qt-bold20 big">有问题,我赔你</p>
						</div>
					</div>
					<div class="content">
						<p class="rule">有房保障： 订单确认后去哪儿网保证消费者按照订单价格入住，如产生以下情况，承诺相应赔付：</p>
						<ul>
							<li>消费者到店前，酒店(供应商)告知无法安排入住或要求加价入住的，去哪儿网将退还全部预订费用（如有），并赔付消费者另行预订入住附近同等酒店房间的差价(不超过订单首晚房费的30%,钟点房产品不超过订单金额的30%)。</li>
							<li>如消费者到店无房且协调无果，去哪儿网赔付消费者另行预订入住附近同等酒店房间的差价， 但最高不超过订单首晚房费(钟点房产品不超过订单总金额)。</li>
							<li>请保留入住其他酒店的相关凭证(发票+水单)向去哪儿网提交赔付申请,在核对凭证无误后去哪儿网将赔付差价。</li>
							<li>如实描述保障：如因页面描述与实际情况不相符导致用户损失，用户提供有效凭证，去哪儿将要求供应商（酒店）承担相应损失。</li>
						</ul>
					</div>


					<p class="mark-tips">*注:如未及时联系去哪儿网而自行入住其他酒店,视为您放弃了保障计划权利。</p>`

        }
    })
})();