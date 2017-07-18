/**
 * Created by lqq.li on 16/3/18.
 */
module.exports = {
	"priceInfos": [{
		"overagePrice": "",
		"insuranceAmount": "",
		"prepayAmount": "",
		"totalPrice": "662.5",
		"bookNum": 1,
		"totalPrize": "",
		"totalVouchMoney": "",
		"referTotalPrice": ""
	}],
	"changeTips": "请按照选择的人数入住酒店，否则酒店会收取额外的加床费。",
	"doubleTotalPrice": 662.5,
	"discountInfo": {
		"preferTitle": "",
		"discountRules": [],
		"ptTypeDescs": [],
		"discounts": [{
			"preferText": "税费",
			"preferWay": "taxation",
			"displayType": "none",
			"options": [{
				"preferId": "taxation",
				"roomNumMappings": [{
					"roomNum": 1,
					"summaryPrice": "{\"redMemberSummaryText\":\"\"}",
					"maxMoney": 2147483647,
					"price": "66.25",
					"percent": "1"
				}],
				"summaryText": "",
				"detailFeeText": "税费已包含在房费中",
				"detailFeeName": "taxation",
				"decimal": 0,
				"calculateMode": "FIXED",
				"renderSignal": 0,
				"benefitConditions": [],
				"select": true,
				"priority": 0
			}],
			"select": true,
			"name": "TaxationDiscount"
		}]
	},
	"detailFees": [{"text": "费用详情", "tips": "{bookNum}间*1晚", "name": "costDetail"}, {
		"text": "在线付款",
		"name": "roomPrice"
	}, {"text": "税费", "name": "taxation"}],
	"insurance": false,
	"taxation": 66.25,
	"login": false,
	"breakfast": "无早",
	"totalPrice": "662.5",
	"insurancePrice": "",
	"ptType": 0,
	"cancellation": "订单确认后不可取消或变更。如未入住，扣除全部费用。如订单无法确认，房费全额退还。",
	"extraParam": "{\"promotionId\":null,\"roomCuts\":\"0|0.0|0.0|0.0|0.0\",\"isI18n\":true,\"starTicketBack\":0.0,\"freeRefund\":\"\",\"global\":1,\"protoPrice\":662.5,\"paySubtractPrice\":0,\"redPacketParam\":null,\"uniqToKen\":\"973a1c8d6b4d49389a53d71db1e5d896\",\"citySimpleTimeZone\":null}",
	"msg": "成功",
	"flag": true,
	"status": 0
};