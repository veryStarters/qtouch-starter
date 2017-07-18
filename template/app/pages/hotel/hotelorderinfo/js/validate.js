/**
 * Created by lqq.li on 16/3/20.
 */
module.exports = (() => {
	// errMsg 提示
	var showErrMsg = (msg, $input) => {

			qt.alert({
				noHeader: true,
				message: msg,
				onOk: function () {
					$input && $input.focus();
				}
			});

		},

	// 单个中文姓名校验
		singleNameValidate = (name, $dom, index) => {

			if (!name) {
				showErrMsg('请输入房间' + index + '的入住人姓名', $dom);
				return false;
			}

			if (name.indexOf("先生") !== -1 || name.indexOf("小姐") !== -1 || name.indexOf("女士") !== -1) {
				showErrMsg('房间' + index + '入住人信息不能包含先生、女士、小姐等字样', $dom);
				return false;
			}
			return true;
		},

	// 分离的英文姓名校验
		separateNameValidate = (firstName, $first, lastName, $last, index) => {
			if (!firstName) {
				showErrMsg('请输入房间' + index + '的入住人姓名', $first);
				return false;
			}

			if (!lastName) {
				showErrMsg('请输入房间' + index + '的入住人姓名', $last);
				return false;
			}

			if (/[\u4e00-\u9fff]+/.test(firstName)) {
				showErrMsg('入住人' + index + '的姓名必须为英文', $first);
				return false;
			}

			if (/[\u4e00-\u9fff]+/.test(lastName)) {
				showErrMsg('入住人' + index + '的姓名必须为英文', $last);
				return false;
			}

			return true;
		},

	// 手机号校验
		telephoneValidate = (phoneNum, $input) => {

			if (!/^\d{11}$/.test(phoneNum)) {
				showErrMsg('请填写正确的手机号码', $input);
				return false;
			}
			return true;
		},

	// 邮箱校验
		emailValidate = (email, $input) => {

			if (!/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test(email)) {
				showErrMsg('填写正确的电子邮箱地址', $input);
				return false;
			}
			return true;
		},

	// 发票抬头校验
		invoiceTitleValidate = (title, $input) => {
			if (!title || title.length <= 2 || title.length >= 21) {
				showErrMsg('填写正确的发票抬头', $input);
				return false;
			}
			return true;
		},

	// 发票配送地址校验
		invoiceAddrValidate = (value) => {
			if (!value || value.trim() == '请选择') {
				showErrMsg('请选择发票配送地址');
				return false;
			}
			return true;
		},

	//	身份证号校验
		idCardValidate = (value, $input) => {
			if (!/^(\d{18,18}|\d{15,15}|\d{17,17}[xX])$/.test(value)) {
				showErrMsg('请填写18位有效身份证号', $input);
				return false;
			}
			return true;
		},

	// 城市校验
		cityValidate = (value, $input) => {
			if (!value) {
				showErrMsg('请输入城市', $input);
				return false;
			}
			return true;
		},

	// 地址校验
		addressValidate = (value, $input) => {
			if (!value) {
				showErrMsg('请输入地址', $input);
				return false;
			}
			return true;
		},

	// 邮编校验
		zipCodeValidate = (value, $input) => {
			if (!value || !(/\d{1,10}/.test(value))) {
				showErrMsg('请输入1-10位邮政编码', $input);
				return false;
			}
			return true;
		};

	return {
		singleNameValidate: singleNameValidate,
		separateNameValidate: separateNameValidate,
		telephoneValidate: telephoneValidate,
		emailValidate: emailValidate,
		invoiceTitleValidate: invoiceTitleValidate,
		invoiceAddrValidate: invoiceAddrValidate,
		idCardValidate: idCardValidate,
		cityValidate: cityValidate,
		addressValidate: addressValidate,
		zipCodeValidate: zipCodeValidate
	}

})();
