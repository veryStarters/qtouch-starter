<div class="oc-typeselect">
	<div class="typeselectdes">
		<p class="title qt-bold">选择入住类型</p>
		<div class="qt-font12 qt-grey">
			正确填写本次出行的入住类型哦<br/>
			入住类型必填且单选
		</div>
	</div>
	<ul class="typelist qt-bt-x1 qt-font14">
		<% _.each(data,function(item){%>
		<li data-value="<%= item.value%>" data-desc="<%= item.desc%>" class="qt-bb-x1">
			<%= item.desc%>
		</li>
		<%})%>
	</ul>
</div>