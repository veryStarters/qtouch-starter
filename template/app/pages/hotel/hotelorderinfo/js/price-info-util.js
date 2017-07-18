/**
 * Created by lqq.li on 16/3/17.
 */

module.exports = (() => {
	let me = this;
	// 价格明细数据填充价格
	let detailData = (curData) => {
		let detailFees = $.extend(true, [], qt.firstData.detailFees),
			curPrice = curData.price.info,
			roomInfo = qt.firstData.roomInfo,
			getListData = (item) => {

				_.each(item.list, function (pre) {

					pre.name = pre.name.replace('{booknum}', curData.room.roomCount);

					switch (pre.text) {
						// 税费
						case 'taxation_fee':
							pre.price = curData.price.currencySign + '' + curPrice.taxation;
							break;

						// 房费 (totalPrice - 税费 + 立减 = 房费)
						case 'room_fee':
							pre.price = Math.round(parseFloat(curPrice.totalPrice) * 100);
							if (roomInfo.ptType == 1 || roomInfo.ptType == 3) {
								pre.price = pre.price + parseInt(parseFloat(curPrice.totalPrize) * 100);
							}

							if (curPrice.taxation) {
								pre.price = pre.price - curPrice.taxation * 100;
							}
							pre.price = curData.price.currencySign + '' + pre.price / 100;
							break;

						// 立减
						case 'ppb_cut':
							pre.price = curData.price.currencySign + '' + curPrice.totalPrize;
							break;

						// 快递费
						case 'invoice_fee':
							if (curData.price.expressFee == 0) {
								pre.isHide = true;
							} else {
								pre.price = curData.price.currencySign + '' + curData.price.expressFee;
							}
							break;

						// 友谊券
						case 'friend_coupons':
							if(!curData.price.hasCoupons || !curData.price.couponsActive) {
								pre.isHide = true;
							}else {
								pre.price = curData.price.currencySign + '' + curData.price.couponsPrice;
							}
							break;
					}
				});

			};

		_.each(detailFees, function (item) {

			switch (item.text) {

				// 在线付款
				case 'prepay':

					// 付款总金额减去友谊券金额,友谊券目前只支持在线付款
					var couponsPrice = curData.price.hasCoupons && curData.price.couponsActive ? parseInt( curData.price.couponsPrice ) : 0;

					item.price = curData.price.currencySign + '' + curData.price.prepay;
					item.list && item.list.length && getListData(item);
					break;

				// 总价
				case 'totalpay':
					item.price = curData.price.currencySign + '' + curData.price.info.totalPrice;
					item.list && item.list.length && getListData(item);
					break;

				// 到店支付
				case 'front_pay':
					item.price = curData.price.currencySign + '' + curData.price.info.totalPrice;
					item.list && item.list.length && getListData(item);
					break;

				// 离店可返现金
				case 'cashback':
					item.price = curData.price.currencySign + '' + curPrice.totalPrize;
					item.list && item.list.length && getListData(item);
					break;

				// 在线担保
				case 'guarantee_pay':
					if (curData.price.hasVouch) {
						item.price = curData.price.currencySign + '' + curPrice.totalVouchMoney;
						item.list && item.list.length && getListData(item);
					} else {
						item.isHide = true;
					}
					break;

				// 到店付余款
				case 'leavepay':
					item.price = curData.price.currencySign + '' + curPrice.overagePrice;
					item.list && item.list.length && getListData(item);
					break;

				// 定金
				case 'partypay':
					item.price = curData.price.currencySign + '' + curPrice.prepayAmount;
					item.list && item.list.length && getListData(item);
					break;
			}
		});

		return detailFees;
	};

	// 价格渲染
	let refreshPrice = (curData) => {
		var priceInfo = curData.price.info,
			$mainPrice = qt.$('.main-content'),
			$subPrice = qt.$('.sub-content'),
			couponsInfo = (() => {
				if(curData.price.hasCoupons && curData.price.couponsActive) {
					return {
						price: parseInt( curData.price.couponsPrice ) || 0,
						desc: '友谊券已减' + curData.price.currencySign + curData.price.couponsPrice
					}
				}
				return {price: 0, desc: ''};
			})(),
			discountDesc = (() => {
				if( !priceInfo.totalPrize ) {
					return couponsInfo ? '  ' + couponsInfo.desc : '' || '';
				}

				if(curData.price.ptTypeDesc) {
					return curData.price.ptTypeDesc
						.replace("{rprice}", priceInfo.totalPrize)
						.replace("{price}", +priceInfo.totalPrize + +priceInfo.totalPrice)
						.concat(couponsInfo ? '  ' + couponsInfo.desc : '')|| ""
				}

				return '';
			})(),

		// booking.com 部分报价不是中文,需要单独处理,提示一个人民币报价
			isBookingOta = qt.requestData.wrapperId == 'hta9008pb7i',
			referPrice = qt.firstData.roomInfo.referCurrencySign && curData.price.payTypeDesc + qt.firstData.roomInfo.referCurrencySign + priceInfo.referTotalPrice;

		switch (curData.price.payType) {
			// 预付
			case 0:
				// 预付定金
				if (priceInfo.prepayAmount != '') {
					$mainPrice.find('.type').text('定金');
					$mainPrice.find('.pay-price').text((parseInt(parseFloat(curData.price.info.prepayAmount) * 100) + curData.price.expressFee * 100) / 100);
					$subPrice.html('到店再付' + ' ' + curData.price.currencySign + priceInfo.overagePrice)
						.removeClass('qt-hide');

				} else {
					curData.price.prepay = (Math.round(parseFloat(curData.price.info.totalPrice) * 100) + curData.price.expressFee * 100 - couponsInfo.price * 100) / 100;
					$mainPrice.find('.type').text(curData.price.payTypeDesc);
					$mainPrice.find('.pay-price').text(curData.price.prepay);
					discountDesc ? $subPrice.html(discountDesc).removeClass('qt-hide') : $subPrice.html(discountDesc).addClass('qt-hide');

					qt.$('.submit-btn').html('在线支付');
					// 若无优惠,且 无税费,则 价格明细 不显示
					!discountDesc && priceInfo.taxation == 0 ? qt.$('.detail-btn').addClass('qt-hide') : qt.$('.detail-btn').removeClass('qt-hide');
				}
				break;

			// 现付
			case 1:
				// 担保
				if (curData.price.hasVouch) {
					$mainPrice.find('.type').text('在线担保');
					$mainPrice.find('.pay-price').text((parseInt(parseFloat(curData.price.info.totalVouchMoney) * 100) + curData.price.expressFee * 100) / 100);
					$subPrice.html(isBookingOta ? referPrice : curData.price.payTypeDesc + ' ' + curData.price.currencySign + priceInfo.totalPrice + ' ' + discountDesc)
						.removeClass('qt-hide');
					qt.$('.detail-btn').removeClass('qt-hide');
				} else {
					$mainPrice.find('.type').text(curData.price.payTypeDesc);
					$mainPrice.find('.pay-price').text((parseInt(parseFloat(curData.price.info.totalPrice) * 100) + curData.price.expressFee * 100) / 100);
					discountDesc ? $subPrice.html(discountDesc).removeClass('qt-hide') : $subPrice.addClass('qt-hide');

					// 若无 优惠 则 价格明细 不显示
					!discountDesc ? qt.$('.detail-btn').addClass('qt-hide') : qt.$('.detail-btn').removeClass('qt-hide');
				}
				break;

		}
	};

	// 是否担保判断  待整理
	let hasVouch = (curData, opt) => {
		var price = curData.price,
			roomInfo = qt.firstData.roomInfo,
			vouchRule = roomInfo.vouchRule;

		if (!roomInfo.vouchRule || price.info.totalVouchMoney == 0) {
			price.hasVouch = false;
			price.vouchBy.count = false;
			price.vouchBy.time = false;
			return false;
		}

		//1：固定；2：超时；3：超量；4：超时或者超量；5：超时且超量   vouchType====1
		for (var i = 0; i < vouchRule.length; i++) {
			if (vouchRule[i].vouchType == 1) {
				price.vouchType = vouchRule[i].vouchType;
				price.vouchRule = vouchRule[i].vouchRule;
				price.vouchBy.count = true;
			}

			if (opt.count) {
				if (vouchRule[i].vouchType == 3 || vouchRule[i].vouchType == 4 || vouchRule[i].vouchType == 5) {
					$.each(vouchRule[i].vouchBookNums, function (index, item) {
						if (opt.count === item) {
							price.vouchBy.count = true;
							return false;
						}
						price.vouchBy.count = false;
					});
					price.vouchType = vouchRule[i].vouchType;
					price.vouchRule = vouchRule[i].vouchRule;
				}
			}
			if (opt.time) {
				if (vouchRule[i].vouchType == 2 || vouchRule[i].vouchType == 4 || vouchRule[i].vouchType == 5) {
					$.each(vouchRule[i].vouchArriveTimes, function (index, item) {
						if (opt.time === item) {
							price.vouchBy.time = true;
							return false;
						}
						price.vouchBy.time = false;
					});
					price.vouchType = !price.vouchBy.count ? vouchRule[i].vouchType : price.vouchType;
					price.vouchRule = !price.vouchBy.count ? vouchRule[i].vouchRule : price.vouchRule;
				}
			}

			if (!curData.price.vouchBy.time && !curData.price.vouchBy.count) {
				curData.price.hasVouch = false
			} else {
				curData.price.hasVouch = true;
				break;
			}
		}
	};

	// 担保 dom 渲染 待整理
	let vouchDomChange = (curData) => {
		var priceInfo = curData.price.info,
			$timeVouch = qt.$('.guarantee.time'),
			$countVouch = qt.$('.guarantee.count');

		// 超量担保 优先级高(超量,或 超量且超时 ,都显示超量)
		if (curData.price.hasVouch && curData.price.vouchBy.count) {
			$timeVouch.addClass('qt-hide');
			$countVouch.removeClass('qt-hide').find('.fee').text(curData.price.currencySign + '' + priceInfo.totalVouchMoney);

			// 超时担保
		} else if (curData.price.hasVouch && curData.price.vouchBy.time) {
			$countVouch.addClass('qt-hide');
			$timeVouch.removeClass('qt-hide').find('.fee').text(curData.price.currencySign + '' + priceInfo.totalVouchMoney);

			// 没担保
		} else {
			$timeVouch.addClass('qt-hide');
			$countVouch.addClass('qt-hide');
		}
	};

	return {
		getDetailFeeData: detailData,
		refreshPrice: refreshPrice,
		hasVouch: hasVouch,
		vouchDomChange: vouchDomChange
	}
})();
