/**
 * Created by chengyu.wang on 16/03/10.
 */
import qt from 'qt';
import bodyTpl from './tpl/body.tpl';
import addressTpl  from './tpl/address-tpl.tpl';

module.exports = (()=> {

	//地址映射
	var addressMap = [];

	//获取省/市/区数据
	var getCitiesData = function (code, container) {
		// code 传的城市code,默认为1，container 是装数据的容器
		$.ajax({
			url: '/api/common/addresscode',
			data: {
				code: code
			},
			type: 'get',
			dataType: 'json',
			success: function (res) {
				if (res.ret && res.data) {
					var dataList = res.data.list;

					container.empty().append('<option value="">请选择</option>');
					_.each(dataList, function (item, index) {
						var $element = '<option value="' + item.code + '" name="' + item.name + '">' + item.name + '</option>';
						container.append($element);
					})

					//第三级
					if (container.closest('.add-item').next().find('select').length > 0) {
						container.closest('.add-item').next().find('select').empty().append('<option value="">请选择</option>');
					}
				} else {
					qt.alert(res.errmsg);
				}
			},
			error: function () {
				qt.alert({
					animate: 'slideDownIn',
					contentCenter: true,
					message: '请求失败！'
				})
			}
		})
	}

	//请求配送地址列表
	var requestAddressData = function (choosedData) {
		//choosedData 表示选中的地址
		$.ajax({
			url: qt.commonParam.host.userCenter+'/webapi/contact/address/query/',
			dataType: 'jsonp',
			data: {
				csrfToken: qt.util.cookie('csrfToken')
			},
			success: function (res) {
				if (res.ret && res.data) {
					var contactList = res.data.contactList;

					if (contactList.length > 0) {

						var addressList = transferData(contactList);
						_.each(addressList, function (obj, key) {
							obj.choosed = checkEqual(obj, choosedData);
						});

						//渲染模板addressTpl
						var $html = _.template(addressTpl, {data: addressList});
						//填充数据
						$('.address-list').empty().append($html);
					} else {
						$('.address-list').empty().append('<div class="no-data">没有常用地址数据</div>');
					}
				} else {
					qt.alert(res.errmsg);
				}
			},
			error: function () {
				qt.alert({
					animate: 'slideDownIn',
					contentCenter: true,
					message: '请求失败！'
				})
			}
		});
	}

	var transferData = function (dataList) {
		var data = [];
		_.each(dataList, function (item, index) {
			_.each(item.addresses, function (obj, i) {
				var buffer = {
					name: item.name,
					mobile: item.mobile,
					province: obj.province,
					city: obj.city,
					district: obj.district,
					provinceName: obj.provinceName,
					cityName: obj.cityName,
					districtName: obj.districtName,
					detail: obj.detail,
					zipcode: obj.zipcode
				}
				data.push(buffer);
			})
		})
		addressMap = data;

		return data;
	}

	//对比两个对象的每项值是不是相等
	var checkEqual = function (obj, item) {
		var flag = true;
		_.each(obj, function (value, key) {
			if (!item[key] || value !== item[key]) {
				flag = false;
				return;
			}
		})

		return flag;
	};

	//表单验证
	var validate = function (data) {
		if (!data.name) return qt.alert("联系人姓名不能为空");
		if (!data.mobile || !/^\d{11}$/.test(data.mobile)) return qt.alert("请输入11位手机号码");
		if (!data.province || !data.city || !data.district) return qt.alert("省市县必须选择");
		if (!data.detail || data.detail.length < 5 || data.detail.length > 50) return qt.alert("街道地址需输入5-50位字符");
		if (data.zipcode && !/^\d{1,10}$/.test(data.zipcode)) return qt.alert("邮政编码格式为1-10位数字");

		return true;
	};

	return qt.defineSubPage({
		config: {
			name: 'shippingaddress',
			forceRefresh: true,
			animate: 'slideUp',
			init: function () {

			},
			ready: function (requestData, subPage) {
				var data = qt.getTransferData();

				//请求省/市/区
				getCitiesData(1, $('#add-address-form .province-select'));

				if (qt.commonParam.isLogin) {
					//登陆用户
					requestAddressData(data);
					$('#address-wrapper').find('.add-btn-wrapper').show().end().find('.address-item-wrapper').hide();
				} else {
					//隐藏 添加按钮
					$('#address-wrapper').find('.add-btn-wrapper').hide().end().find('.address-item-wrapper').show();
				}
			},

			onBack: function () {
				$('select').blur();
			}
		},

		events: {
			'tap .add-address': 'showAddAddressPanel',
			'tap .submit-add': 'submitAddAddress',
			'tap .cancel-add': 'cancelAddAddress',
			'tap .choose-content': 'chooseAddress',
			'change .province-select': 'changeSelect',
			'change .city-select': 'changeSelect'
		},
		templates: {
			header: function () {
				return `<nav class="left icon previous"></nav><div class="title qt-bb-x1">配送地址</div>`;
			},
			body: function () {
				return bodyTpl;
			},
			footer: ''
		},

		handles: {
			showAddAddressPanel: function () {
				$('#address-wrapper').find('.address-item-wrapper').show();
				if (qt.commonParam.isLogin) {
					//登陆用户
					$('#address-wrapper').find('.submit-add').text('确认并保存地址');
				} else {
					$('#address-wrapper').find('.submit-add').text('确认');
				}
			},

			submitAddAddress: function (e, requestData, subPage) {

				//获取数据
				var formData = $('#add-address-form').serializeArray();
				var submitData = {};
				_.each(formData, function (obj) {
					submitData[obj.name] = obj.value;
				})

				//验证数据
				if (validate(submitData)) {

					if (qt.commonParam.isLogin) {
						//登陆用户
						var data = $.extend(submitData, {
							source: 'hotel',
							merge: 'true',
							csrfToken: qt.util.cookie('csrfToken')
						})
						//ajax请求
						$.ajax({
							url: qt.commonParam.host.userCenter+'/webapi/contact/address/saveWithContact',
							dataType: 'jsonp',
							data: submitData,
							type: 'get',
							success: function (res) {
								if (!res.ret) {
									qt.alert(res.errmsg);
								}
							},
							error: function () {
								qt.alert({
									animate: 'slideDownIn',
									contentCenter: true,
									message: '请求失败！'
								})
							}
						});
					}

					//拼接中文字段
					submitData.provinceName = $($('.province-select')[0][$('.province-select')[0].selectedIndex]).attr('name');
					submitData.cityName = $($('.city-select')[0][$('.city-select')[0].selectedIndex]).attr('name');
					submitData.districtName = $($('.district-select')[0][$('.district-select')[0].selectedIndex]).attr('name');

					//返回数据
					subPage.back(submitData);
				}
			},

			cancelAddAddress: function () {
				$('.address-item-wrapper').empty();
			},

			chooseAddress: function (e, requestData, subPage) {
				var $ele = $(e.currentTarget);
				var index = parseInt($ele.attr('data-id'), 10);

				var backData = addressMap[index];

				subPage.back(backData);

			},

			changeSelect: function (e) {
				//请求该省对应的城市列表
				var $target = $(e.currentTarget);
				var val = $target.val();
				if (val) {
					var $nextSelect = $target.closest('.add-item').next().find('select');
					getCitiesData(val, $nextSelect);
				} else {
					$target.closest('.add-item').next().find('select').empty().append('<option value="">请选择</option>');

					var $nextSelect = $target.closest('.add-item').next().find('select');
					if ($nextSelect.closest('.add-item').next().find('select').length > 0) {
						$nextSelect.closest('.add-item').next().find('select').empty().append('<option value="">请选择</option>');
					}
				}
			}
		}
	});
})();
