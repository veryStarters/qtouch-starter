/**
 * Created by lqq.li on 16/3/10.
 */
import roomLineTpl from '../tpl/order-lines/room-line.tpl';
import timeLineTpl from '../tpl/order-lines/time-line.tpl';
import guestsLineTpl from '../tpl/order-lines/guests-line.tpl';
import phoneLineTpl from '../tpl/order-lines/phone-line.tpl';
import emailLineTpl from '../tpl/order-lines/email-line.tpl';
import cardLineTpl from '../tpl/order-lines/card-line.tpl';

import couponsLineTpl from '../tpl/order-lines/coupons-line.tpl';

import accommodationLineTpl from '../tpl/order-lines/accommodation-line.tpl';
import invoiceLineTpl from '../tpl/order-lines/invoice-line.tpl';

import countryLineTpl from '../tpl/order-lines/country-line.tpl';
import cityLineTpl from '../tpl/order-lines/city-line.tpl';
import addressLineTpl from '../tpl/order-lines/address-line.tpl';
import zcodeLineTpl from '../tpl/order-lines/zcode-line.tpl';

module.exports = (() => {
	return {
		// 房间数选择
		roomLine: (data) => {

			return _.template(roomLineTpl, {data: data});
		},

		// 最晚到达时间
		timeLine: (data) => {
			if(_.isEmpty( data.arriveTimes )) {
				return '';
			}
			data.arriveTimes = data.arriveTimes.times[data.arriveTimes.defaultKey];
			return _.template(timeLineTpl, {data: data});
		},

		// 入住人
		guestsLine: (data) => {

			return _.template(guestsLineTpl, {data: data});
		},

		// 手机号
		phoneLine: (data) => {

			return _.template(phoneLineTpl, {data: data});
		},

		// 电子邮箱
		emailLine: (data) => {
			if(!data) {
				return '';
			}
			return _.template(emailLineTpl, {data: data});
		},

		// 身份证号
		cardLine: function (data) {
			if(!data) {
				return '';
			}
			return _.template(cardLineTpl, {data:data});
		},

		// 卡券(友谊券)使用
		couponsLine: function (data) {
			return _.template(couponsLineTpl, {data: data});
		},

		// 住宿偏好
		accommodationLine: (data) => {
			return _.template(accommodationLineTpl, {data: data});
		},

		// 发票模块
		invoiceLine: (data) => {
			return _.template(invoiceLineTpl, {data:data});
		},

		// 国家
		countryLine: (data) => {
			if(!data) {
				return '';
			}
			return _.template(countryLineTpl, {data:data});
		},

		// 城市
		cityLine: (data) => {
			if(!data) {
				return '';
			}
			return _.template(cityLineTpl, {data: data});
		},

		// 地址
		addressLine: (data) => {
			if(!data) {
				return '';
			}
			return _.template(addressLineTpl, {data: data});
		},

		// 邮政编码
		zcodeLine: (data) => {
			if(!data) {
				return '';
			}
			return _.template(zcodeLineTpl, {data: data});
		}
	}
})();