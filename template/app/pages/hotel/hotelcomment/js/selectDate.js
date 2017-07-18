//初始化日期选择下拉框
var utils = {
	addOption: (select, start, end) => {
		for (var j = start; j < end + 1; j++) {
			var value = (j < 10 ? "0" : "") + j;
			select.append('<option value="' + value + '">' + value + '</option>');
		}
	}
};
module.exports = {
	init: () => {
		var year = new Date().getFullYear(),
			month = new Date().getMonth() + 1,
			$year = $("select[name=year]"),
			$month = $("select[name=month]");
		utils.addOption($year, 2010, year);
		utils.addOption($month, 1, month);
		$year.on("change", function(){
			if ($(this).val() != year) {
				$month.html('');
				utils.addOption($month, 1, 12);
			} else {
				$month.html('');
				utils.addOption($month, 1, month);
			}
		});
		$year.val(year);
		$month.val(month < 10 ? "0" + month : month);
	}
};